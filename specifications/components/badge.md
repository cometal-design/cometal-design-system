---
id: status.badge
name: Badge
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2097-438"
storybook: "https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-badge--overview"
---

# Badge

## Назначение

Компактный неинтерактивный маркер статуса или атрибута. Badge не запускает действие и не заменяет Button, Link, Checkbox или фильтр.

## Визуальная модель

- Высота всегда 24px; отдельной размерной шкалы нет.
- `surface`: `light`, `dark`.
- `tone`: `neutral`, `blue`, `cyan`, `green`, `purple`, `red`, `violet`, `yellow`.
- Состав: Text; L Icon + Text; Text + R Icon; L Icon + Text + R Icon; одна иконка без текста.
- Icon-only всегда 24×24 и требует доступное имя.
- Иконки внутри Badge должны быть filled и занимают 12px внутри слота 16px.
- Все цвета, размеры, spacing и radius используют Foundation и Component/Badge tokens.

## React API

- `surface` и `tone` отвечают только за визуальную роль.
- `children` передаёт текст; `startIcon` и `endIcon` независимо включают иконки.
- Если текста нет, используется одна доступная иконка: сначала `startIcon`, затем `endIcon`.
- Нативные `HTMLAttributes<HTMLSpanElement>` сохраняются.
- Компонент не имеет click/pressed/selected состояний.

## Token and effect contract

- Badge использует только semantic color, spacing, radius и icon-size tokens из слоя `Component/Badge`.
- Высота всегда `24px`, радиус `12px`, icon slot `16px`, filled icon `12px`.
- Outline-иконки не входят в публичный contract Badge: в компоненте используются только filled glyphs.
- Дополнительные overlay/motion/effect tokens не применяются: Badge остаётся статичным label-компонентом без popup, focus ring и state motion.

## Accessibility

- Цвет не должен быть единственным носителем смысла: текстовый Badge содержит понятную подпись.
- Icon-only требует `aria-label`.
- Декоративные иконки скрыты через `aria-hidden`.
- Badge не получает tab-stop и не эмулирует интерактивный control.

## Acceptance criteria

- [x] Figma set `2097:438` и 16 Surface×Tone вариантов сопоставлены с React API.
- [x] 18 Component/Badge variables импортированы в token source.
- [x] Text, L/R Icon и icon-only compositions реализованы одним компонентом.
- [x] Unit и Storybook interaction checks добавлены.
- [x] Visual QA при viewport 1440×900 и 390×844 подтверждён.
- [ ] Frontend Lead acceptance подтверждён.

## Storybook stories

- `components-badge--overview`
- `components-badge--playground`
- `components-badge--icon-only`
