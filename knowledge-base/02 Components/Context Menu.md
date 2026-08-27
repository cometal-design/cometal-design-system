# Context Menu

- ID: `overlay.context-menu`
- Статус: In review
- Слой: Component
- Storybook: `components-context-menu--overview`

## Что это

Самостоятельный overlay-компонент контекстных действий. Привязка к строке, файлу или другой бизнес-сущности принадлежит паттерну.

## Что покрыто

- размеры L / M / S;
- trigger и pointer anchors;
- keyboard roving focus и Escape return;
- default / selected / disabled / danger items;
- divider.
- M3 Table filters use nested `m → m` ContextMenu for operators and per-column Reset. Enter/ArrowRight enters Back, Back/ArrowLeft restores Filters, Escape restores header-trigger focus; focus-visible is the existing Hover alias and collision placement remeasures after level size changes.
