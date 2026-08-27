---
id: input.select
name: Select
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1103-535"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--select-playground"
---

# Select

## Назначение

Выбор одного значения из заранее известного набора. Видимый trigger и Listbox
воспроизводят утверждённую Figma-композицию; скрытый нативный `select` сохраняет
form-value и совместимость с HTML-формами.

## Спецификация компонента

- Размеры используют общую шкалу controls: `l` = 48px, `m` = 40px, `s` = 32px; режимы: `edit` и `read`.
- Состояния: default, hover, filled, error, disabled, focus-visible и active.
- `expanded/defaultExpanded/onExpandedChange` управляют раскрытием.
- Chevron синхронизирован с `aria-expanded`: вниз при закрытом Listbox, вверх при открытом.
- `value/defaultValue/onValueChange` управляют выбранным значением.
- Active содержит связанный Listbox с default, selected и disabled options.
- Listbox растёт по количеству вариантов до максимальной высоты: до пяти options
  помещаются без пустого пространства, более длинный список прокручивается внутри.
- Pointer-раскрытие не предвыбирает active option: hover-заливка появляется только после реального наведения. Keyboard active появляется после Arrow Up/Down.
- M3 canonical sources: `Select Base` `1326:2405`, public Select `1103:535`, Listbox `1107:847`, Option `1100:141`. S trigger keeps the canonical `32px` height, existing `spacing-50` `8px` internal horizontal inset and shared `2px` / `4px` FieldChrome focus-visible geometry; pointer opening does not show that ring.
- Open Listbox uses shared internal body-portal behavior with anchor-width matching, existing `6px` gap, viewport flip/shift within `8px` inset and position updates on anchor/surface resize and scroll. The portalled listbox remains inside outside-dismiss and ARIA interaction boundaries; Table shell/clipping is unchanged.

## Accessibility

- Trigger имеет `role="combobox"`, `aria-haspopup`, `aria-expanded`,
  `aria-controls` и `aria-activedescendant`.
- Arrow Up/Down перемещают active option, Enter выбирает, Escape закрывает.
- Тап или клик за пределами trigger и Listbox закрывает раскрытый список.
- Label и supporting text программно связаны с trigger.
- Скрытый native select исключён из tab-order и accessibility tree.

## Motion

- При pointer-раскрытии Listbox появляется от верхней границы trigger через opacity и смещение 4px.
- Длительности и easing поступают из code-owned motion tokens; геометрия и цвет не анимируются.
- Клавиатурное раскрытие остаётся мгновенным.
- При `prefers-reduced-motion: reduce` смещение отключается, остаётся только короткое появление через opacity.

## Token and effect contract

- Trigger использует shared field semantic tokens для surface, border, value, placeholder, disabled и error.
- Chevron как built-in asset визуально рендерится со stroke `1.4px`; source stroke компенсируется по size slot, чтобы итоговая линия совпадала с Figma.
- Active Listbox использует current Soft effect token и не держит фиксированную пустую высоту: до пяти options растёт по контенту, дальше включает внутренний scroll.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--sizing-contract`
- `components-fields--select-playground`
- `components-fields--select-active`
- `components-fields--select-long-list`
- `components-fields--select-interaction`

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [x] React API, Active/interaction stories и browser-проверки реализованы.
- [ ] Frontend Lead подтвердил совместимость с продуктом.
