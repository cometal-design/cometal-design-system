import type { Metadata } from 'next';
import { ActionLink, Button, InlineLink } from '@cometal/react';
import type { ButtonVariant } from '@cometal/react';
import { components, statusLabels } from '../../../lib/registry';
import { SectionHeading } from '../../../components/section-heading';

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
        <div><span className="eyebrow">КОМПОНЕНТ · WEB · {statusLabels[component.status].toUpperCase()}</span><h1>Button</h1><p>Запускает одно понятное действие пользователя: сохранить, продолжить, создать, подтвердить или удалить.</p></div>
        <div className="component-title__links"><ActionLink href={component.links.figma} target="_blank" rel="noreferrer" variant="secondary">Figma ↗</ActionLink><ActionLink href="/storybook/?path=/story/components-button--playground" variant="secondary">Открыть Playground ↗</ActionLink></div>
      </header>

      <section className="content-section" id="usage">
        <SectionHeading title="Использование" description="Кнопка выполняет действие. Для обычного перехода используйте ссылку, для переключения режима — Toggle." />
        <div className="guidance"><article data-tone="positive"><strong>Используйте</strong><p>Один Primary на локальную область. Подпись начинается с глагола и объясняет результат.</p></article><article data-tone="negative"><strong>Не используйте</strong><p>Для навигации, выбора значения или нескольких равнозначных основных действий рядом.</p></article></div>
      </section>

      <section className="content-section" id="variants">
        <SectionHeading title="Варианты" description="Девять визуальных ролей синхронизированы с DS Core." />
        <div className="variant-board">
          {documentedVariants.map((variant) => <article key={variant} data-dark={darkVariants.has(variant) || undefined}><code>{variant}</code><Button variant={variant}>Продолжить</Button></article>)}
        </div>
      </section>

      <section className="content-section" id="sizes">
        <SectionHeading title="Размеры и композиция" description="Каждый размер проверяется в четырёх композициях DS Core: текст, иконка слева, иконка справа и только иконка." />
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
        <SectionHeading title="Состояния" description="Hover, pressed и focus появляются от взаимодействия. Disabled и loading задаёт приложение." />
        <div className="state-board"><article><code>Default</code><Button>Продолжить</Button></article><article><code>Hover</code><Button className="docs-button--hover">Продолжить</Button></article><article><code>Focus visible</code><Button className="docs-button--focus">Продолжить</Button></article><article><code>Pressed</code><Button className="docs-button--pressed">Продолжить</Button></article><article><code>Disabled</code><Button disabled>Продолжить</Button></article><article><code>Loading</code><Button loading>Продолжить</Button></article></div>
      </section>

      <section className="content-section" id="api">
        <SectionHeading title="React API" description="Публичный API остаётся минимальным. Интерактивные состояния не передаются props." />
        <div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[
          ['variant', "'primary' | 'secondary' | …", "'primary'"], ['size', "'l' | 'm' | 's'", "'l'"], ['loading', 'boolean', 'false'], ['disabled', 'boolean', 'false'], ['startIcon / endIcon', 'ReactNode', '—'], ['children', 'ReactNode', '—'],
        ].map(([name, type, value]) => <div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div>
      </section>

      <aside className="review-banner"><div><span>Статус</span><strong>{statusLabels[component.status]}</strong></div><p>Визуал, API, stories и автоматические проверки собраны. Для Beta требуется review Frontend Lead и проверка внутри продукта Cometal.</p><InlineLink href="/storybook/?path=/story/components-button--overview" touchTarget>Техническая документация ↗</InlineLink></aside>
    </main>
  );
}
