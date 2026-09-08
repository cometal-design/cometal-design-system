import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const snapshotDir = path.join(repoRoot, 'docs/sync/2026-08-20');
const tokenSrcDir = path.join(repoRoot, 'packages/tokens/src');

const variableSnapshot = JSON.parse(
  await readFile(path.join(snapshotDir, 'figma-variables-current.json'), 'utf8'),
);
const styleSnapshot = JSON.parse(
  await readFile(path.join(snapshotDir, 'figma-styles-current.json'), 'utf8'),
);

const recordSchema = variableSnapshot.recordSchema;
const variableRecords = variableSnapshot.variables.map((record) =>
  Object.fromEntries(recordSchema.map((key, index) => [key, record[index]])),
);
const recordById = new Map(variableRecords.map((record) => [record.id, record]));

const primitiveRoot = {
  Primitive: {
    $description:
      'Primitive tokens synchronized from Figma DS Core snapshot 2026-08-20.',
  },
};
const semanticRoot = {
  Semantic: {
    $description:
      'Global semantic tokens synchronized from Figma DS Core snapshot 2026-08-20.',
  },
};
const componentRoot = {
  Component: {
    $description:
      'Component semantic tokens synchronized from Figma DS Core snapshot 2026-08-20.',
  },
};
const effectsRoot = {
  Effects: {
    $description:
      'Effect styles synchronized from Figma DS Core snapshot 2026-08-20.',
  },
};

const roots = {
  primitive: primitiveRoot,
  semantic: semanticRoot,
  component: componentRoot,
  effects: effectsRoot,
};

const collectionToFamily = new Map([
  ['Boolean · Primitive', 'Boolean'],
  ['Boolean · Semantic', 'Boolean'],
  ['Color · Primitive', 'Color'],
  ['Color · Semantic', 'Color'],
  ['Radius · Primitive', 'Radius'],
  ['Radius · Semantic', 'Radius'],
  ['Size · Primitive', 'Size'],
  ['Size · Semantic', 'Size'],
  ['Spacing · Primitive', 'Spacing'],
  ['Spacing · Semantic', 'Spacing'],
  ['Stroke · Primitive', 'Stroke'],
  ['Stroke · Semantic', 'Stroke'],
]);

const typeToDtcg = new Map([
  ['BOOLEAN', 'boolean'],
  ['COLOR', 'color'],
  ['FLOAT', 'dimension'],
]);

const familyOrder = ['Boolean', 'Color', 'Radius', 'Size', 'Spacing', 'Stroke'];
const collectionOrder = [
  'Boolean · Primitive',
  'Boolean · Semantic',
  'Color · Primitive',
  'Color · Semantic',
  'Radius · Primitive',
  'Radius · Semantic',
  'Size · Primitive',
  'Size · Semantic',
  'Spacing · Primitive',
  'Spacing · Semantic',
  'Stroke · Primitive',
  'Stroke · Semantic',
];

const sortedRecords = [...variableRecords].sort((a, b) => {
  const collectionDelta =
    collectionOrder.indexOf(a.collection) - collectionOrder.indexOf(b.collection);
  if (collectionDelta !== 0) return collectionDelta;
  return a.name.localeCompare(b.name, 'en');
});

const resolvedPaths = new Map();
for (const record of sortedRecords) {
  const family = collectionToFamily.get(record.collection);
  if (!family) {
    throw new Error(`Unknown collection: ${record.collection}`);
  }
  resolvedPaths.set(record.id, resolveRoot(record, family));
}
const pathsWithChildren = buildPathsWithChildren(
  [...resolvedPaths.values()].map(({ path }) => path),
);

const counters = {
  primitive: 0,
  semantic: 0,
  component: 0,
  aliases: 0,
  color: 0,
  dimension: 0,
  boolean: 0,
};

for (const record of sortedRecords) {
  const rootInfo = resolvedPaths.get(record.id);
  const tokenNode = createTokenNode(record);
  setDeepValue(roots[rootInfo.target], rootInfo.path, tokenNode);

  counters[rootInfo.kind] += 1;
  if (record.modeValues.some(([, value]) => isAlias(value))) counters.aliases += 1;
  if (record.resolvedType === 'COLOR') counters.color += 1;
  if (record.resolvedType === 'BOOLEAN') counters.boolean += 1;
  if (record.resolvedType === 'FLOAT') counters.dimension += 1;
}

for (const style of styleSnapshot.effectStyles) {
  const shadowToken = createShadowToken(style);
  const stylePath = ['Effects', ...style.name.split('/')];
  setDeepValue(roots.effects, stylePath, shadowToken);
}

const typographyRoot = createTypographyStyles(styleSnapshot.textStyles);
const foundationInventory = createFoundationInventory();

await writeJson(
  path.join(tokenSrcDir, 'primitive.tokens.json'),
  sortTokenJson(primitiveRoot),
);
await writeJson(
  path.join(tokenSrcDir, 'semantic.tokens.json'),
  sortTokenJson(semanticRoot),
);
await writeJson(
  path.join(tokenSrcDir, 'component.tokens.json'),
  sortTokenJson(componentRoot),
);
await writeJson(
  path.join(tokenSrcDir, 'effects.tokens.json'),
  sortTokenJson(effectsRoot),
);
await writeJson(
  path.join(tokenSrcDir, 'typography.styles.json'),
  typographyRoot,
);
await writeJson(
  path.join(tokenSrcDir, 'foundation.inventory.json'),
  foundationInventory,
);

console.log(
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      counts: {
        primitive: counters.primitive,
        semantic: counters.semantic,
        component: counters.component,
        total: counters.primitive + counters.semantic + counters.component,
        aliases: counters.aliases,
        color: counters.color,
        dimension: counters.dimension,
        boolean: counters.boolean,
        textStyles: styleSnapshot.textStyles.length,
        effectStyles: styleSnapshot.effectStyles.length,
      },
    },
    null,
    2,
  ),
);

function resolveRoot(record, family) {
  const namePath = record.name.split('/');
  if (record.collection.endsWith('Primitive')) {
    return {
      target: 'primitive',
      kind: 'primitive',
      path: ['Primitive', family, ...namePath],
    };
  }

  if (record.name.startsWith('Component/')) {
    return {
      target: 'component',
      kind: 'component',
      path: ['Component', ...namePath.slice(1)],
    };
  }

  return {
    target: 'semantic',
    kind: 'semantic',
    path: ['Semantic', family, ...namePath],
  };
}

function createTokenNode(record) {
  const dtcgType = typeToDtcg.get(record.resolvedType);
  if (!dtcgType) {
    throw new Error(`Unsupported variable type: ${record.resolvedType}`);
  }

  const modeValues = Object.fromEntries(record.modeValues);
  const modeName = Object.keys(modeValues)[0];
  const rawValue = modeValues[modeName];

  return {
    $type: dtcgType,
    $value: normalizeValue(rawValue, dtcgType),
    $description: record.description,
    $extensions: {
      'com.cometal.figma': {
        id: record.id,
        key: record.key,
        collection: record.collection,
        name: record.name,
        scopes: record.scopes,
        webCodeSyntax: record.webCodeSyntax,
        hiddenFromPublishing: record.hiddenFromPublishing,
        mode: modeName,
      },
    },
  };
}

function normalizeValue(value, dtcgType) {
  if (isAlias(value)) {
    return buildAliasReference(value);
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    if (dtcgType === 'dimension') {
      return {
        value: normalizeDimensionValue(value),
        unit: 'px',
      };
    }
    return value;
  }

  if (isColorValue(value)) {
    const color = {
      colorSpace: 'srgb',
      components: [value.r, value.g, value.b],
    };
    if (value.a !== undefined && value.a < 1) {
      color.alpha = value.a;
    }
    return color;
  }

  throw new Error(`Unsupported value payload: ${JSON.stringify(value)}`);
}

function buildAliasReference(aliasValue) {
  const [, , , , targetId] = aliasValue;
  const target = recordById.get(targetId);
  if (!target) {
    throw new Error(`Missing alias target for ${targetId}`);
  }
  const { path: targetPath } = resolvedPaths.get(target.id);
  const pathKey = targetPath.join('.');
  const referencePath = pathsWithChildren.has(pathKey)
    ? [...targetPath, '$root']
    : targetPath;
  return `{${referencePath.join('.')}}`;
}

function createShadowToken(style) {
  const layers = style.effects
    .filter((effect) => effect.type === 'DROP_SHADOW' && effect.visible !== false)
    .map((effect) => {
      const colorAliasId = effect.boundVariables?.color?.id;
      if (!colorAliasId) {
        throw new Error(`Shadow layer without bound color variable: ${style.name}`);
      }
      const colorRef = buildAliasReference(['@', '', '', '', colorAliasId]);
      return `${formatPx(effect.offset.x)} ${formatPx(effect.offset.y)} ${formatPx(effect.radius)} ${formatPx(effect.spread)} ${colorRef}`;
    });

  return {
    $type: 'string',
    $value: layers.join(', '),
    $description: style.description,
    $extensions: {
      'com.cometal.figma': {
        id: style.id,
        key: style.key,
        name: style.name,
        layers: style.effects.length,
      },
    },
  };
}

function createTypographyStyles(textStyles) {
  const styles = [...textStyles]
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .map((style) => ({
      name: style.name,
      description: style.description,
      family: style.fontName.family,
      ...(style.fontName.family === 'IBM Plex Mono'
        ? { fallback: 'ui-monospace, SFMono-Regular, Menlo, monospace' }
        : {}),
      weight: normalizeFontWeight(style.fontName.style),
      size: style.fontSize,
      lineHeight: normalizeLineHeight(style),
      letterSpacingPercent: normalizeLetterSpacingPercent(style),
      textCase: style.textCase === 'UPPER' ? 'upper' : 'original',
      figmaKey: style.key,
    }));

  return {
    $description: 'Typography styles synchronized from Figma DS Core snapshot 2026-08-20.',
    $extensions: {
      'com.cometal.figma': {
        fileKey: variableSnapshot.source.fileKey,
        capturedAt: styleSnapshot.capturedAt,
      },
    },
    styles,
  };
}

function createFoundationInventory() {
  const primitiveCount = counters.primitive;
  const globalSemanticCount = counters.semantic;
  const componentCount = counters.component;
  const total = primitiveCount + globalSemanticCount + componentCount;

  return {
    $description: 'Verified engineering inventory of Foundation in Figma DS Core.',
    verifiedAt: styleSnapshot.capturedAt,
    figma: {
      fileKey: variableSnapshot.source.fileKey,
      variables: {
        total,
        foundation: primitiveCount + globalSemanticCount,
        primitive: primitiveCount,
        semantic: globalSemanticCount,
        component: componentCount,
        color: counters.color,
        dimension: counters.dimension,
        boolean: counters.boolean,
        withAliases: counters.aliases,
        withCodeSyntax: total,
        withScopes: total,
      },
      collections: collectionOrder.map((name) => ({
        name,
        variables: sortedRecords.filter((record) => record.collection === name).length,
        modes: new Set(
          sortedRecords
            .filter((record) => record.collection === name)
            .flatMap((record) => record.modeValues.map(([mode]) => mode)),
        ).size,
      })),
      styles: {
        text: styleSnapshot.textStyles.length,
        paint: 0,
        grid: 0,
        effect: styleSnapshot.effectStyles.length,
      },
    },
    repository: {
      primitiveTokens: primitiveCount,
      semanticTokens: globalSemanticCount,
      componentTokens: componentCount,
      typographyStyles: styleSnapshot.textStyles.length,
      effectStyles: styleSnapshot.effectStyles.length,
      gridPresets: 4,
      iconComponents: 2810,
    },
    notes: [
      'This inventory is generated from the canonical 2026-08-20 Figma snapshots and current token source.',
      'Documentation and motion layers remain code-owned and are preserved outside the Figma snapshot token graph.',
      'Icons remain inventory-only until a canonical SVG source and public API are approved.',
    ],
    sourceConflicts: [],
  };
}

function normalizeFontWeight(styleName) {
  const normalized = styleName.toLowerCase();
  if (normalized.includes('semibold')) return 500;
  if (normalized.includes('medium')) return 500;
  if (normalized.includes('book')) return 400;
  if (normalized.includes('regular')) return 400;
  if (normalized.includes('bold')) return 700;
  return 400;
}

function normalizeLineHeight(style) {
  if (style.lineHeight.unit === 'AUTO') return style.fontSize;
  if (style.lineHeight.unit === 'PIXELS') return style.lineHeight.value;
  if (style.lineHeight.unit === 'PERCENT') {
    return (style.fontSize * style.lineHeight.value) / 100;
  }
  throw new Error(`Unsupported line height unit: ${style.lineHeight.unit}`);
}

function normalizeLetterSpacingPercent(style) {
  if (style.letterSpacing.unit === 'PERCENT') return style.letterSpacing.value;
  if (style.letterSpacing.unit === 'PIXELS') {
    return (style.letterSpacing.value / style.fontSize) * 100;
  }
  return 0;
}

function setDeepValue(target, pathParts, value) {
  let cursor = target;
  for (let index = 0; index < pathParts.length - 1; index += 1) {
    const segment = pathParts[index];
    if (!(segment in cursor)) {
      cursor[segment] = {};
    } else if (isTokenNode(cursor[segment])) {
      cursor[segment] = { $root: cursor[segment] };
    }
    cursor = cursor[segment];
  }
  const leaf = pathParts.at(-1);
  if (!(leaf in cursor)) {
    cursor[leaf] = value;
    return;
  }

  if (isTokenNode(cursor[leaf])) {
    cursor[leaf] = value;
    return;
  }

  cursor[leaf].$root = value;
}

function sortTokenJson(value) {
  if (Array.isArray(value)) return value.map(sortTokenJson);
  if (!value || typeof value !== 'object') return value;

  const entries = Object.entries(value);
  const metaEntries = entries.filter(([key]) => key.startsWith('$'));
  const tokenEntries = entries.filter(([key]) => !key.startsWith('$'));
  tokenEntries.sort(([left], [right]) => {
    const leftIndex = familyOrder.indexOf(left);
    const rightIndex = familyOrder.indexOf(right);
    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) return 1;
      if (rightIndex === -1) return -1;
      return leftIndex - rightIndex;
    }
    return left.localeCompare(right, 'en');
  });

  return Object.fromEntries(
    [...metaEntries, ...tokenEntries].map(([key, nested]) => [key, sortTokenJson(nested)]),
  );
}

async function writeJson(filePath, payload) {
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function formatPx(value) {
  const normalized = normalizeDimensionValue(value);
  if (Object.is(normalized, -0)) return '0px';
  return `${normalized}px`;
}

function normalizeDimensionValue(value) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) return normalized;
  if (Math.abs(normalized) < Number.EPSILON) return 0;
  return Number(normalized.toFixed(4));
}

function isAlias(value) {
  return Array.isArray(value) && value[0] === '@';
}

function isColorValue(value) {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.r === 'number' &&
    typeof value.g === 'number' &&
    typeof value.b === 'number'
  );
}

function isTokenNode(value) {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      ('$value' in value || '$type' in value),
  );
}

function buildPathsWithChildren(paths) {
  const result = new Set();
  for (const pathParts of paths) {
    for (let index = 1; index < pathParts.length; index += 1) {
      result.add(pathParts.slice(0, index).join('.'));
    }
  }
  return result;
}
