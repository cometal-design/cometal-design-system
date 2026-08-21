# Table behavior and accessibility

## Evidence boundary

Canonical Figma sources contain zero prototype reaction nodes. Behavior below is separated into:

- **Approved**: stated on `Table / Review`, `Table / Principles` or repeatedly approved during component design;
- **Platform requirement**: required to make the approved visual contract operable and accessible on web;
- **Decision required**: not specified and must not be invented silently.

## Modes

### Read

- **Approved**: displays text, numbers, links, badges and file content without editable controls.
- **Approved**: a passive cell does not enter `Editing`.
- **Platform requirement**: links, checkboxes, context actions and other interactive descendants remain keyboard reachable.

### Edit

- **Approved**: arrow navigation changes the current cell.
- **Approved**: `Enter` or double click moves an editable text/number cell from `Selected` to `Editing`.
- **Approved**: select-like cells open their Dropdown/Listbox rather than becoming free-text inputs.
- **Decision required**: commit key, cancel key, blur behavior and asynchronous validation timing.

## Cell and row states

| State | Meaning | Visual/semantic rule |
|---|---|---|
| Default | Passive available cell | Default surface and primary content |
| Hover | Pointer is over an available cell | Hover surface only; must not imply selection |
| Active | Row selected through selection control | Sand row surface; content keeps normal semantics |
| Selected | Current cell for keyboard navigation | Blue selected surface/content; one current cell at a time |
| Editing | Current cell is accepting input | Editing affordance/caret or owned interactive control |
| Error | Cell failed validation | Error surface and content; `aria-invalid=true` where applicable |
| Disabled | Value unavailable by role/context | Disabled surface/content; no interactive activation |
| Dragging | Row reorder is in progress | Drag Handle-specific feedback; table geometry remains stable |

`Active`, `Selected` and `Editing` are distinct. A selected row can contain a separately selected or editing cell.

## Selection

- **Approved**: Checkbox is 20 px in both densities.
- **Approved**: unchecked/checked row controls and unchecked/mixed/checked header control are supported.
- **Approved**: checking a row applies the Active row surface.
- **Approved**: header Checked selects all available rows; Mixed means only some available rows are selected.
- **Platform requirement**: use native checkbox semantics and `aria-checked="mixed"` for Mixed.
- **Platform requirement**: disabled rows are excluded from bulk selection unless the product explicitly permits otherwise.

## Sorting

- **Approved**: sort icon appears before the header label.
- **Approved**: states are None, Ascending and Descending.
- **Approved**: repeated activation cycles `None -> Ascending -> Descending -> None`.
- **Platform requirement**: expose `aria-sort` on the active column header and a button label that names the next action.
- **Platform requirement**: activate with `Enter` or `Space`.

## Header context action

- **Approved**: 24x24 hit area; 16x16 filled dots icon.
- **Approved**: Hover uses the subtle container fill; Open preserves the open surface while the menu is visible.
- **Platform requirement**: the trigger is a real button, opens with `Enter`/`Space`, closes with `Escape`, returns focus to the trigger and uses the shared Context Menu implementation.

## Filter floor

- **Approved**: filter floor is shown or hidden synchronously for all columns.
- **Approved**: utility columns render an empty filter slot so all body rows remain aligned.
- **Approved**: supported semantics are Empty, Text, Number, Date, Period, Select and Boolean.
- **Approved**: field content is the selected operator, not repeated search icons or repeated `Найти` placeholders.
- **Approved**: operator action is on the right.
- **Approved**: Date, Period and Select Active states use their existing overlay components.
- **Platform requirement**: overlay focus is trapped or managed by the owning component, closes on `Escape`, and restores focus.

## Density and resizing

- **Approved**: Comfortable body row 48 px; Compact body row 40 px.
- **Approved**: header is always 48 px high.
- **Approved**: Index, Selection and Drag Handle columns are square in the body and match body density in width; their headers match width but keep 48 px height.
- **Approved**: all values and nested instance overrides persist when density changes.
- **Approved**: labels truncate with ellipsis at the defined minimum width; Tooltip reveals full content.
- **Platform requirement**: horizontal overflow stays inside the table scroll region; the document must not overflow.

## Content rules

- Text, links and labels align left.
- Numeric values align right and use tabular figures; numeric header labels remain left.
- A trailing notice icon is pinned to the far end of the cell, not immediately after the text.
- Badge-only, value-plus-badge and badge-plus-value compositions preserve badge content and icon swaps across density changes.
- File icon and name remain visible in both densities; file size is visible only in Comfortable.
- File icon options are the nine exact Figma sources listed in `FIGMA_STRUCTURE.json`.

## Summary row

- **Approved**: summary is a final row after the visible data rows.
- **Approved**: numeric columns may show totals; nonnumeric columns use Empty; one content column may use Label (`Итого`).
- **Platform requirement**: totals are derived from data, not copied display strings; currency/units remain product-owned formatting.

## Pagination

- **Approved**: previous/next arrows, page numbers, current page, ellipsis and disabled states are supported.
- **Approved**: page navigation is centered; rows selector is aligned at the right on the same horizontal line.
- **Approved**: page controls use Default/Hover/Pressed/Current/Disabled.
- **Platform requirement**: controls are buttons with accessible names; current page exposes `aria-current="page"`; disabled arrows are genuinely disabled.

## Row reorder

- **Approved**: rows can be moved; columns cannot.
- **Approved**: pointer drag-and-drop has a context-menu/keyboard alternative.
- **Platform requirement**: the handle has an accessible row-specific label and movement result is announced.
- **Decision required**: exact keyboard shortcut/direct manipulation model. Do not invent a hidden shortcut without documentation.

## Table semantics

- Use native `table`, `thead`, `tbody`, `tr`, `th`, `td` and `scope="col"` by default.
- Provide a visible caption or `aria-label` for the scrollable table region.
- Do not assign `role="grid"` unless full grid keyboard behavior is implemented and tested.
- Keep one tab stop for roving cell navigation in Edit mode; interactive descendants keep their own semantics.
- Selection, sort, filter and validation meaning must not be conveyed by color alone.
- Tooltips are supplemental; essential content remains available to assistive technology.
- Forced-colors mode must keep boundaries, focus and state meaning visible.

## Invalid combinations

- Do not expose a third `Default` density.
- Do not expose Header Error.
- Do not show `Editing` in Read mode.
- Do not make utility headers 40 px high in Compact.
- Do not show file metadata in Compact.
- Do not use column drag-and-drop.
- Do not show an active overlay while its owning field is visually Default.
- Do not render two adjacent opaque one-pixel strokes that create a two-pixel seam.
