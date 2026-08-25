# Table

`data-display.table` — большое семейство компонентов для больших бизнес-наборов данных.

## Источники

- Figma Sources: [Table / Sources `2814:8351`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2814-8351)
- Cells: [Table / Source / Cells `2353:9497`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9497)
- Headers: [Table / Source / Header `2353:10891`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10891)
- Columns: [Table / Source / Main Components `2353:9824`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9824)
- Paginator: [Table / Source / Paginator `2353:10882`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10882)
- Спецификация: [[../../specifications/components/table]]
- React: `packages/react/src/Table/Table.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-table--overview
- Реестр: `data-display.table`, статус `in-review`

## Контракт

- Нативная table-семантика с независимыми Cells, Headers, Columns и Paginator.
- Первый header row содержит названия колонок; второй отдельный Filter Row содержит поля и контролы фильтрации.
- Filter Row использует `TableFilterAction` с канонической filter icon и общим Context Menu для смены оператора поля; оператор и значение фильтра остаются consumer-owned state.
- Comfortable 48px и Compact 40px; Header всегда 48px.
- Плотность не должна сбрасывать значения, badge settings или file metadata.
- Строка может быть selected; отдельная ячейка может быть active, selected/editing, error или disabled.
- Read и Edit — разные interaction modes: Read подсвечивает строку целиком, Edit подсвечивает ячейку и запускает controlled editing по click/Enter/F2. В editing сама `td` является редактируемой поверхностью; вложенный Field/Input запрещён.
- Row context menu открывается общим `ContextMenu` по правому клику и получает стабильный `rowId`; локальные menu implementations внутри таблицы запрещены.
- File metadata используют IBM Plex Mono через `Technical/S/Default` и скрываются только визуально в Compact.
- `TableFileIcon` является inline SVG: ref имеет тип `SVGSVGElement`, прежние image-пропы `src`/`alt` удаляются; standalone-смысл задаётся через `aria-label`, декоративное использование — через `aria-hidden`.
- Все outline icons используют глобальный `Stroke/140 = 1.4px`.
- Усечённый контент переиспользует `Tooltip`; header actions переиспользуют `ContextMenu`; периодный фильтр строится на `DateRangePicker`.
- 16 source families и все их утверждённые states/densities документируются внутри одной Table family, а не разбрасываются по верхнему каталогу.
- Summary row, paginator и reorder handle собираются композиционно и не экспортируют Figma row counts как props.
- Reorder управляется потребителем: `Table.onRowReorder` + стабильный `TableRow.reorderId`; pointer/touch и клавиатура используют одну модель `activeId / overId / before|after`, а выбор строки сохраняется по бизнес-ID после смены позиции.

## Ownership

Figma владеет визуальной моделью, составом ячеек и плотностями. Tokens владеют значениями. React владеет API, DOM и поведением. Storybook подтверждает состояния, плотность, доступность и computed styles.
