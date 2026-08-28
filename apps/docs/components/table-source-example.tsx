'use client';

import { TableReviewExample } from '@cometal/examples/widget-table';
import type { TableDensity, TableMode } from '@cometal/react';

export function TableSourceExample({
  density = 'comfortable',
  filters = true,
  mode = 'read',
}: {
  density?: TableDensity;
  filters?: boolean;
  mode?: TableMode;
}) {
  return <TableReviewExample initialDensity={density} initialFilters={filters} mode={mode} />;
}
