'use client';

import type { LmsSize } from './visual-adapter';
import { useState } from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { RadioIcon, getSelectionLabelStyles, getSelectionControlStyles, stackStyles } from './visual-adapter';

export function MuiRadioButtonDemo({ size = 'm', disabled = false }: { size?: LmsSize; disabled?: boolean }) {
  const [value, setValue] = useState('standard');
  return <Box sx={stackStyles}>
    <RadioGroup aria-label="Приоритет заявки" value={value} onChange={(event) => setValue(event.target.value)}>
      <FormControlLabel disabled={disabled} value="standard" label="Обычный" sx={getSelectionLabelStyles('radio', size)} control={<Radio disableRipple icon={<RadioIcon size={size} />} checkedIcon={<RadioIcon checked size={size} />} sx={getSelectionControlStyles('radio', size)} />} />
      <FormControlLabel disabled={disabled} value="urgent" label="Срочный" sx={getSelectionLabelStyles('radio', size)} control={<Radio disableRipple icon={<RadioIcon size={size} />} checkedIcon={<RadioIcon checked size={size} />} sx={getSelectionControlStyles('radio', size)} />} />
    </RadioGroup>
  </Box>;
}
