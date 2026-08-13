# Components

Паспорта компонентов. Каждый паспорт связывает Figma, спецификацию, реестр, React-код и Storybook.

- [[Badge]] — `status.badge`, компактный статус и атрибут сущности, статус `in-review`.
- [[Button]] — `action.button`, первый эталон полного распространения, статус `in-review`.
- [[Checkbox]] — `selection.checkbox`, бинарный выбор и mixed-состояние, статус `in-review`.
- [[Combobox]] — `input.combobox`, поиск по значениям с фильтрацией, статус `in-review`.
- [[Date Picker]] — `input.date-picker`, единый компонент ручного ввода и календарного выбора даты, статус `in-review`.
- [[Multi Select]] — `input.multi-select`, множественный выбор с тегами, статус `in-review`.
- [[Radio Button]] — `selection.radio-button`, взаимоисключающий выбор внутри группы, статус `in-review`.
- [[Select]] — `input.select`, одиночный выбор из listbox, статус `in-review`.
- [[Switch]] — `selection.switch`, мгновенное включение настройки, статус `in-review`.
- [[Text Area]] — `input.text-area`, многострочный ввод текста, статус `in-review`.
- [[Text Field]] — `input.text-field`, однострочный ввод значения, статус `in-review`.

## Заблокированные направления

- Icons — Figma-библиотека готова, но канонический SVG source/API для React ещё не утверждён.
- Tabs — Figma draft готов, но публичный slot/count-контракт ещё не утверждён.
- Tables — Figma source и review готовы, но публичный Table API и component set ещё не утверждены.
