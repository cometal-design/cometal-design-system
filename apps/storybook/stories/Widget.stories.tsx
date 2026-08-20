import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Widget,
} from '@cometal/react';

function WidgetTable() {
  const suppliers = [
    { id: 1, name: 'Северсталь', position: 'POS-00127', amount: '1 240 000 ₽', status: 'Согласовано' },
    { id: 2, name: 'НЛМК', position: 'POS-00128', amount: '840 000 ₽', status: 'На проверке' },
    { id: 3, name: 'ММК', position: 'POS-00129', amount: '2 160 000 ₽', status: 'Согласовано' },
    { id: 4, name: 'Евраз', position: 'POS-00130', amount: '620 000 ₽', status: 'На проверке' },
  ];

  return (
    <Table aria-label="Поставщики" density="comfortable">
      <TableHead>
        <TableRow>
          <TableHeaderCell kind="index">№</TableHeaderCell>
          <TableHeaderCell style={{ width: 160 }} sort="ascending">Позиция</TableHeaderCell>
          <TableHeaderCell style={{ width: 280 }}>Поставщик</TableHeaderCell>
          <TableHeaderCell style={{ width: 180 }}>Статус</TableHeaderCell>
          <TableHeaderCell style={{ width: 180 }}>Сумма</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {suppliers.map((supplier) => (
          <TableRow key={supplier.id} selected={supplier.id === 2}>
            <TableCell align="center">{supplier.id}</TableCell>
            <TableCell>{supplier.position}</TableCell>
            <TableCell>{supplier.name}</TableCell>
            <TableCell><Badge tone={supplier.status === 'Согласовано' ? 'green' : 'yellow'}>{supplier.status}</Badge></TableCell>
            <TableCell align="end">{supplier.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const meta = {
  title: 'Templates/Widget',
  component: Widget,
  parameters: {
    layout: 'padded',
  },
  args: {
    title: 'Сводка по закупкам',
    description: 'Widget собирает заголовок, служебный текст, actions и content slot в одну переиспользуемую оболочку.',
    actions: <Button size="m">Действие</Button>,
    children: (
      <div
        style={{
          minHeight: 240,
          display: 'grid',
          placeItems: 'center',
          color: 'var(--cometal-semantic-color-global-text-primary)',
        }}
      >
        Content slot
      </div>
    ),
  },
} satisfies Meta<typeof Widget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const TableHost: Story = {
  args: {
    title: 'Таблица поставщиков',
    description: 'Утверждённый Figma contract использует Widget как контейнер таблицы и вспомогательных действий.',
    actions: (
      <>
        <Button size="m" variant="secondary">Фильтры</Button>
        <Button size="m" variant="secondary">Экспорт</Button>
        <Button size="m">Добавить запись</Button>
      </>
    ),
    children: <WidgetTable />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table', { name: 'Поставщики' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Добавить запись' })).toBeVisible();
    await expect(canvas.getAllByRole('button', { name: /Фильтры|Экспорт/ })).toHaveLength(2);
  },
};
