---
id: data-display.table
name: Table
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10833"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/patterns-table--overview"
---

# Table

## Назначение

Составной паттерн для чтения и редактирования структурированных бизнес-данных. Table собирается из независимых header cells, rows и cells, но сохраняет нативную HTML table-семантику.

## Архитектура

- `Table` управляет общей плотностью и горизонтальным scroll container.
- `TableHead`, `TableBody` и `TableRow` сохраняют нативную структуру таблицы.
- `TableHeaderCell` поддерживает сортировку, context action и единый второй этаж фильтра.
- `TableCell` поддерживает состояния `default`, `active`, `selected`, `editing`, `error`, `disabled`.
- `TableFileCell` хранит имя и размер файла в одном источнике; Compact скрывает только вторичную строку размера.
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

## Accessibility

- Используются нативные `table`, `thead`, `tbody`, `tr`, `th`, `td`.
- Сортировка публикуется через `aria-sort` на column header.
- Таблица без видимого caption получает `aria-label`.
- Error cells публикуют `aria-invalid`; disabled cells публикуют `aria-disabled`.
- Встроенные Checkbox сохраняют нативную input-семантику и видимое либо скрытое доступное имя.

## Acceptance criteria

- [x] Comfortable и Compact меняют плотность без потери пользовательского контента.
- [x] Header остаётся 48px; index/selection columns меняют ширину 48px → 40px.
- [x] File metadata отображаются только в Comfortable и сохраняются в Compact.
- [x] Все outline SVG используют Stroke/140 = 1.4px.
- [x] Component/Table и Semantic color variables опубликованы в token source.
- [x] Unit и Storybook interaction checks добавлены.
- [x] Registry, specification, Storybook и Obsidian связаны стабильным ID.
- [ ] Frontend Lead acceptance подтверждён.
