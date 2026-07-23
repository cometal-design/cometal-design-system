import { forwardRef, useCallback, useEffect, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import checkIcon from './assets/check.svg';
import './selection.css';

export const selectionSizes = ['l', 'm', 's'] as const;
export type SelectionSize = (typeof selectionSizes)[number];

type SelectionBaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
  label: string;
  description?: string;
  size?: SelectionSize;
};

export interface CheckboxProps extends SelectionBaseProps { indeterminate?: boolean; }

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
    <label className={['cometal-selection', className].filter(Boolean).join(' ')} data-kind="checkbox" data-size={size} data-indeterminate={indeterminate || undefined}>
      <input {...inputProps} ref={setRef} type="checkbox" checked={checked} defaultChecked={defaultChecked} />
      <span className="cometal-selection__control" aria-hidden="true"><img src={checkIcon} alt="" /></span>
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
    <label className={['cometal-selection', className].filter(Boolean).join(' ')} data-kind="radio" data-size={size}>
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
    <label className={['cometal-selection', className].filter(Boolean).join(' ')} data-kind="switch" data-size={size}>
      <input {...inputProps} ref={ref} type="checkbox" role="switch" />
      <span className="cometal-selection__control" aria-hidden="true"><span className="cometal-selection__thumb" /></span>
      <span className="cometal-selection__content"><span className="cometal-selection__label">{label}</span>{description ? <span className="cometal-selection__description">{description}</span> : null}</span>
    </label>
  );
});
