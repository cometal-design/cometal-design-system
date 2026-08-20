import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';

const meta = {
  title: 'Patterns/Context Menu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
  },
  args: {
    size: 'm',
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  args: {
    size: 'm',
    trigger: <button>Открыть</button>,
    children: null,
  },
  render: (args: NonNullable<Story['render']> extends (a: infer A, ...rest: never[]) => unknown ? A : never) => (
    <div style={{ padding: 80 }}>
      <ContextMenu
        {...args}
        defaultOpen
        trigger={<button style={{ padding: '12px 16px' }}>Открыть context menu</button>}
      >
        <ContextMenuItem>Открыть</ContextMenuItem>
        <ContextMenuItem>Переименовать</ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem selected>Закрепить</ContextMenuItem>
        <ContextMenuItem tone="danger">Удалить</ContextMenuItem>
      </ContextMenu>
    </div>
  ),
};

export const Sizes: Story = {
  args: {
    size: 'm',
    trigger: <button>Открыть</button>,
    children: null,
  },
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {(['l', 'm', 's'] as const).map((size) => (
        <div key={size} style={{ padding: 48 }}>
          <ContextMenu size={size} defaultOpen trigger={<button style={{ padding: '10px 12px' }}>{size.toUpperCase()}</button>}>
            <ContextMenuItem>Открыть</ContextMenuItem>
            <ContextMenuItem>Переименовать</ContextMenuItem>
            <ContextMenuDivider />
            <ContextMenuItem tone="danger">Удалить</ContextMenuItem>
          </ContextMenu>
        </div>
      ))}
    </div>
  ),
};
