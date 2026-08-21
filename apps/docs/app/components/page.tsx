import type { Metadata } from 'next';
import Link from 'next/link';
import { ComponentCatalogPreview } from '../../components/component-catalog-preview';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';
import { checksComplete, components, statusLabels } from '../../lib/registry';

export const metadata: Metadata = { title: 'Компоненты' };

const families = [
  { id: 'action.button', name: 'Button', href: '/components/button/', description: 'Запускает одно понятное действие пользователя.', children: ['action.button'] },
  { id: 'status.badge', name: 'Badge', href: '/components/badge/', description: 'Компактно показывает статус или атрибут сущности.', children: ['status.badge'] },
  { id: 'input.fields', name: 'Fields', href: '/components/fields/', description: 'Text Field, Text Area, Select, Combobox и Multi Select в одном семействе.', children: ['input.text-field', 'input.text-area', 'input.select', 'input.combobox', 'input.multi-select'] },
  { id: 'input.date-picker', name: 'Date Picker', href: '/components/date-picker/', description: 'Ручной ввод и календарный выбор даты или периода.', children: ['input.date-picker'] },
  { id: 'selection.checkbox', name: 'Checkbox', href: '/components/checkbox/', description: 'Независимый выбор: unchecked, checked и mixed.', children: ['selection.checkbox'] },
  { id: 'selection.radio-button', name: 'Radio Button', href: '/components/radio-button/', description: 'Один вариант из взаимоисключающей группы.', children: ['selection.radio-button'] },
  { id: 'selection.switch', name: 'Switch', href: '/components/switch/', description: 'Мгновенно включает или выключает настройку.', children: ['selection.switch'] },
  { id: 'overlay.tooltip', name: 'Tooltip', href: '/components/tooltip/', description: 'Короткое пояснение для элемента интерфейса.', children: ['overlay.tooltip'] },
  { id: 'data-display.table', name: 'Table', href: '/components/table/', description: 'Cells, headers, columns и paginator в одном большом семействе.', children: ['data-display.table'] },
  { id: 'template.widget', name: 'Widget', href: '/components/widget/', description: 'Универсальная оболочка для title, toolbar и любого content slot.', children: ['template.widget'] },
  { id: 'overlay.context-menu', name: 'Context Menu', href: '/components/context-menu/', description: 'Контекстные действия над сущностью с pointer и keyboard anchor.', children: ['overlay.context-menu'] },
] as const;

const componentCatalog = families.map((family) => {
  const children = family.children.map((id) => components.find((component) => component.id === id)).filter(Boolean);
  const status = children.every((component) => component?.status === 'ready') ? 'ready' : 'in-review';
  const checks = children.length ? Math.min(...children.map((component) => checksComplete(component!))) : 0;
  return { ...family, status, checks, version: children[0]?.version ?? '0.1.0-beta.1' };
});

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
            <div className="component-card__preview"><div className="component-card__demo"><ComponentCatalogPreview id={family.id} /></div></div>
            <div className="component-card__body">
              <div><code>{family.id}</code><span className="status" data-status={family.status}>{statusLabels[family.status] ?? family.status}</span></div>
              <h2><Link href={family.href}>{family.name}</Link></h2>
              <p>{family.description}</p>
              <footer><span>{family.version}</span><span>{family.checks}/5 источников согласовано</span></footer>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
