import Link from 'next/link';
import { ComponentPageHeader } from './component-page-header';
import { components, statusLabels } from '../lib/registry';

const table = components.find((item) => item.id === 'data-display.table')!;
const sections = [
  { href: '/components/table/', label: 'Обзор' },
  { href: '/components/table/cells/', label: 'Cells' },
  { href: '/components/table/headers/', label: 'Headers' },
  { href: '/components/table/columns/', label: 'Columns' },
  { href: '/components/table/paginator/', label: 'Paginator' },
] as const;

export function TableFamilyHeader({ activeHref, title = 'Table', summary = 'Семейство таблицы: cells, headers, columns и paginator. Каждый Figma source описан отдельно, но React сохраняет нативную table-семантику.' }: { activeHref: string; title?: string; summary?: string }) {
  return <>
    <ComponentPageHeader eyebrow="ГРУППА КОМПОНЕНТОВ · WEB" title={title} summary={summary} status={table.status} statusLabel={statusLabels[table.status]} figmaHref={table.links.figma} playgroundHref="/storybook/?path=/story/components-table--table-playground" />
    <nav className="component-family-tabs" aria-label="Разделы Table">
      {sections.map((section) => <Link key={section.href} href={section.href} aria-current={section.href === activeHref ? 'page' : undefined} data-active={section.href === activeHref || undefined}>{section.label}</Link>)}
    </nav>
  </>;
}
