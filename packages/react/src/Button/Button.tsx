import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './button.css';

export const buttonVariants = [
  'primary',
  'secondary',
  'ghost',
  'link',
  'danger',
  'success',
  'warning',
  'inverse',
  'inverse-ghost',
] as const;

export const buttonSizes = ['l', 'm', 's'] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'size'> {
  /** Визуальная роль кнопки. Не заменяет смысловое имя действия. */
  variant?: ButtonVariant;
  /** L = 44px, M = 36px, S = 28px. */
  size?: ButtonSize;
  /** Блокирует повторное действие, сохраняет ширину и показывает индикатор. */
  loading?: boolean;
  /** Декоративная иконка перед подписью. */
  startIcon?: ReactNode;
  /** Декоративная иконка после подписи. */
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'l',
    loading = false,
    disabled = false,
    startIcon,
    endIcon,
    children,
    className,
    type = 'button',
    ...buttonProps
  },
  ref,
) {
  const classes = ['cometal-button', className].filter(Boolean).join(' ');

  return (
    <button
      {...buttonProps}
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-cometal-component="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
    >
      <span className="cometal-button__content">
        {startIcon ? (
          <span className="cometal-button__icon" aria-hidden="true">
            {startIcon}
          </span>
        ) : null}
        {children != null ? <span className="cometal-button__label">{children}</span> : null}
        {endIcon ? (
          <span className="cometal-button__icon" aria-hidden="true">
            {endIcon}
          </span>
        ) : null}
      </span>
      {loading ? <span className="cometal-button__loader" aria-hidden="true" /> : null}
    </button>
  );
});

