import type { Metadata } from 'next';
import { aliasName, cssValue, groupBy, semanticTokens } from '../../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Семантика цвета — Foundation',
  description: 'Полная семантическая карта цветов Cometal.',
};

const semanticColors = semanticTokens.filter((token) => token.type === 'color');
const semanticGroups = groupBy(semanticColors, (token) => token.name.split('/')[1] ?? 'Other');

export default function FoundationSemanticColorsPage() {
  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">FOUNDATION / ЦВЕТ / СЕМАНТИКА</span>
          <h1>Семантика цвета</h1>
          <p>Роль остаётся стабильной, даже если связанное primitive-значение меняется. Компоненты и продукт используют этот слой.</p>
        </div>
        <div className="page-stat"><strong>{semanticColors.length}</strong><span>semantic-ролей</span></div>
      </header>

      <section className="content-section">
        <div className="foundation-semantic-groups">
          {[...semanticGroups].map(([group, tokens]) => (
            <section key={group} className="foundation-semantic-group">
              <header><h2>{group}</h2><span>{tokens.length} ролей</span></header>
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
