# Foundations

Foundation — общий визуальный и технический язык системы. Источник визуальных решений: [Figma DS Core](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs).

## Синхронизировано 21 июля 2026

| Раздел | Источник в Figma | Git | Storybook | Статус |
|---|---|---|---|---|
| Цвета | `4:29` | 399 primitive + 130 semantic variables | Примитивы и семантическая карта | Синхронизировано |
| Типографика | `4:30` | 18 text styles | Таблица и живые образцы | Синхронизировано |
| Spacing | `4:33` | Primitive и semantic tokens | Шкала значений | Синхронизировано |
| Radius | `4:32` | Primitive и semantic tokens | Шкала значений | Синхронизировано |
| Grid | `1026:3600` | 4 responsive presets | Визуализация пресетов | Синхронизировано как документация |
| Icons | `381:25439` | Инвентарь 2 810 компонентов | Статус библиотек и карты замены | Частично: SVG и React API ещё не заведены |
| Shadows | `4:31` | Нет значений | Показан явный empty state | Не заведено в Figma |

## Правила

- Примитивы хранят исходные значения; семантические токены описывают назначение и ссылаются на примитивы.
- Storybook не создаёт значения, которых нет в Figma. Пробел показывается открыто.
- Grid сейчас существует как документированная сетка, но не как локальные Figma Grid Styles.
- Иконки пока синхронизированы на уровне реестра. Их нельзя считать готовым React-пакетом до экспорта SVG, утверждения API и визуального ревью карты замены.
- Любое изменение Foundation проходит через Figma → Git → Storybook → эту базу знаний.

## Машиночитаемые источники

- `packages/tokens/src/primitive.tokens.json`
- `packages/tokens/src/semantic.tokens.json`
- `packages/tokens/src/typography.styles.json`
- `packages/tokens/src/grid.presets.json`
- `packages/tokens/src/icons.inventory.json`
