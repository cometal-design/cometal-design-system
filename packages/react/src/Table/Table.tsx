import { createContext, forwardRef, useContext, useId, useMemo, useState } from 'react';
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  SVGAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import { Checkbox } from '../Selection/Selection';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import { Select } from '../Field/Field';
import DotHorizontalFilledIcon from '../icons/generated/components/filled/general/dot-horizontal-filled';
import FilterIcon from '../icons/generated/components/outline/general/filter';
import ArrowLeftIcon from '../icons/generated/components/outline/arrows/arrow-left';
import ArrowRightIcon from '../icons/generated/components/outline/arrows/arrow-right';
import ArrowUpSmallIcon from '../icons/generated/components/outline/arrows/arrow-up-sm';
import ArrowDownSmallIcon from '../icons/generated/components/outline/arrows/down-arrow-sm';
import WordFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/word';
import ExcelFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/excel';
import GenericFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/file';
import DocFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/doc';
import SheetsFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/sheets';
import AdobeFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/adobe';
import ZipFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/zip';
import PdfFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/pdf';
import ImageFileIcon from '../icons/generated/components/feature-icons-and-logos/file-icon/image';
import './table.css';

export const tableDensities = ['comfortable', 'compact'] as const;
export const tableCellStates = ['default', 'hover', 'active', 'selected', 'editing', 'error', 'dragging', 'disabled'] as const;
export const tableFileTypes = ['word', 'excel', 'file', 'doc', 'sheets', 'adobe', 'zip', 'pdf', 'image'] as const;

export type TableDensity = (typeof tableDensities)[number];
export type TableCellState = (typeof tableCellStates)[number];
export type TableFileType = (typeof tableFileTypes)[number];
export type TableMode = 'read' | 'edit';
export type TableRowDropPosition = 'before' | 'after';

export interface TableRowReorderEvent {
  activeId: string;
  overId: string;
  position: TableRowDropPosition;
}

/** Applies a controlled reorder event to immutable business rows. */
export function reorderTableRows<Row>(
  rows: readonly Row[],
  event: TableRowReorderEvent,
  getRowId: (row: Row) => string,
): Row[] {
  const sourceIndex = rows.findIndex((row) => getRowId(row) === event.activeId);
  const targetIndex = rows.findIndex((row) => getRowId(row) === event.overId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return [...rows];

  const next = [...rows];
  const [moved] = next.splice(sourceIndex, 1);
  const resolvedTarget = next.findIndex((row) => getRowId(row) === event.overId);
  next.splice(resolvedTarget + (event.position === 'after' ? 1 : 0), 0, moved);
  return next;
}

interface TableReorderContextValue {
  activeId: string | null;
  interaction: 'pointer' | 'keyboard' | null;
  overId: string | null;
  position: TableRowDropPosition | null;
  instructionId: string;
  startPointerDrag: (rowId: string, rowLabel: string) => void;
  movePointerDrag: (event: ReactPointerEvent<HTMLElement>) => void;
  endPointerDrag: () => void;
  handleKeyboard: (event: ReactKeyboardEvent<HTMLButtonElement>, rowId: string, rowLabel: string) => void;
}

const TableReorderContext = createContext<TableReorderContextValue | null>(null);
const TableRowReorderIdContext = createContext<string | null>(null);
const TableModeContext = createContext<TableMode>('read');

type TableRowMenuState = { rowId: string; x: number; y: number };

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  /** Read tables highlight a whole row; edit tables expose cell-level interaction. */
  mode?: TableMode;
  /** Accessible label for the internally scrollable table region. */
  'aria-label': string;
  /** Controlled row-order mutation. Rows participate when they expose a stable `reorderId`. */
  onRowReorder?: (event: TableRowReorderEvent) => void;
  /** Renders the shared DS context menu opened by right-clicking a row. */
  rowContextMenu?: (rowId: string) => ReactNode;
  rowContextMenuLabel?: (rowId: string) => string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    density = 'comfortable',
    mode = 'read',
    className,
    'aria-label': ariaLabel,
    onRowReorder,
    rowContextMenu,
    rowContextMenuLabel = (rowId) => `Действия строки ${rowId}`,
    onContextMenu,
    ...tableProps
  },
  ref,
) {
  const instructionId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [interaction, setInteraction] = useState<'pointer' | 'keyboard' | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [position, setPosition] = useState<TableRowDropPosition | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [rowMenu, setRowMenu] = useState<TableRowMenuState | null>(null);

  const resetReorder = () => {
    setActiveId(null);
    setInteraction(null);
    setOverId(null);
    setPosition(null);
  };

  const reorderContext = useMemo<TableReorderContextValue | null>(() => {
    if (!onRowReorder) return null;

    return {
      activeId,
      interaction,
      overId,
      position,
      instructionId,
      startPointerDrag(rowId, rowLabel) {
        setActiveId(rowId);
        setInteraction('pointer');
        setOverId(null);
        setPosition(null);
        setAnnouncement(`Строка ${rowLabel} поднята для перемещения.`);
      },
      movePointerDrag(event) {
        if (!activeId || interaction !== 'pointer') return;
        const target = event.currentTarget.ownerDocument.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLTableRowElement>('tr[data-reorder-id]');
        const targetId = target?.dataset.reorderId;
        const belongsToCurrentTable = target?.closest('.cometal-table-scroll') === event.currentTarget;
        if (!target || !targetId || targetId === activeId || !belongsToCurrentTable) {
          setOverId(null);
          setPosition(null);
          return;
        }
        const bounds = target.getBoundingClientRect();
        const nextPosition = event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after';
        setOverId(targetId);
        setPosition(nextPosition);
      },
      endPointerDrag() {
        if (!activeId || interaction !== 'pointer' || !overId || !position) {
          resetReorder();
          return;
        }
        onRowReorder({ activeId, overId, position });
        setAnnouncement(`Строка ${activeId} перемещена ${position === 'before' ? 'перед' : 'после'} строки ${overId}.`);
        resetReorder();
      },
      handleKeyboard(event, rowId, rowLabel) {
        if (event.key === ' ' || event.key === 'Space' || event.key === 'Spacebar' || event.key === 'Enter') {
          event.preventDefault();
          if (activeId === rowId && interaction === 'keyboard') {
            setAnnouncement(`Перемещение строки ${rowLabel} завершено.`);
            resetReorder();
          } else {
            setActiveId(rowId);
            setInteraction('keyboard');
            setOverId(null);
            setPosition(null);
            setAnnouncement(`Строка ${rowLabel} выбрана. Используйте стрелки вверх и вниз для перемещения.`);
          }
          return;
        }

        if (event.key === 'Escape' && activeId === rowId && interaction === 'keyboard') {
          event.preventDefault();
          setAnnouncement(`Перемещение строки ${rowLabel} завершено.`);
          resetReorder();
          return;
        }

        if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && activeId === rowId && interaction === 'keyboard') {
          const rows = Array.from(event.currentTarget.closest('table')?.querySelectorAll<HTMLTableRowElement>('tbody tr[data-reorder-id]') ?? []);
          const currentIndex = rows.findIndex((row) => row.dataset.reorderId === rowId);
          const targetIndex = currentIndex + (event.key === 'ArrowUp' ? -1 : 1);
          const targetId = rows[targetIndex]?.dataset.reorderId;
          event.preventDefault();
          if (!targetId) {
            setAnnouncement(`Строка ${rowLabel} уже находится у края таблицы.`);
            return;
          }
          const nextPosition: TableRowDropPosition = event.key === 'ArrowUp' ? 'before' : 'after';
          onRowReorder({ activeId: rowId, overId: targetId, position: nextPosition });
          setAnnouncement(`Строка ${rowLabel} перемещена ${event.key === 'ArrowUp' ? 'выше' : 'ниже'}.`);
        }
      },
    };
  }, [activeId, instructionId, interaction, onRowReorder, overId, position]);

  const openRowMenu = (event: ReactMouseEvent<HTMLTableElement>) => {
    onContextMenu?.(event);
    if (!rowContextMenu || event.defaultPrevented) return;
    const row = (event.target as Element).closest<HTMLTableRowElement>('tbody tr[data-row-id]');
    const rowId = row?.dataset.rowId;
    if (!rowId || row?.closest('table') !== event.currentTarget) return;
    event.preventDefault();
    setRowMenu({ rowId, x: event.clientX, y: event.clientY });
  };

  return (
    <TableModeContext.Provider value={mode}>
    <TableReorderContext.Provider value={reorderContext}>
      <div
        className="cometal-table-scroll"
        data-cometal-component="table-scroll"
        role="region"
        aria-label={`Прокрутка: ${ariaLabel}`}
        tabIndex={0}
        onPointerMove={(event) => reorderContext?.movePointerDrag(event)}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          reorderContext?.endPointerDrag();
        }}
        onPointerCancel={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          reorderContext?.endPointerDrag();
        }}
      >
        <table
          {...tableProps}
          ref={ref}
          aria-label={ariaLabel}
          className={['cometal-table', className].filter(Boolean).join(' ')}
          data-cometal-component="table"
          data-density={density}
          data-mode={mode}
          data-reorderable={onRowReorder ? true : undefined}
          data-row-context-menu={rowContextMenu ? true : undefined}
          onContextMenu={openRowMenu}
        />
        {onRowReorder ? <>
          <span id={instructionId} className="cometal-table__visually-hidden">Нажмите Пробел или Enter, затем используйте стрелки вверх и вниз. Повторное нажатие завершает перемещение.</span>
          <span className="cometal-table__visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</span>
        </> : null}
        {rowContextMenu && rowMenu ? (
          <ContextMenu
            anchor="pointer"
            pointerPosition={{ x: rowMenu.x, y: rowMenu.y }}
            open
            onOpenChange={(open) => { if (!open) setRowMenu(null); }}
            clickOpens={false}
            contextOpens={false}
            size="s"
            trigger={<button className="cometal-table__visually-hidden" type="button" tabIndex={-1} aria-label={rowContextMenuLabel(rowMenu.rowId)} />}
          >
            {rowContextMenu(rowMenu.rowId)}
          </ContextMenu>
        ) : null}
      </div>
    </TableReorderContext.Provider>
    </TableModeContext.Provider>
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
  /** Stable business identifier used by controlled row reordering. */
  reorderId?: string;
  /** Stable business identifier used by delegated row actions such as context menus. */
  rowId?: string;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected = false, reorderId, rowId, className, children, ...props },
  ref,
) {
  const reorder = useContext(TableReorderContext);
  const dragging = Boolean(reorderId && reorder?.activeId === reorderId);
  const dropPosition = reorderId && reorder?.overId === reorderId ? reorder.position : null;
  const resolvedRowId = rowId ?? reorderId;
  return <TableRowReorderIdContext.Provider value={reorderId ?? null}>
    <tr
      {...props}
      ref={ref}
      className={['cometal-table__row', className].filter(Boolean).join(' ')}
      data-row-selected={selected || undefined}
      data-reorder-id={reorderId}
      data-row-id={resolvedRowId}
      data-row-dragging={dragging || undefined}
      data-drop-position={dropPosition ?? undefined}
    >{children}</tr>
  </TableRowReorderIdContext.Provider>;
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
  /** Filter operator/action rendered inside the filter control. */
  action?: ReactNode;
}

export const TableFilterCell = forwardRef<HTMLTableCellElement, TableFilterCellProps>(
  function TableFilterCell({ kind = 'default', action, children, className, 'aria-label': ariaLabel, ...props }, ref) {
    const emptyLabel = kind === 'drag' ? 'Без фильтра перемещения' : kind === 'index' ? 'Без фильтра номера' : kind === 'selection' ? 'Без фильтра выбора' : 'Без фильтра';
    return (
      <th {...props} ref={ref} className={['cometal-table__filter-cell', className].filter(Boolean).join(' ')} data-kind={kind}>
        {children ? (
          <div className="cometal-table__filter-control" data-has-action={action ? true : undefined}>
            {children}
            {action ? <span className="cometal-table__filter-action">{action}</span> : null}
          </div>
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
  /** Enables controlled edit entry when the parent Table is in edit mode. */
  editable?: boolean;
  onEditStart?: () => void;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  {
    state = 'default', align = 'start', leading, trailing, editable = false, onEditStart,
    children, className, 'aria-disabled': ariaDisabled, onClick, onKeyDown, tabIndex, ...props
  },
  ref,
) {
  const disabled = state === 'disabled' || ariaDisabled === true;
  const mode = useContext(TableModeContext);
  const canEdit = mode === 'edit' && editable && !disabled;
  const startEdit = () => onEditStart?.();
  return (
    <td
      {...props}
      ref={ref}
      aria-disabled={disabled || undefined}
      aria-invalid={state === 'error' || undefined}
      className={['cometal-table__cell', className].filter(Boolean).join(' ')}
      data-state={state}
      data-align={align}
      data-editable={canEdit || undefined}
      tabIndex={canEdit ? (tabIndex ?? 0) : tabIndex}
      onClick={(event) => {
        onClick?.(event);
        if (!canEdit || event.defaultPrevented) return;
        const target = event.target as Element;
        if (target.closest('button, input, select, textarea, a[href]')) return;
        event.currentTarget.focus();
        startEdit();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (!canEdit || event.defaultPrevented || event.currentTarget !== event.target) return;
        if (event.key === 'Enter' || event.key === 'F2') {
          event.preventDefault();
          startEdit();
        }
      }}
    >
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
  function TableDragHandle({ rowLabel, className, draggable, onPointerDown, onKeyDown, ...props }, ref) {
    const reorder = useContext(TableReorderContext);
    const rowId = useContext(TableRowReorderIdContext);
    return <button
      {...props}
      ref={ref}
      type="button"
      className={['cometal-table__drag-handle', className].filter(Boolean).join(' ')}
      aria-label={`Переместить строку ${rowLabel}`}
      aria-describedby={reorder?.instructionId}
      aria-pressed={reorder?.activeId === rowId ? true : undefined}
      aria-roledescription={reorder ? 'ручка перемещения строки' : undefined}
      data-reorder-handle={reorder ? true : undefined}
      draggable={draggable}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (!rowId || !reorder || event.defaultPrevented || event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.closest<HTMLElement>('.cometal-table-scroll')?.setPointerCapture(event.pointerId);
        reorder.startPointerDrag(rowId, rowLabel);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (rowId && !event.defaultPrevented) reorder?.handleKeyboard(event, rowId, rowLabel);
      }}
    ><TableDragHandleIcon /></button>;
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

export interface TableFilterActionProps extends Omit<TableContextActionProps, 'label' | 'menuLabel'> {
  label: string;
}

export const TableFilterAction = forwardRef<HTMLButtonElement, TableFilterActionProps>(
  function TableFilterAction({ label, menu, defaultOpen = false, className, ...props }, ref) {
    return (
      <ContextMenu
        aria-label={`Параметры фильтра: ${label}`}
        defaultOpen={defaultOpen}
        size="s"
        trigger={<button {...props} ref={ref} className={['cometal-table__filter-action-button', className].filter(Boolean).join(' ')} type="button" aria-label={`Параметры фильтра: ${label}`}><FilterIcon className="cometal-table__filter-action-icon" width={12} height={12} /></button>}
      >
        {menu}
      </ContextMenu>
    );
  },
);

export const TableContextAction = forwardRef<HTMLButtonElement, TableContextActionProps>(
  function TableContextAction({ menu, label = 'Открыть действия колонки', menuLabel = 'Действия колонки', defaultOpen = false, className, ...props }, ref) {
    return (
      <ContextMenu aria-label={menuLabel} defaultOpen={defaultOpen} trigger={<button {...props} ref={ref} className={['cometal-table__context-action', className].filter(Boolean).join(' ')} type="button" aria-label={label}><DotHorizontalFilledIcon className="cometal-table__asset-icon cometal-table__context-icon" width={16} height={16} /></button>}>
        {menu}
      </ContextMenu>
    );
  },
);

export interface TableFileIconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /**
   * The canonical file asset is an inline SVG. Consumers migrating from the former
   * image implementation must remove `src`/`alt` and type refs as SVGSVGElement.
   */
  type?: TableFileType;
}

const fileIcons = {
  word: WordFileIcon,
  excel: ExcelFileIcon,
  file: GenericFileIcon,
  doc: DocFileIcon,
  sheets: SheetsFileIcon,
  adobe: AdobeFileIcon,
  zip: ZipFileIcon,
  pdf: PdfFileIcon,
  image: ImageFileIcon,
} as const;

export const TableFileIcon = forwardRef<SVGSVGElement, TableFileIconProps>(
  function TableFileIcon({ type = 'file', className, ...props }, ref) {
    const Icon = fileIcons[type];
    return <Icon {...props} ref={ref} className={['cometal-table__file-asset', className].filter(Boolean).join(' ')} data-file-type={type} />;
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
  const selectOptions = pageSizeOptions.map((option) => ({ value: String(option), label: String(option) }));
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
      <Select
        className="cometal-table__page-size"
        label="Строк на странице"
        size="m"
        options={selectOptions}
        value={pageSize === undefined ? undefined : String(pageSize)}
        onValueChange={(value) => onPageSizeChange?.(Number(value))}
        disabled={!onPageSizeChange}
      />
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
