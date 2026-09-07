'use client';

import { useState } from 'react';
import { Select, Switch, Tab, TabList, TabPanel, Tabs, TextField } from '@cometal/react';
import type { TabSize } from '@cometal/react';
import { ComponentPageSetting, ComponentPageSettings } from './component-page-settings';

const sizeOptions = [
  { value: 'l', label: 'L' },
  { value: 'm', label: 'M' },
  { value: 's', label: 'S' },
];

export function TabsSettings() {
  const [size, setSize] = useState<TabSize>('l');
  const [firstLabel, setFirstLabel] = useState('Обзор');
  const [disabledLast, setDisabledLast] = useState(false);
  const [value, setValue] = useState('overview');
  const effectiveLabel = firstLabel.trim() || 'Обзор';
  const code = `'use client';

import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from '@cometal/react';

export function ProjectTabs() {
  const [value, setValue] = useState(${JSON.stringify(value)});

  return (
    <Tabs value={value} onValueChange={setValue} size=${JSON.stringify(size)}>
      <TabList aria-label="Разделы проекта">
        <Tab value="overview">{${JSON.stringify(effectiveLabel)}}</Tab>
        <Tab value="history">История</Tab>
        <Tab value="files"${disabledLast ? ' disabled' : ''}>Файлы</Tab>
      </TabList>
      <TabPanel value="overview" tabIndex={-1}>{null}</TabPanel>
      <TabPanel value="history" tabIndex={-1}>{null}</TabPanel>
      <TabPanel value="files" tabIndex={-1}>{null}</TabPanel>
    </Tabs>
  );
}`;

  function reset() {
    setSize('l');
    setFirstLabel('Обзор');
    setDisabledLast(false);
    setValue('overview');
  }

  const preview = (
    <div className="component-standard-tabs-preview">
      <Tabs value={value} onValueChange={setValue} size={size}>
        <TabList aria-label="Разделы проекта">
          <Tab value="overview">{effectiveLabel}</Tab>
          <Tab value="history">История</Tab>
          <Tab value="files" disabled={disabledLast}>Файлы</Tab>
        </TabList>
        <TabPanel value="overview" tabIndex={-1}>{null}</TabPanel>
        <TabPanel value="history" tabIndex={-1}>{null}</TabPanel>
        <TabPanel value="files" tabIndex={-1}>{null}</TabPanel>
      </Tabs>
    </div>
  );

  return (
    <section className="content-section component-standard-settings-section">
      <ComponentPageSettings componentName="Tabs" preview={preview} code={code} onReset={reset} note={<>Пакет <code>@cometal/react</code> пока подключается как workspace-зависимость. Orientation и automatic activation не входят в текущий контракт.</>}>
        <ComponentPageSetting name="size" type="'l' | 'm' | 's'" defaultValue="'l'" description="Высота вкладок и индикатора.">
          <Select label="Размер" size="m" options={sizeOptions} value={size} onValueChange={(next) => setSize(next as TabSize)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="children" type="TabList + TabPanel[]" defaultValue="required" description="Каждому Tab нужна одна панель с тем же value.">
          <TextField label="Первая вкладка" size="m" value={firstLabel} helperText={!firstLabel.trim() ? 'Используется безопасная подпись «Обзор».' : undefined} onChange={(event) => setFirstLabel(event.currentTarget.value)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="Tab.disabled" type="boolean" defaultValue="false" description="Disabled вкладка пропускается клавиатурной навигацией.">
          <Switch label="Отключить вкладку «Файлы»" size="m" checked={disabledLast} onChange={(event) => { setDisabledLast(event.currentTarget.checked); if (event.currentTarget.checked && value === 'files') setValue('overview'); }} />
        </ComponentPageSetting>
      </ComponentPageSettings>
    </section>
  );
}
