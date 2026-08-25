---
id: input.multi-select
name: Multi Select
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1106-1005"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--multi-select-playground"
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
- Chevron остаётся видимым при выбранных значениях и синхронизирован с `aria-expanded`: вниз при закрытом Listbox, вверх при открытом. Компонент показывает все tags,
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

## Token and effect contract

- Trigger и tags используют shared field semantic tokens, плюс current tag tokens для selected values и `+N` counter.
- Chevron остаётся видимым и использует built-in outline icon contract `1.4px`.
- Popup listbox использует current Soft effect token и тот же option-state слой, что и Select.
- `+N` появляется только после реального overflow пересчёта ширины tags, а не по фиксированному числу выбранных элементов.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--multi-select-playground`
- `components-fields--multi-select-active`
- `components-fields--multi-select-interaction`
- `components-fields--multi-select-responsive-tags`
