import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { WidgetTablePattern, WidgetTableReviewExample } from '@cometal/react';

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
    await userEvent.click(canvas.getByRole('button', { name: 'Compact' }));
    await expect(table).toHaveAttribute('data-density', 'compact');
    await userEvent.click(canvas.getByRole('button', { name: 'Скрыть фильтры' }));
    await expect(within(table).queryByRole('row', { name: /Фильтры таблицы/ })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Comfortable' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Показать фильтры' }));
  },
};

export const Compact: Story = { render: () => <main className="ds-story-canvas ds-widget-table-pattern-story"><WidgetTableReviewExample initialDensity="compact" /></main> };
