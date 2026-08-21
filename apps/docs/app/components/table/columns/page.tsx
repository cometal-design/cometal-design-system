import type { Metadata } from 'next';
import { TableColumnsContract } from '../../../../components/table-contract-examples';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
export const metadata: Metadata = { title: 'Table · Columns' };
export default function TableColumnsPage() { return <main className="content-page component-detail table-family-page"><TableFamilyHeader activeHref="/components/table/columns/" title="Table · Columns" summary="Read, Edit, Index, Selection и Drag Handle Columns собирают header, filter, body и summary в вертикальные композиции." /><section className="content-section"><SectionHeading title="Полная матрица Columns" description="Пять column families показаны в Comfortable и Compact. Row counts остаются Figma evidence, а не React props." /><TableColumnsContract /></section></main>; }
