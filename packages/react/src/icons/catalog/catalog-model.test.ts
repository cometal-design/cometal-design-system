import { describe, expect, it, vi } from 'vitest';
import { iconManifest } from '../generated/manifest';
import {
  ICON_CATALOG_PAGE_SIZE,
  copyCatalogValue,
  filterIconRecords,
  getIconCatalogFilterOptions,
  iconImportSnippet,
  normalizeIconSearch,
  paginateIconRecords,
} from './catalog-model';

describe('IconCatalog model', () => {
  it('ranks exact, prefix, and partial matches without changing identity', () => {
    const exact = filterIconRecords(iconManifest, 'payment/lg/Visa');
    expect(exact[0].canonicalName).toBe('payment/lg/Visa');
    expect(filterIconRecords(iconManifest, 'outline/arrows/arrow-curve').some((record) => record.canonicalName === 'Outline/arrows/arrow-curve-left-down')).toBe(true);
    expect(filterIconRecords(iconManifest, 'curve-left').some((record) => record.canonicalName === 'Outline/arrows/arrow-curve-left-down')).toBe(true);
    expect(normalizeIconSearch('  PAYMENT/LG/VISA  ')).toBe('payment/lg/visa');
  });

  it('derives filters and counts from the generated manifest', () => {
    const options = getIconCatalogFilterOptions(iconManifest, '', {});
    expect(options.libraries).toEqual([
      { value: 'feature-icons-and-logos', count: 1058 },
      { value: 'filled', count: 877 },
      { value: 'outline', count: 875 },
    ]);
    expect(options.families.find((option) => option.value === 'payment')?.count).toBe(117);
    expect(filterIconRecords(iconManifest, '', { family: 'payment' })).toHaveLength(117);
  });

  it('pages every record exactly once in deterministic groups of 120', () => {
    const traversed = [];
    const pageCount = Math.ceil(iconManifest.length / ICON_CATALOG_PAGE_SIZE);
    for (let page = 1; page <= pageCount; page += 1) traversed.push(...paginateIconRecords(iconManifest, page).records);
    expect(traversed).toHaveLength(2810);
    expect(new Set(traversed.map((record) => record.canonicalName)).size).toBe(2810);
    expect(paginateIconRecords(iconManifest, 1).records).toHaveLength(120);
    expect(paginateIconRecords(iconManifest, pageCount).records).toHaveLength(50);
  });

  it('generates import snippets and handles clipboard success and denial', async () => {
    const visa = iconManifest.find((record) => record.canonicalName === 'payment/lg/Visa');
    expect(visa).toBeDefined();
    expect(iconImportSnippet(visa!)).toBe("import IconPaymentLgVisa from '@cometal/react/icons/feature-icons-and-logos/payment/lg/visa';");
    const writeText = vi.fn().mockResolvedValue(undefined);
    await copyCatalogValue(visa!.canonicalName, { writeText });
    expect(writeText).toHaveBeenCalledWith('payment/lg/Visa');
    await expect(copyCatalogValue('value')).rejects.toThrow(/Clipboard API/);
    await expect(copyCatalogValue('value', { writeText: vi.fn().mockRejectedValue(new Error('denied')) })).rejects.toThrow('denied');
  });
});
