'use client';

import type { LmsSize } from './visual-adapter';
import { useId, useState } from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { fieldWidth, labelStyles, stackStyles, getTextFieldStyles } from './visual-adapter';

export function MuiTextFieldDemo({ size = 'm' }: { size?: LmsSize }) {
  const id = useId();
  const [value, setValue] = useState('');
  return <Box sx={{ ...stackStyles, width: fieldWidth, gap: 'var(--cometal-semantic-spacing-global-input-label-gap)' }}>
    <FormLabel htmlFor={id} sx={labelStyles}>Название проекта</FormLabel>
    <TextField id={id} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Введите название" helperText="Название будет видно участникам" sx={getTextFieldStyles(size)} />
  </Box>;
}
