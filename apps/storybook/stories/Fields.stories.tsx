import { StrictMode, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Button, Combobox, DatePicker, DateRangePicker, MultiSelect, Select, TextArea, TextField, fieldSizes } from '@cometal/react';
import { ComponentCodeExample } from './ComponentCodeExample';

const FIGMA_URL = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1096-42';
const SOURCE_URL = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Field/Field.tsx';
const options = [
  { value: 'new', label: 'Новый' },
  { value: 'active', label: 'Активный' },
  { value: 'draft', label: 'Черновик' },
  { value: 'approval', label: 'На согласовании' },
  { value: 'waiting', label: 'Ожидает данных' },
  { value: 'processing', label: 'В работе' },
  { value: 'paused', label: 'Приостановлен' },
  { value: 'completed', label: 'Завершён' },
  { value: 'rejected', label: 'Отклонён' },
  { value: 'cancelled', label: 'Отменён' },
  { value: 'expired', label: 'Просрочен' },
  { value: 'archived', label: 'Архивный', disabled: true },
];
const contractorOptions = [
  { value: 'severstal', label: 'Северсталь' },
  { value: 'nlmk', label: 'НЛМК' },
  { value: 'mmk', label: 'ММК' },
  { value: 'evraz', label: 'Евраз' },
  { value: 'nornickel', label: 'Норникель', disabled: true },
];
const longOptions = Array.from({ length: 16 }, (_, index) => ({
  value: `status-${index + 1}`,
  label: `Статус ${index + 1}`,
}));

function SelectInteractionExample() {
  const [value, setValue] = useState('');
  return (
    <div className="ds-field-story-shell">
      <Select label="Статус" options={options} value={value} onValueChange={setValue} />
      <output aria-live="polite">Выбрано: {value || '—'}</output>
    </div>
  );
}

function SelectPortalContractExample() {
  const [value, setValue] = useState('');
  return (
    <div style={{ width: 224, height: 96, overflow: 'hidden' }} data-overlay-clip-root>
      <Select label="Статус" size="s" options={options} value={value} onValueChange={setValue} />
    </div>
  );
}

function FocusModalityMatrixExample() {
  const [mounted, setMounted] = useState(true);
  return <>
    <Button size="s" variant="secondary" onClick={() => setMounted(false)}>Unmount modality matrix</Button>
    {mounted ? <StrictMode><div className="ds-fields-playground" data-modality-matrix>
      <TextField label="Modality TextField" />
      <TextArea label="Modality TextArea" />
      <Select label="Modality Select" options={options} />
      <Combobox label="Modality Combobox" options={contractorOptions} />
      <MultiSelect label="Modality MultiSelect" options={contractorOptions} />
      <DatePicker label="Modality Date" />
      <DateRangePicker label="Modality Range" />
    </div></StrictMode> : null}
  </>;
}

function MultiSelectInteractionExample() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <div className="ds-field-story-shell">
      <MultiSelect label="Контрагенты" selectedValues={values} options={contractorOptions} onSelectedValuesChange={setValues} />
      <output aria-live="polite">Выбрано: {values.join(', ') || '—'}</output>
    </div>
  );
}

function MultiSelectResponsiveExample() {
  const [narrow, setNarrow] = useState(false);
  return (
    <div className="ds-field-responsive-demo">
      <Button variant="secondary" size="s" onClick={() => setNarrow((current) => !current)}>
        Сузить поле
      </Button>
      <div className={`ds-field-story-shell${narrow ? ' ds-field-story-shell--narrow' : ''}`}>
        <MultiSelect
          label="Контрагенты"
          selectedValues={['severstal', 'nlmk', 'mmk', 'evraz']}
          options={contractorOptions}
        />
      </div>
    </div>
  );
}

function ComboboxInteractionExample() {
  const [value, setValue] = useState('');
  return (
    <div className="ds-field-story-shell">
      <Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} clearable onClear={() => setValue('')} onOptionSelect={setValue} />
      <output aria-live="polite">Выбрано: {value || '—'}</output>
    </div>
  );
}

function FieldsDocumentation() {
  return (
    <main className="ds-component-page">
      <header className="ds-component-hero"><div><span className="ds-eyebrow">COMPONENT GROUP · WEB · IN REVIEW</span><h1>Fields</h1><p>Пять публичных компонентов. Общая визуальная оболочка не объединяет разные browser semantics в один универсальный API.</p></div><a href={FIGMA_URL} target="_blank" rel="noreferrer">Открыть Fields в Figma ↗</a></header>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>01</span><div><h2>Состав family</h2><p>Edit и Read показаны рядом. Read полностью убирает интерактивную оболочку.</p></div></div><div className="ds-field-family">
        <article><header><code>TextField</code><span>input</span></header><div><TextField label="Название поля" placeholder="Введите значение" helperText="Подсказка или описание" /><TextField label="Название поля" mode="read" readValue="ООО Северсталь" /></div></article>
        <article><header><code>TextArea</code><span>textarea</span></header><div><TextArea label="Комментарий" placeholder="Введите комментарий" rows={4} /><TextArea label="Комментарий" mode="read" readValue={<>Условия поставки согласованы.<br />Оплата в течение 10 дней.</>} /></div></article>
        <article><header><code>Select</code><span>select</span></header><div><Select label="Статус" options={options} defaultValue="" /><Select label="Статус" options={options} mode="read" readValue="Активный" /></div></article>
        <article><header><code>Combobox</code><span>input + listbox pattern</span></header><div><Combobox label="Контрагент" placeholder="Найдите значение" defaultValue="Северсталь" /><Combobox label="Контрагент" mode="read" readValue="ООО Северсталь" /></div></article>
        <article><header><code>MultiSelect</code><span>button + listbox pattern</span></header><div><MultiSelect label="Контрагенты" selectedValues={['Северсталь', 'НЛМК', 'ММК']} /><MultiSelect label="Контрагенты" selectedValues={['Северсталь', 'НЛМК', 'ММК']} mode="read" /></div></article>
      </div></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Размеры однострочных controls</h2><p>Text Field, Select и Combobox используют общую шкалу S 32px, M 40px и L 48px. Text Area и Multi Select остаются в M/L.</p></div></div><div className="ds-field-size-grid">
        {fieldSizes.map((size) => <article key={size}><code>{size.toUpperCase()} · {size === 'l' ? '48' : size === 'm' ? '40' : '32'}px</code><TextField label="Название поля" placeholder="Введите значение" size={size} /><Select label="Статус" options={options} size={size} /><Combobox label="Контрагент" placeholder="Найдите значение" size={size} options={contractorOptions} defaultValue="Северсталь" /></article>)}
      </div></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>Состояния Text Field</h2><p>Focus остаётся независимым от filled/error и появляется от клавиатуры.</p></div></div><div className="ds-field-states"><article><code>Default</code><TextField label="Название поля" placeholder="Введите значение" /></article><article><code>Filled</code><TextField label="Название поля" defaultValue="Договор поставки" /></article><article><code>Error</code><TextField label="Название поля" defaultValue="123" error="Проверьте значение" /></article><article><code>Disabled</code><TextField label="Название поля" disabled placeholder="Недоступно" /></article></div></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>04</span><div><h2>API и границы</h2><p>Active Select, Combobox и Multi Select включают тот же Listbox/Option слой, который утверждён внутри Figma component sets.</p></div></div><div className="ds-rule-list"><article><code>size</code><p><b>TextField, Select, Combobox:</b> l / m / s. <b>TextArea, MultiSelect:</b> l / m.</p></article><article><code>mode</code><p><b>edit</b> использует интерактивный control; <b>read</b> выводит обычный текст.</p></article><article><code>error</code><p>Меняет border/supporting text и выставляет <b>aria-invalid</b>.</p></article><article><code>form semantics</code><p>Text controls нативны; Select сохраняет скрытый native select для form-value, а видимый trigger/Listbox обеспечивает точный визуал и keyboard behavior.</p></article></div></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>05</span><div><h2>Код</h2><p>Установка, импорт и один базовый пример показывают все пять публичных компонентов family.</p></div></div><ComponentCodeExample componentId="input.fields" componentName="Fields" sourceHref={SOURCE_URL} /></section>
      <aside className="ds-review-note"><strong>Статус: In review</strong><p>Визуал, API, Active Listbox и автоматические проверки готовы. Продуктовый пилот остаётся отдельным quality gate.</p></aside>
    </main>
  );
}

function FieldsPlaygroundExample() {
  const [status, setStatus] = useState('');
  const [contractor, setContractor] = useState('');
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);

  return (
    <div className="ds-fields-playground">
      <TextField label="Название поля" placeholder="Введите значение" helperText="Подсказка или описание" />
      <TextArea label="Комментарий" placeholder="Введите комментарий" rows={4} />
      <Select label="Статус" options={options} value={status} onValueChange={setStatus} />
      <Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} onOptionSelect={setContractor} />
      <MultiSelect label="Контрагенты" selectedValues={selectedContractors} options={contractorOptions} onSelectedValuesChange={setSelectedContractors} />
      <output aria-live="polite">
        Статус: {status || '—'} · Контрагент: {contractor || '—'} · Выбрано: {selectedContractors.length}
      </output>
    </div>
  );
}

const meta = {
  title: 'Components/Fields',
  component: TextField,
  args: { label: 'Название поля', placeholder: 'Введите значение', helperText: 'Подсказка или описание', size: 'l', mode: 'edit' },
  argTypes: { size: { control: 'inline-radio', options: fieldSizes }, mode: { control: 'inline-radio', options: ['edit','read'] }, error: { control: 'text' } },
  parameters: {
    // DS Core specifies neutral/500 for empty placeholders (2.4:1 on white).
    // Preserve the Figma value and isolate only this source-design exception.
    a11y: { context: { exclude: [['.cometal-field__placeholder']] } },
  },
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: 'Обзор', parameters: { layout: 'fullscreen', controls: { disable: true } }, render: () => <FieldsDocumentation />, play: async ({ canvasElement }) => { await expect(canvasElement.querySelector('[data-code-example="input.fields"] pre')).toHaveTextContent('<TextField'); } };
export const FieldsPlayground: Story = {
  name: 'Playground',
  parameters: { controls: { disable: true } },
  render: () => <FieldsPlaygroundExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Название поля' })).toBeEnabled();
    await expect(canvas.getByRole('combobox', { name: 'Статус' })).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(canvas.getByRole('combobox', { name: 'Контрагенты' })).toHaveAttribute('aria-haspopup', 'listbox');
  },
};
export const SizingContract: Story = {
  name: 'Размеры · single-line 32 / 40 / 48',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="ds-control-sizing-story">
      {fieldSizes.map((size) => (
        <div key={size} data-sizing-row={size}>
          <TextField label={`${size.toUpperCase()} · ${size === 'l' ? '48' : size === 'm' ? '40' : '32'}px`} size={size} placeholder="Введите значение" />
          <Select label="Статус" options={options} size={size} />
          <Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} size={size} defaultValue="Север" clearable />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const expectedHeights = { l: 48, m: 40, s: 32 } as const;
    for (const size of fieldSizes) {
      const row = canvasElement.querySelector<HTMLElement>(`[data-sizing-row="${size}"]`);
      const controls = Array.from(row?.querySelectorAll<HTMLElement>('.cometal-field__control') ?? []);
      const strokeNodes = Array.from(row?.querySelectorAll<SVGElement>('svg [stroke]:not([stroke="none"])') ?? []);
      await expect(controls.map((control) => control.getBoundingClientRect().height)).toEqual(Array(3).fill(expectedHeights[size]));
      await expect(strokeNodes).toHaveLength(3);
      const renderedStrokeWidths = strokeNodes.map((node) => {
        if (getComputedStyle(node).vectorEffect === 'non-scaling-stroke') return Number.parseFloat(getComputedStyle(node).strokeWidth);
        const svg = node.ownerSVGElement!;
        return Number.parseFloat(getComputedStyle(node).strokeWidth)
          * svg.getBoundingClientRect().width
          / svg.viewBox.baseVal.width;
      });
      await expect(renderedStrokeWidths.every((width) => Math.abs(width - 1.4) < 0.01)).toBe(true);
      const clearStroke = row?.querySelector<SVGElement>('.cometal-field__clear [data-cometal-stroke-scale]');
      const clear = row?.querySelector<HTMLElement>('.cometal-field__clear');
      const clearIcon = clear?.querySelector<SVGSVGElement>('svg[data-cometal-icon]');
      await expect(clearStroke).not.toBeNull();
      await expect(clear?.getBoundingClientRect().width).toBe(20);
      await expect(clear?.getBoundingClientRect().height).toBe(20);
      await expect(clearIcon?.getBoundingClientRect().width).toBe(16);
      await expect(clearIcon?.getBoundingClientRect().height).toBe(16);
      await expect(clearStroke?.getBoundingClientRect().width).toBe(8);
      await expect(clearStroke?.getBoundingClientRect().height).toBe(8);
      await expect(getComputedStyle(clearStroke!).vectorEffect).toBe('non-scaling-stroke');
      await expect(strokeNodes.filter((node) => node !== clearStroke).every((node) => getComputedStyle(node).vectorEffect === 'none')).toBe(true);
    }
  },
};
export const TextFieldPlayground: Story = { name: 'Text Field', play: async ({ canvasElement }) => { const canvas = within(canvasElement); await expect(canvas.getByRole('textbox', { name: 'Название поля' })).toBeEnabled(); } };
export const TextAreaPlayground: Story = { name: 'Text Area', render: () => <TextArea label="Комментарий" placeholder="Введите комментарий" rows={4} />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('textbox', { name: 'Комментарий' })).toBeInTheDocument(); } };
export const SelectPlayground: Story = { name: 'Select', render: () => <Select label="Статус" options={options} defaultValue="" />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('combobox', { name: 'Статус' })).toHaveAttribute('aria-haspopup', 'listbox'); } };
export const ComboboxPlayground: Story = {
  name: 'Combobox',
  render: () => <Combobox label="Контрагент" placeholder="Найдите значение" defaultValue="Северсталь" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Контрагент' })).toHaveAttribute('aria-expanded', 'false');
    const clear = canvas.getByRole('button', { name: 'Очистить поле' });
    const icon = clear.querySelector<SVGSVGElement>('svg[data-cometal-icon]')!;
    const path = icon.querySelector<SVGPathElement>('path')!;
    await expect(clear.getBoundingClientRect().width).toBe(20);
    await expect(clear.getBoundingClientRect().height).toBe(20);
    await expect(icon.getBoundingClientRect().width).toBe(16);
    await expect(icon.getBoundingClientRect().height).toBe(16);
    await expect(path.getBoundingClientRect().width).toBe(8);
    await expect(path.getBoundingClientRect().height).toBe(8);
    await expect(Number.parseFloat(getComputedStyle(path).strokeWidth)).toBe(1.4);
  },
};
export const MultiSelectPlayground: Story = {
  name: 'Multi Select',
  render: () => <MultiSelect label="Контрагенты" selectedValues={['Северсталь','НЛМК','ММК']} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox', { name: /Контрагенты/ })).toHaveAttribute('aria-haspopup', 'listbox');

    const root = canvasElement.ownerDocument.documentElement;
    const removeIconPath = canvasElement.querySelector<SVGElement>('.cometal-field__tag-remove path');
    await expect(removeIconPath).not.toBeNull();
    await expect(getComputedStyle(removeIconPath!).strokeWidth).toBe('1.4px');

    root.style.setProperty('--cometal-primitive-stroke-140', 'initial', 'important');
    await expect(getComputedStyle(removeIconPath!).strokeWidth).toBe('1.4px');
    root.style.removeProperty('--cometal-primitive-stroke-140');
  },
};
export const SelectActive: Story = {
  name: 'Select · Active Listbox',
  parameters: { controls: { disable: true } },
  render: () => <div className="ds-field-story-shell"><Select label="Статус" options={options} defaultValue="active" expanded /></div>,
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Статус' });
    const chevron = trigger.querySelector<SVGSVGElement>('[data-chevron-direction]')!;
    const listbox = await within(canvasElement.ownerDocument.body).findByRole('listbox');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(chevron).toHaveAttribute('data-chevron-direction', 'up');
    await expect(chevron.getBoundingClientRect().width).toBe(20);
    await expect(chevron.getBoundingClientRect().height).toBe(20);
    await expect(Number.parseFloat(getComputedStyle(chevron.querySelector('path')!).strokeWidth) * chevron.getBoundingClientRect().width / chevron.viewBox.baseVal.width).toBeCloseTo(1.4, 2);
    await expect(listbox).toBeInTheDocument();
    await expect(within(listbox).getAllByRole('option')).toHaveLength(12);
    await expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);
  },
};
export const SelectLongList: Story = {
  name: 'Select · Long List',
  parameters: { controls: { disable: true } },
  render: () => <div className="ds-field-story-shell"><Select label="Статус" options={longOptions} expanded /></div>,
  play: async ({ canvasElement }) => {
    const listbox = await within(canvasElement.ownerDocument.body).findByRole('listbox');
    const listboxOptions = within(listbox).getAllByRole('option');
    await expect(listboxOptions).toHaveLength(16);
    await expect(listbox.scrollHeight).toBeGreaterThan(listbox.clientHeight);
    await expect(listboxOptions[0]).not.toHaveAttribute('data-active');
    await userEvent.hover(listboxOptions[0] as HTMLElement);
    await expect(listboxOptions[0]).toHaveAttribute('data-active');
    await userEvent.unhover(listboxOptions[0] as HTMLElement);
    await expect(listboxOptions[0]).not.toHaveAttribute('data-active');
  },
};
export const ComboboxActive: Story = {
  name: 'Combobox · Active Listbox',
  parameters: { controls: { disable: true } },
  render: () => <div className="ds-field-story-shell"><Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} defaultValue="НЛМК" expanded /></div>,
  play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('listbox')).toBeInTheDocument(); },
};
export const MultiSelectActive: Story = {
  name: 'Multi Select · Active Listbox',
  parameters: { controls: { disable: true } },
  render: () => <div className="ds-field-story-shell"><MultiSelect label="Контрагенты" selectedValues={['severstal', 'mmk']} options={contractorOptions} expanded /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Контрагенты' });
    const chevron = canvasElement.querySelector<SVGSVGElement>('[data-chevron-direction]')!;
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(chevron).toHaveAttribute('data-chevron-direction', 'up');
    await expect(chevron.getBoundingClientRect().width).toBe(20);
    await expect(chevron.getBoundingClientRect().height).toBe(20);
    await expect(Number.parseFloat(getComputedStyle(chevron.querySelector('path')!).strokeWidth) * chevron.getBoundingClientRect().width / chevron.viewBox.baseVal.width).toBeCloseTo(1.4, 2);
    await expect(canvas.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await expect(canvas.getByRole('option', { name: /Северсталь/ })).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('option', { name: /ММК/ })).toHaveAttribute('aria-selected', 'true');
  },
};
export const SelectInteraction: Story = {
  name: 'Select · Keyboard & selection',
  parameters: { controls: { disable: true } },
  render: () => <SelectInteractionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('combobox', { name: 'Статус' });
    const getChevron = () => trigger.querySelector<SVGSVGElement>('[data-chevron-direction]')!;
    await expect(getChevron()).toHaveAttribute('data-chevron-direction', 'down');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
    await expect(canvas.getByText('Выбрано: approval')).toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    trigger.focus();
    await userEvent.keyboard('{Home}');
    await expect(body.getByRole('option', { name: 'Новый' })).toHaveAttribute('data-active');
    await userEvent.keyboard('{End}');
    await expect(body.getByRole('option', { name: 'Просрочен' })).toHaveAttribute('data-active');
    await userEvent.keyboard('з');
    await expect(body.getByRole('option', { name: 'Завершён' })).toHaveAttribute('data-active');
    await userEvent.keyboard('{Escape}');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(getChevron()).toHaveAttribute('data-chevron-direction', 'up');
    const motion = getComputedStyle(body.getByRole('listbox'));
    const reducedMotion = canvasElement.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      await expect(motion.transitionProperty).toBe('none');
    } else {
      await expect(motion.transitionProperty).toContain('opacity');
      await expect(motion.transitionProperty).toContain('transform');
      await expect(motion.transitionDuration).toContain('0.16s');
      await expect(motion.transitionDuration).toContain('0.18s');
    }
    const resolveColorToken = (token: string) => {
      const probe = canvasElement.ownerDocument.createElement('span');
      probe.style.color = `var(${token})`;
      canvasElement.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    };
    const optionColors = {
      selectedSurface: resolveColorToken('--cometal-component-option-surface-selected'),
      selectedContent: resolveColorToken('--cometal-component-option-content-selected'),
      disabledSurface: resolveColorToken('--cometal-component-option-surface-disabled'),
      disabledContent: resolveColorToken('--cometal-component-option-content-disabled'),
      focusSurface: resolveColorToken('--cometal-component-option-surface-focus'),
      focusContent: resolveColorToken('--cometal-component-option-content-focus'),
    };
    const hoverOption = body.getByRole('option', { name: 'Активный' });
    await userEvent.hover(hoverOption);
    await expect(hoverOption).toHaveAttribute('data-active');
    const optionStateRules = Array.from(canvasElement.ownerDocument.styleSheets)
      .flatMap((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules);
        } catch {
          return [];
        }
      })
      .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.startsWith('.cometal-field__option'));
    const ruleIndex = (selector: string) => optionStateRules.findIndex((rule) => rule.selectorText.replaceAll('"', "'") === selector);
    const activeIndex = ruleIndex('.cometal-field__option[data-active]');
    const hoverIndex = ruleIndex('.cometal-field__option:hover');
    const selectedIndex = ruleIndex('.cometal-field__option[data-selected]');
    const disabledIndex = ruleIndex(".cometal-field__option[aria-disabled='true']");
    expect(activeIndex).toBeGreaterThanOrEqual(0);
    expect(activeIndex).toBeLessThan(hoverIndex);
    expect(hoverIndex).toBeLessThan(selectedIndex);
    expect(selectedIndex).toBeLessThan(disabledIndex);
    expect(optionStateRules[hoverIndex]?.style.background).toBe('var(--cometal-component-option-surface-hover)');
    expect(optionStateRules[hoverIndex]?.style.color).toBe('var(--cometal-component-option-content-hover)');
    await userEvent.unhover(hoverOption);
    await expect(hoverOption).not.toHaveAttribute('data-active');

    const selectedOption = body.getByRole('option', { name: 'На согласовании' });
    await userEvent.hover(selectedOption);
    expect(getComputedStyle(selectedOption).backgroundColor).toBe(optionColors.selectedSurface);
    expect(getComputedStyle(selectedOption).color).toBe(optionColors.selectedContent);
    await userEvent.unhover(selectedOption);

    const disabledOption = body.getByRole('option', { name: 'Архивный' });
    await userEvent.hover(disabledOption);
    expect(getComputedStyle(disabledOption).backgroundColor).toBe(optionColors.disabledSurface);
    expect(getComputedStyle(disabledOption).color).toBe(optionColors.disabledContent);
    await userEvent.unhover(disabledOption);

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const keyboardOption = body.getByRole('option', { name: 'Новый' });
    await expect(keyboardOption).toHaveAttribute('data-active');
    expect(keyboardOption.matches(':hover')).toBe(false);
    expect(getComputedStyle(keyboardOption).backgroundColor).toBe(optionColors.focusSurface);
    expect(getComputedStyle(keyboardOption).color).toBe(optionColors.focusContent);
    await userEvent.click(canvas.getByText('Выбрано: approval'));
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await userEvent.tab();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  },
};
export const SelectPortalContract: Story = {
  name: 'Select · Portal, geometry & focus modality',
  parameters: { controls: { disable: true } },
  render: () => <SelectPortalContractExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const ownerWindow = canvasElement.ownerDocument.defaultView!;
    const clipRoot = canvasElement.querySelector<HTMLElement>('[data-overlay-clip-root]')!;
    Object.assign(clipRoot.style, { position: 'fixed', right: '0px', bottom: '0px', width: '224px' });
    const trigger = canvas.getByRole('combobox', { name: 'Статус' });
    const root = trigger.closest<HTMLElement>('.cometal-field')!;
    await userEvent.click(trigger);
    const listbox = await body.findByRole('listbox');
    await expect(listbox.parentElement).toBe(canvasElement.ownerDocument.body);
    await expect(getComputedStyle(listbox).position).toBe('fixed');
    await expect(listbox).toHaveAttribute('data-placement', 'top-start');
    await expect(listbox.getBoundingClientRect().width).toBeCloseTo(trigger.getBoundingClientRect().width, 0);
    await expect(listbox.getBoundingClientRect().height).toBe(208);
    await expect(root).not.toHaveAttribute('data-focus-visible');
    const listboxRect = listbox.getBoundingClientRect();
    await expect(listboxRect.left).toBeGreaterThanOrEqual(8);
    await expect(listboxRect.right).toBeLessThanOrEqual(ownerWindow.innerWidth - 8);
    await expect(canvasElement.ownerDocument.elementFromPoint(listboxRect.left + 12, listboxRect.top + 12)?.closest('[role="listbox"]')).toBe(listbox);
    clipRoot.style.bottom = '48px';
    fireEvent.scroll(ownerWindow);
    await waitFor(() => expect(listbox.getBoundingClientRect().top).not.toBeCloseTo(listboxRect.top, 0));
    await userEvent.click(within(listbox).getByRole('option', { name: 'Активный' }));
    await expect(trigger).toHaveTextContent('Активный');
    await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
    trigger.blur();
    trigger.focus();
    await waitFor(() => expect(root).toHaveAttribute('data-focus-visible'));
    const controlStyle = getComputedStyle(root.querySelector<HTMLElement>('.cometal-field__control')!);
    await expect(controlStyle.outlineWidth).toBe('2px');
    await expect(controlStyle.outlineOffset).toBe('4px');
    await userEvent.keyboard('{Enter}');
    await expect(await body.findByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
    await expect(root).toHaveAttribute('data-focus-visible');
    await userEvent.click(trigger);
    await expect(await body.findByRole('listbox')).toBeVisible();
    fireEvent.pointerDown(canvasElement);
    await waitFor(() => expect(body.queryByRole('listbox')).not.toBeInTheDocument());
  },
};
export const SharedFocusModalityContract: Story = {
  name: 'Shared pointer / keyboard modality matrix',
  parameters: { controls: { disable: true } },
  render: () => <FocusModalityMatrixExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const controls = [
      canvas.getByRole('textbox', { name: 'Modality TextField' }),
      canvas.getByRole('textbox', { name: 'Modality TextArea' }),
      canvas.getByRole('combobox', { name: 'Modality Select' }),
      canvas.getByRole('combobox', { name: 'Modality Combobox' }),
      canvas.getByRole('combobox', { name: 'Modality MultiSelect' }),
      canvas.getByRole('textbox', { name: 'Modality Date' }),
      canvas.getByRole('textbox', { name: 'Modality Range' }),
    ];
    for (const control of controls) {
      const root = control.closest<HTMLElement>('.cometal-field')!;
      await userEvent.click(control);
      await expect(root).not.toHaveAttribute('data-focus-visible');
      if (control.getAttribute('aria-expanded') === 'true') await userEvent.keyboard('{Escape}');
      control.blur();
      control.focus();
      await waitFor(() => expect(root).toHaveAttribute('data-focus-visible'));
      const controlStyle = getComputedStyle(root.querySelector<HTMLElement>('.cometal-field__control')!);
      await expect(controlStyle.outlineWidth).toBe('2px');
      await expect(controlStyle.outlineOffset).toBe('4px');
      control.blur();
    }
    await userEvent.click(canvas.getByRole('combobox', { name: 'Modality Select' }));
    await expect(await body.findByRole('listbox', { name: 'Modality Select: варианты' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Unmount modality matrix' }));
    await waitFor(() => expect(body.queryByRole('listbox', { name: 'Modality Select: варианты' })).not.toBeInTheDocument());
    fireEvent.scroll(canvasElement.ownerDocument.defaultView!);
    fireEvent.resize(canvasElement.ownerDocument.defaultView!);
    await expect(canvasElement.querySelector('[data-modality-matrix]')).not.toBeInTheDocument();
  },
};
export const ComboboxInteraction: Story = {
  name: 'Combobox · Keyboard & selection',
  parameters: { controls: { disable: true } },
  render: () => <ComboboxInteractionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Контрагент' });
    await userEvent.click(input);
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.type(input, 'zzz');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.clear(input);
    await userEvent.type(input, 'сталь');
    const listbox = canvas.getByRole('listbox');
    await expect(within(listbox).getAllByRole('option')).toHaveLength(1);
    const severstalOption = within(listbox).getByRole('option', { name: 'Северсталь' });
    await expect(severstalOption).not.toHaveAttribute('data-active');
    await userEvent.hover(severstalOption);
    await expect(severstalOption).toHaveAttribute('data-active');
    await userEvent.unhover(severstalOption);
    await expect(severstalOption).not.toHaveAttribute('data-active');
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(input);
    await userEvent.clear(input);
    await userEvent.type(input, 'сталь');
    const reopenedSeverstalOption = within(canvas.getByRole('listbox')).getByRole('option', { name: 'Северсталь' });
    await userEvent.keyboard('{ArrowDown}');
    await expect(reopenedSeverstalOption).toHaveAttribute('data-active');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('Выбрано: severstal')).toBeInTheDocument();
    await expect(input).toHaveValue('Северсталь');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    const clear = canvas.getByRole('button', { name: 'Очистить поле' });
    await expect(clear.querySelector('svg')).toHaveAttribute('data-cometal-icon-library', 'outline');
    await userEvent.click(clear);
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
    await expect(canvas.getByText('Выбрано: —')).toBeInTheDocument();
  },
};
export const MultiSelectInteraction: Story = {
  name: 'Multi Select · multiple selection',
  parameters: { controls: { disable: true } },
  render: () => <MultiSelectInteractionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Контрагенты' });
    const getChevron = () => canvasElement.querySelector<SVGSVGElement>('[data-chevron-direction]')!;
    await expect(getChevron()).toHaveAttribute('data-chevron-direction', 'down');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{Enter}{ArrowDown}{Enter}');
    await expect(canvas.getByText('Выбрано: severstal, nlmk')).toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(getChevron()).toHaveAttribute('data-chevron-direction', 'up');
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('option', { name: 'Северсталь' })).toHaveAttribute('data-active');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('option', { name: 'Евраз' })).toHaveAttribute('data-active');
    await userEvent.keyboard('с');
    await expect(canvas.getByRole('option', { name: 'Северсталь' })).toHaveAttribute('data-active');
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(getChevron()).toHaveAttribute('data-chevron-direction', 'down');
  },
};
export const MultiSelectResponsiveTags: Story = {
  name: 'Multi Select · responsive tags',
  parameters: { controls: { disable: true } },
  render: () => <MultiSelectResponsiveExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(canvasElement.querySelector('.cometal-field__tags > .cometal-field__tag--counter')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Сузить поле' }));
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(canvasElement.querySelector('.cometal-field__tags > .cometal-field__tag--counter')).toBeInTheDocument();
  },
};
