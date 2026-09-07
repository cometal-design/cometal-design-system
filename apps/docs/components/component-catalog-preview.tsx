'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  Checkbox,
  Combobox,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  DatePicker,
  MultiSelect,
  RadioButton,
  Select,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableHead,
  TableRow,
  TextArea,
  TextField,
  Tooltip,
  Tabs,
  Widget,
} from '@cometal/react';
import { contractorOptions, statusOptions } from '../lib/demo-options';

export function ComponentCatalogPreview({ id }: { id: string }) {
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);

  if (id === 'action.button') return <Button>Продолжить</Button>;
  if (id === 'data-display.table') {
    return (
      <Table density="compact" aria-label="Пример Table">
        <TableHead>
          <TableRow><TableHeaderCell>Позиция</TableHeaderCell><TableHeaderCell>Статус</TableHeaderCell></TableRow>
        </TableHead>
        <TableBody>
          <TableRow><TableCell>POS-00127</TableCell><TableCell><Badge tone="green">Согласовано</Badge></TableCell></TableRow>
        </TableBody>
      </Table>
    );
  }
  if (id === 'template.widget') return <Widget title="Спецификация" description="20 строк"><div className="component-preview-widget-slot">Content slot</div></Widget>;
  if (id === 'input.text-field') return <TextField label="Название поля" placeholder="Введите значение" />;
  if (id === 'input.date-picker') return <DatePicker label="Дата поставки" defaultValue="2026-07-15" />;
  if (id === 'input.text-area') return <TextArea label="Комментарий" placeholder="Введите комментарий" rows={3} />;
  if (id === 'input.select') return <Select label="Статус" options={statusOptions} defaultValue="" />;
  if (id === 'input.combobox') return <Combobox label="Контрагент" placeholder="Найдите значение" options={contractorOptions} defaultValue="Северсталь" />;
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
  if (id === 'overlay.tooltip') {
    return (
      <Tooltip content="Подсказка для действия" defaultOpen placement="top-center">
        <Button size="m" variant="secondary">Наведи или сфокусируй</Button>
      </Tooltip>
    );
  }
  if (id === 'overlay.context-menu') {
    return (
      <ContextMenu defaultOpen trigger={<Button size="m" variant="secondary">Открыть</Button>}>
        <ContextMenuItem>Открыть</ContextMenuItem>
        <ContextMenuItem>Переименовать</ContextMenuItem>
        <ContextMenuDivider />
        <ContextMenuItem tone="danger">Удалить</ContextMenuItem>
      </ContextMenu>
    );
  }
  if (id === 'selection.radio-button') return <RadioButton label="Выбрать вариант" name="catalog-radio" defaultChecked />;
  if (id === 'selection.switch') return <Switch label="Получать уведомления" defaultChecked />;
  if (id === 'navigation.tabs') {
    return (
      <Tabs defaultValue="overview" size="s">
        <TabList aria-label="Разделы компонента">
          <Tab value="overview">Обзор</Tab>
          <Tab value="history">История</Tab>
        </TabList>
        <TabPanel value="overview">Сводка</TabPanel>
        <TabPanel value="history">Изменения</TabPanel>
      </Tabs>
    );
  }
  if (id === 'status.badge') return <Badge surface="dark" tone="green">Согласовано</Badge>;
  throw new Error(`Component family preview is not implemented for ${id}`);
}
