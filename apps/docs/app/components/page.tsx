import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@cometal/react';
import { ComponentCatalogPreview } from '../../components/component-catalog-preview';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';
import { componentCatalog, statusLabels } from '../../lib/registry';

export const metadata: Metadata = { title: 'Компоненты' };

export default function ComponentsPage() {
  return (
    <main className="content-page components-page">
      <PageHeader
        eyebrow="КОМПОНЕНТЫ"
        title="Каталог компонентов"
        description="Единый каталог реализованных компонентов. Карточка появляется здесь из реестра Git, а не добавляется вручную."
        stat={{ value: componentCatalog.length, label: 'компонентов в каталоге' }}
      />

      <MetadataStrip
        ariaLabel="Сводка каталога"
        bottomDivider
        items={[
          'Web · React',
          `${componentCatalog.filter((component) => component.status === 'ready').length} Ready`,
          `${componentCatalog.filter((component) => component.status === 'in-review').length} In review`,
        ]}
      />

      <section className="component-catalog" aria-label="Каталог компонентов">
        {componentCatalog.map((family) => (
          <article className="component-card" data-component-id={family.id} key={family.id}>
            <div className="component-card__preview"><div className="component-card__demo"><ComponentCatalogPreview id={family.preview} /></div></div>
            <div className="component-card__body">
              <div><code>{family.id}</code><Badge tone={family.status === 'ready' ? 'green' : 'yellow'}>{statusLabels[family.status] ?? family.status}</Badge></div>
              <h2><Link href={family.route}>{family.name}</Link></h2>
              <p>{family.description}</p>
              <footer><span>{family.version}</span><span>{family.checks}/5 источников согласовано</span></footer>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
