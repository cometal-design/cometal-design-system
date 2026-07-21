import { access, readFile } from 'node:fs/promises';
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
  }

  if (component.status === 'ready') {
    for (const check of requiredReadyChecks) {
      if (component.checks?.[check] !== true) {
        errors.push(`${component.id}: ready component has not passed ${check}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(['Source validation failed:', ...errors.map((error) => `- ${error}`)].join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Source validation passed for 5 logical sources and ${registry.components.length} component(s).`);
}
