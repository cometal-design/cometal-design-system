import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Tab, TabList, TabPanel, Tabs, tabSizes } from './Tabs';

function BasicTabs({ value, defaultValue }: { value?: string; defaultValue?: string }) {
  return (
    <Tabs value={value} defaultValue={defaultValue} aria-label="Root">
      <TabList aria-label="Разделы карточки">
        <Tab value="overview">Обзор</Tab>
        <Tab value="history">История</Tab>
        <Tab value="files" disabled>Файлы</Tab>
      </TabList>
      <TabPanel value="overview">Сводка</TabPanel>
      <TabPanel value="history">Изменения</TabPanel>
      <TabPanel value="files">Вложения</TabPanel>
    </Tabs>
  );
}

function OpaqueTabContent() {
  return (
    <>
      <TabList aria-label="Opaque tabs">
        <Tab value="overview">Обзор</Tab>
        <Tab value="history">История</Tab>
      </TabList>
      <TabPanel value="overview">Сводка</TabPanel>
      <TabPanel value="history">Изменения</TabPanel>
    </>
  );
}

describe('Tabs', () => {
  it('publishes the exact L/M/S size contract', () => {
    expect(tabSizes).toEqual(['l', 'm', 's']);
  });

  it('renders the first enabled tab by default with stable ARIA relationships', () => {
    const html = renderToStaticMarkup(<BasicTabs />);
    const tabId = html.match(/id="([^"]+-tab-6f-76-65-72-76-69-65-77)"/)?.[1];
    const panelId = html.match(/id="([^"]+-panel-6f-76-65-72-76-69-65-77)"/)?.[1];

    expect(tabId).toBeTruthy();
    expect(panelId).toBeTruthy();
    expect(html).toContain('data-cometal-component="tabs"');
    expect(html).toContain('data-size="l"');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-orientation="horizontal"');
    expect(html).toContain(`aria-controls="${panelId}"`);
    expect(html).toContain(`aria-labelledby="${tabId}"`);
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('hidden=""');
  });

  it('honors controlled and uncontrolled initial selection without unmounting panels', () => {
    const controlled = renderToStaticMarkup(<BasicTabs value="history" />);
    const uncontrolled = renderToStaticMarkup(<BasicTabs defaultValue="history" />);

    for (const html of [controlled, uncontrolled]) {
      expect(html).toMatch(/aria-selected="true"[^>]*>.*История/s);
      expect(html).toContain('Сводка');
      expect(html).toContain('Изменения');
      expect((html.match(/role="tabpanel"/g) ?? [])).toHaveLength(3);
      expect((html.match(/hidden=""/g) ?? [])).toHaveLength(2);
    }
  });

  it('preserves explicit selection in opaque server-rendered composition', () => {
    const controlled = renderToStaticMarkup(<Tabs value="history"><OpaqueTabContent /></Tabs>);
    const uncontrolled = renderToStaticMarkup(<Tabs defaultValue="history"><OpaqueTabContent /></Tabs>);

    for (const html of [controlled, uncontrolled]) {
      expect((html.match(/aria-selected="true"/g) ?? [])).toHaveLength(1);
      expect(html).toMatch(/aria-selected="true"[^>]*tabindex="0"[^>]*>.*История/s);
      expect((html.match(/role="tabpanel"/g) ?? [])).toHaveLength(2);
      expect((html.match(/hidden=""/g) ?? [])).toHaveLength(1);
      expect(html).toMatch(/role="tabpanel"[^>]*tabindex="0"[^>]*>Изменения/);
    }
  });

  it('defers omitted default selection for opaque server-rendered composition', () => {
    const html = renderToStaticMarkup(<Tabs><OpaqueTabContent /></Tabs>);

    expect((html.match(/aria-selected="true"/g) ?? [])).toHaveLength(0);
    expect((html.match(/aria-selected="false"/g) ?? [])).toHaveLength(2);
    expect((html.match(/hidden=""/g) ?? [])).toHaveLength(2);
    expect(html).not.toContain('tabindex="0"');
  });

  it('keeps a disabled selected tab valid while another enabled tab owns the roving entry', () => {
    const html = renderToStaticMarkup(<BasicTabs value="files" />);

    const disabledTab = html.match(/<button[^>]*aria-selected="true"[^>]*disabled=""[^>]*>/)?.[0];
    expect(disabledTab).toContain('role="tab"');
    expect(disabledTab).toContain('aria-disabled="true"');
    expect(disabledTab).toContain('tabindex="-1"');
    expect((html.match(/tabindex="0"/g) ?? [])).toHaveLength(2);
    expect(html).toMatch(/role="tabpanel"[^>]*tabindex="0"[^>]*>Вложения/);
  });

  it('honors the active panel tabIndex override and removes tabIndex while hidden', () => {
    const html = renderToStaticMarkup(
      <Tabs value="history">
        <TabList aria-label="Panel focus contract"><Tab value="overview">Overview</Tab><Tab value="history">History</Tab></TabList>
        <TabPanel value="overview" tabIndex={0}>Overview panel</TabPanel>
        <TabPanel value="history" tabIndex={-1}>History panel</TabPanel>
      </Tabs>,
    );
    const hiddenPanel = html.match(/<div[^>]*role="tabpanel"[^>]*hidden=""[^>]*>Overview panel<\/div>/)?.[0];
    const activePanel = html.match(/<div[^>]*role="tabpanel"[^>]*>History panel<\/div>/)?.[0];

    expect(hiddenPanel).toBeTruthy();
    expect(hiddenPanel).not.toContain('tabindex=');
    expect(activePanel).toContain('tabindex="-1"');
  });

  it('renders no selected panel and no roving tab when every item is disabled', () => {
    const html = renderToStaticMarkup(
      <Tabs>
        <TabList aria-label="Disabled tabs"><Tab value="one" disabled>One</Tab></TabList>
        <TabPanel value="one">Panel</TabPanel>
      </Tabs>,
    );

    expect(html).toContain('aria-selected="false"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('hidden=""');
    expect(html).not.toContain('tabindex="0"');
  });

  it('supports arbitrary item counts and forwards all four root refs', () => {
    const values = Array.from({ length: 11 }, (_, index) => `tab-${index + 1}`);
    const tabsRef = createRef<HTMLDivElement>();
    const listRef = createRef<HTMLDivElement>();
    const tabRef = createRef<HTMLButtonElement>();
    const panelRef = createRef<HTMLDivElement>();
    const html = renderToStaticMarkup(
      <Tabs ref={tabsRef}>
        <TabList ref={listRef} aria-label="Many tabs">
          {values.map((item, index) => <Tab key={item} ref={index === 0 ? tabRef : undefined} value={item}>{item}</Tab>)}
        </TabList>
        {values.map((item, index) => <TabPanel key={item} ref={index === 0 ? panelRef : undefined} value={item}>{item}</TabPanel>)}
      </Tabs>,
    );

    expect((html.match(/role="tab"/g) ?? [])).toHaveLength(11);
    expect((html.match(/role="tabpanel"/g) ?? [])).toHaveLength(11);
  });

  it('binds selected interaction states to canonical tokens and leaves focus to Button', () => {
    const css = readFileSync(new URL('./tabs.css', import.meta.url), 'utf8');

    expect(css).toContain("[data-selected='true']:hover:not([data-disabled='true'])");
    expect(css).toContain('--cometal-semantic-color-global-action-brand-hover');
    expect(css).toContain("[data-selected='true'] > .cometal-tabs__trigger:active:not(:disabled) + .cometal-tabs__indicator");
    expect(css).toContain('--cometal-semantic-color-global-action-brand-pressed');
    expect(css).toContain("[data-selected='true'][data-disabled='true']");
    expect(css).toContain('--cometal-semantic-color-global-text-disabled');
    expect(css).not.toContain('.cometal-tabs__trigger.cometal-button:focus-visible');
    expect(css).not.toContain('.cometal-tabs__item:has(');
  });
});
