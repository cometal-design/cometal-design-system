# Полный архитектурный аудит компонентов

- Дата начала: 2026-07-23
- Figma: DS Core, утверждённые компоненты с синим ромбом
- Storybook: production
- Начальный статус: `CONFLICT`
- Текущий статус: `PARTIAL MATCH — IMPLEMENTATION CLEAN, COVERAGE INCOMPLETE`

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
| 2 | Visual QA | Завершён | Baseline `ba33855`: Button, Text Field, Text Area, Checkbox, Radio Button, Switch — Partial Match; Select, Combobox, Multi Select — Conflict |
| 3 | Codex | Завершён | Исправлены все объективные High/Medium-дефекты прохода 2; полный `pnpm validate` пройден; опубликован `dde79cf` |
| 4 | Visual QA | Чистый | 16/16 дефектов закрыты; новых implementation mismatch и регрессий нет |
| 5 | Visual QA | Чистый | Повторно 16/16 закрыты; новых дефектов и регрессий нет; условие двух clean-pass выполнено |

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

## Результат прохода 2

Baseline — только опубликованный commit `ba33855`. Более новые локальные
изменения не использовались как evidence. Deployment drift не подтверждён.

Подтверждено, что Button уже использует правильные именованные типографические
стили L/M/S, размеры icon container, внутреннюю геометрию Arrow и Loader.
Базовая геометрия Fields и Selection controls также совпала после первого
цикла исправлений.

Остались следующие объективные дефекты:

| ID | Область | Severity | Исправление в candidate |
|---|---|---:|---|
| P2-FLD-01 | Option 462×48 и radius 4 вместо 464×48 и radius 8 | Medium | Option 464×48, radius 8 |
| P2-FLD-02 | Лишняя тень Listbox | Medium | Тень удалена |
| P2-FLD-03 | Select Active: неверные порядок, labels и selected/disabled | Medium | Композиция повторяет Figma master |
| P2-FLD-04 | Combobox Active не показывал selected/disabled | Medium | Добавлены selected и disabled option |
| P2-FLD-05 | Multi Select показывал лишний `✓` и неверные selected rows | Medium | Glyph удалён; выбраны первая и третья строки |
| P2-FLD-06 | Value Tags показывали IDs | Medium | В UI выводятся labels |
| P2-ARIA-01 | Select имел две доступные interaction-модели | High | Единственный focus owner — visible combobox trigger; native form select исключён из accessibility tree |
| P2-ARIA-02 | Combobox не управлял active option | High | `aria-activedescendant`, Arrow Up/Down, Enter, Escape |
| P2-ARIA-03 | Multi Select не был composite widget | High | combobox/listbox relation, active descendant и keyboard multiple selection |
| P2-RESP-01 | Active stories переполняли viewport 390 | Medium | `width: 100%; max-width: 480px`; при 390 listbox = 358 px, overflow отсутствует |
| P2-READ-01 | Text Field Read растягивался документацией | Medium | Read height = 80 px; grid больше не растягивает child |
| P2-READ-02 | Text Area Read становился 170 px и оставался single-line | High | root = 80 px; multiline value layer = 48 px |
| P2-SEL-01 | Checkbox roots теряли master widths | Medium | L/M/S = 276/252/230 px |
| P2-SEL-02 | Radio roots теряли master widths | Medium | L/M/S = 276/252/230 px |
| P2-SEL-03 | Switch roots теряли master widths | Medium | L/M/S = 304/276/248 px |
| P2-DOC-01 | Radio group растягивал root до 1280 px | High | Intrinsic flex items; root L = 276 px |

## Локальная проверка candidate

- Listbox L: `480×288`, padding `8`, gap `8`, shadow `none`.
- Option L: `464×48`, radius `8`, `tabIndex=-1`.
- Select Active: Черновик → На согласовании → Активный selected →
  Завершён → Архив disabled.
- Combobox Active: один selected и один disabled option.
- Multi Select Active: первая и третья options selected; glyph отсутствует.
- Responsive 390: listbox `358 px`, option `342 px`, document
  `scrollWidth=390`.
- Read roots: `80 px`; multiline value layer `48 px`.
- Checkbox/Radio L/M/S: `276/252/230 px`.
- Switch L/M/S: `304/276/248 px`.
- Radio group L roots: `276 px`, документационный stretch устранён.
- `pnpm validate`: source validation, secret validation, typecheck,
  14 unit tests, 34 Storybook tests, Storybook build и documentation build —
  успешно.

## Production pass 3

- Baseline: `dde79cf6f07410a1c5baebb854f2633e535060be`.
- Проверены 24 production stories, DOM/computed styles, keyboard/ARIA,
  responsive `1440/768/390`, документационные roots и повторно Figma masters.
- Закрыто: `16/16` дефектов pass 2.
- Новых объективных implementation mismatch: `0`.
- Компонентов со статусом `CONFLICT`: `0`.

## Production pass 4

Независимый повтор того же фиксированного scope на неизменном baseline:

- новых visual/typography/icon/geometry дефектов: `0`;
- новых DOM/API/keyboard/ARIA дефектов: `0`;
- responsive/documentation-root регрессий: `0`;
- повторно закрыто: `16/16`;
- второй последовательный clean-pass: успешно.

## Итоговый статус

В доступном production scope реализация совпадает с утверждёнными Figma
masters; после исправлений два независимых полных прохода не нашли новых
объективных расхождений.

Каждый из девяти компонентов остаётся `PARTIAL MATCH`, а не `MATCH`, только
из-за неполной материализации доказательной матрицы в Storybook:

- нет полного Button cross-product `9 variants × 3 sizes × 5 states`;
- не вынесены все `size × state × mode × content × width` для Fields;
- Active Listbox не имеет отдельных stories для каждого размера;
- Checkbox/Radio/Switch не показывают весь state cross-product L/M/S;
- нет полной theme matrix и экспортированного pixel-diff каждой комбинации.

Это coverage gaps, а не найденные дефекты реализации. Поэтому
`checks.visualMatch` в реестре остаётся `false` до отдельного релиза audit
matrices. `SRC-01` также остаётся отдельным source accessibility conflict.
