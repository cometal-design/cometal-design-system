---
id: overlay.tooltip
name: Tooltip
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2871-43"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-tooltip--overview"
---

# Tooltip

Canonical component node is `2871:43`. Node `2866:2` is the documentation artboard that contains Tooltip and unrelated components; it remains navigation context, not component identity.
React source: `packages/react/src/Tooltip/Tooltip.tsx`.

## Scope

Tooltip публикует bounded overlay для короткой подсказки, без продуктовой бизнес-логики.

## Contract

- Sizes: `compact`, `wide`
- Placements: `top-start`, `top-center`, `top-end`, `bottom-start`, `bottom-center`, `bottom-end`, `left`, `right`
- Trigger: hover + focus
- Dismiss: blur + pointer leave
- Floating panel: portal в `document.body`, чтобы viewport-координаты не искажались `overflow`, `contain`, transform или scroll-контейнерами потребителя
