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

  it('exposes the shared S control size for single-line fields', () => {
    const textField = renderToStaticMarkup(<TextField label="ИНН" size="s" />);
    const select = renderToStaticMarkup(<Select label="Статус" size="s" options={[]} />);
    const combobox = renderToStaticMarkup(<Combobox label="Контрагент" size="s" />);

    expect(textField).toContain('data-size="s"');
    expect(select).toContain('data-size="s"');
    expect(combobox).toContain('data-size="s"');
  });

  it('keeps S outside the multiline and multi-value public contracts', () => {
    // @ts-expect-error TextArea intentionally supports only L and M.
    const textArea = <TextArea label="Комментарий" size="s" />;
    // @ts-expect-error MultiSelect intentionally supports only L and M.
    const multiSelect = <MultiSelect label="Контрагенты" size="s" />;

    expect(textArea.props.size).toBe('s');
    expect(multiSelect.props.size).toBe('s');
  });

  it('keeps native textarea and select semantics', () => {
    const textarea = renderToStaticMarkup(<TextArea label="Комментарий" maxLength={500} showCounter defaultValue="Текст" />);
    const select = renderToStaticMarkup(<Select label="Статус" defaultValue="active" options={[{ value: 'active', label: 'Активный' }]} />);
    expect(textarea).toContain('<textarea');
    expect(textarea).toContain('5 / 500');
    expect(select).toContain('<select');
    expect(select).toContain('Активный');
    expect(select).toContain('stroke-width="var(--cometal-primitive-stroke-140, 1.4)"');
  });

  it('points field chevrons down when closed and up when their listbox is open', () => {
    const options = [{ value: 'active', label: 'Активный' }];
    const closedSelect = renderToStaticMarkup(<Select label="Статус" options={options} />);
    const openSelect = renderToStaticMarkup(<Select label="Статус" options={options} expanded />);
    const closedMultiSelect = renderToStaticMarkup(<MultiSelect label="Статусы" options={options} />);
    const openMultiSelect = renderToStaticMarkup(<MultiSelect label="Статусы" options={options} expanded />);

    expect(closedSelect).toContain('data-chevron-direction="down"');
    expect(openSelect).toContain('data-chevron-direction="up"');
    expect(closedMultiSelect).toContain('data-chevron-direction="down"');
    expect(openMultiSelect).toContain('data-chevron-direction="up"');
  });

  it('exposes combobox and multi-select popup semantics', () => {
    const combobox = renderToStaticMarkup(<Combobox label="Контрагент" listboxId="contractors" expanded />);
    const multi = renderToStaticMarkup(<MultiSelect label="Контрагенты" selectedValues={['Северсталь', 'НЛМК', 'ММК']} />);
    expect(combobox).toContain('role="combobox"');
    expect(combobox).toContain('aria-haspopup="listbox"');
    expect(combobox).toContain('aria-controls="contractors"');
    expect(multi).toContain('role="combobox"');
    expect(multi).toContain('aria-haspopup="listbox"');
    expect(multi).toContain('cometal-field__tags-measure');
  });

  it('caps visible combobox suggestions without limiting its search source', () => {
    const html = renderToStaticMarkup(
      <Combobox
        label="Иконка"
        defaultValue="icon"
        expanded
        maxVisibleOptions={2}
        options={[
          { value: 'icon-a', label: 'icon-a' },
          { value: 'icon-b', label: 'icon-b' },
          { value: 'icon-c', label: 'icon-c' },
        ]}
      />,
    );

    expect((html.match(/role="option"/g) ?? [])).toHaveLength(2);
    expect(html).toContain('icon-a');
    expect(html).toContain('icon-b');
    expect(html).not.toContain('icon-c');
  });

  it('uses the generated Outline X icon for the default filled combobox clear action', () => {
    const html = renderToStaticMarkup(
      <Combobox label="Поиск" type="search" defaultValue="Visa" clearLabel="Очистить поиск" />,
    );

    expect(html).toContain('aria-label="Очистить поиск"');
    expect(html).toContain('data-cometal-icon-library="outline"');
    expect(html).toContain('data-cometal-icon-stroke-scaling="marked-elements"');
    expect(html).toContain('cometal-field__clear');
  });

  it('allows products to explicitly disable the filled combobox clear action', () => {
    const html = renderToStaticMarkup(<Combobox label="Поиск" defaultValue="Visa" clearable={false} />);
    expect(html).not.toContain('cometal-field__clear');
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
