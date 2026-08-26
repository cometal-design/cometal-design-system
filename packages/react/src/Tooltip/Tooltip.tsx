import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useControllableOpen, useEscapeDismiss, useHydrated } from '../internal/overlay';
import './tooltip.css';

export const tooltipSizes = ['compact', 'wide'] as const;
export const tooltipPlacements = [
  'top-start',
  'top-center',
  'top-end',
  'bottom-start',
  'bottom-center',
  'bottom-end',
  'left',
  'right',
] as const;

export type TooltipSize = (typeof tooltipSizes)[number];
export type TooltipPlacement = (typeof tooltipPlacements)[number];

type TooltipPosition = {
  top: number;
  left: number;
  placement: TooltipPlacement;
};

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  content: ReactNode;
  children: ReactElement;
  size?: TooltipSize;
  placement?: TooltipPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

const GAP = 10;
const VIEWPORT_INSET = 8;

function getPlacementFallbacks(placement: TooltipPlacement): TooltipPlacement[] {
  switch (placement) {
    case 'top-start':
      return ['top-start', 'bottom-start', 'top-center', 'bottom-center', 'right', 'left'];
    case 'top-center':
      return ['top-center', 'bottom-center', 'top-start', 'top-end', 'right', 'left'];
    case 'top-end':
      return ['top-end', 'bottom-end', 'top-center', 'bottom-center', 'left', 'right'];
    case 'bottom-start':
      return ['bottom-start', 'top-start', 'bottom-center', 'top-center', 'right', 'left'];
    case 'bottom-center':
      return ['bottom-center', 'top-center', 'bottom-start', 'bottom-end', 'right', 'left'];
    case 'bottom-end':
      return ['bottom-end', 'top-end', 'bottom-center', 'top-center', 'left', 'right'];
    case 'left':
      return ['left', 'right', 'top-center', 'bottom-center'];
    case 'right':
      return ['right', 'left', 'top-center', 'bottom-center'];
    default:
      return [placement];
  }
}

function getCoordinates(
  placement: TooltipPlacement,
  triggerRect: DOMRect,
  panelRect: DOMRect,
): { top: number; left: number } {
  switch (placement) {
    case 'top-start':
      return { top: triggerRect.top - panelRect.height - GAP, left: triggerRect.left };
    case 'top-center':
      return {
        top: triggerRect.top - panelRect.height - GAP,
        left: triggerRect.left + (triggerRect.width - panelRect.width) / 2,
      };
    case 'top-end':
      return {
        top: triggerRect.top - panelRect.height - GAP,
        left: triggerRect.right - panelRect.width,
      };
    case 'bottom-start':
      return { top: triggerRect.bottom + GAP, left: triggerRect.left };
    case 'bottom-center':
      return {
        top: triggerRect.bottom + GAP,
        left: triggerRect.left + (triggerRect.width - panelRect.width) / 2,
      };
    case 'bottom-end':
      return {
        top: triggerRect.bottom + GAP,
        left: triggerRect.right - panelRect.width,
      };
    case 'left':
      return {
        top: triggerRect.top + (triggerRect.height - panelRect.height) / 2,
        left: triggerRect.left - panelRect.width - GAP,
      };
    case 'right':
      return {
        top: triggerRect.top + (triggerRect.height - panelRect.height) / 2,
        left: triggerRect.right + GAP,
      };
  }
}

function fitsViewport(top: number, left: number, width: number, height: number) {
  return (
    top >= VIEWPORT_INSET &&
    left >= VIEWPORT_INSET &&
    top + height <= window.innerHeight - VIEWPORT_INSET &&
    left + width <= window.innerWidth - VIEWPORT_INSET
  );
}

function clampPosition(top: number, left: number, width: number, height: number) {
  return {
    top: Math.min(
      Math.max(top, VIEWPORT_INSET),
      Math.max(VIEWPORT_INSET, window.innerHeight - height - VIEWPORT_INSET),
    ),
    left: Math.min(
      Math.max(left, VIEWPORT_INSET),
      Math.max(VIEWPORT_INSET, window.innerWidth - width - VIEWPORT_INSET),
    ),
  };
}

export const Tooltip = forwardRef<HTMLSpanElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    size = 'compact',
    placement = 'top-start',
    open,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    className,
    ...props
  },
  ref,
) {
  const tooltipId = useId();
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLSpanElement | null>(null);
  const [openState, setOpen] = useControllableOpen(open, defaultOpen, onOpenChange);
  const [position, setPosition] = useState<TooltipPosition>({
    top: -9999,
    left: -9999,
    placement,
  });
  const isOpen = !disabled && openState;
  const hydrated = useHydrated();
  useEscapeDismiss(isOpen, () => setOpen(false));

  useEffect(() => {
    if (!isOpen) setPosition((current) => ({ ...current, placement }));
  }, [isOpen, placement]);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !panelRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    let resolvedPlacement = placement;
    let resolvedTop = -9999;
    let resolvedLeft = -9999;

    for (const candidate of getPlacementFallbacks(placement)) {
      const { top, left } = getCoordinates(candidate, triggerRect, panelRect);
      if (fitsViewport(top, left, panelRect.width, panelRect.height)) {
        resolvedPlacement = candidate;
        resolvedTop = top;
        resolvedLeft = left;
        break;
      }
    }

    if (resolvedTop === -9999 || resolvedLeft === -9999) {
      const clamped = clampPosition(
        getCoordinates(placement, triggerRect, panelRect).top,
        getCoordinates(placement, triggerRect, panelRect).left,
        panelRect.width,
        panelRect.height,
      );
      resolvedTop = clamped.top;
      resolvedLeft = clamped.left;
    }

    setPosition({
      top: resolvedTop,
      left: resolvedLeft,
      placement: resolvedPlacement,
    });
  }, [content, hydrated, isOpen, placement, size]);

  useEffect(() => {
    if (!isOpen) return;
    const handleWindowChange = () => {
      if (!triggerRef.current || !panelRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();
      const clamped = clampPosition(position.top, position.left, panelRect.width, panelRect.height);
      const nextCoords = getCoordinates(position.placement, triggerRect, panelRef.current.getBoundingClientRect());
      const fits = fitsViewport(nextCoords.top, nextCoords.left, panelRect.width, panelRect.height);
      setPosition({
        top: fits ? nextCoords.top : clamped.top,
        left: fits ? nextCoords.left : clamped.left,
        placement: position.placement,
      });
    };
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);
    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
    };
  }, [isOpen, position.left, position.placement, position.top]);

  const child = children;
  const describedBy = isOpen && hydrated ? tooltipId : undefined;
  const trigger = useMemo(() => {
    if (!isValidElement(child)) return child;
    const existingProps = child.props as { 'aria-describedby'?: string };
    const mergedDescribedBy = [existingProps['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined;
    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      'aria-describedby': mergedDescribedBy,
    });
  }, [child, describedBy]);
  const panel = isOpen ? (
    <span
      ref={panelRef}
      id={tooltipId}
      role="tooltip"
      className="cometal-tooltip__panel"
      data-size={size}
      data-placement={position.placement}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <span className="cometal-tooltip__arrow" aria-hidden="true" />
      <span className="cometal-tooltip__content">{content}</span>
    </span>
  ) : null;

  return (
    <span
      {...props}
      ref={(node) => {
        wrapperRef.current = node;
        triggerRef.current = node?.querySelector?.('[data-cometal-tooltip-trigger]') ?? null;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={['cometal-tooltip', className].filter(Boolean).join(' ')}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setOpen(false);
      }}
    >
      <span className="cometal-tooltip__trigger" data-cometal-tooltip-trigger>
        {trigger}
      </span>
      {panel && hydrated ? createPortal(panel, document.body) : panel}
    </span>
  );
});
