import test from 'node:test';
import assert from 'node:assert/strict';
import { assertExactBuildProvenance, resolveBuildProvenance } from './build-provenance.mjs';

const sha = '1234567890abcdef1234567890abcdef12345678';

test('resolves local and Vercel build SHAs without source hardcoding', () => {
  assert.deepEqual(resolveBuildProvenance({ env: {}, gitHead: sha }), {
    schemaVersion: 1,
    status: 'exact',
    buildSha: sha,
    source: 'local-git-head',
    fallback: false,
  });
  assert.equal(resolveBuildProvenance({ env: { VERCEL: '1', VERCEL_GIT_COMMIT_SHA: sha }, gitHead: '' }).source, 'VERCEL_GIT_COMMIT_SHA');
});

test('uses a clearly marked deterministic fallback when provenance is unavailable', () => {
  const metadata = resolveBuildProvenance({ env: {}, gitHead: '' });
  assert.equal(metadata.status, 'unknown');
  assert.equal(metadata.source, 'deterministic-fallback');
  assert.equal(metadata.fallback, true);
  assert.throws(() => assertExactBuildProvenance(metadata, sha), /unknown|fallback/);
});

test('release-readiness rejects stale build provenance', () => {
  const stale = resolveBuildProvenance({ env: {}, gitHead: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' });
  assert.throws(() => assertExactBuildProvenance(stale, sha), /stale/);
});
