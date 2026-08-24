import { describe, expect, it } from 'vitest';
import generationReport from '../generated/generation-report.json';
import ProfileIcon, { definition as profileDefinition } from '../generated/components/outline/profiles-and-users/user-profile-03-02';
import { renderToStaticMarkup } from 'react-dom/server';

describe('generated icon stroke audit', () => {
  it('accounts for every explicit source width and preserves every nonstandard element', () => {
    const audit = generationReport.transformed.strokeAudit;
    expect(generationReport.records).toHaveLength(2810);
    expect(audit).toEqual({
      explicitElementCount: 1640,
      standardElementCount: 832,
      nonstandardElementCount: 808,
      scalableElementCount: 827,
      preservedElementCount: 813,
    });
    for (const record of generationReport.records) {
      const widths = record.strokeAudit.sourceStrokeWidths.reduce((sum, item) => sum + item.count, 0);
      expect(widths).toBe(record.strokeAudit.explicitElementCount);
      expect(record.strokeAudit.standardElementCount + record.strokeAudit.nonstandardElementCount).toBe(record.strokeAudit.explicitElementCount);
      expect(record.strokeAudit.scalableElementCount).toBeLessThanOrEqual(record.strokeAudit.standardElementCount);
      expect(record.strokeAudit.preservedElementCount).toBeGreaterThanOrEqual(record.strokeAudit.nonstandardElementCount);
    }
  });

  it('retains the 2.8 mask construction for user-profile-03-02', () => {
    const record = generationReport.records.find((item) => item.canonicalName === 'Outline/profiles-and-users/user-profile-03-02');
    expect(record?.strokeAudit).toEqual({
      explicitElementCount: 2,
      standardElementCount: 0,
      nonstandardElementCount: 2,
      scalableElementCount: 0,
      preservedElementCount: 2,
      sourceStrokeWidths: [{ width: '2.8', count: 2 }],
    });
    expect(profileDefinition.strokeScaling).toBe('preserve-source');
    const html = renderToStaticMarkup(<ProfileIcon />);
    expect(html.match(/stroke-width="2.8"/g)).toHaveLength(2);
    expect(html).not.toContain('data-cometal-stroke-scale');
  });
});
