'use client';

import { useState } from 'react';
import { MultiSelect } from '@cometal/react';
import { contractorOptions } from '../lib/demo-options';

export function MultiSelectModeDemo() {
  const [selectedValues, setSelectedValues] = useState(['severstal', 'nlmk', 'mmk']);

  return (
    <div className="field-family-board__examples">
      <MultiSelect
        label="Контрагенты"
        options={contractorOptions}
        selectedValues={selectedValues}
        onSelectedValuesChange={setSelectedValues}
        helperText={`Выбрано: ${selectedValues.length}`}
      />
      <MultiSelect label="Контрагенты" options={contractorOptions} selectedValues={selectedValues} mode="read" />
    </div>
  );
}
