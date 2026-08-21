# Table local implementation report

Baseline: `6d16ed8e3b5d5b84d5d3d8e9bacc4f40f94c9a67`  
Worktree: `cometal-design-system-table-2026-08-21`  
Publication: none

## Delivered

- Native HTML table inside a labelled horizontal scroll region.
- 16 approved source families represented by reusable or documented internal primitives.
- Cells: read/edit-compatible state surface, selection, index, drag, summary and exact nine file assets.
- Header: independent column-title/action floor and synchronized filter floor.
- Columns: comfortable/compact density without content reconstruction.
- Paginator: previous/page/ellipsis/next/page-size contract.
- Storybook family: Overview, Cells, Headers, Columns, Paginator, Density and Playground.
- Portal family routes: `/components/table/`, `/cells/`, `/headers/`, `/columns/`, `/paginator/`.
- Registry, specification, knowledge passport and usage updated.

## Independent QA remediation

The first independent audit correctly returned `FAIL` and identified four documentation and geometry gaps. They were fixed without weakening the Figma contract:

- Body-row heights now resolve to exactly 48px Comfortable and 40px Compact; the header remains 48px in both densities.
- The Cells story now renders the complete approved matrices: Read `8 × 5 × 2`, Edit `4 × 7 × 2`, Selection `4 × 2 × 2`, Index `6 × 2`, Drag `5 × 2` and Summary `3 × 2`, including all nine approved file assets.
- The source inventory now separates the exact 16 Component Sets from the five standalone sources instead of collapsing utility columns or counting File/Paginator incorrectly.
- Headers, Columns and Paginator now use executable visual matrices rather than text-only inventories: title/action and filter floors, five column families in both densities, documented row-count evidence, and first/middle/last paginator compositions.
- Checkbox geometry, forced hover/drag states and paginator landmarks were normalized for computed-style and accessibility verification.

## Local evidence

- React unit suite: 39/39 PASS (includes Table and Widget).
- Storybook browser suite: 81/81 PASS.
- Storybook production build: PASS.
- Portal build: 45/45 routes PASS.
- Local browser regression: 75/75 route, responsive and interaction checks PASS at 1440, 1024, 768, 390 and 360px; document overflow 0 and console/page errors 0.
- Widget + Table mobile contract: 32px shell radius, 24px inset, 8px content radius, 13 table rows, filter floor present and Context Menu operable.
- Full `pnpm validate`: PASS after final responsive and overlay fixes.
- First independent Figma-vs-local Visual QA: `FAIL`; all four findings remediated locally.
- Repeat independent Figma-vs-local Visual QA: pending final gate on the remediation commit.

## Portal parity remediation

The repeat audit passed Storybook but returned `FAIL` for portal parity. The canonical Table family routes were then expanded instead of hiding the discrepancy:

- `/components/table/cells/` now renders the same complete Read, Edit, Selection, Index, Drag, Summary and File Content evidence in both densities.
- `/components/table/headers/` now renders executable Sort, Context Action, Selection Header and all ten Filter Row variants.
- `/components/table/columns/` now renders all five column families in both densities plus explicit row-count evidence.
- `/components/table/paginator/` now renders the interactive control and first/middle/last compositions.
- Wide matrices remain inside labelled `.cometal-table-scroll` regions with `contain: inline-size paint`; document overflow is `0` at 1440, 1024, 768, 390 and 360px.

## Not asserted yet

`visualMatch`, `testsPassed` and `accessibilityPassed` remain false in the registry until the independent local QA gate completes.
