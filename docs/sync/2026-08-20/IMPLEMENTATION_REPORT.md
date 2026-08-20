# COMETAL DS Global Sync - Implementation Report

**Date:** 2026-08-20
**Scope:** downstream implementation, initial preview, independent QA remediation and replacement-preview preparation.
**Baseline SHA:** `0551bb03662397087480a8ae66916b170402f18b`
**Current state:** initial preview QA returned `QA_FAILED`; the confirmed defects are remediated and pass local cross-browser verification. A replacement preview and independent retest are required. Production remains blocked until the exact replacement preview returns `QA_PASSED`.

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
| CMP-003 | LOCAL_PASS | Checkbox/Radio/Switch states aligned; checked border removal and 1.4px mark contract preserved; Tabs remain unpublished. | `packages/react/src/Selection/selection.css`, updated selection specs/KB, no Tabs export. |
| CMP-004 | LOCAL_PASS | Date Picker plus Date Range Picker contract implemented; date-range story and table header filter reuse added; calendar icons fixed to rendered 1.4px. | `DateRangePicker.tsx`, `date-picker.css`, `DatePicker.stories.tsx`, date-picker docs/spec/KB. |
| CMP-005 | LOCAL_PASS | Badge remained aligned and available for Table/status usage. | Existing badge story/spec/KB plus registry link continuity. |
| CMP-006 | LOCAL_REMEDIATED | Tooltip component, story, portal route, spec and KB added and wired into Table truncation pattern. Initial preview defects in semantic colors, side-arrow positioning and mobile multi-open evidence were corrected. | `packages/react/src/Tooltip/*`, `Tooltip.stories.tsx`, focused Chromium/WebKit screenshots; replacement-preview retest pending. |
| PAT-001 | LOCAL_REMEDIATED | Context Menu component, story, route, spec and KB added; danger foreground semantics and raised surface corrected. | `packages/react/src/ContextMenu/*`, computed white raised surface and 4 px item radius in both engines; replacement-preview retest pending. |
| PAT-002 | LOCAL_PASS | Table story now covers Tooltip truncation, Context Menu reuse, Date Range filter, reorder handle and summary/pager composition. | `apps/storybook/stories/Table.stories.tsx`, table portal/spec/KB, usage example update. |
| PAT-003 | LOCAL_REMEDIATED | Widget shell module, story, route, spec and KB added; widget uses shared foundation/tokens. Invalid surface reference and 48 px padding drift were corrected to the approved white surface, 32 px radius and 24 px inset. | `packages/react/src/Widget/*`, computed Chromium/WebKit geometry; replacement-preview retest pending. |
| DOC-001 | LOCAL_REMEDIATED | Foundation and docs surfaces updated, including dedicated shadow route and current engineering copy. Semantic color-table overflow and an invalid spacing reference in shadow samples were corrected. | `apps/docs/app/foundation/shadow/page.tsx`, `Foundation.stories.tsx`, zero document overflow at desktop/mobile in both engines. |
| REG-001 | LOCAL_PASS | Registry, usage examples, specifications and knowledge passports updated for new entities and current contracts, включая existing Button, Badge и Fields family. | `registry/components.json`, `registry/component-usage.json`, updated specs/KB for Button, Badge, Text Field, Text Area, Select, Combobox, Multi Select, Checkbox, Radio, Switch, Date Picker and Table. |
| REL-001 | RETEST_PENDING | Preview `dpl_DunwFDQ1kUKnwm6CP7AE6CtwyAK1` for SHA `71826516bc76126996f5018fa05f41937ba602e0` returned `QA_FAILED`. Confirmed defects were fixed and pass local verification; replacement preview plus a fresh independent QA run remain mandatory. | [`QA_REMEDIATION_REPORT.md`](./QA_REMEDIATION_REPORT.md). |

## Remaining blockers

1. `REL-001` remains open until a replacement preview is published and independent Visual QA returns `QA_PASSED`; production is prohibited before that verdict.
2. Tabs remain out of public scope pending separate API decision; current local implementation does not export or publish Tabs.

## Files touched in this phase

- Token sync/build: `packages/tokens/scripts/sync-figma-snapshot.mjs`, generated token sources, `packages/tokens/scripts/build.mjs`.
- React runtime: `packages/react/src/Button/button.css`, `packages/react/src/Field/field.css`, `packages/react/src/DatePicker/date-picker.css`, `packages/react/src/Selection/selection.css`, plus Tooltip/ContextMenu/Widget and DateRange exports already in scope.
- Storybook: `Button.stories.tsx`, `Fields.stories.tsx`, `DatePicker.stories.tsx`, `Table.stories.tsx`, `Foundation.stories.tsx`, `foundation.css`, new Tooltip/ContextMenu/Widget stories.
- Portal/docs: foundation shadow route, component/pattern/template routes and navigation updates.
- Registry/spec/KB: usage examples, current component specifications, passports and indexes, включая existing Button, Badge и Fields family.

## Handoff status

The checkout is **replacement-preview ready** after local remediation. The next allowed step is to publish the exact committed state to preview and rerun independent Visual QA against that SHA. Production remains blocked until the replacement preview returns `QA_PASSED`.
