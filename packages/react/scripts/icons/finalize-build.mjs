import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sourceManifest = JSON.parse(await readFile(path.join(packageRoot, 'icons/source/manifest.source.json'), 'utf8'));

for (const record of sourceManifest.records) {
  const relative = record.importPath.replace('@cometal/react/icons/', '');
  const source = path.join(packageRoot, 'dist/icons/generated/components', `${relative}.d.ts`);
  const target = path.join(packageRoot, 'dist/icons', `${relative}.d.ts`);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(source, target);
}

await copyFile(path.join(packageRoot, 'dist/icons/catalog/index.d.ts'), path.join(packageRoot, 'dist/icons/catalog.d.ts'));
await writeFile(path.join(packageRoot, 'dist/icons/manifest.d.ts'), `import type { IconManifestMetadata, IconManifestRecord } from './runtime/types';\nexport declare const iconManifestMetadata: IconManifestMetadata;\nexport declare const iconManifest: readonly IconManifestRecord[];\n`);

const catalogEntryPath = path.join(packageRoot, 'dist/icons/catalog.js');
const catalogEntry = await readFile(catalogEntryPath, 'utf8');
if (catalogEntry.includes('"use client";')) {
  await writeFile(catalogEntryPath, `"use client";${catalogEntry.replaceAll('"use client";', '')}`);
}

console.log(`[icons] finalized ${sourceManifest.records.length} direct declaration entrypoints`);
