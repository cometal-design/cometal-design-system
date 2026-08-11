import type { Metadata } from 'next';
import { DatePicker } from '@cometal/react';
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
        summary="Ручной ввод и календарный выбор одной даты в едином публичном компоненте."
        status={component.status}
        statusLabel={statusLabels[component.status]}
        figmaHref={component.links.figma}
        playgroundHref="/storybook/?path=/story/components-date-picker--playground"
      />

      <section className="content-section"><SectionHeading title="Использование" description="Используйте для одного календарного значения. Интервал и дата со временем являются отдельными компонентами." /><div className="field-family-board"><article><header><code>input.date-picker</code><h3>Edit</h3></header><div className="field-family-board__examples"><DatePicker label="Дата поставки" defaultValue="2026-07-15" helperText="Выберите дату" /><DatePicker label="Дата поставки" value="2026-07-15" mode="read" /></div></article></div></section>
      <section className="content-section"><SectionHeading title="Код" description="Скопируйте установку, импорт или минимальный рабочий пример. Все три представления используют один источник и соответствуют публичному React API." /><CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} /></section>
      <section className="content-section"><SectionHeading title="Архитектура" description="Публичный компонент скрывает внутреннюю инженерию календаря и не размножает продуктовые контракты." /><div className="definition-list"><article><span>01</span><strong>Date Field Trigger</strong><p>Поле, формат, helper/error и кнопка раскрытия.</p></article><article><span>02</span><strong>Calendar Panel</strong><p>Overlay 364px с навигацией по месяцам и grid.</p></article><article><span>03</span><strong>Calendar Day</strong><p>44×44px и состояния selected, today, outside, disabled, focus-visible.</p></article></div></section>
      <section className="content-section"><SectionHeading title="Технический контракт" description="Полная матрица состояний, клавиатурное поведение, Controls и автоматические проверки находятся в Storybook." /></section>
    </main>
  );
}
