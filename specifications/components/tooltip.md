# Tooltip

- ID: `overlay.tooltip`
- Figma: `2866:2`
- React source: `packages/react/src/Tooltip/Tooltip.tsx`
- Storybook: `components-tooltip--overview`

## Scope

Tooltip публикует bounded overlay для короткой подсказки, без продуктовой бизнес-логики.

## Contract

- Sizes: `compact`, `wide`
- Placements: `top-start`, `top-center`, `top-end`, `bottom-start`, `bottom-center`, `bottom-end`, `left`, `right`
- Trigger: hover + focus
- Dismiss: blur + pointer leave
