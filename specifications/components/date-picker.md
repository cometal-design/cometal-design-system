---
id: input.date-picker
name: Date Picker
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1764-10502"
---

# Date Picker

## Назначение

Выбор одной календарной даты через ручной ввод или календарь. Публичный компонент объединяет поле и календарь; `Date Field Trigger`, `Calendar Panel` и `Calendar Day` остаются внутренними частями и отдельно не экспортируются.

## Визуальная модель

- Режимы: `edit`, `read`.
- Размеры: `l` — control 48px, `m` — control 40px.
- Раскрытие: `closed`, `open`; сочетание `read + open` запрещено.
- Поле заполняет ширину родителя. Календарь имеет базовую ширину 364px, выравнивается по левому краю поля, располагается через 8px и не изменяет высоту layout.
- Календарь: понедельник — первый день недели; день занимает 44×44px.
- Состояния дня: default, hover, selected, today, outside, disabled; focus-visible независим.
- Стили, размеры, цвета, типографика, радиусы и stroke используют токены Cometal.

## React API

- Значение передаётся строкой ISO `YYYY-MM-DD`, чтобы контракт не зависел от timezone.
- `value` / `onValueChange` — controlled-сценарий; `defaultValue` — uncontrolled.
- `open` / `onOpenChange` — controlled-сценарий раскрытия; `defaultOpen` — uncontrolled.
- `min` и `max` ограничивают ручной ввод и календарь.
- `today` задаёт детерминированную текущую дату для тестов, серверного рендера и визуальных эталонов.
- `name` создаёт скрытое form-value в ISO; видимое поле хранит локализованное представление.
- Случайные визуальные настройки не являются props.

## Поведение

- Ручной ввод: `ДД.ММ.ГГГГ`; несуществующая дата и дата вне `min/max` показывают ошибку.
- Кнопка календаря раскрывает и закрывает overlay. Клик вне компонента и `Escape` закрывают его.
- Выбор дня обновляет ISO-значение, закрывает календарь и возвращает фокус на trigger.
- `Arrow Left/Right/Up/Down` перемещают фокус на день/неделю; `Home/End` — начало/конец недели; `Page Up/Down` — месяц; `Shift + Page Up/Down` — год; `Enter/Space` выбирают день.
- `read` выводит форматированное значение обычным текстом без input, button и tab-stop.
- Disabled блокирует ручной ввод, раскрытие и выбор.

## Motion

- При pointer-раскрытии Calendar Panel появляется от trigger через opacity и смещение 4px за системную popover-длительность; клавиатурное раскрытие остаётся мгновенным.
- При pointer-переходе предыдущий месяц входит слева, следующий — справа; сдвиг равен spacing-token 8px и затрагивает только opacity/transform.
- Клавиатурные `Page Up/Down` меняют месяц без перехода, чтобы не замедлять навигацию.
- При `prefers-reduced-motion: reduce` пространственное движение отключается.

## Accessibility

- Visible label связан с input через `htmlFor` / `id`.
- Helper/error связан через `aria-describedby`; ошибка выставляет `aria-invalid`.
- Trigger имеет `aria-haspopup="dialog"`, `aria-expanded` и `aria-controls`.
- Панель имеет подписанный `role="dialog"`; календарь — `role="grid"`, дни — `role="gridcell"` с полным доступным названием даты и `aria-selected`.
- Focus-visible использует системный focus token и не кодируется только цветом.

## Acceptance criteria

- [x] Публичная архитектура и визуальная матрица считаны из утверждённого Figma Component Set `1764:10502`.
- [x] Стабильный ID, реестр, спецификация и паспорт созданы.
- [x] React API, ручной ввод, календарная математика и form-value реализованы.
- [x] Unit, browser interaction, accessibility и визуальная матрица прошли финальную проверку.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
