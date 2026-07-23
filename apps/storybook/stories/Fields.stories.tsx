import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Combobox, MultiSelect, Select, TextArea, TextField, fieldSizes } from '@cometal/react';

const FIGMA_URL = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1096-42';
const options = [
  { value: 'draft', label: 'Черновик' },
  { value: 'approval', label: 'На согласовании' },
  { value: 'active', label: 'Активный' },
  { value: 'completed', label: 'Завершён' },
  { value: 'archive', label: 'Архив', disabled: true },
];
const contractorOptions = [
  { value: 'severstal', label: 'Северсталь' },
  { value: 'nlmk', label: 'НЛМК' },
  { value: 'mmk', label: 'ММК' },
  { value: 'evraz', label: 'Евраз' },
  { value: 'nornickel', label: 'Норникель', disabled: true },
];

function SelectInteractionExample() {
  const [value, setValue] = useState('');
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <Select label="Статус" options={options} value={value} onValueChange={setValue} />
      <output aria-live="polite">Выбрано: {value || '—'}</output>
    </div>
  );
}

function MultiSelectInteractionExample() {
  const [values, setValues] = useState<string[]>([]);
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
      <MultiSelect label="Контрагенты" selectedValues={values} options={contractorOptions} onSelectedValuesChange={setValues} />
      <output aria-live="polite">Выбрано: {values.join(', ') || '—'}</output>
    </div>
  );
}

function ComboboxInteractionExample() {
  const [value, setValue] = useState('');
  return (
    <div style={{ width: '100%', maxWidth: 480 }}>
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
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>02</span><div><h2>Состояния Text Field</h2><p>Focus остаётся независимым от filled/error и появляется от клавиатуры.</p></div></div><div className="ds-field-states"><article><code>Default</code><TextField label="Название поля" placeholder="Введите значение" /></article><article><code>Filled</code><TextField label="Название поля" defaultValue="Договор поставки" /></article><article><code>Error</code><TextField label="Название поля" defaultValue="123" error="Проверьте значение" /></article><article><code>Disabled</code><TextField label="Название поля" disabled placeholder="Недоступно" /></article></div></section>
      <section className="ds-component-section"><div className="ds-component-section__intro"><span>03</span><div><h2>API и границы</h2><p>Active Select, Combobox и Multi Select включают тот же Listbox/Option слой, который утверждён внутри Figma component sets.</p></div></div><div className="ds-rule-list"><article><code>mode</code><p><b>edit</b> использует интерактивный control; <b>read</b> выводит обычный текст.</p></article><article><code>error</code><p>Меняет border/supporting text и выставляет <b>aria-invalid</b>.</p></article><article><code>form semantics</code><p>Text controls нативны; Select сохраняет скрытый native select для form-value, а видимый trigger/Listbox обеспечивает точный визуал и keyboard behavior.</p></article></div></section>
      <aside className="ds-review-note"><strong>Статус: In review</strong><p>Визуал, API, Active Listbox и автоматические проверки готовы. Продуктовый пилот остаётся отдельным quality gate.</p></aside>
    </main>
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

export const Overview: Story = { name: 'Обзор', parameters: { layout: 'fullscreen', controls: { disable: true } }, render: () => <FieldsDocumentation /> };
export const TextFieldPlayground: Story = { name: 'Text Field', play: async ({ canvasElement }) => { const canvas = within(canvasElement); await expect(canvas.getByRole('textbox', { name: 'Название поля' })).toBeEnabled(); } };
export const TextAreaPlayground: Story = { name: 'Text Area', render: () => <TextArea label="Комментарий" placeholder="Введите комментарий" rows={4} />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('textbox', { name: 'Комментарий' })).toBeInTheDocument(); } };
export const SelectPlayground: Story = { name: 'Select', render: () => <Select label="Статус" options={options} defaultValue="" />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('combobox', { name: 'Статус' })).toHaveAttribute('aria-haspopup', 'listbox'); } };
export const ComboboxPlayground: Story = { name: 'Combobox', render: () => <Combobox label="Контрагент" placeholder="Найдите значение" />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('combobox', { name: 'Контрагент' })).toHaveAttribute('aria-expanded', 'false'); } };
export const MultiSelectPlayground: Story = { name: 'Multi Select', render: () => <MultiSelect label="Контрагенты" selectedValues={['Северсталь','НЛМК','ММК']} />, play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('combobox', { name: /Контрагенты/ })).toHaveAttribute('aria-haspopup', 'listbox'); } };
export const SelectActive: Story = {
  name: 'Select · Active Listbox',
  parameters: { controls: { disable: true } },
  render: () => <div style={{ width: '100%', maxWidth: 480 }}><Select label="Статус" options={options} defaultValue="active" expanded /></div>,
  play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('listbox')).toBeInTheDocument(); },
};
export const ComboboxActive: Story = {
  name: 'Combobox · Active Listbox',
  parameters: { controls: { disable: true } },
  render: () => <div style={{ width: '100%', maxWidth: 480 }}><Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} defaultValue="НЛМК" expanded /></div>,
  play: async ({ canvasElement }) => { await expect(within(canvasElement).getByRole('listbox')).toBeInTheDocument(); },
};
export const MultiSelectActive: Story = {
  name: 'Multi Select · Active Listbox',
  parameters: { controls: { disable: true } },
  render: () => <div style={{ width: '100%', maxWidth: 480 }}><MultiSelect label="Контрагенты" selectedValues={['severstal', 'mmk']} options={contractorOptions} expanded /></div>,
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
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(canvas.getByText('Выбрано: approval')).toBeInTheDocument();
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
    input.focus();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(canvas.getByText('Выбрано: nlmk')).toBeInTheDocument();
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
  },
};
