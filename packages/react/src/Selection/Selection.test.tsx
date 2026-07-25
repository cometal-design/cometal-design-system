import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Checkbox, RadioButton, Switch } from './Selection';

describe('Selection controls', () => {
  it('renders a native checkbox and marks the mixed visual state', () => {
    const html = renderToStaticMarkup(<Checkbox label="Выбрать всё" indeterminate />);

    expect(html).toContain('data-cometal-component="checkbox"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('data-indeterminate="true"');
    expect(html).toContain('viewBox="0 0 20 20"');
    expect(html).toContain('stroke-width="1.6"');
    expect(html).toContain('Выбрать всё');
  });

  it('uses the approved discrete checkmark geometry for every size', () => {
    const medium = renderToStaticMarkup(<Checkbox label="M" size="m" defaultChecked />);
    const small = renderToStaticMarkup(<Checkbox label="S" size="s" defaultChecked />);

    expect(medium).toContain('viewBox="0 0 16 16"');
    expect(medium).toContain('M4.5 7.88L6.74 10.12L11.5 5.08');
    expect(small).toContain('viewBox="0 0 14 14"');
    expect(small).toContain('M4 6.84L5.92 8.76L10 4.44');
  });

  it('renders a native grouped radio', () => {
    const html = renderToStaticMarkup(<RadioButton label="Без НДС" name="vat" value="none" />);

    expect(html).toContain('data-cometal-component="radio-button"');
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="vat"');
    expect(html).toContain('value="none"');
  });

  it('renders switch semantics over a native checkbox', () => {
    const html = renderToStaticMarkup(<Switch label="Получать уведомления" defaultChecked />);

    expect(html).toContain('data-cometal-component="switch"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('checked=""');
  });
});
