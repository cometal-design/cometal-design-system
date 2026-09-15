'use client';

import { useEffect, useState } from 'react';
import {
  Badge,
  Checkbox,
  DatePicker,
  DateRangePicker,
  InlineLink,
  Select,
  TextField,
  fieldSizes,
} from '@cometal/react';
import type { DateRangeValue, FieldMode, FieldSize } from '@cometal/react';
import { ComponentPageStandard } from './component-page-standard';
import type { ComponentPageSection } from './component-page-standard';
import { ComponentPageSettings, ComponentPageSetting } from './component-page-settings';
import { ComponentPageExample } from './component-page-example';
import { CodeBlock } from './code-block';
import { components, statusLabels } from '../lib/registry';

type DateKind = 'date' | 'range';
type DateConfiguration = {
  kind: DateKind;
  size: FieldSize;
  mode: FieldMode;
  label: string;
  helperText: string;
  error: string;
  disabled: boolean;
  optional: boolean;
  bounded: boolean;
};
const initialConfiguration: DateConfiguration = {
  kind: 'date',
  size: 'l',
  mode: 'edit',
  label: 'Дата поставки',
  helperText: '',
  error: '',
  disabled: false,
  optional: false,
  bounded: false,
};
const exampleToday = '2026-09-15';
const initialDate = '2026-09-18';
const initialRange = (): DateRangeValue => ({
  start: new Date(2026, 8, 18),
  end: new Date(2026, 8, 23),
});

function dateExpression(value: Date | null) {
  return value ? `new Date(${value.getFullYear()}, ${value.getMonth()}, ${value.getDate()})` : 'null';
}

function dateCode(config: DateConfiguration, date: string | null = initialDate, range = initialRange()) {
  const isRange = config.kind === 'range';
  const component = isRange ? 'DateRangePicker' : 'DatePicker';
  const attrs = [
    `label={${JSON.stringify(config.label)}}`,
    `size="${config.size}"`,
    `mode="${config.mode}"`,
    'value={value}',
    isRange ? 'onChange={setValue}' : 'onValueChange={setValue}',
    isRange ? 'today={new Date(2026, 8, 15)}' : 'today="2026-09-15"',
  ];
  if (config.bounded)
    attrs.push(
      isRange ? 'min={new Date(2026, 8, 10)}' : 'min="2026-09-10"',
      isRange ? 'max={new Date(2026, 8, 25)}' : 'max="2026-09-25"',
    );
  if (config.helperText) attrs.push(`helperText={${JSON.stringify(config.helperText)}}`);
  if (config.error) attrs.push(`error={${JSON.stringify(config.error)}}`);
  if (config.disabled) attrs.push('disabled');
  if (config.optional) attrs.push('optional');
  const initial = isRange
    ? `{ start: ${dateExpression(range.start)}, end: ${dateExpression(range.end)} }`
    : JSON.stringify(date);
  return `import { useState } from 'react';
import { ${component} } from '@cometal/react';${isRange ? "\nimport type { DateRangeValue } from '@cometal/react';" : ''}

export function Example() {
  const [value, setValue] = useState<${isRange ? 'DateRangeValue' : 'string | null'}>(${initial});
  return (
    <${component}
      ${attrs.join('\n      ')}
    />
  );
}`;
}

function DateControl({
  config,
  date,
  setDate,
  range,
  setRange,
  open,
  setOpen,
}: {
  config: DateConfiguration;
  date: string | null;
  setDate: (value: string | null) => void;
  range: DateRangeValue;
  setRange: (value: DateRangeValue) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const { kind, bounded, ...common } = config;
  if (kind === 'range') {
    return (
      <DateRangePicker
        {...common}
        error={common.error || undefined}
        value={range}
        onChange={setRange}
        today={new Date(2026, 8, 15)}
        min={bounded ? new Date(2026, 8, 10) : undefined}
        max={bounded ? new Date(2026, 8, 25) : undefined}
        open={open}
        onOpenChange={setOpen}
      />
    );
  }
  return (
    <DatePicker
      {...common}
      error={common.error || undefined}
      value={date}
      onValueChange={setDate}
      today={exampleToday}
      min={bounded ? '2026-09-10' : undefined}
      max={bounded ? '2026-09-25' : undefined}
      open={open}
      onOpenChange={setOpen}
    />
  );
}

function DateDemo({
  active,
  config,
  empty = false,
}: {
  active: boolean;
  config: DateConfiguration;
  empty?: boolean;
}) {
  const [date, setDate] = useState<string | null>(empty ? null : initialDate);
  const [range, setRange] = useState<DateRangeValue>(empty ? { start: null, end: null } : initialRange);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!active) setOpen(false);
  }, [active]);
  return (
    <div className="field-doc-control" data-date-kind={config.kind}>
      <DateControl
        config={config}
        date={date}
        setDate={setDate}
        range={range}
        setRange={setRange}
        open={active && open}
        setOpen={setOpen}
      />
    </div>
  );
}

function DateSettings({ active }: { active: boolean }) {
  const [config, setConfig] = useState<DateConfiguration>(initialConfiguration);
  const [generation, setGeneration] = useState(0);
  const [date, setDate] = useState<string | null>(initialDate);
  const [range, setRange] = useState<DateRangeValue>(initialRange);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!active) setOpen(false);
  }, [active]);
  function update(next: Partial<DateConfiguration>) {
    setConfig((current) => ({ ...current, ...next }));
    setOpen(false);
  }
  function reset() {
    setConfig(initialConfiguration);
    setDate(initialDate);
    setRange(initialRange());
    setOpen(false);
    setGeneration((current) => current + 1);
  }
  if (!active) return null;
  return (
    <ComponentPageSettings
      componentName="Date Picker"
      onReset={reset}
      code={dateCode(config, date, range)}
      note="Начальная дата 18 сентября 2026 и today=15 сентября фиксированы только для повторяемости примера. В API value по умолчанию пустое, size=L, mode=edit; today без prop определяется текущим днём."
      preview={
        <div className="field-doc-control" data-date-kind={config.kind}>
          <DateControl
            key={generation}
            config={config}
            date={date}
            setDate={setDate}
            range={range}
            setRange={setRange}
            open={open}
            setOpen={setOpen}
          />
        </div>
      }
    >
      <ComponentPageSetting
        name="Компонент"
        type="DatePicker | DateRangePicker"
        defaultValue="DatePicker в примере"
        description="Выбор демонстрации, не prop: одна ISO-дата или период из двух Date."
      >
        <Select
          label="Вид даты"
          size="m"
          value={config.kind}
          options={[
            { value: 'date', label: 'Одна дата' },
            { value: 'range', label: 'Период' },
          ]}
          onValueChange={(value) =>
            update({
              kind: value === 'range' ? 'range' : 'date',
              label: value === 'range' ? 'Период поставки' : 'Дата поставки',
            })
          }
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="size"
        type="l | m | s"
        defaultValue="l"
        description="Оба публичных компонента поддерживают L, M и S."
      >
        <Select
          label="Размер"
          size="m"
          value={config.size}
          options={fieldSizes.map((size) => ({ value: size, label: size.toUpperCase() }))}
          onValueChange={(size) => update({ size: size === 's' ? 's' : size === 'm' ? 'm' : 'l' })}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="mode"
        type="edit | read"
        defaultValue="edit"
        description="Read показывает локализованную дату без control и календаря."
      >
        <Select
          label="Режим"
          size="m"
          value={config.mode}
          options={[
            { value: 'edit', label: 'Редактирование' },
            { value: 'read', label: 'Чтение' },
          ]}
          onValueChange={(mode) => update({ mode: mode === 'read' ? 'read' : 'edit' })}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="label"
        type="string"
        defaultValue="обязательное"
        description="Видимая подпись и доступное имя даты."
      >
        <TextField
          label="Подпись"
          size="m"
          value={config.label}
          onChange={(event) => update({ label: event.currentTarget.value })}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="helperText"
        type="string"
        defaultValue="—"
        description="Инструкция, связанная с input."
      >
        <TextField
          label="Подсказка"
          size="m"
          value={config.helperText}
          onChange={(event) => update({ helperText: event.currentTarget.value })}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="error"
        type="string"
        defaultValue="—"
        description="Внешняя ошибка. Неверная календарная дата также проверяется внутри компонента."
      >
        <TextField
          label="Ошибка"
          size="m"
          value={config.error}
          onChange={(event) => update({ error: event.currentTarget.value })}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="disabled"
        type="boolean"
        defaultValue="false"
        description="Запрещает ввод и раскрытие; не подменяет read."
      >
        <Checkbox
          label="Недоступно"
          checked={config.disabled}
          onChange={(event) => update({ disabled: event.currentTarget.checked })}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="optional"
        type="boolean"
        defaultValue="false"
        description="Отметка необязательного поля; не сочетайте с required."
      >
        <Checkbox
          label="Необязательное поле"
          checked={config.optional}
          onChange={(event) => update({ optional: event.currentTarget.checked })}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="min / max"
        type="ISO string · Date для Range"
        defaultValue="—"
        description="В примере включается допустимый период 10–25 сентября 2026 включительно."
      >
        <Checkbox
          label="Ограничить даты"
          checked={config.bounded}
          onChange={(event) => update({ bounded: event.currentTarget.checked })}
        />
      </ComponentPageSetting>
      <ComponentPageSetting
        name="value / callbacks"
        type="string | null · DateRangeValue"
        defaultValue="пустое"
        description="Date: onValueChange(ISO|null). Range: onChange({start,end}); границы — Date|null."
      >
        <p>Редактируйте значение в предпросмотре: код отражает текущее состояние.</p>
      </ComponentPageSetting>
      <ComponentPageSetting
        name="open / onOpenChange"
        type="boolean / callback"
        defaultValue="false"
        description="Управляемое раскрытие. В примере календарь открывается действием пользователя."
      >
        <p>
          Reset и смена раздела закрывают календарь. locale по умолчанию ru-RU; name, required, placeholder и
          autoComplete поддерживаются публичным API.
        </p>
      </ComponentPageSetting>
    </ComponentPageSettings>
  );
}

export function DatePickerDetail() {
  const component = components.find((item) => item.id === 'input.date-picker')!;
  const [section, setSection] = useState<ComponentPageSection>('overview');
  const active = section === 'overview';
  const rangeConfig: DateConfiguration = { ...initialConfiguration, kind: 'range', label: 'Период поставки' };
  const boundedConfig = { ...initialConfiguration, bounded: true };
  const overview = (
    <>
      <section className="content-section" aria-label="Представление Date Picker">
        <div className="component-standard-presentation">
          <DateDemo active={active} config={initialConfiguration} />
        </div>
      </section>
      <section className="content-section" id="usage">
        <h2>Использование</h2>
        <p>
          Для одной календарной даты используйте DatePicker; для начала и конца периода — DateRangePicker.
          Ввод вручную и выбор в календаре меняют одно значение.
        </p>
        <CodeBlock
          code="import { DatePicker, DateRangePicker } from '@cometal/react';"
          copyName="импорт Date Picker"
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
              <th>Поле</th>
              <td>Label, input с форматом ДД.ММ.ГГГГ, кнопка календаря, supporting text.</td>
            </tr>
            <tr>
              <th>Календарь</th>
              <td>
                Body portal, навигация по месяцам, сетка от понедельника и состояния дня. Panel ограничена
                viewport.
              </td>
            </tr>
            <tr>
              <th>Период</th>
              <td>Начало, середина и конец диапазона; не два независимых несвязанных поля.</td>
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
              <th>Календарный день</th>
              <td>Дата поставки, срок или период; min/max выражают реальные ограничения.</td>
            </tr>
            <tr>
              <td>
                <Badge tone="red">Don’t</Badge>
              </td>
              <th>Время и часовой пояс</th>
              <td>
                Компонент не выбирает время суток, длительность или timezone. Не трактуйте локальную дату как
                UTC timestamp.
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="content-section" id="examples">
        <h2>Примеры</h2>
        <div className="component-standard-examples">
          <ComponentPageExample
            title="Одна дата"
            description="Controlled ISO-значение; попробуйте ввести 31.02.2026 и выйти из поля для проверки несуществующей даты."
            preview={<DateDemo active={active} config={initialConfiguration} />}
            code={dateCode(initialConfiguration)}
          />
          <ComponentPageExample
            title="Период"
            description="Два последовательных выбора определяют границы. Date создаются через год, месяц и день без UTC-сдвига."
            preview={<DateDemo active={active} config={rangeConfig} />}
            code={dateCode(rangeConfig)}
          />
          <ComponentPageExample
            title="Ограниченный диапазон"
            description="Доступны даты 10–25 сентября; ручной ввод также проверяет min/max."
            preview={<DateDemo active={active} config={boundedConfig} />}
            code={dateCode(boundedConfig)}
          />
          {fieldSizes.map((size) => {
            const config = { ...initialConfiguration, size };
            return (
              <ComponentPageExample
                key={size}
                title={`Размер ${size.toUpperCase()}`}
                description="Одинаковый календарный контракт при другом размере поля."
                preview={<DateDemo active={active} config={config} />}
                code={dateCode(config)}
              />
            );
          })}
          <ComponentPageExample
            title="Пустое значение"
            description="Пустая дата хранится как null, а не как недостоверный день."
            preview={<DateDemo active={active} config={initialConfiguration} empty />}
            code={dateCode(initialConfiguration, null)}
          />
          {(['read', 'disabled', 'error'] as const).map((state) => {
            const config: DateConfiguration = {
              ...initialConfiguration,
              mode: state === 'read' ? 'read' : 'edit',
              disabled: state === 'disabled',
              error: state === 'error' ? 'Проверьте срок поставки' : '',
            };
            return (
              <ComponentPageExample
                key={state}
                title={state}
                description="Реальное состояние публичного компонента; focus и hover не форсируются."
                preview={<DateDemo active={active} config={config} />}
                code={dateCode(config)}
              />
            );
          })}
        </div>
      </section>
    </>
  );
  const accessibility = (
    <div className="field-doc-accessibility">
      <section className="content-section">
        <h2>Клавиатура</h2>
        <p>
          Tab переводит фокус в поле и на кнопку календаря. Enter или ArrowDown открывает календарь. Стрелки
          перемещают день, Home/End — внутри недели, PageUp/PageDown — месяц; Shift с PageUp/PageDown — год.
          Enter или Space выбирает день. Escape закрывает и возвращает фокус.
        </p>
      </section>
      <section className="content-section">
        <h2>Семантика и ошибки</h2>
        <p>
          Label называет input; helper и ошибка связаны через aria-describedby. Неверный ввод даёт
          aria-invalid. Календарь имеет role=dialog, дни — доступные имена с полной датой. Выбранная дата и
          today не передаются только цветом.
        </p>
      </section>
      <section className="content-section">
        <h2>Фокус и адаптация</h2>
        <p>
          FieldChrome владеет keyboard focus. Календарь располагается в body portal и следует за anchor при
          scroll/resize, меняет сторону и ограничивается viewport. Вкладки документации закрывают раскрытие,
          не меняя публичный API.
        </p>
      </section>
      <section className="content-section">
        <h2>Темы и ограничения</h2>
        <p>
          Используются semantic tokens текущей темы, отдельного theme prop нет. Длинные label/error должны
          переноситься. Range может быть незавершённым; приложение решает, допустимо ли это для отправки.
          min/max, високосные дни и неверный формат проверяются существующим календарным parser. Screen reader
          certification здесь не заявляется.
        </p>
        <InlineLink
          href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/"
          target="_blank"
          rel="noreferrer"
        >
          WAI: пример календарного диалога ↗
        </InlineLink>
      </section>
    </div>
  );
  return (
    <ComponentPageStandard
      title="Date Picker"
      summary="Одна дата или период: ручной ввод и календарь с общими правилами."
      stableId="input.date-picker"
      reactExport="DatePicker · DateRangePicker"
      status={component.status}
      statusLabel={statusLabels[component.status]}
      figmaHref={component.links.figma}
      storybookHref={component.links.storybook}
      sourceHref={`https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`}
      overview={overview}
      settings={<DateSettings active={section === 'settings'} />}
      accessibility={accessibility}
      onSectionChange={setSection}
    />
  );
}
