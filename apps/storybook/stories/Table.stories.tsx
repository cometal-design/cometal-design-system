import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import {
  Badge, Button, ContextMenuDivider, ContextMenuItem, DatePicker, DateRangePicker, Select,
  Table, TableBody, TableCell, TableColumnPinAction, TableContextAction, TableDragCell, TableDragHandle,
  TableFileCell, TableFileIcon, TableFilterCell, TableFilterRow, TableHeaderCell, TableHead,
  TableIndexCell, TablePaginator, TableRow, TableSelectionCell, TableSelectionHeader,
  TableSummaryCell, TextField, tableDensities, tableDocumentationSections, tableFileTypes,
  tableFigmaSources, tableSourceFamilies, tableStandaloneSources,
} from '@cometal/react';
import type { TableCellState, TableDensity, TableFileType, TableSortDirection } from '@cometal/react';
import { definition as arrowUpSmallDefinition } from '@cometal/react/icons/outline/arrows/arrow-up-sm';
import { definition as arrowDownSmallDefinition } from '@cometal/react/icons/outline/arrows/down-arrow-sm';
import { TableReviewExample } from '@cometal/examples/widget-table';
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
  const summaryUtility = summary.querySelector<HTMLElement>('[data-kind="selection"]')!;
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
  return <main className="ds-component-page ds-table-page">
    <header className="ds-component-hero"><div><span className="ds-eyebrow">COMPONENT FAMILY · WEB · IN REVIEW</span><h1>Table</h1><p>Семейство таблицы из 16 source families. Figma задаёт визуальный и композиционный контракт, React сохраняет нативную HTML table-семантику и минимальный поведенческий API.</p></div><a href={tableFigmaSources.sources} target="_blank" rel="noreferrer">Открыть Sources в Figma ↗</a></header>
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Read и Edit</h2><p>Read подсвечивает строку целиком. Edit подсвечивает ячейку, открывает controlled edit по click/Enter/F2 и разрешает reorder. Это тот же executable Table-контракт, который используется внутри Widget + Table; оператор и сброс фильтра находятся в меню хедера.</p></div></div><h3>Read</h3><div className="ds-table-demo"><TableReviewExample mode="read" /></div><h3>Edit</h3><div className="ds-table-demo"><TableReviewExample mode="edit" /></div></section>
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
  return <>Текстовое значение</>;
}

function ReadCellMatrix({ density }: { density: TableDensity }) {
  return <Table density={density} aria-label={`Read Cell · ${density}`} className="ds-table-contract-matrix"><TableHead><TableRow><TableHeaderCell>Type</TableHeaderCell>{readStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody>{readTypes.map((type) => <TableRow key={type}><TableHeaderCell scope="row">{type}</TableHeaderCell>{readStates.map((state) => type === 'File' ? <TableFileCell key={state} state={state} fileName="Спецификация.pdf" fileSize="130 КБ" fileType="pdf" /> : <TableCell key={state} state={state} align={type.includes('Number') ? 'end' : 'start'}><ReadValue type={type} /></TableCell>)}</TableRow>)}</TableBody></Table>;
}

function EditValue({ type }: { type: (typeof editTypes)[number] }) {
  if (type === 'Number') return <>12 450</>;
  if (type === 'Dropdown') return <>Согласовано</>;
  return <>Значение</>;
}

function EditCellMatrix({ density }: { density: TableDensity }) {
  return <Table density={density} mode="edit" aria-label={`Edit Cell · ${density}`} className="ds-table-contract-matrix"><TableHead><TableRow><TableHeaderCell>Type</TableHeaderCell>{editStates.map((state) => <TableHeaderCell key={state}>{state}</TableHeaderCell>)}</TableRow></TableHead><TableBody>{editTypes.map((type) => <TableRow key={type}><TableHeaderCell scope="row">{type}</TableHeaderCell>{editStates.map((state) => type === 'File' ? <TableFileCell key={state} state={state} fileName="Спецификация.pdf" fileSize="130 КБ" fileType="pdf" /> : <TableCell key={state} state={state} editable aria-label={`${type} · ${state}`}><EditValue type={type} /></TableCell>)}</TableRow>)}</TableBody></Table>;
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
    <section className="ds-component-section"><div className="ds-component-section__intro"><span>05</span><div><h2>Filter Row · 7 default variants</h2><p>Empty, Text, Number, Date, Period, Select и Boolean не открывают overlays до явного взаимодействия.</p></div></div><div className="ds-table-filter-contract-grid">{(['Empty','Text','Number','Date','Period','Select','Boolean'] as const).map((type) => <article key={type} data-visual-state="default"><code>{type} · default</code><Table density="comfortable" aria-label={`Filter ${type}:default`}><TableHead><TableFilterRow><TableFilterCell>{type === 'Empty' ? null : type === 'Date' ? <DatePicker label={`${type}:default`} size="s" /> : type === 'Period' ? <DateRangePicker label={`${type}:default`} size="s" /> : type === 'Select' ? <Select label={`${type}:default`} size="s" options={statusOptions} defaultValue="all" /> : <TextField label={`${type}:default`} size="s" inputMode={type === 'Number' ? 'numeric' : undefined} defaultValue={type === 'Boolean' ? 'Да' : undefined} />}</TableFilterCell></TableFilterRow></TableHead></Table></article>)}</div></section>
  </main>;
}

function ColumnMatrix() {
  const rowCounts = [10, 15, 20, 30] as const;
  const families = ['Read Column', 'Edit Column', 'Index Column', 'Selection Column', 'Drag Handle Column'] as const;
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · COLUMNS</span><h1>Columns</h1><p>Пять самостоятельных Component Sets: Read, Edit, Index, Selection и Drag Handle. Каждая колонка синхронизирует header, filter, body и summary.</p></div><a href={tableFigmaSources.mainComponents} target="_blank" rel="noreferrer">Main Components в Figma ↗</a></header>
    {tableDensities.map((density, densityIndex) => <section className="ds-component-section" key={density}><div className="ds-component-section__intro"><span>{String(densityIndex + 1).padStart(2, '0')}</span><div><h2>{density === 'comfortable' ? 'Comfortable · 48px' : 'Compact · 40px'}</h2><p>Каждое семейство показано отдельной вертикальной композицией.</p></div></div><Table density={density} mode="edit" aria-label={`Column families · ${density}`}><TableHead><TableRow><TableHeaderCell>Read Column</TableHeaderCell><TableHeaderCell>Edit Column</TableHeaderCell><TableHeaderCell kind="index">Index</TableHeaderCell><TableSelectionHeader selectedCount={1} totalCount={4} onSelectionChange={() => undefined} /><TableHeaderCell kind="drag">Drag</TableHeaderCell></TableRow><TableFilterRow><TableFilterCell><TextField label="Read filter" size="s" placeholder="Contains" /></TableFilterCell><TableFilterCell><Select label="Edit filter" size="s" options={statusOptions} defaultValue="all" /></TableFilterCell><TableFilterCell kind="index" /><TableFilterCell kind="selection" /><TableFilterCell kind="drag" /></TableFilterRow></TableHead><TableBody>{sourceRows.map((row, index) => <TableRow key={row.id}><TableCell>{row.position}</TableCell><TableCell editable state={index === 0 ? 'editing' : 'default'} aria-label={`Edit ${row.position}`}>{row.name}</TableCell><TableIndexCell>{index + 1}</TableIndexCell><TableSelectionCell label={`Select ${row.id}`} checked={index === 0} /><TableDragCell><TableDragHandle rowLabel={row.position} /></TableDragCell></TableRow>)}<TableRow><TableSummaryCell kind="label">Read summary</TableSummaryCell><TableSummaryCell kind="value">Edit summary</TableSummaryCell><TableSummaryCell kind="empty" /><TableSummaryCell kind="value">1 / 4</TableSummaryCell><TableSummaryCell kind="empty" /></TableRow></TableBody></Table></section>)}
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
  return <main className="ds-component-page ds-table-page"><header className="ds-component-hero"><div><span className="ds-eyebrow">TABLE · PLAYGROUND</span><h1>Table Playground</h1><p>{description}</p></div></header><div className="ds-table-playground-controls"><Button size="s" variant={density === 'comfortable' ? 'primary' : 'secondary'} onClick={() => setDensity('comfortable')}>Comfortable</Button><Button size="s" variant={density === 'compact' ? 'primary' : 'secondary'} onClick={() => setDensity('compact')}>Compact</Button><Button size="s" variant="secondary" onClick={() => setFilters((value) => !value)}>{filters ? 'Скрыть фильтры' : 'Показать фильтры'}</Button></div><div className="ds-table-demo"><TableReviewExample key={`${density}-${filters}`} initialDensity={density} initialFilters={filters} mode="read" /></div></main>;
}

const meta = { title: 'Components/Table', component: Table, args: { 'aria-label': 'Table example' }, parameters: { layout: 'fullscreen', controls: { disable: true } } } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  name: 'Обзор',
  render: () => <OverviewPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readTable = canvas.getByRole('table', { name: 'Спецификация позиций · Read' });
    const editTable = canvas.getByRole('table', { name: 'Спецификация позиций · Edit' });

    await expect(within(readTable).getAllByRole('row')).toHaveLength(13);
    await expect(within(editTable).getAllByRole('row')).toHaveLength(13);
    await expect(within(readTable).getByRole('row', { name: /Фильтры таблицы/i })).toBeVisible();
    await expect(within(editTable).getByRole('row', { name: /Фильтры таблицы/i })).toBeVisible();
    await expect(canvas.getAllByRole('navigation', { name: /Пагинация таблицы/ })).toHaveLength(2);
    await expect(readTable.querySelector('[data-kind="drag"]')).toBeNull();
    await expect(editTable.querySelector('[data-kind="drag"]')).not.toBeNull();
    await expect(readTable.querySelectorAll('.cometal-table__filter-action')).toHaveLength(0);
    await expect(editTable.querySelectorAll('.cometal-table__filter-action')).toHaveLength(0);
    await expect(readTable.querySelectorAll('.cometal-table__context-action')).toHaveLength(13);
    await expect(editTable.querySelectorAll('.cometal-table__context-action')).toHaveLength(13);
    const readScroll = readTable.closest<HTMLElement>('.cometal-table-scroll')!;
    const readShell = readTable.closest<HTMLElement>('.cometal-table-scroll-shell')!;
    await waitFor(() => expect(readScroll.scrollWidth).toBeGreaterThan(readScroll.clientWidth));
    await waitFor(() => expect(readShell.querySelector('[role="scrollbar"][aria-orientation="horizontal"]')).toBeInTheDocument());

    await userEvent.click(within(readTable).getByRole('button', { name: 'Действия колонки Позиция' }));
    await expect(within(document.body).getByRole('menuitem', { name: 'Закрепить слева' })).toBeVisible();
    await expect(within(document.body).getByRole('menuitem', { name: 'Скрыть колонку' })).toBeVisible();
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Фильтр' }));
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Не содержит' }));
    await expect(within(readTable).getByRole('textbox', { name: 'Фильтр по позиции' })).toHaveAttribute('placeholder', 'Не содержит');

    await userEvent.click(within(readTable).getByRole('button', { name: 'Действия колонки Наименование' }));
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Закрепить слева' }));
    await waitFor(() => expect(readTable.querySelectorAll('[data-column-id="name"][data-column-pinned]')).toHaveLength(13));
    await expect(readTable.querySelector('th[data-column-id="name"]')).toHaveAttribute('data-column-pinned-last', 'true');

    await expect(canvasElement.querySelectorAll('[data-cometal-icon]').length).toBeGreaterThan(0);
    await expect(canvasElement.querySelectorAll('.cometal-selection').length).toBeGreaterThan(0);
    await expectTableSurfaceTypography(canvasElement);
    await expectTypographyFor(canvasElement, '.cometal-table__page-control, .cometal-table__page-ellipsis', tableTypography.paginator);
    await expectPageSizeTypography(canvasElement);
    const readPaginator = canvas.getAllByRole('navigation', { name: /Пагинация таблицы/ })[0]!;
    await userEvent.click(within(readPaginator).getByRole('combobox', { name: 'Строк на странице' }));
    await userEvent.click(within(document.body).getByRole('option', { name: '30' }));
    await waitFor(() => expect(readScroll.scrollHeight).toBeGreaterThan(readScroll.clientHeight));
    await waitFor(() => expect(readShell.querySelector('[role="scrollbar"][aria-orientation="vertical"]')).toBeInTheDocument());
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
    const colorProbe = document.createElement('span');
    colorProbe.style.color = 'var(--cometal-component-table-header-icon-context-action)';
    canvasElement.append(colorProbe);
    const expectedDefaultColor = getComputedStyle(colorProbe).color;
    colorProbe.style.color = 'var(--cometal-component-table-icon-selected)';
    const expectedDraggingColor = getComputedStyle(colorProbe).color;
    colorProbe.remove();
    for (const density of ['comfortable', 'compact'] as const) {
      const table = canvasElement.querySelector<HTMLTableElement>(`table[aria-label="Drag Handle Cell · ${density}"]`)!;
      const defaultHandle = within(table).getByRole('button', { name: 'Переместить строку default' });
      const draggingHandle = within(table).getByRole('button', { name: 'Переместить строку dragging' });
      for (const handle of [defaultHandle, draggingHandle]) {
        const marker = handle.querySelector<HTMLElement>('[data-cometal-table-icon="drag-handle"]')!;
        await expect(marker.getBoundingClientRect().width).toBe(24);
        await expect(marker.getBoundingClientRect().height).toBe(24);
        await expect(getComputedStyle(marker).maskImage).not.toBe('none');
        await expect(marker.querySelector('svg, path, line')).toBeNull();
      }
      await expect(getComputedStyle(defaultHandle).color).toBe(expectedDefaultColor);
      await expect(getComputedStyle(draggingHandle).color).toBe(expectedDraggingColor);

      const readCellTable = canvasElement.querySelector<HTMLTableElement>(`table[aria-label="Read Cell · ${density}"]`)!;
      const editCellTable = canvasElement.querySelector<HTMLTableElement>(`table[aria-label="Edit Cell · ${density}"]`)!;
      await expect(editCellTable).toHaveAttribute('data-mode', 'edit');
      await expect(editCellTable.querySelectorAll('tbody .cometal-table__cell .cometal-field, tbody .cometal-table__cell input, tbody .cometal-table__cell [role="combobox"]')).toHaveLength(0);
      const editingCells = Array.from(editCellTable.querySelectorAll<HTMLTableCellElement>('tbody td[data-state="editing"][contenteditable="true"][role="textbox"]'));
      await expect(editingCells).toHaveLength(3);
      for (const editingCell of editingCells) await expect(editingCell).toHaveAttribute('aria-multiline', 'false');
      await expect(editCellTable.querySelectorAll('tbody td:not([data-state="editing"])[contenteditable="true"]')).toHaveLength(0);
      const readFileCells = Array.from(readCellTable.querySelectorAll<HTMLTableCellElement>('.cometal-table__file-cell'));
      const editFileCells = Array.from(editCellTable.querySelectorAll<HTMLTableCellElement>('.cometal-table__file-cell'));
      await expect(readFileCells).toHaveLength(5);
      await expect(editFileCells).toHaveLength(7);
      await expect(within(editCellTable).queryByRole('button', { name: 'Выбрать файл' })).toBeNull();
      for (const fileCell of [...readFileCells, ...editFileCells]) {
        await expect(fileCell.querySelector('.cometal-table__file-name')).toHaveTextContent('Спецификация.pdf');
        const fileSize = fileCell.querySelector<HTMLElement>('.cometal-table__file-size')!;
        await expect(fileSize).toHaveTextContent('130 КБ');
        await expect(getComputedStyle(fileSize).display).toBe(density === 'comfortable' ? 'block' : 'none');
        const icon = fileCell.querySelector<SVGSVGElement>('svg.cometal-table__file-asset')!;
        await expect(icon.getBoundingClientRect().width).toBe(24);
        await expect(icon.getBoundingClientRect().height).toBe(24);
      }
    }
    const standaloneFileIcons = Array.from(canvasElement.querySelectorAll<SVGSVGElement>('.ds-table-file-grid svg.cometal-table__file-asset'));
    await expect(standaloneFileIcons).toHaveLength(9);
    for (const icon of standaloneFileIcons) {
      await expect(icon.getBoundingClientRect().width).toBe(24);
      await expect(icon.getBoundingClientRect().height).toBe(24);
    }
  },
};
export const Headers: Story = {
  name: 'Кирпичики/Headers',
  render: () => <HeaderMatrix />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const documentCanvas = within(canvasElement.ownerDocument.body);
    await expect(documentCanvas.queryAllByRole('dialog')).toHaveLength(0);
    await expect(documentCanvas.queryAllByRole('listbox')).toHaveLength(0);
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
      const scroll = table.closest<HTMLElement>('.cometal-table-scroll')!;
      const shell = table.closest<HTMLElement>('.cometal-table-scroll-shell')!;
      const shellStyle = getComputedStyle(shell);
      const defaultHeaderStyle = getComputedStyle(header);
      const defaultHeaderSurface = defaultHeaderStyle.backgroundColor;
      const defaultHeaderText = defaultHeaderStyle.color;
      const defaultSortSurface = getComputedStyle(sortButton).backgroundColor;

      await expect(header.getBoundingClientRect().height).toBe(expectedHeight);
      await expect(scroll.scrollWidth).toBeLessThanOrEqual(scroll.clientWidth);
      await expect(shell.getBoundingClientRect().height).toBe(
        table.getBoundingClientRect().height
          + Number.parseFloat(shellStyle.borderTopWidth)
          + Number.parseFloat(shellStyle.borderBottomWidth),
      );
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
      const pointerId = density === 'comfortable' ? 31 : 32;
      const initialHeaderWidth = header.getBoundingClientRect().width;
      fireEvent.pointerDown(resizeHandle, { pointerId, button: 0, clientX: 400 });
      await waitFor(() => expect(resizeHandle).toHaveAttribute('data-resizing'));
      const resizingLine = getComputedStyle(resizeHandle, '::after');
      await expect(resizingLine.width).toBe('2px');
      await expect(resizingLine.backgroundColor).toBe(expectedFocusColor);
      fireEvent.pointerMove(resizeHandle, { pointerId, clientX: 424 });
      fireEvent.pointerUp(resizeHandle, { pointerId, clientX: 424 });
      await waitFor(() => expect(header).toHaveAttribute('data-column-width', String(Math.round(initialHeaderWidth + 24))));
      await expect(resizeHandle).not.toHaveAttribute('data-resizing');
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
    for (const density of ['comfortable', 'compact'] as const) {
      const table = canvasElement.querySelector<HTMLTableElement>(`table[aria-label="Column families · ${density}"]`)!;
      const editableCells = Array.from(table.querySelectorAll<HTMLTableCellElement>('tbody td[data-editable="true"]'));
      await expect(editableCells).toHaveLength(4);
      for (const cell of editableCells) await expect(cell.querySelector('.cometal-field, input, [role="combobox"]')).toBeNull();
      const editingCell = table.querySelector<HTMLTableCellElement>('tbody td[data-state="editing"]')!;
      await expect(editingCell).toHaveAttribute('contenteditable', 'true');
      await expect(editingCell).toHaveAttribute('role', 'textbox');
      await expect(editingCell).toHaveAttribute('aria-multiline', 'false');
      await expect(table.querySelectorAll('.cometal-table__filter-row .cometal-field')).toHaveLength(2);
    }
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
    const listbox = await within(canvasElement.ownerDocument.body).findByRole('listbox', { name: 'Строк на странице: варианты' });
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
  render: () => <div className="ds-story-canvas ds-table-density-pair"><section><h2>Comfortable · 48px</h2><TableReviewExample ariaLabel="Спецификация позиций · Comfortable" initialDensity="comfortable" mode="edit" /></section><section><h2>Compact · 40px</h2><TableReviewExample ariaLabel="Спецификация позиций · Compact" initialDensity="compact" mode="edit" /></section></div>,
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
    await expect(canvas.getByRole('table', { name: 'Спецификация позиций · Read' })).toHaveAttribute('data-density', 'compact');
    await expectTableSurfaceTypography(canvasElement);
  },
};
