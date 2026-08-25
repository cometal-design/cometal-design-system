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

## Scope

Context Menu публикует самостоятельный overlay-компонент, включая pointer anchor, keyboard roving focus и size-specific items. Связь меню с бизнес-сущностью принадлежит паттерну или продукту.

## Contract

- Sizes: `l`, `m`, `s`
- Item tones: `default`, `danger`
- Item states: `default`, `selected`, `disabled`
- Divider size inherits menu size
