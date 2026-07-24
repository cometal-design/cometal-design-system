import type { Metadata } from 'next';
import { cssValue, groupBy, primitiveTokens } from '../../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Примитивы цвета — Foundation',
  description: 'Полная примитивная палитра Cometal.',
};

const primitiveColors = primitiveTokens.filter((token) => token.type === 'color');
const primitiveFamilies = groupBy(primitiveColors, (token) => token.name.split('/')[1] ?? 'Other');

export default function FoundationPrimitiveColorsPage() {
  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">FOUNDATION / ЦВЕТ / ПРИМИТИВЫ</span>
          <h1>Примитивы цвета</h1>
          <p>Техническая палитра без продуктового смысла. Имя фиксирует семейство, ступень и прозрачность; компоненты не обращаются к этим значениям напрямую.</p>
        </div>
        <div className="page-stat"><strong>{primitiveColors.length}</strong><span>primitive-значений</span></div>
      </header>

      <section className="content-section">
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
