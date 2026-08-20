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
import './context-menu.css';

export const contextMenuSizes = ['l', 'm', 's'] as const;
export type ContextMenuSize = (typeof contextMenuSizes)[number];

type ContextMenuAnchor = 'trigger' | 'pointer';

type ContextMenuContextValue = {
  size: ContextMenuSize;
  closeMenu: () => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext() {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error('ContextMenu subcomponents must be used inside ContextMenu.');
  return context;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" focusable="false" aria-hidden="true">
      <path d="M4.5 8.2 6.8 10.5 11.5 5.8" stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140, 1.4)" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<ContextMenuPosition>({ top: -9999, left: -9999 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerAnchor, setPointerAnchor] = useState<{ x: number; y: number } | undefined>();
  const isOpen = open ?? internalOpen;

  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) closeMenu();
    };
    const handleScrollOrResize = () => closeMenu();
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const triggerRect = triggerRef.current?.getBoundingClientRect();
    const next = resolveMenuPosition(anchor, menuRef.current.getBoundingClientRect(), triggerRect, pointerAnchor);
    setPosition(next);
    const items = menuRef.current.querySelectorAll<HTMLElement>('[data-cometal-menu-item]:not([data-disabled])');
    items[Math.max(0, activeIndex)]?.focus();
  }, [activeIndex, anchor, isOpen, pointerAnchor]);

  const enabledItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[data-cometal-menu-item]:not([data-disabled])') ?? []);

  const moveFocus = (direction: 1 | -1) => {
    const items = enabledItems();
    if (!items.length) return;
    const nextIndex = (activeIndex + direction + items.length) % items.length;
    setActiveIndex(nextIndex);
    items[nextIndex]?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      triggerRef.current?.focus();
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
      const items = enabledItems();
      setActiveIndex(0);
      items[0]?.focus();
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      const items = enabledItems();
      const next = Math.max(0, items.length - 1);
      setActiveIndex(next);
      items[next]?.focus();
    }
  };

  const triggerNode = useMemo(() => {
    if (!isValidElement(trigger)) return trigger;
    return cloneElement(trigger as ReactElement<Record<string, unknown>>, {
      'aria-haspopup': 'menu',
      'aria-expanded': isOpen,
      'aria-controls': isOpen ? menuId : undefined,
    });
  }, [isOpen, menuId, trigger]);

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
            setOpen(!isOpen);
            event.stopPropagation();
          }}
          onContextMenu={(event) => {
            if (!contextOpens) return;
            event.preventDefault();
            setPointerAnchor({ x: event.clientX, y: event.clientY });
            setOpen(true);
          }}
        >
          {triggerNode}
        </span>
        {isOpen ? (
          <div
            ref={menuRef}
            id={menuId}
            className="cometal-context-menu__surface"
            data-size={size}
            role="menu"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
            onKeyDown={handleMenuKeyDown}
          >
            {Children.map(children, (child) => {
              if (!isValidElement(child)) return child;
              return cloneElement(child as ReactElement<{ size?: ContextMenuSize }>, { size });
            })}
          </div>
        ) : null}
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
      role={selected ? 'menuitemcheckbox' : 'menuitem'}
      aria-checked={selected || undefined}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled && !event.defaultPrevented) context.closeMenu();
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
