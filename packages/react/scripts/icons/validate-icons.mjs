import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sourceManifest = JSON.parse(await readFile(path.join(packageRoot, 'icons/source/manifest.source.json'), 'utf8'));
const packageJson = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
const expectedFingerprint = '8cde56a1207cc4c4dd73f69840aa2efecf9c3718ffbc140a1c49f8c8f5d89bb7';
const expectedPaintContractFingerprint = '9436f859162676a7eecf1bdb222aba383f25d73c5b089ef176aa4334dc74a6e4';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const errors = [];
let packageImportsResolved = 0;

function collisionGroups(records, key) {
  const values = new Map();
  for (const record of records) values.set(key(record), [...(values.get(key(record)) ?? []), record.canonicalName]);
  return [...values.entries()].filter(([, names]) => names.length > 1);
}

if (sourceManifest.records.length !== 2810) errors.push(`record count ${sourceManifest.records.length}`);
if (sourceManifest.acceptedFingerprintSha256 !== expectedFingerprint) errors.push('declared source fingerprint mismatch');
const projection = [...sourceManifest.records]
  .sort((a, b) => a.sourceOrder - b.sourceOrder)
  .map((record) => [record.canonicalName, record.nodeId, record.componentKey, record.acceptedSafePath, record.sourceSha256]);
if (sha256(JSON.stringify(projection)) !== expectedFingerprint) errors.push('computed source fingerprint mismatch');
const paintProjection = [...sourceManifest.records]
  .sort((a, b) => a.sourceOrder - b.sourceOrder)
  .map((record) => [record.canonicalName, record.sourceSha256, record.variableBindings]);
if (sourceManifest.paintContract?.sha256 !== expectedPaintContractFingerprint) errors.push('declared paint contract fingerprint mismatch');
if (sha256(JSON.stringify(paintProjection)) !== expectedPaintContractFingerprint) errors.push('computed paint contract fingerprint mismatch');

for (const [label, key] of Object.entries({
  exactName: (record) => record.canonicalName,
  caseName: (record) => record.canonicalName.toLocaleLowerCase('en-US'),
  normalizedName: (record) => record.canonicalName.normalize('NFKC').toLocaleLowerCase('en-US').replace(/[\s_-]+/g, '-'),
  nodeId: (record) => record.nodeId,
  componentKey: (record) => record.componentKey,
  sourcePath: (record) => record.sourcePath.toLocaleLowerCase('en-US'),
  importPath: (record) => record.importPath.toLocaleLowerCase('en-US'),
  identifier: (record) => record.generatedIdentifier.toLocaleLowerCase('en-US'),
})) {
  const collisions = collisionGroups(sourceManifest.records, key);
  if (collisions.length) errors.push(`${label} collisions: ${collisions.length}`);
}

const hashes = new Map();
let parseable = 0;
let hashMatches = 0;
for (const record of sourceManifest.records) {
  const file = path.join(packageRoot, record.sourcePath);
  const source = await readFile(file);
  const hash = sha256(source);
  if (hash === record.sourceSha256) hashMatches += 1;
  hashes.set(hash, [...(hashes.get(hash) ?? []), record.canonicalName]);
  if (spawnSync('/usr/bin/xmllint', ['--noout', file], { stdio: 'ignore' }).status === 0) parseable += 1;
}
if (hashMatches !== 2810) errors.push(`source hash matches ${hashMatches}`);
if (parseable !== 2810) errors.push(`XML parses ${parseable}`);
const duplicateHashes = [...hashes.entries()].filter(([, names]) => names.length > 1);
if (duplicateHashes.length !== 1 || JSON.stringify(duplicateHashes[0][1].sort()) !== JSON.stringify(['flag-rectangle/PM', 'flag-rectangle/RE'])) {
  errors.push('same-source exception set changed');
}

const freshness = spawnSync(process.execPath, [path.join(packageRoot, 'scripts/icons/generate-icons.mjs'), '--check'], { encoding: 'utf8' });
if (freshness.status !== 0) errors.push(freshness.stderr || freshness.stdout || 'generated freshness check failed');

for (const exportKey of ['.', './styles.css', './icons/manifest', './icons/catalog', './icons/*']) {
  if (!(exportKey in packageJson.exports)) errors.push(`missing package export ${exportKey}`);
}
const wildcard = packageJson.exports['./icons/*'];
if (wildcard?.import !== './dist/icons/*.js' || wildcard?.types !== './dist/icons/*.d.ts') errors.push('direct icon wildcard boundary mismatch');

if (process.argv.includes('--dist')) {
  for (const record of sourceManifest.records) {
    const relative = record.importPath.replace('@cometal/react/icons/', '');
    for (const extension of ['js', 'd.ts']) {
      try {
        await access(path.join(packageRoot, `dist/icons/${relative}.${extension}`));
      } catch {
        errors.push(`missing dist entry ${relative}.${extension}`);
        break;
      }
    }
  }
  for (const entry of ['dist/index.js', 'dist/icons/catalog.js', 'dist/icons/manifest.js']) {
    try { await access(path.join(packageRoot, entry)); } catch { errors.push(`missing ${entry}`); }
  }
  for (const record of sourceManifest.records) {
    try {
      const module = await import(record.importPath);
      if (typeof module.default !== 'object' || module.definition?.canonicalName !== record.canonicalName) {
        errors.push(`invalid package subpath module ${record.importPath}`);
        break;
      }
      packageImportsResolved += 1;
    } catch (error) {
      errors.push(`unresolved package subpath ${record.importPath}: ${error instanceof Error ? error.message : error}`);
      break;
    }
  }
}

const result = {
  status: errors.length ? 'ICON_LIBRARY_VALIDATION_FAILED' : 'ICON_LIBRARY_VALIDATION_PASSED',
  total: sourceManifest.records.length,
  parseable,
  hashMatches,
  sourceFingerprintSha256: expectedFingerprint,
  paintContractFingerprintSha256: expectedPaintContractFingerprint,
  duplicateSourceExceptions: duplicateHashes.map(([hash, names]) => ({ hash, names })),
  generatedFresh: freshness.status === 0,
  distChecked: process.argv.includes('--dist'),
  packageImportsResolved,
  errors,
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
