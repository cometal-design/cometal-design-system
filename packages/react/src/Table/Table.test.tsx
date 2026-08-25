import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  Table,
  TableBody,
  TableCell,
  TableContextAction,
  TableDragCell,
  TableDragHandle,
  TableFileCell,
  TableFilterCell,
  TableFilterRow,
  TableHeaderCell,
  TableHead,
  TableIndexCell,
  TablePaginator,
  TableRow,
  TableSelectionCell,
  TableSelectionHeader,
  TableSummaryCell,
  getNextTableSortDirection,
} from './Table';
import { ContextMenuItem } from '../ContextMenu/ContextMenu';

describe('Table', () => {
  it('keeps file content and the exact icon swap in the DOM across densities', () => {
    const renderFile = (density: 'comfortable' | 'compact') => renderToStaticMarkup(
      <Table density={density} aria-label="Документы">
        <TableBody><TableRow><TableFileCell fileName="specification.pdf" fileSize="130 KB" fileType="pdf" /></TableRow></TableBody>
      </Table>,
    );
    const comfortable = renderFile('comfortable');
    const compact = renderFile('compact');

    expect(comfortable).toContain('data-density="comfortable"');
    expect(compact).toContain('data-density="compact"');
    expect(comfortable).toContain('specification.pdf');
    expect(compact).toContain('specification.pdf');
    expect(comfortable).toContain('130 KB');
    expect(compact).toContain('130 KB');
    expect(comfortable).toContain('data-file-type="pdf"');
  });

  it('uses two native header rows for labels and the synchronized filter floor', () => {
    const html = renderToStaticMarkup(
      <Table aria-label="Позиции">
        <TableHead>
          <TableRow><TableHeaderCell sort="ascending">Позиция</TableHeaderCell></TableRow>
          <TableFilterRow><TableFilterCell><input aria-label="Фильтр позиции" /></TableFilterCell></TableFilterRow>
        </TableHead>
        <TableBody><TableRow><TableCell>POS-001</TableCell></TableRow></TableBody>
      </Table>,
    );

    expect(html).toContain('<table');
    expect(html).toContain('<th scope="col" aria-sort="ascending"');
    expect(html).toContain('cometal-table__filter-row');
    expect(html).toContain('Фильтр позиции');
    expect(html).not.toContain('cometal-table__header-filter');
  });

  it('keeps source utility families semantic and density-owned', () => {
    const html = renderToStaticMarkup(
      <Table density="compact" aria-label="Выбор позиций">
        <TableHead>
          <TableRow>
            <TableHeaderCell kind="index">№</TableHeaderCell>
            <TableSelectionHeader selectedCount={1} totalCount={3} onSelectionChange={() => undefined} />
            <TableHeaderCell kind="drag">Порядок</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow selected>
            <TableIndexCell>1</TableIndexCell>
            <TableSelectionCell label="Выбрать строку 1" checked onCheckedChange={() => undefined} />
            <TableDragCell><TableDragHandle rowLabel="1" /></TableDragCell>
          </TableRow>
          <TableRow>
            <TableSummaryCell kind="label">Итого</TableSummaryCell>
            <TableSummaryCell kind="empty" />
            <TableSummaryCell kind="value">1</TableSummaryCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(html).toContain('aria-checked="mixed"');
    expect(html).toContain('data-row-selected="true"');
    expect(html).toContain('Переместить строку 1');
    expect(html).toContain('cometal-table__selection-cell');
    expect(html).toContain('data-cometal-table-icon="drag-handle"');
    expect(html).toContain('d="M6 9H18M6 15H18"');
    expect(html).toContain('stroke-width="1.4"');
    expect(html).toContain('data-summary-kind="empty"');
  });

  it('renders canonical currentColor icons without data URL masks', () => {
    const html = renderToStaticMarkup(
      <Table aria-label="Иконки таблицы">
        <TableHead><TableRow>
          <TableHeaderCell sort="ascending">Ascending</TableHeaderCell>
          <TableHeaderCell sort="descending" action={<TableContextAction label="Действия" menu={<ContextMenuItem>Скрыть</ContextMenuItem>} />}>Descending</TableHeaderCell>
        </TableRow></TableHead>
      </Table>,
    );

    expect(html).toContain('data-cometal-icon-library="outline"');
    expect(html).toContain('data-cometal-icon-library="filled"');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('mask-image');
    expect(html).not.toContain('data:image/svg+xml');
  });

  it('cycles sorting in the approved order', () => {
    expect(getNextTableSortDirection('none')).toBe('ascending');
    expect(getNextTableSortDirection('ascending')).toBe('descending');
    expect(getNextTableSortDirection('descending')).toBe('none');
  });

  it('exposes accessible paginator states without turning row counts into Table variants', () => {
    const html = renderToStaticMarkup(
      <TablePaginator page={2} pageCount={9} pageSize={15} onPageChange={() => undefined} onPageSizeChange={() => undefined} />,
    );
    expect(html).toContain('aria-label="Пагинация таблицы"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Предыдущая страница"');
    expect(html).toContain('cometal-table__paginator-icon');
    expect(html).toContain('width="24" height="24"');
    expect(html).toContain('data-cometal-icon-library="outline"');
    expect(html).toContain('data-cometal-component="field"');
    expect(html).toContain('data-size="m"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('cometal-field__native-select');
    expect(html).not.toContain('<label class="cometal-table__page-size"');
  });
});
