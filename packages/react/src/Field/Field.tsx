import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import type {
  ButtonHTMLAttributes,
  KeyboardEvent,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import './field.css';

export const fieldSizes = ['l', 'm'] as const;
export type FieldSize = (typeof fieldSizes)[number];
export type FieldMode = 'edit' | 'read';

type FieldChromeProps = {
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
      <path d="M5.833 7.917 10 12.083l4.167-4.166" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" focusable="false">
      <path d="m14.038 14.133 2.929 2.834M16.022 9.411a6.611 6.611 0 1 1-13.222 0 6.611 6.611 0 0 1 13.222 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function RemoveValueIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" focusable="false">
      <path d="m3.5 3.5 7 7m0-7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function FieldChrome({
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
      <div className={['cometal-field-read', className].filter(Boolean).join(' ')} data-size={size} data-multiline={multilineRead || undefined}>
        <span className="cometal-field-read__label">{label}</span>
        <span className="cometal-field-read__value">{readValue || '—'}</span>
      </div>
    );
  }

  return (
    <div className={['cometal-field', className].filter(Boolean).join(' ')} data-size={size} data-invalid={Boolean(error) || undefined} data-disabled={disabled || undefined}>
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
  size?: FieldSize;
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
  activeIndex?: number;
  onActiveChange?: (index: number) => void;
  onSelect?: (value: string) => void;
};

function FieldListbox({ id, label, options, selectedValues = [], size, multiple = false, activeIndex, onActiveChange, onSelect }: FieldListboxProps) {
  return (
    <div className="cometal-field__listbox" id={id} role="listbox" aria-label={label} aria-multiselectable={multiple || undefined} data-size={size}>
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
            onPointerMove={() => { if (!option.disabled) onActiveChange?.(index); }}
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
  useImperativeHandle(forwardedRef, () => nativeRef.current as HTMLSelectElement);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const [internalValue, setInternalValue] = useState(String(defaultValue ?? ''));
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => !option.disabled)));
  const isExpanded = expanded ?? internalExpanded;
  const selectedValue = String(value ?? internalValue);
  const selectedLabel = options.find((option) => option.value === selectedValue)?.label;
  const setExpanded = (next: boolean) => {
    if (expanded === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };
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
    let next = activeIndex;
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
      if (!isExpanded) setExpanded(true);
      else moveActive(event.key === 'ArrowDown' ? 1 : -1);
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
      <span className="cometal-field__trigger-stack">
        <button
          id={controlId}
          type="button"
          role="combobox"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isExpanded}
          aria-controls={listboxId}
          aria-activedescendant={isExpanded ? `${listboxId}-option-${activeIndex}` : undefined}
          aria-describedby={selectProps['aria-describedby'] ?? supportingId}
          aria-invalid={error ? true : undefined}
          className="cometal-field__control cometal-field__select-trigger"
          onClick={() => setExpanded(!isExpanded)}
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
          <div className="cometal-field__listbox" id={listboxId} role="listbox" aria-label={`${label}: варианты`} data-size={size}>
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
                onPointerMove={() => { if (!option.disabled) setActiveIndex(index); }}
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
  { label, helperText, optional, error, size = 'l', mode = 'edit', readValue, expanded, defaultExpanded = false, onExpandedChange, listboxId, options = [], onOptionSelect, className, disabled, onFocus, onKeyDown, ...inputProps },
  ref,
) {
  const generatedId = useId();
  const controlId = inputProps.id ?? `cometal-combobox-${generatedId}`;
  const resolvedListboxId = listboxId ?? `${controlId}-listbox`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  const [isExpanded, setExpanded] = usePopupState(expanded, defaultExpanded, onExpandedChange);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => !option.disabled)));
  const inputValue = String(inputProps.value ?? inputProps.defaultValue ?? '');
  const selectedOption = options.find((option) => option.value === inputValue || option.label === inputValue);
  const moveActive = (direction: 1 | -1) => {
    let next = activeIndex;
    for (let attempt = 0; attempt < options.length; attempt += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) break;
    }
    setActiveIndex(next);
  };
  const commitActive = () => {
    const option = options[activeIndex];
    if (!option || option.disabled) return;
    onOptionSelect?.(option.value);
    setExpanded(false);
  };
  useEffect(() => {
    const selectedIndex = options.findIndex((option) => option.value === selectedOption?.value && !option.disabled);
    if (selectedIndex >= 0) setActiveIndex(selectedIndex);
  }, [options, selectedOption?.value]);
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue ?? inputProps.value ?? inputProps.defaultValue} controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__trigger-stack">
        <span className="cometal-field__control">
          <span className="cometal-field__asset" aria-hidden="true"><SearchIcon /></span>
          <input
            {...inputProps}
            id={controlId}
            ref={ref}
            disabled={disabled}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isExpanded}
            aria-controls={resolvedListboxId}
            aria-activedescendant={isExpanded ? `${resolvedListboxId}-option-${activeIndex}` : undefined}
            aria-describedby={inputProps['aria-describedby'] ?? supportingId}
            aria-invalid={error ? true : undefined}
            onFocus={(event) => { onFocus?.(event); if (options.length) setExpanded(true); }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented) return;
              if (event.key === 'Escape') {
                event.preventDefault();
                setExpanded(false);
              } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && options.length) {
                event.preventDefault();
                if (!isExpanded) setExpanded(true);
                else moveActive(event.key === 'ArrowDown' ? 1 : -1);
              } else if (event.key === 'Enter' && isExpanded) {
                event.preventDefault();
                commitActive();
              }
            }}
            className="cometal-field__input"
          />
        </span>
        {isExpanded && options.length ? (
          <FieldListbox
            id={resolvedListboxId}
            label={`${label}: результаты`}
            options={options}
            selectedValues={selectedOption ? [selectedOption.value] : []}
            size={size}
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            onSelect={(value) => { onOptionSelect?.(value); setExpanded(false); }}
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
  size?: FieldSize;
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
  const displayValues = selectedValues.map((value) => options.find((option) => option.value === value)?.label ?? value);
  const readValue = displayValues.length ? displayValues.join(', ') : '—';
  const [isExpanded, setExpanded] = usePopupState(expanded, defaultExpanded, onExpandedChange);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((option) => !option.disabled)));
  const toggleValue = (value: string) => onSelectedValuesChange?.(
    selectedValues.includes(value) ? selectedValues.filter((item) => item !== value) : [...selectedValues, value],
  );
  const moveActive = (direction: 1 | -1) => {
    let next = activeIndex;
    for (let attempt = 0; attempt < options.length; attempt += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) break;
    }
    setActiveIndex(next);
  };
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue} multilineRead controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__trigger-stack">
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
            aria-activedescendant={isExpanded ? `${listboxId}-option-${activeIndex}` : undefined}
            onClick={(event) => { onClick?.(event); setExpanded(!isExpanded); }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented) return;
              if (event.key === 'Escape') {
                event.preventDefault();
                setExpanded(false);
              } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                if (!isExpanded) setExpanded(true);
                else moveActive(event.key === 'ArrowDown' ? 1 : -1);
              } else if ((event.key === 'Enter' || event.key === ' ') && isExpanded) {
                event.preventDefault();
                const option = options[activeIndex];
                if (option && !option.disabled) toggleValue(option.value);
              }
            }}
            className="cometal-field__multi-select-trigger"
          />
          <span className={selectedValues.length ? 'cometal-field__tags' : 'cometal-field__placeholder'}>
            {displayValues.length ? displayValues.slice(0, 2).map((item, index) => (
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
            {selectedValues.length > 2 ? <span className="cometal-field__tag">+{selectedValues.length - 2}</span> : null}
          </span>
          {selectedValues.length ? null : <span className="cometal-field__asset" aria-hidden="true"><ChevronDownIcon /></span>}
        </span>
        {isExpanded && options.length ? (
          <FieldListbox
            id={listboxId}
            label={`${label}: варианты`}
            options={options}
            selectedValues={selectedValues}
            size={size}
            multiple
            activeIndex={activeIndex}
            onActiveChange={setActiveIndex}
            onSelect={toggleValue}
          />
        ) : null}
      </span>
    </FieldChrome>
  );
});
