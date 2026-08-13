import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type {
  ButtonHTMLAttributes,
  KeyboardEvent,
  InputHTMLAttributes,
  ReactNode,
  RefObject,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import './field.css';

export const fieldSizes = ['l', 'm', 's'] as const;
export type FieldSize = (typeof fieldSizes)[number];
export const multilineFieldSizes = ['l', 'm'] as const;
export type MultilineFieldSize = (typeof multilineFieldSizes)[number];
export type FieldMode = 'edit' | 'read';

export type FieldChromeProps = {
  className?: string;
  label: string;
  helperText?: string;
  optional?: boolean;
  error?: string;
  size?: FieldSize;
  mode?: FieldMode;
  readValue?: ReactNode;
  multilineRead?: boolean;
  controlId?: string;
  supportingId?: string;
  supportingEnd?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
};

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" focusable="false">
      <path d="M5.833 7.917 10 12.083l4.167-4.166" stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140, 1.4)" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" focusable="false">
      <path d="m14.038 14.133 2.929 2.834M16.022 9.411a6.611 6.611 0 1 1-13.222 0 6.611 6.611 0 0 1 13.222 0Z" stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140, 1.4)" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function RemoveValueIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" focusable="false">
      <path d="m3.5 3.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140, 1.4)" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function FieldChrome({
  className,
  label,
  helperText,
  optional = false,
  error,
  size = 'l',
  mode = 'edit',
  readValue,
  multilineRead = false,
  controlId,
  supportingId,
  supportingEnd,
  disabled = false,
  children,
}: FieldChromeProps) {
  if (mode === 'read') {
    return (
      <div className={['cometal-field-read', className].filter(Boolean).join(' ')} data-cometal-component="field" data-size={size} data-multiline={multilineRead || undefined}>
        <span className="cometal-field-read__label">{label}</span>
        <span className="cometal-field-read__value">{readValue || '—'}</span>
      </div>
    );
  }

  return (
    <div className={['cometal-field', className].filter(Boolean).join(' ')} data-cometal-component="field" data-size={size} data-invalid={Boolean(error) || undefined} data-disabled={disabled || undefined} aria-disabled={disabled || undefined}>
      <div className="cometal-field__body">
        <span className="cometal-field__label-row">
          <label className="cometal-field__label" htmlFor={controlId}>{label}</label>
          {optional ? <span className="cometal-field__optional">Необязательно</span> : null}
        </span>
        {children}
      </div>
      {helperText || error || supportingEnd ? (
        <span className="cometal-field__supporting-row" id={supportingId}>
          <span className="cometal-field__supporting">{error || helperText}</span>
          {supportingEnd ? <span className="cometal-field__supporting-end">{supportingEnd}</span> : null}
        </span>
      ) : null}
    </div>
  );
}

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  helperText?: string;
  optional?: boolean;
  error?: string;
  size?: FieldSize;
  mode?: FieldMode;
  readValue?: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, helperText, optional, error, size = 'l', mode = 'edit', readValue, startIcon, endIcon, className, disabled, ...inputProps },
  ref,
) {
  const generatedId = useId();
  const controlId = inputProps.id ?? `cometal-field-${generatedId}`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  const value = readValue ?? inputProps.value ?? inputProps.defaultValue;
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={value} controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__control">
        {startIcon ? <span className="cometal-field__icon" aria-hidden="true">{startIcon}</span> : null}
        <input {...inputProps} id={controlId} ref={ref} disabled={disabled} aria-describedby={inputProps['aria-describedby'] ?? supportingId} aria-invalid={error ? true : undefined} className="cometal-field__input" />
        {endIcon ? <span className="cometal-field__icon" aria-hidden="true">{endIcon}</span> : null}
      </span>
    </FieldChrome>
  );
});

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  optional?: boolean;
  error?: string;
  size?: MultilineFieldSize;
  mode?: FieldMode;
  readValue?: ReactNode;
  showCounter?: boolean;
  showScrollbar?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, helperText, optional, error, size = 'l', mode = 'edit', readValue, showCounter = false, showScrollbar = false, startIcon, endIcon, className, maxLength, value, defaultValue, disabled, ...textareaProps },
  ref,
) {
  const generatedId = useId();
  const controlId = textareaProps.id ?? `cometal-textarea-${generatedId}`;
  const currentValue = value ?? defaultValue ?? '';
  const counter = showCounter && maxLength ? `${String(currentValue).length} / ${maxLength}` : undefined;
  const supportingId = error || helperText || counter ? `${controlId}-supporting` : undefined;
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue ?? currentValue} multilineRead controlId={controlId} supportingId={supportingId} supportingEnd={counter} disabled={disabled}>
      <span className="cometal-field__control cometal-field__control--textarea">
        {startIcon ? <span className="cometal-field__icon" aria-hidden="true">{startIcon}</span> : null}
        <textarea {...textareaProps} id={controlId} ref={ref} value={value} defaultValue={defaultValue} maxLength={maxLength} disabled={disabled} aria-describedby={textareaProps['aria-describedby'] ?? supportingId} aria-invalid={error ? true : undefined} className="cometal-field__input cometal-field__textarea" />
        {endIcon ? <span className="cometal-field__icon" aria-hidden="true">{endIcon}</span> : null}
        {showScrollbar ? <span className="cometal-field__scrollbar" aria-hidden="true" /> : null}
      </span>
    </FieldChrome>
  );
});

export type SelectOption = { value: string; label: string; disabled?: boolean };

type FieldListboxProps = {
  id: string;
  label: string;
  options: SelectOption[];
  selectedValues?: string[];
  size: FieldSize;
  multiple?: boolean;
  motion?: boolean;
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  onSelect?: (value: string) => void;
};

function FieldListbox({ id, label, options, selectedValues = [], size, multiple = false, motion = false, activeIndex, onActiveChange, onSelect }: FieldListboxProps) {
  return (
    <div className="cometal-field__listbox" id={id} role="listbox" aria-label={label} aria-multiselectable={multiple || undefined} data-size={size} data-motion={motion ? 'enter' : undefined}>
      {options.map((option, index) => {
        const selected = selectedValues.includes(option.value);
        return (
          <div
            id={`${id}-option-${index}`}
            className="cometal-field__option"
            role="option"
            aria-selected={selected}
            aria-disabled={option.disabled || undefined}
            tabIndex={-1}
            data-selected={selected || undefined}
            data-active={index === activeIndex || undefined}
            key={option.value}
            onPointerEnter={() => { if (!option.disabled) onActiveChange?.(index); }}
            onPointerLeave={() => onActiveChange?.(-1)}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => { if (!option.disabled) onSelect?.(option.value); }}
          >
            <span>{option.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function usePopupState(expanded: boolean | undefined, defaultExpanded: boolean, onExpandedChange?: (expanded: boolean) => void) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = expanded ?? internalExpanded;
  const setExpanded = (next: boolean) => {
    if (expanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };
  return [isExpanded, setExpanded] as const;
}

function useOutsidePointerDismiss(containerRef: RefObject<HTMLElement | null>, isExpanded: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!isExpanded) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !containerRef.current?.contains(target)) onDismiss();
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [containerRef, isExpanded, onDismiss]);
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  optional?: boolean;
  error?: string;
  size?: FieldSize;
  mode?: FieldMode;
  readValue?: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onValueChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder = 'Выберите значение', helperText, optional, error, size = 'l', mode = 'edit', readValue, className, disabled, expanded, defaultExpanded = false, onExpandedChange, onValueChange, onChange, value, defaultValue, ...selectProps },
  forwardedRef,
) {
  const generatedId = useId();
  const controlId = selectProps.id ?? `cometal-select-${generatedId}`;
  const listboxId = `${controlId}-listbox`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  const nativeRef = useRef<HTMLSelectElement | null>(null);
  const popupRef = useRef<HTMLSpanElement | null>(null);
  useImperativeHandle(forwardedRef, () => nativeRef.current as HTMLSelectElement);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [internalValue, setInternalValue] = useState(String(defaultValue ?? ''));
  const [listboxMotion, setListboxMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isExpanded = expanded ?? internalExpanded;
  const selectedValue = String(value ?? internalValue);
  const selectedLabel = options.find((option) => option.value === selectedValue)?.label;
  const setExpanded = (next: boolean) => {
    if (expanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };
  useOutsidePointerDismiss(popupRef, isExpanded, () => setExpanded(false));
  const commitValue = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    const native = nativeRef.current;
    if (native) {
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
      valueSetter?.call(native, nextValue);
      native.dispatchEvent(new Event('change', { bubbles: true }));
    }
    setExpanded(false);
  };
  const moveActive = (direction: 1 | -1) => {
    let next = activeIndex < 0 ? (direction === 1 ? -1 : 0) : activeIndex;
    for (let attempt = 0; attempt < options.length; attempt += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) break;
    }
    setActiveIndex(next);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setExpanded(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isExpanded) {
        setListboxMotion(false);
        setExpanded(true);
      }
      moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && isExpanded) {
      event.preventDefault();
      const option = options[activeIndex];
      if (option && !option.disabled) commitValue(option.value);
    }
  };
  useEffect(() => {
    const selectedIndex = options.findIndex((option) => option.value === selectedValue && !option.disabled);
    if (selectedIndex >= 0) setActiveIndex(selectedIndex);
  }, [options, selectedValue]);
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue} controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__trigger-stack" ref={popupRef}>
        <button
          id={controlId}
          type="button"
          role="combobox"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isExpanded}
          aria-controls={listboxId}
          aria-activedescendant={isExpanded && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          aria-describedby={selectProps['aria-describedby'] ?? supportingId}
          aria-invalid={error ? true : undefined}
          className="cometal-field__control cometal-field__select-trigger"
          onClick={() => {
            const nextExpanded = !isExpanded;
            setListboxMotion(nextExpanded);
            if (nextExpanded) setActiveIndex(-1);
            setExpanded(nextExpanded);
          }}
          onKeyDown={handleKeyDown}
        >
          <span className={selectedLabel ? 'cometal-field__value' : 'cometal-field__placeholder'}>{selectedLabel ?? placeholder}</span>
          <span className="cometal-field__asset" aria-hidden="true"><ChevronDownIcon /></span>
        </button>
        <select
          {...selectProps}
          ref={nativeRef}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={(event) => onChange?.(event)}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          className="cometal-field__native-select"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        </select>
        {isExpanded ? (
          <div className="cometal-field__listbox" id={listboxId} role="listbox" aria-label={`${label}: варианты`} data-size={size} data-motion={listboxMotion ? 'enter' : undefined}>
            {options.map((option, index) => (
              <div
                id={`${listboxId}-option-${index}`}
                className="cometal-field__option"
                role="option"
                aria-selected={option.value === selectedValue}
                aria-disabled={option.disabled || undefined}
                tabIndex={-1}
                data-selected={option.value === selectedValue || undefined}
                data-active={index === activeIndex || undefined}
                key={option.value}
                onPointerEnter={() => { if (!option.disabled) setActiveIndex(index); }}
                onPointerLeave={() => setActiveIndex(-1)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => { if (!option.disabled) commitValue(option.value); }}
              >
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        ) : null}
      </span>
    </FieldChrome>
  );
});

export interface ComboboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  helperText?: string;
  optional?: boolean;
  error?: string;
  size?: FieldSize;
  mode?: FieldMode;
  readValue?: ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  listboxId?: string;
  options?: SelectOption[];
  onOptionSelect?: (value: string) => void;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { label, helperText, optional, error, size = 'l', mode = 'edit', readValue, expanded, defaultExpanded = false, onExpandedChange, listboxId, options = [], onOptionSelect, className, disabled, onFocus, onKeyDown, onChange, value, defaultValue, ...inputProps },
  ref,
) {
  const generatedId = useId();
  const controlId = inputProps.id ?? `cometal-combobox-${generatedId}`;
  const resolvedListboxId = listboxId ?? `${controlId}-listbox`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  const popupRef = useRef<HTMLSpanElement | null>(null);
  const [isExpanded, setExpanded] = usePopupState(expanded, defaultExpanded, onExpandedChange);
  useOutsidePointerDismiss(popupRef, isExpanded, () => setExpanded(false));
  const [internalInputValue, setInternalInputValue] = useState(String(defaultValue ?? ''));
  const inputValue = String(value ?? internalInputValue);
  const normalizedQuery = inputValue.trim().toLocaleLowerCase('ru-RU');
  const filteredOptions = normalizedQuery
    ? options.filter((option) => `${option.label} ${option.value}`.toLocaleLowerCase('ru-RU').includes(normalizedQuery))
    : [];
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectedOption = options.find((option) => option.value === inputValue || option.label === inputValue);
  const moveActive = (direction: 1 | -1) => {
    let next = activeIndex < 0 ? (direction === 1 ? -1 : 0) : activeIndex;
    for (let attempt = 0; attempt < filteredOptions.length; attempt += 1) {
      next = (next + direction + filteredOptions.length) % filteredOptions.length;
      if (!filteredOptions[next]?.disabled) break;
    }
    setActiveIndex(next);
  };
  const commitActive = () => {
    const option = filteredOptions[activeIndex];
    if (!option || option.disabled) return;
    if (value === undefined) setInternalInputValue(option.label);
    onOptionSelect?.(option.value);
    setExpanded(false);
  };
  useEffect(() => {
    setActiveIndex(-1);
  }, [inputValue, options]);
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue ?? inputValue} controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__trigger-stack" ref={popupRef}>
        <span className="cometal-field__control">
          <span className="cometal-field__asset" aria-hidden="true"><SearchIcon /></span>
          <input
            {...inputProps}
            id={controlId}
            ref={ref}
            value={value ?? internalInputValue}
            disabled={disabled}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isExpanded}
            aria-controls={resolvedListboxId}
            aria-activedescendant={isExpanded && activeIndex >= 0 ? `${resolvedListboxId}-option-${activeIndex}` : undefined}
            aria-describedby={inputProps['aria-describedby'] ?? supportingId}
            aria-invalid={error ? true : undefined}
            onFocus={onFocus}
            onChange={(event) => {
              if (value === undefined) setInternalInputValue(event.currentTarget.value);
              onChange?.(event);
              setActiveIndex(-1);
              const nextQuery = event.currentTarget.value.trim().toLocaleLowerCase('ru-RU');
              const hasMatches = options.some((option) => `${option.label} ${option.value}`.toLocaleLowerCase('ru-RU').includes(nextQuery));
              setExpanded(Boolean(nextQuery) && hasMatches);
            }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented) return;
              if (event.key === 'Escape') {
                event.preventDefault();
                setExpanded(false);
              } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && filteredOptions.length) {
                event.preventDefault();
                if (!isExpanded) setExpanded(true);
                moveActive(event.key === 'ArrowDown' ? 1 : -1);
              } else if (event.key === 'Enter' && isExpanded) {
                event.preventDefault();
                commitActive();
              }
            }}
            className="cometal-field__input"
          />
        </span>
        {isExpanded && filteredOptions.length ? (
          <FieldListbox
            id={resolvedListboxId}
            label={`${label}: результаты`}
            options={filteredOptions}
            selectedValues={selectedOption ? [selectedOption.value] : []}
            size={size}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            onSelect={(nextValue) => {
              const option = options.find((item) => item.value === nextValue);
              if (option && value === undefined) setInternalInputValue(option.label);
              onOptionSelect?.(nextValue);
              setExpanded(false);
            }}
          />
        ) : null}
      </span>
    </FieldChrome>
  );
});

export interface MultiSelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  label: string;
  selectedValues?: string[];
  placeholder?: string;
  helperText?: string;
  optional?: boolean;
  error?: string;
  size?: MultilineFieldSize;
  mode?: FieldMode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  options?: SelectOption[];
  onSelectedValuesChange?: (values: string[]) => void;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  { label, selectedValues = [], placeholder = 'Выберите значение', helperText, optional, error, size = 'l', mode = 'edit', expanded, defaultExpanded = false, onExpandedChange, options = [], onSelectedValuesChange, className, type = 'button', disabled, onClick, onKeyDown, ...buttonProps },
  ref,
) {
  const generatedId = useId();
  const controlId = buttonProps.id ?? `cometal-multiselect-${generatedId}`;
  const listboxId = `${controlId}-listbox`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  const popupRef = useRef<HTMLSpanElement | null>(null);
  const tagsRef = useRef<HTMLSpanElement | null>(null);
  const tagsMeasureRef = useRef<HTMLSpanElement | null>(null);
  const displayValues = selectedValues.map((value) => options.find((option) => option.value === value)?.label ?? value);
  const readValue = displayValues.length ? displayValues.join(', ') : '—';
  const [visibleTagCount, setVisibleTagCount] = useState(displayValues.length);
  const [isExpanded, setExpanded] = usePopupState(expanded, defaultExpanded, onExpandedChange);
  const [listboxMotion, setListboxMotion] = useState(false);
  useOutsidePointerDismiss(popupRef, isExpanded, () => setExpanded(false));
  const [activeIndex, setActiveIndex] = useState(-1);
  const toggleValue = (value: string) => onSelectedValuesChange?.(
    selectedValues.includes(value) ? selectedValues.filter((item) => item !== value) : [...selectedValues, value],
  );
  const moveActive = (direction: 1 | -1) => {
    let next = activeIndex < 0 ? (direction === 1 ? -1 : 0) : activeIndex;
    for (let attempt = 0; attempt < options.length; attempt += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) break;
    }
    setActiveIndex(next);
  };
  useEffect(() => {
    const container = tagsRef.current;
    const measurement = tagsMeasureRef.current;
    if (!container || !measurement || !displayValues.length) {
      setVisibleTagCount(displayValues.length);
      return undefined;
    }

    let active = true;
    const updateVisibleTags = () => {
      if (!active) return;
      const availableWidth = container.clientWidth;
      if (availableWidth <= 0) {
        setVisibleTagCount(displayValues.length);
        return;
      }

      const tagWidths = Array.from(measurement.querySelectorAll<HTMLElement>('[data-measure-tag]'))
        .map((element) => element.getBoundingClientRect().width);
      const styles = getComputedStyle(container);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
      const allTagsWidth = tagWidths.reduce((total, width) => total + width, 0) + gap * Math.max(0, tagWidths.length - 1);

      if (allTagsWidth <= availableWidth) {
        setVisibleTagCount(displayValues.length);
        return;
      }

      for (let nextVisibleCount = displayValues.length - 1; nextVisibleCount >= 0; nextVisibleCount -= 1) {
        const hiddenCount = displayValues.length - nextVisibleCount;
        const counter = measurement.querySelector<HTMLElement>(`[data-measure-counter="${hiddenCount}"]`);
        const visibleTagsWidth = tagWidths.slice(0, nextVisibleCount).reduce((total, width) => total + width, 0);
        const requiredWidth = visibleTagsWidth
          + (counter?.getBoundingClientRect().width ?? 0)
          + gap * nextVisibleCount;
        if (requiredWidth <= availableWidth) {
          setVisibleTagCount(nextVisibleCount);
          return;
        }
      }

      setVisibleTagCount(0);
    };

    updateVisibleTags();
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(updateVisibleTags);
    observer?.observe(container);
    void document.fonts?.ready.then(updateVisibleTags);

    return () => {
      active = false;
      observer?.disconnect();
    };
  }, [displayValues.join('\u0000')]);

  const hiddenTagCount = Math.max(0, displayValues.length - visibleTagCount);
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue} multilineRead controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__trigger-stack" ref={popupRef}>
        <span className="cometal-field__control cometal-field__multi-select">
          <button
            {...buttonProps}
            id={controlId}
            ref={ref}
            type={type}
            disabled={disabled}
            aria-describedby={buttonProps['aria-describedby'] ?? supportingId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isExpanded}
            aria-controls={listboxId}
            aria-activedescendant={isExpanded && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
            onClick={(event) => {
              onClick?.(event);
              const nextExpanded = !isExpanded;
              setListboxMotion(nextExpanded);
              if (nextExpanded) setActiveIndex(-1);
              setExpanded(nextExpanded);
            }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented) return;
              if (event.key === 'Escape') {
                event.preventDefault();
                setExpanded(false);
              } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (!isExpanded) {
                  setListboxMotion(false);
                  setExpanded(true);
                }
                moveActive(event.key === 'ArrowDown' ? 1 : -1);
              } else if ((event.key === 'Enter' || event.key === ' ') && isExpanded) {
                event.preventDefault();
                const option = options[activeIndex];
                if (option && !option.disabled) toggleValue(option.value);
              }
            }}
            className="cometal-field__multi-select-trigger"
          />
          <span ref={selectedValues.length ? tagsRef : undefined} className={selectedValues.length ? 'cometal-field__tags' : 'cometal-field__placeholder'}>
            {displayValues.length ? displayValues.slice(0, visibleTagCount).map((item, index) => (
              <span className="cometal-field__tag" key={selectedValues[index]}>
                <span className="cometal-field__tag-label">{item}</span>
                <button
                  type="button"
                  className="cometal-field__tag-remove"
                  aria-label={`Удалить ${item}`}
                  disabled={disabled}
                  onClick={() => toggleValue(selectedValues[index] as string)}
                >
                  <RemoveValueIcon />
                </button>
              </span>
            )) : placeholder}
            {hiddenTagCount ? <span className="cometal-field__tag cometal-field__tag--counter">+{hiddenTagCount}</span> : null}
          </span>
          {selectedValues.length ? (
            <span ref={tagsMeasureRef} className="cometal-field__tags-measure" aria-hidden="true">
              {displayValues.map((item, index) => (
                <span className="cometal-field__tag" data-measure-tag key={`measure-${selectedValues[index]}`}>
                  <span className="cometal-field__tag-label">{item}</span>
                  <span className="cometal-field__tag-remove"><RemoveValueIcon /></span>
                </span>
              ))}
              {displayValues.map((_, index) => {
                const hiddenCount = index + 1;
                return <span className="cometal-field__tag cometal-field__tag--counter" data-measure-counter={hiddenCount} key={`counter-${hiddenCount}`}>+{hiddenCount}</span>;
              })}
            </span>
          ) : null}
          <span className="cometal-field__asset" aria-hidden="true"><ChevronDownIcon /></span>
        </span>
        {isExpanded && options.length ? (
          <FieldListbox
            id={listboxId}
            label={`${label}: варианты`}
            options={options}
            selectedValues={selectedValues}
            size={size}
            multiple
            motion={listboxMotion}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            onSelect={toggleValue}
          />
        ) : null}
      </span>
    </FieldChrome>
  );
});
