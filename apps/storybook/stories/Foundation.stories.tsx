import type { Meta, StoryObj } from '@storybook/react-vite';
import { StrictMode, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Switch } from '@cometal/react';
import { IconCatalog } from '@cometal/react/icons/catalog';
import { iconManifestMetadata } from '@cometal/react/icons/manifest';
import primitiveSource from '../../../packages/tokens/src/primitive.tokens.json';
import semanticSource from '../../../packages/tokens/src/semantic.tokens.json';
import componentSource from '../../../packages/tokens/src/component.tokens.json';
import motionSource from '../../../packages/tokens/src/motion.tokens.json';
import effectsSource from '../../../packages/tokens/src/effects.tokens.json';
import typographyData from '../../../packages/tokens/src/typography.styles.json';
import gridData from '../../../packages/tokens/src/grid.presets.json';
import inventory from '../../../packages/tokens/src/foundation.inventory.json';

type TokenValue =
  | string
  | number
  | { value: number; unit: string }
  | { colorSpace: string; components: number[]; alpha?: number };

type Token = {
  name: string;
  type: string;
  value: TokenValue;
  figmaId?: string;
};

type SourceConflict = {
  area: string;
  severity: string;
  pageOnlyTokens: string[];
  decision: string;
};

const figmaBase = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=';

function collectTokens(node: unknown, path: string[] = [], result: Token[] = []): Token[] {
  if (!node || typeof node !== 'object' || Array.isArray(node)) return result;
  const object = node as Record<string, unknown>;
  if ('$type' in object && '$value' in object) {
    const figma = (object.$extensions as Record<string, Record<string, string>> | undefined)?.['com.cometal.figma'];
    result.push({
      name: figma?.name ?? path.filter((part) => part !== '$root').join('/'),
      type: String(object.$type),
      value: object.$value as TokenValue,
      figmaId: figma?.id,
    });
  }
  for (const [key, value] of Object.entries(object)) {
    if (key === '$root') collectTokens(value, path, result);
    else if (!key.startsWith('$')) collectTokens(value, [...path, key], result);
  }
  return result;
}

const primitiveTokens = collectTokens(primitiveSource.Primitive);
const semanticTokens = collectTokens(semanticSource.Semantic);
const componentTokens = collectTokens(componentSource.Component);
const shadowTokens = [
  {
    name: 'Effects/Elevation/Floating/Soft',
    css: '--cometal-effects-effects-elevation-floating-soft',
    value: effectsSource.Effects.Effects.Elevation.Floating.Soft.$value,
    usage: 'Calendar Panel, Date Range Panel, Select, Multi Select, Combobox.',
  },
  {
    name: 'Effects/Elevation/Floating/Hard',
    css: '--cometal-effects-effects-elevation-floating-hard',
    value: effectsSource.Effects.Effects.Elevation.Floating.Hard.$value,
    usage: 'Tooltip, Context Menu и другие компактные action surfaces.',
  },
] as const;
const sourceConflicts = inventory.sourceConflicts as SourceConflict[];
const tokenByReference = new Map<string, Token>();
for (const token of primitiveTokens) {
  const path = token.name.replaceAll('/', '.');
  tokenByReference.set(`Primitive.${path}`, token);
  if (token.type === 'color') tokenByReference.set(`Primitive.Color.${path}`, token);
}
for (const token of semanticTokens.filter((item) => item.type === 'color')) {
  const reference = `Semantic.Color.${token.name.replaceAll('/', '.')}`;
  tokenByReference.set(reference, token);
  tokenByReference.set(`${reference}.$root`, token);
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const name = key(item);
    groups.set(name, [...(groups.get(name) ?? []), item]);
  }
  return groups;
}

function cssValue(value: TokenValue, visited = new Set<string>()): string {
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string') {
    const reference = value.replace(/^\{|\}$/g, '');
    const referenced = tokenByReference.get(reference);
    if (!referenced || visited.has(reference)) return value;
    const nextVisited = new Set(visited);
    nextVisited.add(reference);
    return cssValue(referenced.value, nextVisited);
  }
  if ('value' in value) return `${value.value}${value.unit}`;
  const [r, g, b] = value.components.map((part) => Math.round(part * 255));
  return `rgba(${r}, ${g}, ${b}, ${value.alpha ?? 1})`;
}

function numericValue(value: TokenValue): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && 'value' in value) return value.value;
  return 0;
}

function aliasName(value: TokenValue): string {
  return typeof value === 'string' && value.startsWith('{')
    ? value.slice(1, -1).replace(/^Primitive\./, 'Primitive / ').replaceAll('.', ' / ')
    : '—';
}

function PageHeader({ eyebrow, title, description, nodeId, sourceHref, sourceLabel = 'Открыть источник в Figma' }: { eyebrow: string; title: string; description: string; nodeId?: string; sourceHref?: string; sourceLabel?: string }) {
  const href = sourceHref ?? (nodeId ? `${figmaBase}${nodeId.replace(':', '-')}` : undefined);
  return (
    <header className="ds-header">
      <div>
        <span className="ds-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="ds-lead">{description}</p>
      </div>
      {href ? <a className="ds-source" href={href} target="_blank" rel="noreferrer">{sourceLabel}</a> : null}
    </header>
  );
}

function OverviewPage() {
  const stats = [
    [inventory.figma.variables.total, 'переменных Figma'],
    [inventory.figma.variables.primitive, 'примитивов'],
    [inventory.figma.variables.semantic, 'семантических токена'],
    [inventory.figma.styles.text, 'текстовых стилей'],
    [gridData.presets.length, 'grid-пресета'],
    [iconManifestMetadata.total, 'икон-компонентов'],
  ];
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / OVERVIEW" title="Foundation" description="Единый инженерный каталог базовых решений Cometal: значения, алиасы, параметры и границы готовности." nodeId="4:28" />
      <div className="ds-foundation-stats">{stats.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}</div>
      <section className="ds-section">
        <h2>Как читать Foundation</h2>
        <div className="ds-layer-flow">
          <article><code>01</code><strong>Primitive</strong><p>Хранит исходное значение без продуктового смысла.</p></article>
          <article><code>02</code><strong>Semantic</strong><p>Даёт значению роль и ссылается на primitive.</p></article>
          <article><code>03</code><strong>Component</strong><p>Собирает роли и состояния конкретного компонента.</p></article>
          <article><code>04</code><strong>Product</strong><p>Использует API компонента, не локальные значения.</p></article>
        </div>
      </section>
    </main>
  );
}

function PrimitiveColorsPage() {
  const colors = primitiveTokens.filter((token) => token.type === 'color');
  const families = groupBy(colors, (token) => token.name.split('/')[1] ?? 'Other');
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / COLOR / PRIMITIVE" title="Примитивная палитра" description={`${colors.length} исходных цветовых значений. Имя кодирует семейство, ступень и прозрачность; продуктовые компоненты не используют их напрямую.`} nodeId="668:15032" />
      {[...families].map(([family, tokens]) => (
        <section className="ds-section" key={family}>
          <h2>{family} <span>{tokens.length}</span></h2>
          <div className="ds-color-table" role="table" aria-label={`${family}: примитивные цвета`}>
            {tokens.map((token) => <div role="row" key={token.name}><i role="cell" aria-label={`Preview: ${cssValue(token.value)}`} style={{ background: cssValue(token.value) }} /><code role="cell">{token.name}</code><span role="cell">{cssValue(token.value)}</span></div>)}
          </div>
        </section>
      ))}
    </main>
  );
}

function SemanticColorsPage() {
  const colors = [...semanticTokens, ...componentTokens].filter((token) => token.type === 'color');
  const groups = groupBy(colors, (token) => token.name.split('/')[1] ?? 'Other');
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / COLOR / SEMANTIC" title="Семантическая карта" description={`${colors.length} цветовых ролей. Каждая роль хранит ссылку на primitive, поэтому назначение стабильно, а значение заменяемо централизованно.`} nodeId="1341:1852" />
      {[...groups].map(([group, tokens]) => (
        <section className="ds-section" key={group}>
          <h2>{group} <span>{tokens.length}</span></h2>
          <div className="ds-semantic-table" role="table" aria-label={`${group}: семантические цвета`}>
            <div className="ds-table-head" role="row"><span role="columnheader">Роль</span><span role="columnheader">Preview</span><span role="columnheader">Alias</span><span role="columnheader">Resolved</span></div>
            {tokens.map((token) => <div role="row" data-semantic-token={token.name} key={token.name}><code role="cell">{token.name}</code><i role="cell" aria-label={`Preview: ${cssValue(token.value)}`} style={{ background: cssValue(token.value) }} /><span role="cell">{aliasName(token.value)}</span><strong role="cell">{cssValue(token.value)}</strong></div>)}
          </div>
        </section>
      ))}
    </main>
  );
}

function TypographyPage() {
  const sections = groupBy(typographyData.styles, (style) => style.name.split('/')[0]);
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / TYPOGRAPHY" title="Типографика" description={`${typographyData.styles.length} локальных стиля: основной Grtsk Peta и технический IBM Plex Mono. В примере применяются реальные family, weight, size, line-height, letter-spacing и text case.`} nodeId="668:14643" />
      {[...sections].map(([section, styles]) => <section className="ds-section" key={section}><h2>{section} <span>{styles.length}</span></h2><div className="ds-type-list">{styles.map((style) => <article key={style.name}><div><strong>{style.name}</strong><code>{style.size}/{style.lineHeight}px · {style.weight} · {style.letterSpacingPercent}%</code></div><p style={{fontFamily: style.family, fontWeight: style.weight, fontSize: style.size, lineHeight: `${style.lineHeight}px`, letterSpacing: `${style.letterSpacingPercent / 100}em`, textTransform: style.textCase === 'upper' ? 'uppercase' : 'none'}}>Система управления закупками</p><span>{style.description}</span></article>)}</div></section>)}
    </main>
  );
}

function MetricPage({ kind, title, nodeId }: { kind: 'Spacing' | 'Size' | 'Radius' | 'Stroke'; title: string; nodeId: string }) {
  const primitive = primitiveTokens.filter((token) => token.name.startsWith(`${kind}/`));
  const semantic = semanticTokens.filter((token) => token.name.startsWith(`${kind}/`));
  return (
    <main className="ds-page">
      <PageHeader eyebrow={`FOUNDATION / ${kind.toUpperCase()}`} title={title} description={`Primitive задаёт шкалу. Semantic фиксирует назначение и хранит alias. В каталоге показаны все ${primitive.length + semantic.length} значения из Figma.`} nodeId={nodeId} />
      <section className="ds-section"><h2>Primitive <span>{primitive.length}</span></h2><div className="ds-metric-table" role="table" aria-label={`${title}: primitive`}><div className="ds-table-head ds-table-head--metric" role="row"><span role="columnheader">Токен</span><span role="columnheader">Preview</span><span role="columnheader">Значение</span></div>{primitive.map((token) => <div role="row" key={token.name}><code role="cell">{token.name}</code><div role="cell"><i style={{width: `${Math.max(1, numericValue(token.value))}px`, borderRadius: kind === 'Radius' ? cssValue(token.value) : 0}} /></div><strong role="cell">{cssValue(token.value)}</strong></div>)}</div></section>
      <section className="ds-section"><h2>Semantic <span>{semantic.length}</span></h2><div className="ds-alias-table" role="table" aria-label={`${title}: semantic`}><div className="ds-table-head ds-table-head--metric" role="row"><span role="columnheader">Роль</span><span role="columnheader">Alias</span><span role="columnheader">Resolved</span></div>{semantic.map((token) => <div role="row" key={token.name}><code role="cell">{token.name}</code><span role="cell">{aliasName(token.value)}</span><strong role="cell">{cssValue(token.value)}</strong></div>)}</div></section>
    </main>
  );
}

function GridPage() {
  return <main className="ds-page"><PageHeader eyebrow="FOUNDATION / GRID" title="Адаптивная сетка" description="Четыре документированных пресета и допустимые адаптивные количества колонок. В Figma это документация, а не опубликованные Grid Styles." nodeId="1611:2" /><div className="ds-grid-presets">{gridData.presets.map((preset) => <article key={preset.name}><div className="ds-grid-demo" style={{gridTemplateColumns:`repeat(${preset.columns},1fr)`,gap:Math.max(2,preset.gutter/6)}}>{Array.from({length:preset.columns},(_,i)=><i key={i}/>)}</div><h2>{preset.name}</h2><dl><div><dt>Viewport</dt><dd>{preset.viewport}px</dd></div><div><dt>Columns</dt><dd>{preset.columns}</dd></div><div><dt>Margin</dt><dd>{preset.margin}px</dd></div><div><dt>Gutter</dt><dd>{preset.gutter}px</dd></div></dl></article>)}</div><p className="ds-note">Адаптивный ряд колонок: {gridData.adaptiveColumnCounts.join(' → ')}.</p></main>;
}

function IconsPage() {
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / ICONS" title="Иконки" description="Единый generated-каталог всех 2 810 канонических источников: exact name, прямой import, поиск, фильтры и постраничная загрузка." nodeId="381:25439" />
      <section className="ds-section">
        <IconCatalog />
      </section>
    </main>
  );
}

function ShadowPage() {
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / SHADOW" title="Тени" description="Два effect styles — Soft и Hard. Они приходят из Figma snapshot и являются единственным разрешённым shadow contract для floating layers." sourceLabel="Открыть board в Figma" sourceHref={`${figmaBase}2561-116`} />
      <section className="ds-section">
        <h2>Elevation tokens <span>{shadowTokens.length}</span></h2>
        <div className="ds-shadow-grid">
          {shadowTokens.map((token) => (
            <article key={token.name}>
              <code>{token.name}</code>
              <div className="ds-shadow-preview"><div style={{ boxShadow: `var(${token.css})` }} /></div>
              <strong>{token.css}</strong>
              <span>{token.usage}</span>
              <small>{token.value}</small>
            </article>
          ))}
        </div>
      </section>
      <section className="ds-section">
        <h2>Правило применения</h2>
        <div className="ds-layer-flow">
          <article><code>Soft</code><strong>Field overlays</strong><p>Date Picker, Date Range Picker, Select, Multi Select и Combobox.</p></article>
          <article><code>Hard</code><strong>Compact actions</strong><p>Tooltip, Context Menu и другие небольшие action surfaces.</p></article>
          <article><code>Запрещено</code><strong>Локальный shadow</strong><p>Компонент выбирает только approved effect style; новые тени сначала утверждаются в Figma.</p></article>
        </div>
      </section>
    </main>
  );
}

const motionState = motionSource.Motion.Duration.State.$value;
const motionFast = motionSource.Motion.Duration.Fast.$value;
const motionPopover = motionSource.Motion.Duration.Popover.$value;
const motionSpin = motionSource.Motion.Duration.Spin.$value;
const motionSpinReduced = motionSource.Motion.Duration['Spin Reduced'].$value;
const motionStandard = `cubic-bezier(${motionSource.Motion.Easing.Standard.$value.join(', ')})`;
const motionEnter = `cubic-bezier(${motionSource.Motion.Easing.Enter.$value.join(', ')})`;
const motionLinear = `cubic-bezier(${motionSource.Motion.Easing.Linear.$value.join(', ')})`;

function MotionCurve() {
  return (
    <svg className="ds-motion-curve" viewBox="0 0 320 176" role="img" aria-label={`Enter easing: ${motionEnter}`}>
      <line x1="24" y1="152" x2="296" y2="152" />
      <line x1="24" y1="152" x2="24" y2="24" />
      <path d="M 24 152 C 68 24, 106 24, 296 24" />
      <circle cx="24" cy="152" r="5" />
      <circle cx="296" cy="24" r="5" />
      <text x="24" y="170">0</text>
      <text x="270" y="170">100%</text>
    </svg>
  );
}

function MotionPlayground() {
  const [run, setRun] = useState(0);
  const [reduced, setReduced] = useState(false);

  return (
    <div className="ds-motion-playground" data-reduced={reduced || undefined}>
      <div className="ds-motion-playground__toolbar">
        <div>
          <strong>Popover enter</strong>
          <span>Opacity + 4px по оси Y</span>
        </div>
        <div className="ds-motion-playground__actions">
          <Switch size="s" checked={reduced} onChange={(event) => setReduced(event.currentTarget.checked)} label="Reduced motion" />
          <Button size="m" variant="secondary" onClick={() => setRun((value) => value + 1)}>Повторить</Button>
        </div>
      </div>
      <div className="ds-motion-stage">
        <div className="ds-motion-trigger" aria-hidden="true">Выберите значение <span>⌄</span></div>
        <div className="ds-motion-popover" key={`${run}-${reduced}`} aria-hidden="true">
          <span>Активный</span>
          <span>На согласовании</span>
          <span>Завершён</span>
        </div>
      </div>
    </div>
  );
}

function MotionPage() {
  const tokens = [
    { name: 'motion.duration.state', css: '--cometal-motion-duration-state', value: motionState, usage: 'Hover, pressed и изменение цвета' },
    { name: 'motion.duration.fast', css: '--cometal-motion-duration-fast', value: motionFast, usage: 'Fade и reduced-motion переход' },
    { name: 'motion.duration.popover', css: '--cometal-motion-duration-popover', value: motionPopover, usage: 'Select, Multi Select, Date Picker' },
    { name: 'motion.duration.spin', css: '--cometal-motion-duration-spin', value: motionSpin, usage: 'Один оборот loader' },
    { name: 'motion.duration.spin-reduced', css: '--cometal-motion-duration-spin-reduced', value: motionSpinReduced, usage: 'Loader при reduced motion' },
    { name: 'motion.easing.standard', css: '--cometal-motion-easing-standard', value: motionStandard, usage: 'Изменение состояния control' },
    { name: 'motion.easing.enter', css: '--cometal-motion-easing-enter', value: motionEnter, usage: 'Появление элемента рядом с trigger' },
    { name: 'motion.easing.linear', css: '--cometal-motion-easing-linear', value: motionLinear, usage: 'Непрерывное вращение loader' },
  ];

  return (
    <main className="ds-page ds-motion-page">
      <PageHeader
        eyebrow="FOUNDATION / MOTION"
        title="Motion"
        description="Единый язык движения для React‑компонентов Cometal. Motion объясняет изменение состояния, не замедляя работу."
        sourceHref="https://github.com/cometal-design/cometal-design-system/blob/main/packages/tokens/src/motion.tokens.json"
        sourceLabel="Открыть token source в Git"
      />

      <section className="ds-section">
        <div className="ds-motion-principle">
          <span>01</span>
          <div>
            <h2>Не украшать. Объяснять.</h2>
            <p>Анимация показывает, откуда появился новый слой, что изменилось и какое действие сработало. Если без движения смысл не теряется, оно не нужно.</p>
          </div>
        </div>
        <div className="ds-motion-anatomy">
          <article><code>Duration</code><strong>Как долго</strong><p>Коротко для частых действ, чуть дольше для появления слоя.</p></article>
          <article><code>Easing</code><strong>Как движется</strong><p>Enter начинается быстро и мягко замедляется к финалу.</p></article>
          <article><code>Property</code><strong>Что меняется</strong><p>Для UI используем opacity и transform, не анимируем layout.</p></article>
        </div>
      </section>

      <section className="ds-section">
        <h2>Токены <span>{tokens.length}</span></h2>
        <div className="ds-motion-token-grid">
          {tokens.map((token) => (
            <article key={token.name}>
              <code>{token.name}</code>
              <strong>{token.value}</strong>
              <span>{token.usage}</span>
              <small>{token.css}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="ds-section ds-motion-behavior">
        <div>
          <h2>Кривая enter</h2>
          <p>Сильный ease-out сразу отвечает на действие и затем мягко останавливает элемент.</p>
          <code>{motionEnter}</code>
        </div>
        <MotionCurve />
      </section>

      <section className="ds-section">
        <h2>Живой пример</h2>
        <MotionPlayground />
      </section>

      <section className="ds-section">
        <h2>Правила применения</h2>
        <div className="ds-motion-rules">
          <article><code>Pointer</code><strong>Движение допустимо</strong><p>Клик по Select или Date Picker может мягко показать связь trigger и popover.</p></article>
          <article><code>Keyboard</code><strong>Мгновенно</strong><p>Частые клавиатурные действия не анимируем: система не должна казаться медленной.</p></article>
          <article><code>Reduced motion</code><strong>Без пространственного сдвига</strong><p>Уважаем prefers-reduced-motion: убираем translate, оставляем мгновенное или короткое opacity.</p></article>
        </div>
      </section>
    </main>
  );
}

function EngineeringPage() {
  return <main className="ds-page"><PageHeader eyebrow="FOUNDATION / ENGINEERING" title="Инженерный паспорт" description="Проверяем не только витрину: коллекции, modes, aliases, scopes, code syntax и опубликованные стили." nodeId="4:28" /><div className="ds-engineering-grid">{inventory.figma.collections.map((collection)=><article key={collection.name}><code>{collection.name}</code><strong>{collection.variables}</strong><span>variables · {collection.modes} mode(s)</span></article>)}</div><section className="ds-section"><h2>Контрольные показатели</h2><div className="ds-alias-table"><article><code>Aliases</code><span>Семантика и component collections</span><strong>{inventory.figma.variables.withAliases}</strong></article><article><code>Scopes</code><span>Заданы у всех переменных</span><strong>{inventory.figma.variables.withScopes}</strong></article><article><code>Code syntax</code><span>WEB syntax в Figma</span><strong>{inventory.figma.variables.withCodeSyntax}</strong></article><article><code>Local styles</code><span>Text / Paint / Grid / Effect</span><strong>{inventory.figma.styles.text} / 0 / 0 / {inventory.figma.styles.effect}</strong></article></div></section><section className="ds-section"><h2>Source conflicts <span>{sourceConflicts.length}</span></h2><div className="ds-conflict-list">{sourceConflicts.map((conflict)=><article key={conflict.area}><code>{conflict.severity.toUpperCase()} · {conflict.area}</code><strong>Утверждённая страница и Variables расходятся</strong><p>Только на странице: {conflict.pageOnlyTokens.join(', ')}.</p><span>{conflict.decision}</span></article>)}</div></section><section className="ds-section"><h2>Осознанные границы</h2><div className="ds-empty"><strong>Ничего не выдумываем</strong><p>Grid остаётся documentation-only, icons — inventory-only. Soft и Hard shadows публикуются только через approved effect styles и не заменяются локальными box-shadow.</p></div></section></main>;
}

const meta = { title: 'Foundation', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: 'Обзор', render: () => <OverviewPage /> };
export const PrimitiveColors: Story = { name: 'Цвет / Примитивы', render: () => <PrimitiveColorsPage /> };
export const SemanticColors: Story = {
  name: 'Цвет / Семантическая карта',
  render: () => <SemanticColorsPage />,
  play: async ({ canvasElement }) => {
    const rows = canvasElement.querySelectorAll('[data-semantic-token]');
    await expect(rows).toHaveLength(288);
  },
};
export const Typography: Story = { name: 'Типографика', render: () => <TypographyPage /> };
export const Spacing: Story = { name: 'Отступы', render: () => <MetricPage kind="Spacing" title="Отступы" nodeId="4:33" /> };
export const Size: Story = { name: 'Размеры', render: () => <MetricPage kind="Size" title="Размеры" nodeId="4:28" /> };
export const Radius: Story = { name: 'Радиусы', render: () => <MetricPage kind="Radius" title="Радиусы" nodeId="4:32" /> };
export const Stroke: Story = { name: 'Толщины линий', render: () => <MetricPage kind="Stroke" title="Толщины линий" nodeId="4:28" /> };
export const Grid: Story = { name: 'Сетка', render: () => <GridPage /> };
export const Shadow: Story = { name: 'Тени', render: () => <ShadowPage /> };
export const Icons: Story = {
  name: 'Иконки',
  render: () => <StrictMode><IconsPage /></StrictMode>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'Поиск по каноническому имени' }) as HTMLInputElement;
    const selects = canvas.getAllByRole('combobox') as HTMLSelectElement[];
    const resultLine = canvasElement.querySelector<HTMLElement>('.cometal-icon-catalog__result-line')!;
    const originalSearch = search.value;
    const originalFilters = selects.map((select) => select.value);
    const originalPage = Number(resultLine.dataset.page);
    const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => undefined } });

    const currentPage = () => Number(resultLine.dataset.page);
    const moveToPage = async (target: number) => {
      while (currentPage() < target) {
        const nextPage = currentPage() + 1;
        await userEvent.click(canvas.getByRole('button', { name: 'Следующая' }));
        await waitFor(() => expect(currentPage()).toBe(nextPage));
      }
      while (currentPage() > target) {
        const previousPage = currentPage() - 1;
        await userEvent.click(canvas.getByRole('button', { name: 'Предыдущая' }));
        await waitFor(() => expect(currentPage()).toBe(previousPage));
      }
    };
    const waitForLoadedPreview = (canonicalName: string) => new Promise<HTMLElement>((resolve, reject) => {
      let settled = false;
      const observer = new MutationObserver(() => check());
      const finish = (callback: () => void) => {
        if (settled) return;
        settled = true;
        observer.disconnect();
        callback();
      };
      const check = () => {
        const preview = [...canvasElement.querySelectorAll<HTMLElement>('[data-preview-name]')]
          .find((candidate) => candidate.dataset.previewName === canonicalName);
        if (!preview) return;
        if (preview.dataset.previewState === 'error') {
          finish(() => reject(new Error(`Lazy preview failed to load: ${canonicalName}`)));
        } else if (preview.dataset.previewState === 'loaded') {
          finish(() => resolve(preview));
        }
      };
      observer.observe(canvasElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-preview-state'] });
      check();
    });

    try {
      await expect(canvas.getAllByRole('listitem')).toHaveLength(120);
      await expect(canvasElement.querySelectorAll('.cometal-icon-catalog__name')).toHaveLength(120);
      await expect(canvas.queryAllByRole('status')).toHaveLength(1);
      await expect(canvasElement.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);

      const actionButtons = [...canvasElement.querySelectorAll<HTMLButtonElement>('.cometal-icon-catalog__actions button')];
      await expect(actionButtons).toHaveLength(240);
      for (const button of actionButtons) {
        expect(button.scrollWidth, `${button.textContent} overflows at ${window.innerWidth}px`).toBeLessThanOrEqual(button.clientWidth);
      }

      const firstName = canvasElement.querySelector('.cometal-icon-catalog__name')?.textContent;
      await expect(firstName).toBeTruthy();
      const firstCopyName = canvas.getByRole('button', { name: `Копировать имя ${firstName}` });
      await userEvent.click(firstCopyName);
      await waitFor(() => expect(canvasElement.querySelector('.cometal-icon-catalog__feedback')).toHaveTextContent(`Скопировано имя: ${firstName}`));
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('clipboard denied'); } } });
      await userEvent.click(canvas.getByRole('button', { name: `Копировать import ${firstName}` }));
      await waitFor(() => expect(canvasElement.querySelector('.cometal-icon-catalog__error')).toHaveTextContent('clipboard denied'));
      await expect(canvas.getByRole('status')).toHaveTextContent('clipboard denied');
      await expect(canvasElement.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => undefined } });

      await userEvent.clear(search);
      await userEvent.type(search, 'Outline/profiles-and-users/user-profile-03-02');
      await expect(await canvas.findByText('Outline/profiles-and-users/user-profile-03-02')).toBeVisible();
      const maskPreview = await waitForLoadedPreview('Outline/profiles-and-users/user-profile-03-02');
      await expect(maskPreview).toHaveAttribute('data-preview-state', 'loaded');
      const projections = [...maskPreview.querySelectorAll<HTMLElement>('[data-outline-projection]')];
      await expect(projections).toHaveLength(2);
      await expect(projections.map((projection) => projection.dataset.outlineProjection)).toEqual(['24', '64']);
      for (const projection of projections) {
        const expectedSize = Number(projection.dataset.outlineProjection);
        const svg = projection.querySelector('svg');
        const maskPath = projection.querySelector('path[stroke-width="2.8"]');
        await expect(svg).not.toBeNull();
        await expect(svg).toHaveAttribute('width', String(expectedSize));
        await expect(svg).toHaveAttribute('height', String(expectedSize));
        await expect(svg).toHaveAttribute('fill', 'none');
        await expect(getComputedStyle(svg!).fill).toBe('none');
        await expect(maskPath).not.toBeNull();
        await expect(getComputedStyle(maskPath!).fill).toBe('none');
        await expect(Number.parseFloat(getComputedStyle(maskPath!).strokeWidth)).toBe(2.8);
        await expect(maskPath).not.toHaveAttribute('data-cometal-stroke-scale');
        const previewBounds = maskPreview.getBoundingClientRect();
        const projectionBounds = svg!.getBoundingClientRect();
        expect(projectionBounds.left).toBeGreaterThanOrEqual(previewBounds.left);
        expect(projectionBounds.right).toBeLessThanOrEqual(previewBounds.right);
        expect(projectionBounds.top).toBeGreaterThanOrEqual(previewBounds.top);
        expect(projectionBounds.bottom).toBeLessThanOrEqual(previewBounds.bottom);
      }
      expect(maskPreview.scrollWidth).toBeLessThanOrEqual(maskPreview.clientWidth);
      expect(maskPreview.scrollHeight).toBeLessThanOrEqual(maskPreview.clientHeight);

      await userEvent.clear(search);
      await userEvent.type(search, 'payment/lg/Visa');
      await expect(await canvas.findByText('payment/lg/Visa')).toBeVisible();
      await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
      const visaPreview = await waitForLoadedPreview('payment/lg/Visa');
      await expect(visaPreview.querySelectorAll('svg')).toHaveLength(1);
      await expect(visaPreview.querySelector('[data-outline-projection]')).toBeNull();
      await expect(canvas.getByRole('button', { name: 'Копировать имя payment/lg/Visa' })).toBeVisible();
      await expect(canvas.getByRole('button', { name: 'Копировать import payment/lg/Visa' })).toBeVisible();

      await userEvent.clear(search);
      await waitFor(() => expect(canvas.getAllByRole('listitem')).toHaveLength(120));
      await moveToPage(23);
      const next = canvas.getByRole('button', { name: 'Следующая' });
      next.focus();
      await userEvent.click(next);
      await waitFor(() => expect(currentPage()).toBe(24));
      const previousAtEnd = canvas.getByRole('button', { name: 'Предыдущая' });
      await waitFor(() => expect(canvasElement.ownerDocument.activeElement).toBe(previousAtEnd));
      await expect(canvas.getByRole('button', { name: 'Следующая' })).toBeDisabled();
      await expect(canvasElement.ownerDocument.activeElement).not.toBe(canvasElement.ownerDocument.body);

      await userEvent.type(search, ' ');
      await userEvent.clear(search);
      await waitFor(() => expect(currentPage()).toBe(1));
      await moveToPage(2);
      const previous = canvas.getByRole('button', { name: 'Предыдущая' });
      previous.focus();
      await userEvent.click(previous);
      await waitFor(() => expect(currentPage()).toBe(1));
      const nextAtStart = canvas.getByRole('button', { name: 'Следующая' });
      await waitFor(() => expect(canvasElement.ownerDocument.activeElement).toBe(nextAtStart));
      await expect(canvas.getByRole('button', { name: 'Предыдущая' })).toBeDisabled();
      await expect(canvasElement.ownerDocument.activeElement).not.toBe(canvasElement.ownerDocument.body);
    } finally {
      if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
      else Reflect.deleteProperty(navigator, 'clipboard');

      await userEvent.type(search, ' ');
      await userEvent.clear(search);
      if (originalSearch) await userEvent.type(search, originalSearch);
      for (let index = 0; index < selects.length; index += 1) {
        if (selects[index].value !== originalFilters[index]) await userEvent.selectOptions(selects[index], originalFilters[index]);
      }
      await moveToPage(originalPage);
      await waitFor(() => expect(canvasElement.querySelectorAll('.cometal-icon-catalog__name')).toHaveLength(120));
      await expect(canvasElement.querySelector('.cometal-icon-catalog__feedback')).toHaveTextContent('');
      await expect(canvasElement.querySelector('.cometal-icon-catalog__error')).toBeNull();
      await expect(canvas.getByRole('status')).toHaveTextContent(/Найдено 2\s?810\. Страница 1 из 24\./);
    }
  },
};
export const Motion: Story = { name: 'Motion', render: () => <MotionPage /> };
export const Engineering: Story = { name: 'Инженерный паспорт', render: () => <EngineeringPage /> };
