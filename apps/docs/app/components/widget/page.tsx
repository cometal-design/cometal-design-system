import type { Metadata } from 'next';
import { CodeExample } from '../../../components/code-example';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { WidgetSourceExample } from '../../../components/widget-source-example';
import { components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Widget' };
const widget = components.find((item) => item.id === 'template.widget')!;

export default function WidgetPage() {
  return <main className="content-page component-detail">
    <ComponentPageHeader eyebrow="КОМПОНЕНТ · WEB" title="Widget" summary="Универсальная оболочка: title, optional description, consumer-owned toolbar и content slot. Widget не знает, что будет вложено внутрь." status={widget.status} statusLabel={statusLabels[widget.status]} figmaHref={widget.links.figma} playgroundHref="/storybook/?path=/story/components-widget--playground" />
    <section className="content-section"><SectionHeading title="Main Component" description="Raised surface и 32 px radius принадлежат Widget. Внутренний payload остаётся самостоятельным компонентом и не клипуется shell." /><WidgetSourceExample /></section>
    <section className="content-section"><SectionHeading title="Анатомия" description="Четыре структурные области не превращаются в четыре boolean props: optional regions выражаются slot API." /><div className="definition-list"><article><span>01</span><strong>Title</strong><p>Обязательное видимое и доступное имя region.</p></article><article><span>02</span><strong>Description</strong><p>Optional secondary text; отсутствует без пустого gap.</p></article><article><span>03</span><strong>Toolbar</strong><p>Consumer-owned controls в документном tab order.</p></article><article><span>04</span><strong>Content slot</strong><p>Любой утверждённый payload без Widget state machine.</p></article></div></section>
    <section className="content-section"><SectionHeading title="Geometry" description="Все значения приходят из токенов; Figma documentation width и height не являются runtime API." /><div className="metadata-strip widget-geometry-strip"><span>32 outer radius</span><span>24 inset / gap</span><span>16 header padding</span><span>8 toolbar / inner radius</span></div></section>
    <section className="content-section"><SectionHeading title="Код" description="Публичный API сохраняет generic composition. Старый actions работает только как compatibility alias toolbar." /><CodeExample componentName="Widget" sourceHref="https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Widget/Widget.tsx" usage={usageExamples['template.widget']} /></section>
  </main>;
}
