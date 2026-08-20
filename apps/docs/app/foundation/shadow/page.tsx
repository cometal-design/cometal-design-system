import type { Metadata } from 'next';
import effects from '../../../../../packages/tokens/src/effects.tokens.json';
import { FoundationCategoryHeader } from '../../../components/foundation-category-header';
import { SectionHeading } from '../../../components/section-heading';

export const metadata: Metadata = {
  title: 'Тени — Foundation',
  description: 'Soft и Hard elevation contracts Cometal.',
};

const shadowTokens = [
  {
    name: 'effects.elevation.floating.soft',
    css: '--cometal-effects-effects-elevation-floating-soft',
    value: effects.Effects.Effects.Elevation.Floating.Soft.$value,
    usage: 'Calendar Panel, Date Range Panel, Listbox, Multi Listbox, Select и Combobox overlays.',
  },
  {
    name: 'effects.elevation.floating.hard',
    css: '--cometal-effects-effects-elevation-floating-hard',
    value: effects.Effects.Effects.Elevation.Floating.Hard.$value,
    usage: 'Tooltip, Context Menu и другие компактные action surfaces.',
  },
] as const;

export default function FoundationShadowPage() {
  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Тени"
        description="Effect styles живут в token source так же строго, как цвета и типографика. Для floating layers разрешены только два канонических elevation presets."
      />

      <section className="content-section">
        <SectionHeading
          title="Карта применения"
          description="Soft используется там, где слой связан с полем ввода. Hard — для компактных меню и подсказок."
        />
        <div className="portal-shadow-grid">
          {shadowTokens.map((token) => (
            <article key={token.name}>
              <code>{token.name}</code>
              <div className="portal-shadow-swatch">
                <div style={{ boxShadow: `var(${token.css})` }} />
              </div>
              <strong>{token.css}</strong>
              <span>{token.usage}</span>
              <small>{token.value}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          title="Контракт"
          description="Shadow не подменяется локальными box-shadow. Компонент выбирает только один из двух эффектов."
        />
        <div className="portal-shadow-rules">
          <article><code>Soft</code><strong>Field-linked overlays</strong><p>Дата, диапазон дат, select, multi select, combobox и другие popover над полем.</p></article>
          <article><code>Hard</code><strong>Compact action layers</strong><p>Tooltip и context menu, где приоритет — читаемость на небольшой площади.</p></article>
          <article><code>Запрещено</code><strong>Локальный shadow</strong><p>Новые тени сначала утверждаются в Figma и только потом попадают в token source.</p></article>
        </div>
      </section>
    </main>
  );
}
