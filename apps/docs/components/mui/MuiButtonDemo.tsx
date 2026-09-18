'use client';

import type { LmsSize } from './visual-adapter';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getButtonStyles, stackStyles } from './visual-adapter';

export function MuiButtonDemo({ size = 'm' }: { size?: LmsSize }) {
  const [count, setCount] = useState(0);
  return <Box sx={{ ...stackStyles, justifyItems: 'center' }}>
    <Button type="button" variant="contained" sx={getButtonStyles(size)} onClick={() => setCount((value) => value + 1)}>Создать заявку</Button>
    <output aria-live="polite">Создано заявок: {count}</output>
  </Box>;
}
