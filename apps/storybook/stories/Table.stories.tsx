import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Badge,
  Button,
  Checkbox,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  DateRangePicker,
  Table,
  TableBody,
  TableCell,
  TableFileCell,
  TableHeaderCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@cometal/react';
import type { TableDensity } from '@cometal/react';
import { ComponentCodeExample } from './ComponentCodeExample';

const FIGMA_URL = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10833';
const SOURCE_URL = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/Table/Table.tsx';

function MenuTrigger() {
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

function ContextAction() {
  return (
    <ContextMenu trigger={<MenuTrigger />} aria-label="Действия колонки">
      <ContextMenuItem>Закрепить</ContextMenuItem>
      <ContextMenuItem>Скрыть</ContextMenuItem>
      <ContextMenuDivider />
      <ContextMenuItem tone="danger">Удалить фильтр</ContextMenuItem>
    </ContextMenu>
  );
}

function ReorderHandle() {
  return (
    <button className="ds-table-reorder" type="button" aria-label="Переместить строку">
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M5 4.25h6M5 8h6M5 11.75h6" fill="none" stroke="currentColor" strokeWidth="var(--cometal-primitive-stroke-140, 1.4)" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function StatusBadge({ children, tone }: { children: string; tone: 'green' | 'yellow' | 'red' }) {
  return <Badge tone={tone}>{children}</Badge>;
}

const rows = [
  { id: 1, selected: false, position: 'POS-00127', name: 'Рулон холоднокатаный 0,5 мм', quantity: 120, status: 'Согласовано', tone: 'green' as const, file: 'specification.pdf', size: '130 KB', period: '15.07.2026 — 23.07.2026' },
  { id: 2, selected: true, position: 'POS-00128', name: 'Лист оцинкованный 1,0 мм для фасадной линии №4 с длинным названием', quantity: 48, status: 'На проверке', tone: 'yellow' as const, file: 'drawing.dwg', size: '2.4 MB', period: '20.07.2026 — 27.07.2026' },
  { id: 3, selected: false, position: 'POS-00129', name: 'Труба профильная 40 × 20', quantity: 320, status: 'Ошибка', tone: 'red' as const, file: 'requirements.docx', size: '84 KB', period: '01.08.2026 — 10.08.2026' },
  { id: 4, selected: false, position: 'POS-00130', name: 'Балка двутавровая 20Б1', quantity: 16, status: 'Согласовано', tone: 'green' as const, file: 'certificate.pdf', size: '760 KB', period: '05.08.2026 — 19.08.2026' },
];

function NameCell({ value }: { value: string }) {
  return (
    <Tooltip content={value} placement="top-start">
      <span data-cometal-tooltip-trigger className="ds-table-truncate">{value}</span>
    </Tooltip>
  );
}

function SummaryFooter() {
  return (
    <div className="ds-table-footer">
      <div className="ds-table-footer__summary">
        <strong>Итого</strong>
        <span>4 позиции · 504 ед. · 3 файла согласованы</span>
      </div>
      <div className="ds-table-footer__pager" role="navigation" aria-label="Пагинация таблицы">
        <Button size="s" variant="secondary">Назад</Button>
        <span>Страница 1 из 3</span>
        <Button size="s" variant="secondary">Далее</Button>
      </div>
    </div>
  );
}

function WorkingTable({
  density,
  filters = false,
  showSummary = false,
}: {
  density: TableDensity;
  filters?: boolean;
  showSummary?: boolean;
}) {
  const textFilter = filters ? <TextField className="ds-table-filter" label="Поиск" size="s" placeholder="Найти" /> : undefined;
  const rangeFilter = filters ? (
    <DateRangePicker
      className="ds-table-range-filter"
      label="Период"
      size="m"
      defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }}
    />
  ) : undefined;
  return (
    <div className="ds-table-pattern">
      <Table density={density} aria-label={`Позиции закупки, плотность ${density}`} className="ds-table-working">
        <TableHead>
          <TableRow>
            <TableHeaderCell kind="index">№</TableHeaderCell>
            <TableHeaderCell kind="selection"><Checkbox className="ds-table-checkbox" size="l" label="Выбрать все строки" indeterminate /></TableHeaderCell>
            <TableHeaderCell style={{ width: 156 }} sort="ascending" action={<ContextAction />} filter={textFilter}>Позиция</TableHeaderCell>
            <TableHeaderCell style={{ width: 312 }} action={<ContextAction />} filter={textFilter}>Наименование</TableHeaderCell>
            <TableHeaderCell style={{ width: 188 }} action={<ContextAction />} filter={rangeFilter}>Период</TableHeaderCell>
            <TableHeaderCell style={{ width: 136 }} action={<ContextAction />} filter={textFilter}>Количество</TableHeaderCell>
            <TableHeaderCell style={{ width: 152 }} action={<ContextAction />} filter={textFilter}>Статус</TableHeaderCell>
            <TableHeaderCell style={{ width: 224 }} action={<ContextAction />} filter={textFilter}>Файл</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} selected={row.selected}>
              <TableCell align="center" leading={<ReorderHandle />}>{row.id}</TableCell>
              <TableCell align="center" state={row.id === 3 ? 'error' : 'default'}>
                <Checkbox className="ds-table-checkbox" size="l" label={`Выбрать строку ${row.id}`} defaultChecked={row.selected} />
              </TableCell>
              <TableCell state={row.id === 2 ? 'selected' : 'default'}>{row.position}</TableCell>
              <TableCell state={row.id === 3 ? 'error' : 'default'}><NameCell value={row.name} /></TableCell>
              <TableCell>{row.period}</TableCell>
              <TableCell align="end">{row.quantity}</TableCell>
              <TableCell><StatusBadge tone={row.tone}>{row.status}</StatusBadge></TableCell>
              <TableFileCell fileName={row.file} fileSize={row.size} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showSummary ? <SummaryFooter /> : null}
    </div>
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
        <div className="ds-table-demo"><WorkingTable density={density} showSummary /></div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>02</span><div><h2>Фильтры и overlays</h2><p>Header reuse: text filters, Date Range Picker, Context Menu и Tooltip живут в одном composable contract без дублирования локальных dropdown решений.</p></div></div>
        <div className="ds-table-demo"><WorkingTable density={density} filters /></div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>03</span><div><h2>Композиция поведения</h2><p>Summary, pager и reorder handle остаются composition primitives поверх нативной таблицы. Публичный API не копирует продуктовые row counts и не выносит их в props.</p></div></div>
        <div className="ds-rule-list"><article><code>Tooltip</code><p>Только для действительно усечённого контента, не для каждого текста по умолчанию.</p></article><article><code>Context Menu</code><p>Header actions reuse общий overlay с Hard elevation и danger semantics.</p></article><article><code>Summary + Pager</code><p>Собираются рядом с таблицей и не меняют её DOM semantics.</p></article></div>
      </section>

      <section className="ds-component-section">
        <div className="ds-component-section__intro"><span>04</span><div><h2>Код</h2><p>Публичный API сохраняет нативную table-семантику и разделяет Table, Row, Header Cell, Cell и File Cell.</p></div></div>
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
    const pager = canvas.getByRole('navigation', { name: 'Пагинация таблицы' });
    await expect(tables[0]).toHaveAttribute('data-density', 'comfortable');
    await expect(getComputedStyle(firstRow!).height).toBe('48px');
    await expect(getComputedStyle(fileSize).display).not.toBe('none');
    await expect(getComputedStyle(fileIconPath!).strokeWidth).toBe('1.4px');
    await expect(pager).toBeVisible();
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

export const Overlays: Story = {
  args: { density: 'comfortable' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tables = canvas.getAllByRole('table');
    const longName = 'Лист оцинкованный 1,0 мм для фасадной линии №4 с длинным названием';
    const trigger = within(tables[0]!).getByText(longName);
    await userEvent.hover(trigger);
    await expect(trigger).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Период' })).toBeVisible();
  },
};
