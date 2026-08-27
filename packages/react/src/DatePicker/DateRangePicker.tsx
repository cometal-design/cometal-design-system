import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { FieldChrome } from '../Field/Field';
import type { FieldMode, FieldSize } from '../Field/Field';
import { useAnchoredOverlay, useControllableOpen, useHydrated, useOutsidePointerDismiss } from '../internal/overlay';
import ChevronLeftIcon from '../icons/generated/components/outline/arrows/chevron-left';
import ChevronRightIcon from '../icons/generated/components/outline/arrows/chevron-right';
import CalendarIcon from '../icons/generated/components/outline/time/calendar-02';
import './date-picker.css';

const DISPLAY_PATTERN = /^(\d{2})\.(\d{2})\.(\d{4})$/;
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toIsoDate(date: Date | null | undefined) {
  const normalized = normalizeDate(date);
  return normalized
    ? `${normalized.getFullYear()}-${pad(normalized.getMonth() + 1)}-${pad(normalized.getDate())}`
    : '';
}

function normalizeDate(value: Date | null | undefined) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null;
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12);
}

function createDate(year: number, month: number, day: number) {
  const date = new Date(year, month, day, 12);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
}

function parseDisplayDate(value: string) {
  const match = DISPLAY_PATTERN.exec(value.trim());
  if (!match) return null;
  return createDate(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
}

function formatDisplayDate(value: Date | null | undefined) {
  const date = normalizeDate(value);
  return date ? `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}` : '';
}

function formatReadDate(value: Date | null | undefined, locale: string) {
  const date = normalizeDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    .format(date)
    .replace(/\s*г\.$/, '');
}

function formatReadRange(value: DateRangeValue, locale: string) {
  const start = formatReadDate(value.start, locale);
  const end = formatReadDate(value.end, locale);
  if (start === '—' && end === '—') return '—';
  if (start !== '—' && end === '—') return `${start} —`;
  if (start === '—' && end !== '—') return `— ${end}`;
  return `${start} — ${end}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount, 12);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
}

function addCalendarMonths(date: Date, amount: number) {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
  const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 12).getDate();
  return new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    Math.min(date.getDate(), lastDay),
    12,
  );
}

function addCalendarYears(date: Date, amount: number) {
  const targetYear = date.getFullYear() + amount;
  const lastDay = new Date(targetYear, date.getMonth() + 1, 0, 12).getDate();
  return new Date(targetYear, date.getMonth(), Math.min(date.getDate(), lastDay), 12);
}

function sameDay(first: Date | null | undefined, second: Date | null | undefined) {
  if (!first || !second) return false;
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
}

function isBetween(date: Date, start: Date, end: Date) {
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
}

function monthLabel(date: Date, locale: string) {
  const label = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);
  const normalized = label.replace(/\s*г\.$/, '');
  return normalized.charAt(0).toLocaleUpperCase(locale) + normalized.slice(1);
}

function fullDateLabel(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function parseRangeInput(input: string) {
  const normalized = input.replace(/\s*—\s*/g, '—').replace(/\s*-\s*/g, '—').trim();
  if (!normalized) return { start: null, end: null } satisfies DateRangeValue;
  const [startRaw, endRaw] = normalized.split('—');
  if (!startRaw || !endRaw) return null;
  const start = parseDisplayDate(startRaw);
  const end = parseDisplayDate(endRaw);
  if (!start || !end) return null;
  return start.getTime() <= end.getTime()
    ? ({ start, end } satisfies DateRangeValue)
    : ({ start: end, end: start } satisfies DateRangeValue);
}

function formatRangeInput(value: DateRangeValue) {
  if (!value.start && !value.end) return '';
  return `${formatDisplayDate(value.start)} — ${formatDisplayDate(value.end)}`.trim();
}

function serializeRangeValue(value: DateRangeValue) {
  const start = toIsoDate(value.start);
  const end = toIsoDate(value.end);
  return start || end ? `${start}/${end}` : '';
}

export type DateRangeValue = {
  start: Date | null;
  end: Date | null;
};

function normalizeRangeValue(value?: DateRangeValue | null) {
  const start = normalizeDate(value?.start);
  const end = normalizeDate(value?.end);
  if (!start && !end) return { start: null, end: null } satisfies DateRangeValue;
  if (start && end && start.getTime() > end.getTime()) return { start: end, end: start } satisfies DateRangeValue;
  return { start, end } satisfies DateRangeValue;
}

function useControllableRange(
  controlled: DateRangeValue | undefined,
  defaultValue: DateRangeValue,
  onChange?: (value: DateRangeValue) => void,
) {
  const [internal, setInternal] = useState(() => normalizeRangeValue(defaultValue));
  const value = controlled ? normalizeRangeValue(controlled) : internal;
  const setValue = (next: DateRangeValue) => {
    const normalized = normalizeRangeValue(next);
    if (controlled === undefined) setInternal(normalized);
    onChange?.(normalized);
  };
  return [value, setValue] as const;
}

export interface DateRangePickerProps {
  id?: string;
  name?: string;
  label: string;
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  size?: FieldSize;
  mode?: FieldMode;
  helperText?: string;
  error?: string;
  optional?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  locale?: string;
  min?: Date | null;
  max?: Date | null;
  today?: Date;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoComplete?: string;
  className?: string;
}

export const DateRangePicker = forwardRef<HTMLInputElement, DateRangePickerProps>(function DateRangePicker({
  id,
  name,
  label,
  value: controlledValue,
  defaultValue = { start: null, end: null },
  onChange,
  size = 'l',
  mode = 'edit',
  helperText,
  error,
  optional = false,
  disabled = false,
  required = false,
  placeholder = 'ДД.ММ.ГГГГ — ДД.ММ.ГГГГ',
  locale = 'ru-RU',
  min = null,
  max = null,
  today,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  autoComplete = 'off',
  className,
}: DateRangePickerProps, forwardedRef) {
  const generatedId = useId();
  const controlId = id ?? `cometal-date-range-picker-${generatedId}`;
  const dialogId = `${controlId}-dialog`;
  const headingId = `${controlId}-heading`;
  const supportingId = `${controlId}-supporting`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [rangeValue, setRangeValue] = useControllableRange(controlledValue, defaultValue, onChange);
  const [isOpen, setIsOpen] = useControllableOpen(controlledOpen, defaultOpen, onOpenChange);
  const referenceDate = normalizeDate(rangeValue.start) ?? normalizeDate(rangeValue.end) ?? normalizeDate(today) ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(referenceDate));
  const [inputValue, setInputValue] = useState(() => formatRangeInput(rangeValue));
  const [inputError, setInputError] = useState<string>();
  const [focusTarget, setFocusTarget] = useState<string>();
  const [panelMotion, setPanelMotion] = useState(false);
  const [monthMotionDirection, setMonthMotionDirection] = useState<-1 | 0 | 1>(0);
  const [selectionPhase, setSelectionPhase] = useState<'start' | 'end'>(() => (rangeValue.start && !rangeValue.end ? 'end' : 'start'));
  const todayDate = normalizeDate(today) ?? new Date();
  const minDate = normalizeDate(min);
  const maxDate = normalizeDate(max);
  const effectiveError = error ?? inputError;
  const hydrated = useHydrated();
  const calendarOverlay = useAnchoredOverlay({
    open: hydrated && isOpen,
    anchorRef: rootRef,
    surfaceRef: calendarRef,
    gap: 8,
    viewportInset: 8,
    onLostAnchor: () => setIsOpen(false),
  });

  useEffect(() => {
    const normalized = normalizeRangeValue(rangeValue);
    setInputValue(formatRangeInput(normalized));
    const anchor = normalized.start ?? normalized.end;
    if (anchor) setVisibleMonth(startOfMonth(anchor));
    setSelectionPhase(normalized.start && !normalized.end ? 'end' : 'start');
  }, [rangeValue]);

  useEffect(() => {
    inputRef.current?.setCustomValidity(effectiveError ?? '');
  }, [effectiveError]);

  useOutsidePointerDismiss(isOpen, [rootRef, calendarRef], () => setIsOpen(false));

  useEffect(() => {
    if (!isOpen || !focusTarget || !calendarOverlay.positioned) return undefined;
    const calendar = calendarRef.current;
    if (!calendar) return undefined;
    const day = calendar.querySelector<HTMLButtonElement>(`[data-date="${focusTarget}"]:not(:disabled)`)
      ?? calendar.querySelector<HTMLButtonElement>('.cometal-date-picker__day:not(:disabled)');
    day?.focus();
    return undefined;
  }, [calendarOverlay.positioned, focusTarget, isOpen]);

  useEffect(() => {
    if (!monthMotionDirection) return undefined;
    const frame = requestAnimationFrame(() => setMonthMotionDirection(0));
    return () => cancelAnimationFrame(frame);
  }, [visibleMonth, monthMotionDirection]);

  const days = useMemo(() => {
    const firstDay = startOfMonth(visibleMonth);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const start = addDays(firstDay, -mondayOffset);
    const daysInMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0, 12).getDate();
    const visibleDays = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;
    return Array.from({ length: visibleDays }, (_, index) => addDays(start, index));
  }, [visibleMonth]);

  const isUnavailable = (date: Date) => {
    const time = date.getTime();
    return Boolean((minDate && time < minDate.getTime()) || (maxDate && time > maxDate.getTime()));
  };

  const closeAndRestoreFocus = () => {
    setPanelMotion(false);
    setFocusTarget(undefined);
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const commitInput = () => {
    if (!inputValue.trim()) {
      setInputError(required ? 'Выберите период' : undefined);
      if (!required) setRangeValue({ start: null, end: null });
      return !required;
    }
    const parsed = parseRangeInput(inputValue);
    if (!parsed) {
      setInputError('Введите период в формате ДД.ММ.ГГГГ — ДД.ММ.ГГГГ');
      return false;
    }
    if ((parsed.start && isUnavailable(parsed.start)) || (parsed.end && isUnavailable(parsed.end))) {
      setInputError('Период вне доступного интервала');
      return false;
    }
    setInputError(undefined);
    setRangeValue(parsed);
    setInputValue(formatRangeInput(parsed));
    setVisibleMonth(startOfMonth(parsed.start ?? parsed.end ?? todayDate));
    return true;
  };

  const openCalendar = (moveFocusToCalendar = false, animate = false) => {
    if (disabled || mode === 'read') return;
    const anchor = rangeValue.start ?? rangeValue.end ?? todayDate;
    setVisibleMonth(startOfMonth(anchor));
    if (moveFocusToCalendar) setFocusTarget(toIsoDate(anchor));
    else setFocusTarget(undefined);
    setPanelMotion(animate);
    setIsOpen(true);
  };

  const changeVisibleMonth = (amount: -1 | 1, animate: boolean) => {
    setMonthMotionDirection(animate ? amount : 0);
    setVisibleMonth((month) => addMonths(month, amount));
  };

  const selectDate = (date: Date) => {
    if (isUnavailable(date)) return;
    if (!rangeValue.start || (rangeValue.start && rangeValue.end) || selectionPhase === 'start') {
      setInputError(undefined);
      setRangeValue({ start: date, end: null });
      setInputValue(`${formatDisplayDate(date)} —`);
      setSelectionPhase('end');
      setFocusTarget(undefined);
      return;
    }
    const start = rangeValue.start;
    const next = start.getTime() <= date.getTime()
      ? { start, end: date }
      : { start: date, end: start };
    setInputError(undefined);
    setRangeValue(next);
    setInputValue(formatRangeInput(next));
    setSelectionPhase('start');
    closeAndRestoreFocus();
  };

  const onCalendarKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-date]');
    if (!target) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAndRestoreFocus();
      }
      return;
    }
    const current = parseDisplayDate(target.dataset.display ?? '') ?? normalizeDate(new Date(target.dataset.date ?? ''));
    if (!current) return;
    let next: Date | null = null;
    if (event.key === 'ArrowLeft') next = addDays(current, -1);
    if (event.key === 'ArrowRight') next = addDays(current, 1);
    if (event.key === 'ArrowUp') next = addDays(current, -7);
    if (event.key === 'ArrowDown') next = addDays(current, 7);
    if (event.key === 'Home') next = addDays(current, -((current.getDay() + 6) % 7));
    if (event.key === 'End') next = addDays(current, 6 - ((current.getDay() + 6) % 7));
    if (event.key === 'PageUp') next = event.shiftKey ? addCalendarYears(current, -1) : addCalendarMonths(current, -1);
    if (event.key === 'PageDown') next = event.shiftKey ? addCalendarYears(current, 1) : addCalendarMonths(current, 1);
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectDate(current);
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAndRestoreFocus();
      return;
    }
    if (!next) return;
    event.preventDefault();
    if (isUnavailable(next)) return;
    setVisibleMonth(startOfMonth(next));
    setFocusTarget(toIsoDate(next));
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setInputError(undefined);
  };

  const onInputBlur = () => { commitInput(); };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitInput();
    }
    if (event.key === 'ArrowDown' && event.altKey) {
      event.preventDefault();
      openCalendar(true);
    }
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeAndRestoreFocus();
    }
  };

  if (mode === 'read') {
    return (
      <div ref={rootRef} className={['cometal-date-picker', 'cometal-date-range-picker', className].filter(Boolean).join(' ')} data-cometal-component="date-range-picker" data-mode="read" data-size={size}>
        <FieldChrome label={label} mode="read" size={size} readValue={formatReadRange(rangeValue, locale)}>
          <span />
        </FieldChrome>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={['cometal-date-picker', 'cometal-date-range-picker', className].filter(Boolean).join(' ')} data-cometal-component="date-range-picker" data-mode="edit" data-size={size} data-open={isOpen || undefined}>
      <FieldChrome
        label={label}
        helperText={helperText}
        optional={optional}
        error={effectiveError}
        size={size}
        controlId={controlId}
        supportingId={helperText || effectiveError ? supportingId : undefined}
        disabled={disabled}
      >
        <span className="cometal-field__control cometal-date-picker__control">
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof forwardedRef === 'function') forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            id={controlId}
            className="cometal-field__input cometal-date-picker__input"
            type="text"
            inputMode="numeric"
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={inputValue}
            disabled={disabled}
            required={required}
            aria-invalid={effectiveError ? true : undefined}
            aria-describedby={helperText || effectiveError ? supportingId : undefined}
            onChange={onInputChange}
            onBlur={onInputBlur}
            onKeyDown={onInputKeyDown}
          />
          <button
            ref={triggerRef}
            className="cometal-date-picker__trigger"
            type="button"
            disabled={disabled}
            aria-label={isOpen ? 'Закрыть календарь периода' : 'Открыть календарь периода'}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-controls={dialogId}
            onClick={(event) => {
              if (isOpen) closeAndRestoreFocus();
              else openCalendar(event.detail === 0, event.detail !== 0);
            }}
            onKeyDown={(event) => {
              if (isOpen && event.key === 'Escape') {
                event.preventDefault();
                closeAndRestoreFocus();
                return;
              }
              if (!isOpen && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                openCalendar(true);
              }
            }}
          >
            <CalendarIcon />
          </button>
        </span>
      </FieldChrome>
      {name ? (
        <input
          type="hidden"
          name={name}
          value={serializeRangeValue(rangeValue)}
          disabled={disabled}
        />
      ) : null}

      {hydrated && isOpen ? createPortal(
        <div
          ref={calendarRef}
          className="cometal-date-picker__panel cometal-date-range-picker__panel"
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={headingId}
          data-motion={panelMotion ? 'enter' : undefined}
          data-placement={calendarOverlay.placement}
          style={calendarOverlay.style}
          onKeyDown={onCalendarKeyDown}
        >
          <div className="cometal-date-picker__month-header">
            <h2 data-month-motion={monthMotionDirection || undefined} id={headingId} aria-live="polite">{monthLabel(visibleMonth, locale)}</h2>
            <div className="cometal-date-picker__month-actions">
              <button type="button" className="cometal-date-picker__month-control" aria-label="Предыдущий месяц" onClick={(event) => changeVisibleMonth(-1, event.detail !== 0)}>
                <ChevronLeftIcon />
              </button>
              <button type="button" className="cometal-date-picker__month-control" aria-label="Следующий месяц" onClick={(event) => changeVisibleMonth(1, event.detail !== 0)}>
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          <div data-month-motion={monthMotionDirection || undefined} className="cometal-date-picker__calendar" role="grid" aria-labelledby={headingId}>
            <div className="cometal-date-picker__weekdays" role="row">
              {WEEKDAYS.map((weekday) => <span key={weekday} role="columnheader" aria-label={weekday}>{weekday}</span>)}
            </div>
            {Array.from({ length: days.length / 7 }, (_, rowIndex) => (
              <div className="cometal-date-picker__day-row" role="row" key={`week-${rowIndex}`}>
                {days.slice(rowIndex * 7, rowIndex * 7 + 7).map((date) => {
                  const iso = toIsoDate(date);
                  const start = normalizeDate(rangeValue.start);
                  const end = normalizeDate(rangeValue.end);
                  const selected = Boolean(sameDay(date, start) || sameDay(date, end));
                  const current = sameDay(date, todayDate);
                  const outside = date.getMonth() !== visibleMonth.getMonth();
                  const unavailable = isUnavailable(date);
                  const rangeStart = Boolean(start && sameDay(date, start));
                  const rangeEnd = Boolean(end && sameDay(date, end));
                  const rangeMiddle = Boolean(start && end && isBetween(date, start, end));
                  return (
                    <span
                      key={iso}
                      role="gridcell"
                      aria-label={fullDateLabel(date, locale)}
                      aria-selected={selected}
                      data-range-cell={rangeMiddle || rangeStart || rangeEnd || undefined}
                      data-range-start={rangeStart || undefined}
                      data-range-middle={rangeMiddle || undefined}
                      data-range-end={rangeEnd || undefined}
                    >
                      <button
                        type="button"
                        className="cometal-date-picker__day"
                        data-date={iso}
                        data-display={formatDisplayDate(date)}
                        data-selected={selected || undefined}
                        data-today={current || undefined}
                        data-outside={outside || undefined}
                        data-range-start={rangeStart || undefined}
                        data-range-middle={rangeMiddle || undefined}
                        data-range-end={rangeEnd || undefined}
                        disabled={unavailable}
                        aria-label={fullDateLabel(date, locale)}
                        aria-current={current ? 'date' : undefined}
                        tabIndex={selected || (!start && current) ? 0 : -1}
                        onClick={() => selectDate(date)}
                      >
                        {date.getDate()}
                      </button>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>,
        rootRef.current?.ownerDocument.body ?? document.body,
      ) : null}
    </div>
  );
});
