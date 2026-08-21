import type { Metadata } from 'next';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
import { TableSourceExample } from '../../../../components/table-source-example';
export const metadata: Metadata = { title: 'Table · Columns' };
export default function TableColumnsPage() { return <main className="content-page component-detail table-family-page"><TableFamilyHeader activeHref="/components/table/columns/" title="Table · Columns" summary="Read, Edit и utility columns собирают header, filter и body cells в одну вертикальную композицию." /><section className="content-section"><SectionHeading title="Column compositions" description="Ширина и тип контента задаются потребителем. Table синхронизирует header, filter и body, не фиксируя Figma demo width в runtime." /><TableSourceExample /></section></main>; }
