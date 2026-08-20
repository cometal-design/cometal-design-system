# Radio Button

`selection.radio-button` — одиночный выбор внутри группы. Использует нативный radio и не подменяет group-behavior локальным JavaScript.

## Что зафиксировано

- Размеры control: `l 20px`, `m 16px`, `s 14px`
- Компонент не владеет группой: `name`, `value`, `checked/defaultChecked` принадлежат продукту
- Возврат к `not-selected` — это смена внешнего state, а не локальный toggle

## Источники

- Figma: [Component Set `1571:8954`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1571-8954)
- Спецификация: [[../../specifications/components/radio-button]]
- React: `packages/react/src/Selection/Selection.tsx`
- Styles: `packages/react/src/Selection/selection.css`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-radio-button--overview
- Реестр: `selection.radio-button`, статус `in-review`
