import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import grid from '../../../../../../packages/tokens/src/grid.presets.json';
import { FoundationCategoryHeader } from '../../../../components/foundation-category-header';
import { SectionHeading } from '../../../../components/section-heading';
import { foundationTabs } from '../../../../lib/navigation';

export const metadata: Metadata = {
  title: 'Адаптивная сетка — Foundation',
  description: 'Адаптивные grid-пресеты Cometal.',
};

export default function FoundationGridPage() {
  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Пространственная система"
        description="Числовые шкалы, semantic-роли и адаптивные сетки собраны в одной категории. Табы разделяют слои, сохраняя общий контекст."
        tabs={foundationTabs.layout}
        activeHref="/foundation/layout/grid/"
      />

      <section className="content-section">
        <SectionHeading
          title="Адаптивная сетка"
          description={`${grid.presets.length} пресета фиксируют viewport, количество колонок, margin и gutter. В Figma пока нет опубликованных локальных Grid Styles.`}
        />
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
        <InlineLink className="technical-link" href="/storybook/?path=/story/foundation--grid" touchTarget>Открыть техническую Grid story ↗</InlineLink>
      </section>
    </main>
  );
}
