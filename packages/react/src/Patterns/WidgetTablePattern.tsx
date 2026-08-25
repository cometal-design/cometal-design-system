import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { Button, IconButton } from '../Button/Button';
import { ContextMenuDivider, ContextMenuItem } from '../ContextMenu/ContextMenu';
import { DatePicker } from '../DatePicker/DatePicker';
import { Select, TextField } from '../Field/Field';
import {
  Table, TableBody, TableCell, TableContextAction, TableDragCell, TableDragHandle,
  TableFileCell, TableFilterCell, TableFilterRow, TableHeaderCell, TableHead,
  TableIndexCell, TablePaginator, TableRow, TableSelectionCell, TableSelectionHeader,
  TableSummaryCell, reorderTableRows,
} from '../Table/Table';
import type { TableDensity, TableSortDirection } from '../Table/Table';
import { Widget } from '../Widget/Widget';
import RefreshIcon from '../icons/generated/components/outline/arrows/arrow-refresh-01';
import DownloadIcon from '../icons/generated/components/outline/general/download-01';
import FilterIcon from '../icons/generated/components/outline/general/filter';
import PlusIcon from '../icons/generated/components/outline/general/plus-01';
import FlexRowsIcon from '../icons/generated/components/outline/layout/flex-rows';
import './widget-table-pattern.css';

export interface WidgetTablePatternProps {
  title: ReactNode;
  description?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Product pattern: Widget owns the shell, Table owns the data surface and paginator. */
export function WidgetTablePattern({ title, description, toolbar, children, footer, className }: WidgetTablePatternProps) {
  return (
    <Widget title={title} description={description} toolbar={toolbar} className={['cometal-widget-table-pattern', className].filter(Boolean).join(' ')}>
      <div className="cometal-widget-table-pattern__table">{children}</div>
      {footer ? <div className="cometal-widget-table-pattern__footer">{footer}</div> : null}
    </Widget>
  );
}

const statusOptions = [
  { value: 'all', label: 'Все' },
  { value: 'approved', label: 'Согласован' },
  { value: 'review', label: 'На проверке' },
  { value: 'working', label: 'В работе' },
  { value: 'draft', label: 'Черновик' },
];

const rows = [
  ['POS-001', 'Лист горячекатаный', '09Г2С', 24, 'т', 86400, '21.08.2026', 'Вх. 233-500', 'Согласован', 'Комплектность', 'Северсталь'],
  ['POS-002', 'Труба профильная', 'Ст3сп5', 18, 'т', 94800, '24.08.2026', 'Вх. 234-501', 'На проверке', 'Качество', 'ЕВРАЗ Маркет'],
  ['POS-003', 'Швеллер 20П', '10ХСНД', 12, 'т', 78200, '26.08.2026', 'Вх. 235-502', 'В работе', 'Срок поставки', 'Мечел-Сервис'],
  ['POS-004', 'Балка двутавровая', 'S355J2', 8, 'шт', 142000, '28.08.2026', 'Вх. 236-503', 'Согласован', 'Цена', 'ОМК'],
  ['POS-005', 'Арматура А500С', 'А500С', 32, 'т', 71500, '31.08.2026', 'Вх. 237-504', 'Черновик', 'Документы', 'Металлоинвест'],
  ['POS-006', 'Уголок 75×75×6', 'Ст3сп', 16, 'т', 82100, '02.09.2026', 'Вх. 238-505', 'В работе', 'Объём', 'А ГРУПП'],
  ['POS-007', 'Лист оцинкованный', '08пс', 20, 'т', 109300, '04.09.2026', 'Вх. 239-506', 'На проверке', 'Маркировка', 'НЛМК'],
  ['POS-008', 'Круг стальной', '40Х', 14, 'т', 96700, '07.09.2026', 'Вх. 240-507', 'Отклонен', 'Сертификат', 'ТМК'],
  ['POS-009', 'Полоса 50×5', 'Ст3', 28, 'т', 74900, '09.09.2026', 'Вх. 241-508', 'Согласован', 'Упаковка', 'Сталепромышленная'],
  ['POS-010', 'Труба электросварная', 'Ст20', 10, 'т', 88600, '11.09.2026', 'Вх. 242-509', 'В работе', 'Приёмка', 'МЕТАЛЛСЕРВИС'],
] as const;

type ReviewRow = (typeof rows)[number];

function toneForStatus(status: string): 'green' | 'blue' | 'yellow' | 'red' {
  if (status === 'Согласован') return 'green';
  if (status === 'Черновик') return 'yellow';
  if (status === 'Отклонен') return 'red';
  return 'blue';
}

function HeaderMenu() {
  return <><ContextMenuItem>Закрепить слева</ContextMenuItem><ContextMenuItem>Скрыть колонку</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Сбросить фильтр</ContextMenuItem></>;
}

function HeaderAction({ label }: { label: string }) {
  return <TableContextAction label={`Действия колонки ${label}`} menuLabel={`Действия колонки ${label}`} menu={<HeaderMenu />} />;
}

export interface WidgetTableReviewExampleProps {
  initialDensity?: TableDensity;
}

/** Shared documentation evidence for the approved Widget + Table composition. */
export function WidgetTableReviewExample({ initialDensity = 'comfortable' }: WidgetTableReviewExampleProps) {
  const [orderedRows, setOrderedRows] = useState<readonly ReviewRow[]>(() => [...rows]);
  const [density, setDensity] = useState<TableDensity>(initialDensity);
  const [filters, setFilters] = useState(true);
  const [selected, setSelected] = useState<string[]>(['POS-005', 'POS-010']);
  const [sort, setSort] = useState<TableSortDirection>('none');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const visibleRows = useMemo(() => orderedRows.filter((row) => {
    const matchesText = `${row[0]} ${row[1]} ${row[2]} ${row[10]}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'all' || (status === 'approved' && row[8] === 'Согласован') || (status === 'review' && row[8] === 'На проверке') || (status === 'working' && row[8] === 'В работе') || (status === 'draft' && row[8] === 'Черновик');
    return matchesText && matchesStatus;
  }), [orderedRows, query, status]);
  const totalQuantity = visibleRows.reduce((total, row) => total + row[3], 0);
  const totalSum = visibleRows.reduce((total, row) => total + row[3] * row[5], 0);

  const toolbar = <>
    <IconButton
      size="m"
      variant="secondary"
      aria-label={density === 'comfortable' ? 'Включить компактную плотность' : 'Включить комфортную плотность'}
      aria-pressed={density === 'compact'}
      icon={<FlexRowsIcon />}
      onClick={() => setDensity((value) => value === 'comfortable' ? 'compact' : 'comfortable')}
    />
    <IconButton size="m" variant="secondary" aria-label={filters ? 'Скрыть фильтры' : 'Показать фильтры'} icon={<FilterIcon />} onClick={() => setFilters((value) => !value)} />
    <IconButton size="m" variant="secondary" aria-label="Обновить" icon={<RefreshIcon />} />
    <IconButton size="m" variant="secondary" aria-label="Экспорт" icon={<DownloadIcon />} />
    <Button size="m" startIcon={<PlusIcon />}>Добавить запись</Button>
  </>;

  return (
    <WidgetTablePattern title="Спецификация позиций" description={`${visibleRows.length} строк · фильтры по колонкам ${filters ? 'включены' : 'выключены'}`} toolbar={toolbar} footer={<TablePaginator page={page} pageCount={9} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} />}>
      <Table density={density} aria-label="Спецификация позиций" onRowReorder={(event) => setOrderedRows((current) => reorderTableRows(current, event, (row) => row[0]))}>
        <TableHead>
          <TableRow>
            <TableHeaderCell kind="drag"><span className="cometal-widget-table-pattern__sr-only">Перемещение</span></TableHeaderCell>
            <TableHeaderCell kind="index">№</TableHeaderCell>
            <TableSelectionHeader selectedCount={selected.length} totalCount={orderedRows.length} onSelectionChange={(checked) => setSelected(checked ? orderedRows.map((row) => row[0]) : [])} />
            <TableHeaderCell sort={sort} onSortChange={setSort} action={<HeaderAction label="Позиция" />}>Позиция</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Наименование" />}>Наименование</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Марка стали" />}>Марка стали</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Количество" />}>Количество</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Единица" />}>Ед.</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Цена" />}>Цена, ₽</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Сумма" />}>Сумма, ₽</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Дата поставки" />}>Дата поставки</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Документ" />}>Документ</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Файл" />}>Файл</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Статус" />}>Статус</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Контроль" />}>Контроль</TableHeaderCell>
            <TableHeaderCell action={<HeaderAction label="Поставщик" />}>Поставщик</TableHeaderCell>
          </TableRow>
          {filters ? <TableFilterRow aria-label="Фильтры таблицы">
            <TableFilterCell kind="drag" /><TableFilterCell kind="index" /><TableFilterCell kind="selection" />
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по позиции" size="s" placeholder="Содержит" value={query} onChange={(event) => setQuery(event.currentTarget.value)} /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по наименованию" size="s" placeholder="Содержит" /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по марке" size="s" placeholder="Содержит" /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по количеству" size="s" placeholder="Равно" inputMode="numeric" /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по единице" size="s" placeholder="Равно" /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по цене" size="s" placeholder="Равно" inputMode="numeric" /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по сумме" size="s" placeholder="Равно" inputMode="numeric" /></TableFilterCell>
            <TableFilterCell><DatePicker className="cometal-widget-table-pattern__filter" label="Фильтр по дате" size="s" placeholder="Дата равна" /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по документу" size="s" placeholder="Содержит" /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по файлу" size="s" placeholder="Содержит" /></TableFilterCell>
            <TableFilterCell><Select className="cometal-widget-table-pattern__filter" label="Фильтр по статусу" size="s" options={statusOptions} value={status} onValueChange={setStatus} /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по контролю" size="s" placeholder="Равно" /></TableFilterCell>
            <TableFilterCell><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по поставщику" size="s" placeholder="Равно" /></TableFilterCell>
          </TableFilterRow> : null}
        </TableHead>
        <TableBody>
          {visibleRows.map((row, index) => {
            const sum = row[3] * row[5];
            return <TableRow key={row[0]} reorderId={row[0]} selected={selected.includes(row[0])}>
              <TableDragCell><TableDragHandle rowLabel={row[0]} /></TableDragCell>
              <TableIndexCell>{index + 1}</TableIndexCell>
              <TableSelectionCell label={`Выбрать ${row[0]}`} checked={selected.includes(row[0])} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, row[0]] : current.filter((value) => value !== row[0]))} />
              <TableCell>{row[0]}</TableCell><TableCell>{row[1]}</TableCell><TableCell>{row[2]}</TableCell>
              <TableCell align="end">{row[3]}</TableCell><TableCell>{row[4]}</TableCell>
              <TableCell align="end">{row[5].toLocaleString('ru-RU')}</TableCell><TableCell align="end">{sum.toLocaleString('ru-RU')}</TableCell>
              <TableCell>{row[6]}</TableCell><TableCell>{row[7]}</TableCell>
              <TableFileCell fileName="Спецификация.pdf" fileSize="130 КБ" fileType="pdf" />
              <TableCell><Badge tone={toneForStatus(row[8])}>{row[8]}</Badge></TableCell><TableCell>{row[9]}</TableCell><TableCell>{row[10]}</TableCell>
            </TableRow>;
          })}
          <TableRow><TableSummaryCell kind="empty" colSpan={4} /><TableSummaryCell kind="label" colSpan={2}>Итого</TableSummaryCell><TableSummaryCell kind="value" align="end">{totalQuantity}</TableSummaryCell><TableSummaryCell kind="empty" /><TableSummaryCell kind="value" align="end">—</TableSummaryCell><TableSummaryCell kind="value" align="end">{totalSum.toLocaleString('ru-RU')}</TableSummaryCell><TableSummaryCell kind="empty" colSpan={6} /></TableRow>
        </TableBody>
      </Table>
    </WidgetTablePattern>
  );
}
