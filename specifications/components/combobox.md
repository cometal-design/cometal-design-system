---
id: input.combobox
name: Combobox
status: in-review
platform: web
framework: react
figma: "https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=1104-661"
---

# Combobox

## Назначение

Поиск и выбор одного значения. Поле управляет запросом; результаты и keyboard-navigation списка принадлежат отдельному Listbox pattern.

## Contract

- Нативный input получает `role="combobox"`, `aria-expanded` и связь с listbox.
- Размеры: `l` и `m`; режимы: `edit` и `read`.
- Search icon является частью композиции, но декоративен для screen reader.

## Accessibility

- Интегратор передаёт `aria-controls`, `aria-activedescendant` и фактическое состояние раскрытия.
- Label, helper и error программно связаны с input.

## Acceptance criteria

- [x] Визуальная модель и состояния считаны из DS Core.
- [ ] React API, stories и browser-проверки реализованы.
- [ ] Полный Listbox pattern описан отдельно.
