export const tableFigmaSources = {
  sources: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2814-8351',
  cells: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9497',
  paginator: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10882',
  headers: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10891',
  mainComponents: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9824',
} as const;

export const tableCellStates = ['default', 'active', 'selected', 'editing', 'error', 'disabled'] as const;
export const tableFileTypes = ['word', 'excel', 'file', 'doc', 'sheets', 'adobe', 'zip', 'pdf', 'image'] as const;

export const tableDocumentationSections = [
  ['Обзор', 'Назначение и рабочая композиция.'],
  ['Архитектура', 'Нативная table-семантика и уровни композиции.'],
  ['Ячейки', 'Read, Edit, Selection, Index, Drag Handle, Summary и File Content.'],
  ['Хедеры', 'Названия колонок, Context Action и синхронный Filter Row.'],
  ['Колонки', 'Read, Edit и utility compositions без invalid column DOM.'],
  ['Пагинатор', 'Страницы, ellipsis, disabled/current и выбор размера страницы.'],
  ['Состояния', 'Default, Hover, Active, Selected, Editing, Error и Disabled.'],
  ['Размеры и плотность', 'Comfortable 48 и Compact 40 при постоянном Header 48.'],
  ['Поведение и доступность', 'Sorting, selection, filters, overlays и row reorder alternative.'],
  ['API и код', 'Минимальный React API поверх нативных HTML primitives.'],
  ['Playground', 'Интерактивный consumer-owned пример.'],
] as const;

export const tableSourceFamilies = [
  ['read-cell', 'Read Cell', 80, tableFigmaSources.cells],
  ['edit-cell', 'Edit Cell', 56, tableFigmaSources.cells],
  ['selection-cell', 'Selection Cell', 16, tableFigmaSources.cells],
  ['index-cell', 'Index Cell', 12, tableFigmaSources.cells],
  ['drag-handle-cell', 'Drag Handle Cell', 10, tableFigmaSources.cells],
  ['summary-cell', 'Summary Cell', 6, tableFigmaSources.cells],
  ['file-content', 'File Content', 1, tableFigmaSources.cells],
  ['column-header', 'Column Header', 6, tableFigmaSources.headers],
  ['context-action', 'Context Action', 3, tableFigmaSources.headers],
  ['selection-header', 'Selection Header', 18, tableFigmaSources.headers],
  ['filter-row', 'Filter Row', 10, tableFigmaSources.headers],
  ['read-column', 'Read Column', 8, tableFigmaSources.mainComponents],
  ['edit-column', 'Edit Column', 8, tableFigmaSources.mainComponents],
  ['utility-columns', 'Index / Selection / Drag columns', 24, tableFigmaSources.mainComponents],
  ['paginator-control', 'Paginator Control', 14, tableFigmaSources.paginator],
  ['paginator', 'Paginator', 1, tableFigmaSources.paginator],
] as const;
