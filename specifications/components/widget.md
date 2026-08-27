---
id: template.widget
name: Widget
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2702-2238"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-widget--overview"
---

# Widget

- Registry ID: `template.widget` is a legacy stable identity retained for compatibility; canonical layer is Component.
- Figma page: `Widgets`, `2702:2`
- Source context `2702:2190`; Main `2702:2238`; Toolbar `2702:3`; Content slot `2702:21`. `2702:23` is the retained Read/Comfortable Table payload variant within composition set `3346:21724`; Widget + Table review `2702:2265` is replay/evidence context, not a generic Widget master.
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

## Public composition exports

- `Widget`, `WidgetContent` and `WidgetToolbar` are the current component-family exports.
- `WidgetToolbarIcon` and `widgetToolbarIconTypes` are a deprecated compatibility layer. New composition uses generated icons from `@cometal/react/icons/*` inside `Button` or `IconButton`; the legacy export is not a second icon source.
- `WidgetTablePattern` belongs to the separately documented unregistered Widget + Table composition and is not a Widget variant. `WidgetTableReviewExample` belongs to the private source-only `@cometal/examples/widget-table` boundary, not to the Widget API, registry identity or a public package release.

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
- M8 toolbar placement uses shared Button/IconButton and generated icons; controls preserve consumer callbacks and `aria-pressed` where they toggle density, filters or summary. Widget receives no Table page/filter/selection/business callback state.

## Evidence gate

Unit and Storybook interaction checks must pass locally. `visualMatch` remains false until independent QA compares localhost/preview with all canonical Figma sources.

## M9 production evidence

Exact SHA `3823dc97de75eff3ab3a0a4635c8fb75e5d17080` is released as deployment `dpl_2iARNdGJ5vLZW7894BQWkLdNxPUy` at [the public portal](https://cometal-design-system-storybook.vercel.app/) and [Widget route](https://cometal-design-system-storybook.vercel.app/components/widget/). The public Storybook ID `components-widget--overview` is live. Role 40 production verification records the released provenance and Widget + Table runtime evidence; registry test/accessibility evidence is updated, while `visualMatch` and the in-review status remain unchanged pending their distinct contract evidence. This does not publish an npm package.
