# COMETAL DS Sync Manifest

**Wave:** `COMETAL DS - Global Synchronization Wave`
**Manifest date:** 2026-08-20
**Target authority:** current approved Figma DS Core state
**Figma file:** `KKNGucImxFAtQLBhPy8tLs`
**Last known good baseline:** `0551bb03662397087480a8ae66916b170402f18b`
**Manifest status:** `VALIDATED` for Figma; downstream sources are `TASKED` or `DISCOVERED` until implementation and QA evidence exists.

This is the canonical ledger for the current synchronization wave. The exact Figma inventories are machine-readable appendices:

- [`figma-variables-current.json`](./figma-variables-current.json): all 770 variables, IDs, keys, types, scopes, WEB syntax, values and aliases.
- [`figma-components-current.json`](./figma-components-current.json): affected pages, component sets, variants, properties and standalone components.
- [`figma-styles-current.json`](./figma-styles-current.json): all 23 local text styles and both effect styles.

No downstream agent may reinterpret Figma from scratch or create an independent change list. All implementation, documentation and QA work must cite the Change IDs below.

## Five Sources of Truth

| ID | Source | Purpose and owner | Current state | Update mechanism | Required match |
|---|---|---|---|---|---|
| SOT-1 | Figma DS Core | Visual composition, variants, visual states and prototype behavior. Owner: Design System Lead. | `VALIDATED`, target state. | Figma library changes, variable/style bindings and component publication. | Token values and names must map to SOT-3; public identity/status to SOT-2; rendered result to SOT-4; decisions to SOT-5. |
| SOT-2 | Git specifications and registry | Stable IDs, status, specifications, ownership and source links. Owner: Design System Lead. | `DISCOVERED`, stale at baseline. | Reviewed Git changes in `specifications/` and `registry/`. | SOT-1 public entities, SOT-3 API and SOT-4 exact story routes. |
| SOT-3 | Git tokens and React implementation | Token values, React API, behavior, types and accessibility. Owner: Design System Lead with Frontend Lead review. | `DISCOVERED`, stale at baseline. | DTCG sources, generated outputs, React changes, tests and reviewed merge. | SOT-1 approved contract; SOT-2 specification; SOT-4 implementation evidence. |
| SOT-4 | Storybook | Rendered states, implementation docs, interaction/a11y tests and release preview. Owner: Design System Lead with Frontend Lead review. | `DISCOVERED`, production still on baseline. | Story/docs updates, test/build, preview and Vercel production deployment. | SOT-1 visual contract, SOT-3 executable implementation and SOT-2 routes/status. |
| SOT-5 | Obsidian knowledge base | Context, patterns, templates, processes, decisions and relationships. Owner: Design System Lead. | `DISCOVERED`, stale at baseline. | Update `knowledge-base/` passports, decision records and indexes in the same Git wave. | SOT-1 terminology, SOT-2 stable IDs/status and SOT-3/SOT-4 links. |

GitHub and Vercel are publication infrastructure. They are not additional Sources of Truth.

## Last Known Good Baseline

| Surface | Confirmed baseline |
|---|---|
| Figma | Approved Table Review `2353:10833`, Technical Typography `2561:116`, and the 631-variable contract represented in the synchronized repository snapshot. |
| Git | `0551bb03662397087480a8ae66916b170402f18b` (`feat: sync table and technical typography`). |
| Tokens/React | Private workspace packages `@cometal/tokens` and `@cometal/react`, version `0.0.0`; 403 primitive + 156 semantic + 72 component roles. npm publication was and remains deferred. |
| Storybook/portal | Production deployment `dpl_GQVfCNUafRSHGuSxVSeCBrQaR6GA`, state `READY`, source SHA `0551bb03662397087480a8ae66916b170402f18b`. |
| Registry/spec/Obsidian | 12 registry records at the same Git SHA; synchronized specification and knowledge-base paths recorded in the 2026-08-14 handoff. |
| Evidence | `docs/handoffs/2026-08-14-table-technical-typography-sync.md`, `docs/audits/figma-storybook-sync-handoff-2026-08-13.md`, Git SHA and production deployment identity. |

This baseline is used because the same SHA is confirmed in Git and Vercel production and its handoff records Figma, tokens, React, Storybook, specifications, registry and Obsidian validation. A newer synchronized production state was not found.

## Delta Summary

| Area | Baseline | Current Figma target | Delta |
|---|---:|---:|---:|
| Variable collections | 8 | 12 | +4; rebuilt as typed Primitive/Semantic pairs. |
| Variables | 631 | 770 | +139 net. All Figma variable IDs and keys were recreated. |
| Primitive variables | 403 | 413 | +10. |
| Global semantic roles | 156 | 163 | +7 net. |
| Component semantic roles | 72 | 194 | +122 net. |
| Local text styles | 22 | 23 | +1 (`Brand/Cover/Wordmark`). |
| Local effect styles | 0 | 2 | +2 (`Floating/Soft`, `Floating/Hard`). |
| Production component sets | Baseline registry scope | 63 sets / 1041 variants in current audited scope | New and materially expanded contracts. |
| Figma pages | 57 at baseline QA | 59 current | +2 net; current file structure is authoritative. |

Primitive additions are exact: `Neutral/900/{4,8,12,16}`, `Radius/400 = 32`, `Size/{96,112,144}`, and Boolean `False/True`.

Current collection counts are exact: Color Primitive 368, Color Semantic 288, Spacing Primitive 17, Spacing Semantic 37, Radius Primitive 7, Radius Semantic 9, Size Primitive 16, Size Semantic 20, Stroke Primitive 3, Stroke Semantic 2, Boolean Primitive 2 and Boolean Semantic 1.

## Figma Validation Gate

The target passed the Figma-only gate before propagation:

- broken aliases: 0;
- alias cycles: 0;
- type mismatches: 0;
- missing mode values: 0;
- missing descriptions: 0;
- missing WEB syntax: 0;
- duplicate variable names or WEB syntax: 0;
- duplicate variant combinations: 0;
- inconsistent variant keys: 0;
- invalid defaults: 0;
- orphan or remote instances: 0;
- missing fonts in production scope: 0;
- outline stroke violations: 0; all 875 outline icons use 1.4 px;
- Semantic Color Map coverage: 288/288;
- screenshot QA defects in audited target: 0.

The validation evidence is `/Users/vadim/Documents/Cometal/docs/figma-ds-core-full-audit-2026-08-19.md`. Its current metrics were rechecked against the live 2026-08-20 Figma snapshots.

## Canonical Change Ledger

### TOK-001 - Typed variable architecture migration

- **Category:** Variables / architecture.
- **Entity:** all Figma variable collections and downstream token namespaces.
- **Previous state:** 8 mixed collections: Primitive, Semantic and component-family collections; 631 variables.
- **Current Figma state:** 12 typed collections, each foundation family split into Primitive and Semantic; 770 variables; Color Semantic has only production mode `Light`, all non-color collections use `Value`.
- **Type:** breaking identity and namespace migration.
- **Affected SoT:** SOT-1, SOT-2, SOT-3, SOT-4, SOT-5.
- **Owner:** Figma DS Core for source inventory; Web Storybook for Git/token/React/Storybook propagation; Backlog for traceability; Visual QA for evidence.
- **Required action:** replace old collection/identifier assumptions with the exact current snapshot; regenerate token artifacts; update references and documentation. Do not preserve old Figma IDs as canonical IDs.
- **Dependencies:** none; prerequisite for every downstream item.
- **Validation:** exact count/type/name/value/alias comparison to `figma-variables-current.json`; generated-token diff; zero unresolved old identifiers.
- **Status:** `VALIDATED` in Figma; downstream `DISCOVERED`.

### TOK-002 - Primitive scale additions

- **Category:** Variables / primitives.
- **Entity:** color alpha, radius, size and Boolean primitives.
- **Previous state:** 403 primitives; no 4/8/12/16% Neutral 900 alpha set, no 32 px widget radius, no 96/112/144 widths, no Boolean collection.
- **Current Figma state:** 413 primitives; exact additions: `Neutral/900/{4,8,12,16}`, `Radius/400`, `Size/{96,112,144}`, Boolean `False/True`.
- **Type:** additive, with downstream generated-output impact.
- **Affected SoT:** SOT-2, SOT-3, SOT-4, SOT-5.
- **Owner:** Web Storybook.
- **Required action:** add exact DTCG values and generated CSS/TS outputs; document reserved `False` and production `True` use.
- **Dependencies:** TOK-001.
- **Validation:** primitive leaf count 413; values match Figma; build snapshots contain all ten additions once.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### TOK-003 - Global and component semantic expansion

- **Category:** Variables / semantics.
- **Entity:** `Global/*` and `Component/*` roles across Color, Spacing, Radius, Size, Stroke and Boolean.
- **Previous state:** 156 semantic + 72 component roles in separate collection model.
- **Current Figma state:** 163 Global + 194 Component roles in typed Semantic collections. Color families include Component Badge 18, Button 90, Icon 3, Input 26, Option 11 and Table 29.
- **Type:** breaking namespace migration plus additive roles.
- **Affected SoT:** all five.
- **Owner:** Figma DS Core and Web Storybook.
- **Required action:** emit canonical paths from exact snapshot; remove density-mode duplication where the Figma target now uses explicit semantic names; preserve alias graph rather than flattening values.
- **Dependencies:** TOK-001, TOK-002.
- **Validation:** 357 semantic roles, 357 aliases, no raw terminal value in a semantic role, no broken target.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### TOK-004 - Legacy role removal and deprecation closure

- **Category:** Variables / deletion.
- **Entity:** 32 confirmed obsolete semantic roles listed in the Figma audit, including unused Input focus/success branches, old Option indicators, obsolete Table border/status/file roles and `Global/Icon/Badge`.
- **Previous state:** roles existed during the accumulated migration and could be consumed by stale downstream artifacts.
- **Current Figma state:** removed after dependency audit; no current Figma binding depends on them.
- **Type:** breaking deletion.
- **Affected SoT:** SOT-2, SOT-3, SOT-4, SOT-5.
- **Owner:** Web Storybook with Frontend Lead review.
- **Required action:** search generated and hand-written consumers; replace with current roles or delete; record rename/replacement where a public API is affected.
- **Dependencies:** TOK-003.
- **Validation:** repository-wide search returns no active consumer; generated artifacts exclude every removed name; migration note is present.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### TOK-005 - Brand interaction ramp

- **Category:** Color semantics.
- **Entity:** `Global/Action/Brand/*`, Global Button Primary container and all component bindings that consume them.
- **Previous state:** Default/Hover/Pressed used Blue 600/700/800.
- **Current Figma state:** Default/Hover/Pressed use Blue 500/600/700; Disabled remains Neutral 300 for action and Neutral 100 for Primary container.
- **Type:** non-breaking API, breaking visual token value.
- **Affected SoT:** SOT-3, SOT-4, SOT-5 and visual regression baselines.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** update token aliases once at semantic level; remove component hardcodes; rebaseline impacted controls only after comparison.
- **Dependencies:** TOK-001, TOK-003.
- **Validation:** computed Primary states and selection controls match the 500/600/700 ramp; text/icon content remains inverse and consistent.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### TOK-006 - Neutral state layers, placeholder and disabled content

- **Category:** Color semantics.
- **Entity:** `Global/State Layer/Neutral/{Hover,Pressed}`, `Global/Text/Placeholder`, current disabled text/icon/control mappings.
- **Previous state:** no 4/8% neutral state-layer contract; placeholder used Neutral 500 and failed the later contrast target; stale disabled mappings caused inconsistent controls.
- **Current Figma state:** state layers alias Neutral 900/4 and /8; placeholder aliases Neutral 600/100 (about 4.9:1 on Canvas); disabled roles are normalized through current semantic aliases.
- **Type:** non-breaking API, visual value change.
- **Affected SoT:** SOT-3, SOT-4, SOT-5.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** update generated values and all control consumers; verify no local gray overrides remain.
- **Dependencies:** TOK-002, TOK-003.
- **Validation:** contrast, hover/pressed screenshots, and repository hardcode scan.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### TOK-007 - Table semantic contract

- **Category:** Component tokens.
- **Entity:** 29 Table color roles plus 7 spacing, 8 size, 1 stroke and 1 Boolean semantic roles.
- **Previous state:** density-expanded component-token branches with duplicated values and obsolete selected/error/control/status roles.
- **Current Figma state:** explicit semantic roles for cell/header surfaces and text/icons, summary, file metadata, min widths, fixed header 48, rows 48/40, border width 1 and Comfortable metadata Boolean.
- **Type:** breaking token-path migration, non-breaking visual intent.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** update DTCG, CSS/TS, React Table consumers, stories, specs and knowledge; preserve native table semantics and per-density content persistence.
- **Dependencies:** TOK-001 through TOK-006.
- **Validation:** exact names/aliases from snapshot; Table tests; 48/40 row and 48 header geometry; density swap; no double dividers.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### TOK-008 - Documentation and widget foundation roles

- **Category:** Spacing/radius semantics.
- **Entity:** documentation gaps/insets/radius and `Global/Widget` radius.
- **Previous state:** duplicated or local board spacing/radius; no semantic 32 px widget radius.
- **Current Figma state:** documentation boards use shared semantic bindings; Widget radius is 32 px; content inset is 24 px so inner 8 px components preserve the 32 - 24 = 8 radius relation.
- **Type:** additive plus local-value removal.
- **Affected SoT:** SOT-2, SOT-3, SOT-4, SOT-5.
- **Owner:** Figma DS Core and Web Storybook.
- **Required action:** encode token roles, update portal samples and widget implementation, remove local fallback values.
- **Dependencies:** TOK-002, TOK-003.
- **Validation:** exact variable aliases and computed widget geometry.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### TYP-001 - Typography inventory update

- **Category:** Typography styles.
- **Entity:** 23 Figma text styles.
- **Previous state:** 22 styles; Technical IBM Plex Mono contract already existed at baseline.
- **Current Figma state:** adds `Brand/Cover/Wordmark`; all production text is styled, with three documented native-emoji exceptions.
- **Type:** additive documentation-only style plus inventory normalization.
- **Affected SoT:** SOT-2, SOT-3, SOT-4, SOT-5.
- **Owner:** Web Storybook.
- **Required action:** keep existing Technical styles; add/document Wordmark only where portal coverage is intended; do not turn the decorative cover style into product typography.
- **Dependencies:** TOK-001.
- **Validation:** exact 23-style comparison to `figma-styles-current.json`; font loading/build checks.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### EFX-001 - Floating elevation styles

- **Category:** Effect styles.
- **Entity:** `Effects/Elevation/Floating/Soft` and `Effects/Elevation/Floating/Hard`.
- **Previous state:** no canonical local effect styles in baseline.
- **Current Figma state:** Soft uses two aliased layers (Neutral 900/4 and /8); Hard uses three aliased layers. Exact offsets, blur and spread are in `figma-styles-current.json`.
- **Type:** additive.
- **Affected SoT:** SOT-2, SOT-3, SOT-4, SOT-5.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** add tokenized shadow recipes and apply Soft to calendars/listboxes/select/combobox overlays, Hard to compact dropdown/context action surfaces.
- **Dependencies:** TOK-002, TOK-003.
- **Validation:** computed `box-shadow` layer-by-layer and screenshot comparison on every overlay family.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### CMP-001 - Button normalization

- **Category:** Component.
- **Entity:** nine public Button sets and three content sources.
- **Previous state:** baseline 9 sets; old brand ramp and incomplete content bindings could produce mismatched text/icon colors.
- **Current Figma state:** each set has Size L/M/S and State Default/Hover/Pressed/Disabled/Loading; Focus is a Boolean property; content sources expose label, left/right visibility and instance swaps; Primary follows the new brand ramp; Secondary content uses one semantic role for text and icon.
- **Type:** API-compatible unless current React controls diverge; visual/token change.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** map semantic intent to React props without exposing internal Figma source structure; update all stories and nested Widget uses.
- **Dependencies:** TOK-005, TOK-006.
- **Validation:** all sizes/states/compositions, content color parity, focus/loading and 1.4 px icons.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### CMP-002 - Fields and overlay behavior

- **Category:** Component.
- **Entity:** Text Field, Text Area, Select, Combobox, Multi Select and 12 source sets.
- **Previous state:** baseline public field family without the complete current S-size/active overlay/filter-trigger contract and canonical shadows.
- **Current Figma state:** Field Base L/M/S; Select and Combobox L/M/S with Active; Multi Select L/M; listbox data states; 6 px overlay gap; current placeholder contrast; overlays consume EFX-001.
- **Type:** additive state/size behavior; potential React API change.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** update field size/state APIs, dropdown render behavior and tests; keep active/open state deterministic; retain textarea scroll/count contract.
- **Dependencies:** TOK-006, EFX-001.
- **Validation:** geometry, content centering, overlay gap/shadow/clipping, keyboard and a11y interaction tests.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### CMP-003 - Selection controls and Tabs

- **Category:** Component.
- **Entity:** Checkbox, Radio Button, Switch and Tabs.
- **Previous state:** baseline Checkbox/Radio/Switch public; Tabs Figma draft; state colors and Checkbox borders were revised during the accumulated delta.
- **Current Figma state:** Checkbox L/M/S x Default/Hover/Pressed/Disabled x Unchecked/Checked/Mixed; Radio and Switch equivalent state matrices; selected Checkbox Hover/Disabled have no extra outline; unchecked Hover keeps Default stroke and changes fill; Tabs remains Figma-only until public API approval.
- **Type:** visual/state correction; Tabs remains blocked from public propagation.
- **Affected SoT:** Checkbox/Radio/Switch across all five; Tabs documentation only unless separately approved.
- **Owner:** Web Storybook; Visual QA; Frontend Lead for Tabs API decision.
- **Required action:** update existing selection controls and stories; do not publish Tabs as a React public component in this wave.
- **Dependencies:** TOK-005, TOK-006.
- **Validation:** complete state matrices, keyboard focus, checked/mixed marks, no density-induced extra stroke in Table selection columns.
- **Status:** selection controls Figma `VALIDATED`; Tabs `BLOCKED / REQUIRES API DECISION` for SOT-3/SOT-4 publication.

### CMP-004 - Date Picker and Date Range Picker

- **Category:** Component.
- **Entity:** Date Picker, Date Range Picker, calendar panels/day and table-header date filters.
- **Previous state:** baseline single Date Picker contract; no complete period-picker and header-filter integration.
- **Current Figma state:** Date Picker and Date Range Picker each expose Edit/Read, L/M and Default/Active; calendar day includes ten states; range start/middle/end geometry is normalized; Soft elevation is applied to panels.
- **Type:** additive public capability and behavior.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** extend existing Date Picker package rather than create an unrelated duplicate; define range value/API, keyboard behavior, parsing, accessibility and Table-filter integration.
- **Dependencies:** CMP-002, EFX-001.
- **Validation:** state/geometry match, focus visibility, range semantics, keyboard/a11y tests and open-overlay screenshots.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### CMP-005 - Badge normalization

- **Category:** Component.
- **Entity:** Badge.
- **Previous state:** baseline Badge public, but accumulated work changed light/dark treatment, booleans, icon swaps and nested Table usage.
- **Current Figma state:** one set with Surface Light/Dark and eight tones; left icon, text and right icon are independently configurable; icon-only composition is circular; nested swaps preserve content/settings; no black icons.
- **Type:** API refinement and visual correction.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** preserve one component API with Boolean content parts and tone/surface props; ensure nested Table content inherits foreground semantics.
- **Dependencies:** TOK-003, TOK-006.
- **Validation:** 16 variants plus composition permutations, icon swap/color preservation and Table density swaps.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### CMP-006 - Tooltip

- **Category:** New component.
- **Entity:** Tooltip.
- **Previous state:** absent from baseline registry/React/Storybook.
- **Current Figma state:** 16 variants: Compact/Wide x eight placements; dark surface, light content, attached arrow without a seam; intended for truncated Table content and general hints.
- **Type:** additive public component.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Backlog; Visual QA.
- **Required action:** register stable ID, specification, React API, Storybook interactions/a11y and Obsidian passport; implement collision/viewport behavior separately from visual placement variants.
- **Dependencies:** TOK-003, EFX-001.
- **Validation:** all placements, no arrow/panel divider, clipping and viewport-flip tests, contrast and screen-reader contract.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### PAT-001 - Context Menu

- **Category:** New pattern.
- **Entity:** Context Menu with Item, Divider and Main sources.
- **Previous state:** absent from baseline registry/React/Storybook; Table used local menu concepts.
- **Current Figma state:** Main L/M/S; Item L/M/S x Default/Hover/Selected/Disabled x Default/Danger; selected indicator is trailing; Hard elevation; used by header actions, filter operations and selected-row actions.
- **Type:** additive pattern and behavior.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** implement one composable menu primitive/pattern and reuse it in Table; define focus roving, keyboard, anchoring and right-click behavior.
- **Dependencies:** TOK-006, EFX-001.
- **Validation:** menu roles/keyboard, all sizes/states, selected alignment, overlay geometry and Table integration.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### PAT-002 - Table expanded contract

- **Category:** Pattern / major expansion.
- **Entity:** 16 component sets and five standalone sources on the Tables page.
- **Previous state:** baseline native Table supported core rows, density, file metadata and basic states.
- **Current Figma state:** Read/Edit cells, Selection/Index/Drag/Summary cells, filters, sortable headers, context action, five column families, paginator, 10/15/20/30 rows, Comfortable/Compact, open listbox/date-range/context-menu presentation states and Widget-ready payload.
- **Type:** substantial additive API and visual/token migration.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Visual QA; Frontend Lead review.
- **Required action:** extend the existing native-table implementation; preserve user content when density changes; expose composition without hardcoding Figma rows as React variants; implement filter/date/menu/paginator/reorder/summary contracts and docs.
- **Dependencies:** TOK-007, CMP-002 through CMP-006, PAT-001.
- **Validation:** full Table matrix, native semantics, API tests, density swaps, column widths, truncation/tooltips, overlays, dividers, selection/error states, horizontal overflow and screenshots.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### PAT-003 - Widget container

- **Category:** New pattern/template.
- **Entity:** Widget, toolbar actions, content slot and Table payload.
- **Previous state:** absent from baseline public registry/React/Storybook.
- **Current Figma state:** 32 px outer radius, 24 px inset, 8 px inner content radius, 24 px title, configurable primary/secondary toolbar actions, tokenized content slot and full-border Table payload.
- **Type:** additive pattern/template.
- **Affected SoT:** all five.
- **Owner:** Web Storybook; Visual QA.
- **Required action:** define composable `Widget` API with header/actions/content slots; use current Button and Table implementations; do not bake Table-specific behavior into the generic shell.
- **Dependencies:** TOK-008, CMP-001, PAT-002.
- **Validation:** slot composition, action count, radius equation, dividers, responsive behavior and a11y landmarks.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### DOC-001 - Foundation and documentation boards

- **Category:** Documentation.
- **Entity:** Colors, Typography, Spacing, Radius, Shadow, Icons and normalized component/pattern boards.
- **Previous state:** incomplete Semantic Color Map and inconsistent local board geometry.
- **Current Figma state:** Semantic Color Map documents 288/288 roles; 23 text styles and two effect styles are documented; standard boards use 1920/2400 widths, semantic gaps/insets/radius and no clipping where focus/overlays extend.
- **Type:** documentation update.
- **Affected SoT:** SOT-2, SOT-4, SOT-5.
- **Owner:** Web Storybook and Design System Lead.
- **Required action:** update portal/Storybook Foundation pages and knowledge references from the same token/style snapshots.
- **Dependencies:** all TOK/TYP/EFX items.
- **Validation:** inventory counts, exact aliases and representative screenshots.
- **Status:** Figma `VALIDATED`; downstream `DISCOVERED`.

### REG-001 - Public registry, specifications and knowledge passports

- **Category:** Governance/documentation.
- **Entity:** registry records, component/pattern specifications and Obsidian knowledge.
- **Previous state:** 12 records at baseline; Tooltip, Context Menu and Widget absent; current Date Range/Table expansions undocumented.
- **Current Figma state:** approved design contract exists for these entities.
- **Type:** additive and update.
- **Affected SoT:** SOT-2 and SOT-5, with links to SOT-1/SOT-3/SOT-4.
- **Owner:** Backlog / Tracker for work registration; Web Storybook for repository artifacts; Design System Lead for status.
- **Required action:** add stable IDs and passports for Tooltip, Context Menu and Widget; update existing Button, Fields, selection, Date Picker, Badge and Table specs; keep status `in-review` until Frontend Lead and product gates.
- **Dependencies:** CMP-001 through PAT-003.
- **Validation:** schema validation, no missing links, exact Figma nodes and Storybook story IDs.
- **Status:** `DISCOVERED`.

### REL-001 - Controlled publication and cross-source QA

- **Category:** Release.
- **Entity:** Git main, generated packages, Storybook/portal, Vercel deployment and final match matrix.
- **Previous state:** production deployment and Git main point to baseline SHA `0551bb0...`.
- **Current Figma state:** approved unpublished delta is ready for propagation.
- **Type:** release wave; npm publication explicitly excluded.
- **Affected SoT:** all five plus GitHub/Vercel publication infrastructure.
- **Owner:** Web Storybook for implementation/publication; Visual QA for independent verification; Backlog for gate status.
- **Required action:** implement locally, test/build, create reviewed commit/PR, deploy preview, complete QA, then publish production and verify exact SHA/deployment.
- **Dependencies:** every prior Change ID.
- **Validation:** token/component structural diff, unit/interaction/a11y/build checks, desktop/mobile visual regression, production smoke and final matrix.
- **Status:** `DISCOVERED`; cannot become `MATCHED` before independent QA.

## Transitive Impact Graph

```text
TOK-001 collection and identity migration
  -> TOK-002/TOK-003 generated token graph
  -> TOK-004 deletion and migration checks
  -> all component bindings
  -> React CSS/TS token consumption
  -> Storybook controls and visual baselines
  -> registry/spec/knowledge references

TOK-005 brand ramp + TOK-006 neutral layers
  -> Button and selection controls
  -> nested Widget toolbar and Table controls
  -> Storybook interaction states
  -> cross-browser screenshots and contrast evidence

EFX-001 shadows
  -> Fields overlays + Date panels + Tooltip + Context Menu
  -> Table open states
  -> clipping/z-index/viewport QA

TOK-007 Table contract
  -> PAT-002 Table implementation
  -> PAT-003 Widget payload
  -> stories/specification/knowledge
  -> mobile overflow and visual regression
```

## Required Dependency Order

1. Confirm exact snapshots and manifest (`DONE`).
2. Register umbrella and child work items (`TASKED` after Tracker evidence).
3. Implement TOK-001 through TOK-008, TYP-001 and EFX-001 in token sources and generated artifacts.
4. Update existing components CMP-001 through CMP-005.
5. Implement CMP-006 and PAT-001, then integrate PAT-002 and PAT-003.
6. Update REG-001 and DOC-001 from exact implemented routes/API.
7. Run local structural, unit, interaction, accessibility and build checks.
8. Deploy preview; run independent Visual and Engineering QA.
9. Fix every failed Change ID and repeat the affected QA slice.
10. Publish reviewed Git main and Vercel production state.
11. Verify deployment SHA, update all source links and complete the final match matrix.
12. Close the umbrella only when every non-blocked row is `MATCHED` and every blocker is explicit.

## Initial Match Matrix

| Change ID | Figma | SOT-2 | SOT-3 | SOT-4 | SOT-5 | Visual QA | Engineering QA |
|---|---|---|---|---|---|---|---|
| TOK-001..TOK-008 | VALIDATED | DISCOVERED | DISCOVERED | DISCOVERED | DISCOVERED | PENDING | PENDING |
| TYP-001 | VALIDATED | DISCOVERED | DISCOVERED | DISCOVERED | DISCOVERED | PENDING | PENDING |
| EFX-001 | VALIDATED | DISCOVERED | DISCOVERED | DISCOVERED | DISCOVERED | PENDING | PENDING |
| CMP-001..CMP-005 | VALIDATED | DISCOVERED | DISCOVERED | DISCOVERED | DISCOVERED | PENDING | PENDING |
| CMP-006 | VALIDATED | DISCOVERED | DISCOVERED | DISCOVERED | DISCOVERED | PENDING | PENDING |
| PAT-001..PAT-003 | VALIDATED | DISCOVERED | DISCOVERED | DISCOVERED | DISCOVERED | PENDING | PENDING |
| DOC-001 | VALIDATED | DISCOVERED | N/A | DISCOVERED | DISCOVERED | PENDING | PENDING |
| REG-001 | VALIDATED | DISCOVERED | DISCOVERED | DISCOVERED | DISCOVERED | PENDING | PENDING |
| REL-001 | VALIDATED | DISCOVERED | DISCOVERED | DISCOVERED | DISCOVERED | PENDING | PENDING |

## Explicit Boundaries

- Current Figma is the target state for this wave, but ownership remains distributed by data type across the five SoTs.
- Figma variable IDs/keys changed completely; names, types, values, aliases and WEB syntax are the cross-surface contract.
- Figma variants must not be copied 1:1 into React props when a smaller behavioral API expresses the same contract.
- Tabs remains Figma-only until its public slot/count API is approved.
- npm publication for private `0.0.0` packages is not part of this wave.
- Frontend Lead review and product pilots remain separate gates; this wave must not claim them without evidence.
- No Change ID may move directly from `IMPLEMENTED` to `MATCHED`; publication and independent QA are required.
