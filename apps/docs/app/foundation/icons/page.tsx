import type { Metadata } from 'next';
import icons from '../../../../../packages/tokens/src/icons.inventory.json';

export const metadata: Metadata = {
  title: 'Иконки — Foundation',
  description: 'Инвентарь и статус инженерной готовности иконок Cometal.',
};

export default function FoundationIconsPage() {
  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">FOUNDATION / ИКОНКИ</span>
          <h1>Иконографика</h1>
          <p>Страница фиксирует реальный инвентарь Figma и границу готовности. Пока SVG assets и React API не утверждены, каталог не подменяет их самодельными иконками.</p>
        </div>
        <div className="page-stat"><strong>{icons.totalComponents.toLocaleString('ru-RU')}</strong><span>компонентов Figma</span></div>
      </header>

      <section className="content-section">
        <div className="section-heading"><h2>Библиотеки</h2><p>Три источника внутри текущего набора иконок.</p></div>
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
        <div className="section-heading"><h2>Карта замены</h2><p>{icons.replacementMap.policy}</p></div>
        <div className="foundation-icon-status">
          <article data-tone="positive"><strong>{icons.replacementMap.highConfidence}</strong><span>высокая уверенность</span></article>
          <article data-tone="warning"><strong>{icons.replacementMap.needsVisualReview}</strong><span>нужно визуальное ревью</span></article>
          <article data-tone="negative"><strong>{icons.replacementMap.notFound}</strong><span>не найдено</span></article>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><h2>Инженерный статус</h2><p>Инвентарь существует, но кодовая библиотека ещё не утверждена.</p></div>
        <div className="notice"><strong>{icons.codeStatus}</strong><span>{icons.codeStatusReason}</span></div>
        <a className="technical-link" href="/storybook/?path=/story/foundation--icons">Открыть техническую Icons story ↗</a>
      </section>
    </main>
  );
}
