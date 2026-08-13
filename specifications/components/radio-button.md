---
id: selection.radio-button
name: Radio Button
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-8954"
---

# Radio Button

## Назначение

Выбор одного взаимоисключающего значения внутри именованной группы.

## Contract

- Размеры control: `l` = 20px, `m` = 16px, `s` = 14px.
- Label обязателен; description опционален.
- Компонент не управляет группой: общее `name` и checked-state задаёт приложение.

## Accessibility

- Корень — нативный `input type="radio"`.
- Стрелочная навигация и выбор внутри группы остаются нативными.

## Acceptance criteria

- [x] 3 размера, selected/not-selected и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил API.
