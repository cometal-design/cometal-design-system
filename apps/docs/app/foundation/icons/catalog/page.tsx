import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import icons from '../../../../../../packages/tokens/src/icons.inventory.json';
import { FoundationCategoryHeader } from '../../../../components/foundation-category-header';
import { SectionHeading } from '../../../../components/section-heading';

export const metadata: Metadata = {
  title: 'Каталог иконок — Foundation',
  description: 'Инвентарь и статус инженерной готовности иконок Cometal.',
};

export default function FoundationIconsCatalogPage() {
  return (
    <main className="content-page">
      <FoundationCategoryHeader
        title="Иконографика"
        description="Раздел будет расти вместе с платформенными библиотеками, правилами применения и API. Сейчас опубликован проверенный инвентарь и инженерный статус."
      />

      <section className="content-section">
        <SectionHeading
          title="Каталог"
          description={`${icons.totalComponents.toLocaleString('ru-RU')} компонентов Figma распределены между тремя библиотеками. SVG-ресурсы и React API пока не утверждены.`}
        />
        <div className="foundation-icon-libraries">
          {icons.libraries.map((library) => (
            <article key={library.name}>
              <code>{library.categories} категорий</code>
              <strong>{library.components}</strong>
              <span>{library.name}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading title="Карта замены" description={icons.replacementMap.policy} />
        <div className="foundation-icon-status">
          <article data-tone="positive"><strong>{icons.replacementMap.highConfidence}</strong><span>высокая уверенность</span></article>
          <article data-tone="warning"><strong>{icons.replacementMap.needsVisualReview}</strong><span>нужно визуальное ревью</span></article>
          <article data-tone="negative"><strong>{icons.replacementMap.notFound}</strong><span>не найдено</span></article>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading title="Инженерный статус" description="Инвентарь существует, но кодовая библиотека ещё не утверждена." />
        <div className="notice"><strong>{icons.codeStatus}</strong><span>{icons.codeStatusReason}</span></div>
        <InlineLink className="technical-link" href="/storybook/?path=/story/foundation--icons" touchTarget>Открыть техническую Icons story ↗</InlineLink>
      </section>
    </main>
  );
}
