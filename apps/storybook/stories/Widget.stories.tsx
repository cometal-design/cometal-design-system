import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Widget } from '@cometal/react';

const meta = {
  title: 'Templates/Widget',
  component: Widget,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'Сводка по закупкам',
    description: 'Widget собирает заголовок, служебный текст, actions и content slot в одну переиспользуемую оболочку.',
    actions: <Button size="m">Действие</Button>,
    children: (
      <div
        style={{
          minHeight: 240,
          display: 'grid',
          placeItems: 'center',
          color: 'var(--cometal-semantic-color-global-text-primary)',
        }}
      >
        Content slot
      </div>
    ),
  },
} satisfies Meta<typeof Widget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const TableHost: Story = {
  args: {
    title: 'Таблица поставщиков',
    description: 'Утверждённый Figma contract использует Widget как контейнер таблицы и вспомогательных действий.',
    children: (
      <div
        style={{
          minHeight: 280,
          display: 'grid',
          alignContent: 'start',
          gap: 12,
          padding: 8,
        }}
      >
        <div style={{ height: 40, borderRadius: 12, background: 'var(--cometal-semantic-color-global-surface-selected)' }} />
        <div style={{ height: 40, borderRadius: 12, background: 'var(--cometal-semantic-color-global-surface-selected)' }} />
        <div style={{ height: 40, borderRadius: 12, background: 'var(--cometal-semantic-color-global-surface-selected)' }} />
        <div style={{ height: 40, borderRadius: 12, background: 'var(--cometal-semantic-color-global-surface-selected)' }} />
      </div>
    ),
  },
};
