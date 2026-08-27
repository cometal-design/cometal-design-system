import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

const pointerFocusOrigins = new WeakSet<HTMLElement>();

/** Bridges pointer modality across a portal without adding a public field prop or DOM attribute. */
export function markFieldPointerFocusOrigin(field: HTMLElement | null) {
  if (field) pointerFocusOrigins.add(field);
}

export function clearFieldPointerFocusOrigin(field: HTMLElement | null) {
  if (field) pointerFocusOrigins.delete(field);
}

export function consumeFieldPointerFocusOrigin(field: HTMLElement) {
  const pointerOrigin = pointerFocusOrigins.has(field);
  pointerFocusOrigins.delete(field);
  return pointerOrigin;
}

export function useControllableOpen(
  controlled: boolean | undefined,
  defaultValue: boolean,
  onChange?: (value: boolean) => void,
) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled ?? internal;
  const setValue = useCallback((next: boolean) => {
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
  }, [controlled, onChange]);
  return [value, setValue] as const;
}

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

type AnchoredOverlayPlacement = 'top-start' | 'bottom-start';

type AnchoredOverlayPosition = {
  left: number;
  top: number;
  width?: number;
  placement: AnchoredOverlayPlacement;
  positioned: boolean;
};

type OverlayRect = Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>;

/** Pure geometry seam for executable viewport coverage; remains internal to the React package. */
export function computeAnchoredOverlayPosition({
  anchorRect,
  surfaceWidth,
  surfaceHeight,
  viewportLeft,
  viewportTop,
  viewportWidth,
  viewportHeight,
  gap,
  viewportInset,
  matchAnchorWidth,
}: {
  anchorRect: OverlayRect;
  surfaceWidth: number;
  surfaceHeight: number;
  viewportLeft: number;
  viewportTop: number;
  viewportWidth: number;
  viewportHeight: number;
  gap: number;
  viewportInset: number;
  matchAnchorWidth: boolean;
}): AnchoredOverlayPosition {
  const resolvedWidth = matchAnchorWidth ? anchorRect.width : surfaceWidth;
  const viewportRight = viewportLeft + viewportWidth;
  const viewportBottom = viewportTop + viewportHeight;
  const minLeft = viewportLeft + viewportInset;
  const maxLeft = Math.max(minLeft, viewportRight - viewportInset - resolvedWidth);
  const minTop = viewportTop + viewportInset;
  const maxTop = Math.max(minTop, viewportBottom - viewportInset - surfaceHeight);
  const bottomTop = anchorRect.bottom + gap;
  const topTop = anchorRect.top - gap - surfaceHeight;
  const bottomSpace = viewportBottom - viewportInset - bottomTop;
  const topSpace = anchorRect.top - gap - minTop;
  const placement: AnchoredOverlayPlacement = surfaceHeight > bottomSpace && topSpace > bottomSpace
    ? 'top-start'
    : 'bottom-start';
  return {
    left: Math.min(Math.max(anchorRect.left, minLeft), maxLeft),
    top: Math.min(Math.max(placement === 'top-start' ? topTop : bottomTop, minTop), maxTop),
    width: matchAnchorWidth ? anchorRect.width : undefined,
    placement,
    positioned: true,
  };
}

export type AnchoredOverlayOptions = {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  surfaceRef: RefObject<HTMLElement | null>;
  gap: number;
  viewportInset: number;
  matchAnchorWidth?: boolean;
  closeOnLostAnchor?: boolean;
  onLostAnchor?: () => void;
};

/** Internal fixed-position overlay placement shared by controls that may live inside clipped surfaces. */
export function useAnchoredOverlay({
  open,
  anchorRef,
  surfaceRef,
  gap,
  viewportInset,
  matchAnchorWidth = false,
  closeOnLostAnchor = true,
  onLostAnchor,
}: AnchoredOverlayOptions) {
  const [position, setPosition] = useState<AnchoredOverlayPosition>({
    left: -9999,
    top: -9999,
    placement: 'bottom-start',
    positioned: false,
  });
  const lostAnchorRef = useRef(onLostAnchor);
  lostAnchorRef.current = onLostAnchor;

  useEffect(() => {
    if (!open) {
      setPosition((current) => current.positioned
        ? { left: -9999, top: -9999, placement: 'bottom-start', positioned: false }
        : current);
      return undefined;
    }

    let frame = 0;
    let disposed = false;
    const ownerWindow = anchorRef.current?.ownerDocument.defaultView ?? window;
    const visualViewport = ownerWindow.visualViewport;

    const measure = () => {
      frame = 0;
      if (disposed) return;
      const anchor = anchorRef.current;
      const surface = surfaceRef.current;
      if (!anchor?.isConnected || !surface?.isConnected) return;

      const viewportLeft = visualViewport?.offsetLeft ?? 0;
      const viewportTop = visualViewport?.offsetTop ?? 0;
      const viewportWidth = visualViewport?.width ?? ownerWindow.innerWidth;
      const viewportHeight = visualViewport?.height ?? ownerWindow.innerHeight;
      const viewportRight = viewportLeft + viewportWidth;
      const viewportBottom = viewportTop + viewportHeight;
      const anchorRect = anchor.getBoundingClientRect();

      const anchorLost = anchorRect.width <= 0
        || anchorRect.height <= 0
        || anchorRect.right <= viewportLeft + viewportInset
        || anchorRect.left >= viewportRight - viewportInset
        || anchorRect.bottom <= viewportTop + viewportInset
        || anchorRect.top >= viewportBottom - viewportInset;
      if (anchorLost && closeOnLostAnchor) {
        lostAnchorRef.current?.();
        return;
      }

      const surfaceRect = surface.getBoundingClientRect();
      const next = computeAnchoredOverlayPosition({
        anchorRect,
        surfaceWidth: surfaceRect.width,
        surfaceHeight: surfaceRect.height,
        viewportLeft,
        viewportTop,
        viewportWidth,
        viewportHeight,
        gap,
        viewportInset,
        matchAnchorWidth,
      });
      setPosition((current) => (
        current.left === next.left
        && current.top === next.top
        && current.width === next.width
        && current.placement === next.placement
        && current.positioned
          ? current
          : next
      ));
    };

    const schedule = () => {
      if (disposed || frame) return;
      frame = requestAnimationFrame(measure);
    };
    const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedule);
    if (anchorRef.current) resizeObserver?.observe(anchorRef.current);
    if (surfaceRef.current) resizeObserver?.observe(surfaceRef.current);
    ownerWindow.addEventListener('scroll', schedule, true);
    ownerWindow.addEventListener('resize', schedule);
    visualViewport?.addEventListener('scroll', schedule);
    visualViewport?.addEventListener('resize', schedule);
    schedule();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      ownerWindow.removeEventListener('scroll', schedule, true);
      ownerWindow.removeEventListener('resize', schedule);
      visualViewport?.removeEventListener('scroll', schedule);
      visualViewport?.removeEventListener('resize', schedule);
    };
  }, [anchorRef, closeOnLostAnchor, gap, matchAnchorWidth, open, surfaceRef, viewportInset]);

  const style: CSSProperties = {
    position: 'fixed',
    left: position.left,
    top: position.top,
    width: position.width,
    visibility: position.positioned ? undefined : 'hidden',
  };
  return { placement: position.placement, positioned: position.positioned, style } as const;
}

export function useOutsidePointerDismiss(
  open: boolean,
  layerRefs: ReadonlyArray<RefObject<HTMLElement | null>>,
  onDismiss: () => void,
) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const layerRefsRef = useRef(layerRefs);
  layerRefsRef.current = layerRefs;

  useEffect(() => {
    if (!open) return undefined;
    const ownerDocument = layerRefsRef.current.find((ref) => ref.current)?.current?.ownerDocument ?? document;
    const OwnerNode = ownerDocument.defaultView?.Node ?? Node;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof OwnerNode)) return;
      if (layerRefsRef.current.some((ref) => ref.current?.contains(target))) return;
      onDismissRef.current();
    };
    ownerDocument.addEventListener('pointerdown', handlePointerDown);
    return () => ownerDocument.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);
}

export function useEscapeDismiss(open: boolean, onDismiss: () => void) {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      onDismissRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);
}
