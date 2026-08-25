import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { WidgetTablePattern, WidgetTableReviewExample } from '@cometal/react';
import { definition as refreshIconDefinition } from '@cometal/react/icons/outline/arrows/arrow-refresh-01';
import { definition as downloadIconDefinition } from '@cometal/react/icons/outline/general/download-01';
import { definition as filterIconDefinition } from '@cometal/react/icons/outline/general/filter';
import { definition as plusIconDefinition } from '@cometal/react/icons/outline/general/plus-01';

const patternToolbarIcons = [filterIconDefinition, refreshIconDefinition, downloadIconDefinition, plusIconDefinition];

function definitionPathData(body: string) {
  return Array.from(body.matchAll(/<path d="([^"]+)"/g), (match) => match[1]);
}

const meta = {
  title: 'Patterns/Widget with Table',
  component: WidgetTablePattern,
  args: { title: 'Спецификация позиций', children: null },
  parameters: { layout: 'fullscreen', controls: { disable: true }, docs: { description: { component: 'Одна композиция принятых Widget и Table: shell не знает о данных, Table сохраняет два уровня header, source families и paginator.' } } },
} satisfies Meta<typeof WidgetTablePattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Обзор',
  render: () => <main className="ds-story-canvas ds-widget-table-pattern-story"><WidgetTableReviewExample /></main>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table', { name: 'Спецификация позиций' });
    await expect(within(table).getAllByRole('row')).toHaveLength(13);
    await expect(within(table).getByRole('row', { name: /Фильтры таблицы/ })).toBeVisible();
    await expect(canvas.getByRole('navigation', { name: 'Пагинация таблицы' })).toBeVisible();
    const toolbar = canvas.getByRole('toolbar', { name: 'Действия виджета' });
    const toolbarButtons = within(toolbar).getAllByRole('button');
    const toolbarIcons = Array.from(toolbar.querySelectorAll<SVGSVGElement>('svg[data-cometal-icon]'));
    await expect(getComputedStyle(toolbar).gap).toBe('8px');
    await expect(toolbarButtons).toHaveLength(4);
    await expect(toolbarIcons).toHaveLength(4);
    for (const button of toolbarButtons.slice(0, 3)) {
      await expect(button).toHaveAttribute('data-variant', 'secondary');
      await expect(button.getBoundingClientRect().width).toBe(40);
      await expect(button.getBoundingClientRect().height).toBe(40);
    }
    await expect(toolbarButtons[3]).toHaveAttribute('data-variant', 'primary');
    for (const [index, icon] of toolbarIcons.entries()) {
      await expect(icon.getBoundingClientRect().width).toBe(16);
      await expect(icon.getBoundingClientRect().height).toBe(16);
      await expect(Array.from(icon.querySelectorAll('path'), (path) => path.getAttribute('d'))).toEqual(definitionPathData(patternToolbarIcons[index]!.body));
    }
    await userEvent.click(canvas.getByRole('button', { name: 'Compact' }));
    await expect(table).toHaveAttribute('data-density', 'compact');
    await userEvent.click(canvas.getByRole('button', { name: 'Скрыть фильтры' }));
    await expect(within(table).queryByRole('row', { name: /Фильтры таблицы/ })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Comfortable' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Показать фильтры' }));
  },
};

export const Compact: Story = { render: () => <main className="ds-story-canvas ds-widget-table-pattern-story"><WidgetTableReviewExample initialDensity="compact" /></main> };
