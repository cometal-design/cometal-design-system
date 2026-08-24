import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';
import { readdirSync } from 'node:fs';
import path from 'node:path';

function iconEntries(root: string, prefix = ''): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const entry of readdirSync(path.join(root, prefix), { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) Object.assign(entries, iconEntries(root, relative));
    else if (entry.name.endsWith('.tsx')) {
      const name = relative.slice(0, -4).split(path.sep).join('/');
      entries[`icons/${name}`] = path.join(root, relative);
    }
  }
  return entries;
}

const generatedComponentsRoot = path.resolve('src/icons/generated/components');
const buildEntries = {
  index: path.resolve('src/index.ts'),
  'icons/manifest': path.resolve('src/icons/generated/manifest.ts'),
  'icons/catalog': path.resolve('src/icons/catalog/index.ts'),
  ...iconEntries(generatedComponentsRoot),
};

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true, entryRoot: 'src' })],
  build: {
    lib: {
      entry: buildEntries,
      formats: ['es'],
    },
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        format: 'es',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => assetInfo.name?.endsWith('.css') ? 'styles.css' : 'assets/[name][extname]',
      },
    },
  },
  test: {
    name: 'unit',
    include: ['src/**/*.test.{ts,tsx}'],
    passWithNoTests: true,
  },
});
