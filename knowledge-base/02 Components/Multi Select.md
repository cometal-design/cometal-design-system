# Multi Select

`input.multi-select` — множественный выбор с Value Tags в Edit и полным
текстовым списком в Read. Active включает multi-select Listbox; выбранные
options отмечены через `aria-selected`, каждый tag имеет доступное удаление.

## Источники

- Figma: [Component Set `1106:1005`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1106-1005)
- Спецификация: [[../../specifications/components/multi-select]]
- React: `packages/react/src/Field/Field.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--multi-select-playground
- Реестр: `input.multi-select`, статус `in-review`

Trigger открывает Listbox и при наличии tags; Chevron остаётся видимым. Tags
заполняют доступную ширину поля, а `+N` появляется только для значений, которые
перестали помещаться после пересчёта текущей ширины. Read показывает полный список.
Pointer-раскрытие не задаёт active option до наведения; уже выбранные values продолжают отражаться через `aria-selected`.
Pointer-открытие Listbox использует системный popover-motion; клавиатурное раскрытие мгновенно.

Визуальный источник: Figma DS Core `1106:1005`.
Поведение и API: `packages/react/src/Field/Field.tsx`.
Живые проверки: `Components/Fields/Multi Select · Active Listbox` и
`Multi Select · multiple selection`.
