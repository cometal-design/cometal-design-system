import Image from 'next/image';
import Link from 'next/link';
import { ReactiveGrid } from '../components/reactive-grid';
import { releases } from '../../storybook/stories/releases.generated';

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
          <div className="home-hero__content">
            <h1>
              Дизайн‑система для согласованной
              <br className="home-hero__line-break" />
              работы команды и ИИ‑агентов
            </h1>
            <div className="home-hero__entry">
              <div className="home-hero__actions">
                <Link className="home-action home-action--primary" href="/documentation/">Начать работу</Link>
                <Link className="home-action home-action--secondary" href="/components/">Компоненты</Link>
              </div>
              <p className="home-hero__description">
                <span>{releases[0].version}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Собрано на{' '}
                  <a href="https://react.dev/learn/installation" target="_blank" rel="noreferrer">
                    React
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
