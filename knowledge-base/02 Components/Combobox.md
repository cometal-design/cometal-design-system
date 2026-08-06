# Combobox

`input.combobox` — поиск и одиночный выбор. Input связан с Listbox результатов;
focus и pointer click не открывают его сами по себе, Escape закрывает,
`onOptionSelect` возвращает выбранное значение.

Ввод фильтрует options без учёта регистра. Listbox появляется только для непустого
запроса с совпадениями. Выбор результата подставляет label в поле, синхронизирует
Read-демонстрацию и закрывает Listbox.
Первое совпадение не получает ложный hover сразу после ввода. Active появляется только после pointer hover или Arrow Up/Down.
Input-driven Listbox обновляется без анимации, чтобы поиск и клавиатурная навигация не задерживались.

Визуальный источник: Figma DS Core `1104:661`.
Поведение и API: `packages/react/src/Field/Field.tsx`.
Живая проверка: `Components/Fields/Combobox · Active Listbox`.
