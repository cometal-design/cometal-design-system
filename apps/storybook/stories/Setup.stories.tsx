import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { releases, releasesSource } from './releases.generated';

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

function Releases() {
  return (
    <main className="ds-release-page">
      <header className="ds-release-hero">
        <div>
          <h1>Релизы</h1>
          <p>История изменений, архитектурных решений и публичных выпусков дизайн-системы Cometal.</p>
        </div>
        <a href={releasesSource.url} target="_blank" rel="noreferrer">Открыть источник в Figma</a>
      </header>

      <div className="ds-release-source" aria-label="Источник данных">
        <span>Источник: {releasesSource.label}</span>
        <span>Синхронизировано: {releasesSource.syncedAt}</span>
      </div>

      <div className="ds-release-list">
        {releases.map((release) => (
          <article className="ds-release" key={release.version}>
            <header className="ds-release__header">
              <div>
                <h2><span>{release.version}</span> — {release.title}</h2>
                <p>{release.description}</p>
              </div>
              <span className="ds-release__status">{release.status}</span>
            </header>

            <div className="ds-release__sections">
              {release.sections.map((section) => (
                <section key={section.title}>
                  <h3>{section.title}</h3>
                  <ul>
                    {section.changes.map((change) => <li key={change}>{change}</li>)}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
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

export const ReleasesPage: Story = {
  name: 'Релизы',
  render: () => <Releases />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Источник данных')).toHaveTextContent('Синхронизировано: 27 августа 2026');

    const candidate = canvas.getByRole('heading', { name: /^v0\.3\.0/ }).closest('article');
    await expect(candidate).toHaveTextContent('27 августа 2026');
    await expect(candidate).toHaveTextContent('Кандидат');
    await expect(candidate).toHaveTextContent('production publication pending');
  },
  parameters: {
    controls: { disable: true },
    options: { showPanel: false },
  },
};
