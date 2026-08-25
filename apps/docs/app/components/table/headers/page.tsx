import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import { TableHeadersContract } from '../../../../components/table-contract-examples';
import { TableChildDocumentation } from '../../../../components/table-child-documentation';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
import { tableFigmaSources } from '../../../../lib/table-documentation';

export const metadata: Metadata = { title: 'Table · Headers' };
const apiRows = [
  { name: 'TableHeaderCell.sort', type: 'none | ascending | descending', description: 'Текущее направление и aria-sort.' },
  { name: 'onSortChange', type: '(sort) => void', description: 'Цикл none → ascending → descending → none.' },
  { name: 'action', type: 'ReactNode', description: 'Компактное trailing действие заголовка.' },
  { name: 'TableFilterCell.kind', type: 'default | index | selection | drag', description: 'Семантическая placeholder ячейка в отдельном filter row.' },
] as const;

export default function TableHeadersPage() {
  return <main className="content-page component-detail table-family-page">
    <TableFamilyHeader activeHref="/components/table/headers/" title="Table · Headers" summary="Column Header и Filter Header — два отдельных синхронных уровня. Sort, selection и actions не смешиваются с полями фильтра." />
    <TableChildDocumentation childLabel="Headers" useWhen="Для column labels, сортировки, выбора всех строк и синхронного отдельного ряда фильтров над body cells." doNotUseWhen="Не используйте визуальный header как обычную body cell и не помещайте filter control внутрь sort button." behavior="Sortable header сообщает aria-sort и вызывает onSortChange; selection header передаёт checked/indeterminate в Checkbox; пустая filter cell сохраняет скрытое доступное имя." apiRows={apiRows} edgeCases="Disabled selection не меняется; header без sort callback остаётся неинтерактивным; empty filter cell должна сохранять структуру колонки и доступное описание." visualContract={<section className="content-section" id="states"><SectionHeading title="Полная матрица Headers" description="Sort, Context Action, Selection Header и десять вариантов Filter Row представлены реальными компонентами, а не текстовым перечнем." /><TableHeadersContract /><p><InlineLink href={tableFigmaSources.headers} target="_blank" rel="noreferrer">Открыть Header Source в Figma ↗</InlineLink></p></section>} />
  </main>;
}
