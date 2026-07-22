(() => {
  const scope = document.currentScript?.dataset.scope ?? 'manager';
  const viewMode = new URLSearchParams(window.location.search).get('viewMode');

  // Preview pages contain real product UI. Translate only Storybook's Docs chrome,
  // never the component Canvas where copy must remain an exact product example.
  if (scope === 'preview' && viewMode !== 'docs') return;

  const managerTranslations = {
    'Find components': 'Найти компоненты',
    'No components found': 'Компоненты не найдены',
    'Find components by name or path.': 'Ищите компоненты по названию или пути.',
    'Collapse all': 'Свернуть всё',
    'Expand all': 'Развернуть всё',
    'Search': 'Поиск',
    'Shortcuts': 'Горячие клавиши',
    'Storybook shortcuts': 'Горячие клавиши Storybook',
    'Previous component': 'Предыдущий компонент',
    'Next component': 'Следующий компонент',
    'Previous story': 'Предыдущее состояние',
    'Next story': 'Следующее состояние',
    'Show addons': 'Показать панели',
    'Hide addons': 'Скрыть панели',
    'Toggle addons': 'Переключить панели',
    'Enter fullscreen': 'На весь экран',
    'Exit fullscreen': 'Выйти из полноэкранного режима',
    'Open canvas in new tab': 'Открыть пример в новой вкладке',
    'Copy link': 'Копировать ссылку',
    'Copy story link': 'Копировать ссылку на состояние',
    'Skip to canvas': 'Перейти к примеру',
    'Settings': 'Настройки',
    'About': 'О Storybook',
    'What\'s new': 'Что нового',
    'Canvas': 'Пример',
    'Docs': 'Документация',
    'Controls': 'Параметры',
    'Actions': 'Действия',
    'Accessibility': 'Доступность',
    'Interactions': 'Взаимодействия',
    'Test Results': 'Результаты тестов',
    'Outline': 'Контуры',
    'Measure': 'Измерения',
    'Backgrounds': 'Фон',
    'Viewport': 'Размер экрана',
    'Grid': 'Сетка',
  };

  const docsTranslations = {
    'Show code': 'Показать код',
    'Hide code': 'Скрыть код',
    'Copy code': 'Копировать код',
    'Copied': 'Скопировано',
    'Stories': 'Примеры',
    'Primary': 'Основной пример',
    'Controls': 'Параметры',
    'Description': 'Описание',
    'Default': 'По умолчанию',
    'Name': 'Название',
    'Type': 'Тип',
    'Required': 'Обязательно',
    'No controls found': 'Параметры не найдены',
    'Click to copy': 'Нажмите, чтобы скопировать',
    'Open canvas in new tab': 'Открыть пример в новой вкладке',
    'Zoom in': 'Увеличить',
    'Zoom out': 'Уменьшить',
    'Reset zoom': 'Сбросить масштаб',
  };

  const translations = scope === 'preview' ? docsTranslations : managerTranslations;
  const attributes = ['aria-label', 'placeholder', 'title'];

  function translated(value) {
    const key = value.trim();
    const replacement = translations[key];
    if (!replacement) return value;
    const start = value.indexOf(key);
    return `${value.slice(0, start)}${replacement}${value.slice(start + key.length)}`;
  }

  function translateElement(element) {
    for (const attribute of attributes) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const nextValue = translated(value);
      if (nextValue !== value) element.setAttribute(attribute, nextValue);
    }
  }

  function translateTree(root) {
    if (root.nodeType === Node.TEXT_NODE) {
      const nextValue = translated(root.nodeValue ?? '');
      if (nextValue !== root.nodeValue) root.nodeValue = nextValue;
      return;
    }

    if (!(root instanceof Element)) return;
    translateElement(root);

    const elements = root.querySelectorAll('*');
    for (const element of elements) translateElement(element);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode();
    while (textNode) {
      const nextValue = translated(textNode.nodeValue ?? '');
      if (nextValue !== textNode.nodeValue) textNode.nodeValue = nextValue;
      textNode = walker.nextNode();
    }
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateTree(mutation.target);
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        translateElement(mutation.target);
      }
      for (const node of mutation.addedNodes) translateTree(node);
    }
  });

  translateTree(document.documentElement);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: attributes,
  });
})();
