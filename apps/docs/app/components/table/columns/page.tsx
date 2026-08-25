import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import { TableColumnsContract } from '../../../../components/table-contract-examples';
import { TableChildDocumentation } from '../../../../components/table-child-documentation';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
import { tableFigmaSources } from '../../../../lib/table-documentation';

export const metadata: Metadata = { title: 'Table · Columns' };
const apiRows = [
  { name: 'Column component', type: 'N/A', description: 'Отдельного публичного Column component нет; колонка — согласованная композиция header/filter/body/summary cells.' },
  { name: 'Table.density', type: 'comfortable | compact', description: 'Общая плотность синхронно применяется ко всей column composition.' },
  { name: 'TableHeaderCell.kind', type: 'default | index | selection | drag', description: 'Структурная специализация header.' },
  { name: 'TableCell.align', type: 'start | center | end', description: 'Выравнивание значений внутри body/summary.' },
] as const;

export default function TableColumnsPage() {
  return <main className="content-page component-detail table-family-page">
    <TableFamilyHeader activeHref="/components/table/columns/" title="Table · Columns" summary="Read, Edit, Index, Selection и Drag Handle Columns собирают header, filter, body и summary в вертикальные композиции." />
    <TableChildDocumentation childLabel="Columns" useWhen="Для вертикально согласованной композиции header, optional filter, body и summary одного типа данных." doNotUseWhen="Не используйте отдельный локальный Column wrapper: он ломает нативную table-разметку и дублирует общие primitives." behavior="Колонка не имеет отдельного runtime object: порядок th/td определяется строками, а одинаковый kind и density поддерживают визуальное соответствие по вертикали." apiRows={apiRows} edgeCases="Optional filter или summary сохраняют пустую семантическую cell; длинные значения используют overflow policy продукта, а empty dataset оформляется на уровне общей Table composition." visualContract={<section className="content-section" id="states"><SectionHeading title="Полная матрица Columns" description="Пять column families показаны в Comfortable и Compact. Row counts остаются Figma evidence, а не React props." /><TableColumnsContract /><p><InlineLink href={tableFigmaSources.mainComponents} target="_blank" rel="noreferrer">Открыть Main Components в Figma ↗</InlineLink></p></section>} />
  </main>;
}
