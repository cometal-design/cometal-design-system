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
  TableFileIcon,
  TableFilterAction,
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
  reorderTableRows,
  tableFileTypes,
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
    expect(comfortable).toContain('data-cometal-icon-library="feature-icons-and-logos"');
    expect(comfortable).not.toContain('<img');
  });

  it('maps every file type to the generated canonical icon library', () => {
    const html = renderToStaticMarkup(<>{tableFileTypes.map((type) => <TableFileIcon key={type} type={type} />)}</>);

    expect((html.match(/data-cometal-icon-library="feature-icons-and-logos"/g) ?? [])).toHaveLength(tableFileTypes.length);
    for (const type of tableFileTypes) expect(html).toContain(`data-file-type="${type}"`);
    expect(html).not.toContain('<img');
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

  it('publishes read/edit interaction modes, filter actions and row menu identities', () => {
    const html = renderToStaticMarkup(
      <Table mode="edit" aria-label="Редактирование" rowContextMenu={() => <ContextMenuItem>Открыть</ContextMenuItem>}>
        <TableHead><TableFilterRow><TableFilterCell action={<TableFilterAction label="Позиция" menu={<ContextMenuItem>Содержит</ContextMenuItem>} />}><input aria-label="Фильтр" /></TableFilterCell></TableFilterRow></TableHead>
        <TableBody><TableRow rowId="POS-001"><TableCell editable onEditStart={() => undefined}>Значение</TableCell></TableRow></TableBody>
      </Table>,
    );

    expect(html).toContain('data-mode="edit"');
    expect(html).toContain('data-row-context-menu="true"');
    expect(html).toContain('data-row-id="POS-001"');
    expect(html).toContain('data-editable="true"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('cometal-table__filter-action-button');
    expect(html).toContain('width="12" height="12"');
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

  it('publishes the controlled row-reorder contract only when enabled', () => {
    const html = renderToStaticMarkup(
      <Table aria-label="Порядок позиций" onRowReorder={() => undefined}>
        <TableBody>
          <TableRow reorderId="POS-001">
            <TableDragCell><TableDragHandle rowLabel="POS-001" /></TableDragCell>
            <TableCell>Лист</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(html).toContain('data-reorderable="true"');
    expect(html).toContain('data-reorder-id="POS-001"');
    expect(html).toContain('data-reorder-handle="true"');
    expect(html).toContain('Нажмите Пробел или Enter');
    expect(html).toContain('aria-live="polite"');
  });

  it('moves immutable business rows before or after the target', () => {
    const rows = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];

    expect(reorderTableRows(rows, { activeId: 'a', overId: 'c', position: 'after' }, (row) => row.id).map((row) => row.id)).toEqual(['b', 'c', 'a', 'd']);
    expect(reorderTableRows(rows, { activeId: 'd', overId: 'b', position: 'before' }, (row) => row.id).map((row) => row.id)).toEqual(['a', 'd', 'b', 'c']);
    expect(rows.map((row) => row.id)).toEqual(['a', 'b', 'c', 'd']);
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
    expect(html).not.toContain('aria-haspopup="menu"');
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
