# Widget downstream implementation scope

## Required starting state

1. Accept and inventory the Table handoff first; Widget + Table depends on it.
2. Open every canonical Widget node listed in `HANDOFF.md` and compare this package against live Figma before coding.
3. Preserve the current dirty shared checkout in quarantine. Do not overwrite or promote it.
4. Create an isolated clean worktree from an explicitly recorded baseline SHA.
5. Produce a file-level gap matrix for current Widget, Widget stories/routes/spec/registry/knowledge and Widget + Table consumers.

## Mandatory replacement

The old Widget delivery is rejected. In the isolated implementation branch:

- remove the legacy Widget-specific React/CSS implementation and rebuild it from this contract;
- replace legacy Widget stories, portal demos, specification and knowledge text rather than layering another approximation on top;
- remove duplicate/obsolete Widget routes, IDs, CSS selectors and story-local implementations after compatibility impact is known;
- keep shared dependencies intact;
- keep or reintroduce the public `Widget` export only through the new implementation;
- document any compatibility alias or migration instead of silently maintaining two implementations.

The final diff must include an explicit deletion/replacement ledger naming every removed legacy surface and every preserved compatibility surface.

## Tokens

- Reconcile the 22 directly observed bindings in `FIGMA_STRUCTURE.json` with DTCG source and generated artifacts.
- Style the generic shell only with Widget/Global roles: Raised surface, Default border, Primary/Secondary text, Widget radius and approved spacing.
- Do not consume Table-owned variables in Widget CSS.
- Reuse current Button tokens inside the toolbar and current Table tokens inside the Table payload.
- Preserve alias chains and WEB syntax; do not hardcode resolved values.
- Verify deterministic token generation and computed values: radius 32, inset/gap 24, header padding/gap 16, copy/toolbar gap 8, nested radius 8, border 1 px.

## React

Build the smallest reusable behavioral API that expresses the Figma contract. A recommended shape is:

```tsx
<Widget
  title="Спецификация позиций"
  description="20 строк · данные обновлены сегодня"
  toolbar={<WidgetActions />}
>
  <ApprovedContent />
</Widget>
```

Requirements:

- required title and content;
- optional description and toolbar/actions;
- semantic region with title/description association;
- fluid width and content-driven height;
- no Widget state variant prop;
- no hardcoded Filter/Refresh/Export/Add behavior;
- no Table-specific props on the generic Widget;
- no unconditional content clipping at shell level;
- preserve nested component semantics and state;
- support deliberate semantic root selection only if accessibility remains correct.

An optional internal `WidgetActions` composition may standardize spacing, but business actions remain consumer-provided. Do not expose four Figma Boolean props when an array/slot API expresses the same contract more cleanly.

## Storybook

Replace legacy Widget stories with a documentation structure backed by the shared manifest:

- Overview/Main Component;
- anatomy;
- description on/off;
- toolbar on/off and approved 3 Secondary + 1 Primary example;
- generic content swap examples;
- Widget + Table example using the accepted Table implementation;
- geometry/tokens;
- responsive and accessibility examples;
- Playground.

Stories must consume `@cometal/react`. Story-local Widget shells, Table substitutes or duplicate Button styling do not count.

## Portal

- Consume the same rebuilt React implementation and documentation manifest as Storybook.
- Use one canonical Component route and document any old Template route as a redirect/compatibility alias.
- Do not maintain separate visual markup for the component card, component page and pattern page.
- Show exact Figma source links and evidence-backed status.

## Specification, registry and knowledge

- Replace `specifications/components/widget.md` with the exact source/anatomy/behavior/token contract.
- Resolve Component versus Template classification once; avoid two canonical IDs.
- Preserve the old ID only as an explicit compatibility alias if needed.
- Set registry checks from evidence; keep status `in-review`/`PARTIAL` until independent QA passes.
- Update usage examples only after the public API is stable.
- Update Widget knowledge and the separate Widget + Table pattern knowledge.

## Tests and evidence

Required local verification:

- token graph and generated artifact checks;
- React structural/unit tests;
- Storybook interaction tests;
- accessibility tests for named region, description and toolbar controls;
- computed-style assertions for all geometry and token owners;
- desktop and mobile responsive checks;
- focus/overlay escape checks proving the shell does not clip descendants;
- Widget + Table test using the accepted Table package;
- clean builds for packages, Storybook and portal;
- no duplicate legacy Widget implementation, CSS selectors, stories or canonical routes.

Create a preview tied to an exact commit SHA. Hand off preview, SHA, deletion ledger, gap matrix and evidence to independent Visual QA. Production remains forbidden until Visual QA PASS and Vadim's explicit publish command.

## Explicit exclusions

- No Figma edits.
- No production deployment or npm publication.
- No deletion of shared Button/Table/tokens/icons.
- No Table redesign inside the Widget task.
- No invented Widget visual states.
- No silently hidden mobile actions.
- No second canonical Widget API or registry identity.
- No `MATCHED` claim based only on build success or an approximate screenshot.

## Definition of Done

- Old Widget-specific implementation surfaces are inventoried and replaced, with deletion evidence.
- All four Figma component sources and both evidence frames are represented in implementation/documentation.
- Exact Widget token ownership and geometry match live Figma.
- Generic Widget and Widget + Table remain separate contracts.
- Storybook, portal, spec, registry and knowledge consume one implementation and one manifest.
- Tests/builds pass in the isolated worktree.
- Preview is immutable and tied to an exact SHA.
- Independent Visual QA compares the preview against live Figma and this package.
- Production remains untouched until explicit PASS and publish authorization.
