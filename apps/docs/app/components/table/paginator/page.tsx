import type { Metadata } from 'next';
import { InlineLink } from '@cometal/react';
import { TablePaginatorContract } from '../../../../components/table-contract-examples';
import { TableChildDocumentation } from '../../../../components/table-child-documentation';
import { SectionHeading } from '../../../../components/section-heading';
import { TableFamilyHeader } from '../../../../components/table-family-header';
import { tableFigmaSources } from '../../../../lib/table-documentation';

export const metadata: Metadata = { title: 'Table · Paginator' };
const apiRows = [
  { name: 'page', type: 'number', description: 'Текущая страница; значение ограничивается диапазоном 1…pageCount.' },
  { name: 'pageCount', type: 'number', description: 'Общее число страниц, минимум одна.' },
  { name: 'onPageChange', type: '(page: number) => void', description: 'Обязательный controlled переход.' },
  { name: 'pageSize / pageSizeOptions', type: 'number / readonly number[]', description: 'Опциональный выбор количества строк.' },
  { name: 'onPageSizeChange', type: '(pageSize: number) => void', description: 'Включает page-size control; без callback select disabled.' },
] as const;

export default function TablePaginatorPage() {
  return <main className="content-page component-detail table-family-page">
    <TableFamilyHeader activeHref="/components/table/paginator/" title="Table · Paginator" summary="Previous, Page, Ellipsis, Next и page-size control с самостоятельными состояниями и клавиатурной доступностью." />
    <TableChildDocumentation childLabel="Paginator" useWhen="Для controlled перехода между страницами Table и опционального выбора числа строк на странице." doNotUseWhen="Не используйте Paginator для бесконечной ленты или когда весь небольшой dataset уже помещается без разбиения." behavior="Current page получает aria-current=page; Previous/Next disabled на границах; ellipsis скрыт от accessibility tree, а каждая page button имеет доступное имя." apiRows={apiRows} edgeCases="Page меньше 1 или больше pageCount безопасно ограничивается; pageCount 0 трактуется как одна страница; без onPageSizeChange optional select остаётся disabled." visualContract={<section className="content-section" id="states"><SectionHeading title="Полная матрица Paginator" description="Интерактивный Paginator и реальные first/middle/last compositions показывают disabled, current и ellipsis states." /><TablePaginatorContract /><p><InlineLink href={tableFigmaSources.paginator} target="_blank" rel="noreferrer">Открыть Paginator Source в Figma ↗</InlineLink></p></section>} />
  </main>;
}
