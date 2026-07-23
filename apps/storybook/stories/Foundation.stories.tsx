import type { Meta, StoryObj } from '@storybook/react-vite';
import primitiveSource from '../../../packages/tokens/src/primitive.tokens.json';
import semanticSource from '../../../packages/tokens/src/semantic.tokens.json';
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
          <div className="ds-color-table">
            {tokens.map((token) => <article key={token.name}><i style={{ background: cssValue(token.value) }} /><code>{token.name}</code><span>{cssValue(token.value)}</span></article>)}
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
          <div className="ds-semantic-table">
            <div className="ds-table-head"><span>Роль</span><span>Preview</span><span>Alias</span><span>Resolved</span></div>
            {tokens.map((token) => <article key={token.name}><code>{token.name}</code><i style={{ background: cssValue(token.value) }} /><span>{aliasName(token.value)}</span><strong>{cssValue(token.value)}</strong></article>)}
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
      <PageHeader eyebrow="FOUNDATION / TYPOGRAPHY" title="Типографика" description="18 локальных стилей Grtsk Peta. В примере применяются реальные family, weight, size, line-height, letter-spacing и text case." nodeId="668:14643" />
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
      <section className="ds-section"><h2>Primitive <span>{primitive.length}</span></h2><div className="ds-metric-table">{primitive.map((token) => <article key={token.name}><code>{token.name}</code><div><i style={{width: `${Math.max(1, numericValue(token.value))}px`, borderRadius: kind === 'Radius' ? cssValue(token.value) : 0}} /></div><strong>{cssValue(token.value)}</strong></article>)}</div></section>
      <section className="ds-section"><h2>Semantic <span>{semantic.length}</span></h2><div className="ds-alias-table">{semantic.map((token) => <article key={token.name}><code>{token.name}</code><span>{aliasName(token.value)}</span><strong>{cssValue(token.value)}</strong></article>)}</div></section>
    </main>
  );
}

function GridPage() {
  return <main className="ds-page"><PageHeader eyebrow="FOUNDATION / GRID" title="Адаптивная сетка" description="Четыре документированных пресета и допустимые адаптивные количества колонок. В Figma это документация, а не опубликованные Grid Styles." nodeId="1611:2" /><div className="ds-grid-presets">{gridData.presets.map((preset) => <article key={preset.name}><div className="ds-grid-demo" style={{gridTemplateColumns:`repeat(${preset.columns},1fr)`,gap:Math.max(2,preset.gutter/6)}}>{Array.from({length:preset.columns},(_,i)=><i key={i}/>)}</div><h2>{preset.name}</h2><dl><div><dt>Viewport</dt><dd>{preset.viewport}px</dd></div><div><dt>Columns</dt><dd>{preset.columns}</dd></div><div><dt>Margin</dt><dd>{preset.margin}px</dd></div><div><dt>Gutter</dt><dd>{preset.gutter}px</dd></div></dl></article>)}</div><p className="ds-note">Адаптивный ряд колонок: {gridData.adaptiveColumnCounts.join(' → ')}.</p></main>;
}

function IconsPage() {
  return <main className="ds-page"><PageHeader eyebrow="FOUNDATION / ICONS" title="Иконки" description="Полный инвентарь Figma и честный статус инженерной готовности. SVG и React API пока не утверждены, поэтому каталог не подменяет их самодельными иконками." nodeId="381:25439" /><div className="ds-status-grid">{iconData.libraries.map((library)=><article key={library.name}><strong>{library.components}</strong><span>{library.name}</span><small>{library.categories} категорий</small></article>)}</div><section className="ds-section"><h2>Карта замены</h2><div className="ds-review-grid"><article className="ok"><strong>{iconData.replacementMap.highConfidence}</strong><span>высокая уверенность</span></article><article className="warn"><strong>{iconData.replacementMap.needsVisualReview}</strong><span>визуальное ревью</span></article><article className="stop"><strong>{iconData.replacementMap.notFound}</strong><span>не найдено</span></article></div><p className="ds-note">{iconData.replacementMap.policy}</p></section></main>;
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
export const Engineering: Story = { name: 'Инженерный паспорт', render: () => <EngineeringPage /> };
