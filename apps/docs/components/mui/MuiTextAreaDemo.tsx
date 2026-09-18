'use client';

import type { LmSize } from './visual-adapter';
import { useId, useState } from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { fieldWidth, labelStyles, stackStyles, getTextAreaStyles } from './visual-adapter';

export function MuiTextAreaDemo({ size = 'm' }: { size?: LmSize }) {
  const id = useId();
  const [value, setValue] = useState('');
  return <Box sx={{ ...stackStyles, width: fieldWidth, gap: 'var(--cometal-semantic-spacing-global-input-label-gap)' }}>
    <FormLabel htmlFor={id} sx={labelStyles}>Описание проекта</FormLabel>
    <TextField id={id} multiline rows={5} value={value} onChange={(event) => setValue(event.target.value)} placeholder="Добавьте подробности" helperText="Можно использовать несколько строк" sx={getTextAreaStyles(size)} />
  </Box>;
}
