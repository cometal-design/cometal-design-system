import type { Metadata } from 'next';
import { CodeExample } from '../../../components/code-example';
import { SectionHeading } from '../../../components/section-heading';
import { TableFamilyHeader } from '../../../components/table-family-header';
import { TablePaginatorExample, TableSourceExample } from '../../../components/table-source-example';
import { usageExamples } from '../../../lib/usage-examples';
import { tableDocumentationSections, tableSourceFamilies, tableStandaloneSources } from '../../../lib/table-documentation';

export const metadata: Metadata = { title: 'Table' };
export default function TablePage() {
  return <main className="content-page component-detail table-family-page"><TableFamilyHeader activeHref="/components/table/" />
    <section className="content-section"><SectionHeading title="Рабочая композиция" description="Первый ряд header содержит названия колонок. Второй независимый ряд содержит синхронные фильтры. Table остаётся нативной HTML-таблицей." /><TableSourceExample /><TablePaginatorExample /></section>
    <section className="content-section"><SectionHeading title="16 source families" description="Каждое утверждённое семейство видно и связано с точным Figma source. Количество variants — evidence покрытия, а не React props." /><div className="table-source-catalog">{tableSourceFamilies.map(([id, label, variants, source]) => <article key={id}><code>{id}</code><h3>{label}</h3><p>{variants} variants</p><a href={source} target="_blank" rel="noreferrer">Figma source ↗</a></article>)}</div></section>
    <section className="content-section"><SectionHeading title="5 standalone sources" description="File Content, Drag Handle Icon, Paginator и два utility headers остаются самостоятельными Figma sources и не подменяют Component Sets в счётчике." /><div className="table-source-catalog">{tableStandaloneSources.map(([id, label, source]) => <article key={id}><code>{id}</code><h3>{label}</h3><p>Standalone source</p><a href={source} target="_blank" rel="noreferrer">Figma source ↗</a></article>)}</div></section>
    <section className="content-section"><SectionHeading title="Разделы" description="Монстрозный компонент не превращается в плоский каталог: Cells, Headers, Columns и Paginator документируются внутри family." /><div className="definition-list">{tableDocumentationSections.map(([label, description], index) => <article key={label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong><p>{description}</p></article>)}</div></section>
    <section className="content-section"><SectionHeading title="Код" description="Минимальный API сохраняет нативную семантику и не копирует Figma variants один-к-одному." /><CodeExample componentName="Table" sourceHref="https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Table/Table.tsx" usage={usageExamples['data-display.table']} /></section>
  </main>;
}
