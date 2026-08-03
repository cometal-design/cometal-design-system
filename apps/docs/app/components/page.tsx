import type { Metadata } from 'next';
import Link from 'next/link';
import { Button, Checkbox, Combobox, DatePicker, MultiSelect, RadioButton, Select, Switch, TextArea, TextField } from '@cometal/react';
import { checksComplete, components, statusLabels } from '../../lib/registry';

export const metadata: Metadata = { title: 'Компоненты' };

const catalogContent: Record<string, { href: string; description: string }> = {
  'action.button': { href: '/components/button/', description: 'Запускает одно понятное действие пользователя.' },
  'input.text-field': { href: '/components/fields/#text-field', description: 'Однострочный ввод в режимах Edit и Read.' },
  'input.date-picker': { href: '/components/date-picker/', description: 'Ручной ввод и календарный выбор одной даты.' },
  'input.text-area': { href: '/components/fields/#text-area', description: 'Многострочный ввод с helper и counter.' },
  'input.select': { href: '/components/fields/#select', description: 'Одиночный выбор из известного набора.' },
  'input.combobox': { href: '/components/fields/#combobox', description: 'Поиск и выбор одного значения.' },
  'input.multi-select': { href: '/components/fields/#multi-select', description: 'Множественный выбор с tags в trigger.' },
  'selection.checkbox': { href: '/components/checkbox/', description: 'Независимый выбор: unchecked, checked и mixed.' },
  'selection.radio-button': { href: '/components/radio-button/', description: 'Один вариант из взаимоисключающей группы.' },
  'selection.switch': { href: '/components/switch/', description: 'Мгновенно включает или выключает настройку.' },
};

function ComponentPreview({ id }: { id: string }) {
  if (id === 'input.text-field') return <TextField label="Название поля" placeholder="Введите значение" />;
  if (id === 'input.date-picker') return <DatePicker label="Дата поставки" defaultValue="2026-07-15" />;
  if (id === 'input.text-area') return <TextArea label="Комментарий" placeholder="Введите комментарий" rows={3} />;
  if (id === 'input.select') return <Select label="Статус" options={[{ value: 'active', label: 'Активный' }]} defaultValue="" />;
  if (id === 'input.combobox') return <Combobox label="Контрагент" placeholder="Найдите значение" />;
  if (id === 'input.multi-select') return <MultiSelect label="Контрагенты" selectedValues={['Северсталь', 'НЛМК']} />;
  if (id === 'selection.checkbox') return <Checkbox label="Согласен с условиями" defaultChecked />;
  if (id === 'selection.radio-button') return <RadioButton label="Выбрать вариант" name="catalog-radio" defaultChecked />;
  if (id === 'selection.switch') return <Switch label="Получать уведомления" defaultChecked />;
  return <Button>Продолжить</Button>;
}

export default function ComponentsPage() {
  return (
    <main className="content-page components-page">
      <header className="page-header page-header--with-stat">
        <div><span className="eyebrow">КОМПОНЕНТЫ</span><h1>Каталог компонентов</h1><p>Единый каталог реализованных компонентов. Карточка появляется здесь из реестра Git, а не добавляется вручную.</p></div>
        <div className="page-stat"><strong>{components.length}</strong><span>компонентов в реестре</span></div>
      </header>

      <section className="catalog-toolbar" aria-label="Сводка каталога">
        <span>Web · React</span><span>{components.filter((component) => component.status === 'ready').length} Ready</span><span>{components.filter((component) => component.status === 'in-review').length} In review</span>
      </section>

      <section className="component-catalog" aria-label="Каталог компонентов">
        {components.map((component) => (
          <article className="component-card" key={component.id}>
            <div className="component-card__preview"><div className="component-card__demo"><ComponentPreview id={component.id} /></div></div>
            <div className="component-card__body">
              <div><code>{component.id}</code><span className="status" data-status={component.status}>{statusLabels[component.status] ?? component.status}</span></div>
              <h2><Link href={catalogContent[component.id]?.href ?? '/components/'}>{component.name}</Link></h2>
              <p>{catalogContent[component.id]?.description}</p>
              <footer><span>{component.version}</span><span>{checksComplete(component)}/5 источников согласовано</span></footer>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
