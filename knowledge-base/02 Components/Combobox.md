# Combobox

`input.combobox` — поиск и одиночный выбор. Input связан с Listbox результатов;
focus и pointer click не открывают его сами по себе, Escape закрывает,
`onOptionSelect` возвращает выбранное значение.

## Источники

- Figma: [Component Set `1104:661`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1104-661)
- Спецификация: [[../../specifications/components/combobox]]
- React: `packages/react/src/Field/Field.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-fields--combobox-playground
- Реестр: `input.combobox`, статус `in-review`

Ввод фильтрует options без учёта регистра. Listbox появляется только для непустого
запроса с совпадениями. Выбор результата подставляет label в поле, синхронизирует
Read-демонстрацию и закрывает Listbox.
Первое совпадение не получает ложный hover сразу после ввода. Active появляется только после pointer hover или Arrow Up/Down.
Input-driven Listbox обновляется без анимации, чтобы поиск и клавиатурная навигация не задерживались.

Визуальный источник: Figma DS Core `1104:661`.
Поведение и API: `packages/react/src/Field/Field.tsx`.
Живая проверка: `Components/Fields/Combobox · Active Listbox`.

## Что зафиксировано

- Public API: `options`, `defaultValue`, `expanded/defaultExpanded`, `onExpandedChange`, `onOptionSelect`, `placeholder`, `mode`, `size`.
- Раскрытие driven by input query: фокус и pointer click сами по себе не открывают listbox.
- Search icon использует runtime outline stroke contract `1.4px`.
- Overlay результатов использует current Soft effect, но без spatial pointer animation при вводе.

## Storybook stories

- `components-fields--overview`
- `components-fields--fields-playground`
- `components-fields--sizing-contract`
- `components-fields--combobox-playground`
- `components-fields--combobox-active`
- `components-fields--combobox-interaction`
