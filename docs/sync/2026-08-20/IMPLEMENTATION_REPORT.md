# COMETAL DS Global Sync - Implementation Report

**Date:** 2026-08-20
**Scope:** downstream implementation, initial preview, independent QA remediation and replacement-preview preparation.
**Baseline SHA:** `0551bb03662397087480a8ae66916b170402f18b`
**Current state:** two preview QA passes returned `QA_FAILED`; every confirmed defect was remediated. Independent Visual QA returned `QA_PASSED` for SHA `5287ad377a1050284ebb187c37035063981382c0`, deployment `dpl_25TCodVWnskUcRgMaxM4mPFeJPbh`. Production is authorized after final evidence-only equivalence confirmation.

## Local verification evidence

- token snapshot sync rerun from canonical 2026-08-20 Figma snapshots: **413 Primitive + 163 Global Semantic + 194 Component Semantic = 770 logical leaves**, **357 aliases**, **23 text styles**, **2 effect styles**;
- deterministic generation PASS: a second snapshot sync and token build changed **0 / 13** token source/generated files;
- full unsandboxed `pnpm validate` PASS;
- source registry: **5 logical sources, 15 components, 69 exact Storybook routes**;
- CSS custom-property contract: **84 source files PASS** with no unresolved `--cometal-*` references;
- secret scan: **249 tracked files** checked;
- unit tests: **30 / 30 PASS** across **7 / 7** files;
- Storybook interaction/a11y tests: **69 / 69 PASS** across **13 / 13** files;
- `build:tokens`, `build:react`, `build:storybook` and `build:docs` PASS;
- portal build produced **37 static routes**;
- focused Chromium/WebKit verification: **24 route/environment checks**, all HTTP 200, zero page/console errors, zero document overflow and all three required font faces loaded;
- targeted Table/stroke verification: **10 / 10 PASS** across Chromium/WebKit; selection controls remain 20 x 20 px in Comfortable/Compact and inspected outlines render at 1.4 px;
- second-verdict remediation verification: **16 / 16 PASS** across Chromium/WebKit, including 288 Semantic Color rows, Widget Table/actions, Tooltip wrapping/Escape, Context Menu focus restoration, Checkbox hover and mobile containment;
- independent preview verification: **QA_PASSED**, 124 / 124 route/environment checks, all six prior findings closed and exact candidate checkout clean;
- all 32 removed legacy variable names have zero active repository matches;
- active UI source scan contains no raw color literals outside the two token-preview RGBA formatters;
- all workspace packages remain `private: true`, version `0.0.0`; Tabs has no public runtime export.

## Change ledger execution

| Change ID | Local status | Downstream result | Evidence / notes |
|---|---|---|---|
| TOK-001 | LOCAL_PASS | Typed Primitive/Semantic/Component/Effect DTCG sync script active; generated sources rebuilt from canonical snapshots. | `packages/tokens/scripts/sync-figma-snapshot.mjs`, regenerated `primitive/semantic/component/effects/typography/foundation` sources. |
| TOK-002 | LOCAL_PASS | 413 primitive leaves regenerated, including Boolean and added color/radius/size primitives. | Token sync output counts and regenerated JSON. |
| TOK-003 | LOCAL_PASS | Global and Component semantic expansion reflected in source token graph and generated outputs. | `semantic.tokens.json`, `component.tokens.json`, token build outputs. |
| TOK-004 | LOCAL_PASS | Legacy names excluded from active generated graph; current consumers point to current semantic paths. | Regenerated token sources plus local consumer updates. |
| TOK-005 | LOCAL_PASS | Brand ramp consumers now resolve through current semantic aliases instead of stale hardcoded values. | Button/selection/date/table stories and CSS consume current token graph. |
| TOK-006 | LOCAL_PASS | Neutral state-layer, placeholder and disabled mappings normalized through current semantics. | Field/widget/context menu fixes and local contrast test pass. |
| TOK-007 | LOCAL_PASS | Expanded Table semantics wired through React/Table stories and downstream docs. | `packages/react/src/Table/table.css`, `apps/storybook/stories/Table.stories.tsx`, table docs/spec/KB. |
| TOK-008 | LOCAL_PASS | Documentation/widget foundation roles reflected in docs shell and widget composition. | Foundation routes + widget route/story/spec/KB. |
| TYP-001 | LOCAL_PASS | Typography inventory preserved with current token sources; no destructive change to technical typography contract. | `typography.styles.json`, foundation typography route/story. |
| EFX-001 | LOCAL_PASS | Soft/Hard effect tokens emitted and applied to overlays and floating panels. | `effects.tokens.json`, field/date-picker/context-menu/storybook foundation shadow coverage. |
| CMP-001 | LOCAL_PASS | Button variants/sizes/states aligned; inverse-ghost showcase fixed; icon stroke compensation fixed for rendered 1.4px. | `Button.stories.tsx`, `packages/react/src/Button/button.css`, unsandboxed Storybook PASS. |
| CMP-002 | LOCAL_PASS | Fields family aligned; built-in chevron/search icons use size-aware stroke compensation; listbox behavior/shadow maintained. | `packages/react/src/Field/field.css`, `Fields.stories.tsx`, existing docs/spec alignment. |
| CMP-003 | LOCAL_REMEDIATED | Checkbox/Radio/Switch states aligned; checked border removal and 1.4px mark contract preserved; Table no longer flex-shrinks Checkbox under density changes; unchecked hover preserves the default border; Tabs remain unpublished. | `packages/react/src/Selection/selection.css`, Checkbox hover assertion, Table density geometry assertions, targeted browser PASS, no Tabs export. |
| CMP-004 | LOCAL_PASS | Date Picker plus Date Range Picker contract implemented; date-range story and table header filter reuse added; calendar icons fixed to rendered 1.4px. | `DateRangePicker.tsx`, `date-picker.css`, `DatePicker.stories.tsx`, date-picker docs/spec/KB. |
| CMP-005 | LOCAL_PASS | Badge remained aligned and available for Table/status usage. | Existing badge story/spec/KB plus registry link continuity. |
| CMP-006 | LOCAL_REMEDIATED | Tooltip component, story, portal route, spec and KB added and wired into Table truncation pattern. Placement, mobile evidence, long-content wrapping and Escape dismissal defects are corrected. | `packages/react/src/Tooltip/*`, `Tooltip.stories.tsx`, focused Chromium/WebKit screenshots and interaction assertions; replacement-preview retest pending. |
| PAT-001 | LOCAL_REMEDIATED | Context Menu component, story, route, spec and KB added; danger foreground, raised surface and Escape focus restoration are corrected. | `packages/react/src/ContextMenu/*`, computed surface/radius checks plus close/focus assertion; replacement-preview retest pending. |
| PAT-002 | LOCAL_REMEDIATED | Table story covers Tooltip truncation, Context Menu reuse, Date Range filter, reorder handle and summary/pager composition. Selection geometry and long Tooltip content remain contained across densities. | `packages/react/src/Table/table.css`, `apps/storybook/stories/Table.stories.tsx`, targeted Chromium/WebKit geometry/wrapping PASS. |
| PAT-003 | LOCAL_REMEDIATED | Widget shell module, story, route, spec and KB added; the story now hosts a real native Table and functional actions. Surface, 32 px radius, 24 px inset and responsive containment are verified. | `packages/react/src/Widget/*`, `Widget.stories.tsx`, computed Chromium/WebKit geometry and mobile containment; replacement-preview retest pending. |
| DOC-001 | LOCAL_REMEDIATED | Foundation and docs surfaces updated, including dedicated shadow route and current engineering copy. Semantic Color Map now renders all 288 approved Global and Component roles with resolved aliases. | `apps/docs/app/foundation/shadow/page.tsx`, `Foundation.stories.tsx`, exact 288-row assertion and zero document overflow. |
| REG-001 | LOCAL_PASS | Registry, usage examples, specifications and knowledge passports updated for new entities and current contracts, включая existing Button, Badge и Fields family. | `registry/components.json`, `registry/component-usage.json`, updated specs/KB for Button, Badge, Text Field, Text Area, Select, Combobox, Multi Select, Checkbox, Radio, Switch, Date Picker and Table. |
| REL-001 | QA_PASSED | The first two candidates returned `QA_FAILED`. Exact candidate `5287ad377a1050284ebb187c37035063981382c0`, deployment `dpl_25TCodVWnskUcRgMaxM4mPFeJPbh`, passed independent Visual QA. Final evidence-only equivalence, production deployment and production smoke remain. | [`QA_REMEDIATION_REPORT.md`](./QA_REMEDIATION_REPORT.md). |

## Remaining blockers

1. `REL-001` remains open only for final evidence-only equivalence, production deployment and production smoke; independent Visual QA has passed.
2. Tabs remain out of public scope pending separate API decision; current implementation does not export or publish Tabs.

## Files touched in this phase

- Token sync/build: `packages/tokens/scripts/sync-figma-snapshot.mjs`, generated token sources, `packages/tokens/scripts/build.mjs`.
- React runtime: `packages/react/src/Button/button.css`, `packages/react/src/Field/field.css`, `packages/react/src/DatePicker/date-picker.css`, `packages/react/src/Selection/selection.css`, plus Tooltip/ContextMenu/Widget and DateRange exports already in scope.
- Storybook: `Button.stories.tsx`, `Fields.stories.tsx`, `DatePicker.stories.tsx`, `Table.stories.tsx`, `Foundation.stories.tsx`, `foundation.css`, new Tooltip/ContextMenu/Widget stories.
- Portal/docs: foundation shadow route, component/pattern/template routes and navigation updates.
- Registry/spec/KB: usage examples, current component specifications, passports and indexes, включая existing Button, Badge и Fields family.

## Handoff status

The implementation artifact is **QA_PASSED** and production-authorized. The next allowed step is to prove the final evidence-only commit leaves runtime sources unchanged, deploy its exact SHA to production and run the required production smoke check.
