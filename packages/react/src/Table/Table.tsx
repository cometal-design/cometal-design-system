import { forwardRef } from 'react';
import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import './table.css';

export const tableDensities = ['comfortable', 'compact'] as const;
export const tableCellStates = [
  'default',
  'active',
  'selected',
  'editing',
  'error',
  'disabled',
] as const;

export type TableDensity = (typeof tableDensities)[number];
export type TableCellState = (typeof tableCellStates)[number];

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  /** Accessible label for scrollable table regions without a visible caption. */
  'aria-label'?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { density = 'comfortable', className, ...tableProps },
  ref,
) {
  return (
    <div className="cometal-table-scroll" data-cometal-component="table-scroll">
      <table
        {...tableProps}
        ref={ref}
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
  return (
    <tr
      {...props}
      ref={ref}
      className={['cometal-table__row', className].filter(Boolean).join(' ')}
      data-row-selected={selected || undefined}
    />
  );
});

export type TableSortDirection = 'none' | 'ascending' | 'descending';

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sort?: TableSortDirection;
  /** Compact trailing action, normally the column context menu trigger. */
  action?: ReactNode;
  /** Optional second-floor control. All columns should expose this floor together. */
  filter?: ReactNode;
  kind?: 'default' | 'index' | 'selection';
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell(
    { sort = 'none', action, filter, kind = 'default', children, className, scope = 'col', ...props },
    ref,
  ) {
    return (
      <th
        {...props}
        ref={ref}
        scope={scope}
        aria-sort={sort === 'none' ? undefined : sort}
        className={['cometal-table__header-cell', className].filter(Boolean).join(' ')}
        data-kind={kind}
        data-sort={sort}
      >
        <div className="cometal-table__header-main">
          {sort !== 'none' ? <SortIcon direction={sort} /> : null}
          <span className="cometal-table__header-label">{children}</span>
          {action ? <span className="cometal-table__header-action">{action}</span> : null}
        </div>
        {filter ? <div className="cometal-table__header-filter">{filter}</div> : null}
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
  {
    state = 'default',
    align = 'start',
    leading,
    trailing,
    children,
    className,
    'aria-disabled': ariaDisabled,
    ...props
  },
  ref,
) {
  const disabled = state === 'disabled' || ariaDisabled === true;
  return (
    <td
      {...props}
      ref={ref}
      aria-disabled={disabled || undefined}
      aria-invalid={state === 'error' || undefined}
      className={['cometal-table__cell', className].filter(Boolean).join(' ')}
      data-state={state}
      data-align={align}
    >
      <div className="cometal-table__cell-content">
        {leading ? <span className="cometal-table__cell-leading">{leading}</span> : null}
        <span className="cometal-table__cell-value">{children}</span>
        {trailing ? <span className="cometal-table__cell-trailing">{trailing}</span> : null}
      </div>
    </td>
  );
});

export interface TableFileCellProps extends Omit<TableCellProps, 'children' | 'leading'> {
  fileName: string;
  fileSize?: string;
  icon?: ReactNode;
}

export const TableFileCell = forwardRef<HTMLTableCellElement, TableFileCellProps>(
  function TableFileCell({ fileName, fileSize, icon = <FileIcon />, className, ...props }, ref) {
    return (
      <TableCell {...props} ref={ref} className={['cometal-table__file-cell', className].filter(Boolean).join(' ')}>
        <span className="cometal-table__file-icon" aria-hidden="true">{icon}</span>
        <span className="cometal-table__file-copy">
          <span className="cometal-table__file-name" title={fileName}>{fileName}</span>
          {fileSize ? <span className="cometal-table__file-size">{fileSize}</span> : null}
        </span>
      </TableCell>
    );
  },
);

export function FileIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M7 3.5h6.8L18 7.7v12.8H7z" fill="none" stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140, 1.4)" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 3.8v4.4h4.3" fill="none" stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140, 1.4)" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortIcon({ direction }: { direction: Exclude<TableSortDirection, 'none'> }) {
  const down = direction === 'descending';
  return (
    <svg className="cometal-table__sort-icon" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <path d={down ? 'M8 3.5v9M4.5 9 8 12.5 11.5 9' : 'M8 12.5v-9M4.5 7 8 3.5 11.5 7'} fill="none" stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140, 1.4)" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
