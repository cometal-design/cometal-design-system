import { createHash } from 'node:crypto';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ArrowIcon, { definition as outlineDefinition } from '../generated/components/outline/arrows/arrow-curve-left-down';
import FilledIcon, { definition as filledDefinition } from '../generated/components/filled/security/shield-plus-filled';
import FilledStrokeIcon, { definition as filledStrokeDefinition } from '../generated/components/filled/charts/bar-chart-square-02';
import FeatureStrokeIcon, { definition as featureStrokeDefinition } from '../generated/components/feature-icons-and-logos/file-icon/file';
import BrandIcon, { definition as brandDefinition } from '../generated/components/feature-icons-and-logos/payment/lg/visa';
import EmojiLgIcon from '../generated/components/feature-icons-and-logos/emoji-icon/lg';
import EmojiMdIcon from '../generated/components/feature-icons-and-logos/emoji-icon/md';
import EmojiSmIcon from '../generated/components/feature-icons-and-logos/emoji-icon/sm';
import { iconLoaders } from '../generated/loaders';
import { iconManifest } from '../generated/manifest';

describe('Outline and Filled root presentation runtime', () => {
  it('emits source-derived fill none for every generated definition', async () => {
    expect(outlineDefinition.rootPresentation).toEqual({ fill: 'none' });
    expect(filledDefinition.rootPresentation).toEqual({ fill: 'none' });
    expect(filledStrokeDefinition.rootPresentation).toEqual({ fill: 'none' });
    expect(featureStrokeDefinition.rootPresentation).toEqual({ fill: 'none' });
    expect(brandDefinition.rootPresentation).toEqual({ fill: 'none' });

    const report = await import('../generated/generation-report.json');
    expect(report.default.transformed.rootPresentationRecords).toBe(2810);
    expect(report.default.records.filter((record) => record.rootPresentation)).toHaveLength(2810);
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

  it('keeps Feature stroke-only paths transparent and intrinsic explicit fills unchanged', () => {
    const strokeOnly = renderToStaticMarkup(<FeatureStrokeIcon />);
    expect(strokeOnly).toMatch(/<svg[^>]*\sfill="none"/);
    expect(strokeOnly).toContain('stroke="#9FA8B3"');
    expect(strokeOnly).not.toMatch(/<path[^>]*\sfill=/);

    const brand = renderToStaticMarkup(<BrandIcon />);
    expect(brand).toMatch(/<svg[^>]*\sfill="none"/);
    expect(brand).toContain('fill="#172B85"');
    expect(brand).not.toContain('currentColor');
  });

  it('renders the three normalized Twemoji assets with intrinsic paint and isolated clip IDs', () => {
    for (const [Icon, expectedPaths] of [[EmojiSmIcon, 12], [EmojiMdIcon, 12], [EmojiLgIcon, 14]] as const) {
      const markup = renderToStaticMarkup(<Icon />);
      expect(markup).toMatch(/<svg[^>]*\sfill="none"/);
      expect(markup).toContain('fill="#F4900C"');
      expect(markup).toContain('fill="#FFCC4D"');
      expect(markup).toMatch(/clip-path="url\(#cometal-[^)]+clip0_381_25439\)"/);
      expect([...markup.matchAll(/<path\b/g)]).toHaveLength(expectedPaths);
      if (expectedPaths === 12) {
        expect(markup).not.toContain('#CCD6DD');
        expect(markup).not.toContain('#E1E8ED');
      }
      expect(markup).not.toContain('#F5F5F5');
      expect(markup).not.toMatch(/M-\d+ -7140/);
    }

    const repeated = renderToStaticMarkup(<><EmojiSmIcon /><EmojiSmIcon /></>);
    const ids = [...repeated.matchAll(/<clipPath id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it('retains the accepted runtime digests after Filled and Feature root preservation', async () => {
    const expected = {
      filled: ['2c4e1ebbc82bef598b6b7add80c4ced144367de8e729af07f77e01824ddd1833', 877],
      'feature-icons-and-logos': ['d742eb60dae70e3e1fae7d2f561ee602944c13e5a268341e67c1cb240eeac240', 1058],
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
