---
id: input.text-area
name: Text Area
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1102-8399"
---

# Text Area

## Назначение

Многострочный ввод текста. Повторяет контракт Text Field, но использует нативный `textarea`, поддерживает счётчик и многострочный `Read`.

## Contract

- Размеры: `l` и `m`; высота поля задаётся через `rows`, минимальная высота соответствует DS Core.
- Состояния: default, hover, filled, error, disabled и focus-visible.
- Helper и счётчик занимают одну supporting-строку.

## Accessibility

- Label, helper, error и counter программно связаны с textarea.
- Ограничение длины передаётся нативным `maxLength`.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [ ] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
