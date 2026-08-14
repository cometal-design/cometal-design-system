import type { Metadata } from 'next';
import Link from 'next/link';
import { ComponentCatalogPreview } from '../../components/component-catalog-preview';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';
import { checksComplete, components, statusLabels } from '../../lib/registry';

export const metadata: Metadata = { title: 'Компоненты' };

const catalogContent: Record<string, { href: string; description: string }> = {
  'action.button': { href: '/components/button/', description: 'Запускает одно понятное действие пользователя.' },
  'status.badge': { href: '/components/badge/', description: 'Компактно показывает статус или атрибут сущности.' },
  'input.text-field': { href: '/components/fields/#text-field', description: 'Однострочный ввод в режимах Edit и Read.' },
  'input.date-picker': { href: '/components/date-picker/', description: 'Ручной ввод и календарный выбор одной даты.' },
  'input.text-area': { href: '/components/fields/#text-area', description: 'Многострочный ввод с helper и counter.' },
  'input.select': { href: '/components/fields/#select', description: 'Одиночный выбор из известного набора.' },
  'input.combobox': { href: '/components/fields/#combobox', description: 'Поиск и выбор одного значения.' },
  'input.multi-select': { href: '/components/fields/#multi-select', description: 'Множественный выбор с tags в trigger.' },
  'selection.checkbox': { href: '/components/checkbox/', description: 'Независимый выбор: unchecked, checked и mixed.' },
  'selection.radio-button': { href: '/components/radio-button/', description: 'Один вариант из взаимоисключающей группы.' },
  'selection.switch': { href: '/components/switch/', description: 'Мгновенно включает или выключает настройку.' },
};

const componentCatalog = components.filter((component) => !component.id.startsWith('data-display.'));

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
        {componentCatalog.map((component) => (
          <article className="component-card" data-component-id={component.id} key={component.id}>
            <div className="component-card__preview"><div className="component-card__demo"><ComponentCatalogPreview id={component.id} /></div></div>
            <div className="component-card__body">
              <div><code>{component.id}</code><span className="status" data-status={component.status}>{statusLabels[component.status] ?? component.status}</span></div>
              <h2><Link href={catalogContent[component.id]?.href ?? '/components/'}>{component.name}</Link></h2>
              <p>{catalogContent[component.id]?.description}</p>
              <footer><span>{component.version}</span><span>{checksComplete(component)}/5 источников согласовано</span></footer>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
