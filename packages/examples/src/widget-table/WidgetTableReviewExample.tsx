'use client';

import { createElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Badge, Button, ContextMenuDivider, ContextMenuItem, DatePicker, DateRangePicker,
  IconButton, Select, Table, TableBody, TableCell, TableColumnPinAction,
  TableContextAction, TableDragCell, TableDragHandle, TableFileCell, TableFilterCell,
  TableFilterRow, TableHeaderCell, TableHead, TableIndexCell, TablePaginator, TableRow,
  TableSelectionCell, TableSelectionHeader, TableSummaryCell, TextField, Tooltip,
  WidgetTablePattern, reorderTableRows,
} from '@cometal/react';
import type { TableDensity, TableMode, TableSortDirection } from '@cometal/react';
import RefreshIcon from '@cometal/react/icons/outline/arrows/arrow-refresh-01';
import DownloadIcon from '@cometal/react/icons/outline/general/download-01';
import FilterIcon from '@cometal/react/icons/outline/general/filter';
import PlusIcon from '@cometal/react/icons/outline/general/plus-01';
import FlexRowsIcon from '@cometal/react/icons/outline/layout/flex-rows';
import CalculatorIcon from '@cometal/react/icons/outline/charts/calculator-02';
import ChevronLeftIcon from '@cometal/react/icons/outline/arrows/chevron-left';
import ChevronRightIcon from '@cometal/react/icons/outline/arrows/chevron-right';
import {
  cloneReviewRow,
  createReviewFilterState,
  emptyDateRange,
  filterAndSortReviewRows,
  isUnaryOperator,
  parseReviewNumber,
  reviewColumnIds,
  reviewFilterColumnIds,
  reviewFilterRegistry,
  rows,
} from './widget-table-controller';
import type {
  EditableColumn,
  FilterKind,
  ReviewFilterColumnId,
  ReviewFilterOperator,
  ReviewFilterState,
  ReviewFilterValue,
  ReviewRow,
  ReviewSortableColumnId,
  ReviewSortState,
} from './widget-table-controller';

function OverflowTooltipText({ text, disabled = false }: { text: string; disabled?: boolean }) {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setOverflowing(element.scrollWidth > element.clientWidth));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [text]);

  return (
    <Tooltip
      style={{ minWidth: 0, width: '100%', maxWidth: '100%' }}
      content={text}
      disabled={disabled || !overflowing}
      placement="top-start"
      size="wide"
    >
      {createElement('span', {
        ref: textRef,
        'data-widget-table-overflow-text': '',
        'data-overflowing': overflowing || undefined,
        style: { display: 'block', minWidth: 0, width: '100%', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
      }, text)}
    </Tooltip>
  );
}

function toneForStatus(status: string): 'green' | 'blue' | 'yellow' | 'red' {
  if (status === 'Согласован') return 'green';
  if (status === 'Черновик') return 'yellow';
  if (status === 'Отклонен') return 'red';
  return 'blue';
}

const filterOperators = {
  text: [
    { value: 'contains', label: 'Содержит' },
    { value: 'notContains', label: 'Не содержит' },
    { value: 'startsWith', label: 'Начинается с' },
    { value: 'empty', label: 'Пусто' },
  ],
  number: [
    { value: 'equals', label: 'Равно' },
    { value: 'notEquals', label: 'Не равно' },
    { value: 'greaterThan', label: 'Больше' },
    { value: 'lessThan', label: 'Меньше' },
  ],
  date: [
    { value: 'equals', label: 'Дата равна' },
    { value: 'before', label: 'До даты' },
    { value: 'after', label: 'После даты' },
    { value: 'period', label: 'Период' },
  ],
  select: [
    { value: 'equals', label: 'Равно' },
    { value: 'notEquals', label: 'Не равно' },
    { value: 'selected', label: 'Выбрано' },
    { value: 'notSelected', label: 'Не выбрано' },
  ],
} as const;

function operatorLabel(kind: FilterKind, operator: ReviewFilterOperator) {
  return filterOperators[kind].find((option) => option.value === operator)?.label
    ?? filterOperators[kind][0].label;
}

function HeaderMenu({
  columnId,
  kind,
  value,
  onValueChange,
  onReset,
  onHide,
  hideDisabled,
}: {
  columnId: string;
  kind: FilterKind;
  value: ReviewFilterOperator;
  onValueChange: (value: ReviewFilterOperator) => void;
  onReset: () => void;
  onHide: () => void;
  hideDisabled: boolean;
}) {
  const [level, setLevel] = useState<'main' | 'filter'>('main');
  const backRef = useRef<HTMLButtonElement | null>(null);
  const filterItemRef = useRef<HTMLButtonElement | null>(null);
  const restoreFilterFocusRef = useRef(false);
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (level === 'filter') backRef.current?.focus();
      else if (restoreFilterFocusRef.current) {
        restoreFilterFocusRef.current = false;
        filterItemRef.current?.focus();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [level]);
  const showMainLevel = () => {
    restoreFilterFocusRef.current = true;
    setLevel('main');
  };
  if (level === 'filter') {
    return <>
      <ContextMenuItem
        ref={backRef}
        startIcon={<ChevronLeftIcon />}
        onClick={(event) => {
          event.preventDefault();
          showMainLevel();
        }}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft') return;
          event.preventDefault();
          showMainLevel();
        }}
      >Фильтр</ContextMenuItem>
      <ContextMenuDivider />
      {filterOperators[kind].map((option) => (
        <ContextMenuItem key={option.value} selected={option.value === value} onClick={() => onValueChange(option.value)}>{option.label}</ContextMenuItem>
      ))}
      <ContextMenuDivider />
      <ContextMenuItem tone="danger" onClick={onReset}>Сбросить фильтр</ContextMenuItem>
    </>;
  }
  return <>
    <TableColumnPinAction columnId={columnId} />
    <ContextMenuItem disabled={hideDisabled} onClick={onHide}>Скрыть колонку</ContextMenuItem>
    <ContextMenuItem
      ref={filterItemRef}
      endIcon={<ChevronRightIcon />}
      onClick={(event) => {
        event.preventDefault();
        setLevel('filter');
      }}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowRight') return;
        event.preventDefault();
        setLevel('filter');
      }}
    >Фильтр</ContextMenuItem>
  </>;
}

const editableColumnIds: Record<EditableColumn, string> = {
  0: reviewColumnIds.position, 1: reviewColumnIds.name, 2: reviewColumnIds.grade,
  3: reviewColumnIds.quantity, 4: reviewColumnIds.unit, 5: reviewColumnIds.price,
  6: reviewColumnIds.delivery, 7: reviewColumnIds.document, 9: reviewColumnIds.control, 10: reviewColumnIds.supplier,
};

export interface WidgetTableReviewExampleProps {
  ariaLabel?: string;
  initialDensity?: TableDensity;
  initialFilters?: boolean;
  mode?: TableMode;
  surface?: 'table' | 'widget';
}

/** Shared documentation evidence for the approved Table contract and Widget + Table composition. */
export function WidgetTableReviewExample({
  ariaLabel,
  initialDensity = 'comfortable',
  initialFilters = true,
  mode = 'read',
  surface = 'widget',
}: WidgetTableReviewExampleProps) {
  const tableLabel = ariaLabel ?? `Спецификация позиций · ${mode === 'read' ? 'Read' : 'Edit'}`;
  const [orderedRows, setOrderedRows] = useState<ReviewRow[]>(() => rows.map(cloneReviewRow));
  const [density, setDensity] = useState<TableDensity>(initialDensity);
  const [filters, setFilters] = useState(initialFilters);
  const [summaryVisible, setSummaryVisible] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<ReviewSortState>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterState, setFilterState] = useState<ReviewFilterState>(createReviewFilterState);
  const [editingCell, setEditingCell] = useState<{ rowId: string; column: EditableColumn } | null>(null);
  const [cellDrafts, setCellDrafts] = useState<Record<string, string>>({});
  const [invalidCell, setInvalidCell] = useState<{ rowId: string; column: EditableColumn } | null>(null);
  const [visibleColumnIds, setVisibleColumnIds] = useState<ReviewFilterColumnId[]>(() => [...reviewFilterColumnIds]);
  const [pinnedColumnIds, setPinnedColumnIds] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const updateColumnFilter = (columnId: ReviewFilterColumnId, update: (current: ReviewFilterValue) => ReviewFilterValue) => {
    setFilterState((current) => ({ ...current, [columnId]: update(current[columnId]) }));
    setPage(1);
  };
  const headerAction = (columnId: ReviewFilterColumnId, label: string) => {
    const definition = reviewFilterRegistry[columnId];
    const currentFilter = filterState[columnId];
    return <TableContextAction
      label={`Действия колонки ${label}`}
      menuLabel={`Действия колонки ${label}`}
      menu={<HeaderMenu
        columnId={columnId}
        kind={definition.kind}
        value={currentFilter.operator}
        hideDisabled={visibleColumnIds.length <= 1}
        onHide={() => setVisibleColumnIds((current) => current.length <= 1 ? current : current.filter((id) => id !== columnId))}
        onValueChange={(nextOperator) => updateColumnFilter(columnId, (current) => ({
          ...current,
          operator: nextOperator,
          value: isUnaryOperator(nextOperator) || nextOperator === 'period' ? '' : current.value,
          range: nextOperator === 'period' ? current.range : emptyDateRange(),
        }))}
        onReset={() => updateColumnFilter(columnId, () => ({
          operator: definition.defaultOperator,
          value: '',
          range: emptyDateRange(),
        }))}
      />}
    />;
  };
  const sortableHeaderProps = (columnId: ReviewSortableColumnId) => ({
    sort: sort?.columnId === columnId ? sort.direction : 'none' as TableSortDirection,
    onSortChange: (direction: TableSortDirection) => setSort(direction === 'none' ? null : { columnId, direction }),
  });
  const filteredRows = useMemo(() => {
    return filterAndSortReviewRows(orderedRows, filterState, sort);
  }, [filterState, orderedRows, sort]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);
  const visibleRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, pageSize, safePage]);
  const selectedVisibleRows = visibleRows.filter((row) => selected.includes(row.entityId));
  const totalQuantity = visibleRows.reduce((total, row) => total + row[3], 0);
  const totalSum = visibleRows.reduce((total, row) => total + row[3] * row[5], 0);
  const columnVisible = (columnId: ReviewFilterColumnId) => visibleColumnIds.includes(columnId);

  const updateCell = (rowId: string, column: EditableColumn, rawValue: string) => {
    const parsedNumber = column === 3 || column === 5 ? parseReviewNumber(rawValue) : null;
    if ((column === 3 || column === 5) && parsedNumber === null) return false;
    setOrderedRows((current) => current.map((row) => {
      if (row.entityId !== rowId) return row;
      const next = cloneReviewRow(row);
      if (column === 3) next[3] = parsedNumber as number;
      else if (column === 5) next[5] = parsedNumber as number;
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
    return true;
  };

  const editableCell = (row: ReviewRow, column: EditableColumn, label: string, align: 'start' | 'end' = 'start') => {
    const draftKey = `${row.entityId}:${column}`;
    const isEditing = mode === 'edit' && editingCell?.rowId === row.entityId && editingCell.column === column;
    const isInvalid = invalidCell?.rowId === row.entityId && invalidCell.column === column;
    const committedValue = typeof row[column] === 'number' ? row[column].toLocaleString('ru-RU') : row[column];
    const displayValue = cellDrafts[draftKey] ?? committedValue;
    return <TableCell
      columnId={editableColumnIds[column]}
      align={align}
      editable={mode === 'edit'}
      state={isInvalid ? 'error' : isEditing ? 'editing' : 'default'}
      aria-label={isEditing ? `Редактирование: ${label}` : undefined}
      onEditStart={() => {
        setCellDrafts((current) => ({ ...current, [draftKey]: String(committedValue) }));
        setInvalidCell(null);
        setEditingCell({ rowId: row.entityId, column });
      }}
      onInput={(event) => {
        const draftValue = event.currentTarget.textContent ?? '';
        setCellDrafts((current) => ({ ...current, [draftKey]: draftValue }));
      }}
      onBlur={(event) => {
        if (!isEditing) return;
        if (event.currentTarget.dataset.editCancelled) {
          delete event.currentTarget.dataset.editCancelled;
          setCellDrafts((current) => {
            const next = { ...current };
            delete next[draftKey];
            return next;
          });
          setInvalidCell(null);
          setEditingCell(null);
          return;
        }
        const committed = updateCell(row.entityId, column, event.currentTarget.textContent?.trim() ?? '');
        if (!committed) setInvalidCell({ rowId: row.entityId, column });
        else {
          setInvalidCell(null);
          setCellDrafts((current) => {
            const next = { ...current };
            delete next[draftKey];
            return next;
          });
        }
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
          event.currentTarget.textContent = String(committedValue);
          event.currentTarget.dataset.editCancelled = 'true';
          event.currentTarget.blur();
        }
      }}
    >{column === 1
      ? <OverflowTooltipText text={String(displayValue)} disabled={isEditing} />
      : displayValue}</TableCell>;
  };

  const filterControl = (columnId: ReviewFilterColumnId, label: string) => {
    const definition = reviewFilterRegistry[columnId];
    const current = filterState[columnId];
    const setValue = (value: string) => updateColumnFilter(columnId, (filter) => ({
      ...filter,
      value: isUnaryOperator(filter.operator) ? '' : value,
    }));
    if (definition.kind === 'date') {
      return current.operator === 'period'
        ? <DateRangePicker label={label} size="s" value={current.range} onChange={(range) => updateColumnFilter(columnId, (filter) => ({ ...filter, range }))} />
        : <DatePicker label={label} size="s" placeholder={operatorLabel(definition.kind, current.operator)} value={current.value || null} onValueChange={(value) => setValue(value ?? '')} />;
    }
    if (definition.kind === 'select') {
      const options = 'options' in definition ? [...definition.options] : [];
      return <Select label={label} size="s" placeholder="Все" options={options} value={current.value} onValueChange={setValue} />;
    }
    return <TextField
      label={label}
      size="s"
      placeholder={operatorLabel(definition.kind, current.operator)}
      inputMode={definition.kind === 'number' ? 'decimal' : undefined}
      value={current.value}
      onChange={(event) => setValue(event.currentTarget.value)}
    />;
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
    <IconButton size="m" variant="secondary" aria-label={filters ? 'Скрыть фильтры' : 'Показать фильтры'} aria-pressed={filters} icon={<FilterIcon />} onClick={() => setFilters((value) => !value)} />
    <IconButton
      size="m"
      variant="secondary"
      aria-label={summaryVisible ? 'Скрыть итоги' : 'Показать итоги'}
      aria-pressed={summaryVisible}
      icon={<CalculatorIcon />}
      onClick={() => setSummaryVisible((value) => !value)}
    />
    <IconButton size="m" variant="secondary" aria-label="Обновить" icon={<RefreshIcon />} onClick={() => {
      setOrderedRows(rows.map(cloneReviewRow));
      setSelected([]);
      setSort(null);
      setPage(1);
      setFilterState(createReviewFilterState());
      setEditingCell(null);
      setCellDrafts({});
      setInvalidCell(null);
      setVisibleColumnIds([...reviewFilterColumnIds]);
    }} />
    <IconButton size="m" variant="secondary" aria-label="Экспорт недоступен в демонстрации" icon={<DownloadIcon />} disabled />
    {mode === 'edit' ? <Button size="m" startIcon={<PlusIcon />} disabled>Добавить запись</Button> : null}
  </>;

  const paginator = <TablePaginator
    aria-label={ariaLabel ? `Пагинация: ${ariaLabel}` : `Пагинация таблицы · ${mode === 'read' ? 'Read' : 'Edit'}`}
    page={safePage}
    pageCount={pageCount}
    onPageChange={setPage}
    pageSize={pageSize}
    onPageSizeChange={(nextPageSize) => {
      setPageSize(nextPageSize);
      setPage(1);
    }}
  />;

  const table = <Table
        density={density}
        mode={mode}
        maxVisibleBodyRows={10}
        aria-label={tableLabel}
        pinnedColumnIds={pinnedColumnIds}
        onPinnedColumnIdsChange={setPinnedColumnIds}
        columnWidths={columnWidths}
        onColumnWidthsChange={setColumnWidths}
        onRowReorder={mode === 'edit' ? (event) => setOrderedRows((current) => reorderTableRows(current, event, (row) => row.entityId)) : undefined}
        rowContextMenu={(rowId) => <>
          <ContextMenuItem onClick={() => setSelected((current) => current.includes(rowId) ? current.filter((id) => id !== rowId) : [...current, rowId])}>Переключить выбор строки</ContextMenuItem>
          <ContextMenuItem disabled>Открыть позицию</ContextMenuItem>
          {mode === 'edit' ? <><ContextMenuDivider /><ContextMenuItem tone="danger" onClick={() => {
            setOrderedRows((current) => current.filter((row) => row.entityId !== rowId));
            setSelected((current) => current.filter((id) => id !== rowId));
          }}>Удалить строку</ContextMenuItem></> : null}
        </>}
      >
        <TableHead>
          <TableRow>
            {mode === 'edit' ? <TableHeaderCell columnId={reviewColumnIds.drag} kind="drag" aria-label="Перемещение" /> : null}
            <TableHeaderCell columnId={reviewColumnIds.index} kind="index">№</TableHeaderCell>
            <TableSelectionHeader
              columnId={reviewColumnIds.selection}
              selectedCount={selectedVisibleRows.length}
              totalCount={visibleRows.length}
              onSelectionChange={(checked) => setSelected((current) => {
                const visibleIds = new Set(visibleRows.map((row) => row.entityId));
                if (checked) return [...new Set([...current, ...visibleIds])];
                return current.filter((rowId) => !visibleIds.has(rowId));
              })}
            />
            {columnVisible(reviewColumnIds.position) ? <TableHeaderCell columnId={reviewColumnIds.position} {...sortableHeaderProps(reviewColumnIds.position)} action={headerAction(reviewColumnIds.position, 'Позиция')}>Позиция</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.name) ? <TableHeaderCell columnId={reviewColumnIds.name} {...sortableHeaderProps(reviewColumnIds.name)} action={headerAction(reviewColumnIds.name, 'Наименование')}>Наименование</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.grade) ? <TableHeaderCell columnId={reviewColumnIds.grade} {...sortableHeaderProps(reviewColumnIds.grade)} action={headerAction(reviewColumnIds.grade, 'Марка стали')}>Марка стали</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.quantity) ? <TableHeaderCell columnId={reviewColumnIds.quantity} {...sortableHeaderProps(reviewColumnIds.quantity)} action={headerAction(reviewColumnIds.quantity, 'Количество')}>Количество</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.unit) ? <TableHeaderCell columnId={reviewColumnIds.unit} {...sortableHeaderProps(reviewColumnIds.unit)} action={headerAction(reviewColumnIds.unit, 'Единица')}>Ед.</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.price) ? <TableHeaderCell columnId={reviewColumnIds.price} {...sortableHeaderProps(reviewColumnIds.price)} action={headerAction(reviewColumnIds.price, 'Цена')}>Цена, ₽</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.sum) ? <TableHeaderCell columnId={reviewColumnIds.sum} {...sortableHeaderProps(reviewColumnIds.sum)} action={headerAction(reviewColumnIds.sum, 'Сумма')}>Сумма, ₽</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.delivery) ? <TableHeaderCell columnId={reviewColumnIds.delivery} {...sortableHeaderProps(reviewColumnIds.delivery)} action={headerAction(reviewColumnIds.delivery, 'Дата поставки')}>Дата поставки</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.document) ? <TableHeaderCell columnId={reviewColumnIds.document} {...sortableHeaderProps(reviewColumnIds.document)} action={headerAction(reviewColumnIds.document, 'Документ')}>Документ</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.file) ? <TableHeaderCell columnId={reviewColumnIds.file} action={headerAction(reviewColumnIds.file, 'Файл')}>Файл</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.status) ? <TableHeaderCell columnId={reviewColumnIds.status} {...sortableHeaderProps(reviewColumnIds.status)} action={headerAction(reviewColumnIds.status, 'Статус')}>Статус</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.control) ? <TableHeaderCell columnId={reviewColumnIds.control} {...sortableHeaderProps(reviewColumnIds.control)} action={headerAction(reviewColumnIds.control, 'Контроль')}>Контроль</TableHeaderCell> : null}
            {columnVisible(reviewColumnIds.supplier) ? <TableHeaderCell columnId={reviewColumnIds.supplier} {...sortableHeaderProps(reviewColumnIds.supplier)} action={headerAction(reviewColumnIds.supplier, 'Поставщик')}>Поставщик</TableHeaderCell> : null}
          </TableRow>
          {filters ? <TableFilterRow aria-label="Фильтры таблицы">
            {mode === 'edit' ? <TableFilterCell columnId={reviewColumnIds.drag} kind="drag" /> : null}<TableFilterCell columnId={reviewColumnIds.index} kind="index" /><TableFilterCell columnId={reviewColumnIds.selection} kind="selection" />
            {columnVisible(reviewColumnIds.position) ? <TableFilterCell columnId={reviewColumnIds.position}>{filterControl(reviewColumnIds.position, 'Фильтр по позиции')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.name) ? <TableFilterCell columnId={reviewColumnIds.name}>{filterControl(reviewColumnIds.name, 'Фильтр по наименованию')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.grade) ? <TableFilterCell columnId={reviewColumnIds.grade}>{filterControl(reviewColumnIds.grade, 'Фильтр по марке')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.quantity) ? <TableFilterCell columnId={reviewColumnIds.quantity}>{filterControl(reviewColumnIds.quantity, 'Фильтр по количеству')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.unit) ? <TableFilterCell columnId={reviewColumnIds.unit}>{filterControl(reviewColumnIds.unit, 'Фильтр по единице')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.price) ? <TableFilterCell columnId={reviewColumnIds.price}>{filterControl(reviewColumnIds.price, 'Фильтр по цене')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.sum) ? <TableFilterCell columnId={reviewColumnIds.sum}>{filterControl(reviewColumnIds.sum, 'Фильтр по сумме')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.delivery) ? <TableFilterCell columnId={reviewColumnIds.delivery}>{filterControl(reviewColumnIds.delivery, 'Фильтр по дате')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.document) ? <TableFilterCell columnId={reviewColumnIds.document}>{filterControl(reviewColumnIds.document, 'Фильтр по документу')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.file) ? <TableFilterCell columnId={reviewColumnIds.file}>{filterControl(reviewColumnIds.file, 'Фильтр по файлу')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.status) ? <TableFilterCell columnId={reviewColumnIds.status}>{filterControl(reviewColumnIds.status, 'Фильтр по статусу')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.control) ? <TableFilterCell columnId={reviewColumnIds.control}>{filterControl(reviewColumnIds.control, 'Фильтр по контролю')}</TableFilterCell> : null}
            {columnVisible(reviewColumnIds.supplier) ? <TableFilterCell columnId={reviewColumnIds.supplier}>{filterControl(reviewColumnIds.supplier, 'Фильтр по поставщику')}</TableFilterCell> : null}
          </TableFilterRow> : null}
        </TableHead>
        <TableBody>
          {visibleRows.map((row, index) => {
            const sum = row[3] * row[5];
            return <TableRow key={row.entityId} rowId={row.entityId} reorderId={mode === 'edit' ? row.entityId : undefined} selected={selected.includes(row.entityId)}>
              {mode === 'edit' ? <TableDragCell columnId={reviewColumnIds.drag}><TableDragHandle rowLabel={row[0]} /></TableDragCell> : null}
              <TableIndexCell columnId={reviewColumnIds.index}>{((safePage - 1) * pageSize) + index + 1}</TableIndexCell>
              <TableSelectionCell columnId={reviewColumnIds.selection} label={`Выбрать ${row[0]}`} checked={selected.includes(row.entityId)} onCheckedChange={(checked) => setSelected((current) => checked ? [...new Set([...current, row.entityId])] : current.filter((value) => value !== row.entityId))} />
              {columnVisible(reviewColumnIds.position) ? editableCell(row, 0, `Позиция ${row[0]}`) : null}
              {columnVisible(reviewColumnIds.name) ? editableCell(row, 1, `Наименование ${row[0]}`) : null}
              {columnVisible(reviewColumnIds.grade) ? editableCell(row, 2, `Марка стали ${row[0]}`) : null}
              {columnVisible(reviewColumnIds.quantity) ? editableCell(row, 3, `Количество ${row[0]}`, 'end') : null}
              {columnVisible(reviewColumnIds.unit) ? editableCell(row, 4, `Единица ${row[0]}`) : null}
              {columnVisible(reviewColumnIds.price) ? editableCell(row, 5, `Цена ${row[0]}`, 'end') : null}
              {columnVisible(reviewColumnIds.sum) ? <TableCell columnId={reviewColumnIds.sum} align="end">{sum.toLocaleString('ru-RU')}</TableCell> : null}
              {columnVisible(reviewColumnIds.delivery) ? editableCell(row, 6, `Дата поставки ${row[0]}`) : null}
              {columnVisible(reviewColumnIds.document) ? editableCell(row, 7, `Документ ${row[0]}`) : null}
              {columnVisible(reviewColumnIds.file) ? <TableFileCell columnId={reviewColumnIds.file} fileName="Спецификация.pdf" fileSize="130 КБ" fileType="pdf" /> : null}
              {columnVisible(reviewColumnIds.status) ? <TableCell columnId={reviewColumnIds.status}><Badge tone={toneForStatus(row[8])}>{row[8]}</Badge></TableCell> : null}
              {columnVisible(reviewColumnIds.control) ? editableCell(row, 9, `Контроль ${row[0]}`) : null}
              {columnVisible(reviewColumnIds.supplier) ? editableCell(row, 10, `Поставщик ${row[0]}`) : null}
            </TableRow>;
          })}
          {summaryVisible ? <TableRow>
            {mode === 'edit' ? <TableSummaryCell columnId={reviewColumnIds.drag} kind="drag" /> : null}
            <TableSummaryCell columnId={reviewColumnIds.index} kind="index" />
            <TableSummaryCell columnId={reviewColumnIds.selection} kind="selection" />
            {columnVisible(reviewColumnIds.position) ? <TableSummaryCell columnId={reviewColumnIds.position} kind="label">Итоги текущей страницы</TableSummaryCell> : null}
            {columnVisible(reviewColumnIds.name) ? <TableSummaryCell columnId={reviewColumnIds.name} kind="empty" /> : null}
            {columnVisible(reviewColumnIds.grade) ? <TableSummaryCell columnId={reviewColumnIds.grade} kind="empty" /> : null}
            {columnVisible(reviewColumnIds.quantity) ? <TableSummaryCell columnId={reviewColumnIds.quantity} kind="value" align="end">{totalQuantity}</TableSummaryCell> : null}
            {columnVisible(reviewColumnIds.unit) ? <TableSummaryCell columnId={reviewColumnIds.unit} kind="empty" /> : null}
            {columnVisible(reviewColumnIds.price) ? <TableSummaryCell columnId={reviewColumnIds.price} kind="value" align="end">—</TableSummaryCell> : null}
            {columnVisible(reviewColumnIds.sum) ? <TableSummaryCell columnId={reviewColumnIds.sum} kind="value" align="end">{totalSum.toLocaleString('ru-RU')}</TableSummaryCell> : null}
            {columnVisible(reviewColumnIds.delivery) ? <TableSummaryCell columnId={reviewColumnIds.delivery} kind="empty" /> : null}
            {columnVisible(reviewColumnIds.document) ? <TableSummaryCell columnId={reviewColumnIds.document} kind="empty" /> : null}
            {columnVisible(reviewColumnIds.file) ? <TableSummaryCell columnId={reviewColumnIds.file} kind="empty" /> : null}
            {columnVisible(reviewColumnIds.status) ? <TableSummaryCell columnId={reviewColumnIds.status} kind="empty" /> : null}
            {columnVisible(reviewColumnIds.control) ? <TableSummaryCell columnId={reviewColumnIds.control} kind="empty" /> : null}
            {columnVisible(reviewColumnIds.supplier) ? <TableSummaryCell columnId={reviewColumnIds.supplier} kind="empty" /> : null}
          </TableRow> : null}
        </TableBody>
      </Table>;

  if (surface === 'table') return <>{table}{paginator}</>;

  return <WidgetTablePattern
    title={`Спецификация позиций · ${mode === 'read' ? 'Read' : 'Edit'}`}
    description={`${visibleRows.length} из ${filteredRows.length} строк · ${mode === 'read' ? 'построчное чтение' : 'редактирование ячеек'} · фильтры ${filters ? 'включены' : 'выключены'}`}
    toolbar={toolbar}
    footer={paginator}
  >
    {table}
  </WidgetTablePattern>;
}

export type TableReviewExampleProps = Omit<WidgetTableReviewExampleProps, 'surface'>;

/** The same executable Table contract without Widget chrome. */
export function TableReviewExample(props: TableReviewExampleProps) {
  return <WidgetTableReviewExample {...props} surface="table" />;
}
