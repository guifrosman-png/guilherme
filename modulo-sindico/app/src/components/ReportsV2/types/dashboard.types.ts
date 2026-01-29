// ============================================
// DASHBOARD TYPES - Tipos para Visualizacao de Dashboard
// ============================================

import { ReportModule } from './report.types';

/**
 * Direcao da variacao do KPI
 */
export type VariationDirection = 'up' | 'down' | 'neutral';

/**
 * Variacao de um KPI (seta com numero)
 */
export interface KPIVariation {
  value: number;
  direction: VariationDirection;
  isPercentage?: boolean;
}

/**
 * Formato do valor do KPI
 */
export type KPIFormat = 'number' | 'percentage' | 'currency' | 'time';

/**
 * KPI Individual do Dashboard
 */
export interface ComponentLayout {
  x: number;      // Coluna inicial (0-7)
  y: number;      // Linha inicial (0-N)
  w: number;      // Largura em colunas (min 2, max 8)
  h: number;      // Altura em linhas (min 2)
}

/**
 * KPI Individual do Dashboard
 */
export interface DashboardKPI {
  id: string;
  layout: ComponentLayout;
  label: string;
  value: number | null;
  format?: KPIFormat;
  variation?: KPIVariation;
  tooltip?: string;
  drillDownEnabled?: boolean;
  drillDownDataSource?: string;
}

/**
 * Tipos de graficos suportados
 */
export type ChartType =
  | 'line'
  | 'bar'
  | 'column'
  | 'combo'
  | 'heatmap'
  | 'table'
  | 'pie'
  | 'donut'
  | 'area';

/**
 * Serie de dados para o grafico
 */
export interface ChartSeries {
  key: string;
  label: string;
  color?: string;
}

/**
 * Tamanho do grafico no grid
 */
export type ChartSize = 'full' | 'half';

/**
 * Configuracao de um grafico
 */
export interface ChartConfig {
  id: string;
  layout: ComponentLayout;
  title: string;
  type: ChartType;
  data: Record<string, unknown>[];
  series?: ChartSeries[];
  xAxisKey?: string;
  showLegend?: boolean;
  height?: number;
  size?: ChartSize;
  drillDownDataSource?: string;
}

/**
 * Preset de periodo
 */
export type PeriodPreset =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'last28days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'thisYear'
  | 'custom';

/**
 * Configuracao do filtro de periodo
 */
export interface PeriodFilter {
  startDate: Date;
  endDate: Date;
  timezone?: string;
  preset?: PeriodPreset;
}

/**
 * Filtro adicional aplicado no dashboard
 */
export interface DashboardFilter {
  id: string;
  field: string;
  label: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'between' | 'in';
  value: string | number | string[] | number[] | [number, number];
}

/**
 * Configuracao completa do Dashboard
 */
export interface DashboardConfig {
  id: string;
  reportId: string;
  title: string;
  description: string;
  module: ReportModule;
  owner: string;
  kpis: DashboardKPI[];
  charts: ChartConfig[];
  defaultPeriod?: PeriodFilter;
}

/**
 * Opcao de filtro disponivel
 */
export interface DashboardFilterOption {
  id: string;
  field: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  options?: { label: string; value: string | number }[];
}

/**
 * Estado do Dashboard
 */
export interface DashboardState {
  isLoading: boolean;
  error?: string;
  periodFilter: PeriodFilter;
  additionalFilters: DashboardFilter[];
  selectedKPIId?: string;
  selectedChartId?: string;
}

// ============================================
// HELPERS
// ============================================

/**
 * Formata variacao para exibicao
 */
export function formatVariation(variation: KPIVariation): string {
  const value = Math.abs(variation.value);
  const suffix = variation.isPercentage ? '%' : '';
  return `${value}${suffix}`;
}

/**
 * Obtem cor da variacao (classes Tailwind)
 */
export function getVariationColor(variation: KPIVariation): string {
  switch (variation.direction) {
    case 'up':
      return 'text-emerald-600 dark:text-emerald-400';
    case 'down':
      return 'text-red-600 dark:text-red-400';
    case 'neutral':
      return 'text-zinc-500 dark:text-zinc-400';
  }
}

/**
 * Cria periodo pre-definido
 */
export function createPresetPeriod(preset: PeriodPreset): PeriodFilter {
  const now = new Date();
  const endDate = new Date(now);
  const startDate = new Date(now);

  switch (preset) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'last7days':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'last28days':
      startDate.setDate(now.getDate() - 28);
      break;
    case 'thisMonth':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'lastMonth':
      startDate.setMonth(now.getMonth() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(0); // Ultimo dia do mes anterior
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'thisQuarter':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate.setMonth(quarter * 3);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'thisYear':
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setDate(now.getDate() - 28);
  }

  return {
    startDate,
    endDate,
    preset,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}
