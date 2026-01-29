
// ============================================
// REPORT TYPES - Tipos para Sistema de Relatórios
// ============================================

/**
 * Módulos de relatórios do sistema
 */
export type ReportModule =
  | 'financeiro'
  | 'conversas'
  | 'chamados'
  | 'slas'
  | 'csat'
  | 'responsividade'
  | 'efetividade'
  | 'performance-equipe'
  | 'performance-atendente'
  | 'tags-conversa'
  | 'chamadas'
  | 'engajamento'
  | 'workflows';

/**
 * Categoria do relatório (quem é o dono)
 */
export type ReportCategory = 'system' | 'user' | 'shared';

/**
 * Interface principal de um Relatório/Dashboard
 */
export interface Report {
  id: string;
  code: string;                    // Código único (ex: REL-001)
  title: string;                   // Título do relatório
  description: string;             // Descrição breve
  icon: string;                    // Nome do ícone (lucide-react)
  module: ReportModule;            // Módulo ao qual pertence
  category: ReportCategory;        // system | user | shared

  // Metadados
  owner: string;                   // Nome do proprietário
  ownerId?: string;                // ID do proprietário (para user/shared)
  createdAt: Date;                 // Data de criação
  updatedAt: Date;                 // Última atualização
  updatedBy?: string;              // Quem atualizou por último

  // Estado do usuário
  isFavorite: boolean;             // Favoritado pelo usuário atual

  // Configurações (para relatórios personalizados)
  config?: ReportConfig;
}

/**
 * Configuração de um relatório personalizado
 */
export interface ReportConfig {
  columns: string[];               // Colunas selecionadas
  filters?: ReportFilter[];        // Filtros aplicados
  calculatedColumns?: CalculatedColumn[]; // Colunas calculadas
  chartType?: ChartType;           // Tipo de gráfico padrão
  groupBy?: string;                // Agrupamento padrão
  sortBy?: string;                 // Ordenação padrão
  sortDirection?: 'asc' | 'desc';
  components?: ReportComponent[];  // Componentes do dashboard (NOVO)
  metrics?: MetricaAtivaConfig[];  // Layout dos cards do grid (posição, tamanho)
}

/**
 * Configuração de métrica ativa no grid (layout salvo)
 */
export interface MetricaAtivaConfig {
  id: string;
  size: string;  // "1x1", "2x1", "2x2", etc
  row: number;
  col: number;
}

/**
 * Filtro de relatório
 */
export interface ReportFilter {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';
  value: string | number | string[] | number[];
}

/**
 * Coluna calculada
 */
export interface CalculatedColumn {
  id: string;
  name: string;
  formula: string;                 // Ex: "SUM(valor)", "AVG(tempo)"
  type: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'custom';
}

/**
 * Tipos de gráficos disponíveis
 */
export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'area'
  | 'radar'
  | 'table';

/**
 * Item da sidebar de navegação
 */
export interface ReportsSidebarItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
  href?: string;
}

/**
 * Aba de filtro (Compartilhados | Meus | Sistema)
 */
export type ReportsTabId = 'shared' | 'user' | 'system' | 'favorites';

export interface ReportsTab {
  id: ReportsTabId;
  label: string;
  count: number;
}

// ============================================
// EDITOR TYPES (NOVO)
// ============================================

export interface ComponentLayout {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ReportComponentBase {
  id: string;
  layout: ComponentLayout;
}

export interface KPIReportComponent extends ReportComponentBase {
  type: 'kpi';
  label: string;
  value: number | null;
  format?: 'number' | 'percentage' | 'currency' | 'time';
  variation?: { value: number; direction: 'up' | 'down' | 'neutral' };
}

export interface ChartReportComponent extends ReportComponentBase {
  type: 'chart';
  title: string;
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'column' | 'combo' | 'heatmap' | 'table';
  data?: Record<string, unknown>[];
  xAxisKey?: string;
  series?: { key: string; label: string; color?: string }[];
  showLegend?: boolean;
  drillDownDataSource?: string;
}

export interface TitleReportComponent extends ReportComponentBase {
  type: 'title';
  text: string;
  level: 1 | 2 | 3;
}

export interface BannerReportComponent extends ReportComponentBase {
  type: 'banner';
  text: string;
  variant: 'info' | 'warning' | 'success';
}

export type ReportComponent =
  | KPIReportComponent
  | ChartReportComponent
  | TitleReportComponent
  | BannerReportComponent;

// ============================================

/**
 * Módulos de relatórios do sistema
 */
// export type ReportModule = 'financeiro'; // COMENTADO PARA EVITAR CONFLITO COM ACIMA

/**
 * Labels dos módulos
 */
export const MODULE_LABELS: Record<ReportModule, string> = {
  'financeiro': 'Financeiro',
  'conversas': 'Conversas',
  'chamados': 'Chamados',
  'slas': 'SLAs',
  'csat': 'Satisfação (CSAT)',
  'responsividade': 'Responsividade',
  'efetividade': 'Efetividade',
  'performance-equipe': 'Performance da Equipe',
  'performance-atendente': 'Performance do Atendente',
  'tags-conversa': 'Tags de Conversa',
  'chamadas': 'Chamadas',
  'engajamento': 'Engajamento',
  'workflows': 'Workflows'
};

/**
 * Ícones dos módulos
 */
export const MODULE_ICONS: Record<ReportModule, string> = {
  'financeiro': 'DollarSign',
  'conversas': 'MessageCircle',
  'chamados': 'Ticket',
  'slas': 'Clock',
  'csat': 'Smile',
  'responsividade': 'Zap',
  'efetividade': 'TrendingUp',
  'performance-equipe': 'Users',
  'performance-atendente': 'User',
  'tags-conversa': 'Tag',
  'chamadas': 'Phone',
  'engajamento': 'MessageSquare',
  'workflows': 'GitBranch'
};

/**
 * Cores dos módulos
 */
export const MODULE_COLORS: Record<ReportModule, string> = {
  'financeiro': '#22c55e',
  'conversas': '#3b82f6',
  'chamados': '#f59e0b',
  'slas': '#ef4444',
  'csat': '#10b981',
  'responsividade': '#8b5cf6',
  'efetividade': '#06b6d4',
  'performance-equipe': '#6366f1',
  'performance-atendente': '#ec4899',
  'tags-conversa': '#84cc16',
  'chamadas': '#14b8a6',
  'engajamento': '#f97316',
  'workflows': '#a855f7'
};

/**
 * Itens padrão da sidebar
 */
export const DEFAULT_SIDEBAR_ITEMS: ReportsSidebarItem[] = [
  { id: 'all', label: 'Todos os relatórios', icon: 'LayoutGrid', count: 0 },
  { id: 'my-reports', label: 'Meus relatórios', icon: 'FolderOpen', count: 0 },
  { id: 'favorites', label: 'Favoritos', icon: 'Star' },
  { id: 'export', label: 'Exportar dados', icon: 'Download' }
];

/**
 * Itens de módulos da sidebar (categorias)
 */
export const MODULE_SIDEBAR_ITEMS: ReportsSidebarItem[] = [
  { id: 'financeiro', label: 'Financeiro', icon: 'DollarSign' },
  { id: 'conversas', label: 'Conversas', icon: 'MessageCircle' },
  { id: 'chamados', label: 'Chamados', icon: 'Ticket' },
  { id: 'slas', label: 'SLAs', icon: 'Clock' },
  { id: 'csat', label: 'Satisfação (CSAT)', icon: 'Smile' },
  { id: 'responsividade', label: 'Responsividade', icon: 'Zap' },
  { id: 'efetividade', label: 'Efetividade', icon: 'TrendingUp' },
  { id: 'performance-equipe', label: 'Performance da Equipe', icon: 'Users' },
  { id: 'performance-atendente', label: 'Performance do Atendente', icon: 'User' },
  { id: 'tags-conversa', label: 'Tags de Conversa', icon: 'Tag' },
  { id: 'chamadas', label: 'Chamadas', icon: 'Phone' },
  { id: 'engajamento', label: 'Engajamento', icon: 'MessageSquare' },
  { id: 'workflows', label: 'Workflows', icon: 'GitBranch' }
];

/**
 * Tabs padrão
 */
export const DEFAULT_TABS: ReportsTab[] = [
  { id: 'shared', label: 'Compartilhados', count: 0 },
  { id: 'user', label: 'Meus', count: 0 },
  { id: 'system', label: 'Do Sistema', count: 1 }
];

// ============================================
// HELPERS
// ============================================

/**
 * Obtém o label de um módulo
 */
export function getModuleLabel(module: ReportModule): string {
  return MODULE_LABELS[module];
}

/**
 * Obtém o ícone de um módulo
 */
export function getModuleIcon(module: ReportModule): string {
  return MODULE_ICONS[module];
}

/**
 * Obtém a cor de um módulo
 */
export function getModuleColor(module: ReportModule): string {
  return MODULE_COLORS[module];
}

/**
 * Filtra relatórios por categoria
 */
export function filterReportsByCategory(reports: Report[], category: ReportCategory): Report[] {
  return reports.filter(r => r.category === category);
}

/**
 * Filtra relatórios por termo de busca
 */
export function filterReportsBySearch(reports: Report[], searchTerm: string): Report[] {
  if (!searchTerm.trim()) return reports;

  const term = searchTerm.toLowerCase();
  return reports.filter(r =>
    r.title.toLowerCase().includes(term) ||
    r.description.toLowerCase().includes(term) ||
    r.code.toLowerCase().includes(term)
  );
}

/**
 * Conta relatórios por categoria
 */
export function countReportsByCategory(reports: Report[]): Record<ReportCategory, number> {
  return {
    system: reports.filter(r => r.category === 'system').length,
    user: reports.filter(r => r.category === 'user').length,
    shared: reports.filter(r => r.category === 'shared').length
  };
}
