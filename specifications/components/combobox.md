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
- Размеры используют общую шкалу controls: `l` = 48px, `m` = 40px, `s` = 32px; режимы: `edit` и `read`.
- Search icon является частью композиции, но декоративен для screen reader.
- `options`, `expanded/defaultExpanded/onExpandedChange` и `onOptionSelect`
  образуют публичный interaction API.
- Ввод фильтрует options без учёта регистра; выбор результата подставляет label
  в поле и возвращает его value через `onOptionSelect`.
- После ввода Listbox не подсвечивает первое совпадение автоматически. Active option задаётся только реальным pointer hover или Arrow Up/Down.

## Accessibility

- Focus и pointer click сами по себе не открывают результаты. Listbox появляется
  после ввода непустого запроса только при наличии совпадений; Escape закрывает список.
- Arrow Up/Down перемещают active option внутри уже найденных результатов.
- Input использует `aria-autocomplete="list"` и `aria-controls`.
- Label, helper и error программно связаны с input.

## Motion

- Listbox результатов обновляется мгновенно вслед за вводом: анимация не задерживает поиск и клавиатурную навигацию.
- Компонент использует общие motion tokens только для будущих pointer-triggered сценариев, но не применяет spatial motion к текущему input-driven раскрытию.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, Active story и browser-проверки реализованы.
- [x] Roving active option, фильтрация и Enter-selection завершены.
