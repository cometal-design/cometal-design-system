import type { Metadata } from 'next';
import icons from '../../../../../../packages/tokens/src/icons.inventory.json';
import { SectionHeading } from '../../../../components/section-heading';

export const metadata: Metadata = {
  title: 'Каталог иконок — Foundation',
  description: 'Инвентарь и статус инженерной готовности иконок Cometal.',
};

export default function FoundationIconsCatalogPage() {
  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">FOUNDATION / ИКОНКИ / КАТАЛОГ И СТАТУС</span>
          <h1>Каталог иконок</h1>
          <p>Страница фиксирует реальный инвентарь Figma и границу готовности. Пока SVG assets и React API не утверждены, каталог не подменяет их самодельными иконками.</p>
        </div>
        <div className="page-stat"><strong>{icons.totalComponents.toLocaleString('ru-RU')}</strong><span>компонентов Figma</span></div>
      </header>

      <section className="content-section">
        <SectionHeading title="Библиотеки" description="Три источника внутри текущего набора иконок." />
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
        <a className="technical-link" href="/storybook/?path=/story/foundation--icons">Открыть техническую Icons story ↗</a>
      </section>
    </main>
  );
}
