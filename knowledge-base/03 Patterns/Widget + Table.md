# Widget + Table

- Status: In review
- Figma canonical composition: `3346:21724`; review evidence: `2702:2265`
- Storybook: `patterns-widget-with-table--overview`
- Portal: `/patterns/widget-table/`

## Назначение

Рабочий бизнес-паттерн для табличного содержимого внутри универсального Widget. Он связывает toolbar с Table, но не меняет API и ответственность базовых компонентов.

## Состав

- канонический Widget shell;
- каноническая Table с двумя уровнями header;
- все Table source families, summary и paginator;
- toolbar actions из Widget source;
- 10 строк демонстрационного контента из Figma Review.
- два явных режима: Read с построчным hover и Edit с hover/editing отдельной ячейки;
- Read не изменяет данные, не включает reorder и полностью исключает drag-column, а не показывает disabled-заглушку;
- Edit показывает drag-column, разрешает controlled reorder и переводит eligible TableCell в `editing`;
- функциональная панель Widget включает и скрывает всю строку итогов системной IconButton с канонической Outline-иконкой;
- в Edit сама TableCell автоматически становится `td[contenteditable][role=textbox]` без вложенного Input.
- M2 sorting: consumer-owned `WidgetTableReviewExample` сортирует ровно 12 headers — `position`, `name`, `grade`, `quantity`, `unit`, `price`, `sum`, `delivery`, `document`, `status`, `control`, `supplier`; `file` не sortable для однородного `Спецификация.pdf`, но сохраняет остальные Table surfaces.
- Header запрашивает `none → ascending → descending → none`; ties стабильны относительно текущего filtered `orderedRows` через `originalIndex`, а `none` возвращает текущий consumer order, сохраняя reorder/edits. Strings/status/control используют lexical `ru-RU` collation; quantity/price — numeric, sum — `quantity × price`, delivery — accepted `DD.MM.YYYY → YYYYMMDD`.
- M2 не расширял filter operator/reset/listbox. Их M3 contract ниже; финальная M4–M8 composition записана после него.
- M3: один typed registry управляет всеми 13 visible filters (`position`, `name`, `grade`, `quantity`, `unit`, `price`, `sum`, `delivery`, `document`, `file`, `status`, `control`, `supplier`). Active predicates объединяются AND до stable M2 sort; filter change/Reset возвращает page 1, а Reset не меняет sort или другие columns.
- Header ContextMenu владеет nested operator/reset level. Read и Edit используют общий controller; overlays shared Select/Date/DateRange portal не клипуются Table. Position остаётся column-scoped, Sum derived, ties сохраняют текущий filtered order через `originalIndex`.
- M4–M8: thin `WidgetTablePattern` соединяет Widget slots с Table/footer, а private source-only `packages/examples/src/widget-table/WidgetTableReviewExample.tsx` (consumer import `@cometal/examples/widget-table`) владеет fixture и controller для Storybook/Portal. Read selection глобален по ID, header действует только на текущей странице; Edit/reorder, visibility/pin/width, 10-row Table window, pagination `10/15/20/30` и current-page totals остаются controller/Table contract. Pattern не получает registry identity и не стилизует внутренности shared components; examples boundary не является Widget API или public package release.

## Граница

Widget может содержать не только Table. Table может использоваться без Widget. Их связка появляется только на уровне Pattern.
