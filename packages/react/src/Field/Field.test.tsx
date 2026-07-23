import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Combobox, MultiSelect, Select, TextArea, TextField } from './Field';

describe('Fields', () => {
  it('renders a native text input with its visible label and error semantics', () => {
    const html = renderToStaticMarkup(<TextField label="ИНН" error="Проверьте значение" name="inn" />);
    expect(html).toContain('<input');
    expect(html).toContain('name="inn"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('Проверьте значение');
  });

  it('renders read mode without an interactive control', () => {
    const html = renderToStaticMarkup(<TextField label="Контрагент" mode="read" readValue="ООО Северсталь" />);
    expect(html).not.toContain('<input');
    expect(html).toContain('ООО Северсталь');
  });

  it('keeps native textarea and select semantics', () => {
    const textarea = renderToStaticMarkup(<TextArea label="Комментарий" maxLength={500} showCounter defaultValue="Текст" />);
    const select = renderToStaticMarkup(<Select label="Статус" defaultValue="active" options={[{ value: 'active', label: 'Активный' }]} />);
    expect(textarea).toContain('<textarea');
    expect(textarea).toContain('5 / 500');
    expect(select).toContain('<select');
    expect(select).toContain('Активный');
  });

  it('exposes combobox and multi-select popup semantics', () => {
    const combobox = renderToStaticMarkup(<Combobox label="Контрагент" listboxId="contractors" expanded />);
    const multi = renderToStaticMarkup(<MultiSelect label="Контрагенты" selectedValues={['Северсталь', 'НЛМК', 'ММК']} />);
    expect(combobox).toContain('role="combobox"');
    expect(combobox).toContain('aria-controls="contractors"');
    expect(multi).toContain('aria-haspopup="listbox"');
    expect(multi).toContain('+1');
  });
});
