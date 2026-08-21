import type { Metadata } from 'next';
import { TableHeadersContract } from '../../../../components/table-contract-examples';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
import { tableFigmaSources } from '../../../../lib/table-documentation';
export const metadata: Metadata = { title: 'Table · Headers' };
export default function TableHeadersPage() { return <main className="content-page component-detail table-family-page"><TableFamilyHeader activeHref="/components/table/headers/" title="Table · Headers" summary="Column Header и Filter Header — два отдельных синхронных уровня. Sort, selection и actions не смешиваются с полями фильтра." /><section className="content-section"><SectionHeading title="Полная матрица Headers" description="Sort, Context Action, Selection Header и десять вариантов Filter Row представлены реальными компонентами, а не текстовым перечнем." /><TableHeadersContract /><p><a href={tableFigmaSources.headers} target="_blank" rel="noreferrer">Открыть Header Source в Figma ↗</a></p></section></main>; }
