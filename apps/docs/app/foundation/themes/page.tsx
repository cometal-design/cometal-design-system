import type { Metadata } from 'next';
import inventory from '../../../../../packages/tokens/src/foundation.inventory.json';
import { cssValue, semanticTokens } from '../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Темы — Foundation',
  description: 'Текущая архитектура тем и семантических ролей Cometal.',
};

const themeRoles = semanticTokens.filter((token) =>
  ['Color/Surface/', 'Color/Text/', 'Color/Border/'].some((prefix) => token.name.startsWith(prefix)),
);

export default function FoundationThemesPage() {
  return (
    <main className="content-page">
      <header className="page-header page-header--with-stat">
        <div>
          <span className="eyebrow">FOUNDATION / ТЕМЫ</span>
          <h1>Архитектура тем</h1>
          <p>Тема меняет значения semantic-ролей, не API компонентов. Сейчас Foundation содержит только утверждённый режим Default.</p>
        </div>
        <div className="page-stat"><strong>{inventory.figma.collections[1]?.modes ?? 1}</strong><span>semantic mode</span></div>
      </header>

      <section className="content-section">
        <div className="section-heading">
          <h2>Default</h2>
          <p>Единственный опубликованный режим Semantic collection. Именно его используют портал, Storybook и React-компоненты.</p>
        </div>
        <div className="foundation-theme-sample">
          <div>
            <span>Surface / Canvas</span>
            <strong>Cometal Default</strong>
            <p>Основной светлый режим с системными ролями текста, поверхностей и границ.</p>
          </div>
          <div>
            {themeRoles.slice(0, 12).map((token) => (
              <article key={token.name}>
                <i style={{ background: cssValue(token.value) }} />
                <code>{token.name.replace('Color/', '')}</code>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <h2>Граница готовности</h2>
          <p>Dark theme пока не утверждена как отдельный mode в Figma и поэтому не создаётся локально в коде.</p>
        </div>
        <div className="guidance">
          <article data-tone="positive"><strong>Работает сейчас</strong><p>Default mode, semantic aliases и единое потребление токенов всеми компонентами.</p></article>
          <article data-tone="negative"><strong>Не опубликовано</strong><p>Dark mode, переключатель темы и отдельная карта контраста для тёмных поверхностей.</p></article>
        </div>
        <a className="technical-link" href="/storybook/?path=/story/foundation--semantic-colors">Проверить semantic-роли в Storybook ↗</a>
      </section>
    </main>
  );
}
