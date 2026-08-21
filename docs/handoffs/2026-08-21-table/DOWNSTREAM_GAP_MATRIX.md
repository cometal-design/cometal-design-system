# Table downstream gap matrix

Baseline: `6d16ed8e3b5d5b84d5d3d8e9bacc4f40f94c9a67`

Canonical Figma sources: Table Sources `2814:8351`, Cells `2353:9497`, Paginator Source `2353:10882`, Header Source `2353:10891`, Main Components `2353:9824`.

| Figma source family | Baseline downstream | Gap | Planned reconciliation |
|---|---|---|---|
| Read Cell | Generic `TableCell` only | Read content types and six states are not inspectable as a family | Keep semantic `TableCell`; document Text, Number, Link, Badge, composite, File across states and densities |
| Edit Cell | Story-local Field composition | No reusable edit-cell entry/selection contract or complete state evidence | Add table-cell edit event contract and public compositions using existing Field controls; keep product validation timing deferred |
| Selection Cell/Header | Story-local Checkbox | No reusable selection cells/header or mixed-state documentation | Add native Checkbox-backed selection primitives and tests |
| Index Cell/Header | Generic centered cell | Utility width is implicit and no explicit source documentation | Add index primitives with density-owned width |
| Drag Cell/Header + Drag asset | Story-local substitute SVG | Invented icon and no reusable accessible alternative | Add exact Figma asset, drag primitives, and context-menu alternative; keyboard shortcut remains deferred |
| Summary Cell | Story footer outside table | Not a semantic final table row | Add summary cell/row composition inside `tbody` |
| File Content | Hand-authored generic file SVG | Nine approved swaps absent | Add exact exported Figma assets and `TableFileIcon` mapping; preserve metadata across density |
| Column Header + Context Action | Header label/action | Sorting is display-only; action uses story-local SVG | Add sort cycle and exact asset; add shared ContextMenu-backed header action |
| Filter Row | Filter nested inside each `th` | DOM/visual architecture does not have synchronized second header row | Add `TableFilterRow`/`TableFilterCell`; utility slots remain empty but aligned |
| Read/Edit/utility columns | Story-only columns | Approved column families are not documented and current filter floor is invalid | Document as native row-oriented table compositions, not React column DOM |
| Paginator Source | Story footer made from Button | Approved controls, current/ellipsis/disabled/page-size contract absent | Add reusable paginator with exact Figma arrow assets and accessible state |
| Storybook/portal | Reduced Pattern story and reduced portal demo | Table is classified as Pattern; most bricks/states unavailable | Move canonical Table to Components, add shared documentation manifest/sections, preserve compatibility redirects |
| Spec/registry/knowledge | Review-only link and optimistic `visualMatch=true` | Source links/evidence/status are inaccurate | Store all five source links, set Partial/In review until independent QA, sync API/status |

## Deferred decisions

- Edit commit/cancel and asynchronous validation timing.
- Exact keyboard command for row reordering. The visible Context Menu alternative is mandatory in this implementation.

These decisions do not block delivery of the approved visual, composition and accessible platform contract.
