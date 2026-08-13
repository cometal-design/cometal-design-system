# Badge

`status.badge` — компактный неинтерактивный маркер статуса или атрибута.

## Источники

- Figma: [Component Set `2097:438`](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2097-438)
- Спецификация: [[../../specifications/components/badge]]
- React: `packages/react/src/Badge/Badge.tsx`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-badge--overview
- Реестр: `status.badge`, статус `in-review`

## Контракт

- Один размер 24px.
- Light/Dark surface и восемь тонов.
- Текст и левая/правая filled-иконки включаются независимо.
- Без текста одна иконка превращает Badge в круг 24×24 и требует `aria-label`.
- Badge не интерактивен и не имеет selected/pressed состояния.

## Ownership

Figma владеет визуальной моделью и composition. Tokens владеют значениями. React владеет API и доступной семантикой. Storybook подтверждает размеры, поверхности, тоны и icon-only поведение.
