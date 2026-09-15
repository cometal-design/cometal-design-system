import type { SelectOption } from '@cometal/react';

// One association per public field. Lifecycle and source URLs remain registry-owned.
export const fieldDocumentation = {
  'text-field': {
    route: '/components/text-field/',
    stableId: 'input.text-field',
    reactExport: 'TextField',
    title: 'Text Field',
    summary: 'Однострочное поле для короткого текста: названия, номера или реквизита.',
    label: 'Название документа',
    initialValue: 'Договор поставки',
    placeholder: 'Введите название',
    use: 'Введите короткое значение, которое пользователь знает заранее.',
    avoid: 'Для длинного комментария используйте Text Area; для фиксированного списка — Select.',
    anatomy: 'Нативный input, видимая подпись, необязательные иконки и строка подсказки или ошибки.',
    keyboard:
      'Tab переводит фокус в input. Ввод, выделение, удаление и перемещение курсора работают по правилам браузера.',
    semantics:
      'Label связан с input. Helper и ошибка доступны через aria-describedby; ошибка задаёт aria-invalid. Native name, required и autocomplete сохраняются.',
    edge: 'Пустое значение допустимо, пока приложение не требует заполнения. Длинная строка прокручивается внутри input; mode="read" выводит текст без поля и tab-stop.',
    apg: 'https://www.w3.org/WAI/tutorials/forms/labels/',
  },
  'text-area': {
    route: '/components/text-area/',
    stableId: 'input.text-area',
    reactExport: 'TextArea',
    title: 'Text Area',
    summary: 'Многострочное поле для комментария, описания или условий поставки.',
    label: 'Комментарий',
    initialValue: 'Доставка в рабочие дни.',
    placeholder: 'Добавьте подробности',
    use: 'Соберите текст, которому нужны переносы строк и несколько предложений.',
    avoid: 'Не используйте для одной даты, выбора из списка или короткого реквизита.',
    anatomy: 'Нативный textarea, label, supporting-строка и необязательный счётчик длины.',
    keyboard:
      'Enter добавляет перенос строки. Tab выходит из textarea; выделение и редактирование остаются нативными.',
    semantics:
      'Label связан с textarea; helper, ошибка и счётчик программно связаны с полем. maxLength ограничивает ввод нативно.',
    edge: 'Счётчик showCounter требует maxLength и обновляемое value. rows задаёт число строк; showScrollbar — визуальный индикатор, а не отдельный механизм прокрутки.',
    apg: 'https://www.w3.org/WAI/tutorials/forms/instructions/',
  },
  select: {
    route: '/components/select/',
    stableId: 'input.select',
    reactExport: 'Select',
    title: 'Select',
    summary: 'Выбор одного значения из заранее известного списка.',
    label: 'Статус документа',
    initialValue: 'draft',
    placeholder: 'Выберите статус',
    use: 'Покажите короткий набор взаимоисключающих вариантов.',
    avoid: 'Для поиска по названию используйте Combobox, для нескольких значений — Multi Select.',
    anatomy: 'Подписанный trigger, chevron, список options и скрытый native select для отправки формы.',
    keyboard:
      'Enter, Space или ArrowDown открывают список. Стрелки меняют active option, Enter выбирает, Escape закрывает. Disabled options пропускаются.',
    semantics:
      'Trigger имеет role="combobox", aria-expanded и связь с listbox. aria-activedescendant сообщает active option. Скрытый select не создаёт второй tab-stop.',
    edge: 'Placeholder не является вариантом. Выбранное value должно соответствовать options. Длинный список прокручивается внутри; pointer-открытие не предвыбирает active option.',
    apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
  },
  combobox: {
    route: '/components/combobox/',
    stableId: 'input.combobox',
    reactExport: 'Combobox',
    title: 'Combobox',
    summary: 'Поиск по тексту и выбор одного результата из списка.',
    label: 'Контрагент',
    initialValue: '',
    placeholder: 'Введите название',
    use: 'Помогите найти значение в наборе известных контрагентов или других сущностей.',
    avoid:
      'Не используйте как простой Select: один только фокус не открывает результаты. Для свободного текста без выбора нужен Text Field.',
    anatomy: 'Поисковый input с иконкой, очищение заполненного запроса и список результатов.',
    keyboard:
      'Введите непустой запрос. ArrowUp/ArrowDown перемещают active option среди совпадений, Enter выбирает, Escape закрывает результаты.',
    semantics:
      'Input имеет role="combobox", aria-autocomplete="list" и aria-controls. Label называет поле; clear action имеет своё имя. onOptionSelect возвращает value варианта, а текст input хранит label.',
    edge: 'Пустой запрос или отсутствие совпадений не открывает listbox. Controlled consumer синхронизирует текст при выборе и очищении; clearable=false убирает кнопку очистки.',
    apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
  },
  'multi-select': {
    route: '/components/multi-select/',
    stableId: 'input.multi-select',
    reactExport: 'MultiSelect',
    title: 'Multi Select',
    summary: 'Выбор нескольких значений с возможностью удалить каждое отдельно.',
    label: 'Контрагенты',
    initialValue: '',
    placeholder: 'Выберите контрагентов',
    use: 'Соберите несколько независимых значений из известного набора.',
    avoid:
      'Для единственного значения используйте Select. Не подменяйте поле набором декоративных tags без выбора.',
    anatomy:
      'Trigger с tags, кнопки удаления, счётчик непоместившихся значений, chevron и multi-select listbox.',
    keyboard:
      'ArrowDown раскрывает список. Стрелки перемещают active option, Enter переключает значение; Escape закрывает. Кнопки удаления доступны клавишей Tab.',
    semantics:
      'Listbox имеет aria-multiselectable, options — aria-selected. Каждое удаление названо «Удалить {label}». selectedValues/onSelectedValuesChange управляют значениями.',
    edge: 'Счётчик +N появляется по реальному переполнению tags. В read выводится полный список. Native form serialization не предоставляется: приложение отправляет selectedValues самостоятельно.',
    apg: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
  },
} as const;

export type FieldSlug = keyof typeof fieldDocumentation;
export const fieldSlugs = Object.keys(fieldDocumentation) as FieldSlug[];
export const fieldStatusOptions: SelectOption[] = [
  { value: 'draft', label: 'Черновик' },
  { value: 'active', label: 'Согласован' },
  { value: 'archived', label: 'Архив', disabled: true },
];
export const fieldCompanyOptions: SelectOption[] = [
  { value: 'north', label: 'Северсталь' },
  { value: 'nlmk', label: 'НЛМК' },
  { value: 'mmk', label: 'ММК' },
  { value: 'evraz', label: 'ЕВРАЗ' },
  { value: 'tmk', label: 'ТМК' },
  { value: 'archive', label: 'Архивный контрагент', disabled: true },
];
