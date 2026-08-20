# Date Picker

`input.date-picker` — семейство выбора одной даты и периода через ручной ввод или календарь.

## Источники

- Figma: [Component Set `1764:10502`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1764-10502)
- Спецификация: [[../../specifications/components/date-picker]]
- React: `packages/react/src/DatePicker/DatePicker.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-date-picker--overview
- Реестр: `input.date-picker`, статус `in-review`

## Архитектура

Публичная семья включает `DatePicker` и `DateRangePicker`, но использует один календарный contract. Внутренние части `Date Field Trigger`, `Calendar Panel` и `Calendar Day` не используются продуктом отдельно. Отдельный публичный Date Input возможен только после подтверждённого самостоятельного сценария без календаря.

## Контракт

- Single date и period picker живут в одном модуле и одном визуальном контракте.
- Edit/Read, размеры L/M, Closed/Open; Read + Open запрещён.
- В React дата хранится как ISO `YYYY-MM-DD`, показывается как `ДД.ММ.ГГГГ`.
- Диапазон хранится как `{ start: Date | null, end: Date | null }`; промежуточные дни рендерятся через canonical classes start / middle / end.
- Table header filters переиспользуют `DateRangePicker`, а не создают отдельный локальный overlay.
- Figma владеет визуальной моделью; спецификация — правилами; React — поведением/API; Storybook — исполняемыми состояниями и проверками.

## Motion

При pointer-раскрытии панель появляется от trigger через opacity и смещение 4px. Pointer-переходы между
месяцами направлены по оси X и используют code-owned motion tokens; клавиатурная
навигация остаётся мгновенной. Reduced motion отключает пространственное движение.
