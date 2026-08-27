# Widget + Table pattern

- Status: `in-review`
- Figma canonical composition: `3346:21724`; review evidence: `2702:2265`
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
- M2 itself changed no filter operator/reset/listbox behavior. M3 fixes that bounded contract below; final M4–M8 composition is recorded after the M3 section.

## M3 filter contract

- `WidgetTablePattern` owns one exhaustive typed filter registry and controlled state for all 13 visible columns: `position`, `name`, `grade`, `quantity`, `unit`, `price`, `sum`, `delivery`, `document`, `file`, `status`, `control`, `supplier`. State survives filter-row hide/show and ordinary rerenders; each active-filter change or per-column Reset returns pagination to page 1 without mutating selection, density, pinning, widths or sort state.
- Text operators are `contains`, `notContains`, `startsWith`, `empty`; Number: `equals`, `notEquals`, `greaterThan`, `lessThan`; Date: `equals`, `before`, `after`, `period`; Select: `equals`, `notEquals`, `selected`, `notSelected`. Unary operators ignore their control value; empty/invalid binary input is inactive. Date period is inclusive only for two valid ordered endpoints.
- Active predicates compose with logical AND before the M2 stable sort. Sorting runs on filtered current `orderedRows`; ties preserve that current order through `originalIndex`, and a filter reset does not reset sorting.
- Position reads only its position value. Text is normalized by trim plus `toLocaleLowerCase('ru-RU')`; numeric input accepts one decimal comma after stripping ordinary/NBSP/narrow-NBSP grouping separators; Delivery parses only `DD.MM.YYYY` to a calendar-day key; Sum remains derived `quantity × price`; Select options are finite deduplicated source-order values.
- Read and Edit use the same filter predicates and controller. Header ContextMenu owns the nested operator level and Reset; shared Select/Date overlays portal outside the Table shell without changing Table scroll or clipping ownership.

## M4–M8 composition contract

- `WidgetTablePattern` is a thin public composition of title, description, toolbar, Table payload and footer slots. Its CSS styles only its own slots and must not target Table, Field, Tooltip, ContextMenu or Button internals.
- The private source-only controller `packages/examples/src/widget-table/WidgetTableReviewExample.tsx`, consumed as `@cometal/examples/widget-table`, is the sole owner of the 120-row fixture, typed filters/sort, edit/reorder, global-by-ID selection, visibility, pin/width state, pagination, totals and toolbar callbacks. Storybook and Portal consume the same boundary; it is not a Widget API, a public package release or a new pattern identity.
- Read has row-wide hover, no drag/edit affordance and current-visible-page header selection scope while off-page selections persist. Edit has cell-local hover, controlled edit/reorder and the canonical Drag Column. Both preserve M1–M3 density/filter/sort contracts.
- `maxVisibleBodyRows={10}` delegates row-window, sticky head/filter/summary and native scrollport geometry to Table. Controller owns page size (`10/15/20/30`), page clamp/reset and current-visible-page totals; hidden summary is absent, not visually suppressed.
- Toolbar order is Density, Filters, Summary, Refresh, Download, then Edit-only Add. Each action uses shared Button/IconButton and an exact generated icon; toggles expose `aria-pressed`, while demo actions are bounded callbacks or explicitly disabled.
- Widget + Table remains a documented unregistered composition. No `pattern.widget-table` registry record or schema change is created in this wave.

## Exclusions

- Widget does not receive Table-specific props or state machine.
- Figma row counts and documentation dimensions are not API values.
- The pattern does not create separate cell, filter, file-icon or paginator implementations.
