import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Table, TableBody, TableFileCell, TableHeaderCell, TableHead, TableRow } from './Table';

describe('Table', () => {
  it('keeps file metadata in the DOM across density variants', () => {
    const comfortable = renderToStaticMarkup(
      <Table density="comfortable" aria-label="Документы">
        <TableBody><TableRow><TableFileCell fileName="specification.pdf" fileSize="130 KB" /></TableRow></TableBody>
      </Table>,
    );
    const compact = renderToStaticMarkup(
      <Table density="compact" aria-label="Документы">
        <TableBody><TableRow><TableFileCell fileName="specification.pdf" fileSize="130 KB" /></TableRow></TableBody>
      </Table>,
    );

    expect(comfortable).toContain('data-density="comfortable"');
    expect(compact).toContain('data-density="compact"');
    expect(comfortable).toContain('specification.pdf');
    expect(compact).toContain('specification.pdf');
    expect(comfortable).toContain('130 KB');
    expect(compact).toContain('130 KB');
  });

  it('uses native table semantics and exposes sorting', () => {
    const html = renderToStaticMarkup(
      <Table aria-label="Позиции">
        <TableHead><TableRow><TableHeaderCell sort="ascending">Позиция</TableHeaderCell></TableRow></TableHead>
        <TableBody><TableRow><TableFileCell fileName="offer.pdf" /></TableRow></TableBody>
      </Table>,
    );

    expect(html).toContain('<table');
    expect(html).toContain('<th scope="col" aria-sort="ascending"');
    expect(html).toContain('<td');
    expect(html).toContain('stroke-width="var(--cometal-primitive-stroke-140, 1.4)"');
  });
});
