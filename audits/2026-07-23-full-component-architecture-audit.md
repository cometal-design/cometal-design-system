# Полный архитектурный аудит компонентов

- Дата начала: 2026-07-23
- Figma: DS Core, утверждённые компоненты с синим ромбом
- Storybook: production
- Начальный статус: `CONFLICT`
- Текущий статус: `FIXING`

## Компоненты

- Button
- Text Field
- Text Area
- Select
- Combobox
- Multi Select
- Checkbox
- Radio Button
- Switch

## Обязательная матрица

`компонент × вариант × размер × состояние × тема × композиция × контент × ширина × взаимодействие`

## Слои проверки

1. Архитектура Figma master и React DOM.
2. Корневая и внутренняя геометрия.
3. Типографика и текстовые стили.
4. Иконки и вложенная векторная геометрия.
5. Токены и переменные.
6. Варианты, properties и публичный API.
7. Состояния и интерактивное поведение.
8. Accessibility.
9. Документационные матрицы Storybook.
10. Регрессии между исправлениями.

## Правило остановки

Работа завершается только после трёх полных проходов, причём последние два независимых полных прохода не находят новых объективных дефектов.

Дополнительно обязательны:

- успешные typecheck, unit-, Storybook- и accessibility-проверки;
- успешные production-сборки;
- отсутствие новых console errors;
- отсутствие открытых Critical, High и Medium дефектов;
- совпадение реализации, спецификаций и реестра;
- `visualMatch: true` только для полностью проверенного компонента.

## История проходов

| Проход | Исполнитель | Статус | Результат |
|---|---|---|---|
| 1 | Visual QA | Завершён | Все 9 компонентов проверены; Button — Partial Match, остальные 8 — Conflict |
| 2 | Codex + Visual QA | Ожидается | Проверка исправлений и поиск регрессий |
| 3 | Visual QA | Ожидается | Независимый чистый проход |

## Зафиксированный конфликт исходного дизайна

- `SRC-01` — утверждённый DS Core задаёт пустому placeholder цвет
  Neutral/500 (`#9fa8b3`) на белом фоне: контраст `2.4:1`.
- В этом проходе приоритетом является точное соответствие утверждённой Figma,
  поэтому значение сохранено без самовольной замены.
- В Storybook из axe-проверки исключён только пустой placeholder нативного
  Select; остальные элементы и правила accessibility остаются блокирующими.
- Владелец решения — Design Lead. После изменения токена в Figma код и
  исключение должны обновиться одним релизом.

## Результат прохода 1

Проверены Figma masters, production DOM/CSS, прямые Canvas stories, реальное
взаимодействие и responsive viewport 1440, 768 и 390 px.

Основные классы причин:

1. Документационная CSS-обвязка меняла типографику и размеры вложенных слоёв
   production-компонентов.
2. SVG с тесным `viewBox` растягивались до размера icon container и искажали
   реальную геометрию вектора.
3. Общие CSS-правила стирали различия между Checkbox, Radio Button и Switch.
4. Field helper использовал тот же gap, что label → control.
5. `:has(:disabled)` у Select ошибочно находил disabled placeholder option и
   переводил доступное поле в disabled-стиль.
6. React API и DOM не полностью отражали properties Text Area и Active-состояния
   Select, Combobox и Multi Select.
7. Storybook не показывал полный cross-product состояний и размеров.

## Реестр прохода 1

| ID | Область | Severity | Статус исправления |
|---|---|---:|---|
| BTN-01 | Типографика Button в таблице документации | High | Исправлено локально |
| BTN-02 | Геометрия стрелки Button | High | Исправлено локально |
| BTN-03 | Disabled / Inverse Ghost / Loading | High | Исправлено локально |
| BTN-04 | Потеря alpha `0.001` генератором токенов | Low | Исправлено локально |
| FLD-01 | Отдельные gap label/control и control/helper | High | Исправлено локально |
| FLD-02 | Цвета label/value/helper по состояниям | High | Исправлено локально |
| FLD-03 | Focus ring с зазором 2 px | Medium | Исправлено локально |
| FLD-04 | Read mode и геометрия L/M | High | Исправлено локально |
| TA-01 | Иконки, counter и scrollbar Text Area | High | Исправлено локально; нужен повторный аудит |
| SEL-01 | Disabled placeholder option ломал Select | High | Исправлено локально |
| SEL-02 | Active Select + Listbox | High | Открыт |
| CMB-01 | Active Combobox + keyboard Listbox | High | Открыт |
| MSL-01 | Active Multi Select + multiple Listbox | High | Открыт |
| MSL-02 | Value Tag и end icon | Medium | Исправлено локально |
| ICO-01 | Stateful SVG полей | Medium | Исправлено локально |
| SC-01 | Лишний scale в Pressed | High | Исправлено локально |
| SC-02 | State tokens Checkbox/Radio/Switch | High | Исправлено локально |
| SC-03 | Focus geometry selection controls | Medium | Исправлено локально |
| CHK-01 | Геометрия check mark | Medium | Исправлено локально |
| CHK-02 | Disabled checked/unchecked | Medium | Исправлено локально |
| RAD-01 | Белая surface и brand indicator | High | Исправлено локально |
| SW-01 | Disabled On/Off | High | Исправлено локально |
| SW-02 | Позиция thumb | Low | Исправлено локально |
| DOC-01 | Растягивание component roots документацией | High | Исправлено локально |
| DOC-02 | Полные документационные матрицы | Medium | Открыт |

`Исправлено локально` не означает `MATCH`: пункт закрывается только после
production deployment и повторного независимого прохода.
