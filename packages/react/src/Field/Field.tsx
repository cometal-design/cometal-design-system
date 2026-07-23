import { forwardRef, useId } from 'react';
import type {
  ButtonHTMLAttributes,
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
  onSelect?: (value: string) => void;
};

function FieldListbox({ id, label, options, selectedValues = [], size, multiple = false, onSelect }: FieldListboxProps) {
  return (
    <div className="cometal-field__listbox" id={id} role="listbox" aria-label={label} aria-multiselectable={multiple || undefined} data-size={size}>
      {options.map((option) => {
        const selected = selectedValues.includes(option.value);
        return (
          <button
            className="cometal-field__option"
            type="button"
            role="option"
            aria-selected={selected}
            disabled={option.disabled}
            data-selected={selected || undefined}
            key={option.value}
            onClick={() => onSelect?.(option.value)}
          >
            <span>{option.label}</span>
            {multiple && selected ? <span className="cometal-field__option-check" aria-hidden="true">✓</span> : null}
          </button>
        );
      })}
    </div>
  );
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
  onExpandedChange?: (expanded: boolean) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder = 'Выберите значение', helperText, optional, error, size = 'l', mode = 'edit', readValue, className, disabled, expanded = false, onExpandedChange, onChange, ...selectProps },
  ref,
) {
  const generatedId = useId();
  const controlId = selectProps.id ?? `cometal-select-${generatedId}`;
  const listboxId = `${controlId}-listbox`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  const selectedValue = String(selectProps.value ?? selectProps.defaultValue ?? '');
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue} controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__trigger-stack">
        <span className="cometal-field__control">
          <select
            {...selectProps}
            id={controlId}
            ref={ref}
            disabled={disabled}
            aria-describedby={selectProps['aria-describedby'] ?? supportingId}
            aria-invalid={error ? true : undefined}
            aria-expanded={expanded}
            aria-controls={expanded ? listboxId : undefined}
            onChange={(event) => { onChange?.(event); onExpandedChange?.(false); }}
            className="cometal-field__input cometal-field__select"
          >
            <option value="" disabled>{placeholder}</option>
            {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
          </select>
          <span className="cometal-field__asset" aria-hidden="true"><ChevronDownIcon /></span>
        </span>
        {expanded ? <FieldListbox id={listboxId} label={`${label}: варианты`} options={options} selectedValues={selectedValue ? [selectedValue] : []} size={size} onSelect={() => onExpandedChange?.(false)} /> : null}
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
  listboxId?: string;
  options?: SelectOption[];
  onOptionSelect?: (value: string) => void;
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { label, helperText, optional, error, size = 'l', mode = 'edit', readValue, expanded = false, listboxId, options = [], onOptionSelect, className, disabled, ...inputProps },
  ref,
) {
  const generatedId = useId();
  const controlId = inputProps.id ?? `cometal-combobox-${generatedId}`;
  const resolvedListboxId = listboxId ?? `${controlId}-listbox`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue ?? inputProps.value ?? inputProps.defaultValue} controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__trigger-stack">
        <span className="cometal-field__control">
          <span className="cometal-field__asset" aria-hidden="true"><SearchIcon /></span>
          <input {...inputProps} id={controlId} ref={ref} disabled={disabled} role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={resolvedListboxId} aria-describedby={inputProps['aria-describedby'] ?? supportingId} aria-invalid={error ? true : undefined} className="cometal-field__input" />
        </span>
        {expanded && options.length ? <FieldListbox id={resolvedListboxId} label={`${label}: результаты`} options={options} size={size} onSelect={onOptionSelect} /> : null}
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
  options?: SelectOption[];
  onSelectedValuesChange?: (values: string[]) => void;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  { label, selectedValues = [], placeholder = 'Выберите значение', helperText, optional, error, size = 'l', mode = 'edit', expanded = false, options = [], onSelectedValuesChange, className, type = 'button', disabled, ...buttonProps },
  ref,
) {
  const generatedId = useId();
  const controlId = buttonProps.id ?? `cometal-multiselect-${generatedId}`;
  const listboxId = `${controlId}-listbox`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  const readValue = selectedValues.length ? selectedValues.join(', ') : '—';
  const toggleValue = (value: string) => onSelectedValuesChange?.(
    selectedValues.includes(value) ? selectedValues.filter((item) => item !== value) : [...selectedValues, value],
  );
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue} multilineRead controlId={controlId} supportingId={supportingId} disabled={disabled}>
      <span className="cometal-field__trigger-stack">
        <button {...buttonProps} id={controlId} ref={ref} type={type} disabled={disabled} aria-describedby={buttonProps['aria-describedby'] ?? supportingId} aria-haspopup="listbox" aria-expanded={expanded} aria-controls={listboxId} className="cometal-field__control cometal-field__multi-select">
          <span className={selectedValues.length ? 'cometal-field__tags' : 'cometal-field__placeholder'}>
            {selectedValues.length ? selectedValues.slice(0, 2).map((item) => (
              <span className="cometal-field__tag" key={item}>
                <span className="cometal-field__tag-label">{item}</span>
                <span className="cometal-field__tag-remove" aria-hidden="true"><RemoveValueIcon /></span>
              </span>
            )) : placeholder}
            {selectedValues.length > 2 ? <span className="cometal-field__tag">+{selectedValues.length - 2}</span> : null}
          </span>
          {selectedValues.length ? null : <span className="cometal-field__asset" aria-hidden="true"><ChevronDownIcon /></span>}
        </button>
        {expanded && options.length ? <FieldListbox id={listboxId} label={`${label}: варианты`} options={options} selectedValues={selectedValues} size={size} multiple onSelect={toggleValue} /> : null}
      </span>
    </FieldChrome>
  );
});
