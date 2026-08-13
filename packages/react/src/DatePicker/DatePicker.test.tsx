import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DatePicker, formatDisplayDate, parseDisplayDate, parseIsoDate } from './DatePicker';

describe('DatePicker date model', () => {
  it('parses and formats dates without timezone conversion', () => {
    expect(formatDisplayDate('2026-07-15')).toBe('15.07.2026');
    expect(parseDisplayDate('15.07.2026')?.getMonth()).toBe(6);
    expect(parseIsoDate('2026-02-29')).toBeNull();
    expect(parseDisplayDate('31.02.2026')).toBeNull();
  });

  it('renders edit mode with linked input, trigger and ISO form value', () => {
    const html = renderToStaticMarkup(
      <DatePicker label="Дата поставки" name="deliveryDate" value="2026-07-15" helperText="Выберите дату" />,
    );
    expect(html).toContain('data-cometal-component="date-picker"');
    expect(html).toContain('value="15.07.2026"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('name="deliveryDate"');
    expect(html).toContain('value="2026-07-15"');
    expect(html).toContain('stroke-width="var(--cometal-primitive-stroke-140)"');
  });

  it('renders the open calendar as a labelled grid with the complete visible weeks', () => {
    const html = renderToStaticMarkup(
      <DatePicker label="Дата поставки" value="2026-07-15" today="2026-07-31" open />,
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('role="grid"');
    expect(html).toContain('Июль 2026');
    expect((html.match(/role="gridcell"/g) ?? [])).toHaveLength(35);
    expect(html).toContain('data-selected="true"');
    expect(html).toContain('data-today="true"');
  });

  it('renders read mode without any interactive controls', () => {
    const html = renderToStaticMarkup(<DatePicker label="Дата поставки" value="2026-07-15" mode="read" />);
    expect(html).toContain('15 июля 2026');
    expect(html).not.toContain('<button');
    expect(html).not.toContain('<input');
  });
});
