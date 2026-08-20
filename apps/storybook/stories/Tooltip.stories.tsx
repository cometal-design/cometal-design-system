import type { Meta, StoryObj } from '@storybook/react-vite';
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

export const Overview: Story = {};

export const Placements: Story = {
  render: (args: NonNullable<Story['render']> extends (a: infer A, ...rest: never[]) => unknown ? A : never) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))', gap: 24 }}>
      {(['top-start', 'top-center', 'top-end', 'left', 'right', 'bottom-start', 'bottom-center', 'bottom-end'] as const).map((placement) => (
        <div key={placement} style={{ display: 'flex', justifyContent: 'center', padding: '56px 0' }}>
          <Tooltip {...args} placement={placement} content={placement} defaultOpen>
            <button style={{ padding: '10px 12px' }}>{placement}</button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};

export const Wide: Story = {
  args: {
    size: 'wide',
    content:
      'Wide variant uses the same behavioral contract, but gives enough width for multi-line guidance and decision-critical explanations.',
  },
};
