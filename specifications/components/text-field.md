---
id: input.text-field
name: Text Field
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1102-8230"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--text-field-playground"
---

# Text Field

## Назначение

Однострочный ввод короткого текстового значения. `Edit` использует нативный `input`; `Read` показывает данные без интерактивной рамки.

## Contract

- Размеры используют общую шкалу controls: `l` = 48px, `m` = 40px, `s` = 32px.
- Состояния: default, hover, filled, error, disabled и независимый focus-visible.
- Label обязателен в API; helper и optional-marker опциональны.
- В режиме `read` значение остаётся текстом и не попадает в tab-порядок.
- M3 source foundation — `Field Base` `1098:242`: every S control surface uses the existing `spacing-50` `8px` horizontal inset. Table supplies only external filter-cell inset; it must not override Field internal padding.
- `FieldChrome` — единственный owner focus modality: keyboard или programmatic focus показывает один `2px` ring с `4px` offset, pointer activation не показывает wrapper focus ring. Этот contract общий для всех FieldChrome consumers.

## Accessibility

- Label связан с input через `htmlFor`/`id`.
- Ошибка и helper связаны через `aria-describedby`; ошибка выставляет `aria-invalid`.
- Нативные keyboard, autocomplete и form attributes сохраняются.

## React API

- Базовый runtime: `TextField` из `packages/react/src/Field/Field.tsx`.
- Публичные props: `label`, `helperText`, `optional`, `error`, `size`, `mode`, `readValue`, `startIcon`, `endIcon` + native `input` attributes.
- Size contract: `l | m | s`.
- Mode contract: `edit | read`.
- Read mode не эмулирует disabled input: используется отдельный plain-text output contract.

## Token and effect contract

- Control scale использует shared field/button size ladder `48 / 40 / 32`.
- Цвет, бордер, placeholder, helper/error и focus ring собираются из semantic input/state tokens, а не из локальных hex значений.
- Сам Text Field не имеет popup/elevation эффекта.
- Если в поле используются outline-иконки, их runtime stroke должен визуально оставаться `1.4px`.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--sizing-contract`
- `components-fields--text-field-playground`

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
