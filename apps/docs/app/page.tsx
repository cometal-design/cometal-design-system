import Image from 'next/image';
import { ActionLink, InlineLink } from '@cometal/react';
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
              Дизайн‑система для согласованной{' '}
              <br className="home-hero__line-break" />
              работы команды и ИИ‑агентов
            </h1>
            <div className="home-hero__entry">
              <div className="home-hero__actions">
                <ActionLink href="/documentation/">Начать работу</ActionLink>
                <ActionLink href="/components/" variant="secondary">Компоненты</ActionLink>
              </div>
              <p className="home-hero__description">
                <span>{releases[0].version}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Собрано на{' '}
                  <InlineLink href="https://react.dev/learn/installation" target="_blank" rel="noreferrer">
                    React
                  </InlineLink>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
