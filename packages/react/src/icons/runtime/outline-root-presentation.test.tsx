import { createHash } from 'node:crypto';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ArrowIcon, { definition as outlineDefinition } from '../generated/components/outline/arrows/arrow-curve-left-down';
import FilledIcon, { definition as filledDefinition } from '../generated/components/filled/security/shield-plus-filled';
import BrandIcon, { definition as brandDefinition } from '../generated/components/feature-icons-and-logos/payment/lg/visa';
import { iconLoaders } from '../generated/loaders';
import { iconManifest } from '../generated/manifest';

describe('Outline root presentation runtime', () => {
  it('emits source-derived fill none for every Outline definition only', async () => {
    expect(outlineDefinition.rootPresentation).toEqual({ fill: 'none' });
    expect('rootPresentation' in filledDefinition).toBe(false);
    expect('rootPresentation' in brandDefinition).toBe(false);

    const report = await import('../generated/generation-report.json');
    expect(report.default.transformed.rootPresentationRecords).toBe(875);
    expect(report.default.records.filter((record) => record.rootPresentation).every((record) => record.library === 'outline')).toBe(true);
  });

  it('uses root presentation as a default while caller fill and style fill retain priority', () => {
    expect(renderToStaticMarkup(<ArrowIcon />)).toContain('fill="none"');
    expect(renderToStaticMarkup(<ArrowIcon fill="red" />)).toContain('fill="red"');
    const styled = renderToStaticMarkup(<ArrowIcon style={{ fill: 'blue' }} />);
    expect(styled).toContain('fill="none"');
    expect(styled).toContain('style="fill:blue"');
  });

  it('does not add root fill to non-Outline runtime output', () => {
    expect(renderToStaticMarkup(<FilledIcon />).match(/<svg[^>]*\sfill=/)).toBeNull();
    expect(renderToStaticMarkup(<BrandIcon />).match(/<svg[^>]*\sfill=/)).toBeNull();
  });

  it('retains the exact baseline runtime digests for both non-Outline libraries', async () => {
    const expected = {
      filled: ['097b1bcb289b9c9bf884bd75db0ba04d9b661afd181268dd7ac2a57fc70375e5', 877],
      'feature-icons-and-logos': ['aeb293e0aa0199c27325f1066723d78fd580fd160443642e10e623d6bf8a8a63', 1058],
    } as const;
    for (const [library, [expectedDigest, expectedCount]] of Object.entries(expected)) {
      const records = iconManifest
        .filter((record) => record.library === library)
        .sort((left, right) => left.canonicalName.localeCompare(right.canonicalName, 'en-US'));
      expect(records).toHaveLength(expectedCount);
      const digest = createHash('sha256');
      for (const record of records) {
        const module = await iconLoaders[record.canonicalName]();
        digest.update(record.canonicalName).update('\0').update(renderToStaticMarkup(<module.default />)).update('\n');
      }
      expect(digest.digest('hex')).toBe(expectedDigest);
    }
  }, 120_000);
});
