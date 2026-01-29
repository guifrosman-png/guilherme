import React, { useState } from 'react'
import { Plus, X, ChevronDown } from 'lucide-react'
import type {
  MetricsQuery,
  MetricContext,
  FilterCondition,
  FilterGroup
} from '../types'
import {
  getAllMetrics,
  getAllDimensions,
  getMetricById,
  getDimensionById,
  getMetricsByContext,
  getMetricsByChartType,
  getAvailableContexts
} from '../metrics'

interface MetricsConfigPanelProps {
  /**
   * Configuração atual
   */
  config?: MetricsQuery

  /**
   * Callback quando a configuração muda
   */
  onChange: (config: MetricsQuery) => void

  /**
   * Tipo de gráfico atual (para filtrar métricas compatíveis)
   */
  chartType?: string

  /**
   * Callback para aplicar a configuração
   */
  onApply?: () => void

  /**
   * Restringe a biblioteca de métricas a um contexto específico.
   * Quando definido, o seletor de contexto é ocultado e apenas
   * métricas desse contexto são exibidas.
   * Use 'all' ou undefined para mostrar todas as métricas.
   */
  restrictToContext?: MetricContext | 'all'
}

/**
 * ============================================
 * METRICS CONFIG PANEL
 * ============================================
 * Interface completa para configurar Métrica + Dimensão + Filtros
 */
export default function MetricsConfigPanel({
  config,
  onChange,
  chartType,
  onApply,
  restrictToContext
}: MetricsConfigPanelProps) {
  // Estados locais
  // Se restrictToContext está definido e não é 'all', força esse contexto
  const isContextRestricted = restrictToContext && restrictToContext !== 'all'
  const [contextFilter, setContextFilter] = useState<MetricContext | 'all'>(
    isContextRestricted ? restrictToContext : 'all'
  )

  // Buscar definições
  const selectedMetric = config?.metric ? getMetricById(config.metric) : undefined
  const selectedDimension = config?.dimension
    ? getDimensionById(config.dimension)
    : undefined

  // Contextos disponíveis
  const availableContexts = getAvailableContexts()

  // Métricas filtradas
  const filteredMetrics = React.useMemo(() => {
    let metrics = getAllMetrics()

    // Determinar contexto efetivo (restrictToContext tem prioridade)
    const effectiveContext = isContextRestricted ? restrictToContext : contextFilter

    // Filtrar por contexto
    if (effectiveContext !== 'all') {
      metrics = metrics.filter((m) => m.context === effectiveContext)
    }

    // Filtrar por tipo de gráfico compatível
    if (chartType) {
      metrics = metrics.filter((m) => m.chartTypes.includes(chartType))
    }

    return metrics
  }, [contextFilter, chartType, restrictToContext, isContextRestricted])

  // Dimensões disponíveis
  const availableDimensions = getAllDimensions()

  // Handlers
  const updateConfig = (updates: Partial<MetricsQuery>) => {
    onChange({
      metric: config?.metric || '',
      aggregation: config?.aggregation || 'count',
      ...config,
      ...updates
    })
  }

  const addFilter = () => {
    const newCondition: FilterCondition = {
      field: '',
      operator: 'equals',
      value: ''
    }

    const currentFilters = config?.filters || {
      conditions: [],
      logic: 'AND' as const
    }

    updateConfig({
      filters: {
        ...currentFilters,
        conditions: [...currentFilters.conditions, newCondition]
      }
    })
  }

  const updateFilter = (index: number, updates: Partial<FilterCondition>) => {
    if (!config?.filters) return

    const newConditions = [...config.filters.conditions]
    newConditions[index] = { ...newConditions[index], ...updates }

    updateConfig({
      filters: {
        ...config.filters,
        conditions: newConditions
      }
    })
  }

  const removeFilter = (index: number) => {
    if (!config?.filters) return

    const newConditions = config.filters.conditions.filter((_, i) => i !== index)

    updateConfig({
      filters: {
        ...config.filters,
        conditions: newConditions
      }
    })
  }

  const updateFiltersLogic = (logic: 'AND' | 'OR') => {
    if (!config?.filters) return

    updateConfig({
      filters: {
        ...config.filters,
        logic
      }
    })
  }

  const setDatePreset = (
    preset: 'last_7_days' | 'last_30_days' | 'last_3_months' | 'last_year'
  ) => {
    const now = new Date()
    const start = new Date()

    switch (preset) {
      case 'last_7_days':
        start.setDate(now.getDate() - 7)
        break
      case 'last_30_days':
        start.setDate(now.getDate() - 30)
        break
      case 'last_3_months':
        start.setMonth(now.getMonth() - 3)
        break
      case 'last_year':
        start.setFullYear(now.getFullYear() - 1)
        break
    }

    updateConfig({
      dateRange: {
        start: start.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0],
        preset
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* ===== CONTEXTO ===== */}
      {/* Mostra seletor apenas se não houver restrição de contexto */}
      {!isContextRestricted ? (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Contexto
          </label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setContextFilter('all')}
              className={`py-1.5 px-2 text-[10px] font-medium rounded border transition-colors ${
                contextFilter === 'all'
                  ? 'bg-primary text-white border-primary'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              Todos
            </button>
            {availableContexts.map((ctx) => (
              <button
                key={ctx}
                onClick={() => setContextFilter(ctx)}
                className={`py-1.5 px-2 text-[10px] font-medium rounded border transition-colors capitalize ${
                  contextFilter === ctx
                    ? 'bg-primary text-white border-primary'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-xs text-slate-500">Área: </span>
          <span className="text-xs font-medium text-slate-700 capitalize">
            {restrictToContext}
          </span>
        </div>
      )}

      {/* ===== MÉTRICA ===== */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2">
          O que medir? (Métrica)
        </label>
        <select
          value={config?.metric || ''}
          onChange={(e) => {
            const metric = getMetricById(e.target.value)
            updateConfig({
              metric: e.target.value,
              aggregation: metric?.aggregation || 'count'
            })
          }}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
        >
          <option value="">Selecione uma métrica...</option>
          {filteredMetrics.map((metric) => (
            <option key={metric.id} value={metric.id}>
              {metric.name}
            </option>
          ))}
        </select>
        {selectedMetric && (
          <p className="text-[10px] text-slate-500 mt-1">
            {selectedMetric.description}
          </p>
        )}
      </div>

      {/* ===== AGREGAÇÃO ===== */}
      {selectedMetric && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">
            Como agregar?
          </label>
          <div className="grid grid-cols-3 gap-1">
            {(['count', 'sum', 'avg', 'min', 'max'] as const).map((agg) => (
              <button
                key={agg}
                onClick={() => updateConfig({ aggregation: agg })}
                className={`py-1.5 px-2 text-[10px] font-medium rounded border transition-colors uppercase ${
                  config?.aggregation === agg
                    ? 'bg-primary text-white border-primary'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {agg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== DIMENSÃO ===== */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2">
          Agrupar por? (Dimensão)
          <span className="text-[10px] text-slate-400 ml-1">(opcional)</span>
        </label>
        <select
          value={config?.dimension || ''}
          onChange={(e) =>
            updateConfig({
              dimension: e.target.value || undefined
            })
          }
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
        >
          <option value="">Nenhum agrupamento</option>
          <optgroup label="Temporal">
            {availableDimensions
              .filter((d) => d.type === 'temporal')
              .map((dim) => (
                <option key={dim.id} value={dim.id}>
                  {dim.name}
                </option>
              ))}
          </optgroup>
          <optgroup label="Categórica">
            {availableDimensions
              .filter((d) => d.type === 'categorical')
              .map((dim) => (
                <option key={dim.id} value={dim.id}>
                  {dim.name}
                </option>
              ))}
          </optgroup>
        </select>
        {selectedDimension && selectedDimension.description && (
          <p className="text-[10px] text-slate-500 mt-1">
            {selectedDimension.description}
          </p>
        )}
      </div>

      {/* ===== FILTROS ===== */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-slate-600">Filtros</label>
          <button
            onClick={addFilter}
            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
          >
            <Plus className="h-3 w-3" />
            Adicionar
          </button>
        </div>

        {config?.filters && config.filters.conditions.length > 0 && (
          <div className="space-y-2">
            {config.filters.conditions.map((filter, index) => (
              <div
                key={index}
                className="p-2 border border-slate-200 rounded-lg space-y-2 bg-slate-50"
              >
                {/* Campo */}
                <input
                  type="text"
                  value={filter.field}
                  onChange={(e) =>
                    updateFilter(index, { field: e.target.value })
                  }
                  placeholder="Nome do campo..."
                  className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:border-primary outline-none"
                />

                {/* Operador e Valor */}
                <div className="grid grid-cols-[1fr,2fr,auto] gap-1">
                  <select
                    value={filter.operator}
                    onChange={(e) =>
                      updateFilter(index, {
                        operator: e.target.value as FilterCondition['operator']
                      })
                    }
                    className="px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:border-primary outline-none"
                  >
                    <option value="equals">=</option>
                    <option value="not_equals">≠</option>
                    <option value="greater_than">&gt;</option>
                    <option value="less_than">&lt;</option>
                    <option value="contains">contém</option>
                    <option value="in">in</option>
                  </select>

                  <input
                    type="text"
                    value={String(filter.value)}
                    onChange={(e) =>
                      updateFilter(index, { value: e.target.value })
                    }
                    placeholder="Valor..."
                    className="px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:border-primary outline-none"
                  />

                  <button
                    onClick={() => removeFilter(index)}
                    className="px-2 text-xs text-red-600 hover:text-red-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Lógica AND/OR */}
            {config.filters.conditions.length > 1 && (
              <div className="flex gap-2 items-center text-xs">
                <span className="text-slate-500">Combinar com:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateFiltersLogic('AND')}
                    className={`px-3 py-1 rounded text-[10px] font-medium ${
                      config.filters.logic === 'AND'
                        ? 'bg-primary text-white'
                        : 'border border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    E (AND)
                  </button>
                  <button
                    onClick={() => updateFiltersLogic('OR')}
                    className={`px-3 py-1 rounded text-[10px] font-medium ${
                      config.filters.logic === 'OR'
                        ? 'bg-primary text-white'
                        : 'border border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    OU (OR)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(!config?.filters || config.filters.conditions.length === 0) && (
          <p className="text-xs text-slate-400 italic">Nenhum filtro aplicado</p>
        )}
      </div>

      {/* ===== PERÍODO ===== */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-2">
          Período
        </label>
        <div className="grid grid-cols-2 gap-1 mb-2">
          {[
            { label: 'Últimos 7 dias', value: 'last_7_days' as const },
            { label: 'Últimos 30 dias', value: 'last_30_days' as const },
            { label: 'Últimos 3 meses', value: 'last_3_months' as const },
            { label: 'Último ano', value: 'last_year' as const }
          ].map((preset) => (
            <button
              key={preset.value}
              onClick={() => setDatePreset(preset.value)}
              className={`py-1 px-2 text-[10px] rounded border font-medium transition-colors ${
                config?.dateRange?.preset === preset.value
                  ? 'bg-primary text-white border-primary'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom date range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] text-slate-500 block mb-0.5">De:</label>
            <input
              type="date"
              value={config?.dateRange?.start || ''}
              onChange={(e) =>
                updateConfig({
                  dateRange: {
                    ...config?.dateRange,
                    start: e.target.value,
                    end: config?.dateRange?.end || e.target.value,
                    preset: 'custom'
                  }
                })
              }
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] text-slate-500 block mb-0.5">Até:</label>
            <input
              type="date"
              value={config?.dateRange?.end || ''}
              onChange={(e) =>
                updateConfig({
                  dateRange: {
                    ...config?.dateRange,
                    start: config?.dateRange?.start || e.target.value,
                    end: e.target.value,
                    preset: 'custom'
                  }
                })
              }
              className="w-full px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      {/* ===== PREVIEW ===== */}
      {config?.metric && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs font-medium text-blue-700 mb-2">
            📊 Preview da Configuração
          </div>
          <div className="space-y-1 text-[10px] text-blue-600">
            <div>
              <span className="font-medium">Métrica:</span>{' '}
              {selectedMetric?.name} ({config.aggregation?.toUpperCase()})
            </div>
            {config.dimension && (
              <div>
                <span className="font-medium">Agrupado por:</span>{' '}
                {selectedDimension?.name}
              </div>
            )}
            {config.filters && config.filters.conditions.length > 0 && (
              <div>
                <span className="font-medium">Filtros:</span>{' '}
                {config.filters.conditions.length} aplicado(s) (
                {config.filters.logic})
              </div>
            )}
            {config.dateRange && (
              <div>
                <span className="font-medium">Período:</span>{' '}
                {config.dateRange.preset
                  ? config.dateRange.preset.replace(/_/g, ' ')
                  : `${config.dateRange.start} a ${config.dateRange.end}`}
              </div>
            )}
          </div>

          {/* Botão Aplicar */}
          {onApply && (
            <button
              onClick={onApply}
              className="w-full mt-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Aplicar Configuração
            </button>
          )}
        </div>
      )}
    </div>
  )
}
