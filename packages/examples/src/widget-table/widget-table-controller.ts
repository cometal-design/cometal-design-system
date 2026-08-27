import type { DateRangeValue, TableSortDirection } from '@cometal/react';

export type ReviewRowValues = [string, string, string, number, string, number, string, string, string, string, string];
export type ReviewRow = ReviewRowValues & { readonly entityId: string };
export type EditableColumn = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9 | 10;
export type FilterKind = 'text' | 'number' | 'date' | 'select';
type TextFilterOperator = 'contains' | 'notContains' | 'startsWith' | 'empty';
type NumberFilterOperator = 'equals' | 'notEquals' | 'greaterThan' | 'lessThan';
type DateFilterOperator = 'equals' | 'before' | 'after' | 'period';
type SelectFilterOperator = 'equals' | 'notEquals' | 'selected' | 'notSelected';
export type ReviewFilterOperator = TextFilterOperator | NumberFilterOperator | DateFilterOperator | SelectFilterOperator;

const baseRows: readonly ReviewRowValues[] = [
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

export const rows: readonly ReviewRow[] = Array.from({ length: 12 }, (_, batchIndex) => (
  baseRows.map((sourceRow, rowIndex) => {
    const sequence = (batchIndex * baseRows.length) + rowIndex + 1;
    const row = [...sourceRow] as ReviewRowValues;
    row[0] = `POS-${String(sequence).padStart(3, '0')}`;
    if (batchIndex > 0) row[1] = `${sourceRow[1]} · партия ${batchIndex + 1}`;
    row[3] = sourceRow[3] + (batchIndex * 2);
    row[5] = sourceRow[5] + (batchIndex * 1250);
    row[7] = `Вх. ${233 + sequence - 1}-${500 + sequence - 1}`;
    return Object.assign(row, { entityId: `review-row-${sequence}` }) as ReviewRow;
  })
)).flat();

export const reviewColumnIds = {
  drag: 'drag', index: 'index', selection: 'selection', position: 'position', name: 'name',
  grade: 'grade', quantity: 'quantity', unit: 'unit', price: 'price', sum: 'sum', delivery: 'delivery',
  document: 'document', file: 'file', status: 'status', control: 'control', supplier: 'supplier',
} as const;

export const reviewFilterColumnIds = [
  reviewColumnIds.position, reviewColumnIds.name, reviewColumnIds.grade, reviewColumnIds.quantity,
  reviewColumnIds.unit, reviewColumnIds.price, reviewColumnIds.sum, reviewColumnIds.delivery,
  reviewColumnIds.document, reviewColumnIds.file, reviewColumnIds.status, reviewColumnIds.control,
  reviewColumnIds.supplier,
] as const;
export type ReviewFilterColumnId = (typeof reviewFilterColumnIds)[number];

export type ReviewFilterDefinition = {
  kind: FilterKind;
  defaultOperator: ReviewFilterOperator;
  getValue: (row: ReviewRow) => string | number;
  options?: readonly { value: string; label: string }[];
};

function stableValueOptions(values: readonly string[]) {
  return [...new Set(values)].map((value) => ({ value, label: value }));
}

export const reviewFilterRegistry = {
  position: { kind: 'text', defaultOperator: 'contains', getValue: (row) => row[0] },
  name: { kind: 'text', defaultOperator: 'contains', getValue: (row) => row[1] },
  grade: { kind: 'text', defaultOperator: 'contains', getValue: (row) => row[2] },
  quantity: { kind: 'number', defaultOperator: 'equals', getValue: (row) => row[3] },
  unit: { kind: 'select', defaultOperator: 'equals', getValue: (row) => row[4], options: stableValueOptions(rows.map((row) => row[4])) },
  price: { kind: 'number', defaultOperator: 'equals', getValue: (row) => row[5] },
  sum: { kind: 'number', defaultOperator: 'equals', getValue: (row) => row[3] * row[5] },
  delivery: { kind: 'date', defaultOperator: 'equals', getValue: (row) => row[6] },
  document: { kind: 'text', defaultOperator: 'contains', getValue: (row) => row[7] },
  file: { kind: 'text', defaultOperator: 'contains', getValue: () => 'Спецификация.pdf' },
  status: { kind: 'select', defaultOperator: 'equals', getValue: (row) => row[8], options: stableValueOptions(rows.map((row) => row[8])) },
  control: { kind: 'select', defaultOperator: 'equals', getValue: (row) => row[9], options: stableValueOptions(rows.map((row) => row[9])) },
  supplier: { kind: 'select', defaultOperator: 'equals', getValue: (row) => row[10], options: stableValueOptions(rows.map((row) => row[10])) },
} satisfies Record<ReviewFilterColumnId, ReviewFilterDefinition>;

export type ReviewFilterValue = { operator: ReviewFilterOperator; value: string; range: DateRangeValue };
export type ReviewFilterState = Record<ReviewFilterColumnId, ReviewFilterValue>;

export function emptyDateRange(): DateRangeValue {
  return { start: null, end: null };
}

export function createReviewFilterState(): ReviewFilterState {
  return {
    position: { operator: 'contains', value: '', range: emptyDateRange() },
    name: { operator: 'contains', value: '', range: emptyDateRange() },
    grade: { operator: 'contains', value: '', range: emptyDateRange() },
    quantity: { operator: 'equals', value: '', range: emptyDateRange() },
    unit: { operator: 'equals', value: '', range: emptyDateRange() },
    price: { operator: 'equals', value: '', range: emptyDateRange() },
    sum: { operator: 'equals', value: '', range: emptyDateRange() },
    delivery: { operator: 'equals', value: '', range: emptyDateRange() },
    document: { operator: 'contains', value: '', range: emptyDateRange() },
    file: { operator: 'contains', value: '', range: emptyDateRange() },
    status: { operator: 'equals', value: '', range: emptyDateRange() },
    control: { operator: 'equals', value: '', range: emptyDateRange() },
    supplier: { operator: 'equals', value: '', range: emptyDateRange() },
  };
}

export function isUnaryOperator(operator: ReviewFilterOperator) {
  return operator === 'empty' || operator === 'selected' || operator === 'notSelected';
}

function normalizeReviewText(value: string | number) {
  return String(value).trim().toLocaleLowerCase('ru-RU');
}

export function parseReviewNumber(value: string | number) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const source = value.trim();
  const ungrouped = /^[+-]?\d+(?:[.,]\d+)?$/;
  const grouped = /^[+-]?\d{1,3}([\u0020\u00a0\u202f])\d{3}(?:\1\d{3})*(?:[.,]\d+)?$/;
  if (!ungrouped.test(source) && !grouped.test(source)) return null;
  const normalized = source.replace(/[\u0020\u00a0\u202f]/g, '');
  const parsed = Number(normalized.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function validReviewDateKey(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day, 12);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return (year * 10000) + (month * 100) + day;
}

export function parseReviewDisplayDateKey(value: string | number) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(value).trim());
  return match ? validReviewDateKey(Number(match[3]), Number(match[2]), Number(match[1])) : null;
}

export function parseReviewIsoDateKey(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  return match ? validReviewDateKey(Number(match[1]), Number(match[2]), Number(match[3])) : null;
}

function dateValueKey(value: Date | null) {
  return value ? validReviewDateKey(value.getFullYear(), value.getMonth() + 1, value.getDate()) : null;
}

export function matchesFilterValue(kind: FilterKind, filter: ReviewFilterValue, rowValue: string | number) {
  if (kind === 'text') {
    const row = normalizeReviewText(rowValue);
    const query = normalizeReviewText(filter.value);
    if (filter.operator === 'empty') return row.length === 0;
    if (!query) return true;
    if (filter.operator === 'notContains') return !row.includes(query);
    if (filter.operator === 'startsWith') return row.startsWith(query);
    return row.includes(query);
  }
  if (kind === 'number') {
    const row = parseReviewNumber(rowValue);
    const query = parseReviewNumber(filter.value);
    if (query === null) return true;
    if (row === null) return false;
    if (filter.operator === 'notEquals') return row !== query;
    if (filter.operator === 'greaterThan') return row > query;
    if (filter.operator === 'lessThan') return row < query;
    return row === query;
  }
  if (kind === 'date') {
    const row = parseReviewDisplayDateKey(rowValue);
    if (filter.operator === 'period') {
      const start = dateValueKey(filter.range.start);
      const end = dateValueKey(filter.range.end);
      if (start === null || end === null || start > end) return true;
      return row !== null && row >= start && row <= end;
    }
    const query = parseReviewIsoDateKey(filter.value);
    if (query === null) return true;
    if (row === null) return false;
    if (filter.operator === 'before') return row < query;
    if (filter.operator === 'after') return row > query;
    return row === query;
  }
  const row = normalizeReviewText(rowValue);
  const query = normalizeReviewText(filter.value);
  if (filter.operator === 'selected') return row.length > 0;
  if (filter.operator === 'notSelected') return row.length === 0;
  if (!query) return true;
  return filter.operator === 'notEquals' ? row !== query : row === query;
}

export function matchesReviewFilters(row: ReviewRow, filters: ReviewFilterState) {
  return reviewFilterColumnIds.every((columnId) => {
    const definition = reviewFilterRegistry[columnId];
    return matchesFilterValue(definition.kind, filters[columnId], definition.getValue(row));
  });
}

export type ReviewSortableColumnId =
  | typeof reviewColumnIds.position | typeof reviewColumnIds.name | typeof reviewColumnIds.grade
  | typeof reviewColumnIds.quantity | typeof reviewColumnIds.unit | typeof reviewColumnIds.price
  | typeof reviewColumnIds.sum | typeof reviewColumnIds.delivery | typeof reviewColumnIds.document
  | typeof reviewColumnIds.status | typeof reviewColumnIds.control | typeof reviewColumnIds.supplier;
type ActiveReviewSortDirection = Exclude<TableSortDirection, 'none'>;
export type ReviewSortState = { columnId: ReviewSortableColumnId; direction: ActiveReviewSortDirection } | null;

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
  if (columnId === reviewColumnIds.status) return row[8];
  if (columnId === reviewColumnIds.control) return row[9];
  return row[10];
}

function compareReviewSortValues(left: string | number, right: string | number): number {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return reviewRowCollator.compare(String(left), String(right));
}

export function filterAndSortReviewRows(orderedRows: readonly ReviewRow[], filters: ReviewFilterState, sort: ReviewSortState) {
  const filteredRows = orderedRows.filter((row) => matchesReviewFilters(row, filters));
  if (!sort) return filteredRows;
  const direction = sort.direction === 'ascending' ? 1 : -1;
  return filteredRows
    .map((row, originalIndex) => ({ row, originalIndex }))
    .sort((left, right) => {
      const comparison = compareReviewSortValues(reviewSortValue(left.row, sort.columnId), reviewSortValue(right.row, sort.columnId));
      return comparison === 0 ? left.originalIndex - right.originalIndex : comparison * direction;
    })
    .map(({ row }) => row);
}

export function cloneReviewRow(row: ReviewRow): ReviewRow {
  return Object.assign([...row] as ReviewRowValues, { entityId: row.entityId }) as ReviewRow;
}

/** Package-internal executable predicate surface. It is intentionally absent from package exports. */
export const widgetTableFilterTestApi = {
  createState: createReviewFilterState,
  filterAndSort: filterAndSortReviewRows,
  matchesValue: matchesFilterValue,
  matchesRow: matchesReviewFilters,
  parseNumber: parseReviewNumber,
  parseDisplayDate: parseReviewDisplayDateKey,
  parseIsoDate: parseReviewIsoDateKey,
  rows,
};
