---
id: input.select
name: Select
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1103-535"
---

# Select

## Назначение

Выбор одного значения из заранее известного набора. Поле использует нативный `select`; открытый список не считается состоянием самого поля.

## Contract

- Размеры: `l` и `m`; режимы: `edit` и `read`.
- Состояния: default, hover, filled, error, disabled, focus-visible.
- Placeholder отображается disabled-option до выбора значения.

## Accessibility

- Сохраняются нативные keyboard и form semantics.
- Label и supporting text программно связаны с select.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [ ] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
