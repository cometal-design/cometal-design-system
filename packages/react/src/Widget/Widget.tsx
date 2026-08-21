import { forwardRef, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import './widget.css';

export type WidgetElement = 'section' | 'article' | 'aside' | 'div';

export interface WidgetProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Visible heading that provides the accessible name of the Widget region. */
  title: ReactNode;
  /** Optional supporting copy associated with the region. */
  description?: ReactNode;
  /** Consumer-owned controls. Widget owns only their placement. */
  toolbar?: ReactNode;
  /** @deprecated Use `toolbar`. Kept as an explicit compatibility alias. */
  actions?: ReactNode;
  /** Deliberate semantic root. The default is a named section. */
  as?: WidgetElement;
  titleId?: string;
  descriptionId?: string;
  /** Accessible name for the toolbar group. */
  toolbarLabel?: string;
}

export interface WidgetContentProps extends HTMLAttributes<HTMLDivElement> {}

export function WidgetContent({ children, className, ...props }: WidgetContentProps) {
  return (
    <div {...props} className={['cometal-widget__content', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export interface WidgetToolbarProps extends HTMLAttributes<HTMLDivElement> {
  'aria-label': string;
}

export function WidgetToolbar({ children, className, ...props }: WidgetToolbarProps) {
  return (
    <div {...props} className={['cometal-widget__toolbar', className].filter(Boolean).join(' ')} role="toolbar">
      {children}
    </div>
  );
}

export const Widget = forwardRef<HTMLElement, WidgetProps>(function Widget(
  {
    title,
    description,
    toolbar,
    actions,
    children,
    as: Element = 'section',
    titleId,
    descriptionId,
    toolbarLabel = 'Действия виджета',
    className,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const resolvedTitleId = titleId ?? `${generatedId}-title`;
  const resolvedDescriptionId = description ? (descriptionId ?? `${generatedId}-description`) : undefined;
  const resolvedToolbar = toolbar ?? actions;

  return (
    <Element
      {...props}
      ref={ref as never}
      className={['cometal-widget', className].filter(Boolean).join(' ')}
      data-cometal-component="widget"
      aria-labelledby={resolvedTitleId}
      aria-describedby={resolvedDescriptionId}
    >
      <header className="cometal-widget__header">
        <div className="cometal-widget__copy">
          <h2 id={resolvedTitleId} className="cometal-widget__title">{title}</h2>
          {description ? <p id={resolvedDescriptionId} className="cometal-widget__description">{description}</p> : null}
        </div>
        {resolvedToolbar ? <WidgetToolbar aria-label={toolbarLabel}>{resolvedToolbar}</WidgetToolbar> : null}
      </header>
      <WidgetContent>{children}</WidgetContent>
    </Element>
  );
});
