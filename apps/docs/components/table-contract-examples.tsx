'use client';

import { useState } from 'react';
import {
  Badge,
  ContextMenuDivider,
  ContextMenuItem,
  DatePicker,
  DateRangePicker,
  InlineLink,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContextAction,
  TableDragCell,
  TableDragHandle,
  TableFileCell,
  TableFileIcon,
  TableFilterCell,
  TableFilterRow,
  TableHeaderCell,
  TableHead,
  TableIndexCell,
  TablePaginator,
  TableRow,
  TableSelectionCell,
  TableSelectionHeader,
  TableSummaryCell,
  TextField,
  tableDensities,
  tableFileTypes,
} from '@cometal/react';
import type { TableCellState, TableDensity, TableSortDirection } from '@cometal/react';

const statusOptions = [
  { value: 'all', label: 'Все статусы' },
  { value: 'approved', label: 'Согласовано' },
  { value: 'review', label: 'На проверке' },
];

const readStates = ['default', 'hover', 'active', 'selected', 'disabled'] as const satisfies readonly TableCellState[];
const readTypes = ['Text', 'Number', 'Link', 'Badge', 'Text + Badge', 'Number + Badge', 'Badge + Text', 'File'] as const;
const editStates = ['default', 'hover', 'active', 'editing', 'selected', 'error', 'disabled'] as const satisfies readonly TableCellState[];
const editTypes = ['Text', 'Number', 'Dropdown', 'File'] as const;
const selectionStates = ['default', 'hover', 'disabled', 'error'] as const satisfies readonly TableCellState[];
const indexStates = ['default', 'hover', 'active', 'selected', 'error', 'disabled'] as const satisfies readonly TableCellState[];
const dragStates = ['default', 'hover', 'dragging', 'disabled', 'active'] as const satisfies readonly TableCellState[];

function ReadValue({ type }: { type: (typeof readTypes)[number] }) {
  if (type === 'Number') return <>12 450,00</>;
  if (type === 'Link') return <InlineLink href="#table-read-cell" onClick={(event) => event.preventDefault()}>Открыть позицию</InlineLink>;
  if (type === 'Badge') return <Badge tone="blue">Статус</Badge>;
  if (type === 'Text + Badge') return <>Значение <Badge tone="blue">Статус</Badge></>;
  if (type === 'Number + Badge') return <>12 450 <Badge tone="green">ОК</Badge></>;
  if (type === 'Badge + Text') return <><Badge tone="yellow">Новый</Badge> Значение</>;
  return <>Текстовое значение</>;
}

function ReadCellMatrix({ density }: { density: TableDensity }) {
  return <Table density={density} aria-label={`Read Cell · ${density}`} className="docs-table-contract-matrix"><TableHead><TableRow><TableHeaderCell>Type</TableHeaderCell>{readStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody>{readTypes.map((type) => <TableRow key={type}><TableHeaderCell scope="row">{type}</TableHeaderCell>{readStates.map((state) => type === 'File' ? <TableFileCell key={state} state={state} fileName="Спецификация.pdf" fileSize="130 КБ" fileType="pdf" /> : <TableCell key={state} state={state} align={type.includes('Number') ? 'end' : 'start'}><ReadValue type={type} /></TableCell>)}</TableRow>)}</TableBody></Table>;
}

function EditValue({ type }: { type: (typeof editTypes)[number] }) {
  if (type === 'Number') return <>12 450</>;
  if (type === 'Dropdown') return <>Согласовано</>;
  return <>Значение</>;
}

function EditCellMatrix({ density }: { density: TableDensity }) {
  return <Table density={density} mode="edit" aria-label={`Edit Cell · ${density}`} className="docs-table-contract-matrix"><TableHead><TableRow><TableHeaderCell>Type</TableHeaderCell>{editStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody>{editTypes.map((type) => <TableRow key={type}><TableHeaderCell scope="row">{type}</TableHeaderCell>{editStates.map((state) => type === 'File' ? <TableFileCell key={state} state={state} fileName="Спецификация.pdf" fileSize="130 КБ" fileType="pdf" /> : <TableCell key={state} state={state} editable aria-label={`${type} · ${state}`}><EditValue type={type} /></TableCell>)}</TableRow>)}</TableBody></Table>;
}

function UtilityCellMatrices({ density }: { density: TableDensity }) {
  return <div className="docs-table-utility-matrices">
    <article><h3>Selection Cell · 4 × 2</h3><Table density={density} aria-label={`Selection Cell · ${density}`}><TableHead><TableRow><TableHeaderCell>State</TableHeaderCell><TableHeaderCell>Unchecked</TableHeaderCell><TableHeaderCell>Checked</TableHeaderCell></TableRow></TableHead><TableBody>{selectionStates.map((state) => <TableRow key={state}><TableHeaderCell scope="row">{state}</TableHeaderCell><TableSelectionCell state={state} label={`${state} unchecked`} checked={false} disabled={state === 'disabled'} /><TableSelectionCell state={state} label={`${state} checked`} checked disabled={state === 'disabled'} /></TableRow>)}</TableBody></Table></article>
    <article><h3>Index Cell · 6 states</h3><Table density={density} aria-label={`Index Cell · ${density}`}><TableHead><TableRow>{indexStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody><TableRow>{indexStates.map((state, index) => <TableIndexCell key={state} state={state}>{index + 1}</TableIndexCell>)}</TableRow></TableBody></Table></article>
    <article><h3>Drag Handle Cell · 5 states</h3><Table density={density} mode="edit" aria-label={`Drag Handle Cell · ${density}`}><TableHead><TableRow>{dragStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody><TableRow>{dragStates.map((state) => <TableDragCell key={state} state={state}><TableDragHandle rowLabel={state} disabled={state === 'disabled'} /></TableDragCell>)}</TableRow></TableBody></Table></article>
    <article><h3>Summary Cell · 3 types</h3><Table density={density} aria-label={`Summary Cell · ${density}`}><TableBody><TableRow><TableSummaryCell kind="empty" /><TableSummaryCell kind="label">Итого</TableSummaryCell><TableSummaryCell kind="value" align="end">12 450,00</TableSummaryCell></TableRow></TableBody></Table></article>
  </div>;
}

export function TableCellsContract() {
  return <div className="docs-table-contract-stack">
    {tableDensities.map((density) => <section className="docs-table-density-contract" key={density}><h3>{density === 'comfortable' ? 'Comfortable · 48px' : 'Compact · 40px'}</h3><p>Read 8×5, Edit 4×7, Selection 4×2, Index 6, Drag 5 и Summary 3.</p><div className="docs-table-matrix-stack"><h4>Read Cell · 8 types × 5 states</h4><ReadCellMatrix density={density} /><h4>Edit Cell · 4 types × 7 states</h4><EditCellMatrix density={density} /><UtilityCellMatrices density={density} /></div></section>)}
    <section className="docs-table-density-contract"><h3>File Content · standalone</h3><p>Девять точных Figma assets; Compact скрывает metadata только визуально.</p><div className="table-file-catalog">{tableFileTypes.map((type) => <article key={type}><TableFileIcon type={type} /><code>{type}</code></article>)}</div></section>
  </div>;
}

function HeaderMenu() {
  return <><ContextMenuItem>Закрепить слева</ContextMenuItem><ContextMenuItem>Скрыть колонку</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Сбросить фильтр</ContextMenuItem></>;
}

function HeaderAction({ label }: { label: string }) {
  return <TableContextAction label={`Действия колонки ${label}`} menuLabel={`Действия колонки ${label}`} menu={<HeaderMenu />} />;
}

export function TableHeadersContract() {
  const [sort, setSort] = useState<TableSortDirection>('none');
  const filters = ['Empty', 'Text', 'Number', 'Date', 'Period', 'Select', 'Boolean'] as const;
  return <div className="docs-table-contract-stack">
    <section className="docs-table-density-contract"><h3>Sort и context actions</h3><p>Управляемый цикл состояний заголовка и отдельная кнопка действий; реальную перестановку строк показывает рабочий Table example.</p><Table density="comfortable" aria-label="Header source"><TableHead><TableRow><TableHeaderCell sort={sort} onSortChange={setSort} action={<HeaderAction label="Позиция" />}>Позиция</TableHeaderCell><TableHeaderCell sort="ascending">По возрастанию</TableHeaderCell><TableHeaderCell sort="descending">По убыванию</TableHeaderCell></TableRow><TableFilterRow><TableFilterCell><TextField label="Текст" size="s" /></TableFilterCell><TableFilterCell><DatePicker label="Дата" size="s" /></TableFilterCell><TableFilterCell><DateRangePicker label="Период" size="s" /></TableFilterCell></TableFilterRow></TableHead></Table></section>
    <section className="docs-table-density-contract"><h3>Column Header · 3 sort × 2 density</h3><p>Default не имеет отдельного Hover/Active surface; Ascending и Descending используют реальные selected states.</p><div className="docs-table-density-pair">{tableDensities.map((density) => <article key={density}><h4>{density}</h4><Table density={density} aria-label={`Column Header ${density}`}><TableHead><TableRow>{(['none', 'ascending', 'descending'] as const).map((sortValue) => <TableHeaderCell key={sortValue} sort={sortValue}>{sortValue}</TableHeaderCell>)}</TableRow></TableHead></Table></article>)}</div></section>
    <section className="docs-table-density-contract"><h3>Context Action · реальные состояния</h3><p>Hover, focus и open создаёт общий Context Action при взаимодействии, без документационных подмен.</p><div className="docs-table-density-pair">{tableDensities.map((density) => <article key={density}><h4>{density}</h4><Table density={density} aria-label={`Context Action ${density}`}><TableHead><TableRow><TableHeaderCell action={<HeaderAction label={density} />}>Действия</TableHeaderCell></TableRow></TableHead></Table></article>)}</div></section>
    <section className="docs-table-density-contract"><h3>Selection Header · alignment × 2 density</h3><div className="docs-table-density-pair">{tableDensities.map((density) => <article key={density}><h4>{density}</h4><Table density={density} aria-label={`Selection Header ${density}`}><TableHead>{(['default', 'disabled'] as const).map((state) => <TableRow key={state}><TableHeaderCell scope="row">{state}</TableHeaderCell><TableSelectionHeader selectedCount={0} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} unchecked`} /><TableSelectionHeader selectedCount={1} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} mixed`} /><TableSelectionHeader selectedCount={2} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} checked`} /></TableRow>)}</TableHead></Table></article>)}</div></section>
    <section className="docs-table-density-contract"><h3>Filter Row · 7 default variants</h3><div className="docs-table-filter-contract-grid">{filters.map((type) => <article key={type}><code>{type} · default</code><Table density="comfortable" aria-label={`Filter ${type}:default`}><TableHead><TableFilterRow><TableFilterCell>{type === 'Empty' ? null : type === 'Date' ? <DatePicker label={`${type}:default`} size="s" /> : type === 'Period' ? <DateRangePicker label={`${type}:default`} size="s" /> : type === 'Select' ? <Select label={`${type}:default`} size="s" options={statusOptions} defaultValue="all" /> : <TextField label={`${type}:default`} size="s" inputMode={type === 'Number' ? 'numeric' : undefined} defaultValue={type === 'Boolean' ? 'Да' : undefined} />}</TableFilterCell></TableFilterRow></TableHead></Table></article>)}</div></section>
  </div>;
}

const columnRows = [
  ['POS-001', 'Позиция 1'], ['POS-002', 'Позиция 2'], ['POS-003', 'Позиция 3'], ['POS-004', 'Позиция 4'],
] as const;

export function TableColumnsContract() {
  const families = ['Read Column', 'Edit Column', 'Index Column', 'Selection Column', 'Drag Handle Column'] as const;
  const rowCounts = [10, 15, 20, 30] as const;
  return <div className="docs-table-contract-stack">
    {tableDensities.map((density) => <section className="docs-table-density-contract" key={density}><h3>{density === 'comfortable' ? 'Comfortable · 48px' : 'Compact · 40px'}</h3><p>Пять самостоятельных колонок синхронизируют header, filter, body и summary.</p><Table density={density} mode="edit" aria-label={`Column families · ${density}`}><TableHead><TableRow><TableHeaderCell>Read Column</TableHeaderCell><TableHeaderCell>Edit Column</TableHeaderCell><TableHeaderCell kind="index">Index</TableHeaderCell><TableSelectionHeader selectedCount={1} totalCount={4} onSelectionChange={() => undefined} /><TableHeaderCell kind="drag">Drag</TableHeaderCell></TableRow><TableFilterRow><TableFilterCell><TextField label="Read filter" size="s" /></TableFilterCell><TableFilterCell><Select label="Edit filter" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell><TableFilterCell kind="index" /><TableFilterCell kind="selection" /><TableFilterCell kind="drag" /></TableFilterRow></TableHead><TableBody>{columnRows.map(([position, name], index) => <TableRow key={position}><TableCell>{position}</TableCell><TableCell editable state={index === 0 ? 'editing' : 'default'} aria-label={`Edit ${position}`}>{name}</TableCell><TableIndexCell>{index + 1}</TableIndexCell><TableSelectionCell label={`Select ${position}`} checked={index === 0} /><TableDragCell><TableDragHandle rowLabel={position} /></TableDragCell></TableRow>)}<TableRow><TableSummaryCell kind="label">Read summary</TableSummaryCell><TableSummaryCell kind="value">Edit summary</TableSummaryCell><TableSummaryCell kind="empty" /><TableSummaryCell kind="value">1 / 4</TableSummaryCell><TableSummaryCell kind="empty" /></TableRow></TableBody></Table></section>)}
    <section className="docs-table-density-contract"><h3>Rows evidence · 5 × 4 × 2</h3><p>10, 15, 20 и 30 строк остаются documentation evidence, а не runtime prop.</p><div className="docs-table-column-contract-grid">{families.map((family) => <article key={family}><h4>{family}</h4>{tableDensities.map((density) => <div key={density}><code>{density}</code><div>{rowCounts.map((count) => <span key={count}>{count} rows</span>)}</div></div>)}</article>)}</div></section>
  </div>;
}

export function TablePaginatorContract() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  return <div className="docs-table-contract-stack">
    <section className="docs-table-density-contract"><h3>Интерактивный пример</h3><p>Disabled края, current page, ellipsis и page-size доступны с клавиатуры.</p><TablePaginator aria-label="Интерактивная пагинация таблицы" page={page} pageCount={12} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} /></section>
    <section className="docs-table-density-contract"><h3>Control states</h3><p>Previous/Next Default и Disabled, Page Default/Current, Ellipsis и page-size.</p><div className="docs-table-paginator-contract"><article><code>first page</code><TablePaginator aria-label="Пагинация на первой странице" page={1} pageCount={12} onPageChange={() => undefined} pageSize={10} /></article><article><code>middle · ellipsis both sides</code><TablePaginator aria-label="Пагинация в середине диапазона" page={6} pageCount={12} onPageChange={() => undefined} pageSize={15} /></article><article><code>last page</code><TablePaginator aria-label="Пагинация на последней странице" page={12} pageCount={12} onPageChange={() => undefined} pageSize={30} /></article></div></section>
  </div>;
}
