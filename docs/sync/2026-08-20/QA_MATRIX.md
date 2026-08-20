# COMETAL DS Global Sync - QA Matrix

**Authority:** [`COMETAL_DS_SYNC_MANIFEST.md`](./COMETAL_DS_SYNC_MANIFEST.md)
**Execution gate:** run against the Web Storybook preview only after implementation handoff.
**Mode:** independent, read-only. Visual QA must not fix code, Figma or production.

## Required Environments

| Environment | Viewport | Purpose |
|---|---:|---|
| Chromium | 1440 x 900, DPR 1 | Deterministic desktop structural and screenshot baseline. |
| Chromium | 390 x 844 | Mobile overflow, clipping, overlays and touch-sized controls. |
| WebKit | 1440 x 900 | Cross-engine typography, SVG stroke and shadow rendering. |
| WebKit | 390 x 844 | Mobile overlay placement and tooltip/menu viewport behavior. |

Every tested route must report page/console errors, document overflow, loaded fonts and the exact preview/deployment SHA.

## Token QA

| Change IDs | Check | Pass condition | Evidence |
|---|---|---|---|
| TOK-001 | Collection/namespace migration | 12 target collections represented without an additional parallel hierarchy; 770 logical leaves. | Source and generated inventory. |
| TOK-002 | Primitive additions | Ten exact additions exist once; primitive total 413. | DTCG paths, generated CSS/TS values. |
| TOK-003 | Alias graph | 357 semantic roles resolve through aliases; no semantic raw terminal values. | Machine diff against `figma-variables-current.json`. |
| TOK-004 | Legacy deletion | All 32 obsolete names have zero active source/generated/runtime consumers. | Repository search plus generated artifact scan. |
| TOK-005 | Brand ramp | Default/Hover/Pressed resolve to Blue 500/600/700 across every consumer. | Source aliases and computed styles. |
| TOK-006 | Neutral/disabled/placeholder | Neutral layers use 4/8%; placeholder is Neutral 600; no local gray override. | Computed styles and contrast report. |
| TOK-007 | Table roles | 46 Table semantic roles match exact names/types/aliases and generated syntax. | Token diff and Table computed geometry. |
| TOK-008 | Documentation/Widget | Shared board roles and 32 px Widget radius are present; no undocumented fallback. | Source paths and computed Widget layout. |
| TYP-001 | Typography | 23-style inventory represented; Technical styles unchanged; fonts load without fallback. | CSS/font metrics and network evidence. |
| EFX-001 | Shadows | Soft and Hard shadows match every layer's color, offset, blur and spread. | Computed `box-shadow` and screenshots. |

## Component and Pattern QA

| Change ID | Required coverage | Critical pass conditions |
|---|---|---|
| CMP-001 | Button: nine variants, L/M/S, five states, text/left/right/icon-only compositions. | Correct 500/600/700 ramp; identical text/icon semantic foreground; 48/40/32 heights; 20/16/14 icons; 1.4 px outline stroke; focus/loading intact. |
| CMP-002 | Text Field, Text Area, Select, Combobox, Multi Select and listboxes. | L/M/S where defined; Active opens correct overlay; 6 px gap; no focus clipping; placeholder optical centering/contrast; textarea scroll/count; Soft/Hard shadow assignment. |
| CMP-003 | Checkbox, Radio, Switch and Figma-only Tabs boundary. | Full state/value/size matrices; unchecked Hover keeps Default border; selected Hover/Disabled has no extra border; keyboard focus visible; Table density cannot mutate Checkbox appearance; Tabs is not exported publicly. |
| CMP-004 | Date Picker, Date Range Picker, Date/Period header filters. | Edit/Read, L/M, Default/Active; range start/middle/end geometry; keyboard navigation; focus visibility; panel shadow and viewport containment. |
| CMP-005 | Badge. | Surface/tone API, Boolean content parts and icon swap; icon-only circle; nested Table use preserves label/icon/surface/color through density changes; no black icons. |
| CMP-006 | Tooltip. | Compact/Wide and all placements; attached arrow with zero light seam; escaped/truncated content; focus/hover semantics; collision/flip behavior; no viewport clipping. |
| PAT-001 | Context Menu. | L/M/S; item states/tones; selected check aligned at end; keyboard menu semantics; anchoring and right-click; Hard elevation; used by Table rather than duplicated. |
| PAT-002 | Table. | Native semantics; all cell/column/header/filter/paginator families; 48/40 rows with fixed 48 header; density content persistence; selection/error/disabled; one-pixel dividers; no double border; truncation + Tooltip; overlays; horizontal internal scroll only. |
| PAT-003 | Widget. | Generic shell with header/actions/content slots; 32 radius, 24 inset, 8 inner content radius; 24 px title; primary/secondary action configuration; full Table perimeter; no duplicated/diverging nested components. |

## Engineering QA

1. `pnpm validate:sources`: all five logical sources, stable IDs and exact links resolve.
2. `pnpm validate:css-variables`: every authored `--cometal-*` reference resolves to the active token graph or an explicit local definition.
3. `pnpm validate:secrets`: no credentials or private tokens in artifacts.
4. `pnpm typecheck`: every workspace passes.
5. `pnpm test:unit`: React behavior/API tests pass.
6. `pnpm test:storybook`: interaction and accessibility tests pass.
7. `pnpm build`: tokens, React, Storybook and portal build from a clean checkout.
8. Generated outputs are reproducible: a second token build produces no diff.
9. Public exports match registry/specification; no undocumented export or removed API remains.
10. No active component consumes a hardcoded value where a target semantic role exists.
11. Every deprecation has replacement/migration text; Tabs and npm publication stay out of scope.

## Required Story Evidence

The implementation handoff must provide exact direct iframe IDs for:

- Foundation: color primitives, semantic color, typography, radius/spacing/size/stroke and shadows.
- Components: Button, Fields, Checkbox, Radio Button, Switch, Date Picker/Range, Badge and Tooltip.
- Patterns: Context Menu and Table overview, compact, filters and open overlays.
- Widget: generic composition and Table payload.

For each route, QA records the direct iframe URL, viewport, browser, screenshot path, computed measurements and errors.

## Final Evidence Contract

| Field | Required value |
|---|---|
| Preview SHA | Exact 40-character Git SHA. |
| Preview deployment | Vercel deployment ID and URL. |
| Test totals | Unit and Storybook passed/failed counts. |
| Build | Token, React, Storybook, portal status and route count. |
| Token diff | Added/changed/removed/missing/unexpected counts. |
| Visual defects | Exact Change ID, route, viewport, browser, expected/actual and screenshot. |
| Engineering defects | Exact Change ID, file/API/token and reproduction. |
| Verdict | `QA_PASSED` only when all non-blocked Change IDs pass; otherwise `QA_FAILED`. |

Production deployment is permitted only after a preview `QA_PASSED`. Production receives a final smoke check against the exact published SHA before any row becomes `MATCHED`.
