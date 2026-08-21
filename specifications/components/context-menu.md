# Context Menu

- ID: `overlay.context-menu`
- Figma: `2663:77`
- React source: `packages/react/src/ContextMenu/ContextMenu.tsx`
- Storybook: `components-context-menu--overview`

## Scope

Context Menu публикует самостоятельный overlay-компонент, включая pointer anchor, keyboard roving focus и size-specific items. Связь меню с бизнес-сущностью принадлежит паттерну или продукту.

## Contract

- Sizes: `l`, `m`, `s`
- Item tones: `default`, `danger`
- Item states: `default`, `selected`, `disabled`
- Divider size inherits menu size
