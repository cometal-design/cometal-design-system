import type { Metadata } from 'next';
import { DatePicker, DateRangePicker } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
import { ComponentEnvironmentNotes } from '../../../components/component-environment-notes';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Date Picker' };

export default function DatePickerPage() {
  const component = components.find((item) => item.id === 'input.date-picker')!;
  const usage = usageExamples[component.id];
  const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`;
  return (
    <main className="content-page component-detail">
      <ComponentPageHeader
        title="Date Picker"
        summary="Семейство для одной даты и периода: единый календарный контракт без размножения внутренних частей в API."
        status={component.status}
        statusLabel={statusLabels[component.status]}
        figmaHref={component.links.figma}
        playgroundHref="/storybook/?path=/story/components-date-picker--playground"
      />

      <section className="content-section" id="usage">
        <SectionHeading title="Использование" description="Single date решает точечное событие. Period picker используйте для отчётов, сроков и header-фильтров таблиц." />
        <div className="guidance">
          <article data-tone="positive"><strong>Используйте</strong><p>Date Picker для одной календарной даты, Date Range Picker — для непрерывного периода с явными start и end.</p></article>
          <article data-tone="negative"><strong>Не используйте</strong><p>Не используйте календарь для времени суток, произвольного текста или периода без календарных границ. Для неизменяемого значения включайте <code>mode=&quot;read&quot;</code>.</p></article>
        </div>
        <div className="field-family-board"><article><header><code>input.date-picker</code><h3>Single date</h3></header><div className="field-family-board__examples"><DatePicker label="Дата поставки" defaultValue="2026-07-15" helperText="Выберите дату" /><DatePicker label="Дата поставки" value="2026-07-15" mode="read" /></div></article><article><header><code>input.date-range-picker</code><h3>Date range</h3></header><div className="field-family-board__examples"><DateRangePicker label="Период поставки" helperText="Выберите период" defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }} /><DateRangePicker label="Период поставки" size="m" mode="read" defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }} /></div></article></div>
      </section>
      <section className="content-section"><SectionHeading title="Код" description="Скопируйте установку, импорт или минимальный рабочий пример. Все три представления используют один источник и соответствуют публичному React API." /><CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} /></section>
      <section className="content-section" id="states">
        <SectionHeading title="Размеры и состояния" description="Single date поддерживает L, M и S; Date Range — L и M. Error, disabled, read и open сохраняют один value contract." />
        <div className="field-size-board">
          {(['l', 'm', 's'] as const).map((size) => <article key={size}><code>Single · {size.toUpperCase()}</code><DatePicker label="Дата" size={size} defaultValue="2026-07-15" /></article>)}
        </div>
        <div className="field-state-board">
          <article><code>Default</code><DatePicker label="Дата" /></article>
          <article><code>Error</code><DatePicker label="Дата" defaultValue="2026-07-15" error="Проверьте дату" /></article>
          <article><code>Disabled</code><DatePicker label="Дата" disabled /></article>
          <article><code>Read</code><DatePicker label="Дата" value="2026-07-15" mode="read" /></article>
        </div>
      </section>
      <section className="content-section"><SectionHeading title="Архитектура" description="Публичный API остаётся компактным: поле, period contract и календарные состояния, без экспорта внутренних частей как самостоятельных компонентов." /><div className="definition-list"><article><span>01</span><strong>Date Field Trigger</strong><p>Поле, формат, helper/error и кнопка раскрытия.</p></article><article><span>02</span><strong>Calendar Panel</strong><p>Overlay 364px с навигацией по месяцам, Monday-first grid и Soft elevation.</p></article><article><span>03</span><strong>Calendar Day</strong><p>44×44px и состояния selected, today, outside, disabled, focus-visible.</p></article><article><span>04</span><strong>Range semantics</strong><p>Период хранится как start/end и собирается через canonical classes start, middle и end.</p></article></div></section>
      <section className="content-section"><SectionHeading title="Технический контракт" description="Storybook фиксирует single date, date range, open period picker и table header-filter reuse." /><div className="definition-list"><article><span>01</span><strong>Keyboard</strong><p>Alt+ArrowDown открывает calendar, стрелки перемещают focus по дням, Home/End — по неделе, PageUp/PageDown — по месяцам, Escape закрывает и возвращает focus trigger.</p></article><article><span>02</span><strong>ARIA</strong><p>Поле связано с helper/error, trigger сообщает dialog state, calendar использует grid/gridcell, выбранная дата — aria-selected, сегодня — aria-current=date.</p></article><article><span>03</span><strong>Validation</strong><p>Ручной ввод принимает формат ДД.ММ.ГГГГ; min/max и required формируют error без изобретения отдельного visual state prop.</p></article></div></section>
      <section className="content-section" id="api">
        <SectionHeading title="React API" description="Single date хранит ISO string, range — нормализованный DateRangeValue; оба поддерживают controlled и uncontrolled value/open." />
        <div className="api-table">
          <div className="api-table__head"><span>Prop</span><span>Тип</span><span>Назначение</span></div>
          <div><code>value / defaultValue</code><code>string | DateRangeValue</code><span>Controlled или начальное значение.</span></div>
          <div><code>onValueChange / onChange</code><code>callback</code><span>Изменение single date или range.</span></div>
          <div><code>size</code><code>l | m | s</code><span>Date Range ограничен L/M; default L.</span></div>
          <div><code>mode</code><code>edit | read</code><span>Интерактивное поле или неинтерактивное отображение.</span></div>
          <div><code>min / max / required</code><code>date bounds</code><span>Доступность и validation.</span></div>
          <div><code>open / defaultOpen / onOpenChange</code><code>boolean / callback</code><span>Controlled или uncontrolled calendar panel.</span></div>
        </div>
      </section>
      <ComponentEnvironmentNotes
        responsive="Поле занимает доступную ширину, а calendar panel ограничивается min(364px, viewport). На узком viewport grid остаётся семидневным и не выходит за горизонтальный inset."
        theme="Field, raised panel, selected range, today, error и focus используют semantic tokens активной темы; отдельного light/dark prop нет."
        edgeCases="Empty optional value возвращает null, required empty показывает error; min/max блокируют недоступные дни, а reversed range нормализуется в start ≤ end."
      />
    </main>
  );
}
