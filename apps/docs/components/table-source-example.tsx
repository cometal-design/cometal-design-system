'use client';

import { useMemo, useState } from 'react';
import {
  Badge, ContextMenuDivider, ContextMenuItem, Select, Table, TableBody, TableCell,
  TableColumnPinAction, TableContextAction, TableDragCell, TableDragHandle, TableFileCell, TableFilterCell,
  TableFilterAction, TableFilterRow, TableHeaderCell, TableHead, TableIndexCell, TablePaginator, TableRow,
  TableSelectionCell, TableSelectionHeader, TableSummaryCell, TextField, reorderTableRows,
} from '@cometal/react';
import type { TableDensity, TableMode, TableSortDirection } from '@cometal/react';

const rows = [
  { id: 1, position: 'POS-00127', name: 'Рулон холоднокатаный 0,5 мм', quantity: 120, status: 'Согласовано', tone: 'green' as const, file: 'specification.pdf', size: '130 KB', type: 'pdf' as const },
  { id: 2, position: 'POS-00128', name: 'Лист оцинкованный 1,0 мм', quantity: 48, status: 'На проверке', tone: 'yellow' as const, file: 'drawing.dwg', size: '2.4 MB', type: 'file' as const },
  { id: 3, position: 'POS-00129', name: 'Труба профильная 40 × 20', quantity: 320, status: 'Ошибка', tone: 'red' as const, file: 'requirements.docx', size: '84 KB', type: 'word' as const },
  { id: 4, position: 'POS-00130', name: 'Балка двутавровая 20Б1', quantity: 16, status: 'Согласовано', tone: 'green' as const, file: 'certificate.pdf', size: '760 KB', type: 'pdf' as const },
];
const statusOptions = [{ value: 'all', label: 'Все статусы' }, { value: 'approved', label: 'Согласовано' }, { value: 'review', label: 'На проверке' }];

function HeaderMenu({ columnId }: { columnId: string }) {
  return <><TableColumnPinAction columnId={columnId} /><ContextMenuItem>Скрыть</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Сбросить фильтр</ContextMenuItem></>;
}

function Action({ columnId, column }: { columnId: string; column: string }) {
  return <TableContextAction label={`Действия колонки ${column}`} menuLabel={`Действия колонки ${column}`} menu={<HeaderMenu columnId={columnId} />} />;
}

const columnIds = { drag: 'drag', index: 'index', selection: 'selection', position: 'position', name: 'name', quantity: 'quantity', status: 'status', file: 'file' } as const;

const textOperators = ['Содержит', 'Не содержит', 'Начинается с', 'Пусто'] as const;
const numberOperators = ['Равно', 'Не равно', 'Больше', 'Меньше'] as const;
const selectOperators = ['Равно', 'Не равно', 'Выбрано', 'Не выбрано'] as const;
const positionCollator = new Intl.Collator('ru-RU', { numeric: true, sensitivity: 'base' });

function FilterAction({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <TableFilterAction label={label} menu={options.map((option) => <ContextMenuItem key={option} selected={option === value} onClick={() => onChange(option)}>{option}</ContextMenuItem>)} />;
}

export function TableSourceExample({ density = 'comfortable', filters = true, mode = 'read' }: { density?: TableDensity; filters?: boolean; mode?: TableMode }) {
  const [orderedRows, setOrderedRows] = useState(() => [rows[2]!, rows[0]!, rows[3]!, rows[1]!]);
  const [selected, setSelected] = useState([2]); const [sort, setSort] = useState<TableSortDirection>('none');
  const [editing, setEditing] = useState<{ rowId: number; column: 'position' | 'name' | 'quantity' } | null>(null);
  const [pinnedColumnIds, setPinnedColumnIds] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [operators, setOperators] = useState({ position: 'Содержит', name: 'Содержит', quantity: 'Равно', status: 'Равно', file: 'Содержит' });
  const visibleRows = useMemo(() => {
    if (sort === 'none') return orderedRows;
    const direction = sort === 'ascending' ? 1 : -1;
    return orderedRows
      .map((row, originalIndex) => ({ row, originalIndex }))
      .sort((left, right) => {
        const comparison = positionCollator.compare(left.row.position, right.row.position);
        return comparison === 0 ? left.originalIndex - right.originalIndex : comparison * direction;
      })
      .map(({ row }) => row);
  }, [orderedRows, sort]);
  const updateRow = (rowId: number, field: 'position' | 'name' | 'quantity', value: string) => setOrderedRows((current) => current.map((row) => row.id === rowId ? { ...row, [field]: field === 'quantity' ? Number(value) || 0 : value } : row));
  const editableCell = (row: (typeof rows)[number], field: 'position' | 'name' | 'quantity', label: string, align: 'start' | 'end' = 'start', idleState: 'default' | 'error' = 'default') => {
    const isEditing = mode === 'edit' && editing?.rowId === row.id && editing.column === field;
    return <TableCell
      columnId={columnIds[field]}
      align={align}
      editable={mode === 'edit'}
      state={isEditing ? 'editing' : idleState}
      aria-label={isEditing ? `Редактирование: ${label}` : undefined}
      onEditStart={() => setEditing({ rowId: row.id, column: field })}
      onBlur={(event) => {
        if (!isEditing) return;
        if (!event.currentTarget.dataset.editCancelled) updateRow(row.id, field, event.currentTarget.textContent?.trim() ?? '');
        delete event.currentTarget.dataset.editCancelled;
        setEditing(null);
      }}
      onKeyDown={(event) => {
        if (!isEditing) return;
        if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur(); }
        if (event.key === 'Escape') { event.preventDefault(); event.currentTarget.dataset.editCancelled = 'true'; event.currentTarget.blur(); }
      }}
    >{row[field]}</TableCell>;
  };
  return <Table
    density={density}
    mode={mode}
    aria-label={`Позиции закупки · ${mode === 'read' ? 'чтение' : 'редактирование'}`}
    className="docs-table-source"
    pinnedColumnIds={pinnedColumnIds}
    onPinnedColumnIdsChange={setPinnedColumnIds}
    columnWidths={columnWidths}
    onColumnWidthsChange={setColumnWidths}
    onRowReorder={mode === 'edit' ? (event) => setOrderedRows((current) => reorderTableRows(current, event, (row) => String(row.id))) : undefined}
    rowContextMenu={(rowId) => <><ContextMenuItem onClick={() => setSelected((current) => current.includes(Number(rowId)) ? current : [...current, Number(rowId)])}>Выбрать строку</ContextMenuItem><ContextMenuItem>Открыть позицию</ContextMenuItem>{mode === 'edit' ? <><ContextMenuDivider /><ContextMenuItem tone="danger">Удалить строку</ContextMenuItem></> : null}</>}
  >
    <TableHead><TableRow>
      <TableHeaderCell columnId={columnIds.drag} kind="drag"><span className="visually-hidden">Перемещение</span></TableHeaderCell><TableHeaderCell columnId={columnIds.index} kind="index">№</TableHeaderCell>
      <TableSelectionHeader columnId={columnIds.selection} selectedCount={selected.length} totalCount={orderedRows.length} onSelectionChange={(checked) => setSelected(checked ? orderedRows.map((row) => row.id) : [])} />
      <TableHeaderCell columnId={columnIds.position} style={{ width: 156 }} sort={sort} onSortChange={setSort} action={<Action columnId={columnIds.position} column="Позиция" />}>Позиция</TableHeaderCell>
      <TableHeaderCell columnId={columnIds.name} action={<Action columnId={columnIds.name} column="Наименование" />}>Наименование</TableHeaderCell><TableHeaderCell columnId={columnIds.quantity} style={{ width: 136 }} action={<Action columnId={columnIds.quantity} column="Количество" />}>Количество</TableHeaderCell><TableHeaderCell columnId={columnIds.status} style={{ width: 160 }} action={<Action columnId={columnIds.status} column="Статус" />}>Статус</TableHeaderCell><TableHeaderCell columnId={columnIds.file} style={{ width: 220 }} action={<Action columnId={columnIds.file} column="Файл" />}>Файл</TableHeaderCell>
    </TableRow>{filters ? <TableFilterRow aria-label="Фильтры таблицы"><TableFilterCell columnId={columnIds.drag} kind="drag" /><TableFilterCell columnId={columnIds.index} kind="index" /><TableFilterCell columnId={columnIds.selection} kind="selection" /><TableFilterCell columnId={columnIds.position} action={<FilterAction label="Позиция" value={operators.position} options={textOperators} onChange={(value) => setOperators((current) => ({ ...current, position: value }))} />}><TextField label="Фильтр по позиции" size="s" placeholder={operators.position} /></TableFilterCell><TableFilterCell columnId={columnIds.name} action={<FilterAction label="Наименование" value={operators.name} options={textOperators} onChange={(value) => setOperators((current) => ({ ...current, name: value }))} />}><TextField label="Фильтр по наименованию" size="s" placeholder={operators.name} /></TableFilterCell><TableFilterCell columnId={columnIds.quantity} action={<FilterAction label="Количество" value={operators.quantity} options={numberOperators} onChange={(value) => setOperators((current) => ({ ...current, quantity: value }))} />}><TextField label="Фильтр по количеству" size="s" placeholder={operators.quantity} /></TableFilterCell><TableFilterCell columnId={columnIds.status} action={<FilterAction label="Статус" value={operators.status} options={selectOperators} onChange={(value) => setOperators((current) => ({ ...current, status: value }))} />}><Select label="Фильтр по статусу" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell><TableFilterCell columnId={columnIds.file} action={<FilterAction label="Файл" value={operators.file} options={textOperators} onChange={(value) => setOperators((current) => ({ ...current, file: value }))} />}><TextField label="Фильтр по файлу" size="s" placeholder={operators.file} /></TableFilterCell></TableFilterRow> : null}</TableHead>
    <TableBody>{visibleRows.map((row, index) => <TableRow key={row.id} rowId={String(row.id)} reorderId={mode === 'edit' ? String(row.id) : undefined} selected={selected.includes(row.id)}><TableDragCell columnId={columnIds.drag}><TableDragHandle rowLabel={row.position} /></TableDragCell><TableIndexCell columnId={columnIds.index}>{index + 1}</TableIndexCell><TableSelectionCell columnId={columnIds.selection} label={`Выбрать строку ${row.id}`} checked={selected.includes(row.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, row.id] : current.filter((id) => id !== row.id))} />{editableCell(row, 'position', `Позиция ${row.id}`)}{editableCell(row, 'name', `Наименование ${row.id}`, 'start', row.id === 3 ? 'error' : 'default')}{editableCell(row, 'quantity', `Количество ${row.id}`, 'end')}<TableCell columnId={columnIds.status}><Badge tone={row.tone}>{row.status}</Badge></TableCell><TableFileCell columnId={columnIds.file} fileName={row.file} fileSize={row.size} fileType={row.type} /></TableRow>)}<TableRow>{mode === 'edit' ? <TableSummaryCell columnId={columnIds.drag} kind="drag" /> : null}<TableSummaryCell columnId={columnIds.index} kind="index" /><TableSummaryCell columnId={columnIds.selection} kind="selection" /><TableSummaryCell columnId={columnIds.position} kind="empty" /><TableSummaryCell columnId={columnIds.name} kind="label">Итого</TableSummaryCell><TableSummaryCell columnId={columnIds.quantity} kind="value" align="end">504</TableSummaryCell><TableSummaryCell columnId={columnIds.status} kind="value">4 позиции</TableSummaryCell><TableSummaryCell columnId={columnIds.file} kind="value">4 файла</TableSummaryCell></TableRow></TableBody>
  </Table>;
}

export function TablePaginatorExample() {
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  return <TablePaginator page={page} pageCount={12} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} />;
}
