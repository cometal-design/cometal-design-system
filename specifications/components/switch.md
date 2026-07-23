---
id: selection.switch
name: Switch
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-9673"
---

# Switch

## Назначение

Немедленно включает или выключает настройку. Не заменяет Checkbox для подтверждения формы и не требует отдельной кнопки Save.

## Contract

- Размеры track: `l` = 44×24px, `m` = 36×20px, `s` = 32×16px.
- Label обязателен; description опционален.
- On/off управляется checked-state приложения.

## Accessibility

- Нативный checkbox получает `role="switch"` и остаётся доступен с клавиатуры.
- Состояние сообщается через checked semantics; focus-visible отображается вокруг track.

## Acceptance criteria

- [x] 3 размера, on/off и состояния считаны из DS Core.
- [ ] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил API.
