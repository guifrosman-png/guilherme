import { getAllMetrics } from '../metrics'
import type { CanvasComponentType } from '../types'

/**
 * Verifica se um tipo de gráfico é compatível com uma métrica
 */
export function isChartTypeCompatible(
    chartType: CanvasComponentType,
    metricId: string
): boolean {
    const metric = getAllMetrics().find(m => m.id === metricId)

    if (!metric) return false

    // Se a métrica não definiu chartTypes, assume compatibilidade (legacy)
    if (!metric.chartTypes || metric.chartTypes.length === 0) return true

    return metric.chartTypes.includes(chartType)
}

/**
 * Retorna todos os tipos de gráfico compatíveis com uma métrica
 */
export function getCompatibleChartTypes(metricId: string): CanvasComponentType[] {
    const metric = getAllMetrics().find(m => m.id === metricId)

    if (!metric || !metric.chartTypes) return []

    return metric.chartTypes as CanvasComponentType[]
}

/**
 * Retorna a métrica completa por ID
 */
export function getMetricById(metricId: string) {
    return getAllMetrics().find(m => m.id === metricId)
}
