'use client';

import type { LmsSize } from './visual-adapter';
import { useId, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { fieldWidth, stackStyles, getDemoTabStyles, getDemoTabsStyles } from './visual-adapter';

const labels = ['Обзор', 'История', 'Документы'];

export function MuiTabsDemo({ size = 'm' }: { size?: LmsSize }) {
  const id = useId();
  const [selected, setSelected] = useState(0);
  return <Box sx={{ ...stackStyles, width: fieldWidth }}>
    <Tabs aria-label="Вкладки внутри примера" value={selected} onChange={(_, next: number) => setSelected(next)} variant="scrollable" scrollButtons="auto" sx={getDemoTabsStyles(size)}>
      {labels.map((label, index) => <Tab key={label} label={label} id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} sx={getDemoTabStyles(size)} />)}
    </Tabs>
    {labels.map((label, index) => <div key={label} role="tabpanel" hidden={index !== selected} id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} tabIndex={0}>Содержимое: {label}</div>)}
  </Box>;
}
