import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeading } from '../../components/section-heading';
import inventory from '../../../../packages/tokens/src/foundation.inventory.json';
import typography from '../../../../packages/tokens/src/typography.styles.json';
import grid from '../../../../packages/tokens/src/grid.presets.json';
import icons from '../../../../packages/tokens/src/icons.inventory.json';

export const metadata: Metadata = {
  title: 'Foundation',
  description: 'Токены, типографика, сетки и инженерные правила дизайн-системы Cometal.',
};

const categories = [
  {
    number: '01',
    title: 'Цвет · Примитивы',
    count: '364 значений',
    description: 'Исходная палитра: 8 цветовых семейств, ступени и уровни прозрачности.',
    href: '/foundation/color/primitives/',
  },
  {
    number: '02',
    title: 'Цвет · Семантика',
    count: '87 ролей',
    description: 'Роли Button, Surface, Text, Icon, Border, Action, State и Status с прямыми alias на primitive.',
    href: '/foundation/color/semantic/',
  },
  {
    number: '03',
    title: 'Типографика',
    count: `${typography.styles.length} стилей`,
    description: 'Grtsk Peta: Display, Heading, Body, Control, Caption и Label с точными метриками.',
    href: '/foundation/typography/web/',
  },
  {
    number: '04',
    title: 'Отступы',
    count: 'Primitive + Semantic',
    description: 'Шкала spacing и роли Stack, Section, Button, Input и Documentation.',
    href: '/foundation/layout/spacing/',
  },
  {
    number: '05',
    title: 'Размеры',
    count: 'Primitive + Semantic',
    description: 'Базовые размеры и роли Button, Icon и Field без локальных чисел.',
    href: '/foundation/layout/size/',
  },
  {
    number: '06',
    title: 'Радиусы',
    count: 'Primitive + Semantic',
    description: 'Радиусы компонентов, controls и focus в primitive- и semantic-слоях.',
    href: '/foundation/layout/radius/',
  },
  {
    number: '07',
    title: 'Толщины линий',
    count: 'Primitive + Semantic',
    description: 'Системная шкала stroke и семантические роли линий.',
    href: '/foundation/layout/stroke/',
  },
  {
    number: '08',
    title: 'Адаптивная сетка',
    count: `${grid.presets.length} пресета`,
    description: 'Desktop, tablet и mobile: viewport, columns, margin и gutter.',
    href: '/foundation/layout/grid/',
  },
  {
    number: '09',
    title: 'Темы',
    count: '1 mode',
    description: 'Текущий Default mode, semantic-роли и границы будущей Dark theme.',
    href: '/foundation/themes/default/',
  },
  {
    number: '10',
    title: 'Иконки',
    count: `${icons.totalComponents.toLocaleString('ru-RU')} компонентов`,
    description: 'Инвентарь и карта замены. SVG/React API не считаются готовыми до отдельного утверждения.',
    href: '/foundation/icons/catalog/',
  },
];

export default function FoundationPage() {
  const figures = [
    [inventory.figma.variables.total, 'переменных Figma'],
    [inventory.figma.variables.foundation, 'foundation tokens'],
    [inventory.figma.variables.withAliases, 'alias-связей'],
    [inventory.figma.variables.withCodeSyntax, 'с code syntax'],
  ];

  return (
    <main className="content-page">
      <header className="page-header">
        <span className="eyebrow">FOUNDATION</span>
        <h1>Основа системы</h1>
        <p>Портал объясняет назначение. Storybook показывает полный инженерный каталог, resolved values и Playground. Значения поступают из token source, синхронизированного с Figma.</p>
      </header>

      <section className="foundation-stats" aria-label="Инвентарь Foundation">
        {figures.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}
      </section>

      <section className="content-section">
        <SectionHeading title="Каталог" description="Каждая строка открывает самостоятельную страницу Foundation. Технические stories и Playground доступны уже внутри соответствующего раздела." />
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
        <SectionHeading title="Путь значения" description="Компоненты и продукт не должны обращаться к primitive напрямую." />
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
          <article data-tone="positive"><strong>Готово</strong><p>Primitive, semantic, typography и responsive grid documentation читаются из проверенных источников.</p></article>
          <article data-tone="negative"><strong>Требуется решение</strong><p>Страницы Spacing и Radius расходятся с Variables. Icons остаются inventory-only; shadows отсутствуют.</p></article>
        </div>
        <aside className="review-banner">
          <div><span>Последняя сверка</span><strong>{inventory.verifiedAt}</strong></div>
          <p>Проверены collections, modes, aliases, scopes, code syntax, local styles и token build.</p>
          <a href="/storybook/?path=/story/foundation--engineering">Инженерный паспорт ↗</a>
        </aside>
      </section>
    </main>
  );
}
