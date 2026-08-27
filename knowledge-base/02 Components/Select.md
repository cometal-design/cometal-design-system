# Select

`input.select` — одиночный выбор из известного набора. Видимый trigger и
Listbox повторяют Active-композицию DS Core; скрытый native select сохраняет
значение формы. Поддерживаются controlled/uncontrolled value и раскрытие,
Arrow Up/Down, Enter и Escape.

## Источники

- Figma: [Component Set `1103:535`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1103-535)
- Спецификация: [[../../specifications/components/select]]
- React: `packages/react/src/Field/Field.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--select-playground
- Реестр: `input.select`, статус `in-review`

Listbox использует высоту по содержимому до пяти строк. Если вариантов больше,
высота ограничивается, а дальнейшие options доступны через внутренний скролл.

Выбранный option синхронно обновляет Edit-value и связанную Read-демонстрацию.
Тап или клик за пределами Select закрывает Listbox без изменения значения.
Pointer-открытие не подсвечивает первый option: hover появляется только после наведения, keyboard active — после Arrow Up/Down.
Pointer-открытие использует системный motion: короткие opacity + смещение 4px от trigger;
при reduced motion пространственное движение отключается.

Визуальный источник: Figma DS Core `1103:535`.
Поведение и API: `packages/react/src/Field/Field.tsx`.
Живые проверки: `Components/Fields/Select`, `Select · Active Listbox`,
`Select · Long List`, `Select · Keyboard & selection`.

## Что зафиксировано

- Public API: `options`, `value/defaultValue`, `onValueChange`, `expanded/defaultExpanded`, `onExpandedChange`, `placeholder`, `mode`, `size`.
- Hidden native `select` сохраняет form value; видимый trigger/listbox отвечает за Figma-совпадение и keyboard behavior.
- Chevron показывает вниз при `aria-expanded=false` и вверх при `aria-expanded=true`.
- До пяти options listbox растёт по контенту; дальше включает внутренний scroll.
- Pointer open использует current popover motion + Soft effect; keyboard open остаётся мгновенным.
- M3 sources: `Select Base` `1326:2405`, Listbox `1107:847`, Option `1100:141`. S trigger остаётся `32px` с existing `spacing-50` `8px` inset; focus ring `2px` / `4px` появляется только для keyboard/programmatic focus.
- Listbox использует shared body portal: existing `6px` gap, anchor width, flip/shift в viewport inset `8px`, follow scroll/resize; он остаётся внутри ARIA/outside-dismiss boundary и не требует ослабления Table clipping.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--sizing-contract`
- `components-fields--select-playground`
- `components-fields--select-active`
- `components-fields--select-long-list`
- `components-fields--select-interaction`
