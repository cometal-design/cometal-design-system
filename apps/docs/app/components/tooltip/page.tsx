import type { Metadata } from 'next';
import { Button, InlineLink, Tooltip } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Tooltip' };
const registryComponent = components.find((item) => item.id === 'overlay.tooltip')!;
const figmaFileHref = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs';
const component = {
  ...registryComponent,
  links: { ...registryComponent.links, figma: `${figmaFileHref}?node-id=2871-43` },
};
const sourceHref = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Tooltip/Tooltip.tsx';
const tooltipPlacements = [
  { placement: 'top-start', label: 'Top Start', compactNode: '2867:42', wideNode: '2868:42' },
  { placement: 'top-center', label: 'Top Center', compactNode: '2867:47', wideNode: '2868:47' },
  { placement: 'top-end', label: 'Top End', compactNode: '2867:52', wideNode: '2868:52' },
  { placement: 'bottom-start', label: 'Bottom Start', compactNode: '2867:57', wideNode: '2868:57' },
  { placement: 'bottom-center', label: 'Bottom Center', compactNode: '2867:62', wideNode: '2868:62' },
  { placement: 'bottom-end', label: 'Bottom End', compactNode: '2867:67', wideNode: '2868:67' },
  { placement: 'left', label: 'Left', compactNode: '2867:72', wideNode: '2868:72' },
  { placement: 'right', label: 'Right', compactNode: '2867:77', wideNode: '2868:77' },
] as const;
const tooltipSizes = [
  { size: 'compact', label: 'Compact', surface: '185×32', full: 'Top / Bottom 185×37 · Side 190×32', padding: '12 / 8', arrow: '12×6 · side 6×12', offset: 'Start 12 · End x161' },
  { size: 'wide', label: 'Wide', surface: '240×44', full: 'Top / Bottom 240×49 · Side 245×44', padding: '16 / 12', arrow: '12×6 · side 6×12', offset: 'Start 16 · End x212' },
] as const;

function figmaNodeHref(nodeId: string) {
  return `${figmaFileHref}?node-id=${nodeId.replace(':', '-')}`;
}

export default function TooltipPage() {
  return <main className="content-page component-detail">
    <ComponentPageHeader title="Tooltip" summary="Короткое дополнительное пояснение к интерактивному элементу, доступное по hover и focus и не заменяющее основную подпись." status={component.status} statusLabel={statusLabels[component.status]} figmaHref={component.links.figma} playgroundHref="/storybook/?path=/story/components-tooltip--overview" />
    <div className="metadata-strip" data-component-phase="identity" data-top-divider data-bottom-divider><span>Stable ID</span><code>overlay.tooltip</code><span>React</span><strong>Tooltip</strong></div>

    <section className="content-section" data-component-phase="overview">
      <SectionHeading title="Рабочий пример" description="Один и тот же trigger открывает tooltip при наведении мыши и при клавиатурном focus; матрица ниже отдельно фиксирует все 16 вариантов в открытом состоянии." />
      <div className="component-inline-demo"><Tooltip content="Подсказка для действия" placement="top-center"><Button size="m" variant="secondary">Наведи или сфокусируй</Button></Tooltip></div>
    </section>

    <section className="content-section" data-component-phase="visual-contract" id="states">
      <SectionHeading title="Матрица 2 × 8" description="Shipped @cometal/react Tooltip показан в двух размерах и восьми placement рядом с exact geometry canonical COMPONENT_SET 2871:43; portal не маскирует найденное визуальное расхождение." />
      <p><InlineLink href={component.links.figma} target="_blank" rel="noreferrer">Открыть canonical Tooltip COMPONENT_SET 2871:43 в Figma ↗</InlineLink></p>
      <div className="notice"><strong>CONFLICT · visual geometry</strong><span>Size names и восемь placement совпадают. Shipped React использует content-driven Compact, Wide min/max-width, общий padding 24/16 и rotated 12×12 square arrow с offset 24; это не совпадает с canonical surface, padding, vector arrow и offsets ниже. Матрица намеренно показывает фактический React output.</span></div>
      <div className="tooltip-contract-matrix" aria-label="Tooltip: два размера и восемь placement">
        {tooltipSizes.map((size) => (
          <article className="tooltip-contract-matrix__size" data-tooltip-size={size.size} key={size.size}>
            <header className="tooltip-contract-matrix__size-header">
              <div><span>Size</span><h3>{size.label}</h3></div>
              <dl>
                <div><dt>Surface</dt><dd>{size.surface}</dd></div>
                <div><dt>Full geometry</dt><dd>{size.full}</dd></div>
                <div><dt>Content padding</dt><dd>{size.padding}</dd></div>
                <div><dt>Arrow</dt><dd>{size.arrow}</dd></div>
                <div><dt>Arrow offset</dt><dd>{size.offset}</dd></div>
              </dl>
            </header>
            <div className="tooltip-contract-matrix__placements">
              {tooltipPlacements.map((item) => {
                const nodeId = size.size === 'compact' ? item.compactNode : item.wideNode;
                return (
                  <article className="tooltip-contract-matrix__item" data-canonical-placement={item.placement} key={item.placement}>
                    <header><strong>{item.label}</strong><InlineLink href={figmaNodeHref(nodeId)} target="_blank" rel="noreferrer"><code>{nodeId}</code></InlineLink></header>
                    <div className="tooltip-contract-matrix__stage">
                      <Tooltip content={`${size.label} tooltip`} open placement={item.placement} size={size.size}>
                        <Button aria-label={`${size.label} · ${item.label} trigger`} size="s" variant="secondary">Trigger</Button>
                      </Tooltip>
                    </div>
                  </article>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      <div className="definition-list">
        <article><span>01</span><strong>Figma target</strong><p><code>compact</code>: surface 185×32, padding 12/8. <code>wide</code>: 240×44, padding 16/12. Top/bottom arrow — 12×6, side arrow — 6×12.</p></article>
        <article><span>02</span><strong>React actual</strong><p>Compact width зависит от content и ограничен 320px; Wide использует min-width 240px и max-width 420px. Оба получают фактический padding 24/16, а arrow остаётся rotated 12×12 square.</p></article>
        <article><span>03</span><strong>Placement</strong><p>Порядок canonical и public React values совпадает: Top Start, Top Center, Top End, Bottom Start, Bottom Center, Bottom End, Left, Right.</p></article>
        <article><span>04</span><strong>State</strong><p><code>open</code> и <code>onOpenChange</code> задают controlled mode, <code>defaultOpen</code> — начальное uncontrolled состояние, <code>disabled</code> запрещает показ.</p></article>
      </div>
    </section>

    <section className="content-section" data-component-phase="code">
      <SectionHeading title="Код" description="Установка, импорт и минимальное использование берутся из общего registry usage source." />
      <CodeExample componentName="Tooltip" sourceHref={sourceHref} usage={usageExamples['overlay.tooltip']} />
    </section>

    <section className="content-section" data-component-phase="usage" id="usage">
      <SectionHeading title="Использование" description="Tooltip поясняет действие, когда основной интерфейс уже понятен без overlay." />
      <div className="guidance">
        <article data-tone="positive"><strong>Используйте</strong><p>Для краткого контекста к иконке, сокращённой подписи или действию, если trigger остаётся доступным по focus.</p></article>
        <article data-tone="negative"><strong>Не используйте</strong><p>Не используйте Tooltip как единственную подпись, для обязательной инструкции, ошибки, длинного текста или интерактивного контента.</p></article>
      </div>
    </section>

    <section className="content-section" data-component-phase="behavior-a11y">
      <SectionHeading title="Поведение и доступность" description="Hover и focus равноправно открывают подсказку; Escape закрывает её, а trigger получает aria-describedby только пока tooltip показан." />
      <div className="definition-list">
        <article><span>01</span><strong>Keyboard</strong><p>Tab фокусирует исходный интерактивный trigger; Escape закрывает overlay без изменения focus.</p></article>
        <article><span>02</span><strong>ARIA</strong><p>Панель имеет role=&quot;tooltip&quot; и стабильный id; aria-describedby объединяется с уже существующим описанием trigger.</p></article>
        <article><span>03</span><strong>Lifecycle</strong><p>Mouse leave и blur закрывают uncontrolled tooltip. Resize и scroll пересчитывают ограниченную viewport позицию и очищают listeners при закрытии.</p></article>
      </div>
    </section>

    <section className="content-section" data-component-phase="public-api" id="api">
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

    <section className="content-section" data-component-phase="adaptation">
      <SectionHeading title="Responsive, theme и edge cases" description="Overlay использует текущие семантические tokens и вычисляет позицию по фактическому viewport." />
      <div className="definition-list">
        <article><span>01</span><strong>Responsive / overflow</strong><p>При нехватке места placement проходит fallback chain, затем координаты ограничиваются viewport inset 8px; resize и вложенный scroll обновляют позицию.</p></article>
        <article><span>02</span><strong>Theme</strong><p>Отдельный light/dark prop отсутствует: фон, текст, тень и arrow наследуют активную тему через системные tokens.</p></article>
        <article><span>03</span><strong>Edge cases</strong><p>Disabled trigger не открывает tooltip; длинный обязательный текст и интерактивные элементы относятся к другому overlay pattern.</p></article>
      </div>
    </section>

  </main>;
}
