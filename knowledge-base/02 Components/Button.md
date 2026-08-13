# Button

## Паспорт

- Stable ID: `action.button`
- Платформа: Web
- Статус: `in-review`
- Владелец решения: Design System Lead
- Техническое review: Frontend Lead
- Figma: [DS Core / Button](https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=835-3693)
- Спецификация: [[../../specifications/components/button]]
- Реализация: `packages/react/src/Button/`
- Storybook: https://cometal-design-system-storybook.vercel.app/storybook/?path=/story/components-button--overview

## Контекст

Button — первый эталон полного распространения компонента из утверждённого Figma DS Core в остальные источники истины. На нём проверяется шаблон будущих компонентов: стабильный ID → спецификация → React API → Stories и тесты → паспорт → review Frontend Lead → продуктовая проверка.

## Что принадлежит каждому источнику

- Figma: визуальная анатомия, 9 вариантов, 3 размера, композиции и эталонные состояния.
- Спецификация и реестр: смысл, границы, стабильный ID, статус и критерии готовности.
- React: нативная семантика, props, loading, disabled, события и focus behavior.
- Storybook: живые примеры, controls, код, матрица состояний и автоматические проверки.
- Obsidian: причины решений, правила использования, связи с паттернами и накопленный контекст.

## Принятые решения

- Состояния hover, pressed и focus не превращаются в React props.
- Вариант `link` остаётся button только для действий с визуалом ссылки; навигация будет отдельным Link.
- Icon-only поддержан из-за композиции в Figma, но требует `aria-label`.
- `type="button"` — безопасное значение по умолчанию.
- `loading` блокирует повторное действие, сохраняет ширину и доступное имя.
- Имена вариантов `Host` и `Inverse Host` в Figma исправлены на `Ghost` и `Inverse Ghost`, чтобы Figma, спецификация и API использовали один словарь.
- В spacing-токенах `Inset Icon` хранится отдельным соседним токеном: это исключает конфликт DTCG «токен одновременно является группой» и гарантирует экспорт отступов в CSS.
- Статус не поднимается до `beta`, пока Frontend Lead не подтвердит API и интеграцию.

## Следующие связи

- Button войдёт в action-группы, формы, модальные окна, таблицы и многошаговые бизнес-процессы.
- После появления отдельного Link и Icon Button границы Button нужно повторно проверить на продуктовых сценариях.
