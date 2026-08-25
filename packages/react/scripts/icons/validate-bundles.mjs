import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const root = await readFile(path.join(packageRoot, 'dist/index.js'), 'utf8');
const directPath = path.join(packageRoot, 'dist/icons/outline/arrows/arrow-curve-left-down.js');
const direct = await readFile(directPath, 'utf8');
const catalogPath = path.join(packageRoot, 'dist/icons/catalog.js');
const catalog = await readFile(catalogPath, 'utf8');
const sourceManifest = JSON.parse(await readFile(path.join(packageRoot, 'icons/source/manifest.source.json'), 'utf8'));
const fingerprint = '87caaa283983e042491e2b0beb6bb8cc54a8aeaad75b1b9599e66d06c2199a58';

if (root.includes(fingerprint) || root.includes('payment/lg/Visa') || root.includes('iconLoaders')) errors.push('root entry contains icon corpus or loader metadata');
if (direct.includes('payment/lg/Visa') || direct.includes('iconLoaders')) errors.push('direct entry contains unrelated icon or catalog loader');
if ((await stat(directPath)).size > 20_000) errors.push('representative direct entry exceeds 20 KB');
if (!catalog.trim() || !/export\s*\{/.test(catalog)) errors.push('catalog entry is not a generated export boundary');
if (!catalog.startsWith('"use client";')) errors.push('catalog entry lost its client boundary');
for (const record of sourceManifest.records) {
  const relative = record.importPath.replace('@cometal/react/icons/', '');
  const bytes = (await stat(path.join(packageRoot, `dist/icons/${relative}.js`))).size;
  const allowedOverhead = 5_000 + Math.ceil(record.sourceBytes * 0.01);
  if (bytes > record.sourceBytes + allowedOverhead) errors.push(`direct entry overhead exceeds budget: ${relative}`);
}

console.log(JSON.stringify({
  status: errors.length ? 'ICON_BUNDLE_BOUNDARY_FAILED' : 'ICON_BUNDLE_BOUNDARY_PASSED',
  bytes: { root: Buffer.byteLength(root), direct: Buffer.byteLength(direct), catalogEntry: Buffer.byteLength(catalog) },
  directEntriesChecked: sourceManifest.records.length,
  errors,
}, null, 2));
if (errors.length) process.exitCode = 1;
