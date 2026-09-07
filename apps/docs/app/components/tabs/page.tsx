import type { Metadata } from 'next';
import { Badge, InlineLink, Tab, TabList, TabPanel, Tabs } from '@cometal/react';
import { CodeBlock } from '../../../components/code-block';
import { ComponentPageExample } from '../../../components/component-page-example';
import { ComponentPageStandard } from '../../../components/component-page-standard';
import { TabsSettings } from '../../../components/tabs-settings';
import { components, statusLabels } from '../../../lib/registry';

export const metadata: Metadata = { title: 'Tabs' };
const component = components.find((item) => item.id === 'navigation.tabs')!;

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

const exampleCode = `import { Tab, TabList, TabPanel, Tabs } from '@cometal/react';

export function ProjectTabs() {
  return (
    <Tabs defaultValue="overview" size="m">
      <TabList aria-label="Разделы проекта">
        <Tab value="overview">Обзор</Tab>
        <Tab value="history">История</Tab>
        <Tab value="files">Файлы</Tab>
        <Tab value="access" disabled>Доступ</Tab>
      </TabList>
      <TabPanel value="overview">Основные сведения.</TabPanel>
      <TabPanel value="history">История изменений.</TabPanel>
      <TabPanel value="files">Связанные файлы.</TabPanel>
      <TabPanel value="access">Настройки доступа.</TabPanel>
    </Tabs>
  );
}`;

const sizesCode = `import { Tab, TabList, TabPanel, Tabs } from '@cometal/react';

export function TabsSizes() {
  return (
    <div>
      {(['l', 'm', 's'] as const).map((size) => (
        <Tabs key={size} defaultValue="overview" size={size}>
          <TabList aria-label={\`Разделы карточки \${size.toUpperCase()}\`}>
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
      ))}
    </div>
  );
}`;

const overview = (
  <>
    <section className="content-section" data-component-phase="overview" aria-labelledby="tabs-preview-title">
        <div className="component-standard-presentation"><h2 className="visually-hidden" id="tabs-preview-title">Пример Tabs</h2><div className="component-standard-tabs-preview"><ExampleTabs /></div></div>
    </section>
    <section className="content-section" aria-labelledby="tabs-usage-title">
      <header className="section-heading"><h2 id="tabs-usage-title">Использование</h2><p>Импортируйте compound-компоненты и сопоставьте каждой вкладке одну панель с тем же value.</p></header>
      <CodeBlock code="import { Tab, TabList, TabPanel, Tabs } from '@cometal/react';" copyName="импорт Tabs" compact />
      <p className="component-standard-settings__note">Исходник Tabs пока доступен только в локальной рабочей версии; ссылка GitHub появится после публикации.</p>
    </section>
    <section className="content-section" aria-labelledby="tabs-composition-title">
      <header className="section-heading"><h2 id="tabs-composition-title">Композиция</h2></header>
      <table className="component-standard-table"><caption className="visually-hidden">Элементы композиции Tabs</caption><thead><tr><th scope="col">Элемент</th><th scope="col">Назначение</th></tr></thead><tbody>
        <tr><th scope="row">Tabs</th><td>Хранит controlled или uncontrolled выбранное значение и общий размер.</td></tr>
        <tr><th scope="row">TabList</th><td>Именованная горизонтальная группа вкладок.</td></tr>
        <tr><th scope="row">Tab</th><td>Text-only системная кнопка с role=tab и отдельным индикатором.</td></tr>
        <tr><th scope="row">TabPanel</th><td>Связанная persistent панель; неактивные панели скрыты, но остаются смонтированными.</td></tr>
      </tbody></table>
    </section>
    <section className="content-section" data-component-phase="usage" aria-labelledby="tabs-rules-title">
      <header className="section-heading"><h2 id="tabs-rules-title">Правила использования</h2></header>
      <table className="component-standard-table component-standard-practices-table"><caption className="visually-hidden">Правила использования Tabs</caption><thead><tr><th scope="col">Статус</th><th scope="col">Тезис</th><th scope="col">Объяснение</th></tr></thead><tbody>
        <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Один контекст</th><td>Используйте для равноправных разделов карточки или локальной рабочей области.</td></tr>
        <tr><td><Badge tone="green">Do</Badge></td><th scope="row">Короткие подписи</th><td>Давайте вкладкам понятные text-only названия и сохраняйте одинаковый порядок.</td></tr>
        <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Навигация между страницами</th><td>Для разных URL используйте ссылки или router navigation.</td></tr>
        <tr><td><Badge tone="red">Don’t</Badge></td><th scope="row">Слишком много вкладок</th><td>Текущий контракт не добавляет стрелки, fade или overflow menu.</td></tr>
      </tbody></table>
    </section>
    <section className="content-section component-standard-examples-section" data-component-phase="visual-contract" aria-labelledby="tabs-examples-title">
      <header className="section-heading"><h2 id="tabs-examples-title">Примеры</h2><p>Все примеры используют настоящие Tabs и сохраняют manual activation.</p></header>
      <div className="component-standard-examples">
        <ComponentPageExample title="Рабочий набор" description="Стрелки перемещают фокус, а Enter, Space или click активируют вкладку. Disabled пункт пропускается." code={exampleCode} preview={<div className="component-standard-tabs-preview"><ExampleTabs /></div>} />
        <ComponentPageExample title="Размеры" description="L, M и S дают итоговую высоту 56, 48 и 40px при общей модели взаимодействия." code={sizesCode} preview={<div className="component-standard-tabs-sizes">{(['l', 'm', 's'] as const).map((size) => <article key={size}><code>{size.toUpperCase()}</code><ExampleTabs size={size} /></article>)}</div>} />
      </div>
    </section>
  </>
);

const accessibility = (
  <>
    <section className="content-section component-standard-accessibility" data-component-phase="behavior-a11y" aria-labelledby="tabs-keyboard-title">
      <header className="section-heading"><h2 id="tabs-keyboard-title">Клавиатура</h2><p>Контракт соответствует горизонтальным WAI-ARIA Tabs с ручной активацией.</p></header>
      <table className="component-standard-table"><caption className="visually-hidden">Клавиатурное управление Tabs</caption><thead><tr><th scope="col">Клавиша</th><th scope="col">Результат</th></tr></thead><tbody>
        <tr><th scope="row">Tab / Shift + Tab</th><td>Входит в tablist одной roving-focus остановкой и выходит к следующему элементу страницы.</td></tr>
        <tr><th scope="row">Left / Right</th><td>Перемещает фокус с wrap, учитывает RTL и пропускает disabled вкладки.</td></tr>
        <tr><th scope="row">Home / End</th><td>Фокусирует первую или последнюю доступную вкладку.</td></tr>
        <tr><th scope="row">Enter / Space</th><td>Активирует вкладку в фокусе; стрелки сами по себе панель не переключают.</td></tr>
      </tbody></table>
    </section>
    <section className="content-section component-standard-accessibility" aria-labelledby="tabs-semantics-title">
      <header className="section-heading"><h2 id="tabs-semantics-title">Связи и состояние</h2><p>Компонент связывает tab и tabpanel стабильными id и ARIA-атрибутами.</p></header>
      <table className="component-standard-table"><caption className="visually-hidden">Семантика Tabs</caption><thead><tr><th scope="col">Проверка</th><th scope="col">Контракт</th></tr></thead><tbody>
        <tr><th scope="row">Доступное имя</th><td><code>TabList</code> требует <code>aria-label</code> или <code>aria-labelledby</code>.</td></tr>
        <tr><th scope="row">Выбор</th><td><code>aria-selected</code> и roving <code>tabIndex</code> отражают выбранную вкладку и текущий фокус.</td></tr>
        <tr><th scope="row">Панели</th><td><code>aria-controls</code> и <code>aria-labelledby</code> связывают пары; inactive panel получает <code>hidden</code>.</td></tr>
        <tr><th scope="row">Видимый фокус</th><td>Оставляйте не менее 4px вокруг строки и не обрезайте системную рамку <code>:focus-visible</code>.</td></tr>
      </tbody></table>
      <p className="component-standard-sources"><InlineLink href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" target="_blank" rel="noreferrer">WAI-ARIA APG: Tabs ↗</InlineLink><InlineLink href="https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html" target="_blank" rel="noreferrer">WCAG: видимый фокус ↗</InlineLink></p>
    </section>
  </>
);

export default function TabsPage() {
  return <ComponentPageStandard title="Tabs" summary="Переключает связанные persistent content panels внутри текущего контекста страницы." status={component.status} statusLabel={statusLabels[component.status]} stableId="navigation.tabs" reactExport="Tabs · TabList · Tab · TabPanel" figmaHref={component.links.figma} storybookHref="/storybook/?path=/story/components-tabs--overview" overview={overview} settings={<TabsSettings />} accessibility={accessibility} />;
}
