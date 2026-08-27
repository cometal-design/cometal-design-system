# Text Field

`input.text-field` — однострочное поле в режимах Edit и Read.

## Источники

- Figma: [Component Set `1102:8230`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1102-8230)
- Спецификация: [[../../specifications/components/text-field]]
- React: `packages/react/src/Field/Field.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--text-field-playground
- Реестр: `input.text-field`, статус `in-review`

## Что зафиксировано

- Public API: `label`, `helperText`, `optional`, `error`, `size`, `mode`, `readValue`, `startIcon`, `endIcon` + native input attributes.
- Размеры: `l / m / s` = `48 / 40 / 32`.
- Edit и Read — разные visual contracts, а не disabled-режим одного и того же input.
- Сам Text Field не имеет popup/elevation effect.
- M3: `Field Base` `1098:242` задаёт S control `32px` и existing `spacing-50` `8px` internal horizontal inset. `FieldChrome` — единый owner focus modality: keyboard/programmatic focus — `2px` ring с `4px` offset, pointer не добавляет ring.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--sizing-contract`
- `components-fields--text-field-playground`
