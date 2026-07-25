import { forwardRef, useCallback, useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import './selection.css';

export const selectionSizes = ['l', 'm', 's'] as const;
export type SelectionSize = (typeof selectionSizes)[number];

type SelectionBaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  label: string;
  description?: string;
  size?: SelectionSize;
};

export interface CheckboxProps extends SelectionBaseProps { indeterminate?: boolean; }

const checkboxMarkGeometry: Record<SelectionSize, { viewBox: string; path: string }> = {
  l: { viewBox: '0 0 20 20', path: 'M6 9.92L8.56 12.48L14 6.72' },
  m: { viewBox: '0 0 16 16', path: 'M4.5 7.88L6.74 10.12L11.5 5.08' },
  s: { viewBox: '0 0 14 14', path: 'M4 6.84L5.92 8.76L10 4.44' },
};

function CheckboxMark({ size }: { size: SelectionSize }) {
  const geometry = checkboxMarkGeometry[size];
  return (
    <svg viewBox={geometry.viewBox} fill="none" focusable="false">
      <path
        d={geometry.path}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, size = 'l', indeterminate = false, className, checked, defaultChecked, ...inputProps },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className={['cometal-selection', className].filter(Boolean).join(' ')} data-cometal-component="checkbox" data-kind="checkbox" data-size={size} data-indeterminate={indeterminate || undefined}>
      <input
        {...inputProps}
        ref={setRef}
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        aria-checked={indeterminate ? 'mixed' : inputProps['aria-checked']}
      />
      <span className="cometal-selection__control" aria-hidden="true"><CheckboxMark size={size} /></span>
      <span className="cometal-selection__content"><span className="cometal-selection__label">{label}</span>{description ? <span className="cometal-selection__description">{description}</span> : null}</span>
    </label>
  );
});

export type RadioButtonProps = SelectionBaseProps;

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(function RadioButton(
  { label, description, size = 'l', className, ...inputProps },
  ref,
) {
  return (
    <label className={['cometal-selection', className].filter(Boolean).join(' ')} data-cometal-component="radio-button" data-kind="radio" data-size={size}>
      <input {...inputProps} ref={ref} type="radio" />
      <span className="cometal-selection__control" aria-hidden="true" />
      <span className="cometal-selection__content"><span className="cometal-selection__label">{label}</span>{description ? <span className="cometal-selection__description">{description}</span> : null}</span>
    </label>
  );
});

export type SwitchProps = SelectionBaseProps;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, size = 'l', className, ...inputProps },
  ref,
) {
  return (
    <label className={['cometal-selection', className].filter(Boolean).join(' ')} data-cometal-component="switch" data-kind="switch" data-size={size}>
      <input {...inputProps} ref={ref} type="checkbox" role="switch" />
      <span className="cometal-selection__control" aria-hidden="true"><span className="cometal-selection__thumb" /></span>
      <span className="cometal-selection__content"><span className="cometal-selection__label">{label}</span>{description ? <span className="cometal-selection__description">{description}</span> : null}</span>
    </label>
  );
});
