import { ComponentType } from 'react'

// ============================================
// CANVAS COMPONENTS - Tipos de componentes
// ============================================

export type CanvasComponentType =
  | 'title'
  | 'value'
  | 'description'
  | 'icon'
  | 'trend'
  | 'table'
  | 'divider'
  | 'spacer'
  | 'progress'
  | 'badge'
  | 'chart-bar'
  | 'chart-line'
  | 'chart-area'
  | 'chart-pie'
  | 'chart-donut'
  | 'chart-gauge'
  | 'chart-heatmap'
  | 'chart-bar-h'
  | 'recharts-area'
  | 'recharts-bar'
  | 'recharts-line'
  | 'recharts-pie'
  | 'recharts-radar'
  | 'recharts-radial'
  | 'recharts-scatter'
  | 'recharts-composed'
  | 'recharts-treemap'
  | 'recharts-funnel'
  | 'recharts-bar-h'
  | 'recharts-donut'
  | 'kpi-unified'

// ============================================
// DATA SOURCE - Sistema de fontes de dados
// ============================================

export interface DateRange {
  start: string
  end: string
}

export type DataSourceType = 'api' | 'sql' | 'static' | 'mock' | 'metrics'

export interface DataSourceConfig {
  type: DataSourceType

  // Campos existentes (API/SQL)
  endpoint?: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: Record<string, unknown>
  query?: string
  connection?: string

  // Mapeamento de campos
  mapping?: {
    labels?: string
    values?: string
    series?: string
    columns?: string[]
  }

  // Refresh
  refreshInterval?: number

  // Transformação de dados
  transform?: string

  // NOVO: Configuração de métricas
  metricsQuery?: MetricsQuery

  // NOVO: Estratégia de dados para métricas
  dataStrategy?: 'mock' | 'api' | 'sql'
}

export interface ChartDataPoint {
  label: string
  value: number
  series?: string
  color?: string
  timestamp?: string | Date
  [key: string]: unknown
}

// ============================================
// METRICS SYSTEM - Sistema de métricas
// ============================================

export type MetricContext = 'crm' | 'financeiro' | 'formularios' | 'vendas' | 'geral' | 'sindico'

export type MetricCategory =
  | 'valores'      // Análises por Valores
  | 'tempo'        // Análises por Tempo  
  | 'fornecedor'   // Análises por Fornecedor
  | 'contabil'     // Análises Contábeis
  | 'pagamento'    // Análises de Pagamento
  | 'parcelamento' // Análises de Parcelamento
  | 'kpis'         // KPIs Consolidados


export type AggregationType = 'sum' | 'count' | 'avg' | 'min' | 'max' | 'median'

export type TemporalGranularity = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'

export type DimensionType = 'temporal' | 'categorical' | 'numerical'

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'between'
  | 'in'

export interface GeneratorParams {
  dimension?: DimensionDefinition
  dateRange?: {
    start: string
    end: string
  }
  count?: number
  filters?: Array<{
    field: string
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_equals' | 'between'
    value: unknown
  }>
}

/**
 * Definição de uma métrica
 * Representa O QUE medir (ex: Total de Leads, Receita Total, etc.)
 */
export interface MetricDefinition {
  id: string
  name: string
  description: string
  context: MetricContext
  aggregation: AggregationType
  valueField: string
  chartTypes: string[] // Tipos de gráfico compatíveis

  // FONTES DE DADOS (escolher uma ou mais)
  mockGenerator?: (params: GeneratorParams) => ChartDataPoint[]
  apiEndpoint?: string // Ex: '/api/crm/leads/count'
  sqlQuery?: string // Query SQL com placeholders

  // VISUAL HINTS (Smart KPI)
  defaultIcon?: string // Nome do ícone Lucide (ex: 'dollar-sign', 'users')
  format?: 'currency' | 'percent' | 'number' | 'text'

  // Regras visuais automatizadas
  visualRules?: {
    negativeColor?: string // Cor para valores negativos (ex: 'text-red-500', '#ef4444')
    positiveColor?: string // Cor para valores positivos
    thresholds?: Array<{ value: number; color: string }>
  }

  // Categorização para UI
  category?: MetricCategory  // Categoria para agrupamento na UI
  subcategory?: string       // Subcategoria (1.1, 1.2, etc.) - referência ao doc de análises

  // Indica se foi migrada de MOCK_DATASETS antigos
  _migrated?: boolean

  // Dimensões compatíveis
  dimensions?: string[]
}

/**
 * Definição de uma dimensão
 * Representa COMO agrupar os dados (ex: Por Mês, Por Região, etc.)
 */
export interface DimensionDefinition {
  id: string
  name: string
  description?: string
  type: DimensionType
  field?: string
  granularity?: TemporalGranularity
  /** Contexto para filtrar dimensões por tipo de métrica (csv, report, etc.) */
  context?: 'csv' | 'report' | 'all'
  options?: Array<{
    value: string
    label: string
  }>
}

/**
 * Condição de filtro
 */
export interface FilterCondition {
  field: string // ID de uma dimensão ou campo
  operator: FilterOperator
  value: unknown
}

/**
 * Grupo de filtros com lógica AND/OR
 */
export interface FilterGroup {
  conditions: FilterCondition[]
  logic: 'AND' | 'OR'
}

/**
 * Query completa de métricas
 * Representa a configuração completa do que o usuário quer visualizar
 */
export interface MetricsQuery {
  metric: string // ID da métrica
  aggregation: AggregationType
  color?: string // Cor personalizada para a métrica principal
  dimension?: string // ID da dimensão (opcional)
  filters?: FilterGroup
  dateRange?: {
    start: string
    end: string
    preset?: 'last_7_days' | 'last_30_days' | 'last_3_months' | 'last_year' | 'custom'
  }
  // Para gráficos com múltiplas métricas (futuro)
  additionalMetrics?: Array<{
    metric: string
    aggregation: AggregationType
    color?: string // Cor personalizada para métricas adicionais
  }>

  // Filtros simples aplicados do Drill-in
  simpleFilters?: Array<{
    field: string
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'not_equals' | 'between'
    value: unknown
  }>

  // Comparação com período anterior
  compareWithPrevious?: boolean
}

// ============================================
// CANVAS COMPONENT - Componente do canvas
// ============================================

export interface CanvasComponent {
  id: string
  type: CanvasComponentType
  x: number
  y: number
  width: number
  height: number
  props: Record<string, unknown>
  dataSource?: DataSourceConfig
}

// ============================================
// MOCK DATASETS - Sistema antigo (será migrado)
// ============================================

export interface MockDataset {
  id: string
  name: string
  description: string
  category: 'vendas' | 'usuarios' | 'metricas' | 'temporal' | 'categorias'
  data: ChartDataPoint[]
}

// ============================================
// HOOKS - Tipos de retorno dos hooks
// ============================================

export interface UseDataSourceResult {
  data: ChartDataPoint[] | null
  loading: boolean
  error: string | null
  refresh: () => void
}

export interface UseMetricsBuilderResult {
  data: ChartDataPoint[] | null
  loading: boolean
  error: string | null
  refresh: () => void
}

// ============================================
// LEGACY - Interfaces antigas (manter compatibilidade)
// ============================================

export interface MetricaConfig {
  id: string
  titulo: string
  descricao: string
  showTitle?: boolean
  showDescription?: boolean
  showBorder?: boolean
  showCardBg?: boolean
  cardBgColor?: string
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
  cor: string
  borderColor: string
  getValue: (data: MetricaData) => number | string
  categoria: 'filas' | 'investigadores' | 'performance' | 'financeiro' | 'lucratividade'
  /**
   * Contexto da métrica para filtragem em dashboards específicos.
   * Se não definido, usa mapeamento baseado em categoria:
   * - financeiro/lucratividade → 'financeiro'
   * - filas/investigadores/performance → 'geral'
   */
  context?: MetricContext

  // ============================================
  // NOVO: Configuração Simplificada (1 Gráfico)
  // ============================================

  /** Tipo de gráfico/visualização (nova abordagem simplificada) */
  chartType?: CanvasComponentType

  /** ID da métrica a ser exibida */
  metric?: string

  /** Dimensão para agrupamento (opcional) */
  dimension?: string

  /** Intervalo de datas (opcional) */
  dateRange?: {
    start: string
    end: string
  }

  /** Tipo de agregação (opcional, padrão: 'sum') */
  aggregation?: AggregationType

  /** Filtros adicionais (opcional) */
  filters?: FilterCondition[]

  // ============================================
  // LEGACY: Manter para compatibilidade
  // ============================================

  /** @deprecated Use chartType + metric instead */
  canvasComponents?: CanvasComponent[]

  /** @deprecated Use chartType + metric instead */
  canvasConfig?: {
    gridCols: number
    gridRows: number
    colorScheme: string
    components?: CanvasComponent[]
  }
}

export interface MetricaData {
  [key: string]: any
}

export interface CardSizeConfig {
  cols: number
  rows: number
}

export interface MetricaAtiva {
  id: string
  size: string
  row: number
  col: number
}

export interface ResizeInfo {
  id: string
  row: number
  col: number
  cols: number
  rows: number
}

export interface CardCreatorModalProps {
  onClose: () => void
  onCreate: (card: MetricaConfig) => void
  editCard?: MetricaConfig
}

export interface CardEditorConfig {
  titulo: string
  descricao: string
  categoria: string // changed from 'categoria' to string for flexibility or match simple types
  chartType: 'none' | 'bar' | 'line' | 'area' | 'pie'
  fontSize: 'sm' | 'md' | 'lg' | 'xl'
  showTrend: boolean
  colorScheme: string
}

export interface CardEditorModalProps {
  cardId: string
  availableMetrics: MetricaConfig[]
  data: Record<string, unknown>
  initialConfig?: CardEditorConfig
  onClose: () => void
  onSave: (config: CardEditorConfig) => void
}

// ============================================
// DASHBOARD PERSISTENCE - Tipos para persistência
// ============================================

/**
 * Configuração do contexto para filtragem de métricas
 * 'all' = mostra métricas de todos os contextos
 * MetricContext específico = mostra apenas daquele contexto
 */
export type ContextFilterType = MetricContext | 'all'

/**
 * Props adicionais para controle de persistência e contexto
 */
export interface DashboardControlProps {
  /** ID único do dashboard para persistência (ex: 'home', 'financeiro') */
  dashboardId?: string
  /** Filtro de contexto para biblioteca de cards */
  contextFilter?: ContextFilterType
  /** Se true, salva automaticamente ao modificar layout */
  autoSave?: boolean
}
