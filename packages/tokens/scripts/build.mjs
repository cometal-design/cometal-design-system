import StyleDictionary from 'style-dictionary';
import { mkdir, writeFile } from 'node:fs/promises';

const dictionary = new StyleDictionary({
  source: ['src/**/*.tokens.json'],
  usesDtcg: true,
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
