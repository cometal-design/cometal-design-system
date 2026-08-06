# DS Core: актуальное состояние и кандидаты на очистку

- Дата: 2026-07-23
- Figma: `DS Core`, file key `KKNGucImxFAtQLBhPy8tLs`
- Область: Figma, Git registry/specifications, React, Storybook, knowledge base, локальные отчеты и временные артефакты
- Принцип: ничего не удалять без подтверждения Design System Lead

## 1. Краткий вывод

Система уже разделена на рабочие слои:

1. Foundation: Typography, Colors, Spacing, Radius, Icons, Grid.
2. Components: Button, Fields, Checkbox, Radio Button, Switch, Tabs.
3. System и Documentation Standards: служебные компоненты и правила оформления.
4. Patterns: создана структура будущих разделов, но содержимое пока отсутствует.
5. Git: спецификации, registry, tokens, React, Storybook, tests и knowledge base.

Основная проблема сейчас не в отсутствии структуры, а в разном уровне
актуальности источников:

- Figma содержит больше сущностей, чем Git registry и код;
- release `v0.2.0` объявляет Tabs публичным, хотя его нет в registry, code,
  Storybook, specification и knowledge base;
- часть старых отчетов описывает уже несуществующее состояние системы;
- рабочая Figma содержит пустые roadmap-страницы и отдельные тестовые объекты;
- локальная папка содержит временные screenshots, одноразовые scripts и
  завершенный run-state.

## 2. Текущее состояние Figma

### Структура

- 57 страниц с учетом разделителей и страниц-маркеров.
- 3 340 компонентов.
- 41 component set.
- 542 variables:
  - Primitive: 399;
  - Semantic: 132;
  - Component / Button: 1 variable, 7 modes;
  - Component / Input: 7 variables, 6 modes;
  - Component / Option: 3 variables, 5 modes.
- 18 Text Styles.
- Paint Styles: 0.
- Effect Styles: 0.
- Grid Styles: 0.

### Актуальные рабочие области

- Releases.
- План работ.
- Documentation Standards.
- Typography.
- Colors.
- Spacing.
- Radius.
- Icons.
- Grid.
- Button.
- Fields.
- Checkbox.
- Radio Button.
- Switch.
- Tabs.
- System.

### Исторические или служебные области

- `— Аудит`: две карты инвентаризации молекул.
- `Icon Replacement Map`: промежуточная карта замены иконок.
- `Core`: cover.

### Пустые roadmap-страницы

- `⚡️ PRINCIPLES OF DESIGN`.
- Navbar.
- Sidebar.
- Breadcrumb bar.
- Search.
- Filters.
- Form section.
- Tables.
- Table toolbar.
- Results header.
- Shadow.
- Segmented Control.
- Slider.
- File Upload.
- Badge.
- Tag.
- Alert.
- Tooltip.
- Loader.
- Progress.
- Counter.
- Breadcrumbs.
- Pagination.
- Divider.
- Overlay.

### Объективные кандидаты на исправление

1. На странице `Fields` находятся 15 top-level test instances вне трех
   основных artboards. Их нужно либо перенести в отдельную QA-зону, либо удалить
   после подтверждения, что они не являются документационными примерами.
2. На странице `Date Picker` находится один stray instance `Multi Select`.
   Он не относится к странице и является кандидатом на удаление.
3. `Tabs` имеет описание черновой композиции, но release называет его публичным
   компонентом. Нужно привести статус к одному решению.
4. `Brand` на странице `System` не имеет component description. Это пробел
   документации, а не кандидат на удаление.
5. В Button naming встречается расхождение `Ghost` / `Host`. Нужно принять один
   термин и синхронизировать Figma, specifications, code и release notes.

## 3. Состояние Git и исполняемой системы

### Зарегистрировано

В `registry/components.json` находится 9 компонентов:

- Button.
- Text Field.
- Text Area.
- Select.
- Combobox.
- Multi Select.
- Checkbox.
- Radio Button.
- Switch.

Все имеют статус `in-review`, версию `0.1.0-beta.1` и
`checks.visualMatch = false`.

### Реализовано

- React: Button, Fields и Selection Controls.
- Storybook: Button, Fields, Checkbox, Radio Button, Switch и Foundation.
- Specifications: 9 файлов под зарегистрированные компоненты.
- Knowledge base: паспорта тех же 9 компонентов.
- Tabs отсутствует во всех перечисленных Git-слоях.

### Проверка

`pnpm validate` прошел:

- source validation: 5 источников, 9 компонентов;
- secret validation: 133 tracked files;
- typecheck: passed;
- unit tests: 12 passed;
- Storybook tests: 28 passed;
- tokens, React, Storybook и docs production builds: passed.

Предупреждения:

- Storybook не находит MDX stories и colocated stories, потому что текущие
  stories лежат в `apps/storybook/stories`;
- production bundle содержит chunks больше 500 kB.

Это технический долг, но не блокер текущей сборки.

## 4. Конфликты источников истины

### Critical: Tabs

Figma release `v0.2.0` утверждает:

> Добавлен публичный компонент Tabs.

Фактически:

- Figma component set описан как черновой;
- registry entry отсутствует;
- specification отсутствует;
- React implementation отсутствует;
- Storybook story отсутствует;
- knowledge passport отсутствует.

Рекомендация: до завершения полного lifecycle изменить release wording на
`Candidate / In review` или удалить Tabs из опубликованного состава `v0.2.0`.
Сам Figma component set сохранять как Candidate.

### High: release snapshot

`apps/storybook/stories/releases.generated.ts` является ручным snapshot Figma
Releases. Он не валидируется против registry и поэтому допускает ложные
публичные заявления.

Рекомендация: добавить проверку, запрещающую статус `Опубликован` для компонента,
которого нет в registry/specification/source/Storybook.

### Medium: количество variables

Старые отчеты фиксируют 476 и 536 variables. Текущее фактическое количество:
542. Старые значения не должны использоваться как актуальная спецификация.

## 5. Локальные результаты и отчеты

### Оставить как активные

- `docs/artboard-ds-core.md`: текущий стандарт упаковки artboards.
- `cometal-design-system/registry/*`: статусы и связи.
- `cometal-design-system/specifications/*`: контракты компонентов.
- `cometal-design-system/knowledge-base/*`: контекст и решения.
- `cometal-design-system/audits/2026-07-23-full-component-architecture-audit.md`:
  текущий аудит, пока `IN PROGRESS`.
- `cometal-backlog-july.csv`: активная декомпозиция ближайших задач.
- `docs/communications-discovery-2026-07-21.md`: продуктовый discovery, но его
  лучше хранить вне папки дизайн-системных отчетов.

### Оставить как source evidence

- `docs/redesign-ds-spacing-radius-tokens.md`.
- `docs/cometal-2-molecules-inventory-brief.md`.
- `font-normalized/*`.
- `figma-tools/responsive-typography-map/*`.

Эти файлы не являются актуальной DS specification, но объясняют происхождение
решений или обеспечивают tooling.

### Архивировать как исторические

- `docs/ds-core-sync-audit-2026-07-07.md`.
- `docs/ds-core-qa-backlog-2026-07-17.md`.
- `docs/ds-core-comprehensive-audit-2026-07-18.md`.
- `docs/ds-component-remediation-report-2026-07-18.md`.
- `docs/button-fields-qa-backlog-2026-07-18.md`.

Причина: они полезны как evidence, но описывают Figma-only период до появления
текущего React/Storybook runtime и содержат уже устаревшие counts и ограничения.
Их нельзя использовать как текущий статус.

### Консолидировать

- `docs/component-lifecycle-figma-storybook.md`.
- `docs/figma-storybook-design-system-alignment-plan.md`.

Оба документа описывают почти один lifecycle. Каноническим рекомендуется
оставить `component-lifecycle-figma-storybook.md`, а alignment plan перенести в
архив после переноса уникальных решений.

- `docs/cometal-tracker-decomposition.md`.
- `cometal-backlog-july.csv`.

Первый файл является большой продуктовой декомпозицией, второй — оперативным
backlog. Нужно оставить один активный tracker-формат, а длинный документ
сохранить как исходную декомпозицию вне активной DS-документации.

### Удалить после подтверждения

- `.DS_Store`.
- `.codex-tmp/*.png`: временные QA screenshots, не source of truth.
- `docs/figma-fields-colors-run-state-2026-07-18.json`: завершенный run-state,
  pending пуст.
- `.codex/selector-draft-builder.js`.
- `.codex/selector-draft-fix.js`.
- `.codex/selector-review-grid-fix.js`.

Последние три файла выглядят как одноразовые Figma migration scripts. Перед
удалением нужно подтвердить, что они не используются как воспроизводимый
runbook. Если воспроизводимость нужна, перенести их в именованный tooling
package и добавить README; иначе удалить.

## 6. Рекомендованная очистка Figma

### Оставить

- активные Foundation и Components pages;
- Releases и План работ;
- System;
- Documentation Standards;
- `— Аудит` как историческую страницу до переноса в Archive;
- пустые Pattern pages только если они сознательно используются как roadmap.

### Архивировать

- `Icon Replacement Map`;
- две старые molecule inventories;
- пустые roadmap pages, которые еще не вошли в ближайший план.

Рекомендуемая модель: одна страница `Archive` для исторических boards и один
внешний tracker для будущих компонентов. Пустая Figma-страница не должна быть
единственным backlog-артефактом.

### Удалить после подтверждения

- `⚡️ PRINCIPLES OF DESIGN`, если раздел не запланирован;
- stray `Multi Select` на `Date Picker`;
- 15 top-level QA instances на `Fields`, если они не используются в review;
- пустые backlog pages после переноса задач в tracker.

## 7. Рекомендуемый порядок действий

1. Исправить Tabs status и release `v0.2.0`.
2. Завершить текущий architecture audit и только после этого менять
   `visualMatch`.
3. Очистить явные stray objects в Fields и Date Picker.
4. Перенести historical boards и reports в Archive.
5. Убрать пустые backlog pages, которые уже представлены в tracker.
6. Консолидировать lifecycle-документы.
7. Удалить подтвержденные temporary files и one-off scripts.
8. Добавить автоматическую проверку release ↔ registry ↔ implementation.

## 8. Решения, требующие подтверждения

Перед удалением Design System Lead должен подтвердить:

1. Нужна ли пустая страница `⚡️ PRINCIPLES OF DESIGN`.
2. Нужны ли пустые Pattern и Backlog pages как визуальный roadmap.
3. Можно ли архивировать `Icon Replacement Map` и molecule inventories.
4. Являются ли top-level instances на Fields QA-мусором.
5. Нужны ли `.codex/selector-*.js` для повторного запуска.
6. Tabs остается Candidate или должен быть доведен до полного public lifecycle.
