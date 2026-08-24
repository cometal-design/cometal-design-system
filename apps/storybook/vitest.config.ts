import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, defineProject } from 'vitest/config';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogViewportInstances = process.env.COMETAL_CATALOG_VIEWPORTS === '1'
  ? [320, 768, 1440].map((width) => ({ browser: 'chromium' as const, name: `chromium-${width}`, viewport: { width, height: 900 } }))
  : [{ browser: 'chromium' as const, viewport: { width: 1280, height: 720 } }];

export default defineConfig({
  test: {
    projects: [
      defineProject({
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
            storybookScript: 'pnpm dev',
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: catalogViewportInstances,
          },
        },
      }),
    ],
  },
});
