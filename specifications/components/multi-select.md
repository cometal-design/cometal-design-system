---
id: input.multi-select
name: Multi Select
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1106-1005"
---

# Multi Select

## Назначение

Выбор нескольких значений. В `Edit` выбранные элементы представлены tags внутри trigger; в `Read` выводится полный текстовый список без tags, chevron и `+N`.

## Contract

- Trigger — нативный button с `aria-haspopup="listbox"` и `aria-expanded`.
- Размеры: `l` и `m`; режимы: `edit` и `read`.
- Overlay и Option являются отдельным pattern и не встраиваются в компонент поля.

## Accessibility

- Trigger имеет доступное имя от label.
- Удаление значения, keyboard-listbox и скрытые form-values добавляются интеграцией pattern.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [ ] React API, stories и browser-проверки реализованы.
- [ ] Полный multi-select pattern описан отдельно.
