import { forwardRef } from 'react';
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import { Checkbox } from '../Selection/Selection';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import DotHorizontalFilledIcon from '../icons/generated/components/filled/general/dot-horizontal-filled';
import ArrowLeftIcon from '../icons/generated/components/outline/arrows/arrow-left';
import ArrowRightIcon from '../icons/generated/components/outline/arrows/arrow-right';
import ArrowUpSmallIcon from '../icons/generated/components/outline/arrows/arrow-up-sm';
import ArrowDownSmallIcon from '../icons/generated/components/outline/arrows/down-arrow-sm';
import wordFileAsset from './assets/file-word.svg';
import excelFileAsset from './assets/file-excel.svg';
import genericFileAsset from './assets/file-generic.svg';
import docFileAsset from './assets/file-doc.svg';
import sheetsFileAsset from './assets/file-sheets.svg';
import adobeFileAsset from './assets/file-adobe.svg';
import zipFileAsset from './assets/file-zip.svg';
import pdfFileAsset from './assets/file-pdf.svg';
import imageFileAsset from './assets/file-image.svg';
import './table.css';

export const tableDensities = ['comfortable', 'compact'] as const;
export const tableCellStates = ['default', 'hover', 'active', 'selected', 'editing', 'error', 'dragging', 'disabled'] as const;
export const tableFileTypes = ['word', 'excel', 'file', 'doc', 'sheets', 'adobe', 'zip', 'pdf', 'image'] as const;

export type TableDensity = (typeof tableDensities)[number];
export type TableCellState = (typeof tableCellStates)[number];
export type TableFileType = (typeof tableFileTypes)[number];

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  /** Accessible label for the internally scrollable table region. */
  'aria-label': string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { density = 'comfortable', className, 'aria-label': ariaLabel, ...tableProps },
  ref,
) {
  return (
    <div className="cometal-table-scroll" data-cometal-component="table-scroll" role="region" aria-label={`Прокрутка: ${ariaLabel}`} tabIndex={0}>
      <table
        {...tableProps}
        ref={ref}
        aria-label={ariaLabel}
        className={['cometal-table', className].filter(Boolean).join(' ')}
        data-cometal-component="table"
        data-density={density}
      />
    </div>
  );
});

export const TableHead = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHead({ className, ...props }, ref) {
    return <thead {...props} ref={ref} className={['cometal-table__head', className].filter(Boolean).join(' ')} />;
  },
);

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...props }, ref) {
    return <tbody {...props} ref={ref} className={['cometal-table__body', className].filter(Boolean).join(' ')} />;
  },
);

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Row selection is distinct from the current keyboard-selected cell. */
  selected?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected = false, className, ...props },
  ref,
) {
  return <tr {...props} ref={ref} className={['cometal-table__row', className].filter(Boolean).join(' ')} data-row-selected={selected || undefined} />;
});

export type TableSortDirection = 'none' | 'ascending' | 'descending';

export function getNextTableSortDirection(current: TableSortDirection): TableSortDirection {
  if (current === 'none') return 'ascending';
  if (current === 'ascending') return 'descending';
  return 'none';
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sort?: TableSortDirection;
  onSortChange?: (sort: TableSortDirection) => void;
  /** Compact trailing action, normally `TableContextAction`. */
  action?: ReactNode;
  kind?: 'default' | 'index' | 'selection' | 'drag';
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell(
    { sort = 'none', onSortChange, action, kind = 'default', children, className, scope = 'col', ...props },
    ref,
  ) {
    const label = typeof children === 'string' ? children : 'колонку';
    const nextSort = getNextTableSortDirection(sort);
    const content = (
      <>
        {sort === 'ascending' ? <ArrowUpSmallIcon className="cometal-table__asset-icon cometal-table__sort-icon" width={16} height={16} /> : null}
        {sort === 'descending' ? <ArrowDownSmallIcon className="cometal-table__asset-icon cometal-table__sort-icon" width={16} height={16} /> : null}
        <span className="cometal-table__header-label">{children}</span>
      </>
    );

    return (
      <th {...props} ref={ref} scope={scope} aria-sort={sort === 'none' ? undefined : sort} className={['cometal-table__header-cell', className].filter(Boolean).join(' ')} data-kind={kind} data-sort={sort}>
        <div className="cometal-table__header-main">
          {onSortChange ? (
            <button className="cometal-table__sort-button" type="button" onClick={() => onSortChange(nextSort)} aria-label={`Сортировать ${label}: ${nextSort === 'ascending' ? 'по возрастанию' : nextSort === 'descending' ? 'по убыванию' : 'отключить сортировку'}`}>
              {content}
            </button>
          ) : content}
          {action ? <span className="cometal-table__header-action">{action}</span> : null}
        </div>
      </th>
    );
  },
);

export const TableFilterRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  function TableFilterRow({ className, ...props }, ref) {
    return <tr {...props} ref={ref} className={['cometal-table__filter-row', className].filter(Boolean).join(' ')} />;
  },
);

export interface TableFilterCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  kind?: 'default' | 'index' | 'selection' | 'drag';
}

export const TableFilterCell = forwardRef<HTMLTableCellElement, TableFilterCellProps>(
  function TableFilterCell({ kind = 'default', children, className, 'aria-label': ariaLabel, ...props }, ref) {
    const emptyLabel = kind === 'drag' ? 'Без фильтра перемещения' : kind === 'index' ? 'Без фильтра номера' : kind === 'selection' ? 'Без фильтра выбора' : 'Без фильтра';
    return (
      <th {...props} ref={ref} className={['cometal-table__filter-cell', className].filter(Boolean).join(' ')} data-kind={kind}>
        {children ? (
          <div className="cometal-table__filter-control">{children}</div>
        ) : (
          <span className="cometal-table__visually-hidden">{ariaLabel ?? emptyLabel}</span>
        )}
      </th>
    );
  },
);

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  state?: TableCellState;
  align?: 'start' | 'center' | 'end';
  leading?: ReactNode;
  trailing?: ReactNode;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { state = 'default', align = 'start', leading, trailing, children, className, 'aria-disabled': ariaDisabled, ...props },
  ref,
) {
  const disabled = state === 'disabled' || ariaDisabled === true;
  return (
    <td {...props} ref={ref} aria-disabled={disabled || undefined} aria-invalid={state === 'error' || undefined} className={['cometal-table__cell', className].filter(Boolean).join(' ')} data-state={state} data-align={align}>
      <div className="cometal-table__cell-content">
        {leading ? <span className="cometal-table__cell-leading">{leading}</span> : null}
        <span className="cometal-table__cell-value">{children}</span>
        {trailing ? <span className="cometal-table__cell-trailing">{trailing}</span> : null}
      </div>
    </td>
  );
});

export interface TableSelectionHeaderProps extends Omit<TableHeaderCellProps, 'children' | 'kind' | 'sort' | 'onSortChange'> {
  selectedCount: number;
  totalCount: number;
  onSelectionChange: (selected: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const TableSelectionHeader = forwardRef<HTMLTableCellElement, TableSelectionHeaderProps>(
  function TableSelectionHeader({ selectedCount, totalCount, onSelectionChange, label = 'Выбрать все строки', disabled = false, ...props }, ref) {
    const checked = totalCount > 0 && selectedCount === totalCount;
    const indeterminate = selectedCount > 0 && !checked;
    return (
      <TableHeaderCell {...props} ref={ref} kind="selection">
        <Checkbox className="cometal-table__checkbox" label={label} size="l" checked={checked} indeterminate={indeterminate} disabled={disabled} onChange={(event) => onSelectionChange(event.currentTarget.checked)} />
      </TableHeaderCell>
    );
  },
);

export interface TableSelectionCellProps extends Omit<TableCellProps, 'children' | 'leading' | 'trailing' | 'align'> {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const TableSelectionCell = forwardRef<HTMLTableCellElement, TableSelectionCellProps>(
  function TableSelectionCell({ label, checked, defaultChecked, onCheckedChange, disabled = false, className, ...props }, ref) {
    return (
      <TableCell {...props} ref={ref} align="center" className={['cometal-table__selection-cell', className].filter(Boolean).join(' ')}>
        <Checkbox className="cometal-table__checkbox" label={label} size="l" checked={checked} defaultChecked={defaultChecked} disabled={disabled} onChange={(event) => onCheckedChange?.(event.currentTarget.checked)} />
      </TableCell>
    );
  },
);

export const TableIndexCell = forwardRef<HTMLTableCellElement, Omit<TableCellProps, 'align'>>(
  function TableIndexCell({ className, ...props }, ref) {
    return <TableCell {...props} ref={ref} align="center" className={['cometal-table__index-cell', className].filter(Boolean).join(' ')} />;
  },
);

export interface TableDragHandleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  rowLabel: string;
}

export const TableDragHandle = forwardRef<HTMLButtonElement, TableDragHandleProps>(
  function TableDragHandle({ rowLabel, className, ...props }, ref) {
    return <button {...props} ref={ref} type="button" className={['cometal-table__drag-handle', className].filter(Boolean).join(' ')} aria-label={`Переместить строку ${rowLabel}`}><TableDragHandleIcon /></button>;
  },
);

export const TableDragCell = forwardRef<HTMLTableCellElement, Omit<TableCellProps, 'align'>>(
  function TableDragCell({ className, ...props }, ref) {
    return <TableCell {...props} ref={ref} align="center" className={['cometal-table__drag-cell', className].filter(Boolean).join(' ')} />;
  },
);

export interface TableContextActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  menu: ReactNode;
  label?: string;
  menuLabel?: string;
  /** Documentation and controlled compositions can expose the approved Open state. */
  defaultOpen?: boolean;
}

export const TableContextAction = forwardRef<HTMLButtonElement, TableContextActionProps>(
  function TableContextAction({ menu, label = 'Открыть действия колонки', menuLabel = 'Действия колонки', defaultOpen = false, className, ...props }, ref) {
    return (
      <ContextMenu aria-label={menuLabel} defaultOpen={defaultOpen} trigger={<button {...props} ref={ref} className={['cometal-table__context-action', className].filter(Boolean).join(' ')} type="button" aria-label={label}><DotHorizontalFilledIcon className="cometal-table__asset-icon cometal-table__context-icon" width={16} height={16} /></button>}>
        {menu}
      </ContextMenu>
    );
  },
);

export interface TableFileIconProps extends HTMLAttributes<HTMLImageElement> {
  type?: TableFileType;
}

const fileAssets: Record<TableFileType, string> = { word: wordFileAsset, excel: excelFileAsset, file: genericFileAsset, doc: docFileAsset, sheets: sheetsFileAsset, adobe: adobeFileAsset, zip: zipFileAsset, pdf: pdfFileAsset, image: imageFileAsset };

export const TableFileIcon = forwardRef<HTMLImageElement, TableFileIconProps>(
  function TableFileIcon({ type = 'file', className, ...props }, ref) {
    return <img {...props} ref={ref} className={['cometal-table__file-asset', className].filter(Boolean).join(' ')} data-file-type={type} src={fileAssets[type]} alt="" aria-hidden="true" />;
  },
);

export interface TableFileCellProps extends Omit<TableCellProps, 'children' | 'leading'> {
  fileName: string;
  fileSize?: string;
  fileType?: TableFileType;
  icon?: ReactNode;
}

export const TableFileCell = forwardRef<HTMLTableCellElement, TableFileCellProps>(
  function TableFileCell({ fileName, fileSize, fileType = 'file', icon, className, ...props }, ref) {
    return (
      <TableCell {...props} ref={ref} className={['cometal-table__file-cell', className].filter(Boolean).join(' ')}>
        <span className="cometal-table__file-icon" aria-hidden="true">{icon ?? <TableFileIcon type={fileType} />}</span>
        <span className="cometal-table__file-copy"><span className="cometal-table__file-name" title={fileName}>{fileName}</span>{fileSize ? <span className="cometal-table__file-size">{fileSize}</span> : null}</span>
      </TableCell>
    );
  },
);

/** Compatibility alias. Prefer `TableFileIcon` for exact file type swaps. */
export function FileIcon() {
  return <TableFileIcon type="file" />;
}

export interface TableSummaryCellProps extends TableCellProps {
  kind?: 'empty' | 'label' | 'value';
}

export const TableSummaryCell = forwardRef<HTMLTableCellElement, TableSummaryCellProps>(
  function TableSummaryCell({ kind = 'value', className, children, ...props }, ref) {
    return <TableCell {...props} ref={ref} className={['cometal-table__summary-cell', className].filter(Boolean).join(' ')} data-summary-kind={kind}>{kind === 'empty' ? null : children}</TableCell>;
  },
);

export interface TablePaginatorProps extends HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: readonly number[];
  onPageSizeChange?: (pageSize: number) => void;
}

function getPaginatorItems(page: number, pageCount: number): Array<number | 'ellipsis-start' | 'ellipsis-end'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const items: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [1];
  if (page > 4) items.push('ellipsis-start');
  const start = Math.max(2, Math.min(page - 1, pageCount - 4));
  const end = Math.min(pageCount - 1, Math.max(page + 1, 5));
  for (let value = start; value <= end; value += 1) items.push(value);
  if (page < pageCount - 3) items.push('ellipsis-end');
  items.push(pageCount);
  return items;
}

export const TablePaginator = forwardRef<HTMLElement, TablePaginatorProps>(function TablePaginator(
  { page, pageCount, onPageChange, pageSize, pageSizeOptions = [10, 15, 20, 30], onPageSizeChange, className, 'aria-label': ariaLabel = 'Пагинация таблицы', ...props },
  ref,
) {
  const safePageCount = Math.max(1, pageCount);
  const safePage = Math.min(Math.max(1, page), safePageCount);
  return (
    <nav {...props} ref={ref} className={['cometal-table__paginator', className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <div className="cometal-table__paginator-spacer" aria-hidden="true" />
      <div className="cometal-table__paginator-controls">
        <button type="button" className="cometal-table__page-control" disabled={safePage === 1} onClick={() => onPageChange(safePage - 1)} aria-label="Предыдущая страница"><ArrowLeftIcon className="cometal-table__asset-icon cometal-table__paginator-icon" width={24} height={24} /></button>
        {getPaginatorItems(safePage, safePageCount).map((item) => typeof item === 'number' ? (
          <button key={item} type="button" className="cometal-table__page-control" data-current={item === safePage || undefined} aria-current={item === safePage ? 'page' : undefined} onClick={() => onPageChange(item)} aria-label={`Страница ${item}`}>{item}</button>
        ) : <span key={item} className="cometal-table__page-ellipsis" aria-hidden="true">…</span>)}
        <button type="button" className="cometal-table__page-control" disabled={safePage === safePageCount} onClick={() => onPageChange(safePage + 1)} aria-label="Следующая страница"><ArrowRightIcon className="cometal-table__asset-icon cometal-table__paginator-icon" width={24} height={24} /></button>
      </div>
      <label className="cometal-table__page-size"><span>Строк</span><select value={pageSize} onChange={(event) => onPageSizeChange?.(Number(event.currentTarget.value))} disabled={!onPageSizeChange} aria-label="Строк на странице">{pageSizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
    </nav>
  );
});

function TableDragHandleIcon() {
  return (
    <svg className="cometal-table__asset-icon cometal-table__drag-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" data-cometal-table-icon="drag-handle" aria-hidden="true" focusable="false">
      <path d="M6 9H18M6 15H18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
