import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createTheme } from '@mui/material/styles';

const origin = process.env.MUI_TEST_ORIGIN ?? 'http://127.0.0.1:3011';
const url = `${origin}/mui-components/`;
async function visit(page, target) {
  const response = await page.goto(target);
  await page.locator('main[data-mui-board-hydrated="true"]').waitFor().catch(async (error) => {
    console.error('Hydration wait failed', target, await page.locator('body').innerText());
    throw error;
  });
  return response;
}
const names = ['Button', 'Badge', 'TextField', 'TextArea', 'Select', 'Combobox', 'MultiSelect', 'Checkbox', 'RadioButton', 'Switch', 'Tabs', 'Tooltip'];
const adapter = await readFile(new URL('../components/mui/visual-adapter.tsx', import.meta.url), 'utf8');
const sources = Object.fromEntries(await Promise.all(names.map(async (name) => [name, await readFile(new URL(`../components/mui/Mui${name}Demo.tsx`, import.meta.url), 'utf8')])));
// Canonical token output, not the old pilot snapshot.
assert.equal(createHash('sha256').update(await readFile(new URL('../../../packages/tokens/dist/tokens.css', import.meta.url))).digest('hex'), '26dda46d074c1eca39326c4d2d613bae9d610d2fbe9ca4db046d12f45dda966d');

if (!process.env.MUI_TEST_PASS) {
  for (const pass of ['integration', 'select', 'board', 'sizes', 'choices', 'tabs', 'board-tabs']) {
    const flags = { sizes: 'SIZES_ONLY', choices: 'CHOICES_ONLY', tabs: 'TABS_ONLY', 'board-tabs': 'BOARD_TABS_ONLY' };
    const result = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], {
      stdio: 'inherit', env: { ...process.env, MUI_TEST_PASS: pass, ...(flags[pass] ? { [flags[pass]]: '1' } : {}) },
    });
    assert.equal(result.status, 0, pass + ' browser pass failed');
  }
  console.log('MUI portal integration: ALL PASSES GREEN');
  process.exit(0);
}


if (process.env.MUI_TEST_PASS === 'integration') {
  const errors = [];
  const serverBrowser = await chromium.launch();
  // Slow fonts must never let late query/default initialization replace explicit user intent.
  for (const { query, unmount } of [
    { query: '', unmount: false },
    { query: '?component=invalid', unmount: false },
    { query: '?component=select&state=disabled', unmount: false },
    { query: '?component=select', unmount: true },
  ]) {
    const slow = await serverBrowser.newContext({ viewport: { width: 320, height: 900 } });
    const early = await slow.newPage();
    early.on('pageerror', error => errors.push(error.message));
    early.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    let releaseFonts;
    let heldFonts = 0;
    const fontGate = new Promise(resolve => { releaseFonts = resolve; });
    await early.route(/\.(woff2?|ttf|otf)(\?|$)/, async route => { heldFonts++; await fontGate; await route.continue(); });
    try {
      await early.goto(url + query, { waitUntil: 'domcontentloaded' });
      const chosen = early.locator('#pilot-board-tab-textfield');
      await chosen.click();
      await early.waitForFunction(() => document.getElementById('pilot-board-tab-textfield').getAttribute('aria-selected') === 'true');
      const input = early.getByRole('textbox');
      await input.fill('Explicit user draft before fonts');
      assert.ok(heldFonts > 0);
      assert.equal(await early.locator('main').getAttribute('data-mui-board-hydrated'), 'false');
      if (unmount) {
        await early.getByRole('navigation', { name: 'Навигация раздела', exact: true }).getByRole('link', { name: 'Button', exact: true }).click();
        await early.waitForURL(origin + '/components/button/', { waitUntil: 'domcontentloaded' });
        releaseFonts();
        await early.evaluate(() => document.fonts.ready);
        await early.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await early.locator('main[data-mui-board-hydrated]').count(), 0);
        assert.equal(await early.locator('#pilot-board-tab-select').count(), 0);
        assert.notEqual(await early.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
        continue;
      }
      releaseFonts();
      await early.locator('main[data-mui-board-hydrated="true"]').waitFor();
      assert.equal(await chosen.getAttribute('aria-selected'), 'true');
      assert.equal(await input.inputValue(), 'Explicit user draft before fonts');
      assert.equal(await input.evaluate(element => element === document.activeElement), true);
    } finally { releaseFonts(); await slow.close(); }
  }
  const chunkDirectory = new URL('../out/_next/static/chunks/', import.meta.url);
  const chunkSources = await Promise.all((await readdir(chunkDirectory)).filter(name => name.endsWith('.js')).map(async name => ({
    path: '/_next/static/chunks/' + name, text: await readFile(new URL(name, chunkDirectory), 'utf8'),
  })));
  const boardChunks = chunkSources.filter(chunk => chunk.text.includes('data-mui-board-hydrated'));
  const providerChunks = chunkSources.filter(chunk => chunk.text.includes('enableCssLayer'));
  assert.ok(boardChunks.length > 0 && providerChunks.length > 0, 'identify board and official provider in this build');
  const muiChunks = new Set([...boardChunks, ...providerChunks].map(chunk => chunk.path));
  // The sidebar URL must not eagerly pull the experimental board into canonical routes.
  for (const route of ['/components/button/', '/components/text-field/', '/components/tabs/']) {
    const pristine = await serverBrowser.newContext({ viewport: { width: 1440, height: 1000 } });
    const canonical = await pristine.newPage();
    const requestedChunks = [];
    canonical.on('request', request => { if (muiChunks.has(new URL(request.url()).pathname)) requestedChunks.push(request.url()); });
    canonical.on('pageerror', error => errors.push(error.message));
    canonical.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await canonical.goto(origin + route);
    await canonical.waitForLoadState('networkidle');
    assert.deepEqual(requestedChunks, [], route + ' eagerly downloaded MUI');
    const link = canonical.getByRole('navigation', { name: 'Навигация раздела', exact: true }).getByRole('link', { name: 'Компоненты на MUI', exact: true });
    await link.hover();
    await canonical.waitForTimeout(750);
    await canonical.waitForLoadState('networkidle');
    assert.deepEqual(requestedChunks, [], route + ' downloaded MUI on hover');
    assert.equal(await canonical.locator('style[data-emotion^="cometal-mui"]').count(), 0);
    if (route === '/components/button/') await link.click();
    else { await link.focus(); await canonical.keyboard.press('Enter'); }
    await canonical.waitForURL(url);
    await canonical.locator('main[data-mui-board-hydrated="true"]').waitFor();
    assert.ok(requestedChunks.length > 0, 'activation downloads MUI normally');
    assert.equal(await link.getAttribute('aria-current'), 'page');
    assert.equal(await canonical.locator('.primary-nav').getByRole('link', { name: 'Компоненты', exact: true }).getAttribute('aria-current'), 'page');
    await canonical.getByRole('tab', { name: 'Select', exact: true }).click();
    await canonical.getByRole('combobox').click();
    await canonical.getByRole('listbox').waitFor();
    await canonical.keyboard.press('Escape');
    await canonical.getByRole('listbox').waitFor({ state: 'hidden' });
    await pristine.close();
  }
  const staticContext = await serverBrowser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const noJs = await staticContext.newPage();
  const response = await noJs.goto(url);
  assert.equal(response.status(), 200);
  assert.equal(await noJs.getByRole('main').count(), 1);
  assert.equal(await noJs.getByRole('heading', { name: 'Компоненты на MUI', exact: true }).count(), 1);
  const tabs = noJs.getByRole('tablist', { name: 'Компоненты MUI пилота', exact: true });
  assert.deepEqual(await tabs.getByRole('tab').allTextContents(), names);
  assert.equal(await tabs.getByRole('tab', { name: 'Button', exact: true }).getAttribute('aria-selected'), 'true');
  assert.equal(await noJs.getByRole('button', { name: 'Medium', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.equal(await noJs.getByRole('region', { name: 'MUI Button — полный React-код', exact: true }).locator('code').textContent(), sources.Button);
  assert.equal(await noJs.getByRole('region', { name: 'MUI — общий визуальный адаптер', exact: true }).locator('code').textContent(), adapter);
  assert.ok(await noJs.locator('head style[data-emotion^="cometal-mui"]').count() > 0, 'SSR Emotion must be in head');
  assert.equal(await noJs.locator('body style[data-emotion^="cometal-mui"]').count(), 0);
  assert.equal(await noJs.getByRole('button', { name: 'Создать заявку' }).evaluate(el => el.getBoundingClientRect().height), 40);
  assert.equal(await noJs.locator('main a[href*="figma"],main a[href*="github"],main a[href*="storybook"]').count(), 0);
  const sidebar = noJs.getByRole('navigation', { name: 'Навигация раздела', exact: true });
  assert.deepEqual((await sidebar.getByRole('link').allTextContents()).slice(0, 2), ['Обзор', 'Компоненты на MUI']);
  assert.equal(await sidebar.getByRole('link', { name: 'Компоненты на MUI', exact: true }).getAttribute('aria-current'), 'page');
  const sidebarCount = await sidebar.getByRole('link').count();
  await staticContext.close();
  const page = await serverBrowser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  // Canonical route CSS/dimensions stay unchanged before and after client-side MUI navigation.
  for (const route of ['/components/button/', '/components/text-field/', '/components/tabs/']) {
    await page.goto(origin + route);
    const before = await page.locator('.component-standard-presentation, .button-interactive-demo').first().evaluate(el => {
      const s = getComputedStyle(el); return [s.backgroundColor, s.borderRadius, s.padding, s.fontFamily];
    });
    assert.equal(await page.locator('style[data-emotion^="cometal-mui"]').count(), 0, 'canonical initial route loads no MUI styles');
    await page.getByRole('navigation', { name: 'Навигация раздела', exact: true }).getByRole('link', { name: 'Компоненты на MUI', exact: true }).click();
    await page.locator('main[data-mui-board-hydrated="true"]').waitFor();
    await page.getByRole('tab', { name: 'Select', exact: true }).click();
    await page.getByRole('combobox').click();
    await page.getByRole('listbox').waitFor();
    await page.keyboard.press('Escape');
    await page.getByRole('listbox').waitFor({ state: 'hidden' });
    await page.getByRole('navigation', { name: 'Навигация раздела', exact: true }).locator('a[href="' + route + '"]').click();
    await page.waitForURL(origin + route);
    const after = await page.locator('.component-standard-presentation, .button-interactive-demo').first().evaluate(el => {
      const s = getComputedStyle(el); return [s.backgroundColor, s.borderRadius, s.padding, s.fontFamily];
    });
    assert.deepEqual(after, before, route + ' style isolation');
    assert.equal(await page.getByRole('listbox').count(), 0);
    assert.notEqual(await page.evaluate(() => getComputedStyle(document.body).overflow), 'hidden');
  }
  for (const component of names.map(name => name.toLowerCase())) {
    await visit(page, url + '?component=' + component);
    assert.equal(await page.locator('#pilot-board-tab-' + component).getAttribute('aria-selected'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.tagName), 'BODY');
    assert.equal(await page.evaluate(() => scrollY), 0);
    assert.equal(await page.getByRole('listbox').count(), 0);
    assert.equal(await page.getByRole('tooltip').count(), 0);
  }
  await visit(page, url + '?component=invalid&state=invalid');
  assert.equal(await page.locator('#pilot-board-tab-button').getAttribute('aria-selected'), 'true');
  assert.equal(await page.getByRole('navigation', { name: 'Навигация раздела', exact: true }).getByRole('link').count(), sidebarCount);
  await page.setViewportSize({ width: 320, height: 900 });
  await visit(page, url + '?component=select');
  await page.waitForFunction(() => {
    const tab = document.getElementById('pilot-board-tab-select');
    const rect = tab.getBoundingClientRect();
    const viewport = tab.closest('.MuiTabs-scroller').getBoundingClientRect();
    return rect.left >= viewport.left - 1 && rect.right <= viewport.right + 1;
  });
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'BODY');
  assert.equal(await page.evaluate(() => scrollY), 0);
  const meta = await (await page.request.get(origin + '/cometal-build-meta.json')).json();
  const storyMeta = await (await page.request.get(origin + '/storybook/cometal-build-meta.json')).json();
  assert.equal(meta.buildSha, storyMeta.buildSha);
  assert.equal(meta.status, 'exact');
  assert.equal(meta.buildSha, execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim());
  assert.equal((await page.request.get(origin + '/storybook/index.json')).status(), 200);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ pass: 'SSR/static/hydration/navigation/isolation', status: 'PASS', sources: 13, muiChunks: [...muiChunks], preactivationAndHoverRequests: 0, errors }));
  await serverBrowser.close();
  process.exit(0);
}
if (process.env.MUI_TEST_PASS === 'select') {

const url = `${origin}/mui-components/?component=select`;
const source = await readFile(new URL('../components/mui/MuiSelectDemo.tsx', import.meta.url), 'utf8');
const adapterSource = await readFile(new URL('../components/mui/visual-adapter.tsx', import.meta.url), 'utf8');
const browser = await chromium.launch();
const failures = [];
const results = [];
const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1, `${actual} ≠ ${expected}`);

try {
  for (const width of [320, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') failures.push(message.text()); });
    await visit(page,url);
    await page.evaluate(() => document.fonts.ready);
    const select = page.getByRole('combobox', { name: /Направление работы/ });
    await select.waitFor();
    assert.equal(await select.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.getByRole('listbox').count(), 0);
    const geometry = await select.evaluate((element) => {
      const root = element.closest('.MuiInputBase-root');
      const rect = root.getBoundingClientRect();
      const style = getComputedStyle(root);
      const icon = root.querySelector('svg');
      const shell = document.querySelector('.component-standard-presentation');
      const shellStyle = getComputedStyle(shell);
      const availableWidth = shell.clientWidth - parseFloat(shellStyle.paddingLeft) - parseFloat(shellStyle.paddingRight);
      return { width: rect.width, availableWidth, expectedCenter: shell.getBoundingClientRect().left + shell.getBoundingClientRect().width / 2, height: rect.height, hitHeight: element.getBoundingClientRect().height, x: rect.x, font: style.fontFamily, fontSize: style.fontSize, lineHeight: style.lineHeight, border: style.borderWidth, radius: style.borderRadius, iconWidth: icon.getBoundingClientRect().width, iconHeight: icon.getBoundingClientRect().height, stroke: getComputedStyle(icon.querySelector('path')).strokeWidth, inputInset: getComputedStyle(element).paddingLeft, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    closeTo(geometry.width, Math.min(400, geometry.availableWidth));
    closeTo(geometry.x + geometry.width / 2, geometry.expectedCenter);
    closeTo(geometry.height, 40);
    closeTo(geometry.hitHeight, 38);
    assert.equal(geometry.fontSize, '14px');
    assert.equal(geometry.lineHeight, '20px');
    assert.equal(geometry.border, '1px');
    assert.equal(geometry.radius, '8px');
    assert.equal(geometry.inputInset, '12px');
    assert.match(geometry.font, /Grtsk Peta/);
    closeTo(geometry.iconWidth, 16);
    closeTo(geometry.iconHeight, 16);
    assert.equal(geometry.stroke, '1.4px');
    assert.equal(geometry.overflow, false);

    await select.click();
    const menu = page.getByRole('listbox');
    await menu.waitFor();
    assert.equal(await menu.evaluate((element) => document.querySelector('main').contains(element)), false);
    await page.getByRole('option', { name: 'Закупки', exact: true }).click();
    await menu.waitFor({ state: 'hidden' });
    assert.match(await select.innerText(), /Закупки/);
    assert.equal(await select.evaluate((element) => element === document.activeElement), true);

    await select.press('ArrowDown');
    await menu.waitFor();
    await page.keyboard.press('End');
    assert.equal(await page.getByRole('option', { name: 'Архив', exact: true }).getAttribute('aria-disabled'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Контроль качества');
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await menu.waitFor({ state: 'hidden' });
    assert.match(await select.innerText(), /Закупки/);
    await select.press('Space');
    await menu.waitFor();
    // Playwright's US keyboard cannot press Cyrillic keys; send trusted browser input.
    const keyboard = await context.newCDPSession(page);
    for (const key of 'Производство') {
      await keyboard.send('Input.dispatchKeyEvent', { type: 'keyDown', key, text: key });
      await keyboard.send('Input.dispatchKeyEvent', { type: 'keyUp', key });
    }
    await keyboard.detach();
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Производство');
    await page.keyboard.press('Enter');
    await menu.waitFor({ state: 'hidden' });
    assert.match(await select.innerText(), /Производство/);

    await select.press('ArrowDown');
    await menu.waitFor();
    await page.keyboard.press('Escape');
    await menu.waitFor({ state: 'hidden' });
    assert.equal(await select.evaluate((element) => element === document.activeElement), true);
    const focus = await select.evaluate((element) => { const s = getComputedStyle(element.closest('.MuiInputBase-root')); return [s.outlineWidth, s.outlineOffset]; });
    assert.deepEqual(focus, ['2px', '4px']);
    await select.click();
    await menu.waitFor();
    await page.mouse.click(2, 2);
    await menu.waitFor({ state: 'hidden' });
    assert.equal(await select.evaluate((element) => element === document.activeElement), true);

    // Short viewport plus real scrolling exercise MUI's viewport placement.
    await page.setViewportSize({ width, height: 360 });
    await select.evaluate((element) => element.scrollIntoView({ block: 'start' }));
    await select.click();
    await menu.waitFor();
    await page.waitForFunction(() => {
      const p = document.querySelector('.MuiPopover-paper');
      return p && getComputedStyle(p).opacity === '1' && getComputedStyle(p).transform === 'none';
    });
    const menuRect = await menu.evaluate((element) => { const r = element.closest('.MuiPopover-paper').getBoundingClientRect(); return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, font: getComputedStyle(element.querySelector('[role="option"]')).fontFamily }; });
    assert.ok(menuRect.x >= 0 && menuRect.right <= width && menuRect.y >= 0 && menuRect.bottom <= 360);
    assert.match(menuRect.font, /Grtsk Peta/);
    await page.keyboard.press('Escape');
    await menu.waitFor({ state: 'hidden' });

    await page.setViewportSize({ width, height: 900 });

    const code = page.getByRole('region', { name: 'MUI Select — полный React-код' });
    assert.equal(await code.locator('code').textContent(), source);
    assert.equal(await page.getByRole('region', { name: 'MUI — общий визуальный адаптер', exact: true }).locator('code').textContent(), adapterSource);
    await code.focus();
    assert.equal(await code.evaluate((element) => element === document.activeElement), true);
    const scrollBefore = await code.evaluate((element) => element.scrollLeft);
    await code.press('ArrowRight');
    await page.waitForFunction((before) => document.querySelector('.docs-code-block pre').scrollLeft > before, scrollBefore);
    await page.getByRole('button', { name: 'Скопировать: MUI Select — полный React-код', exact: true }).click();
    await page.getByRole('button', { name: 'Скопировано: MUI Select — полный React-код', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), source);

    // A denied clipboard API is an explicit integration fixture, not a production mutation.
    await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'writeText', { configurable: true, value: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')) }); });
    await page.getByRole('button', { name: /Скопировано:/ }).click();
    await page.getByRole('button', { name: /Не удалось скопировать:/ }).waitFor();

    await visit(page,`${url}&state=disabled`);
    await select.waitFor();
    assert.equal(await select.getAttribute('aria-disabled'), 'true');
    await select.click({ force: true });
    assert.equal(await page.getByRole('listbox').count(), 0);
    await visit(page,`${url}&state=error`);
    await select.waitFor();
    assert.equal(await select.getAttribute('aria-invalid'), 'true');
    const helper = await select.getAttribute('aria-describedby');
    assert.ok(helper);
    assert.match(await page.locator(`[id="${helper}"]`).innerText(), /Выберите направление, чтобы продолжить/);
    results.push({ viewport: width, geometry, focus, menuRect, interaction: 'PASS', codeCopy: 'PASS', disabledError: 'PASS' });
    await context.close();
  }
  assert.deepEqual(failures, []);
  console.log(JSON.stringify({ status: 'PASS', cases: results, consoleErrors: failures }, null, 2));
} finally {
  await browser.close();
}

  process.exit(0);
}

const browser = await chromium.launch();
if (process.env.SIZES_ONLY) {
  const errors = [], report = [];
  const families = names.filter((name) => !['Badge', 'Tooltip'].includes(name));
  const labels = { l: 'Large', m: 'Medium', s: 'Small' };
  const paths = { l: 'M6 9.92L8.56 12.48L14 6.72', m: 'M4.5 7.88L6.74 10.12L11.5 5.08', s: 'M4 6.84L5.92 8.76L10 4.44' };
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  context.setDefaultTimeout(10000);
  try {
    for (const width of [320, 768, 1440]) {
      const page = await context.newPage();
      await page.setViewportSize({ width, height: 1000 });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      for (const name of families) {
        console.log(`Size geometry: ${width} ${name}`);
        await visit(page,`${url}?component=${name.toLowerCase()}`);
        const stage = page.locator('[data-demo-stage]');
        const selector = page.getByRole('group', { name: `Размер примера ${name}`, exact: true });
        const limited = ['TextArea', 'MultiSelect'].includes(name);
        assert.equal(await selector.getByRole('button', { name: 'Medium', exact: true }).getAttribute('aria-pressed'), 'true');
        if (limited) {
          assert.equal(await selector.getByRole('button', { name: 'Small', exact: true }).isDisabled(), true);
          const note = await selector.getAttribute('aria-describedby');
          assert.match(await page.locator(`#${note}`).innerText(), /Small не предусмотрен/);
        }
        // Seed genuine MUI state once; changing size must never remount/reset it.
        if (name === 'Button') await stage.getByRole('button').click();
        if (['TextField', 'TextArea'].includes(name)) await stage.getByRole('textbox').fill('Сохранённое значение');
        if (['Select', 'MultiSelect'].includes(name)) {
          await stage.getByRole('combobox').click();
          await page.getByRole('option', { name: 'Закупки', exact: true }).click();
          if (name === 'MultiSelect') await page.keyboard.press('Escape');
        }
        if (name === 'Combobox') {
          await stage.getByRole('combobox').fill('Зак');
          await page.getByRole('option', { name: 'Закупки', exact: true }).click();
        }
        if (name === 'Checkbox') await stage.getByRole('checkbox').check();
        if (name === 'RadioButton') await stage.getByRole('radio', { name: 'Срочный' }).check();
        if (name === 'Switch') await stage.getByRole('switch').check();
        if (name === 'Tabs') await stage.getByRole('tab', { name: 'История' }).click();
        for (const size of limited ? ['l', 'm'] : ['l', 'm', 's']) {
          const choice = selector.getByRole('button', { name: labels[size], exact: true });
          if (size === 'm') { await choice.focus(); await choice.press('Enter'); }
          else await choice.click();
          // Keyboard activation of the selected choice cannot deselect to null.
          await choice.press('Space');
          assert.equal(await choice.getAttribute('aria-pressed'), 'true');
          assert.equal(await selector.locator('[aria-pressed="true"]').count(), 1);
          assert.equal(await stage.getAttribute('data-demo-size'), size);
          await page.waitForTimeout(createTheme().transitions.duration.standard);
          const actual = await stage.evaluate((stage, name) => {
            const rect = (el) => { const r = el.getBoundingClientRect(); return [r.width, r.height]; };
            const font = (el) => { const s = getComputedStyle(el); return [s.fontSize, s.lineHeight, s.letterSpacing]; };
            const root = stage.firstElementChild;
            const input = stage.querySelector('.MuiInputBase-root');
            const text = stage.querySelector('.MuiInputBase-input');
            const icon = stage.querySelector('[data-pilot-selection-icon]');
            const label = stage.querySelector('.MuiFormControlLabel-label');
            const button = stage.querySelector('.MuiButton-root');
            const tab = stage.querySelector('[role="tab"][aria-selected="true"]');
            const indicator = stage.querySelector('.MuiTabs-indicator');
            const selector = document.querySelector('[data-size-controls]');
            return { name, root: rect(root), available: rect(stage)[0], input: input && rect(input), font: font(button || text || label || tab),
              inset: text && parseFloat(getComputedStyle(name === 'Combobox' || name === 'TextArea' ? input : text).paddingLeft),
              textareaInsets: name === 'TextArea' && [getComputedStyle(text).padding, getComputedStyle(input).paddingTop, text.getBoundingClientRect().left - input.getBoundingClientRect().left + parseFloat(getComputedStyle(text).paddingLeft), input.getBoundingClientRect().right - text.getBoundingClientRect().right + parseFloat(getComputedStyle(text).paddingRight)],
              icon: icon && rect(icon), path: icon?.querySelector('path')?.getAttribute('d'),
              firstLineCenterDelta: icon && icon.getBoundingClientRect().top + rect(icon)[1] / 2 - label.getBoundingClientRect().top - parseFloat(getComputedStyle(label).lineHeight) / 2,
              fieldIcon: stage.querySelector('.MuiSelect-icon, .MuiAutocomplete-popupIndicator svg') && rect(stage.querySelector('.MuiSelect-icon, .MuiAutocomplete-popupIndicator svg')),
              dot: icon && [getComputedStyle(icon, '::after').width, getComputedStyle(icon, '::after').height],
              switch: stage.querySelector('.MuiSwitch-root') && rect(stage.querySelector('.MuiSwitch-root')),
              thumb: stage.querySelector('.MuiSwitch-thumb') && rect(stage.querySelector('.MuiSwitch-thumb')),
              tag: stage.querySelector('.MuiChip-root') && rect(stage.querySelector('.MuiChip-root')),
              tagFont: stage.querySelector('.MuiChip-root') && font(stage.querySelector('.MuiChip-root')),
              button: button && rect(button), tab: tab && rect(tab), gap: tab && indicator.getBoundingClientRect().top - tab.getBoundingClientRect().bottom,
              line: indicator && rect(indicator)[1], board: rect(document.querySelector('#pilot-board-tab-' + name.toLowerCase()))[1],
              overlap: selector.getBoundingClientRect().bottom > stage.getBoundingClientRect().top,
              selectorHeights: [...selector.querySelectorAll('button')].map((el) => rect(el)[1]),
              overflow: document.documentElement.scrollWidth > innerWidth };
          }, name);
          const h = { l: 48, m: 40, s: 32 }[size];
          const body = size === 'l' ? ['16px', '24px', 'normal'] : ['14px', '20px', '0.035px'];
          const control = size === 'l' ? ['16px', '20px', 'normal'] : size === 'm' ? ['14px', '16px', '0.035px'] : ['12px', '16px', '0.06px'];
          assert.equal(actual.overflow, false, JSON.stringify(actual));
          assert.equal(actual.overlap, false);
          assert.deepEqual(actual.selectorHeights, [32, 32, 32]);
          assert.equal(actual.board, 40);
          if (['TextField', 'TextArea', 'Select', 'Combobox', 'MultiSelect'].includes(name)) {
            assert.ok(Math.abs(actual.root[0] - Math.min(400, actual.available)) < 1, JSON.stringify(actual));
            assert.equal(actual.input[1], name === 'TextArea' ? h * 3 : h, JSON.stringify(actual));
            assert.deepEqual(actual.font, body, JSON.stringify(actual));
            assert.equal(actual.inset, { l: 16, m: 12, s: 8 }[size], JSON.stringify(actual));
            if (name === 'TextArea') assert.deepEqual(actual.textareaInsets, size === 'l' ? ['0px', '12px', 16, 16] : ['0px', '10px', 12, 12]);
            if (actual.fieldIcon) assert.deepEqual(actual.fieldIcon, [({ l: 20, m: 16, s: 14 })[size], ({ l: 20, m: 16, s: 14 })[size]]);
          }
          if (name === 'Button') { assert.equal(actual.button[1], h); assert.deepEqual(actual.font, control); assert.match(await stage.innerText(), /Создано заявок: 1/); }
          if (['TextField', 'TextArea'].includes(name)) assert.equal(await stage.getByRole('textbox').inputValue(), 'Сохранённое значение');
          if (['Select', 'MultiSelect'].includes(name)) assert.match(await stage.getByRole('combobox').innerText(), /Закупки/);
          if (name === 'Combobox') assert.equal(await stage.getByRole('combobox').inputValue(), 'Закупки');
          if (name === 'MultiSelect') { assert.equal(actual.tag[1], size === 'l' ? 32 : 24); assert.deepEqual(actual.tagFont, ['12px', '16px', '0.06px']); }
          if (['Checkbox', 'RadioButton', 'Switch'].includes(name)) {
            const role = name === 'Checkbox' ? 'checkbox' : name === 'RadioButton' ? 'radio' : 'switch';
            const input = stage.getByRole(role, { checked: true });
            assert.equal(await input.count(), 1);
            assert.deepEqual(actual.font, size === 's' ? ['13px', '20px', '0.065px'] : body);
            if (name === 'Switch') {
              assert.deepEqual(actual.switch, { l: [44, 24], m: [36, 20], s: [32, 16] }[size]);
              assert.deepEqual(actual.thumb, { l: [20, 20], m: [16, 16], s: [12, 12] }[size]);
            } else {
              assert.equal(actual.firstLineCenterDelta, 0, JSON.stringify(actual));
              assert.deepEqual(actual.icon, { l: [20, 20], m: [16, 16], s: [14, 14] }[size]);
              if (name === 'Checkbox') assert.equal(actual.path, paths[size]);
              // First Radio icon is unchecked; measure the selected native control's dot.
              if (name === 'RadioButton') assert.deepEqual(await input.evaluate((el) => { const s = getComputedStyle(el.parentElement.querySelector('[data-pilot-selection-icon]'), '::after'); return [s.width, s.height]; }), Array(2).fill(({ l: '8px', m: '6px', s: '4px' })[size]));
              await choice.focus();
              // Native Tab traversal includes the remaining size buttons, then the demo input.
              for (let attempt = 0; attempt < 4; attempt++) { await page.keyboard.press('Tab'); if (await input.evaluate((el) => el === document.activeElement)) break; }
              const focus = await input.evaluate((el) => { const s = getComputedStyle(el.parentElement.querySelector('[data-pilot-selection-icon]')); return [el.matches(':focus-visible'), s.outlineWidth, s.outlineOffset]; });
              assert.deepEqual(focus, [true, '2px', name === 'RadioButton' && size === 's' ? '3px' : '2px']);
            }
          }
          if (name === 'Tabs') { assert.equal(actual.tab[1], h); assert.equal(actual.gap, 6); assert.equal(actual.line, 2); assert.deepEqual(actual.font, control); assert.match(await stage.getByRole('tabpanel').innerText(), /История/); }
          const expected = `import { Mui${name}Demo } from './Mui${name}Demo';\n\n<Mui${name}Demo size="${size}" />`;
          const copyName = `MUI ${name} — текущее использование`;
          assert.equal(await page.getByRole('region', { name: copyName, exact: true }).locator('code').textContent(), expected);
          await page.getByRole('button', { name: `Скопировать: ${copyName}`, exact: true }).click();
          await page.getByRole('button', { name: `Скопировано: ${copyName}`, exact: true }).waitFor();
          assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expected);
          report.push({ width, name, size, geometry: 'PASS', retainedState: 'PASS', usageCopy: 'PASS' });
        }
        // Per-component property persists, but board navigation retains the old reset boundary.
        const lastSize = limited ? 'm' : 's';
        await page.getByRole('tab', { name: 'Badge', exact: true }).click();
        await page.getByRole('tab', { name, exact: true }).click();
        assert.equal(await stage.getAttribute('data-demo-size'), lastSize);
        if (name === 'Button') assert.match(await stage.innerText(), /Создано заявок: 0/);
      }
      for (const name of ['Badge', 'Tooltip']) {
        await visit(page,`${url}?component=${name.toLowerCase()}`);
        assert.equal(await page.locator('.MuiToggleButtonGroup-root').count(), 0);
        assert.match(await page.locator('[data-size-controls]').innerText(), name === 'Badge' ? /Фиксированный размер/ : /Размеры L\/M\/S не предусмотрены/);
        assert.doesNotMatch(await page.getByRole('region', { name: `MUI ${name} — текущее использование`, exact: true }).innerText(), /size=/);
      }
      await page.close();
    }
    assert.equal(report.length, 84);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ supported: 28, cases: report, errors, status: 'PASS' }, null, 2));
  } finally { await context.close(); await browser.close(); }
  process.exit(0);
}
if (process.env.CHOICES_ONLY) {
  const errors = [];
  const report = [];
  const rgb = (hex) => {
    const value = hex.trim().replace('#', '');
    const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value;
    return `rgb(${[0, 2, 4].map((offset) => parseInt(full.slice(offset, offset + 2), 16)).join(', ')})`;
  };
  try {
    for (const width of [320, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      for (const kind of ['checkbox', 'radio']) {
        const component = kind === 'checkbox' ? 'checkbox' : 'radiobutton';
        const title = kind === 'checkbox' ? 'Checkbox' : 'RadioButton';
        const inspect = async (input, { hover = false, pressed = false, focus = false, disabled = false } = {}) => {
          await page.waitForTimeout(createTheme().transitions.duration.standard);
          const actual = await input.evaluate((input) => {
            const root = input.closest('.MuiButtonBase-root');
            const icon = root.querySelector('[data-pilot-selection-icon]');
            const label = root.closest('label').querySelector('.MuiFormControlLabel-label');
            const s = getComputedStyle(icon), l = getComputedStyle(label), r = icon.getBoundingClientRect();
            const dot = getComputedStyle(icon, '::after'), path = icon.querySelector('path');
            const tokenNames = ['border-default', 'border-strong', 'border-disabled', 'surface-canvas', 'surface-subtle', 'surface-muted', 'action-brand-default', 'action-brand-hover', 'action-brand-pressed', 'action-brand-disabled', 'action-neutral-pressed', 'text-disabled', 'text-inverse', 'state-focus-ring'];
            return { checked: input.checked, disabled: input.disabled, nativeType: input.type,
              marker: root.classList.contains(input.type === 'checkbox' ? 'MuiCheckbox-root' : 'MuiRadio-root'),
              width: r.width, height: r.height, border: parseFloat(s.borderTopWidth), borderColor: s.borderTopColor,
              bg: s.backgroundColor, radius: s.borderRadius, outline: s.outlineStyle, outlineWidth: s.outlineWidth, outlineColor: s.outlineColor, offset: s.outlineOffset,
              rootOutline: getComputedStyle(root).outlineStyle, focus: input.matches(':focus-visible'),
              gap: label.getBoundingClientRect().left - r.right, font: [l.fontSize, l.lineHeight, l.letterSpacing], labelColor: l.color,
              tokens: Object.fromEntries(tokenNames.map((name) => [name, s.getPropertyValue(`--cometal-semantic-color-global-${name}`)])),
              dot: [dot.width, dot.height, dot.backgroundColor, dot.content],
              path: path && { d: path.getAttribute('d'), stroke: getComputedStyle(path).stroke, width: getComputedStyle(path).strokeWidth, cap: path.getAttribute('stroke-linecap'), join: path.getAttribute('stroke-linejoin'), viewBox: icon.querySelector('svg').getAttribute('viewBox') },
              ripple: root.querySelectorAll('.MuiTouchRipple-root').length,
              ringInside: r.left - 4 >= 0 && r.right + 4 <= innerWidth && r.top - 4 >= 0 && r.bottom + 4 <= innerHeight,
              overflow: document.documentElement.scrollWidth > innerWidth };
          });
          const color = (name) => rgb(actual.tokens[name]);
          assert.equal(actual.nativeType, kind);
          assert.equal(actual.marker, true);
          assert.equal(actual.disabled, disabled);
          assert.deepEqual([actual.width, actual.height, actual.gap], [16, 16, 8]);
          assert.deepEqual(actual.font, ['14px', '20px', '0.035px']);
          assert.equal(actual.radius, kind === 'checkbox' ? '4px' : '50%');
          assert.equal(actual.ripple, 0);
          assert.equal(actual.overflow, false);
          assert.equal(actual.focus, focus);
          assert.equal(actual.rootOutline, 'none');
          assert.equal(actual.outline, focus ? 'solid' : 'none');
          if (focus) {
            assert.deepEqual([actual.outlineWidth, actual.offset], ['2px', '2px']);
            assert.equal(actual.outlineColor, color('state-focus-ring'));
            assert.equal(actual.ringInside, true);
          }
          if (disabled) assert.equal(actual.labelColor, color('text-disabled'));
          const action = disabled ? 'action-brand-disabled' : pressed ? 'action-brand-pressed' : hover ? 'action-brand-hover' : 'action-brand-default';
          if (kind === 'checkbox') {
            assert.equal(actual.border, actual.checked ? 0 : 1);
            assert.equal(actual.bg, color(actual.checked ? action : disabled ? 'surface-muted' : pressed ? 'action-neutral-pressed' : hover ? 'surface-subtle' : 'surface-canvas'));
            if (!actual.checked) assert.equal(actual.borderColor, color(disabled ? 'border-disabled' : pressed ? 'action-brand-default' : 'border-default'));
            if (actual.checked) {
              assert.deepEqual(actual.path, { d: 'M4.5 7.88L6.74 10.12L11.5 5.08', stroke: color('text-inverse'), width: '1.4px', cap: 'round', join: 'round', viewBox: '0 0 16 16' });
            } else assert.equal(actual.path, null);
          } else {
            assert.equal(actual.border, 1);
            assert.equal(actual.bg, color(disabled ? 'surface-subtle' : 'surface-canvas'));
            assert.equal(actual.borderColor, color(disabled ? 'border-disabled' : actual.checked ? action : pressed ? 'action-brand-default' : hover ? 'border-strong' : 'border-default'));
            if (actual.checked) assert.deepEqual(actual.dot.slice(0, 3), ['6px', '6px', color(action)]);
            else assert.equal(actual.dot[3], 'none');
          }
          return actual.checked;
        };
        await visit(page,`${url}?component=${component}`);
        await page.mouse.move(0, 0);
        const region = page.getByRole('region', { name: `Интерактивный пример ${title}`, exact: true });
        const inputs = region.getByRole(kind);
        for (const input of await inputs.all()) await inspect(input);
        const input = kind === 'checkbox' ? inputs.first() : inputs.nth(1);
        const label = input.locator('xpath=ancestor::label').locator('.MuiFormControlLabel-label');
        assert.equal(await input.isChecked(), false);
        // Label hover/press covers the same control state, without direct DOM mutation.
        await label.hover(); await inspect(input, { hover: true });
        await page.mouse.down(); await inspect(input, { hover: true, pressed: true });
        await page.mouse.up();
        assert.equal(await input.isChecked(), true);
        await page.mouse.move(0, 0); await inspect(input);
        await label.hover(); await inspect(input, { hover: true });
        await page.mouse.down(); await inspect(input, { hover: true, pressed: true });
        await page.mouse.up(); await page.mouse.move(0, 0);
        await page.getByRole('tablist', { name: 'Компоненты MUI пилота', exact: true }).getByRole('tab', { name: title, exact: true }).focus();
        // Follow native tab order through the size-property group, not a fixed tab count.
        for (let attempt = 0; attempt < 6; attempt++) {
          await page.keyboard.press('Tab');
          if (await input.evaluate((element) => element === document.activeElement)) break;
        }
        if (kind === 'checkbox') {
          assert.equal(await inspect(input, { focus: true }), false);
          await input.press('Space'); assert.equal(await inspect(input, { focus: true }), true);
        } else {
          assert.equal(await inspect(inputs.nth(1), { focus: true }), true);
          await inputs.nth(1).press('ArrowUp');
          assert.equal(await inspect(inputs.first(), { focus: true }), true);
          assert.equal(await inputs.nth(1).isChecked(), false);
          await inputs.first().press('ArrowDown');
          assert.equal(await inspect(inputs.nth(1), { focus: true }), true);
          assert.equal(await inputs.first().isChecked(), false);
        }
        const bounds = await region.locator(kind === 'radio' ? '.MuiRadioGroup-root' : 'label').boundingBox();
        await page.screenshot({ path: `node_modules/.${component}-after-${width}.png`, clip: { x: bounds.x - 8, y: bounds.y - 8, width: bounds.width + 16, height: bounds.height + 16 } });
        await visit(page,`${url}?component=${component}&state=disabled`);
        const disabledInputs = page.getByRole(kind);
        for (const disabledInput of await disabledInputs.all()) {
          const before = await inspect(disabledInput, { disabled: true });
          const disabledLabel = disabledInput.locator('xpath=ancestor::label').locator('.MuiFormControlLabel-label');
          // Send an actual pointer gesture: locator.click correctly refuses disabled labels.
          const target = await disabledLabel.boundingBox();
          await page.mouse.click(target.x + target.width / 2, target.y + target.height / 2);
          await inspect(disabledInput, { disabled: true });
          assert.equal(await disabledInput.isChecked(), before);
        }
        report.push({ kind, width, geometry: '16/1/8', states: 'PASS', nativeKeyboard: 'PASS', disabled: 'PASS' });
      }
      await page.close();
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ choices: report, errors, status: 'PASS' }, null, 2));
  } finally { await browser.close(); }
  process.exit(0);
}
if (process.env.TABS_ONLY || process.env.BOARD_TABS_ONLY) {
  const board = Boolean(process.env.BOARD_TABS_ONLY);
  const count = board ? names.length : 3;
  const errors = [];
  try {
    for (const width of [320, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 } });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
      await visit(page,`${url}?component=tabs`);
      const demo = page.getByRole('tablist', { name: board ? 'Компоненты MUI пилота' : 'Вкладки внутри примера', exact: true });
      const tabs = demo.getByRole('tab');
      const measure = async (tab, keyboard) => {
        await page.waitForTimeout(createTheme().transitions.duration.standard);
        const geometry = await tab.evaluate((button) => {
          const root = button.closest('.MuiTabs-root');
          const scroller = root.querySelector('.MuiTabs-scroller');
          const indicator = root.querySelector('.MuiTabs-indicator');
          const b = button.getBoundingClientRect();
          const s = scroller.getBoundingClientRect();
          const i = indicator.getBoundingClientRect();
          const style = getComputedStyle(button);
          const outline = parseFloat(style.outlineWidth);
          const offset = parseFloat(style.outlineOffset);
          return { height: b.height, gap: i.top - b.bottom, line: i.height,
            aligned: Math.abs(i.left - b.left) < 1 && Math.abs(i.width - b.width) < 1,
            focus: button.classList.contains('Mui-focusVisible'), outline, offset,
            ringGap: i.top - b.bottom - outline - offset,
            ringInside: b.left - outline - offset >= s.left - 1 && b.right + outline + offset <= s.right + 1 && b.top - outline - offset >= s.top - 1 && b.bottom + outline + offset <= s.bottom + 1,
            overflow: document.documentElement.scrollWidth > innerWidth };
        });
        assert.equal(geometry.height, 40);
        assert.equal(geometry.gap, 6);
        assert.equal(geometry.line, 2);
        assert.equal(geometry.aligned, true);
        assert.equal(geometry.focus, keyboard);
        assert.equal(geometry.overflow, false);
        if (keyboard) {
          assert.equal(geometry.outline, 2);
          assert.equal(geometry.offset, 2);
          assert.equal(geometry.ringGap, 2);
          assert.equal(geometry.ringInside, true, JSON.stringify(geometry));
        }
        return geometry;
      };
      if (board) assert.deepEqual(await tabs.allTextContents(), names);
      for (let index = 0; index < count; index++) {
        await tabs.nth(index).click();
        await measure(tabs.nth(index), false);
      }
      // Native MUI arrow navigation and activation, including both scroll edges.
      await tabs.nth(count - 1).press('Home');
      await page.keyboard.press('Enter');
      for (let index = 0; index < count; index++) {
        if (index) { await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter'); }
        assert.equal(await tabs.nth(index).getAttribute('aria-selected'), 'true');
        const geometry = await measure(tabs.nth(index), true);
        if (board) {
          assert.equal(await page.locator('[id^="pilot-board-panel-"]:not([hidden])').count(), 1);
          assert.equal(await page.locator('.component-standard-presentation').count(), 1);
        }
        console.log(JSON.stringify({ surface: board ? 'board' : 'demo', width, label: await tabs.nth(index).innerText(), ...geometry }));
      }
      if (!board) assert.equal(await page.locator('#pilot-board-tab-tabs').getAttribute('aria-selected'), 'true');
      await page.close();
    }
    assert.deepEqual(errors, []);
    console.log(`${board ? 'Board' : 'Demo'} Tabs-only: PASS; console/page errors: 0`);
  } finally { await browser.close(); }
  process.exit(0);
}
const errors = [];
const results = [];
const navigationMotionDuration = createTheme().transitions.duration.standard;
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await visit(page,url);
  const nav = page.getByRole('tablist', { name: 'Компоненты MUI пилота', exact: true });
  await nav.waitFor();
  const settledTooltip = async () => {
    await page.getByRole('tooltip').waitFor();
    await page.waitForFunction(() => {
      const surface = document.querySelector('.MuiTooltip-tooltip');
      return surface && getComputedStyle(surface).opacity === '1' && getComputedStyle(surface).transform === 'none';
    });
  };
  assert.deepEqual(await nav.getByRole('tab').allTextContents(), names);
  const choose = async (name) => {
    await nav.getByRole('tab', { name, exact: true }).click();
    const panel = page.locator(`#pilot-board-panel-${name.toLowerCase()}`);
    await panel.waitFor({ state: 'visible' });
    assert.equal(await nav.getByRole('tab', { name, exact: true }).getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('[id^="pilot-board-panel-"]:not([hidden])').count(), 1);
    assert.equal(await page.locator('.component-standard-presentation').count(), 1);
    // MUI Tabs starts a JS animation in an effect; its initial stationary frames
    // cannot prove completion. Wait the installed theme's duration before another gesture.
    await page.waitForTimeout(navigationMotionDuration);
    await nav.evaluate(async (element) => {
      const scroller = element.closest('.MuiTabs-scroller');
      let previous = scroller.scrollLeft;
      let stableFrames = 0;
      while (stableFrames < 4) {
        await new Promise(requestAnimationFrame);
        const current = scroller.scrollLeft;
        stableFrames = current === previous ? stableFrames + 1 : 0;
        previous = current;
      }
    });
    return panel;
  };
  for (const name of (process.env.RESPONSIVE_ONLY ? [] : names)) {
    const panel = await choose(name);
    const demo = panel.getByRole('region', { name: `Интерактивный пример ${name}`, exact: true });
    if (name === 'Button') {
      await demo.getByRole('button', { name: 'Создать заявку' }).click();
      assert.match(await demo.innerText(), /Создано заявок: 1/);
      assert.equal(await demo.locator('.MuiButton-root').count(), 1);
    } else if (name === 'Badge') {
      assert.match(await demo.innerText(), /COMETAL Badge → Material UI Chip/);
      assert.equal(await demo.locator('.MuiChip-root').count(), 1);
      assert.equal(await demo.locator('button,[role="button"],[tabindex="0"]').count(), 0);
    } else if (name === 'TextField' || name === 'TextArea') {
      const input = demo.getByRole('textbox');
      const value = name === 'TextArea' ? 'Первая строка\nВторая строка' : 'Пилот COMETAL';
      await input.fill(value);
      assert.equal(await input.inputValue(), value);
      assert.ok(await input.getAttribute('aria-describedby'));
      assert.equal(await input.evaluate((element) => element.tagName), name === 'TextArea' ? 'TEXTAREA' : 'INPUT');
    } else if (name === 'Select') {
      await demo.getByRole('combobox').click();
      await page.getByRole('option', { name: 'Проектирование', exact: true }).click();
      assert.match(await demo.getByRole('combobox').innerText(), /Проектирование/);
    } else if (name === 'Combobox') {
      await demo.getByRole('combobox').fill('Зак');
      const option = page.getByRole('option', { name: 'Закупки', exact: true });
      await option.waitFor();
      assert.equal(await page.getByRole('option').count(), 1);
      await option.click();
      assert.equal(await demo.getByRole('combobox').inputValue(), 'Закупки');
    } else if (name === 'MultiSelect') {
      await demo.getByRole('combobox').click();
      await page.getByRole('option', { name: 'Проектирование', exact: true }).click();
      await page.getByRole('option', { name: 'Закупки', exact: true }).click();
      assert.equal(await page.getByRole('option', { selected: true }).count(), 2);
      await page.getByRole('option', { name: 'Проектирование', exact: true }).click();
      assert.equal(await page.getByRole('option', { selected: true }).count(), 1);
      await page.keyboard.press('Escape');
      await page.getByRole('listbox').waitFor({ state: 'hidden' });
      assert.match(await demo.getByRole('combobox').innerText(), /Закупки/);
      assert.equal(await demo.getByRole('textbox').count(), 0);
      assert.equal(await demo.locator('.MuiChip-deleteIcon').count(), 0);
    } else if (name === 'Checkbox') {
      const input = demo.getByRole('checkbox');
      await input.check();
      assert.equal(await input.isChecked(), true);
      await input.press('Space');
      assert.equal(await input.isChecked(), false);
    } else if (name === 'RadioButton') {
      const urgent = demo.getByRole('radio', { name: 'Срочный' });
      await urgent.check();
      assert.equal(await urgent.isChecked(), true);
      assert.equal(await demo.getByRole('radio', { checked: true }).count(), 1);
      await urgent.press('ArrowUp');
      assert.equal(await demo.getByRole('radio', { name: 'Обычный' }).isChecked(), true);
    } else if (name === 'Switch') {
      const input = demo.getByRole('switch');
      await input.check();
      assert.equal(await input.isChecked(), true);
      await input.press('Space');
      assert.equal(await input.isChecked(), false);
    } else if (name === 'Tabs') {
      const inner = demo.getByRole('tablist', { name: 'Вкладки внутри примера' });
      await inner.getByRole('tab', { name: 'История' }).click();
      assert.match(await demo.getByRole('tabpanel').innerText(), /Содержимое: История/);
      assert.equal(await nav.getByRole('tab', { name: 'Tabs', exact: true }).getAttribute('aria-selected'), 'true');
    } else if (name === 'Tooltip') {
      const trigger = demo.getByRole('button', { name: 'О подсказке' });
      await trigger.hover();
      await settledTooltip();
      assert.match(await page.getByRole('tooltip').innerText(), /Создаёт новую заявку/);
      assert.equal(await page.getByRole('tooltip').evaluate((element) => document.querySelector('main').contains(element)), false);
      await page.keyboard.press('Escape');
      await page.getByRole('tooltip').waitFor({ state: 'hidden' });
      await page.mouse.move(0, 0);
      await nav.getByRole('tab', { name: 'Tooltip', exact: true }).focus();
      await page.keyboard.press('Tab');
      assert.equal(await trigger.evaluate((element) => element === document.activeElement), true);
      await settledTooltip();
      assert.ok(await trigger.getAttribute('aria-describedby'));
      await page.keyboard.press('Escape');
      await page.getByRole('tooltip').waitFor({ state: 'hidden' });
    }
    const code = panel.getByRole('region', { name: `MUI ${name} — полный React-код`, exact: true });
    assert.equal(await code.locator('code').textContent(), sources[name]);
    assert.equal(await panel.getByRole('region', { name: 'MUI — общий визуальный адаптер', exact: true }).locator('code').textContent(), adapter);
    for (const [label, expected] of [[`MUI ${name} — полный React-код`, sources[name]], ['MUI — общий визуальный адаптер', adapter]]) {
      await panel.getByRole('button', { name: `Скопировать: ${label}`, exact: true }).click();
      await panel.getByRole('button', { name: `Скопировано: ${label}`, exact: true }).waitFor();
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expected);
    }
    results.push({ name, interaction: 'PASS', exactSourceAndCopy: 'PASS' });
  }

  // Board keyboard navigation is distinct from demo Tabs and mounts one demo only.
  await choose('Button');
  await nav.getByRole('tab', { name: 'Button', exact: true }).press('ArrowRight');
  assert.equal(await nav.getByRole('tab', { name: 'Badge', exact: true }).evaluate((element) => element === document.activeElement), true);
  await page.keyboard.press('Enter');
  assert.equal(await nav.getByRole('tab', { name: 'Badge', exact: true }).getAttribute('aria-selected'), 'true');
  const ids = await page.locator('[id]').evaluateAll((elements) => elements.map((element) => element.id));
  assert.equal(new Set(ids).size, ids.length);
  for (const name of names) {
    const id = await nav.getByRole('tab', { name, exact: true }).getAttribute('aria-controls');
    assert.equal(await page.locator(`[id="${id}"]`).count(), 1);
  }

  // Nonmodal overlays disappear when their owning demo unmounts.
  await choose('Combobox');
  await page.getByRole('combobox').fill('Про');
  await page.getByRole('listbox').waitFor();
  await choose('Button');
  assert.equal(await page.getByRole('listbox').count(), 0);
  await choose('Tooltip');
  await page.getByRole('button', { name: 'О подсказке' }).hover();
  await settledTooltip();
  await choose('Button');
  await page.getByRole('tooltip').waitFor({ state: 'hidden' });
  assert.match(await page.locator('.component-standard-presentation').innerText(), /Создано заявок: 0/);

  const responsive = [];
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const name of names) {
      await choose(name);
      // MUI scrolls the newly selected tab smoothly; wait for its actual visible position.
      await page.waitForFunction((id) => {
        const tab = document.getElementById(id);
        const r = tab.getBoundingClientRect();
        const viewport = tab.closest('.MuiTabs-scroller').getBoundingClientRect();
        return r.left >= viewport.left - 1 && r.right <= viewport.right + 1;
      }, `pilot-board-tab-${name.toLowerCase()}`, { timeout: 5000 }).catch(async (error) => {
        const geometry = await nav.getByRole('tab', { name, exact: true }).evaluate((tab) => ({ tab: tab.getBoundingClientRect().toJSON(), scroller: tab.closest('.MuiTabs-scroller').getBoundingClientRect().toJSON() }));
        throw new Error(`${name} at ${width}: ${JSON.stringify(geometry)}`, { cause: error });
      });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${name} page overflow ${width}`);
    }
    for (const name of ['TextField', 'TextArea', 'Combobox', 'MultiSelect']) {
      const panel = await choose(name);
      const geometry = await panel.locator('.component-standard-presentation').evaluate((shell) => {
        const s = getComputedStyle(shell);
        const available = shell.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight);
        return { width: shell.querySelector('[data-demo-stage]').firstElementChild.getBoundingClientRect().width, expected: Math.min(400, available) };
      });
      assert.ok(Math.abs(geometry.width - geometry.expected) < 1, `${name}: ${JSON.stringify(geometry)}`);
    }
    await page.setViewportSize({ width, height: 360 });
    await choose('Combobox');
    await page.getByRole('combobox').fill('Про');
    await page.getByRole('listbox').waitFor();
    const listbox = await page.getByRole('listbox').boundingBox();
    assert.ok(listbox && listbox.x >= 0 && listbox.x + listbox.width <= width && listbox.y >= 0 && listbox.y + listbox.height <= 360);
    await page.keyboard.press('Escape');
    await page.getByRole('listbox').waitFor({ state: 'hidden' });
    await choose('Tooltip');
    await page.getByRole('button', { name: 'О подсказке' }).hover();
    await settledTooltip();
    const tip = await page.getByRole('tooltip').boundingBox();
    assert.ok(tip && tip.x >= 0 && tip.x + tip.width <= width && tip.y >= 0 && tip.y + tip.height <= 360);
    await page.keyboard.press('Escape');
    await page.getByRole('tooltip').waitFor({ state: 'hidden' });
    responsive.push({ width, tabsReachable: 12, fields: 'PASS', shortViewportOverlays: 'PASS' });
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ status: 'PASS', demos: results, responsive, consoleErrors: errors, canonicalTokens: 'UNCHANGED' }, null, 2));
  await context.close();
} finally { await browser.close(); }
