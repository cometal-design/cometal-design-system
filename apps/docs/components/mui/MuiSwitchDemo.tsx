'use client';

import type { LmsSize } from './visual-adapter';
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { getSelectionLabelStyles, getSwitchStyles } from './visual-adapter';

export function MuiSwitchDemo({ size = 'm' }: { size?: LmsSize }) {
  const [checked, setChecked] = useState(false);
  return <FormControlLabel label="Автосохранение" sx={getSelectionLabelStyles('switch', size)} control={<Switch checked={checked} onChange={(event) => setChecked(event.target.checked)} sx={getSwitchStyles(size)} />} />;
}
