import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const registryPath = path.join(root, 'registry/components.json');
const registry = JSON.parse(await readFile(registryPath, 'utf8'));
const familyRegistryPath = path.join(root, 'registry/component-families.json');
const familyRegistry = JSON.parse(await readFile(familyRegistryPath, 'utf8'));
const usageRegistry = JSON.parse(await readFile(path.join(root, 'registry/component-usage.json'), 'utf8'));
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

function readFrontmatter(source, owner) {
  const block = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)?.[1];
  if (!block) {
    errors.push(`${owner}: missing YAML frontmatter`);
    return {};
  }
  return Object.fromEntries(block.split('\n').flatMap((line) => {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!match) return [];
    return [[match[1], match[2].replace(/^['"]|['"]$/g, '')]];
  }));
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

  const specSource = await readFile(path.resolve(root, component.links.specification), 'utf8');
  const frontmatter = readFrontmatter(specSource, component.links.specification);
  for (const [key, expected] of Object.entries({
    id: component.id,
    name: component.name,
    status: component.status,
    platform: component.platform,
    framework: 'react',
    figma: component.links.figma,
    storybook: component.links.storybook,
  })) {
    if (frontmatter[key] !== expected) {
      errors.push(`${component.id}: specification ${key} is ${frontmatter[key] ?? 'missing'}, expected ${expected}`);
    }
  }

  const knowledgeSource = await readFile(path.resolve(root, component.links.knowledge), 'utf8');
  if (!knowledgeSource.includes(component.id)) {
    errors.push(`${component.id}: knowledge passport does not contain its stable ID`);
  }
}

const familyIds = new Set();
const aliasIds = new Set();
const familyMemberCounts = new Map(registry.components.map((component) => [component.id, 0]));

for (const family of familyRegistry.families) {
  if (familyIds.has(family.id)) errors.push(`families: duplicate family ID ${family.id}`);
  familyIds.add(family.id);
  if (!family.members.includes(family.preview)) errors.push(`${family.id}: preview ${family.preview} is not a family member`);
  try {
    await access(path.join(root, 'apps/docs/app', family.route, 'page.tsx'));
  } catch {
    errors.push(`${family.id}: portal route does not exist: ${family.route}`);
  }
  for (const member of family.members) {
    if (!ids.has(member)) errors.push(`${family.id}: unknown registry member ${member}`);
    else familyMemberCounts.set(member, (familyMemberCounts.get(member) ?? 0) + 1);
  }
  for (const alias of family.aliases) {
    if (ids.has(alias.id)) errors.push(`${family.id}: alias collides with stable component ID ${alias.id}`);
    if (aliasIds.has(alias.id)) errors.push(`${family.id}: duplicate alias ${alias.id}`);
    aliasIds.add(alias.id);
    if (!family.members.includes(alias.member)) errors.push(`${family.id}: alias ${alias.id} points outside its family`);
    if (alias.kind === 'family' && !family.figma) errors.push(`${family.id}: family alias requires an exact family Figma source`);
  }
  if (family.figma && !/^https:\/\/www\.figma\.com\/design\/KKNGucImxFAtQLBhPy8tLs\?node-id=\d+-\d+$/.test(family.figma)) {
    errors.push(`${family.id}: invalid exact family Figma source ${family.figma}`);
  }
}

for (const [id, count] of familyMemberCounts) {
  if (count !== 1) errors.push(`${id}: expected exactly one portal family, found ${count}`);
}

for (const usageId of Object.keys(usageRegistry)) {
  if (!ids.has(usageId) && !aliasIds.has(usageId)) errors.push(`usage: unknown stable ID or documented alias ${usageId}`);
}

const usageSource = JSON.stringify(usageRegistry);
if (/<button(?:\s|>)/.test(usageSource)) errors.push('usage: copyable examples must use the canonical Button atom, not raw <button>');

const catalogSource = await readFile(path.join(root, 'apps/docs/app/components/page.tsx'), 'utf8');
const navigationSource = await readFile(path.join(root, 'apps/docs/lib/navigation.ts'), 'utf8');
const previewSource = await readFile(path.join(root, 'apps/docs/components/component-catalog-preview.tsx'), 'utf8');
if (!catalogSource.includes('componentCatalog')) errors.push('portal catalog must derive from the validated family registry');
if (!navigationSource.includes('component-families.json')) errors.push('component navigation must derive from the validated family registry');
if (!previewSource.includes('throw new Error(`Component family preview is not implemented')) errors.push('component previews must fail closed for unknown family IDs');
for (const preview of new Set(familyRegistry.families.map((family) => family.preview))) {
  if (!previewSource.includes(`id === '${preview}'`)) errors.push(`preview: missing explicit renderer for ${preview}`);
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
  console.log(`Source validation passed for 5 logical sources, ${registry.components.length} component(s), ${familyRegistry.families.length} portal families and ${storyIds.size} exact Storybook route(s).`);
}
