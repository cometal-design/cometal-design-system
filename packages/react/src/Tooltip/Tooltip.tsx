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
  gap: number,
): { top: number; left: number } {
  switch (placement) {
    case 'top-start':
      return { top: triggerRect.top - panelRect.height - gap, left: triggerRect.left };
    case 'top-center':
      return {
        top: triggerRect.top - panelRect.height - gap,
        left: triggerRect.left + (triggerRect.width - panelRect.width) / 2,
      };
    case 'top-end':
      return {
        top: triggerRect.top - panelRect.height - gap,
        left: triggerRect.right - panelRect.width,
      };
    case 'bottom-start':
      return { top: triggerRect.bottom + gap, left: triggerRect.left };
    case 'bottom-center':
      return {
        top: triggerRect.bottom + gap,
        left: triggerRect.left + (triggerRect.width - panelRect.width) / 2,
      };
    case 'bottom-end':
      return {
        top: triggerRect.bottom + gap,
        left: triggerRect.right - panelRect.width,
      };
    case 'left':
      return {
        top: triggerRect.top + (triggerRect.height - panelRect.height) / 2,
        left: triggerRect.left - panelRect.width - gap,
      };
    case 'right':
      return {
        top: triggerRect.top + (triggerRect.height - panelRect.height) / 2,
        left: triggerRect.right + gap,
      };
  }
}

function fitsViewport(top: number, left: number, width: number, height: number, viewportInset: number, ownerWindow: Window) {
  return (
    top >= viewportInset &&
    left >= viewportInset &&
    top + height <= ownerWindow.innerHeight - viewportInset &&
    left + width <= ownerWindow.innerWidth - viewportInset
  );
}

function clampPosition(top: number, left: number, width: number, height: number, viewportInset: number, ownerWindow: Window) {
  return {
    top: Math.min(
      Math.max(top, viewportInset),
      Math.max(viewportInset, ownerWindow.innerHeight - height - viewportInset),
    ),
    left: Math.min(
      Math.max(left, viewportInset),
      Math.max(viewportInset, ownerWindow.innerWidth - width - viewportInset),
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
  const hoverOwnedRef = useRef(false);
  const focusOwnedRef = useRef(false);
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
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    const ownerWindow = trigger.ownerDocument.defaultView ?? window;
    const visualViewport = ownerWindow.visualViewport;
    let frame = 0;
    const updatePosition = () => {
      frame = 0;
      if (!trigger.isConnected || !panel.isConnected) {
        setOpen(false);
        return;
      }
      const panelStyle = getComputedStyle(panel);
      const spacing50 = Number.parseFloat(panelStyle.getPropertyValue('--cometal-primitive-spacing-50')) || 0;
      const spacing12 = Number.parseFloat(panelStyle.getPropertyValue('--cometal-primitive-spacing-12')) || 0;
      const gap = spacing50 + spacing12;
      const viewportInset = spacing50;
      const triggerRect = trigger.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      let next: TooltipPosition | null = null;
      for (const candidate of getPlacementFallbacks(placement)) {
        const coordinates = getCoordinates(candidate, triggerRect, panelRect, gap);
        if (fitsViewport(coordinates.top, coordinates.left, panelRect.width, panelRect.height, viewportInset, ownerWindow)) {
          next = { ...coordinates, placement: candidate };
          break;
        }
      }
      if (!next) {
        const coordinates = getCoordinates(placement, triggerRect, panelRect, gap);
        next = { ...clampPosition(coordinates.top, coordinates.left, panelRect.width, panelRect.height, viewportInset, ownerWindow), placement };
      }
      setPosition((current) => current.top === next.top && current.left === next.left && current.placement === next.placement ? current : next);
    };
    const schedulePosition = () => {
      if (!frame) frame = requestAnimationFrame(updatePosition);
    };
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(schedulePosition);
    observer?.observe(trigger);
    observer?.observe(panel);
    ownerWindow.addEventListener('resize', schedulePosition);
    ownerWindow.addEventListener('scroll', schedulePosition, true);
    visualViewport?.addEventListener('resize', schedulePosition);
    visualViewport?.addEventListener('scroll', schedulePosition);
    schedulePosition();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      ownerWindow.removeEventListener('resize', schedulePosition);
      ownerWindow.removeEventListener('scroll', schedulePosition, true);
      visualViewport?.removeEventListener('resize', schedulePosition);
      visualViewport?.removeEventListener('scroll', schedulePosition);
    };
  }, [content, hydrated, isOpen, placement, setOpen, size]);

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
      onMouseEnter={() => {
        hoverOwnedRef.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        hoverOwnedRef.current = false;
        if (!focusOwnedRef.current) setOpen(false);
      }}
      onFocus={() => {
        focusOwnedRef.current = true;
        setOpen(true);
      }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        focusOwnedRef.current = false;
        if (!hoverOwnedRef.current) setOpen(false);
      }}
    >
      <span className="cometal-tooltip__trigger" data-cometal-tooltip-trigger>
        {trigger}
      </span>
      {panel && hydrated ? createPortal(panel, document.body) : panel}
    </span>
  );
});
