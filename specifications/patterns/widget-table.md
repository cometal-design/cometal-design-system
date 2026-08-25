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
- Sort, selection, column context actions and paginator retain their component-owned keyboard behavior.
- Table overflow remains inside the labelled scroll region; Widget does not clip focus rings or overlays.
- Pattern documentation always exposes two explicit compositions: `Read` and `Edit`.
- `Read` applies hover to the complete row and has no editable cells, row reorder or destructive row action. The drag column is absent at header, filter and body levels; a disabled placeholder column is not allowed.
- `Edit` applies hover to one cell and exposes the drag column for controlled row reorder. Activation moves an eligible cell to the canonical `editing` state and the shared `TableCell` automatically makes that `td` the textbox surface; it must not mount a nested input.
- Both `Read` and `Edit` expose the shared `TableColumnPinAction` in column menus. The pattern stores `pinnedColumnIds`, while Table owns DOM-order normalization, measured offsets, sticky layering and the last-pinned separator.
- Pinning never creates a drag placeholder in `Read`; `Edit` keeps the real drag column, and pinned header/filter/body/summary cells remain synchronized across density changes and horizontal scrolling.

## Exclusions

- Widget does not receive Table-specific props or state machine.
- Figma row counts and documentation dimensions are not API values.
- The pattern does not create separate cell, filter, file-icon or paginator implementations.
