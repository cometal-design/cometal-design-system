# Semantic Color Map — synchronization audit

Дата: 2026-08-04

Scope: синхронизация семантической карты цветов между Figma DS Core, token source, React-компонентами, Storybook, порталом и Obsidian.

Вердикт независимого Visual QA: `PASS`; подтверждённых расхождений в согласованном scope нет.

## Эталон в Figma

- Figma-файл: `KKNGucImxFAtQLBhPy8tLs`.
- Semantic Color Map: `1341:1852`.
- Semantic collection: 143 переменные — 98 COLOR и 45 FLOAT.
- Карта содержит 98/98 цветовых ролей.
- У утверждённых компонентов после синхронизации: 0 raw colors и 0 прямых привязок к Primitive paints.

## Добавленные семантические роли

1. `Color/Action/Neutral/Default` → `Neutral/0/100` → `#FFFFFF`.
2. `Color/Action/Neutral/Hover` → `Neutral/100/100` → `#F3F6FB`.
3. `Color/Action/Neutral/Pressed` → `Blue/100/100` → `#EAF3FF`.
4. `Color/Action/Neutral/Disabled` → `Neutral/100/100` → `#F3F6FB`.
5. `Color/Surface/Selected` → `Blue/100/40` → `#EAF3FF66`.
6. `Color/Text/Selected` → `Blue/700/100` → `#002F6C`.
7. `Color/Text/Placeholder` → `Neutral/500/100` → `#9FA8B3`.
8. `Color/Text/Link/Pressed` → `Blue/900/100` → `#001E46`.
9. `Color/Text/Link/Disabled` → `Neutral/500/100` → `#9FA8B3`.
10. `Color/Status/Info/Strong` → `Blue/500/100` → `#005BD1`.
11. `Color/Status/Danger/Strong` → `Red/500/100` → `#E55454`.

## Перепривязка компонентов

- 51 component-variable alias переведён на Semantic.
- 20 прямых paint-привязок переведены на Semantic в Fields, Checkbox, Switch и Date Picker.
- Button Link приведён к Figma master `855:774`: Default `#0041A0`, Hover `#002F6C`, Pressed `#001E46`, Disabled `#9FA8B3`.
- 13 component-level Primitive aliases сохранены намеренно: для них нет точного семантического эквивалента, а новые роли без продуктового основания не создавались.

## Storybook и портал

- Semantic story показывает 98/98 ролей; alias и resolved values совпадают с token source.
- Desktop 1440px и mobile 430px: горизонтальное переполнение отсутствует, длинные значения переносятся, мобильный header таблицы скрывается.
- Date Picker responsive assertion использует доступную ширину контейнера: desktop 480px, mobile 366px.
- Fields, Checkbox, Radio Button и Switch прошли regression smoke на desktop и 430px.

## Автоматические проверки

- Storybook browser/a11y: 8 файлов, 47/47 тестов.
- `git diff --check`: пройден.
- Полный `pnpm validate`: пройден перед публикацией.

## Источники истины

- Figma: визуальная композиция, роли и алиасы.
- Git/token source: `packages/tokens/src/semantic.tokens.json`.
- React: применение ролей в компонентах.
- Storybook: исполняемые состояния и проверка значений.
- Portal: каталог Foundation и объяснение назначения.
- Obsidian: `knowledge-base/01 Foundations/Index.md`.

## Открытый gate

Visual QA подтверждает визуальное и инженерное совпадение в согласованном scope. Frontend Lead review остаётся отдельным gate перед присвоением продуктового статуса `ready`.
