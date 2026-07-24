import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Cometal Design System',
    // Figma DS Core / System / Brand / Theme=favicon (node 1655:6179).
    // Storybook is mounted at /storybook; the logo returns to the documentation portal.
    brandUrl: '/',
    brandImage: './cometal-favicon.svg?brand=2',
    brandTarget: '_self',
  }),
});
