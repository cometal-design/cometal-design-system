import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__copy">
          <h1>Единая дизайн‑система Cometal</h1>
          <p>Foundation, React-компоненты, паттерны и шаблоны для согласованной работы дизайнеров и разработчиков.</p>
          <div className="home-hero__actions">
            <Link className="home-action home-action--primary" href="/documentation/">Начать работу</Link>
            <Link className="home-action home-action--secondary" href="/components/">Открыть компоненты</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
