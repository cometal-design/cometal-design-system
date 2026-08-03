# Date Picker — publication audit

Дата: 2026-08-03

Компонент: `input.date-picker`

Статус реализации: `in-review` — техническая реализация и независимый Visual QA завершены, review Frontend Lead ещё не проведён.

Вердикт Visual QA: `PASS` для production-коммита `1adf4a0`; непроверенного остатка в согласованном scope нет.

## Эталон

- Figma-файл: `KKNGucImxFAtQLBhPy8tLs`
- Публичный Component Set: `1764:10502`
- Внутренние источники: `Date Field Trigger` (`1754:84`), `Calendar Panel` (`1754:167`), `Calendar Day` (`1752:108`)
- Публичная матрица: Edit/Read, L/M, Closed/Open; `Read + Open` запрещён.

## Визуальная проверка

- Проверены шесть публичных вариантов и состояния дня: default, hover, selected, today, outside, disabled, focus-visible.
- Control: L — 48px, M — 40px.
- Calendar Panel: 364×350px, внутренний отступ 16px, header/navigation/icon 32/32/24px, weekdays 18px, отступ от поля 8px, абсолютный overlay, Monday-first.
- Calendar Day: ячейка 44×44px, интерактивная поверхность 40×40px, внешний focus ring 44×44px.
- Read: корневой блок 50px, длинный формат даты.
- Повторный независимый production browser-pass выполнен на desktop, 390×844 и 320×720. Горизонтального переполнения, обрезки календаря и сжатия day-slot нет.
- Production Overview показывает все шесть публичных вариантов шириной 480px и не искажает геометрию компонента.
- Повторный чистый запуск Storybook не зафиксировал ошибок или предупреждений в консоли.

## Инженерная проверка

- Значение хранится в ISO `YYYY-MM-DD`; UI показывает `ДД.ММ.ГГГГ`.
- Проверены controlled/uncontrolled value и open state, hidden form-value, required и native custom validity.
- Невалидные и несуществующие даты, min/max и пустое required-значение возвращают ошибку.
- Календарная математика сохраняет допустимый день при переходе между месяцами и годами: 31 июля → 30 июня, 29 февраля → 28 февраля невисокосного года.
- Проверены outside click, Escape, возврат фокуса, выбор дня и блокировка disabled.
- Проверены Arrow keys, Home/End, Page Up/Down и Shift + Page Up/Down.
- ARIA: связанный label/helper/error, dialog, grid/row/gridcell, aria-selected, aria-current, focus-visible.
- Read не содержит input, button или tab-stop.

## Автоматические проверки

- Unit: 5 файлов, 21 тест.
- Storybook browser/a11y: 8 файлов, 47 тестов.
- Impeccable detector: замечаний нет.
- Финальный `pnpm validate`: пройден — sources, secrets, typecheck, unit, Storybook browser/a11y, React, Storybook и portal builds.

## Независимый Visual QA

- Эталон: Figma `1764:10502`, внутренние узлы `1754:84`, `1754:167`, `1752:108`.
- Production: commit `1adf4a0`, CSS asset `iframe-D_s2TtEm.css`.
- Проверены геометрия, типографика, токены, шесть публичных комбинаций, responsive 390/320, ручной ввод, keyboard navigation, month boundary, Read, Error, Disabled, ARIA и console/runtime.
- Итог: `PASS`; подтверждённых визуальных или инженерных расхождений нет, непроверенного остатка нет.

## Источники истины

- Figma: визуальная архитектура и допустимые варианты.
- Specification: `specifications/components/date-picker.md`.
- React: `packages/react/src/DatePicker/DatePicker.tsx`.
- Storybook: `Components / Date Picker`.
- Obsidian: `knowledge-base/02 Components/Date Picker.md`.
- Registry: `input.date-picker`.

## Открытый gate

После публикации Frontend Lead должен проверить совместимость API и поведения с продуктом. До этого компонент сохраняет статус `in-review`.
