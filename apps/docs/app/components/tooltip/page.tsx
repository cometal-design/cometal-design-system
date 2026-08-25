import type { Metadata } from 'next';
import { Button, Tooltip } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Tooltip' };
const component = components.find((item) => item.id === 'overlay.tooltip')!;
const sourceHref = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Tooltip/Tooltip.tsx';

export default function TooltipPage() {
  return <main className="content-page component-detail">
    <ComponentPageHeader title="Tooltip" summary="Короткое дополнительное пояснение к интерактивному элементу, доступное по hover и focus и не заменяющее основную подпись." status={component.status} statusLabel={statusLabels[component.status]} figmaHref={component.links.figma} playgroundHref="/storybook/?path=/story/components-tooltip--overview" />
    <div className="metadata-strip" data-top-divider data-bottom-divider><span>Stable ID</span><code>overlay.tooltip</code><span>React</span><strong>Tooltip</strong></div>

    <section className="content-section">
      <SectionHeading title="Рабочий пример" description="Один и тот же trigger открывает tooltip при наведении мыши и при клавиатурном focus. Default open используется здесь только для видимой документации." />
      <div className="component-inline-demo"><Tooltip content="Подсказка для действия" defaultOpen placement="top-center"><Button size="m" variant="secondary">Наведи или сфокусируй</Button></Tooltip></div>
    </section>

    <section className="content-section" id="usage">
      <SectionHeading title="Использование" description="Tooltip поясняет действие, когда основной интерфейс уже понятен без overlay." />
      <div className="guidance">
        <article data-tone="positive"><strong>Используйте</strong><p>Для краткого контекста к иконке, сокращённой подписи или действию, если trigger остаётся доступным по focus.</p></article>
        <article data-tone="negative"><strong>Не используйте</strong><p>Не используйте Tooltip как единственную подпись, для обязательной инструкции, ошибки, длинного текста или интерактивного контента.</p></article>
      </div>
    </section>

    <section className="content-section" id="states">
      <SectionHeading title="Размеры, placement и состояния" description="Публичные оси ограничены двумя размерами, восемью предпочтительными placement и controlled/uncontrolled open state." />
      <div className="definition-list">
        <article><span>01</span><strong>Size</strong><p><code>compact</code> — короткое пояснение; <code>wide</code> — более широкая строка без превращения tooltip в popover.</p></article>
        <article><span>02</span><strong>Placement</strong><p>top/bottom поддерживают start, center и end; left/right центрируются относительно trigger. Реальный placement может смениться при collision.</p></article>
        <article><span>03</span><strong>State</strong><p><code>open</code> и <code>onOpenChange</code> задают controlled mode, <code>defaultOpen</code> — начальное uncontrolled состояние, <code>disabled</code> запрещает показ.</p></article>
      </div>
    </section>

    <section className="content-section">
      <SectionHeading title="Поведение и доступность" description="Hover и focus равноправно открывают подсказку; Escape закрывает её, а trigger получает aria-describedby только пока tooltip показан." />
      <div className="definition-list">
        <article><span>01</span><strong>Keyboard</strong><p>Tab фокусирует исходный интерактивный trigger; Escape закрывает overlay без изменения focus.</p></article>
        <article><span>02</span><strong>ARIA</strong><p>Панель имеет role=&quot;tooltip&quot; и стабильный id; aria-describedby объединяется с уже существующим описанием trigger.</p></article>
        <article><span>03</span><strong>Lifecycle</strong><p>Mouse leave и blur закрывают uncontrolled tooltip. Resize и scroll пересчитывают ограниченную viewport позицию и очищают listeners при закрытии.</p></article>
      </div>
    </section>

    <section className="content-section" id="api">
      <SectionHeading title="React API" description="Tooltip расширяет HTML attributes корневого span, кроме конфликтующего content attribute." />
      <div className="api-table">
        <div className="api-table__head"><span>Prop</span><span>Тип</span><span>Назначение</span></div>
        <div><code>content</code><code>ReactNode</code><span>Обязательное пояснение.</span></div>
        <div><code>children</code><code>ReactElement</code><span>Единственный trigger.</span></div>
        <div><code>size</code><code>compact | wide</code><span>Размер поверхности; default compact.</span></div>
        <div><code>placement</code><code>TooltipPlacement</code><span>Предпочтительная позиция; default top-start.</span></div>
        <div><code>open / defaultOpen</code><code>boolean</code><span>Controlled или начальное uncontrolled состояние.</span></div>
        <div><code>onOpenChange</code><code>(open: boolean) =&gt; void</code><span>Уведомление об изменении.</span></div>
        <div><code>disabled</code><code>boolean</code><span>Полностью запрещает показ.</span></div>
      </div>
    </section>

    <section className="content-section">
      <SectionHeading title="Responsive, theme и edge cases" description="Overlay использует текущие семантические tokens и вычисляет позицию по фактическому viewport." />
      <div className="definition-list">
        <article><span>01</span><strong>Responsive / overflow</strong><p>При нехватке места placement проходит fallback chain, затем координаты ограничиваются viewport inset 8px; resize и вложенный scroll обновляют позицию.</p></article>
        <article><span>02</span><strong>Theme</strong><p>Отдельный light/dark prop отсутствует: фон, текст, тень и arrow наследуют активную тему через системные tokens.</p></article>
        <article><span>03</span><strong>Edge cases</strong><p>Disabled trigger не открывает tooltip; длинный обязательный текст и интерактивные элементы относятся к другому overlay pattern.</p></article>
      </div>
    </section>

    <section className="content-section">
      <SectionHeading title="Код" description="Установка, импорт и минимальное использование берутся из общего registry usage source." />
      <CodeExample componentName="Tooltip" sourceHref={sourceHref} usage={usageExamples['overlay.tooltip']} />
    </section>
  </main>;
}
