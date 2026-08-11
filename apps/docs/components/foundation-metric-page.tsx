import { InlineLink } from '@cometal/react';
import {
  aliasName,
  cssValue,
  numericValue,
  primitiveTokens,
  semanticTokens,
} from '../lib/foundation-data';
import { foundationTabs } from '../lib/navigation';
import { FoundationCategoryHeader } from './foundation-category-header';
import { SectionHeading } from './section-heading';

const metricContent = {
  Spacing: {
    title: 'Отступы',
    description: 'Шкала расстояний задаёт внутренние и внешние отступы без локальных чисел в компонентах.',
    story: 'spacing',
    href: '/foundation/layout/spacing/',
  },
  Size: {
    title: 'Размеры',
    description: 'Базовые размеры и semantic-роли фиксируют высоты controls, размеры иконок и полей.',
    story: 'size',
    href: '/foundation/layout/size/',
  },
  Radius: {
    title: 'Радиусы',
    description: 'Радиусы формируют единый характер controls, контейнеров и focus-состояний.',
    story: 'radius',
    href: '/foundation/layout/radius/',
  },
  Stroke: {
    title: 'Толщины линий',
    description: 'Шкала stroke управляет границами, разделителями и focus-обводками.',
    story: 'stroke',
    href: '/foundation/layout/stroke/',
  },
} as const;

export type MetricKind = keyof typeof metricContent;

const controlScale = [
  { size: 'S', value: '32px', usage: 'Компактные Button, Text Field, Select и Combobox.' },
  { size: 'M', value: '40px', usage: 'Стандартные рабочие controls и compact table cells.' },
  { size: 'L', value: '48px', usage: 'Комфортные формы, Button, Fields и table cells.' },
] as const;

export function FoundationMetricPage({ kind }: { kind: MetricKind }) {
  const content = metricContent[kind];
  const primitive = primitiveTokens.filter((token) => token.name.startsWith(`${kind}/`));
  const semantic = semanticTokens.filter((token) => token.name.startsWith(`${kind}/`));

  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Пространственная система"
        description="Числовые шкалы, semantic-роли и адаптивные сетки собраны в одной категории. Табы разделяют слои, сохраняя общий контекст."
        tabs={foundationTabs.layout}
        activeHref={content.href}
      />

      <section className="content-section foundation-metric-section">
        <SectionHeading
          title={content.title}
          description={<>{content.description} Опубликовано {primitive.length} primitive-значений и {semantic.length} semantic-ролей.</>}
        />
        {kind === 'Size' ? (
          <div className="control-scale">
            <div className="control-scale__intro">
              <h3>Шкала высот controls</h3>
              <p>Одна семантическая шкала синхронизирует Button и однострочные Fields. Table пока зафиксирован только как атомарная модель Figma: публичный React API отложен.</p>
            </div>
            <div className="control-scale__items">
              {controlScale.map((item) => (
                <article key={item.size}>
                  <code>{item.size}</code>
                  <strong>{item.value}</strong>
                  <p>{item.usage}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
        <div className="foundation-metric-columns">
          <div>
            <h3>Primitive</h3>
            <div className="foundation-metric-list">
              {primitive.map((token) => (
                <article key={token.name}>
                  <code>{token.name}</code>
                  <div><i style={{
                    width: `${Math.max(1, numericValue(token.value))}px`,
                    borderRadius: kind === 'Radius' ? cssValue(token.value) : 0,
                  }} /></div>
                  <strong>{cssValue(token.value)}</strong>
                </article>
              ))}
            </div>
          </div>
          <div>
            <h3>Semantic</h3>
            <div className="foundation-alias-list">
              {semantic.map((token) => (
                <article key={token.name}>
                  <code>{token.name}</code>
                  <span>{aliasName(token.value)}</span>
                  <strong>{cssValue(token.value)}</strong>
                </article>
              ))}
            </div>
          </div>
        </div>
        <InlineLink className="technical-link" href={`/storybook/?path=/story/foundation--${content.story}`} touchTarget>Открыть техническую story ↗</InlineLink>
      </section>
    </main>
  );
}
