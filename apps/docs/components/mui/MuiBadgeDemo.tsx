'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { badgeStyles, stackStyles } from './visual-adapter';

export function MuiBadgeDemo() {
  return <Box sx={{ ...stackStyles, justifyItems: 'center' }}>
    <Chip label="Согласовано" sx={badgeStyles} />
    <p>COMETAL Badge → Material UI Chip. Неинтерактивная текстовая метка.</p>
  </Box>;
}
