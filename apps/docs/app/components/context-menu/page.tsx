import type { Metadata } from 'next';
import { Button, ContextMenu, ContextMenuDivider, ContextMenuItem } from '@cometal/react';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';

export const metadata: Metadata = { title: 'Context Menu' };
const component = components.find((item) => item.id === 'overlay.context-menu')!;

export default function ContextMenuPage() {
  return <main className="content-page component-detail">
    <ComponentPageHeader title="Context Menu" summary="Контекстные действия над сущностью: pointer/trigger anchor, клавиатурная навигация, selected, disabled и danger items." status={component.status} statusLabel={statusLabels[component.status]} figmaHref={component.links.figma} playgroundHref="/storybook/?path=/story/components-context-menu--overview" />
    <section className="content-section"><SectionHeading title="Рабочий пример" description="Menu остаётся overlay-компонентом. Product pattern решает, к какой сущности и сценарию его привязать." /><div className="component-inline-demo"><ContextMenu defaultOpen trigger={<Button size="m" variant="secondary">Открыть меню</Button>}><ContextMenuItem>Открыть</ContextMenuItem><ContextMenuItem selected>Закрепить</ContextMenuItem><ContextMenuItem disabled>Недоступно</ContextMenuItem><ContextMenuDivider /><ContextMenuItem tone="danger">Удалить</ContextMenuItem></ContextMenu></div></section>
  </main>;
}
