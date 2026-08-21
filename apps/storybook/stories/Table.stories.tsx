import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Badge, Button, ContextMenuDivider, ContextMenuItem, DatePicker, DateRangePicker, Select,
  Table, TableBody, TableCell, TableContextAction, TableDragCell, TableDragHandle,
  TableFileCell, TableFileIcon, TableFilterCell, TableFilterRow, TableHeaderCell, TableHead,
  TableIndexCell, TablePaginator, TableRow, TableSelectionCell, TableSelectionHeader,
  TableSummaryCell, TextField, tableDocumentationSections, tableFileTypes,
  tableFigmaSources, tableSourceFamilies,
} from '@cometal/react';
import type { TableCellState, TableDensity, TableFileType, TableSortDirection } from '@cometal/react';
import { ComponentCodeExample } from './ComponentCodeExample';

const SOURCE_URL = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Table/Table.tsx';
const statusOptions = [
  { value: 'all', label: 'Все статусы' }, { value: 'approved', label: 'Согласовано' },
  { value: 'review', label: 'На проверке' }, { value: 'error', label: 'Ошибка' },
];
const sourceRows = [
  { id: 1, position: 'POS-00127', name: 'Рулон холоднокатаный 0,5 мм', quantity: 120, status: 'Согласовано', tone: 'green' as const, file: 'specification.pdf', size: '130 KB', type: 'pdf' as TableFileType },
  { id: 2, position: 'POS-00128', name: 'Лист оцинкованный 1,0 мм для фасадной линии №4', quantity: 48, status: 'На проверке', tone: 'yellow' as const, file: 'drawing.dwg', size: '2.4 MB', type: 'file' as TableFileType },
  { id: 3, position: 'POS-00129', name: 'Труба профильная 40 × 20', quantity: 320, status: 'Ошибка', tone: 'red' as const, file: 'requirements.docx', size: '84 KB', type: 'word' as TableFileType },
  { id: 4, position: 'POS-00130', name: 'Балка двутавровая 20Б1', quantity: 16, status: 'Согласовано', tone: 'green' as const, file: 'certificate.pdf', size: '760 KB', type: 'pdf' as TableFileType },
];

function ColumnMenu() {
  return <><ContextMenuItem>Закрепить слева</ContextMenuItem><ContextMenuItem>Скрыть колонку</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Сбросить фильтр</ContextMenuItem></>;
}
function HeaderAction({ column }: { column: string }) {
  return <TableContextAction label={`Действия колонки ${column}`} menuLabel={`Действия колонки ${column}`} menu={<ColumnMenu />} />;
}

function SourceTable({ density = 'comfortable', filters = true, ariaLabel = 'Позиции закупки' }: { density?: TableDensity; filters?: boolean; ariaLabel?: string }) {
  const [selected, setSelected] = useState<number[]>([2]);
  const [sort, setSort] = useState<TableSortDirection>('ascending');
  const toggleAll = (checked: boolean) => setSelected(checked ? sourceRows.map((row) => row.id) : []);
  return (
    <Table density={density} aria-label={ariaLabel} className="ds-table-source-example">
      <TableHead>
        <TableRow>
          <TableHeaderCell kind="drag"><span className="sr-only">Перемещение</span></TableHeaderCell>
          <TableHeaderCell kind="index">№</TableHeaderCell>
          <TableSelectionHeader selectedCount={selected.length} totalCount={sourceRows.length} onSelectionChange={toggleAll} />
          <TableHeaderCell style={{ width: 156 }} sort={sort} onSortChange={setSort} action={<HeaderAction column="Позиция" />}>Позиция</TableHeaderCell>
          <TableHeaderCell style={{ width: 300 }} action={<HeaderAction column="Наименование" />}>Наименование</TableHeaderCell>
          <TableHeaderCell style={{ width: 136 }} action={<HeaderAction column="Количество" />}>Количество</TableHeaderCell>
          <TableHeaderCell style={{ width: 160 }} action={<HeaderAction column="Статус" />}>Статус</TableHeaderCell>
          <TableHeaderCell style={{ width: 220 }} action={<HeaderAction column="Файл" />}>Файл</TableHeaderCell>
        </TableRow>
        {filters ? <TableFilterRow aria-label="Фильтры таблицы">
          <TableFilterCell kind="drag" /><TableFilterCell kind="index" /><TableFilterCell kind="selection" />
          <TableFilterCell><TextField className="ds-table-filter-field" label="Фильтр по позиции" size="s" placeholder="Найти" /></TableFilterCell>
          <TableFilterCell><TextField className="ds-table-filter-field" label="Фильтр по наименованию" size="s" placeholder="Найти" /></TableFilterCell>
          <TableFilterCell><TextField className="ds-table-filter-field" label="Фильтр по количеству" size="s" inputMode="numeric" placeholder="0" /></TableFilterCell>
          <TableFilterCell><Select className="ds-table-filter-field" label="Фильтр по статусу" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell>
          <TableFilterCell><TextField className="ds-table-filter-field" label="Фильтр по файлу" size="s" placeholder="Найти" /></TableFilterCell>
        </TableFilterRow> : null}
      </TableHead>
      <TableBody>
        {sourceRows.map((row) => <TableRow key={row.id} selected={selected.includes(row.id)}>
          <TableDragCell><TableDragHandle rowLabel={String(row.id)} /></TableDragCell>
          <TableIndexCell>{row.id}</TableIndexCell>
          <TableSelectionCell label={`Выбрать строку ${row.id}`} checked={selected.includes(row.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, row.id] : current.filter((id) => id !== row.id))} />
          <TableCell state={row.id === 2 ? 'selected' : 'default'}>{row.position}</TableCell>
          <TableCell state={row.id === 3 ? 'error' : 'default'}>{row.name}</TableCell>
          <TableCell align="end">{row.quantity}</TableCell><TableCell><Badge tone={row.tone}>{row.status}</Badge></TableCell>
          <TableFileCell fileName={row.file} fileSize={row.size} fileType={row.type} />
        </TableRow>)}
        <TableRow><TableSummaryCell kind="empty" colSpan={3} /><TableSummaryCell kind="label" colSpan={2}>Итого</TableSummaryCell><TableSummaryCell kind="value" align="end">504</TableSummaryCell><TableSummaryCell kind="value">4 позиции</TableSummaryCell><TableSummaryCell kind="value">4 файла</TableSummaryCell></TableRow>
      </TableBody>
    </Table>
  );
}

function OverviewPage() {
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  return <main className="ds-component-page ds-table-page">
    <header className="ds-component-hero"><div><span className="ds-eyebrow">COMPONENT FAMILY · WEB · IN REVIEW</span><h1>Table</h1><p>Семейство таблицы из 16 source families. Figma задаёт визуальный и композиционный контракт, React сохраняет нативную HTML table-семантику и минимальный поведенческий API.</p></div><a href={tableFigmaSources.sources} target="_blank" rel="noreferrer">Открыть Sources в Figma ↗</a></header>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Рабочая композиция</h2><p>Первый ряд header содержит названия и действия колонок. Второй независимый ряд синхронно содержит фильтры. Плотность меняет body, но header остаётся 48px.</p></div></div><div className="ds-table-demo"><SourceTable /></div><TablePaginator page={page} pageCount={8} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} /></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Состав источников</h2><p>Каждый Figma source family имеет отдельное документированное место. Variant count — evidence покрытия, а не React props.</p></div></div><div className="ds-table-source-grid">{tableSourceFamilies.map((family) => <article key={family.id}><code>{family.id}</code><h3>{family.label}</h3><p>{family.variants} variants</p><a href={family.source} target="_blank" rel="noreferrer">Figma source ↗</a></article>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>Разделы документации</h2><p>Cells, Headers, Columns и Paginator раскрываются самостоятельными stories; служебные primitives не теряются внутри одного большого стенда.</p></div></div><div className="ds-table-doc-index">{tableDocumentationSections.map((section, index) => <article key={section.id}><span>{String(index + 1).padStart(2, '0')}</span><strong>{section.label}</strong></article>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>04</span><div><h2>Код</h2><p>Публичный API разделяет table, header/filter row, cell families, selection, file content, summary и paginator.</p></div></div><ComponentCodeExample componentId="data-display.table" componentName="Table" sourceHref={SOURCE_URL} /></section>
  </main>;
}

function CellMatrix() {
  const states: TableCellState[] = ['default', 'active', 'selected', 'editing', 'error', 'disabled'];
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · CELLS</span><h1>Cells</h1><p>Read, Edit, Selection, Index, Drag, Summary и File Content собраны из утверждённых source families.</p></div><a href={tableFigmaSources.cells} target="_blank" rel="noreferrer">Cells в Figma ↗</a></header>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Read states</h2><p>Состояние принадлежит ячейке, а тип контента остаётся независимым.</p></div></div><div className="ds-table-cell-matrix">{states.map((state) => <article key={state}><code>{state}</code><Table density="comfortable" aria-label={`Read cell ${state}`}><TableBody><TableRow><TableCell state={state}>Текстовое значение</TableCell><TableCell state={state} align="end">12 450,00</TableCell><TableCell state={state}><Badge tone="blue">Статус</Badge></TableCell></TableRow></TableBody></Table></article>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Edit states</h2><p>Поля переиспользуют Fields. Table не создаёт собственные input, select или date control.</p></div></div><div className="ds-table-cell-matrix">{states.map((state) => <article key={state}><code>{state}</code><Table density="comfortable" aria-label={`Edit cell ${state}`}><TableBody><TableRow><TableCell state={state}><TextField className="ds-table-filter-field" label={`Текст ${state}`} size="s" defaultValue="Значение" disabled={state === 'disabled'} error={state === 'error' ? 'Ошибка' : undefined} /></TableCell><TableCell state={state}><Select className="ds-table-filter-field" label={`Статус ${state}`} size="s" options={statusOptions} defaultValue="approved" disabled={state === 'disabled'} /></TableCell><TableCell state={state}><DatePicker className="ds-table-filter-field" label={`Дата ${state}`} size="s" defaultValue="2026-07-15" disabled={state === 'disabled'} /></TableCell></TableRow></TableBody></Table></article>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>File icon swaps</h2><p>Девять нейтральных иконок экспортированы из точных Figma sources; stroke и цвет не галлюцинируются в stories.</p></div></div><div className="ds-table-file-grid">{tableFileTypes.map((type) => <article key={type}><TableFileIcon type={type} /><code>{type}</code></article>)}</div></section>
  </main>;
}

function HeaderMatrix() {
  const [sort, setSort] = useState<TableSortDirection>('none');
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · HEADERS</span><h1>Headers</h1><p>Column Header и Filter Header — два отдельных синхронных уровня. Selection и actions используют общие компоненты.</p></div><a href={tableFigmaSources.headers} target="_blank" rel="noreferrer">Header Source в Figma ↗</a></header>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Sort и context actions</h2><p>Сортировка циклично проходит none → ascending → descending; действия открываются отдельной кнопкой.</p></div></div><div className="ds-table-demo"><Table density="comfortable" aria-label="Состояния заголовка"><TableHead><TableRow><TableHeaderCell sort={sort} onSortChange={setSort} action={<HeaderAction column="Позиция" />}>Позиция</TableHeaderCell><TableHeaderCell sort="ascending">По возрастанию</TableHeaderCell><TableHeaderCell sort="descending">По убыванию</TableHeaderCell></TableRow><TableFilterRow><TableFilterCell><TextField className="ds-table-filter-field" label="Текстовый фильтр" size="s" placeholder="Найти" /></TableFilterCell><TableFilterCell><DatePicker className="ds-table-filter-field" label="Дата" size="s" /></TableFilterCell><TableFilterCell><DateRangePicker className="ds-table-filter-field" label="Период" size="m" /></TableFilterCell></TableFilterRow></TableHead></Table></div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Filter types</h2><p>Empty, Text, Number, Date, Period, Select и Boolean размещаются только во втором ряду.</p></div></div><div className="ds-table-filter-types">{['Empty', 'Text', 'Number', 'Date', 'Period', 'Select', 'Boolean'].map((type) => <article key={type}><code>{type}</code><span>{type === 'Empty' ? 'Без control' : 'Общий DS control'}</span></article>)}</div></section>
  </main>;
}

function PaginatorDocumentation() {
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · PAGINATOR</span><h1>Paginator</h1><p>Previous, Page, Ellipsis, Next и page-size control — отдельный source contract. Он не превращает Figma row counts в API.</p></div><a href={tableFigmaSources.paginator} target="_blank" rel="noreferrer">Paginator Source в Figma ↗</a></header><section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Интерактивный пример</h2><p>Disabled края, current page, ellipsis и выбор размера страницы доступны с клавиатуры.</p></div></div><TablePaginator page={page} pageCount={12} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} /></section></main>;
}

function Playground() {
  const [density, setDensity] = useState<TableDensity>('comfortable'); const [filters, setFilters] = useState(true);
  const description = useMemo(() => density === 'comfortable' ? '48px body · metadata visible' : '40px body · metadata retained', [density]);
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · PLAYGROUND</span><h1>Table Playground</h1><p>{description}</p></div></header><div className="ds-table-playground-controls"><Button size="s" variant={density === 'comfortable' ? 'primary' : 'secondary'} onClick={() => setDensity('comfortable')}>Comfortable</Button><Button size="s" variant={density === 'compact' ? 'primary' : 'secondary'} onClick={() => setDensity('compact')}>Compact</Button><Button size="s" variant="secondary" onClick={() => setFilters((value) => !value)}>{filters ? 'Скрыть фильтры' : 'Показать фильтры'}</Button></div><div className="ds-table-demo"><SourceTable density={density} filters={filters} /></div></main>;
}

const meta = { title: 'Components/Table', component: Table, args: { 'aria-label': 'Table example' }, parameters: { layout: 'fullscreen', controls: { disable: true } } } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = { name: 'Обзор', render: () => <OverviewPage />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); const table = canvas.getByRole('table', { name: 'Позиции закупки' }); await expect(within(table).getAllByRole('row')).toHaveLength(7); await expect(within(table).getByRole('row', { name: /Фильтры таблицы/i })).toBeVisible(); await expect(canvas.getByRole('navigation', { name: 'Пагинация таблицы' })).toBeVisible(); } };
export const Cells: Story = { name: 'Кирпичики/Cells', render: () => <CellMatrix /> };
export const Headers: Story = { name: 'Кирпичики/Headers', render: () => <HeaderMatrix />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); const sortButton = canvas.getByRole('button', { name: /Сортировать Позиция/ }); await userEvent.click(sortButton); await expect(canvas.getByRole('columnheader', { name: /Позиция/ })).toHaveAttribute('aria-sort', 'ascending'); } };
export const Columns: Story = { name: 'Кирпичики/Columns', render: () => <div className="ds-story-canvas"><SourceTable filters={false} /></div> };
export const Paginator: Story = { name: 'Кирпичики/Paginator', render: () => <PaginatorDocumentation />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); const next = canvas.getByRole('button', { name: 'Следующая страница' }); await userEvent.click(next); await expect(canvas.getByRole('button', { name: 'Страница 2' })).toHaveAttribute('aria-current', 'page'); } };
export const Density: Story = { name: 'Плотность', render: () => <div className="ds-story-canvas ds-table-density-pair"><section><h2>Comfortable · 48px</h2><SourceTable density="comfortable" filters={false} ariaLabel="Позиции закупки · Comfortable" /></section><section><h2>Compact · 40px</h2><SourceTable density="compact" filters={false} ariaLabel="Позиции закупки · Compact" /></section></div> };
export const TablePlayground: Story = { name: 'Playground', render: () => <Playground />, play: async ({ canvasElement }) => { const canvas = within(canvasElement); await userEvent.click(canvas.getByRole('button', { name: 'Compact' })); await expect(canvas.getByRole('table', { name: 'Позиции закупки' })).toHaveAttribute('data-density', 'compact'); } };
