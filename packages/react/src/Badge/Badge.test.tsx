import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Badge, badgeSurfaces, badgeTones } from './Badge';

describe('Badge', () => {
  it('renders the default text composition', () => {
    const html = renderToStaticMarkup(<Badge>Согласовано</Badge>);
    expect(html).toContain('data-cometal-component="badge"');
    expect(html).toContain('data-surface="light"');
    expect(html).toContain('data-tone="neutral"');
    expect(html).toContain('cometal-badge__label');
  });

  it('supports all Figma surfaces and tones', () => {
    expect(badgeSurfaces).toEqual(['light', 'dark']);
    expect(badgeTones).toEqual(['neutral', 'blue', 'cyan', 'green', 'purple', 'red', 'violet', 'yellow']);
  });

  it('keeps both icon slots when text is present', () => {
    const html = renderToStaticMarkup(<Badge startIcon={<svg />} endIcon={<svg />}>Статус</Badge>);
    expect((html.match(/cometal-badge__icon/g) ?? [])).toHaveLength(2);
    expect(html).not.toContain('data-icon-only');
  });

  it('collapses to one accessible icon-only composition', () => {
    const html = renderToStaticMarkup(
      <Badge aria-label="Статус подтверждён" startIcon={<svg />} endIcon={<span>ignored</span>} />,
    );
    expect(html).toContain('aria-label="Статус подтверждён"');
    expect(html).toContain('role="img"');
    expect(html).toContain('data-icon-only="true"');
    expect((html.match(/cometal-badge__icon/g) ?? [])).toHaveLength(1);
    expect(html).not.toContain('ignored');
  });

  it('rejects an icon-only composition without an accessible name', () => {
    expect(() => renderToStaticMarkup(<Badge startIcon={<svg />} />)).toThrow(
      'Badge requires aria-label when rendered without text.',
    );
  });
});
