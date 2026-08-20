---
id: selection.radio-button
name: Radio Button
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-8954"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-radio-button--overview"
---

# Radio Button

## Назначение

Выбор одного взаимоисключающего значения внутри именованной группы.

## Contract

- Размеры control: `l` = 20px, `m` = 16px, `s` = 14px.
- `label` обязателен; `description` опционален.
- Значения: `not-selected` и `selected`; обратный переход в `not-selected` внутри группы задаётся только внешним state.
- Компонент не управляет группой: общее `name`, `checked/defaultChecked`, `value` и порядок элементов задаёт приложение.

## Accessibility

- Корень — нативный `input type="radio"`.
- Стрелочная навигация и выбор внутри группы остаются нативными.
- Radio Button не вводит локальный roving-tabindex и не подменяет browser semantics кастомным listbox-поведением.

## Engineering notes

- Outline/stroke кольца и dot построены на тех же global stroke/color tokens, что и Checkbox/Switch, но поведение checked принадлежит нативной radio-group.
- Публичный API меньше Figma variant matrix: storybook фиксирует states и sizes, а не размножает отдельные props под каждый visual state.
- Component source: `packages/react/src/Selection/Selection.tsx`
- Styles: `packages/react/src/Selection/selection.css`

## Acceptance criteria

- [x] 3 размера, selected/not-selected и состояния считаны из DS Core.
- [x] React API, stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил API.
