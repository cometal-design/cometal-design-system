---
id: input.text-field
name: Text Field
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1102-8230"
---

# Text Field

## Назначение

Однострочный ввод короткого текстового значения. `Edit` использует нативный `input`; `Read` показывает данные без интерактивной рамки.

## Contract

- Размеры используют общую шкалу controls: `l` = 48px, `m` = 40px, `s` = 32px.
- Состояния: default, hover, filled, error, disabled и независимый focus-visible.
- Label обязателен в API; helper и optional-marker опциональны.
- В режиме `read` значение остаётся текстом и не попадает в tab-порядок.

## Accessibility

- Label связан с input через `htmlFor`/`id`.
- Ошибка и helper связаны через `aria-describedby`; ошибка выставляет `aria-invalid`.
- Нативные keyboard, autocomplete и form attributes сохраняются.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
