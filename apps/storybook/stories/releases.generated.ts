// Generated from Figma DS Core, page "Releases" (node 902:904).
// Update this snapshot whenever the release artboard changes.

export const releasesSource = {
  label: 'Figma DS Core · Releases',
  url: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs/DS-Core?node-id=902-904',
  syncedAt: '13 августа 2026',
} as const;

export type ReleaseSection = { title: string; changes: string[] };
export type DesignSystemRelease = {
  version: string;
  title: string;
  description: string;
  status: string;
  sections: ReleaseSection[];
};

export const releases: DesignSystemRelease[] = [
  {
    version: 'v0.3.0',
    title: 'Table + Widget Candidate Synchronization',
    description: '27 августа 2026 · Синхронизация источников Table + Widget с exact candidate a3b1b354f0a94e6951904db8e6b2e19b6549a939. Статус: candidate; production publication pending.',
    status: 'Кандидат',
    sections: [
      { title: 'Foundation Sync', changes: [
        'Зафиксирован контракт из 627 Variables: 402 Primitive, 155 Semantic и 70 Component.',
        'Удалены 9 неиспользуемых deprecated Variables после проверки consumers.',
        'Проверены aliases, scopes, WEB syntax, descriptions и mode values; ошибок не осталось.',
        'DTCG token sources обновлены по фактическому состоянию Figma.',
      ] },
      { title: 'Badge', changes: [
        'Добавлен публичный компонент Badge с поверхностями Light и Dark.',
        'Поддержаны 8 тонов, текст, L Icon, R Icon и icon-only 24 × 24.',
        'Геометрия, цвета и контраст связаны с Cometal Variables.',
        'Компонент добавлен в React, Storybook, registry, specifications и Obsidian.',
      ] },
      { title: 'Component Match', changes: [
        'Синхронизированы canonical sources Table, Widget, Tooltip и Context Menu.',
        'Синхронизирована композиция паттерна Widget + Table.',
        'Table Read/Edit, плотности 48/40, фильтры, resize, pinning, pagination и summary синхронизированы как candidate.',
        'Exact candidate SHA a3b1b354f0a94e6951904db8e6b2e19b6549a939; запись относится только к delivery_candidate и не является production evidence.',
      ] },
      { title: 'Candidate delivery', changes: [
        'Exact candidate SHA: a3b1b354f0a94e6951904db8e6b2e19b6549a939.',
        'Production publication pending; публичные поверхности не являются evidence для этого candidate.',
        'Эта release entry не заявляет CODE_APPROVED или QA_PASSED.',
        'Deploy ID и production verification отложены до отдельного release и smoke.',
      ] },
      { title: 'Deferred', changes: [
        'Icons заблокированы до утверждения canonical SVG source и React API.',
        'Tabs остаётся Figma draft до утверждения slot/count-контракта.',
        'Table + Widget больше не отложены: canonical sources синхронизированы с exact candidate.',
        'npm packages остаются private 0.0.0 до отдельного решения о versioning и registry.',
        'Компоненты остаются in-review до Frontend Lead review и продуктового пилота.',
      ] },
    ],
  },
  {
    version: 'v0.2.0',
    title: 'Selection Controls & Grid System',
    description: '21 июля 2026 · Подготовлено обновление библиотеки к публикации 22 июля 2026. Статус: готово к публикации.',
    status: 'Опубликован',
    sections: [
      { title: 'Checkbox', changes: [
        'Добавлен публичный компонент Checkbox.',
        'Поддержаны базовые состояния выбора, disabled и focus visible.',
        'Контрол выровнен по первой строке лейбла и не смещается при многострочном описании.',
        'Цвета, типографика, размеры и радиусы связаны с Cometal Variables и Styles.',
      ] },
      { title: 'Radio Button', changes: [
        'Добавлен публичный компонент Radio Button.',
        'Поддержаны состояния выбора, disabled и focus visible.',
        'Контрол оптически выровнен по первой строке лейбла.',
        'Визуальные роли связаны с семантическими токенами Cometal.',
      ] },
      { title: 'Switch', changes: [
        'Добавлен публичный компонент Switch.',
        'Поддержаны состояния On/Off, disabled и focus visible.',
        'Переключатель выровнен по первой строке лейбла независимо от длины описания.',
        'Цвета, типографика и размеры используют токены Cometal.',
      ] },
      { title: 'Tabs', changes: [
        'Подготовлен Figma draft компонента Tabs.',
        'Зафиксированы базовые интерактивные состояния и focus visible.',
        'Публичный React API и Storybook пока заблокированы до утверждения slot/count-контракта.',
        'До утверждения компонент не входит в публикуемый registry.',
      ] },
      { title: 'Grid System', changes: [
        'Добавлен документационный артборд Grid System.',
        'Зафиксированы пресеты Desktop 1440/1280, Tablet 1024 и Mobile 428.',
        'Добавлены адаптивные примеры на 12, 8, 6, 4, 3 и 2 колонки.',
        'Создан компонент Documentation/Grid Annotation: 56 вариантов Filled/Measure × Horizontal/Vertical × 14 размеров.',
        'Размеры и цвета аннотаций связаны с Cometal Variables.',
      ] },
    ],
  },
  {
    version: 'v0.1.0',
    title: 'Foundation, Buttons & Fields',
    description: '21 июля 2026 · Первый публичный выпуск Figma Library для пилотного использования дизайнерами. Статус: Beta.',
    status: 'Опубликован',
    sections: [
      { title: 'Typography', changes: [
        'Построена полная типографическая система для UI и контента.',
        'Категории: Display, Headings, Controls, Body, Caption & Label.',
        'Реализовано 18 Text Styles: 3 Display, 4 Headings, 3 Controls, 6 Body и 2 Caption & Label.',
        'Для каждого стиля зафиксированы размер, line-height, letter-spacing и weight.',
        'Подготовлены примеры на английском и русском для каждого стиля.',
        'Все стили имеют WEB syntax и описание роли; Controls используют Regular weight.',
      ] },
      { title: 'Primitive Colors', changes: [
        'Построена примитивная цветовая палитра для всей системы.',
        '8 цветовых семейств: Neutral, Blue, Cyan, Green, Yellow, Red, Violet, Purple.',
        'В каждом семействе 9 ступеней яркости (100–900) × 5 уровней прозрачности (100/80/64/40/24).',
        'Итого 364 переменные в примитивном цветовом слое.',
        'В Semantic создано 37 цветовых токенов; значения связаны с Primitive через aliases.',
      ] },
      { title: 'Spacing', changes: [
        'Построена шкала отступов с примитивным и семантическим слоем.',
        'Примитивный слой: 17 переменных шкалы Spacing.',
        'Семантический слой: 26 токенов для Button, Input, Stack, Section и Documentation.',
        'Для Documentation выделено 7 семантических токенов: inset, gaps и Header → Content.',
        'Все публикуемые переменные имеют WEB syntax и описание назначения.',
      ] },
      { title: 'Radius', changes: [
        'Построена шкала скруглений с примитивным и семантическим слоем.',
        'Примитивный слой: 4 переменные Radius.',
        'Семантический слой: Button, Input, Focus и Documentation/Header.',
        'Радиусы Button и Fields привязаны к Semantic Variables.',
        'Всего 4 переменные в семантическом слое Radius.',
      ] },
      { title: 'Icons', changes: [
        'Собрана библиотека иконок в трёх независимых наборах.',
        'Outline — 875 иконок, 20 категорий.',
        'Filled — 877 иконок, все компоненты 24 × 24 px.',
        'Feature & Logo — 1058 иконок: платёжные системы, флаги, соцсети, технологии.',
        'Компоненты разделены namespace: Outline/, Filled/ и Feature/; повторяющихся полных имён нет.',
      ] },
      { title: 'Documentation', changes: [
        'Определена единая структура документационных страниц Foundation.',
        'Каждая страница строится по одной модели: Header → Content → секции.',
        'Зафиксирован Documentation Layout Standard — обязательные и специфичные элементы оформления.',
        'Стандартные роли оболочки Documentation используют только Cometal Variables; локальные значения запрещены.',
      ] },
      { title: 'Documentation Components', changes: [
        'Собрана библиотека служебных компонентов для сборки документации.',
        '6 компонентов: Header, Section Header L, Section Header M, Metric Columns, Color Sample, Brand/Logotype.',
        'Публичные свойства, цвета, типографика и стандартные layout-роли связаны с Cometal styles и variables.',
        'Компоненты предназначены исключительно для документации — не входят в продуктовую библиотеку.',
      ] },
      { title: 'Foundation Architecture', changes: [
        'Зафиксирован общий принцип: Primitive → Semantic → Component, с самостоятельным темпом стабилизации для каждой категории.',
        'Color, Spacing и Radius нормализованы на Primitive/Semantic; Component-коллекции содержат только локальные роли.',
        'В файле 536 variables; расширения Foundation фиксируются в Releases.',
      ] },
      { title: 'Buttons', changes: [
        'Собрана продуктовая библиотека кнопок в девяти стилистиках.',
        'Стили: Primary, Secondary, Ghost, Link, Danger, Success, Warning, Inverse, Inverse Ghost.',
        'Размеры: L, M и S; State: Default, Hover, Pressed, Disabled, Loading; Focus visible — отдельный Boolean.',
        'Композиции: Text, L Icon, R Icon, Icon Only.',
        'Реализовано 135 публичных вариантов кнопок и 12 вариантов Sources/Button Content.',
      ] },
      { title: 'Fields', changes: [
        'Публичные sets: Text Field, Text Area, Select, Combobox и Multi Select.',
        'Mode: Edit и Read; размеры L и M; Edit-состояния: Default, Hover, Filled, Error, Disabled и Active для раскрываемых полей.',
        'Публичная оболочка сохраняет компактный API; размеры, состояния и служебные части передаются из Sources.',
        'Focus visible реализован отдельным Boolean и не меняет геометрию компонента.',
        'Внутренние части отделены в namespace Sources и не предназначены для прямого использования в продуктовых макетах.',
      ] },
    ],
  },
];
