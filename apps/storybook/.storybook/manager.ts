import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Cometal Design System',
    // Figma DS Core / Documentation / Brand/Logotype/Cometal (node 1288:50).
    brandUrl: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs',
    brandImage: '/cometal-logotype.svg',
    brandTarget: '_blank',
  }),
});
