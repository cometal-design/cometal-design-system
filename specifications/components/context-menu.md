---
id: overlay.context-menu
name: Context Menu
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2663-77"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-context-menu--overview"
---

# Context Menu

React source: `packages/react/src/ContextMenu/ContextMenu.tsx`.

Figma source roles: `2668:243` is Main and `2664:228` is Sources/Item; registry-linked `2663:77` is review/navigation context, not the canonical master.

## Scope

Context Menu публикует самостоятельный overlay-компонент, включая pointer anchor, keyboard roving focus и size-specific items. Связь меню с бизнес-сущностью принадлежит паттерну или продукту.

## Contract

- Sizes: `l`, `m`, `s`
- Item tones: `default`, `danger`
- Item states: `default`, `selected`, `disabled`
- Divider size inherits menu size
- M3 Table filters use the existing header ContextMenu as a nested `m → m` operator level; no Table-specific menu primitive or public API is created. Operator selection and per-column Reset belong to this nested level.
- Enter or ArrowRight from Filters focuses Back; Back or ArrowLeft restores focus to the originating Filters item; Escape closes the menu and restores the header trigger. The existing focus-visible visual is a compatibility alias of Hover.
- ContextMenu keeps its body portal and remeasures collision placement after nested-level size changes. Parent and child levels remain size `m`.
- M4 row actions reuse the same body-portal menu. Pointer context-click and keyboard `Shift+F10`/ContextMenu-key open it for a consumer-supplied stable row ID; Escape/outside/item activation close it, with keyboard dismissal restoring the exact initiating descendant focus.
- ContextMenu does not clone `size` into arbitrary direct children: consumer content, Fragments and custom wrappers preserve their own props. No Table-specific public API is introduced.
