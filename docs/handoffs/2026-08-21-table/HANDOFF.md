# Table: approved Figma handoff

Date: 2026-08-21  
Component: `Table`  
Figma file: `KKNGucImxFAtQLBhPy8tLs`  
Page: `2353:9350` (`Tables`)  
Owner of visual contract: Figma DS Core  
Handoff state: `READY FOR DOWNSTREAM GAP ANALYSIS`

## Scope and evidence

This package was generated from the live Figma file in read-only mode. Review and Principles are evidence only; engineering identity comes from the canonical source frames and Component Sets listed below.

Canonical source frames:

| Level | Name | Node ID | Role |
|---|---|---|---|
| Source umbrella | Table / Sources | `2814:8351` | Technical grouping |
| Internal primitives | Cells | `2353:9497` | Cell families and standalone content |
| Compound part | Paginator Source | `2353:10882` | Paginator control and composition |
| Internal primitives | Header Source | `2353:10891` | Header, context action, selection header and filter row |
| Main components | Main Components | `2353:9824` | Five configurable column families |

Evidence frames:

| Name | Node ID | Role |
|---|---|---|
| Table / Principles | `2353:9351` | Approved principles, with stale statements called out below |
| Table / Review | `2353:10833` | Read/Edit state journeys and presentation tables |

Full structure, exact component keys, all 271 variants, 125 bound variables and icon IDs are in [FIGMA_STRUCTURE.json](./FIGMA_STRUCTURE.json).

## Architecture

```text
Foundation variables
  -> cell, header and paginator primitives
  -> five column families + paginator composition
  -> product table composition
  -> Widget + Table pattern (separate downstream pattern)
```

Figma intentionally has no single monolithic Table Component Set. Designers compose the final table from column instances and keep their density, row count, filter floor and summary floor synchronized. React must preserve native row-based HTML semantics; it must not copy the Figma column model one-to-one into DOM or public props.

## Source inventory

### Cells

| Source | Node ID | Variants | Axes / properties | Geometry |
|---|---|---:|---|---|
| Read Cell | `2353:9506` | 80 | Type 8 x State 5 x Density 2; label, trailing icon, icon swap, file metadata, badge slot | `240x48` Comfortable; `240x40` Compact |
| Edit Cell | `2353:9656` | 56 | Type 4 x State 7 x Density 2; label, trailing icon, icon swap, file metadata | `240x48`; `240x40` |
| Selection Cell | `2353:9766` | 16 | State 4 x Value 2 x Density 2 | square `48x48`; `40x40`; Checkbox stays 20 px |
| Index Cell | `2353:9799` | 12 | State 6 x Density 2; number text property | square `48x48`; `40x40` |
| Drag Handle Cell | `2778:8307` | 10 | State 5 x Density 2 | square `48x48`; `40x40` |
| Summary Cell | `2760:8131` | 6 | Type Empty/Label/Value x Density 2 | `240x48`; `240x40` |
| File Content | `2371:29513` | standalone | file icon swap, file name, file size | `208x32`; metadata hidden in Compact |
| Drag Handle Icon | `2778:8288` | standalone | no exposed properties | `24x24` |

Read Cell types: `Text`, `Number`, `Link`, `Badge`, `Text + Badge`, `Number + Badge`, `Badge + Text`, `File`.

Edit Cell types: `Text`, `Number`, `Dropdown`, `File`.

### Headers and filter floor

| Source | Node ID | Variants | Axes / properties | Geometry |
|---|---|---:|---|---|
| Column Header | `2353:10896` | 6 | State Default/Hover x Sort None/Ascending/Descending; label | `240x48`; header height is always 48 |
| Context Action | `2482:5611` | 3 | Menu Default/Hover/Open; Focus boolean | hit area `24x24`, icon `16x16` |
| Selection Header | `2353:10934` | 18 | State 3 x Value Unchecked/Mixed/Checked x Density 2 | `48x48` or `40x48`; height stays 48 |
| Index Header | `2371:29825` | standalone | label | `48x48` |
| Drag Handle Header | `2778:8324` | standalone | no exposed properties | `48x48`; width follows density in composed column |
| Filter Row | `2530:5631` | 10 | Type Empty/Text/Number/Date/Select/Boolean/Period; State Default/Active where approved | `240x48`; nested Field S is 32 high |

The filter floor is enabled synchronously for the whole table. Service columns keep an empty 48-pixel slot. Date, period and select active states reuse the approved Date Picker / Date Range Picker / Select overlays; Table does not own duplicate overlays.

### Paginator

| Source | Node ID | Variants | Contract |
|---|---|---:|---|
| Paginator Control | `2851:11088` | 14 | Page/Ellipsis/Arrow; Previous/Next; Default/Hover/Pressed/Current/Disabled |
| Paginator | `2371:29654` | standalone | `1200x40`; navigation centered, rows selector aligned right |

### Main column families

| Source | Node ID | Variants | Contract |
|---|---|---:|---|
| Read Column | `2353:9830` | 8 | Rows 10/15/20/30 x Comfortable/Compact; Filter row and Summary row booleans |
| Edit Column | `2353:10334` | 8 | Same axes; cells remain editable compositions |
| Index Column | `2804:9393` | 8 | Utility square width follows density; header remains 48 high |
| Selection Column | `2804:27877` | 8 | Utility square width follows density; selected rows are separate from selected cells |
| Drag Handle Column | `2804:27879` | 8 | Utility square width follows density; row reorder only, not column reorder |

Row count is data/pagination behavior in code, not a requirement for a `rows` React prop. Column source variants are internal implementation/documentation contracts, not a mandate for public `ReadColumn` or `EditColumn` DOM components.

## Composition rules

- `Density=Comfortable` uses 48-pixel body cells; `Density=Compact` uses 40-pixel body cells.
- Headers remain 48 pixels high in both densities. Index, selection and drag headers change width to match their body cells.
- Density is controlled once at Table level and must not reset nested content, badge settings, file names, icon swaps or cell values.
- Text is left-aligned; numeric content is right-aligned with tabular figures; header labels remain left-aligned for numeric columns.
- Cell and header labels truncate with ellipsis at their minimum width. Full content is exposed through Tooltip.
- `Active` is the sand row-selection surface. `Selected` is the current cell. `Editing` is the edit-entry state with caret/input behavior. These states are not aliases.
- Error is cell-level: error surface plus error content. Column-wide validation is a product composition, not a Header Error variant.
- File metadata is visible in Comfortable and hidden in Compact; file name and chosen icon persist.
- Summary is a final row after data rows. Only numeric/value columns show totals; other columns render Empty or Label compositions.
- Selection Header uses `Mixed` when only part of the rows are checked.
- Sorting indicator appears before the header label. Context Action remains at the far edge.
- Row drag-and-drop must have a context-menu/keyboard alternative. Columns are not draggable.
- Dividers remain one physical pixel. Adjacent cell strokes must not sum into a two-pixel seam.
- All approved outline icons use the shared 1.4-pixel stroke contract. Do not redraw existing Figma icons.

## Exact icons

Core references:

- Sort ascending: `Outline/arrows/arrow-up-sm`, `700:14369`.
- Sort descending: `Outline/arrows/down-arrow-sm`, `700:14384`.
- Context action: `Filled/general/dot-horizontal-filled`, `700:1652`.
- Filter operator: `Outline/general/filter`, `700:14705`.
- Cell notice: `Outline/general/information-circle-contained`, `700:14528`.
- Dropdown: `Outline/arrows/chevron-down`, `700:14279`.
- Paginator previous/next: `700:14348` / `700:14333`.
- Drag handle: `Drag Handle Icon`, `2778:8288`.

File swap options are resolved to nine exact local icons in `FIGMA_STRUCTURE.json`: Word `700:159`, Excel `700:162`, File `700:165`, Doc `700:168`, Sheets `700:171`, Adobe `700:174`, Zip `700:177`, PDF `700:180`, Image `700:183`.

## Token contract

The live sources bind 125 variables. Their IDs, keys, types, collections, aliases/values and WEB syntax are captured in `FIGMA_STRUCTURE.json`.

Table-owned semantic roles include:

- `Component/Table/Cell/Height/Density/Comfortable` and `Compact`;
- cell horizontal/vertical inset, gap, minimum widths and one-pixel border width;
- Cell Surface Default/Hover/Active/Selected/Error/Disabled;
- Table Text Primary/Selected/Error/Disabled;
- Header Surface Default/Hover/Selected, header insets, gap, height and context action states;
- Icon Primary/Secondary/Selected/Error/Disabled and icon size;
- Summary Surface/Text/Divider;
- File Metadata and Show Metadata Comfortable.

Nested dependencies also bind Global, Checkbox, Field, Date Picker, Badge, Effect and typography variables. Downstream must reuse those owners; do not duplicate them under Table.

## Evidence conflicts resolved for implementation

The Principles frame contains three stale statements. Canonical source sets and the later Review take precedence:

1. Principles mentions Compact/Default/Comfortable; approved sources expose only Comfortable and Compact. Do not add a third density.
2. Principles mentions Header Error; Column Header has no Error variant. Do not implement Header Error.
3. Principles says Selection is first; the approved stand uses Index first and Selection second. Keep utility-column order configurable, but examples use Index -> Selection -> Drag Handle.

These are documentation debts in Figma Principles, not permission to invent variants downstream.

## Documentation manifest

Storybook and the portal must consume one shared Table documentation manifest with these sections:

1. Overview and purpose.
2. Architecture and anatomy.
3. Cells: Read, Edit, Selection, Index, Drag Handle, Summary and File Content.
4. Headers: Column Header, Context Action, Selection/Index/Drag headers and Filter Row.
5. Columns: Read, Edit and utility columns.
6. Paginator.
7. States and Read/Edit journeys.
8. Sizes, density and resizing.
9. Behavior and accessibility.
10. API and code examples.
11. Playground.
12. Exact Figma source links and Match status.

Every source must be inspectable even when it remains an internal React primitive.

## Current downstream verdict

The current checkout is `PARTIAL`, not `MATCHED`. It contains generic native Table primitives and `TableFileCell`, but several Figma source families are still story-local or absent as reusable/documented implementation. The registry currently links only Review and incorrectly reports all checks as true. See [COVERAGE_MATRIX.md](./COVERAGE_MATRIX.md) and [IMPLEMENTATION_SCOPE.md](./IMPLEMENTATION_SCOPE.md).

## Open implementation decisions

These do not block starting the gap analysis, but they block a final `MATCHED` verdict until resolved and documented:

- exact commit/cancel keys and validation timing while a cell is in `Editing` are not prototyped;
- exact keyboard command for row reorder is not specified; the context-menu alternative is required;
- product ownership of global filters/bulk actions stays outside Table and must not be pulled into this API.

No production deployment is authorized by this handoff.
