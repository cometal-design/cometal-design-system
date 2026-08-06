import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Combobox, MultiSelect, Select, TextArea, TextField } from './Field';

describe('Fields', () => {
  it('renders a native text input with its visible label and error semantics', () => {
    const html = renderToStaticMarkup(<TextField label="ИНН" error="Проверьте значение" name="inn" />);

    expect(html).toContain('data-cometal-component="field"');
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
    expect(multi).toContain('role="combobox"');
    expect(multi).toContain('aria-haspopup="listbox"');
    expect(multi).toContain('cometal-field__tags-measure');
  });

  it('keeps listbox options out of the Tab sequence', () => {
    const select = renderToStaticMarkup(<Select label="Статус" expanded options={[{ value: 'active', label: 'Активный' }]} />);
    const combobox = renderToStaticMarkup(<Combobox label="Контрагент" defaultValue="north" expanded options={[{ value: 'north', label: 'Северсталь' }]} />);
    expect(select).toContain('role="option"');
    expect(combobox).toContain('role="option"');
    expect(select).toContain('tabindex="-1"');
    expect(combobox).toContain('tabindex="-1"');
    expect(select).toContain('aria-hidden="true"');
    expect((select.match(/role="combobox"/g) ?? [])).toHaveLength(1);
  });

  it('does not preactivate listbox options before pointer or keyboard input', () => {
    const options = [{ value: 'severstal', label: 'Северсталь' }];
    const select = renderToStaticMarkup(<Select label="Статус" expanded options={options} />);
    const combobox = renderToStaticMarkup(<Combobox label="Контрагент" defaultValue="сталь" expanded options={options} />);
    const multiSelect = renderToStaticMarkup(<MultiSelect label="Контрагенты" expanded options={options} />);

    expect(select).not.toContain('data-active');
    expect(combobox).not.toContain('data-active');
    expect(multiSelect).not.toContain('data-active');
  });

  it('keeps Multi Select labels visual and active state free of non-Figma glyphs', () => {
    const html = renderToStaticMarkup(
      <MultiSelect
        label="Контрагенты"
        expanded
        selectedValues={['severstal', 'mmk']}
        options={[
          { value: 'severstal', label: 'Северсталь' },
          { value: 'mmk', label: 'ММК' },
        ]}
      />,
    );
    expect(html).toContain('Северсталь');
    expect(html).toContain('ММК');
    expect(html).not.toContain('✓');
    expect(html).toContain('aria-multiselectable="true"');
  });
});
