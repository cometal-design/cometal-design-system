export type NavItem = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export const primaryNavigation: NavItem[] = [
  { label: 'Документация', href: '/documentation/' },
  { label: 'Foundation', href: '/foundation/' },
  { label: 'Компоненты', href: '/components/' },
  { label: 'Паттерны', href: '/patterns/' },
  { label: 'Шаблоны', href: '/templates/' },
  { label: 'Playground', href: '/storybook/', external: true },
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
    { label: 'Цвет', href: '/foundation/#color' },
    { label: 'Типографика', href: '/foundation/#typography' },
    { label: 'Размеры и сетки', href: '/foundation/#layout' },
    { label: 'Темы', href: '/foundation/#themes' },
    { label: 'Иконки', href: '/foundation/#icons' },
  ],
  components: [
    { label: 'Overview', href: '/components/' },
    { label: 'Button', href: '/components/button/' },
  ],
  patterns: [{ label: 'Overview', href: '/patterns/' }],
  templates: [{ label: 'Overview', href: '/templates/' }],
  releases: [
    { label: 'Обзор системы', href: '/documentation/' },
    { label: 'Релизы', href: '/releases/' },
  ],
};
