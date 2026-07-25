import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import typography from '../../../../../../packages/tokens/src/typography.styles.json';
import { FoundationCategoryHeader } from '../../../../components/foundation-category-header';
import { SectionHeading } from '../../../../components/section-heading';
import { groupBy } from '../../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Web-типографика — Foundation',
  description: 'Полная шкала Web-текстовых стилей Grtsk Peta в Cometal.',
};

const groups = groupBy(typography.styles, (style) => style.name.split('/')[0]);

export default function FoundationWebTypographyPage() {
  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Типографика"
        description="Типографика организуется по платформам, потому что шрифты, метрики и системные ограничения Web, iOS и Android различаются. Сейчас утверждён слой Web."
      />

      <section className="content-section">
        <SectionHeading
          title="Web"
          description={`${typography.styles.length} текстовых стилей воспроизводят family, weight, size, line-height, letter-spacing и text case из Figma.`}
        />
        <div className="foundation-type-catalog">
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
        </div>
        <InlineLink className="technical-link" href="/storybook/?path=/story/foundation--typography" touchTarget>Открыть техническую Typography story ↗</InlineLink>
      </section>
    </main>
  );
}
