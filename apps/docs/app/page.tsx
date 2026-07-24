import Image from 'next/image';
import Link from 'next/link';
import { ReactiveGrid } from '../components/reactive-grid';

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <ReactiveGrid
          className="home-hero__grid"
          maxSize={16}
          minSize={0}
          gap={8}
          influenceRadius={240}
          particleColor="#F0F0F0"
          backgroundColor="#FFFFFF"
        />
        <div className="home-hero__copy">
          <Image
            className="home-hero__brand"
            src="/cometal-logotype.svg"
            alt="Cometal"
            width={201}
            height={26}
            priority
          />
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
