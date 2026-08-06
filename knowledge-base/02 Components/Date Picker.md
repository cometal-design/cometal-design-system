# Date Picker

`input.date-picker` — выбор одной даты через ручной ввод или календарь.

## Источники

- Figma: [Component Set `1764:10502`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1764-10502)
- Спецификация: [[../../specifications/components/date-picker]]
- React: `packages/react/src/DatePicker/DatePicker.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-date-picker--overview
- Реестр: `input.date-picker`, статус `in-review`

## Архитектура

Один публичный `Date Picker` включает три внутренние части: `Date Field Trigger`, `Calendar Panel`, `Calendar Day`. Они не используются продуктом отдельно. Отдельный публичный Date Input может появиться только после подтверждённого самостоятельного сценария без календаря.

## Контракт

- Single date; Date Range проектируется отдельным компонентом.
- Edit/Read, размеры L/M, Closed/Open; Read + Open запрещён.
- В React дата хранится как ISO `YYYY-MM-DD`, показывается как `ДД.ММ.ГГГГ`.
- Figma владеет визуальной моделью; спецификация — правилами; React — поведением/API; Storybook — исполняемыми состояниями и проверками.

## Motion

При pointer-раскрытии панель появляется от trigger через opacity и смещение 4px. Pointer-переходы между
месяцами направлены по оси X и используют code-owned motion tokens; клавиатурная
навигация остаётся мгновенной. Reduced motion отключает пространственное движение.
