import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@cometal/react';
import { checksComplete, components, statusLabels } from '../../lib/registry';

export const metadata: Metadata = { title: 'Компоненты' };

export default function ComponentsPage() {
  return (
    <main className="content-page components-page">
      <header className="page-header page-header--with-stat">
        <div><span className="eyebrow">КОМПОНЕНТЫ</span><h1>Overview</h1><p>Единый каталог реализованных компонентов. Карточка появляется здесь из реестра Git, а не добавляется вручную.</p></div>
        <div className="page-stat"><strong>{components.length}</strong><span>зарегистрирован</span></div>
      </header>

      <section className="catalog-toolbar" aria-label="Сводка каталога">
        <span>Web · React</span><span>{components.filter((component) => component.status === 'ready').length} Ready</span><span>{components.filter((component) => component.status === 'in-review').length} In review</span>
      </section>

      <section className="component-catalog" aria-label="Каталог компонентов">
        {components.map((component) => (
          <article className="component-card" key={component.id}>
            <div className="component-card__preview"><Button>Продолжить</Button></div>
            <div className="component-card__body">
              <div><code>{component.id}</code><span className="status" data-status={component.status}>{statusLabels[component.status] ?? component.status}</span></div>
              <h2><Link href="/components/button/">{component.name}</Link></h2>
              <p>Запускает одно понятное действие пользователя.</p>
              <footer><span>{component.version}</span><span>{checksComplete(component)}/5 источников согласовано</span></footer>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
