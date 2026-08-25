import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSvgRootPresentation } from './svg-root-presentation.mjs';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const repositoryRoot = path.resolve(packageRoot, '../..');
const sourceRoot = path.join(packageRoot, 'icons/source');
const sourceManifestPath = path.join(sourceRoot, 'manifest.source.json');
const generatedRoot = path.join(packageRoot, 'src/icons/generated');
const tokenProjectionPath = path.join(repositoryRoot, 'packages/tokens/src/icons.inventory.json');
const acceptedFingerprint = '87caaa283983e042491e2b0beb6bb8cc54a8aeaad75b1b9599e66d06c2199a58';
const acceptedPaintContractFingerprint = 'e79df22d862fcc5e6e7f1b6659e93a80986aab4c429b7c7b79285b0b9e4eef78';
const approvedPaintBindings = Object.freeze({
  outline: Object.freeze({
    key: '33b752bc5c0bd5a01503962cf5d1295698f2cebf',
    fields: new Set(['strokes', 'stroke.color']),
  }),
  filled: Object.freeze({
    key: 'a6cc9f03c2228eae9bbd49c22a83f9a459a02a42',
    fields: new Set(['fills', 'fill.color', 'strokes', 'stroke.color']),
  }),
});
const expectedCounts = Object.freeze({ outline: 875, filled: 877, 'feature-icons-and-logos': 1058 });
const manifestFiles = Object.freeze([
  ['OUTLINE_MANIFEST.json', 'outline'],
  ['FILLED_MANIFEST.json', 'filled'],
  ['FEATURE_ICONS_LOGOS_MANIFEST.json', 'feature-icons-and-logos'],
]);
const allowedSvgTags = new Set([
  'circle', 'clipPath', 'defs', 'ellipse', 'feBlend', 'feColorMatrix', 'feFlood',
  'feGaussianBlur', 'feOffset', 'filter', 'g', 'linearGradient', 'mask', 'path',
  'radialGradient', 'rect', 'stop', 'svg',
]);

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const toPosix = (value) => value.split(path.sep).join('/');
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;

function fail(message) {
  throw new Error(`[icons] ${message}`);
}

function slugSegment(segment) {
  const slug = segment
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .toLocaleLowerCase('en-US')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9.-]+/g, (value) => [...value].map((character) => encodeURIComponent(character)).join(''))
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  if (!slug || slug === '.' || slug === '..') fail(`cannot derive a safe path segment from ${JSON.stringify(segment)}`);
  return slug;
}

function sourceProjection(record) {
  return [record.canonicalName, record.nodeId, record.componentKey, record.acceptedSafePath, record.sourceSha256];
}

function paintContractProjection(record) {
  return [record.canonicalName, record.sourceSha256, record.variableBindings];
}

function deriveRecord(record, library, sourceOrder) {
  const canonicalSegments = record.canonicalName.split('/');
  const relativeSegments = library === 'outline' || library === 'filled'
    ? canonicalSegments.slice(1)
    : canonicalSegments;
  if (relativeSegments.length < 2) fail(`canonical name has no category path: ${record.canonicalName}`);
  const generatedSegments = relativeSegments.map(slugSegment);
  const generatedRelativePath = generatedSegments.join('/');
  const categoryPath = canonicalSegments.slice(library === 'feature-icons-and-logos' ? 0 : 1, -1);
  const viewBox = String(record.geometry?.viewBox ?? '').trim().split(/\s+/).map(Number);
  if (viewBox.length !== 4 || viewBox.some((value) => !Number.isFinite(value))) {
    fail(`invalid manifest viewBox for ${record.canonicalName}`);
  }
  return {
    canonicalName: record.canonicalName,
    library,
    family: categoryPath[0],
    categoryPath,
    nodeId: record.nodeId,
    componentKey: record.componentKey,
    acceptedSafePath: record.safePath,
    sourcePath: `icons/source/svg/${library}/${generatedRelativePath}.svg`,
    importPath: `@cometal/react/icons/${library}/${generatedRelativePath}`,
    generatedRelativePath,
    generatedIdentifier: `Cometal_${[library, ...generatedSegments].join('_').replace(/[^A-Za-z0-9_]/g, '_')}_Icon`,
    sourceSha256: record.svgSha256,
    sourceBytes: record.svgBytes,
    variableBindings: record.variableBindings ?? [],
    viewBox,
    intrinsicWidth: Number(record.geometry?.exportedWidth ?? record.geometry?.width),
    intrinsicHeight: Number(record.geometry?.exportedHeight ?? record.geometry?.height),
    sourceOrder,
  };
}

function assertUnique(records, field, normalize = (value) => value) {
  const seen = new Map();
  for (const record of records) {
    const key = normalize(record[field]);
    const previous = seen.get(key);
    if (previous) fail(`${field} collision: ${previous.canonicalName} and ${record.canonicalName}`);
    seen.set(key, record);
  }
}

function validateRecordIdentity(records) {
  if (records.length !== 2810) fail(`expected 2810 records, received ${records.length}`);
  for (const [library, expected] of Object.entries(expectedCounts)) {
    const actual = records.filter((record) => record.library === library).length;
    if (actual !== expected) fail(`${library} count ${actual}; expected ${expected}`);
  }
  for (const field of ['canonicalName', 'nodeId', 'componentKey', 'sourcePath', 'importPath', 'generatedIdentifier']) {
    assertUnique(records, field, (value) => String(value).toLocaleLowerCase('en-US'));
  }
  assertUnique(records, 'canonicalName', (value) => value.normalize('NFKC').toLocaleLowerCase('en-US').replace(/[\s_-]+/g, '-'));
}

function validateSvgEnvelope(svg, record) {
  if (!svg.startsWith('<svg') || !svg.trimEnd().endsWith('</svg>')) fail(`invalid SVG envelope: ${record.canonicalName}`);
  if (/<!DOCTYPE|<!ENTITY|<\?xml/i.test(svg)) fail(`unsupported XML construct: ${record.canonicalName}`);
  if (/<script\b|<foreignObject\b/i.test(svg)) fail(`unsafe element: ${record.canonicalName}`);
  if (/\son[a-z][\w:-]*\s*=/i.test(svg)) fail(`event handler attribute: ${record.canonicalName}`);
  if (/(?:href|xlink:href)\s*=\s*["'](?!#)/i.test(svg)) fail(`external href: ${record.canonicalName}`);
  if (/url\(\s*["']?(?!#)/i.test(svg)) fail(`external CSS resource: ${record.canonicalName}`);
  for (const match of svg.matchAll(/<\/?([A-Za-z][\w:-]*)\b/g)) {
    if (!allowedSvgTags.has(match[1])) fail(`unsupported <${match[1]}> element: ${record.canonicalName}`);
  }
  const root = svg.match(/^<svg\b([^>]*)>/);
  if (!root) fail(`missing root SVG: ${record.canonicalName}`);
  const actualViewBox = root[1].match(/\bviewBox=["']([^"']+)["']/)?.[1]?.trim().split(/\s+/).map(Number);
  if (!actualViewBox || actualViewBox.length !== 4 || actualViewBox.some((value, index) => Math.abs(value - record.viewBox[index]) > 1e-4)) {
    fail(`source viewBox mismatch: ${record.canonicalName}`);
  }
}

function compileSvg(svg, record) {
  validateSvgEnvelope(svg, record);
  const rootPresentation = record.library === 'outline' ? parseSvgRootPresentation(svg, record) : undefined;
  const root = svg.match(/^<svg\b[^>]*>([\s\S]*)<\/svg>\s*$/);
  if (!root) fail(`cannot extract SVG body: ${record.canonicalName}`);
  let body = root[1].trim();
  const allIds = [...body.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const idSet = new Set(allIds);
  if (idSet.size !== allIds.length) fail(`duplicate source id: ${record.canonicalName}`);
  const references = new Set();
  for (const match of body.matchAll(/url\(\s*#([^)'"\s]+)\s*\)/g)) references.add(match[1]);
  for (const match of body.matchAll(/(?:href|xlink:href)=["']#([^"']+)["']/g)) references.add(match[1]);
  for (const reference of references) {
    if (!idSet.has(reference)) fail(`unresolved SVG reference #${reference}: ${record.canonicalName}`);
  }
  let removedIds = 0;
  body = body.replace(/\s+id=(["'])([^"']+)\1/g, (attribute, _quote, id) => {
    if (!references.has(id)) {
      removedIds += 1;
      return '';
    }
    return ` id="__COMETAL_ID__${id.replace(/[^A-Za-z0-9_-]/g, '-')}"`;
  });
  for (const reference of references) {
    const safeReference = reference.replace(/[^A-Za-z0-9_-]/g, '-');
    body = body.replaceAll(`url(#${reference})`, `url(#__COMETAL_ID__${safeReference})`);
    body = body.replaceAll(`href="#${reference}"`, `href="#__COMETAL_ID__${safeReference}"`);
    body = body.replaceAll(`href='#${reference}'`, `href="#__COMETAL_ID__${safeReference}"`);
    body = body.replaceAll(`xlink:href="#${reference}"`, `xlink:href="#__COMETAL_ID__${safeReference}"`);
    body = body.replaceAll(`xlink:href='#${reference}'`, `xlink:href="#__COMETAL_ID__${safeReference}"`);
  }
  const approvedBinding = approvedPaintBindings[record.library];
  const paintBinding = approvedBinding
    ? record.variableBindings.find((binding) => approvedBinding.fields.has(binding.field) && binding.variable?.key === approvedBinding.key)
    : undefined;
  const paintValues = [...body.matchAll(/\b(?:fill|stroke)=["'](#[0-9A-Fa-f]{3,8})["']/g)].map((match) => match[1].toUpperCase());
  const sourcePaintMatchesBinding = paintValues.length > 0 && paintValues.every((value) => value === '#292929');
  if (paintBinding && !sourcePaintMatchesBinding) {
    fail(`accepted paint binding no longer matches source paint: ${record.canonicalName}`);
  }
  const canUseCurrentColor = record.library !== 'feature-icons-and-logos'
    && Boolean(paintBinding)
    && paintValues.length > 0
    && sourcePaintMatchesBinding;
  let paintReplacements = 0;
  if (canUseCurrentColor) {
    body = body.replace(/\b(fill|stroke)=(["'])#292929\2/gi, (_match, attribute) => {
      paintReplacements += 1;
      return `${attribute}="currentColor"`;
    });
  }
  const explicitStrokeWidths = [];
  let scalableStrokeElements = 0;
  let preservedStrokeElements = 0;
  body = body.replace(/<([A-Za-z][\w:-]*)([^<>]*?)>/g, (element, _tag, attributes) => {
    const width = attributes.match(/\bstroke-width=["']([^"']+)["']/)?.[1];
    if (!width) return element;
    explicitStrokeWidths.push(width);
    const numericWidth = Number(width);
    const isStandardWidth = Number.isFinite(numericWidth) && Math.abs(numericWidth - 1.4) < 1e-9;
    if (canUseCurrentColor && record.library === 'outline' && isStandardWidth) {
      scalableStrokeElements += 1;
      return element.replace(/\s*\/?\>$/, (ending) => ` data-cometal-stroke-scale=""${ending}`);
    }
    preservedStrokeElements += 1;
    return element;
  });
  if (body.includes('__COMETAL_ID__') !== (references.size > 0)) fail(`ID compilation mismatch: ${record.canonicalName}`);
  const sourceStrokeWidths = Object.entries(Object.fromEntries(explicitStrokeWidths.map((width) => [width, 0])))
    .map(([width]) => ({ width, count: explicitStrokeWidths.filter((value) => value === width).length }))
    .sort((left, right) => Number(left.width) - Number(right.width) || left.width.localeCompare(right.width));
  return {
    body,
    hasReferencedIds: references.size > 0,
    rootPresentation,
    paintMode: canUseCurrentColor ? 'currentColor' : 'intrinsic',
    paintBindingKey: paintBinding?.variable.key,
    strokeAudit: {
      explicitElementCount: explicitStrokeWidths.length,
      standardElementCount: explicitStrokeWidths.filter((width) => Math.abs(Number(width) - 1.4) < 1e-9).length,
      nonstandardElementCount: explicitStrokeWidths.filter((width) => !Number.isFinite(Number(width)) || Math.abs(Number(width) - 1.4) >= 1e-9).length,
      scalableElementCount: scalableStrokeElements,
      preservedElementCount: preservedStrokeElements,
      sourceStrokeWidths,
    },
    transformations: {
      removedUnreferencedIds: removedIds,
      prefixedReferencedIds: references.size,
      currentColorReplacements: paintReplacements,
    },
  };
}

async function intake(handoffRoot) {
  const validation = JSON.parse(await readFile(path.join(handoffRoot, 'ALL_ICONS_VALIDATION.json'), 'utf8'));
  if (validation.status !== 'ALL_ICON_SOURCES_HANDOFF_READY' || validation.total !== 2810) fail('accepted validation is not ready');
  if (validation.manifestFingerprintSha256 !== acceptedFingerprint) fail('accepted validation fingerprint mismatch');
  const records = [];
  let sourceOrder = 0;
  for (const [manifestName, library] of manifestFiles) {
    const manifest = JSON.parse(await readFile(path.join(handoffRoot, manifestName), 'utf8'));
    for (const record of manifest.records) records.push(deriveRecord(record, library, sourceOrder++));
  }
  validateRecordIdentity(records);
  const projectionFingerprint = sha256(JSON.stringify(records.map(sourceProjection)));
  if (projectionFingerprint !== acceptedFingerprint) fail(`computed accepted fingerprint ${projectionFingerprint}`);
  const paintContractFingerprint = sha256(JSON.stringify(records.map(paintContractProjection)));
  if (paintContractFingerprint !== acceptedPaintContractFingerprint) fail(`computed accepted paint contract fingerprint ${paintContractFingerprint}`);
  await rm(sourceRoot, { recursive: true, force: true });
  await mkdir(path.join(sourceRoot, 'svg'), { recursive: true });
  for (const record of records) {
    const acceptedPath = path.join(handoffRoot, record.acceptedSafePath);
    const source = await readFile(acceptedPath);
    if (sha256(source) !== record.sourceSha256) fail(`handoff hash mismatch: ${record.canonicalName}`);
    const targetPath = path.join(packageRoot, record.sourcePath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await copyFile(acceptedPath, targetPath);
  }
  const sourceManifest = {
    schemaVersion: '1.0.0',
    generatorVersion: '1.0.0',
    sourceMode: 'delivery_candidate',
    figma: {
      fileKey: 'KKNGucImxFAtQLBhPy8tLs',
      pageId: '381:25439',
      artboards: { outline: '691:9685', filled: '691:12877', 'feature-icons-and-logos': '691:15704' },
    },
    acceptedFingerprintSha256: acceptedFingerprint,
    paintContract: {
      schemaVersion: '1.0.0',
      algorithm: 'accepted-figma-variable-bindings-v1',
      sha256: acceptedPaintContractFingerprint,
    },
    counts: { total: 2810, libraries: expectedCounts },
    acceptedSameSourceExceptions: [
      Object.freeze({ library: 'feature-icons-and-logos', canonicalNames: ['flag-rectangle/PM', 'flag-rectangle/RE'] }),
    ],
    records,
  };
  await writeFile(sourceManifestPath, json(sourceManifest));
}

function publicRecord(record, compiled) {
  return {
    canonicalName: record.canonicalName,
    library: record.library,
    family: record.family,
    categoryPath: record.categoryPath,
    nodeId: record.nodeId,
    componentKey: record.componentKey,
    sourcePath: record.sourcePath,
    importPath: record.importPath,
    sourceSha256: record.sourceSha256,
    viewBox: record.viewBox,
    intrinsicWidth: record.intrinsicWidth,
    intrinsicHeight: record.intrinsicHeight,
    paintMode: compiled.paintMode,
    strokeScaling: compiled.strokeAudit.scalableElementCount > 0 ? 'marked-elements' : 'preserve-source',
    scalableStrokeElementCount: compiled.strokeAudit.scalableElementCount,
  };
}

function relativeModule(fromFile, targetFile) {
  const relative = toPosix(path.relative(path.dirname(fromFile), targetFile)).replace(/\.(?:ts|tsx)$/, '');
  return relative.startsWith('.') ? relative : `./${relative}`;
}

function definitionSource(record, definitionFile, compiled) {
  const metadata = publicRecord(record, compiled);
  const typesFile = path.join(packageRoot, 'src/icons/runtime/types.ts');
  const definition = { ...metadata, body: compiled.body, hasReferencedIds: compiled.hasReferencedIds };
  if (compiled.rootPresentation) definition.rootPresentation = compiled.rootPresentation;
  return `import type { CompiledIconDefinition } from '${relativeModule(definitionFile, typesFile)}';\n\nconst definition = Object.freeze(${JSON.stringify(definition)} as const) satisfies CompiledIconDefinition;\n\nexport default definition;\n`;
}

function componentSource(record, componentFile, definitionFile, compiled) {
  const runtimeFile = path.join(packageRoot, 'src/icons/runtime/Icon.tsx');
  const typesFile = path.join(packageRoot, 'src/icons/runtime/types.ts');
  const reactImports = compiled.hasReferencedIds ? 'forwardRef, useId' : 'forwardRef';
  const directive = compiled.hasReferencedIds ? `'use client';\n\n` : '';
  const prefix = compiled.hasReferencedIds
    ? `  const reactId = useId();\n  const idPrefix = \`cometal-\${reactId.replace(/[^A-Za-z0-9_-]/g, '')}-\`;\n`
    : '';
  const idProp = compiled.hasReferencedIds ? ' idPrefix={idPrefix}' : '';
  return `${directive}import { ${reactImports} } from 'react';\nimport { Icon } from '${relativeModule(componentFile, runtimeFile)}';\nimport type { IconProps } from '${relativeModule(componentFile, typesFile)}';\nimport definition from '${relativeModule(componentFile, definitionFile)}';\n\nconst ${record.generatedIdentifier} = forwardRef<SVGSVGElement, IconProps>(function ${record.generatedIdentifier}(props, ref) {\n${prefix}  return <Icon definition={definition}${idProp} ref={ref} {...props} />;\n});\n\nexport { definition };\nexport default ${record.generatedIdentifier};\n`;
}

async function expectedGeneratedFiles(sourceManifest) {
  const output = new Map();
  const report = [];
  const publicRecords = [];
  const loaderLines = [];
  const sortedRecords = [...sourceManifest.records].sort((a, b) => a.canonicalName.localeCompare(b.canonicalName, 'en-US'));
  for (const record of sortedRecords) {
    const source = await readFile(path.join(packageRoot, record.sourcePath), 'utf8');
    if (sha256(source) !== record.sourceSha256) fail(`tracked source hash mismatch: ${record.canonicalName}`);
    const compiled = compileSvg(source, record);
    const relative = `${record.library}/${record.generatedRelativePath}`;
    const definitionFile = path.join(generatedRoot, 'definitions', `${relative}.ts`);
    const componentFile = path.join(generatedRoot, 'components', `${relative}.tsx`);
    output.set(definitionFile, definitionSource(record, definitionFile, compiled));
    output.set(componentFile, componentSource(record, componentFile, definitionFile, compiled));
    publicRecords.push(publicRecord(record, compiled));
    report.push({
      canonicalName: record.canonicalName,
      library: record.library,
      sourceSha256: record.sourceSha256,
      paintMode: compiled.paintMode,
      paintBindingKey: compiled.paintBindingKey,
      rootPresentation: compiled.rootPresentation,
      strokeAudit: compiled.strokeAudit,
      ...compiled.transformations,
    });
    loaderLines.push(`  ${JSON.stringify(record.canonicalName)}: () => import(${JSON.stringify(`./components/${relative}`)}),`);
  }
  const metadata = {
    schemaVersion: '1.0.0',
    generatorVersion: sourceManifest.generatorVersion,
    sourceFingerprintSha256: sourceManifest.acceptedFingerprintSha256,
    paintContractFingerprintSha256: sourceManifest.paintContract.sha256,
    total: sourceManifest.counts.total,
    libraries: sourceManifest.counts.libraries,
    families: Object.fromEntries([...new Set(publicRecords.map((record) => record.family))].sort().map((family) => [family, publicRecords.filter((record) => record.family === family).length])),
  };
  output.set(path.join(generatedRoot, 'manifest.ts'), `import type { IconManifestMetadata, IconManifestRecord } from '../runtime/types';\n\nexport const iconManifestMetadata: IconManifestMetadata = Object.freeze(${JSON.stringify(metadata)} as const);\n\nexport const iconManifest: readonly IconManifestRecord[] = Object.freeze(${JSON.stringify(publicRecords)} as const);\n`);
  output.set(path.join(generatedRoot, 'loaders.ts'), `import type { IconModule } from '../runtime/types';\n\nexport const iconLoaders: Readonly<Record<string, () => Promise<IconModule>>> = Object.freeze({\n${loaderLines.join('\n')}\n});\n`);
  output.set(path.join(generatedRoot, 'generation-report.json'), json({
    schemaVersion: '1.0.0',
    sourceFingerprintSha256: sourceManifest.acceptedFingerprintSha256,
    total: report.length,
    transformed: {
      currentColorRecords: report.filter((item) => item.paintMode === 'currentColor').length,
      intrinsicRecords: report.filter((item) => item.paintMode === 'intrinsic').length,
      referencedIdRecords: report.filter((item) => item.prefixedReferencedIds > 0).length,
      rootPresentationRecords: report.filter((item) => item.rootPresentation).length,
      removedUnreferencedIds: report.reduce((sum, item) => sum + item.removedUnreferencedIds, 0),
      strokeAudit: {
        explicitElementCount: report.reduce((sum, item) => sum + item.strokeAudit.explicitElementCount, 0),
        standardElementCount: report.reduce((sum, item) => sum + item.strokeAudit.standardElementCount, 0),
        nonstandardElementCount: report.reduce((sum, item) => sum + item.strokeAudit.nonstandardElementCount, 0),
        scalableElementCount: report.reduce((sum, item) => sum + item.strokeAudit.scalableElementCount, 0),
        preservedElementCount: report.reduce((sum, item) => sum + item.strokeAudit.preservedElementCount, 0),
      },
    },
    records: report,
  }));
  return { output, publicRecords, metadata };
}

async function listFiles(root) {
  try {
    const entries = await readdir(root, { withFileTypes: true });
    const result = [];
    for (const entry of entries) {
      const target = path.join(root, entry.name);
      if (entry.isDirectory()) result.push(...await listFiles(target));
      else result.push(target);
    }
    return result;
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeGenerated(output) {
  await rm(generatedRoot, { recursive: true, force: true });
  for (const [file, content] of output) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content);
  }
}

async function checkGenerated(output, actualRoot = generatedRoot) {
  const actualFiles = (await listFiles(actualRoot)).sort();
  const expectedFiles = [...output.keys()].map((file) => path.join(actualRoot, path.relative(generatedRoot, file))).sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) fail('generated file set is stale');
  for (const [file, content] of output) {
    const actualFile = path.join(actualRoot, path.relative(generatedRoot, file));
    if (await readFile(actualFile, 'utf8') !== content) fail(`generated file is stale: ${path.relative(actualRoot, actualFile)}`);
  }
}

function tokenProjection(metadata) {
  const libraries = [
    { name: 'Outline', id: 'outline', frameId: '691:9685', components: expectedCounts.outline },
    { name: 'Filled', id: 'filled', frameId: '691:12877', components: expectedCounts.filled },
    { name: 'Feature Icons and Logos', id: 'feature-icons-and-logos', frameId: '691:15704', components: expectedCounts['feature-icons-and-logos'] },
  ];
  return json({
    $description: 'Generated compatibility projection of the canonical @cometal/react icon manifest.',
    $extensions: { 'com.cometal.figma': { fileKey: 'KKNGucImxFAtQLBhPy8tLs', pageId: '381:25439' } },
    schemaVersion: metadata.schemaVersion,
    sourceFingerprintSha256: metadata.sourceFingerprintSha256,
    totalComponents: metadata.total,
    libraries,
    codeStatus: 'implementation-candidate',
    codeStatusReason: 'Generated React entries and the shared catalog exist locally; code review, independent QA, and release remain pending.',
  });
}

async function main() {
  const args = process.argv.slice(2);
  const handoffIndex = args.indexOf('--handoff');
  const generatedFixtureIndex = args.indexOf('--generated-fixture-root');
  const tokenFixtureIndex = args.indexOf('--token-projection-fixture');
  const check = args.includes('--check');
  const environmentGeneratedFixture = process.env.COMETAL_ICONS_CHECK_GENERATED_ROOT;
  const environmentTokenFixture = process.env.COMETAL_ICONS_CHECK_TOKEN_PROJECTION;
  if ((generatedFixtureIndex >= 0 || tokenFixtureIndex >= 0 || environmentGeneratedFixture || environmentTokenFixture) && !check) {
    fail('fixture paths are available only with --check');
  }
  if (handoffIndex >= 0) {
    if (check) fail('--handoff and --check cannot be combined');
    const handoffRoot = args[handoffIndex + 1];
    if (!handoffRoot) fail('--handoff requires an absolute accepted handoff path');
    const handoffStats = await stat(handoffRoot);
    if (!handoffStats.isDirectory()) fail('handoff path is not a directory');
    await intake(path.resolve(handoffRoot));
  }
  const sourceManifest = JSON.parse(await readFile(sourceManifestPath, 'utf8'));
  validateRecordIdentity(sourceManifest.records);
  if (sourceManifest.acceptedFingerprintSha256 !== acceptedFingerprint) fail('tracked source fingerprint mismatch');
  const computedFingerprint = sha256(JSON.stringify([...sourceManifest.records].sort((a, b) => a.sourceOrder - b.sourceOrder).map(sourceProjection)));
  if (computedFingerprint !== acceptedFingerprint) fail(`tracked manifest projection fingerprint ${computedFingerprint}`);
  if (sourceManifest.paintContract?.sha256 !== acceptedPaintContractFingerprint) fail('tracked paint contract declaration mismatch');
  const computedPaintContractFingerprint = sha256(JSON.stringify([...sourceManifest.records].sort((a, b) => a.sourceOrder - b.sourceOrder).map(paintContractProjection)));
  if (computedPaintContractFingerprint !== acceptedPaintContractFingerprint) fail(`tracked paint contract fingerprint ${computedPaintContractFingerprint}`);
  const { output, metadata } = await expectedGeneratedFiles(sourceManifest);
  const projection = tokenProjection(metadata);
  if (check) {
    const actualGeneratedRoot = generatedFixtureIndex >= 0
      ? path.resolve(args[generatedFixtureIndex + 1] ?? '')
      : environmentGeneratedFixture ? path.resolve(environmentGeneratedFixture) : generatedRoot;
    const actualTokenProjectionPath = tokenFixtureIndex >= 0
      ? path.resolve(args[tokenFixtureIndex + 1] ?? '')
      : environmentTokenFixture ? path.resolve(environmentTokenFixture) : tokenProjectionPath;
    if ((generatedFixtureIndex >= 0 && !args[generatedFixtureIndex + 1]) || (tokenFixtureIndex >= 0 && !args[tokenFixtureIndex + 1])) fail('fixture path argument is missing');
    await checkGenerated(output, actualGeneratedRoot);
    if (await readFile(actualTokenProjectionPath, 'utf8') !== projection) fail('tokens compatibility projection is stale');
    console.log(`[icons] generated output is fresh: ${metadata.total} records, ${metadata.sourceFingerprintSha256}`);
    return;
  }
  await writeGenerated(output);
  await writeFile(tokenProjectionPath, projection);
  console.log(`[icons] generated ${metadata.total} records from ${metadata.sourceFingerprintSha256}`);
}

await main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
