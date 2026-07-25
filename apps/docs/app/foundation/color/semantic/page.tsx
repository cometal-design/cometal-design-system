import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import { FoundationCategoryHeader } from '../../../../components/foundation-category-header';
import { SectionHeading } from '../../../../components/section-heading';
import { aliasName, cssValue, groupBy, semanticTokens } from '../../../../lib/foundation-data';
import { foundationTabs } from '../../../../lib/navigation';

export const metadata: Metadata = {
  title: 'Семантика цвета — Foundation',
  description: 'Полная семантическая карта цветов Cometal.',
};

const semanticColors = semanticTokens.filter((token) => token.type === 'color');
const semanticGroups = groupBy(semanticColors, (token) => token.name.split('/')[1] ?? 'Other');

export default function FoundationSemanticColorsPage() {
  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Цветовая система"
        description="Цвет разделён на два уровня: Primitive хранит исходные значения, Semantic назначает им продуктовые роли. Компоненты используют только semantic-токены."
        tabs={foundationTabs.color}
        activeHref="/foundation/color/semantic/"
      />

      <section className="content-section">
        <SectionHeading
          title="Семантика"
          description={`Карта содержит ${semanticColors.length} ролей. Роль остаётся стабильной, даже если связанное primitive-значение меняется; компоненты и продукт используют этот слой.`}
        />
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
        <InlineLink className="technical-link" href="/storybook/?path=/story/foundation--semantic-colors" touchTarget>Открыть техническую Semantic story ↗</InlineLink>
      </section>
    </main>
  );
}
