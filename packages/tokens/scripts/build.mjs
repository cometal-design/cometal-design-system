import StyleDictionary from 'style-dictionary';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';

const dictionary = new StyleDictionary({
  source: ['src/**/*.tokens.json'],
  usesDtcg: true,
  log: {
    verbosity: 'verbose',
  },
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'cometal',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
    javascript: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.json', format: 'json/nested' },
      ],
    },
  },
});

await dictionary.buildAllPlatforms();
await preserveLowAlphaColors();
await normalizeRootTokenNames();

const typographySource = JSON.parse(
  await readFile('src/typography.styles.json', 'utf8'),
);
const typographyStyles = Object.fromEntries(
  typographySource.styles.map((style) => [style.name, style]),
);

await Promise.all([
  appendFile('dist/tokens.css', buildTypographyCss(typographySource.styles)),
  appendFile('dist/tokens.js', buildTypographyJs(typographySource.styles)),
  mergeTypographyJson(typographyStyles),
]);

// Keep the package buildable before DS Core values are imported. These files
// contain no design decisions and are replaced by Style Dictionary once tokens exist.
await mkdir('dist', { recursive: true });
await Promise.all([
  writeFile('dist/tokens.css', ':root {\n  /* Tokens pending verified DS Core import. */\n}\n', { flag: 'wx' }).catch(ignoreExisting),
  writeFile('dist/tokens.js', 'export const tokens = Object.freeze({});\n', { flag: 'wx' }).catch(ignoreExisting),
  writeFile('dist/tokens.json', '{}\n', { flag: 'wx' }).catch(ignoreExisting),
]);

function ignoreExisting(error) {
  if (error?.code !== 'EEXIST') throw error;
}

function buildTypographyCss(styles) {
  const variables = styles.flatMap((style) => {
    const prefix = `--cometal-typography-${toKebab(style.name)}`;
    return [
      `  ${prefix}-font-family: '${style.family}', Arial, sans-serif;`,
      `  ${prefix}-font-weight: ${style.weight};`,
      `  ${prefix}-font-size: ${style.size}px;`,
      `  ${prefix}-line-height: ${style.lineHeight}px;`,
      `  ${prefix}-letter-spacing: ${style.letterSpacingPercent / 100}em;`,
      `  ${prefix}-text-transform: ${style.textCase === 'upper' ? 'uppercase' : 'none'};`,
    ];
  });

  return `\n/* Typography styles synchronized from Figma DS Core. */\n:root {\n${variables.join('\n')}\n}\n`;
}

function buildTypographyJs(styles) {
  const exports = styles.map((style) => {
    const name = `Typography${toPascal(style.name)}`;
    return `export const ${name} = Object.freeze(${JSON.stringify(style)});`;
  });

  return `\n// Typography styles synchronized from Figma DS Core.\n${exports.join('\n')}\n`;
}

async function mergeTypographyJson(styles) {
  const path = 'dist/tokens.json';
  const generated = JSON.parse(await readFile(path, 'utf8'));
  generated.Typography = styles;
  await writeFile(path, `${JSON.stringify(generated, null, 2)}\n`);
}

async function preserveLowAlphaColors() {
  const path = 'dist/tokens.css';
  const generated = await readFile(path, 'utf8');
  const corrected = generated.replace(
    /(--cometal-[^:]*-0p1:\s*rgba\([^;]*), 0\);/g,
    '$1, 0.001);',
  );
  await writeFile(path, corrected);
}

async function normalizeRootTokenNames() {
  const path = 'dist/tokens.css';
  const generated = await readFile(path, 'utf8');
  await writeFile(path, generated.replace(/-root:/g, ':'));
}

function toKebab(value) {
  return value
    .replace(/&/g, ' ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function toPascal(value) {
  return value
    .replace(/&/g, ' ')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join('');
}
