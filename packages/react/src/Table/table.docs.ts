export const tableFigmaSources = {
  sources: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2814-8351',
  cells: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9497',
  paginator: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10882',
  headers: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10891',
  mainComponents: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-9824',
  review: 'https://www.figma.com/design/KKNGucImxFAtQLBhPy8tLs?node-id=2353-10833',
} as const;

export const tableDocumentationSections = [
  { id: 'overview', label: 'Обзор', description: 'Назначение и рабочая композиция.' },
  { id: 'architecture', label: 'Архитектура', description: 'Нативная table-семантика и уровни композиции.' },
  { id: 'cells', label: 'Ячейки', description: 'Read, Edit, Selection, Index, Drag Handle, Summary и File Content.' },
  { id: 'headers', label: 'Хедеры', description: 'Названия колонок, Context Action и синхронный Filter Row.' },
  { id: 'columns', label: 'Колонки', description: 'Read, Edit и utility compositions без invalid column DOM.' },
  { id: 'paginator', label: 'Пагинатор', description: 'Страницы, ellipsis, disabled/current и выбор размера страницы.' },
  { id: 'states', label: 'Состояния', description: 'Default, Hover, Active, Selected, Editing, Error и Disabled.' },
  { id: 'density', label: 'Размеры и плотность', description: 'Comfortable 48 и Compact 40 при постоянном Header 48.' },
  { id: 'behavior', label: 'Поведение и доступность', description: 'Sorting, selection, edit entry, filters, overlays и row reorder alternative.' },
  { id: 'api', label: 'API и код', description: 'Минимальный React API поверх нативных HTML primitives.' },
  { id: 'playground', label: 'Playground', description: 'Интерактивный consumer-owned пример.' },
] as const;

export const tableSourceFamilies = [
  { id: 'read-cell', label: 'Read Cell', variants: 80, source: tableFigmaSources.cells },
  { id: 'edit-cell', label: 'Edit Cell', variants: 56, source: tableFigmaSources.cells },
  { id: 'selection-cell', label: 'Selection Cell', variants: 16, source: tableFigmaSources.cells },
  { id: 'index-cell', label: 'Index Cell', variants: 12, source: tableFigmaSources.cells },
  { id: 'drag-handle-cell', label: 'Drag Handle Cell', variants: 10, source: tableFigmaSources.cells },
  { id: 'summary-cell', label: 'Summary Cell', variants: 6, source: tableFigmaSources.cells },
  { id: 'column-header', label: 'Column Header', variants: 6, source: tableFigmaSources.headers },
  { id: 'context-action', label: 'Context Action', variants: 3, source: tableFigmaSources.headers },
  { id: 'selection-header', label: 'Selection Header', variants: 18, source: tableFigmaSources.headers },
  { id: 'filter-row', label: 'Filter Row', variants: 10, source: tableFigmaSources.headers },
  { id: 'read-column', label: 'Read Column', variants: 8, source: tableFigmaSources.mainComponents },
  { id: 'edit-column', label: 'Edit Column', variants: 8, source: tableFigmaSources.mainComponents },
  { id: 'index-column', label: 'Index Column', variants: 8, source: tableFigmaSources.mainComponents },
  { id: 'selection-column', label: 'Selection Column', variants: 8, source: tableFigmaSources.mainComponents },
  { id: 'drag-handle-column', label: 'Drag Handle Column', variants: 8, source: tableFigmaSources.mainComponents },
  { id: 'paginator-control', label: 'Paginator Control', variants: 14, source: tableFigmaSources.paginator },
] as const;

export const tableStandaloneSources = [
  { id: 'file-content', label: 'File Content', source: tableFigmaSources.cells },
  { id: 'drag-handle-icon', label: 'Drag Handle Icon', source: tableFigmaSources.cells },
  { id: 'paginator', label: 'Paginator', source: tableFigmaSources.paginator },
  { id: 'index-header', label: 'Index Header', source: tableFigmaSources.headers },
  { id: 'drag-handle-header', label: 'Drag Handle Header', source: tableFigmaSources.headers },
] as const;

export type TableDocumentationSectionId = (typeof tableDocumentationSections)[number]['id'];
