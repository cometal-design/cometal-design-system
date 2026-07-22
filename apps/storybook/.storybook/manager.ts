import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Cometal Design System',
    // Figma DS Core / System / Brand / Theme=dark / logotype (node 1655:3822).
    brandUrl: './?path=/story/обзор--welcome-page',
    brandImage: './cometal-logotype.svg',
    brandTarget: '_self',
  }),
});
