---
id: input.select
name: Select
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1103-535"
---

# Select

## Назначение

Выбор одного значения из заранее известного набора. Видимый trigger и Listbox
воспроизводят утверждённую Figma-композицию; скрытый нативный `select` сохраняет
form-value и совместимость с HTML-формами.

## Спецификация компонента

- Размеры: `l` и `m`; режимы: `edit` и `read`.
- Состояния: default, hover, filled, error, disabled, focus-visible и active.
- `expanded/defaultExpanded/onExpandedChange` управляют раскрытием.
- `value/defaultValue/onValueChange` управляют выбранным значением.
- Active содержит связанный Listbox с default, selected и disabled options.

## Accessibility

- Trigger имеет `role="combobox"`, `aria-haspopup`, `aria-expanded`,
  `aria-controls` и `aria-activedescendant`.
- Arrow Up/Down перемещают active option, Enter выбирает, Escape закрывает.
- Label и supporting text программно связаны с trigger.
- Скрытый native select исключён из tab-order и accessibility tree.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, Active/interaction stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
