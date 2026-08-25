import { Badge } from '@cometal/react';
import type { BadgeSurface, BadgeTone } from '@cometal/react';
import CheckIcon from '@cometal/react/icons/outline/general/check-01';
import { components, statusLabels } from '../lib/registry';
import { usageExamples } from '../lib/usage-examples';
import { CodeExample } from './code-example';
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
      <section className="content-section" id="usage"><SectionHeading title="Использование" description="Badge маркирует состояние или атрибут. Для действия используйте Button или Link." /><div className="guidance"><article data-tone="positive"><strong>Используйте</strong><p>Для статуса заявки, уровня риска, категории или короткого системного признака.</p></article><article data-tone="negative"><strong>Не используйте</strong><p>Как кнопку, фильтр или единственный способ передать смысл только цветом.</p></article></div></section>
      <section className="content-section" id="code"><SectionHeading title="Код" description="Surface и tone отделены от состава текста и иконок." /><CodeExample componentName={component.name} sourceHref={sourceHref} usage={usage} /></section>
      <section className="content-section" id="tones"><SectionHeading title="Surface и tone" description="Light снижает визуальный приоритет, Dark усиливает статусный акцент." /><div className="badge-tone-board">{badgeSurfaces.map((surface)=><article key={surface}><code>{surface}</code><div>{badgeTones.map((tone)=><Badge key={tone} surface={surface} tone={tone}>{tone}</Badge>)}</div></article>)}</div></section>
      <section className="content-section" id="composition"><SectionHeading title="Состав" description="Текст и иконки независимы; без текста одна иконка формирует круг 24×24." /><div className="badge-composition-row"><Badge>Статус</Badge><Badge startIcon={<CheckIcon />}>Статус</Badge><Badge endIcon={<CheckIcon />}>Статус</Badge><Badge startIcon={<CheckIcon />} endIcon={<CheckIcon />}>Статус</Badge><Badge aria-label="Согласовано" surface="dark" tone="green" startIcon={<CheckIcon />} /></div></section>
      <section className="content-section" id="api"><SectionHeading title="React API" description="Композиция не раздувает variant API." /><div className="api-table"><div className="api-table__head"><span>Prop</span><span>Тип</span><span>Default</span></div>{[['surface',"'light' | 'dark'","'light'"],['tone',"BadgeTone","'neutral'"],['startIcon / endIcon','ReactNode','—'],['children','ReactNode','—'],['aria-label','string','required for icon-only']].map(([name,type,value])=><div key={name}><code>{name}</code><span>{type}</span><span>{value}</span></div>)}</div></section>
    </main>
  );
}
