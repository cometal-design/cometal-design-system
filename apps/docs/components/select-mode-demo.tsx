'use client';

import { useState } from 'react';
import { Select } from '@cometal/react';
import { statusOptions } from '../lib/demo-options';

export function SelectModeDemo() {
  const [value, setValue] = useState('');
  const selectedLabel = statusOptions.find((option) => option.value === value)?.label ?? '—';

  return (
    <div className="field-family-board__examples">
      <Select
        label="Статус"
        options={statusOptions}
        helperText="12 вариантов, список прокручивается"
        value={value}
        onValueChange={setValue}
      />
      <Select label="Статус" options={statusOptions} mode="read" readValue={selectedLabel} />
    </div>
  );
}
