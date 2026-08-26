import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { WidgetTablePattern, WidgetTableReviewExample } from '@cometal/react';
import { definition as refreshIconDefinition } from '@cometal/react/icons/outline/arrows/arrow-refresh-01';
import { definition as downloadIconDefinition } from '@cometal/react/icons/outline/general/download-01';
import { definition as filterIconDefinition } from '@cometal/react/icons/outline/general/filter';
import { definition as plusIconDefinition } from '@cometal/react/icons/outline/general/plus-01';
import { definition as flexRowsIconDefinition } from '@cometal/react/icons/outline/layout/flex-rows';
import { definition as calculatorIconDefinition } from '@cometal/react/icons/outline/charts/calculator-02';

const patternToolbarIcons = [flexRowsIconDefinition, filterIconDefinition, calculatorIconDefinition, refreshIconDefinition, downloadIconDefinition, plusIconDefinition];

function definitionPathData(body: string) {
  return Array.from(body.matchAll(/<path d="([^"]+)"/g), (match) => match[1]);
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
    await expect(footers).toHaveLength(2);
    for (const [index, tableWrapper] of tableWrappers.entries()) {
      const wrapperStyle = getComputedStyle(tableWrapper);
      await expect(wrapperStyle.borderTopWidth).toBe('1px');
      await expect(wrapperStyle.borderTopStyle).toBe('solid');
      await expect(wrapperStyle.borderTopColor).toBe(probeStyle.color);
      await expect(wrapperStyle.borderRadius).toBe('8px');
      await expect(wrapperStyle.backgroundColor).toBe(probeStyle.backgroundColor);
      await expect(wrapperStyle.overflow).toBe('hidden');
      await expect(tableWrapper.contains(footers[index]!)).toBe(false);
    }
    borderProbe.remove();
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

    const readNameText = readTable.querySelector<HTMLElement>('tbody tr[data-row-id] td[data-column-id="name"] .cometal-widget-table-pattern__overflow-text')!;
    await waitFor(() => expect(readNameText).toHaveAttribute('data-overflowing', 'true'));
    await userEvent.hover(readNameText);
    const nameTooltip = await within(document.body).findByRole('tooltip');
    await expect(nameTooltip).toHaveTextContent('Лист горячекатаный г/к 10×1500×6000 мм ГОСТ 19903-2015');
    await userEvent.unhover(readNameText);
    await waitFor(() => expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument());

    fireEvent.pointerDown(readNameResizer, { pointerId: 5, button: 0, clientX: 400 });
    fireEvent.pointerMove(readNameResizer, { pointerId: 5, clientX: 1200 });
    fireEvent.pointerUp(readNameResizer, { pointerId: 5, clientX: 1200 });
    await waitFor(() => expect(readNameText).not.toHaveAttribute('data-overflowing'));
    await userEvent.hover(readNameText);
    await expect(within(document.body).queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.unhover(readNameText);

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

    await userEvent.click(editTableCanvas.getByRole('button', { name: 'Действия колонки Позиция' }));
    await userEvent.click(within(document.body).getByRole('menuitemcheckbox', { name: 'Открепить слева' }));
    await waitFor(() => expect(positionHeader).not.toHaveAttribute('data-column-pinned'));
    await expect(nameHeader.style.getPropertyValue('--cometal-table-pinned-left')).toBe('0px');
    await expect(nameHeader).toHaveAttribute('data-column-pinned-last', 'true');

    const editableCell = editRow.querySelector<HTMLElement>('td[data-editable="true"]')!;
    await userEvent.click(editableCell);
    await expect(editableCell).toHaveAttribute('data-state', 'editing');
    await expect(editableCell).toHaveAttribute('contenteditable', 'true');
    await expect(editableCell).toHaveAttribute('role', 'textbox');
    await expect(editableCell.querySelector('input')).toBeNull();

    const densityToggle = within(readToolbar!).getByRole('button', { name: 'Включить компактную плотность' });
    await expect(densityToggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(densityToggle);
    await expect(readTable).toHaveAttribute('data-density', 'compact');
    const comfortableToggle = within(readToolbar!).getByRole('button', { name: 'Включить комфортную плотность' });
    await expect(comfortableToggle).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(comfortableToggle);
    await expect(readTable).toHaveAttribute('data-density', 'comfortable');
    await userEvent.click(within(readToolbar!).getByRole('button', { name: 'Скрыть фильтры' }));
    await expect(within(readTable).queryByRole('row', { name: /Фильтры таблицы/ })).not.toBeInTheDocument();
    await userEvent.click(within(readToolbar!).getByRole('button', { name: 'Показать фильтры' }));
    const summaryToggle = within(readToolbar!).getByRole('button', { name: 'Скрыть итоги' });
    await expect(summaryToggle).toHaveAttribute('aria-pressed', 'true');
    await expect(within(readTable).getByText('Итого')).toBeVisible();
    await userEvent.click(summaryToggle);
    await expect(within(readTable).queryByText('Итого')).not.toBeInTheDocument();
    await expect(within(readTable).getAllByRole('row')).toHaveLength(12);
    const showSummary = within(readToolbar!).getByRole('button', { name: 'Показать итоги' });
    await expect(showSummary).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(showSummary);
    await expect(within(readTable).getByText('Итого')).toBeVisible();
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
