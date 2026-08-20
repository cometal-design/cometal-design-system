---
id: selection.checkbox
name: Checkbox
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-521"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-checkbox--overview"
---

# Checkbox

## Назначение

Независимый бинарный выбор или выбор нескольких элементов. Поддерживает unchecked, checked и mixed.

## Contract

- Размеры control: `l` = 20px, `m` = 16px, `s` = 14px.
- `label` обязателен; `description` опционален и располагается второй строкой.
- Значения: `unchecked`, `checked`, `mixed`.
- Hover, pressed и focus-visible формируются взаимодействием; disabled и indeterminate задаёт приложение.
- React API не моделирует визуальные состояния отдельными props: публичный контракт — `checked/defaultChecked`, `indeterminate`, `disabled`, `required`, `name`, `value`.

## Accessibility

- Корень — нативный `input type="checkbox"` внутри кликабельного label.
- Mixed передаётся через `aria-checked="mixed"` и визуальный indeterminate marker.
- Клавиатурное поведение остаётся нативным: `Space` переключает значение без пользовательского JavaScript.

## Engineering notes

- Visual mark использует size-specific SVG geometry, чтобы итоговая толщина outline/stroke оставалась ровно `1.4px`.
- `indeterminate` не рендерит check-mark параллельно с mixed state: состояние задаётся только браузерным `HTMLInputElement.indeterminate`.
- Component source: `packages/react/src/Selection/Selection.tsx`
- Styles: `packages/react/src/Selection/selection.css`

## Acceptance criteria

- [x] 3 размера, 3 значения и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил API.
