import type { Metadata } from 'next';
import { Tab, TabList, TabPanel, Tabs } from '@cometal/react';
import { CodeExample } from '../../../components/code-example';
import { ComponentEnvironmentNotes } from '../../../components/component-environment-notes';
import { ComponentPageHeader } from '../../../components/component-page-header';
import { SectionHeading } from '../../../components/section-heading';
import { components, statusLabels } from '../../../lib/registry';
import { usageExamples } from '../../../lib/usage-examples';

export const metadata: Metadata = { title: 'Tabs' };
const component = components.find((item) => item.id === 'navigation.tabs')!;
const sourceHref = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Tabs/Tabs.tsx';

function ExampleTabs({ size = 'm' }: { size?: 'l' | 'm' | 's' }) {
  return (
    <Tabs defaultValue="overview" size={size}>
      <TabList aria-label={`Разделы карточки ${size.toUpperCase()}`}>
        <Tab value="overview">Обзор</Tab>
        <Tab value="history">История</Tab>
        <Tab value="files">Файлы</Tab>
        <Tab value="access" disabled>Доступ</Tab>
      </TabList>
      <TabPanel value="overview">Основные сведения и текущий статус.</TabPanel>
      <TabPanel value="history">История изменений остаётся смонтированной.</TabPanel>
      <TabPanel value="files">Связанные файлы.</TabPanel>
      <TabPanel value="access">Настройки доступа.</TabPanel>
    </Tabs>
  );
}

export default function TabsPage() {
  return (
    <main className="content-page component-detail">
      <ComponentPageHeader title="Tabs" summary="Переключает связанные persistent content panels внутри текущего контекста страницы." status={component.status} statusLabel={statusLabels[component.status]} figmaHref={component.links.figma} playgroundHref="/storybook/?path=/story/components-tabs--overview" />
      <div className="metadata-strip" data-component-phase="identity" data-top-divider data-bottom-divider><span>Stable ID</span><code>navigation.tabs</code><span>React</span><strong>Tabs · TabList · Tab · TabPanel</strong></div>

      <section className="content-section" data-component-phase="overview">
        <SectionHeading title="Рабочий пример" description="Arrow keys перемещают focus, а Enter, Space или click явно активируют вкладку. Disabled item пропускается." />
        <div className="component-inline-demo"><ExampleTabs /></div>
      </section>

      <section className="content-section" data-component-phase="visual-contract" id="visual-contract">
        <SectionHeading title="Размеры и visual contract" description="L/M/S используют системный Button Inverse Ghost 48/40/32px, постоянный gap 6px и indicator 2px: итоговая высота 56/48/40px." />
        <div className="size-list">
          {(['l', 'm', 's'] as const).map((size) => <article key={size}><div className="size-list__size"><strong>{size.toUpperCase()}</strong><span>{size === 'l' ? 56 : size === 'm' ? 48 : 40}px</span></div><div className="component-inline-demo"><ExampleTabs size={size} /></div></article>)}
        </div>
        <div className="definition-list">
          <article><span>01</span><strong>Composition</strong><p>Каждый Tab — text-only системный Button и отдельная persistent indicator row; interactive descendants и icon slots не входят в первый контракт.</p></article>
          <article><span>02</span><strong>States</strong><p>Selected indicator использует brand default/hover/pressed; disabled selected — text disabled. Focus рисуется только через <code>:focus-visible</code>.</p></article>
          <article><span>03</span><strong>Count</strong><p>Четыре Figma items — пример, не ограничение. Публичный compound API принимает произвольное число пар Tab/TabPanel.</p></article>
        </div>
      </section>

      <section className="content-section" data-component-phase="code" id="code">
        <SectionHeading title="Код" description="Установка, imports и минимальный пример используют только публичные @cometal/react exports." />
        <CodeExample componentName="Tabs" sourceHref={sourceHref} usage={usageExamples['navigation.tabs']} />
      </section>

      <section className="content-section" data-component-phase="usage" id="usage">
        <SectionHeading title="Использование" description="Tabs меняет раздел внутри одного контекста; навигация между URL остаётся ссылкой или router navigation." />
        <div className="guidance"><article data-tone="positive"><strong>Используйте</strong><p>Для нескольких равноправных разделов одной карточки или локальной рабочей области, когда panel state нужно сохранять.</p></article><article data-tone="negative"><strong>Не используйте</strong><p>Для переходов между страницами, пошагового процесса, вертикального меню или набора, который требует встроенных scroll arrows и overflow menu.</p></article></div>
      </section>

      <section className="content-section" data-component-phase="behavior-a11y">
        <SectionHeading title="Поведение и доступность" description="Compound contract следует horizontal WAI-ARIA Tabs с manual activation и persistent panels." />
        <div className="definition-list">
          <article><span>01</span><strong>Keyboard</strong><p>Left/Right с wrap и RTL поддержкой, Home/End и disabled skip перемещают roving focus. Enter/Space активируют; Up/Down и Tab не перехватываются.</p></article>
          <article><span>02</span><strong>ARIA</strong><p>Named horizontal tablist связывает каждый tab и tabpanel через stable <code>id</code>, <code>aria-controls</code> и <code>aria-labelledby</code>.</p></article>
          <article><span>03</span><strong>State</strong><p>Controlled value остаётся owner-owned. Inactive panels скрыты через <code>hidden</code>, но не размонтируются; dynamic removal выбирает ближайший enabled successor.</p></article>
        </div>
      </section>

      <section className="content-section" data-component-phase="public-api" id="api">
        <SectionHeading title="React API" description="Первый delivery намеренно исключает orientation, automatic activation, router links, lazy mount и overflow controls." />
        <div className="api-table"><div className="api-table__head"><span>Surface</span><span>Props</span><span>Default / role</span></div>
          <div><code>Tabs</code><span>value, defaultValue, onValueChange, size</span><span>size=l</span></div>
          <div><code>TabList</code><span>aria-label xor aria-labelledby</span><span>horizontal tablist</span></div>
          <div><code>Tab</code><span>value, disabled, children, className</span><span>Button role=tab</span></div>
          <div><code>TabPanel</code><span>value, children, div attributes</span><span>persistent tabpanel</span></div>
        </div>
      </section>

      <div data-component-phase="adaptation"><ComponentEnvironmentNotes responsive="Tabs сохраняет intrinsic nowrap row. Consumer предоставляет horizontal scroll и резервирует минимум 4px вокруг focus envelope; компонент не добавляет собственные arrows, fade или menu." theme="Button и indicator используют существующие semantic/component tokens активной темы; отдельного theme prop нет." edgeCases="Values должны быть непустыми и уникальными, каждой вкладке нужна ровно одна panel. Controlled missing value не вызывает synthetic fallback; disabled selected остаётся выбранной и показывает panel." /></div>
    </main>
  );
}
