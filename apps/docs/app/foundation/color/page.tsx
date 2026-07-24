import type { Metadata } from 'next';
import {
  aliasName,
  cssValue,
  groupBy,
  primitiveTokens,
  semanticTokens,
} from '../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Цвет — Foundation',
  description: 'Примитивная палитра и семантическая карта цветов Cometal.',
};

const primitiveColors = primitiveTokens.filter((token) => token.type === 'color');
const semanticColors = semanticTokens.filter((token) => token.type === 'color');
const primitiveFamilies = groupBy(primitiveColors, (token) => token.name.split('/')[1] ?? 'Other');
const semanticGroups = groupBy(semanticColors, (token) => token.name.split('/')[1] ?? 'Other');

export default function FoundationColorPage() {
  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">FOUNDATION / ЦВЕТ</span>
          <h1>Цветовая система</h1>
          <p>Primitive хранит исходные значения. Semantic назначает им устойчивую роль. Компоненты используют semantic-токены, а не значения палитры напрямую.</p>
        </div>
        <div className="page-stat"><strong>{primitiveColors.length + semanticColors.length}</strong><span>цветовых токенов</span></div>
      </header>

      <section className="foundation-stats" aria-label="Структура цветовой системы">
        <article><strong>{primitiveColors.length}</strong><span>primitive-значения</span></article>
        <article><strong>{semanticColors.length}</strong><span>semantic-роли</span></article>
        <article><strong>{primitiveFamilies.size}</strong><span>семейств палитры</span></article>
        <article><strong>{semanticGroups.size}</strong><span>групп назначения</span></article>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h2>Primitive</h2>
          <p>Техническая палитра без продуктового смысла. Имя фиксирует семейство, ступень и прозрачность.</p>
        </div>
        <div className="foundation-color-families">
          {[...primitiveFamilies].map(([family, tokens]) => (
            <section key={family} className="foundation-color-family">
              <header><h3>{family}</h3><span>{tokens.length} значений</span></header>
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

      <section className="content-section" id="semantic">
        <div className="section-heading">
          <h2>Semantic</h2>
          <p>Роль остаётся стабильной, даже если связанное primitive-значение меняется. Таблица показывает роль, alias и фактический resolved color.</p>
        </div>
        <div className="foundation-semantic-groups">
          {[...semanticGroups].map(([group, tokens]) => (
            <section key={group} className="foundation-semantic-group">
              <header><h3>{group}</h3><span>{tokens.length} ролей</span></header>
              <div className="foundation-data-table" role="table" aria-label={`${group}: семантические цвета`}>
                <div className="foundation-data-table__head" role="row">
                  <span role="columnheader">Роль</span><span role="columnheader">Preview</span><span role="columnheader">Alias</span><span role="columnheader">Resolved</span>
                </div>
                {tokens.map((token) => (
                  <div role="row" key={token.name}>
                    <code role="cell">{token.name}</code>
                    <i role="cell" style={{ background: cssValue(token.value) }} aria-label={`Цвет ${cssValue(token.value)}`} />
                    <span role="cell">{aliasName(token.value)}</span>
                    <strong role="cell">{cssValue(token.value)}</strong>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <a className="technical-link" href="/storybook/?path=/story/foundation--semantic-colors">Открыть техническую Semantic story ↗</a>
      </section>
    </main>
  );
}
