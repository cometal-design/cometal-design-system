import { Checkbox, RadioButton, Switch } from '@cometal/react';
import type { ReactNode } from 'react';
import { components, statusLabels } from '../lib/registry';

type Kind = 'checkbox' | 'radio-button' | 'switch';

const content: Record<Kind, { id: string; title: string; summary: string; figma: string; story: string; use: string; avoid: string }> = {
  checkbox: { id: 'selection.checkbox', title: 'Checkbox', summary: 'Независимый выбор с unchecked, checked и mixed.', figma: '1571-521', story: 'components-checkbox--overview', use: 'Для независимого согласия или выбора нескольких строк.', avoid: 'Для одного варианта из группы или мгновенного включения настройки.' },
  'radio-button': { id: 'selection.radio-button', title: 'Radio Button', summary: 'Выбор одного взаимоисключающего значения внутри группы.', figma: '1571-8954', story: 'components-radio-button--overview', use: 'Когда пользователь должен видеть все взаимоисключающие варианты.', avoid: 'Для независимых пунктов или длинного списка вариантов.' },
  switch: { id: 'selection.switch', title: 'Switch', summary: 'Немедленно включает или выключает настройку.', figma: '1571-9673', story: 'components-switch--overview', use: 'Когда изменение применяется сразу после переключения.', avoid: 'Для согласия в форме или действия, которое требует отдельного Save.' },
};

function Example({ kind, state }: { kind: Kind; state: 'off' | 'on' | 'mixed' | 'disabled' }) {
  if (kind === 'checkbox') return <Checkbox label="Согласен с условиями" description="Дополнительное пояснение выбора" defaultChecked={state === 'on'} indeterminate={state === 'mixed'} disabled={state === 'disabled'} />;
  if (kind === 'radio-button') return <RadioButton label="Выбрать вариант" description="В группе может быть выбран только один вариант" name={`docs-radio-${state}`} defaultChecked={state === 'on'} disabled={state === 'disabled'} />;
  return <Switch label="Получать уведомления" description="Изменение применяется сразу" defaultChecked={state === 'on'} disabled={state === 'disabled'} />;
}

function SizeExample({ kind, size }: { kind: Kind; size: 'l' | 'm' | 's' }) {
  const common = { size, label: size === 'l' ? 'Large' : size === 'm' ? 'Medium' : 'Small' };
  if (kind === 'checkbox') return <Checkbox {...common} defaultChecked />;
  if (kind === 'radio-button') return <RadioButton {...common} name={`size-${size}`} defaultChecked />;
  return <Switch {...common} defaultChecked />;
}

export function SelectionDetail({ kind }: { kind: Kind }) {
  const copy = content[kind];
  const component = components.find((item) => item.id === copy.id)!;
  const extraValue: ReactNode = kind === 'checkbox' ? <article><code>Mixed</code><Example kind={kind} state="mixed" /></article> : null;
  return (
    <main className="content-page component-detail">
      <header className="component-title"><div><span className="eyebrow">COMPONENT · WEB · {statusLabels[component.status].toUpperCase()}</span><h1>{copy.title}</h1><p>{copy.summary}</p></div><div className="component-title__links"><a href={`https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=${copy.figma}`} target="_blank" rel="noreferrer">Figma ↗</a><a href={`/storybook/?path=/story/${copy.story}`}>Открыть Playground ↗</a></div></header>
      <nav className="on-page-nav" aria-label="Содержание страницы"><a href="#usage">Использование</a><a href="#values">Значения</a><a href="#sizes">Размеры</a><a href="#api">React API</a></nav>
      <section className="content-section" id="usage"><div className="section-heading"><h2>Использование</h2><p>Label является частью компонента и увеличивает кликабельную область нативного control.</p></div><div className="guidance"><article data-tone="positive"><strong>Используйте</strong><p>{copy.use}</p></article><article data-tone="negative"><strong>Не используйте</strong><p>{copy.avoid}</p></article></div></section>
      <section className="content-section" id="values"><div className="section-heading"><h2>Значения и состояния</h2><p>Hover, pressed и focus проверяются реальным взаимодействием; disabled передаётся приложением.</p></div><div className="selection-value-board"><article><code>{kind === 'switch' ? 'Off' : kind === 'radio-button' ? 'Not selected' : 'Unchecked'}</code><Example kind={kind} state="off" /></article><article><code>{kind === 'switch' ? 'On' : kind === 'radio-button' ? 'Selected' : 'Checked'}</code><Example kind={kind} state="on" /></article>{extraValue}<article><code>Disabled</code><Example kind={kind} state="disabled" /></article></div></section>
      <section className="content-section" id="sizes"><div className="section-heading"><h2>Размеры</h2><p>L, M и S меняют control и типографику, но сохраняют доступную кликабельную область с label.</p></div><div className="selection-size-row">{(['l','m','s'] as const).map((size)=><article key={size}><code>{size.toUpperCase()}</code><SizeExample kind={kind} size={size} /></article>)}</div></section>
      <section className="content-section" id="api"><div className="section-heading"><h2>React API</h2><p>Компонент расширяет нативные InputHTMLAttributes и не эмулирует browser behavior.</p></div><div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[['label','string','required'],['description','string','—'],['size',"'l' | 'm' | 's'","'l'"],['checked / defaultChecked','boolean','native'],...(kind==='checkbox'?[['indeterminate','boolean','false']]:[])].map(([name,type,value])=><div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div></section>
      <aside className="review-banner"><div><span>Статус</span><strong>{statusLabels[component.status]}</strong></div><p>Визуал, нативная семантика и автоматические проверки собраны. Для Beta требуется review Frontend Lead.</p><a href={`/storybook/?path=/story/${copy.story}`}>Техническая документация ↗</a></aside>
    </main>
  );
}
