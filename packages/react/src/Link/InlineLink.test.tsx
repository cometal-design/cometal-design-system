import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InlineLink } from './InlineLink';

describe('InlineLink', () => {
  it('keeps native link semantics and optional touch target', () => {
    const html = renderToStaticMarkup(
      <InlineLink href="/storybook/" touchTarget>
        Storybook
      </InlineLink>,
    );

    expect(html).toContain('<a');
    expect(html).toContain('href="/storybook/"');
    expect(html).toContain('data-cometal-component="inline-link"');
    expect(html).toContain('data-touch-target="true"');
  });
});
