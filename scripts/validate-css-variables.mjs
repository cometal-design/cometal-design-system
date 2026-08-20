import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const sourceRoots = [
  path.join(root, 'apps/docs/app'),
  path.join(root, 'apps/storybook/stories'),
  path.join(root, 'packages/react/src'),
];
const tokenCssPath = path.join(root, 'packages/tokens/dist/tokens.css');
const sourceFiles = [];

async function collectSourceFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectSourceFiles(absolute);
    else if (/\.(?:css|ts|tsx)$/.test(entry.name)) sourceFiles.push(absolute);
  }
}

for (const sourceRoot of sourceRoots) await collectSourceFiles(sourceRoot);

const sources = new Map();
sources.set(tokenCssPath, await readFile(tokenCssPath, 'utf8'));
for (const file of sourceFiles) sources.set(file, await readFile(file, 'utf8'));

const definitions = new Set();
for (const source of sources.values()) {
  for (const match of source.matchAll(/(--cometal-[a-z0-9-]+)\s*:/g)) definitions.add(match[1]);
}

const missing = new Map();
for (const [file, source] of sources) {
  if (file === tokenCssPath) continue;
  for (const match of source.matchAll(/var\(\s*(--cometal-[a-z0-9-]+)/g)) {
    if (definitions.has(match[1])) continue;
    const line = source.slice(0, match.index).split('\n').length;
    const locations = missing.get(match[1]) ?? [];
    locations.push(`${path.relative(root, file)}:${line}`);
    missing.set(match[1], locations);
  }
}

if (missing.size > 0) {
  const findings = [...missing]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([variable, locations]) => [variable, ...[...new Set(locations)].map((location) => `  ${location}`)]);
  console.error(['CSS variable validation failed:', ...findings].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`CSS variable validation passed for ${sourceFiles.length} source file(s).`);
}
