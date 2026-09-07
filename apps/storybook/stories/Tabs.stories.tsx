import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Tab, TabList, TabPanel, Tabs, tabSizes } from '@cometal/react';
import { ComponentCodeExample } from './ComponentCodeExample';

const SOURCE_URL = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Tabs/Tabs.tsx';
const sourceStates = ['Default', 'Hover', 'Pressed', 'Disabled'] as const;

function PanelCounter({ label }: { label: string }) {
  const [count, setCount] = useState(0);
  return <div><p>{label}: {count}</p><Button size="s" onClick={() => setCount((current) => current + 1)}>Увеличить {label}</Button></div>;
}

function InteractionExample() {
  const [items, setItems] = useState([
    { value: 'overview', label: 'Обзор' },
    { value: 'history', label: 'История' },
    { value: 'files', label: 'Файлы' },
    { value: 'access', label: 'Доступ', disabled: true },
  ]);
  return (
    <div className="ds-tabs-interaction">
      <Tabs defaultValue="overview" size="m">
        <TabList aria-label="Разделы проекта">
          {items.map((item) => <Tab key={item.value} value={item.value} disabled={item.disabled}>{item.label}</Tab>)}
        </TabList>
        {items.map((item) => <TabPanel key={item.value} value={item.value}><PanelCounter label={item.label} /></TabPanel>)}
      </Tabs>
      <div className="ds-tabs-actions">
        <Button size="s" variant="secondary" onClick={() => setItems((current) => current.filter((item) => item.value !== 'history'))}>Удалить Историю</Button>
        <Button size="s" variant="secondary" onClick={() => setItems((current) => [{ value: 'settings', label: 'Настройки' }, ...current])}>Добавить Настройки</Button>
        <Button size="s" variant="secondary" onClick={() => setItems((current) => [...current].reverse())}>Изменить порядок</Button>
      </div>
    </div>
  );
}

function ControlledExample() {
  const [value, setValue] = useState('overview');
  const [changes, setChanges] = useState<string[]>([]);
  return (
    <div className="ds-tabs-standalone">
      <Tabs value={value} onValueChange={(nextValue) => { setValue(nextValue); setChanges((current) => [...current, nextValue]); }} size="m">
        <TabList aria-label="Controlled tabs"><Tab value="overview">Обзор</Tab><Tab value="history">История</Tab><Tab value="files">Файлы</Tab></TabList>
        <TabPanel value="overview">Обзор</TabPanel><TabPanel value="history">История</TabPanel><TabPanel value="files">Файлы</TabPanel>
      </Tabs>
      <output aria-label="Изменения значения">{changes.join(',') || 'none'}</output>
    </div>
  );
}

function SourceMatrix() {
  return (
    <div className="ds-tabs-source-matrix">
      {tabSizes.flatMap((size) => sourceStates.flatMap((state) => ([false, true] as const).map((selected) => {
        const key = `${size}-${state}-${selected ? 'selected' : 'unselected'}`;
        return (
          <article key={key} data-source-combination={key}>
            <code>{size.toUpperCase()} · {state} · {selected ? 'Selected' : 'Unselected'}</code>
            <Tabs value={selected ? 'target' : 'other'} size={size}>
              <TabList aria-label={`Source ${key}`}>
                <Tab value="target" disabled={state === 'Disabled'}>Вкладка</Tab>
                <Tab value="other">Другая</Tab>
              </TabList>
              <TabPanel value="target">Target panel</TabPanel>
              <TabPanel value="other">Other panel</TabPanel>
            </Tabs>
          </article>
        );
      })))}
    </div>
  );
}

function ResponsiveCounts() {
  const labels = ['Обзор', 'История', 'Файлы', 'Участники', 'Согласования', 'Комментарии', 'Связанные документы', 'Журнал изменений', 'Настройки'];
  return (
    <div className="ds-tabs-responsive-grid">
      {[1, 4, labels.length].map((count) => (
        <article key={count} data-tabs-count={count}>
          <code>{count} item{count === 1 ? '' : 's'}</code>
          <div className="ds-tabs-consumer-scroll" data-consumer-scroll>
            <Tabs defaultValue="tab-0" size="s">
              <TabList aria-label={`${count} вкладок`}>
                {labels.slice(0, count).map((label, index) => <Tab key={label} value={`tab-${index}`}>{label}</Tab>)}
              </TabList>
              {labels.slice(0, count).map((label, index) => <TabPanel key={label} value={`tab-${index}`}>{label}</TabPanel>)}
            </Tabs>
          </div>
        </article>
      ))}
    </div>
  );
}

function OverviewPage() {
  return (
    <main className="ds-component-page">
      <header className="ds-component-hero"><div><span className="ds-eyebrow">COMPONENT · WEB · CANDIDATE</span><h1>Tabs</h1><p>Переключает связанные persistent panels внутри текущего контекста. Selection и focus остаются раздельными до явной активации.</p></div><a href="https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1572-181" target="_blank" rel="noreferrer">Открыть в Figma ↗</a></header>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Рабочий пример</h2><p>Manual activation, disabled skip, persistent panel state и dynamic removal работают через публичный compound API.</p></div></div><InteractionExample /></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Размеры и source states</h2><p>24 комбинации Figma: L/M/S × Default/Hover/Pressed/Disabled × Selected/Unselected. Focus проверяется независимо клавиатурой.</p></div></div><SourceMatrix /></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>Count и overflow</h2><p>Один, четыре и длинный набор остаются одной intrinsic nowrap строкой; scroll принадлежит consumer.</p></div></div><ResponsiveCounts /></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>04</span><div><h2>Код</h2><p>Public API: Tabs, TabList, Tab и persistent TabPanel.</p></div></div><ComponentCodeExample componentId="navigation.tabs" componentName="Tabs" sourceHref={SOURCE_URL} /></section>
    </main>
  );
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: { children: null },
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Обзор',
  render: () => <OverviewPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tablist = canvas.getByRole('tablist', { name: 'Разделы проекта' });
    const tabs = within(tablist).getAllByRole('tab');
    const [overview, history, files, access] = tabs;

    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await expect(overview).toHaveAttribute('tabindex', '0');
    await expect(access).toBeDisabled();
    await expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
    const selectedIndicator = overview.closest<HTMLElement>('.cometal-tabs__item')!.querySelector<HTMLElement>('.cometal-tabs__indicator')!;
    const resolveColor = (token: string) => {
      const probe = canvasElement.ownerDocument.createElement('span');
      probe.style.color = `var(${token})`;
      canvasElement.append(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      return color;
    };
    await expect(getComputedStyle(selectedIndicator).backgroundColor).toBe(resolveColor('--cometal-semantic-color-global-action-brand-default'));
    overview.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(history).toHaveFocus();
    await expect(overview).toHaveAttribute('aria-selected', 'true');
    const focusedItem = history.closest<HTMLElement>('.cometal-tabs__item')!;
    const focusedButtonStyle = getComputedStyle(history);
    const focusLayer = getComputedStyle(focusedItem, '::before');
    await expect(focusedButtonStyle.outlineWidth).toBe('2px');
    await expect(focusedButtonStyle.outlineOffset).toBe('2px');
    await expect(focusLayer.content).toBe('none');
    await expect(focusedItem.getBoundingClientRect().height).toBe(48);
    await expect(focusedItem.querySelector<HTMLElement>('.cometal-tabs__indicator')!.getBoundingClientRect().top - history.getBoundingClientRect().bottom).toBe(6);
    await userEvent.keyboard('{End}');
    await expect(files).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(overview).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(files).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(overview).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(history).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel', { name: 'История' })).toBeVisible();
    await userEvent.keyboard('{ArrowRight} ');
    await expect(files).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(history);
    await userEvent.click(canvas.getByRole('button', { name: 'Увеличить История' }));
    await userEvent.click(overview);
    await userEvent.click(history);
    await expect(canvas.getByText('История: 1')).toBeVisible();
    history.focus();
    canvas.getByRole('button', { name: 'Удалить Историю' }).click();
    await waitFor(() => expect(within(tablist).queryByRole('tab', { name: 'История' })).not.toBeInTheDocument());
    await expect(files).toHaveAttribute('aria-selected', 'true');
    await expect(files).toHaveFocus();
    canvas.getByRole('button', { name: 'Добавить Настройки' }).click();
    await waitFor(() => expect(within(tablist).getByRole('tab', { name: 'Настройки' })).toBeInTheDocument());
    await expect(files).toHaveAttribute('aria-selected', 'true');
    canvas.getByRole('button', { name: 'Изменить порядок' }).click();
    await waitFor(() => expect(within(tablist).getAllByRole('tab')[1]).toBe(files));
    await expect(files).toHaveAttribute('aria-selected', 'true');

    const relationshipTabs = within(tablist).getAllByRole('tab');
    for (const tab of relationshipTabs) {
      const panelId = tab.getAttribute('aria-controls');
      await expect(panelId).toBeTruthy();
      await expect(canvasElement.ownerDocument.getElementById(panelId!)).toHaveAttribute('aria-labelledby', tab.id);
    }

    const mediumItem = tablist.querySelector<HTMLElement>('.cometal-tabs__item')!;
    const mediumButton = mediumItem.querySelector<HTMLElement>('.cometal-tabs__trigger')!;
    const mediumIndicator = mediumItem.querySelector<HTMLElement>('.cometal-tabs__indicator')!;
    await expect(mediumButton.getBoundingClientRect().height).toBe(40);
    await expect(mediumIndicator.getBoundingClientRect().height).toBe(2);
    await expect(mediumItem.getBoundingClientRect().height).toBe(48);
    await expect(Number.parseFloat(getComputedStyle(mediumItem).gap)).toBe(6);
    await expect(Number.parseFloat(getComputedStyle(tablist).gap)).toBe(4);
    await expect(canvasElement.querySelectorAll('[data-source-combination]')).toHaveLength(24);
    const disabledSelectedIndicator = canvasElement.querySelector<HTMLElement>('[data-source-combination="m-Disabled-selected"] .cometal-tabs__indicator')!;
    await expect(getComputedStyle(disabledSelectedIndicator).backgroundColor).toBe(resolveColor('--cometal-semantic-color-global-text-disabled'));
    for (const [size, triggerHeight, itemHeight] of [['l', 48, 56], ['m', 40, 48], ['s', 32, 40]] as const) {
      const sourceItem = canvasElement.querySelector<HTMLElement>(`[data-source-combination="${size}-Default-selected"] .cometal-tabs__item`)!;
      await expect(sourceItem.querySelector<HTMLElement>('.cometal-tabs__trigger')!.getBoundingClientRect().height).toBe(triggerHeight);
      await expect(sourceItem.getBoundingClientRect().height).toBe(itemHeight);
    }
    await expect(canvasElement.querySelector('[data-tabs-count="1"] [role="tablist"]')?.children).toHaveLength(1);
    await expect(canvasElement.querySelector('[data-tabs-count="4"] [role="tablist"]')?.children).toHaveLength(4);
    await expect(canvasElement.querySelector('[data-tabs-count="9"] [role="tablist"]')?.children).toHaveLength(9);
  },
};

export const Controlled: Story = {
  name: 'Controlled',
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole('tab', { name: 'Обзор' });
    const history = canvas.getByRole('tab', { name: 'История' });
    const files = canvas.getByRole('tab', { name: 'Файлы' });
    await userEvent.click(history);
    await expect(canvas.getByLabelText('Изменения значения')).toHaveTextContent('history');
    await userEvent.click(history);
    await expect(canvas.getByLabelText('Изменения значения')).toHaveTextContent(/^history$/);
    history.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(files).toHaveFocus();
    await expect(history).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByLabelText('Изменения значения')).toHaveTextContent(/^history$/);
    await userEvent.keyboard(' ');
    await expect(files).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByLabelText('Изменения значения')).toHaveTextContent('history,files');
    await userEvent.click(overview);
    await expect(canvas.getByLabelText('Изменения значения')).toHaveTextContent('history,files,overview');
  },
};

export const RtlManualActivation: Story = {
  name: 'RTL manual activation',
  render: () => (
    <div className="ds-tabs-standalone" dir="rtl">
      <Tabs defaultValue="one" size="m">
        <TabList aria-label="RTL разделы"><Tab value="one">Первый</Tab><Tab value="two">Второй</Tab><Tab value="three">Третий</Tab></TabList>
        <TabPanel value="one">Один</TabPanel><TabPanel value="two">Два</TabPanel><TabPanel value="three">Три</TabPanel>
      </Tabs>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tabs = within(canvasElement).getAllByRole('tab');
    tabs[0].focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(tabs[1]).toHaveFocus();
    await expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(tabs[0]).toHaveFocus();
  },
};

export const ResponsiveOverflow: Story = {
  name: 'Responsive overflow',
  render: () => <div className="ds-tabs-responsive-story"><ResponsiveCounts /></div>,
  play: async ({ canvasElement }) => {
    const longRegion = canvasElement.querySelector<HTMLElement>('[data-tabs-count="9"] [data-consumer-scroll]')!;
    const list = longRegion.querySelector<HTMLElement>('[role="tablist"]')!;
    await expect(getComputedStyle(list).flexWrap).toBe('nowrap');
    await expect(getComputedStyle(list).overflow).toBe('visible');
    await expect(list.scrollWidth).toBeGreaterThan(longRegion.clientWidth);
    await expect(getComputedStyle(longRegion).overflowX).toBe('auto');
  },
};
