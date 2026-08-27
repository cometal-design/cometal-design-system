import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker, DateRangePicker } from '@cometal/react';
import { ComponentCodeExample } from './ComponentCodeExample';

const figmaUrl = 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1764-10502';
const sourceUrl = 'https://github.com/cometal-design/cometal-design-system/blob/main/packages/react/src/DatePicker/DatePicker.tsx';

function SectionIntro({ number, title, children }: { number: string; title: string; children: string }) {
  return <div className="ds-component-section__intro"><span>{number}</span><div><h2>{title}</h2><p>{children}</p></div></div>;
}

function OverviewPage() {
  return (
    <main className="ds-component-page ds-date-picker-page">
      <header className="ds-component-hero">
        <div><span className="ds-eyebrow">COMPONENT · WEB · IN REVIEW</span><h1>Date Picker</h1><p>Семейство для одного значения и периода. Date Picker и Date Range Picker переиспользуют один календарный contract, но не размножают внутренние части в публичный API.</p></div>
        <a href={figmaUrl} target="_blank" rel="noreferrer">Открыть в Figma ↗</a>
      </header>

      <section className="ds-component-section">
        <SectionIntro number="01" title="Когда использовать">Одиночная дата решает точечное событие. Период используйте для диапазона, фильтра отчёта и выбора интервала без отдельного локального контракта.</SectionIntro>
        <div className="ds-guidance-grid"><article className="ok"><strong>Используйте</strong><ul><li>Для даты поставки, срока или события.</li><li>Для периода отчёта, действия договора и фильтров таблиц.</li><li>Когда известен единый формат ДД.ММ.ГГГГ.</li></ul></article><article className="stop"><strong>Не используйте</strong><ul><li>Для даты и времени — нужен отдельный составной паттерн.</li><li>Для свободного текстового описания периода.</li><li>Для бизнес-логики, которая должна жить в продукте, а не в календаре.</li></ul></article></div>
      </section>

      <section className="ds-component-section">
        <SectionIntro number="02" title="Публичная матрица">Figma фиксирует размеры L, M и S. Read не раскрывается, поэтому Read + Open отсутствует.</SectionIntro>
        <div className="ds-date-picker-variants">
          <article><code>Edit · L · Closed</code><DatePicker label="Дата поставки" helperText="Выберите дату" size="l" value="2026-07-15" /></article>
          <article className="ds-date-picker-variants__open"><code>Edit · L · Open</code><DatePicker label="Дата поставки" helperText="Выберите дату" size="l" value="2026-07-15" today="2026-07-31" open /></article>
          <article><code>Read · L · Closed</code><DatePicker label="Дата поставки" size="l" value="2026-07-15" mode="read" /></article>
          <article><code>Edit · M · Closed</code><DatePicker label="Дата поставки" helperText="Выберите дату" size="m" value="2026-07-15" /></article>
          <article className="ds-date-picker-variants__open"><code>Edit · M · Open</code><DatePicker label="Дата поставки" helperText="Выберите дату" size="m" value="2026-07-15" today="2026-07-31" open /></article>
          <article><code>Read · M · Closed</code><DatePicker label="Дата поставки" size="m" value="2026-07-15" mode="read" /></article>
          <article><code>Edit · S · Closed</code><DatePicker label="Дата поставки" helperText="Выберите дату" size="s" value="2026-07-15" /></article>
          <article><code>Read · S · Closed</code><DatePicker label="Дата поставки" size="s" value="2026-07-15" mode="read" /></article>
        </div>
      </section>

      <section className="ds-component-section">
        <SectionIntro number="03" title="Состояния">Hover и focus возникают от реального взаимодействия. Error и disabled задаёт приложение; selected, today, outside и disabled принадлежат Calendar Day.</SectionIntro>
        <div className="ds-date-picker-states"><article><code>Default</code><DatePicker label="Дата поставки" helperText="Выберите дату" /></article><article><code>Filled</code><DatePicker label="Дата поставки" helperText="Выберите дату" value="2026-07-15" /></article><article><code>Error</code><DatePicker label="Дата поставки" value="2026-02-15" error="Дата должна быть не раньше 01.07.2026" /></article><article><code>Disabled</code><DatePicker label="Дата поставки" value="2026-07-15" disabled /></article></div>
      </section>

      <section className="ds-component-section">
        <SectionIntro number="04" title="Date Range">Period picker публикует тот же календарный язык, но хранит диапазон как объект start/end и использует canonical states range start, range middle и range end.</SectionIntro>
        <div className="ds-date-picker-variants">
          <article><code>Range · L · Closed</code><DateRangePicker label="Период поставки" helperText="Выберите период" defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }} /></article>
          <article className="ds-date-picker-variants__open"><code>Range · L · Open</code><DateRangePicker label="Период поставки" helperText="Выберите период" defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }} today={new Date(2026, 6, 31)} open /></article>
          <article><code>Range · M · Read</code><DateRangePicker label="Период поставки" size="m" defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }} mode="read" /></article>
        </div>
      </section>

      <section className="ds-component-section">
        <SectionIntro number="05" title="Внутренняя архитектура">Композиция публична целиком; внутренние части не экспортируются и не создают дополнительные продуктовые контракты.</SectionIntro>
        <div className="ds-rule-list"><article><code>Date Field Trigger</code><p>Label, форматированный input, helper/error и кнопка раскрытия. Повторно использует общий Field Chrome.</p></article><article><code>Calendar Panel</code><p>Абсолютный overlay шириной 364px, отступ 8px, заголовок месяца, навигация и Monday-first grid.</p></article><article><code>Calendar Day</code><p>44×44px; default, hover, selected, today, outside, disabled и независимый focus-visible.</p></article><article><code>Range semantics</code><p>Начало, середина и конец периода рендерятся отдельными canonical classes без выноса календарных частей в публичные props.</p></article></div>
      </section>

      <section className="ds-component-section">
        <SectionIntro number="06" title="Клавиатура и доступность">Input остаётся нативным. Календарь реализует grid navigation и возвращает фокус после выбора или закрытия.</SectionIntro>
        <div className="ds-rule-list"><article><code>Alt + ↓</code><p>Открывает календарь из поля.</p></article><article><code>← → ↑ ↓</code><p>Перемещает фокус на день или неделю.</p></article><article><code>Home / End</code><p>Переходит к началу или концу недели.</p></article><article><code>Page Up / Down</code><p>Меняет месяц; с Shift — год.</p></article><article><code>Enter / Space / Esc</code><p>Выбирает дату или закрывает календарь с восстановлением фокуса.</p></article></div>
      </section>

      <section className="ds-component-section">
        <SectionIntro number="07" title="React API">Single-date хранит ISO, а period picker — объект start/end. Визуальные настройки не выносятся в props.</SectionIntro>
        <div className="ds-api-table">{[
          ['label', 'string', 'required'], ['value / defaultValue', 'string | null (YYYY-MM-DD)', 'null'], ['onValueChange', '(value) => void', '—'], ['size', "'l' | 'm' | 's'", "'l'"], ['mode', "'edit' | 'read'", "'edit'"], ['open / defaultOpen', 'boolean', 'false'], ['onOpenChange', '(open) => void', '—'], ['min / max', 'string (YYYY-MM-DD)', '—'], ['name', 'string', '—'], ['today', 'string (YYYY-MM-DD)', 'system date'],
        ].map(([name, type, initial]) => <article key={name}><code>{name}</code><span>{type}</span><span>{initial}</span></article>)}</div>
        <div className="ds-api-table" style={{ marginTop: 'var(--cometal-primitive-spacing-150)' }}>{[
          ['range.value / defaultValue', '{ start: Date | null, end: Date | null }', '{ start: null, end: null }'],
          ['range.onChange', '(value) => void', '—'],
          ['range.min / max', 'Date | null', '—'],
        ].map(([name, type, initial]) => <article key={name}><code>{name}</code><span>{type}</span><span>{initial}</span></article>)}</div>
      </section>

      <section className="ds-component-section">
        <SectionIntro number="08" title="Код">Установка, импорт и минимальный рабочий пример собраны из одного источника и соответствуют публичному React API.</SectionIntro>
        <ComponentCodeExample componentId="input.date-picker" componentName="Date Picker" sourceHref={sourceUrl} />
      </section>
    </main>
  );
}

const meta = {
  title: 'Components/Date Picker',
  component: DatePicker,
  decorators: [(Story, context) => (
    context.id === 'components-date-picker--overview'
      ? <Story />
      : <div className="ds-date-picker-story"><Story /></div>
  )],
  args: {
    label: 'Дата поставки',
    helperText: 'Выберите дату',
    size: 'l',
    defaultValue: '2026-07-15',
    today: '2026-07-31',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['l', 'm', 's'] },
    mode: { control: 'inline-radio', options: ['edit', 'read'] },
    onValueChange: { action: 'value changed' },
    onOpenChange: { action: 'open changed' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: 'Обзор',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: () => <OverviewPage />,
  play: async ({ canvasElement }) => {
    const firstComponent = canvasElement.querySelector<HTMLElement>('.ds-date-picker-variants [data-cometal-component="date-picker"]');
    const componentParent = firstComponent?.parentElement;
    const parentStyles = componentParent ? getComputedStyle(componentParent) : null;
    const availableWidth = componentParent && parentStyles
      ? componentParent.clientWidth - parseFloat(parentStyles.paddingLeft) - parseFloat(parentStyles.paddingRight)
      : 0;
    await expect(canvasElement.querySelector('.ds-date-picker-story')).toBeNull();
    await expect(firstComponent).not.toBeNull();
    await expect(firstComponent?.getBoundingClientRect().width).toBeCloseTo(Math.min(480, availableWidth), 0);
    await expect(canvasElement.querySelector('[data-code-example="input.date-picker"]')).not.toBeNull();
    await expect(canvasElement.querySelector('[data-code-example="input.date-picker"] pre')).toHaveTextContent('<DatePicker');
  },
};

export const Playground: Story = {
  name: 'Песочница',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Дата поставки' });
    await expect(input).toHaveValue('15.07.2026');
    await expect(canvas.getByRole('button', { name: 'Открыть календарь' })).toBeEnabled();
  },
};

export const OpenCalendar: Story = {
  name: 'Открытый календарь',
  args: { open: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Июль 2026' })).toBeVisible());
    await expect(body.getAllByRole('gridcell')).toHaveLength(35);
    await expect(body.getByRole('gridcell', { name: /среда, 15 июля 2026/ })).toHaveAttribute('aria-selected', 'true');
    const viewportWidth = canvasElement.ownerDocument.defaultView?.innerWidth ?? 364;
    const expectedPanelWidth = Math.min(364, viewportWidth - 16);
    const panel = canvasElement.ownerDocument.body.querySelector<HTMLElement>('.cometal-date-picker__panel');
    const firstCell = panel?.querySelector<HTMLElement>('[role="gridcell"]');
    const selectedDay = panel?.querySelector<HTMLElement>('[data-date="2026-07-15"]');
    await expect(canvasElement.querySelector<HTMLElement>('.cometal-field__control')?.getBoundingClientRect().height).toBe(48);
    await expect(panel?.parentElement).toBe(canvasElement.ownerDocument.body);
    await expect(getComputedStyle(panel!).position).toBe('fixed');
    await expect(panel?.getBoundingClientRect().width).toBe(expectedPanelWidth);
    const panelRect = panel!.getBoundingClientRect();
    await expect(canvasElement.ownerDocument.elementFromPoint(panelRect.left + 16, panelRect.top + 16)?.closest('[role="dialog"]')).toBe(panel);
    await expect(firstCell?.getBoundingClientRect().width).toBe(44);
    await expect(selectedDay?.getBoundingClientRect().width).toBe(40);
    const strokeNodes = [
      ...Array.from(canvasElement.querySelectorAll<SVGElement>('[data-cometal-component="date-picker"] svg [stroke]:not([stroke="none"])')),
      ...Array.from(panel!.querySelectorAll<SVGElement>('svg [stroke]:not([stroke="none"])')),
    ];
    await expect(strokeNodes.length).toBeGreaterThanOrEqual(3);
    const renderedStrokeWidths = strokeNodes.map((node) => {
      const svg = node.ownerSVGElement!;
      return Number.parseFloat(getComputedStyle(node).strokeWidth)
        * svg.getBoundingClientRect().width
        / svg.viewBox.baseVal.width;
    });
    await expect(renderedStrokeWidths.every((width) => Math.abs(width - 1.4) < 0.01)).toBe(true);
    await expect(strokeNodes.every((node) => getComputedStyle(node).vectorEffect === 'none')).toBe(true);
    if (viewportWidth > 360) {
      await expect(panel?.getBoundingClientRect().height).toBe(350);
      await expect(panel?.querySelector<HTMLElement>('.cometal-date-picker__month-header')?.getBoundingClientRect().height).toBe(32);
      await expect(panel?.querySelector<HTMLElement>('.cometal-date-picker__weekdays')?.getBoundingClientRect().height).toBe(18);
    }
  },
};

export const DateRangeOpen: Story = {
  name: 'Date Range',
  render: () => (
    <DateRangePicker
      label="Период поставки"
      helperText="Выберите период"
      defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }}
      today={new Date(2026, 6, 31)}
      size="s"
      open
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Июль 2026' })).toBeVisible());
    await expect(canvas.getByRole('textbox', { name: 'Период поставки' })).toHaveValue('15.07.2026 — 23.07.2026');
    await expect(canvasElement.querySelector<HTMLElement>('.cometal-field__control')?.getBoundingClientRect().height).toBe(32);
    await expect(body.getByRole('dialog', { name: 'Июль 2026' }).parentElement).toBe(canvasElement.ownerDocument.body);
    await expect(body.getByRole('button', { name: /среда, 15 июля 2026/ })).toHaveAttribute('data-range-start', 'true');
    await expect(body.getByRole('button', { name: /четверг, 23 июля 2026/ })).toHaveAttribute('data-range-end', 'true');
    const middleDays = canvasElement.ownerDocument.body.querySelectorAll('[data-range-middle="true"]');
    await expect(middleDays.length).toBeGreaterThan(0);
    const panel = canvasElement.ownerDocument.body.querySelector<HTMLElement>('.cometal-date-picker__panel');
    const start = panel!.querySelector<HTMLElement>('[role="gridcell"][data-range-start="true"]')!;
    const middle = panel!.querySelector<HTMLElement>('[role="gridcell"][data-range-middle="true"]')!;
    const end = panel!.querySelector<HTMLElement>('[role="gridcell"][data-range-end="true"]')!;
    const startTrack = getComputedStyle(start, '::before');
    const middleTrack = getComputedStyle(middle, '::before');
    const endTrack = getComputedStyle(end, '::before');
    await expect(canvas.queryByText(/Сначала выберите|Выберите дату окончания/)).not.toBeInTheDocument();
    await expect(panel?.getBoundingClientRect().height).toBe(350);
    await expect(panel?.querySelector<HTMLElement>('.cometal-date-picker__month-header')?.getBoundingClientRect().height).toBe(32);
    await expect(start.querySelector<HTMLElement>('.cometal-date-picker__day')?.getBoundingClientRect().width).toBe(40);
    await expect(start.querySelector<HTMLElement>('.cometal-date-picker__day')?.getBoundingClientRect().height).toBe(40);
    await expect(getComputedStyle(start.querySelector<HTMLElement>('.cometal-date-picker__day')!).borderRadius).toBe('8px');
    await expect([startTrack.left, startTrack.width, startTrack.top, startTrack.height]).toEqual(['22px', '26px', '6px', '32px']);
    await expect([middleTrack.left, middleTrack.width, middleTrack.top, middleTrack.height]).toEqual(['0px', '48px', '6px', '32px']);
    await expect([endTrack.left, endTrack.width, endTrack.top, endTrack.height]).toEqual(['0px', '22px', '6px', '32px']);
    await expect(getComputedStyle(panel!).boxShadow).not.toBe('none');
  },
};

export const PointerMotion: Story = {
  name: 'Motion',
  parameters: { controls: { disable: true } },
  render: () => <DatePicker label="Дата поставки" defaultValue="2026-07-15" today="2026-07-31" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Открыть календарь' }));
    const panel = body.getByRole('dialog', { name: 'Июль 2026' });
    const motion = getComputedStyle(panel);
    const reducedMotion = canvasElement.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      await expect(motion.transitionProperty).toBe('none');
    } else {
      await expect(motion.transitionProperty).toContain('opacity');
      await expect(motion.transitionProperty).toContain('transform');
      await expect(motion.transitionDuration).toContain('0.16s');
      await expect(motion.transitionDuration).toContain('0.18s');
    }
  },
};

export const ManualInput: Story = {
  name: 'Ручной ввод',
  args: { defaultValue: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Дата поставки' });
    await userEvent.clear(input);
    await userEvent.type(input, '29.02.2025');
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByText('Введите дату в формате ДД.ММ.ГГГГ')).toBeVisible();
  },
};

export const KeyboardNavigation: Story = {
  name: 'Клавиатура',
  args: { defaultValue: '2026-07-15' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Открыть календарь' }));
    const selected = await body.findByRole('button', { name: /среда, 15 июля 2026/ });
    selected.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(body.getByRole('button', { name: /четверг, 16 июля 2026/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('textbox', { name: 'Дата поставки' })).toHaveValue('16.07.2026');
  },
};

export const TriggerKeyboardDismissal: Story = {
  name: 'Trigger keyboard open and Escape',
  args: { defaultValue: '2026-07-15' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Открыть календарь' });
    trigger.focus();
    const root = trigger.closest<HTMLElement>('.cometal-field')!;
    await waitFor(() => expect(root).toHaveAttribute('data-focus-visible'));
    const control = root.querySelector<HTMLElement>('.cometal-field__control')!;
    await expect(getComputedStyle(control).outlineWidth).toBe('2px');
    await expect(getComputedStyle(control).outlineOffset).toBe('4px');
    await expect(getComputedStyle(trigger).outlineStyle).toBe('none');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Июль 2026' })).toBeVisible());
    await waitFor(() => expect(body.getByRole('button', { name: /среда, 15 июля 2026/ })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const DateRangeKeyboardDismissal: Story = {
  name: 'Date Range keyboard open and Escape',
  render: () => (
    <DateRangePicker
      label="Период поставки"
      name="deliveryPeriod"
      defaultValue={{ start: new Date(2026, 6, 15), end: new Date(2026, 6, 23) }}
      today={new Date(2026, 6, 31)}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Открыть календарь периода' });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: ' ' });
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Июль 2026' })).toBeVisible());
    await waitFor(() => expect(body.getByRole('button', { name: /среда, 15 июля 2026/ })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
    await expect(canvasElement.querySelector<HTMLInputElement>('input[type="hidden"][name="deliveryPeriod"]')).toHaveValue('2026-07-15/2026-07-23');
  },
};

export const MonthBoundary: Story = {
  name: 'Граница месяца',
  args: { defaultValue: '2026-07-31', today: '2026-07-31' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Открыть календарь' }));
    const selected = await body.findByRole('button', { name: /пятница, 31 июля 2026/ });
    selected.focus();
    await userEvent.keyboard('{PageUp}');
    const target = body.getByRole('button', { name: /вторник, 30 июня 2026/ });
    await expect(target).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('textbox', { name: 'Дата поставки' })).toHaveValue('30.06.2026');
  },
};

export const ReadMode: Story = {
  name: 'Read',
  args: { mode: 'read' },
  play: async ({ canvasElement }) => {
    const component = canvasElement.querySelector<HTMLElement>('[data-cometal-component="date-picker"]');
    await expect(component?.getBoundingClientRect().height).toBe(50);
    await expect(component?.querySelector('button, input')).toBeNull();
  },
};
export const ErrorState: Story = { name: 'Error', args: { error: 'Дата должна быть не раньше 01.07.2026' } };
export const Disabled: Story = { name: 'Disabled', args: { disabled: true, helperText: undefined } };
