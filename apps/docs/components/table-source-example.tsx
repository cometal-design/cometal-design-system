'use client';

import { useState } from 'react';
import {
  Badge, ContextMenuDivider, ContextMenuItem, Select, Table, TableBody, TableCell,
  TableContextAction, TableDragCell, TableDragHandle, TableFileCell, TableFilterCell,
  TableFilterRow, TableHeaderCell, TableHead, TableIndexCell, TablePaginator, TableRow,
  TableSelectionCell, TableSelectionHeader, TableSummaryCell, TextField,
} from '@cometal/react';
import type { TableDensity, TableSortDirection } from '@cometal/react';

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

export function TableSourceExample({ density = 'comfortable', filters = true }: { density?: TableDensity; filters?: boolean }) {
  const [selected, setSelected] = useState([2]); const [sort, setSort] = useState<TableSortDirection>('ascending');
  return <Table density={density} aria-label="Позиции закупки" className="docs-table-source">
    <TableHead><TableRow>
      <TableHeaderCell kind="drag"><span className="visually-hidden">Перемещение</span></TableHeaderCell><TableHeaderCell kind="index">№</TableHeaderCell>
      <TableSelectionHeader selectedCount={selected.length} totalCount={rows.length} onSelectionChange={(checked) => setSelected(checked ? rows.map((row) => row.id) : [])} />
      <TableHeaderCell style={{ width: 156 }} sort={sort} onSortChange={setSort} action={<Action column="Позиция" />}>Позиция</TableHeaderCell>
      <TableHeaderCell action={<Action column="Наименование" />}>Наименование</TableHeaderCell><TableHeaderCell style={{ width: 136 }}>Количество</TableHeaderCell><TableHeaderCell style={{ width: 160 }}>Статус</TableHeaderCell><TableHeaderCell style={{ width: 220 }}>Файл</TableHeaderCell>
    </TableRow>{filters ? <TableFilterRow aria-label="Фильтры таблицы"><TableFilterCell kind="drag" /><TableFilterCell kind="index" /><TableFilterCell kind="selection" /><TableFilterCell><TextField className="docs-table-filter" label="Фильтр по позиции" size="s" placeholder="Найти" /></TableFilterCell><TableFilterCell><TextField className="docs-table-filter" label="Фильтр по наименованию" size="s" placeholder="Найти" /></TableFilterCell><TableFilterCell><TextField className="docs-table-filter" label="Фильтр по количеству" size="s" placeholder="0" /></TableFilterCell><TableFilterCell><Select className="docs-table-filter" label="Фильтр по статусу" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell><TableFilterCell><TextField className="docs-table-filter" label="Фильтр по файлу" size="s" placeholder="Найти" /></TableFilterCell></TableFilterRow> : null}</TableHead>
    <TableBody>{rows.map((row) => <TableRow key={row.id} selected={selected.includes(row.id)}><TableDragCell><TableDragHandle rowLabel={String(row.id)} /></TableDragCell><TableIndexCell>{row.id}</TableIndexCell><TableSelectionCell label={`Выбрать строку ${row.id}`} checked={selected.includes(row.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, row.id] : current.filter((id) => id !== row.id))} /><TableCell>{row.position}</TableCell><TableCell state={row.id === 3 ? 'error' : 'default'}>{row.name}</TableCell><TableCell align="end">{row.quantity}</TableCell><TableCell><Badge tone={row.tone}>{row.status}</Badge></TableCell><TableFileCell fileName={row.file} fileSize={row.size} fileType={row.type} /></TableRow>)}<TableRow><TableSummaryCell kind="empty" colSpan={3} /><TableSummaryCell kind="label" colSpan={2}>Итого</TableSummaryCell><TableSummaryCell kind="value" align="end">504</TableSummaryCell><TableSummaryCell kind="value">4 позиции</TableSummaryCell><TableSummaryCell kind="value">4 файла</TableSummaryCell></TableRow></TableBody>
  </Table>;
}

export function TablePaginatorExample() {
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  return <TablePaginator page={page} pageCount={12} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} />;
}
