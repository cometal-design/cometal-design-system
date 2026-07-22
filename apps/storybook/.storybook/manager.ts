import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Cometal Design System',
    // Figma DS Core / Documentation / Brand / Theme=dark / logotype (node 1655:3822).
    brandUrl: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs',
    brandImage: '/cometal-logotype.svg',
    brandTarget: '_blank',
  }),
});
