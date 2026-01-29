import type { MetricDefinition, DimensionDefinition, MetricContext } from '../types'
import * as Financeiro from './financeiro'

import * as Sindico from './sindico'

// Aggregate all metrics for the registry (only real data sources)
export const EXAMPLE_METRICS: MetricDefinition[] = [
  ...Object.values(Financeiro).filter((m): m is MetricDefinition => (m as any).id !== undefined),
  ...Object.values(Sindico).filter((m): m is MetricDefinition => (m as any).id !== undefined)
]
import { ALL_DIMENSIONS } from './dimensions'

/**
 * ============================================
 * METRICS REGISTRY - Sistema de registro
 * ============================================
 *
 * Este é o core do sistema extensível.
 * Permite adicionar métricas sem modificar código core.
 */

// Registries internos
const metricsRegistry = new Map<string, MetricDefinition>()
const dimensionsRegistry = new Map<string, DimensionDefinition>()

// ============================================
// FUNÇÕES DE REGISTRO
// ============================================

/**
 * Registra uma nova métrica no sistema
 * Após registrar, a métrica aparece automaticamente na UI
 */
export function registerMetric(metric: MetricDefinition): void {
  if (metricsRegistry.has(metric.id)) {
    console.warn(`Métrica com id "${metric.id}" já está registrada. Sobrescrevendo...`)
  }
  metricsRegistry.set(metric.id, metric)
}

/**
 * Registra múltiplas métricas de uma vez
 */
export function registerMetrics(metrics: MetricDefinition[]): void {
  metrics.forEach((metric) => registerMetric(metric))
}

/**
 * Registra uma nova dimensão no sistema
 */
export function registerDimension(dimension: DimensionDefinition): void {
  if (dimensionsRegistry.has(dimension.id)) {
    console.warn(
      `Dimensão com id "${dimension.id}" já está registrada. Sobrescrevendo...`
    )
  }
  dimensionsRegistry.set(dimension.id, dimension)
}

/**
 * Registra múltiplas dimensões de uma vez
 */
export function registerDimensions(dimensions: DimensionDefinition[]): void {
  dimensions.forEach((dimension) => registerDimension(dimension))
}

// ============================================
// FUNÇÕES DE BUSCA
// ============================================

/**
 * Busca uma métrica por ID
 */
export function getMetricById(id: string): MetricDefinition | undefined {
  return metricsRegistry.get(id)
}

/**
 * Busca uma dimensão por ID
 */
export function getDimensionById(id: string): DimensionDefinition | undefined {
  return dimensionsRegistry.get(id)
}

/**
 * Retorna todas as métricas registradas
 */
export function getAllMetrics(): MetricDefinition[] {
  return Array.from(metricsRegistry.values())
}

/**
 * Retorna todas as dimensões registradas
 */
export function getAllDimensions(): DimensionDefinition[] {
  return Array.from(dimensionsRegistry.values())
}

/**
 * Retorna métricas filtradas por contexto
 */
export function getMetricsByContext(context: MetricContext): MetricDefinition[] {
  return getAllMetrics().filter((metric) => metric.context === context)
}

/**
 * Retorna métricas compatíveis com um tipo de gráfico
 */
export function getMetricsByChartType(chartType: string): MetricDefinition[] {
  return getAllMetrics().filter((metric) =>
    metric.chartTypes.includes(chartType)
  )
}

/**
 * Retorna métricas que podem usar uma dimensão específica
 * (Por ora, todas as métricas podem usar todas as dimensões)
 */
export function getMetricsForDimension(dimensionId: string): MetricDefinition[] {
  return getAllMetrics()
}

/**
 * Retorna dimensões compatíveis com uma métrica
 * (Por ora, todas as dimensões são compatíveis com todas as métricas)
 */
export function getDimensionsForMetric(metricId: string): DimensionDefinition[] {
  return getAllDimensions()
}

/**
 * Retorna apenas dimensões temporais
 */
export function getTemporalDimensions(): DimensionDefinition[] {
  return getAllDimensions().filter((dim) => dim.type === 'temporal')
}

/**
 * Retorna apenas dimensões categóricas
 */
export function getCategoricalDimensions(): DimensionDefinition[] {
  return getAllDimensions().filter((dim) => dim.type === 'categorical')
}

/**
 * Retorna todos os contextos disponíveis
 */
export function getAvailableContexts(): MetricContext[] {
  const contexts = new Set<MetricContext>()
  getAllMetrics().forEach((metric) => contexts.add(metric.context))
  return Array.from(contexts).sort()
}

// ============================================
// FUNÇÕES DE UTILIDADE
// ============================================

/**
 * Verifica se uma métrica existe
 */
export function metricExists(id: string): boolean {
  return metricsRegistry.has(id)
}

/**
 * Verifica se uma dimensão existe
 */
export function dimensionExists(id: string): boolean {
  return dimensionsRegistry.has(id)
}

/**
 * Remove uma métrica do registro (raramente necessário)
 */
export function unregisterMetric(id: string): boolean {
  return metricsRegistry.delete(id)
}

/**
 * Remove uma dimensão do registro (raramente necessário)
 */
export function unregisterDimension(id: string): boolean {
  return dimensionsRegistry.delete(id)
}

/**
 * Limpa todos os registros (útil para testes)
 */
export function clearAllRegistries(): void {
  metricsRegistry.clear()
  dimensionsRegistry.clear()
}

/**
 * Retorna estatísticas do registry
 */
export function getRegistryStats() {
  return {
    totalMetrics: metricsRegistry.size,
    totalDimensions: dimensionsRegistry.size,
    metricsByContext: {
      crm: getMetricsByContext('crm').length,
      financeiro: getMetricsByContext('financeiro').length,
      formularios: getMetricsByContext('formularios').length,
      vendas: getMetricsByContext('vendas').length,
      geral: getMetricsByContext('geral').length
    },
    dimensionsByType: {
      temporal: getTemporalDimensions().length,
      categorical: getCategoricalDimensions().length
    }
  }
}

// ============================================
// AUTO-REGISTRO INICIAL
// ============================================

/**
 * Registra métricas e dimensões de exemplo automaticamente
 * Esta função é executada quando o módulo é importado
 */
function initializeRegistry(): void {
  // Registrar métricas de exemplo
  registerMetrics(EXAMPLE_METRICS)

  // Registrar dimensões
  registerDimensions(ALL_DIMENSIONS)

  // Log apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    const stats = getRegistryStats()
    console.log('[Metrics System] Registry inicializado:', stats)
  }
}

// Executar inicialização
initializeRegistry()

// ============================================
// EXPORTS
// ============================================

// Re-exportar tipos úteis
export type { MetricDefinition, DimensionDefinition, MetricContext }

export { ALL_DIMENSIONS, TEMPORAL_DIMENSIONS } from './dimensions'

// Exportar generators (útil para criar custom generators)
export * from './generators'
