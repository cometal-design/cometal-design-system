export const tableFigmaSources = {
  sources: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2814-8351',
  cells: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9497',
  selectionCell: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9766',
  contextAction: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2482-5611',
  dragHandle: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2778-8288',
  paginator: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10882',
  headers: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10891',
  mainComponents: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9824',
} as const;

export const tableCellStates = ['default', 'hover', 'active', 'selected', 'editing', 'error', 'dragging', 'disabled'] as const;
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
  ['selection-cell', 'Selection Cell', 16, tableFigmaSources.selectionCell],
  ['index-cell', 'Index Cell', 12, tableFigmaSources.cells],
  ['drag-handle-cell', 'Drag Handle Cell', 10, tableFigmaSources.cells],
  ['summary-cell', 'Summary Cell', 6, tableFigmaSources.cells],
  ['column-header', 'Column Header', 6, tableFigmaSources.headers],
  ['context-action', 'Context Action', 3, tableFigmaSources.contextAction],
  ['selection-header', 'Selection Header', 18, tableFigmaSources.headers],
  ['filter-row', 'Filter Row', 10, tableFigmaSources.headers],
  ['read-column', 'Read Column', 8, tableFigmaSources.mainComponents],
  ['edit-column', 'Edit Column', 8, tableFigmaSources.mainComponents],
  ['index-column', 'Index Column', 8, tableFigmaSources.mainComponents],
  ['selection-column', 'Selection Column', 8, tableFigmaSources.mainComponents],
  ['drag-handle-column', 'Drag Handle Column', 8, tableFigmaSources.mainComponents],
  ['paginator-control', 'Paginator Control', 14, tableFigmaSources.paginator],
] as const;

export const tableStandaloneSources = [
  ['file-content', 'File Content', tableFigmaSources.cells],
  ['drag-handle-icon', 'Drag Handle Icon', tableFigmaSources.dragHandle],
  ['paginator', 'Paginator', tableFigmaSources.paginator],
  ['index-header', 'Index Header', tableFigmaSources.headers],
  ['drag-handle-header', 'Drag Handle Header', tableFigmaSources.headers],
] as const;

export const tablePrimitiveGeometry = [
  ['Context Action', '24×24 hit area · 16×16 Filled/general/dot-horizontal-filled · Default, Hover, Open и focus', tableFigmaSources.contextAction],
  ['Selection Cell', '48×48 Comfortable · 40×40 Compact · Checkbox L 20×20 по центру обеих осей', tableFigmaSources.selectionCell],
  ['Drag Handle', '24×24 · две линии по 12px на y=9 и y=15 · stroke 1.4 с round caps', tableFigmaSources.dragHandle],
  ['Paginator', '40×40 controls · Outline arrows 24×24 · gap 4 · current/disabled/ellipsis', tableFigmaSources.paginator],
] as const;
