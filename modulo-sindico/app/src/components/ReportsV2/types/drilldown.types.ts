// ============================================
// DRILL-DOWN TYPES - Tipos para Drill-Down de Dados
// ============================================

/**
 * Grupo de colunas no seletor
 */
export type ColumnGroupType = 'suggested' | 'standard' | 'timestamp' | 'custom';

/**
 * Tipo de dado da coluna
 */
export type ColumnDataType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'link'
  | 'badge'
  | 'avatar';

/**
 * Definição de uma coluna
 */
export interface DrillDownColumn {
  id: string;
  field: string;                    // Campo no objeto de dados
  label: string;                    // Label de exibição
  type: ColumnDataType;
  group: ColumnGroupType;
  sortable?: boolean;
  width?: number | string;          // Largura da coluna
  render?: (value: any, row: any) => React.ReactNode;  // Renderização customizada
}

/**
 * Grupo de colunas
 */
export interface ColumnGroup {
  id: ColumnGroupType;
  label: string;
  columns: DrillDownColumn[];
  icon?: string;                    // Ícone do grupo
  collapsed?: boolean;              // Se está colapsado no seletor
}

/**
 * Linha de dados
 */
export interface DrillDownRow {
  id: string;
  [key: string]: any;               // Dados dinâmicos baseados nas colunas
}

/**
 * Dados completos do drill-down
 */
export interface DrillDownData {
  title: string;                    // Título do drill-down (ex: "New conversations")
  description?: string;
  totalItems: number;               // Total de itens (ex: 4)
  displayedItems: number;           // Itens sendo exibidos (ex: 4)
  rows: DrillDownRow[];
  availableColumns: ColumnGroup[];  // Todas as colunas disponíveis
  selectedColumns: string[];        // IDs das colunas selecionadas
  filters?: DrillDownFilter[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

/**
 * Filtro aplicado no drill-down
 */
export interface DrillDownFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';
  value: string | number | string[] | number[];
  label: string;
}

/**
 * Estado do drill-down
 */
export interface DrillDownState {
  isOpen: boolean;
  isLoading: boolean;
  error?: string;
  data?: DrillDownData;
  selectedColumns: string[];
  searchTerm: string;               // Busca de colunas
  currentPage: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Configuração de exportação
 */
export interface ExportConfig {
  format: 'csv' | 'excel' | 'json';
  filename?: string;
  includeHeaders?: boolean;
  selectedColumns?: string[];       // Exportar apenas colunas selecionadas
}

// ============================================
// CONSTANTES
// ============================================

/**
 * Labels dos grupos de colunas
 */
export const COLUMN_GROUP_LABELS: Record<ColumnGroupType, string> = {
  suggested: 'Suggested attributes',
  standard: 'Standard attributes',
  timestamp: 'Timestamp attributes',
  custom: 'Custom attributes'
};

/**
 * Ícones dos grupos
 */
export const COLUMN_GROUP_ICONS: Record<ColumnGroupType, string> = {
  suggested: 'Star',
  standard: 'List',
  timestamp: 'Clock',
  custom: 'Wrench'
};

/**
 * Tamanho padrão de página
 */
export const DEFAULT_PAGE_SIZE = 50;

/**
 * Número máximo de colunas selecionadas
 */
export const MAX_SELECTED_COLUMNS = 10;

// ============================================
// HELPERS
// ============================================

/**
 * Filtra colunas por termo de busca
 */
export function filterColumnsBySearch(
  columns: DrillDownColumn[],
  searchTerm: string
): DrillDownColumn[] {
  if (!searchTerm.trim()) return columns;

  const term = searchTerm.toLowerCase();
  return columns.filter(col =>
    col.label.toLowerCase().includes(term) ||
    col.field.toLowerCase().includes(term)
  );
}

/**
 * Agrupa colunas por tipo
 */
export function groupColumns(columns: DrillDownColumn[]): ColumnGroup[] {
  const groups: Record<ColumnGroupType, DrillDownColumn[]> = {
    suggested: [],
    standard: [],
    timestamp: [],
    custom: []
  };

  columns.forEach(col => {
    if (groups[col.group]) {
      groups[col.group].push(col);
    }
  });

  return Object.entries(groups)
    .filter(([_, cols]) => cols.length > 0)
    .map(([type, cols]) => ({
      id: type as ColumnGroupType,
      label: COLUMN_GROUP_LABELS[type as ColumnGroupType],
      columns: cols,
      icon: COLUMN_GROUP_ICONS[type as ColumnGroupType],
      collapsed: false
    }));
}

/**
 * Ordena dados
 */
export function sortDrillDownData(
  rows: DrillDownRow[],
  sortBy: string,
  direction: 'asc' | 'desc'
): DrillDownRow[] {
  return [...rows].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal === bVal) return 0;

    const comparison = aVal > bVal ? 1 : -1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Pagina dados
 */
export function paginateDrillDownData(
  rows: DrillDownRow[],
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): DrillDownRow[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return rows.slice(start, end);
}

/**
 * Calcula total de páginas
 */
export function getTotalPages(totalItems: number, pageSize: number = DEFAULT_PAGE_SIZE): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Formata contagem de itens (ex: "4 out of 4 items")
 */
export function formatItemCount(displayed: number, total: number): string {
  return `${displayed} out of ${total} item${total !== 1 ? 's' : ''}`;
}

/**
 * Renderiza valor baseado no tipo da coluna
 */
export function renderColumnValue(value: any, type: ColumnDataType): string {
  switch (type) {
    case 'date':
      return value instanceof Date
        ? value.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : String(value);

    case 'number':
      return typeof value === 'number'
        ? value.toLocaleString('pt-BR')
        : String(value);

    case 'boolean':
      return value ? 'Sim' : 'Não';

    default:
      return String(value ?? '—');
  }
}
