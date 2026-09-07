'use client';

import type { FocusEvent } from 'react';
import { Tab, TabList } from '@cometal/react';

export function ButtonPageTabList() {
  function keepFocusedTabVisible(event: FocusEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || target.getAttribute('role') !== 'tab') return;
    target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  return (
    <TabList aria-label="Разделы документации Button" onFocusCapture={keepFocusedTabVisible}>
      <Tab value="overview">Overview</Tab>
      <Tab value="react-api">React API</Tab>
      <Tab value="accessibility">Accessibility</Tab>
    </TabList>
  );
}
