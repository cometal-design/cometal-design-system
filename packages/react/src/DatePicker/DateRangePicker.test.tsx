import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker contract', () => {
  it('serializes its normalized range as one ISO interval form value', () => {
    const html = renderToStaticMarkup(
      <DateRangePicker
        label="Период поставки"
        name="deliveryPeriod"
        value={{ start: new Date(2026, 6, 23), end: new Date(2026, 6, 15) }}
      />,
    );

    expect(html).toContain('name="deliveryPeriod"');
    expect(html).toContain('value="2026-07-15/2026-07-23"');
    expect(html).toContain('data-cometal-icon-library="outline"');
  });

  it('accepts the same input ref contract as the other field controls', () => {
    const inputRef = createRef<HTMLInputElement>();
    expect(() => renderToStaticMarkup(
      <DateRangePicker ref={inputRef} label="Период поставки" />,
    )).not.toThrow();
  });

  it('accepts the canonical S size and defers its open portal until hydration', () => {
    const html = renderToStaticMarkup(<DateRangePicker label="Период поставки" size="s" open />);
    expect(html).toContain('data-size="s"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).not.toContain('role="dialog"');
  });
});
