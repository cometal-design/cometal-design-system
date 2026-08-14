import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, Switch } from '@cometal/react';
import primitiveSource from '../../../packages/tokens/src/primitive.tokens.json';
import semanticSource from '../../../packages/tokens/src/semantic.tokens.json';
import motionSource from '../../../packages/tokens/src/motion.tokens.json';
import typographyData from '../../../packages/tokens/src/typography.styles.json';
import gridData from '../../../packages/tokens/src/grid.presets.json';
import iconData from '../../../packages/tokens/src/icons.inventory.json';
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
const primitiveByReference = new Map(
  primitiveTokens.map((token) => [`Primitive.${token.name.replaceAll('/', '.')}`, token]),
);

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const name = key(item);
    groups.set(name, [...(groups.get(name) ?? []), item]);
  }
  return groups;
}

function cssValue(value: TokenValue): string {
  if (typeof value === 'number') return `${value}px`;
  if (typeof value === 'string') {
    const referenced = primitiveByReference.get(value.replace(/^\{|\}$/g, ''));
    return referenced ? cssValue(referenced.value) : value;
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
    [iconData.totalComponents, 'икон-компонентов'],
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
  const colors = semanticTokens.filter((token) => token.type === 'color');
  const groups = groupBy(colors, (token) => token.name.split('/')[1] ?? 'Other');
  return (
    <main className="ds-page">
      <PageHeader eyebrow="FOUNDATION / COLOR / SEMANTIC" title="Семантическая карта" description={`${colors.length} цветовых ролей. Каждая роль хранит ссылку на primitive, поэтому назначение стабильно, а значение заменяемо централизованно.`} nodeId="1341:1852" />
      {[...groups].map(([group, tokens]) => (
        <section className="ds-section" key={group}>
          <h2>{group} <span>{tokens.length}</span></h2>
          <div className="ds-semantic-table" role="table" aria-label={`${group}: семантические цвета`}>
            <div className="ds-table-head" role="row"><span role="columnheader">Роль</span><span role="columnheader">Preview</span><span role="columnheader">Alias</span><span role="columnheader">Resolved</span></div>
            {tokens.map((token) => <div role="row" key={token.name}><code role="cell">{token.name}</code><i role="cell" aria-label={`Preview: ${cssValue(token.value)}`} style={{ background: cssValue(token.value) }} /><span role="cell">{aliasName(token.value)}</span><strong role="cell">{cssValue(token.value)}</strong></div>)}
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
  return <main className="ds-page"><PageHeader eyebrow="FOUNDATION / ICONS" title="Иконки" description="Полный инвентарь Figma и честный статус инженерной готовности. SVG и React API пока не утверждены, поэтому каталог не подменяет их самодельными иконками." nodeId="381:25439" /><div className="ds-status-grid">{iconData.libraries.map((library)=><article key={library.name}><strong>{library.components}</strong><span>{library.name}</span><small>{library.categories} категорий</small></article>)}</div><section className="ds-section"><h2>Карта замены</h2><div className="ds-review-grid"><article className="ok"><strong>{iconData.replacementMap.highConfidence}</strong><span>высокая уверенность</span></article><article className="warn"><strong>{iconData.replacementMap.needsVisualReview}</strong><span>визуальное ревью</span></article><article className="stop"><strong>{iconData.replacementMap.notFound}</strong><span>не найдено</span></article></div><p className="ds-note">{iconData.replacementMap.policy}</p></section></main>;
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
  return <main className="ds-page"><PageHeader eyebrow="FOUNDATION / ENGINEERING" title="Инженерный паспорт" description="Проверяем не только витрину: коллекции, modes, aliases, scopes, code syntax и опубликованные стили." nodeId="4:28" /><div className="ds-engineering-grid">{inventory.figma.collections.map((collection)=><article key={collection.name}><code>{collection.name}</code><strong>{collection.variables}</strong><span>variables · {collection.modes} mode(s)</span></article>)}</div><section className="ds-section"><h2>Контрольные показатели</h2><div className="ds-alias-table"><article><code>Aliases</code><span>Семантика и component collections</span><strong>{inventory.figma.variables.withAliases}</strong></article><article><code>Scopes</code><span>Заданы у всех переменных</span><strong>{inventory.figma.variables.withScopes}</strong></article><article><code>Code syntax</code><span>WEB syntax в Figma</span><strong>{inventory.figma.variables.withCodeSyntax}</strong></article><article><code>Local styles</code><span>Text / Paint / Grid / Effect</span><strong>{inventory.figma.styles.text} / 0 / 0 / 0</strong></article></div></section><section className="ds-section"><h2>Source conflicts <span>{inventory.sourceConflicts.length}</span></h2><div className="ds-conflict-list">{inventory.sourceConflicts.map((conflict)=><article key={conflict.area}><code>{conflict.severity.toUpperCase()} · {conflict.area}</code><strong>Утверждённая страница и Variables расходятся</strong><p>Только на странице: {conflict.pageOnlyTokens.join(', ')}.</p><span>{conflict.decision}</span></article>)}</div></section><section className="ds-section"><h2>Осознанные границы</h2><div className="ds-empty"><strong>Ничего не выдумываем</strong><p>Grid остаётся documentation-only, icons — inventory-only, shadows отсутствуют. Новые значения появляются только после решения в Figma и синхронизации token source.</p></div></section></main>;
}

const meta = { title: 'Foundation', parameters: { layout: 'fullscreen' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = { name: 'Обзор', render: () => <OverviewPage /> };
export const PrimitiveColors: Story = { name: 'Цвет / Примитивы', render: () => <PrimitiveColorsPage /> };
export const SemanticColors: Story = { name: 'Цвет / Семантическая карта', render: () => <SemanticColorsPage /> };
export const Typography: Story = { name: 'Типографика', render: () => <TypographyPage /> };
export const Spacing: Story = { name: 'Отступы', render: () => <MetricPage kind="Spacing" title="Отступы" nodeId="4:33" /> };
export const Size: Story = { name: 'Размеры', render: () => <MetricPage kind="Size" title="Размеры" nodeId="4:28" /> };
export const Radius: Story = { name: 'Радиусы', render: () => <MetricPage kind="Radius" title="Радиусы" nodeId="4:32" /> };
export const Stroke: Story = { name: 'Толщины линий', render: () => <MetricPage kind="Stroke" title="Толщины линий" nodeId="4:28" /> };
export const Grid: Story = { name: 'Сетка', render: () => <GridPage /> };
export const Icons: Story = { name: 'Иконки', render: () => <IconsPage /> };
export const Motion: Story = { name: 'Motion', render: () => <MotionPage /> };
export const Engineering: Story = { name: 'Инженерный паспорт', render: () => <EngineeringPage /> };
