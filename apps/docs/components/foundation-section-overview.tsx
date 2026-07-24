import Link from 'next/link';

type FoundationSectionItem = {
  index: string;
  title: string;
  description: string;
  meta: string;
  href: string;
};

export function FoundationSectionOverview({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: FoundationSectionItem[];
}) {
  return (
    <main className="content-page">
      <header className="page-header">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <section className="content-section">
        <div className="section-heading">
          <h2>Разделы</h2>
          <p>Каждый пункт — самостоятельная страница. Тот же уровень доступен через раскрывающуюся группу в боковой навигации.</p>
        </div>
        <div className="foundation-catalog">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <code>{item.index}</code>
              <div>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
              <small>{item.meta}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
