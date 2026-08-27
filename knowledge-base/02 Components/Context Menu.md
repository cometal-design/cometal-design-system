# Context Menu

- ID: `overlay.context-menu`
- Статус: In review
- Слой: Component
- Storybook: `components-context-menu--overview`
- Figma: Main `2668:243`; Sources/Item `2664:228`; review context `2663:77`

## Что это

Самостоятельный overlay-компонент контекстных действий. Привязка к строке, файлу или другой бизнес-сущности принадлежит паттерну.

## Что покрыто

- размеры L / M / S;
- trigger и pointer anchors;
- keyboard roving focus и Escape return;
- default / selected / disabled / danger items;
- divider.
- M3 Table filters use nested `m → m` ContextMenu for operators and per-column Reset. Enter/ArrowRight enters Back, Back/ArrowLeft restores Filters, Escape restores header-trigger focus; focus-visible is the existing Hover alias and collision placement remeasures after level size changes.
- M4 row menu reuses the same portal for pointer or `Shift+F10`/ContextMenu-key invocation by stable row ID and restores exact keyboard origin focus on dismissal. `2668:243` Main and `2664:228` Item are canonical; `2663:77` is review context. Child-size cloning is not part of the component contract.
