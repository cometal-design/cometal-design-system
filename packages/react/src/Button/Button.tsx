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

function ButtonLoader() {
  return (
    <span className="cometal-button__loader" aria-hidden="true">
      <svg viewBox="0 0 15 15" fill="none" focusable="false">
        <path
          d="M7.5 3.42857V0M7.5 15V11.5714M11.5714 7.5H15M0 7.5H3.42857M10.3792 4.62121L12.8036 2.19685M2.19617 12.8034L4.62054 10.379M10.3792 10.3788L12.8036 12.8032M2.19617 2.19659L4.62054 4.62095"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
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
      {loading ? <ButtonLoader /> : null}
    </button>
  );
});
