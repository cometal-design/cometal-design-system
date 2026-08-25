---
id: input.combobox
name: Combobox
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1104-661"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--combobox-playground"
---

# Combobox

## Назначение

Поиск и выбор одного значения. Поле управляет запросом и раскрывает связанный
Listbox с результатами.

## Спецификация компонента

- Нативный input получает `role="combobox"`, `aria-expanded` и связь с listbox.
- Размеры используют общую шкалу controls: `l` = 48px, `m` = 40px, `s` = 32px; режимы: `edit` и `read`.
- Search icon является частью композиции, но декоративен для screen reader.
- Заполненный Combobox по умолчанию показывает clear action с канонической `Outline/general/x-02`; `clearable={false}` явно отключает её.
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

## Token and effect contract

- Input использует shared field semantic contract для surface, border, placeholder, helper/error и disabled state.
- Search icon — built-in asset со stroke contract `1.4px` в итоговом рендере.
- Clear action использует одинаковую геометрию в `l/m/s`: слот `20×20px`, SVG `16×16px`, контур `8×8px`, итоговый stroke `1.4px`.
- Input-driven listbox не использует pointer popover-motion как Select/Multi Select; геометрия обновляется сразу по мере фильтрации.
- Overlay результатов использует current Soft effect token и current option state tokens.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--sizing-contract`
- `components-fields--combobox-playground`
- `components-fields--combobox-active`
- `components-fields--combobox-interaction`

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, Active story и browser-проверки реализованы.
- [x] Roving active option, фильтрация и Enter-selection завершены.
