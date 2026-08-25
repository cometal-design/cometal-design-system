import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import { TableCellsContract } from '../../../../components/table-contract-examples';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
import { tableFigmaSources } from '../../../../lib/table-documentation';
export const metadata: Metadata = { title: 'Table · Cells' };
export default function TableCellsPage() { return <main className="content-page component-detail table-family-page"><TableFamilyHeader activeHref="/components/table/cells/" title="Table · Cells" summary="Read, Edit, Selection, Index, Drag, Summary и File Content — самостоятельные source families внутри Table." /><section className="content-section"><SectionHeading title="Полная матрица Cells" description="Обе плотности и все утверждённые оси Type, State и Value показаны явно; скрытых состояний в витрине нет." /><TableCellsContract /><p><InlineLink href={tableFigmaSources.cells} target="_blank" rel="noreferrer">Открыть Cells в Figma ↗</InlineLink></p></section></main>; }
