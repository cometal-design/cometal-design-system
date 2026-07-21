import type { Meta, StoryObj } from '@storybook/react-vite';
import tokenData from '../../../packages/tokens/dist/tokens.json';
import typographyData from '../../../packages/tokens/src/typography.styles.json';
import gridData from '../../../packages/tokens/src/grid.presets.json';
import iconData from '../../../packages/tokens/src/icons.inventory.json';

type JsonTree = string | number | JsonObject;
interface JsonObject { [key: string]: JsonTree }

const figmaBase = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=';

function PageHeader({ eyebrow, title, description, nodeId }: { eyebrow: string; title: string; description: string; nodeId: string }) {
  return (
    <header className="ds-header">
      <div>
        <span className="ds-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="ds-lead">{description}</p>
      </div>
      <a className="ds-source" href={`${figmaBase}${nodeId.replace(':', '-')}`} target="_blank" rel="noreferrer">Открыть источник в Figma</a>
    </header>
  );
}

function flatten(tree: JsonTree, prefix = ''): Array<[string, string | number]> {
  if (typeof tree !== 'object') return [[prefix, tree]];
  return Object.entries(tree).flatMap(([key, value]) => flatten(value, prefix ? `${prefix}.${key}` : key));
}

function ColorsPage() {
  const primitives = flatten(tokenData.Primitive['Color Primitive Palette'] as JsonTree);
  const semantic = flatten(tokenData.Semantic.Color as JsonTree);
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / COLOR" title="Цвета" description="Примитивная палитра хранит исходные значения. Семантическая карта объясняет назначение цвета в интерфейсе." nodeId="4:29" />
      <section className="ds-section"><h2>Примитивы <span>{primitives.length}</span></h2><div className="ds-swatch-grid">{primitives.map(([name, value]) => <article className="ds-swatch" key={name}><div style={{ background: String(value) }} /><strong>{name}</strong><code>{value}</code></article>)}</div></section>
      <section className="ds-section"><h2>Семантическая карта <span>{semantic.length}</span></h2><div className="ds-token-list">{semantic.map(([name, value]) => <article key={name}><i style={{ background: String(value) }} /><code>{name}</code><span>{value}</span></article>)}</div></section>
    </main>
  );
}

function TypographyPage() {
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / TYPOGRAPHY" title="Типографика" description="18 текстовых стилей из Figma. Здесь видны их роль, параметры и реальный масштаб." nodeId="4:30" />
      <div className="ds-type-list">{typographyData.styles.map(style => <article key={style.name}><div><strong>{style.name}</strong><code>{style.size}/{style.lineHeight} · {style.weight} · {style.letterSpacingPercent}%</code></div><p style={{fontFamily: style.family, fontWeight: style.weight, fontSize: style.size, lineHeight: `${style.lineHeight}px`, letterSpacing: `${style.letterSpacingPercent / 100}em`, textTransform: style.textCase === 'upper' ? 'uppercase' : 'none'}}>Система управления закупками</p><span>{style.description}</span></article>)}</div>
    </main>
  );
}

function MetricsPage({ kind }: { kind: 'Spacing' | 'Radius' }) {
  const items = Object.entries(tokenData.Primitive[kind]);
  const isRadius = kind === 'Radius';
  return (
    <main className="ds-page">
      <PageHeader eyebrow={`FOUNDATION / ${kind.toUpperCase()}`} title={isRadius ? 'Радиусы' : 'Отступы'} description={isRadius ? 'Базовая шкала скруглений. Семантические значения компонентов ссылаются на эти примитивы.' : 'Базовая шкала расстояний. Имя токена стабильно, а значение применяется через семантический слой.'} nodeId={isRadius ? '4:32' : '4:33'} />
      <div className={isRadius ? 'ds-radius-grid' : 'ds-spacing-list'}>{items.map(([name, value]) => <article key={name}><div style={isRadius ? {borderRadius: String(value)} : {width: String(value)}} /><strong>{kind}.{name}</strong><code>{value}</code></article>)}</div>
    </main>
  );
}

function GridPage() {
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / GRID" title="Адаптивная сетка" description="Четыре базовых пресета для desktop, tablet и mobile. Пока это документация в Figma, а не опубликованные Grid Styles." nodeId="1026:3600" />
      <div className="ds-grid-presets">{gridData.presets.map(preset => <article key={preset.name}><div className="ds-grid-demo" style={{gridTemplateColumns: `repeat(${preset.columns}, 1fr)`, gap: Math.max(2, preset.gutter / 6)}}>{Array.from({length: preset.columns}, (_, i) => <i key={i} />)}</div><h2>{preset.name}</h2><p>{preset.columns} колонок · поля {preset.margin}px · межколонник {preset.gutter}px</p></article>)}</div>
    </main>
  );
}

function IconsPage() {
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / ICONS" title="Иконки" description="Инвентаризация библиотеки и статус переноса. Это не React-пакет иконок: визуальные SVG ещё не экспортированы и API не утверждён." nodeId="381:25439" />
      <div className="ds-status-grid">{iconData.libraries.map(library => <article key={library.name}><strong>{library.components}</strong><span>{library.name}</span><small>{library.categories} категорий</small></article>)}</div>
      <section className="ds-section"><h2>Карта замены</h2><div className="ds-review-grid"><article className="ok"><strong>{iconData.replacementMap.highConfidence}</strong><span>высокая уверенность</span></article><article className="warn"><strong>{iconData.replacementMap.needsVisualReview}</strong><span>нужно визуальное ревью</span></article><article className="stop"><strong>{iconData.replacementMap.notFound}</strong><span>замена не найдена</span></article></div><p className="ds-note">Правило: сначала Outline; Filled — только если нужной формы нет в Outline.</p></section>
    </main>
  );
}

function ShadowsPage() {
  return <main className="ds-page"><PageHeader eyebrow="FOUNDATION / SHADOW" title="Тени" description="В Figma DS Core тени пока не заведены. Поэтому Storybook не создаёт собственную шкалу и не маскирует пробел выдуманными значениями." nodeId="4:31" /><div className="ds-empty"><strong>Нет данных</strong><p>Для добавления потребуется решение Design System Lead, значения в Figma и синхронизация в токены.</p></div></main>;
}

const meta = { title: 'Foundation', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = { name: 'Цвета', render: () => <ColorsPage /> };
export const Typography: Story = { name: 'Типографика', render: () => <TypographyPage /> };
export const Spacing: Story = { name: 'Отступы', render: () => <MetricsPage kind="Spacing" /> };
export const Radius: Story = { name: 'Радиусы', render: () => <MetricsPage kind="Radius" /> };
export const Grid: Story = { name: 'Сетка', render: () => <GridPage /> };
export const Icons: Story = { name: 'Иконки', render: () => <IconsPage /> };
export const Shadows: Story = { name: 'Тени — не заведены', render: () => <ShadowsPage /> };
