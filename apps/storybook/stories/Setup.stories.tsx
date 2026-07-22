import type { Meta, StoryObj } from '@storybook/react-vite';

function Welcome() {
  return (
    <main className="ds-home">
      <section className="ds-home__identity" aria-label="Cometal Redesign">
        <div className="ds-home__wordmark" aria-label="R redesign">
          <span>R</span>
          <i aria-hidden="true"><b /><b /><b /></i>
          <span>design</span>
        </div>
        <h1>Дизайн-система Cometal</h1>
      </section>

      <footer className="ds-home__footer">
        <div>
          <span>Дизайнер</span>
          <strong>Вадим Дюмин</strong>
        </div>
        <time dateTime="2026">2026</time>
      </footer>
    </main>
  );
}

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
  title: 'Обзор',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Welcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WelcomePage: Story = {
  name: 'Главная',
  parameters: {
    controls: { disable: true },
    options: { showPanel: false, showToolbar: false },
  },
};

export const FoundationSynchronized: Story = {
  name: 'Состояние системы',
  render: () => <SetupStatus />,
};
