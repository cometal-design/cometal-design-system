import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import {
  Badge, Button, ContextMenuDivider, ContextMenuItem, DatePicker, DateRangePicker, Select,
  Table, TableBody, TableCell, TableColumnPinAction, TableContextAction, TableDragCell, TableDragHandle,
  TableFileCell, TableFileIcon, TableFilterAction, TableFilterCell, TableFilterRow, TableHeaderCell, TableHead,
  TableIndexCell, TablePaginator, TableRow, TableSelectionCell, TableSelectionHeader,
  TableSummaryCell, TextField, tableDensities, tableDocumentationSections, tableFileTypes,
  tableFigmaSources, tableSourceFamilies, tableStandaloneSources, reorderTableRows,
} from '@cometal/react';
import type { TableCellState, TableDensity, TableFileType, TableMode, TableSortDirection } from '@cometal/react';
import { definition as arrowUpSmallDefinition } from '@cometal/react/icons/outline/arrows/arrow-up-sm';
import { definition as arrowDownSmallDefinition } from '@cometal/react/icons/outline/arrows/down-arrow-sm';
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

type SortIconDefinition = {
  body: string;
  canonicalName: string;
  componentKey: string;
  nodeId: string;
};

function definitionPathData(body: string) {
  return Array.from(body.matchAll(/<path d="([^"]+)"/g), (match) => match[1]);
}

async function expectSortIconContract(button: HTMLButtonElement, definition: SortIconDefinition) {
  const icon = button.querySelector<SVGSVGElement>('.cometal-table__sort-icon');
  if (!icon) throw new Error(`Expected ${definition.canonicalName} sort icon`);
  const paths = Array.from(icon.querySelectorAll<SVGPathElement>('path'));
  await expect(icon.getBoundingClientRect().width).toBe(16);
  await expect(icon.getBoundingClientRect().height).toBe(16);
  await expect(icon).toHaveAttribute('data-cometal-icon-library', 'outline');
  await expect(icon).toHaveAttribute('data-cometal-icon-paint', 'currentColor');
  await expect(icon).toHaveAttribute('data-cometal-icon-stroke-scaling', 'marked-elements');
  await expect(getComputedStyle(icon).transform).toBe('none');
  await expect(icon.querySelector('[transform]')).toBeNull();
  await expect(paths.map((path) => path.getAttribute('d'))).toEqual(definitionPathData(definition.body));
  await expect(paths).toHaveLength(1);
  await expect(paths[0]).toHaveAttribute('stroke', 'currentColor');
  await expect(paths[0]).toHaveAttribute('stroke-width', '1.4');
  await expect(paths[0]).toHaveAttribute('data-cometal-stroke-scale', '');
  await expect(getComputedStyle(paths[0]!).vectorEffect).toBe('non-scaling-stroke');
}

async function expectFocusContract(element: HTMLElement) {
  element.focus();
  const style = getComputedStyle(element);
  await expect(style.outlineStyle).toBe('solid');
  await expect(style.outlineWidth).toBe('2px');
  await expect(style.outlineOffset).toBe('4px');
}

async function expectTypographyFor(root: Element, selector: string, contract: TypographyContract, minimum = 1) {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
  await expect(elements.length).toBeGreaterThanOrEqual(minimum);
  for (const element of elements) await expectTypography(element, contract);
}

async function expectPageSizeTypography(root: Element, minimum = 1) {
  await expectTypographyFor(root, '.cometal-table__page-size', tableTypography.body, minimum);
  await expectTypographyFor(root, '.cometal-table__page-size .cometal-field__select-trigger', tableTypography.body, minimum);
  const nativeSelects = Array.from(root.querySelectorAll<HTMLSelectElement>('.cometal-table__page-size .cometal-field__native-select'));
  await expect(nativeSelects.length).toBeGreaterThanOrEqual(minimum);
  for (const select of nativeSelects) await expect(select).toHaveAttribute('aria-hidden', 'true');
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

async function expectM1TableGeometry(table: HTMLTableElement, expectedFloor: 40 | 48, frameColor: string, frameSurface: string) {
  const shell = table.closest<HTMLElement>('.cometal-table-scroll-shell')!;
  const shellStyle = getComputedStyle(shell);
  await expect(shellStyle.boxSizing).toBe('border-box');
  await expect([shellStyle.borderTopWidth, shellStyle.borderRightWidth, shellStyle.borderBottomWidth, shellStyle.borderLeftWidth]).toEqual(['1px', '1px', '1px', '1px']);
  await expect(shellStyle.borderTopStyle).toBe('solid');
  await expect(shellStyle.borderTopColor).toBe(frameColor);
  await expect(shellStyle.borderRadius).toBe('8px');
  await expect(shellStyle.backgroundColor).toBe(frameSurface);
  await expect(shellStyle.overflow).toBe('hidden');

  const header = table.querySelector<HTMLElement>('thead tr:first-child')!;
  const filter = table.querySelector<HTMLElement>('.cometal-table__filter-row')!;
  const body = table.querySelector<HTMLElement>('tbody tr[data-row-id]')!;
  const summary = table.querySelector<HTMLElement>('tbody tr:last-child')!;
  const utility = body.querySelector<HTMLElement>('.cometal-table__selection-cell')!;
  const summaryUtility = summary.querySelector<HTMLElement>('.cometal-table__selection-cell')!;
  const filterControl = filter.querySelector<HTMLElement>('.cometal-field__control')!;
  await expect(header.getBoundingClientRect().height).toBe(expectedFloor);
  await expect(filter.getBoundingClientRect().height).toBe(expectedFloor);
  await expect(body.getBoundingClientRect().height).toBe(expectedFloor);
  await expect(summary.getBoundingClientRect().height + Number.parseFloat(shellStyle.borderBottomWidth)).toBe(expectedFloor);
  await expect(utility.getBoundingClientRect().width).toBe(expectedFloor);
  await expect(utility.getBoundingClientRect().height).toBe(expectedFloor);
  await expect(summaryUtility.getBoundingClientRect().width).toBe(expectedFloor);
  await expect(summaryUtility.getBoundingClientRect().height + Number.parseFloat(shellStyle.borderBottomWidth)).toBe(expectedFloor);
  await expect(filterControl.getBoundingClientRect().height).toBe(32);

  const firstHeader = table.querySelector<HTMLElement>('thead tr:first-child > :first-child')!;
  const lastHeader = table.querySelector<HTMLElement>('thead tr:first-child > :last-child')!;
  const lastBody = table.querySelector<HTMLElement>('tbody tr:last-child > :last-child')!;
  await expect(getComputedStyle(firstHeader).borderTopWidth).toBe('0px');
  await expect(getComputedStyle(firstHeader).borderLeftWidth).toBe('0px');
  await expect(getComputedStyle(lastHeader).borderRightWidth).toBe('0px');
  await expect(getComputedStyle(lastBody).borderRightWidth).toBe('0px');
  await expect(getComputedStyle(lastBody).borderBottomWidth).toBe('0px');
}

function ColumnMenu({ columnId }: { columnId: string }) {
  return <><TableColumnPinAction columnId={columnId} /><ContextMenuItem>Скрыть колонку</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Сбросить фильтр</ContextMenuItem></>;
}
function HeaderAction({ columnId, column }: { columnId?: string; column: string }) {
  return <TableContextAction label={`Действия колонки ${column}`} menuLabel={`Действия колонки ${column}`} menu={<ColumnMenu columnId={columnId ?? column.toLowerCase()} />} />;
}

function HeaderContractTable({ density }: { density: TableDensity }) {
  const [sort, setSort] = useState<TableSortDirection>('none');
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  return <Table
    density={density}
    aria-label={`Интерактивный контракт заголовка · ${density}`}
    columnWidths={columnWidths}
    onColumnWidthsChange={setColumnWidths}
  >
    <TableHead><TableRow>
      <TableHeaderCell columnId="position" sort={sort} onSortChange={setSort} action={<HeaderAction columnId="position" column={`Позиция ${density}`} />}>Позиция</TableHeaderCell>
      <TableHeaderCell columnId="status" action={<HeaderAction columnId="status" column={`Статус ${density}`} />}>Статус</TableHeaderCell>
    </TableRow></TableHead>
  </Table>;
}

const sourceColumnIds = { drag: 'drag', index: 'index', selection: 'selection', position: 'position', name: 'name', quantity: 'quantity', status: 'status', file: 'file' } as const;

const textFilterOperators = ['Содержит', 'Не содержит', 'Начинается с', 'Пусто'] as const;
const numberFilterOperators = ['Равно', 'Не равно', 'Больше', 'Меньше'] as const;
const selectFilterOperators = ['Равно', 'Не равно', 'Выбрано', 'Не выбрано'] as const;

function FilterOperatorAction({ column, value, options, onChange }: { column: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <TableFilterAction label={column} menu={options.map((option) => <ContextMenuItem key={option} selected={option === value} onClick={() => onChange(option)}>{option}</ContextMenuItem>)} />;
}

function SourceTable({ density = 'comfortable', filters = true, ariaLabel = 'Позиции закупки', mode = 'read' }: { density?: TableDensity; filters?: boolean; ariaLabel?: string; mode?: TableMode }) {
  const [orderedRows, setOrderedRows] = useState(() => [...sourceRows]);
  const [selected, setSelected] = useState<number[]>([2]);
  const [sort, setSort] = useState<TableSortDirection>('ascending');
  const [editingCell, setEditingCell] = useState<number | null>(null);
  const [pinnedColumnIds, setPinnedColumnIds] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [operators, setOperators] = useState({ position: 'Содержит', name: 'Содержит', quantity: 'Равно', status: 'Равно', file: 'Содержит' });
  const toggleAll = (checked: boolean) => setSelected(checked ? orderedRows.map((row) => row.id) : []);
  return (
    <Table density={density} mode={mode} aria-label={ariaLabel} className="ds-table-source-example" pinnedColumnIds={pinnedColumnIds} onPinnedColumnIdsChange={setPinnedColumnIds} columnWidths={columnWidths} onColumnWidthsChange={setColumnWidths} onRowReorder={mode === 'edit' ? (event) => setOrderedRows((current) => reorderTableRows(current, event, (row) => String(row.id))) : undefined} rowContextMenu={(rowId) => <><ContextMenuItem onClick={() => setSelected((current) => current.includes(Number(rowId)) ? current.filter((id) => id !== Number(rowId)) : [...current, Number(rowId)])}>Переключить выбор строки</ContextMenuItem><ContextMenuItem disabled>Открыть позицию</ContextMenuItem>{mode === 'edit' ? <><ContextMenuDivider /><ContextMenuItem tone="danger" onClick={() => { setOrderedRows((current) => current.filter((row) => row.id !== Number(rowId))); setSelected((current) => current.filter((id) => id !== Number(rowId))); }}>Удалить строку</ContextMenuItem></> : null}</>}>
      <TableHead>
        <TableRow>
          <TableHeaderCell columnId={sourceColumnIds.drag} kind="drag"><span className="sr-only">Перемещение</span></TableHeaderCell>
          <TableHeaderCell columnId={sourceColumnIds.index} kind="index">№</TableHeaderCell>
          <TableSelectionHeader columnId={sourceColumnIds.selection} selectedCount={selected.length} totalCount={orderedRows.length} onSelectionChange={toggleAll} />
          <TableHeaderCell columnId={sourceColumnIds.position} style={{ width: 156 }} sort={sort} onSortChange={setSort} action={<HeaderAction columnId={sourceColumnIds.position} column="Позиция" />}>Позиция</TableHeaderCell>
          <TableHeaderCell columnId={sourceColumnIds.name} action={<HeaderAction columnId={sourceColumnIds.name} column="Наименование" />}>Наименование</TableHeaderCell>
          <TableHeaderCell columnId={sourceColumnIds.quantity} style={{ width: 136 }} action={<HeaderAction columnId={sourceColumnIds.quantity} column="Количество" />}>Количество</TableHeaderCell>
          <TableHeaderCell columnId={sourceColumnIds.status} style={{ width: 160 }} action={<HeaderAction columnId={sourceColumnIds.status} column="Статус" />}>Статус</TableHeaderCell>
          <TableHeaderCell columnId={sourceColumnIds.file} style={{ width: 220 }} action={<HeaderAction columnId={sourceColumnIds.file} column="Файл" />}>Файл</TableHeaderCell>
        </TableRow>
        {filters ? <TableFilterRow aria-label="Фильтры таблицы">
          <TableFilterCell columnId={sourceColumnIds.drag} kind="drag" /><TableFilterCell columnId={sourceColumnIds.index} kind="index" /><TableFilterCell columnId={sourceColumnIds.selection} kind="selection" />
          <TableFilterCell columnId={sourceColumnIds.position} action={<FilterOperatorAction column="Позиция" value={operators.position} options={textFilterOperators} onChange={(value) => setOperators((current) => ({ ...current, position: value }))} />}><TextField label="Фильтр по позиции" size="s" placeholder={operators.position} /></TableFilterCell>
          <TableFilterCell columnId={sourceColumnIds.name} action={<FilterOperatorAction column="Наименование" value={operators.name} options={textFilterOperators} onChange={(value) => setOperators((current) => ({ ...current, name: value }))} />}><TextField label="Фильтр по наименованию" size="s" placeholder={operators.name} /></TableFilterCell>
          <TableFilterCell columnId={sourceColumnIds.quantity} action={<FilterOperatorAction column="Количество" value={operators.quantity} options={numberFilterOperators} onChange={(value) => setOperators((current) => ({ ...current, quantity: value }))} />}><TextField label="Фильтр по количеству" size="s" inputMode="numeric" placeholder={operators.quantity} /></TableFilterCell>
          <TableFilterCell columnId={sourceColumnIds.status} action={<FilterOperatorAction column="Статус" value={operators.status} options={selectFilterOperators} onChange={(value) => setOperators((current) => ({ ...current, status: value }))} />}><Select label="Фильтр по статусу" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell>
          <TableFilterCell columnId={sourceColumnIds.file} action={<FilterOperatorAction column="Файл" value={operators.file} options={textFilterOperators} onChange={(value) => setOperators((current) => ({ ...current, file: value }))} />}><TextField label="Фильтр по файлу" size="s" placeholder={operators.file} /></TableFilterCell>
        </TableFilterRow> : null}
      </TableHead>
      <TableBody>
        {orderedRows.map((row, index) => <TableRow key={row.id} rowId={String(row.id)} reorderId={mode === 'edit' ? String(row.id) : undefined} selected={selected.includes(row.id)}>
          <TableDragCell columnId={sourceColumnIds.drag}><TableDragHandle rowLabel={row.position} /></TableDragCell>
          <TableIndexCell columnId={sourceColumnIds.index}>{index + 1}</TableIndexCell>
          <TableSelectionCell columnId={sourceColumnIds.selection} label={`Выбрать строку ${row.id}`} checked={selected.includes(row.id)} onCheckedChange={(checked) => setSelected((current) => checked ? [...current, row.id] : current.filter((id) => id !== row.id))} />
          <TableCell columnId={sourceColumnIds.position} editable state={editingCell === row.id ? 'editing' : 'default'} aria-label={editingCell === row.id ? `Редактирование позиции ${row.position}` : undefined} onEditStart={() => setEditingCell(row.id)} onBlur={() => setEditingCell(null)} onKeyDown={(event) => { if (editingCell !== row.id) return; if (event.key === 'Enter') { event.preventDefault(); event.currentTarget.blur(); } if (event.key === 'Escape') { event.preventDefault(); setEditingCell(null); event.currentTarget.blur(); } }}>{row.position}</TableCell>
          <TableCell columnId={sourceColumnIds.name} state={row.id === 3 ? 'error' : 'default'}>{row.name}</TableCell>
          <TableCell columnId={sourceColumnIds.quantity} align="end">{row.quantity}</TableCell><TableCell columnId={sourceColumnIds.status}><Badge tone={row.tone}>{row.status}</Badge></TableCell>
          <TableFileCell columnId={sourceColumnIds.file} fileName={row.file} fileSize={row.size} fileType={row.type} />
        </TableRow>)}
        <TableRow>{mode === 'edit' ? <TableSummaryCell columnId={sourceColumnIds.drag} className="cometal-table__drag-cell" kind="empty" /> : null}<TableSummaryCell columnId={sourceColumnIds.index} className="cometal-table__index-cell" kind="empty" /><TableSummaryCell columnId={sourceColumnIds.selection} className="cometal-table__selection-cell" kind="empty" /><TableSummaryCell columnId={sourceColumnIds.position} kind="empty" /><TableSummaryCell columnId={sourceColumnIds.name} kind="label">Итого</TableSummaryCell><TableSummaryCell columnId={sourceColumnIds.quantity} kind="value" align="end">504</TableSummaryCell><TableSummaryCell columnId={sourceColumnIds.status} kind="value">4 позиции</TableSummaryCell><TableSummaryCell columnId={sourceColumnIds.file} kind="value">4 файла</TableSummaryCell></TableRow>
      </TableBody>
    </Table>
  );
}

type TableSectionComposition = {
  label: string;
  head: boolean;
  filters: boolean;
  body: 'absent' | 'empty' | 'populated';
  summary: boolean;
};

const tableSectionCompositions = [
  { label: 'Head only · filters off', head: true, filters: false, body: 'absent', summary: false },
  { label: 'Head only · filters on', head: true, filters: true, body: 'absent', summary: false },
  { label: 'Body only', head: false, filters: false, body: 'populated', summary: false },
  { label: 'Body only · empty', head: false, filters: false, body: 'empty', summary: false },
  { label: 'Head + empty body · filters off', head: true, filters: false, body: 'empty', summary: false },
  { label: 'Head + empty body · filters on', head: true, filters: true, body: 'empty', summary: false },
  { label: 'Populated body · filters off · no summary', head: true, filters: false, body: 'populated', summary: false },
  { label: 'Populated body · filters on · no summary', head: true, filters: true, body: 'populated', summary: false },
  { label: 'Populated body · filters off · summary', head: true, filters: false, body: 'populated', summary: true },
  { label: 'Populated body · filters on · summary', head: true, filters: true, body: 'populated', summary: true },
] as const satisfies readonly TableSectionComposition[];

function TableSectionCompositionFixture({ composition }: { composition: TableSectionComposition }) {
  return <Table density="comfortable" aria-label={composition.label}>
    {composition.head ? <TableHead>
      <TableRow data-composition-row="header"><TableHeaderCell>Позиция</TableHeaderCell><TableHeaderCell>Наименование</TableHeaderCell></TableRow>
      {composition.filters ? <TableFilterRow data-composition-row="filter"><TableFilterCell><TextField label="Фильтр по позиции" size="s" /></TableFilterCell><TableFilterCell><TextField label="Фильтр по наименованию" size="s" /></TableFilterCell></TableFilterRow> : null}
    </TableHead> : null}
    {composition.body === 'absent' ? null : <TableBody>
      {composition.body === 'populated' ? <TableRow data-composition-row="body"><TableCell>POS-00127</TableCell><TableCell>Лист стальной</TableCell></TableRow> : null}
      {composition.summary ? <TableRow data-composition-row="summary"><TableSummaryCell kind="label">Итого</TableSummaryCell><TableSummaryCell kind="value">1 позиция</TableSummaryCell></TableRow> : null}
    </TableBody>}
  </Table>;
}

async function expectCanonicalSectionEdges(table: HTMLTableElement) {
  const shell = table.closest<HTMLElement>('.cometal-table-scroll-shell')!;
  const shellStyle = getComputedStyle(shell);
  await expect([shellStyle.borderTopWidth, shellStyle.borderRightWidth, shellStyle.borderBottomWidth, shellStyle.borderLeftWidth]).toEqual(['1px', '1px', '1px', '1px']);
  const visibleRows = Array.from(table.rows).filter((row) => row.cells.length > 0);
  for (const [rowIndex, row] of visibleRows.entries()) {
    const cells = Array.from(row.cells);
    await expect(cells.length).toBe(2);
    for (const cell of cells) {
      await expect(getComputedStyle(cell).borderBottomWidth).toBe(rowIndex === visibleRows.length - 1 ? '0px' : '1px');
    }
    await expect(getComputedStyle(cells[0]!).borderRightWidth).toBe('1px');
    await expect(getComputedStyle(cells[1]!).borderRightWidth).toBe('0px');
  }
}

function OverviewPage() {
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  return <main className="ds-component-page ds-table-page">
    <header className="ds-component-hero"><div><span className="ds-eyebrow">COMPONENT FAMILY · WEB · IN REVIEW</span><h1>Table</h1><p>Семейство таблицы из 16 source families. Figma задаёт визуальный и композиционный контракт, React сохраняет нативную HTML table-семантику и минимальный поведенческий API.</p></div><a href={tableFigmaSources.sources} target="_blank" rel="noreferrer">Открыть Sources в Figma ↗</a></header>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Read и Edit</h2><p>Read подсвечивает строку целиком. Edit подсвечивает ячейку, открывает controlled edit по click/Enter/F2 и разрешает reorder. Оба режима используют filter action и row context menu.</p></div></div><h3>Read</h3><div className="ds-table-demo"><SourceTable mode="read" ariaLabel="Позиции закупки · чтение" /></div><h3>Edit</h3><div className="ds-table-demo"><SourceTable mode="edit" ariaLabel="Позиции закупки · редактирование" /></div><TablePaginator page={page} pageCount={8} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} /></section>
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
    <article><h3>Drag Handle Cell · 5 states</h3><Table density={density} mode="edit" aria-label={`Drag Handle Cell · ${density}`}><TableHead><TableRow>{dragStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody><TableRow>{dragStates.map((state) => <TableDragCell key={state} state={state}><TableDragHandle rowLabel={state} disabled={state === 'disabled'} /></TableDragCell>)}</TableRow></TableBody></Table></article>
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
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · HEADERS</span><h1>Headers</h1><p>Column Header и Filter Header — два отдельных синхронных уровня. Selection и actions используют общие компоненты.</p></div><a href={tableFigmaSources.headers} target="_blank" rel="noreferrer">Header Source в Figma ↗</a></header>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Sort, context action и resize</h2><p>Обе плотности используют реальные none → ascending → descending → none, focus-visible и separator states без forced CSS.</p></div></div><div className="ds-table-density-pair">{tableDensities.map((density) => <section key={density}><h3>{density}</h3><HeaderContractTable density={density} /></section>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Column Header · 3 sort × 2 density</h2><p>Default не имеет отдельного Hover/Active surface; Ascending и Descending сохраняют selected surface и точные generated icons.</p></div></div><div className="ds-table-density-pair">{tableDensities.map((density) => <section key={density}><h3>{density}</h3><Table density={density} aria-label={`Column Header matrix ${density}`}><TableHead><TableRow>{(['none', 'ascending', 'descending'] as const).map((sortValue) => <TableHeaderCell key={sortValue} sort={sortValue}>{sortValue}</TableHeaderCell>)}</TableRow></TableHead></Table></section>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>Selection Header · alignment × 2 density</h2><p>Unchecked, Mixed и Checked проверяют только выравнивание и disabled contract; cross-page scope остаётся вне M2.</p></div></div><div className="ds-table-density-pair">{tableDensities.map((density) => <section key={density}><h3>{density}</h3><Table density={density} aria-label={`Selection Header ${density}`}><TableHead>{(['default', 'disabled'] as const).map((state) => <TableRow key={state}><TableHeaderCell scope="row">{state}</TableHeaderCell><TableSelectionHeader selectedCount={0} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} unchecked`} /><TableSelectionHeader selectedCount={1} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} mixed`} /><TableSelectionHeader selectedCount={2} totalCount={2} disabled={state === 'disabled'} onSelectionChange={() => undefined} label={`${state} checked`} /></TableRow>)}</TableHead></Table></section>)}</div></section>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>05</span><div><h2>Filter Row · 10 variants</h2><p>Empty, Text, Number, Date, Period, Select и Boolean в Default; Active существует только для Date, Period и Select.</p></div></div><div className="ds-table-filter-contract-grid">{(['Empty:default','Text:default','Number:default','Date:default','Period:default','Select:default','Boolean:default','Date:active','Period:active','Select:active'] as const).map((variant) => { const [type, state] = variant.split(':'); const active = state === 'active'; return <article key={variant} data-visual-state={state}><code>{type} · {state}</code><Table density="comfortable" aria-label={`Filter ${variant}`}><TableHead><TableFilterRow><TableFilterCell>{type === 'Empty' ? null : type === 'Date' ? <DatePicker label={variant} size="s" open={active} /> : type === 'Period' ? <DateRangePicker label={variant} size="s" open={active} /> : type === 'Select' ? <Select label={variant} size="s" options={statusOptions} defaultValue="all" expanded={active} /> : <TextField label={variant} size="s" inputMode={type === 'Number' ? 'numeric' : undefined} defaultValue={type === 'Boolean' ? 'Да' : undefined} />}</TableFilterCell></TableFilterRow></TableHead></Table></article>; })}</div></section>
  </main>;
}

function ColumnMatrix() {
  const rowCounts = [10, 15, 20, 30] as const;
  const families = ['Read Column', 'Edit Column', 'Index Column', 'Selection Column', 'Drag Handle Column'] as const;
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · COLUMNS</span><h1>Columns</h1><p>Пять самостоятельных Component Sets: Read, Edit, Index, Selection и Drag Handle. Каждая колонка синхронизирует header, filter, body и summary.</p></div><a href={tableFigmaSources.mainComponents} target="_blank" rel="noreferrer">Main Components в Figma ↗</a></header>
    {tableDensities.map((density, densityIndex) => <section className="ds-component-section" key={density}><div className="ds-component-section__intro"><span>{String(densityIndex + 1).padStart(2, '0')}</span><div><h2>{density === 'comfortable' ? 'Comfortable · 48px' : 'Compact · 40px'}</h2><p>Каждое семейство показано отдельной вертикальной композицией.</p></div></div><Table density={density} mode="edit" aria-label={`Column families · ${density}`}><TableHead><TableRow><TableHeaderCell>Read Column</TableHeaderCell><TableHeaderCell>Edit Column</TableHeaderCell><TableHeaderCell kind="index">Index</TableHeaderCell><TableSelectionHeader selectedCount={1} totalCount={4} onSelectionChange={() => undefined} /><TableHeaderCell kind="drag">Drag</TableHeaderCell></TableRow><TableFilterRow><TableFilterCell><TextField label="Read filter" size="s" placeholder="Contains" /></TableFilterCell><TableFilterCell><Select label="Edit filter" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell><TableFilterCell kind="index" /><TableFilterCell kind="selection" /><TableFilterCell kind="drag" /></TableFilterRow></TableHead><TableBody>{sourceRows.map((row, index) => <TableRow key={row.id}><TableCell>{row.position}</TableCell><TableCell><TextField className="ds-table-filter-field" label={`Edit ${row.id}`} size="s" defaultValue={row.name} /></TableCell><TableIndexCell>{index + 1}</TableIndexCell><TableSelectionCell label={`Select ${row.id}`} checked={index === 0} /><TableDragCell><TableDragHandle rowLabel={row.position} /></TableDragCell></TableRow>)}<TableRow><TableSummaryCell kind="label">Read summary</TableSummaryCell><TableSummaryCell kind="value">Edit summary</TableSummaryCell><TableSummaryCell kind="empty" /><TableSummaryCell kind="value">1 / 4</TableSummaryCell><TableSummaryCell kind="empty" /></TableRow></TableBody></Table></section>)}
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>Rows evidence · 5×4×2</h2><p>10, 15, 20 и 30 строк — ось Figma documentation, а не runtime prop: Table не пересобирает контент при смене плотности.</p></div></div><div className="ds-table-column-contract-grid">{families.map((family) => <article key={family}><h3>{family}</h3>{tableDensities.map((density) => <div key={density}><code>{density}</code><div className="ds-table-row-counts">{rowCounts.map((count) => <span key={count}>{count} rows</span>)}</div></div>)}</article>)}</div></section>
  </main>;
}

function PaginatorDocumentation() {
  const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · PAGINATOR</span><h1>Paginator</h1><p>Paginator Control — 14 вариантов Content, Direction и State. Paginator — отдельный standalone source; Figma row counts не становятся API.</p></div><a href={tableFigmaSources.paginator} target="_blank" rel="noreferrer">Paginator Source в Figma ↗</a></header><section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Интерактивный пример</h2><p>Disabled края, current page, ellipsis и выбор размера страницы доступны с клавиатуры.</p></div></div><TablePaginator aria-label="Интерактивная пагинация таблицы" page={page} pageCount={12} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={setPageSize} /><output className="ds-visually-hidden" data-page-size={pageSize} data-page-size-type={typeof pageSize}>{pageSize}</output></section><section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Control states</h2><p>Три реальные композиции показывают Previous/Next Default и Disabled, Page Default/Current, Ellipsis и page-size.</p></div></div><div className="ds-table-paginator-contract"><article><code>first page</code><TablePaginator aria-label="Пагинация на первой странице" page={1} pageCount={12} onPageChange={() => undefined} pageSize={10} /></article><article><code>middle · ellipsis both sides</code><TablePaginator aria-label="Пагинация в середине диапазона" page={6} pageCount={12} onPageChange={() => undefined} pageSize={15} /></article><article><code>last page</code><TablePaginator aria-label="Пагинация на последней странице" page={12} pageCount={12} onPageChange={() => undefined} pageSize={30} /></article></div></section></main>;
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
    const readTable = canvas.getByRole('table', { name: 'Позиции закупки · чтение' });
    const table = canvas.getByRole('table', { name: 'Позиции закупки · редактирование' });
    await expect(within(table).getAllByRole('row')).toHaveLength(7);
    await expect(within(table).getByRole('row', { name: /Фильтры таблицы/i })).toBeVisible();
    await expect(canvas.getByRole('navigation', { name: 'Пагинация таблицы' })).toBeVisible();
    await expect(readTable.querySelector('[data-kind="drag"]')).toBeNull();
    await userEvent.click(within(readTable).getByRole('button', { name: 'Действия колонки Наименование' }));
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Закрепить слева' }));
    await waitFor(() => expect(readTable.querySelectorAll('[data-column-id="name"][data-column-pinned]')).toHaveLength(7));
    await expect(readTable.querySelector('th[data-column-id="name"]')).toHaveAttribute('data-column-pinned-last', 'true');

    const tableCanvas = within(table);
    const contextAction = tableCanvas.getByRole('button', { name: 'Действия колонки Позиция' });
    const contextIcon = contextAction.querySelector('svg');
    const contextGlyphs = Array.from(contextAction.querySelectorAll('path'));
    const dragHandle = tableCanvas.getByRole('button', { name: 'Переместить строку POS-00127' });
    const dragIcon = dragHandle.querySelector('svg');
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
    const filterAction = tableCanvas.getByRole('button', { name: 'Параметры фильтра: Позиция' });
    await expect(filterAction.getBoundingClientRect().width).toBe(24);
    await expect(filterAction.getBoundingClientRect().height).toBe(24);
    await expect(filterAction.querySelector('svg')?.getBoundingClientRect().width).toBe(12);
    await userEvent.click(filterAction);
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Не содержит' }));
    await expect(tableCanvas.getByRole('textbox', { name: 'Фильтр по позиции' })).toHaveAttribute('placeholder', 'Не содержит');
    const firstRow = table.querySelector<HTMLTableRowElement>('tbody tr[data-row-id="1"]');
    if (!firstRow) throw new Error('Expected row 1');
    fireEvent.contextMenu(firstRow, { clientX: 320, clientY: 420 });
    await expect(within(document.body).getByRole('menuitem', { name: 'Открыть позицию' })).toBeDisabled();
    within(document.body).getByRole('menuitem', { name: 'Переключить выбор строки' }).focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(document.activeElement).toBe(firstRow));
    fireEvent.keyDown(firstRow, { key: 'F10', shiftKey: true });
    await expect(within(document.body).getByRole('menuitem', { name: 'Открыть позицию' })).toBeVisible();
    await waitFor(() => expect(document.activeElement).toBe(within(document.body).getByRole('menuitem', { name: 'Переключить выбор строки' })));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(document.activeElement).toBe(firstRow));
    const editableCell = firstRow.querySelector<HTMLElement>('td[data-editable="true"]');
    if (!editableCell) throw new Error('Expected editable cell');
    await userEvent.click(editableCell);
    await expect(editableCell).toHaveAttribute('data-state', 'editing');
    await expect(editableCell).toHaveAttribute('contenteditable', 'true');
    await expect(editableCell.querySelector('input')).toBeNull();
    dragHandle.focus();
    await expect(getComputedStyle(dragHandle).outlineStyle).toBe('none');
    await userEvent.keyboard('{Space}');
    await expect(dragHandle).toHaveAttribute('aria-pressed', 'true');
    await expect(table.querySelector('tr[data-reorder-id="1"]')).toHaveAttribute('data-row-dragging', 'true');
    await userEvent.keyboard('{ArrowDown}{Space}');
    await expect(Array.from(table.querySelectorAll('tbody tr[data-reorder-id]')).map((row) => row.getAttribute('data-reorder-id'))).toEqual(['2', '1', '3', '4']);
    await expect(dragHandle).not.toHaveAttribute('aria-pressed');
    await expect(table.querySelector('[data-drop-confirmation]')).toBeNull();

    const scrollRegion = table.closest<HTMLElement>('.cometal-table-scroll');
    const targetRow = table.querySelector<HTMLTableRowElement>('tr[data-reorder-id="3"]');
    if (!scrollRegion || !targetRow) throw new Error('Expected reorder surface and target row');
    const targetBounds = targetRow.getBoundingClientRect();
    fireEvent.pointerDown(dragHandle, { pointerId: 19, button: 0, clientX: targetBounds.left + 8, clientY: targetBounds.top - 8 });
    fireEvent.pointerMove(scrollRegion, { pointerId: 19, clientX: targetBounds.left + 8, clientY: targetBounds.bottom - 2 });
    await waitFor(() => expect(targetRow).toHaveAttribute('data-drop-position', 'after'));
    fireEvent.pointerUp(scrollRegion, { pointerId: 19, clientX: targetBounds.left + 8, clientY: targetBounds.bottom - 2 });
    await waitFor(() => expect(Array.from(table.querySelectorAll('tbody tr[data-reorder-id]')).map((row) => row.getAttribute('data-reorder-id'))).toEqual(['2', '3', '1', '4']));
    const confirmedRow = table.querySelector<HTMLTableRowElement>('tr[data-reorder-id="1"]');
    if (!confirmedRow) throw new Error('Expected moved row in its new position');
    await expect(confirmedRow).toHaveAttribute('data-drop-confirmation', 'hold');
    const confirmedCell = confirmedRow.querySelector<HTMLTableCellElement>('.cometal-table__cell');
    if (!confirmedCell) throw new Error('Expected moved row cell');
    const confirmedContent = confirmedCell.querySelector<HTMLElement>('.cometal-table__cell-content');
    if (!confirmedContent) throw new Error('Expected moved row content');
    const selectedProbe = document.createElement('span');
    selectedProbe.style.background = 'var(--cometal-table-selected)';
    confirmedCell.append(selectedProbe);
    const expectedSelectedSurface = getComputedStyle(selectedProbe).backgroundColor;
    selectedProbe.remove();
    const confirmationStyle = getComputedStyle(confirmedCell, '::before');
    await expect(confirmationStyle.opacity).toBe('1');
    await expect(confirmationStyle.backgroundColor).toBe(expectedSelectedSurface);
    await expect(confirmationStyle.zIndex).toBe('0');
    await expect(getComputedStyle(confirmedContent).zIndex).toBe('1');
    await waitFor(() => expect(confirmedRow).toHaveAttribute('data-drop-confirmation', 'fade'), { timeout: 1_000 });
    await expect(getComputedStyle(confirmedCell, '::before').transitionDuration).toBe('0.12s');
    await waitFor(() => expect(confirmedRow).not.toHaveAttribute('data-drop-confirmation'), { timeout: 1_000 });
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
    const documentCanvas = within(canvasElement.ownerDocument.body);
    const stateProbe = document.createElement('span');
    stateProbe.style.setProperty('--m2-context-open', 'var(--cometal-component-table-header-surface-context-action-open)');
    stateProbe.style.setProperty('--m2-focus', 'var(--cometal-semantic-color-global-state-focus-ring)');
    stateProbe.style.color = 'var(--m2-focus)';
    canvasElement.append(stateProbe);
    const expectedFocusColor = getComputedStyle(stateProbe).color;
    stateProbe.style.backgroundColor = 'var(--m2-context-open)';
    const expectedContextOpen = getComputedStyle(stateProbe).backgroundColor;

    for (const [density, expectedHeight] of [['comfortable', 48], ['compact', 40]] as const) {
      const table = canvas.getByRole('table', { name: `Интерактивный контракт заголовка · ${density}` });
      const tableCanvas = within(table);
      const header = table.querySelector<HTMLTableCellElement>('th[data-column-id="position"]')!;
      const sortButton = tableCanvas.getByRole('button', { name: 'Сортировать Позиция: по возрастанию' }) as HTMLButtonElement;
      const contextAction = tableCanvas.getByRole('button', { name: `Действия колонки Позиция ${density}` }) as HTMLButtonElement;
      const resizeHandle = tableCanvas.getByRole('separator', { name: 'Изменить ширину колонки Позиция' });
      const defaultHeaderStyle = getComputedStyle(header);
      const defaultHeaderSurface = defaultHeaderStyle.backgroundColor;
      const defaultHeaderText = defaultHeaderStyle.color;
      const defaultSortSurface = getComputedStyle(sortButton).backgroundColor;

      await expect(header.getBoundingClientRect().height).toBe(expectedHeight);
      await expect(header).not.toHaveAttribute('aria-sort');
      await userEvent.hover(sortButton);
      await expect(getComputedStyle(header).backgroundColor).toBe(defaultHeaderSurface);
      await expect(getComputedStyle(header).color).toBe(defaultHeaderText);
      await expect(getComputedStyle(sortButton).backgroundColor).toBe(defaultSortSurface);
      fireEvent.pointerDown(sortButton, { button: 0 });
      await expect(getComputedStyle(header).backgroundColor).toBe(defaultHeaderSurface);
      await expect(getComputedStyle(header).color).toBe(defaultHeaderText);
      await expect(getComputedStyle(sortButton).backgroundColor).toBe(defaultSortSurface);
      fireEvent.pointerUp(sortButton, { button: 0 });
      await userEvent.unhover(sortButton);

      await expectFocusContract(sortButton);
      await expect(getComputedStyle(sortButton).outlineColor).toBe(expectedFocusColor);
      await userEvent.click(sortButton);
      await expect(header).toHaveAttribute('aria-sort', 'ascending');
      await expect(sortButton).toHaveAccessibleName('Сортировать Позиция: по убыванию');
      await expect(getComputedStyle(header).backgroundColor).not.toBe(defaultHeaderSurface);
      await expectSortIconContract(sortButton, arrowUpSmallDefinition);

      sortButton.focus();
      await userEvent.keyboard('{Enter}');
      await expect(header).toHaveAttribute('aria-sort', 'descending');
      await expect(sortButton).toHaveAccessibleName('Сортировать Позиция: отключить сортировку');
      await expectSortIconContract(sortButton, arrowDownSmallDefinition);

      sortButton.focus();
      await userEvent.keyboard(' ');
      await expect(header).not.toHaveAttribute('aria-sort');
      await expect(sortButton).toHaveAccessibleName('Сортировать Позиция: по возрастанию');
      await expect(sortButton.querySelector('.cometal-table__sort-icon')).toBeNull();

      await expect(contextAction).toHaveAttribute('aria-expanded', 'false');
      await expect(getComputedStyle(contextAction).backgroundColor).toBe('rgba(0, 0, 0, 0)');
      await userEvent.hover(contextAction);
      await expect(contextAction.className).not.toMatch(/force-(hover|open)/);
      await userEvent.unhover(contextAction);
      await expectFocusContract(contextAction);
      await expect(getComputedStyle(contextAction).outlineColor).toBe(expectedFocusColor);
      await userEvent.click(contextAction);
      await expect(contextAction).toHaveAttribute('aria-expanded', 'true');
      await expect(getComputedStyle(contextAction).backgroundColor).toBe(expectedContextOpen);
      await expect(documentCanvas.getByRole('menu', { name: `Действия колонки Позиция ${density}` })).toBeVisible();
      await userEvent.keyboard('{Escape}');
      await expect(contextAction).toHaveAttribute('aria-expanded', 'false');
      await expect(contextAction).toHaveFocus();

      await userEvent.hover(sortButton);
      const defaultResizeLine = getComputedStyle(resizeHandle, '::after');
      await expect(resizeHandle.getBoundingClientRect().width).toBe(8);
      await expect(getComputedStyle(resizeHandle).cursor).toBe('col-resize');
      await expect(defaultResizeLine.width).toBe('1px');
      await expect(defaultResizeLine.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      fireEvent.pointerDown(resizeHandle, { pointerId: 31, button: 0, clientX: 400 });
      await expect(resizeHandle).toHaveAttribute('data-resizing');
      const resizingLine = getComputedStyle(resizeHandle, '::after');
      await expect(resizingLine.width).toBe('2px');
      await expect(resizingLine.backgroundColor).toBe(expectedFocusColor);
      fireEvent.pointerUp(resizeHandle, { pointerId: 31, clientX: 400 });
      resizeHandle.focus();
      const focusResizeLine = getComputedStyle(resizeHandle, '::after');
      await expect(focusResizeLine.width).toBe('2px');
      await expect(focusResizeLine.backgroundColor).toBe(expectedFocusColor);
      await expect(getComputedStyle(resizeHandle).outlineStyle).toBe('none');
    }

    stateProbe.remove();
    await expectTypographyFor(canvasElement, headerValueSelector, tableTypography.header);
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
    const pageSizeField = navigation.querySelector<HTMLElement>('.cometal-table__page-size')!;
    const pageSizeTrigger = paginator.getByRole('combobox', { name: 'Строк на странице' });
    const pageSizeAsset = pageSizeTrigger.querySelector<HTMLElement>('.cometal-field__asset')!;
    await expect(previous.getBoundingClientRect().width).toBe(40);
    await expect(previous.getBoundingClientRect().height).toBe(40);
    await expect(previousIcon?.getBoundingClientRect().width).toBe(24);
    await expect(previousIcon?.getBoundingClientRect().height).toBe(24);
    await expect(controls ? getComputedStyle(controls).gap : '').toBe('4px');
    await expect(pageSizeField.getBoundingClientRect().width).toBe(96);
    await expect(pageSizeField.getBoundingClientRect().height).toBe(40);
    await expect(pageSizeTrigger.getBoundingClientRect().width).toBe(96);
    await expect(pageSizeTrigger.getBoundingClientRect().height).toBe(40);
    await expect(getComputedStyle(pageSizeTrigger).paddingLeft).toBe('12px');
    await expect(getComputedStyle(pageSizeTrigger).paddingRight).toBe('12px');
    await expect(getComputedStyle(pageSizeTrigger).gap).toBe('8px');
    await expect(pageSizeAsset.getBoundingClientRect().width).toBe(20);
    await expect(pageSizeAsset.getBoundingClientRect().height).toBe(20);
    await expectTypographyFor(canvasElement, '.cometal-table__page-control, .cometal-table__page-ellipsis', tableTypography.paginator);
    await expectPageSizeTypography(canvasElement, 4);
    await userEvent.click(pageSizeTrigger);
    const listbox = within(canvasElement.ownerDocument.body).getByRole('listbox', { name: 'Строк на странице: варианты' });
    await expect(listbox.getBoundingClientRect().width).toBe(96);
    await expect(within(listbox).getAllByRole('option')[0]?.getBoundingClientRect().height).toBe(40);
    await userEvent.click(within(listbox).getByRole('option', { name: '20' }));
    await expect(pageSizeTrigger).toHaveTextContent('20');
    const pageSizeOutput = canvasElement.querySelector<HTMLOutputElement>('output[data-page-size]')!;
    await expect(pageSizeOutput).toHaveAttribute('data-page-size', '20');
    await expect(pageSizeOutput).toHaveAttribute('data-page-size-type', 'number');
    await userEvent.click(paginator.getByRole('button', { name: 'Следующая страница' }));
    await expect(paginator.getByRole('button', { name: 'Страница 2' })).toHaveAttribute('aria-current', 'page');
  },
};
export const SectionCompositions: Story = {
  name: 'Секции/Terminal edges',
  render: () => <main className="ds-story-canvas ds-table-density-pair">{tableSectionCompositions.map((composition) => <section key={composition.label}><h2>{composition.label}</h2><TableSectionCompositionFixture composition={composition} /></section>)}</main>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const composition of tableSectionCompositions) {
      const table = canvas.getByRole('table', { name: composition.label }) as HTMLTableElement;
      await expectCanonicalSectionEdges(table);
      await expect(table.querySelectorAll('.cometal-table__filter-row')).toHaveLength(composition.filters ? 1 : 0);
      await expect(table.querySelectorAll('.cometal-table__body')).toHaveLength(composition.body === 'absent' ? 0 : 1);
      await expect(table.querySelectorAll('.cometal-table__body > tr')).toHaveLength(composition.body === 'populated' ? composition.summary ? 2 : 1 : 0);
      await expect(table.querySelectorAll('[data-composition-row="summary"]')).toHaveLength(composition.summary ? 1 : 0);
    }
  },
};
export const Density: Story = {
  name: 'Плотность',
  render: () => <div className="ds-story-canvas ds-table-density-pair"><section><h2>Comfortable · 48px</h2><SourceTable density="comfortable" mode="edit" ariaLabel="Позиции закупки · Comfortable" /></section><section><h2>Compact · 40px</h2><SourceTable density="compact" mode="edit" ariaLabel="Позиции закупки · Compact" /></section></div>,
  play: async ({ canvasElement }) => {
    const tables = Array.from(canvasElement.querySelectorAll<HTMLTableElement>('.cometal-table'));
    const frameProbe = document.createElement('span');
    frameProbe.style.color = 'var(--cometal-semantic-color-global-border-default)';
    frameProbe.style.backgroundColor = 'var(--cometal-semantic-color-global-surface-raised)';
    canvasElement.append(frameProbe);
    const frameProbeStyle = getComputedStyle(frameProbe);
    const firstByDensity = tables.map((table) => table.querySelector<HTMLElement>('tbody .cometal-table__selection-cell')!);
    for (const [index, cell] of firstByDensity.entries()) {
      const expected = index === 0 ? 48 : 40;
      await expectM1TableGeometry(tables[index]!, expected, frameProbeStyle.color, frameProbeStyle.backgroundColor);
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
    frameProbe.remove();
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
