import type { Metadata } from 'next';
import grid from '../../../../../../packages/tokens/src/grid.presets.json';

export const metadata: Metadata = {
  title: 'Адаптивная сетка — Foundation',
  description: 'Адаптивные grid-пресеты Cometal.',
};

export default function FoundationGridPage() {
  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">FOUNDATION / РАЗМЕРЫ И СЕТКИ / АДАПТИВНАЯ СЕТКА</span>
          <h1>Адаптивная сетка</h1>
          <p>Пресеты фиксируют viewport, количество колонок, margin и gutter. В Figma пока нет опубликованных локальных Grid Styles, поэтому портал не выдаёт их за готовый asset.</p>
        </div>
        <div className="page-stat"><strong>{grid.presets.length}</strong><span>grid-пресета</span></div>
      </header>

      <section className="content-section">
        <div className="foundation-grid-presets">
          {grid.presets.map((preset) => (
            <article key={preset.name}>
              <div className="foundation-grid-preview" style={{
                gridTemplateColumns: `repeat(${preset.columns}, minmax(0, 1fr))`,
                gap: Math.max(2, preset.gutter / 6),
              }}>
                {Array.from({ length: preset.columns }, (_, index) => <i key={index} />)}
              </div>
              <header><h2>{preset.name}</h2><span>{preset.columns} columns</span></header>
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
