---
id: input.combobox
name: Combobox
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1104-661"
---

# Combobox

## Назначение

Поиск и выбор одного значения. Поле управляет запросом и раскрывает связанный
Listbox с результатами.

## Спецификация компонента

- Нативный input получает `role="combobox"`, `aria-expanded` и связь с listbox.
- Размеры: `l` и `m`; режимы: `edit` и `read`.
- Search icon является частью композиции, но декоративен для screen reader.
- `options`, `expanded/defaultExpanded/onExpandedChange` и `onOptionSelect`
  образуют публичный interaction API.

## Accessibility

- Focus и Arrow Down открывают результаты; Escape закрывает список.
- Input использует `aria-autocomplete="list"` и `aria-controls`.
- Label, helper и error программно связаны с input.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, Active story и browser-проверки реализованы.
- [ ] Roving active option и Enter-selection завершены.
