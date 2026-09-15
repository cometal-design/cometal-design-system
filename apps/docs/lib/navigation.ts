import familyRegistry from '../../../registry/component-families.json';
import { fieldDocumentation, fieldSlugs } from './field-documentation';

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
  activePrefix?: string;
  activeSections?: string[];
  children?: NavItem[];
};

export type FoundationTab = Pick<NavItem, 'label' | 'href'>;

export const primaryNavigation: NavItem[] = [
  { label: 'Документация', href: '/documentation/', activeSections: ['documentation', 'releases'] },
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
  ],
  foundation: [
    { label: 'Обзор', href: '/foundation/' },
    { label: 'Цвет', href: '/foundation/color/primitives/', activePrefix: '/foundation/color/' },
    { label: 'Типографика', href: '/foundation/typography/web/', activePrefix: '/foundation/typography/' },
    { label: 'Размеры и сетки', href: '/foundation/layout/spacing/', activePrefix: '/foundation/layout/' },
    { label: 'Тени', href: '/foundation/shadow/' },
    { label: 'Темы', href: '/foundation/themes/default/', activePrefix: '/foundation/themes/' },
    { label: 'Иконки', href: '/foundation/icons/catalog/', activePrefix: '/foundation/icons/' },
    { label: 'Motion', href: '/foundation/motion/' },
  ],
  components: [
    { label: 'Обзор', href: '/components/' },
    ...familyRegistry.families.map((family) => ({
      label: family.name,
      href: family.route,
      ...(family.id === 'data-display.table' ? { activePrefix: family.route } : {}),
      ...(family.id === 'input.fields' ? {
        activePrefix: family.route,
        children: fieldSlugs.map((slug) => ({ label: fieldDocumentation[slug].title, href: fieldDocumentation[slug].route })),
      } : {}),
    })),
  ],
  patterns: [{ label: 'Обзор', href: '/patterns/' }],
  templates: [{ label: 'Обзор', href: '/templates/' }],
  releases: [
    { label: 'Обзор', href: '/documentation/' },
    { label: 'Релизы', href: '/releases/' },
  ],
};

export const foundationTabs: Record<'color' | 'layout', FoundationTab[]> = {
  color: [
    { label: 'Примитивы', href: '/foundation/color/primitives/' },
    { label: 'Семантика', href: '/foundation/color/semantic/' },
  ],
  layout: [
    { label: 'Отступы', href: '/foundation/layout/spacing/' },
    { label: 'Размеры', href: '/foundation/layout/size/' },
    { label: 'Радиусы', href: '/foundation/layout/radius/' },
    { label: 'Толщины линий', href: '/foundation/layout/stroke/' },
    { label: 'Адаптивная сетка', href: '/foundation/layout/grid/' },
  ],
};
