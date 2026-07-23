import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Checkbox, RadioButton, Switch } from './Selection';

describe('Selection controls', () => {
  it('renders a native checkbox and marks the mixed visual state', () => {
    const html = renderToStaticMarkup(<Checkbox label="Выбрать всё" indeterminate />);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('data-indeterminate="true"');
    expect(html).toContain('Выбрать всё');
  });

  it('renders a native grouped radio', () => {
    const html = renderToStaticMarkup(<RadioButton label="Без НДС" name="vat" value="none" />);
    expect(html).toContain('type="radio"');
    expect(html).toContain('name="vat"');
    expect(html).toContain('value="none"');
  });

  it('renders switch semantics over a native checkbox', () => {
    const html = renderToStaticMarkup(<Switch label="Получать уведомления" defaultChecked />);
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('checked=""');
  });
});
