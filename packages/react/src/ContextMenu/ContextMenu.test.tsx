import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ContextMenu, ContextMenuItem } from './ContextMenu';

describe('ContextMenu server rendering', () => {
  it('keeps defaultOpen hydration-safe until the client portal is mounted', () => {
    const html = renderToString(
      <ContextMenu defaultOpen trigger={<button type="button">Открыть</button>}>
        <ContextMenuItem>Действие</ContextMenuItem>
      </ContextMenu>,
    );

    expect(html).not.toContain('aria-expanded');
    expect(html).not.toContain('role="menu"');
  });
});
