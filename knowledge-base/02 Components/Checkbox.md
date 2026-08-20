# Checkbox

`selection.checkbox` — независимый выбор с `unchecked`, `checked` и `mixed`. Использует нативный checkbox и size-specific SVG mark geometry.

## Что зафиксировано

- Размеры: `l 20px`, `m 16px`, `s 14px`
- Mixed задаётся через `indeterminate`, а не вторым визуальным слоем поверх check-mark
- Browser semantics и keyboard toggle (`Space`) остаются нативными

## Источники

- Figma: [Component Set `1571:521`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-521)
- Спецификация: [[../../specifications/components/checkbox]]
- React: `packages/react/src/Selection/Selection.tsx`
- Styles: `packages/react/src/Selection/selection.css`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-checkbox--overview
- Реестр: `selection.checkbox`, статус `in-review`
