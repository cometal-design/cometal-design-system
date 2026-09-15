import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Combobox, MultiSelect, Select, TextArea, TextField } from './Field';
import { computeAnchoredOverlayPosition } from '../internal/overlay';

describe('Fields', () => {
  it.each([320, 768, 1440])('keeps anchored overlays shifted and flipped inside a %ipx viewport', (viewportWidth) => {
    const width = Math.min(296, viewportWidth - 16);
    const anchorRect = {
      left: viewportWidth - 28,
      right: viewportWidth - 8,
      top: 550,
      bottom: 582,
      width: 20,
      height: 32,
    };
    const position = computeAnchoredOverlayPosition({
      anchorRect,
      surfaceWidth: width,
      surfaceHeight: 240,
      viewportLeft: 0,
      viewportTop: 0,
      viewportWidth,
      viewportHeight: 640,
      gap: 4,
      viewportInset: 8,
      matchAnchorWidth: false,
    });

    expect(position.placement).toBe('top-start');
    expect(position.left).toBe(viewportWidth - 8 - width);
    expect(position.left).toBeGreaterThanOrEqual(8);
    expect(position.top).toBe(306);
    expect(position.top + 240).toBeLessThanOrEqual(632);
  });
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
    expect(select).toContain('data-cometal-icon-library="outline"');
    expect(select).toContain('data-cometal-icon-stroke-scaling="marked-elements"');
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

  it('publishes invalid semantics on the visible Multi Select trigger', () => {
    const html = renderToStaticMarkup(<MultiSelect label="Контрагенты" error="Выберите хотя бы одно значение" />);

    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('Выберите хотя бы одно значение');
  });

  it('keeps capped combobox suggestions out of SSR until a hydrated anchor exists', () => {
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

    expect(html).not.toContain('role="option"');
    expect(html).not.toContain('role="listbox"');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('value="icon"');
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

  it('keeps all hydrated listbox portals out of SSR while preserving controls and native Select value', () => {
    const select = renderToStaticMarkup(<Select label="Статус" expanded options={[{ value: 'active', label: 'Активный' }]} />);
    const combobox = renderToStaticMarkup(<Combobox label="Контрагент" defaultValue="north" expanded options={[{ value: 'north', label: 'Северсталь' }]} />);
    expect(select).not.toContain('role="option"');
    expect(combobox).not.toContain('role="option"');
    expect(combobox).not.toContain('role="listbox"');
    expect(select).toContain('tabindex="-1"');
    expect(combobox).toContain('aria-expanded="true"');
    expect(combobox).toContain('value="north"');
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
    expect(html).not.toContain('role="listbox"');
    expect(html).toContain('aria-expanded="true"');
    expect((html.match(/data-cometal-icon-library="outline"/g) ?? []).length).toBeGreaterThanOrEqual(3);
  });
  it.each([true, false])('preserves controlled/default-expanded SSR state without DOM access (%s)', (controlled) => {
    const expansion = controlled ? { expanded: true } : { defaultExpanded: true };
    const options = [{ value: 'north', label: 'Северсталь' }];
    for (const element of [
      <Combobox id="combo" listboxId="combo-options" label="Поиск" defaultValue="north" options={options} {...expansion} />,
      <MultiSelect id="multi" label="Выбор" selectedValues={['north']} options={options} {...expansion} />,
    ]) {
      const html = renderToStaticMarkup(element);
      expect(html).not.toContain('role="listbox"');
      expect(html).not.toContain('role="option"');
      expect(html).toContain('aria-expanded="true"');
      expect(html).toContain('aria-controls=');
      expect(html).toContain('role="combobox"');
    }
  });
});
