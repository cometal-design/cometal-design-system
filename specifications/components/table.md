---
id: data-display.table
name: Table
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2814-8351"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-table--overview"
---

# Table

## Назначение

Большое семейство компонентов для чтения и редактирования структурированных бизнес-данных. Table собирается из независимых cells, headers, columns и paginator, но сохраняет нативную HTML table-семантику.

## Канонические Figma sources

- Table / Sources: `2814:8351`.
- Cells: `2353:9497`.
- Read Cell Component Set: `2353:9506`.
- Edit Cell Component Set: `2353:9656`.
- Paginator Source: `2353:10882`.
- Header Source: `2353:10891`.
- Main Components: `2353:9824`.
- Review `2353:10833` используется только как презентационное evidence и не определяет реализацию.

## Архитектура

- `Table` управляет общей плотностью и горизонтальным scroll container.
- `TableHead`, `TableBody` и `TableRow` сохраняют нативную структуру таблицы.
- Первый ряд `TableHeaderCell` содержит названия колонок, сортировку и context action.
- Второй независимый `TableFilterRow` содержит `TableFilterCell` с полями и контролами фильтрации; фильтры не передаются пропом в первый ряд.
- Каждый непустой filter control может содержать `TableFilterAction`: canonical `Outline/general/filter` использует 12px glyph в 16px Figma slot и открывает общий `ContextMenu` выбора оператора (`Содержит`, `Равно`, date/select equivalents).
- Figma `Read Cell` (`2353:9506`) задаёт типы Text, Number, Link, Badge, Text + Badge, Badge + Text, Number + Badge и File; состояния Default, Hover, Active, Selected и Disabled; плотности Comfortable и Compact.
- Figma `Edit Cell` (`2353:9656`) задаёт типы Text, Number, Dropdown и File; состояния Default, Hover, Active, Editing, Selected, Error и Disabled; плотности Comfortable и Compact.
- `editing` и `error` не применяются к Read Cell. `dragging` принадлежит служебному Drag Handle Cell, а не основной Read/Edit Cell.
- `TableFileCell` хранит имя и размер файла в одном источнике; Compact скрывает только вторичную строку размера.
- `TableSelectionHeader` и `TableSelectionCell` используют общий Checkbox.
- `TableIndexCell`, `TableDragCell`, `TableDragHandle`, `TableContextAction`, `TableSummaryCell` и `TablePaginator` остаются композиционными кирпичиками.
- `TableFileCell` использует один из девяти утверждённых file assets: word, excel, file, doc, sheets, adobe, zip, pdf, image.
- `TableFileIcon` рендерит канонический inline SVG и передаёт ref как `SVGSVGElement`; при миграции с прежнего image API необходимо удалить `src`/`alt` и использовать `aria-label` только для смысловой standalone-иконки либо `aria-hidden` для декоративной.
- Header actions переиспользуют `ContextMenu`; Table не владеет отдельным menu API.
- Date range filter переиспользует `DateRangePicker`; paginator, summary row и reorder handle собираются как composition primitives вокруг таблицы.
- Row reorder остаётся controlled: `Table.onRowReorder` сообщает `activeId`, `overId` и `before | after`, `TableRow.reorderId` связывает DOM со стабильной бизнес-сущностью, а `reorderTableRows` иммутабельно обновляет consumer-owned данные.
- Selection относится к строке, selected/editing/error относятся к конкретной ячейке.
- `Table.mode="read"` задаёт hover всей строки, исключает cell edit entry и принудительно отключает reorder. Drag header, drag filter cell и drag body cell в Read не рендерятся: пустая либо disabled drag-колонка запрещена.
- `Table.mode="edit"` задаёт hover отдельной ячейки, разрешает controlled row reorder и переводит `TableCell.editable` в `editing` по click/Enter/F2.
- В `editing` редактируемой поверхностью автоматически становится сама `TableCell` (`td[contenteditable=true][role=textbox][aria-multiline=false]`); consumer не должен вручную собирать эту семантику. Вложенный `TextField` или локальный `input` не создаётся. `Enter` завершает ввод, `Escape` отменяет локальное изменение.
- Вычисляемые и бизнес-заблокированные значения могут оставаться Read Cell внутри Edit table; это должно быть явно задано consumer-логикой, а не возникать из отсутствующего обработчика.
- `Table.rowContextMenu` переиспользует общий pointer-anchored `ContextMenu`; `TableRow.rowId` связывает меню со стабильной бизнес-сущностью. Правый клик по строке не создаёт локальный menu primitive.
- Закрепление колонок остаётся controlled: `Table.pinnedColumnIds` хранит consumer, а `onPinnedColumnIdsChange` получает идентификаторы, нормализованные по текущему DOM/визуальному порядку колонок.
- `columnId` должен быть одинаковым у `TableHeaderCell`, `TableFilterCell`, body cell и `TableSummaryCell` одной колонки. `Table` измеряет фактические ширины первого header row через `ResizeObserver`, вычисляет накопленные left offsets и применяет их ко всем этажам колонки.
- Контекстное меню использует `TableColumnPinAction`: «Закрепить слева» / «Открепить слева» меняет только controlled список. Можно закрепить произвольные 1..N колонок; порядок кликов не меняет их визуальный порядок.
- Последняя закреплённая колонка получает системный separator/shadow. Pinned header, filter, body и summary сохраняют собственные surface tokens, включая selected, editing и error, поверх прокручиваемых колонок.
- Resize остаётся controlled: `Table.columnWidths` хранит ширины по стабильным `columnId`, а `onColumnWidthsChange` получает полный следующий record. Компонент не пишет в storage; продукт может сохранять record в профиле пользователя или local persistence.
- У data header с `columnId` separator доступен pointer и клавиатурой. Pointer drag использует capture и курсор `col-resize`; `ArrowLeft/ArrowRight` меняют ширину на 8px, Shift — на 32px, `Home` возвращает token minimum. Utility columns Index, Selection и Drag не resizeable.
- Одна controlled ширина применяется к header, filter, body и summary. Pin/unpin, density и rerender не сбрасывают её; изменение ширины pinned column немедленно пересчитывает накопленные sticky offsets следующих закреплённых колонок.

## Плотность

- `comfortable`: ячейка 48px; file metadata видимы.
- `compact`: ячейка 40px; file metadata визуально скрыты, но не удаляются из DOM и данных.
- Column Header остаётся 48px в обеих плотностях.
- Index и selection columns меняют ширину синхронно с высотой ячейки: 48px или 40px.

## Контент

- Текст выравнивается влево, числовые значения вправо, служебные index/selection cells по центру.
- Переполнение заголовков и значений уходит в ellipsis.
- File icon имеет нейтральный tertiary color и Stroke/140; размер иконки 24px.
- File name использует Caption & Label/Label, file size использует Technical/S/Default.
- Все column actions должны иметь доступное имя; icon-only action использует hit area 24×24.
- Состав Figma по количеству строк и карточек не копируется в React props; код публикует reusable behavioral contract, а не статический layout snapshot.

## Accessibility

- Используются нативные `table`, `thead`, `tbody`, `tr`, `th`, `td`.
- Сортировка публикуется через `aria-sort` на column header.
- Таблица без видимого caption получает `aria-label`.
- Error cells публикуют `aria-invalid`; disabled cells публикуют `aria-disabled`.
- Встроенные Checkbox сохраняют нативную input-семантику и видимое либо скрытое доступное имя.
- Reorder handle, paginator и header menu остаются клавиатурно достижимыми и не ломают табличный фокус-порядок.
- Reorder начинается только с drag handle. Pointer/touch показывает active row и before/after insertion marker; Space/Enter поднимает или отпускает строку, Arrow Up/Down меняют порядок, Escape завершает режим, изменения озвучиваются через polite live region.
- Read hover применяется ко всей строке; edit hover — только к доступной ячейке. Enter/F2 и pointer click вызывают controlled edit entry, но интерактивный дочерний control не запускает его повторно.
- Правый клик по body row открывает общий Context Menu у координат pointer; меню получает `rowId`, а не индекс строки.
- Pin/unpin доступен из клавиатурно управляемого Context Menu. Горизонтальная прокрутка оставляет закреплённые колонки у левого края, а незакреплённые проходят под ними без изменения нативного фокус-порядка.

## Acceptance criteria

- [x] Comfortable и Compact меняют плотность без потери пользовательского контента.
- [x] Header остаётся 48px; index/selection columns меняют ширину 48px → 40px.
- [x] File metadata отображаются только в Comfortable и сохраняются в Compact.
- [x] Все outline SVG используют Stroke/140 = 1.4px.
- [x] Component/Table и Semantic color variables опубликованы в token source.
- [x] Tooltip, Context Menu, Date Range filter, summary row, paginator и reorder handle переиспользуют общие primitives.
- [ ] Unit и Storybook interaction checks пройдены на итоговом локальном SHA.
- [ ] Независимый Visual QA подтвердил полное совпадение с пятью canonical source nodes.
- [x] Registry, specification, Storybook и knowledge base связаны стабильным ID.
- [x] Read полностью исключает drag-column и не активирует `onRowReorder`; Edit сохраняет drag-column и reorder.
- [x] Состояние Edit Cell / Editing делает саму `td` textbox-поверхностью без вложенного input.
- [x] Controlled pinning синхронизирует header/filter/body/summary, использует фактические widths и DOM-порядок.
- [x] Controlled resizing синхронизирует все этажи колонки и сохраняет keyboard/pointer contract независимо от pinning.
- [ ] Frontend Lead acceptance подтверждён.
