import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Tooltip } from '@cometal/react';

const placements = ['top-start', 'top-center', 'top-end', 'bottom-start', 'bottom-center', 'bottom-end', 'left', 'right'] as const;

function getRenderedGeometry(tooltip: HTMLElement) {
  const arrow = tooltip.querySelector<HTMLElement>('.cometal-tooltip__arrow');
  if (!arrow) throw new Error('Tooltip arrow is missing');
  const surface = tooltip.getBoundingClientRect();
  const arrowRect = arrow.getBoundingClientRect();
  return {
    surface,
    arrow: arrowRect,
    totalWidth: Math.max(surface.right, arrowRect.right) - Math.min(surface.left, arrowRect.left),
    totalHeight: Math.max(surface.bottom, arrowRect.bottom) - Math.min(surface.top, arrowRect.top),
  };
}

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  args: {
    content: 'Подсказка',
    placement: 'bottom-center',
    size: 'compact',
    defaultOpen: false,
    children: <Button>Наведи или сфокусируй</Button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Наведи или сфокусируй' });
    await userEvent.hover(trigger);
    const tooltip = await within(document.body).findByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveAttribute('data-placement', 'bottom-center');
    const geometry = getRenderedGeometry(tooltip);
    await expect(geometry.surface.width).toBe(185);
    await expect(geometry.surface.height).toBe(32);
    await expect(geometry.arrow.width).toBe(12);
    await expect(geometry.arrow.height).toBe(6);
    await expect(geometry.totalWidth).toBe(185);
    await expect(geometry.totalHeight).toBe(37);
    await expect(getComputedStyle(tooltip).padding).toBe('8px 12px');
    await expect(getComputedStyle(tooltip.querySelector<HTMLElement>('.cometal-tooltip__content')!).lineHeight).toBe('16px');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument());
    await userEvent.unhover(trigger);
    trigger.focus();
    await waitFor(() => expect(within(document.body).getByRole('tooltip')).toBeVisible());
    trigger.blur();
    await waitFor(() => expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument());
  },
};

export const Placements: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args: NonNullable<Story['render']> extends (a: infer A, ...rest: never[]) => unknown ? A : never) => (
    <>
      <div className="ds-tooltip-placement-grid ds-tooltip-placement-grid--desktop">
        {placements.map((placement) => (
          <div key={placement}>
            <Tooltip {...args} placement={placement} content={placement} defaultOpen>
              <Button>{placement}</Button>
            </Tooltip>
          </div>
        ))}
      </div>
      <div className="ds-tooltip-placement-grid ds-tooltip-placement-grid--mobile">
        {placements.map((placement, index) => (
          <div key={placement}>
            <Tooltip {...args} placement={placement} content={placement} defaultOpen={index === 0}>
              <Button>{placement}</Button>
            </Tooltip>
          </div>
        ))}
      </div>
    </>
  ),
  play: async ({ canvasElement }) => {
    const renderedNames = within(canvasElement).getAllByRole('button').map((button) => button.textContent);
    for (const placement of placements) await expect(renderedNames).toContain(placement);
  },
};

export const Wide: Story = {
  args: {
    size: 'wide',
    placement: 'right',
    content: 'Wide tooltip',
    defaultOpen: true,
  },
  play: async ({ canvasElement }) => {
    const tooltip = within(document.body).getByRole('tooltip');
    await expect(tooltip).toHaveAttribute('data-placement', 'right');
    const geometry = getRenderedGeometry(tooltip);
    await expect(geometry.surface.width).toBe(240);
    await expect(geometry.surface.height).toBe(44);
    await expect(geometry.arrow.width).toBe(6);
    await expect(geometry.arrow.height).toBe(12);
    await expect(geometry.totalWidth).toBe(245);
    await expect(geometry.totalHeight).toBe(44);
    await expect(getComputedStyle(tooltip).padding).toBe('12px 16px');
    await expect(getComputedStyle(tooltip.querySelector<HTMLElement>('.cometal-tooltip__content')!).lineHeight).toBe('20px');
  },
};
