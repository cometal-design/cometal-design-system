'use client';

import { useState } from 'react';
import {
  Button,
  Checkbox,
  Combobox,
  DatePicker,
  MultiSelect,
  RadioButton,
  Select,
  Switch,
  TextArea,
  TextField,
} from '@cometal/react';
import { contractorOptions, statusOptions } from '../lib/demo-options';

export function ComponentCatalogPreview({ id }: { id: string }) {
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);

  if (id === 'input.text-field') return <TextField label="Название поля" placeholder="Введите значение" />;
  if (id === 'input.date-picker') return <DatePicker label="Дата поставки" defaultValue="2026-07-15" />;
  if (id === 'input.text-area') return <TextArea label="Комментарий" placeholder="Введите комментарий" rows={3} />;
  if (id === 'input.select') return <Select label="Статус" options={statusOptions} defaultValue="" />;
  if (id === 'input.combobox') return <Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} />;
  if (id === 'input.multi-select') {
    return (
      <MultiSelect
        label="Контрагенты"
        selectedValues={selectedContractors}
        options={contractorOptions}
        onSelectedValuesChange={setSelectedContractors}
      />
    );
  }
  if (id === 'selection.checkbox') return <Checkbox label="Согласен с условиями" defaultChecked />;
  if (id === 'selection.radio-button') return <RadioButton label="Выбрать вариант" name="catalog-radio" defaultChecked />;
  if (id === 'selection.switch') return <Switch label="Получать уведомления" defaultChecked />;
  return <Button>Продолжить</Button>;
}
