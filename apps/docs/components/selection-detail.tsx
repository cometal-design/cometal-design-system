import { Checkbox, RadioButton, Switch } from '@cometal/react';
import type { ReactNode } from 'react';
import { components, statusLabels } from '../lib/registry';
import { usageExamples } from '../lib/usage-examples';
import { CodeExample } from './code-example';
import { ComponentEnvironmentNotes } from './component-environment-notes';
import { ComponentPageHeader } from './component-page-header';
import { SectionHeading } from './section-heading';

type Kind = 'checkbox' | 'radio-button' | 'switch';

const content: Record<Kind, { id: string; title: string; summary: string; figma: string; story: string; use: string; avoid: string }> = {
  checkbox: { id: 'selection.checkbox', title: 'Checkbox', summary: 'Независимый выбор с unchecked, checked и mixed.', figma: '1571-521', story: 'components-checkbox--playground', use: 'Для независимого согласия или выбора нескольких строк.', avoid: 'Для одного варианта из группы или мгновенного включения настройки.' },
  'radio-button': { id: 'selection.radio-button', title: 'Radio Button', summary: 'Выбор одного взаимоисключающего значения внутри группы.', figma: '1571-8954', story: 'components-radio-button--playground', use: 'Когда пользователь должен видеть все взаимоисключающие варианты.', avoid: 'Для независимых пунктов или длинного списка вариантов.' },
  switch: { id: 'selection.switch', title: 'Switch', summary: 'Немедленно включает или выключает настройку.', figma: '1571-9673', story: 'components-switch--playground', use: 'Когда изменение применяется сразу после переключения.', avoid: 'Для согласия в форме или действия, которое требует отдельного Save.' },
};

function Example({ kind, state }: { kind: Kind; state: 'off' | 'on' | 'mixed' | 'disabled' }) {
  if (kind === 'checkbox') return <Checkbox label="Согласен с условиями" description="Дополнительное пояснение выбора" defaultChecked={state === 'on'} indeterminate={state === 'mixed'} disabled={state === 'disabled'} />;
  if (kind === 'radio-button') return <RadioButton label="Выбрать вариант" description="В группе может быть выбран только один вариант" name={`docs-radio-${state}`} checked={state === 'on'} readOnly disabled={state === 'disabled'} />;
  return <Switch label="Получать уведомления" description="Изменение применяется сразу" defaultChecked={state === 'on'} disabled={state === 'disabled'} />;
}

function SizeExample({ kind, size }: { kind: Kind; size: 'l' | 'm' | 's' }) {
  const common = { size, label: size === 'l' ? 'Large' : size === 'm' ? 'Medium' : 'Small' };
  if (kind === 'checkbox') return <Checkbox {...common} defaultChecked />;
  if (kind === 'radio-button') return <RadioButton {...common} name={`size-${size}`} defaultChecked />;
  return <Switch {...common} defaultChecked />;
}

export function SelectionDetail({ kind, stableId }: { kind: Kind; stableId: ReactNode }) {
  const copy = content[kind];
  const component = components.find((item) => item.id === copy.id)!;
  const usage = usageExamples[component.id];
  const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`;
  const extraValue: ReactNode = kind === 'checkbox' ? <article><code>Mixed</code><Example kind={kind} state="mixed" /></article> : null;
  return (
    <main className="content-page component-detail">
      <ComponentPageHeader
        title={copy.title}
        summary={copy.summary}
        status={component.status}
        statusLabel={statusLabels[component.status]}
        figmaHref={`https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=${copy.figma}`}
        playgroundHref={`/storybook/?path=/story/${copy.story}`}
      />
      <div className="metadata-strip" data-component-phase="identity" data-top-divider data-bottom-divider><span>Stable ID</span>{stableId}<span>React</span><strong>{component.name}</strong></div>
      <section className="content-section" data-component-phase="overview"><SectionHeading title="Рабочий пример" description="Живой control показывает базовое значение, label и supporting description." /><Example kind={kind} state="off" /></section>
      <section className="content-section" data-component-phase="visual-contract" id="values"><SectionHeading title="Значения и состояния" description="Hover, pressed и focus проверяются реальным взаимодействием; disabled передаётся приложением." /><div className="selection-value-board"><article><code>{kind === 'switch' ? 'Off' : kind === 'radio-button' ? 'Not selected' : 'Unchecked'}</code><Example kind={kind} state="off" /></article><article><code>{kind === 'switch' ? 'On' : kind === 'radio-button' ? 'Selected' : 'Checked'}</code><Example kind={kind} state="on" /></article>{extraValue}<article><code>Disabled</code><Example kind={kind} state="disabled" /></article></div></section>
      <section className="content-section" id="sizes"><SectionHeading title="Размеры" description="L, M и S меняют control и типографику, но сохраняют доступную кликабельную область с label." /><div className="selection-size-row">{(['l','m','s'] as const).map((size)=><article key={size}><code>{size.toUpperCase()}</code><SizeExample kind={kind} size={size} /></article>)}</div></section>
      <section className="content-section" data-component-phase="code" id="code"><SectionHeading title="Код" description="Скопируйте установку, импорт или минимальный рабочий пример, соответствующий нативной семантике компонента." /><CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} /></section>
      <section className="content-section" data-component-phase="usage" id="usage"><SectionHeading title="Использование" description="Label является частью компонента и увеличивает кликабельную область нативного control." /><div className="guidance"><article data-tone="positive"><strong>Используйте</strong><p>{copy.use}</p></article><article data-tone="negative"><strong>Не используйте</strong><p>{copy.avoid}</p></article></div></section>
      <section className="content-section" data-component-phase="behavior-a11y"><SectionHeading title="Поведение и доступность" description="Компонент сохраняет нативную input-семантику, клавиатурное переключение и доступное имя из label." /><div className="definition-list"><article><span>01</span><strong>Keyboard</strong><p>Tab переводит focus на control, Space меняет значение; Radio Button в общей name-группе сохраняет нативный выбор одного значения.</p></article><article><span>02</span><strong>State</strong><p>{kind === 'checkbox' ? 'Mixed передаётся как aria-checked=mixed.' : 'Checked state остаётся частью нативного input contract.'}</p></article></div></section>
      <section className="content-section" data-component-phase="public-api" id="api"><SectionHeading title="React API" description="Компонент расширяет нативные InputHTMLAttributes и не эмулирует browser behavior." /><div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[['label','string','required'],['description','string','—'],['size',"'l' | 'm' | 's'","'l'"],['checked / defaultChecked','boolean','native'],...(kind==='checkbox'?[['indeterminate','boolean','false']]:[])].map(([name,type,value])=><div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div></section>
      <div data-component-phase="adaptation"><ComponentEnvironmentNotes
        responsive="Control, label и description образуют одну кликабельную строку с min-width: 0; длинный текст переносится в content, не уменьшая нативный input и focus target."
        theme="Control, label, disabled и focus-visible используют semantic tokens активной темы; отдельного light/dark prop нет."
        edgeCases={kind === 'checkbox'
          ? 'Mixed задаётся indeterminate и aria-checked=mixed; disabled остаётся нативным. Empty label недопустим, потому что label является обязательным доступным именем.'
          : kind === 'radio-button'
            ? 'Все варианты группы используют общий name; empty group и одиночный Radio Button не выражают взаимоисключающий выбор. Disabled сохраняет нативную семантику.'
            : 'Switch применяется сразу: pending/error продукта показываются рядом, а не как новый Switch state. Empty label недопустим; disabled блокирует нативное переключение.'}
      /></div>
    </main>
  );
}
