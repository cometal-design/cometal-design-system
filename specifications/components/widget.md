# Widget

- Registry ID: `template.widget` (legacy compatibility identity; canonical layer is Component)
- Status: `in-review`
- Figma page: `Widgets`, `2702:2`
- Canonical artboards: `2702:2190`, `2702:2238`
- Sources: Toolbar `2702:3`, Content slot `2702:21`, Table payload `2702:23`, Main `2702:2173`
- React: `packages/react/src/Widget/Widget.tsx`
- Storybook: `components-widget--overview`

## Purpose

Widget is a generic named region that composes required title/content, optional description and a consumer-owned toolbar. It is not a Table primitive, product state machine or screen template.

## Public API

- `title: ReactNode` and `children` are required.
- `description?: ReactNode` and `toolbar?: ReactNode` are optional.
- `actions` is a deprecated compatibility alias for `toolbar`; no parallel Widget implementation exists.
- `as?: section | article | aside | div` supports deliberate semantics.
- Title and description IDs may be supplied; otherwise stable IDs are generated.
- `toolbarLabel` names the toolbar group.

## Token and geometry contract

- Global Raised surface; Global Default border; Global Primary/Secondary text.
- Widget outer radius 32 px.
- Widget inset and section gap 24 px.
- Header block padding and layout gap 16 px; items are vertically centered and space-between.
- Copy and toolbar gaps 8 px.
- Inner content radius 8 px.
- Title 24/28; description 13/20.
- Widget CSS must not consume Table-owned roles and must not clip focus rings or overlays.

## Behavior and accessibility

- The default root is an accessible named `section` linked to the visible title.
- Description is associated only when present.
- Toolbar controls keep document order and consumer handlers.
- Widget does not intercept descendant keyboard or pointer behavior.
- Width is fluid, height is content-driven; actions wrap instead of being hidden.
- Nested content owns its state and semantics.

## Evidence gate

Unit and Storybook interaction checks must pass locally. `visualMatch` remains false until independent QA compares localhost/preview with all canonical Figma sources.
