import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      disableSaveFromUI: true,
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Обзор', 'Foundation', 'Components', 'Patterns', '*'],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
