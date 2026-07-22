# Cometal Design System

## Назначение

Единая система проектирования и реализации интерфейса SaaS-продукта Cometal для управления бизнес-процессами закупки.

## Слои

Foundation → Components → Patterns → Templates → Business Processes → Screens.

## Источники истины

1. Figma DS Core — визуальная модель.
2. Git specifications and registry — правила, ID и статусы.
3. Git tokens and React — исполняемая реализация.
4. Storybook — состояния, документация и проверки реализации.
5. Obsidian — контекст, решения, паттерны, шаблоны и связи.

Источники дополняют друг друга. Компонент не может получить `Ready`, если связанные данные расходятся.

GitHub и Vercel не считаются отдельными источниками истины: GitHub размещает Git, а Vercel публикует Storybook.

## Оформление системы

Мастер-источник брендовых ассетов для Storybook и документационных артбордов находится в Figma DS Core на странице `System`, компонент `Brand`.

- `Theme=light` и `Theme=dark` — версии логотипа для соответствующего фона.
- `Theme=favicon` — favicon Storybook; SVG-копия хранится в `apps/storybook/public/cometal-favicon.svg`.
- Изменение брендового ассета начинается в Figma и затем распространяется в Git, Storybook и этот контекст.

## Владелец

Design System Lead принимает финальные дизайн-решения и явно запускает распространение утверждённого Figma-компонента.

## Связанные процессы

- [[../05 Processes/Component Distribution]]
- [[../05 Processes/Mismatch Handling]]
- [[Access and Ownership]]
- [[../05 Processes/Plan 2026-07-23]]
