import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tooltip } from '@cometal/react';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  args: {
    content: 'Подсказка помогает пояснить действие или значение поля.',
    placement: 'top-center',
    size: 'compact',
    defaultOpen: true,
    children: <button style={{ padding: '12px 16px' }}>Наведи или сфокусируй</button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tooltip')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

export const Placements: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args: NonNullable<Story['render']> extends (a: infer A, ...rest: never[]) => unknown ? A : never) => (
    <>
      <div className="ds-tooltip-placement-grid ds-tooltip-placement-grid--desktop">
        {(['top-start', 'top-center', 'top-end', 'left', 'right', 'bottom-start', 'bottom-center', 'bottom-end'] as const).map((placement) => (
          <div key={placement}>
            <Tooltip {...args} placement={placement} content={placement} defaultOpen>
              <button style={{ padding: '10px 12px' }}>{placement}</button>
            </Tooltip>
          </div>
        ))}
      </div>
      <div className="ds-tooltip-placement-grid ds-tooltip-placement-grid--mobile">
        {(['top-start', 'top-center', 'top-end', 'left', 'right', 'bottom-start', 'bottom-center', 'bottom-end'] as const).map((placement, index) => (
          <div key={placement}>
            <Tooltip {...args} placement={placement} content={placement} defaultOpen={index === 0}>
              <button style={{ padding: '10px 12px' }}>{placement}</button>
            </Tooltip>
          </div>
        ))}
      </div>
    </>
  ),
};

export const Wide: Story = {
  args: {
    size: 'wide',
    content:
      'Wide variant uses the same behavioral contract, but gives enough width for multi-line guidance and decision-critical explanations.',
  },
  play: async ({ canvasElement }) => {
    const tooltip = within(canvasElement).getByRole('tooltip');
    await expect(tooltip.scrollWidth).toBeLessThanOrEqual(tooltip.clientWidth);
  },
};
