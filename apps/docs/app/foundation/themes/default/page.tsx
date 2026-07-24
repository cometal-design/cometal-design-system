import type { Metadata } from 'next';
import { SectionHeading } from '../../../../components/section-heading';
import { cssValue, semanticTokens } from '../../../../lib/foundation-data';

export const metadata: Metadata = {
  title: 'Основная тема — Foundation',
  description: 'Утверждённая основная тема Default для Cometal.',
};

const themeRoles = semanticTokens.filter((token) =>
  ['Color/Surface/', 'Color/Text/', 'Color/Border/'].some((prefix) => token.name.startsWith(prefix)),
);

export default function FoundationDefaultThemePage() {
  return (
    <main className="content-page">
      <header className="page-header">
        <span className="eyebrow">FOUNDATION / ТЕМЫ / DEFAULT</span>
        <h1>Основная тема</h1>
        <p>Единственный опубликованный режим Default семантической коллекции. Именно его используют портал, Storybook и React-компоненты.</p>
      </header>

      <section className="content-section">
        <SectionHeading title="Семантические роли" description="Тема меняет значения ролей, но не API компонентов." />
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
        <SectionHeading title="Граница готовности" description="Тёмная тема пока не утверждена как отдельный режим в Figma и поэтому не создаётся локально в коде." />
        <div className="guidance">
          <article data-tone="positive"><strong>Работает сейчас</strong><p>Режим Default, семантические связи и единое использование токенов всеми компонентами.</p></article>
          <article data-tone="negative"><strong>Не опубликовано</strong><p>Тёмный режим, переключатель темы и отдельная карта контраста для тёмных поверхностей.</p></article>
        </div>
        <a className="technical-link" href="/storybook/?path=/story/foundation--semantic-colors">Проверить семантические роли в Storybook ↗</a>
      </section>
    </main>
  );
}
