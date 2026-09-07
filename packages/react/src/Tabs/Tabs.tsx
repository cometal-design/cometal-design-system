import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactElement,
  ReactNode,
} from 'react';
import { Button } from '../Button/Button';
import './tabs.css';

export const tabSizes = ['l', 'm', 's'] as const;
export type TabSize = (typeof tabSizes)[number];

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: TabSize;
  children: ReactNode;
}

export type TabListProps =
  Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-orientation'> &
  ({ 'aria-label': string; 'aria-labelledby'?: never } |
   { 'aria-label'?: never; 'aria-labelledby': string });

export interface TabProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export interface TabPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'role' | 'hidden' | 'aria-labelledby'> {
  value: string;
  children: ReactNode;
}

type TabItem = { value: string; disabled: boolean };

type TabsContextValue = {
  idPrefix: string;
  items: readonly TabItem[];
  selectedValue: string | undefined;
  focusValue: string | undefined;
  size: TabSize;
  activate: (value: string) => void;
  moveFocus: (value: string, key: string, direction: string) => void;
  noteFocus: (value: string) => void;
  setTriggerNode: (value: string, node: HTMLButtonElement | null) => void;
  reportItems: (items: readonly TabItem[]) => void;
  registerPanel: (registrationId: string, value: string) => () => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`${component} must be used inside Tabs.`);
  return context;
}

function childElements(children: ReactNode): ReactElement[] {
  return Children.toArray(children).filter(isValidElement);
}

function collectTabs(children: ReactNode): TabItem[] {
  const list = childElements(children).find((child) => child.type === TabList);
  if (!list) return [];
  const listChildren = (list.props as { children?: ReactNode }).children;
  return childElements(listChildren)
    .filter((child) => child.type === Tab)
    .map((child) => {
      const props = child.props as TabProps;
      return { value: props.value, disabled: props.disabled === true };
    });
}

function collectPanels(children: ReactNode): string[] {
  return childElements(children)
    .filter((child) => child.type === TabPanel)
    .map((child) => (child.props as TabPanelProps).value);
}

function firstEnabled(items: readonly TabItem[]) {
  return items.find((item) => !item.disabled)?.value;
}

function nearestEnabled(
  items: readonly TabItem[],
  previousItems: readonly TabItem[],
  removedValue: string | undefined,
) {
  if (!items.length) return undefined;
  const formerIndex = Math.max(0, previousItems.findIndex((item) => item.value === removedValue));
  for (let index = Math.min(formerIndex, items.length - 1); index < items.length; index += 1) {
    if (!items[index].disabled) return items[index].value;
  }
  for (let index = Math.min(formerIndex - 1, items.length - 1); index >= 0; index -= 1) {
    if (!items[index].disabled) return items[index].value;
  }
  return undefined;
}

function encodeValue(value: string) {
  return Array.from(value, (character) => character.codePointAt(0)?.toString(16) ?? '').join('-');
}

function relationIds(prefix: string, value: string) {
  const suffix = encodeValue(value);
  return {
    tabId: `${prefix}-tab-${suffix}`,
    panelId: `${prefix}-panel-${suffix}`,
  };
}

function warnInvalidContract(items: readonly TabItem[], panels: readonly string[], selectedValue?: string) {
  if (process.env.NODE_ENV === 'production') return;
  const tabValues = items.map((item) => item.value);
  const duplicateTabs = tabValues.filter((value, index) => tabValues.indexOf(value) !== index);
  const duplicatePanels = panels.filter((value, index) => panels.indexOf(value) !== index);
  const emptyTabs = tabValues.filter((value) => value.length === 0);
  const emptyPanels = panels.filter((value) => value.length === 0);
  const missingPanels = tabValues.filter((value) => !panels.includes(value));
  const missingTabs = panels.filter((value) => !tabValues.includes(value));

  if (emptyTabs.length || emptyPanels.length) console.error('Tabs values must be non-empty.');
  if (duplicateTabs.length) console.error(`Tabs has duplicate Tab values: ${duplicateTabs.join(', ')}.`);
  if (duplicatePanels.length) console.error(`Tabs has duplicate TabPanel values: ${duplicatePanels.join(', ')}.`);
  if (missingPanels.length) console.error(`Tabs is missing TabPanel values: ${missingPanels.join(', ')}.`);
  if (missingTabs.length) console.error(`Tabs is missing Tab values: ${missingTabs.join(', ')}.`);
  if (selectedValue !== undefined && !tabValues.includes(selectedValue)) {
    console.error(`Tabs controlled value has no matching Tab: ${selectedValue}.`);
  }
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    value,
    defaultValue,
    onValueChange,
    size = 'l',
    children,
    className,
    ...rootProps
  },
  ref,
) {
  const controlled = value !== undefined;
  const collectedItems = collectTabs(children);
  const collectedPanels = collectPanels(children);
  const [reportedItems, setReportedItems] = useState<readonly TabItem[]>([]);
  const [, refreshRegisteredCollection] = useState(0);
  const triggerNodesRef = useRef(new Map<string, HTMLButtonElement>());
  const registeredPanelsRef = useRef(new Map<string, string>());
  const lastFocusedValueRef = useRef<string | undefined>(undefined);
  const items = collectedItems.length ? collectedItems : reportedItems;
  const panels = collectedPanels.length ? collectedPanels : Array.from(registeredPanelsRef.current.values());
  const previousItemsRef = useRef(items);
  const generatedId = useId();
  const idPrefix = `cometal-tabs-${generatedId.replace(/:/g, '')}`;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(() => (
    defaultValue !== undefined ? defaultValue : firstEnabled(items)
  ));
  const requestedValue = controlled ? value : uncontrolledValue;
  const selectedExists = requestedValue !== undefined && items.some((item) => item.value === requestedValue);
  const fallbackSelection = controlled || selectedExists
    ? requestedValue
    : nearestEnabled(items, previousItemsRef.current, requestedValue);
  const selectedValue = controlled ? value : fallbackSelection;
  const initialFocus = selectedValue && items.some((item) => item.value === selectedValue && !item.disabled)
    ? selectedValue
    : firstEnabled(items);
  const [storedFocusValue, setStoredFocusValue] = useState<string | undefined>(initialFocus);
  const focusExists = storedFocusValue !== undefined
    && items.some((item) => item.value === storedFocusValue && !item.disabled);
  const focusValue = focusExists
    ? storedFocusValue
    : nearestEnabled(items, previousItemsRef.current, storedFocusValue);
  const contractSignature = `${items.map((item) => `${item.value}:${item.disabled}`).join('|')}::${panels.join('|')}::${controlled ? value ?? '' : ''}`;

  useEffect(() => {
    warnInvalidContract(items, panels, controlled ? value : undefined);
  }, [contractSignature]);

  useEffect(() => {
    if (!controlled && uncontrolledValue !== selectedValue) setUncontrolledValue(selectedValue);
  }, [controlled, selectedValue, uncontrolledValue]);

  useEffect(() => {
    if (storedFocusValue !== focusValue) {
      const focusedValueWasRemoved = lastFocusedValueRef.current === storedFocusValue
        && !items.some((item) => item.value === storedFocusValue);
      setStoredFocusValue(focusValue);
      if (focusedValueWasRemoved && focusValue) triggerNodesRef.current.get(focusValue)?.focus();
    }
    previousItemsRef.current = items;
  }, [focusValue, items, storedFocusValue]);

  const activate = useCallback((nextValue: string) => {
    const item = items.find((candidate) => candidate.value === nextValue);
    if (!item || item.disabled || nextValue === selectedValue) return;
    if (!controlled) setUncontrolledValue(nextValue);
    onValueChange?.(nextValue);
  }, [controlled, items, onValueChange, selectedValue]);

  const noteFocus = useCallback((nextValue: string) => {
    lastFocusedValueRef.current = nextValue;
    setStoredFocusValue(nextValue);
  }, []);

  const setTriggerNode = useCallback((itemValue: string, node: HTMLButtonElement | null) => {
    if (node) triggerNodesRef.current.set(itemValue, node);
    else triggerNodesRef.current.delete(itemValue);
  }, []);

  const reportItems = useCallback((nextItems: readonly TabItem[]) => {
    setReportedItems(nextItems);
  }, []);

  const registerPanel = useCallback((registrationId: string, panelValue: string) => {
    registeredPanelsRef.current.set(registrationId, panelValue);
    refreshRegisteredCollection((version) => version + 1);
    return () => {
      registeredPanelsRef.current.delete(registrationId);
      refreshRegisteredCollection((version) => version + 1);
    };
  }, []);

  const moveFocus = useCallback((currentValue: string, key: string, direction: string) => {
    const enabled = items.filter((item) => !item.disabled);
    if (!enabled.length) return;
    const currentIndex = Math.max(0, enabled.findIndex((item) => item.value === currentValue));
    let nextIndex = currentIndex;
    if (key === 'Home') nextIndex = 0;
    else if (key === 'End') nextIndex = enabled.length - 1;
    else {
      const forward = direction === 'rtl' ? key === 'ArrowLeft' : key === 'ArrowRight';
      nextIndex = (currentIndex + (forward ? 1 : -1) + enabled.length) % enabled.length;
    }
    const nextValue = enabled[nextIndex].value;
    setStoredFocusValue(nextValue);
    triggerNodesRef.current.get(nextValue)?.focus();
  }, [items]);

  const context = useMemo<TabsContextValue>(() => ({
    idPrefix,
    items,
    selectedValue,
    focusValue,
    size,
    activate,
    moveFocus,
    noteFocus,
    setTriggerNode,
    reportItems,
    registerPanel,
  }), [activate, focusValue, idPrefix, items, moveFocus, noteFocus, registerPanel, reportItems, selectedValue, setTriggerNode, size]);

  return (
    <TabsContext.Provider value={context}>
      <div
        {...rootProps}
        ref={ref}
        className={['cometal-tabs', className].filter(Boolean).join(' ')}
        data-cometal-component="tabs"
        data-size={size}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { className, children, ...listProps },
  ref,
) {
  const { reportItems } = useTabsContext('TabList');
  const describedItems = childElements(children).map((child) => {
    const props = child.props as Partial<TabProps>;
    return { value: props.value ?? '', disabled: props.disabled === true };
  });
  const itemSignature = describedItems.map((item) => `${item.value}:${item.disabled}`).join('|');
  useEffect(() => {
    reportItems(describedItems);
    return () => reportItems([]);
  }, [itemSignature, reportItems]);
  return (
    <div
      {...listProps}
      ref={ref}
      className={['cometal-tabs__list', className].filter(Boolean).join(' ')}
      role="tablist"
      aria-orientation="horizontal"
    >
      {children}
    </div>
  );
});

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, disabled = false, children, className },
  forwardedRef,
) {
  const context = useTabsContext('Tab');
  const { setTriggerNode } = context;
  const selected = context.selectedValue === value;
  const focusable = !disabled && context.focusValue === value;
  const ids = relationIds(context.idPrefix, value);
  const setRef = useCallback((node: HTMLButtonElement | null) => {
    setTriggerNode(value, node);
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [forwardedRef, setTriggerNode, value]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const list = event.currentTarget.closest<HTMLElement>('[role="tablist"]');
    context.moveFocus(value, event.key, list ? getComputedStyle(list).direction : 'ltr');
  };

  return (
    <div
      className={['cometal-tabs__item', className].filter(Boolean).join(' ')}
      data-cometal-part="tab-item"
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
    >
      <Button
        ref={setRef}
        className="cometal-tabs__trigger"
        variant="inverse-ghost"
        size={context.size}
        disabled={disabled}
        role="tab"
        id={ids.tabId}
        aria-controls={ids.panelId}
        aria-selected={selected}
        aria-disabled={disabled || undefined}
        tabIndex={focusable ? 0 : -1}
        onFocus={() => context.noteFocus(value)}
        onClick={() => context.activate(value)}
        onKeyDown={handleKeyDown}
      >
        {children}
      </Button>
      <span className="cometal-tabs__indicator" data-cometal-part="indicator" aria-hidden="true" />
    </div>
  );
});

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, className, children, tabIndex, ...panelProps },
  ref,
) {
  const context = useTabsContext('TabPanel');
  const { registerPanel } = context;
  const registrationId = useId();
  const selected = context.selectedValue === value;
  const ids = relationIds(context.idPrefix, value);
  useEffect(
    () => registerPanel(registrationId, value),
    [registerPanel, registrationId, value],
  );
  return (
    <div
      {...panelProps}
      ref={ref}
      className={['cometal-tabs__panel', className].filter(Boolean).join(' ')}
      role="tabpanel"
      id={ids.panelId}
      aria-labelledby={ids.tabId}
      hidden={!selected}
      tabIndex={selected ? tabIndex ?? 0 : undefined}
    >
      {children}
    </div>
  );
});
