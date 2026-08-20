import type { Preview } from '@storybook/react-vite';
import '@cometal/tokens/css';
import '@cometal/react/styles.css';
import '../stories/foundation.css';

const preview: Preview = {
  parameters: {
    htmlLang: 'ru',
    a11y: {
      test: 'error',
    },
    controls: {
      disableSaveFromUI: true,
      expanded: true,
    },
    options: {
      storySort: {
        order: ['Обзор', 'Foundation', 'Components', 'Patterns', 'Templates', '*'],
      },
    },
    docs: {
      lang: 'ru',
    },
  },
};

export default preview;
