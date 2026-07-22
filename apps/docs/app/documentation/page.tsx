import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Документация' };

const sources = [
  ['Figma DS Core', 'Анатомия, размеры, варианты и визуальные состояния.'],
  ['Git · specification + registry', 'Назначение, правила, стабильный ID, статус и связи.'],
  ['Git · tokens + React', 'Значения токенов, публичный API и исполняемое поведение.'],
  ['Storybook', 'Изолированные состояния, Playground, accessibility и тесты.'],
  ['Obsidian', 'Контекст решений, паттерны, шаблоны и история системы.'],
];

export default function DocumentationPage() {
  return (
    <main className="content-page">
      <header className="page-header">
        <span className="eyebrow">ДОКУМЕНТАЦИЯ</span>
        <h1>Как устроена дизайн-система</h1>
        <p>Cometal Design System — не отдельный Figma-файл и не библиотека React. Это согласованный процесс от визуального решения до проверенного компонента в продукте.</p>
      </header>

      <section className="content-section" id="sources">
        <div className="section-heading"><h2>Источники истины</h2><p>Каждый источник отвечает только за свою часть. Портал показывает их состояние, но не заменяет их.</p></div>
        <div className="definition-list">
          {sources.map(([name, description], index) => (
            <article key={name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><p>{description}</p></article>
          ))}
        </div>
      </section>

      <section className="content-section" id="lifecycle">
        <div className="section-heading"><h2>Жизненный цикл компонента</h2><p>Компонент становится готовым только после проверки всех связанных частей.</p></div>
        <ol className="process-line">
          <li><span>01</span><strong>Утверждён в Figma</strong><p>Design System Lead подтверждает визуальную модель.</p></li>
          <li><span>02</span><strong>Описан</strong><p>Появляются ID, реестр и спецификация.</p></li>
          <li><span>03</span><strong>Реализован</strong><p>Токены и React-компонент фиксируют исполнение.</p></li>
          <li><span>04</span><strong>Проверен</strong><p>Storybook подтверждает состояния и доступность.</p></li>
          <li><span>05</span><strong>Принят продуктом</strong><p>Frontend Lead и продуктовый сценарий закрывают Ready.</p></li>
        </ol>
      </section>
    </main>
  );
}
