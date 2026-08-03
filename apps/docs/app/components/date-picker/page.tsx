import type { Metadata } from 'next';
import { ActionLink, DatePicker } from '@cometal/react';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';

export const metadata: Metadata = { title: 'Date Picker' };

export default function DatePickerPage() {
  const component = components.find((item) => item.id === 'input.date-picker')!;
  return (
    <main className="content-page component-detail">
      <header className="component-title">
        <div><div className="component-title__meta"><span className="eyebrow">КОМПОНЕНТ · WEB</span></div><h1>Date Picker</h1><p>Ручной ввод и календарный выбор одной даты в едином публичном компоненте.</p></div>
        <div className="component-title__toolbar"><div className="component-title__links"><ActionLink href={component.links.figma} target="_blank" rel="noreferrer" variant="secondary">Figma ↗</ActionLink><ActionLink href="/storybook/?path=/story/components-date-picker--overview" variant="secondary">Открыть Playground ↗</ActionLink></div><span className="status component-title__status" data-status={component.status}>{statusLabels[component.status]}</span></div>
      </header>

      <section className="content-section"><SectionHeading title="Использование" description="Используйте для одного календарного значения. Интервал и дата со временем являются отдельными компонентами." /><div className="field-family-board"><article><header><code>input.date-picker</code><h3>Edit</h3></header><div className="field-family-board__examples"><DatePicker label="Дата поставки" defaultValue="2026-07-15" helperText="Выберите дату" /><DatePicker label="Дата поставки" value="2026-07-15" mode="read" /></div></article></div></section>
      <section className="content-section"><SectionHeading title="Архитектура" description="Публичный компонент скрывает внутреннюю инженерию календаря и не размножает продуктовые контракты." /><div className="definition-list"><article><span>01</span><strong>Date Field Trigger</strong><p>Поле, формат, helper/error и кнопка раскрытия.</p></article><article><span>02</span><strong>Calendar Panel</strong><p>Overlay 364px с навигацией по месяцам и grid.</p></article><article><span>03</span><strong>Calendar Day</strong><p>44×44px и состояния selected, today, outside, disabled, focus-visible.</p></article></div></section>
      <section className="content-section"><SectionHeading title="Технический контракт" description="Полная матрица состояний, клавиатурное поведение, Controls и автоматические проверки находятся в Storybook." /></section>
    </main>
  );
}
