import { useState, useEffect, useRef, useCallback } from 'react'
import type {
  DataSourceConfig,
  ChartDataPoint,
  UseDataSourceResult
} from '../types'

/**
 * Hook para buscar dados de diferentes fontes (API, SQL)
 * Suporta auto-refresh e mapeamento de campos
 */
export function useDataSource(
  config: DataSourceConfig | undefined
): UseDataSourceResult {
  const [data, setData] = useState<ChartDataPoint[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    if (!config || config.type === 'static') {
      setData(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (config.type === 'api' && config.endpoint) {
        const response = await fetch(config.endpoint, {
          method: config.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers
          },
          ...(config.method === 'POST' &&
            config.body && { body: JSON.stringify(config.body) })
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const rawData = await response.json()

        // Aplicar mapeamento de campos
        const mappedData = transformApiData(rawData, config.mapping)
        setData(mappedData)
      } else if (config.type === 'sql' && config.query) {
        // Para SQL, fazer requisição para um endpoint backend que executa a query
        const response = await fetch('/api/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            connection: config.connection || 'default',
            query: config.query
          })
        })

        if (!response.ok) {
          throw new Error(`SQL Error: ${response.statusText}`)
        }

        const rawData = await response.json()
        const mappedData = transformApiData(rawData, config.mapping)
        setData(mappedData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar dados')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [config])

  // Fetch inicial e setup de refresh interval
  useEffect(() => {
    fetchData()

    // Limpar interval anterior
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Configurar novo interval se necessário
    if (config?.refreshInterval && config.refreshInterval > 0) {
      intervalRef.current = setInterval(
        fetchData,
        config.refreshInterval * 1000
      )
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [config, fetchData])

  return { data, loading, error, refresh: fetchData }
}

/**
 * Função auxiliar para transformar dados da API/SQL para o formato de gráficos
 */
export function transformApiData(
  rawData: unknown,
  mapping?: DataSourceConfig['mapping']
): ChartDataPoint[] {
  // Se rawData já for um array
  if (Array.isArray(rawData)) {
    return rawData.map((item, index) => ({
      label: mapping?.labels
        ? String(item[mapping.labels])
        : `Item ${index + 1}`,
      value: mapping?.values
        ? Number(item[mapping.values]) || 0
        : Number(item.value) || 0,
      ...item
    }))
  }

  // Se rawData tiver uma propriedade data que é array
  if (
    rawData &&
    typeof rawData === 'object' &&
    'data' in rawData &&
    Array.isArray((rawData as { data: unknown[] }).data)
  ) {
    return transformApiData((rawData as { data: unknown[] }).data, mapping)
  }

  // Se rawData tiver uma propriedade rows (comum em queries SQL)
  if (
    rawData &&
    typeof rawData === 'object' &&
    'rows' in rawData &&
    Array.isArray((rawData as { rows: unknown[] }).rows)
  ) {
    return transformApiData((rawData as { rows: unknown[] }).rows, mapping)
  }

  return []
}
