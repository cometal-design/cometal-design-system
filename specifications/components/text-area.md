---
id: input.text-area
name: Text Area
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1102-8399"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--text-area-playground"
---

# Text Area

## Назначение

Многострочный ввод текста. Повторяет контракт Text Field, но использует нативный `textarea`, поддерживает счётчик и многострочный `Read`.

## Спецификация компонента

- Размеры: `l` и `m`; минимальная высота соответствует DS Core.
- Состояния: default, hover, filled, error, disabled и focus-visible.
- Helper и счётчик занимают одну supporting-строку.
- `startIcon/endIcon`, `showCounter` и `showScrollbar` отражают boolean и
  instance-swap properties утверждённого Figma master.

## Accessibility

- Label, helper, error и counter программно связаны с textarea.
- Ограничение длины передаётся нативным `maxLength`.

## React API

- Базовый runtime: `TextArea` из `packages/react/src/Field/Field.tsx`.
- Публичные props: `label`, `helperText`, `optional`, `error`, `size`, `mode`, `readValue`, `showCounter`, `showScrollbar`, `startIcon`, `endIcon` + native `textarea` attributes.
- Size contract: только `l | m`.
- `supportingEnd` используется внутри chrome для counter и не выносится в отдельный публичный API.

## Token and effect contract

- Высота и внутренние отступы опираются на current multiline field semantic tokens.
- Helper/error/counter используют shared supporting-text semantic contract.
- Text Area не имеет popup или elevation effect; scrollbar indicator остаётся частью visual composition, а не отдельным behavior layer.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--text-area-playground`

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
