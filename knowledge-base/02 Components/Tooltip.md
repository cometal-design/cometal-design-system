# Tooltip

- ID: `overlay.tooltip`
- Статус: In review
- Слой: Component
- Figma canonical component: [`2871:43`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2871-43)
- Figma documentation context: `2866:2` — navigation artboard, not component identity

## Что это

Tooltip — системная bounded подсказка для коротких пояснений и метаданных.

## Где используется

- самостоятельная component story
- help text над действиями и иконками
- Table, Widget и другие scroll/contain surfaces: panel портируется в `document.body` и остаётся привязан к актуальному trigger bounds
