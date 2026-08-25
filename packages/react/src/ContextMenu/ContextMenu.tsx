import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useHydrated, useOutsidePointerDismiss } from '../internal/overlay';
import CheckIcon from '../icons/generated/components/outline/general/check-01';
import './context-menu.css';

export const contextMenuSizes = ['l', 'm', 's'] as const;
export type ContextMenuSize = (typeof contextMenuSizes)[number];

type ContextMenuAnchor = 'trigger' | 'pointer';

type ContextMenuContextValue = {
  size: ContextMenuSize;
  closeMenu: (restoreFocus?: boolean) => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext() {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error('ContextMenu subcomponents must be used inside ContextMenu.');
  return context;
}

type ContextMenuPosition = { top: number; left: number };

function resolveMenuPosition(anchor: ContextMenuAnchor, menuRect: DOMRect, triggerRect?: DOMRect, pointer?: { x: number; y: number }): ContextMenuPosition {
  const viewportInset = 8;
  const gap = 8;
  let top = pointer?.y ?? 0;
  let left = pointer?.x ?? 0;

  if (anchor === 'trigger' && triggerRect) {
    top = triggerRect.bottom + gap;
    left = triggerRect.left;
    if (left + menuRect.width > window.innerWidth - viewportInset) {
      left = triggerRect.right - menuRect.width;
    }
    if (top + menuRect.height > window.innerHeight - viewportInset) {
      top = triggerRect.top - menuRect.height - gap;
    }
  }

  if (anchor === 'pointer' && pointer) {
    if (left + menuRect.width > window.innerWidth - viewportInset) {
      left = window.innerWidth - menuRect.width - viewportInset;
    }
    if (top + menuRect.height > window.innerHeight - viewportInset) {
      top = window.innerHeight - menuRect.height - viewportInset;
    }
  }

  return {
    top: Math.max(viewportInset, top),
    left: Math.max(viewportInset, left),
  };
}

export interface ContextMenuProps extends HTMLAttributes<HTMLSpanElement> {
  trigger: ReactElement;
  children: ReactNode;
  size?: ContextMenuSize;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  anchor?: ContextMenuAnchor;
  clickOpens?: boolean;
  contextOpens?: boolean;
}

export const ContextMenu = forwardRef<HTMLSpanElement, ContextMenuProps>(function ContextMenu(
  {
    trigger,
    children,
    size = 'm',
    open,
    defaultOpen = false,
    onOpenChange,
    anchor = 'trigger',
    clickOpens = true,
    contextOpens = true,
    className,
    ...props
  },
  ref,
) {
  const menuId = useId();
  const generatedTriggerId = `${menuId}-trigger`;
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const typeaheadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeaheadBufferRef = useRef('');
  const focusMenuOnOpenRef = useRef(false);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const mounted = useHydrated();
  const [position, setPosition] = useState<ContextMenuPosition>({ top: -9999, left: -9999 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerAnchor, setPointerAnchor] = useState<{ x: number; y: number } | undefined>();
  const isOpen = open ?? internalOpen;

  useEffect(() => () => {
    if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
  }, []);

  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const focusTrigger = () => {
    const trigger = triggerRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    trigger?.focus();
  };

  const closeMenu = (restoreFocus = false) => {
    focusMenuOnOpenRef.current = false;
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(focusTrigger);
  };

  useOutsidePointerDismiss(isOpen, [rootRef, menuRef], () => closeMenu(false));

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => {
      if (!menuRef.current) return;
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      setPosition(resolveMenuPosition(anchor, menuRef.current.getBoundingClientRect(), triggerRect, pointerAnchor));
    };
    const handleResize = () => closeMenu(false);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [anchor, isOpen, pointerAnchor]);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const triggerRect = triggerRef.current?.getBoundingClientRect();
    const next = resolveMenuPosition(anchor, menuRef.current.getBoundingClientRect(), triggerRect, pointerAnchor);
    setPosition(next);
  }, [anchor, isOpen, pointerAnchor]);

  useEffect(() => {
    if (!isOpen || position.top < 0 || !menuRef.current) return;
    const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>('[data-cometal-menu-item]:not([data-disabled])'));
    const resolvedIndex = Math.min(Math.max(0, activeIndex), Math.max(0, items.length - 1));
    items.forEach((item, index) => { item.tabIndex = index === resolvedIndex ? 0 : -1; });
    if (focusMenuOnOpenRef.current) {
      focusMenuOnOpenRef.current = false;
      items[resolvedIndex]?.focus({ preventScroll: true });
    }
  }, [activeIndex, isOpen, position]);

  const enabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[data-cometal-menu-item]:not([data-disabled])') ?? []);

  const moveFocus = (direction: 1 | -1) => {
    const items = enabledItems();
    if (!items.length) return;
    const focusedIndex = items.indexOf(document.activeElement as HTMLElement);
    const currentIndex = focusedIndex >= 0 ? focusedIndex : activeIndex;
    const nextIndex = (currentIndex + direction + items.length) % items.length;
    setActiveIndex(nextIndex);
    items[nextIndex]?.focus();
  };

  const moveFocusToBoundary = (boundary: 'first' | 'last') => {
    const items = enabledItems();
    if (!items.length) return;
    const nextIndex = boundary === 'first' ? 0 : items.length - 1;
    setActiveIndex(nextIndex);
    items[nextIndex]?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu(true);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(1);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(-1);
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      moveFocusToBoundary('first');
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      moveFocusToBoundary('last');
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
      typeaheadBufferRef.current += event.key.toLocaleLowerCase('ru-RU');
      if (typeaheadTimerRef.current) clearTimeout(typeaheadTimerRef.current);
      typeaheadTimerRef.current = setTimeout(() => { typeaheadBufferRef.current = ''; }, 500);
      const items = enabledItems();
      const query = typeaheadBufferRef.current;
      const currentIndex = Math.max(items.indexOf(document.activeElement as HTMLElement), -1);
      for (let offset = 1; offset <= items.length; offset += 1) {
        const index = (currentIndex + offset) % items.length;
        if (items[index]?.textContent?.trim().toLocaleLowerCase('ru-RU').startsWith(query)) {
          event.preventDefault();
          setActiveIndex(index);
          items[index]?.focus();
          break;
        }
      }
    }
  };

  const triggerNode = useMemo(() => {
    if (!mounted || !isValidElement(trigger)) return trigger;
    const existingTriggerId = (trigger.props as { id?: unknown }).id;
    const triggerId = typeof existingTriggerId === 'string' ? existingTriggerId : generatedTriggerId;
    return cloneElement(trigger as ReactElement<Record<string, unknown>>, {
      id: triggerId,
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? menuId : undefined,
    });
  }, [generatedTriggerId, isOpen, menuId, mounted, trigger]);

  const triggerId = isValidElement(trigger) && typeof (trigger.props as { id?: unknown }).id === 'string'
    ? (trigger.props as { id: string }).id
    : generatedTriggerId;

  const menuSurface = isOpen ? (
    <div
      ref={menuRef}
      id={menuId}
      className="cometal-context-menu__surface"
      data-size={size}
      role="menu"
      aria-labelledby={triggerId}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onKeyDown={handleMenuKeyDown}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget && menuRef.current?.contains(nextTarget)) return;
        closeMenu(false);
      }}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child as ReactElement<{ size?: ContextMenuSize }>, { size });
      })}
    </div>
  ) : null;

  return (
    <ContextMenuContext.Provider value={{ size, closeMenu }}>
      <span
        {...props}
        ref={(node) => {
          rootRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={['cometal-context-menu', className].filter(Boolean).join(' ')}
      >
        <span
          ref={triggerRef}
          className="cometal-context-menu__trigger"
          onClick={(event) => {
            if (!clickOpens) return;
            setPointerAnchor(undefined);
            if (!isOpen) {
              setActiveIndex(0);
              focusMenuOnOpenRef.current = event.detail === 0;
            }
            setOpen(!isOpen);
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            if (!triggerRef.current?.contains(event.target as Node)) return;
            if (isOpen && event.key === 'Escape') {
              event.preventDefault();
              closeMenu(true);
              return;
            }
            if (isOpen) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setPointerAnchor(undefined);
              setActiveIndex(event.key === 'ArrowUp' ? Number.MAX_SAFE_INTEGER : 0);
              focusMenuOnOpenRef.current = true;
              setOpen(true);
            }
          }}
          onContextMenu={(event) => {
            if (!contextOpens) return;
            event.preventDefault();
            setPointerAnchor({ x: event.clientX, y: event.clientY });
            setActiveIndex(0);
            focusMenuOnOpenRef.current = false;
            setOpen(true);
          }}
        >
          {triggerNode}
        </span>
        {mounted && menuSurface ? createPortal(menuSurface, document.body) : null}
      </span>
    </ContextMenuContext.Provider>
  );
});

export interface ContextMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ContextMenuSize;
  tone?: 'default' | 'danger';
  selected?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const ContextMenuItem = forwardRef<HTMLButtonElement, ContextMenuItemProps>(function ContextMenuItem(
  {
    size,
    tone = 'default',
    selected = false,
    startIcon,
    endIcon,
    disabled,
    children,
    className,
    onClick,
    tabIndex = -1,
    ...props
  },
  ref,
) {
  const context = useContextMenuContext();
  const resolvedSize = size ?? context.size;
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      className={['cometal-context-menu__item', className].filter(Boolean).join(' ')}
      data-cometal-menu-item
      data-size={resolvedSize}
      data-tone={tone}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={tabIndex}
      role={selected ? 'menuitemcheckbox' : 'menuitem'}
      aria-checked={selected || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled && !event.defaultPrevented) context.closeMenu(true);
      }}
    >
      <span className="cometal-context-menu__item-main">
        {startIcon ? <span className="cometal-context-menu__icon" aria-hidden="true">{startIcon}</span> : null}
        <span className="cometal-context-menu__label">{children}</span>
      </span>
      <span className="cometal-context-menu__item-end">
        {endIcon ? <span className="cometal-context-menu__icon" aria-hidden="true">{endIcon}</span> : null}
        {selected ? <span className="cometal-context-menu__icon" aria-hidden="true"><CheckIcon /></span> : null}
      </span>
    </button>
  );
});

export function ContextMenuDivider({ size }: { size?: ContextMenuSize }) {
  const context = useContextMenuContext();
  const resolvedSize = size ?? context.size;
  return <div className="cometal-context-menu__divider" data-size={resolvedSize} role="separator" />;
}
