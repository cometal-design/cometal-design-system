import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, IconButton, Tooltip, Widget, WidgetToolbarIcon, widgetFigmaLinks, widgetGeometry } from '@cometal/react';

export function ApprovedWidgetToolbar() {
  return <><IconButton size="m" variant="secondary" aria-label="Фильтры" icon={<WidgetToolbarIcon type="filter" />} /><IconButton size="m" variant="secondary" aria-label="Обновить" icon={<WidgetToolbarIcon type="refresh" />} /><IconButton size="m" variant="secondary" aria-label="Экспорт" icon={<WidgetToolbarIcon type="download" />} /><Button size="m" startIcon={<WidgetToolbarIcon type="plus" inverse />}>Добавить запись</Button></>;
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

export const Overview: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await expect(canvas.getByRole('region', { name: 'Спецификация позиций' })).toBeVisible(); await expect(canvas.getByRole('toolbar', { name: 'Действия виджета' })).toBeVisible(); await expect(canvas.getAllByRole('button')).toHaveLength(4); } };

export const Anatomy: Story = { render: () => <div className="ds-widget-anatomy"><Widget title="01 · Title" description="02 · Description" toolbar={<Button size="m" variant="secondary">03 · Toolbar</Button>}><Placeholder>04 · Content slot</Placeholder></Widget></div> };

export const OptionalRegions: Story = { render: () => <div className="ds-widget-permutations"><Widget title="Description + toolbar" description="Optional description" toolbar={<Button size="m">Action</Button>}><Placeholder /></Widget><Widget title="Toolbar only" toolbar={<Button size="m">Action</Button>}><Placeholder /></Widget><Widget title="Description only" description="Optional description"><Placeholder /></Widget><Widget title="Title + content"><Placeholder /></Widget></div> };

export const ContentSwap: Story = { render: () => <div className="ds-widget-permutations"><Widget title="Form content" toolbar={<ApprovedWidgetToolbar />}><form className="ds-widget-form-demo"><label>Название<input defaultValue="Спецификация" /></label><Button size="m">Сохранить</Button></form></Widget><Widget title="Overlay content"><div className="ds-widget-overlay-proof"><Tooltip content="Overlay выходит за границы content slot" defaultOpen placement="bottom-center"><Button size="m" variant="secondary">Фокус и overlay</Button></Tooltip></div></Widget></div> };

export const Geometry: Story = { render: () => <div className="ds-widget-geometry"><Widget title="Token geometry" description="Computed style должен совпасть с source" toolbar={<ApprovedWidgetToolbar />}><Placeholder /></Widget><dl><div><dt>Outer radius</dt><dd>{widgetGeometry.outerRadius}px</dd></div><div><dt>Inset / section gap</dt><dd>{widgetGeometry.inset}px</dd></div><div><dt>Header padding / gap</dt><dd>{widgetGeometry.headerPaddingBlock}px / {widgetGeometry.headerGap}px</dd></div><div><dt>Toolbar gap</dt><dd>{widgetGeometry.toolbarGap}px</dd></div><div><dt>Inner radius</dt><dd>{widgetGeometry.innerRadius}px</dd></div></dl></div>, play: async ({ canvasElement }) => { const widget = canvasElement.querySelector<HTMLElement>('.cometal-widget')!; const header = canvasElement.querySelector<HTMLElement>('.cometal-widget__header')!; const content = canvasElement.querySelector<HTMLElement>('.cometal-widget__content')!; const toolbar = canvasElement.querySelector<HTMLElement>('.cometal-widget__toolbar')!; const style = getComputedStyle(widget); await expect(style.borderRadius).toBe('32px'); await expect(style.paddingTop).toBe('24px'); await expect(style.gap).toBe('24px'); await expect(style.overflow).toBe('visible'); await expect(getComputedStyle(header).paddingTop).toBe('16px'); await expect(getComputedStyle(toolbar).gap).toBe('8px'); await expect(getComputedStyle(content).borderRadius).toBe('8px'); } };

export const Responsive: Story = { render: () => <div style={{ maxWidth: 390 }}><Widget title="Узкий Widget с длинным заголовком" description="Toolbar переносится целиком и ни одно действие не скрывается." toolbar={<ApprovedWidgetToolbar />}><Placeholder /></Widget></div> };

export const Playground: Story = { play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.tab(); await expect(canvas.getByRole('button', { name: 'Фильтры' })).toHaveFocus(); await userEvent.tab(); await expect(canvas.getByRole('button', { name: 'Обновить' })).toHaveFocus(); await expect(canvas.getByRole('button', { name: 'Добавить запись' })).toBeVisible(); } };
