import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

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
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (layerRefsRef.current.some((ref) => ref.current?.contains(target))) return;
      onDismissRef.current();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
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
