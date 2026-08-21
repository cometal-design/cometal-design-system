import type { Metadata } from 'next';
import { TablePaginatorContract } from '../../../../components/table-contract-examples';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
import { tableFigmaSources } from '../../../../lib/table-documentation';
export const metadata: Metadata = { title: 'Table · Paginator' };
export default function TablePaginatorPage() { return <main className="content-page component-detail table-family-page"><TableFamilyHeader activeHref="/components/table/paginator/" title="Table · Paginator" summary="Previous, Page, Ellipsis, Next и page-size control с самостоятельными состояниями и клавиатурной доступностью." /><section className="content-section"><SectionHeading title="Полная матрица Paginator" description="Интерактивный Paginator и реальные first/middle/last compositions показывают disabled, current и ellipsis states." /><TablePaginatorContract /><p><a href={tableFigmaSources.paginator} target="_blank" rel="noreferrer">Открыть Paginator Source в Figma ↗</a></p></section></main>; }
