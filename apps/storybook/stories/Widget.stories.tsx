import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, IconButton, TextField, Tooltip, Widget, widgetFigmaLinks, widgetGeometry } from '@cometal/react';
import RefreshIcon, { definition as refreshIconDefinition } from '@cometal/react/icons/outline/arrows/arrow-refresh-01';
import DownloadIcon, { definition as downloadIconDefinition } from '@cometal/react/icons/outline/general/download-01';
import FilterIcon, { definition as filterIconDefinition } from '@cometal/react/icons/outline/general/filter';
import PlusIcon, { definition as plusIconDefinition } from '@cometal/react/icons/outline/general/plus-01';

const approvedToolbarIcons = [filterIconDefinition, refreshIconDefinition, downloadIconDefinition, plusIconDefinition];

function definitionPathData(body: string) {
  return Array.from(body.matchAll(/<path d="([^"]+)"/g), (match) => match[1]);
}

async function expectApprovedWidgetToolbar(root: Element) {
  const toolbar = root.querySelector<HTMLElement>('.cometal-widget__toolbar')!;
  const buttons = Array.from(toolbar.querySelectorAll<HTMLButtonElement>('.cometal-button'));
  const iconContainers = Array.from(toolbar.querySelectorAll<HTMLElement>('.cometal-button__icon'));
  const icons = Array.from(toolbar.querySelectorAll<SVGSVGElement>('svg[data-cometal-icon]'));
  await expect(getComputedStyle(toolbar).gap).toBe('8px');
  await expect(buttons).toHaveLength(4);
  await expect(iconContainers).toHaveLength(4);
  await expect(icons).toHaveLength(4);
  for (const button of buttons.slice(0, 3)) {
    await expect(button).toHaveAttribute('data-variant', 'secondary');
    await expect(button.getBoundingClientRect().width).toBe(40);
    await expect(button.getBoundingClientRect().height).toBe(40);
  }
  await expect(buttons[3]).toHaveAttribute('data-variant', 'primary');
  await expect(buttons[3]?.getBoundingClientRect().height).toBe(40);
  for (const [index, icon] of icons.entries()) {
    await expect(iconContainers[index]?.getBoundingClientRect().width).toBe(16);
    await expect(iconContainers[index]?.getBoundingClientRect().height).toBe(16);
    await expect(icon.getBoundingClientRect().width).toBe(16);
    await expect(icon.getBoundingClientRect().height).toBe(16);
    await expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    await expect(Array.from(icon.querySelectorAll('path'), (path) => path.getAttribute('d'))).toEqual(definitionPathData(approvedToolbarIcons[index]!.body));
    await expect(icon.querySelector('path')).toHaveAttribute('stroke-width', '1.4');
  }
  await expect(approvedToolbarIcons.map((definition) => definition.nodeId)).toEqual(['700:14705', '700:14276', '700:14813', '700:14531']);
}

export function ApprovedWidgetToolbar() {
  return <><IconButton size="m" variant="secondary" aria-label="Фильтры" icon={<FilterIcon />} /><IconButton size="m" variant="secondary" aria-label="Обновить" icon={<RefreshIcon />} /><IconButton size="m" variant="secondary" aria-label="Экспорт" icon={<DownloadIcon />} /><Button size="m" startIcon={<PlusIcon />}>Добавить запись</Button></>;
}

function Placeholder({ children = 'Content slot' }: { children?: string }) {
  return <div className="ds-widget-slot-placeholder">{children}</div>;
}

const meta = {
  title: 'Components/Widget', component: Widget,
  parameters: { layout: 'padded', docs: { description: { component: `Canonical sources: [Main](${widgetFigmaLinks.main}), [Toolbar](${widgetFigmaLinks.toolbar}), [Content slot](${widgetFigmaLinks.content}).` } } },
  args: { title: 'Спецификация позиций', description: '20 строк · данные обновлены сегодня', toolbar: <ApprovedWidgetToolbar />, children: <Placeholder /> },
} satisfies Meta<typeof Widget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await expect(canvas.getByRole('region', { name: 'Спецификация позиций' })).toBeVisible(); await expect(canvas.getByRole('toolbar', { name: 'Действия виджета' })).toBeVisible(); await expect(canvas.getAllByRole('button')).toHaveLength(4); await expectApprovedWidgetToolbar(canvasElement); } };

export const Anatomy: Story = { render: () => <div className="ds-widget-anatomy"><Widget title="01 · Title" description="02 · Description" toolbar={<Button size="m" variant="secondary">03 · Toolbar</Button>}><Placeholder>04 · Content slot</Placeholder></Widget></div> };

export const OptionalRegions: Story = { render: () => <div className="ds-widget-permutations"><Widget title="Description + toolbar" description="Optional description" toolbar={<Button size="m">Action</Button>}><Placeholder /></Widget><Widget title="Toolbar only" toolbar={<Button size="m">Action</Button>}><Placeholder /></Widget><Widget title="Description only" description="Optional description"><Placeholder /></Widget><Widget title="Title + content"><Placeholder /></Widget></div> };

export const ContentSwap: Story = { render: () => <div className="ds-widget-permutations"><Widget title="Form content" toolbar={<ApprovedWidgetToolbar />}><form className="ds-widget-form-demo"><TextField label="Название" defaultValue="Спецификация" size="m" /><Button size="m">Сохранить</Button></form></Widget><Widget title="Overlay content"><div className="ds-widget-overlay-proof"><Tooltip content="Overlay выходит за границы content slot" defaultOpen placement="bottom-center"><Button size="m" variant="secondary">Фокус и overlay</Button></Tooltip></div></Widget></div> };

export const Geometry: Story = { render: () => <div className="ds-widget-geometry"><Widget title="Token geometry" description="Computed style должен совпасть с source" toolbar={<ApprovedWidgetToolbar />}><Placeholder /></Widget><dl><div><dt>Outer radius</dt><dd>{widgetGeometry.outerRadius}px</dd></div><div><dt>Inset / section gap</dt><dd>{widgetGeometry.inset}px</dd></div><div><dt>Header padding / gap</dt><dd>{widgetGeometry.headerPaddingBlock}px / {widgetGeometry.headerGap}px</dd></div><div><dt>Toolbar gap</dt><dd>{widgetGeometry.toolbarGap}px</dd></div><div><dt>Inner radius</dt><dd>{widgetGeometry.innerRadius}px</dd></div></dl></div>, play: async ({ canvasElement }) => { const widget = canvasElement.querySelector<HTMLElement>('.cometal-widget')!; const header = canvasElement.querySelector<HTMLElement>('.cometal-widget__header')!; const content = canvasElement.querySelector<HTMLElement>('.cometal-widget__content')!; const toolbar = canvasElement.querySelector<HTMLElement>('.cometal-widget__toolbar')!; const style = getComputedStyle(widget); await expect(style.borderRadius).toBe('32px'); await expect(style.paddingTop).toBe('24px'); await expect(style.gap).toBe('24px'); await expect(style.overflow).toBe('visible'); await expect(getComputedStyle(header).paddingTop).toBe('16px'); await expect(getComputedStyle(toolbar).gap).toBe('8px'); await expect(getComputedStyle(content).borderRadius).toBe('8px'); } };

export const Responsive: Story = { render: () => <div style={{ maxWidth: 390 }}><Widget title="Узкий Widget с длинным заголовком" description="Toolbar переносится целиком и ни одно действие не скрывается." toolbar={<ApprovedWidgetToolbar />}><Placeholder /></Widget></div> };

export const Playground: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.tab(); await expect(canvas.getByRole('button', { name: 'Фильтры' })).toHaveFocus(); await userEvent.tab(); await expect(canvas.getByRole('button', { name: 'Обновить' })).toHaveFocus(); await expect(canvas.getByRole('button', { name: 'Добавить запись' })).toBeVisible(); } };
