# Источники истины Cometal Design System

Статус: действует с 22 июля 2026 года. Владелец процесса — Design System Lead.

## Главное различие

У дизайн-системы пять **логических источников истины**. GitHub и Vercel — не дополнительные источники: это инфраструктура, на которой размещаются Git и Storybook.

| Источник | За что отвечает | Чего в нём не решаем |
|---|---|---|
| Figma DS Core | Внешний вид, композиция, варианты, визуальные состояния и прототипируемое поведение | React API, тесты, версии релизов |
| Git: спецификации и реестр | ID, статус, назначение, правила использования, связи, владельцы и согласованная спецификация компонента | Финальный визуал и живое поведение |
| Git: токены и React | Исполняемые токены, типы, props, события, accessibility и реализация поведения | Продуктовые правила и история дизайн-решений |
| Storybook | Живые состояния, документация реализации, interaction/a11y/visual-проверки и опубликованные релизы | Исходный дизайн и долгосрочный контекст |
| Obsidian | База знаний: контекст, паттерны, шаблоны, процессы, решения и связи между сущностями | Исполняемый код и секреты доступа |

## Текущие адреса

| Система | Адрес или расположение | Состояние |
|---|---|---|
| Figma DS Core | [DS Core](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs) | Подключено |
| Git repository | [cometal-design/cometal-design-system](https://github.com/cometal-design/cometal-design-system) | Подключено, private |
| Storybook | `http://localhost:6006`; Production URL в Vercel пока не создан | Работает локально |
| Obsidian Vault | `knowledge-base/` | Готов локально |

## Правило синхронизации

«Совпадает на 100%» не означает, что во всех пяти местах лежит одинаковый текст. Это означает, что связанные факты не противоречат друг другу:

- одинаковые ID и названия;
- одинаковые токены и значения;
- одинаковые варианты и пользовательские состояния;
- спецификация соответствует Figma и React API;
- Storybook показывает фактическую реализацию;
- Obsidian объясняет актуальные правила, решения и контекст;
- версия и статус одинаковы в реестре, релизе и документации.

Расхождение блокирует статус `Ready` до решения Design System Lead.

## Инфраструктура

- GitHub хранит удалённый Git-репозиторий, историю и релизы.
- Vercel собирает Storybook из Git и публикует Preview/Production deployments.
- Obsidian открывает папку `knowledge-base` как Vault; отдельная облачная учётная запись не обязательна.
- Apple Passwords хранит секреты и recovery-коды. В Git, Figma, Storybook и Obsidian пароли не записываются.

Машиночитаемая версия матрицы: `registry/sources.json`.

## Icons local candidate contract

For `COMETAL-ICONS-LIBRARY-2026-08-24`, the established local candidate connects the existing sources without creating a sixth source or 2,810 registry identities: Figma DS Core supplies visual and canonical-name identity; `packages/react/icons/source/manifest.source.json` and the tracked SVG corpus preserve the accepted source; `@cometal/react` supplies the implementation; Storybook `foundation--icons` and portal `/foundation/icons/catalog/` are candidate surfaces; Obsidian and `specifications/foundations/icons.md` preserve the written contract.

Its initial implementation/code parent is `e528f77d85ed14cdc2decfac3bc3e0996c8cd5da`; the exact current review candidate is owned by the external Orchestrator delivery manifest and is not hardcoded in this self-committing documentation change. The handoff fingerprint is `d4a210b39244ccf6a09489e28c1e82858ec3efc7921f50fe28c7b48dd6d64c0a`. This does not revise the production addresses above and is not `CODE_APPROVED`, `QA_PASSED`, release, or production evidence.
