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
const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function createDate(year: number, month: number, day: number) {
  const date = new Date(year, month, day, 12);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
}

export function parseIsoDate(value?: string | null) {
  if (!value) return null;
  const match = ISO_PATTERN.exec(value);
  if (!match) return null;
  return createDate(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function parseDisplayDate(value: string) {
  const match = DISPLAY_PATTERN.exec(value.trim());
  if (!match) return null;
  return createDate(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
}

export function formatDisplayDate(value?: string | null) {
  const date = parseIsoDate(value);
  return date ? `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}` : '';
}

function formatReadDate(value: string | null | undefined, locale: string) {
  const date = parseIsoDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    .format(date)
    .replace(/\s*г\.$/, '');
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

function sameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear()
    && first.getMonth() === second.getMonth()
    && first.getDate() === second.getDate();
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

function useControllableDate(
  controlled: string | null | undefined,
  defaultValue: string | null,
  onChange?: (value: string | null) => void,
) {
  const [internal, setInternal] = useState(defaultValue);
  const value = controlled !== undefined ? controlled : internal;
  const setValue = (next: string | null) => {
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
  };
  return [value, setValue] as const;
}

export interface DatePickerProps {
  id?: string;
  name?: string;
  label: string;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  size?: FieldSize;
  mode?: FieldMode;
  helperText?: string;
  error?: string;
  optional?: boolean;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  locale?: string;
  min?: string;
  max?: string;
  today?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoComplete?: string;
  className?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker({
  id,
  name,
  label,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  size = 'l',
  mode = 'edit',
  helperText,
  error,
  optional = false,
  disabled = false,
  required = false,
  placeholder = 'ДД.ММ.ГГГГ',
  locale = 'ru-RU',
  min,
  max,
  today,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  autoComplete = 'off',
  className,
}: DatePickerProps, forwardedRef) {
  const generatedId = useId();
  const controlId = id ?? `cometal-date-picker-${generatedId}`;
  const dialogId = `${controlId}-dialog`;
  const headingId = `${controlId}-heading`;
  const supportingId = `${controlId}-supporting`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useControllableDate(controlledValue, defaultValue, onValueChange);
  const [isOpen, setIsOpen] = useControllableOpen(controlledOpen, defaultOpen, onOpenChange);
  const initialDate = parseIsoDate(selectedValue) ?? parseIsoDate(today) ?? new Date();
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(initialDate));
  const [inputValue, setInputValue] = useState(() => formatDisplayDate(selectedValue));
  const [inputError, setInputError] = useState<string>();
  const [focusTarget, setFocusTarget] = useState<string>();
  const [panelMotion, setPanelMotion] = useState(false);
  const [monthMotionDirection, setMonthMotionDirection] = useState<-1 | 0 | 1>(0);
  const todayDate = parseIsoDate(today) ?? new Date();
  const selectedDate = parseIsoDate(selectedValue);
  const minDate = parseIsoDate(min);
  const maxDate = parseIsoDate(max);
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
    setInputValue(formatDisplayDate(selectedValue));
    const date = parseIsoDate(selectedValue);
    if (date) setVisibleMonth(startOfMonth(date));
  }, [selectedValue]);

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

  const selectDate = (date: Date) => {
    if (isUnavailable(date)) return;
    const next = toIsoDate(date);
    setInputError(undefined);
    setSelectedValue(next);
    setInputValue(formatDisplayDate(next));
    closeAndRestoreFocus();
  };

  const commitInput = () => {
    if (!inputValue.trim()) {
      setInputError(required ? 'Выберите дату' : undefined);
      if (!required) setSelectedValue(null);
      return !required;
    }
    const parsed = parseDisplayDate(inputValue);
    if (!parsed || isUnavailable(parsed)) {
      setInputError(parsed ? 'Дата вне доступного периода' : 'Введите дату в формате ДД.ММ.ГГГГ');
      return false;
    }
    const next = toIsoDate(parsed);
    setInputError(undefined);
    setSelectedValue(next);
    setInputValue(formatDisplayDate(next));
    setVisibleMonth(startOfMonth(parsed));
    return true;
  };

  const openCalendar = (moveFocusToCalendar = false, animate = false) => {
    if (disabled || mode === 'read') return;
    const target = selectedValue ?? toIsoDate(todayDate);
    const date = parseIsoDate(target) ?? todayDate;
    setVisibleMonth(startOfMonth(date));
    if (moveFocusToCalendar) setFocusTarget(target);
    else setFocusTarget(undefined);
    setPanelMotion(animate);
    setIsOpen(true);
  };

  const changeVisibleMonth = (amount: -1 | 1, animate: boolean) => {
    setMonthMotionDirection(animate ? amount : 0);
    setVisibleMonth((month) => addMonths(month, amount));
  };

  const moveFocus = (current: Date, amount: number) => {
    const next = addDays(current, amount);
    setVisibleMonth(startOfMonth(next));
    setFocusTarget(toIsoDate(next));
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
    const current = parseIsoDate(target.dataset.date);
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
      <div ref={rootRef} className={['cometal-date-picker', className].filter(Boolean).join(' ')} data-cometal-component="date-picker" data-mode="read" data-size={size}>
        <FieldChrome label={label} mode="read" size={size} readValue={formatReadDate(selectedValue, locale)}>
          <span />
        </FieldChrome>
      </div>
    );
  }

  const calendarPanel = hydrated && isOpen ? createPortal(
    <div
      ref={calendarRef}
      className="cometal-date-picker__panel"
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
            const selected = Boolean(selectedDate && sameDay(date, selectedDate));
            const current = sameDay(date, todayDate);
            const outside = date.getMonth() !== visibleMonth.getMonth();
            const unavailable = isUnavailable(date);
            return (
              <span key={iso} role="gridcell" aria-label={fullDateLabel(date, locale)} aria-selected={selected}>
                <button
                  type="button"
                  className="cometal-date-picker__day"
                  data-date={iso}
                  data-selected={selected || undefined}
                  data-today={current || undefined}
                  data-outside={outside || undefined}
                  disabled={unavailable}
                  aria-label={fullDateLabel(date, locale)}
                  aria-current={current ? 'date' : undefined}
                  tabIndex={selected || (!selectedDate && current) ? 0 : -1}
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
  ) : null;

  return (
    <div ref={rootRef} className={['cometal-date-picker', className].filter(Boolean).join(' ')} data-cometal-component="date-picker" data-mode="edit" data-size={size} data-open={isOpen || undefined}>
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
            aria-label={isOpen ? 'Закрыть календарь' : 'Открыть календарь'}
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
      {name ? <input type="hidden" name={name} value={selectedValue ?? ''} disabled={disabled} /> : null}
      {calendarPanel}
    </div>
  );
});
