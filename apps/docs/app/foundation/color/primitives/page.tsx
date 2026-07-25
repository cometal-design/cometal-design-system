import type { Metadata } from 'next';
import { FoundationCategoryHeader } from '../../../../components/foundation-category-header';
import { SectionHeading } from '../../../../components/section-heading';
import { cssValue, groupBy, primitiveTokens } from '../../../../lib/foundation-data';
import { foundationTabs } from '../../../../lib/navigation';

export const metadata: Metadata = {
  title: 'Примитивы цвета — Foundation',
  description: 'Полная примитивная палитра Cometal.',
};

const primitiveColors = primitiveTokens.filter((token) => token.type === 'color');
const primitiveFamilies = groupBy(primitiveColors, (token) => token.name.split('/')[1] ?? 'Other');

export default function FoundationPrimitiveColorsPage() {
  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Цветовая система"
        description="Цвет разделён на два уровня: Primitive хранит исходные значения, Semantic назначает им продуктовые роли. Компоненты используют только semantic-токены."
        tabs={foundationTabs.color}
        activeHref="/foundation/color/primitives/"
      />

      <section className="content-section">
        <SectionHeading
          title="Примитивы"
          description={`Техническая палитра без продуктового смысла: ${primitiveColors.length} значений. Имя фиксирует семейство, ступень и прозрачность; компоненты не обращаются к этим значениям напрямую.`}
        />
        <div className="foundation-color-families">
          {[...primitiveFamilies].map(([family, tokens]) => (
            <section key={family} className="foundation-color-family">
              <header><h2>{family}</h2><span>{tokens.length} значений</span></header>
              <div className="foundation-swatch-grid">
                {tokens.map((token) => (
                  <article key={token.name}>
                    <i style={{ background: cssValue(token.value) }} aria-label={`Цвет ${cssValue(token.value)}`} />
                    <code>{token.name.replace('Color Primitive Palette/', '')}</code>
                    <span>{cssValue(token.value)}</span>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
        <a className="technical-link" href="/storybook/?path=/story/foundation--primitive-colors">Открыть технический каталог Primitive ↗</a>
      </section>
    </main>
  );
}
