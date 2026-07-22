# Доступы и владение

## Принцип

Документация хранит **карту доступов**, но не сами пароли, токены, recovery codes и ключи. Сейчас секреты хранятся в Apple Passwords в группе `Cometal Design System`. Это позволяет не раскрывать секреты в истории Git.

## Роли

| Роль | Кто сейчас | Полномочия |
|---|---|---|
| Design System Lead | Вадим | Финальные дизайн-решения, статусы и запуск синхронизации |
| Infrastructure Owner | Вадим, временно | GitHub/Vercel/домен до передачи компании |
| Frontend Lead | Не назначен | Ревью React API и совместимости с продуктом |
| Company Owner | Не назначен | Второй владелец аккаунтов и будущий получатель системы |

## Реестр аккаунтов

| Сервис | Предлагаемое имя | Административный владелец | Где лежит секрет | Статус |
|---|---|---|---|---|
| GitHub | организация `cometal-design` или временный личный namespace; repo `cometal-design-system` | Infrastructure Owner + Company Owner | `Cometal DS / GitHub recovery` в Apple Passwords | Не настроено |
| Vercel | Team/Project `cometal-design-system` | Infrastructure Owner + Company Owner | OAuth; recovery в Apple Passwords | Не настроено |
| Storybook viewer | Production URL и пароль определяются при деплое | Design System Lead | `Cometal DS / Storybook viewer` в Apple Passwords | Не настроено |
| Obsidian | Vault `Cometal Design System` → папка `knowledge-base` | Git-доступ определяет доступ к базе | Отдельного секрета нет; Obsidian Sync — только если будет выбран | Локально готово |
| Figma | DS Core `KKNGucImxFAtQLBhPy8tLs` | Design System Lead | Вход управляется Figma | Подключено |

## Что должно храниться в Apple Passwords

- recovery codes и резервные методы входа;
- сервисные токены, если они появятся;
- пароль просмотра Storybook;
- сведения о корпоративном email-владельце;
- дата последней проверки доступа;
- инструкция аварийного восстановления.

## Что запрещено коммитить

- пароли и общие логины;
- Personal Access Tokens;
- `.env` и `.env.local`;
- Vercel tokens;
- GitHub recovery codes;
- SSH private keys;
- cookies и экспортированные browser sessions.

## Передача компании считается завершённой, когда

1. У компании есть собственный Owner в GitHub и Vercel.
2. Репозиторий и Vercel Project переданы в корпоративные Team/Organization.
3. Компания владеет доменом и платёжным профилем, если они используются.
4. Recovery-данные переданы из Apple Passwords в утверждённое корпоративное хранилище доступов.
5. Личные токены удалены или отозваны.
6. Сборка проходит после удаления личного доступа первоначального владельца.
