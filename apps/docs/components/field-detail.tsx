'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Checkbox,
  Combobox,
  InlineLink,
  MultiSelect,
  Select,
  TextArea,
  TextField,
  fieldSizes,
  multilineFieldSizes,
} from '@cometal/react';
import type { FieldMode, FieldSize, TextFieldProps } from '@cometal/react';
import { ComponentPageStandard } from './component-page-standard';
import type { ComponentPageSection } from './component-page-standard';
import { ComponentPageSettings, ComponentPageSetting } from './component-page-settings';
import { ComponentPageExample } from './component-page-example';
import { CodeBlock } from './code-block';
import { fieldDocumentation, fieldStatusOptions, fieldCompanyOptions } from '../lib/field-documentation';
import type { FieldSlug } from '../lib/field-documentation';
import { components, statusLabels } from '../lib/registry';

type FieldControlProps = Pick<
  TextFieldProps,
  'label' | 'placeholder' | 'helperText' | 'error' | 'disabled' | 'optional' | 'size' | 'mode'
> & {
  kind: FieldSlug;
  value: string;
  onValueChange: (value: string) => void;
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  expanded: boolean;
  onExpandedChange: (open: boolean) => void;
  showCounter?: boolean;
  clearable?: boolean;
};

function FieldControl({
  kind,
  value,
  onValueChange,
  selectedValues,
  onSelectedValuesChange,
  expanded,
  onExpandedChange,
  showCounter = false,
  clearable = true,
  ...common
}: FieldControlProps) {
  const multilineSize = common.size === 's' ? 'l' : common.size;
  switch (kind) {
    case 'text-field':
      return (
        <TextField {...common} value={value} onChange={(event) => onValueChange(event.currentTarget.value)} />
      );
    case 'text-area':
      return (
        <TextArea
          {...common}
          size={multilineSize}
          rows={4}
          maxLength={200}
          showCounter={showCounter}
          value={value}
          onChange={(event) => onValueChange(event.currentTarget.value)}
        />
      );
    case 'select':
      return (
        <Select
          {...common}
          options={fieldStatusOptions}
          value={value}
          onValueChange={onValueChange}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
        />
      );
    case 'combobox':
      return (
        <Combobox
          {...common}
          options={fieldCompanyOptions}
          value={value}
          onChange={(event) => onValueChange(event.currentTarget.value)}
          onOptionSelect={(selected) =>
            onValueChange(fieldCompanyOptions.find((option) => option.value === selected)?.label ?? '')
          }
          onClear={() => onValueChange('')}
          clearable={clearable}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
        />
      );
    case 'multi-select':
      return (
        <MultiSelect
          {...common}
          size={multilineSize}
          options={fieldCompanyOptions}
          selectedValues={selectedValues}
          onSelectedValuesChange={onSelectedValuesChange}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
        />
      );
  }
}

type SnippetOptions = {
  size?: FieldSize;
  mode?: FieldMode;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  optional?: boolean;
  value?: string;
  selectedValues?: string[];
  showCounter?: boolean;
  clearable?: boolean;
};
function fieldCode(kind: FieldSlug, settings: SnippetOptions = {}) {
  const doc = fieldDocumentation[kind];
  const values = kind === 'multi-select';
  const list = kind === 'select' || kind === 'combobox' || values;
  const initial = values
    ? (settings.selectedValues ?? ['north', 'nlmk'])
    : (settings.value ?? doc.initialValue);
  const options = kind === 'select' ? fieldStatusOptions : fieldCompanyOptions;
  const attrs = [
    `label={${JSON.stringify(settings.label ?? doc.label)}}`,
    `size=${JSON.stringify(settings.size ?? 'l')}`,
    `placeholder={${JSON.stringify(settings.placeholder ?? doc.placeholder)}}`,
  ];
  if (settings.mode) attrs.push(`mode=${JSON.stringify(settings.mode)}`);
  if (settings.helperText) attrs.push(`helperText={${JSON.stringify(settings.helperText)}}`);
  if (settings.error) attrs.push(`error={${JSON.stringify(settings.error)}}`);
  if (settings.disabled) attrs.push('disabled');
  if (settings.optional) attrs.push('optional');
  if (kind === 'text-area')
    attrs.push('rows={4}', 'maxLength={200}', `showCounter={${settings.showCounter ?? false}}`);
  if (kind === 'combobox') attrs.push(`clearable={${settings.clearable ?? true}}`);
  if (list) attrs.push('options={options}');
  attrs.push(values ? 'selectedValues={values}' : 'value={value}');
  if (values) attrs.push('onSelectedValuesChange={setValues}');
  else if (kind === 'select') attrs.push('onValueChange={setValue}');
  else attrs.push('onChange={(event) => setValue(event.currentTarget.value)}');
  if (kind === 'combobox')
    attrs.push(
      "onOptionSelect={(selected) => setValue(options.find((option) => option.value === selected)?.label ?? '')}",
      "onClear={() => setValue('')}",
    );
  return `import { useState } from 'react';\nimport { ${doc.reactExport} } from '@cometal/react';\n${list ? `\nconst options = ${JSON.stringify(options, null, 2)};\n` : ''}\nexport function Example() {\n  const [${values ? 'values, setValues' : 'value, setValue'}] = useState${values ? '<string[]>' : ''}(${JSON.stringify(initial)});\n  return (\n    <${doc.reactExport}\n      ${attrs.join('\n      ')}\n    />\n  );\n}`;
}

function fieldExamplesCode(kind: FieldSlug, examples: SnippetOptions[]) {
  const first = fieldCode(kind, examples[0]);
  const preamble = first.slice(0, first.indexOf('export function'));
  const bodies = examples.map((example, index) => {
    const snippet = fieldCode(kind, example);
    return snippet
      .slice(snippet.indexOf('export function'))
      .replace('function Example()', `function Example${index + 1}()`);
  });
  return preamble + bodies.join('\n\n');
}

export function FieldDemo({
  kind,
  active = true,
  size = 'l',
  mode = 'edit',
  disabled = false,
  error,
  empty = false,
}: {
  kind: FieldSlug;
  active?: boolean;
  size?: FieldSize;
  mode?: FieldMode;
  disabled?: boolean;
  error?: string;
  empty?: boolean;
}) {
  const doc = fieldDocumentation[kind];
  const [value, setValue] = useState<string>(empty ? '' : doc.initialValue);
  const [selectedValues, setSelectedValues] = useState<string[]>(empty ? [] : ['north', 'nlmk']);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!active) setExpanded(false);
  }, [active]);
  return (
    <div className="field-doc-control" data-field-kind={kind}>
      <FieldControl
        kind={kind}
        label={doc.label}
        placeholder={doc.placeholder}
        value={value}
        onValueChange={setValue}
        selectedValues={selectedValues}
        onSelectedValuesChange={setSelectedValues}
        size={size}
        mode={mode}
        disabled={disabled}
        error={error}
        showCounter={kind === 'text-area'}
        expanded={active && expanded}
        onExpandedChange={setExpanded}
      />
    </div>
  );
}

function FieldSettings({ kind, active }: { kind: FieldSlug; active: boolean }) {
  const doc = fieldDocumentation[kind];
  const [size, setSize] = useState<FieldSize>('l');
  const [mode, setMode] = useState<FieldMode>('edit');
  const [label, setLabel] = useState<string>(doc.label);
  const [placeholder, setPlaceholder] = useState<string>(doc.placeholder);
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [optional, setOptional] = useState(false);
  const [counter, setCounter] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [value, setValue] = useState<string>(doc.initialValue);
  const [selectedValues, setSelectedValues] = useState<string[]>(['north', 'nlmk']);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!active) setExpanded(false);
  }, [active]);
  const sizes = kind === 'text-area' || kind === 'multi-select' ? multilineFieldSizes : fieldSizes;
  const settings = {
    size,
    mode,
    label,
    placeholder,
    helperText,
    error,
    disabled,
    optional,
    showCounter: counter,
    clearable,
    value,
    selectedValues,
  };
  function reset() {
    setSize('l');
    setMode('edit');
    setLabel(doc.label);
    setPlaceholder(doc.placeholder);
    setHelperText('');
    setError('');
    setDisabled(false);
    setOptional(false);
    setCounter(false);
    setClearable(true);
    setValue(doc.initialValue);
    setSelectedValues(['north', 'nlmk']);
    setExpanded(false);
  }
  // Unmount control popups while the persistent documentation panel is inactive.
  if (!active) return null;
  return (
    <ComponentPageSettings
      componentName={doc.title}
      onReset={reset}
      code={fieldCode(kind, settings)}
      preview={
        <div className="field-doc-control" data-field-kind={kind}>
          <FieldControl
            kind={kind}
            {...settings}
            onValueChange={setValue}
            onSelectedValuesChange={setSelectedValues}
            expanded={expanded}
            onExpandedChange={setExpanded}
          />
        </div>
      }
      note="Начальные значения здесь — конфигурация примера. В API size по умолчанию L, mode — edit, disabled и optional — false; текст и выбранные значения задаёт приложение."
    >
      <ComponentPageSetting
        name="size"
        type={sizes.join(' | ')}
        defaultValue="l"
        description="Размер control без изменения его семантики."
      >
        <Select
          label="Размер"
          size="m"
          options={sizes.map((item) => ({ value: item, label: item.toUpperCase() }))}
          value={size}
          onValueChange={(next) => {
            if (sizes.some((item) => item === next)) setSize(next === 's' ? 's' : next === 'm' ? 'm' : 'l');
          }}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="mode"
        type="edit | read"
        defaultValue="edit"
        description="Read показывает значение текстом, без интерактивной рамки и tab-stop."
      >
        <Select
          label="Режим"
          size="m"
          options={[
            { value: 'edit', label: 'Редактирование' },
            { value: 'read', label: 'Чтение' },
          ]}
          value={mode}
          onValueChange={(next) => {
            setMode(next === 'read' ? 'read' : 'edit');
            setExpanded(false);
          }}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="label"
        type="string"
        defaultValue="обязательное"
        description="Видимая подпись и доступное имя поля."
      >
        <TextField
          size="m"
          label="Подпись"
          value={label}
          onChange={(event) => setLabel(event.currentTarget.value)}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="placeholder"
        type="string"
        defaultValue="—"
        description="Короткая подсказка в пустом поле, не замена label."
      >
        <TextField
          size="m"
          label="Текст пустого поля"
          value={placeholder}
          onChange={(event) => setPlaceholder(event.currentTarget.value)}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="helperText"
        type="string"
        defaultValue="—"
        description="Пояснение под control, связанное с ним программно."
      >
        <TextField
          size="m"
          label="Подсказка"
          value={helperText}
          onChange={(event) => setHelperText(event.currentTarget.value)}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="error"
        type="string"
        defaultValue="—"
        description="Сообщение об ошибке заменяет helper и задаёт aria-invalid."
      >
        <TextField
          size="m"
          label="Ошибка"
          value={error}
          onChange={(event) => setError(event.currentTarget.value)}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="disabled"
        type="boolean"
        defaultValue="false"
        description="Исключает control из взаимодействия; не заменяет mode=read."
      >
        <Checkbox
          label="Недоступно"
          checked={disabled}
          onChange={(event) => {
            setDisabled(event.currentTarget.checked);
            setExpanded(false);
          }}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="optional"
        type="boolean"
        defaultValue="false"
        description="Показывает необязательность поля. Не сочетайте с required."
      >
        <Checkbox
          label="Необязательное поле"
          checked={optional}
          onChange={(event) => setOptional(event.currentTarget.checked)}
        />
      </ComponentPageSetting>
      {kind === 'text-area' ? (
        <ComponentPageSetting
          name="showCounter"
          type="boolean"
          defaultValue="false"
          description="Счётчик текущего controlled текста при maxLength=200. В примере rows=4."
        >
          <Checkbox
            label="Счётчик символов"
            checked={counter}
            onChange={(event) => setCounter(event.currentTarget.checked)}
          />
        </ComponentPageSetting>
      ) : null}
      {kind === 'combobox' ? (
        <ComponentPageSetting
          name="clearable"
          type="boolean"
          defaultValue="true"
          description="Кнопка очистки появляется при непустом запросе и вызывает onClear."
        >
          <Checkbox
            label="Разрешить очистку"
            checked={clearable}
            onChange={(event) => setClearable(event.currentTarget.checked)}
          />
        </ComponentPageSetting>
      ) : null}
      <ComponentPageSetting
        name={
          kind === 'multi-select'
            ? 'selectedValues / onSelectedValuesChange'
            : kind === 'select'
              ? 'value / onValueChange'
              : 'value / onChange'
        }
        type={kind === 'multi-select' ? 'string[] / callback' : 'string / callback'}
        defaultValue="задаёт приложение"
        description="Изменяйте значение в самом предпросмотре: код выше сразу отразит текущую конфигурацию."
      >
        <p>
          Controlled пример.{' '}
          {kind === 'combobox'
            ? 'onOptionSelect преобразует option.value в label; onClear очищает текст.'
            : 'Reset восстанавливает исходные значения примера.'}
        </p>
      </ComponentPageSetting>
    </ComponentPageSettings>
  );
}

export function FieldDetail({ kind }: { kind: FieldSlug }) {
  const doc = fieldDocumentation[kind];
  const component = components.find((item) => item.id === doc.stableId)!;
  const [section, setSection] = useState<ComponentPageSection>('overview');
  const active = section === 'overview';
  const sizes = kind === 'text-area' || kind === 'multi-select' ? multilineFieldSizes : fieldSizes;
  const overview = (
    <>
      <section className="content-section" aria-label={`Представление ${doc.title}`}>
        <div className="component-standard-presentation">
          <FieldDemo kind={kind} active={active} />
        </div>
      </section>
      <section className="content-section" id="usage">
        <h2>Использование</h2>
        <p>
          Импортируйте {doc.reactExport} из workspace-пакета и передайте понятную подпись. {doc.use}
        </p>
        <CodeBlock
          code={`import { ${doc.reactExport} } from '@cometal/react';`}
          copyName={`импорт ${doc.title}`}
          compact
        />
      </section>
      <section className="content-section" id="composition">
        <h2>Композиция</h2>
        <table className="component-standard-table">
          <thead>
            <tr>
              <th>Элемент</th>
              <th>Назначение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Control</th>
              <td>{doc.anatomy}</td>
            </tr>
            <tr>
              <th>Supporting text</th>
              <td>Подсказка, ошибка и отметка необязательности дополняют label.</td>
            </tr>
            <tr>
              <th>Read</th>
              <td>Текстовое значение без редактирования и фокуса.</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="content-section" id="boundaries">
        <h2>Правила использования</h2>
        <table className="component-standard-table component-standard-practices-table">
          <thead>
            <tr>
              <th>Статус</th>
              <th>Тезис</th>
              <th>Объяснение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Badge tone="green">Do</Badge>
              </td>
              <th>Подходящая задача</th>
              <td>{doc.use}</td>
            </tr>
            <tr>
              <td>
                <Badge tone="red">Don’t</Badge>
              </td>
              <th>Другая семантика</th>
              <td>{doc.avoid}</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="content-section" id="examples">
        <h2>Примеры</h2>
        <div className="component-standard-examples">
          <ComponentPageExample
            title="Управляемое значение"
            description={`${doc.summary} Попробуйте изменить значение; пример содержит необходимый state и обработчики.`}
            preview={<FieldDemo kind={kind} active={active} />}
            code={fieldCode(kind, { showCounter: kind === 'text-area' })}
          />
          <ComponentPageExample
            title="Размеры"
            description={
              sizes.length === 3
                ? 'S 32px, M 40px, L 48px: общий масштаб однострочных controls.'
                : 'M и L: многострочный control растёт по своей композиции; S не поддерживается.'
            }
            preview={
              <div className="field-doc-stack">
                {sizes.map((size) => (
                  <article key={size}>
                    <code>{size.toUpperCase()}</code>
                    <FieldDemo kind={kind} size={size} active={active} />
                  </article>
                ))}
              </div>
            }
            code={fieldExamplesCode(
              kind,
              sizes.map((size) => ({ size, showCounter: kind === 'text-area' })),
            )}
          />
          <ComponentPageExample
            title="Ошибка и чтение"
            description="Ошибка сообщает, что исправить; read показывает сохранённое значение без disabled-поля. Hover и focus возникают только при взаимодействии."
            preview={
              <div className="field-doc-stack">
                <FieldDemo kind={kind} active={active} error="Проверьте значение" />
                <FieldDemo kind={kind} active={active} mode="read" />
                <FieldDemo kind={kind} active={active} disabled />
              </div>
            }
            code={fieldExamplesCode(kind, [
              { error: 'Проверьте значение', showCounter: kind === 'text-area' },
              { mode: 'read', showCounter: kind === 'text-area' },
              { disabled: true, showCounter: kind === 'text-area' },
            ])}
          />
        </div>
      </section>
    </>
  );
  const accessibility = (
    <div className="field-doc-accessibility">
      <section className="content-section">
        <h2>Клавиатура</h2>
        <p>{doc.keyboard}</p>
      </section>
      <section className="content-section">
        <h2>Семантика и имена</h2>
        <p>{doc.semantics}</p>
      </section>
      <section className="content-section">
        <h2>Контраст и фокус</h2>
        <p>
          Label и supporting text сохраняют смысл без одного только цвета. FieldChrome владеет видимым
          keyboard focus; pointer не добавляет вторую рамку. Disabled не заменяет read.
        </p>
      </section>
      <section className="content-section">
        <h2>Адаптация и ограничения</h2>
        <p>
          Control занимает доступную ширину. Используются semantic tokens текущей темы, отдельного theme prop
          нет. Не обрезайте label, helper и focus ring. {doc.edge}
        </p>
        <p>
          Раскрытия закрываются при смене раздела документации. Это поведение страницы, а не новый API
          компонента.
        </p>
      </section>
      <section className="content-section">
        <h2>Источники доступности</h2>
        <p>
          Описание основано на текущей реализации, а не на отдельной сертификации или тестировании screen
          reader.
        </p>
        <InlineLink href={doc.apg} target="_blank" rel="noreferrer">
          W3C WAI: рекомендации ↗
        </InlineLink>
      </section>
    </div>
  );
  return (
    <ComponentPageStandard
      title={doc.title}
      summary={doc.summary}
      stableId={doc.stableId}
      reactExport={doc.reactExport}
      status={component.status}
      statusLabel={statusLabels[component.status]}
      figmaHref={component.links.figma}
      storybookHref={component.links.storybook}
      sourceHref={`https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`}
      overview={overview}
      settings={<FieldSettings kind={kind} active={section === 'settings'} />}
      accessibility={accessibility}
      onSectionChange={setSection}
    />
  );
}
