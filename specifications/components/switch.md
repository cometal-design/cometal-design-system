---
id: selection.switch
name: Switch
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-9673"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-switch--overview"
---

# Switch

## Назначение

Немедленно включает или выключает настройку. Не заменяет Checkbox для подтверждения формы и не требует отдельной кнопки Save.

## Contract

- Размеры track: `l` = 44×24px, `m` = 36×20px, `s` = 32×16px.
- `label` обязателен; `description` опционален.
- Значения: `off` и `on`.
- Немедленное переключение задаётся `checked/defaultChecked`; Switch не вводит промежуточный apply-step и не заменяет Checkbox в формах подтверждения.

## Accessibility

- Нативный checkbox получает `role="switch"` и остаётся доступен с клавиатуры.
- Состояние сообщается через checked semantics; focus-visible отображается вокруг track.
- `Space` переключает состояние нативно; дополнительный JS нужен только для интеграции с продуктовым state.

## Engineering notes

- Track и thumb используют component tokens, но не требуют отдельного imperative API: публичный контракт остаётся `checked`, `defaultChecked`, `disabled`, `required`, `name`, `value`.
- Размерный контракт совпадает с DS Core и проверяется через Storybook/browser tests для `l/m/s`.
- Component source: `packages/react/src/Selection/Selection.tsx`
- Styles: `packages/react/src/Selection/selection.css`

## Acceptance criteria

- [x] 3 размера, on/off и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил API.
