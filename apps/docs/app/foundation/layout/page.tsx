import type { Metadata } from 'next';
import grid from '../../../../../packages/tokens/src/grid.presets.json';
import {
  aliasName,
  cssValue,
  numericValue,
  primitiveTokens,
  semanticTokens,
} from '../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Размеры и сетки — Foundation',
  description: 'Spacing, size, radius, stroke и адаптивные сетки Cometal.',
};

const metrics = [
  { id: 'spacing', kind: 'Spacing', title: 'Отступы', story: 'spacing' },
  { id: 'size', kind: 'Size', title: 'Размеры', story: 'size' },
  { id: 'radius', kind: 'Radius', title: 'Радиусы', story: 'radius' },
  { id: 'stroke', kind: 'Stroke', title: 'Толщины линий', story: 'stroke' },
] as const;

export default function FoundationLayoutPage() {
  return (
    <main className="content-page">
      <header className="page-header">
        <span className="eyebrow">FOUNDATION / РАЗМЕРЫ И СЕТКИ</span>
        <h1>Пространственная система</h1>
        <p>Primitive формирует числовые шкалы. Semantic закрепляет их за назначением. Сетки определяют структуру страницы на ключевых viewport.</p>
      </header>

      {metrics.map(({ id, kind, title, story }) => {
        const primitive = primitiveTokens.filter((token) => token.name.startsWith(`${kind}/`));
        const semantic = semanticTokens.filter((token) => token.name.startsWith(`${kind}/`));
        return (
          <section className="content-section foundation-metric-section" id={id} key={kind}>
            <div className="section-heading">
              <h2>{title}</h2>
              <p>{primitive.length} primitive-значений и {semantic.length} semantic-ролей. Runtime использует только опубликованные Figma Variables.</p>
            </div>
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
            <a className="technical-link" href={`/storybook/?path=/story/foundation--${story}`}>Открыть техническую story ↗</a>
          </section>
        );
      })}

      <section className="content-section" id="grid">
        <div className="section-heading">
          <h2>Адаптивная сетка</h2>
          <p>Сейчас это документированные пресеты. В Figma нет опубликованных локальных Grid Styles, поэтому портал не выдаёт их за готовый asset.</p>
        </div>
        <div className="foundation-grid-presets">
          {grid.presets.map((preset) => (
            <article key={preset.name}>
              <div className="foundation-grid-preview" style={{
                gridTemplateColumns: `repeat(${preset.columns}, minmax(0, 1fr))`,
                gap: Math.max(2, preset.gutter / 6),
              }}>
                {Array.from({ length: preset.columns }, (_, index) => <i key={index} />)}
              </div>
              <header><h3>{preset.name}</h3><span>{preset.columns} columns</span></header>
              <dl>
                <div><dt>Viewport</dt><dd>{preset.viewport}px</dd></div>
                <div><dt>Margin</dt><dd>{preset.margin}px</dd></div>
                <div><dt>Gutter</dt><dd>{preset.gutter}px</dd></div>
              </dl>
            </article>
          ))}
        </div>
        <a className="technical-link" href="/storybook/?path=/story/foundation--grid">Открыть техническую Grid story ↗</a>
      </section>
    </main>
  );
}
