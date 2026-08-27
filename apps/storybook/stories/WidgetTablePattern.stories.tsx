import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { WidgetTablePattern } from '@cometal/react';
import { WidgetTableReviewExample } from '@cometal/examples/widget-table';
import { definition as refreshIconDefinition } from '@cometal/react/icons/outline/arrows/arrow-refresh-01';
import { definition as downloadIconDefinition } from '@cometal/react/icons/outline/general/download-01';
import { definition as filterIconDefinition } from '@cometal/react/icons/outline/general/filter';
import { definition as plusIconDefinition } from '@cometal/react/icons/outline/general/plus-01';
import { definition as flexRowsIconDefinition } from '@cometal/react/icons/outline/layout/flex-rows';
import { definition as calculatorIconDefinition } from '@cometal/react/icons/outline/charts/calculator-02';

const patternToolbarIcons = [flexRowsIconDefinition, filterIconDefinition, calculatorIconDefinition, refreshIconDefinition, downloadIconDefinition, plusIconDefinition];

const sortableColumnContracts = [
  { id: 'position', label: 'Позиция', ascending: ['POS-001', 'POS-002', 'POS-003', 'POS-004', 'POS-005', 'POS-006', 'POS-007', 'POS-008', 'POS-009', 'POS-010'], descending: ['POS-120', 'POS-119', 'POS-118', 'POS-117', 'POS-116', 'POS-115', 'POS-114', 'POS-113', 'POS-112', 'POS-111'] },
  { id: 'name', label: 'Наименование', ascending: ['POS-005', 'POS-015', 'POS-025', 'POS-035', 'POS-045', 'POS-055', 'POS-065', 'POS-075', 'POS-085', 'POS-095'], descending: ['POS-113', 'POS-103', 'POS-093', 'POS-083', 'POS-073', 'POS-063', 'POS-053', 'POS-043', 'POS-033', 'POS-023'] },
  { id: 'grade', label: 'Марка стали', ascending: ['POS-007', 'POS-017', 'POS-027', 'POS-037', 'POS-047', 'POS-057', 'POS-067', 'POS-077', 'POS-087', 'POS-097'], descending: ['POS-004', 'POS-014', 'POS-024', 'POS-034', 'POS-044', 'POS-054', 'POS-064', 'POS-074', 'POS-084', 'POS-094'] },
  { id: 'quantity', label: 'Количество', ascending: ['POS-004', 'POS-010', 'POS-014', 'POS-003', 'POS-020', 'POS-024', 'POS-008', 'POS-013', 'POS-030', 'POS-034'], descending: ['POS-115', 'POS-105', 'POS-095', 'POS-119', 'POS-085', 'POS-109', 'POS-075', 'POS-099', 'POS-111', 'POS-065'] },
  { id: 'unit', label: 'Ед.', ascending: ['POS-001', 'POS-002', 'POS-003', 'POS-005', 'POS-006', 'POS-007', 'POS-008', 'POS-009', 'POS-010', 'POS-011'], descending: ['POS-004', 'POS-014', 'POS-024', 'POS-034', 'POS-044', 'POS-054', 'POS-064', 'POS-074', 'POS-084', 'POS-094'] },
  { id: 'price', label: 'Цена, ₽', ascending: ['POS-005', 'POS-015', 'POS-025', 'POS-009', 'POS-035', 'POS-019', 'POS-045', 'POS-029', 'POS-055', 'POS-003'], descending: ['POS-114', 'POS-104', 'POS-094', 'POS-084', 'POS-074', 'POS-064', 'POS-054', 'POS-044', 'POS-034', 'POS-024'] },
  { id: 'sum', label: 'Сумма, ₽', ascending: ['POS-010', 'POS-003', 'POS-020', 'POS-013', 'POS-004', 'POS-030', 'POS-023', 'POS-006', 'POS-008', 'POS-014'], descending: ['POS-117', 'POS-107', 'POS-114', 'POS-111', 'POS-115', 'POS-097', 'POS-119', 'POS-105', 'POS-101', 'POS-112'] },
  { id: 'delivery', label: 'Дата поставки', ascending: ['POS-001', 'POS-011', 'POS-021', 'POS-031', 'POS-041', 'POS-051', 'POS-061', 'POS-071', 'POS-081', 'POS-091'], descending: ['POS-010', 'POS-020', 'POS-030', 'POS-040', 'POS-050', 'POS-060', 'POS-070', 'POS-080', 'POS-090', 'POS-100'] },
  { id: 'document', label: 'Документ', ascending: ['POS-001', 'POS-002', 'POS-003', 'POS-004', 'POS-005', 'POS-006', 'POS-007', 'POS-008', 'POS-009', 'POS-010'], descending: ['POS-120', 'POS-119', 'POS-118', 'POS-117', 'POS-116', 'POS-115', 'POS-114', 'POS-113', 'POS-112', 'POS-111'] },
  { id: 'status', label: 'Статус', ascending: ['POS-003', 'POS-006', 'POS-010', 'POS-013', 'POS-016', 'POS-020', 'POS-023', 'POS-026', 'POS-030', 'POS-033'], descending: ['POS-005', 'POS-015', 'POS-025', 'POS-035', 'POS-045', 'POS-055', 'POS-065', 'POS-075', 'POS-085', 'POS-095'] },
  { id: 'control', label: 'Контроль', ascending: ['POS-005', 'POS-015', 'POS-025', 'POS-035', 'POS-045', 'POS-055', 'POS-065', 'POS-075', 'POS-085', 'POS-095'], descending: ['POS-004', 'POS-014', 'POS-024', 'POS-034', 'POS-044', 'POS-054', 'POS-064', 'POS-074', 'POS-084', 'POS-094'] },
  { id: 'supplier', label: 'Поставщик', ascending: ['POS-006', 'POS-016', 'POS-026', 'POS-036', 'POS-046', 'POS-056', 'POS-066', 'POS-076', 'POS-086', 'POS-096'], descending: ['POS-008', 'POS-018', 'POS-028', 'POS-038', 'POS-048', 'POS-058', 'POS-068', 'POS-078', 'POS-088', 'POS-098'] },
] as const;

const initialVisibleRowIds = ['POS-001', 'POS-002', 'POS-003', 'POS-004', 'POS-005', 'POS-006', 'POS-007', 'POS-008', 'POS-009', 'POS-010'];

function visibleRowIds(table: HTMLElement) {
  return Array.from(
    table.querySelectorAll<HTMLTableRowElement>('tbody tr[data-row-id]'),
    (row) => row.querySelector<HTMLElement>('td[data-column-id="position"]')?.textContent?.trim(),
  );
}

function definitionPathData(body: string) {
  return Array.from(body.matchAll(/<path d="([^"]+)"/g), (match) => match[1]);
}

async function expectM1Floors(table: HTMLElement, expectedFloor: 40 | 48) {
  const shell = table.closest<HTMLElement>('.cometal-table-scroll-shell')!;
  const shellBottom = Number.parseFloat(getComputedStyle(shell).borderBottomWidth);
  const header = table.querySelector<HTMLElement>('thead tr:first-child')!;
  const filter = table.querySelector<HTMLElement>('.cometal-table__filter-row')!;
  const body = table.querySelector<HTMLElement>('tbody tr[data-row-id]')!;
  const summary = table.querySelector<HTMLElement>('tbody tr:last-child')!;
  const filterControl = filter.querySelector<HTMLElement>('.cometal-field__control')!;
  await expect(header.getBoundingClientRect().height).toBe(expectedFloor);
  await expect(filter.getBoundingClientRect().height).toBe(expectedFloor);
  await expect(body.getBoundingClientRect().height).toBe(expectedFloor);
  await expect(summary.getBoundingClientRect().height + shellBottom).toBe(expectedFloor);
  const utilityColumnIds = table.getAttribute('data-mode') === 'edit' ? ['drag', 'index', 'selection'] : ['index', 'selection'];
  for (const columnId of utilityColumnIds) {
    const utility = body.querySelector<HTMLElement>(`[data-column-id="${columnId}"]`)!;
    const summaryUtility = summary.querySelector<HTMLElement>(`[data-column-id="${columnId}"]`)!;
    await expect(utility.getBoundingClientRect().width).toBe(expectedFloor);
    await expect(utility.getBoundingClientRect().height).toBe(expectedFloor);
    await expect(summaryUtility.getBoundingClientRect().width).toBe(expectedFloor);
    await expect(summaryUtility.getBoundingClientRect().height + shellBottom).toBe(expectedFloor);
  }
  await expect(filterControl.getBoundingClientRect().height).toBe(32);
}

const meta = {
  title: 'Patterns/Widget with Table',
  component: WidgetTablePattern,
  args: { title: 'Спецификация позиций', children: null },
  parameters: { layout: 'fullscreen', controls: { disable: true }, docs: { description: { component: 'Одна композиция принятых Widget и Table: shell не знает о данных, Table сохраняет два уровня header, source families и paginator.' } } },
} satisfies Meta<typeof WidgetTablePattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Обзор',
  render: () => <main className="ds-story-canvas ds-widget-table-pattern-story"><WidgetTableReviewExample mode="read" /><WidgetTableReviewExample mode="edit" /></main>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readTable = canvas.getByRole('table', { name: 'Спецификация позиций · Read' });
    const editTable = canvas.getByRole('table', { name: 'Спецификация позиций · Edit' });
    const tableWrappers = Array.from(canvasElement.querySelectorAll<HTMLElement>('.cometal-widget-table-pattern__table'));
    const tableShells = Array.from(canvasElement.querySelectorAll<HTMLElement>('.cometal-table-scroll-shell'));
    const footers = Array.from(canvasElement.querySelectorAll<HTMLElement>('.cometal-widget-table-pattern__footer'));
    await expect(readTable).toHaveAttribute('data-mode', 'read');
    await expect(editTable).toHaveAttribute('data-mode', 'edit');
    await expect(within(readTable).getAllByRole('row')).toHaveLength(13);
    await expect(within(editTable).getAllByRole('row')).toHaveLength(13);
    await expect(within(readTable).getByRole('row', { name: /Фильтры таблицы/ })).toBeVisible();
    await expect(canvas.getAllByRole('navigation', { name: /Пагинация таблицы/ })).toHaveLength(2);

    const [readToolbar, editToolbar] = canvas.getAllByRole('toolbar', { name: 'Действия виджета' });
    const readToolbarButtons = within(readToolbar!).getAllByRole('button');
    const editToolbarButtons = within(editToolbar!).getAllByRole('button');
    const editToolbarIcons = Array.from(editToolbar!.querySelectorAll<SVGSVGElement>('svg[data-cometal-icon]'));
    await expect(getComputedStyle(readToolbar!).gap).toBe('8px');
    await expect(readToolbarButtons).toHaveLength(5);
    await expect(editToolbarButtons).toHaveLength(6);
    await expect(editToolbarIcons).toHaveLength(6);
    await expect(within(readToolbar!).getByRole('button', { name: 'Скрыть итоги' })).toHaveAttribute('aria-pressed', 'true');
    await expect(within(editToolbar!).getByRole('button', { name: 'Скрыть итоги' })).toHaveAttribute('aria-pressed', 'true');
    for (const button of editToolbarButtons.slice(0, 5)) {
      await expect(button).toHaveAttribute('data-variant', 'secondary');
      await expect(button.getBoundingClientRect().width).toBe(40);
      await expect(button.getBoundingClientRect().height).toBe(40);
    }
    await expect(editToolbarButtons[5]).toHaveAttribute('data-variant', 'primary');
    for (const [index, icon] of editToolbarIcons.entries()) {
      await expect(icon.getBoundingClientRect().width).toBe(16);
      await expect(icon.getBoundingClientRect().height).toBe(16);
      await expect(Array.from(icon.querySelectorAll('path'), (path) => path.getAttribute('d'))).toEqual(definitionPathData(patternToolbarIcons[index]!.body));
    }

    const borderProbe = document.createElement('span');
    borderProbe.style.color = 'var(--cometal-semantic-color-global-border-default)';
    borderProbe.style.backgroundColor = 'var(--cometal-semantic-color-global-surface-raised)';
    canvasElement.append(borderProbe);
    const probeStyle = getComputedStyle(borderProbe);
    await expect(tableWrappers).toHaveLength(2);
    await expect(tableShells).toHaveLength(2);
    await expect(footers).toHaveLength(2);
    for (const [index, tableWrapper] of tableWrappers.entries()) {
      const wrapperStyle = getComputedStyle(tableWrapper);
      await expect(wrapperStyle.borderTopWidth).toBe('0px');
      await expect(wrapperStyle.borderRadius).toBe('0px');
      await expect(wrapperStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      await expect(wrapperStyle.overflow).toBe('visible');
      const tableShell = tableShells[index]!;
      const shellStyle = getComputedStyle(tableShell);
      await expect(shellStyle.boxSizing).toBe('border-box');
      await expect([shellStyle.borderTopWidth, shellStyle.borderRightWidth, shellStyle.borderBottomWidth, shellStyle.borderLeftWidth]).toEqual(['1px', '1px', '1px', '1px']);
      await expect(shellStyle.borderTopStyle).toBe('solid');
      await expect(shellStyle.borderTopColor).toBe(probeStyle.color);
      await expect(shellStyle.borderRadius).toBe('8px');
      await expect(shellStyle.backgroundColor).toBe(probeStyle.backgroundColor);
      await expect(shellStyle.overflow).toBe('hidden');
      await expect(tableWrapper.getBoundingClientRect().width).toBe(tableShell.getBoundingClientRect().width);
      await expect(tableWrapper.getBoundingClientRect().height).toBe(tableShell.getBoundingClientRect().height);
      await expect(tableWrapper.contains(footers[index]!)).toBe(false);
      await expect(tableShell.contains(footers[index]!)).toBe(false);
    }
    borderProbe.remove();
    await expectM1Floors(readTable, 48);
    await expectM1Floors(editTable, 48);
    await expect(within(readTable).getByRole('textbox', { name: 'Фильтр по позиции' })).toBeVisible();
    const filterLabelRow = readTable.querySelector<HTMLElement>('.cometal-table__filter-control .cometal-field__label-row')!;
    await expect(getComputedStyle(filterLabelRow).position).toBe('absolute');
    await expect(getComputedStyle(filterLabelRow).width).toBe('1px');
    await expect(readTable.querySelector('.cometal-widget-table-pattern__filter')).toBeNull();
    await expect(canvasElement.querySelector('.cometal-widget-table-pattern__density')).toBeNull();

    const readRow = readTable.querySelector<HTMLTableRowElement>('tbody tr[data-row-id]')!;
    const readCells = Array.from(readRow.querySelectorAll<HTMLElement>('td[data-state="default"]'));
    await expect(readRow.querySelectorAll('td[data-editable="true"]')).toHaveLength(0);
    await expect(readTable.querySelector('[data-kind="drag"]')).toBeNull();
    await expect(readTable.querySelector('.cometal-table__drag-cell')).toBeNull();
    await expect(readTable).not.toHaveAttribute('data-reorderable');
    await expect(readCells.length).toBeGreaterThan(1);
    await expect(within(readTable).getByRole('separator', { name: 'Изменить ширину колонки Позиция' })).toBeVisible();
    await expect(within(readTable).queryByRole('separator', { name: /Перемещение|№|Выбрать/ })).toBeNull();

    const readNameHeader = readTable.querySelector<HTMLTableCellElement>('thead th[data-column-id="name"]')!;
    const readNameResizer = within(readTable).getByRole('separator', { name: 'Изменить ширину колонки Наименование' });
    const initialReadNameWidth = readNameHeader.getBoundingClientRect().width;
    const minimumReadNameWidth = Number.parseFloat(getComputedStyle(readNameHeader).minWidth);
    fireEvent.pointerDown(readNameResizer, { pointerId: 5, button: 0, clientX: 400 });
    fireEvent.pointerMove(readNameResizer, { pointerId: 5, clientX: 400 + minimumReadNameWidth - initialReadNameWidth });
    fireEvent.pointerUp(readNameResizer, { pointerId: 5, clientX: 400 + minimumReadNameWidth - initialReadNameWidth });

    const readNameText = readTable.querySelector<HTMLElement>('tbody tr[data-row-id] td[data-column-id="name"] [data-widget-table-overflow-text]')!;
    await waitFor(() => expect(readNameText).toHaveAttribute('data-overflowing', 'true'));
    const readScrollRegion = readTable.closest<HTMLElement>('.cometal-table-scroll')!;
    const readNameCell = readNameText.closest<HTMLTableCellElement>('td')!;
    readScrollRegion.scrollTo({ left: readNameCell.offsetLeft, behavior: 'auto' });
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await waitFor(() => {
      const anchorRect = readNameText.getBoundingClientRect();
      const scrollRect = readScrollRegion.getBoundingClientRect();
      expect(anchorRect.left).toBeGreaterThanOrEqual(scrollRect.left);
      expect(anchorRect.right).toBeLessThanOrEqual(scrollRect.right);
    });
    await userEvent.hover(readNameText);
    const nameTooltip = await within(document.body).findByRole('tooltip');
    await expect(nameTooltip).toHaveTextContent('Лист горячекатаный г/к 10×1500×6000 мм ГОСТ 19903-2015');
    await expect(nameTooltip.parentElement).toBe(document.body);
    const nameTooltipContent = nameTooltip.querySelector<HTMLElement>('.cometal-tooltip__content')!;
    await expect(getComputedStyle(nameTooltipContent).textOverflow).toBe('clip');
    await expect(getComputedStyle(nameTooltipContent).whiteSpace).toBe('normal');
    await expect(nameTooltipContent.scrollWidth).toBeLessThanOrEqual(nameTooltipContent.clientWidth);
    const readNameRect = readNameText.getBoundingClientRect();
    await waitFor(() => {
      const nameTooltipRect = nameTooltip.getBoundingClientRect();
      expect(Math.abs(nameTooltipRect.left - readNameRect.left)).toBeLessThan(1);
      expect(nameTooltipRect.bottom).toBeLessThanOrEqual(readNameRect.top - 9);
    });
    await userEvent.unhover(readNameText);
    await waitFor(() => expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument());

    fireEvent.pointerDown(readNameResizer, { pointerId: 5, button: 0, clientX: 400 });
    fireEvent.pointerMove(readNameResizer, { pointerId: 5, clientX: 1200 });
    fireEvent.pointerUp(readNameResizer, { pointerId: 5, clientX: 1200 });
    await waitFor(() => expect(readNameText).not.toHaveAttribute('data-overflowing'));
    await userEvent.hover(readNameText);
    await expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.unhover(readNameText);
    const expandedReadNameWidth = readNameHeader.getBoundingClientRect().width;
    fireEvent.pointerDown(readNameResizer, { pointerId: 6, button: 0, clientX: 400 });
    fireEvent.pointerMove(readNameResizer, { pointerId: 6, clientX: 400 + minimumReadNameWidth - expandedReadNameWidth });
    fireEvent.pointerUp(readNameResizer, { pointerId: 6, clientX: 400 + minimumReadNameWidth - expandedReadNameWidth });
    await userEvent.click(within(readTable).getByRole('button', { name: 'Действия колонки Наименование' }));
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Закрепить слева' }));
    readScrollRegion.scrollLeft = 800;
    fireEvent.scroll(readScrollRegion);
    await waitFor(() => expect(Math.round(readNameHeader.getBoundingClientRect().left)).toBe(Math.round(readScrollRegion.getBoundingClientRect().left)));
    const pinnedReadNameCell = readTable.querySelector<HTMLTableCellElement>('tbody tr[data-row-id] td[data-column-id="name"]')!;
    const pinnedReadNameCellRect = pinnedReadNameCell.getBoundingClientRect();
    const pinnedReadHitTarget = document.elementFromPoint(pinnedReadNameCellRect.left + 16, pinnedReadNameCellRect.top + pinnedReadNameCellRect.height / 2);
    await expect(pinnedReadHitTarget?.closest('td')?.dataset.columnId).toBe('name');
    await expect(getComputedStyle(pinnedReadNameCell).isolation).toBe('isolate');
    await expect(getComputedStyle(pinnedReadNameCell).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

    const editRow = editTable.querySelector<HTMLTableRowElement>('tbody tr[data-row-id]')!;
    const editCells = Array.from(editRow.querySelectorAll<HTMLElement>('td[data-state="default"]'));
    await expect(editTable.querySelector('[data-kind="drag"]')).not.toBeNull();
    await expect(editTable.querySelector('.cometal-table__drag-cell')).not.toBeNull();
    await expect(editTable).toHaveAttribute('data-reorderable', 'true');
    await expect(editCells.filter((cell) => cell.dataset.editable === 'true').length).toBeGreaterThan(1);

    const editTableCanvas = within(editTable);
    await userEvent.click(editTableCanvas.getByRole('button', { name: 'Действия колонки Наименование' }));
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Закрепить слева' }));
    await userEvent.click(editTableCanvas.getByRole('button', { name: 'Действия колонки Позиция' }));
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Закрепить слева' }));

    const pinnedHeaders = () => Array.from(editTable.querySelectorAll<HTMLTableCellElement>('thead tr:first-child > th[data-column-pinned]'));
    await waitFor(() => expect(pinnedHeaders().map((cell) => cell.dataset.columnId)).toEqual(['position', 'name']));
    const positionHeader = editTable.querySelector<HTMLTableCellElement>('thead th[data-column-id="position"]')!;
    const nameHeader = editTable.querySelector<HTMLTableCellElement>('thead th[data-column-id="name"]')!;
    const gradeHeader = editTable.querySelector<HTMLTableCellElement>('thead th[data-column-id="grade"]')!;
    const positionResizer = editTableCanvas.getByRole('separator', { name: 'Изменить ширину колонки Позиция' });
    const initialPositionWidth = positionHeader.getBoundingClientRect().width;
    fireEvent.pointerDown(positionResizer, { pointerId: 7, button: 0, clientX: 400 });
    fireEvent.pointerMove(positionResizer, { pointerId: 7, clientX: 464 });
    fireEvent.pointerUp(positionResizer, { pointerId: 7, clientX: 464 });
    const pointerWidth = Math.round(initialPositionWidth + 64);
    await waitFor(() => expect(positionHeader).toHaveAttribute('data-column-width', String(pointerWidth)));
    await expect(editTable.querySelectorAll(`[data-column-id="position"][data-column-width="${pointerWidth}"]`)).toHaveLength(13);
    positionResizer.focus();
    await userEvent.keyboard('{ArrowRight}');
    const keyboardWidth = pointerWidth + 8;
    await waitFor(() => expect(positionHeader).toHaveAttribute('data-column-width', String(keyboardWidth)));
    await expect(positionResizer).toHaveAttribute('aria-valuenow', String(keyboardWidth));
    await expect(positionHeader.style.getPropertyValue('--cometal-table-pinned-left')).toBe('0px');
    await waitFor(() => expect(parseFloat(nameHeader.style.getPropertyValue('--cometal-table-pinned-left'))).toBeCloseTo(keyboardWidth, 3));
    await expect(nameHeader).toHaveAttribute('data-column-pinned-last', 'true');
    await expect(editTable.querySelectorAll('[data-column-id="position"][data-column-pinned]')).toHaveLength(13);
    await expect(editTable.querySelectorAll('[data-column-id="name"][data-column-pinned]')).toHaveLength(13);

    const scrollRegion = editTable.closest<HTMLElement>('.cometal-table-scroll')!;
    const gradeBeforeScroll = gradeHeader.getBoundingClientRect().left;
    scrollRegion.scrollLeft = 800;
    fireEvent.scroll(scrollRegion);
    await waitFor(() => expect(Math.round(positionHeader.getBoundingClientRect().left)).toBe(Math.round(scrollRegion.getBoundingClientRect().left)));
    await expect(Math.round(nameHeader.getBoundingClientRect().left)).toBe(Math.round(positionHeader.getBoundingClientRect().right));
    await expect(gradeHeader.getBoundingClientRect().left).toBeLessThan(gradeBeforeScroll);
    const pinnedNameCell = editTable.querySelector<HTMLTableCellElement>('tbody tr[data-row-id] td[data-column-id="name"]')!;
    if (pinnedNameCell.getBoundingClientRect().left + 16 >= scrollRegion.getBoundingClientRect().right) {
      const minimumPositionWidth = Number(positionResizer.getAttribute('aria-valuemin'));
      positionResizer.focus();
      await userEvent.keyboard('{Home}');
      await waitFor(() => expect(positionHeader).toHaveAttribute('data-column-width', String(minimumPositionWidth)));
      await waitFor(() => expect(pinnedNameCell.getBoundingClientRect().left + 16).toBeLessThan(scrollRegion.getBoundingClientRect().right));
    }
    const pinnedNameCellBeforeScroll = pinnedNameCell.getBoundingClientRect();
    window.scrollTo({
      top: window.scrollY + pinnedNameCellBeforeScroll.top - (window.innerHeight - pinnedNameCellBeforeScroll.height) / 2,
      behavior: 'auto',
    });
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    await waitFor(() => {
      const cellRect = pinnedNameCell.getBoundingClientRect();
      expect(cellRect.top).toBeGreaterThanOrEqual(0);
      expect(cellRect.bottom).toBeLessThanOrEqual(window.innerHeight);
    });
    const pinnedNameCellRect = pinnedNameCell.getBoundingClientRect();
    const pinnedNameHitTarget = document.elementFromPoint(pinnedNameCellRect.left + 16, pinnedNameCellRect.top + pinnedNameCellRect.height / 2);
    await expect(pinnedNameHitTarget?.closest('td')?.dataset.columnId).toBe('name');
    await expect(getComputedStyle(pinnedNameCell).isolation).toBe('isolate');
    await expect(getComputedStyle(pinnedNameCell).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

    await userEvent.click(editTableCanvas.getByRole('button', { name: 'Действия колонки Позиция' }));
    await userEvent.click(within(document.body).getByRole('menuitemcheckbox', { name: 'Открепить слева' }));
    await waitFor(() => expect(positionHeader).not.toHaveAttribute('data-column-pinned'));
    await expect(nameHeader.style.getPropertyValue('--cometal-table-pinned-left')).toBe('0px');
    await expect(nameHeader).toHaveAttribute('data-column-pinned-last', 'true');

    const editableCell = editRow.querySelector<HTMLElement>('td[data-column-id="name"][data-editable="true"]')!;
    const committedDraft = 'Наименование после ввода';
    const rolledBackDraft = 'Это значение нужно отменить';
    await userEvent.click(editableCell);
    await expect(editableCell).toHaveAttribute('data-state', 'editing');
    await expect(editableCell).toHaveAttribute('contenteditable', 'true');
    await expect(editableCell).toHaveAttribute('role', 'textbox');
    await expect(editableCell.querySelector('input')).toBeNull();
    await expect(editableCell).toHaveFocus();
    await userEvent.clear(editableCell);
    await userEvent.type(editableCell, committedDraft);
    await expect(editableCell).toHaveTextContent(committedDraft);
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(editableCell).toHaveAttribute('data-state', 'default'));
    await expect(editableCell).toHaveTextContent(committedDraft);

    await userEvent.click(editableCell);
    await expect(editableCell).toHaveAttribute('data-state', 'editing');
    await expect(editableCell).toHaveFocus();
    await userEvent.clear(editableCell);
    await userEvent.type(editableCell, rolledBackDraft);
    await expect(editableCell).toHaveTextContent(rolledBackDraft);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(editableCell).toHaveAttribute('data-state', 'default'));
    await expect(editableCell).toHaveTextContent(committedDraft);

    const invalidQuantityCell = editTable.querySelector<HTMLElement>('tbody tr[data-row-id] td[data-column-id="quantity"]')!;
    const committedQuantity = invalidQuantityCell.textContent?.trim() ?? '';
    const invalidQuantityDraft = 'не число';
    await userEvent.click(invalidQuantityCell);
    await expect(invalidQuantityCell).toHaveAttribute('data-state', 'editing');
    await expect(invalidQuantityCell).toHaveFocus();
    await userEvent.clear(invalidQuantityCell);
    await userEvent.type(invalidQuantityCell, invalidQuantityDraft);
    await expect(invalidQuantityCell).toHaveTextContent(invalidQuantityDraft);
    await userEvent.tab();
    await waitFor(() => expect(invalidQuantityCell).toHaveAttribute('data-state', 'error'));
    await expect(invalidQuantityCell).toHaveAttribute('aria-invalid', 'true');
    await expect(invalidQuantityCell).toHaveTextContent(invalidQuantityDraft);

    await userEvent.click(invalidQuantityCell);
    await expect(invalidQuantityCell).toHaveAttribute('data-state', 'editing');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(invalidQuantityCell).toHaveAttribute('data-state', 'default'));
    await expect(invalidQuantityCell).not.toHaveAttribute('aria-invalid');
    await expect(invalidQuantityCell).toHaveTextContent(committedQuantity);

    const readNameWidthBeforeDensity = readNameHeader.getBoundingClientRect().width;
    const densityToggle = within(readToolbar!).getByRole('button', { name: 'Включить компактную плотность' });
    await expect(densityToggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(densityToggle);
    await expect(readTable).toHaveAttribute('data-density', 'compact');
    await expectM1Floors(readTable, 40);
    await expect(readNameHeader).toHaveAttribute('data-column-pinned-last', 'true');
    await expect(readNameHeader.getBoundingClientRect().width).toBe(readNameWidthBeforeDensity);
    const comfortableToggle = within(readToolbar!).getByRole('button', { name: 'Включить комфортную плотность' });
    await expect(comfortableToggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(comfortableToggle);
    await expect(readTable).toHaveAttribute('data-density', 'comfortable');
    await expectM1Floors(readTable, 48);
    await expect(readNameHeader).toHaveAttribute('data-column-pinned-last', 'true');
    await expect(readNameHeader.getBoundingClientRect().width).toBe(readNameWidthBeforeDensity);
    await userEvent.click(within(readToolbar!).getByRole('button', { name: 'Скрыть фильтры' }));
    await expect(within(readTable).queryByRole('row', { name: /Фильтры таблицы/ })).not.toBeInTheDocument();
    await userEvent.click(within(readToolbar!).getByRole('button', { name: 'Показать фильтры' }));
    const summaryToggle = within(readToolbar!).getByRole('button', { name: 'Скрыть итоги' });
    await expect(summaryToggle).toHaveAttribute('aria-pressed', 'true');
    const summaryLabel = within(readTable).getByText('Итоги текущей страницы');
    await expect(summaryLabel).toBeVisible();
    const summaryCell = summaryLabel.closest<HTMLElement>('.cometal-table__summary-cell')!;
    await expect(getComputedStyle(summaryCell).position).toBe('sticky');
    await expect(getComputedStyle(summaryCell).bottom).toBe('0px');
    await userEvent.click(summaryToggle);
    await expect(within(readTable).queryByText('Итоги текущей страницы')).not.toBeInTheDocument();
    await expect(within(readTable).getAllByRole('row')).toHaveLength(12);
    const showSummary = within(readToolbar!).getByRole('button', { name: 'Показать итоги' });
    await expect(showSummary).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(showSummary);
    await expect(within(readTable).getByText('Итоги текущей страницы')).toBeVisible();

    const persistedNameWidth = readNameHeader.getBoundingClientRect().width;
    await userEvent.click(within(readTable).getByRole('button', { name: 'Действия колонки Наименование' }));
    await userEvent.click(within(document.body).getByRole('menuitem', { name: 'Скрыть колонку' }));
    await expect(readTable.querySelectorAll('[data-column-id="name"]')).toHaveLength(0);
    await userEvent.click(within(readToolbar!).getByRole('button', { name: 'Обновить' }));
    const restoredNameHeader = await within(readTable).findByRole('columnheader', { name: /Наименование/ });
    await expect(restoredNameHeader.getBoundingClientRect().width).toBe(persistedNameWidth);
    await expect(restoredNameHeader).toHaveAttribute('data-column-pinned-last', 'true');

    const readWidget = readTable.closest<HTMLElement>('.cometal-widget-table-pattern')!;
    readScrollRegion.scrollLeft = 0;
    fireEvent.scroll(readScrollRegion);
    const pageSelection = within(readTable).getByRole('checkbox', { name: 'Выбрать все строки' });
    const pageSelectionControl = pageSelection.closest<HTMLLabelElement>('label')!;
    await userEvent.click(pageSelectionControl);
    await expect(pageSelection).toBeChecked();
    await userEvent.click(within(readWidget).getByRole('button', { name: 'Следующая страница' }));
    await expect(pageSelection).not.toBeChecked();
    await userEvent.click(pageSelectionControl);
    await expect(pageSelection).toBeChecked();
    await userEvent.click(within(readWidget).getByRole('button', { name: 'Предыдущая страница' }));
    await userEvent.click(pageSelectionControl);
    await expect(pageSelection).not.toBeChecked();
    await userEvent.click(within(readWidget).getByRole('button', { name: 'Следующая страница' }));
    await expect(pageSelection).toBeChecked();

    const pageSizeTrigger = within(readWidget).getByRole('combobox', { name: 'Строк на странице' });
    await userEvent.click(pageSizeTrigger);
    await userEvent.click(within(document.body).getByRole('option', { name: '30' }));
    const readRowWindow = readTable.closest<HTMLElement>('.cometal-table-scroll')!;
    await expect(readRowWindow).toHaveAttribute('data-row-window', '10');
    await waitFor(() => expect(readRowWindow.scrollHeight).toBeGreaterThan(readRowWindow.clientHeight));
    await expect(getComputedStyle(readTable.querySelector<HTMLElement>('thead th')!).position).toBe('sticky');
    await expect(getComputedStyle(within(readTable).getByText('Итоги текущей страницы').closest<HTMLElement>('.cometal-table__summary-cell')!).position).toBe('sticky');
  },
};

export const SortingContract: Story = {
  name: 'M2/Сортировка заголовков',
  render: () => <main className="ds-story-canvas ds-widget-table-pattern-story"><WidgetTableReviewExample mode="read" /><WidgetTableReviewExample mode="edit" /></main>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readTable = canvas.getByRole('table', { name: 'Спецификация позиций · Read' });
    const editTable = canvas.getByRole('table', { name: 'Спецификация позиций · Edit' });
    await expect(readTable.querySelectorAll('thead .cometal-table__sort-button')).toHaveLength(12);
    await expect(editTable.querySelectorAll('thead .cometal-table__sort-button')).toHaveLength(12);

    for (const contract of sortableColumnContracts) {
      const header = readTable.querySelector<HTMLTableCellElement>(`thead th[data-column-id="${contract.id}"]`)!;
      const headerCanvas = within(header);
      const sortButton = headerCanvas.getByRole('button', { name: `Сортировать ${contract.label}: по возрастанию` });
      await expect(header).not.toHaveAttribute('aria-sort');
      await expect(readTable.querySelectorAll('thead th[aria-sort]')).toHaveLength(0);

      fireEvent.click(sortButton);
      await expect(header).toHaveAttribute('aria-sort', 'ascending');
      await expect(readTable.querySelectorAll('thead th[aria-sort]')).toHaveLength(1);
      await expect(sortButton).toHaveAccessibleName(`Сортировать ${contract.label}: по убыванию`);
      await expect(visibleRowIds(readTable)).toEqual(contract.ascending);

      sortButton.focus();
      await userEvent.keyboard('{Enter}');
      await expect(header).toHaveAttribute('aria-sort', 'descending');
      await expect(sortButton).toHaveAccessibleName(`Сортировать ${contract.label}: отключить сортировку`);
      await expect(visibleRowIds(readTable)).toEqual(contract.descending);

      sortButton.focus();
      await userEvent.keyboard(' ');
      await expect(header).not.toHaveAttribute('aria-sort');
      await expect(readTable.querySelectorAll('thead th[aria-sort]')).toHaveLength(0);
      await expect(sortButton).toHaveAccessibleName(`Сортировать ${contract.label}: по возрастанию`);
      await expect(visibleRowIds(readTable)).toEqual(initialVisibleRowIds);
    }

    const fileHeader = readTable.querySelector<HTMLTableCellElement>('thead th[data-column-id="file"]')!;
    await expect(fileHeader).not.toHaveAttribute('aria-sort');
    await expect(fileHeader.querySelector('.cometal-table__sort-button')).toBeNull();
    await expect(within(fileHeader).getByRole('button', { name: 'Действия колонки Файл' })).toBeVisible();
    await expect(within(readTable).getByRole('separator', { name: 'Изменить ширину колонки Файл' })).toBeVisible();
    await expect(within(readTable).getByRole('textbox', { name: 'Фильтр по файлу' })).toBeVisible();
    await expect(readTable.querySelector('tbody td[data-column-id="file"] .cometal-table__file-name')).toHaveTextContent('Спецификация.pdf');

    const editTableCanvas = within(editTable);
    const firstDragHandle = editTableCanvas.getByRole('button', { name: 'Переместить строку POS-001' });
    firstDragHandle.focus();
    await userEvent.keyboard('{Space}{ArrowDown}{Space}');
    const consumerOrder = ['POS-002', 'POS-001', 'POS-003', 'POS-004', 'POS-005', 'POS-006', 'POS-007', 'POS-008', 'POS-009', 'POS-010'];
    await expect(visibleRowIds(editTable)).toEqual(consumerOrder);
    const editPositionHeader = editTable.querySelector<HTMLTableCellElement>('thead th[data-column-id="position"]')!;
    const editPositionSort = within(editPositionHeader).getByRole('button', { name: 'Сортировать Позиция: по возрастанию' });
    fireEvent.click(editPositionSort);
    await expect(visibleRowIds(editTable)).toEqual(initialVisibleRowIds);
    editPositionSort.focus();
    await userEvent.keyboard('{Enter}');
    await expect(visibleRowIds(editTable)).toEqual(sortableColumnContracts[0].descending);
    editPositionSort.focus();
    await userEvent.keyboard(' ');
    await expect(editPositionHeader).not.toHaveAttribute('aria-sort');
    await expect(visibleRowIds(editTable)).toEqual(consumerOrder);
  },
};

export const FilteringContract: Story = {
  name: 'M3/Фильтры и overlay',
  render: () => <main className="ds-story-canvas ds-widget-table-pattern-story"><WidgetTableReviewExample mode="read" /><WidgetTableReviewExample mode="edit" /></main>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const readTable = canvas.getByRole('table', { name: 'Спецификация позиций · Read' });
    const editTable = canvas.getByRole('table', { name: 'Спецификация позиций · Edit' });
    const read = within(readTable);
    const edit = within(editTable);
    const readWidget = readTable.closest<HTMLElement>('.cometal-widget-table-pattern')!;
    const editWidget = editTable.closest<HTMLElement>('.cometal-widget-table-pattern')!;
    const readToolbar = within(readWidget).getByRole('toolbar', { name: 'Действия виджета' });
    const editToolbar = within(editWidget).getByRole('toolbar', { name: 'Действия виджета' });
    const filterLabels = [
      'Фильтр по позиции', 'Фильтр по наименованию', 'Фильтр по марке', 'Фильтр по количеству',
      'Фильтр по единице', 'Фильтр по цене', 'Фильтр по сумме', 'Фильтр по дате',
      'Фильтр по документу', 'Фильтр по файлу', 'Фильтр по статусу', 'Фильтр по контролю',
      'Фильтр по поставщику',
    ];
    for (const table of [readTable, editTable]) {
      const tableCanvas = within(table);
      for (const label of filterLabels) await expect(tableCanvas.getByRole(/единице|статусу|контролю|поставщику/.test(label) ? 'combobox' : 'textbox', { name: label })).toBeVisible();
    }

    const expectDateInsets = async (table: HTMLElement) => {
      const input = within(table).getByRole('textbox', { name: 'Фильтр по дате' });
      const control = input.closest<HTMLElement>('.cometal-date-picker__control')!;
      const controlStyle = getComputedStyle(control);
      await expect([controlStyle.paddingLeft, controlStyle.paddingRight]).toEqual(['8px', '8px']);
    };
    await expectDateInsets(readTable);
    await userEvent.click(within(readToolbar).getByRole('button', { name: 'Включить компактную плотность' }));
    await expect(readTable).toHaveAttribute('data-density', 'compact');
    await expectDateInsets(readTable);
    await userEvent.click(within(readToolbar).getByRole('button', { name: 'Включить комфортную плотность' }));
    await expect(readTable).toHaveAttribute('data-density', 'comfortable');
    await expectDateInsets(readTable);

    const resetColumn = async (label: string) => {
      await userEvent.click(read.getByRole('button', { name: `Действия колонки ${label}` }));
      await userEvent.click(body.getByRole('menuitem', { name: 'Фильтр' }));
      await userEvent.click(body.getByRole('menuitem', { name: 'Сбросить фильтр' }));
      await waitFor(() => expect(visibleRowIds(readTable)).toEqual(initialVisibleRowIds));
    };
    const filterText = async (label: string, query: string, expectedFirst: string | null) => {
      const input = read.getByRole('textbox', { name: label });
      await userEvent.clear(input);
      await userEvent.type(input, query);
      await waitFor(() => expectedFirst === null
        ? expect(visibleRowIds(readTable)).toHaveLength(0)
        : expect(visibleRowIds(readTable)[0]).toBe(expectedFirst));
      await userEvent.clear(input);
      await waitFor(() => expect(visibleRowIds(readTable)).toEqual(initialVisibleRowIds));
    };
    const filterSelect = async (label: string, option: string, expectedFirst: string, actionLabel: string) => {
      const trigger = read.getByRole('combobox', { name: label });
      await userEvent.click(trigger);
      const listbox = await body.findByRole('listbox');
      await expect(listbox.parentElement).toBe(canvasElement.ownerDocument.body);
      await expect(getComputedStyle(listbox).position).toBe('fixed');
      await userEvent.click(within(listbox).getByRole('option', { name: option }));
      await waitFor(() => expect(visibleRowIds(readTable)[0]).toBe(expectedFirst));
      await resetColumn(actionLabel);
    };

    await filterText('Фильтр по позиции', 'POS-002', 'POS-002');
    await filterText('Фильтр по наименованию', 'Труба профильная', 'POS-002');
    await filterText('Фильтр по марке', '10ХСНД', 'POS-003');
    await filterText('Фильтр по количеству', '18', 'POS-002');
    await filterSelect('Фильтр по единице', 'шт', 'POS-004', 'Единица');
    await filterText('Фильтр по цене', '94800', 'POS-002');
    await filterText('Фильтр по сумме', '1706400', 'POS-002');
    const delivery = read.getByRole('textbox', { name: 'Фильтр по дате' });
    await userEvent.clear(delivery);
    await userEvent.type(delivery, '24.08.2026');
    await userEvent.tab();
    await waitFor(() => expect(visibleRowIds(readTable)[0]).toBe('POS-002'));
    await resetColumn('Дата поставки');
    await filterText('Фильтр по документу', '234-501', 'POS-002');
    await filterText('Фильтр по файлу', 'нет-файла', null);
    await filterSelect('Фильтр по статусу', 'На проверке', 'POS-002', 'Статус');
    await filterSelect('Фильтр по контролю', 'Качество', 'POS-002', 'Контроль');
    await filterSelect('Фильтр по поставщику', 'ЕВРАЗ Маркет', 'POS-002', 'Поставщик');

    const editPosition = edit.getByRole('textbox', { name: 'Фильтр по позиции' });
    await userEvent.type(editPosition, 'POS-003');
    await waitFor(() => expect(visibleRowIds(editTable)).toEqual(['POS-003']));
    await userEvent.click(within(editToolbar).getByRole('button', { name: 'Скрыть фильтры' }));
    await expect(edit.queryByRole('row', { name: /Фильтры таблицы/ })).not.toBeInTheDocument();
    await expect(visibleRowIds(editTable)).toEqual(['POS-003']);
    await userEvent.click(within(editToolbar).getByRole('button', { name: 'Показать фильтры' }));
    await expect(edit.getByRole('textbox', { name: 'Фильтр по позиции' })).toHaveValue('POS-003');
    await userEvent.clear(edit.getByRole('textbox', { name: 'Фильтр по позиции' }));
    await waitFor(() => expect(visibleRowIds(editTable)).toEqual(initialVisibleRowIds));

    await userEvent.click(read.getByRole('button', { name: 'Действия колонки Позиция' }));
    await userEvent.click(body.getByRole('menuitem', { name: 'Фильтр' }));
    await userEvent.click(body.getByRole('menuitem', { name: 'Не содержит' }));
    const position = read.getByRole('textbox', { name: 'Фильтр по позиции' });
    await userEvent.type(position, 'POS-001');
    await waitFor(() => expect(visibleRowIds(readTable)[0]).toBe('POS-002'));
    await expect(visibleRowIds(readTable)).not.toContain('POS-001');
    await resetColumn('Позиция');

    const paginator = canvas.getByRole('navigation', { name: 'Пагинация таблицы · Read' });
    await userEvent.click(within(paginator).getByRole('button', { name: 'Следующая страница' }));
    await expect(within(paginator).getByRole('button', { name: 'Страница 2' })).toHaveAttribute('aria-current', 'page');
    const quantityHeader = readTable.querySelector<HTMLTableCellElement>('thead th[data-column-id="quantity"]')!;
    await userEvent.click(within(quantityHeader).getByRole('button', { name: 'Сортировать Количество: по возрастанию' }));
    await userEvent.type(position, 'POS-02');
    await expect(within(paginator).getByRole('button', { name: 'Страница 1' })).toHaveAttribute('aria-current', 'page');
    await expect(quantityHeader).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(within(readToolbar).getByRole('button', { name: 'Скрыть фильтры' }));
    await expect(read.queryByRole('row', { name: /Фильтры таблицы/ })).not.toBeInTheDocument();
    await expect(visibleRowIds(readTable).every((rowId) => rowId?.startsWith('POS-02'))).toBe(true);
    await userEvent.click(within(readToolbar).getByRole('button', { name: 'Показать фильтры' }));
    await expect(read.getByRole('textbox', { name: 'Фильтр по позиции' })).toHaveValue('POS-02');
    await userEvent.clear(read.getByRole('textbox', { name: 'Фильтр по позиции' }));
    await waitFor(() => expect(visibleRowIds(readTable)).toEqual(sortableColumnContracts[3].ascending));

    await userEvent.click(read.getByRole('button', { name: 'Действия колонки Дата поставки' }));
    await userEvent.click(body.getByRole('menuitem', { name: 'Фильтр' }));
    await userEvent.click(body.getByRole('menuitem', { name: 'Период' }));
    const period = read.getByRole('textbox', { name: 'Фильтр по дате' });
    await expect(period.closest<HTMLElement>('.cometal-field')).toHaveAttribute('data-size', 's');
    await expectDateInsets(readTable);
    await userEvent.click(within(readToolbar).getByRole('button', { name: 'Включить компактную плотность' }));
    await expectDateInsets(readTable);
    await userEvent.click(within(readToolbar).getByRole('button', { name: 'Включить комфортную плотность' }));
    await userEvent.clear(period);
    await userEvent.type(period, '21.08.2026 — 24.08.2026');
    await userEvent.tab();
    await waitFor(() => {
      const ids = visibleRowIds(readTable);
      expect(ids).toContain('POS-001');
      expect(ids).toContain('POS-002');
      expect(ids).not.toContain('POS-003');
    });
    await expect(quantityHeader).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(read.getByRole('button', { name: 'Действия колонки Дата поставки' }));
    await userEvent.click(body.getByRole('menuitem', { name: 'Фильтр' }));
    await userEvent.click(body.getByRole('menuitem', { name: 'Сбросить фильтр' }));
    const resetDate = read.getByRole('textbox', { name: 'Фильтр по дате' });
    await expect(resetDate).toHaveValue('');
    await expect(resetDate).toHaveAttribute('placeholder', 'Дата равна');
    await expect(quantityHeader).toHaveAttribute('aria-sort', 'ascending');
    await waitFor(() => expect(visibleRowIds(readTable)).toEqual(sortableColumnContracts[3].ascending));
    await userEvent.click(read.getByRole('button', { name: 'Действия колонки Дата поставки' }));
    await userEvent.click(body.getByRole('menuitem', { name: 'Фильтр' }));
    await expect(body.getByRole('menuitemcheckbox', { name: 'Дата равна' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');

    await userEvent.click(read.getByRole('button', { name: 'Действия колонки Дата поставки' }));
    const menu = body.getByRole('menu');
    const beforeHeight = menu.getBoundingClientRect().height;
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Фильтр' }));
    await waitFor(() => expect(body.getByRole('menu').getBoundingClientRect().height).not.toBe(beforeHeight));
    await expect(body.getByRole('menuitem', { name: 'Фильтр' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(body.getByRole('menuitem', { name: 'Фильтр' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
  },
};

export const Compact: Story = {
  render: () => <main className="ds-story-canvas ds-widget-table-pattern-story"><WidgetTableReviewExample mode="read" initialDensity="compact" /></main>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table', { name: 'Спецификация позиций · Read' })).toHaveAttribute('data-density', 'compact');
    await expect(canvas.getByRole('button', { name: 'Включить комфортную плотность' })).toHaveAttribute('aria-pressed', 'true');
  },
};
