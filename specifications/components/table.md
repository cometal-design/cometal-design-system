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
- Paginator Source: `2353:10882`.
- Header Source: `2353:10891`.
- Main Components: `2353:9824`.
- Review `2353:10833` используется только как презентационное evidence и не определяет реализацию.

## Архитектура

- `Table` управляет общей плотностью и горизонтальным scroll container.
- `TableHead`, `TableBody` и `TableRow` сохраняют нативную структуру таблицы.
- Первый ряд `TableHeaderCell` содержит названия колонок, сортировку и context action.
- Второй независимый `TableFilterRow` содержит `TableFilterCell` с полями и контролами фильтрации; фильтры не передаются пропом в первый ряд.
- `TableCell` поддерживает состояния `default`, `active`, `selected`, `editing`, `error`, `disabled`.
- `TableFileCell` хранит имя и размер файла в одном источнике; Compact скрывает только вторичную строку размера.
- `TableSelectionHeader` и `TableSelectionCell` используют общий Checkbox.
- `TableIndexCell`, `TableDragCell`, `TableDragHandle`, `TableContextAction`, `TableSummaryCell` и `TablePaginator` остаются композиционными кирпичиками.
- `TableFileCell` использует один из девяти утверждённых file assets: word, excel, file, doc, sheets, adobe, zip, pdf, image.
- Header actions переиспользуют `ContextMenu`; Table не владеет отдельным menu API.
- Date range filter переиспользует `DateRangePicker`; paginator, summary row и reorder handle собираются как composition primitives вокруг таблицы.
- Selection относится к строке, selected/editing/error относятся к конкретной ячейке.

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
- [ ] Frontend Lead acceptance подтверждён.
