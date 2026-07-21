import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const registryPath = path.join(root, 'registry/components.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
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
  console.log(`Source validation passed for ${registry.components.length} component(s).`);
}
