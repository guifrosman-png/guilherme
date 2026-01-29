import type {
  MetricDefinition,
  DimensionDefinition,
  ChartDataPoint,
  GeneratorParams,
  TemporalGranularity
} from '../types'

/**
 * ============================================
 * GERADORES DE MOCK DATA
 * ============================================
 *
 * Funções auxiliares para gerar dados mock durante desenvolvimento
 * Estas funções são usadas pelas métricas quando mockGenerator está definido
 */

/**
 * Função principal para gerar mock data
 * Detecta o tipo de dimensão e chama o gerador apropriado
 */
export function generateMockData(
  metric: MetricDefinition,
  params: GeneratorParams
): ChartDataPoint[] {
  const { dimension, dateRange, count = 12 } = params

  // Se tem dimensão temporal, gerar série temporal
  if (dimension?.type === 'temporal') {
    return generateTimeSeriesData(metric, dimension, count)
  }

  // Se tem dimensão categórica, gerar por categoria
  if (dimension?.type === 'categorical') {
    return generateCategoricalData(metric, dimension)
  }

  // Sem dimensão: valor único
  return [
    {
      label: metric.name,
      value: generateValueForMetric(metric)
    }
  ]
}

/**
 * Gera dados para séries temporais
 */
export function generateTimeSeriesData(
  metric: MetricDefinition,
  dimension: DimensionDefinition,
  count: number
): ChartDataPoint[] {
  const labels = generateTimeLabels(dimension.granularity!, count)

  return labels.map((label, index) => ({
    label,
    value: generateValueForMetric(metric, index, count),
    timestamp: label
  }))
}

/**
 * Gera dados para dimensões categóricas
 */
export function generateCategoricalData(
  metric: MetricDefinition,
  dimension: DimensionDefinition
): ChartDataPoint[] {
  if (!dimension.options || dimension.options.length === 0) {
    return []
  }

  return dimension.options.map((option) => ({
    label: option.label,
    value: generateValueForMetric(metric),
    category: option.value
  }))
}

/**
 * Gera labels temporais baseado na granularidade
 */
export function generateTimeLabels(
  granularity: TemporalGranularity,
  count: number
): string[] {
  switch (granularity) {
    case 'hour':
      return Array.from({ length: Math.min(count, 24) }, (_, i) => `${i}h`)

    case 'day':
      // Últimos N dias
      const days = []
      for (let i = count - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        days.push(
          date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
          })
        )
      }
      return days

    case 'week':
      // Últimas N semanas
      return Array.from({ length: count }, (_, i) => `Sem ${i + 1}`)

    case 'month':
      // Últimos N meses
      const months = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez'
      ]
      const currentMonth = new Date().getMonth()
      const labels = []
      for (let i = 0; i < count; i++) {
        const monthIndex = (currentMonth - (count - 1 - i) + 12) % 12
        labels.push(months[monthIndex])
      }
      return labels

    case 'quarter':
      // Últimos N trimestres
      return Array.from({ length: count }, (_, i) => `Q${(i % 4) + 1}`)

    case 'year':
      // Últimos N anos
      const currentYear = new Date().getFullYear()
      return Array.from(
        { length: count },
        (_, i) => `${currentYear - (count - 1 - i)}`
      )

    default:
      return Array.from({ length: count }, (_, i) => `Item ${i + 1}`)
  }
}

/**
 * Gera valor realista baseado no tipo de métrica
 */
export function generateValueForMetric(
  metric: MetricDefinition,
  index?: number,
  total?: number
): number {
  // Valores base por tipo de agregação
  switch (metric.aggregation) {
    case 'count':
      // Contagens: 50-500
      return Math.floor(Math.random() * 450 + 50)

    case 'sum':
      // Somas (geralmente valores monetários): 10k-100k
      if (metric.context === 'financeiro') {
        return Math.floor(Math.random() * 90000 + 10000)
      }
      return Math.floor(Math.random() * 5000 + 1000)

    case 'avg':
      // Médias/Percentuais
      if (metric.id.includes('rate') || metric.id.includes('conversion')) {
        // Taxas: 0-100%
        return parseFloat((Math.random() * 100).toFixed(2))
      }
      // Médias gerais: 10-500
      return parseFloat((Math.random() * 490 + 10).toFixed(2))

    case 'min':
      // Mínimos
      return Math.floor(Math.random() * 100)

    case 'max':
      // Máximos
      return Math.floor(Math.random() * 900 + 100)

    case 'median':
      // Medianas
      return Math.floor(Math.random() * 300 + 50)

    default:
      return Math.floor(Math.random() * 1000)
  }
}

/**
 * ============================================
 * HELPER: Aplicar Tendência aos Dados
 * ============================================
 * Útil para criar dados mais realistas com crescimento/decréscimo
 */
export function applyTrend(
  data: ChartDataPoint[],
  trendType: 'growth' | 'decline' | 'stable' | 'seasonal'
): ChartDataPoint[] {
  return data.map((point, index) => {
    let multiplier = 1

    switch (trendType) {
      case 'growth':
        // Crescimento linear
        multiplier = 1 + index * 0.05
        break

      case 'decline':
        // Decréscimo linear
        multiplier = 1 - index * 0.03
        break

      case 'seasonal':
        // Padrão sazonal (seno)
        multiplier = 1 + Math.sin((index / data.length) * Math.PI * 2) * 0.3
        break

      case 'stable':
      default:
        // Variação pequena aleatória
        multiplier = 0.9 + Math.random() * 0.2
        break
    }

    return {
      ...point,
      value: Math.floor(point.value * multiplier)
    }
  })
}

/**
 * ============================================
 * HELPER: Adicionar Ruído Realista
 * ============================================
 * Adiciona variação aleatória para dados mais realistas
 */
export function addNoise(
  data: ChartDataPoint[],
  noiseLevel: 'low' | 'medium' | 'high' = 'medium'
): ChartDataPoint[] {
  const noiseLevels = {
    low: 0.05, // 5%
    medium: 0.15, // 15%
    high: 0.3 // 30%
  }

  const variance = noiseLevels[noiseLevel]

  return data.map((point) => ({
    ...point,
    value: Math.floor(
      point.value * (1 + (Math.random() * 2 - 1) * variance)
    )
  }))
}

/**
 * ============================================
 * HELPER: Dados Cumulativos
 * ============================================
 * Converte dados em valores acumulados (útil para métricas como "Total Acumulado")
 */
export function makeCumulative(data: ChartDataPoint[]): ChartDataPoint[] {
  let cumulative = 0

  return data.map((point) => {
    cumulative += point.value
    return {
      ...point,
      value: cumulative,
      originalValue: point.value
    }
  })
}

/**
 * ============================================
 * EXEMPLO DE USO
 * ============================================
 *
 * // Em uma métrica:
 * mockGenerator: (params) => {
 *   let data = generateMockData(metricDefinition, params)
 *
 *   // Adicionar tendência de crescimento
 *   data = applyTrend(data, 'growth')
 *
 *   // Adicionar ruído realista
 *   data = addNoise(data, 'medium')
 *
 *   return data
 * }
 */
