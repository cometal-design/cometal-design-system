import { forwardRef, useId } from 'react';
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import chevronDown from './assets/chevron-down.svg';
import searchIcon from './assets/search.svg';
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
  children: ReactNode;
};

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
  children,
}: FieldChromeProps) {
  if (mode === 'read') {
    return (
      <div className={['cometal-field-read', className].filter(Boolean).join(' ')} data-multiline={multilineRead || undefined}>
        <span className="cometal-field-read__label">{label}</span>
        <span className="cometal-field-read__value">{readValue || '—'}</span>
      </div>
    );
  }

  return (
    <div className={['cometal-field', className].filter(Boolean).join(' ')} data-size={size} data-invalid={Boolean(error) || undefined}>
      <span className="cometal-field__label-row">
        <label className="cometal-field__label" htmlFor={controlId}>{label}</label>
        {optional ? <span className="cometal-field__optional">Необязательно</span> : null}
      </span>
      {children}
      {helperText || error ? <span className="cometal-field__supporting" id={supportingId}>{error || helperText}</span> : null}
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
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={value} controlId={controlId} supportingId={supportingId}>
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
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, helperText, optional, error, size = 'l', mode = 'edit', readValue, showCounter = false, className, maxLength, value, defaultValue, ...textareaProps },
  ref,
) {
  const generatedId = useId();
  const controlId = textareaProps.id ?? `cometal-textarea-${generatedId}`;
  const currentValue = value ?? defaultValue ?? '';
  const counter = showCounter && maxLength ? `${String(currentValue).length} / ${maxLength}` : undefined;
  const supportingText = error || helperText ? `${error || helperText}${counter ? ` · ${counter}` : ''}` : counter;
  const supportingId = supportingText ? `${controlId}-supporting` : undefined;
  return (
    <FieldChrome className={className} label={label} helperText={supportingText} optional={optional} error={error} size={size} mode={mode} readValue={readValue ?? currentValue} multilineRead controlId={controlId} supportingId={supportingId}>
      <span className="cometal-field__control cometal-field__control--textarea">
        <textarea {...textareaProps} id={controlId} ref={ref} value={value} defaultValue={defaultValue} maxLength={maxLength} aria-describedby={textareaProps['aria-describedby'] ?? supportingId} aria-invalid={error ? true : undefined} className="cometal-field__input cometal-field__textarea" />
      </span>
    </FieldChrome>
  );
});

export type SelectOption = { value: string; label: string; disabled?: boolean };

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
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder = 'Выберите значение', helperText, optional, error, size = 'l', mode = 'edit', readValue, className, ...selectProps },
  ref,
) {
  const generatedId = useId();
  const controlId = selectProps.id ?? `cometal-select-${generatedId}`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue} controlId={controlId} supportingId={supportingId}>
      <span className="cometal-field__control">
        <select {...selectProps} id={controlId} ref={ref} aria-describedby={selectProps['aria-describedby'] ?? supportingId} aria-invalid={error ? true : undefined} className="cometal-field__input cometal-field__select">
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        </select>
        <img className="cometal-field__asset" src={chevronDown} alt="" aria-hidden="true" />
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
}

export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { label, helperText, optional, error, size = 'l', mode = 'edit', readValue, expanded = false, listboxId, className, ...inputProps },
  ref,
) {
  const generatedId = useId();
  const controlId = inputProps.id ?? `cometal-combobox-${generatedId}`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue ?? inputProps.value ?? inputProps.defaultValue} controlId={controlId} supportingId={supportingId}>
      <span className="cometal-field__control">
        <img className="cometal-field__asset" src={searchIcon} alt="" aria-hidden="true" />
        <input {...inputProps} id={controlId} ref={ref} role="combobox" aria-expanded={expanded} aria-controls={listboxId} aria-describedby={inputProps['aria-describedby'] ?? supportingId} aria-invalid={error ? true : undefined} className="cometal-field__input" />
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
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(function MultiSelect(
  { label, selectedValues = [], placeholder = 'Выберите значение', helperText, optional, error, size = 'l', mode = 'edit', expanded = false, className, type = 'button', ...buttonProps },
  ref,
) {
  const generatedId = useId();
  const controlId = buttonProps.id ?? `cometal-multiselect-${generatedId}`;
  const supportingId = helperText || error ? `${controlId}-supporting` : undefined;
  const readValue = selectedValues.length ? selectedValues.join(', ') : '—';
  return (
    <FieldChrome className={className} label={label} helperText={helperText} optional={optional} error={error} size={size} mode={mode} readValue={readValue} multilineRead controlId={controlId} supportingId={supportingId}>
      <button {...buttonProps} id={controlId} ref={ref} type={type} aria-describedby={buttonProps['aria-describedby'] ?? supportingId} aria-haspopup="listbox" aria-expanded={expanded} className="cometal-field__control cometal-field__multi-select">
        <span className={selectedValues.length ? 'cometal-field__tags' : 'cometal-field__placeholder'}>
          {selectedValues.length ? selectedValues.slice(0, 2).map((item) => <span className="cometal-field__tag" key={item}>{item}</span>) : placeholder}
          {selectedValues.length > 2 ? <span className="cometal-field__tag">+{selectedValues.length - 2}</span> : null}
        </span>
        <img className="cometal-field__asset" src={chevronDown} alt="" aria-hidden="true" />
      </button>
    </FieldChrome>
  );
});
