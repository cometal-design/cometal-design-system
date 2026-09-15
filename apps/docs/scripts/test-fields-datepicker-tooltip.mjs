#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { readFieldMap, readCatalogProjection } from './validate-component-page-content.mjs';

const require = createRequire(new URL('../../storybook/package.json', import.meta.url));
const { chromium } = require('playwright');
const axeRequire = createRequire(require.resolve('@storybook/addon-a11y/package.json'));
const axePath = axeRequire.resolve('axe-core/axe.min.js');
const ts = createRequire(new URL('../package.json', import.meta.url))('typescript');
const args = process.argv.slice(2);
const base = args[args.indexOf('--base-url') + 1];
if (!args.includes('--base-url') || !/^https?:\/\//.test(base ?? '')) throw Error('Pass --base-url <candidate-origin>');
const fields = readFieldMap(await readFile(new URL('../lib/field-documentation.ts', import.meta.url), 'utf8'));
const registry = JSON.parse(await readFile(new URL('../../../registry/components.json', import.meta.url), 'utf8')).components;
const routes = [
  ...Object.entries(fields).map(([kind, doc]) => ({ kind, ...doc })),
  { kind: 'date-picker', route: '/components/date-picker/', title: 'Date Picker', stableId: 'input.date-picker' },
  { kind: 'tooltip', route: '/components/tooltip/', title: 'Tooltip', stableId: 'overlay.tooltip' },
];
const families = JSON.parse(await readFile(new URL('../../../registry/component-families.json', import.meta.url), 'utf8')).families;
const contract = JSON.parse(await readFile(new URL('../lib/component-page-content-contract.json', import.meta.url), 'utf8'));
const catalog = readCatalogProjection(await readFile(new URL('../lib/registry.ts', import.meta.url), 'utf8'), families, registry, fields);
const checkCatalog = args.includes('--catalog') || !args.includes('--kinds');
const browser = await chromium.launch({ headless: true });
const selectedKinds = args.includes('--kinds') ? args[args.indexOf('--kinds') + 1].split(',') : null;
if (selectedKinds?.some((kind) => !routes.some((route) => route.kind === kind))) throw Error('Unknown --kinds');
const failures = [];
const evidence = [];
async function until(check, message) {
  let last;
  for (let i = 0; i < 60; i++) {
    try { if (await check()) return; } catch (error) { last = error; }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw Error(message + (last ? ': ' + last.message : ''));
}
async function noOverlays(page) {
  await until(async () => await page.locator('[role=dialog]:visible, [role=listbox]:visible, [role=tooltip]:visible').count() === 0, 'No residual overlay');
}
async function geometry(page) {
  const result = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const previews = [...document.querySelectorAll('.component-standard-presentation, .component-standard-settings__preview')].filter((node) => node.getClientRects().length);
    return {
      width, scroll: document.documentElement.scrollWidth,
      previews: previews.map((node) => {
        const box = node.getBoundingClientRect();
        const child = node.querySelector('.field-doc-control') ?? node.querySelector('.cometal-tooltip');
        const rect = child?.getBoundingClientRect();
        const style = getComputedStyle(node);
        const available = node.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const field = child?.matches('[data-field-kind], [data-date-kind]') ? child.querySelector('.cometal-field') : null;
        return { width: box.width, left: box.left, right: box.right, centerDelta: rect ? Math.abs(rect.left + rect.width / 2 - box.left - box.width / 2) : 0,
          fieldWidth: field?.getBoundingClientRect().width, expectedFieldWidth: Math.min(400, available) };
      }),
    };
  });
  assert.ok(result.scroll <= result.width + 1, JSON.stringify(result));
  for (const preview of result.previews) {
    assert.ok(preview.left >= -1 && preview.right <= result.width + 1, JSON.stringify(preview));
    assert.ok(preview.centerDelta <= 1, 'Centered preview ' + JSON.stringify(preview));
    if (preview.fieldWidth !== undefined) assert.ok(Math.abs(preview.fieldWidth - preview.expectedFieldWidth) < 1, 'Scoped 400px actual field width ' + JSON.stringify(preview));
  }
  return result;
}
async function contained(page, role, trigger) {
  const panel = page.getByRole(role).first();
  await panel.waitFor();
  await until(async () => {
    const box = await panel.boundingBox();
    return box && box.x >= 7.5 && box.x + box.width <= page.viewportSize().width - 7.5;
  }, role + ' within viewport');
  assert.equal(await panel.evaluate((node) => Boolean(node.closest('main'))), false, 'Shared body portal');
  if (trigger) {
    const anchorWidth = await trigger.evaluate((node) => node.closest('.cometal-field__trigger-stack').getBoundingClientRect().width);
    const rect = await panel.boundingBox();
    assert.ok(Math.abs(rect.width - anchorWidth) < 1, 'Full control anchor width');
  }
}
async function previewTopOffset(page) {
  const measure = () => page.evaluate(() => {
    const panel = document.querySelector('.component-standard-tabs__panel:not([hidden])');
    const demo = panel.querySelector('.component-standard-presentation, .component-standard-settings__preview');
    const divider = document.querySelector('.component-title__toolbar').getBoundingClientRect();
    const rect = demo.getBoundingClientRect();
    return { offset: rect.top - divider.bottom, documentTop: rect.top + scrollY,
      dividerDocumentBottom: divider.bottom + scrollY, scrollY };
  });
  const initial = await measure();
  const expected = await page.locator('.component-standard-tabs__panel:not([hidden]) > .content-section').first()
    .evaluate((node) => parseFloat(getComputedStyle(node).paddingTop));
  assert.ok(Math.abs(initial.offset - expected) < 1, 'Overview section spacing');
  for (const mode of ['click', 'keyboard']) {
    for (const name of ['Настройки', 'Обзор']) {
      const tab = page.getByRole('tab', { name, exact: true });
      if (mode === 'click') await tab.click();
      else { await tab.focus(); await tab.press('Enter'); }
      await until(async () => await tab.getAttribute('aria-selected') === 'true', 'Selected section');
      const next = await measure();
      assert.ok(Math.abs(next.offset - initial.offset) < 1, mode + ' divider-to-demo offset ' + JSON.stringify(next));
      assert.ok(Math.abs(next.documentTop - initial.documentTop) < 1, mode + ' stable document demo top');
      assert.ok(Math.abs(next.dividerDocumentBottom - initial.dividerDocumentBottom) < 1, 'Stable header divider');
      assert.equal(next.scrollY, initial.scrollY, 'No scroll workaround or focus autoscroll');
      await geometry(page);
    }
  }
  return initial.offset;
}
async function choose(page, label, option) {
  await page.getByRole('combobox', { name: label, exact: true }).click();
  const list = page.getByRole('listbox', { name: label + ': варианты', exact: true });
  await list.getByRole('option', { name: option, exact: true }).click();
}
async function resetDateSettings(page) {
  const reset = page.getByRole('button', { name: 'Сбросить', exact: true });
  await reset.click();
  const preview = page.locator('.component-standard-settings__preview');
  const input = preview.getByRole('textbox', { name: 'Дата поставки', exact: true });
  assert.equal(await input.inputValue(), '18.09.2026');
  assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
  assert.deepEqual(await input.evaluate((node) => ({ valid: node.validity.valid, message: node.validationMessage })), { valid: true, message: '' });
  assert.equal(await preview.locator('[data-date-kind="date"] .cometal-field[data-size="l"]').count(), 1);
  await noOverlays(page);
  assert.equal(await reset.evaluate((node) => document.activeElement === node), true, 'Reset retains focus');
  await preview.getByRole('button', { name: 'Показать код', exact: true }).click();
  const code = await page.locator('.component-standard-settings__code pre').innerText();
  assert.ok(code.includes('useState<string | null>("2026-09-18")'));
  assert.ok(code.includes('<DatePicker') && !code.includes('DateRangePicker'));
  await preview.getByRole('button', { name: 'Скрыть код', exact: true }).click();
}
async function listboxLifecycle(page, kind) {
  const originalViewport = page.viewportSize();
  // A shorter viewport makes the real demo reachable at its bottom edge even
  // on desktop, where its document position is above the 1000px viewport end.
  await page.setViewportSize({ ...originalViewport, height: 640 });
  const preview = page.locator('.component-standard-presentation');
  const trigger = preview.getByRole('combobox');
  await trigger.evaluate((node) => node.closest('.cometal-field__trigger-stack').scrollIntoView({ block: 'end' }));
  if (kind === 'combobox') await trigger.fill('М');
  else { await trigger.focus(); await trigger.press('ArrowDown'); }
  await contained(page, 'listbox', trigger);
  const panel = page.getByRole('listbox');
  await until(async () => await panel.getAttribute('data-placement') === 'top-start', 'Bottom edge flips');
  async function follows() {
    await until(async () => {
      const anchor = await trigger.evaluate((node) => node.closest('.cometal-field__trigger-stack').getBoundingClientRect().toJSON());
      const surface = await panel.boundingBox();
      if (!surface) return false;
      const placement = await panel.getAttribute('data-placement');
      return Math.abs(surface.width - anchor.width) < 1
        && (placement === 'top-start' ? Math.abs(surface.y + surface.height + 6 - anchor.top) < 1 : Math.abs(surface.y - 6 - anchor.bottom) < 1);
    }, 'Overlay follows full anchor');
  }
  await follows();
  // Scroll farther down so the bottom-edge anchor moves into, not out of, view.
  await page.mouse.wheel(0, 64);
  await follows();
  const viewport = page.viewportSize();
  await page.setViewportSize({ width: viewport.width + 16, height: viewport.height });
  await contained(page, 'listbox', trigger);
  await follows();
  await page.setViewportSize(viewport);
  await contained(page, 'listbox', trigger);
  await follows();
  await trigger.press('Escape');
  await noOverlays(page);
  assert.equal(await trigger.evaluate((node) => node === document.activeElement), true);
  // Open, then remove the documentation panel: shared resources must stop observing
  // detached surfaces rather than merely hiding the popup.
  if (kind === 'combobox') await trigger.fill('НЛ');
  else await trigger.press('ArrowDown');
  await contained(page, 'listbox', trigger);
  await page.getByRole('tab', { name: 'Настройки', exact: true }).click();
  await noOverlays(page);
  await until(async () => await page.evaluate(() => [...window.__observations.values()].every((targets) => [...targets].every((target) => target.getAttribute('role') !== 'listbox'))), 'Overlay observer cleanup');
  await page.getByRole('tab', { name: 'Обзор', exact: true }).click();
  await page.setViewportSize(originalViewport);
}
async function copyChecks(page, panel) {
  const blocks = panel.locator('.docs-code-block');
  assert.ok(await blocks.count() > 0);
  const block = blocks.first();
  const pre = block.locator('pre');
  assert.equal(await pre.getAttribute('tabindex'), '0');
  assert.ok(await pre.getAttribute('aria-label') || await pre.getAttribute('aria-labelledby'));
  await pre.focus();
  await page.keyboard.press('ArrowRight');
  assert.ok(await pre.evaluate((node) => node.matches(':focus-visible')));
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text) => { window.__copied = text; } } }));
  await block.getByRole('button').click();
  await until(async () => (await block.innerText()).includes('Скопировано'), 'Copy success feedback');
  assert.equal(await page.evaluate(() => window.__copied), await pre.innerText());
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw Error('Denied'); } } }));
  await block.getByRole('button').click();
  await until(async () => (await block.innerText()).includes('Повторить'), 'Copy failure feedback');
}
async function componentInteraction(page, route) {
  const preview = page.locator('.component-standard-presentation');
  if (route.kind === 'text-field' || route.kind === 'text-area') {
    const input = preview.getByRole('textbox');
    await input.fill('Новое значение');
    assert.equal(await input.inputValue(), 'Новое значение');
    if (route.kind === 'text-area') assert.match(await preview.innerText(), /14\s*\/\s*200/);
    await input.fill('');
    assert.equal(await input.inputValue(), '');
  } else if (route.kind === 'select') {
    const trigger = preview.getByRole('combobox');
    await trigger.focus();
    await trigger.press('ArrowDown');
    await contained(page, 'listbox', trigger);
    await page.getByRole('option', { name: 'Согласован', exact: true }).click();
    assert.match(await trigger.innerText(), /Согласован/);
    await trigger.click();
    await page.getByRole('tab', { name: 'Настройки', exact: true }).click();
    await noOverlays(page);
    await page.getByRole('tab', { name: 'Обзор', exact: true }).click();
  } else if (route.kind === 'combobox') {
    const input = preview.getByRole('combobox');
    await input.focus();
    await noOverlays(page);
    await input.fill('НЛ');
    await contained(page, 'listbox', input);
    await page.getByRole('option', { name: 'НЛМК', exact: true }).click();
    assert.equal(await input.inputValue(), 'НЛМК');
    await preview.getByRole('button', { name: /Очистить/ }).click();
    assert.equal(await input.inputValue(), '');
    await input.fill('Нет совпадений');
    await noOverlays(page);
  } else if (route.kind === 'multi-select') {
    await preview.getByRole('combobox').focus();
    await preview.getByRole('combobox').press('ArrowDown');
    await contained(page, 'listbox', preview.getByRole('combobox'));
    await page.getByRole('option', { name: 'ММК', exact: true }).click();
    await page.keyboard.press('Escape');
    const remove = preview.getByRole('button', { name: /^Удалить / }).first();
    const removeName = await remove.getAttribute('aria-label');
    await remove.click();
    assert.equal(await preview.getByRole('button', { name: removeName, exact: true }).count(), 0);
  } else if (route.kind === 'date-picker') {
    const input = preview.getByRole('textbox');
    await input.fill('31.02.2026');
    await input.press('Tab');
    assert.equal(await input.getAttribute('aria-invalid'), 'true');
    await input.fill('20.09.2026');
    await input.press('Tab');
    assert.notEqual(await input.getAttribute('aria-invalid'), 'true');
    await preview.getByRole('button', { name: 'Открыть календарь', exact: true }).click();
    await contained(page, 'dialog');
    await page.getByRole('dialog').getByRole('button', { name: /21 сентября 2026/ }).click();
    assert.equal(await input.inputValue(), '21.09.2026');
    await preview.getByRole('button', { name: 'Открыть календарь', exact: true }).click();
    // Use the real keyboard path while the open calendar may cover a tab at 320px.
    const settingsTab = page.getByRole('tab', { name: 'Настройки', exact: true });
    await settingsTab.focus();
    await settingsTab.press('Enter');
    await noOverlays(page);
    const settingsInput = page.locator('.component-standard-settings__preview').getByRole('textbox');
    assert.equal(await settingsInput.inputValue(), '18.09.2026');
    await settingsInput.fill('31.02.2026');
    await settingsInput.press('Tab');
    await until(async () => await settingsInput.getAttribute('aria-invalid') === 'true', 'Invalid initial-date draft');
    await resetDateSettings(page);
    await resetDateSettings(page);
    await settingsInput.fill('22.09.2026');
    await settingsInput.press('Tab');
    assert.equal(await settingsInput.inputValue(), '22.09.2026');
    assert.notEqual(await settingsInput.getAttribute('aria-invalid'), 'true');
    await page.locator('.component-standard-settings__preview').getByRole('button', { name: 'Открыть календарь', exact: true }).click();
    await contained(page, 'dialog');
    await resetDateSettings(page);
    await choose(page, 'Вид даты', 'Период');
    await geometry(page);
    const rangePreview = page.locator('.component-standard-settings__preview');
    await rangePreview.getByRole('button', { name: 'Открыть календарь периода' }).click();
    await contained(page, 'dialog');
    await page.getByRole('dialog').getByRole('button', { name: /20 сентября 2026/ }).click();
    await page.getByRole('dialog').getByRole('button', { name: /24 сентября 2026/ }).click();
    assert.match(await rangePreview.getByRole('textbox').inputValue(), /20\.09\.2026.*24\.09\.2026/);
    await rangePreview.getByRole('textbox').fill('31.02.2026 — 24.09.2026');
    await rangePreview.getByRole('textbox').press('Tab');
    await until(async () => await rangePreview.getByRole('textbox').getAttribute('aria-invalid') === 'true', 'Invalid range parsing');
    await resetDateSettings(page);
    await resetDateSettings(page);
    await page.getByRole('tab', { name: 'Обзор', exact: true }).click();
  } else {
    const button = preview.getByRole('button', { name: 'Сохранить', exact: true });
    await button.hover();
    await contained(page, 'tooltip');
    assert.match(await page.getByRole('tooltip').innerText(), /Сохранить изменения/);
    await button.focus();
    await page.mouse.move(0, 0);
    assert.equal(await page.getByRole('tooltip').count(), 1, 'Focus survives mouse leave');
    await button.press('Escape');
    await noOverlays(page);
    await page.getByRole('tab', { name: 'Настройки', exact: true }).click();
    const settings = page.locator('.component-standard-settings');
    assert.match(await settings.locator('[data-property="placement"] .component-standard-settings__property-copy').innerText(), /Default: top-start/);
    assert.match(await settings.locator('.component-standard-settings__note').innerText(), /API defaults: compact \/ top-start/);
    assert.match(await settings.locator('.component-standard-settings__note').innerText(), /примере явно выбран top-center/);
    await choose(page, 'Положение', 'Bottom End');
    await settings.getByRole('button', { name: 'Сбросить', exact: true }).click();
    assert.match(await settings.getByRole('combobox', { name: 'Положение', exact: true }).innerText(), /Top Center/);
    await settings.getByRole('button', { name: 'Показать код', exact: true }).click();
    assert.ok((await settings.locator('pre').innerText()).includes('placement="top-center"'));
    await settings.getByRole('button', { name: 'Скрыть код', exact: true }).click();
    const resetTrigger = settings.locator('.component-standard-settings__preview').getByRole('button', { name: 'Сохранить', exact: true });
    await resetTrigger.evaluate((node) => node.scrollIntoView({ block: 'center' }));
    await resetTrigger.hover();
    await contained(page, 'tooltip');
    assert.equal(await page.getByRole('tooltip').getAttribute('data-placement'), 'top-center');
    await resetTrigger.press('Escape');
    await noOverlays(page);
    await choose(page, 'Размер', 'Wide');
    const text = 'Длинное пояснение '.repeat(12);
    await page.getByRole('textbox', { name: 'Текст подсказки', exact: true }).fill(text);
    const target = page.locator('.component-standard-settings__preview').getByRole('button', { name: 'Сохранить', exact: true });
    await target.hover();
    await contained(page, 'tooltip');
    const metrics = await page.getByRole('tooltip').evaluate((node) => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height, overflow: node.scrollWidth > node.clientWidth }));
    assert.ok(metrics.width <= 240.5 && metrics.height > 44 && !metrics.overflow, JSON.stringify(metrics));
    assert.equal(await page.getByRole('tooltip').innerText(), text.trim());
    await page.getByRole('tab', { name: 'Доступность', exact: true }).click();
    await noOverlays(page);
    await page.getByRole('tab', { name: 'Обзор', exact: true }).click();
  }
}
try {
  for (const width of [320, 768, 1440]) {
    for (const route of routes.filter((route) => !args.includes('--catalog-only') && (!selectedKinds || selectedKinds.includes(route.kind)))) {
      const context = await browser.newContext({ viewport: { width, height: 1000 } });
      const page = await context.newPage();
      await page.addInitScript(() => {
        const Original = window.ResizeObserver;
        window.__observations = new Map();
        window.ResizeObserver = class extends Original {
          constructor(callback) {
            super(callback);
            window.__observations.set(this, new Set());
          }
          observe(target, options) { window.__observations.get(this).add(target); return super.observe(target, options); }
          unobserve(target) { window.__observations.get(this).delete(target); return super.unobserve(target); }
          disconnect() { window.__observations.get(this).clear(); return super.disconnect(); }
        };
      });
      page.setDefaultTimeout(6000);
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      try {
        const response = await page.goto(new URL(route.route, base).href);
        assert.equal(response.status(), 200);
        await page.reload();
        await page.getByRole('tab', { name: 'Обзор', exact: true }).waitFor();
        await page.waitForLoadState('networkidle');
        const main = page.locator('main');
        assert.equal(await main.getByRole('heading', { level: 1 }).count(), 1);
        assert.equal(await main.getByRole('heading', { level: 1 }).innerText(), route.title);
        assert.equal(await page.getByRole('tab', { name: 'Обзор', exact: true }).getAttribute('aria-selected'), 'true');
        assert.equal(await page.evaluate(() => document.activeElement === document.body), true, 'No autofocus');
        await noOverlays(page);
        const component = registry.find((item) => item.id === route.stableId);
        assert.match(await main.innerText(), new RegExp(route.stableId.replaceAll('.', '\\.')));
        for (const href of [component.links.figma, component.links.storybook, 'https://github.com/cometal-design/cometal-design-system/blob/main/' + component.links.source]) {
          assert.equal(await main.locator('a').evaluateAll((links, href) => links.some((link) => link.getAttribute('href') === href), href), true, href);
        }
        const nav = page.getByRole('navigation', { name: 'Навигация раздела', exact: true });
        assert.equal(await nav.locator('[aria-current=page]').count(), 1);
        assert.equal(await nav.locator('[aria-current=page]').getAttribute('href'), route.route);
        const initialGeometry = await geometry(page);
        if (route.kind !== 'tooltip') {
          const offset = await previewTopOffset(page);
          console.log('PASS preview offset', width, route.route, offset, 'click+keyboard round-trip');
        }
        const overviewPanel = main.locator('[role=tabpanel]:visible');
        await copyChecks(page, overviewPanel);
        for (const pre of await overviewPanel.locator('pre').all()) {
          const source = await pre.innerText();
          const ast = ts.createSourceFile('example.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
          assert.equal(ast.parseDiagnostics.length, 0, 'Runnable snippet syntax');
        }
        await componentInteraction(page, route);
        if (route.kind === 'combobox' || route.kind === 'multi-select') await listboxLifecycle(page, route.kind);
        await page.getByRole('tab', { name: 'Настройки', exact: true }).click();
        await noOverlays(page);
        await geometry(page);
        const settings = main.locator('[role=tabpanel]:visible');
        await settings.getByRole('button', { name: 'Показать код', exact: true }).click();
        assert.ok((await settings.locator('pre').innerText()).includes('@cometal/react'));
        if (route.kind !== 'tooltip') {
          const preview = settings.locator('.component-standard-settings__preview');
          const sizes = ['text-area', 'multi-select'].includes(route.kind) ? ['M', 'L'] : ['S', 'M', 'L'];
          for (const size of sizes) {
            await choose(page, 'Размер', size);
            await until(async () => await preview.locator('[data-size="' + size.toLowerCase() + '"]').count() > 0, 'Supported size ' + size);
            assert.ok((await settings.locator('pre').innerText()).includes('size="' + size.toLowerCase() + '"'));
          }
          await page.getByRole('textbox', { name: 'Ошибка', exact: true }).fill('Проверьте данные');
          assert.equal(await preview.locator('[aria-invalid=true]').count(), 1);
          const disabledToggle = page.getByRole('checkbox', { name: 'Недоступно', exact: true });
          await disabledToggle.focus();
          await disabledToggle.press('Space');
          assert.equal(await disabledToggle.isChecked(), true);
          assert.ok(await preview.locator(':disabled').count() > 0);
          await disabledToggle.press('Space');
          assert.equal(await disabledToggle.isChecked(), false);
          await choose(page, 'Режим', 'Чтение');
          assert.equal(await preview.locator('input:not([type=hidden]), textarea, [role=combobox]').count(), 0);
        }
        await settings.getByRole('button', { name: 'Сбросить', exact: true }).click();
        assert.equal(await settings.locator('pre').count(), 0);
        await noOverlays(page);
        await page.getByRole('tab', { name: 'Доступность', exact: true }).click();
        assert.ok((await main.locator('[role=tabpanel]:visible').innerText()).includes('Клавиатура'));
        await page.getByRole('tab', { name: 'Обзор', exact: true }).click();
        await page.addScriptTag({ path: axePath });
        const violations = await page.evaluate(async () => (await window.axe.run(document.querySelector('main'), { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations);
        assert.deepEqual(violations.map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.map((node) => node.target) })), []);
        assert.deepEqual(errors, []);
        evidence.push({ route: route.route, width, status: 'PASS', initialGeometry });
        console.log('PASS', width, route.route);
      } catch (error) {
        failures.push({ route: route.route, width, error: error.message, console: errors });
        console.error('FAIL', width, route.route, error.message);
      } finally { await context.close(); }
    }
    if (!checkCatalog) continue;
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    page.setDefaultTimeout(6000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    try {
      assert.equal((await page.goto(new URL('/components/', base).href)).status(), 200);
      await page.reload();
      await page.waitForLoadState('networkidle');
      // Existing Tooltip/ContextMenu catalog specimens intentionally defaultOpen.
      // The five newly exposed Field specimens must not introduce open popups.
      assert.equal(await page.locator('[role=listbox]:visible, [role=dialog]:visible').count(), 0);
      const cards = page.locator('.component-catalog > .component-card');
      assert.equal(await cards.count(), 16);
      assert.deepEqual(await cards.evaluateAll((nodes) => nodes.map((node) => ({
        id: node.getAttribute('data-component-id'), route: node.querySelector('h2 a').getAttribute('href'),
        name: node.querySelector('.component-card__body h2').textContent,
      }))), catalog.map((entry) => ({ id: entry.id, route: entry.route, name: entry.name })));
      assert.equal(await page.locator('.field-doc-chooser__cards, .field-doc-nav, [data-component-id="input.fields"]').count(), 0);
      const nav = page.getByRole('navigation', { name: 'Навигация раздела', exact: true });
      assert.deepEqual(await nav.getByRole('link').evaluateAll((links) => links.map((node) => node.getAttribute('href'))),
        ['/components/', ...catalog.map((entry) => entry.route)]);
      assert.equal(await nav.getByRole('link', { name: 'Fields', exact: true }).count(), 0);
      assert.equal(await nav.locator('ul, .field-doc-nav').count(), 0);
      for (const doc of Object.values(fields)) {
        const card = page.locator('.component-card[data-component-id="' + doc.stableId + '"]');
        const entry = catalog.find((entry) => entry.id === doc.stableId);
        assert.equal(await card.locator('.cometal-field').count(), 1);
        assert.match(await card.locator('.component-card__body').innerText(), new RegExp(entry.status === 'ready' ? 'Ready' : 'In review'));
      }
      await geometry(page);
      for (const doc of Object.values(fields)) {
        await page.locator('.component-card[data-component-id="' + doc.stableId + '"] h2 a').click();
        await page.waitForURL(new URL(doc.route, base).href);
        assert.equal(await page.locator('main h1').innerText(), doc.title);
        await nav.getByRole('link', { name: 'Обзор', exact: true }).click();
        await page.waitForURL(new URL('/components/', base).href);
        await nav.getByRole('link', { name: doc.title, exact: true }).click();
        await page.waitForURL(new URL(doc.route, base).href);
        assert.equal(await nav.locator('[aria-current=page]').count(), 1);
        assert.equal(await nav.locator('[aria-current=page]').getAttribute('href'), doc.route);
        await nav.getByRole('link', { name: 'Обзор', exact: true }).click();
        await page.waitForURL(new URL('/components/', base).href);
      }
      for (const alias of contract.compatibilityRoutes) {
        await page.goto(new URL(alias.route, base).href);
        await page.waitForURL(new URL(alias.target, base).href);
        await page.reload();
        await page.waitForURL(new URL(alias.target, base).href);
        await page.locator('main h1').waitFor();
        assert.equal(await page.locator('main h1').count(), 1);
        assert.notEqual(await page.locator('main h1').innerText(), 'Fields');
        assert.equal(await page.locator('.field-doc-chooser__cards, .field-doc-nav').count(), 0);
        console.log('PASS redirect', width, alias.route, '→', alias.target);
      }
      assert.deepEqual(errors, []);
      console.log('PASS', width, 'flat catalog/navigation/compatibility');
    } catch (error) {
      failures.push({ route: '/components/', width, error: error.message, console: errors });
      console.error('FAIL catalog', width, error.message);
    }
    finally { await page.close(); }
  }
  // Shared navigation/layout smoke only: do not redefine untouched component contracts.
  for (const slug of !checkCatalog ? [] : ['button', 'badge', 'checkbox', 'radio-button', 'switch', 'tabs', 'context-menu']) {
    const page = await browser.newPage({ viewport: { width: 320, height: 1000 } });
    try {
      assert.equal((await page.goto(new URL('/components/' + slug + '/', base).href)).status(), 200);
      assert.equal(await page.locator('main h1').count(), 1);
      await page.getByRole('tab', { name: 'Настройки', exact: true }).click();
      await page.getByRole('tab', { name: 'Доступность', exact: true }).click();
      await geometry(page);
      console.log('PASS smoke', slug);
    } catch (error) { failures.push({ route: slug, error: error.message }); }
    finally { await page.close(); }
  }
} finally { await browser.close(); }
console.log(JSON.stringify({ detailCases: evidence.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
