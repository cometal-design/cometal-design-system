import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './badge.css';

export const badgeSurfaces = ['light', 'dark'] as const;
export const badgeTones = [
  'neutral',
  'blue',
  'cyan',
  'green',
  'purple',
  'red',
  'violet',
  'yellow',
] as const;

export type BadgeSurface = (typeof badgeSurfaces)[number];
export type BadgeTone = (typeof badgeTones)[number];

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Light uses dark content on a pale surface; dark uses inverse content on a strong surface. */
  surface?: BadgeSurface;
  /** Status hue. Choose by meaning, not decoration. */
  tone?: BadgeTone;
  /** Optional filled icon before the label. */
  startIcon?: ReactNode;
  /** Optional filled icon after the label. */
  endIcon?: ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    surface = 'light',
    tone = 'neutral',
    startIcon,
    endIcon,
    children,
    className,
    role,
    ...spanProps
  },
  ref,
) {
  const hasText = children !== undefined && children !== null && children !== false && children !== '';
  const iconOnly = hasText ? null : (startIcon ?? endIcon);

  return (
    <span
      {...spanProps}
      ref={ref}
      className={['cometal-badge', className].filter(Boolean).join(' ')}
      data-cometal-component="badge"
      data-surface={surface}
      data-tone={tone}
      data-icon-only={iconOnly ? true : undefined}
      role={role ?? (iconOnly ? 'img' : undefined)}
    >
      {hasText && startIcon ? (
        <span className="cometal-badge__icon" aria-hidden="true">{startIcon}</span>
      ) : null}
      {hasText ? <span className="cometal-badge__label">{children}</span> : null}
      {hasText && endIcon ? (
        <span className="cometal-badge__icon" aria-hidden="true">{endIcon}</span>
      ) : null}
      {iconOnly ? <span className="cometal-badge__icon" aria-hidden="true">{iconOnly}</span> : null}
    </span>
  );
});
