import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Combobox, MultiSelect, Select, TextArea, TextField, fieldSizes } from '@cometal/react';
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
      <Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} onOptionSelect={setValue} />
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
        <article><header><code>Combobox</code><span>input + listbox pattern</span></header><div><Combobox label="Контрагент" placeholder="Найдите значение" /><Combobox label="Контрагент" mode="read" readValue="ООО Северсталь" /></div></article>
        <article><header><code>MultiSelect</code><span>button + listbox pattern</span></header><div><MultiSelect label="Контрагенты" selectedValues={['Северсталь', 'НЛМК', 'ММК']} /><MultiSelect label="Контрагенты" selectedValues={['Северсталь', 'НЛМК', 'ММК']} mode="read" /></div></article>
      </div></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Размеры однострочных controls</h2><p>Text Field, Select и Combobox используют общую шкалу S 32px, M 40px и L 48px. Text Area и Multi Select остаются в M/L.</p></div></div><div className="ds-field-size-grid">
        {fieldSizes.map((size) => <article key={size}><code>{size.toUpperCase()} · {size === 'l' ? '48' : size === 'm' ? '40' : '32'}px</code><TextField label="Название поля" placeholder="Введите значение" size={size} /><Select label="Статус" options={options} size={size} /><Combobox label="Контрагент" placeholder="Найдите значение" size={size} options={contractorOptions} /></article>)}
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
      {fieldSizes.map((size) => <TextField key={size} label={`${size.toUpperCase()} · ${size === 'l' ? '48' : size === 'm' ? '40' : '32'}px`} size={size} placeholder="Введите значение" />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const controls = Array.from(canvasElement.querySelectorAll<HTMLElement>('.cometal-field__control'));
    await expect(controls.map((control) => control.getBoundingClientRect().height)).toEqual([48, 40, 32]);
  },
};
export const TextFieldPlayground: Story = { name: 'Text Field', play: async ({ canvasElement }) => { const canvas = within(canvasElement); await expect(canvas.getByRole('textbox', { name: 'Название поля' })).toBeEnabled(); } };
export const TextAreaPlayground: Story = { name: 'Text Area', render: () => <TextArea label="Комментарий" placeholder="Введите комментарий" rows={4} />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('textbox', { name: 'Комментарий' })).toBeInTheDocument(); } };
export const SelectPlayground: Story = { name: 'Select', render: () => <Select label="Статус" options={options} defaultValue="" />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('combobox', { name: 'Статус' })).toHaveAttribute('aria-haspopup', 'listbox'); } };
export const ComboboxPlayground: Story = { name: 'Combobox', render: () => <Combobox label="Контрагент" placeholder="Найдите значение" />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('combobox', { name: 'Контрагент' })).toHaveAttribute('aria-expanded', 'false'); } };
export const MultiSelectPlayground: Story = { name: 'Multi Select', render: () => <MultiSelect label="Контрагенты" selectedValues={['Северсталь','НЛМК','ММК']} />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('combobox', { name: /Контрагенты/ })).toHaveAttribute('aria-haspopup', 'listbox'); } };
export const SelectActive: Story = {
  name: 'Select · Active Listbox',
  parameters: { controls: { disable: true } },
  render: () => <div className="ds-field-story-shell"><Select label="Статус" options={options} defaultValue="active" expanded /></div>,
  play: async ({ canvasElement }) => {
    const listbox = within(canvasElement).getByRole('listbox');
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
    const listbox = within(canvasElement).getByRole('listbox');
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
    const trigger = canvas.getByRole('combobox', { name: 'Статус' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
    await expect(canvas.getByText('Выбрано: approval')).toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const motion = getComputedStyle(canvas.getByRole('listbox'));
    await expect(motion.transitionProperty).toContain('opacity');
    await expect(motion.transitionProperty).toContain('transform');
    await expect(motion.transitionDuration).toContain('0.16s');
    await expect(motion.transitionDuration).toContain('0.18s');
    await userEvent.click(canvas.getByText('Выбрано: approval'));
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
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
    await userEvent.keyboard('{ArrowDown}');
    await expect(severstalOption).toHaveAttribute('data-active');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('Выбрано: severstal')).toBeInTheDocument();
    await expect(input).toHaveValue('Северсталь');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
  },
};
export const MultiSelectInteraction: Story = {
  name: 'Multi Select · multiple selection',
  parameters: { controls: { disable: true } },
  render: () => <MultiSelectInteractionExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Контрагенты' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{Enter}{ArrowDown}{Enter}');
    await expect(canvas.getByText('Выбрано: severstal, nlmk')).toBeInTheDocument();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvasElement.querySelector('.cometal-field__asset svg')).toBeInTheDocument();
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
