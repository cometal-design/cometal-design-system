import { createContext, forwardRef, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type {
  ButtonHTMLAttributes,
  CSSProperties,
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
import { ContextMenu, ContextMenuItem } from '../ContextMenu/ContextMenu';
import type { ContextMenuItemProps } from '../ContextMenu/ContextMenu';
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
  dropConfirmation: { rowId: string; phase: 'hold' | 'fade' } | null;
  instructionId: string;
  startPointerDrag: (rowId: string, rowLabel: string) => void;
  movePointerDrag: (event: ReactPointerEvent<HTMLElement>) => void;
  endPointerDrag: () => void;
  handleKeyboard: (event: ReactKeyboardEvent<HTMLButtonElement>, rowId: string, rowLabel: string) => void;
}

const TableReorderContext = createContext<TableReorderContextValue | null>(null);
const TableRowReorderIdContext = createContext<string | null>(null);
const TableModeContext = createContext<TableMode>('read');

interface TableColumnPinningContextValue {
  pinnedColumnIds: readonly string[];
  offsets: Readonly<Record<string, number>>;
  lastPinnedColumnId: string | null;
  canChange: boolean;
  toggle: (columnId: string) => void;
}

const TableColumnPinningContext = createContext<TableColumnPinningContextValue | null>(null);

interface TableColumnSizingContextValue {
  columnWidths: Readonly<Record<string, number>>;
  canChange: boolean;
  setColumnWidth: (columnId: string, width: number) => void;
  replaceColumnWidths: (columnWidths: Readonly<Record<string, number>>) => void;
}

const TableColumnSizingContext = createContext<TableColumnSizingContextValue | null>(null);
const EMPTY_TABLE_COLUMN_IDS: readonly string[] = [];
const EMPTY_TABLE_COLUMN_WIDTHS: Readonly<Record<string, number>> = {};
const TABLE_DROP_CONFIRMATION_HOLD_MS = 500;
const TABLE_DROP_CONFIRMATION_FADE_MS = 600;
const TABLE_SCROLL_IDLE_MS = 2000;
const TABLE_SCROLL_EDGE_REVEAL_PX = 24;
const TABLE_SCROLLBAR_MIN_THUMB_PX = 32;

type TableScrollAxis = 'horizontal' | 'vertical';

interface TableScrollMetrics {
  clientWidth: number;
  clientHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  safeInset: number;
}

interface TableScrollbarDrag {
  axis: TableScrollAxis;
  pointerId: number;
  pointerStart: number;
  scrollStart: number;
  trackLength: number;
  thumbLength: number;
}

const EMPTY_TABLE_SCROLL_METRICS: TableScrollMetrics = {
  clientWidth: 0,
  clientHeight: 0,
  scrollWidth: 0,
  scrollHeight: 0,
  scrollLeft: 0,
  scrollTop: 0,
  safeInset: 0,
};

function getTableScrollbarGeometry(axis: TableScrollAxis, metrics: TableScrollMetrics) {
  const horizontal = axis === 'horizontal';
  const viewportLength = horizontal ? metrics.clientWidth : metrics.clientHeight;
  const contentLength = horizontal ? metrics.scrollWidth : metrics.scrollHeight;
  const scrollPosition = horizontal ? metrics.scrollLeft : metrics.scrollTop;
  const maxScroll = Math.max(0, contentLength - viewportLength);
  const trackLength = Math.max(
    0,
    viewportLength - (metrics.safeInset * 2),
  );
  const thumbLength = contentLength > 0
    ? Math.max(TABLE_SCROLLBAR_MIN_THUMB_PX, Math.min(trackLength, (viewportLength / contentLength) * trackLength))
    : trackLength;
  const maxThumbOffset = Math.max(0, trackLength - thumbLength);
  const thumbOffset = maxScroll > 0 ? (scrollPosition / maxScroll) * maxThumbOffset : 0;
  return { viewportLength, trackLength, maxScroll, thumbLength, maxThumbOffset, thumbOffset };
}

type TableColumnCellStyle = CSSProperties & {
  '--cometal-table-pinned-left'?: string;
  '--cometal-table-column-width'?: string;
};

function getTableColumnOrder(table: HTMLTableElement | null): string[] {
  if (!table) return [];
  const headers = Array.from(table.querySelectorAll<HTMLTableCellElement>('.cometal-table__head > .cometal-table__row:first-child > [data-column-id]'));
  return headers.reduce<string[]>((order, header) => {
    const columnId = header.dataset.columnId;
    if (columnId && !order.includes(columnId)) order.push(columnId);
    return order;
  }, []);
}

function orderPinnedTableColumns(columnIds: readonly string[], columnOrder: readonly string[]): string[] {
  const pinned = new Set(columnIds);
  return columnOrder.filter((columnId) => pinned.has(columnId));
}

function useTableColumnLayout(columnId: string | undefined, style: CSSProperties | undefined) {
  const pinning = useContext(TableColumnPinningContext);
  const sizing = useContext(TableColumnSizingContext);
  const pinned = Boolean(columnId && pinning?.pinnedColumnIds.includes(columnId));
  const width = columnId ? sizing?.columnWidths[columnId] : undefined;
  const resolvedStyle: TableColumnCellStyle | undefined = pinned || width !== undefined
    ? {
        ...style,
        ...(pinned ? { '--cometal-table-pinned-left': `${pinning?.offsets[columnId ?? ''] ?? 0}px` } : null),
        ...(width !== undefined ? { '--cometal-table-column-width': `${width}px` } : null),
      }
    : style;
  return {
    style: resolvedStyle,
    'data-column-id': columnId,
    'data-column-width': width !== undefined ? width : undefined,
    'data-column-pinned': pinned || undefined,
    'data-column-pinned-last': pinned && pinning?.lastPinnedColumnId === columnId || undefined,
  };
}

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
  /** Controlled set of stable column identifiers pinned to the inline-start edge. */
  pinnedColumnIds?: readonly string[];
  /** Receives pinned identifiers normalized to the current DOM column order. */
  onPinnedColumnIdsChange?: (columnIds: string[]) => void;
  /** Controlled pixel widths keyed by the stable identifiers shared across every column floor. */
  columnWidths?: Readonly<Record<string, number>>;
  /** Receives the complete next controlled width record after pointer or keyboard resizing. */
  onColumnWidthsChange?: (columnWidths: Record<string, number>) => void;
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
    pinnedColumnIds = EMPTY_TABLE_COLUMN_IDS,
    onPinnedColumnIdsChange,
    columnWidths = EMPTY_TABLE_COLUMN_WIDTHS,
    onColumnWidthsChange,
    onContextMenu,
    ...tableProps
  },
  ref,
) {
  const tableRef = useRef<HTMLTableElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const reorderEnabled = mode === 'edit' && Boolean(onRowReorder);
  const instructionId = useId();
  const scrollRegionId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [interaction, setInteraction] = useState<'pointer' | 'keyboard' | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [position, setPosition] = useState<TableRowDropPosition | null>(null);
  const [dropConfirmation, setDropConfirmation] = useState<{ rowId: string; phase: 'hold' | 'fade' } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [rowMenu, setRowMenu] = useState<TableRowMenuState | null>(null);
  const [horizontalScrolled, setHorizontalScrolled] = useState(false);
  const [scrollActive, setScrollActive] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState<TableScrollMetrics>(EMPTY_TABLE_SCROLL_METRICS);
  const [scrollbarDragging, setScrollbarDragging] = useState<TableScrollAxis | null>(null);
  const [columnLayout, setColumnLayout] = useState<{ order: string[]; offsets: Record<string, number> }>({ order: [], offsets: {} });
  const columnWidthsRef = useRef(columnWidths);
  const dropConfirmationTimersRef = useRef<number[]>([]);
  const scrollIdleTimerRef = useRef<number | null>(null);
  const scrollbarDragRef = useRef<TableScrollbarDrag | null>(null);
  columnWidthsRef.current = columnWidths;

  const clearDropConfirmationTimers = useCallback(() => {
    dropConfirmationTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    dropConfirmationTimersRef.current = [];
  }, []);

  const clearDropConfirmation = useCallback(() => {
    clearDropConfirmationTimers();
    setDropConfirmation(null);
  }, [clearDropConfirmationTimers]);

  const confirmPointerDrop = useCallback((rowId: string) => {
    clearDropConfirmationTimers();
    setDropConfirmation({ rowId, phase: 'hold' });
    dropConfirmationTimersRef.current = [
      window.setTimeout(() => setDropConfirmation({ rowId, phase: 'fade' }), TABLE_DROP_CONFIRMATION_HOLD_MS),
      window.setTimeout(() => setDropConfirmation(null), TABLE_DROP_CONFIRMATION_HOLD_MS + TABLE_DROP_CONFIRMATION_FADE_MS),
    ];
  }, [clearDropConfirmationTimers]);

  useEffect(() => clearDropConfirmationTimers, [clearDropConfirmationTimers]);

  useEffect(() => () => {
    if (scrollIdleTimerRef.current !== null) window.clearTimeout(scrollIdleTimerRef.current);
    scrollbarDragRef.current = null;
  }, []);

  const markScrollActive = useCallback(() => {
    setScrollActive(true);
    if (scrollIdleTimerRef.current !== null) window.clearTimeout(scrollIdleTimerRef.current);
    scrollIdleTimerRef.current = window.setTimeout(() => {
      if (scrollbarDragRef.current) return;
      setScrollActive(false);
      scrollIdleTimerRef.current = null;
    }, TABLE_SCROLL_IDLE_MS);
  }, []);

  const updateScrollMetrics = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const next: TableScrollMetrics = {
      clientWidth: scroll.clientWidth,
      clientHeight: scroll.clientHeight,
      scrollWidth: scroll.scrollWidth,
      scrollHeight: scroll.scrollHeight,
      scrollLeft: scroll.scrollLeft,
      scrollTop: scroll.scrollTop,
      safeInset: Number.parseFloat(getComputedStyle(scroll.parentElement ?? scroll).getPropertyValue('--cometal-table-density-size')) || 0,
    };
    setScrollMetrics((current) => (
      current.clientWidth === next.clientWidth
      && current.clientHeight === next.clientHeight
      && current.scrollWidth === next.scrollWidth
      && current.scrollHeight === next.scrollHeight
      && current.scrollLeft === next.scrollLeft
      && current.scrollTop === next.scrollTop
      && current.safeInset === next.safeInset
        ? current
        : next
    ));
  }, []);

  useLayoutEffect(() => {
    updateScrollMetrics();
    const scroll = scrollRef.current;
    const table = tableRef.current;
    if (!scroll || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateScrollMetrics);
    observer.observe(scroll);
    if (table) observer.observe(table);
    return () => observer.disconnect();
  }, [updateScrollMetrics]);

  useLayoutEffect(() => {
    updateScrollMetrics();
  });

  const moveScrollFromScrollbar = useCallback((axis: TableScrollAxis, scrollPosition: number) => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    if (axis === 'horizontal') scroll.scrollLeft = scrollPosition;
    else scroll.scrollTop = scrollPosition;
    updateScrollMetrics();
    markScrollActive();
  }, [markScrollActive, updateScrollMetrics]);

  const handleScrollbarPointerDown = useCallback((axis: TableScrollAxis, event: ReactPointerEvent<HTMLDivElement>) => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    event.preventDefault();
    event.stopPropagation();
    const geometry = getTableScrollbarGeometry(axis, scrollMetrics);
    if (geometry.maxScroll <= 0) return;
    const trackBounds = event.currentTarget.getBoundingClientRect();
    const pointer = axis === 'horizontal' ? event.clientX : event.clientY;
    const trackStart = axis === 'horizontal' ? trackBounds.left : trackBounds.top;
    const pressedThumb = (event.target as HTMLElement).classList.contains('cometal-table-scrollbar__thumb');
    let scrollStart = axis === 'horizontal' ? scroll.scrollLeft : scroll.scrollTop;
    if (!pressedThumb) {
      const nextThumbOffset = Math.max(0, Math.min(geometry.maxThumbOffset, pointer - trackStart - geometry.thumbLength / 2));
      scrollStart = geometry.maxThumbOffset > 0 ? (nextThumbOffset / geometry.maxThumbOffset) * geometry.maxScroll : 0;
      moveScrollFromScrollbar(axis, scrollStart);
    }
    scrollbarDragRef.current = {
      axis,
      pointerId: event.pointerId,
      pointerStart: pointer,
      scrollStart,
      trackLength: geometry.trackLength,
      thumbLength: geometry.thumbLength,
    };
    setScrollbarDragging(axis);
    if (scrollIdleTimerRef.current !== null) window.clearTimeout(scrollIdleTimerRef.current);
    setScrollActive(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [moveScrollFromScrollbar, scrollMetrics]);

  const handleScrollbarPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = scrollbarDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    const pointer = drag.axis === 'horizontal' ? event.clientX : event.clientY;
    const geometry = getTableScrollbarGeometry(drag.axis, scrollMetrics);
    const thumbTravel = Math.max(1, drag.trackLength - drag.thumbLength);
    moveScrollFromScrollbar(drag.axis, drag.scrollStart + ((pointer - drag.pointerStart) / thumbTravel) * geometry.maxScroll);
  }, [moveScrollFromScrollbar, scrollMetrics]);

  const endScrollbarDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = scrollbarDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    scrollbarDragRef.current = null;
    setScrollbarDragging(null);
    markScrollActive();
  }, [markScrollActive]);

  const handleScrollbarKeyDown = useCallback((axis: TableScrollAxis, event: ReactKeyboardEvent<HTMLDivElement>) => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const geometry = getTableScrollbarGeometry(axis, scrollMetrics);
    const current = axis === 'horizontal' ? scroll.scrollLeft : scroll.scrollTop;
    const pageStep = geometry.viewportLength * 0.8;
    let next: number | null = null;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = geometry.maxScroll;
    else if (event.key === 'PageUp') next = current - pageStep;
    else if (event.key === 'PageDown') next = current + pageStep;
    else if (event.key === (axis === 'horizontal' ? 'ArrowLeft' : 'ArrowUp')) next = current - 40;
    else if (event.key === (axis === 'horizontal' ? 'ArrowRight' : 'ArrowDown')) next = current + 40;
    if (next === null) return;
    event.preventDefault();
    moveScrollFromScrollbar(axis, next);
  }, [moveScrollFromScrollbar, scrollMetrics]);

  const setTableRef = useCallback((node: HTMLTableElement | null) => {
    tableRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const measurePinnedColumns = useCallback(() => {
    const table = tableRef.current;
    const order = getTableColumnOrder(table);
    const pinnedOrder = orderPinnedTableColumns(pinnedColumnIds, order);
    const widths = new Map<string, number>();
    for (const header of Array.from(table?.querySelectorAll<HTMLTableCellElement>('.cometal-table__head > .cometal-table__row:first-child > [data-column-id]') ?? [])) {
      const columnId = header.dataset.columnId;
      if (columnId && !widths.has(columnId)) widths.set(columnId, header.getBoundingClientRect().width);
    }
    const offsets: Record<string, number> = {};
    let offset = 0;
    for (const columnId of pinnedOrder) {
      offsets[columnId] = offset;
      offset += widths.get(columnId) ?? 0;
    }
    setColumnLayout((current) => {
      const unchangedOrder = current.order.length === order.length && current.order.every((columnId, index) => columnId === order[index]);
      const currentKeys = Object.keys(current.offsets);
      const nextKeys = Object.keys(offsets);
      const unchangedOffsets = currentKeys.length === nextKeys.length && nextKeys.every((columnId) => current.offsets[columnId] === offsets[columnId]);
      return unchangedOrder && unchangedOffsets ? current : { order, offsets };
    });
  }, [pinnedColumnIds]);

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const headers = Array.from(table.querySelectorAll<HTMLTableCellElement>('.cometal-table__head > .cometal-table__row:first-child > [data-column-id]'));
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measurePinnedColumns);
      return () => window.removeEventListener('resize', measurePinnedColumns);
    }
    const observer = new ResizeObserver(measurePinnedColumns);
    observer.observe(table);
    headers.forEach((header) => observer.observe(header));
    return () => observer.disconnect();
  }, [measurePinnedColumns]);

  useLayoutEffect(() => {
    measurePinnedColumns();
  }, [columnWidths, measurePinnedColumns]);

  const pinningContext = useMemo<TableColumnPinningContextValue>(() => {
    const orderedPinnedColumnIds = columnLayout.order.length
      ? orderPinnedTableColumns(pinnedColumnIds, columnLayout.order)
      : [...pinnedColumnIds];
    return {
      pinnedColumnIds: orderedPinnedColumnIds,
      offsets: columnLayout.offsets,
      lastPinnedColumnId: orderedPinnedColumnIds.at(-1) ?? null,
      canChange: Boolean(onPinnedColumnIdsChange),
      toggle(columnId) {
        if (!onPinnedColumnIdsChange) return;
        const order = getTableColumnOrder(tableRef.current);
        const next = new Set(pinnedColumnIds);
        if (next.has(columnId)) next.delete(columnId);
        else next.add(columnId);
        onPinnedColumnIdsChange(orderPinnedTableColumns([...next], order));
      },
    };
  }, [columnLayout.offsets, columnLayout.order, onPinnedColumnIdsChange, pinnedColumnIds]);

  const sizingContext = useMemo<TableColumnSizingContextValue>(() => ({
    columnWidths,
    canChange: Boolean(onColumnWidthsChange),
    setColumnWidth(columnId, width) {
      if (!onColumnWidthsChange) return;
      onColumnWidthsChange({ ...columnWidthsRef.current, [columnId]: width });
    },
    replaceColumnWidths(nextColumnWidths) {
      if (!onColumnWidthsChange) return;
      onColumnWidthsChange({ ...nextColumnWidths });
    },
  }), [columnWidths, onColumnWidthsChange]);

  const resetReorder = () => {
    setActiveId(null);
    setInteraction(null);
    setOverId(null);
    setPosition(null);
  };

  const reorderContext = useMemo<TableReorderContextValue | null>(() => {
    if (!reorderEnabled || !onRowReorder) return null;

    return {
      activeId,
      interaction,
      overId,
      position,
      dropConfirmation,
      instructionId,
      startPointerDrag(rowId, rowLabel) {
        clearDropConfirmation();
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
        confirmPointerDrop(activeId);
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
  }, [activeId, clearDropConfirmation, confirmPointerDrop, dropConfirmation, instructionId, interaction, onRowReorder, overId, position, reorderEnabled]);

  const openRowMenu = (event: ReactMouseEvent<HTMLTableElement>) => {
    onContextMenu?.(event);
    if (!rowContextMenu || event.defaultPrevented) return;
    const row = (event.target as Element).closest<HTMLTableRowElement>('tbody tr[data-row-id]');
    const rowId = row?.dataset.rowId;
    if (!rowId || row?.closest('table') !== event.currentTarget) return;
    event.preventDefault();
    setRowMenu({ rowId, x: event.clientX, y: event.clientY });
  };

  const horizontalScrollbar = getTableScrollbarGeometry('horizontal', scrollMetrics);
  const verticalScrollbar = getTableScrollbarGeometry('vertical', scrollMetrics);
  const hasHorizontalScrollbar = horizontalScrollbar.maxScroll > 0;
  const hasVerticalScrollbar = verticalScrollbar.maxScroll > 0;

  return (
    <TableModeContext.Provider value={mode}>
    <TableColumnPinningContext.Provider value={pinningContext}>
    <TableColumnSizingContext.Provider value={sizingContext}>
    <TableReorderContext.Provider value={reorderContext}>
      <div
        className="cometal-table-scroll-shell"
        data-cometal-component="table-scroll-shell"
        data-density={density}
        data-scroll-active={scrollActive || undefined}
        data-scrollbar-dragging={scrollbarDragging ?? undefined}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            (hasHorizontalScrollbar && bounds.bottom - event.clientY <= TABLE_SCROLL_EDGE_REVEAL_PX)
            || (hasVerticalScrollbar && bounds.right - event.clientX <= TABLE_SCROLL_EDGE_REVEAL_PX)
          ) markScrollActive();
        }}
      >
      <div
        ref={scrollRef}
        id={scrollRegionId}
        className="cometal-table-scroll"
        data-cometal-component="table-scroll"
        data-horizontal-scrolled={horizontalScrolled || undefined}
        role="region"
        aria-label={`Прокрутка: ${ariaLabel}`}
        tabIndex={0}
        onScroll={(event) => {
          setHorizontalScrolled(event.currentTarget.scrollLeft > 0);
          updateScrollMetrics();
          markScrollActive();
        }}
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
          ref={setTableRef}
          aria-label={ariaLabel}
          className={['cometal-table', className].filter(Boolean).join(' ')}
          data-cometal-component="table"
          data-density={density}
          data-mode={mode}
          data-reorderable={reorderEnabled || undefined}
          data-row-context-menu={rowContextMenu ? true : undefined}
          onContextMenu={openRowMenu}
        />
        {reorderEnabled ? <>
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
      {hasHorizontalScrollbar ? (
        <div
          className="cometal-table-scrollbar cometal-table-scrollbar--horizontal"
          role="scrollbar"
          aria-label="Горизонтальная прокрутка таблицы"
          aria-controls={scrollRegionId}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={Math.round(horizontalScrollbar.maxScroll)}
          aria-valuenow={Math.round(scrollMetrics.scrollLeft)}
          tabIndex={0}
          onFocus={markScrollActive}
          onKeyDown={(event) => handleScrollbarKeyDown('horizontal', event)}
          onPointerDown={(event) => handleScrollbarPointerDown('horizontal', event)}
          onPointerMove={handleScrollbarPointerMove}
          onPointerUp={endScrollbarDrag}
          onPointerCancel={endScrollbarDrag}
        >
          <span
            className="cometal-table-scrollbar__thumb"
            style={{
              width: `${horizontalScrollbar.thumbLength}px`,
              transform: `translate3d(${horizontalScrollbar.thumbOffset}px, 0, 0)`,
            }}
          />
        </div>
      ) : null}
      {hasVerticalScrollbar ? (
        <div
          className="cometal-table-scrollbar cometal-table-scrollbar--vertical"
          role="scrollbar"
          aria-label="Вертикальная прокрутка таблицы"
          aria-controls={scrollRegionId}
          aria-orientation="vertical"
          aria-valuemin={0}
          aria-valuemax={Math.round(verticalScrollbar.maxScroll)}
          aria-valuenow={Math.round(scrollMetrics.scrollTop)}
          tabIndex={0}
          onFocus={markScrollActive}
          onKeyDown={(event) => handleScrollbarKeyDown('vertical', event)}
          onPointerDown={(event) => handleScrollbarPointerDown('vertical', event)}
          onPointerMove={handleScrollbarPointerMove}
          onPointerUp={endScrollbarDrag}
          onPointerCancel={endScrollbarDrag}
        >
          <span
            className="cometal-table-scrollbar__thumb"
            style={{
              height: `${verticalScrollbar.thumbLength}px`,
              transform: `translate3d(0, ${verticalScrollbar.thumbOffset}px, 0)`,
            }}
          />
        </div>
      ) : null}
      </div>
    </TableReorderContext.Provider>
    </TableColumnSizingContext.Provider>
    </TableColumnPinningContext.Provider>
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
  const mode = useContext(TableModeContext);
  const effectiveReorderId = mode === 'edit' && reorder ? reorderId : undefined;
  const dragging = Boolean(effectiveReorderId && reorder?.activeId === effectiveReorderId);
  const dropPosition = effectiveReorderId && reorder?.overId === effectiveReorderId ? reorder.position : null;
  const dropConfirmation = effectiveReorderId && reorder?.dropConfirmation?.rowId === effectiveReorderId ? reorder.dropConfirmation.phase : null;
  const resolvedRowId = rowId ?? effectiveReorderId;
  return <TableRowReorderIdContext.Provider value={effectiveReorderId ?? null}>
    <tr
      {...props}
      ref={ref}
      className={['cometal-table__row', className].filter(Boolean).join(' ')}
      data-row-selected={selected || undefined}
      data-reorder-id={effectiveReorderId}
      data-row-id={resolvedRowId}
      data-row-dragging={dragging || undefined}
      data-drop-position={dropPosition ?? undefined}
      data-drop-confirmation={dropConfirmation ?? undefined}
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
  /** Stable identifier shared by header, filter, body and summary cells in this column. */
  columnId?: string;
  /** Opts a stable default data column out of the controlled resize affordance. */
  resizable?: boolean;
}

const TABLE_COLUMN_RESIZE_STEP = 8;
const TABLE_COLUMN_RESIZE_LARGE_STEP = 32;

function getTableColumnMinWidth(cell: HTMLTableCellElement): number {
  const minimum = Number.parseFloat(getComputedStyle(cell).minWidth);
  return Number.isFinite(minimum) ? minimum : 0;
}

function clampTableColumnWidth(width: number, minimum: number): number {
  return Math.max(minimum, Math.round(width));
}

interface TableColumnResizeHandleProps {
  columnId: string;
  label: string;
  headerRef: React.RefObject<HTMLTableCellElement | null>;
}

function TableColumnResizeHandle({ columnId, label, headerRef }: TableColumnResizeHandleProps) {
  const sizing = useContext(TableColumnSizingContext);
  const handleRef = useRef<HTMLSpanElement | null>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startWidth: number; startWidths: Readonly<Record<string, number>> } | null>(null);
  const [dragging, setDragging] = useState(false);
  const controlledWidth = sizing?.columnWidths[columnId];
  const [measuredWidth, setMeasuredWidth] = useState(controlledWidth ?? 0);
  const minimum = headerRef.current ? getTableColumnMinWidth(headerRef.current) : 0;

  useLayoutEffect(() => {
    const cell = headerRef.current;
    if (!cell) return;
    const measure = () => setMeasuredWidth(Math.round(controlledWidth ?? cell.getBoundingClientRect().width));
    measure();
    if (controlledWidth !== undefined || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(cell);
    return () => observer.disconnect();
  }, [controlledWidth, headerRef]);

  const finishPointerResize = (restore: boolean) => {
    const drag = dragRef.current;
    const handle = handleRef.current;
    if (!drag) return;
    if (restore) sizing?.replaceColumnWidths(drag.startWidths);
    if (handle?.hasPointerCapture(drag.pointerId)) handle.releasePointerCapture(drag.pointerId);
    dragRef.current = null;
    setDragging(false);
  };

  return <span
    ref={handleRef}
    className="cometal-table__column-resize-handle"
    role="separator"
    aria-label={`Изменить ширину колонки ${label}`}
    aria-orientation="vertical"
    aria-valuemin={Math.round(minimum || 96)}
    aria-valuenow={Math.round((controlledWidth ?? measuredWidth) || minimum || 96)}
    tabIndex={0}
    data-resizing={dragging || undefined}
    onPointerDown={(event) => {
      if (event.button !== 0 || !sizing?.canChange || !headerRef.current) return;
      event.preventDefault();
      event.currentTarget.focus();
      const startWidth = controlledWidth ?? headerRef.current.getBoundingClientRect().width;
      dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startWidth, startWidths: { ...sizing.columnWidths } };
      try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* Synthetic pointer events may not own an active browser pointer. */ }
      setDragging(true);
    }}
    onPointerMove={(event) => {
      const drag = dragRef.current;
      const cell = headerRef.current;
      if (!drag || drag.pointerId !== event.pointerId || !cell) return;
      sizing?.setColumnWidth(columnId, clampTableColumnWidth(drag.startWidth + event.clientX - drag.startX, getTableColumnMinWidth(cell)));
    }}
    onPointerUp={(event) => {
      if (dragRef.current?.pointerId === event.pointerId) finishPointerResize(false);
    }}
    onPointerCancel={(event) => {
      if (dragRef.current?.pointerId === event.pointerId) finishPointerResize(true);
    }}
    onLostPointerCapture={() => {
      dragRef.current = null;
      setDragging(false);
    }}
    onKeyDown={(event) => {
      const cell = headerRef.current;
      if (!cell || !sizing?.canChange) return;
      if (event.key === 'Escape' && dragRef.current) {
        event.preventDefault();
        finishPointerResize(true);
        return;
      }
      const minWidth = getTableColumnMinWidth(cell);
      const currentWidth = controlledWidth ?? cell.getBoundingClientRect().width;
      if (event.key === 'Home') {
        event.preventDefault();
        sizing.setColumnWidth(columnId, minWidth);
        return;
      }
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const step = event.shiftKey ? TABLE_COLUMN_RESIZE_LARGE_STEP : TABLE_COLUMN_RESIZE_STEP;
      sizing.setColumnWidth(columnId, clampTableColumnWidth(currentWidth + (event.key === 'ArrowRight' ? step : -step), minWidth));
    }}
  />;
}

export const TableHeaderCell = forwardRef<HTMLTableCellElement, TableHeaderCellProps>(
  function TableHeaderCell(
    { sort = 'none', onSortChange, action, kind = 'default', columnId, resizable = true, children, className, scope = 'col', style, ...props },
    ref,
  ) {
    const mode = useContext(TableModeContext);
    const sizing = useContext(TableColumnSizingContext);
    const headerRef = useRef<HTMLTableCellElement | null>(null);
    const columnLayout = useTableColumnLayout(columnId, style);
    if (kind === 'drag' && mode === 'read') return null;
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
      <th {...props} {...columnLayout} ref={(node) => { headerRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node; }} scope={scope} aria-sort={sort === 'none' ? undefined : sort} className={['cometal-table__header-cell', className].filter(Boolean).join(' ')} data-kind={kind} data-sort={sort} data-column-resizable={kind === 'default' && columnId && resizable && sizing?.canChange || undefined}>
        <div className="cometal-table__header-main">
          {onSortChange ? (
            <button className="cometal-table__sort-button" type="button" onClick={() => onSortChange(nextSort)} aria-label={`Сортировать ${label}: ${nextSort === 'ascending' ? 'по возрастанию' : nextSort === 'descending' ? 'по убыванию' : 'отключить сортировку'}`}>
              {content}
            </button>
          ) : content}
          {action ? <span className="cometal-table__header-action">{action}</span> : null}
        </div>
        {kind === 'default' && columnId && resizable && sizing?.canChange ? <TableColumnResizeHandle columnId={columnId} label={label} headerRef={headerRef} /> : null}
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
  /** Stable identifier shared by header, filter, body and summary cells in this column. */
  columnId?: string;
}

export const TableFilterCell = forwardRef<HTMLTableCellElement, TableFilterCellProps>(
  function TableFilterCell({ kind = 'default', action, columnId, children, className, 'aria-label': ariaLabel, style, ...props }, ref) {
    const mode = useContext(TableModeContext);
    const columnLayout = useTableColumnLayout(columnId, style);
    if (kind === 'drag' && mode === 'read') return null;
    const emptyLabel = kind === 'drag' ? 'Без фильтра перемещения' : kind === 'index' ? 'Без фильтра номера' : kind === 'selection' ? 'Без фильтра выбора' : 'Без фильтра';
    return (
      <th {...props} {...columnLayout} ref={ref} className={['cometal-table__filter-cell', className].filter(Boolean).join(' ')} data-kind={kind}>
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
  /** Stable identifier shared by header, filter, body and summary cells in this column. */
  columnId?: string;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  {
    state = 'default', align = 'start', leading, trailing, editable = false, onEditStart, columnId,
    children, className, 'aria-disabled': ariaDisabled, onClick, onKeyDown, tabIndex,
    contentEditable, suppressContentEditableWarning, role, 'aria-multiline': ariaMultiline, style, ...props
  },
  ref,
) {
  const disabled = state === 'disabled' || ariaDisabled === true;
  const mode = useContext(TableModeContext);
  const canEdit = mode === 'edit' && editable && !disabled;
  const isEditing = canEdit && state === 'editing';
  const columnLayout = useTableColumnLayout(columnId, style);
  const startEdit = () => onEditStart?.();
  return (
    <td
      {...props}
      {...columnLayout}
      ref={ref}
      aria-disabled={disabled || undefined}
      aria-invalid={state === 'error' || undefined}
      className={['cometal-table__cell', className].filter(Boolean).join(' ')}
      data-state={state}
      data-align={align}
      data-editable={canEdit || undefined}
      tabIndex={canEdit ? (tabIndex ?? 0) : tabIndex}
      contentEditable={isEditing ? (contentEditable ?? true) : contentEditable}
      suppressContentEditableWarning={isEditing ? (suppressContentEditableWarning ?? true) : suppressContentEditableWarning}
      role={isEditing ? (role ?? 'textbox') : role}
      aria-multiline={isEditing ? (ariaMultiline ?? false) : ariaMultiline}
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
        try { event.currentTarget.closest<HTMLElement>('.cometal-table-scroll')?.setPointerCapture(event.pointerId); } catch { /* Synthetic pointer events may not own an active browser pointer. */ }
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
    const mode = useContext(TableModeContext);
    if (mode === 'read') return null;
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

export interface TableColumnPinActionProps extends Omit<ContextMenuItemProps, 'children' | 'selected'> {
  columnId: string;
  pinLabel?: string;
  unpinLabel?: string;
}

/** Context-menu command bound to the nearest controlled Table column-pinning state. */
export const TableColumnPinAction = forwardRef<HTMLButtonElement, TableColumnPinActionProps>(
  function TableColumnPinAction({ columnId, pinLabel = 'Закрепить слева', unpinLabel = 'Открепить слева', disabled, onClick, ...props }, ref) {
    const pinning = useContext(TableColumnPinningContext);
    const pinned = Boolean(pinning?.pinnedColumnIds.includes(columnId));
    return <ContextMenuItem
      {...props}
      ref={ref}
      selected={pinned}
      disabled={disabled || !pinning?.canChange}
      data-column-pin-action={columnId}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) pinning?.toggle(columnId);
      }}
    >{pinned ? unpinLabel : pinLabel}</ContextMenuItem>;
  },
);

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
  const windowSize = 9;
  if (pageCount <= windowSize) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const windowStart = Math.floor((page - 1) / windowSize) * windowSize + 1;
  const windowEnd = Math.min(pageCount, windowStart + windowSize - 1);
  const items: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [];
  if (windowStart > 1) items.push('ellipsis-start');
  for (let value = windowStart; value <= windowEnd; value += 1) items.push(value);
  if (windowEnd < pageCount) items.push('ellipsis-end');
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
