# Select

`input.select` — одиночный выбор из известного набора. Видимый trigger и
Listbox повторяют Active-композицию DS Core; скрытый native select сохраняет
значение формы. Поддерживаются controlled/uncontrolled value и раскрытие,
Arrow Up/Down, Enter и Escape.

Визуальный источник: Figma DS Core `1103:535`.
Поведение и API: `packages/react/src/Field/Field.tsx`.
Живые проверки: `Components/Fields/Select`, `Select · Active Listbox`,
`Select · Keyboard & selection`.
