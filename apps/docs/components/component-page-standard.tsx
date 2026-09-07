'use client';

import type { FocusEvent, ReactNode } from 'react';
import { Tab, TabList, TabPanel, Tabs } from '@cometal/react';
import { ComponentPageHeader } from './component-page-header';

export type ComponentPageSection = 'overview' | 'settings' | 'accessibility';

type ComponentPageStandardProps = {
  title: string;
  summary: string;
  status: string;
  statusLabel: string;
  stableId: string;
  reactExport: string;
  figmaHref: string;
  storybookHref: string;
  sourceHref?: string;
  overview: ReactNode;
  settings: ReactNode;
  accessibility: ReactNode;
  onSectionChange?: (section: ComponentPageSection) => void;
};

function ComponentPagePanels({ overview, settings, accessibility }: Pick<ComponentPageStandardProps, 'overview' | 'settings' | 'accessibility'>) {
  return (
    <>
      <TabPanel value="overview" className="component-standard-tabs__panel" tabIndex={-1}>{overview}</TabPanel>
      <TabPanel value="settings" className="component-standard-tabs__panel" tabIndex={-1}>{settings}</TabPanel>
      <TabPanel value="accessibility" className="component-standard-tabs__panel" tabIndex={-1}>{accessibility}</TabPanel>
    </>
  );
}

export function ComponentPageStandard({
  title,
  summary,
  status,
  statusLabel,
  stableId,
  reactExport,
  figmaHref,
  storybookHref,
  sourceHref,
  overview,
  settings,
  accessibility,
  onSectionChange,
}: ComponentPageStandardProps) {
  function keepFocusedTabVisible(event: FocusEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'tab') return;
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function selectSection(nextSection: string) {
    const next = nextSection as ComponentPageSection;
    onSectionChange?.(next);
  }

  const pageTabs = (
    <TabList aria-label={`Разделы документации ${title}`} onFocusCapture={keepFocusedTabVisible}>
      <Tab value="overview">Обзор</Tab>
      <Tab value="settings">Настройки</Tab>
      <Tab value="accessibility">Доступность</Tab>
    </TabList>
  );

  return (
    <main className="content-page component-detail component-detail--standard">
      <Tabs defaultValue="overview" onValueChange={selectSection} size="m" className="component-standard-tabs">
        <div data-component-phase="identity">
          <ComponentPageHeader
            title={title}
            summary={summary}
            status={status}
            statusLabel={statusLabel}
            figmaHref={figmaHref}
            playgroundHref={storybookHref}
            playgroundLabel="Storybook ↗"
            sourceHref={sourceHref}
            linkSize="m"
            statusAtTop
            hideEyebrow
            identityLabel={<>ID: <code>{stableId}</code> · React: {reactExport} · @cometal/react</>}
            compactSummary
            identityAfterSummary
            linksAtEnd
            toolbarStart={pageTabs}
          />
        </div>

        <ComponentPagePanels overview={overview} settings={settings} accessibility={accessibility} />
      </Tabs>
    </main>
  );
}
