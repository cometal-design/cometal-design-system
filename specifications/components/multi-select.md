---
id: input.multi-select
name: Multi Select
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1106-1005"
---

# Multi Select

## Назначение

Выбор нескольких значений. В `Edit` выбранные элементы представлены tags внутри trigger; в `Read` выводится полный текстовый список без tags, chevron и `+N`.

## Спецификация компонента

- Trigger — нативный button с `aria-haspopup="listbox"` и `aria-expanded`.
- Размеры: `l` и `m`; режимы: `edit` и `read`.
- Active включает Listbox с `aria-multiselectable`.
- `options`, `selectedValues` и `onSelectedValuesChange` образуют controlled API.
- Каждый Value Tag имеет отдельную доступную кнопку удаления.
- Chevron остаётся видимым при выбранных значениях. Компонент показывает все tags,
  которые помещаются в доступную ширину; только реально не поместившиеся значения
  сворачиваются в счётчик `+N`.
- Pointer-раскрытие не задаёт active option до реального наведения; keyboard active задаётся Arrow Up/Down. `aria-selected` при этом продолжает честно отражать уже выбранные значения.

## Accessibility

- Trigger имеет доступное имя от label.
- Arrow Down открывает Listbox, Escape закрывает.
- Options используют `role="option"` и `aria-selected`.
- Кнопка удаления имеет имя `Удалить {label}`.

## Motion

- При pointer-раскрытии Multi-select Listbox появляется от верхней границы trigger через opacity и смещение 4px; клавиатурное раскрытие остаётся мгновенным.
- Добавление и удаление values не задерживает обновление controlled state.
- При `prefers-reduced-motion: reduce` смещение отключается.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, Active/interaction stories и browser-проверки реализованы.
- [ ] Скрытые form-values должны быть добавлены при интеграции с конкретной формой.
