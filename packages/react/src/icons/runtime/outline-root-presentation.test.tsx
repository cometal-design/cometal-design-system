import { createHash } from 'node:crypto';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ArrowIcon, { definition as outlineDefinition } from '../generated/components/outline/arrows/arrow-curve-left-down';
import FilledIcon, { definition as filledDefinition } from '../generated/components/filled/security/shield-plus-filled';
import FilledStrokeIcon, { definition as filledStrokeDefinition } from '../generated/components/filled/charts/bar-chart-square-02';
import BrandIcon, { definition as brandDefinition } from '../generated/components/feature-icons-and-logos/payment/lg/visa';
import { iconLoaders } from '../generated/loaders';
import { iconManifest } from '../generated/manifest';

describe('Outline and Filled root presentation runtime', () => {
  it('emits source-derived fill none for every Outline and Filled definition only', async () => {
    expect(outlineDefinition.rootPresentation).toEqual({ fill: 'none' });
    expect(filledDefinition.rootPresentation).toEqual({ fill: 'none' });
    expect(filledStrokeDefinition.rootPresentation).toEqual({ fill: 'none' });
    expect('rootPresentation' in brandDefinition).toBe(false);

    const report = await import('../generated/generation-report.json');
    expect(report.default.transformed.rootPresentationRecords).toBe(1752);
    expect(report.default.records.filter((record) => record.rootPresentation)).toHaveLength(1752);
    expect(report.default.records.filter((record) => record.rootPresentation).every((record) => record.library === 'outline' || record.library === 'filled')).toBe(true);
  });

  it('uses root presentation as a default while caller fill and style fill retain priority', () => {
    expect(renderToStaticMarkup(<ArrowIcon />)).toContain('fill="none"');
    expect(renderToStaticMarkup(<ArrowIcon fill="red" />)).toContain('fill="red"');
    const styled = renderToStaticMarkup(<ArrowIcon style={{ fill: 'blue' }} />);
    expect(styled).toContain('fill="none"');
    expect(styled).toContain('style="fill:blue"');
  });

  it('keeps Filled stroke-only paths transparent and explicit Filled paths currentColor', () => {
    const strokeOnly = renderToStaticMarkup(<FilledStrokeIcon />);
    expect(strokeOnly).toMatch(/<svg[^>]*\sfill="none"/);
    expect(strokeOnly).toContain('stroke="currentColor"');
    expect(strokeOnly).not.toMatch(/<path[^>]*\sfill=/);

    const explicitFill = renderToStaticMarkup(<FilledIcon />);
    expect(explicitFill).toMatch(/<svg[^>]*\sfill="none"/);
    expect(explicitFill).toMatch(/<path[^>]*\sfill="currentColor"/);
  });

  it('does not add root fill to Feature runtime output', () => {
    expect(renderToStaticMarkup(<BrandIcon />).match(/<svg[^>]*\sfill=/)).toBeNull();
  });

  it('retains the accepted runtime digests after Filled root preservation', async () => {
    const expected = {
      filled: ['2c4e1ebbc82bef598b6b7add80c4ced144367de8e729af07f77e01824ddd1833', 877],
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
