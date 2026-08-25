---
id: action.button
name: Button
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=808-4393"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-button--overview"
---

# Button

## Назначение

Запускает одно понятное действие пользователя: сохранить, продолжить, создать, подтвердить или удалить.

## Когда использовать

- Для действия, которое происходит на текущей странице или в текущем процессе.
- Для подтверждения формы или шага.
- Для разрушительного действия с вариантом `danger`.

## Public family exports

- `Button` — действие с текстом или optional leading/trailing icon.
- `IconButton` — icon-only действие; требует доступного имени и использует ту же size/variant engineering.
- `ActionLink` — навигационное действие с Button geometry; рендерит ссылочную семантику.
- `InlineLink` — отдельный текстовый Link atom из `packages/react/src/Link/InlineLink.tsx`; он документируется рядом с action family, но не является Button variant.

## Когда не использовать

- Для обычной навигации — использовать семантическую ссылку.
- Для включения и выключения состояния — использовать Toggle.
- Для выбора одного значения из группы — использовать Radio или Select.

## Anatomy

1. Container.
2. Необязательная начальная иконка.
3. Подпись действия.
4. Необязательная конечная иконка.
5. Loader, который заменяет видимый контент без изменения ширины.
6. Focus ring за внешней границей компонента.

## Variants and sizes

- Варианты: `primary`, `secondary`, `ghost`, `link`, `danger`, `success`, `warning`, `inverse`, `inverse-ghost`.
- Размеры используют общую шкалу controls: `l` = 48px, `m` = 40px, `s` = 32px.
- Композиции: текст; иконка слева + текст; текст + иконка справа; только иконка.
- В одной локальной области рекомендуется один `primary`.
- `ghost`, `inverse` и `inverse-ghost` используются только на поверхности, для которой рассчитан их контраст.

## Figma component sets

- `primary` — `808:4393`.
- `secondary` — `854:522`.
- `ghost` — `854:721`.
- `link` — `855:774`.
- `danger` — `855:973`.
- `success` — `856:1026`.
- `warning` — `856:1225`.
- `inverse` — `857:1278`.
- `inverse-ghost` — `857:1477`.

## States

- `default`, `hover`, `pressed` и `focus-visible` формируются браузером и CSS.
- `disabled` передаётся приложением, блокирует действие и исключает кнопку из tab-порядка.
- `loading` передаётся приложением, сохраняет размеры, показывает loader, ставит `aria-busy="true"` и блокирует повторное действие.
- Focus visible независим от визуального варианта и отображается для клавиатурной навигации.

## Behavior

- Корневой элемент — нативный `<button>`.
- `type="button"` используется по умолчанию. Для отправки формы разработчик явно передаёт `type="submit"`.
- Click вызывается один раз, если кнопка доступна и не находится в loading.
- Enter и Space активируют кнопку нативно.
- Ширина определяется содержимым; произвольное изменение высоты и внутренних отступов не поддерживается.

## Content rules

- Подпись начинается с глагола и описывает результат действия: «Сохранить», «Добавить строку», «Отправить на согласование».
- Избегать общих подписей «Да», «ОК» и «Готово», если результат не очевиден из контекста.
- Для icon-only обязательно доступное имя через `aria-label`.
- Иконка декоративна и не дублирует подпись для screen reader.

## Accessibility

- Используется нативная семантика button без ARIA-эмуляции.
- Focus ring реализован через `:focus-visible`.
- `disabled` использует нативный атрибут.
- `loading` сообщает `aria-busy` и сохраняет доступное имя исходного действия.
- Все варианты проходят автоматическую accessibility-проверку Storybook; контраст дополнительно проверяется на целевой поверхности.

## Token and effect contract

- Размеры опираются на shared control scale: `Semantic.Size.Control.*` и `Semantic.Size.Icon.Button.*`.
- Цвет и контраст приходят из `Semantic.Color.Button.*` и `Semantic.Color.State.Focus Ring`.
- Outline-иконки в runtime обязаны давать визуальную толщину stroke ровно `1.4px`; для этого в code layer используется size-aware source compensation, а не отдельные SVG assets на каждый размер.
- Loader использует тот же stroke contract `1.4px`.
- Motion не берётся из Figma как variant-property: button использует code-owned state motion token `--cometal-motion-duration-state = 120ms`; при `prefers-reduced-motion: reduce` transition отключается.

## Storybook stories

- `components-button--overview`
- `components-button--playground`
- `components-button--sizing-contract`
- `components-button--interaction`
- `components-button--disabled`
- `components-button--loading`
- `components-button--icon-only`

## React API

```ts
type ButtonVariant =
  | 'primary' | 'secondary' | 'ghost' | 'link'
  | 'danger' | 'success' | 'warning'
  | 'inverse' | 'inverse-ghost';

type ButtonSize = 'l' | 'm' | 's';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}
```

`hover`, `pressed` и `focus` намеренно не являются props: это состояния реального взаимодействия.

## Edge cases

- Длинная подпись не переносится; продукт должен выбрать более короткий текст или изменить компоновку области.
- Две иконки без подписи не допускаются правилами использования.
- `loading` вместе с `disabled` остаётся loading и не вызывает действие.
- Визуальный вариант `link` остаётся кнопкой для действия. Для перехода используется отдельный компонент Link.

## Acceptance criteria

- [x] Все 9 вариантов и 3 размера соответствуют Figma DS Core.
- [x] Все 4 композиции представлены в Storybook.
- [x] Default, hover, focus-visible, pressed, disabled и loading документированы.
- [x] Компонент типизирован и экспортирован из `@cometal/react`.
- [x] Unit-, browser- и accessibility-проверки добавлены.
- [ ] Frontend Lead подтвердил API и совместимость с продуктом Cometal.
- [ ] Компонент проверен в реальном продуктовом сценарии.

## Связанные токены и компоненты

- `Semantic.Color.Button.*`
- `Semantic.Size.Button.*`
- `Semantic.Size.Control.*`
- `Semantic.Size.Icon.Button.*`
- `Semantic.Spacing.Button.*`
- `Semantic.Radius.Button`
- `Semantic.Color.State.Focus Ring`
- `Semantic.Stroke.State.Focus`

## Внешние ориентиры

- Catalyst: минимальный API, нативный `type`, disabled, иконки и отдельное различие действия/ссылки — https://catalyst.tailwindui.com/docs/button
- Astryx by Meta: типизированный React-компонент, единые conventions, theme tokens и отдельный Icon Button — https://astryx.atmeta.com/components/Button
