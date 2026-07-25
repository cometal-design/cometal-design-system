import { forwardRef } from 'react';
import type { AnchorHTMLAttributes } from 'react';
import './inline-link.css';

export interface InlineLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  /** Увеличивает кликабельную область ссылки до 44px для самостоятельного действия. */
  touchTarget?: boolean;
}

export const InlineLink = forwardRef<HTMLAnchorElement, InlineLinkProps>(function InlineLink(
  { className, touchTarget = false, ...anchorProps },
  ref,
) {
  const classes = ['cometal-inline-link', className].filter(Boolean).join(' ');

  return (
    <a
      {...anchorProps}
      ref={ref}
      className={classes}
      data-cometal-component="inline-link"
      data-touch-target={touchTarget || undefined}
    />
  );
});
