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
| Storybook | `http://localhost:6006`; public portal `https://cometal-design-system-storybook.vercel.app/`; public Storybook `https://cometal-design-system-storybook.vercel.app/storybook/` | Public production baseline: `0551bb03662397087480a8ae66916b170402f18b`, Storybook index has 59 entries; this is separate from the M4–M8 delivery candidate. |
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

Its normalized implementation parent is `bb500bd2daf5921dd2f7c6a3a8a1d497a1c2b844`; the exact current review candidate is owned by the external Orchestrator delivery manifest and is not hardcoded in this self-committing documentation change. The normalized corpus fingerprint is `87caaa283983e042491e2b0beb6bb8cc54a8aeaad75b1b9599e66d06c2199a58` and its Outline fingerprint is `4143ba6593eb6f852c091552d83264ae73f1609a1d7679b4734eddd8c7a724ed`. This does not revise the production addresses above and is not `CODE_APPROVED`, `QA_PASSED`, release, or production evidence.
