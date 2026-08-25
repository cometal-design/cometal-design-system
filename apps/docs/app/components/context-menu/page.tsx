import type { Metadata } from 'next';
import { Button, ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Context Menu' };
const component = components.find((item) => item.id === 'overlay.context-menu')!;
const sourceHref = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/ContextMenu/ContextMenu.tsx';

export default function ContextMenuPage() {
  return <main className="content-page component-detail">
    <ComponentPageHeader title="Context Menu" summary="Контекстные действия над сущностью: pointer/trigger anchor, клавиатурная навигация, selected, disabled и danger items." status={component.status} statusLabel={statusLabels[component.status]} figmaHref={component.links.figma} playgroundHref="/storybook/?path=/story/components-context-menu--overview" />
    <div className="metadata-strip" data-top-divider data-bottom-divider><span>Stable ID</span><code>overlay.context-menu</code><span>React</span><strong>ContextMenu</strong></div>

    <section className="content-section">
      <SectionHeading title="Рабочий пример" description="Menu остаётся overlay-компонентом. Product pattern решает, к какой сущности и сценарию его привязать." />
      <div className="component-inline-demo"><ContextMenu defaultOpen trigger={<Button size="m" variant="secondary">Открыть меню</Button>}><ContextMenuItem>Открыть</ContextMenuItem><ContextMenuItem selected>Закрепить</ContextMenuItem><ContextMenuItem disabled>Недоступно</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Удалить</ContextMenuItem></ContextMenu></div>
    </section>

    <section className="content-section" id="usage">
      <SectionHeading title="Использование" description="Набор коротких действий относится к конкретной сущности и открывается из видимого trigger или по contextmenu." />
      <div className="guidance">
        <article data-tone="positive"><strong>Используйте</strong><p>Для вторичных действий над строкой, файлом или объектом, когда их связь с текущим контекстом однозначна.</p></article>
        <article data-tone="negative"><strong>Не используйте</strong><p>Не используйте Context Menu для основной навигации, сложной формы, длинного объяснения или единственного пути к критичному действию.</p></article>
      </div>
    </section>

    <section className="content-section" id="states">
      <SectionHeading title="Размеры и состояния" description="Surface поддерживает L, M и S; item показывает default, selected, disabled и danger без локальных visual substitutes." />
      <div className="definition-list">
        <article><span>01</span><strong>Size</strong><p><code>l | m | s</code> задаётся ContextMenu и передаётся дочерним items; default — <code>m</code>.</p></article>
        <article><span>02</span><strong>Item</strong><p><code>selected</code> создаёт menuitemcheckbox с aria-checked; <code>disabled</code> исключает item из навигации; <code>tone=&quot;danger&quot;</code> обозначает разрушительное действие.</p></article>
        <article><span>03</span><strong>Open / anchor</strong><p>Controlled и uncontrolled open поддерживают trigger и pointer anchor; clickOpens/contextOpens позволяют отключить отдельный способ открытия.</p></article>
      </div>
    </section>

    <section className="content-section">
      <SectionHeading title="Поведение и доступность" description="Portal surface имеет role=menu, получает доступное имя от trigger и удерживает keyboard focus только на доступных items." />
      <div className="definition-list">
        <article><span>01</span><strong>Keyboard</strong><p>ArrowDown/ArrowUp циклически перемещают focus, Home/End переходят к краям, Escape закрывает menu и возвращает focus trigger.</p></article>
        <article><span>02</span><strong>Dismiss</strong><p>Pointer down снаружи закрывает overlay; resize закрывает, scroll пересчитывает позицию. Выбор доступного item закрывает menu.</p></article>
        <article><span>03</span><strong>ARIA</strong><p>Trigger получает aria-haspopup, aria-expanded и aria-controls; disabled item недоступен, selected item объявляется через aria-checked.</p></article>
      </div>
    </section>

    <section className="content-section" id="api">
      <SectionHeading title="React API" description="Публичный контракт состоит из ContextMenu, ContextMenuItem и ContextMenuDivider." />
      <div className="api-table">
        <div className="api-table__head"><span>Prop</span><span>Тип</span><span>Назначение</span></div>
        <div><code>trigger</code><code>ReactElement</code><span>Обязательный управляющий элемент.</span></div>
        <div><code>size</code><code>l | m | s</code><span>Размер surface и items; default m.</span></div>
        <div><code>open / defaultOpen</code><code>boolean</code><span>Controlled или начальное uncontrolled состояние.</span></div>
        <div><code>anchor</code><code>trigger | pointer</code><span>Опорная точка позиционирования.</span></div>
        <div><code>clickOpens / contextOpens</code><code>boolean</code><span>Разрешённые способы открытия.</span></div>
        <div><code>selected / disabled / tone</code><code>ContextMenuItemProps</code><span>Состояние и смысл отдельного действия.</span></div>
      </div>
    </section>

    <section className="content-section">
      <SectionHeading title="Responsive, theme и edge cases" description="Portal ограничивает координаты фактическим viewport и наследует системное оформление." />
      <div className="definition-list">
        <article><span>01</span><strong>Responsive / overflow</strong><p>На узком viewport menu разворачивается относительно trigger или pointer и ограничивается inset 8px; scroll обновляет позицию.</p></article>
        <article><span>02</span><strong>Theme</strong><p>Отдельный light/dark prop отсутствует: surface, item, selected и danger используют общие семантические tokens активной темы.</p></article>
        <article><span>03</span><strong>Edge cases</strong><p>Disabled items пропускаются клавиатурой; пустое menu не получает искусственный item, а длинные labels должны проверяться на overflow в Storybook.</p></article>
      </div>
    </section>

    <section className="content-section">
      <SectionHeading title="Код" description="Registry usage source содержит установку, импорт и минимальный пример без локального дублирования API." />
      <CodeExample componentName="ContextMenu" sourceHref={sourceHref} usage={usageExamples['overlay.context-menu']} />
    </section>
  </main>;
}
