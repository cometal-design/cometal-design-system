'use client';

import type { LmsSize } from './visual-adapter';
import { useId, useState } from 'react';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Chevron, Control, Field, getControlSizeStyles, getMenuStyles } from './visual-adapter';

const options = [
  { value: 'design', label: 'Проектирование' },
  { value: 'procurement', label: 'Закупки' },
  { value: 'production', label: 'Производство' },
  { value: 'quality', label: 'Контроль качества' },
  { value: 'archive', label: 'Архив', disabled: true },
];

export function MuiSelectDemo({ size = 'm', disabled = false, error = false }: { size?: LmsSize; disabled?: boolean; error?: boolean }) {
  const id = useId();
  const [value, setValue] = useState('');
  return (
    <Field disabled={disabled} error={error}>
      <FormLabel id={`${id}-label`}>Направление работы</FormLabel>
      <Select<string>
        id={id}
        labelId={`${id}-label`}
        aria-describedby={`${id}-helper`}
        native={false}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        displayEmpty
        renderValue={(selected) => selected ? options.find((option) => option.value === selected)?.label : <span data-placeholder>Выберите направление</span>}
        input={<Control sx={getControlSizeStyles(size)} />}
        IconComponent={Chevron}
        MenuProps={{ slotProps: { paper: { sx: getMenuStyles(size) } } }}
      >
        {options.map((option) => <MenuItem key={option.value} value={option.value} disabled={option.disabled}>{option.label}</MenuItem>)}
      </Select>
      <FormHelperText id={`${id}-helper`}>{error ? 'Выберите направление, чтобы продолжить' : 'Можно выбрать одно направление'}</FormHelperText>
    </Field>
  );
}
