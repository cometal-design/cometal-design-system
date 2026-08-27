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
- M4–M8 leaf roles: Read Cell `2353:9506`, Edit Cell `2353:9656`, Selection Cell `2353:9766`, Index Cell `2353:9799`, Drag Cell `2778:8307`, Summary `2760:8131`, Read/Edit Columns `2353:9830` / `2353:10334`, Paginator component/control `2371:29654` / `2851:11088`. New Widget Table content set `3346:21724` is a canonical composition source with `Mode=Read|Edit` and `Density=Comfortable|Compact`, not a new registry identity.

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
- Длинные значения, для которых критично прочитать полный текст, используют системный `Tooltip` только при фактическом визуальном truncation; пример Widget + Table демонстрирует это в колонке «Наименование» для Read и Edit, не показывая tooltip при свободном месте или во время редактирования.
- После успешного pointer-drop перемещённая строка кратко сохраняет ту же каноническую selected-поверхность, что видна во время drag, под читаемым контентом в новой позиции и плавно гасит её; insertion marker исчезает сразу, keyboard reorder остаётся мгновенным.
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
- Header, filter, body и summary cells создают локальный stacking context: контент незакреплённых колонок не может рисоваться поверх непрозрачной поверхности pinned column при horizontal scroll в Read или Edit.
- Resize остаётся controlled: `Table.columnWidths` хранит ширины по стабильным `columnId`, а `onColumnWidthsChange` получает полный следующий record. Компонент не пишет в storage; продукт может сохранять record в профиле пользователя или local persistence.
- У data header с `columnId` separator доступен pointer и клавиатурой. Pointer drag использует capture и курсор `col-resize`; `ArrowLeft/ArrowRight` меняют ширину на 8px, Shift — на 32px, `Home` возвращает token minimum. Utility columns Index, Selection и Drag не resizeable.
- Одна controlled ширина применяется к header, filter, body и summary. Pin/unpin, density и rerender не сбрасывают её; изменение ширины pinned column немедленно пересчитывает накопленные sticky offsets следующих закреплённых колонок.

## Плотность

- `comfortable`: ячейка 48px; file metadata видимы.
- `compact`: ячейка 40px; file metadata визуально скрыты, но не удаляются из DOM и данных.
- Плотность применяется ко всей Table: Comfortable — 48px, Compact — 40px для header, filter row, body, summary и квадратных utility cells. Обычные data columns сохраняют content/user-resized ширины, а существующие S filters остаются 32px.
- Index и selection columns меняют ширину синхронно с высотой ячейки: 48px или 40px.

## M2: Column Header и sorting

- Канонические M2 sources: `Column Header` `2353:10896`, `Selection Header` `2353:10934`, `Context Action` `2482:5611` и внутренний `Resize Separator` `3305:39754` в `Header Source` `2353:10891`.
- `TableHeaderCell` — controlled atom: он публикует native sort button, `aria-sort` только для активного направления, доступное имя следующего действия и запрос цикла `none → ascending → descending → none`; сравнение и изменение порядка строк остаются consumer-owned.
- Ascending использует сгенерированный `Outline/arrows/arrow-up-sm` (`700:14369`), Descending — `Outline/arrows/down-arrow-sm` (`700:14384`). Обе иконки рендерятся в slot `16×16` с `currentColor`, центрированным круглым Stroke/140 = `1.4px` и выбранным sort color role; запрещены transform, rotation, redraw и подмена иконки.
- Density применяется к header: Comfortable `48px`, Compact `40px`. Unsorted full-cell Hover является compatibility alias Default и пиксельно от него не отличается; отдельного Active/Pressed visual state нет. Sorted Ascending/Descending сохраняют selected surface, text и icon roles.
- Focus-visible охватывает полный control `Label + Sort` и Context Action: `2px` Global State Focus Ring с прозрачным offset `4px`, без clipping в обеих плотностях. Context Action сохраняет только свои общие Default/Hover/Open states.
- Resize Separator — исключительно визуальный внутренний source: full-height hit-area `8px`; в Default центральная внутренняя линия `1px` прозрачна и оставляет видимым grid divider, а Hover, Resizing и Focus-visible используют одинаковую центральную `2px` Global State Focus Ring line. Pointer/keyboard resize, min-width, persistence, sticky offsets и final-column mechanics не меняются в M2.
- M2 сам не менял filter operator/reset/listbox/DatePicker; их M3 contract приведён ниже. Row context menu, Read/Edit cell behavior, column hide/pinning/resize behavior, pagination и toolbar work остаются M4+.

## M3: Filter Row и shared controls

- Канонический `Filter Row` — `2530:5631`. `TableFilterRow` содержит ровно 13 typed filter cells: `position`, `name`, `grade`, `quantity`, `unit`, `price`, `sum`, `delivery`, `document`, `file`, `status`, `control`, `supplier`; видимый filter не может быть inert или presentation-only.
- Внешняя geometry принадлежит Table: Comfortable row `48px` с inset `8px` вокруг S control `32px`; Compact row `40px` с vertical inset `4px` и тем же horizontal inset `8px`. Внутренний S inset принадлежит Field/Select и использует существующий `spacing-50` (`8px`), без локального Table padding override.
- Text filters обслуживают Position, Name, Grade, Document и File; Number `TextField` с numeric input mode — Quantity, Price и derived Sum; `Select` — Unit, Status, Control и Supplier; Delivery использует `DatePicker`, Period — `DateRangePicker`. Text/number controls не получают duplicate filter icon; Select использует shared chevron, date/period — shared calendar icon.
- Operator selection и per-column Reset принадлежат nested level существующего header `ContextMenu`, не самому input. Reset атомарно очищает значение (и range при наличии), возвращает default operator конкретного kind и page 1, не меняя sort или другие columns.
- Consumer/pattern combines active predicates with logical AND before the M2 stable sort. Sort then operates on filtered current consumer order; filter reset does not reset sort.
- Table не меняет clipping/scroll/sticky ownership ради overlay: Select, DatePicker и DateRangePicker используют shared body-portal behavior. Открытая surface остаётся частью interaction boundary и следует anchor; listbox/calendar не клипуются shell или scroll container.

## M4–M8: reusable Table boundary

- `mode="read"` исключает drag columns и edit entry даже при supplied reorder/edit callbacks. Row-wide hover и selection различны: selection consumer-owned by stable `rowId`, инициируется только Checkbox/header/menu action, сохраняется через filter/sort/page/density; header Checkbox считает и меняет только current visible page slice.
- `rowContextMenu` остаётся neutral API по stable `rowId`: pointer context-click и `Shift+F10`/ContextMenu key открывают один shared menu, keyboard dismissal возвращает exact originating focus target. Table не создаёт business navigation, deletion или confirmation workflow.
- `mode="edit"` даёт только cell-local hover. Eligible cell enters through click/Enter/F2; `td[contenteditable][role=textbox][aria-multiline=false]` остаётся единственной editing surface. Consumer owns draft, validation, persistence and blur rule; invalid draft stays visible with `state="error"`/`aria-invalid`, Enter commits valid data, Escape restores previous value. Displayed Position is not entity identity.
- Reorder remains controlled and stable-ID based: pointer and keyboard share one before/after model and polite live announcement; cancel/lost capture does not mutate order. Post-drop confirmation uses the existing selected surface and motion foundations. Exact generated Drag Handle provenance remains an unresolved upstream dependency (TW-017); this specification does not claim its closure.
- Column visibility is consumer-owned by stable column ID and applies consistently to header/filter/body/summary; the last visible data column is protected. Pin IDs and width record remain controlled: Table normalizes active visible pins by DOM order, measures actual header widths for sticky offsets, rejects invalid widths and synchronizes all floors. Resize pointer updates are rAF-coalesced; Arrow uses 8px, Shift 32px and Home the current minimum.
- Native `.cometal-table-scroll` is the labelled horizontal/vertical scroll owner. Table-internal custom scrollbar projections preserve native wheel/trackpad/touch/keyboard scrolling, their own ARIA/capture cleanup and safe corner; Pattern never owns them.
- `maxVisibleBodyRows?: number` is the sole M4–M8 public delta. Undefined preserves standalone uncapped body; a finite positive integer caps visible data body rows only. Table owns scrollport max block size and sticky header/filter/summary calculations; it receives neither data, totals, page state nor persistence API.
- `TablePaginator` remains controlled through page/pageCount/pageSize callbacks and composes shared Button/IconButton/Select. Table renders consumer-supplied summary values only. In the accepted shared controller: page sizes `10/15/20/30`, a nine-page window with non-interactive ellipsis, current-visible-page summary, and summary visibility independent from filter/sort/selection.

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
- Sort button поддерживает pointer, Enter и Space; `aria-sort` описывает только текущее активное направление, а его доступное имя сообщает следующее действие в цикле `none → ascending → descending → none`.
- Filter controls сохраняют собственную keyboard/ARIA семантику; keyboard/programmatic focus показывает один shared `2px` ring с offset `4px`, pointer activation wrapper ring не показывает.
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
- [x] Comfortable/Compact применяют 48px → 40px ко всей Table (header, filter row, body, summary и квадратным utility cells); обычные data-column widths остаются content/user-resized, S filters — 32px.
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
