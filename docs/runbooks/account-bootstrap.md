# Настройка аккаунтов и публикации

Этот runbook выполняется последовательно. Не перескакиваем к Vercel, пока GitHub-репозиторий не создан и не проверен.

## Этап 1. Apple Passwords

1. Открыть системное приложение Apple Passwords.
2. При создании GitHub и Vercel сохранять логины с префиксом `Cometal DS /` в названии.
3. Сохранять recovery-коды в соответствующих защищённых заметках записей.
4. Когда появится представитель компании, создать Shared Group `Cometal Design System` и перенести в неё нужные записи либо передать их в утверждённое компанией хранилище.

Секреты остаются в Apple Passwords и никогда не копируются в репозиторий, Obsidian или чат.

## Этап 2. GitHub

1. Войти в существующий GitHub либо создать временный аккаунт на рабочий email.
2. Предпочтительный вариант — Organization `cometal-design`; допустимый временный вариант — личный namespace с последующим Transfer.
3. Создать приватный repository `cometal-design-system`.
4. Подключить локальный `main` и push всей истории.
5. Запретить force push в `main`; изменения вносить через ветки и pull requests.
6. Добавить будущего Company Owner до передачи системы.

## Этап 3. Vercel

1. Войти в Vercel через GitHub OAuth.
2. Импортировать repository `cometal-design-system`.
3. Настроить:
   - Install command: `pnpm install --frozen-lockfile`
   - Build command: `pnpm build:storybook`
   - Output directory: `apps/storybook/storybook-static`
   - Production branch: `main`
4. Проверить Preview deployment из отдельной ветки.
5. Проверить Production deployment после merge в `main`.
6. Настроить защиту просмотра. Встроенный общий пароль требует поддерживаемого тарифа Vercel; иначе выбирается отдельный слой авторизации.

## Этап 4. Obsidian

1. Открыть Obsidian → Open folder as vault.
2. Выбрать папку `cometal-design-system/knowledge-base`.
3. Назвать Vault `Cometal Design System`.
4. Не включать сторонние плагины без отдельного решения.
5. Синхронизация базы идёт через Git вместе с системой. Obsidian Sync не нужен для первого запуска.

## Этап 5. Контрольная проверка

- новый компьютер может клонировать repo, выполнить `pnpm install && pnpm validate` и открыть Vault;
- Preview создаётся из рабочей ветки;
- Production обновляется только из `main`;
- ни один секрет не найден в Git;
- все ссылки и владельцы обновлены в реестре доступов.
