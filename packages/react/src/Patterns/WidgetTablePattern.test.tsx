import { describe, expect, it } from 'vitest';
import { widgetTableFilterTestApi } from './WidgetTablePattern';

const range = { start: null, end: null };
const filter = (operator: Parameters<typeof widgetTableFilterTestApi.matchesValue>[1]['operator'], value = '') => ({
  operator,
  value,
  range,
});

describe('WidgetTablePattern M3 filter contract', () => {
  it('parses Russian grouped decimals strictly and rejects invalid input', () => {
    expect(widgetTableFilterTestApi.parseNumber('1 234,50')).toBe(1234.5);
    expect(widgetTableFilterTestApi.parseNumber('1\u00a0234,50')).toBe(1234.5);
    expect(widgetTableFilterTestApi.parseNumber('1\u202f234.50')).toBe(1234.5);
    expect(widgetTableFilterTestApi.parseNumber('-42,25')).toBe(-42.25);
    expect(widgetTableFilterTestApi.parseNumber('12,3,4')).toBeNull();
    expect(widgetTableFilterTestApi.parseNumber('12 кг')).toBeNull();
    expect(widgetTableFilterTestApi.parseNumber('1e4')).toBeNull();
    expect(widgetTableFilterTestApi.parseNumber('')).toBeNull();
  });

  it('executes every text and select operator with inactive empty binary values', () => {
    expect(widgetTableFilterTestApi.matchesValue('text', filter('contains', ' ЛИСТ '), 'Лист стальной')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('text', filter('notContains', 'лист'), 'Труба')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('text', filter('startsWith', 'лист'), 'Лист стальной')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('text', filter('empty'), '   ')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('text', filter('contains'), 'Любое значение')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('select', filter('equals', 'Т'), 'т')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('select', filter('notEquals', 'шт'), 'т')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('select', filter('selected'), 'т')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('select', filter('notSelected'), ' ')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('select', filter('equals'), 'т')).toBe(true);
  });

  it('executes every numeric operator and leaves invalid or empty input inactive', () => {
    expect(widgetTableFilterTestApi.matchesValue('number', filter('equals', '24'), 24)).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('number', filter('notEquals', '23'), 24)).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('number', filter('greaterThan', '23,5'), 24)).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('number', filter('lessThan', '24,5'), 24)).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('number', filter('equals', ''), 24)).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('number', filter('equals', '24x'), 24)).toBe(true);
  });

  it('parses strict calendar dates and executes equality, ordering and inclusive periods', () => {
    expect(widgetTableFilterTestApi.parseDisplayDate('21.08.2026')).toBe(20260821);
    expect(widgetTableFilterTestApi.parseIsoDate('2026-08-21')).toBe(20260821);
    expect(widgetTableFilterTestApi.parseDisplayDate('31.02.2026')).toBeNull();
    expect(widgetTableFilterTestApi.parseIsoDate('2026-02-31')).toBeNull();
    expect(widgetTableFilterTestApi.matchesValue('date', filter('equals', '2026-08-21'), '21.08.2026')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('date', filter('before', '2026-08-22'), '21.08.2026')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('date', filter('after', '2026-08-20'), '21.08.2026')).toBe(true);
    const inclusive = { operator: 'period' as const, value: '', range: { start: new Date(2026, 7, 21), end: new Date(2026, 7, 24) } };
    expect(widgetTableFilterTestApi.matchesValue('date', inclusive, '21.08.2026')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('date', inclusive, '24.08.2026')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('date', inclusive, '25.08.2026')).toBe(false);
    expect(widgetTableFilterTestApi.matchesValue('date', { ...inclusive, range: { start: new Date(2026, 7, 24), end: null } }, '25.08.2026')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('date', { ...inclusive, range: { start: new Date(2026, 7, 24), end: new Date(2026, 7, 21) } }, '25.08.2026')).toBe(true);
    expect(widgetTableFilterTestApi.matchesValue('date', filter('equals', '2026-08-21'), 'invalid')).toBe(false);
  });

  it('applies all thirteen registered filters with AND composition and column-scoped Position', () => {
    const state = widgetTableFilterTestApi.createState();
    state.position.value = 'POS-001';
    state.name.value = 'горячекатаный';
    state.grade.value = '09Г2С';
    state.quantity.value = '24';
    state.unit.value = 'т';
    state.price.value = '86 400';
    state.sum.value = '2 073 600';
    state.delivery.value = '2026-08-21';
    state.document.value = '233-500';
    state.file.value = 'pdf';
    state.status.value = 'Согласован';
    state.control.value = 'Комплектность';
    state.supplier.value = 'Северсталь';
    expect(widgetTableFilterTestApi.filterAndSort(widgetTableFilterTestApi.rows, state, null).map((row) => row[0])).toEqual(['POS-001']);

    const scoped = widgetTableFilterTestApi.createState();
    scoped.position.value = 'Северсталь';
    expect(widgetTableFilterTestApi.filterAndSort(widgetTableFilterTestApi.rows, scoped, null)).toHaveLength(0);

    const file = widgetTableFilterTestApi.createState();
    file.file.value = 'xlsx';
    expect(widgetTableFilterTestApi.filterAndSort(widgetTableFilterTestApi.rows, file, null)).toHaveLength(0);
  });

  it('filters before stable M2 sorting and preserves current source order for ties', () => {
    const state = widgetTableFilterTestApi.createState();
    state.status.value = 'Согласован';
    const result = widgetTableFilterTestApi.filterAndSort(widgetTableFilterTestApi.rows, state, { columnId: 'unit', direction: 'ascending' });
    expect(result).toHaveLength(36);
    expect(result.slice(0, 5).map((row) => row[0])).toEqual(['POS-001', 'POS-009', 'POS-011', 'POS-019', 'POS-021']);
    expect(result.slice(-3).map((row) => row[0])).toEqual(['POS-094', 'POS-104', 'POS-114']);
  });
});
