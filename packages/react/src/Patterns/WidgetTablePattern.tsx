import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Badge } from '../Badge/Badge';
import { Button, IconButton } from '../Button/Button';
import { ContextMenuDivider, ContextMenuItem } from '../ContextMenu/ContextMenu';
import { DatePicker } from '../DatePicker/DatePicker';
import { Select, TextField } from '../Field/Field';
import {
  Table, TableBody, TableCell, TableContextAction, TableDragCell, TableDragHandle,
  TableColumnPinAction,
  TableFileCell, TableFilterCell, TableFilterRow, TableHeaderCell, TableHead,
  TableIndexCell, TablePaginator, TableRow, TableSelectionCell, TableSelectionHeader,
  TableSummaryCell, reorderTableRows,
} from '../Table/Table';
import type { TableDensity, TableMode, TableSortDirection } from '../Table/Table';
import { Tooltip } from '../Tooltip/Tooltip';
import { Widget } from '../Widget/Widget';
import RefreshIcon from '../icons/generated/components/outline/arrows/arrow-refresh-01';
import DownloadIcon from '../icons/generated/components/outline/general/download-01';
import FilterIcon from '../icons/generated/components/outline/general/filter';
import PlusIcon from '../icons/generated/components/outline/general/plus-01';
import FlexRowsIcon from '../icons/generated/components/outline/layout/flex-rows';
import CalculatorIcon from '../icons/generated/components/outline/charts/calculator-02';
import ChevronLeftIcon from '../icons/generated/components/outline/arrows/chevron-left';
import ChevronRightIcon from '../icons/generated/components/outline/arrows/chevron-right';
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

type ReviewRow = [string, string, string, number, string, number, string, string, string, string, string];
type EditableColumn = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9 | 10;

const baseRows: readonly ReviewRow[] = [
  ['POS-001', 'Лист горячекатаный г/к 10×1500×6000 мм ГОСТ 19903-2015', '09Г2С', 24, 'т', 86400, '21.08.2026', 'Вх. 233-500', 'Согласован', 'Комплектность', 'Северсталь'],
  ['POS-002', 'Труба профильная электросварная 80×40×3 мм ГОСТ 8645-68', 'Ст3сп5', 18, 'т', 94800, '24.08.2026', 'Вх. 234-501', 'На проверке', 'Качество', 'ЕВРАЗ Маркет'],
  ['POS-003', 'Швеллер стальной горячекатаный 20П длина 12 м ГОСТ 8240-97', '10ХСНД', 12, 'т', 78200, '26.08.2026', 'Вх. 235-502', 'В работе', 'Срок поставки', 'Мечел-Сервис'],
  ['POS-004', 'Балка двутавровая нормальная 30Б1 S355J2 длина 12 м', 'S355J2', 8, 'шт', 142000, '28.08.2026', 'Вх. 236-503', 'Согласован', 'Цена', 'ОМК'],
  ['POS-005', 'Арматура рифлёная А500С Ø16 мм бухта ГОСТ 34028-2016', 'А500С', 32, 'т', 71500, '31.08.2026', 'Вх. 237-504', 'Черновик', 'Документы', 'Металлоинвест'],
  ['POS-006', 'Уголок равнополочный 75×75×6 мм длина 12 м ГОСТ 8509-93', 'Ст3сп', 16, 'т', 82100, '02.09.2026', 'Вх. 238-505', 'В работе', 'Объём', 'А ГРУПП'],
  ['POS-007', 'Лист оцинкованный 0,7×1250×2500 мм Z275 ГОСТ 14918-2020', '08пс', 20, 'т', 109300, '04.09.2026', 'Вх. 239-506', 'На проверке', 'Маркировка', 'НЛМК'],
  ['POS-008', 'Круг стальной горячекатаный Ø45 мм 40Х ГОСТ 2590-2006', '40Х', 14, 'т', 96700, '07.09.2026', 'Вх. 240-507', 'Отклонен', 'Сертификат', 'ТМК'],
  ['POS-009', 'Полоса стальная горячекатаная 50×5 мм длина 6 м', 'Ст3', 28, 'т', 74900, '09.09.2026', 'Вх. 241-508', 'Согласован', 'Упаковка', 'Сталепромышленная'],
  ['POS-010', 'Труба электросварная прямошовная 108×4 мм Ст20 ГОСТ 10704-91', 'Ст20', 10, 'т', 88600, '11.09.2026', 'Вх. 242-509', 'В работе', 'Приёмка', 'МЕТАЛЛСЕРВИС'],
];

const rows: readonly ReviewRow[] = Array.from({ length: 12 }, (_, batchIndex) => (
  baseRows.map((sourceRow, rowIndex) => {
    const sequence = (batchIndex * baseRows.length) + rowIndex + 1;
    const row = [...sourceRow] as ReviewRow;
    row[0] = `POS-${String(sequence).padStart(3, '0')}`;
    if (batchIndex > 0) row[1] = `${sourceRow[1]} · партия ${batchIndex + 1}`;
    row[3] = sourceRow[3] + (batchIndex * 2);
    row[5] = sourceRow[5] + (batchIndex * 1250);
    row[7] = `Вх. ${233 + sequence - 1}-${500 + sequence - 1}`;
    return row;
  })
)).flat();

function OverflowTooltipText({ text, disabled = false }: { text: string; disabled?: boolean }) {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;
    const measure = () => setOverflowing(element.scrollWidth > element.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  return (
    <Tooltip
      className="cometal-widget-table-pattern__overflow-tooltip"
      content={text}
      disabled={disabled || !overflowing}
      placement="top-start"
      size="wide"
    >
      <span ref={textRef} className="cometal-widget-table-pattern__overflow-text" data-overflowing={overflowing || undefined}>{text}</span>
    </Tooltip>
  );
}

function toneForStatus(status: string): 'green' | 'blue' | 'yellow' | 'red' {
  if (status === 'Согласован') return 'green';
  if (status === 'Черновик') return 'yellow';
  if (status === 'Отклонен') return 'red';
  return 'blue';
}

type FilterOperatorType = 'text' | 'number' | 'date' | 'select';

function HeaderMenu({
  columnId,
  type,
  value,
  onValueChange,
  onReset,
}: {
  columnId: string;
  type: FilterOperatorType;
  value: string;
  onValueChange: (value: string) => void;
  onReset: () => void;
}) {
  const [level, setLevel] = useState<'main' | 'filter'>('main');
  if (level === 'filter') {
    return <>
      <ContextMenuItem
        startIcon={<ChevronLeftIcon />}
        onClick={(event) => {
          event.preventDefault();
          setLevel('main');
        }}
      >Фильтр</ContextMenuItem>
      <ContextMenuDivider />
      {filterOperators[type].map((option) => (
        <ContextMenuItem key={option} selected={option === value} onClick={() => onValueChange(option)}>{option}</ContextMenuItem>
      ))}
      <ContextMenuDivider />
      <ContextMenuItem tone="danger" onClick={onReset}>Сбросить фильтр</ContextMenuItem>
    </>;
  }
  return <>
    <TableColumnPinAction columnId={columnId} />
    <ContextMenuItem>Скрыть колонку</ContextMenuItem>
    <ContextMenuItem
      endIcon={<ChevronRightIcon />}
      onClick={(event) => {
        event.preventDefault();
        setLevel('filter');
      }}
    >Фильтр</ContextMenuItem>
  </>;
}

const reviewColumnIds = {
  drag: 'drag', index: 'index', selection: 'selection', position: 'position', name: 'name',
  grade: 'grade', quantity: 'quantity', unit: 'unit', price: 'price', sum: 'sum', delivery: 'delivery',
  document: 'document', file: 'file', status: 'status', control: 'control', supplier: 'supplier',
} as const;

type ReviewSortableColumnId =
  | typeof reviewColumnIds.position
  | typeof reviewColumnIds.name
  | typeof reviewColumnIds.grade
  | typeof reviewColumnIds.quantity
  | typeof reviewColumnIds.unit
  | typeof reviewColumnIds.price
  | typeof reviewColumnIds.sum
  | typeof reviewColumnIds.delivery
  | typeof reviewColumnIds.document
  | typeof reviewColumnIds.file
  | typeof reviewColumnIds.status
  | typeof reviewColumnIds.control
  | typeof reviewColumnIds.supplier;

type ActiveReviewSortDirection = Exclude<TableSortDirection, 'none'>;
type ReviewSortState = { columnId: ReviewSortableColumnId; direction: ActiveReviewSortDirection } | null;

const reviewRowCollator = new Intl.Collator('ru-RU', { numeric: true, sensitivity: 'base' });

function reviewDateValue(value: string): number {
  const [day = 0, month = 0, year = 0] = value.split('.').map(Number);
  return year * 10000 + month * 100 + day;
}

function reviewSortValue(row: ReviewRow, columnId: ReviewSortableColumnId): string | number {
  if (columnId === reviewColumnIds.position) return row[0];
  if (columnId === reviewColumnIds.name) return row[1];
  if (columnId === reviewColumnIds.grade) return row[2];
  if (columnId === reviewColumnIds.quantity) return row[3];
  if (columnId === reviewColumnIds.unit) return row[4];
  if (columnId === reviewColumnIds.price) return row[5];
  if (columnId === reviewColumnIds.sum) return row[3] * row[5];
  if (columnId === reviewColumnIds.delivery) return reviewDateValue(row[6]);
  if (columnId === reviewColumnIds.document) return row[7];
  if (columnId === reviewColumnIds.file) return 'Спецификация.pdf';
  if (columnId === reviewColumnIds.status) return row[8];
  if (columnId === reviewColumnIds.control) return row[9];
  return row[10];
}

function compareReviewSortValues(left: string | number, right: string | number): number {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return reviewRowCollator.compare(String(left), String(right));
}

const editableColumnIds: Record<EditableColumn, string> = {
  0: reviewColumnIds.position, 1: reviewColumnIds.name, 2: reviewColumnIds.grade,
  3: reviewColumnIds.quantity, 4: reviewColumnIds.unit, 5: reviewColumnIds.price,
  6: reviewColumnIds.delivery, 7: reviewColumnIds.document, 9: reviewColumnIds.control, 10: reviewColumnIds.supplier,
};

const filterOperators = {
  text: ['Содержит', 'Не содержит', 'Начинается с', 'Пусто'],
  number: ['Равно', 'Не равно', 'Больше', 'Меньше'],
  date: ['Дата равна', 'До даты', 'После даты', 'Период'],
  select: ['Равно', 'Не равно', 'Выбрано', 'Не выбрано'],
} as const;

export interface WidgetTableReviewExampleProps {
  initialDensity?: TableDensity;
  mode?: TableMode;
}

/** Shared documentation evidence for the approved Widget + Table composition. */
export function WidgetTableReviewExample({ initialDensity = 'comfortable', mode = 'read' }: WidgetTableReviewExampleProps) {
  const [orderedRows, setOrderedRows] = useState<ReviewRow[]>(() => rows.map((row) => [...row] as ReviewRow));
  const [density, setDensity] = useState<TableDensity>(initialDensity);
  const [filters, setFilters] = useState(true);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<ReviewSortState>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [operators, setOperators] = useState<Record<string, string>>({});
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: EditableColumn } | null>(null);
  const [pinnedColumnIds, setPinnedColumnIds] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const headerAction = (columnId: string, label: string, type: FilterOperatorType) => {
    const value = operators[columnId] ?? filterOperators[type][0];
    return <TableContextAction
      label={`Действия колонки ${label}`}
      menuLabel={`Действия колонки ${label}`}
      menu={<HeaderMenu
        columnId={columnId}
        type={type}
        value={value}
        onValueChange={(nextValue) => setOperators((current) => ({ ...current, [columnId]: nextValue }))}
        onReset={() => {
          setOperators((current) => {
            const next = { ...current };
            delete next[columnId];
            return next;
          });
          if (columnId === reviewColumnIds.position) setQuery('');
          if (columnId === reviewColumnIds.status) setStatus('all');
        }}
      />}
    />;
  };
  const sortableHeaderProps = (columnId: ReviewSortableColumnId) => ({
    sort: sort?.columnId === columnId ? sort.direction : 'none' as TableSortDirection,
    onSortChange: (direction: TableSortDirection) => setSort(direction === 'none' ? null : { columnId, direction }),
  });
  const filteredRows = useMemo(() => {
    const filteredRows = orderedRows.filter((row) => {
      const matchesText = `${row[0]} ${row[1]} ${row[2]} ${row[10]}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'all' || (status === 'approved' && row[8] === 'Согласован') || (status === 'review' && row[8] === 'На проверке') || (status === 'working' && row[8] === 'В работе') || (status === 'draft' && row[8] === 'Черновик');
      return matchesText && matchesStatus;
    });
    if (!sort) return filteredRows;
    const direction = sort.direction === 'ascending' ? 1 : -1;
    return filteredRows
      .map((row, originalIndex) => ({ row, originalIndex }))
      .sort((left, right) => {
        const comparison = compareReviewSortValues(
          reviewSortValue(left.row, sort.columnId),
          reviewSortValue(right.row, sort.columnId),
        );
        return comparison === 0 ? left.originalIndex - right.originalIndex : comparison * direction;
      })
      .map(({ row }) => row);
  }, [orderedRows, query, sort, status]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, pageSize, safePage]);
  const selectedVisibleRows = visibleRows.filter((row) => selected.includes(row[0]));
  const totalQuantity = visibleRows.reduce((total, row) => total + row[3], 0);
  const totalSum = visibleRows.reduce((total, row) => total + row[3] * row[5], 0);

  const updateCell = (rowId: string, column: EditableColumn, rawValue: string) => {
    setOrderedRows((current) => current.map((row) => {
      if (row[0] !== rowId) return row;
      const next: ReviewRow = [...row];
      if (column === 3) next[3] = Number(rawValue) || 0;
      else if (column === 5) next[5] = Number(rawValue.replace(/\s/g, '')) || 0;
      else if (column === 0) next[0] = rawValue;
      else if (column === 1) next[1] = rawValue;
      else if (column === 2) next[2] = rawValue;
      else if (column === 4) next[4] = rawValue;
      else if (column === 6) next[6] = rawValue;
      else if (column === 7) next[7] = rawValue;
      else if (column === 9) next[9] = rawValue;
      else next[10] = rawValue;
      return next;
    }));
  };

  const editableCell = (row: ReviewRow, column: EditableColumn, label: string, align: 'start' | 'end' = 'start') => {
    const isEditing = mode === 'edit' && editingCell?.rowId === row[0] && editingCell.column === column;
    const displayValue = typeof row[column] === 'number' ? row[column].toLocaleString('ru-RU') : row[column];
    return <TableCell
      columnId={editableColumnIds[column]}
      align={align}
      editable={mode === 'edit'}
      state={isEditing ? 'editing' : 'default'}
      aria-label={isEditing ? `Редактирование: ${label}` : undefined}
      onEditStart={() => setEditingCell({ rowId: row[0], column })}
      onBlur={(event) => {
        if (!isEditing) return;
        if (event.currentTarget.dataset.editCancelled) {
          delete event.currentTarget.dataset.editCancelled;
          setEditingCell(null);
          return;
        }
        updateCell(row[0], column, event.currentTarget.textContent?.trim() ?? '');
        setEditingCell(null);
      }}
      onKeyDown={(event) => {
        if (!isEditing) return;
        if (event.key === 'Enter') {
          event.preventDefault();
          event.currentTarget.blur();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          event.currentTarget.dataset.editCancelled = 'true';
          event.currentTarget.blur();
        }
      }}
    >{column === 1
      ? <OverflowTooltipText text={String(displayValue)} disabled={isEditing} />
      : displayValue}</TableCell>;
  };

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
    <IconButton
      size="m"
      variant="secondary"
      aria-label={summaryVisible ? 'Скрыть итоги' : 'Показать итоги'}
      aria-pressed={summaryVisible}
      icon={<CalculatorIcon />}
      onClick={() => setSummaryVisible((value) => !value)}
    />
    <IconButton size="m" variant="secondary" aria-label="Обновить" icon={<RefreshIcon />} />
    <IconButton size="m" variant="secondary" aria-label="Экспорт" icon={<DownloadIcon />} />
    {mode === 'edit' ? <Button size="m" startIcon={<PlusIcon />}>Добавить запись</Button> : null}
  </>;

  return (
    <WidgetTablePattern
      className={[
        pageSize > 10 && 'cometal-widget-table-pattern--row-scroll',
        filters && 'cometal-widget-table-pattern--filters-visible',
        summaryVisible && 'cometal-widget-table-pattern--summary-visible',
        density === 'compact' && 'cometal-widget-table-pattern--density-compact',
      ].filter(Boolean).join(' ')}
      title={`Спецификация позиций · ${mode === 'read' ? 'Read' : 'Edit'}`}
      description={`${visibleRows.length} из ${filteredRows.length} строк · ${mode === 'read' ? 'построчное чтение' : 'редактирование ячеек'} · фильтры ${filters ? 'включены' : 'выключены'}`}
      toolbar={toolbar}
      footer={<TablePaginator
        aria-label={`Пагинация таблицы · ${mode === 'read' ? 'Read' : 'Edit'}`}
        page={safePage}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        }}
      />}
    >
      <Table density={density} mode={mode} aria-label={`Спецификация позиций · ${mode === 'read' ? 'Read' : 'Edit'}`} pinnedColumnIds={pinnedColumnIds} onPinnedColumnIdsChange={setPinnedColumnIds} columnWidths={columnWidths} onColumnWidthsChange={setColumnWidths} onRowReorder={mode === 'edit' ? (event) => setOrderedRows((current) => reorderTableRows(current, event, (row) => row[0])) : undefined} rowContextMenu={(rowId) => <><ContextMenuItem onClick={() => setSelected((current) => current.includes(rowId) ? current : [...current, rowId])}>Выбрать строку</ContextMenuItem><ContextMenuItem>Открыть позицию</ContextMenuItem>{mode === 'edit' ? <><ContextMenuDivider /><ContextMenuItem tone="danger">Удалить строку</ContextMenuItem></> : null}</>}>
        <TableHead>
          <TableRow>
            <TableHeaderCell columnId={reviewColumnIds.drag} kind="drag"><span className="cometal-widget-table-pattern__sr-only">Перемещение</span></TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.index} kind="index">№</TableHeaderCell>
            <TableSelectionHeader
              columnId={reviewColumnIds.selection}
              selectedCount={selectedVisibleRows.length}
              totalCount={visibleRows.length}
              onSelectionChange={(checked) => setSelected((current) => {
                const visibleIds = new Set(visibleRows.map((row) => row[0]));
                if (checked) return [...new Set([...current, ...visibleIds])];
                return current.filter((rowId) => !visibleIds.has(rowId));
              })}
            />
            <TableHeaderCell columnId={reviewColumnIds.position} {...sortableHeaderProps(reviewColumnIds.position)} action={headerAction(reviewColumnIds.position, 'Позиция', 'text')}>Позиция</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.name} {...sortableHeaderProps(reviewColumnIds.name)} action={headerAction(reviewColumnIds.name, 'Наименование', 'text')}>Наименование</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.grade} {...sortableHeaderProps(reviewColumnIds.grade)} action={headerAction(reviewColumnIds.grade, 'Марка стали', 'text')}>Марка стали</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.quantity} {...sortableHeaderProps(reviewColumnIds.quantity)} action={headerAction(reviewColumnIds.quantity, 'Количество', 'number')}>Количество</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.unit} {...sortableHeaderProps(reviewColumnIds.unit)} action={headerAction(reviewColumnIds.unit, 'Единица', 'select')}>Ед.</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.price} {...sortableHeaderProps(reviewColumnIds.price)} action={headerAction(reviewColumnIds.price, 'Цена', 'number')}>Цена, ₽</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.sum} {...sortableHeaderProps(reviewColumnIds.sum)} action={headerAction(reviewColumnIds.sum, 'Сумма', 'number')}>Сумма, ₽</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.delivery} {...sortableHeaderProps(reviewColumnIds.delivery)} action={headerAction(reviewColumnIds.delivery, 'Дата поставки', 'date')}>Дата поставки</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.document} {...sortableHeaderProps(reviewColumnIds.document)} action={headerAction(reviewColumnIds.document, 'Документ', 'text')}>Документ</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.file} {...sortableHeaderProps(reviewColumnIds.file)} action={headerAction(reviewColumnIds.file, 'Файл', 'text')}>Файл</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.status} {...sortableHeaderProps(reviewColumnIds.status)} action={headerAction(reviewColumnIds.status, 'Статус', 'select')}>Статус</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.control} {...sortableHeaderProps(reviewColumnIds.control)} action={headerAction(reviewColumnIds.control, 'Контроль', 'select')}>Контроль</TableHeaderCell>
            <TableHeaderCell columnId={reviewColumnIds.supplier} {...sortableHeaderProps(reviewColumnIds.supplier)} action={headerAction(reviewColumnIds.supplier, 'Поставщик', 'select')}>Поставщик</TableHeaderCell>
          </TableRow>
          {filters ? <TableFilterRow aria-label="Фильтры таблицы">
            <TableFilterCell columnId={reviewColumnIds.drag} kind="drag" /><TableFilterCell columnId={reviewColumnIds.index} kind="index" /><TableFilterCell columnId={reviewColumnIds.selection} kind="selection" />
            <TableFilterCell columnId={reviewColumnIds.position}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по позиции" size="s" placeholder={operators[reviewColumnIds.position] ?? 'Содержит'} value={query} onChange={(event) => setQuery(event.currentTarget.value)} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.name}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по наименованию" size="s" placeholder={operators[reviewColumnIds.name] ?? 'Содержит'} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.grade}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по марке" size="s" placeholder={operators[reviewColumnIds.grade] ?? 'Содержит'} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.quantity}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по количеству" size="s" placeholder={operators[reviewColumnIds.quantity] ?? 'Равно'} inputMode="numeric" /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.unit}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по единице" size="s" placeholder={operators[reviewColumnIds.unit] ?? 'Равно'} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.price}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по цене" size="s" placeholder={operators[reviewColumnIds.price] ?? 'Равно'} inputMode="numeric" /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.sum}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по сумме" size="s" placeholder={operators[reviewColumnIds.sum] ?? 'Равно'} inputMode="numeric" /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.delivery}><DatePicker className="cometal-widget-table-pattern__filter" label="Фильтр по дате" size="s" placeholder={operators[reviewColumnIds.delivery] ?? 'Дата равна'} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.document}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по документу" size="s" placeholder={operators[reviewColumnIds.document] ?? 'Содержит'} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.file}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по файлу" size="s" placeholder={operators[reviewColumnIds.file] ?? 'Содержит'} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.status}><Select className="cometal-widget-table-pattern__filter" label="Фильтр по статусу" size="s" options={statusOptions} value={status} onValueChange={setStatus} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.control}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по контролю" size="s" placeholder={operators[reviewColumnIds.control] ?? 'Равно'} /></TableFilterCell>
            <TableFilterCell columnId={reviewColumnIds.supplier}><TextField className="cometal-widget-table-pattern__filter" label="Фильтр по поставщику" size="s" placeholder={operators[reviewColumnIds.supplier] ?? 'Равно'} /></TableFilterCell>
          </TableFilterRow> : null}
        </TableHead>
        <TableBody>
          {visibleRows.map((row, index) => {
            const sum = row[3] * row[5];
            return <TableRow key={row[0]} rowId={row[0]} reorderId={mode === 'edit' ? row[0] : undefined} selected={selected.includes(row[0])}>
              <TableDragCell columnId={reviewColumnIds.drag}><TableDragHandle rowLabel={row[0]} /></TableDragCell>
              <TableIndexCell columnId={reviewColumnIds.index}>{((safePage - 1) * pageSize) + index + 1}</TableIndexCell>
              <TableSelectionCell columnId={reviewColumnIds.selection} label={`Выбрать ${row[0]}`} checked={selected.includes(row[0])} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, row[0]] : current.filter((value) => value !== row[0]))} />
              {editableCell(row, 0, `Позиция ${row[0]}`)}{editableCell(row, 1, `Наименование ${row[0]}`)}{editableCell(row, 2, `Марка стали ${row[0]}`)}
              {editableCell(row, 3, `Количество ${row[0]}`, 'end')}{editableCell(row, 4, `Единица ${row[0]}`)}
              {editableCell(row, 5, `Цена ${row[0]}`, 'end')}<TableCell columnId={reviewColumnIds.sum} align="end">{sum.toLocaleString('ru-RU')}</TableCell>
              {editableCell(row, 6, `Дата поставки ${row[0]}`)}{editableCell(row, 7, `Документ ${row[0]}`)}
              <TableFileCell columnId={reviewColumnIds.file} fileName="Спецификация.pdf" fileSize="130 КБ" fileType="pdf" />
              <TableCell columnId={reviewColumnIds.status}><Badge tone={toneForStatus(row[8])}>{row[8]}</Badge></TableCell>{editableCell(row, 9, `Контроль ${row[0]}`)}{editableCell(row, 10, `Поставщик ${row[0]}`)}
            </TableRow>;
          })}
          {summaryVisible ? <TableRow>
            {mode === 'edit' ? <TableSummaryCell columnId={reviewColumnIds.drag} className="cometal-table__drag-cell" kind="empty" /> : null}
            <TableSummaryCell columnId={reviewColumnIds.index} className="cometal-table__index-cell" kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.selection} className="cometal-table__selection-cell" kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.position} kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.name} kind="label">Итого</TableSummaryCell>
            <TableSummaryCell columnId={reviewColumnIds.grade} kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.quantity} kind="value" align="end">{totalQuantity}</TableSummaryCell>
            <TableSummaryCell columnId={reviewColumnIds.unit} kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.price} kind="value" align="end">—</TableSummaryCell>
            <TableSummaryCell columnId={reviewColumnIds.sum} kind="value" align="end">{totalSum.toLocaleString('ru-RU')}</TableSummaryCell>
            <TableSummaryCell columnId={reviewColumnIds.delivery} kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.document} kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.file} kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.status} kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.control} kind="empty" />
            <TableSummaryCell columnId={reviewColumnIds.supplier} kind="empty" />
          </TableRow> : null}
        </TableBody>
      </Table>
    </WidgetTablePattern>
  );
}
