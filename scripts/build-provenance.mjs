import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const SHA_PATTERN = /^[0-9a-f]{40}$/;
const root = resolve(import.meta.dirname, '..');
const buildMetaFilename = 'cometal-build-meta.json';

export const provenanceBuildOutputs = [
  resolve(root, 'apps/storybook/storybook-static', buildMetaFilename),
  resolve(root, 'apps/docs/out', buildMetaFilename),
];

export const provenanceAssembledOutputs = [
  resolve(root, 'apps/storybook/site-static', buildMetaFilename),
  resolve(root, 'apps/storybook/site-static/storybook', buildMetaFilename),
];

function readGit(command) {
  try {
    return execFileSync('git', ['-C', root, ...command], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

export function resolveBuildProvenance({ env = process.env, gitHead = readGit(['rev-parse', 'HEAD']) } = {}) {
  const vercelSha = env.VERCEL_GIT_COMMIT_SHA?.trim().toLowerCase();
  if (env.VERCEL || vercelSha) {
    if (vercelSha && SHA_PATTERN.test(vercelSha)) {
      return { schemaVersion: 1, status: 'exact', buildSha: vercelSha, source: 'VERCEL_GIT_COMMIT_SHA', fallback: false };
    }
    return { schemaVersion: 1, status: 'unknown', buildSha: null, source: 'deterministic-fallback', fallback: true, reason: 'missing-or-invalid-VERCEL_GIT_COMMIT_SHA' };
  }

  const normalizedGitHead = gitHead.trim().toLowerCase();
  if (SHA_PATTERN.test(normalizedGitHead)) {
    return { schemaVersion: 1, status: 'exact', buildSha: normalizedGitHead, source: 'local-git-head', fallback: false };
  }
  return { schemaVersion: 1, status: 'unknown', buildSha: null, source: 'deterministic-fallback', fallback: true, reason: 'git-head-unavailable' };
}

export function assertExactBuildProvenance(metadata, expectedSha) {
  if (!metadata || metadata.status !== 'exact' || metadata.fallback || !SHA_PATTERN.test(metadata.buildSha ?? '')) {
    throw new Error('Build provenance is unknown or uses the deterministic fallback.');
  }
  if (!SHA_PATTERN.test(expectedSha) || metadata.buildSha !== expectedSha) {
    throw new Error(`Build provenance is stale: expected ${expectedSha || '<unknown>'}, received ${metadata.buildSha}.`);
  }
}

async function writeMetadata(file, metadata) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
}

async function readMetadata(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

async function writeBuildProvenance() {
  const metadata = resolveBuildProvenance();
  await Promise.all(provenanceBuildOutputs.map((file) => writeMetadata(file, metadata)));
  console.log(`Build provenance written: ${metadata.buildSha ?? 'unknown'} (${metadata.source})`);
}

async function verifyBuildProvenance() {
  const resolved = resolveBuildProvenance();
  const gitHead = readGit(['rev-parse', 'HEAD']).toLowerCase();
  const expectedSha = SHA_PATTERN.test(gitHead) ? gitHead : resolved.buildSha ?? '';
  if (resolved.status !== 'exact') throw new Error(`Release-readiness provenance is ${resolved.status}: ${resolved.reason}.`);
  if (SHA_PATTERN.test(gitHead) && resolved.buildSha !== gitHead) {
    throw new Error(`Build environment SHA ${resolved.buildSha} does not match checked-out HEAD ${gitHead}.`);
  }

  const dirty = readGit(['status', '--porcelain=v1', '--untracked-files=no']);
  if (dirty) throw new Error('Release-readiness provenance requires a clean tracked worktree.');

  for (const file of [...provenanceBuildOutputs, ...provenanceAssembledOutputs]) {
    assertExactBuildProvenance(await readMetadata(file), expectedSha);
  }
  console.log(`Build provenance verified across Storybook, Portal, and assembled site: ${expectedSha}`);
}

async function main() {
  if (process.argv[2] === 'write') return writeBuildProvenance();
  if (process.argv[2] === 'verify') return verifyBuildProvenance();
  throw new Error('Usage: node scripts/build-provenance.mjs <write|verify>');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
