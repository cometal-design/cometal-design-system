'use client';

import { useState } from 'react';
import { Combobox } from '@cometal/react';
import { contractorOptions } from '../lib/demo-options';

export function ComboboxModeDemo() {
  const [selectedValue, setSelectedValue] = useState('severstal');
  const selectedLabel = contractorOptions.find((option) => option.value === selectedValue)?.label ?? '—';

  return (
    <div className="field-family-board__examples">
      <Combobox
        label="Контрагент"
        placeholder="Найдите значение"
        helperText="Введите название или ИНН"
        options={contractorOptions}
        defaultValue="Северсталь"
        onOptionSelect={setSelectedValue}
        onClear={() => setSelectedValue('')}
      />
      <Combobox label="Контрагент" mode="read" readValue={selectedLabel} />
    </div>
  );
}
