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
- `compact` остаётся однострочным; `wide` растёт по контенту до bounded max-width и переносит длинный текст без ellipsis
- Placements: `top-start`, `top-center`, `top-end`, `bottom-start`, `bottom-center`, `bottom-end`, `left`, `right`
- Trigger: hover + focus
- Dismiss: blur + pointer leave
- Floating panel: portal в `document.body`, чтобы viewport-координаты не искажались `overflow`, `contain`, transform или scroll-контейнерами потребителя
- M4 source role: `2871:43` is the canonical component set; `2866:2` remains documentation/navigation context only. Table supplies only real text-overflow detection (`scrollWidth > clientWidth`) and disables Tooltip while editing or when text fits.
- Shared component owns hover/focus concurrency, `aria-describedby` only while open, Escape/blur/pointer-leave dismissal, SSR-safe hydration, anchor/content resize and scroll/visualViewport following, collision flip/shift and lost-anchor closure. Wide geometry uses intrinsic wrapping plus canonical bounded max-width; synchronous Range measurement and raw character-width heuristics are forbidden.
