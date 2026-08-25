import { Badge } from '@cometal/react';
import type { BadgeSurface, BadgeTone } from '@cometal/react';
import CheckIcon from '@cometal/react/icons/outline/general/check-01';
import { components, statusLabels } from '../lib/registry';
import { usageExamples } from '../lib/usage-examples';
import { CodeExample } from './code-example';
import { ComponentEnvironmentNotes } from './component-environment-notes';
import { ComponentPageHeader } from './component-page-header';
import { SectionHeading } from './section-heading';

const badgeSurfaces: readonly BadgeSurface[] = ['light', 'dark'];
const badgeTones: readonly BadgeTone[] = ['neutral', 'blue', 'cyan', 'green', 'purple', 'red', 'violet', 'yellow'];

export function BadgeDetail() {
  const component = components.find((item) => item.id === 'status.badge')!;
  const usage = usageExamples[component.id];
  const sourceHref = `https://github.com/cometal-design/cometal-design-system/blob/main/${component.links.source}`;

  return (
    <main className="content-page component-detail">
      <ComponentPageHeader
        title="Badge"
        summary="Компактный неинтерактивный статус или атрибут с Light/Dark surface и восемью смысловыми тонами."
        status={component.status}
        statusLabel={statusLabels[component.status]}
        figmaHref={component.links.figma}
        playgroundHref="/storybook/?path=/story/components-badge--playground"
      />
      <div className="metadata-strip" data-component-phase="identity" data-top-divider data-bottom-divider><span>Stable ID</span><code>status.badge</code><span>React</span><strong>Badge</strong></div>
      <section className="content-section" data-component-phase="overview"><SectionHeading title="Рабочий пример" description="Живой Badge показывает базовый неинтерактивный статус на Light surface." /><Badge tone="green" startIcon={<CheckIcon />}>Согласовано</Badge></section>
      <section className="content-section" data-component-phase="visual-contract" id="tones"><SectionHeading title="Surface и tone" description="Light снижает визуальный приоритет, Dark усиливает статусный акцент." /><div className="badge-tone-board">{badgeSurfaces.map((surface)=><article key={surface}><code>{surface}</code><div>{badgeTones.map((tone)=><Badge key={tone} surface={surface} tone={tone}>{tone}</Badge>)}</div></article>)}</div></section>
      <section className="content-section" id="composition"><SectionHeading title="Состав" description="Текст и иконки независимы; без текста одна иконка формирует круг 24×24." /><div className="badge-composition-row"><Badge>Статус</Badge><Badge startIcon={<CheckIcon />}>Статус</Badge><Badge endIcon={<CheckIcon />}>Статус</Badge><Badge startIcon={<CheckIcon />} endIcon={<CheckIcon />}>Статус</Badge><Badge aria-label="Согласовано" surface="dark" tone="green" startIcon={<CheckIcon />} /></div></section>
      <section className="content-section" data-component-phase="code" id="code"><SectionHeading title="Код" description="Surface и tone отделены от состава текста и иконок." /><CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} /></section>
      <section className="content-section" data-component-phase="usage" id="usage"><SectionHeading title="Использование" description="Badge маркирует состояние или атрибут. Для действия используйте Button или Link." /><div className="guidance"><article data-tone="positive"><strong>Используйте</strong><p>Для статуса заявки, уровня риска, категории или короткого системного признака.</p></article><article data-tone="negative"><strong>Не используйте</strong><p>Как кнопку, фильтр или единственный способ передать смысл только цветом.</p></article></div></section>
      <section className="content-section" data-component-phase="behavior-a11y"><SectionHeading title="Поведение и доступность" description="Badge не получает focus и не запускает действие; смысл статуса остаётся доступен без опоры только на цвет." /><div className="definition-list"><article><span>01</span><strong>Semantics</strong><p>Текст Badge формирует доступное имя неинтерактивного статуса; control semantics не добавляется.</p></article><article><span>02</span><strong>Icon-only</strong><p>Композиция без текста имеет role=img и требует явный aria-label.</p></article></div></section>
      <section className="content-section" data-component-phase="public-api" id="api"><SectionHeading title="React API" description="Композиция не раздувает variant API." /><div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[['surface',"'light' | 'dark'","'light'"],['tone',"BadgeTone","'neutral'"],['startIcon / endIcon','ReactNode','—'],['children','ReactNode','—'],['aria-label','string','required for icon-only']].map(([name,type,value])=><div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div></section>
      <div data-component-phase="adaptation"><ComponentEnvironmentNotes
        responsive="Badge остаётся inline-flex с одной строкой и ellipsis внутри доступной ширины. Длинный статус лучше сократить содержательно, а не уменьшать высоту 24px."
        theme="Light и Dark — публичные surface-варианты самого Badge; оба используют семантические tokens и сохраняют смысл tone в активной теме."
        edgeCases="Icon-only Badge имеет role=img и требует aria-label. Пустой children без иконки не создаёт полезного статуса; один цвет никогда не должен быть единственным носителем смысла."
      /></div>
    </main>
  );
}
