import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Badge, Button, ContextMenuDivider, ContextMenuItem, DatePicker, DateRangePicker, Select,
  Table, TableBody, TableCell, TableContextAction, TableDragCell, TableDragHandle,
  TableFileCell, TableFileIcon, TableFilterCell, TableFilterRow, TableHeaderCell, TableHead,
  TableIndexCell, TablePaginator, TableRow, TableSelectionCell, TableSelectionHeader,
  TableSummaryCell, TextField, tableDensities, tableDocumentationSections, tableFileTypes,
  tableFigmaSources, tableSourceFamilies, tableStandaloneSources,
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

type TypographyContract = { family: string; size: string; weight: string; lineHeight: string; letterSpacing: string };
const tableTypography = {
  body: { family: 'Grtsk Peta', size: '14px', weight: '400', lineHeight: '20px', letterSpacing: '0.035px' },
  summary: { family: 'Grtsk Peta', size: '14px', weight: '500', lineHeight: '20px', letterSpacing: '0.035px' },
  header: { family: 'Grtsk Peta', size: '13px', weight: '500', lineHeight: '20px', letterSpacing: '0.065px' },
  paginator: { family: 'Grtsk Peta', size: '14px', weight: '400', lineHeight: '16px', letterSpacing: '0.035px' },
  badge: { family: 'Grtsk Peta', size: '12px', weight: '400', lineHeight: '16px', letterSpacing: '0.06px' },
  fileName: { family: 'Grtsk Peta', size: '12px', weight: '400', lineHeight: '18px', letterSpacing: '0.06px' },
  fileSize: { family: 'IBM Plex Mono', size: '11px', weight: '400', lineHeight: '14px', letterSpacing: 'normal' },
} as const satisfies Record<string, TypographyContract>;

async function expectTypography(element: HTMLElement, contract: TypographyContract) {
  const style = getComputedStyle(element);
  const actual = {
    family: style.fontFamily,
    size: style.fontSize,
    weight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
  await expect(actual.family).toContain(contract.family);
  await expect(actual.size).toBe(contract.size);
  await expect(actual.weight).toBe(contract.weight);
  await expect(actual.lineHeight).toBe(contract.lineHeight);
  await expect(actual.letterSpacing).toBe(contract.letterSpacing);
}

async function expectTypographyFor(root: Element, selector: string, contract: TypographyContract, minimum = 1) {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
  await expect(elements.length).toBeGreaterThanOrEqual(minimum);
  for (const element of elements) await expectTypography(element, contract);
}

async function expectPageSizeTypography(root: Element, minimum = 1) {
  await expectTypographyFor(root, '.cometal-table__page-size', tableTypography.body, minimum);
  const selects = Array.from(root.querySelectorAll<HTMLSelectElement>('.cometal-table__page-size select'));
  await expect(selects.length).toBeGreaterThanOrEqual(minimum);
  for (const select of selects) {
    const style = getComputedStyle(select);
    const actual = { family: style.fontFamily, size: style.fontSize, weight: style.fontWeight, letterSpacing: style.letterSpacing };
    await expect(actual.family).toContain(tableTypography.body.family);
    await expect(actual.size).toBe(tableTypography.body.size);
    await expect(actual.weight).toBe(tableTypography.body.weight);
    await expect(actual.letterSpacing).toBe(tableTypography.body.letterSpacing);
  }
}

const bodyValueSelector = 'tbody .cometal-table__cell:not(.cometal-table__selection-cell):not(.cometal-table__drag-cell):not(.cometal-table__summary-cell) .cometal-table__cell-value';
const headerValueSelector = '.cometal-table__header-cell .cometal-table__header-label';

async function expectTableSurfaceTypography(root: Element) {
  await expectTypographyFor(root, bodyValueSelector, tableTypography.body);
  await expectTypographyFor(root, headerValueSelector, tableTypography.header);
  const summaries = root.querySelectorAll<HTMLElement>('.cometal-table__summary-cell');
  for (const summary of summaries) await expectTypography(summary, tableTypography.summary);
  const badges = root.querySelectorAll<HTMLElement>('.cometal-table .cometal-badge');
  for (const badge of badges) await expectTypography(badge, tableTypography.badge);
  const fileNames = root.querySelectorAll<HTMLElement>('.cometal-table__file-name');
  for (const fileName of fileNames) await expectTypography(fileName, tableTypography.fileName);
  const fileSizes = root.querySelectorAll<HTMLElement>('.cometal-table__file-size');
  for (const fileSize of fileSizes) await expectTypography(fileSize, tableTypography.fileSize);
  const nestedValues = root.querySelectorAll<HTMLElement>('.cometal-table__filter-cell .cometal-field__input, .cometal-table__filter-cell .cometal-field__select-trigger, .cometal-table__cell .cometal-field__input, .cometal-table__cell .cometal-field__select-trigger');
  for (const nestedValue of nestedValues) await expectTypography(nestedValue, tableTypography.body);
}

function ColumnMenu() {
  return <><ContextMenuItem>Закрепить слева</ContextMenuItem><ContextMenuItem>Скрыть колонку</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Сбросить фильтр</ContextMenuItem></>;
}
function HeaderAction({ column, visualState }: { column: string; visualState?: 'hover' | 'open' }) {
  const stateClass = visualState === 'hover' ? 'ds-table-context-force-hover' : visualState === 'open' ? 'ds-table-context-force-open' : undefined;
  return <TableContextAction className={stateClass} defaultOpen={visualState === 'open'} label={`Действия колонки ${column}`} menuLabel={`Действия колонки ${column}`} menu={<ColumnMenu />} />;
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
          <TableHeaderCell action={<HeaderAction column="Наименование" />}>Наименование</TableHeaderCell>
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
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Состав источников</h2><p>Ровно 16 Figma Component Sets и 5 standalone sources. Каждое семейство показано в Cells, Headers, Columns и Paginator; variant count — evidence, а не React props.</p></div></div><div className="ds-table-source-grid">{tableSourceFamilies.map((family) => <article key={family.id}><code>{family.id}</code><h3>{family.label}</h3><p>{family.variants} variants</p><a href={family.source} target="_blank" rel="noreferrer">Figma source ↗</a></article>)}</div><h3 className="ds-table-standalone-title">5 standalone sources</h3><div className="ds-table-source-grid">{tableStandaloneSources.map((source) => <article key={source.id}><code>{source.id}</code><h3>{source.label}</h3><p>Standalone source</p><a href={source.source} target="_blank" rel="noreferrer">Figma source ↗</a></article>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>Разделы документации</h2><p>Cells, Headers, Columns и Paginator раскрываются самостоятельными stories; служебные primitives не теряются внутри одного большого стенда.</p></div></div><div className="ds-table-doc-index">{tableDocumentationSections.map((section, index) => <article key={section.id}><span>{String(index + 1).padStart(2, '0')}</span><strong>{section.label}</strong></article>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>04</span><div><h2>Код</h2><p>Публичный API разделяет table, header/filter row, cell families, selection, file content, summary и paginator.</p></div></div><ComponentCodeExample componentId="data-display.table" componentName="Table" sourceHref={SOURCE_URL} /></section>
  </main>;
}

const readStates = ['default', 'hover', 'active', 'selected', 'disabled'] as const satisfies readonly TableCellState[];
const readTypes = ['Text', 'Number', 'Link', 'Badge', 'Text + Badge', 'Number + Badge', 'Badge + Text', 'File'] as const;
const editStates = ['default', 'hover', 'active', 'editing', 'selected', 'error', 'disabled'] as const satisfies readonly TableCellState[];
const editTypes = ['Text', 'Number', 'Dropdown', 'File'] as const;
const selectionStates = ['default', 'hover', 'disabled', 'error'] as const satisfies readonly TableCellState[];
const indexStates = ['default', 'hover', 'active', 'selected', 'error', 'disabled'] as const satisfies readonly TableCellState[];
const dragStates = ['default', 'hover', 'dragging', 'disabled', 'active'] as const satisfies readonly TableCellState[];

function ReadValue({ type }: { type: (typeof readTypes)[number] }) {
  if (type === 'Number') return <>12 450,00</>;
  if (type === 'Link') return <a href="#read-cell-link" onClick={(event) => event.preventDefault()}>Открыть позицию</a>;
  if (type === 'Badge') return <Badge tone="blue">Статус</Badge>;
  if (type === 'Text + Badge') return <>Значение <Badge tone="blue">Статус</Badge></>;
  if (type === 'Number + Badge') return <>12 450 <Badge tone="green">ОК</Badge></>;
  if (type === 'Badge + Text') return <><Badge tone="yellow">Новый</Badge> Значение</>;
  if (type === 'File') return <span className="ds-table-matrix-file"><TableFileIcon type="pdf" /><span>Спецификация.pdf<small>130 КБ</small></span></span>;
  return <>Текстовое значение</>;
}

function ReadCellMatrix({ density }: { density: TableDensity }) {
  return <Table density={density} aria-label={`Read Cell · ${density}`} className="ds-table-contract-matrix"><TableHead><TableRow><TableHeaderCell>Type</TableHeaderCell>{readStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody>{readTypes.map((type) => <TableRow key={type}><TableHeaderCell scope="row">{type}</TableHeaderCell>{readStates.map((state) => <TableCell key={state} state={state} align={type.includes('Number') ? 'end' : 'start'}><ReadValue type={type} /></TableCell>)}</TableRow>)}</TableBody></Table>;
}

function EditValue({ type, state }: { type: (typeof editTypes)[number]; state: (typeof editStates)[number] }) {
  const disabled = state === 'disabled'; const error = state === 'error' ? 'Ошибка' : undefined;
  if (type === 'Number') return <TextField className="ds-table-filter-field" label={`Number ${state}`} size="s" defaultValue="12450" inputMode="numeric" disabled={disabled} error={error} />;
  if (type === 'Dropdown') return <Select className="ds-table-filter-field" label={`Dropdown ${state}`} size="s" options={statusOptions} defaultValue="approved" disabled={disabled} />;
  if (type === 'File') return <Button size="s" variant="secondary" disabled={disabled}>Выбрать файл</Button>;
  return <TextField className="ds-table-filter-field" label={`Text ${state}`} size="s" defaultValue="Значение" disabled={disabled} error={error} />;
}

function EditCellMatrix({ density }: { density: TableDensity }) {
  return <Table density={density} aria-label={`Edit Cell · ${density}`} className="ds-table-contract-matrix"><TableHead><TableRow><TableHeaderCell>Type</TableHeaderCell>{editStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody>{editTypes.map((type) => <TableRow key={type}><TableHeaderCell scope="row">{type}</TableHeaderCell>{editStates.map((state) => <TableCell key={state} state={state}><EditValue type={type} state={state} /></TableCell>)}</TableRow>)}</TableBody></Table>;
}

function UtilityCellMatrices({ density }: { density: TableDensity }) {
  return <div className="ds-table-utility-matrices">
    <article><h3>Selection Cell · 4 × 2</h3><Table density={density} aria-label={`Selection Cell · ${density}`}><TableHead><TableRow><TableHeaderCell>State</TableHeaderCell><TableHeaderCell>Unchecked</TableHeaderCell><TableHeaderCell>Checked</TableHeaderCell></TableRow></TableHead><TableBody>{selectionStates.map((state) => <TableRow key={state}><TableHeaderCell scope="row">{state}</TableHeaderCell><TableSelectionCell state={state} label={`${state} unchecked`} checked={false} /><TableSelectionCell state={state} label={`${state} checked`} checked disabled={state === 'disabled'} /></TableRow>)}</TableBody></Table></article>
    <article><h3>Index Cell · 6 states</h3><Table density={density} aria-label={`Index Cell · ${density}`}><TableHead><TableRow>{indexStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody><TableRow>{indexStates.map((state, index) => <TableIndexCell key={state} state={state}>{index + 1}</TableIndexCell>)}</TableRow></TableBody></Table></article>
    <article><h3>Drag Handle Cell · 5 states</h3><Table density={density} aria-label={`Drag Handle Cell · ${density}`}><TableHead><TableRow>{dragStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody><TableRow>{dragStates.map((state) => <TableDragCell key={state} state={state}><TableDragHandle rowLabel={state} disabled={state === 'disabled'} /></TableDragCell>)}</TableRow></TableBody></Table></article>
    <article><h3>Summary Cell · 3 types</h3><Table density={density} aria-label={`Summary Cell · ${density}`}><TableBody><TableRow><TableSummaryCell kind="empty" /><TableSummaryCell kind="label">Итого</TableSummaryCell><TableSummaryCell kind="value" align="end">12 450,00</TableSummaryCell></TableRow></TableBody></Table></article>
  </div>;
}

function CellMatrix() {
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · CELLS</span><h1>Cells</h1><p>Все 180 вариантов шести Component Sets показаны через точные оси Type, State, Value и Density. File Content остаётся отдельным standalone source.</p></div><a href={tableFigmaSources.cells} target="_blank" rel="noreferrer">Cells в Figma ↗</a></header>
    {tableDensities.map((density, densityIndex) => <section className="ds-component-section" key={density}><div className="ds-component-section__intro"><span>{String(densityIndex + 1).padStart(2, '0')}</span><div><h2>{density === 'comfortable' ? 'Comfortable · 48px' : 'Compact · 40px'}</h2><p>Read 8×5, Edit 4×7, Selection 4×2, Index 6, Drag 5 и Summary 3 — без скрытых осей.</p></div></div><div className="ds-table-matrix-stack"><h3>Read Cell · 8 types × 5 states</h3><ReadCellMatrix density={density} /><h3>Edit Cell · 4 types × 7 states</h3><EditCellMatrix density={density} /><UtilityCellMatrices density={density} /></div></section>)}
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>File Content · standalone</h2><p>Девять нейтральных иконок экспортированы из точных Figma sources; stroke и цвет не галлюцинируются в stories.</p></div></div><div className="ds-table-file-grid">{tableFileTypes.map((type) => <article key={type}><TableFileIcon type={type} /><code>{type}</code></article>)}</div></section>
  </main>;
}

function HeaderMatrix() {
  const [sort, setSort] = useState<TableSortDirection>('none');
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · HEADERS</span><h1>Headers</h1><p>Column Header и Filter Header — два отдельных синхронных уровня. Selection и actions используют общие компоненты.</p></div><a href={tableFigmaSources.headers} target="_blank" rel="noreferrer">Header Source в Figma ↗</a></header>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Sort и context actions</h2><p>Сортировка циклично проходит none → ascending → descending; действия открываются отдельной кнопкой.</p></div></div><div className="ds-table-demo"><Table density="comfortable" aria-label="Состояния заголовка"><TableHead><TableRow><TableHeaderCell sort={sort} onSortChange={setSort} action={<HeaderAction column="Позиция" />}>Позиция</TableHeaderCell><TableHeaderCell sort="ascending">По возрастанию</TableHeaderCell><TableHeaderCell sort="descending">По убыванию</TableHeaderCell></TableRow><TableFilterRow><TableFilterCell><TextField className="ds-table-filter-field" label="Текстовый фильтр" size="s" placeholder="Найти" /></TableFilterCell><TableFilterCell><DatePicker className="ds-table-filter-field" label="Дата" size="s" /></TableFilterCell><TableFilterCell><DateRangePicker className="ds-table-filter-field" label="Период" size="m" /></TableFilterCell></TableFilterRow></TableHead></Table></div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Column Header · 2 states × 3 sort</h2><p>Все шесть утверждённых комбинаций показаны принудительно, а не только через реальный hover.</p></div></div><Table density="comfortable" aria-label="Column Header matrix"><TableHead>{(['default', 'hover'] as const).map((state) => <TableRow key={state}><TableHeaderCell scope="row">{state}</TableHeaderCell>{(['none', 'ascending', 'descending'] as const).map((sortValue) => <TableHeaderCell key={sortValue} sort={sortValue} className={state === 'hover' ? 'ds-table-header-force-hover' : undefined}>{sortValue}</TableHeaderCell>)}</TableRow>)}</TableHead></Table></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>Context Action · 3 states</h2><p>Default, Hover и Open используют точный Table icon и общий Context Menu.</p></div></div><Table density="comfortable" aria-label="Context Action matrix"><TableHead><TableRow>{(['default', 'hover', 'open'] as const).map((state) => <TableHeaderCell key={state} action={<HeaderAction column={state} visualState={state === 'default' ? undefined : state} />}>{state}</TableHeaderCell>)}</TableRow></TableHead></Table></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>04</span><div><h2>Selection Header · 3×3×2</h2><p>Unchecked, Mixed и Checked в Default, Hover и Disabled; обе плотности имеют свою матрицу.</p></div></div><div className="ds-table-density-pair">{tableDensities.map((density) => <section key={density}><h3>{density}</h3><Table density={density} aria-label={`Selection Header ${density}`}><TableHead>{(['default', 'hover', 'disabled'] as const).map((state) => <TableRow key={state}><TableHeaderCell scope="row">{state}</TableHeaderCell><TableSelectionHeader className={state === 'hover' ? 'ds-table-header-force-hover' : undefined} selectedCount={0} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} unchecked`} /><TableSelectionHeader className={state === 'hover' ? 'ds-table-header-force-hover' : undefined} selectedCount={1} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} mixed`} /><TableSelectionHeader className={state === 'hover' ? 'ds-table-header-force-hover' : undefined} selectedCount={2} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} checked`} /></TableRow>)}</TableHead></Table></section>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>05</span><div><h2>Filter Row · 10 variants</h2><p>Empty, Text, Number, Date, Period, Select и Boolean в Default; Active существует только для Date, Period и Select.</p></div></div><div className="ds-table-filter-contract-grid">{(['Empty:default','Text:default','Number:default','Date:default','Period:default','Select:default','Boolean:default','Date:active','Period:active','Select:active'] as const).map((variant) => { const [type, state] = variant.split(':'); return <article key={variant} data-visual-state={state}><code>{type} · {state}</code><Table density="comfortable" aria-label={`Filter ${variant}`}><TableHead><TableFilterRow><TableFilterCell>{type === 'Empty' ? null : type === 'Date' ? <DatePicker className="ds-table-filter-field" label={variant} size="s" /> : type === 'Period' ? <DateRangePicker className="ds-table-filter-field" label={variant} size="m" /> : type === 'Select' ? <Select className="ds-table-filter-field" label={variant} size="s" options={statusOptions} defaultValue="all" /> : <TextField className="ds-table-filter-field" label={variant} size="s" inputMode={type === 'Number' ? 'numeric' : undefined} defaultValue={type === 'Boolean' ? 'Да' : undefined} />}</TableFilterCell></TableFilterRow></TableHead></Table></article>; })}</div></section>
  </main>;
}

function ColumnMatrix() {
  const rowCounts = [10, 15, 20, 30] as const;
  const families = ['Read Column', 'Edit Column', 'Index Column', 'Selection Column', 'Drag Handle Column'] as const;
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · COLUMNS</span><h1>Columns</h1><p>Пять самостоятельных Component Sets: Read, Edit, Index, Selection и Drag Handle. Каждая колонка синхронизирует header, filter, body и summary.</p></div><a href={tableFigmaSources.mainComponents} target="_blank" rel="noreferrer">Main Components в Figma ↗</a></header>
    {tableDensities.map((density, densityIndex) => <section className="ds-component-section" key={density}><div className="ds-component-section__intro"><span>{String(densityIndex + 1).padStart(2, '0')}</span><div><h2>{density === 'comfortable' ? 'Comfortable · 48px' : 'Compact · 40px'}</h2><p>Каждое семейство показано отдельной вертикальной композицией.</p></div></div><Table density={density} aria-label={`Column families · ${density}`}><TableHead><TableRow><TableHeaderCell>Read Column</TableHeaderCell><TableHeaderCell>Edit Column</TableHeaderCell><TableHeaderCell kind="index">Index</TableHeaderCell><TableSelectionHeader selectedCount={1} totalCount={4} onSelectionChange={() => undefined} /><TableHeaderCell kind="drag">Drag</TableHeaderCell></TableRow><TableFilterRow><TableFilterCell><TextField className="ds-table-filter-field" label="Read filter" size="s" placeholder="Contains" /></TableFilterCell><TableFilterCell><Select className="ds-table-filter-field" label="Edit filter" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell><TableFilterCell kind="index" /><TableFilterCell kind="selection" /><TableFilterCell kind="drag" /></TableFilterRow></TableHead><TableBody>{sourceRows.map((row, index) => <TableRow key={row.id}><TableCell>{row.position}</TableCell><TableCell><TextField className="ds-table-filter-field" label={`Edit ${row.id}`} size="s" defaultValue={row.name} /></TableCell><TableIndexCell>{index + 1}</TableIndexCell><TableSelectionCell label={`Select ${row.id}`} checked={index === 0} /><TableDragCell><TableDragHandle rowLabel={row.position} /></TableDragCell></TableRow>)}<TableRow><TableSummaryCell kind="label">Read summary</TableSummaryCell><TableSummaryCell kind="value">Edit summary</TableSummaryCell><TableSummaryCell kind="empty" /><TableSummaryCell kind="value">1 / 4</TableSummaryCell><TableSummaryCell kind="empty" /></TableRow></TableBody></Table></section>)}
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>Rows evidence · 5×4×2</h2><p>10, 15, 20 и 30 строк — ось Figma documentation, а не runtime prop: Table не пересобирает контент при смене плотности.</p></div></div><div className="ds-table-column-contract-grid">{families.map((family) => <article key={family}><h3>{family}</h3>{tableDensities.map((density) => <div key={density}><code>{density}</code><div className="ds-table-row-counts">{rowCounts.map((count) => <span key={count}>{count} rows</span>)}</div></div>)}</article>)}</div></section>
  </main>;
}

function PaginatorDocumentation() {
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · PAGINATOR</span><h1>Paginator</h1><p>Paginator Control — 14 вариантов Content, Direction и State. Paginator — отдельный standalone source; Figma row counts не становятся API.</p></div><a href={tableFigmaSources.paginator} target="_blank" rel="noreferrer">Paginator Source в Figma ↗</a></header><section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Интерактивный пример</h2><p>Disabled края, current page, ellipsis и выбор размера страницы доступны с клавиатуры.</p></div></div><TablePaginator aria-label="Интерактивная пагинация таблицы" page={page} pageCount={12} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} /></section><section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Control states</h2><p>Три реальные композиции показывают Previous/Next Default и Disabled, Page Default/Current, Ellipsis и page-size.</p></div></div><div className="ds-table-paginator-contract"><article><code>first page</code><TablePaginator aria-label="Пагинация на первой странице" page={1} pageCount={12} onPageChange={() => undefined} pageSize={10} /></article><article><code>middle · ellipsis both sides</code><TablePaginator aria-label="Пагинация в середине диапазона" page={6} pageCount={12} onPageChange={() => undefined} pageSize={15} /></article><article><code>last page</code><TablePaginator aria-label="Пагинация на последней странице" page={12} pageCount={12} onPageChange={() => undefined} pageSize={30} /></article></div></section></main>;
}

function Playground() {
  const [density, setDensity] = useState<TableDensity>('comfortable'); const [filters, setFilters] = useState(true);
  const description = useMemo(() => density === 'comfortable' ? '48px body · metadata visible' : '40px body · metadata retained', [density]);
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · PLAYGROUND</span><h1>Table Playground</h1><p>{description}</p></div></header><div className="ds-table-playground-controls"><Button size="s" variant={density === 'comfortable' ? 'primary' : 'secondary'} onClick={() => setDensity('comfortable')}>Comfortable</Button><Button size="s" variant={density === 'compact' ? 'primary' : 'secondary'} onClick={() => setDensity('compact')}>Compact</Button><Button size="s" variant="secondary" onClick={() => setFilters((value) => !value)}>{filters ? 'Скрыть фильтры' : 'Показать фильтры'}</Button></div><div className="ds-table-demo"><SourceTable density={density} filters={filters} /></div></main>;
}

const meta = { title: 'Components/Table', component: Table, args: { 'aria-label': 'Table example' }, parameters: { layout: 'fullscreen', controls: { disable: true } } } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  name: 'Обзор',
  render: () => <OverviewPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole('table', { name: 'Позиции закупки' });
    await expect(within(table).getAllByRole('row')).toHaveLength(7);
    await expect(within(table).getByRole('row', { name: /Фильтры таблицы/i })).toBeVisible();
    await expect(canvas.getByRole('navigation', { name: 'Пагинация таблицы' })).toBeVisible();

    const contextAction = canvas.getByRole('button', { name: 'Действия колонки Позиция' });
    const contextIcon = contextAction.querySelector('svg');
    const contextGlyphs = Array.from(contextAction.querySelectorAll('path'));
    const dragIcon = canvas.getByRole('button', { name: 'Переместить строку 1' }).querySelector('svg');
    await expect(contextAction.getBoundingClientRect().width).toBe(24);
    await expect(contextAction.getBoundingClientRect().height).toBe(24);
    await expect(contextIcon?.getBoundingClientRect().width).toBe(16);
    await expect(contextIcon?.getBoundingClientRect().height).toBe(16);
    const firstDot = contextGlyphs[0]?.getBoundingClientRect();
    const lastDot = contextGlyphs[2]?.getBoundingClientRect();
    await expect(Math.round(((lastDot?.right ?? 0) - (firstDot?.left ?? 0)) * 1000) / 1000).toBe(12.667);
    await expect(Math.round((firstDot?.height ?? 0) * 1000) / 1000).toBe(3.333);
    await expect(dragIcon).toHaveAttribute('data-cometal-table-icon', 'drag-handle');
    await expect(dragIcon?.querySelector('path')).toHaveAttribute('d', 'M6 9H18M6 15H18');
    await expect(canvasElement.querySelectorAll('[data-cometal-icon]').length).toBeGreaterThan(0);
    await expect(canvasElement.querySelectorAll('.cometal-selection').length).toBeGreaterThan(0);
    await expectTableSurfaceTypography(canvasElement);
    await expectTypographyFor(canvasElement, '.cometal-table__page-control, .cometal-table__page-ellipsis', tableTypography.paginator);
    await expectPageSizeTypography(canvasElement);
  },
};
export const Cells: Story = {
  name: 'Кирпичики/Cells',
  render: () => <CellMatrix />,
  play: async ({ canvasElement }) => {
    await expectTypographyFor(canvasElement, "table[aria-label^='Read Cell'] tbody .cometal-table__cell-value", tableTypography.body, 80);
    await expectTypographyFor(canvasElement, "table[aria-label^='Edit Cell'] tbody .cometal-table__cell-value", tableTypography.body, 56);
    await expectTypographyFor(canvasElement, "table[aria-label^='Index Cell'] tbody .cometal-table__cell-value", tableTypography.body, 12);
    await expectTypographyFor(canvasElement, "table[aria-label^='Summary Cell'] .cometal-table__summary-cell", tableTypography.summary, 6);
    await expectTypographyFor(canvasElement, '.cometal-table__header-cell .cometal-table__header-label', tableTypography.header);
    await expectTypographyFor(canvasElement, "table[aria-label^='Edit Cell'] .cometal-field__input, table[aria-label^='Edit Cell'] .cometal-field__select-trigger", tableTypography.body, 42);
    await expectTypographyFor(canvasElement, "table[aria-label^='Read Cell'] .cometal-badge", tableTypography.badge, 30);
    const hiddenSelectionLabels = Array.from(canvasElement.querySelectorAll<HTMLElement>("table[aria-label^='Selection Cell'] .cometal-selection__content"));
    await expect(hiddenSelectionLabels).toHaveLength(16);
    for (const label of hiddenSelectionLabels) {
      const style = getComputedStyle(label);
      await expect(style.position).toBe('absolute');
      await expect(style.width).toBe('1px');
      await expect(style.height).toBe('1px');
    }
    const dragHandles = Array.from(canvasElement.querySelectorAll<HTMLButtonElement>("table[aria-label^='Drag Handle Cell'] .cometal-table__drag-handle"));
    await expect(dragHandles).toHaveLength(10);
    for (const handle of dragHandles) {
      await expect(handle).toHaveAttribute('aria-label');
      await expect(handle.textContent).toBe('');
    }
  },
};
export const Headers: Story = {
  name: 'Кирпичики/Headers',
  render: () => <HeaderMatrix />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sortButton = canvas.getByRole('button', { name: /Сортировать Позиция/ });
    await userEvent.click(sortButton);
    await expect(canvas.getByRole('columnheader', { name: /Позиция/ })).toHaveAttribute('aria-sort', 'ascending');

    const contextAction = canvas.getByRole('button', { name: 'Действия колонки Позиция' });
    await expect(contextAction).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(contextAction);
    await expect(contextAction).toHaveAttribute('aria-expanded', 'true');
    const documentCanvas = within(canvasElement.ownerDocument.body);
    await expect(documentCanvas.getByRole('menu', { name: 'Действия колонки Позиция' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(contextAction).toHaveAttribute('aria-expanded', 'false');
    await expect(contextAction).toHaveFocus();
    await expectTypographyFor(canvasElement, headerValueSelector, tableTypography.header);
    await expectTypographyFor(canvasElement, '.cometal-table__filter-cell .cometal-field__input, .cometal-table__filter-cell .cometal-field__select-trigger', tableTypography.body);
  },
};
export const Columns: Story = {
  name: 'Кирпичики/Columns',
  render: () => <ColumnMatrix />,
  play: async ({ canvasElement }) => {
    await expectTableSurfaceTypography(canvasElement);
    await expectTypographyFor(canvasElement, "table[aria-label^='Column families'] .cometal-table__index-cell .cometal-table__cell-value", tableTypography.body, 8);
    await expectTypographyFor(canvasElement, "table[aria-label^='Column families'] .cometal-table__summary-cell", tableTypography.summary, 10);
  },
};
export const Paginator: Story = {
  name: 'Кирпичики/Paginator',
  render: () => <PaginatorDocumentation />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Интерактивная пагинация таблицы' });
    const paginator = within(navigation);
    const previous = paginator.getByRole('button', { name: 'Предыдущая страница' });
    const previousIcon = previous.querySelector('svg');
    const controls = navigation.querySelector('.cometal-table__paginator-controls');
    await expect(previous.getBoundingClientRect().width).toBe(40);
    await expect(previous.getBoundingClientRect().height).toBe(40);
    await expect(previousIcon?.getBoundingClientRect().width).toBe(24);
    await expect(previousIcon?.getBoundingClientRect().height).toBe(24);
    await expect(controls ? getComputedStyle(controls).gap : '').toBe('4px');
    await expectTypographyFor(canvasElement, '.cometal-table__page-control, .cometal-table__page-ellipsis', tableTypography.paginator);
    await expectPageSizeTypography(canvasElement, 4);
    await userEvent.click(paginator.getByRole('button', { name: 'Следующая страница' }));
    await expect(paginator.getByRole('button', { name: 'Страница 2' })).toHaveAttribute('aria-current', 'page');
  },
};
export const Density: Story = {
  name: 'Плотность',
  render: () => <div className="ds-story-canvas ds-table-density-pair"><section><h2>Comfortable · 48px</h2><SourceTable density="comfortable" filters={false} ariaLabel="Позиции закупки · Comfortable" /></section><section><h2>Compact · 40px</h2><SourceTable density="compact" filters={false} ariaLabel="Позиции закупки · Compact" /></section></div>,
  play: async ({ canvasElement }) => {
    const cells = Array.from(canvasElement.querySelectorAll<HTMLElement>('tbody .cometal-table__selection-cell'));
    const firstByDensity = [cells[0], cells[4]];
    for (const [index, cell] of firstByDensity.entries()) {
      const expected = index === 0 ? 48 : 40;
      const control = cell.querySelector<HTMLElement>('.cometal-selection__control');
      const content = cell.querySelector<HTMLElement>('.cometal-table__cell-content');
      const cellRect = cell.getBoundingClientRect();
      const controlRect = control?.getBoundingClientRect();
      const contentRect = content?.getBoundingClientRect();
      await expect(cellRect.width).toBe(expected);
      await expect(cellRect.height).toBe(expected);
      await expect(controlRect?.width).toBe(20);
      await expect(controlRect?.height).toBe(20);
      await expect(Math.round((((controlRect?.left ?? 0) + (controlRect?.width ?? 0) / 2) - ((contentRect?.left ?? 0) + (contentRect?.width ?? 0) / 2)) * 100) / 100).toBe(0);
      await expect(Math.round((((controlRect?.top ?? 0) + (controlRect?.height ?? 0) / 2) - ((contentRect?.top ?? 0) + (contentRect?.height ?? 0) / 2)) * 100) / 100).toBe(0);
    }
    await expectTableSurfaceTypography(canvasElement);
  },
};
export const TablePlayground: Story = {
  name: 'Playground',
  render: () => <Playground />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Compact' }));
    await expect(canvas.getByRole('table', { name: 'Позиции закупки' })).toHaveAttribute('data-density', 'compact');
    await expectTableSurfaceTypography(canvasElement);
  },
};
