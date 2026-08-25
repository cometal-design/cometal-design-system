import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';

const meta = {
  title: 'Components/Context Menu',
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
    trigger: <Button>Открыть</Button>,
    children: null,
  },
  render: (args: NonNullable<Story['render']> extends (a: infer A, ...rest: never[]) => unknown ? A : never) => (
    <div style={{ padding: 80 }}>
      <ContextMenu
        {...args}
        trigger={<Button>Открыть context menu</Button>}
      >
        <ContextMenuItem>Открыть</ContextMenuItem>
        <ContextMenuItem>Переименовать</ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem selected>Закрепить</ContextMenuItem>
        <ContextMenuItem tone="danger">Удалить</ContextMenuItem>
      </ContextMenu>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Открыть context menu' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(body.getByRole('menu')).toBeVisible());
    await expect(body.getByRole('menuitem', { name: 'Открыть' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(body.getByRole('menuitem', { name: 'Переименовать' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(body.getByRole('menuitem', { name: 'Удалить' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(body.getByRole('menuitem', { name: 'Открыть' })).toHaveFocus();
    await userEvent.keyboard('у');
    await expect(body.getByRole('menuitem', { name: 'Удалить' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(body.getByRole('menuitem', { name: 'Открыть' })).toHaveFocus());
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const Sizes: Story = {
  args: {
    size: 'm',
    trigger: <Button>Открыть</Button>,
    children: null,
  },
  render: () => (
    <div style={{ display: 'grid', gap: 32 }}>
      {(['l', 'm', 's'] as const).map((size) => (
        <div key={size} style={{ padding: 48 }}>
          <ContextMenu size={size} defaultOpen trigger={<Button>{size.toUpperCase()}</Button>}>
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
