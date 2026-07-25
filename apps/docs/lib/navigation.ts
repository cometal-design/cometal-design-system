export type NavItem = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  activePrefix?: string;
};

export type FoundationTab = Pick<NavItem, 'label' | 'href'>;

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
    { label: 'Обзор', href: '/documentation/' },
    { label: 'Релизы', href: '/releases/' },
    { label: 'Источники истины', href: '/documentation/#sources' },
    { label: 'Жизненный цикл', href: '/documentation/#lifecycle' },
  ],
  foundation: [
    { label: 'Обзор', href: '/foundation/' },
    { label: 'Цвет', href: '/foundation/color/primitives/', activePrefix: '/foundation/color/' },
    { label: 'Типографика', href: '/foundation/typography/web/', activePrefix: '/foundation/typography/' },
    { label: 'Размеры и сетки', href: '/foundation/layout/spacing/', activePrefix: '/foundation/layout/' },
    { label: 'Темы', href: '/foundation/themes/default/', activePrefix: '/foundation/themes/' },
    { label: 'Иконки', href: '/foundation/icons/catalog/', activePrefix: '/foundation/icons/' },
  ],
  components: [
    { label: 'Обзор', href: '/components/' },
    { label: 'Button', href: '/components/button/' },
    { label: 'Fields', href: '/components/fields/' },
    { label: 'Checkbox', href: '/components/checkbox/' },
    { label: 'Radio Button', href: '/components/radio-button/' },
    { label: 'Switch', href: '/components/switch/' },
  ],
  patterns: [{ label: 'Обзор', href: '/patterns/' }],
  templates: [{ label: 'Обзор', href: '/templates/' }],
  releases: [
    { label: 'Обзор', href: '/documentation/' },
    { label: 'Релизы', href: '/releases/' },
  ],
};

export const foundationTabs: Record<'color' | 'typography' | 'layout' | 'themes' | 'icons', FoundationTab[]> = {
  color: [
    { label: 'Примитивы', href: '/foundation/color/primitives/' },
    { label: 'Семантика', href: '/foundation/color/semantic/' },
  ],
  typography: [
    { label: 'Web', href: '/foundation/typography/web/' },
  ],
  layout: [
    { label: 'Отступы', href: '/foundation/layout/spacing/' },
    { label: 'Размеры', href: '/foundation/layout/size/' },
    { label: 'Радиусы', href: '/foundation/layout/radius/' },
    { label: 'Толщины линий', href: '/foundation/layout/stroke/' },
    { label: 'Адаптивная сетка', href: '/foundation/layout/grid/' },
  ],
  themes: [
    { label: 'Основная тема', href: '/foundation/themes/default/' },
  ],
  icons: [
    { label: 'Каталог', href: '/foundation/icons/catalog/' },
  ],
};
