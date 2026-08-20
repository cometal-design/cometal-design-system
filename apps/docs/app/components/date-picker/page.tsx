import type { Metadata } from 'next';
import { DatePicker, DateRangePicker } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
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

      <section className="content-section"><SectionHeading title="Использование" description="Single date решает точечное событие. Period picker используйте для отчётов, сроков и header-фильтров таблиц." /><div className="field-family-board"><article><header><code>input.date-picker</code><h3>Single date</h3></header><div className="field-family-board__examples"><DatePicker label="Дата поставки" defaultValue="2026-07-15" helperText="Выберите дату" /><DatePicker label="Дата поставки" value="2026-07-15" mode="read" /></div></article><article><header><code>input.date-range-picker</code><h3>Date range</h3></header><div className="field-family-board__examples"><DateRangePicker label="Период поставки" helperText="Выберите период" defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }} /><DateRangePicker label="Период поставки" size="m" mode="read" defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }} /></div></article></div></section>
      <section className="content-section"><SectionHeading title="Код" description="Скопируйте установку, импорт или минимальный рабочий пример. Все три представления используют один источник и соответствуют публичному React API." /><CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} /></section>
      <section className="content-section"><SectionHeading title="Архитектура" description="Публичный API остаётся компактным: поле, period contract и календарные состояния, без экспорта внутренних частей как самостоятельных компонентов." /><div className="definition-list"><article><span>01</span><strong>Date Field Trigger</strong><p>Поле, формат, helper/error и кнопка раскрытия.</p></article><article><span>02</span><strong>Calendar Panel</strong><p>Overlay 364px с навигацией по месяцам, Monday-first grid и Soft elevation.</p></article><article><span>03</span><strong>Calendar Day</strong><p>44×44px и состояния selected, today, outside, disabled, focus-visible.</p></article><article><span>04</span><strong>Range semantics</strong><p>Период хранится как start/end и собирается через canonical classes start, middle и end.</p></article></div></section>
      <section className="content-section"><SectionHeading title="Технический контракт" description="Storybook фиксирует single date, date range, open period picker и table header-filter reuse. Полная матрица состояний и клавиатурного поведения живёт там." /></section>
    </main>
  );
}
