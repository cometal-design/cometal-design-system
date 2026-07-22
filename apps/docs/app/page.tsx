import Link from 'next/link';

const sources = [
  ['Figma', 'Визуальная модель'],
  ['Git', 'Спецификации и реестр'],
  ['React', 'Исполняемый компонент'],
  ['Storybook', 'Состояния и проверки'],
  ['Obsidian', 'Контекст и решения'],
];

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <span className="eyebrow">COMETAL · DESIGN SYSTEM · WEB</span>
          <h1>Одна система.<br />Пять согласованных источников.</h1>
          <p>Портал связывает визуальную модель, спецификации, код и проверенные состояния компонентов — без ручного дублирования документации.</p>
          <div className="home-hero__actions">
            <Link className="primary-action" href="/components/">Открыть компоненты</Link>
            <Link className="text-link" href="/documentation/">Как устроена система <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="source-orbit" aria-label="Источники дизайн-системы">
          <div className="source-orbit__center"><strong>Cometal</strong><span>Design System</span></div>
          {sources.map(([name, role], index) => (
            <div className="source-orbit__item" key={name} style={{ '--source-index': index } as React.CSSProperties}>
              <strong>{name}</strong><span>{role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home-entry-points" aria-label="Разделы портала">
        <Link href="/foundation/"><span>01</span><strong>Foundation</strong><p>Токены, типографика, цвет, сетки и темы.</p></Link>
        <Link href="/components/"><span>02</span><strong>Компоненты</strong><p>Живые примеры, API, состояния и готовность.</p></Link>
        <Link href="/patterns/"><span>03</span><strong>Паттерны</strong><p>Повторяемые способы решения продуктовых задач.</p></Link>
        <Link href="/templates/"><span>04</span><strong>Шаблоны</strong><p>Структуры экранов и бизнес-процессов.</p></Link>
      </section>
    </main>
  );
}
