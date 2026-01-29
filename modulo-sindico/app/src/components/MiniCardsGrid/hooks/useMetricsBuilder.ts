import { useState, useEffect, useCallback, useContext } from 'react'
import type {
  MetricsQuery,
  ChartDataPoint,
  UseMetricsBuilderResult,
  FilterGroup,
  AggregationType,
  DimensionDefinition
} from '../types'
import {
  getMetricById,
  getDimensionById
} from '../metrics'
import { FinancialRecord } from '../services/FinancialDataService'
import { FinancialRecord } from '../services/FinancialDataService'
import { useFinancialData } from '../context/FinancialDataContext'
import { useSindicoData } from '../context/SindicoDataContext'

// Helper para verificar status confirmado (Pago/Efetivado/Compensado)
const isConfirmed = (status: string) => ['P', 'E', 'C'].includes(status)

/**
 * ============================================
 * HOOK useMetricsBuilder
 * ============================================
 */
export function useMetricsBuilder(
  query: MetricsQuery | undefined
): UseMetricsBuilderResult {
  const [data, setData] = useState<ChartDataPoint[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Contexto Financeiro Safe-Check
  let financialContext: any = null
  try {
    // eslint-disable-next-line
    financialContext = useFinancialData()
  } catch (e) {
    financialContext = null
  }

  // Contexto Síndico Safe-Check
  let sindicoContext: any = null
  try {
    // eslint-disable-next-line
    sindicoContext = useSindicoData()
  } catch (e) {
    sindicoContext = null
  }

  const buildData = useCallback(async () => {
    if (!query || !query.metric) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const metric = getMetricById(query.metric)
      if (!metric) throw new Error(`Métrica "${query.metric}" não encontrada`)

      const dimension = query.dimension
        ? (getDimensionById(query.dimension) || { id: query.dimension, name: query.dimension, type: 'categorical' as const, field: query.dimension })
        : undefined

      let rawData: ChartDataPoint[] = []

      // --- ESTRATÉGIA SÍNDICO (Context Data) ---
      if (sindicoContext && (metric.context === 'sindico' || metric.id.startsWith('sind-'))) {
        const { data: sData } = sindicoContext

        if (sData) {
          switch (metric.id) {
            case 'sind-faturamento':
            case 'sindico-gross-revenue':
              rawData = [{ label: 'Total', value: sData.faturamentoBruto || 0 }]
              break
            case 'sind-repasse':
            case 'sindico-accumulated-repass':
              rawData = [{ label: 'Total', value: sData.repasseLiquido || 0 }]
              break
            case 'sind-vendas-qtd':
              rawData = [{ label: 'Total', value: sData.vendasQtd || 0 }]
              break
            default:
              // Tenta mapear outras se houver
              rawData = []
          }
        }
      }
      // --- ESTRATÉGIA NOVO FINANCEIRO (Shared Data) ---
      else if (financialContext && (metric.category === 'financeiro' || metric.context === 'financeiro') && !metric.mockGenerator) {
        const records = financialContext.filteredData as FinancialRecord[]

        switch (metric.id) {
          // 1. RECEITA TOTAL
          case 'fin-revenue-v2': {
            rawData = aggregateGeneric(
              records.filter(r => r.movimento === 'entrada' && isConfirmed(r.status)),
              dimension,
              r => r.valor_efetivado || r.valor
            )
            break
          }

          // 2. DESPESA TOTAL
          case 'fin-expense-v2': {
            rawData = aggregateGeneric(
              records.filter(r => r.movimento === 'saida' && isConfirmed(r.status)),
              dimension,
              r => r.valor_efetivado || r.valor // Retorna positivo para gráficos de volume
            )
            break
          }

          // 3. SALDO LÍQUIDO
          case 'fin-balance-v2': {
            rawData = aggregateGeneric(
              records.filter(r => isConfirmed(r.status)),
              dimension,
              r => (r.movimento === 'entrada' ? 1 : -1) * (r.valor_efetivado || r.valor)
            )
            break
          }

          // 4. TOP FORNECEDORES
          case 'fin-top-suppliers-v2': {
            // Mantendo lógica específica de sort/slice se necessário, ou convertendo para genérico
            // Top Suppliers é basicamente Expense agrupado por Emitente
            // Mas com sort desc e slice 20 (conforme doc).
            const agg = aggregateGeneric(
              records.filter(r => r.movimento === 'saida' && isConfirmed(r.status)),
              dimension || { id: 'csv-emitente', name: 'Emitente', type: 'categorical' }, // Default to Emitente if no dimension
              r => r.valor_efetivado || r.valor
            )
            rawData = agg.sort((a, b) => b.value - a.value).slice(0, 20)
            break
          }

          // 4.1 TOP FORNECEDORES (VALOR ORIGINAL)
          case 'fin-top-suppliers-original': {
            const agg = aggregateGeneric(
              records.filter(r => r.movimento === 'saida' && isConfirmed(r.status)),
              dimension || { id: 'csv-emitente', name: 'Emitente', type: 'categorical' },
              r => r.valor || 0
            )
            rawData = agg.sort((a, b) => b.value - a.value).slice(0, 20)
            break
          }

          // 4.2 TOP FORNECEDORES (QUANTIDADE)
          case 'fin-top-suppliers-count': {
            const agg = aggregateGeneric(
              records.filter(r => r.movimento === 'saida' && isConfirmed(r.status)),
              dimension || { id: 'csv-emitente', name: 'Emitente', type: 'categorical' },
              r => 1 // Count = 1 per record
            )
            rawData = agg.sort((a, b) => b.value - a.value).slice(0, 20)
            break
          }

          // 5. POR CATEGORIA
          case 'fin-category-v2': {
            const agg = aggregateGeneric(
              records.filter(r => r.movimento === 'saida' && isConfirmed(r.status)),
              dimension || { id: 'csv-centro-custo', name: 'Categoria', type: 'categorical' },
              r => r.valor_efetivado || r.valor
            )
            rawData = agg.sort((a, b) => b.value - a.value)
            break
          }

          // 6. EVOLUÇÃO (MENSAL)
          case 'fin-evolution-v2': {
            const mapRec = new Map<string, number>()
            const mapDesp = new Map<string, number>()

            records.forEach(r => {
              if (!isConfirmed(r.status)) return;
              const date = r.data_efetivacao || r.data_vencimento || r.data_emissao
              if (!date) return

              const monthKey = date.substring(0, 7) // YYYY-MM
              const val = r.valor_efetivado || r.valor

              if (r.movimento === 'entrada') {
                mapRec.set(monthKey, (mapRec.get(monthKey) || 0) + val)
              } else {
                mapDesp.set(monthKey, (mapDesp.get(monthKey) || 0) + val)
              }
            })

            const allMonths = Array.from(new Set([...mapRec.keys(), ...mapDesp.keys()])).sort()

            rawData = allMonths.map(m => ({
              label: m,
              value: (mapRec.get(m) || 0) - (mapDesp.get(m) || 0),
              Receita: mapRec.get(m) || 0,
              Despesa: mapDesp.get(m) || 0
            }))
            break
          }

          // 7. JUROS E MULTAS
          case 'fin-interest-penalty': {
            // Soma vl_juros + vl_multa separadamente para breakdown
            if (dimension && dimension.type === 'categorical') {
              const mapJuros = new Map<string, number>()
              const mapMultas = new Map<string, number>()

              records.forEach(r => {
                if (r.movimento !== 'saida' || !isConfirmed(r.status)) return
                const key = String(r[dimension.id as keyof FinancialRecord] || 'Outros')
                mapJuros.set(key, (mapJuros.get(key) || 0) + (r.vl_juros || 0))
                mapMultas.set(key, (mapMultas.get(key) || 0) + (r.vl_multa || 0))
              })

              const keys = Array.from(new Set([...mapJuros.keys(), ...mapMultas.keys()])).sort()
              rawData = keys.map(k => {
                const j = mapJuros.get(k) || 0
                const m = mapMultas.get(k) || 0
                return {
                  label: k,
                  value: j + m,
                  Juros: j,
                  Multas: m
                }
              })
            } else if (dimension && dimension.type === 'temporal') {
              // Should use aggregateGeneric logic but customized? 
              // Alternatively, iterate.
              // For simplicity, let's use a simpler aggregation if generic doesn't support multi-value.
              // Assuming generic doesn't support multi-value easily without custom reducer.
              // Let's implement manually for now to be safe.
              const mapJuros = new Map<string, number>()
              const mapMultas = new Map<string, number>()

              // Helper to get time key
              const getKey = (r: FinancialRecord) => {
                const d = r.data_efetivacao || r.data_vencimento || r.data_emissao
                if (!d) return 'N/A'
                return d.substring(0, 7) // Default to month YYYY-MM based on dimension granularity? 
                // To be precise we should use dimension.granularity.
                // But for MVP YYYY-MM is safer.
              }

              records.forEach(r => {
                if (r.movimento !== 'saida' || !isConfirmed(r.status)) return
                const key = getKey(r)
                mapJuros.set(key, (mapJuros.get(key) || 0) + (r.vl_juros || 0))
                mapMultas.set(key, (mapMultas.get(key) || 0) + (r.vl_multa || 0))
              })

              const keys = Array.from(new Set([...mapJuros.keys(), ...mapMultas.keys()])).sort()
              rawData = keys.map(k => {
                const j = mapJuros.get(k) || 0
                const m = mapMultas.get(k) || 0
                return {
                  label: k,
                  value: j + m,
                  Juros: j,
                  Multas: m
                }
              })
            } else {
              // Total
              const totalJuros = records.reduce((sum, r) => sum + (r.movimento === 'saida' && isConfirmed(r.status) ? (r.vl_juros || 0) : 0), 0)
              const totalMultas = records.reduce((sum, r) => sum + (r.movimento === 'saida' && isConfirmed(r.status) ? (r.vl_multa || 0) : 0), 0)
              rawData = [{
                label: 'Total',
                value: totalJuros + totalMultas,
                Juros: totalJuros,
                Multas: totalMultas
              }]
            }
            break
          }

          // 8. ECONOMIA COM DESCONTOS
          case 'fin-discounts': {
            // Soma vl_desconto das saídas baixadas
            rawData = aggregateGeneric(
              records.filter(r => r.movimento === 'saida' && isConfirmed(r.status)),
              dimension,
              r => r.vl_desconto || 0
            )
            break
          }

          // 9. PREVISTO VS REALIZADO
          case 'fin-expected-vs-realized': {
            // Para gráfico de barras ou composed
            // Value = Diferença
            // Extras = Previsto (valor) e Realizado (valor_efetivado)
            const mapPrev = new Map<string, number>()
            const mapReal = new Map<string, number>()

            // Agrupa por dimensão ou usa total
            if (dimension && dimension.type === 'categorical') {
              records.forEach(r => {
                if (r.movimento !== 'saida' || !isConfirmed(r.status)) return
                const key = String(r[dimension.id as keyof FinancialRecord] || 'Outros')
                mapPrev.set(key, (mapPrev.get(key) || 0) + (r.valor || 0))
                mapReal.set(key, (mapReal.get(key) || 0) + (r.valor_efetivado || 0))
              })

              const keys = Array.from(new Set([...mapPrev.keys(), ...mapReal.keys()])).sort()
              rawData = keys.map(k => ({
                label: k,
                value: (mapPrev.get(k) || 0) - (mapReal.get(k) || 0), // Diferença
                Previsto: mapPrev.get(k) || 0,
                Realizado: mapReal.get(k) || 0
              }))
            } else {
              // Total único
              const totalPrev = records.reduce((sum, r) => sum + (r.movimento === 'saida' && r.status === 'E' ? (r.valor || 0) : 0), 0)
              const totalReal = records.reduce((sum, r) => sum + (r.movimento === 'saida' && r.status === 'E' ? (r.valor_efetivado || 0) : 0), 0)
              rawData = [{
                label: 'Total',
                value: totalPrev - totalReal,
                Previsto: totalPrev,
                Realizado: totalReal
              }]
            }
            break
          }

          default:
            rawData = []
        }
      }
      // --- ESTRATÉGIAS LEGADO ---
      else if (metric.mockGenerator) {
        rawData = await metric.mockGenerator({
          dimension,
          dateRange: query.dateRange,
          count: 12,
          filters: query.simpleFilters
        })

        if (query.additionalMetrics) {
          for (const addCalc of query.additionalMetrics) {
            const addMetric = getMetricById(addCalc.metric)
            if (addMetric?.mockGenerator) {
              const addData = await addMetric.mockGenerator({ dimension, dateRange: query.dateRange, count: 12 })
              rawData = rawData.map(d => {
                const match = addData.find(ad => ad.label === d.label)
                return { ...d, [addMetric.name]: match ? match.value : 0 }
              })
            }
          }
        }

        if (query.compareWithPrevious) {
          rawData = rawData.map(point => ({
            ...point,
            previousValue: Math.round(point.value * (0.5 + Math.random())) // Fake variation
          }))
        }
      }
      else if (metric.apiEndpoint) {
        rawData = await fetchFromAPI(metric.apiEndpoint, query, metric.id)
      }
      else if (metric.sqlQuery) {
        rawData = await fetchFromSQL(metric.sqlQuery, query, dimension)
      }
      else {
        throw new Error(`Métrica "${metric.name}" sem fonte de dados.`)
      }

      // Filtros comuns
      if (query.filters && query.filters.conditions.length > 0) {
        rawData = applyFilters(rawData, query.filters)
      }

      // Filtros drill-in
      if (query.simpleFilters && query.simpleFilters.length > 0) {
        rawData = applySimpleFilters(rawData, query.simpleFilters)
      }

      // Filtro de data legado (para mocks)
      if (query.dateRange && query.dateRange.start && !financialContext) {
        rawData = applyDateRangeFilter(rawData, query.dateRange)
      }

      const enrichedData = rawData.map(d => ({ ...d, _metricDef: metric }))
      setData(enrichedData)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao construir dados')
      setData(null)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [query, financialContext])

  useEffect(() => { buildData() }, [buildData])

  return { data, loading, error, refresh: buildData }
}

// ==================== HELPERS ORIGINAIS (RESTAURADOS) ====================

async function fetchFromAPI(endpoint: string, query: MetricsQuery, metricId: string): Promise<ChartDataPoint[]> {
  if (endpoint.startsWith('/api/') && !endpoint.includes('/metrics')) {
    const params = new URLSearchParams()
    if (query.dimension) params.append('dimension', query.dimension)
    if (query.aggregation) params.append('aggregation', query.aggregation)
    if (query.dateRange?.start) params.append('from', query.dateRange.start)
    if (query.dateRange?.end) params.append('to', query.dateRange.end)
    if (query.filters) params.append('filters', JSON.stringify(query.filters))

    const response = await fetch(`${endpoint}?${params.toString()}`)
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    const result = await response.json()
    return result.data || result
  }

  const response = await fetch('/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metricId, query })
  })

  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
  const result = await response.json()
  return result.data || result
}

async function fetchFromSQL(sqlTemplate: string, query: MetricsQuery, dimension: any): Promise<ChartDataPoint[]> {
  let sql = sqlTemplate
  if (dimension?.granularity) sql = sql.replace(/\{\{granularity\}\}/g, dimension.granularity)
  sql = sql.replace(/\{\{aggregation\}\}/g, query.aggregation.toUpperCase())
  if (dimension?.field) sql = sql.replace(/\{\{dimension_field\}\}/g, dimension.field)

  let whereClause = '1=1'
  if (query.filters && query.filters.conditions.length > 0) {
    const conditions = query.filters.conditions.map((c) => {
      switch (c.operator) {
        case 'equals': return `${c.field} = '${c.value}'`
        case 'not_equals': return `${c.field} != '${c.value}'`
        case 'greater_than': return `${c.field} > ${c.value}`
        case 'less_than': return `${c.field} < ${c.value}`
        case 'contains': return `${c.field} LIKE '%${c.value}%'`
        case 'in':
          const values = Array.isArray(c.value) ? c.value : [c.value]
          return `${c.field} IN (${values.map((v: any) => `'${v}'`).join(', ')})`
        default: return '1=1'
      }
    })
    const logic = query.filters.logic === 'OR' ? ' OR ' : ' AND '
    whereClause = `(${conditions.join(logic)})`
  }
  sql = sql.replace(/\{\{filters\}\}/g, whereClause)

  const response = await fetch('/api/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ connection: 'default', query: sql })
  })

  if (!response.ok) throw new Error(`SQL Error: ${response.statusText}`)
  const result = await response.json()
  const rows = result.data || result.rows || result
  return Array.isArray(rows) ? rows : []
}

export function applyFilters(data: ChartDataPoint[], filters: FilterGroup): ChartDataPoint[] {
  if (!filters || filters.conditions.length === 0) return data

  return data.filter((item) => {
    const results = filters.conditions.map((condition) => {
      const fieldValue = item[condition.field]
      switch (condition.operator) {
        case 'equals': return fieldValue === condition.value
        case 'not_equals': return fieldValue !== condition.value
        case 'greater_than': return Number(fieldValue) > Number(condition.value)
        case 'less_than': return Number(fieldValue) < Number(condition.value)
        case 'contains': return String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase())
        case 'in': return Array.isArray(condition.value) && condition.value.includes(fieldValue)
        case 'between':
          if (!Array.isArray(condition.value) || condition.value.length !== 2) return false
          const [min, max] = condition.value
          const numValue = Number(fieldValue)
          return numValue >= min && numValue <= max
        default: return true
      }
    })
    return filters.logic === 'AND' ? results.every((r) => r) : results.some((r) => r)
  })
}

function applySimpleFilters(data: ChartDataPoint[], filters: any[]): ChartDataPoint[] {
  if (!filters || filters.length === 0) return data
  return data.filter((item) => {
    return filters.every((filter) => {
      const fieldValue = item[filter.field]
      const filterValue = filter.value
      switch (filter.operator) {
        case 'equals': return String(fieldValue).toLowerCase() === String(filterValue).toLowerCase()
        case 'not_equals': return String(fieldValue).toLowerCase() !== String(filterValue).toLowerCase()
        case 'contains': return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase())
        case 'greater_than': return Number(fieldValue) > Number(filterValue)
        case 'less_than': return Number(fieldValue) < Number(filterValue)
        default: return true
      }
    })
  })
}

function applyDateRangeFilter(data: ChartDataPoint[], dateRange: { start: string; end: string }): ChartDataPoint[] {
  const start = new Date(dateRange.start)
  const end = new Date(dateRange.end)

  return data.filter((item) => {
    if (!item.timestamp) return true
    const itemDate = new Date(item.timestamp)
    return itemDate >= start && itemDate <= end
  })
}

export function applyAggregation(data: ChartDataPoint[], aggregation: AggregationType, groupBy?: string): ChartDataPoint[] {
  if (!groupBy) {
    const value = calculateAggregation(data.map((d) => d.value), aggregation)
    return [{ label: 'Total', value }]
  }

  const grouped = new Map<string, number[]>()
  data.forEach((item) => {
    const key = String(item[groupBy])
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(item.value)
  })

  const result: ChartDataPoint[] = []
  grouped.forEach((values, label) => {
    result.push({ label, value: calculateAggregation(values, aggregation) })
  })
  return result
}

function calculateAggregation(values: number[], aggregation: AggregationType): number {
  if (values.length === 0) return 0
  switch (aggregation) {
    case 'sum': return values.reduce((sum, v) => sum + v, 0)
    case 'count': return values.length
    case 'avg': return values.reduce((s, v) => s + v, 0) / values.length
    case 'min': return Math.min(...values)
    case 'max': return Math.max(...values)
    case 'median':
      const sorted = [...values].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)
      return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
    default: return 0
  }
}

// ==================== HELPER DE AGREGAÇÃO GENÉRICA ====================

const DIMENSION_FIELD_MAP: Record<string, string> = {
  'csv-emitente': 'emitente',
  'csv-centro-custo': 'centro_custo',
  'csv-unidade': 'unidade',
  'csv-conta-contabil': 'conta_contabil',
  'csv-forma-pagamento': 'forma_pagamento', // Note: record field might not effectively exist or be named differently, checking FinancialRecord definition...
  'csv-status': 'status',

  // Virtual/Special
  'temporal': 'temporal',
  'time-month': 'temporal'
}



function aggregateGeneric(
  records: FinancialRecord[],
  dimension: DimensionDefinition | undefined,
  valueExtractor: (r: FinancialRecord) => number
): ChartDataPoint[] {
  // 1. Scalar (Sem dimensão)
  if (!dimension) {
    const total = records.reduce((acc, r) => acc + valueExtractor(r), 0)
    return [{ label: 'Total', value: total }]
  }

  // 2. Grouped
  const map = new Map<string, number>()
  const isTemporal = dimension.type === 'temporal' || dimension.id === 'temporal' || dimension.id.startsWith('time-')

  // Determine field to group by
  const dimensionId = dimension.id
  const mappedField = DIMENSION_FIELD_MAP[dimensionId] || dimension.field || dimensionId

  records.forEach(r => {
    let key = 'N/A'

    if (isTemporal) {
      const date = r.data_efetivacao || r.data_vencimento || r.data_emissao
      if (date) {
        // Dynamic Granularity based on dimension ID
        if (dimension.id.includes('year')) {
          key = date.substring(0, 4) // YYYY
        } else if (dimension.id.includes('day')) {
          key = date.substring(0, 10) // YYYY-MM-DD
        } else if (dimension.id.includes('week')) {
          const d = new Date(date)
          const onejan = new Date(d.getFullYear(), 0, 1)
          const week = Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7)
          key = `${d.getFullYear()}-W${week.toString().padStart(2, '0')}`
        } else if (dimension.id.includes('quarter')) {
          const d = new Date(date)
          const q = Math.floor(d.getMonth() / 3) + 1
          key = `${d.getFullYear()}-Q${q}`
        } else {
          // Default to Month (includes 'month', 'quarter', etc for now or fallback)
          key = date.substring(0, 7) // YYYY-MM
        }
      } else {
        key = 'Sem Data'
      }
    } else {
      // Categorical
      key = (r as any)[mappedField] || 'Outros'
    }

    const val = valueExtractor(r)
    map.set(key, (map.get(key) || 0) + val)
  })

  // 3. Transform to ChartDataPoint
  let results = Array.from(map.entries()).map(([label, value]) => ({ label, value }))

  // 4. Sort
  if (isTemporal) {
    results.sort((a, b) => a.label.localeCompare(b.label))
  } else {
    // Default categorical sort by value desc
    results.sort((a, b) => b.value - a.value)
  }

  return results
}
