export type NavItem = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  children?: NavItem[];
};

export const primaryNavigation: NavItem[] = [
  { label: 'Документация', href: '/documentation/' },
  { label: 'Foundation', href: '/foundation/' },
  { label: 'Компоненты', href: '/components/' },
  { label: 'Паттерны', href: '/patterns/' },
  { label: 'Шаблоны', href: '/templates/' },
  { label: 'Storybook', href: '/storybook/', external: true },
];

export const sectionNavigation: Record<string, NavItem[]> = {
  documentation: [
    { label: 'Обзор системы', href: '/documentation/' },
    { label: 'Релизы', href: '/releases/' },
    { label: 'Источники истины', href: '/documentation/#sources' },
    { label: 'Жизненный цикл', href: '/documentation/#lifecycle' },
  ],
  foundation: [
    { label: 'Обзор', href: '/foundation/' },
    {
      label: 'Цвет',
      href: '/foundation/color/',
      children: [
        { label: 'Обзор', href: '/foundation/color/' },
        { label: 'Примитивы', href: '/foundation/color/primitives/' },
        { label: 'Семантика', href: '/foundation/color/semantic/' },
      ],
    },
    {
      label: 'Типографика',
      href: '/foundation/typography/',
      children: [
        { label: 'Обзор', href: '/foundation/typography/' },
        { label: 'Web', href: '/foundation/typography/web/' },
      ],
    },
    {
      label: 'Размеры и сетки',
      href: '/foundation/layout/',
      children: [
        { label: 'Обзор', href: '/foundation/layout/' },
        { label: 'Отступы', href: '/foundation/layout/spacing/' },
        { label: 'Размеры', href: '/foundation/layout/size/' },
        { label: 'Радиусы', href: '/foundation/layout/radius/' },
        { label: 'Толщины линий', href: '/foundation/layout/stroke/' },
        { label: 'Адаптивная сетка', href: '/foundation/layout/grid/' },
      ],
    },
    {
      label: 'Темы',
      href: '/foundation/themes/',
      children: [
        { label: 'Обзор', href: '/foundation/themes/' },
        { label: 'Default', href: '/foundation/themes/default/' },
      ],
    },
    {
      label: 'Иконки',
      href: '/foundation/icons/',
      children: [
        { label: 'Обзор', href: '/foundation/icons/' },
        { label: 'Каталог и статус', href: '/foundation/icons/catalog/' },
      ],
    },
  ],
  components: [
    { label: 'Overview', href: '/components/' },
    { label: 'Button', href: '/components/button/' },
    { label: 'Fields', href: '/components/fields/' },
    { label: 'Checkbox', href: '/components/checkbox/' },
    { label: 'Radio Button', href: '/components/radio-button/' },
    { label: 'Switch', href: '/components/switch/' },
  ],
  patterns: [{ label: 'Overview', href: '/patterns/' }],
  templates: [{ label: 'Overview', href: '/templates/' }],
  releases: [
    { label: 'Обзор системы', href: '/documentation/' },
    { label: 'Релизы', href: '/releases/' },
  ],
};
