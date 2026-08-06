# Foundations

Foundation — общий визуальный и технический язык системы. Источник визуальных решений: [Figma DS Core](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs).

## Синхронизировано 4 августа 2026

| Раздел | Источник в Figma | Git | Storybook | Статус |
|---|---|---|---|---|
| Цвета | `4:29`, Semantic Color Map `1341:1852` | 399 primitive + 143 semantic variables | Примитивы и семантическая карта: 98 цветовых ролей | Синхронизировано |
| Типографика | `4:30` | 18 text styles | Таблица и живые образцы | Синхронизировано |
| Spacing | `4:33` | Primitive и semantic tokens | Шкала значений | Синхронизировано |
| Radius | `4:32` | Primitive и semantic tokens | Шкала значений | Синхронизировано |
| Grid | `1026:3600` | 4 responsive presets | Визуализация пресетов | Синхронизировано как документация |
| Icons | `381:25439` | Инвентарь 2 810 компонентов | Статус библиотек и карты замены | Частично: SVG и React API ещё не заведены |
| Motion | Статическая документационная борда ожидает решения; variables не создаём | 5 duration + 3 easing tokens | Button, Fields, Checkbox, Radio Button, Switch, Inline Link и Date Picker используют общий source; Storybook и портал показывают все 8 токенов | Частично: Git, React, tests, Storybook и портал синхронизированы локально |
| Shadows | `4:31` | Нет значений | Показан явный empty state | Не заведено в Figma |

## Правила

- Примитивы хранят исходные значения; семантические токены описывают назначение и ссылаются на примитивы.
- Semantic содержит 98 цветовых ролей и 45 размерных токенов. Карта цветов в Figma, token source, портал и Storybook должны совпадать 1:1.
- Storybook не создаёт значения, которых нет в Figma. Пробел показывается открыто.
- Grid сейчас существует как документированная сетка, но не как локальные Figma Grid Styles.
- Иконки пока синхронизированы на уровне реестра. Их нельзя считать готовым React-пакетом до экспорта SVG, утверждения API и визуального ревью карты замены.
- Motion принадлежит code-owned слою: Git хранит значения и React-поведение, Storybook показывает и проверяет, портал объясняет, Obsidian фиксирует контекст. В Figma не создаём ложные motion variables; допустима отдельная статическая документационная борда.
- Локальные значения длительности и easing внутри React-компонентов запрещены: state, popover и loader-motion обращаются к `--cometal-motion-*`.
- Pointer-сценарии могут использовать короткое движение, частые keyboard-сценарии остаются мгновенными, `prefers-reduced-motion` убирает пространственный сдвиг.
- Визуальные Foundation-решения проходят через Figma → Git → Storybook → эту базу знаний. Поведенческие Motion-решения проходят Git → Storybook/tests → эту базу знаний.

## Машиночитаемые источники

- `packages/tokens/src/primitive.tokens.json`
- `packages/tokens/src/semantic.tokens.json`
- `packages/tokens/src/typography.styles.json`
- `packages/tokens/src/grid.presets.json`
- `packages/tokens/src/icons.inventory.json`
- `packages/tokens/src/motion.tokens.json`
