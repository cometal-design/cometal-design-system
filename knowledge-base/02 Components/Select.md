# Select

`input.select` — одиночный выбор из известного набора. Видимый trigger и
Listbox повторяют Active-композицию DS Core; скрытый native select сохраняет
значение формы. Поддерживаются controlled/uncontrolled value и раскрытие,
Arrow Up/Down, Enter и Escape.

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
