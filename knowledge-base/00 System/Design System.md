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

GitHub и Vercel не считаются отдельными источниками истины: GitHub размещает Git, а Vercel публикует документационный портал и Storybook.

## Портал дизайн-системы

Портал на Next.js является единой точкой входа в систему и собирает информацию из существующих источников истины. Он не становится шестым источником и не хранит отдельную ручную копию статусов компонентов.

- Корень сайта — документация, Foundation, Components, Patterns, Templates и Releases.
- `/storybook/` — технический Playground со states, Controls, accessibility и тестами.
- Components Overview строится из `registry/components.json`.
- Документационные страницы используют реальный пакет `@cometal/react`.

## Оформление системы

Мастер-источник брендовых ассетов для Storybook и документационных артбордов находится в Figma DS Core на странице `System`, компонент `Brand`.

- `Theme=light` и `Theme=dark` — версии логотипа для соответствующего фона.
- `Theme=favicon` — favicon портала и Storybook; SVG-копии хранятся в `apps/docs/public` и `apps/storybook/public`.
- `Core / cover` — визуальный источник social preview; PNG-копии хранятся рядом с публичными ассетами приложений.
- Изменение брендового ассета начинается в Figma и затем распространяется в Git, Storybook и этот контекст.

## Владелец

Design System Lead принимает финальные дизайн-решения и явно запускает распространение утверждённого Figma-компонента.

## Связанные процессы

- [[../05 Processes/Component Distribution]]
- [[../05 Processes/Mismatch Handling]]
- [[Access and Ownership]]
- [[../05 Processes/Plan 2026-07-23]]
