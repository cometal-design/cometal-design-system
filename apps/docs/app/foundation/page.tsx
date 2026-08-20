import type { Metadata } from 'next';
import Link from 'next/link';
import { InlineLink } from '@cometal/react';
import { MetadataStrip } from '../../components/metadata-strip';
import { PageHeader } from '../../components/page-header';
import { SectionHeading } from '../../components/section-heading';
import inventory from '../../../../packages/tokens/src/foundation.inventory.json';
import typography from '../../../../packages/tokens/src/typography.styles.json';
import grid from '../../../../packages/tokens/src/grid.presets.json';
import icons from '../../../../packages/tokens/src/icons.inventory.json';
import motion from '../../../../packages/tokens/src/motion.tokens.json';
import effects from '../../../../packages/tokens/src/effects.tokens.json';
import { primitiveTokens, semanticTokens } from '../../lib/foundation-data';

const primitiveColors = primitiveTokens.filter((token) => token.type === 'color');
const semanticColors = semanticTokens.filter((token) => token.type === 'color');
const dimensionTokens = [...primitiveTokens, ...semanticTokens].filter((token) => token.type === 'dimension');
const motionTokenCount = Object.keys(motion.Motion.Duration).length + Object.keys(motion.Motion.Easing).length;
const effectTokens = Object.values(effects.Effects.Effects.Elevation.Floating);

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
    title: 'Тени',
    count: `${effectTokens.length} стиля`,
    description: 'Soft и Hard elevation для календарей, listbox, tooltip и context menu с точным shadow contract.',
    href: '/foundation/shadow/',
  },
  {
    number: '05',
    title: 'Темы',
    count: '1 режим',
    description: 'Основная тема Default, семантические роли и границы будущей тёмной темы.',
    href: '/foundation/themes/default/',
  },
  {
    number: '06',
    title: 'Иконки',
    count: `${icons.totalComponents.toLocaleString('ru-RU')} компонентов`,
    description: 'Инвентарь и карта замены. SVG/React API не считаются готовыми до отдельного утверждения.',
    href: '/foundation/icons/catalog/',
  },
  {
    number: '07',
    title: 'Motion',
    count: `${motionTokenCount} токена`,
    description: 'Длительности, easing, правила появления слоёв и обязательный reduced-motion режим.',
    href: '/foundation/motion/',
  },
];

export default function FoundationPage() {
  const metadata = [
    `${inventory.figma.variables.total} переменных Figma`,
    `${inventory.figma.variables.foundation} токенов Foundation`,
    `${inventory.figma.variables.withAliases} alias-связей`,
    `${inventory.figma.variables.withCodeSyntax} с именами для кода`,
  ];

  return (
    <main className="content-page">
      <PageHeader
        eyebrow="FOUNDATION"
        title="Основа системы"
        description="Портал объясняет назначение. Storybook показывает инженерный каталог, итоговые значения и Playground. Значения поступают из источника токенов, синхронизированного с Figma."
      />

      <MetadataStrip ariaLabel="Инвентарь Foundation" items={metadata} />

      <section className="content-section content-section--continuation">
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
        <ol className="process-line process-line--open-end">
          <li><span>01</span><strong>Primitive</strong><p>Хранит значение.</p></li>
          <li><span>02</span><strong>Semantic</strong><p>Назначает роль.</p></li>
          <li><span>03</span><strong>Component</strong><p>Собирает состояния.</p></li>
          <li><span>04</span><strong>Product</strong><p>Использует API.</p></li>
        </ol>
      </section>

      <section className="content-section content-section--continuation">
        <SectionHeading title="Границы готовности" description="Пробелы фиксируются явно и не заполняются придуманными решениями." />
        <div className="guidance">
          <article data-tone="positive"><strong>Готово</strong><p>Цвет, типографика и адаптивная сетка читаются из проверенных источников.</p></article>
          <article data-tone="negative"><strong>Требуется решение</strong><p>Иконки остаются inventory-only до отдельного утверждения SVG/API. Tabs остаются Figma-only до продуктового API decision.</p></article>
        </div>
        <aside className="review-banner">
          <div><span>Последняя сверка</span><strong>{inventory.verifiedAt}</strong></div>
          <p>Проверены коллекции, режимы, связи, области применения, имена для кода, локальные стили и сборка токенов.</p>
          <InlineLink href="/storybook/?path=/story/foundation--engineering" touchTarget>Инженерный паспорт ↗</InlineLink>
        </aside>
      </section>
    </main>
  );
}
