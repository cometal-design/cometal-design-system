'use client';

import type { LmsSize } from './visual-adapter';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CheckboxIcon, getSelectionLabelStyles, getSelectionControlStyles } from './visual-adapter';

export function MuiCheckboxDemo({ size = 'm', disabled = false }: { size?: LmsSize; disabled?: boolean }) {
  const [checked, setChecked] = useState(false);
  return <FormControlLabel disabled={disabled} sx={getSelectionLabelStyles('checkbox', size)} label="Получать уведомления" control={<Checkbox disableRipple checked={checked} onChange={(event) => setChecked(event.target.checked)} icon={<CheckboxIcon size={size} />} checkedIcon={<CheckboxIcon checked size={size} />} sx={getSelectionControlStyles('checkbox', size)} />} />;
}
