# Table downstream implementation scope

## Required starting state

1. Open every canonical Figma node listed in `HANDOFF.md` and compare this package against live Figma before coding.
2. Preserve the current dirty shared checkout in quarantine. Do not treat it as release evidence and do not overwrite it.
3. Work in an isolated clean worktree from an explicitly recorded baseline SHA.
4. Produce a Figma-source-to-code gap matrix and report package/live conflicts before implementation.

## Tokens

- Reconcile the 125 bound variables in `FIGMA_STRUCTURE.json` with DTCG source and generated artifacts.
- Change only required missing/conflicting Table roles and shared dependency roles.
- Preserve alias chains and WEB syntax; do not hardcode resolved colors, spacing, radii, typography, shadows or icon strokes.
- Verify deterministic generation and absence of deprecated active consumers.
- Keep outline icon stroke at the shared 1.4 px contract with non-scaling stroke where SVG scaling can occur.

## React

Keep native table semantics and the existing behavioral structure where valid:

- `Table`, `TableHead`, `TableBody`, `TableRow`;
- `TableHeaderCell`, `TableCell`, `TableFileCell`.

Close proven gaps with the smallest reusable API. Candidate reusable/internal parts include selection/index/drag/summary compositions, paginator, header context action and synchronized filter floor. The final API must satisfy these rules:

- do not expose Figma `Rows=10/15/20/30` as visual React variants; row count belongs to data/pagination;
- do not reproduce Figma column components as invalid column-oriented DOM;
- apply density once at Table level and preserve child content/state across changes;
- keep header height 48 while utility widths follow density;
- implement Read/Edit behavior, cell/row state separation, sorting, filter floor, truncation/tooltip, summary and pagination;
- reuse Checkbox, Badge, Field, Date Picker, Date Range Picker, Select, Context Menu and Tooltip rather than recreating them;
- use exact approved icon assets/components; remove story-local substitute SVGs where an approved source exists;
- product data, column count and business actions remain consumer-owned.

Public exports are required only for reusable behavior. Figma-only source bricks may remain internal primitives, but every one must be implemented, documented and inspectable.

## Storybook

- Replace the current three-story reduced view with a nested documentation structure matching `HANDOFF.md`.
- Show every approved source family, all state axes and both densities.
- Large Cartesian matrices may use controls/tabs, but no approved state may be absent from inspectable documentation.
- Stories must consume `@cometal/react`; story-local substitutes do not count as delivered implementation.
- Add interaction coverage for sorting cycle, row selection/mixed header, density persistence, editing entry, filter-floor synchronization, active overlays, paginator and context action.
- Add a Playground that uses the same public API and documentation manifest as the portal.

## Portal

- Consume the same React implementation and shared Table documentation manifest as Storybook.
- Add exact links to all canonical source nodes, not only Review.
- Show architecture, source families, states, sizes/density, behavior, accessibility, API, examples, Playground and match status.
- Do not duplicate a second demo-only Table implementation.

## Specification, registry and knowledge

- Update `specifications/components/table.md` to match exact current sources and resolved evidence conflicts.
- Update `registry/components.json` from optimistic booleans to evidence-backed status; keep `PARTIAL` until independent QA passes.
- Store all canonical Figma source IDs in registry/specification; Review remains evidence only.
- Update `registry/component-usage.json` after the final API is stable.
- Update `knowledge-base/02 Components/Table.md` and linked indexes/decisions.
- Update the Widget + Table pattern only where required to consume the corrected Table API; do not redesign Widget in this handoff.

## Tests and evidence

Required local verification:

- structural token/registry/spec validation;
- deterministic token generation;
- React unit tests;
- Storybook interaction tests;
- accessibility checks;
- computed-style assertions for geometry, token values, 1 px dividers and 1.4 px icon strokes;
- responsive checks at desktop and mobile widths;
- visual screenshots of all source matrices plus Read/Edit presentation tables;
- density swap tests proving content, badge settings, icon swaps and state persistence;
- clean build for packages, Storybook and portal.

Create a preview tied to an exact commit SHA. Handoff the preview, SHA, gap matrix and evidence to independent Visual QA. Production remains forbidden until Visual QA PASS and Vadim's explicit publish command.

## Explicit exclusions

- No Figma edits.
- No production deployment or npm publication.
- No third density.
- No Header Error state.
- No column reordering.
- No Tabs work.
- No Widget redesign.
- No invented icons, raw values, geometry or behavior.
- No claim of `MATCHED` based only on build success, registry flags or an approximate Review screenshot.

## Decision requests before final MATCHED

- Confirm editing commit/cancel and validation timing.
- Confirm the keyboard row-reorder command while preserving the required context-menu alternative.
- Confirm any public exports added beyond the existing Table primitives, with compatibility impact.

These decisions do not block the initial gap analysis and implementation of already approved visual/source contracts.

## Definition of Done

- All 16 Component Sets, 5 standalone sources and 271 variants are represented in implementation/documentation or explicitly approved as internal composition.
- Every coverage row is `MATCH` or has an approved exception.
- Tokens, React, Storybook, portal, spec, registry, knowledge and tests refer to the same contract.
- No story-local substitute is counted as package delivery.
- Preview is immutable and tied to an exact SHA.
- Independent Visual QA compares against live Figma and this package.
- Production is untouched until explicit PASS and publish authorization.
