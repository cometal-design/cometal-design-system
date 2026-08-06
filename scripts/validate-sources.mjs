import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const registryPath = path.join(root, 'registry/components.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const sourcesPath = path.join(root, 'registry/sources.json');
const sourceRegistry = JSON.parse(await readFile(sourcesPath, 'utf8'));
const ids = new Set();
const requiredLinks = ['figma', 'specification', 'source', 'storybook', 'knowledge'];
const requiredReadyChecks = [
  'visualMatch',
  'specificationMatch',
  'testsPassed',
  'accessibilityPassed',
  'knowledgeUpdated',
];
const errors = [];
const expectedSources = new Set([
  'figma',
  'git-specification-registry',
  'git-implementation',
  'storybook',
  'obsidian',
]);

function toStoryIdPart(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

async function collectFiles(directory, predicate, result = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectFiles(absolute, predicate, result);
    else if (predicate(entry.name)) result.push(absolute);
  }
  return result;
}

const storyFiles = await collectFiles(
  path.join(root, 'apps/storybook/stories'),
  (name) => name.endsWith('.stories.tsx'),
);
const storyIds = new Set();

for (const storyFile of storyFiles) {
  const source = await readFile(storyFile, 'utf8');
  const title = source.match(/\btitle\s*:\s*['"]([^'"]+)['"]/)?.[1];
  if (!title) {
    errors.push(`storybook: missing static title in ${path.relative(root, storyFile)}`);
    continue;
  }
  for (const match of source.matchAll(/export\s+const\s+([A-Za-z0-9_]+)/g)) {
    storyIds.add(`${toStoryIdPart(title)}--${toStoryIdPart(match[1])}`);
  }
}

function validateStoryLink(value, owner) {
  const storyId = value.match(/[?&]path=\/story\/([a-z0-9-]+)/)?.[1];
  if (!storyId) {
    errors.push(`${owner}: Storybook link does not contain an exact story ID: ${value}`);
  } else if (!storyIds.has(storyId)) {
    errors.push(`${owner}: Storybook story does not exist: ${storyId}`);
  }
}

if (sourceRegistry.sources.length !== expectedSources.size) {
  errors.push(`sources: expected ${expectedSources.size} logical sources, found ${sourceRegistry.sources.length}`);
}

for (const source of sourceRegistry.sources) {
  if (!expectedSources.delete(source.id)) errors.push(`sources: unexpected or duplicate source ${source.id}`);
  if (!source.ownerRole || !source.location || source.owns?.length === 0) {
    errors.push(`sources: incomplete ownership record for ${source.id}`);
  }
}

for (const missingSource of expectedSources) errors.push(`sources: missing ${missingSource}`);

for (const component of registry.components) {
  if (ids.has(component.id)) errors.push(`${component.id}: duplicate component ID`);
  ids.add(component.id);

  for (const key of requiredLinks) {
    const value = component.links?.[key];
    if (!value) {
      errors.push(`${component.id}: missing links.${key}`);
      continue;
    }

    if (!/^https?:\/\//.test(value)) {
      try {
        await access(path.resolve(root, value));
      } catch {
        errors.push(`${component.id}: local links.${key} does not exist: ${value}`);
      }
    }

    if (key === 'storybook') validateStoryLink(value, component.id);
  }

  if (component.status === 'ready') {
    for (const check of requiredReadyChecks) {
      if (component.checks?.[check] !== true) {
        errors.push(`${component.id}: ready component has not passed ${check}`);
      }
    }
  }
}

const portalFiles = await collectFiles(
  path.join(root, 'apps/docs'),
  (name) => name.endsWith('.tsx') || name.endsWith('.ts'),
);

for (const portalFile of portalFiles) {
  const source = await readFile(portalFile, 'utf8');
  for (const match of source.matchAll(/\/storybook\/\?path=\/story\/([a-z0-9-]+)(?=['"])/g)) {
    const storyId = match[1];
    if (!storyIds.has(storyId)) {
      errors.push(`${path.relative(root, portalFile)}: portal links to missing Storybook story ${storyId}`);
    }
  }
}

if (errors.length > 0) {
  console.error(['Source validation failed:', ...errors.map((error) => `- ${error}`)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Source validation passed for 5 logical sources, ${registry.components.length} component(s) and ${storyIds.size} exact Storybook route(s).`);
}
