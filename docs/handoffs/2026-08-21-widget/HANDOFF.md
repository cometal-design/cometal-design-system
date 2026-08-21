# Widget: approved Figma handoff

Date: 2026-08-21  
Component: `Widget`  
Figma file: `KKNGucImxFAtQLBhPy8tLs`  
Page: `2702:2` (`Widgets`)  
Owner of visual contract: Figma DS Core  
Handoff state: `READY FOR DOWNSTREAM GAP ANALYSIS`

## Approval and replacement directive

Vadim explicitly approved this component for development and explicitly rejected the existing downstream Widget implementation as poorly built.

The downstream task must therefore:

1. inventory the current Widget-specific implementation and compatibility surface;
2. remove the legacy Widget-specific React markup, CSS, stories, portal demos, specification and knowledge content that conflict with this contract;
3. rebuild Widget from the approved Figma sources in this package;
4. preserve shared `Button`, `Table`, `Paginator`, tokens and icon packages;
5. preserve a stable public import or migration path only when the baseline impact scan proves it is required and the decision is documented.

This is not authorization to delete shared dependencies or unrelated dirty work. It is a controlled replacement of the old Widget delivery surfaces. Do not cosmetically patch the old visual implementation and call it matched.

## Scope and evidence

This package was generated from the live Figma file in read-only mode. Source and Main Component frames define engineering identity. Review frames are evidence only.

Canonical source frames:

| Level | Name | Node ID | Role |
|---|---|---|---|
| Sources | Widget / Source | `2702:2190` | Toolbar, generic content slot and Table payload sources |
| Main component | Widget / Main Component | `2702:2238` | Approved reusable Widget shell |

Evidence frames:

| Name | Node ID | Role |
|---|---|---|
| Widget / Review / Table | `2702:2265` | Desktop Widget with Table payload and filters enabled |
| Widget / Table / Filters On | `3116:25403` | Compact working evidence outside the documentation artboard |

Exact component keys, exposed Figma properties, geometry, nested source IDs and 22 directly observed variable bindings are in [FIGMA_STRUCTURE.json](./FIGMA_STRUCTURE.json).

## Architecture

```text
Foundation variables
  -> Button and Table dependencies
  -> Widget/Source/Toolbar/Actions
  -> Widget/Source/Content Slot or approved payload
  -> Widget shell
  -> product composition
```

Widget is an organism-level reusable container, not Table business logic. It owns title, optional description, optional toolbar and a swappable content area. The content owns its own semantics and behavior. `Widget + Table` is one documented composition, not a reason to bake Table behavior into Widget.

## Source inventory

### Toolbar Actions

- Figma source: `Widget/Source/Toolbar/Actions`, node `2702:3`, key `ab7a14d67ca9cc1442a84e8e605139cf82402934`.
- Geometry: `313 x 40`, horizontal Hug/Hug layout, centered, 8 px gap.
- Exposed booleans: `Show Secondary 01`, `Show Secondary 02`, `Show Secondary 03`, `Show Primary`; all default to `true`.
- Approved example: three Secondary M icon-only buttons plus one Primary M button with text and leading icon.
- Example icons: Filter `700:14705`, Refresh `700:14276`, Download `700:14813`, Plus `700:14531`.
- The button instances come from the approved Button family. Widget must not fork their colors, states, icon stroke or keyboard behavior.

The public React API does not need four Boolean props. A smaller `actions`/`toolbar` composition API is preferred as long as it can express zero to three secondary actions plus a primary action without hardcoding these business commands.

### Generic Content Slot

- Figma source: `Widget/Source/Content Slot`, node `2702:21`, key `943b63beadd6ab3bdd35a3a5aaf752ce978349c9`.
- Geometry: fill available width, Hug height, 8 px radius, 1 px inside border.
- Placeholder surface: `Global/Surface/Subtle`; border: `Global/Border/Default`; label: `Global/Text/Secondary`.
- This is an authoring source and empty-state placeholder, not a mandated runtime gray panel around every consumer payload.
- Any approved component or business composition can replace the content instance.

### Table Content Payload

- Figma source: `Widget/Source/Content/Table`, node `2702:23`, key `043672338941d2ab19440c87d75b13a6d940b7b9`.
- Geometry: fill width, Hug height, vertical layout, 32 px gap between Table surface and paginator, 8 px radius.
- The Table surface owns its closed perimeter, 8 px radius and clipping. Edge cells own internal dividers only.
- Column order in the evidence composition: Drag Handle, Index, Selection, Position, Name, Grade, Quantity, Unit, Price, Total, Delivery Date, Document, File, Status, Control, Supplier.
- Name is the only elastic column in the approved wide example; service and data columns keep defined widths.
- Paginator source: `2371:29654`, fill width, 40 px height.
- Table density, row count, filters, summaries, selection and cell behavior belong to the approved Table contract in `../2026-08-21-table/`.

The Widget shell can be implemented independently, but `Widget + Table` cannot be declared `MATCHED` before the Table handoff is accepted and implemented.

### Main Widget

- Figma source: `Widget`, node `2702:2173`, key `df0de3cb631205cb6fda0422338d6c427a8a9b97`.
- Geometry: fill parent width in product use, Hug content height, vertical layout, 24 px outer inset and section gap, 32 px outer radius, 1 px inside border, clipping disabled.
- Exposed Figma properties:
  - `Title` text, required in the approved default;
  - `Description` text;
  - `Show description` Boolean;
  - `Toolbar` instance swap;
  - `Show toolbar` Boolean;
  - `Content` instance swap.
- Header: fill width, Hug height, horizontal, space-between, centered, 16 px internal gap and 16 px vertical padding.
- Copy block: vertical, 8 px gap.
- Title: Grtsk Peta Medium, 24/28, `Global/Text/Primary`.
- Description: Grtsk Peta Regular, 13/20, `Global/Text/Secondary`.
- Surface: `Global/Surface/Raised`; border: `Global/Border/Default`; radius: `Global/Widget` = 32; inset: Spacing 150 = 24.
- Nested content radius remains 8 so the approved relation is `32 outer radius - 24 inset = 8 inner radius`.

## Composition and behavior rules

- Title is the accessible name anchor for the region and is required for the default component contract.
- Description and toolbar are optional. Their absence must remove the elements without leaving empty layout gaps.
- Toolbar commands are consumer-provided and reuse Button. Widget does not own Filter, Refresh, Export or Add-record business behavior.
- Content is required and consumer-provided. Widget must not infer Table behavior from its children.
- Height follows content. Do not hardcode the 480 px documentation example or 1176 px Table payload height.
- Width follows its container. Do not ship the 2240 px documentation width as runtime CSS.
- Widget itself has no visual state variants or prototype reactions. Interactive behavior is delegated to nested controls and content.
- The toolbar and title must remain readable when width contracts. Any mobile collapse or overflow menu not present in Figma must be documented as a responsive implementation decision, not invented silently.
- Clipping is disabled on the Widget shell so focus rings, menus and overlays can escape. Only a nested payload such as Table may clip its own closed surface when its contract requires it.

## Token contract

The live source uses Widget-owned Global roles plus nested Button and Table dependencies. The directly observed binding set is recorded in `FIGMA_STRUCTURE.json`.

Widget-owned roles include:

- `Global/Widget` radius -> 32 px;
- `Global/Surface/Raised`;
- `Global/Border/Default`;
- `Global/Text/Primary`;
- `Global/Text/Secondary`;
- Spacing 150 -> 24 px outer inset/gap;
- Spacing 100 -> 16 px header gap/padding;
- Spacing 50 -> 8 px copy/toolbar gap;
- Radius 100 -> 8 px nested content radius.

Nested Button roles remain Button-owned. Table divider, text and file-metadata variables must not be used to style the generic Widget shell.

## Current downstream conflict

The current checkout is `CONFLICT`, not `MATCHED`:

- the Widget shell border uses a Table cell divider token instead of `Global/Border/Default`;
- title and description use Table-owned text/file tokens instead of the Widget's Global text roles;
- the surface uses Canvas rather than the approved Raised role;
- the content wrapper forces `overflow: hidden`, conflicting with the unclipped Widget shell and overlay/focus behavior;
- header geometry and spacing do not reproduce the approved 16 px internal rhythm;
- current stories do not expose the approved toolbar composition and do not provide immutable evidence for the exact Table payload;
- registry/spec/navigation classification is inconsistent between Template and Component surfaces;
- registry checks already admit that visual, tests and accessibility evidence are incomplete;
- the shared checkout contains uncommitted post-QA work and cannot be treated as release evidence.

See [COVERAGE_MATRIX.md](./COVERAGE_MATRIX.md) and [IMPLEMENTATION_SCOPE.md](./IMPLEMENTATION_SCOPE.md).

## Documentation manifest

Storybook and the portal must consume one Widget documentation manifest with:

1. Overview and purpose.
2. Architecture and anatomy.
3. Header, title and description.
4. Toolbar composition and action ownership.
5. Generic content slot.
6. Widget + Table example, sourced from the approved Table implementation.
7. Geometry, spacing and radius relationship.
8. Responsive behavior.
9. Accessibility.
10. API and code examples.
11. Playground.
12. Exact Figma links and evidence-backed Match status.

## Open implementation decisions

These do not block rebuilding the approved desktop shell, but they block final `MATCHED` status until documented:

- exact mobile toolbar collapse/overflow behavior is not prototyped in Figma;
- exact title and description wrap/clamp policy is not prototyped;
- registry ID currently says `template.widget` while current Storybook/portal work classifies Widget as a Component. Preserve compatibility and record the canonical classification decision instead of silently duplicating two Widgets.

No production deployment is authorized by this handoff.
