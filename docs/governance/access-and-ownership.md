# Доступы и владение

## Принцип

Документация хранит **карту доступов**, но не сами пароли, токены, recovery codes и ключи. Сейчас секреты хранятся в личных Apple Passwords с префиксом `Cometal DS /`. Общая группа создаётся только после появления второго владельца. Это позволяет не раскрывать секреты в истории Git.

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
| GitHub | Organization `cometal-design`; private repo `cometal-design-system` | `dyuminvadim-stack`, Organization Owner; Company Owner будет добавлен позже | `Cometal DS / GitHub recovery` в Apple Passwords | Подключено |
| Vercel | Team/Project `cometal-design-system` | Infrastructure Owner + Company Owner | OAuth; recovery в Apple Passwords | Operational: public deployment is available |
| Storybook viewer | Public portal and `/storybook/` are available from the Vercel deployment | Design System Lead | `Cometal DS / Storybook viewer` в Apple Passwords | Operational/public |
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

## Текущее ограничение GitHub

На бесплатном тарифе GitHub branch protection недоступна для этого приватного репозитория. Репозиторий не переводим в public. До смены тарифа действует процессное правило: рабочие изменения идут через ветку и pull request; прямой push в `main` используется только при первоначальной настройке инфраструктуры.

Доступные настройки уже включены: удаление рабочей ветки после merge, squash/rebase merge; merge commits, Projects и Wiki отключены.

## Передача компании считается завершённой, когда

1. У компании есть собственный Owner в GitHub и Vercel.
2. Репозиторий и Vercel Project переданы в корпоративные Team/Organization.
3. Компания владеет доменом и платёжным профилем, если они используются.
4. Recovery-данные переданы из Apple Passwords в утверждённое корпоративное хранилище доступов.
5. Личные токены удалены или отозваны.
6. Сборка проходит после удаления личного доступа первоначального владельца.
