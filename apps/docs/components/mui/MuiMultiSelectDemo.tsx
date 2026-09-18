'use client';

import type { LmSize } from './visual-adapter';
import { useId, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Chevron, Control, Field, getMenuStyles, getMultiControlStyles, getValueTagStyles } from './visual-adapter';

const options = ['Проектирование', 'Закупки', 'Производство'];

export function MuiMultiSelectDemo({ size = 'm' }: { size?: LmSize }) {
  const id = useId();
  const [value, setValue] = useState<string[]>([]);
  return <Field>
    <FormLabel id={`${id}-label`}>Направления работы</FormLabel>
    <Select<string[]> id={id} labelId={`${id}-label`} aria-describedby={`${id}-helper`} multiple value={value}
      onChange={(event) => setValue(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value)}
      displayEmpty input={<Control sx={getMultiControlStyles(size)} />}
      IconComponent={Chevron} MenuProps={{ slotProps: { paper: { sx: getMenuStyles(size) } } }}
      renderValue={(selected) => selected.length ? <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--cometal-primitive-spacing-25)', minWidth: 0 }}>
        {selected.map((label) => <Chip key={label} label={label} sx={getValueTagStyles(size)} />)}
      </Box> : <span data-placeholder>Выберите направления</span>}
    >
      {options.map((label) => <MenuItem key={label} value={label}>{label}</MenuItem>)}
    </Select>
    <FormHelperText id={`${id}-helper`}>Выбор и снятие — в меню, без поиска и кнопок удаления меток.</FormHelperText>
  </Field>;
}
