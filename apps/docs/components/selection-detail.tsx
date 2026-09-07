'use client';

import { useState } from 'react';
import { Badge, Checkbox, InlineLink, RadioButton, Select, Switch, TextField } from '@cometal/react';
import type { SelectionSize } from '@cometal/react';
import { components, statusLabels } from '../lib/registry';
import { CodeBlock } from './code-block';
import { ComponentPageExample } from './component-page-example';
import { ComponentPageSetting, ComponentPageSettings } from './component-page-settings';
import { ComponentPageStandard } from './component-page-standard';

type Kind = 'checkbox' | 'radio-button' | 'switch';

const content = {
  checkbox: {
    id: 'selection.checkbox', title: 'Checkbox', reactExport: 'Checkbox', summary: 'Независимый выбор с unchecked, checked и mixed.', story: 'components-checkbox--playground',
    use: 'Для независимого согласия или выбора нескольких строк.', avoid: 'Для одного варианта из группы или мгновенного включения настройки.',
    label: 'Согласен с условиями', description: 'Подтвердите согласие перед отправкой',
  },
  'radio-button': {
    id: 'selection.radio-button', title: 'Radio Button', reactExport: 'RadioButton', summary: 'Выбор одного взаимоисключающего значения внутри группы.', story: 'components-radio-button--playground',
    use: 'Когда пользователь должен видеть все взаимоисключающие варианты.', avoid: 'Для независимых пунктов или длинного списка вариантов.',
    label: 'С НДС', description: 'Выберите одну ставку',
  },
  switch: {
    id: 'selection.switch', title: 'Switch', reactExport: 'Switch', summary: 'Немедленно включает или выключает настройку.', story: 'components-switch--playground',
    use: 'Когда изменение применяется сразу после переключения.', avoid: 'Для согласия в форме или действия, которое требует отдельного сохранения.',
    label: 'Получать уведомления', description: 'Изменение применяется сразу',
  },
} as const;

const sizeOptions = [
  { value: 'l', label: 'L' },
  { value: 'm', label: 'M' },
  { value: 's', label: 'S' },
];

const radioValueOptions = [
  { value: '', label: 'Не выбрано' },
  { value: 'included', label: 'С НДС' },
  { value: 'excluded', label: 'Без НДС' },
  { value: 'exempt', label: 'Не облагается' },
];

function SelectionPreview({ kind }: { kind: Kind }) {
  if (kind === 'checkbox') return <Checkbox label="Согласен с условиями" description="Подтвердите согласие перед отправкой" />;
  if (kind === 'switch') return <Switch label="Получать уведомления" description="Изменение применяется сразу" />;
  return (
    <fieldset className="component-standard-radio-group">
      <legend>Ставка НДС</legend>
      <RadioButton label="С НДС" name="vat-preview" value="included" defaultChecked />
      <RadioButton label="Без НДС" name="vat-preview" value="excluded" />
      <RadioButton label="Не облагается" name="vat-preview" value="exempt" />
    </fieldset>
  );
}

function ValuesPreview({ kind }: { kind: Kind }) {
  const [mixed, setMixed] = useState(true);
  const [mixedChecked, setMixedChecked] = useState(false);
  if (kind === 'checkbox') return <div className="selection-value-board component-standard-selection-board"><article><code>Unchecked</code><Checkbox label="Пункт" /></article><article><code>Checked</code><Checkbox label="Пункт" defaultChecked /></article><article><code>Mixed</code><Checkbox label="Все строки" checked={mixedChecked} indeterminate={mixed} onChange={(event) => { setMixedChecked(event.currentTarget.checked); setMixed(false); }} /></article><article><code>Disabled</code><Checkbox label="Пункт" disabled /></article></div>;
  if (kind === 'switch') return <div className="selection-value-board component-standard-selection-board"><article><code>Off</code><Switch label="Настройка" /></article><article><code>On</code><Switch label="Настройка" defaultChecked /></article><article><code>Disabled Off</code><Switch label="Настройка" disabled /></article><article><code>Disabled On</code><Switch label="Настройка" defaultChecked disabled /></article></div>;
  return <fieldset className="component-standard-radio-group"><legend>Способ оплаты</legend><RadioButton label="По счёту" name="payment-example" value="invoice" defaultChecked /><RadioButton label="Картой" name="payment-example" value="card" /><RadioButton label="Недоступный вариант" name="payment-example" value="disabled" disabled /></fieldset>;
}

function SizesPreview({ kind }: { kind: Kind }) {
  return (
    <div className="selection-size-row component-standard-selection-sizes">
      {(['l', 'm', 's'] as const).map((size) => <article key={size}><code>{size.toUpperCase()}</code>{kind === 'checkbox' ? <Checkbox size={size} label="Пример" defaultChecked /> : kind === 'switch' ? <Switch size={size} label="Пример" defaultChecked /> : <fieldset className="component-standard-radio-group"><legend className="visually-hidden">Пример размера {size.toUpperCase()}</legend><RadioButton size={size} label="Первый вариант" name={`radio-size-${size}`} value="first" defaultChecked /><RadioButton size={size} label="Второй вариант" name={`radio-size-${size}`} value="second" /></fieldset>}</article>)}
    </div>
  );
}

function valuesCode(kind: Kind) {
  if (kind === 'checkbox') return `import { useState } from 'react';
import { Checkbox } from '@cometal/react';

export function CheckboxValues() {
  const [mixed, setMixed] = useState(true);
  const [mixedChecked, setMixedChecked] = useState(false);

  return (
    <div>
      <Checkbox label="Пункт" />
      <Checkbox label="Пункт" defaultChecked />
      <Checkbox
        label="Все строки"
        checked={mixedChecked}
        indeterminate={mixed}
        onChange={(event) => {
          setMixedChecked(event.currentTarget.checked);
          setMixed(false);
        }}
      />
      <Checkbox label="Пункт" disabled />
    </div>
  );
}`;
  if (kind === 'switch') return `import { Switch } from '@cometal/react';

export function SwitchValues() {
  return (
    <div>
      <Switch label="Настройка" />
      <Switch label="Настройка" defaultChecked />
      <Switch label="Настройка" disabled />
      <Switch label="Настройка" defaultChecked disabled />
    </div>
  );
}`;
  return `import { RadioButton } from '@cometal/react';

export function PaymentMethod() {
  return (
    <fieldset>
      <legend>Способ оплаты</legend>
      <RadioButton label="По счёту" name="payment" value="invoice" defaultChecked />
      <RadioButton label="Картой" name="payment" value="card" />
      <RadioButton label="Недоступный вариант" name="payment" value="disabled" disabled />
    </fieldset>
  );
}`;
}

function sizesCode(kind: Kind) {
  const name = content[kind].reactExport;
  if (kind === 'radio-button') return `import { RadioButton } from '@cometal/react';

export function RadioButtonSizes() {
  return (
    <div>
      {(['l', 'm', 's'] as const).map((size) => (
        <fieldset key={size}>
          <legend>{size.toUpperCase()}</legend>
          <RadioButton size={size} label="Первый вариант" name={\`example-\${size}\`} value="first" defaultChecked />
          <RadioButton size={size} label="Второй вариант" name={\`example-\${size}\`} value="second" />
        </fieldset>
      ))}
    </div>
  );
}`;
  return `import { ${name} } from '@cometal/react';

export function ${name}Sizes() {
  return (
    <div>
      {(['l', 'm', 's'] as const).map((size) => (
        <${name} key={size} size={size} label="Пример" defaultChecked />
      ))}
    </div>
  );
}`;
}

function SelectionSettings({ kind }: { kind: Kind }) {
  const copy = content[kind];
  const [label, setLabel] = useState<string>(copy.label);
  const [description, setDescription] = useState<string>('');
  const [size, setSize] = useState<SelectionSize>('l');
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [radioValue, setRadioValue] = useState('');
  const effectiveLabel = label.trim() || copy.label;
  const descriptionProp = description.trim() ? `\n      description={${JSON.stringify(description)}}` : '';
  const disabledProp = disabled ? '\n      disabled' : '';
  const sizeProp = `\n      size=${JSON.stringify(size)}`;

  const checkboxCode = `'use client';

import { useState } from 'react';
import { Checkbox } from '@cometal/react';

export function CheckboxExample() {
  const [checked, setChecked] = useState(${checked});

  return (
    <Checkbox
      label={${JSON.stringify(effectiveLabel)}}${descriptionProp}${sizeProp}${indeterminate ? '\n      indeterminate' : ''}${disabledProp}
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  );
}`;
  const switchCode = `'use client';

import { useState } from 'react';
import { Switch } from '@cometal/react';

export function SwitchExample() {
  const [checked, setChecked] = useState(${checked});

  return (
    <Switch
      label={${JSON.stringify(effectiveLabel)}}${descriptionProp}${sizeProp}${disabledProp}
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  );
}`;
  const radioCode = `'use client';

import { useState } from 'react';
import { RadioButton } from '@cometal/react';

export function VatGroup() {
  const [value, setValue] = useState(${JSON.stringify(radioValue)});

  return (
    <fieldset>
      <legend>Ставка НДС</legend>
      {[
        ['included', ${JSON.stringify(effectiveLabel)}],
        ['excluded', 'Без НДС'],
        ['exempt', 'Не облагается'],
      ].map(([optionValue, optionLabel]) => (
        <RadioButton
          key={optionValue}
          label={optionLabel}${descriptionProp}
          name="vat"${sizeProp}${disabledProp}
          value={optionValue}
          checked={value === optionValue}
          onChange={() => setValue(optionValue)}
        />
      ))}
    </fieldset>
  );
}`;
  const code = kind === 'checkbox' ? checkboxCode : kind === 'switch' ? switchCode : radioCode;

  function reset() {
    setLabel(copy.label);
    setDescription('');
    setSize('l');
    setChecked(false);
    setIndeterminate(false);
    setDisabled(false);
    setRadioValue('');
  }

  const preview = kind === 'checkbox'
    ? <Checkbox label={effectiveLabel} description={description || undefined} size={size} checked={checked} indeterminate={indeterminate} disabled={disabled} onChange={(event) => { setChecked(event.currentTarget.checked); setIndeterminate(false); }} />
    : kind === 'switch'
      ? <Switch label={effectiveLabel} description={description || undefined} size={size} checked={checked} disabled={disabled} onChange={(event) => setChecked(event.currentTarget.checked)} />
      : <fieldset className="component-standard-radio-group"><legend>Ставка НДС</legend>{radioValueOptions.slice(1).map((option, index) => <RadioButton key={option.value} label={index === 0 ? effectiveLabel : option.label} description={description || undefined} name="vat-settings" size={size} value={option.value} checked={radioValue === option.value} disabled={disabled} onChange={() => setRadioValue(option.value)} />)}</fieldset>;

  return (
    <section className="content-section component-standard-settings-section">
      <ComponentPageSettings componentName={copy.title} preview={preview} code={code} onReset={reset} note={<><code>@cometal/react</code> пока используется как workspace-зависимость. Нативные form-атрибуты передаются без отдельного редактора.</>}>
        <ComponentPageSetting name="label" type="string" defaultValue="required" description="Видимая подпись и доступное имя элемента.">
          <TextField label="Подпись" size="m" value={label} helperText={!label.trim() ? `Используется безопасная подпись «${copy.label}».` : undefined} onChange={(event) => setLabel(event.currentTarget.value)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="description" type="string" defaultValue="—" description="Необязательное пояснение второй строкой.">
          <TextField label="Описание" size="m" value={description} onChange={(event) => setDescription(event.currentTarget.value)} />
        </ComponentPageSetting>
        <ComponentPageSetting name="size" type="'l' | 'm' | 's'" defaultValue="'l'" description="Размер визуального control и типографики.">
          <Select label="Размер" size="m" options={sizeOptions} value={size} onValueChange={(value) => setSize(value as SelectionSize)} />
        </ComponentPageSetting>
        {kind === 'radio-button' ? <ComponentPageSetting name="checked" type="boolean" defaultValue="false" description="Выбор принадлежит общей name-группе и controlled state приложения."><Select label="Выбранное значение" size="m" options={radioValueOptions} value={radioValue} onValueChange={setRadioValue} /></ComponentPageSetting> : <ComponentPageSetting name="checked" type="boolean" defaultValue="false" description="Текущее controlled значение."><Switch label="Выбрано" size="m" checked={checked} onChange={(event) => setChecked(event.currentTarget.checked)} /></ComponentPageSetting>}
        {kind === 'checkbox' ? <ComponentPageSetting name="indeterminate" type="boolean" defaultValue="false" description="Показывает частичный выбор через mixed semantics."><Switch label="Частичный выбор" size="m" checked={indeterminate} onChange={(event) => setIndeterminate(event.currentTarget.checked)} /></ComponentPageSetting> : null}
        <ComponentPageSetting name="disabled" type="boolean" defaultValue="false" description="Блокирует нативное переключение и последовательный фокус.">
          <Switch label="Недоступен" size="m" checked={disabled} onChange={(event) => setDisabled(event.currentTarget.checked)} />
        </ComponentPageSetting>
      </ComponentPageSettings>
    </section>
  );
}

function Accessibility({ kind }: { kind: Kind }) {
  const copy = content[kind];
  const apg = kind === 'checkbox' ? 'checkbox' : kind === 'radio-button' ? 'radio' : 'switch';
  const keyboardRows = kind === 'radio-button'
    ? <><tr><th scope="row">Tab / Shift + Tab</th><td>Переводят фокус в группу или за её пределы; каждый вариант не становится отдельной Tab-остановкой.</td></tr><tr><th scope="row">Arrow keys</th><td>Перемещают выбор между доступными Radio Button в общей <code>name</code>-группе.</td></tr><tr><th scope="row">Space</th><td>Выбирает вариант, который находится в фокусе.</td></tr></>
    : <><tr><th scope="row">Tab / Shift + Tab</th><td>Переводят фокус на элемент и к соседним интерактивным элементам.</td></tr><tr><th scope="row">Space</th><td>Переключает {kind === 'switch' ? 'состояние on/off' : 'значение checked'} нативно.</td></tr></>;
  const state = kind === 'checkbox' ? <><code>checked</code> сообщает выбор, <code>aria-checked="mixed"</code> — частичный выбор.</> : kind === 'radio-button' ? <>Нативный <code>checked</code> сообщает единственный выбранный вариант в группе.</> : <><code>role="switch"</code> и нативный <code>checked</code> сообщают состояние on/off.</>;

  return (
    <>
      <section className="content-section component-standard-accessibility" data-component-phase="behavior-a11y" aria-labelledby={`${kind}-keyboard-title`}>
        <header className="section-heading"><h2 id={`${kind}-keyboard-title`}>Клавиатура</h2><p>{copy.title} сохраняет нативное поведение соответствующего input.</p></header>
        <table className="component-standard-table"><caption className="visually-hidden">Клавиатурное управление {copy.title}</caption><thead><tr><th scope="col">Клавиша</th><th scope="col">Результат</th></tr></thead><tbody>{keyboardRows}</tbody></table>
      </section>
      <section className="content-section component-standard-accessibility" aria-labelledby={`${kind}-semantics-title`}>
        <header className="section-heading"><h2 id={`${kind}-semantics-title`}>Имя и состояние</h2><p>Видимая подпись связана с нативным input и входит в кликабельную область.</p></header>
        <table className="component-standard-table"><caption className="visually-hidden">Семантика {copy.title}</caption><thead><tr><th scope="col">Проверка</th><th scope="col">Контракт</th></tr></thead><tbody>
          <tr><th scope="row">Доступное имя</th><td><code>label</code> обязателен; пустая подпись не создаёт полезного элемента управления.</td></tr>
          <tr><th scope="row">Состояние</th><td>{state}</td></tr>
          <tr><th scope="row">Disabled</th><td>Нативный <code>disabled</code> блокирует изменение и убирает input из последовательной навигации.</td></tr>
          <tr><th scope="row">Видимый фокус</th><td>Сохраняйте системную рамку <code>:focus-visible</code> и не обрезайте её контейнером.</td></tr>
        </tbody></table>
        <p className="component-standard-sources"><InlineLink href={`https://www.w3.org/WAI/ARIA/apg/patterns/${apg}/`} target="_blank" rel="noreferrer">WAI-ARIA APG: {copy.title} ↗</InlineLink><InlineLink href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" target="_blank" rel="noreferrer">WCAG: видимый фокус ↗</InlineLink></p>
      </section>
    </>
  );
}

export function SelectionDetail({ kind }: { kind: Kind }) {
  const copy = content[kind];
  const component = components.find((item) => item.id === copy.id)!;
  const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`;
  const importCode = `import { ${copy.reactExport} } from '@cometal/react';`;
  const composition = kind === 'radio-button'
    ? [['Группа', 'Контейнер fieldset и legend задают общий вопрос.'], ['Поле', 'Нативный radio с общим name и уникальным value.'], ['Индикатор', 'Кольцо и точка отражают выбранное значение.'], ['Подпись', 'Обязательная подпись отдельного варианта.'], ['Пояснение', 'Необязательный текст второй строкой.']]
    : [['Поле', `Нативный checkbox${kind === 'switch' ? ' с role="switch"' : ''}.`], ['Индикатор', kind === 'switch' ? 'Дорожка и бегунок отражают текущее состояние.' : 'Рамка и отметка отражают unchecked, checked или mixed.'], ['Подпись', 'Обязательная подпись и доступное имя.'], ['Пояснение', 'Необязательный текст второй строкой.']];
  const overview = <><section className="content-section" data-component-phase="overview" aria-labelledby={`${kind}-preview-title`}><div className="component-standard-presentation"><h2 className="visually-hidden" id={`${kind}-preview-title`}>Пример {copy.title}</h2><SelectionPreview kind={kind} /></div></section><section className="content-section" aria-labelledby={`${kind}-usage-title`}><header className="section-heading"><h2 id={`${kind}-usage-title`}>Использование</h2><p>Импортируйте {copy.title} и передайте видимую подпись.</p></header><CodeBlock code={importCode} copyName={`импорт ${copy.title}`} compact /></section><section className="content-section" aria-labelledby={`${kind}-composition-title`}><header className="section-heading"><h2 id={`${kind}-composition-title`}>Композиция</h2></header><table className="component-standard-table"><caption className="visually-hidden">Элементы композиции {copy.title}</caption><thead><tr><th scope="col">Элемент</th><th scope="col">Описание</th></tr></thead><tbody>{composition.map(([part, description]) => <tr key={part}><th scope="row">{part}</th><td>{description}</td></tr>)}</tbody></table></section><section className="content-section" data-component-phase="usage" aria-labelledby={`${kind}-rules-title`}><header className="section-heading"><h2 id={`${kind}-rules-title`}>Правила использования</h2></header><table className="component-standard-table component-standard-practices-table"><caption className="visually-hidden">Правила использования {copy.title}</caption><thead><tr><th scope="col">Статус</th><th scope="col">Тезис</th><th scope="col">Объяснение</th></tr></thead><tbody><tr><td><Badge tone="green">Do</Badge></td><th scope="row">Подходящий выбор</th><td>{copy.use}</td></tr><tr><td><Badge tone="green">Do</Badge></td><th scope="row">Видимая подпись</th><td>Формулируйте label так, чтобы состояние было понятно без формы control.</td></tr><tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Другая модель</th><td>{copy.avoid}</td></tr><tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Скрытое состояние</th><td>Не полагайтесь только на цвет или положение visual marker.</td></tr></tbody></table></section><section className="content-section component-standard-examples-section" data-component-phase="visual-contract" aria-labelledby={`${kind}-examples-title`}><header className="section-heading"><h2 id={`${kind}-examples-title`}>Примеры</h2><p>Значения, disabled и размеры остаются настоящими интерактивными компонентами.</p></header><div className="component-standard-examples"><ComponentPageExample title="Значения и состояния" description={kind === 'radio-button' ? 'Одна name-группа сохраняет взаимоисключающий выбор и пропускает disabled вариант.' : 'Каждый control можно переключить; disabled остаётся недоступным.'} code={valuesCode(kind)} preview={<ValuesPreview kind={kind} />} /><ComponentPageExample title="Размеры" description="L, M и S меняют control и типографику, сохраняя подпись частью кликабельной области." code={sizesCode(kind)} preview={<SizesPreview kind={kind} />} /></div></section></>;

  return <ComponentPageStandard title={copy.title} summary={copy.summary} status={component.status} statusLabel={statusLabels[component.status]} stableId={component.id} reactExport={copy.reactExport} figmaHref={component.links.figma} storybookHref={`/storybook/?path=/story/${copy.story}`} sourceHref={sourceHref} overview={overview} settings={<SelectionSettings kind={kind} />} accessibility={<Accessibility kind={kind} />} />;
}
