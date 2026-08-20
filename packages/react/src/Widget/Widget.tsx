import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './widget.css';

export interface WidgetProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  as?: 'section' | 'article' | 'aside' | 'div';
}

export function WidgetContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={['cometal-widget__content', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

export const Widget = forwardRef<HTMLElement, WidgetProps>(function Widget(
  {
    title,
    description,
    actions,
    children,
    as: Element = 'section',
    className,
    ...props
  },
  ref,
) {
  return (
    <Element
      {...props}
      ref={ref as never}
      className={['cometal-widget', className].filter(Boolean).join(' ')}
      data-cometal-component="widget"
    >
      <header className="cometal-widget__header">
        <div className="cometal-widget__copy">
          <h2 className="cometal-widget__title">{title}</h2>
          {description ? <p className="cometal-widget__description">{description}</p> : null}
        </div>
        {actions ? <div className="cometal-widget__actions">{actions}</div> : null}
      </header>
      <WidgetContent>{children}</WidgetContent>
    </Element>
  );
});
