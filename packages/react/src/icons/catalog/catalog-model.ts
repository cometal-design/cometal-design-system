import type { IconManifestRecord, IconModule } from '../runtime/types';

export const ICON_CATALOG_PAGE_SIZE = 120;

export interface IconCatalogFilters {
  readonly library?: string;
  readonly family?: string;
  readonly category?: string;
}

export interface IconCatalogFilterOption {
  readonly value: string;
  readonly count: number;
}

export interface ClipboardWriter {
  writeText(value: string): Promise<void>;
}

export function normalizeIconSearch(value: string): string {
  return value.normalize('NFKC').toLocaleLowerCase('en-US').trim();
}

export function iconCategory(record: IconManifestRecord): string {
  return record.categoryPath.join(' / ');
}

function searchRank(record: IconManifestRecord, query: string): number {
  if (!query) return 0;
  const name = normalizeIconSearch(record.canonicalName);
  if (name === query) return 0;
  if (name.startsWith(query)) return 1;
  if (name.includes(query)) return 2;
  return Number.POSITIVE_INFINITY;
}

export function filterIconRecords(
  records: readonly IconManifestRecord[],
  search: string,
  filters: IconCatalogFilters = {},
): IconManifestRecord[] {
  const query = normalizeIconSearch(search);
  return records
    .map((record) => ({ record, rank: searchRank(record, query) }))
    .filter(({ record, rank }) => Number.isFinite(rank)
      && (!filters.library || record.library === filters.library)
      && (!filters.family || record.family === filters.family)
      && (!filters.category || iconCategory(record) === filters.category))
    .sort((left, right) => left.rank - right.rank || left.record.canonicalName.localeCompare(right.record.canonicalName, 'en-US'))
    .map(({ record }) => record);
}

function options(values: readonly string[]): IconCatalogFilterOption[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort(([left], [right]) => left.localeCompare(right, 'en-US')).map(([value, count]) => ({ value, count }));
}

export function getIconCatalogFilterOptions(
  records: readonly IconManifestRecord[],
  search: string,
  filters: IconCatalogFilters,
) {
  return {
    libraries: options(filterIconRecords(records, search, { family: filters.family, category: filters.category }).map((record) => record.library)),
    families: options(filterIconRecords(records, search, { library: filters.library, category: filters.category }).map((record) => record.family)),
    categories: options(filterIconRecords(records, search, { library: filters.library, family: filters.family }).map(iconCategory)),
  };
}

export function paginateIconRecords(records: readonly IconManifestRecord[], page: number, pageSize = ICON_CATALOG_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  return {
    page: safePage,
    pageCount,
    records: records.slice((safePage - 1) * pageSize, safePage * pageSize),
  };
}

export function iconImportSnippet(record: IconManifestRecord): string {
  const localName = `Icon${record.canonicalName.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).map((part) => part[0]?.toUpperCase() + part.slice(1)).join('')}`;
  return `import ${localName} from '${record.importPath}';`;
}

export async function copyCatalogValue(value: string, clipboard?: ClipboardWriter): Promise<void> {
  if (!clipboard) throw new Error('Clipboard API недоступен. Скопируйте видимый текст вручную.');
  await clipboard.writeText(value);
}

export type CatalogLoaderMap = Readonly<Record<string, () => Promise<IconModule>>>;
