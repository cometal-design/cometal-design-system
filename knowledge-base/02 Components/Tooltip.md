# Tooltip

- ID: `overlay.tooltip`
- Статус: In review
- Слой: Component
- Figma canonical component: [`2871:43`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2871-43)
- Figma documentation context: `2866:2` — navigation artboard, not component identity

## Что это

Tooltip — системная bounded подсказка для коротких пояснений и метаданных.

`wide` используется для полного длинного значения: поверхность расширяется до системного максимума, затем переносит текст и не скрывает его за многоточием.

## Где используется

- самостоятельная component story
- help text над действиями и иконками
- Table, Widget и другие scroll/contain surfaces: panel портируется в `document.body` и остаётся привязан к актуальному trigger bounds
- M4: Table activates it only for actual text overflow and disables it during editing. Tooltip itself owns concurrent hover/focus, open-only `aria-describedby`, dismiss/focus restoration, SSR-safe portal, resize/scroll follow and bounded intrinsic Wide wrapping; `2871:43` is canonical and `2866:2` is documentation context.
