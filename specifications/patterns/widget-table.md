# Widget + Table pattern

- Status: `in-review`
- Figma evidence: `2702:2265`
- Storybook: `patterns-widget-with-table--overview`
- React source: `packages/react/src/Patterns/WidgetTablePattern.tsx`

## Composition contract

- `Widget` owns the named region, title, optional description, toolbar slot, Raised surface, 32px outer radius and 24px inset.
- `Table` owns native table semantics, the column-header floor, the synchronized filter floor, cells, selection, sort, context actions, summary and paginator.
- `WidgetTablePattern` only joins the accepted components and keeps the paginator inside the Widget content payload.
- The documentation example contains 10 rows and the column/content vocabulary from Figma Widget Review; example data is not public API.

## Behavior

- Toolbar filter action toggles the whole second header floor without reconstructing Widget.
- Text/status filters alter rows; density changes body geometry while preserving selection and query state.
- The Widget toolbar exposes a system `IconButton` that shows or hides the complete summary row without changing filters, selection, density, pinning or row data.
- Sort, selection, column context actions and paginator retain their component-owned keyboard behavior.
- Table overflow remains inside the labelled scroll region; Widget does not clip focus rings or overlays.
- Pattern documentation always exposes two explicit compositions: `Read` and `Edit`.
- `Read` applies hover to the complete row and has no editable cells, row reorder or destructive row action. The drag column is absent at header, filter and body levels; a disabled placeholder column is not allowed.
- `Edit` applies hover to one cell and exposes the drag column for controlled row reorder. Activation moves an eligible cell to the canonical `editing` state and the shared `TableCell` automatically makes that `td` the textbox surface; it must not mount a nested input.
- Both `Read` and `Edit` expose the shared `TableColumnPinAction` in column menus. The pattern stores `pinnedColumnIds`, while Table owns DOM-order normalization, measured offsets, sticky layering and the last-pinned separator.
- Pinning never creates a drag placeholder in `Read`; `Edit` keeps the real drag column, and pinned header/filter/body/summary cells remain synchronized across density changes and horizontal scrolling.
- Both `Read` and `Edit` keep a controlled `columnWidths` record. Header separators resize the complete column with pointer or keyboard; the same width survives density and pin/unpin changes, while Table recalculates pinned offsets from the resized geometry.

## M2 sorting contract

- In the accepted Widget data, exactly 12 headers are sortable: `position`, `name`, `grade`, `quantity`, `unit`, `price`, `sum`, `delivery`, `document`, `status`, `control`, `supplier`. `file` is explicitly non-sortable because every accepted row has the same `Спецификация.pdf` value; it keeps its label, filter cell, file cell, Context Action, pinning and resize surface.
- `WidgetTableReviewExample` owns sort direction, comparator semantics and stable row ordering. A header requests only `none → ascending → descending → none`; `none` exposes the current consumer-owned filtered `orderedRows`, not an immutable module seed, so prior reorder or consumer edits remain intact.
- `position`, `name`, `grade`, `unit`, `document` and `supplier` use `Intl.Collator('ru-RU', { numeric: true, sensitivity: 'base' })`; `quantity` and `price` use numeric subtraction; `sum` compares derived `quantity × price`; `delivery` parses accepted `DD.MM.YYYY` values as numeric `YYYYMMDD`; `status` and `control` use the same lexical `ru-RU` collation without invented domain ranking.
- Sorting operates on the filtered copy of current `orderedRows`. Equal values retain that current order via `originalIndex`; direction inversion applies only to nonzero comparison results, so ties remain stable in both directions.
- M2 changes no filter operator/reset/listbox behavior, row menu, Read/Edit cells, new pinning or resize behavior, pagination, totals, scroll window or Widget toolbar work; those remain M3+ pending.

## Exclusions

- Widget does not receive Table-specific props or state machine.
- Figma row counts and documentation dimensions are not API values.
- The pattern does not create separate cell, filter, file-icon or paginator implementations.
