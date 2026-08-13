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

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
