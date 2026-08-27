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
- Плотность применяется ко всей Table: Comfortable 48px и Compact 40px для header, filter row, body, summary и квадратных utility cells. Обычные data-column widths остаются content/user-resized; существующие S filters — 32px.
- Плотность не должна сбрасывать значения, badge settings или file metadata.
- Строка может быть selected; отдельная ячейка может быть active, selected/editing, error или disabled.
- Read и Edit — разные interaction modes: Read подсвечивает строку целиком, Edit подсвечивает ячейку и запускает controlled editing по click/Enter/F2. В editing сама `td` является редактируемой поверхностью; вложенный Field/Input запрещён.
- Каноническая матрица ячеек разделена на `Read Cell` `2353:9506` (8 типов, 5 состояний, 2 плотности) и `Edit Cell` `2353:9656` (4 типа, 7 состояний, 2 плотности). `Editing` и `Error` принадлежат только Edit.
- Read mode на границе `Table` блокирует reorder и полностью исключает drag header/filter/body cells. Edit mode допускает drag-column только вместе с controlled `onRowReorder` и стабильным `reorderId`.
- `TableCell` сам публикует `contenteditable=true`, `role=textbox` и `aria-multiline=false`, когда editable cell переходит в `editing`; consumer хранит значение и commit/cancel, но не пересобирает DOM-контракт.
- Row context menu открывается общим `ContextMenu` по правому клику и получает стабильный `rowId`; локальные menu implementations внутри таблицы запрещены.
- File metadata используют IBM Plex Mono через `Technical/S/Default` и скрываются только визуально в Compact.
- `TableFileIcon` является inline SVG: ref имеет тип `SVGSVGElement`, прежние image-пропы `src`/`alt` удаляются; standalone-смысл задаётся через `aria-label`, декоративное использование — через `aria-hidden`.
- Все outline icons используют глобальный `Stroke/140 = 1.4px`.
- Усечённый контент переиспользует `Tooltip`; header actions переиспользуют `ContextMenu`; периодный фильтр строится на `DateRangePicker`.
- 16 source families и все их утверждённые states/densities документируются внутри одной Table family, а не разбрасываются по верхнему каталогу.
- Summary row, paginator и reorder handle собираются композиционно и не экспортируют Figma row counts как props.
- Reorder управляется потребителем: `Table.onRowReorder` + стабильный `TableRow.reorderId`; pointer/touch и клавиатура используют одну модель `activeId / overId / before|after`, а выбор строки сохраняется по бизнес-ID после смены позиции.
- В Read и Edit длинное «Наименование» остаётся однострочным. Системный Tooltip показывает полное значение только когда изменение ширины колонки реально обрезало текст; при достаточной ширине и в editing state он отключён.
- Успешный pointer-drop примерно на секунду сохраняет ту же selected-подсветку, что видна во время drag, под контентом перемещённой строки в новом месте и затем мягко убирает её; keyboard reorder не анимируется.
- Закрепление колонок тоже controlled: consumer хранит `Table.pinnedColumnIds`, `TableColumnPinAction` вызывает `onPinnedColumnIdsChange`, а результат всегда нормализуется по DOM/визуальному порядку, не по порядку кликов.
- Одинаковый `columnId` связывает header, filter, body и summary одной колонки. Table измеряет фактические header widths через `ResizeObserver`, накапливает left offsets и сохраняет sticky layering для default/selected/editing/error surfaces в обеих плотностях.
- Каждая cell изолирует собственные внутренние z-слои; sticky column остаётся непрозрачной, а прокручиваемые значения проходят под ней, не поверх текста и фона.
- Последняя pinned column показывает separator/shadow; при horizontal scroll остальные колонки проходят под закреплёнными. Read по-прежнему не рендерит drag-column, Edit сохраняет её.
- Ширина колонки — отдельное controlled состояние `columnWidths`, связанное тем же `columnId`. Separator заголовка поддерживает pointer drag и клавиатуру; utility columns остаются фиксированными. Изменение ширины синхронно применяется ко всем этажам и пересчитывает offsets pinned columns.
- Table намеренно не владеет storage. Consumer хранит record в React state и при необходимости персистит его в пользовательских настройках; поэтому pin/unpin, density и rerender не должны менять заданный размер.
- M2 Header source: `Column Header` `2353:10896`, `Selection Header` `2353:10934`, `Context Action` `2482:5611`, `Resize Separator` `3305:39754`. Header atom публикует controlled cycle `none → ascending → descending → none`, native sort button и `aria-sort`; consumer владеет comparator и row ordering.
- Ascending/Descending используют exact generated `arrow-up-sm` `700:14369` / `down-arrow-sm` `700:14384` в `16×16`, `currentColor`, Stroke/140 `1.4px`, без transforms. Header 48px/40px не имеет отличимого full-cell Hover/Active; сортировка и Context Action имеют focus ring `2px` с offset `4px`.
- Resize Separator — внутренний 8px visual source: transparent 1px default line, одинаковая 2px focus-ring line для Hover/Resizing/Focus-visible. M2 не менял filters; их M3 contract ниже. Row/pinning/pagination work остаётся M4+.
- M3 Filter Row `2530:5631`: 13 typed controlled filters принадлежат Widget pattern; operator и per-column Reset живут в header ContextMenu. Table задаёт external `48/40` geometry (`8/4` vertical inset вокруг 32px S control), Field/Select — внутренний `spacing-50` `8px` inset.
- Filtering идёт AND-before-stable-sort и не сбрасывает M2 sort; Select/Date/DateRange overlays используют shared portal и не требуют изменения Table clipping/scroll. Keyboard focus controls — один `2px` ring с `4px` offset; pointer не добавляет wrapper ring.
- M4–M8 visual sources: Read/Edit `2353:9506` / `2353:9656`, Drag `2778:8307`, Summary `2760:8131`, Paginator `2371:29654` + `2851:11088`; `3346:21724` is the four-variant Widget Table composition source, not an identity.
- Table owns Read/Edit boundaries, current-page header selection scope, controlled pin/width/visibility behavior, native scrollport/custom projections, `maxVisibleBodyRows`, paginator primitives and sticky summary rendering. Consumer/controller owns stable IDs, data, filtering/sort, page state and supplied current-page totals. TW-017 is closed for the written contract: Table-private Drag Handle master `2778:8288`, visible proxy `2778:8292`, and `packages/react/src/Table/assets/drag-handle.svg` SHA-256 `8f81f24ef877dc08ff635cb35c82f39204fdec88db95a4eb209a7498eb3a32b2`; it is not a general icon export.

## Ownership

Figma владеет визуальной моделью, составом ячеек и плотностями. Tokens владеют значениями. React владеет API, DOM и поведением. Storybook подтверждает состояния, плотность, доступность и computed styles.
