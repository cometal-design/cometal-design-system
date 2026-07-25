import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '../../components/section-heading';
import inventory from '../../../../packages/tokens/src/foundation.inventory.json';
import typography from '../../../../packages/tokens/src/typography.styles.json';
import grid from '../../../../packages/tokens/src/grid.presets.json';
import icons from '../../../../packages/tokens/src/icons.inventory.json';
import { primitiveTokens, semanticTokens } from '../../lib/foundation-data';

const primitiveColors = primitiveTokens.filter((token) => token.type === 'color');
const semanticColors = semanticTokens.filter((token) => token.type === 'color');
const dimensionTokens = [...primitiveTokens, ...semanticTokens].filter((token) => token.type === 'dimension');

export const metadata: Metadata = {
  title: 'Foundation',
  description: 'Токены, типографика, сетки и инженерные правила дизайн-системы Cometal.',
};

const categories = [
  {
    number: '01',
    title: 'Цвет',
    count: `${primitiveColors.length + semanticColors.length} значений`,
    description: 'Примитивная палитра и семантические роли компонентов, поверхностей, текста и состояний.',
    href: '/foundation/color/primitives/',
  },
  {
    number: '02',
    title: 'Типографика',
    count: `${typography.styles.length} стилей`,
    description: 'Платформенная архитектура и опубликованная Web-шкала Grtsk Peta с точными метриками.',
    href: '/foundation/typography/web/',
  },
  {
    number: '03',
    title: 'Размеры и сетки',
    count: `${dimensionTokens.length} токенов · ${grid.presets.length} пресета`,
    description: 'Отступы, размеры, радиусы, толщины линий и адаптивные сетки в едином пространственном разделе.',
    href: '/foundation/layout/spacing/',
  },
  {
    number: '04',
    title: 'Темы',
    count: '1 режим',
    description: 'Основная тема Default, семантические роли и границы будущей тёмной темы.',
    href: '/foundation/themes/default/',
  },
  {
    number: '05',
    title: 'Иконки',
    count: `${icons.totalComponents.toLocaleString('ru-RU')} компонентов`,
    description: 'Инвентарь и карта замены. SVG/React API не считаются готовыми до отдельного утверждения.',
    href: '/foundation/icons/catalog/',
  },
];

export default function FoundationPage() {
  const figures = [
    [inventory.figma.variables.total, 'переменных Figma'],
    [inventory.figma.variables.foundation, 'токенов Foundation'],
    [inventory.figma.variables.withAliases, 'alias-связей'],
    [inventory.figma.variables.withCodeSyntax, 'с именами для кода'],
  ];

  return (
    <main className="content-page">
      <header className="page-header">
        <span className="eyebrow">FOUNDATION</span>
        <h1>Основа системы</h1>
        <p>Портал объясняет назначение. Storybook показывает инженерный каталог, итоговые значения и Playground. Значения поступают из источника токенов, синхронизированного с Figma.</p>
      </header>

      <section className="foundation-stats" aria-label="Инвентарь Foundation">
        {figures.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}
      </section>

      <section className="content-section">
        <SectionHeading title="Каталог" description="Каждая строка открывает категорию Foundation. Связанные слои и платформы переключаются табами внутри выбранной страницы." />
        <div className="foundation-catalog">
          {categories.map((category) => (
            <Link href={category.href} key={category.title}>
              <code>{category.number}</code>
              <div><strong>{category.title}</strong><span>{category.description}</span></div>
              <small>{category.count}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading title="Путь значения" description="Компоненты и продукт не должны обращаться к базовым значениям напрямую." />
        <ol className="process-line">
          <li><span>01</span><strong>Primitive</strong><p>Хранит значение.</p></li>
          <li><span>02</span><strong>Semantic</strong><p>Назначает роль.</p></li>
          <li><span>03</span><strong>Component</strong><p>Собирает состояния.</p></li>
          <li><span>04</span><strong>Product</strong><p>Использует API.</p></li>
        </ol>
      </section>

      <section className="content-section">
        <SectionHeading title="Границы готовности" description="Пробелы фиксируются явно и не заполняются придуманными решениями." />
        <div className="guidance">
          <article data-tone="positive"><strong>Готово</strong><p>Цвет, типографика и адаптивная сетка читаются из проверенных источников.</p></article>
          <article data-tone="negative"><strong>Требуется решение</strong><p>Страницы отступов и радиусов расходятся с переменными Figma. Иконки доступны только как инвентарь; тени отсутствуют.</p></article>
        </div>
        <aside className="review-banner">
          <div><span>Последняя сверка</span><strong>{inventory.verifiedAt}</strong></div>
          <p>Проверены коллекции, режимы, связи, области применения, имена для кода, локальные стили и сборка токенов.</p>
          <a href="/storybook/?path=/story/foundation--engineering">Инженерный паспорт ↗</a>
        </aside>
      </section>
    </main>
  );
}
