import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Badge,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableFileCell,
  TableHeaderCell,
  TableHead,
  TableRow,
  TextField,
} from '@cometal/react';
import type { TableDensity } from '@cometal/react';
import { ComponentCodeExample } from './ComponentCodeExample';

const FIGMA_URL = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10833';
const SOURCE_URL = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Table/Table.tsx';

function ContextAction() {
  return (
    <button className="ds-table-context-action" type="button" aria-label="Открыть меню колонки">
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="3.5" cy="8" r="1.25" fill="currentColor" />
        <circle cx="8" cy="8" r="1.25" fill="currentColor" />
        <circle cx="12.5" cy="8" r="1.25" fill="currentColor" />
      </svg>
    </button>
  );
}

function StatusBadge({ children, tone }: { children: string; tone: 'green' | 'yellow' | 'red' }) {
  return <Badge tone={tone}>{children}</Badge>;
}

const rows = [
  { id: 1, selected: false, position: 'POS-00127', name: 'Рулон холоднокатаный 0,5 мм', quantity: 120, status: 'Согласовано', tone: 'green' as const, file: 'specification.pdf', size: '130 KB' },
  { id: 2, selected: true, position: 'POS-00128', name: 'Лист оцинкованный 1,0 мм', quantity: 48, status: 'На проверке', tone: 'yellow' as const, file: 'drawing.dwg', size: '2.4 MB' },
  { id: 3, selected: false, position: 'POS-00129', name: 'Труба профильная 40 × 20', quantity: 320, status: 'Ошибка', tone: 'red' as const, file: 'requirements.docx', size: '84 KB' },
  { id: 4, selected: false, position: 'POS-00130', name: 'Балка двутавровая 20Б1', quantity: 16, status: 'Согласовано', tone: 'green' as const, file: 'certificate.pdf', size: '760 KB' },
];

function WorkingTable({ density, filters = false }: { density: TableDensity; filters?: boolean }) {
  const filter = filters ? <TextField className="ds-table-filter" label="Поиск" size="s" placeholder="Найти" /> : undefined;
  return (
    <Table density={density} aria-label={`Позиции закупки, плотность ${density}`} className="ds-table-working">
      <TableHead>
        <TableRow>
          <TableHeaderCell kind="index">№</TableHeaderCell>
          <TableHeaderCell kind="selection"><Checkbox className="ds-table-checkbox" size="l" label="Выбрать все строки" indeterminate /></TableHeaderCell>
          <TableHeaderCell style={{ width: 156 }} sort="ascending" action={<ContextAction />} filter={filter}>Позиция</TableHeaderCell>
          <TableHeaderCell style={{ width: 312 }} action={<ContextAction />} filter={filter}>Наименование</TableHeaderCell>
          <TableHeaderCell style={{ width: 136 }} action={<ContextAction />} filter={filter}>Количество</TableHeaderCell>
          <TableHeaderCell style={{ width: 152 }} action={<ContextAction />} filter={filter}>Статус</TableHeaderCell>
          <TableHeaderCell style={{ width: 224 }} action={<ContextAction />} filter={filter}>Файл</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} selected={row.selected}>
            <TableCell align="center">{row.id}</TableCell>
            <TableCell align="center" state={row.id === 3 ? 'error' : 'default'}>
              <Checkbox className="ds-table-checkbox" size="l" label={`Выбрать строку ${row.id}`} defaultChecked={row.selected} />
            </TableCell>
            <TableCell state={row.id === 2 ? 'selected' : 'default'}>{row.position}</TableCell>
            <TableCell state={row.id === 3 ? 'error' : 'default'}>{row.name}</TableCell>
            <TableCell align="end">{row.quantity}</TableCell>
            <TableCell><StatusBadge tone={row.tone}>{row.status}</StatusBadge></TableCell>
            <TableFileCell fileName={row.file} fileSize={row.size} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OverviewPage({ density }: { density: TableDensity }) {
  return (
    <main className="ds-component-page ds-table-page">
      <header className="ds-component-hero">
        <div>
          <span className="ds-eyebrow">PATTERN · DATA DISPLAY · IN REVIEW</span>
          <h1>Table</h1>
          <p>Составная таблица для чтения и редактирования бизнес-данных. Колонки сохраняют контент при смене плотности, а состояния принадлежат ячейкам и строкам.</p>
        </div>
        <a href={FIGMA_URL} target="_blank" rel="noreferrer">Открыть в Figma ↗</a>
      </header>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>01</span><div><h2>Рабочий стенд</h2><p>Header остаётся 48px. Ячейки меняются между Comfortable 48px и Compact 40px; index и selection колонки меняют ширину синхронно.</p></div></div>
        <div className="ds-table-demo"><WorkingTable density={density} /></div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>02</span><div><h2>Поиск по колонкам</h2><p>Второй этаж включается на уровне всей строки заголовков, чтобы геометрия колонок не расходилась.</p></div></div>
        <div className="ds-table-demo"><WorkingTable density={density} filters /></div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>03</span><div><h2>Код</h2><p>Публичный API сохраняет нативную table-семантику и разделяет Table, Row, Header Cell, Cell и File Cell.</p></div></div>
        <ComponentCodeExample componentId="data-display.table" componentName="Table" sourceHref={SOURCE_URL} />
      </section>
    </main>
  );
}

const meta = {
  title: 'Patterns/Table',
  component: Table,
  args: { density: 'comfortable' },
  argTypes: { density: { control: 'inline-radio', options: ['comfortable', 'compact'] } },
  parameters: { layout: 'fullscreen' },
  render: ({ density }) => <OverviewPage density={density} />,
} satisfies Meta<{ density: TableDensity }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tables = canvas.getAllByRole('table');
    const firstRow = tables[0].querySelector<HTMLTableCellElement>('tbody td');
    const fileIconPath = tables[0].querySelector<SVGPathElement>('.cometal-table__file-icon path');
    const fileSize = canvas.getAllByText('130 KB')[0];
    await expect(tables[0]).toHaveAttribute('data-density', 'comfortable');
    await expect(getComputedStyle(firstRow!).height).toBe('48px');
    await expect(getComputedStyle(fileSize).display).not.toBe('none');
    await expect(getComputedStyle(fileIconPath!).strokeWidth).toBe('1.4px');
  },
};

export const Compact: Story = {
  args: { density: 'compact' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tables = canvas.getAllByRole('table');
    const firstRow = tables[0].querySelector<HTMLTableCellElement>('tbody td');
    const fileSize = canvas.getAllByText('130 KB')[0];
    await expect(tables[0]).toHaveAttribute('data-density', 'compact');
    await expect(getComputedStyle(firstRow!).height).toBe('40px');
    await expect(getComputedStyle(fileSize).display).toBe('none');
    await expect(fileSize).toHaveTextContent('130 KB');
  },
};
