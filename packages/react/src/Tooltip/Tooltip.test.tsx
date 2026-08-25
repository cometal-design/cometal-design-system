import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip semantics', () => {
  it('renders the open panel without introducing a server/client aria mismatch', () => {
    const open = renderToStaticMarkup(
      <Tooltip content="Подсказка" open><button type="button">Действие</button></Tooltip>,
    );
    const closed = renderToStaticMarkup(
      <Tooltip content="Подсказка" open={false}><button type="button">Действие</button></Tooltip>,
    );

    expect(open).toContain('role="tooltip"');
    expect(open).not.toContain('aria-describedby=');
    expect(closed).not.toContain('role="tooltip"');
    expect(closed).not.toContain('aria-describedby=');
  });
});
