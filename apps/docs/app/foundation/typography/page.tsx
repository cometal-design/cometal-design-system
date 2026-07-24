import type { Metadata } from 'next';
import typography from '../../../../../packages/tokens/src/typography.styles.json';
import { groupBy } from '../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Типографика — Foundation',
  description: 'Полная шкала текстовых стилей Grtsk Peta в дизайн-системе Cometal.',
};

const groups = groupBy(typography.styles, (style) => style.name.split('/')[0]);

export default function FoundationTypographyPage() {
  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">FOUNDATION / ТИПОГРАФИКА</span>
          <h1>Типографическая шкала</h1>
          <p>Все стили используют Grtsk Peta и воспроизводят family, weight, size, line-height, letter-spacing и text case из Figma.</p>
        </div>
        <div className="page-stat"><strong>{typography.styles.length}</strong><span>текстовых стилей</span></div>
      </header>

      <section className="content-section foundation-type-catalog">
        {[...groups].map(([group, styles]) => (
          <section className="foundation-type-group" key={group}>
            <header><h2>{group}</h2><span>{styles.length} стилей</span></header>
            <div>
              {styles.map((style) => (
                <article key={style.name}>
                  <div>
                    <strong>{style.name}</strong>
                    <code>{style.size}/{style.lineHeight}px · {style.weight} · {style.letterSpacingPercent}%</code>
                  </div>
                  <p style={{
                    fontFamily: style.family,
                    fontWeight: style.weight,
                    fontSize: style.size,
                    lineHeight: `${style.lineHeight}px`,
                    letterSpacing: `${style.letterSpacingPercent / 100}em`,
                    textTransform: style.textCase === 'upper' ? 'uppercase' : 'none',
                  }}>Система управления закупками</p>
                  <span>{style.description}</span>
                </article>
              ))}
            </div>
          </section>
        ))}
        <a className="technical-link" href="/storybook/?path=/story/foundation--typography">Открыть техническую Typography story ↗</a>
      </section>
    </main>
  );
}
