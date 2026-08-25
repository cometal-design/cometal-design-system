'use client';

import { useState } from 'react';
import {
  Badge, ContextMenuDivider, ContextMenuItem, Select, Table, TableBody, TableCell,
  TableContextAction, TableDragCell, TableDragHandle, TableFileCell, TableFilterCell,
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

function Action({ column }: { column: string }) {
  return <TableContextAction label={`Действия колонки ${column}`} menuLabel={`Действия колонки ${column}`} menu={<><ContextMenuItem>Закрепить</ContextMenuItem><ContextMenuItem>Скрыть</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Сбросить фильтр</ContextMenuItem></>} />;
}

const textOperators = ['Содержит', 'Не содержит', 'Начинается с', 'Пусто'] as const;
const numberOperators = ['Равно', 'Не равно', 'Больше', 'Меньше'] as const;
const selectOperators = ['Равно', 'Не равно', 'Выбрано', 'Не выбрано'] as const;

function FilterAction({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <TableFilterAction label={label} menu={options.map((option) => <ContextMenuItem key={option} selected={option === value} onClick={() => onChange(option)}>{option}</ContextMenuItem>)} />;
}

export function TableSourceExample({ density = 'comfortable', filters = true, mode = 'read' }: { density?: TableDensity; filters?: boolean; mode?: TableMode }) {
  const [orderedRows, setOrderedRows] = useState(() => [...rows]);
  const [selected, setSelected] = useState([2]); const [sort, setSort] = useState<TableSortDirection>('ascending');
  const [editing, setEditing] = useState<{ rowId: number; column: 'position' | 'name' | 'quantity' } | null>(null);
  const [operators, setOperators] = useState({ position: 'Содержит', name: 'Содержит', quantity: 'Равно', status: 'Равно', file: 'Содержит' });
  const updateRow = (rowId: number, field: 'position' | 'name' | 'quantity', value: string) => setOrderedRows((current) => current.map((row) => row.id === rowId ? { ...row, [field]: field === 'quantity' ? Number(value) || 0 : value } : row));
  const editableCell = (row: (typeof rows)[number], field: 'position' | 'name' | 'quantity', label: string, align: 'start' | 'end' = 'start', idleState: 'default' | 'error' = 'default') => {
    const isEditing = mode === 'edit' && editing?.rowId === row.id && editing.column === field;
    return <TableCell
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
    onRowReorder={mode === 'edit' ? (event) => setOrderedRows((current) => reorderTableRows(current, event, (row) => String(row.id))) : undefined}
    rowContextMenu={(rowId) => <><ContextMenuItem onClick={() => setSelected((current) => current.includes(Number(rowId)) ? current : [...current, Number(rowId)])}>Выбрать строку</ContextMenuItem><ContextMenuItem>Открыть позицию</ContextMenuItem>{mode === 'edit' ? <><ContextMenuDivider /><ContextMenuItem tone="danger">Удалить строку</ContextMenuItem></> : null}</>}
  >
    <TableHead><TableRow>
      <TableHeaderCell kind="drag"><span className="visually-hidden">Перемещение</span></TableHeaderCell><TableHeaderCell kind="index">№</TableHeaderCell>
      <TableSelectionHeader selectedCount={selected.length} totalCount={orderedRows.length} onSelectionChange={(checked) => setSelected(checked ? orderedRows.map((row) => row.id) : [])} />
      <TableHeaderCell style={{ width: 156 }} sort={sort} onSortChange={setSort} action={<Action column="Позиция" />}>Позиция</TableHeaderCell>
      <TableHeaderCell action={<Action column="Наименование" />}>Наименование</TableHeaderCell><TableHeaderCell style={{ width: 136 }}>Количество</TableHeaderCell><TableHeaderCell style={{ width: 160 }}>Статус</TableHeaderCell><TableHeaderCell style={{ width: 220 }}>Файл</TableHeaderCell>
    </TableRow>{filters ? <TableFilterRow aria-label="Фильтры таблицы"><TableFilterCell kind="drag" /><TableFilterCell kind="index" /><TableFilterCell kind="selection" /><TableFilterCell action={<FilterAction label="Позиция" value={operators.position} options={textOperators} onChange={(value) => setOperators((current) => ({ ...current, position: value }))} />}><TextField className="docs-table-filter" label="Фильтр по позиции" size="s" placeholder={operators.position} /></TableFilterCell><TableFilterCell action={<FilterAction label="Наименование" value={operators.name} options={textOperators} onChange={(value) => setOperators((current) => ({ ...current, name: value }))} />}><TextField className="docs-table-filter" label="Фильтр по наименованию" size="s" placeholder={operators.name} /></TableFilterCell><TableFilterCell action={<FilterAction label="Количество" value={operators.quantity} options={numberOperators} onChange={(value) => setOperators((current) => ({ ...current, quantity: value }))} />}><TextField className="docs-table-filter" label="Фильтр по количеству" size="s" placeholder={operators.quantity} /></TableFilterCell><TableFilterCell action={<FilterAction label="Статус" value={operators.status} options={selectOperators} onChange={(value) => setOperators((current) => ({ ...current, status: value }))} />}><Select className="docs-table-filter" label="Фильтр по статусу" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell><TableFilterCell action={<FilterAction label="Файл" value={operators.file} options={textOperators} onChange={(value) => setOperators((current) => ({ ...current, file: value }))} />}><TextField className="docs-table-filter" label="Фильтр по файлу" size="s" placeholder={operators.file} /></TableFilterCell></TableFilterRow> : null}</TableHead>
    <TableBody>{orderedRows.map((row, index) => <TableRow key={row.id} rowId={String(row.id)} reorderId={mode === 'edit' ? String(row.id) : undefined} selected={selected.includes(row.id)}><TableDragCell><TableDragHandle rowLabel={row.position} /></TableDragCell><TableIndexCell>{index + 1}</TableIndexCell><TableSelectionCell label={`Выбрать строку ${row.id}`} checked={selected.includes(row.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, row.id] : current.filter((id) => id !== row.id))} />{editableCell(row, 'position', `Позиция ${row.id}`)}{editableCell(row, 'name', `Наименование ${row.id}`, 'start', row.id === 3 ? 'error' : 'default')}{editableCell(row, 'quantity', `Количество ${row.id}`, 'end')}<TableCell><Badge tone={row.tone}>{row.status}</Badge></TableCell><TableFileCell fileName={row.file} fileSize={row.size} fileType={row.type} /></TableRow>)}<TableRow><TableSummaryCell kind="empty" colSpan={mode === 'edit' ? 3 : 2} /><TableSummaryCell kind="label" colSpan={2}>Итого</TableSummaryCell><TableSummaryCell kind="value" align="end">504</TableSummaryCell><TableSummaryCell kind="value">4 позиции</TableSummaryCell><TableSummaryCell kind="value">4 файла</TableSummaryCell></TableRow></TableBody>
  </Table>;
}

export function TablePaginatorExample() {
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  return <TablePaginator page={page} pageCount={12} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} />;
}
