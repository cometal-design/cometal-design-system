import type { Metadata } from 'next';
import { Button } from '@cometal/react';
import type { ButtonVariant } from '@cometal/react';
import { components, statusLabels } from '../../../lib/registry';

export const metadata: Metadata = { title: 'Button' };

const component = components.find((item) => item.id === 'action.button')!;
const buttonSizes = ['l', 'm', 's'] as const;
const darkVariants = new Set(['ghost', 'inverse', 'inverse-ghost']);
const documentedVariants: ButtonVariant[] = ['primary', 'secondary', 'link', 'danger', 'success', 'warning', 'ghost', 'inverse', 'inverse-ghost'];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" focusable="false">
      <path d="M13.333 19 20 12l-6.667-7M20 12H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function ButtonPage() {
  return (
    <main className="content-page component-detail">
      <header className="component-title">
        <div><span className="eyebrow">COMPONENT · WEB · {statusLabels[component.status].toUpperCase()}</span><h1>Button</h1><p>Запускает одно понятное действие пользователя: сохранить, продолжить, создать, подтвердить или удалить.</p></div>
        <div className="component-title__links"><a href={component.links.figma} target="_blank" rel="noreferrer">Figma ↗</a><a href="/storybook/?path=/story/components-button--playground">Открыть Playground ↗</a></div>
      </header>

      <nav className="on-page-nav" aria-label="Содержание страницы"><a href="#usage">Использование</a><a href="#variants">Варианты</a><a href="#sizes">Размеры</a><a href="#states">Состояния</a><a href="#api">React API</a></nav>

      <section className="content-section" id="usage">
        <div className="section-heading"><h2>Использование</h2><p>Кнопка выполняет действие. Для обычного перехода используйте ссылку, для переключения режима — Toggle.</p></div>
        <div className="guidance"><article data-tone="positive"><strong>Используйте</strong><p>Один Primary на локальную область. Подпись начинается с глагола и объясняет результат.</p></article><article data-tone="negative"><strong>Не используйте</strong><p>Для навигации, выбора значения или нескольких равнозначных основных действий рядом.</p></article></div>
      </section>

      <section className="content-section" id="variants">
        <div className="section-heading"><h2>Варианты</h2><p>Девять визуальных ролей синхронизированы с DS Core.</p></div>
        <div className="variant-board">
          {documentedVariants.map((variant) => <article key={variant} data-dark={darkVariants.has(variant) || undefined}><code>{variant}</code><Button variant={variant}>Продолжить</Button></article>)}
        </div>
      </section>

      <section className="content-section" id="sizes">
        <div className="section-heading"><h2>Размеры и композиция</h2><p>Каждый размер проверяется в четырёх композициях DS Core: текст, иконка слева, иконка справа и только иконка.</p></div>
        <div className="size-list size-list--compositions">
          <div className="size-list__head"><span>Размер</span><span>Текст</span><span>Иконка слева</span><span>Иконка справа</span><span>Только иконка</span></div>
          {buttonSizes.map((size) => (
            <article key={size}>
              <div><strong>{size.toUpperCase()}</strong><span>{size === 'l' ? 44 : size === 'm' ? 36 : 28}px</span></div>
              <Button size={size}>Продолжить</Button>
              <Button size={size} startIcon={<ArrowIcon />}>Продолжить</Button>
              <Button size={size} endIcon={<ArrowIcon />}>Продолжить</Button>
              <Button size={size} startIcon={<ArrowIcon />} aria-label="Продолжить" />
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" id="states">
        <div className="section-heading"><h2>Состояния</h2><p>Hover, pressed и focus появляются от взаимодействия. Disabled и loading задаёт приложение.</p></div>
        <div className="state-board"><article><code>Default</code><Button>Продолжить</Button></article><article><code>Hover</code><Button className="docs-button--hover">Продолжить</Button></article><article><code>Focus visible</code><Button className="docs-button--focus">Продолжить</Button></article><article><code>Pressed</code><Button className="docs-button--pressed">Продолжить</Button></article><article><code>Disabled</code><Button disabled>Продолжить</Button></article><article><code>Loading</code><Button loading>Продолжить</Button></article></div>
      </section>

      <section className="content-section" id="api">
        <div className="section-heading"><h2>React API</h2><p>Публичный API остаётся минимальным. Интерактивные состояния не передаются props.</p></div>
        <div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[
          ['variant', "'primary' | 'secondary' | …", "'primary'"], ['size', "'l' | 'm' | 's'", "'l'"], ['loading', 'boolean', 'false'], ['disabled', 'boolean', 'false'], ['startIcon / endIcon', 'ReactNode', '—'], ['children', 'ReactNode', '—'],
        ].map(([name, type, value]) => <div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div>
      </section>

      <aside className="review-banner"><div><span>Статус</span><strong>{statusLabels[component.status]}</strong></div><p>Визуал, API, stories и автоматические проверки собраны. Для Beta требуется review Frontend Lead и проверка внутри продукта Cometal.</p><a href="/storybook/?path=/story/components-button--overview">Техническая документация ↗</a></aside>
    </main>
  );
}
