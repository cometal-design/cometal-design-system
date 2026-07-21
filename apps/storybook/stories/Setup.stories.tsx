import type { Meta, StoryObj } from '@storybook/react-vite';

function SetupStatus() {
  return (
    <main className="ds-page ds-overview">
      <span className="ds-eyebrow">COMETAL DESIGN SYSTEM</span>
      <h1>Cometal Design System</h1>
      <p className="ds-lead">Foundation синхронизирован с актуальным Figma DS Core.</p>
      <div className="ds-status-grid">
        <article><strong>529</strong><span>переменных</span></article>
        <article><strong>18</strong><span>текстовых стилей</span></article>
        <article><strong>4</strong><span>grid-пресета</span></article>
        <article><strong>2 810</strong><span>икон-компонентов</span></article>
      </div>
      <p className="ds-note">Тени отсутствуют в Figma и намеренно не добавлены в код. Иконки пока представлены реестром: экспорт SVG и React API требуют отдельного утверждения.</p>
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

export const FoundationSynchronized: Story = {};
