# COMETAL DS Global Sync - Orchestration Report

## Last Known Good Baseline

- Git and production source SHA: `0551bb03662397087480a8ae66916b170402f18b`.
- Vercel production deployment: `dpl_GQVfCNUafRSHGuSxVSeCBrQaR6GA`, `READY`.
- Figma evidence: Table Review `2353:10833`, Technical Typography `2561:116`, synchronized 631-variable contract.
- Evidence: 2026-08-13 cross-source audit plus 2026-08-14 Table/Technical Typography handoff.

## Five Sources of Truth

1. Figma DS Core: current approved target; `VALIDATED`.
2. Git specifications and registry: baseline, update required.
3. Git tokens and React implementation: baseline, update required.
4. Storybook: production baseline, update required.
5. Obsidian knowledge base: baseline, update required.

GitHub and Vercel are publication infrastructure, not additional Sources of Truth.

## Figma Unpublished Delta

- Variables: 631 -> 770; collections 8 -> 12; all Figma IDs/keys recreated.
- Primitives: +10 exact values.
- Semantic/component roles: 228 -> 357; expanded Global and Component namespaces.
- Styles: 23 text styles and 2 new elevation styles.
- Components: Button, Fields, Checkbox, Radio Button, Switch, Date Picker/Range and Badge changed.
- New entities: Tooltip, Context Menu and Widget.
- Major pattern expansion: Table cells, headers, columns, filters, overlays, paginator, row selection/index/reorder and summary.
- Documentation: Semantic Color Map 288/288 and normalized boards.

## Estimated Impact

- High: token architecture, generated artifacts, component bindings, Table and every nested Table/Widget control.
- Medium: all existing component stories/specifications/passports due token and state changes.
- New implementation: Tooltip, Context Menu, Widget and Date Range behavior.
- Release: Git/React/Storybook/portal/registry/Obsidian plus preview and production QA.

## Blockers and Ambiguities

- No blocker for propagation from Figma: the target passed structural and visual audit.
- Tabs publication is blocked pending a public slot/count API decision.
- npm publication remains explicitly out of scope; packages stay private `0.0.0`.
- Frontend Lead approval and product pilot status must not be inferred from successful sync.

## Agent Work Distribution

- Figma DS Core: exact target snapshots, manifest, Figma integrity and final comparison.
- Backlog / Tracker: one umbrella item and executable child tasks keyed by Change ID; dependencies and blockers; do not close before QA gate.
- Web Storybook: token/DTCG migration, generated artifacts, React, Storybook, portal, registry, specifications, Obsidian, Git and Vercel publication.
- Visual QA: independent token, structural, engineering, interaction and visual-regression matrix after preview is ready.

## Dependency Order

`Figma inventory -> Figma validation -> manifest -> Tracker -> tokens -> React/components -> Storybook/docs -> preview -> independent QA -> fixes -> Git/Vercel production -> final match matrix`

## Sync Manifest

[`COMETAL_DS_SYNC_MANIFEST.md`](./COMETAL_DS_SYNC_MANIFEST.md)

Supporting execution artifacts:

- [`DOWNSTREAM_FILE_MAP.md`](./DOWNSTREAM_FILE_MAP.md)
- [`QA_MATRIX.md`](./QA_MATRIX.md)
- [`FINAL_MATCH_MATRIX.md`](./FINAL_MATCH_MATRIX.md)
- [`TRACKER_TASK_MAP.md`](./TRACKER_TASK_MAP.md)
- [`figma-variables-current.json`](./figma-variables-current.json)
- [`figma-components-current.json`](./figma-components-current.json)
- [`figma-styles-current.json`](./figma-styles-current.json)

## Tracker Umbrella Task

- [`DESIGN-148`](https://tracker.yandex.ru/DESIGN-148): `COMETAL DS — Global Synchronization Wave`.
- All 22 executable child items were created as `DESIGN-149`–`DESIGN-170` and reread after creation.
- Exact Change ID mapping and dependencies: [`TRACKER_TASK_MAP.md`](./TRACKER_TASK_MAP.md).
- Every task remains `OPEN / TASKED`; `REL-001` and the umbrella stay open through independent QA and the final match matrix.
- No worklogs were added. Tabs publication is blocked pending its public API decision.

## Current Wave Status

`FIGMA VALIDATED -> MANIFEST CREATED -> TRACKER IN PROGRESS -> DOWNSTREAM IMPLEMENTATION LOCAL PASS -> PREVIEW/INDEPENDENT QA PENDING`

## Current implementation checkpoint

- Local token sync rerun from the canonical 2026-08-20 snapshots.
- Local builds PASS: tokens, React, Storybook and docs.
- Unsandboxed Storybook browser verification reported `69 / 69 PASS`.
- Remaining release boundary is still `REL-001`: preview deployment, independent Visual QA and only then publication.

Detailed implementation state by Change ID: [`IMPLEMENTATION_REPORT.md`](./IMPLEMENTATION_REPORT.md).
