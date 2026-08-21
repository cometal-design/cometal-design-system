# Widget behavior contract

## Ownership

Widget owns composition only:

- accessible container;
- title and optional description;
- optional toolbar slot;
- required content slot;
- spacing, surface, border and radius.

Nested Button controls own their hover, pressed, disabled, focus and activation behavior. Nested content owns its own selection, editing, pagination, menu, overlay and loading behavior.

## State model

Figma defines no Widget-specific visual variant axis and no prototype reactions. Do not create `default`, `hover`, `active`, `open` or `disabled` Widget props.

The approved structural permutations are:

| Description | Toolbar | Content | Result |
|---|---|---|---|
| On | On | Required | Full default shell |
| Off | On | Required | Title and toolbar, no empty description gap |
| On | Off | Required | Copy and content, no empty toolbar reservation |
| Off | Off | Required | Title and content only |

Content and toolbar swaps must preserve Widget geometry and must not reset nested component state.

## Interaction

- Toolbar follows document tab order and the Button contract.
- Widget does not intercept Enter, Space, Escape, arrow keys or pointer events from descendants.
- Widget does not implement filters, refresh, export or add-record commands. Consumers provide handlers and accessible names.
- Opening menus, date pickers or other overlays from toolbar/content must not be clipped by the Widget shell.

## Accessibility

- Default semantic root: `section` or equivalent named region.
- Connect the region to the visible title with `aria-labelledby`; generate or accept a stable title ID.
- `article`, `aside` or `div` may be supported only when the semantic choice is deliberate and documented.
- Toolbar uses an accessible group/toolbar name when it contains multiple controls.
- Icon-only actions must have accessible names supplied by the consumer.
- Description must remain associated with the region when present, preferably with `aria-describedby`.
- Content semantics are preserved; do not wrap a native Table in invalid interactive markup.
- Focus rings and overlays remain visible outside the Widget surface.

## Responsive behavior

- Runtime width is fluid; documentation widths are not API values.
- Height is content-driven.
- At reduced width, copy remains minimum-width zero and may wrap; toolbar may wrap below the title before content overflows.
- No control may overlap copy or content.
- A future overflow-menu strategy requires a separate approved behavior decision. Do not silently hide actions.

## Widget + Table evidence

- Table owns its own closed 8 px perimeter and clipping.
- Widget inset remains 24 px around the Table payload.
- Paginator stays inside the Table payload and remains 32 px below the Table surface.
- Widget toolbar can control Table-level product behavior, but the coupling lives in the product pattern, not in Widget.
- Table handoff `../2026-08-21-table/` is the canonical dependency for all Table states and behavior.

## Tests

Required interaction and structural checks:

1. region receives its accessible name from the title;
2. description association appears only when description exists;
3. toolbar is absent without leaving layout gaps;
4. description is absent without leaving layout gaps;
5. custom content keeps its semantics and state;
6. toolbar buttons remain keyboard reachable in visual order;
7. focus rings and overlays are not clipped;
8. narrow layouts do not overlap, crop or silently hide actions;
9. Widget + Table uses the actual Table implementation, not story-local markup;
10. changing Table density or filters does not reconstruct the Widget shell or reset consumer content.
