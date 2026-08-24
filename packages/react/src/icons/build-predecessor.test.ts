import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const repositoryRoot = path.resolve(packageRoot, '../..');
const sha256 = (value: Buffer | string) => createHash('sha256').update(value).digest('hex');

describe('icon freshness build predecessor', () => {
  it('guards React, assembled-site, and Vercel-equivalent build paths', async () => {
    const reactPackage = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
    const rootPackage = JSON.parse(await readFile(path.join(repositoryRoot, 'package.json'), 'utf8'));
    const vercel = JSON.parse(await readFile(path.join(repositoryRoot, 'apps/storybook/vercel.json'), 'utf8'));

    expect(reactPackage.scripts.build).toMatch(/^pnpm validate:icons && /);
    expect(rootPackage.scripts['build:site']).toMatch(/^pnpm validate:icons && /);
    expect(vercel.buildCommand).toMatch(/validate:icons && .*build:site/);
  });

  it('blocks an isolated stale fixture without mutating tracked generated output', async () => {
    const fixtureRoot = await mkdtemp(path.join(tmpdir(), 'cometal-icons-stale-'));
    const trackedGeneratedRoot = path.join(packageRoot, 'src/icons/generated');
    const fixtureGeneratedRoot = path.join(fixtureRoot, 'generated');
    const trackedTokenProjection = path.join(repositoryRoot, 'packages/tokens/src/icons.inventory.json');
    const fixtureTokenProjection = path.join(fixtureRoot, 'icons.inventory.json');
    const trackedSentinel = path.join(trackedGeneratedRoot, 'manifest.ts');
    const beforeHash = sha256(await readFile(trackedSentinel));

    try {
      await cp(trackedGeneratedRoot, fixtureGeneratedRoot, { recursive: true });
      await cp(trackedTokenProjection, fixtureTokenProjection);
      const staleSentinel = path.join(fixtureGeneratedRoot, 'manifest.ts');
      await writeFile(staleSentinel, `${await readFile(staleSentinel, 'utf8')}\n// isolated stale fixture\n`);

      const result = spawnSync('pnpm', ['build'], {
        cwd: packageRoot,
        encoding: 'utf8',
        timeout: 120_000,
        env: {
          ...process.env,
          COMETAL_ICONS_CHECK_GENERATED_ROOT: fixtureGeneratedRoot,
          COMETAL_ICONS_CHECK_TOKEN_PROJECTION: fixtureTokenProjection,
        },
      });

      expect(result.status).not.toBe(0);
      expect(`${result.stdout}${result.stderr}`).toMatch(/generated file is stale/);
      expect(`${result.stdout}${result.stderr}`).not.toMatch(/vite v\d/);
      expect(sha256(await readFile(trackedSentinel))).toBe(beforeHash);
    } finally {
      await rm(fixtureRoot, { recursive: true, force: true });
    }
  }, 140_000);
});
