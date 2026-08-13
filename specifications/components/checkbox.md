---
id: selection.checkbox
name: Checkbox
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-521"
---

# Checkbox

## Назначение

Независимый бинарный выбор или выбор нескольких элементов. Поддерживает unchecked, checked и mixed.

## Contract

- Размеры control: `l` = 20px, `m` = 16px, `s` = 14px.
- Label обязателен; description опционален.
- Hover, pressed и focus-visible формируются взаимодействием; disabled передаёт приложение.

## Accessibility

- Корень — нативный `input type="checkbox"` внутри кликабельного label.
- Mixed передаётся через `aria-checked="mixed"` и визуальный indeterminate marker.

## Acceptance criteria

- [x] 3 размера, 3 значения и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил API.
