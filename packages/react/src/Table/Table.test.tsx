import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
  it('binds the Table-local drag marker to the exact Figma 2778:8288 export proxy 2778:8292', () => {
    const asset = readFileSync(new URL('./assets/drag-handle.svg', import.meta.url));
    const source = asset.toString('utf8');

    expect(createHash('sha256').update(asset).digest('hex')).toBe('8f81f24ef877dc08ff635cb35c82f39204fdec88db95a4eb209a7498eb3a32b2');
    expect(source).toContain('<line x1="6.7" y1="8.3" x2="17.3" y2="8.3"');
    expect(source).toContain('<line x1="6.7" y1="14.3" x2="17.3" y2="14.3"');
    expect(source).not.toContain('M6 9H18M6 15H18');
  });

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
      <Table density="compact" mode="edit" aria-label="Выбор позиций">
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
    expect(html).toContain('<span class="cometal-table__asset-icon cometal-table__drag-icon" data-cometal-table-icon="drag-handle" aria-hidden="true"></span>');
    expect(html).not.toContain('M6 9H18M6 15H18');
    expect(html).toContain('data-summary-kind="empty"');
  });

  it('publishes the controlled row-reorder contract only when enabled', () => {
    const html = renderToStaticMarkup(
      <Table mode="edit" aria-label="Порядок позиций" onRowReorder={() => undefined}>
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

  it('propagates controlled column identity and pinned state across every table floor', () => {
    const html = renderToStaticMarkup(
      <Table aria-label="Закреплённые колонки" pinnedColumnIds={['position']} onPinnedColumnIdsChange={() => undefined} columnWidths={{ position: 240 }} onColumnWidthsChange={() => undefined}>
        <TableHead>
          <TableRow><TableHeaderCell columnId="position">Позиция</TableHeaderCell><TableHeaderCell columnId="name">Наименование</TableHeaderCell></TableRow>
          <TableFilterRow><TableFilterCell columnId="position"><input aria-label="Фильтр позиции" /></TableFilterCell><TableFilterCell columnId="name" /></TableFilterRow>
        </TableHead>
        <TableBody>
          <TableRow selected><TableCell columnId="position" state="selected">POS-001</TableCell><TableCell columnId="name" state="error">Лист</TableCell></TableRow>
          <TableRow><TableSummaryCell columnId="position" kind="label">Итого</TableSummaryCell><TableSummaryCell columnId="name" kind="value">1</TableSummaryCell></TableRow>
        </TableBody>
      </Table>,
    );

    expect(html.match(/data-column-id="position"/g)).toHaveLength(4);
    expect(html.match(/data-column-pinned="true"/g)).toHaveLength(4);
    expect(html.match(/data-column-pinned-last="true"/g)).toHaveLength(4);
    expect(html.match(/data-column-width="240"/g)).toHaveLength(4);
    expect(html).toContain('--cometal-table-pinned-left:0px');
    expect(html).toContain('--cometal-table-column-width:240px');
    expect(html).toContain('role="separator"');
    expect(html).toContain('aria-label="Изменить ширину колонки Позиция"');
    expect(html).toContain('aria-valuenow="240"');
    expect(html).toContain('data-state="selected"');
    expect(html).toContain('data-state="error"');
  });

  it('removes the drag column and disables reorder at the Table boundary in read mode', () => {
    const html = renderToStaticMarkup(
      <Table mode="read" aria-label="Только чтение" onRowReorder={() => undefined}>
        <TableHead><TableRow><TableHeaderCell kind="drag">Порядок</TableHeaderCell><TableHeaderCell>Название</TableHeaderCell></TableRow></TableHead>
        <TableBody><TableRow reorderId="POS-001"><TableDragCell><TableDragHandle rowLabel="POS-001" /></TableDragCell><TableCell>Лист</TableCell></TableRow></TableBody>
      </Table>,
    );

    expect(html).not.toContain('data-kind="drag"');
    expect(html).not.toContain('cometal-table__drag-cell');
    expect(html).not.toContain('data-reorderable="true"');
    expect(html).not.toContain('data-reorder-id="POS-001"');
  });

  it('declares the bounded body-row window on the native Table scroll region', () => {
    const html = renderToStaticMarkup(
      <Table aria-label="Окно строк" maxVisibleBodyRows={10}>
        <TableHead><TableRow><TableHeaderCell>Позиция</TableHeaderCell></TableRow></TableHead>
        <TableBody><TableRow><TableCell>POS-001</TableCell></TableRow></TableBody>
      </Table>,
    );

    expect(html).toContain('data-row-window="10"');
  });

  it('turns an editing TableCell into the textbox surface without a nested input', () => {
    const html = renderToStaticMarkup(
      <Table mode="edit" aria-label="Редактирование">
        <TableBody><TableRow><TableCell editable state="editing">Значение</TableCell></TableRow></TableBody>
      </Table>,
    );

    expect(html).toContain('contentEditable="true"');
    expect(html).toContain('role="textbox"');
    expect(html).toContain('aria-multiline="false"');
    expect(html).not.toContain('<input');
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
    expect(html.match(/data-cometal-component="button"/g)?.length).toBeGreaterThan(2);
    expect(html).toContain('data-cometal-icon-library="outline"');
    expect(html).toContain('data-cometal-component="field"');
    expect(html).toContain('data-size="m"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-haspopup="listbox"');
    expect(html).toContain('cometal-field__native-select');
    expect(html).not.toContain('<label class="cometal-table__page-size"');
  });

  it('paginates in windows of nine and reveals the next numbered window after page nine', () => {
    const firstWindow = renderToStaticMarkup(
      <TablePaginator page={1} pageCount={12} pageSize={10} onPageChange={() => undefined} onPageSizeChange={() => undefined} />,
    );
    const secondWindow = renderToStaticMarkup(
      <TablePaginator page={10} pageCount={12} pageSize={10} onPageChange={() => undefined} onPageSizeChange={() => undefined} />,
    );

    expect(firstWindow).toContain('aria-label="Страница 9"');
    expect(firstWindow).not.toContain('aria-label="Страница 10"');
    expect(firstWindow).toContain('cometal-table__page-ellipsis');
    expect(secondWindow).toContain('aria-label="Страница 10"');
    expect(secondWindow).toContain('aria-label="Страница 11"');
    expect(secondWindow).toContain('aria-label="Страница 12"');
    expect(secondWindow).not.toContain('aria-label="Страница 9"');
    expect(secondWindow).toContain('cometal-table__page-ellipsis');
  });
});
