'use client';
import { WidgetTableReviewExample } from '../../shared/widget-table/WidgetTableReviewExample';
import type { TableMode } from '@cometal/react';

export function WidgetTablePatternExample({ mode }: { mode: TableMode }) {
  return <WidgetTableReviewExample mode={mode} />;
}
