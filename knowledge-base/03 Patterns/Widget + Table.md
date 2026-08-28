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
- M4–M8: thin `WidgetTablePattern` соединяет Widget slots с Table/footer, а source-only `packages/examples/src/widget-table/WidgetTableReviewExample.tsx` (consumer import `@cometal/examples/widget-table`) владеет единым fixture/controller для основного Table overview и Widget + Table в Storybook/Portal. `TableReviewExample` рендерит тот же контракт без Widget chrome. Read selection глобален по ID, header действует только на текущей странице; Edit/reorder, visibility/pin/width, 10-row Table window, pagination `10/15/20/30` и current-page totals остаются controller/Table contract. Pattern не получает registry identity и не стилизует внутренности shared components; examples boundary не является Widget API или public package release.

## Граница

Widget может содержать не только Table. Table может использоваться без Widget. Их связка появляется только на уровне Pattern.

## M9 production evidence

The unregistered composition is published from exact SHA `3823dc97de75eff3ab3a0a4635c8fb75e5d17080`, deployment `dpl_2iARNdGJ5vLZW7894BQWkLdNxPUy`: [portal](https://cometal-design-system-storybook.vercel.app/patterns/widget-table/) and [Storybook](https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/patterns-widget-with-table--overview). Role 40 independently verified both production surfaces. Publication does not create `pattern.widget-table` or publish `@cometal/examples`.

## 2026-08-28 source synchronization

- Implementation candidate: `d8590da0e807e8625be047b53f875fc9dea4d29b`.
- The pattern and the standalone Table overview now consume one `WidgetTableReviewExample` / `TableReviewExample` controller instead of duplicating columns, filters and interaction rules inside their pages or stories.
- Widget remains composition chrome only. The underlying Table contract is identical on both surfaces; the standalone variant omits Widget chrome without substituting a simplified local table.
- Verified before source closure: Docs and Storybook production builds passed; the component-page content audit passed `15/15`; filter operator/reset are available through the header context menu and no longer appear as a second action icon inside filter fields.
- Published production source closure: SHA `8f5156d6c2972f62ac395c18c18e87bb22268828`, deployment `dpl_BQKaMGcec2X95Yt3soyrczfDYUkw`, immutable `https://cometal-design-system-storybook-fffwftydg.vercel.app`. Public metadata returns the exact SHA; the public pattern renders Read/Edit with the same 13 business columns as Table, `0` local filter actions and `26` canonical header context actions. This publication check does not issue an independent QA approval.
