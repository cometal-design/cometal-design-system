import {
  aliasName,
  cssValue,
  numericValue,
  primitiveTokens,
  semanticTokens,
} from '../lib/foundation-data';
import { SectionHeading } from './section-heading';

const metricContent = {
  Spacing: {
    eyebrow: 'FOUNDATION / РАЗМЕРЫ И СЕТКИ / ОТСТУПЫ',
    title: 'Отступы',
    description: 'Шкала расстояний задаёт внутренние и внешние отступы без локальных чисел в компонентах.',
    story: 'spacing',
  },
  Size: {
    eyebrow: 'FOUNDATION / РАЗМЕРЫ И СЕТКИ / РАЗМЕРЫ',
    title: 'Размеры',
    description: 'Базовые размеры и semantic-роли фиксируют высоты controls, размеры иконок и полей.',
    story: 'size',
  },
  Radius: {
    eyebrow: 'FOUNDATION / РАЗМЕРЫ И СЕТКИ / РАДИУСЫ',
    title: 'Радиусы',
    description: 'Радиусы формируют единый характер controls, контейнеров и focus-состояний.',
    story: 'radius',
  },
  Stroke: {
    eyebrow: 'FOUNDATION / РАЗМЕРЫ И СЕТКИ / ТОЛЩИНЫ ЛИНИЙ',
    title: 'Толщины линий',
    description: 'Шкала stroke управляет границами, разделителями и focus-обводками.',
    story: 'stroke',
  },
} as const;

export type MetricKind = keyof typeof metricContent;

export function FoundationMetricPage({ kind }: { kind: MetricKind }) {
  const content = metricContent[kind];
  const primitive = primitiveTokens.filter((token) => token.name.startsWith(`${kind}/`));
  const semantic = semanticTokens.filter((token) => token.name.startsWith(`${kind}/`));

  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
        <div className="page-stat"><strong>{primitive.length + semantic.length}</strong><span>токенов и ролей</span></div>
      </header>

      <section className="content-section foundation-metric-section">
        <SectionHeading
          title="Primitive и Semantic"
          description={<>{primitive.length} primitive-значений и {semantic.length} semantic-ролей. Runtime использует только опубликованные Figma Variables.</>}
        />
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
        <a className="technical-link" href={`/storybook/?path=/story/foundation--${content.story}`}>Открыть техническую story ↗</a>
      </section>
    </main>
  );
}
