# Components

`input.fields` — catalog family alias для пяти независимых registry IDs (`input.text-field`, `input.text-area`, `input.select`, `input.combobox`, `input.multi-select`), а не шестой компонент. `input.date-range-picker` — child alias семейства `input.date-picker`.

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
- [[Tabs]] — `navigation.tabs`, переключение связанных persistent content panels, статус `specified`.
- [[Table]] — `data-display.table`, семейство Cells, Headers, Columns и Paginator с Comfortable/Compact плотностью, статус `in-review`.
- [[Text Area]] — `input.text-area`, многострочный ввод текста, статус `in-review`.
- [[Text Field]] — `input.text-field`, однострочный ввод значения, статус `in-review`.
- [[Tooltip]] — `overlay.tooltip`, bounded overlay для коротких пояснений, статус `in-review`.
- [[Widget]] — `template.widget`, generic title/toolbar/content shell в слое Components; ID сохранён для совместимости, статус `in-review`.
- [[Context Menu]] — `overlay.context-menu`, самостоятельный overlay component; статус `in-review`.

## Заблокированные направления

- Icons — Figma-библиотека готова, но канонический SVG source/API для React ещё не утверждён.
