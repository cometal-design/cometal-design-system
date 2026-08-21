import { createRequire } from 'node:module';

const requireFromStorybook = createRequire(new URL('../apps/storybook/package.json', import.meta.url));
const { chromium } = requireFromStorybook('playwright');

const portalBase = 'http://127.0.0.1:3000';
const storybookBase = 'http://127.0.0.1:6006';
const viewports = [
  ['desktop', 1440, 900], ['tablet-landscape', 1024, 768], ['tablet-portrait', 768, 1024],
  ['mobile', 390, 844], ['mobile-small', 360, 800],
];
const portalRoutes = ['/components/', '/components/table/', '/components/table/cells/', '/components/table/headers/', '/components/table/columns/', '/components/table/paginator/', '/components/widget/', '/components/context-menu/', '/patterns/', '/patterns/widget-table/'];
const storyIds = ['components-table--overview', 'components-table--cells', 'components-table--headers', 'components-table--paginator', 'components-widget--overview', 'components-widget--geometry', 'components-context-menu--overview', 'patterns-widget-with-table--overview'];

const results = [];
const recordConsoleError = (errors, message) => {
  if (message.type() !== 'error') return;
  const value = message.text();
  if (value.includes('/_next/webpack-hmr')) return;
  errors.push(`console:${value}`);
};
const browser = await chromium.launch({ headless: true });
try {
  for (const [viewportName, width, height] of viewports) {
    for (const route of portalRoutes) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('console', (message) => recordConsoleError(errors, message));
      page.on('pageerror', (error) => errors.push(`page:${error.message}`));
      const response = await page.goto(`${portalBase}${route}`, { waitUntil: 'networkidle' });
      const evidence = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, h1: document.querySelectorAll('h1').length, tables: document.querySelectorAll('table').length, regions: document.querySelectorAll('[role="region"]').length }));
      results.push({ surface: 'portal', viewportName, route, status: response?.status(), ...evidence, errors });
      await page.close();
    }
  }

  for (const [viewportName, width, height] of [viewports[0], viewports[3], viewports[4]]) {
    for (const id of storyIds) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('console', (message) => recordConsoleError(errors, message));
      page.on('pageerror', (error) => errors.push(`page:${error.message}`));
      const response = await page.goto(`${storybookBase}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
      const evidence = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, tables: document.querySelectorAll('table').length, menus: document.querySelectorAll('[role="menu"]').length }));
      results.push({ surface: 'storybook', viewportName, route: id, status: response?.status(), ...evidence, errors });
      await page.close();
    }
  }

  const pattern = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pattern.goto(`${storybookBase}/iframe.html?id=patterns-widget-with-table--overview&viewMode=story`, { waitUntil: 'networkidle' });
  await pattern.waitForTimeout(1000);
  await pattern.getByRole('button', { name: 'Действия колонки Позиция' }).click();
  const menu = pattern.getByRole('menu', { name: 'Действия колонки Позиция' });
  await menu.waitFor({ state: 'visible' });
  const menuVisible = await menu.isVisible();
  await pattern.keyboard.press('Escape');
  await pattern.getByRole('button', { name: 'Compact' }).click();
  const patternEvidence = await pattern.evaluate((menuVisible) => {
    const widget = document.querySelector('.cometal-widget');
    const content = document.querySelector('.cometal-widget__content');
    const table = document.querySelector('table[aria-label="Спецификация позиций"]');
    return { widgetRadius: widget ? getComputedStyle(widget).borderRadius : null, widgetPadding: widget ? getComputedStyle(widget).paddingTop : null, contentRadius: content ? getComputedStyle(content).borderRadius : null, density: table?.getAttribute('data-density'), rows: table?.querySelectorAll('tr').length, filterRows: table?.querySelectorAll('.cometal-table__filter-row').length, menuVisible };
  }, menuVisible);
  results.push({ surface: 'interaction', viewportName: 'mobile', route: 'patterns-widget-with-table--overview', status: 200, overflow: 0, errors: [], ...patternEvidence });
  await pattern.close();
} finally {
  await browser.close();
}

const failures = results.filter((result) => result.status !== 200 || result.overflow > 1 || result.errors.length || (result.surface === 'portal' && result.h1 !== 1));
const patternResult = results.find((result) => result.surface === 'interaction');
const patternFailure = !patternResult || patternResult.widgetRadius !== '32px' || patternResult.widgetPadding !== '24px' || patternResult.contentRadius !== '8px' || patternResult.density !== 'compact' || patternResult.rows !== 13 || patternResult.filterRows !== 1 || !patternResult.menuVisible;
console.log(JSON.stringify({ checks: results.length, failures, patternResult, verdict: failures.length === 0 && !patternFailure ? 'PASS' : 'FAIL' }, null, 2));
if (failures.length || patternFailure) process.exitCode = 1;
