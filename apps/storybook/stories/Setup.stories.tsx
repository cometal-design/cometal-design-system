import type { Meta, StoryObj } from '@storybook/react-vite';

function SetupStatus() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, padding: 32 }}>
      <h1>Cometal Design System</h1>
      <p>Техническая основа готова к синхронизации с Figma DS Core.</p>
      <ul>
        <li>Tokens: ожидают подтверждённые значения из DS Core</li>
        <li>React components: добавляются после решения Design System Lead</li>
        <li>Storybook checks: rendering, interaction и accessibility</li>
        <li>Knowledge base: Obsidian-compatible Markdown</li>
      </ul>
    </main>
  );
}

const meta = {
  title: 'Обзор/Состояние системы',
  component: SetupStatus,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SetupStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReadyForDsCoreSync: Story = {};
