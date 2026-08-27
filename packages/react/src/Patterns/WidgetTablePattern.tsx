import type { ReactNode } from 'react';
import { Widget } from '../Widget/Widget';
import './widget-table-pattern.css';

export interface WidgetTablePatternProps {
  title: ReactNode;
  description?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/** Product pattern: Widget owns the shell, Table owns the data surface and paginator. */
export function WidgetTablePattern({ title, description, toolbar, children, footer, className }: WidgetTablePatternProps) {
  return (
    <Widget title={title} description={description} toolbar={toolbar} className={['cometal-widget-table-pattern', className].filter(Boolean).join(' ')}>
      <div className="cometal-widget-table-pattern__table">{children}</div>
      {footer ? <div className="cometal-widget-table-pattern__footer">{footer}</div> : null}
    </Widget>
  );
}
