# Text Area

`input.text-area` — многострочное поле в режимах Edit и Read. API отражает
Figma properties: start/end icon, независимый counter и scrollbar. Helper и
counter занимают разные края одной supporting-строки.

## Источники

- Figma: [Component Set `1102:8399`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1102-8399)
- Спецификация: [[../../specifications/components/text-area]]
- React: `packages/react/src/Field/Field.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--text-area-playground
- Реестр: `input.text-area`, статус `in-review`

## Что зафиксировано

- Public API: `label`, `helperText`, `optional`, `error`, `size`, `mode`, `readValue`, `showCounter`, `showScrollbar`, `startIcon`, `endIcon` + native textarea attributes.
- Размеры: только `l / m`.
- Counter и helper живут в одной supporting row, но на разных краях.
- Popup/elevation motion/effects отсутствуют.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--text-area-playground`
