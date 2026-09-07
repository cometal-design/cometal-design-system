# Стандарт страницы компонента

Версия: `1.0`  
Дата: `2026-09-07`  
Reference implementation: Button page at
`45fdd5e404134321f0d54c4b2b07f7e198973a72`  
Статус: living standard for portal documentation; не спецификация React API и
не утверждение готовности компонента.

Этот стандарт задаёт повторяемую информационную архитектуру component page.
Его задача — помочь читателю быстро понять назначение компонента, попробовать
только поддержанные настройки и проверить его инклюзивное использование. Один
и тот же нативный компонент должен быть источником preview в portal и Storybook;
документация не имитирует недоступные API или взаимодействия.

`docs/portal-content-guidelines.md` остаётся источником общего tone of voice,
ритма и базовой навигационной терминологии. Этот документ уточняет структуру
конкретной страницы компонента.

## Граница и источники

- Сначала подтвердите stable ID, реальный React export, поддержанные props,
  states, Figma/Storybook/GitHub links и текущий lifecycle status.
- Не угадывайте link, prop, импорт, package availability, keyboard behavior или
  state. Если источник не подтверждён, назовите это ограничением страницы.
- Preview, Settings и example code используют только public configuration
  целевого компонента. Docs-only состояние допускается лишь с явной подписью и
  не выдаётся за public prop.
- Не дублируйте устаревшие API, install или usage blocks: Overview содержит
  один короткий import, а полный runnable code живёт у соответствующего примера
  или в Settings.
- `@cometal/react` остаётся workspace dependency, пока package publication
  отдельно не подтверждена. Не добавляйте фиктивную команду установки.

## Структура страницы

### 1. Header

Header начинается с H1 и lifecycle status в правой части верхней строки. Под
ними идут короткое описание, затем mono-строка `ID · React export · package`.
Не используйте eyebrow `Компонент · Web` и отдельный metadata strip.

В toolbar:

- слева — named tabs `Обзор`, `Настройки`, `Доступность`;
- справа — M links `Figma`, `Storybook`, `GitHub`;
- links и tabs выровнены по центру tab-button inner content, а не по случайному
  внешнему краю toolbar;
- берите exact href/IDs из registry и implementation, не конструируйте их по
  имени компонента.

Мобильный режим повторяет Button: links могут горизонтально scroll, tabs
становятся следующей полной строкой toolbar. Сохраняйте safe focus gutters,
Button-only focus ring и независимый selected underline. Не ставьте autofocus и
не делайте весь documentation panel focusable.

### 2. Overview

Overview читается в следующем порядке:

1. Presentation area с реальным component preview.
2. `Использование`: одна короткая инструкция и compact import через shared
   `CodeBlock`.
3. `Композиция`: semantic parts table.
4. `Правила использования`: Do/Don't table с настоящим `Badge` в колонках
   `Статус`, `Тезис`, `Объяснение`; первые две колонки вместе выровнены с
   первой колонкой `Композиции`.
5. `Примеры`.

Каждый example article строится так: preview → title → description → полный
matching runnable code. Code описывает именно публичную configuration и нужные
state/handlers для interaction. Не добавляйте вложенные Description/Code tabs,
не обрезайте snippet и ставьте separator только между соседними example
articles.

### 3. Settings

Settings — это live preview, `Показать код`/`Скрыть код`, свойства и `Сбросить`:

- preview и generated code меняются синхронно;
- каждый editor row содержит prop name, type, default и понятное объяснение;
- показывайте только действительно поддержанные props и native attributes,
  относящиеся к целевому component;
- docs-only preview surface явно отделяется от component props;
- используйте shared `CodeBlock`, доступные labels и корректное escaping text
  и import assets;
- Reset возвращает documented defaults, а не произвольный demo state.

Не копируйте Button loading в пассивный Badge, Tab/Radio behavior в невыборный
контрол или произвольный state в API другого компонента.

### 4. Accessibility

Доступность — короткий source-based справочник, а не WCAG certification или
заявление о screen-reader testing. Содержите только релевантные разделы:

- contrast и видимый focus;
- keyboard behavior целевого компонента;
- роли, accessible names и states;
- ссылки на официальный W3C/WAI-ARIA APG источник там, где он применим.

Используйте реальную implementation semantics. У неинтерактивного компонента
нет tab-stop; не переносите Button Enter/Space rules на каждый компонент.

## Composition и interaction rules

- Passive Badge остаётся passive.
- Checkbox/Switch меняют реальное состояние.
- Radio group поддерживает взаимоисключающий выбор.
- Tabs показывает реальные связанные panels с MANUAL activation, а не
  декоративное переключение текста.
- Context Menu открывается и закрывается по реальному interaction; не
  размещайте persistent default-open portal поверх всей страницы.
- Examples не используют fake interactivity. Если visual state показан только
  для documentation, подпишите его как specimen и не выдавайте за runtime prop.

## Geometry, code и layout

- Reuse existing portal tokens and Button preview geometry: `16:9`, approved
  min-height, padding, radius and responsive behavior.
- Все examples на странице имеют одну baseline geometry. Если component требует
  real overflow content, документируйте конкретную адаптацию, а не скрывайте её.
- На page toolbar — один divider. Внутри контента используйте section spacing;
  `Композиция` имеет только свой header rule. Не размножайте декоративные
  разделители.
- CodeBlock toolbar сохраняет фон блока: не добавляйте белую strip. Copy control
  находится сверху справа вне code scroll area.
- Не добавляйте template-specific tokens или raw colors.

## Tabs и URL

Текущая Button reference page использует real Tabs для Overview/Settings/
Accessibility, но выбранный tab пока не получает собственный URL и не
восстанавливается по deep link. Это известное browser limitation reference
implementation, не доказательство поддержки tab URLs.

Для будущего reusable component-page shell каждый named documentation tab
должен иметь открываемый direct URL и восстанавливаться без initial autofocus.
Такое изменение требует отдельного scope: не меняйте routing в рамках миграции
контента одной страницы.

## Local completion checklist

- [ ] Header содержит exact H1, lifecycle status, summary, identity и links.
- [ ] Tabs `Обзор` / `Настройки` / `Доступность` функциональны; initial focus
      остаётся у пользователя.
- [ ] Overview соблюдает prescribed order; examples имеют полный matching code.
- [ ] Settings меняет реальный preview и code, содержит только supported API и
      имеет Reset.
- [ ] Accessibility соответствует source implementation и содержит только
      релевантные keyboard/roles/names/states.
- [ ] Mobile проверен: toolbar, tabs, links, code и examples не скрывают focus
      ring и не создают unintended document overflow.
- [ ] Existing Button page остаётся визуальной и behavioral baseline.
- [ ] Exact links и metadata проверены; exceptions перечислены source-authoritatively.
- [ ] Изменения закоммичены в bounded diff; docs typecheck/build выполнены как
      final batch check, если их scope разрешён delivery brief.

## Как развивать стандарт

Version this file when a shared information-architecture rule changes. Для
компонентного исключения сначала укажите source (API, Figma, accessibility или
product decision), затем добавьте короткое исключение в affected page и ссылку
на него здесь только если правило повторяемо. Не превращайте частный CSS detail
или разовую demo workaround в общий standard.
