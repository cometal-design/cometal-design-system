# Table source-to-delivery coverage

Baseline inspected: local checkout at `6d16ed8e3b5d5b84d5d3d8e9bacc4f40f94c9a67` plus uncommitted/unverified downstream edits present on 2026-08-21. This matrix describes current delivery evidence, not desired status.

Legend: `MATCH`, `PARTIAL`, `MISSING`, `EXTRA`, `CONFLICT`, `BLOCKED`. `Internal primitive` means no public React export is required, but implementation and documentation are still required.

| Figma source | Node ID | Variants / states | Tokens | Icons | React | Storybook | Portal | Tests |
|---|---|---|---|---|---|---|---|---|
| Read Cell | `2353:9506` | 80; Type 8, State 5, Density 2 | PARTIAL: bindings captured; exact downstream graph not revalidated | PARTIAL | PARTIAL: generic `TableCell`, no complete source contract | PARTIAL: presentation examples, no full matrix | PARTIAL: reduced state matrix | PARTIAL |
| Edit Cell | `2353:9656` | 56; Type 4, State 7, Density 2 | PARTIAL | PARTIAL | PARTIAL: visual states exist, editing/dropdown behavior incomplete | PARTIAL | PARTIAL | PARTIAL |
| Selection Cell | `2353:9766` | 16; State 4, Value 2, Density 2 | PARTIAL | MATCH: nested Checkbox sources identified | PARTIAL: composition only, no explicit source contract | MISSING source matrix | MISSING source documentation | PARTIAL via Checkbox only |
| Index Cell | `2353:9799` | 12; State 6, Density 2 | PARTIAL | N/A | PARTIAL: generic centered cell | MISSING source matrix | MISSING | MISSING |
| Drag Handle Cell | `2778:8307` | 10; State 5, Density 2 | PARTIAL | MATCH in Figma: `2778:8288` | MISSING reusable/internal Table primitive; story-local handle exists | PARTIAL: demo substitute | MISSING | MISSING |
| Summary Cell | `2760:8131` | 6; Type 3, Density 2 | PARTIAL | N/A | MISSING reusable/internal primitive; story-local footer exists | PARTIAL: demo substitute | MISSING | MISSING |
| File Content | `2371:29513` | standalone; icon/name/size | PARTIAL | MATCH: nine swap sources resolved | MATCH/PARTIAL: `TableFileCell` covers content and density metadata | PARTIAL: no standalone source story | PARTIAL | PARTIAL: density DOM persistence only |
| Drag Handle Icon | `2778:8288` | standalone | PARTIAL | MATCH in Figma | MISSING exact reusable asset; current story draws a substitute | CONFLICT | MISSING | MISSING |
| Paginator Control | `2851:11088` | 14; Content/Direction/State | PARTIAL | MATCH: exact arrows identified | MISSING Table-owned reusable/internal control | PARTIAL: story-local markup | MISSING source documentation | MISSING |
| Paginator | `2371:29654` | standalone composition | PARTIAL | MATCH | MISSING reusable composition | PARTIAL: story-local markup | MISSING | MISSING |
| Column Header | `2353:10896` | 6; State 2, Sort 3 | PARTIAL | CONFLICT: React draws custom sort SVG instead of exact icons | PARTIAL: `TableHeaderCell` supports sort/action/filter | PARTIAL: no complete source matrix | PARTIAL | PARTIAL: semantic sort only |
| Context Action | `2482:5611` | 3; Menu 3 + Focus boolean | PARTIAL | CONFLICT: story draws dots instead of approved icon component | MISSING dedicated reusable/internal trigger contract | PARTIAL: story-local trigger | MISSING source matrix | MISSING |
| Selection Header | `2353:10934` | 18; State 3, Value 3, Density 2 | PARTIAL | MATCH in Figma | PARTIAL: header+Checkbox composition, no complete mixed/density contract | MISSING source matrix | MISSING | PARTIAL via Checkbox only |
| Index Header | `2371:29825` | standalone | PARTIAL | N/A | PARTIAL: `kind=index` | MISSING source story | MISSING | MISSING |
| Drag Handle Header | `2778:8324` | standalone | PARTIAL | N/A | MISSING explicit kind/source contract | MISSING | MISSING | MISSING |
| Filter Row | `2530:5631` | 10; Type 7, approved states subset | PARTIAL | MATCH in Figma; downstream exact use unverified | PARTIAL: generic `filter` slot, no synchronized floor API | PARTIAL: overlays/demo exist, full matrix absent | PARTIAL | PARTIAL |
| Read Column | `2353:9830` | 8; Rows 4, Density 2; filter/summary booleans | PARTIAL | inherited | MISSING as documented internal composition; public column export not required | MISSING source matrix | MISSING | MISSING density/content persistence |
| Edit Column | `2353:10334` | 8; same axes | PARTIAL | inherited | MISSING internal composition contract | MISSING source matrix | MISSING | MISSING |
| Index Column | `2804:9393` | 8; same axes | PARTIAL | inherited | MISSING internal composition contract | MISSING | MISSING | MISSING utility-width sync |
| Selection Column | `2804:27877` | 8; same axes | PARTIAL | inherited | MISSING internal composition contract | MISSING | MISSING | MISSING utility-width/content persistence |
| Drag Handle Column | `2804:27879` | 8; same axes | PARTIAL | inherited | MISSING internal composition contract | MISSING | MISSING | MISSING |
| Final Read/Edit composition | Review `2353:10833` | Read/Edit stands, 20 rows | PARTIAL | PARTIAL: several story-local icons/compositions | PARTIAL: generic table works, source coverage incomplete | PARTIAL: approximate demos | PARTIAL | PARTIAL: reduced oracle only |

## Totals

- Figma sources covered in this matrix: 21 canonical source entities plus one final evidence composition.
- Component Sets: 16.
- Standalone components: 5.
- Exact Figma variant components: 271.
- Current overall delivery verdict: `PARTIAL`.

## Baseline conflicts

1. Registry links only Review `2353:10833`; it does not identify four canonical source roots.
2. Registry reports all checks `true`, but reusable source-family coverage and independent live-Figma QA are incomplete.
3. Storybook creates context action, reorder handle, paginator and summary compositions locally.
4. Current React has native structural primitives but does not expose/document the full approved source contract.
5. Current checkout contains uncommitted post-QA work; it cannot be immutable evidence.

No row may become `MATCH` solely because a presentation table looks similar. It requires package API/internal implementation, inspectable documentation and independent evidence against the exact live source.
