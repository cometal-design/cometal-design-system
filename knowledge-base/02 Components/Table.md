# Table

`data-display.table` — составной data-display паттерн для больших бизнес-наборов данных.

## Источники

- Figma: [Table Review `2353:10833`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10833)
- Спецификация: [[../../specifications/components/table]]
- React: `packages/react/src/Table/Table.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/patterns-table--overview
- Реестр: `data-display.table`, статус `in-review`

## Контракт

- Нативная table-семантика с независимыми Header Cell, Row, Cell и File Cell.
- Comfortable 48px и Compact 40px; Header всегда 48px.
- Плотность не должна сбрасывать значения, badge settings или file metadata.
- Строка может быть selected; отдельная ячейка может быть active, selected/editing, error или disabled.
- File metadata используют IBM Plex Mono через `Technical/S/Default` и скрываются только визуально в Compact.
- Все outline icons используют глобальный `Stroke/140 = 1.4px`.

## Ownership

Figma владеет визуальной моделью, составом ячеек и плотностями. Tokens владеют значениями. React владеет API, DOM и поведением. Storybook подтверждает состояния, плотность, доступность и computed styles.
