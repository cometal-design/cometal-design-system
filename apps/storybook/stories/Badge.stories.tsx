import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Badge, badgeSurfaces, badgeTones } from '@cometal/react';
import { ComponentCodeExample } from './ComponentCodeExample';

const SOURCE_URL = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Badge/Badge.tsx';

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" focusable="false">
      <path fill="currentColor" d="M4.83 8.7 2.1 5.98l1.06-1.06 1.67 1.67 4-4 1.07 1.06-5.07 5.06Z" />
    </svg>
  );
}

function OverviewPage() {
  return (
    <main className="ds-component-page">
      <header className="ds-component-hero">
        <div>
          <span className="ds-eyebrow">COMPONENT · WEB · IN REVIEW</span>
          <h1>Badge</h1>
          <p>Компактный статус или атрибут. Surface и tone задают визуальную роль, а текст и иконки собираются независимо.</p>
        </div>
        <a href="https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2097-438" target="_blank" rel="noreferrer">Открыть в Figma ↗</a>
      </header>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>01</span><div><h2>Тоны</h2><p>Light подходит для спокойной маркировки, Dark — для более сильного статусного акцента.</p></div></div>
        <div className="ds-badge-tones">
          {badgeSurfaces.map((surface) => (
            <article key={surface}>
              <code>{surface}</code>
              <div>{badgeTones.map((tone) => <Badge key={tone} surface={surface} tone={tone}>{tone}</Badge>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>02</span><div><h2>Состав</h2><p>Текст и обе иконки независимы. Без текста одна доступная иконка формирует круг 24×24.</p></div></div>
        <div className="ds-badge-compositions">
          <Badge>Статус</Badge>
          <Badge startIcon={<CheckIcon />}>Статус</Badge>
          <Badge endIcon={<CheckIcon />}>Статус</Badge>
          <Badge startIcon={<CheckIcon />} endIcon={<CheckIcon />}>Статус</Badge>
          <Badge aria-label="Согласовано" surface="dark" tone="green" startIcon={<CheckIcon />} />
        </div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>03</span><div><h2>Код</h2><p>Badge остаётся неинтерактивным. Для icon-only обязателен aria-label.</p></div></div>
        <ComponentCodeExample componentId="status.badge" componentName="Badge" sourceHref={SOURCE_URL} />
      </section>
    </main>
  );
}

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Статус', surface: 'light', tone: 'neutral' },
  argTypes: {
    surface: { control: 'inline-radio', options: badgeSurfaces },
    tone: { control: 'select', options: badgeTones },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Обзор',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: () => <OverviewPage />,
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-cometal-component="badge"]')).toHaveLength(21);
    await expect(canvasElement.querySelector('[data-code-example="status.badge"] pre')).toHaveTextContent('<Badge');
  },
};

export const Playground: Story = {
  name: 'Песочница',
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector<HTMLElement>('[data-cometal-component="badge"]')!;
    await expect(badge.getBoundingClientRect().height).toBe(24);
    await expect(getComputedStyle(badge).borderRadius).toBe('12px');
  },
};

export const IconOnly: Story = {
  name: 'Только иконка',
  args: { children: undefined, 'aria-label': 'Согласовано', surface: 'dark', tone: 'green', startIcon: <CheckIcon /> },
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector<HTMLElement>('[data-cometal-component="badge"]')!;
    await expect(badge.getBoundingClientRect().width).toBe(24);
    await expect(badge.getBoundingClientRect().height).toBe(24);
  },
};
