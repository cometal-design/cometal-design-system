# Switch

`selection.switch` — немедленное включение настройки. Использует нативный checkbox с `role="switch"` и не требует отдельной кнопки подтверждения.

## Что зафиксировано

- Track sizes: `44×24`, `36×20`, `32×16`
- Состояния только `off/on`; checked-state принадлежит приложению
- Нативная клавиатурная модель сохранена, visual focus ring идёт вокруг track

## Источники

- Figma: [Component Set `1571:9673`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-9673)
- Спецификация: [[../../specifications/components/switch]]
- React: `packages/react/src/Selection/Selection.tsx`
- Styles: `packages/react/src/Selection/selection.css`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-switch--overview
- Реестр: `selection.switch`, статус `in-review`
