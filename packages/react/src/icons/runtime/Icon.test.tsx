import { Fragment } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ArrowIcon, { definition as arrowDefinition } from '../generated/components/outline/arrows/arrow-curve-left-down';
import JcbIcon from '../generated/components/feature-icons-and-logos/payment/lg/jcb';
import VisaIcon, { definition as visaDefinition } from '../generated/components/feature-icons-and-logos/payment/lg/visa';
import { iconLoaders } from '../generated/loaders';
import { iconManifest, iconManifestMetadata } from '../generated/manifest';

describe('generated icon runtime', () => {
  it('renders decorative icons safely by default and informative icons from product labels', () => {
    const decorative = renderToStaticMarkup(<ArrowIcon className="example" />);
    const informative = renderToStaticMarkup(<ArrowIcon decorative={false} label="Вернуться" width={32} />);

    expect(decorative).toContain('aria-hidden="true"');
    expect(decorative).toContain('focusable="false"');
    expect(decorative).not.toContain('aria-label');
    expect(informative).toContain('role="img"');
    expect(informative).toContain('aria-label="Вернуться"');
    expect(informative).toContain('width="32"');
    expect(informative).not.toContain(arrowDefinition.canonicalName);
    expect(() => renderToStaticMarkup(<ArrowIcon decorative={false} label=" " />)).toThrow(/non-empty/);
  });

  it('preserves intrinsic brand paint and themes only audited monochrome sources', () => {
    const arrow = renderToStaticMarkup(<ArrowIcon />);
    const visa = renderToStaticMarkup(<VisaIcon />);
    expect(arrowDefinition.paintMode).toBe('currentColor');
    expect(arrow).toContain('stroke="currentColor"');
    expect(visaDefinition.paintMode).toBe('intrinsic');
    expect(visa).toContain('fill="#172B85"');
    expect(visa).toContain('fill="white"');
    expect(visa).not.toContain('currentColor');
  });

  it('creates unique, resolved definition IDs for repeated SSR instances', () => {
    const html = renderToStaticMarkup(<Fragment><JcbIcon /><JcbIcon /></Fragment>);
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]);
    const references = [...html.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]);
    expect(ids.length).toBeGreaterThan(1);
    expect(new Set(ids).size).toBe(ids.length);
    expect(references.every((reference) => ids.includes(reference))).toBe(true);
    expect(html).not.toContain('__COMETAL_ID__');
  });

  it('renders all 2810 direct modules to static markup', async () => {
    expect(iconManifestMetadata.total).toBe(2810);
    expect(iconManifest).toHaveLength(2810);
    expect(Object.keys(iconLoaders)).toHaveLength(2810);
    for (const record of iconManifest) {
      const module = await iconLoaders[record.canonicalName]();
      const html = renderToStaticMarkup(<module.default />);
      expect(module.definition.sourceSha256).toBe(record.sourceSha256);
      expect(html.startsWith('<svg')).toBe(true);
      expect(html).toContain(`viewBox="${record.viewBox.join(' ')}"`);
      expect(html).not.toContain('__COMETAL_ID__');
    }
  }, 120_000);

  it('keeps unsafe caller semantics out of the public type contract', () => {
    // @ts-expect-error informative icons require a product-owned label
    const missingLabel = <ArrowIcon decorative={false} />;
    // @ts-expect-error event handlers are intentionally excluded
    const interactive = <ArrowIcon onClick={() => undefined} />;
    // @ts-expect-error callers cannot replace the renderer body
    const injected = <ArrowIcon dangerouslySetInnerHTML={{ __html: '<script />' }} />;
    expect(missingLabel).toBeTruthy();
    expect(interactive).toBeTruthy();
    expect(injected).toBeTruthy();
  });
});
