'use client';

import type { LmsSize } from './visual-adapter';
import { useId, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { getAutocompleteStyles, getFieldIconStyles, getMenuStyles, Chevron, fieldWidth, labelStyles, stackStyles } from './visual-adapter';

const options = ['Проектирование', 'Закупки', 'Производство', 'Контроль качества'];

export function MuiComboboxDemo({ size = 'm' }: { size?: LmsSize }) {
  const id = useId();
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  return <Box sx={{ ...stackStyles, width: fieldWidth, gap: 'var(--cometal-semantic-spacing-global-input-label-gap)' }}>
    <FormLabel htmlFor={id} sx={labelStyles}>Найти направление</FormLabel>
    <Autocomplete id={id} options={options} value={value} onChange={(_, next) => setValue(next)} inputValue={inputValue} onInputChange={(_, next) => setInputValue(next)}
      popupIcon={<Chevron style={getFieldIconStyles(size)} />}
      slotProps={{ paper: { sx: { ...getMenuStyles(size), '&&& .MuiAutocomplete-listbox': getMenuStyles(size)['& .MuiList-root'], '&&& .MuiAutocomplete-option': { ...getMenuStyles(size)['& .MuiMenuItem-root'], '&[aria-selected="true"]': getMenuStyles(size)['& .MuiMenuItem-root']['&.Mui-selected'] } } } }}
      renderInput={(params) => <TextField {...params} helperText="Начните вводить название" placeholder="Поиск" sx={getAutocompleteStyles(size)} />}
    />
  </Box>;
}
