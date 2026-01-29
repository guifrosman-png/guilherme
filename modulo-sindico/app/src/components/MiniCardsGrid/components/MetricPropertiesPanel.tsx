import React, { useState, useEffect } from 'react'
import {
    Trash2,
    Plus,
    Settings2,
    ChevronDown,
    ChevronRight,
    Info,
    Pencil,
    Layout,
    Lightbulb,
    Tag,
    GripVertical,
    Filter,
    Bold,
    Italic,
    Underline,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Clock,
    History
} from 'lucide-react'

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
    CanvasComponent,
    DataSourceConfig,
    MetricsQuery,
    AggregationType,
    ChartConfig, MetricDefinition, ContextFilterType
} from '../types'

import { AVAILABLE_COMPONENTS, COLOR_OPTIONS, DEFAULT_PALETTE } from '../constants'
import { EXAMPLE_METRICS } from '../metrics'
import { ALL_DIMENSIONS, TEMPORAL_DIMENSIONS } from '../metrics'
import { MOCK_COLUMNS } from '../hooks/useExplorarData'
import { useMetricsBuilder } from '../hooks/useMetricsBuilder'


interface MetricPropertiesPanelProps {
    selectedComponent: CanvasComponent | null
    onUpdate: (component: CanvasComponent) => void
    showPreview: boolean
    metricsExpanded: boolean
    onToggleMetrics: () => void
    selectedMetric: string | null
    onSelectMetric: (index: number, f: 'metric' | 'aggregation', v: string) => void
    contextFilter?: ContextFilterType
    disableCompatibilityFilter?: boolean
}

type TabType = 'chart' | 'options'

// === Sortable Item Component ===
function SortableMetricCard({
    id,
    index,
    metricItem,
    handleRemoveMetric,
    handleUpdateMetric,
    filters,
    onUpdateFilters,
    contextFilter = 'all',
    selectedChartType,
    disableCompatibilityFilter = false,
    dimension,
    onUpdateDimension
}: {
    id: string
    index: number
    metricItem: { metric: string, aggregation: string, color?: string }
    handleRemoveMetric: (index: number) => void
    handleUpdateMetric: (index: number, field: 'metric' | 'aggregation' | 'color', value: string) => void
    filters?: Array<{ field: string; operator: any; value: unknown }>
    onUpdateFilters: (filters: Array<{ field: string; operator: any; value: unknown }>) => void
    contextFilter?: ContextFilterType
    selectedChartType: string
    disableCompatibilityFilter?: boolean
    dimension?: any
    onUpdateDimension?: (dim: any) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 space-y-3 relative group transition-all hover:shadow-md"
        >
            {/* Header Line */}
            <div className="flex items-center gap-3">
                {/* Drag Handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-move text-slate-300 hover:text-slate-500 touch-none"
                    title="Arrastar para reordenar"
                >
                    <GripVertical className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                    {index + 1}
                </div>

                <span className="text-xs font-bold text-slate-800 flex-1 truncate">
                    {EXAMPLE_METRICS.find(m => m.id === metricItem.metric)?.name || 'Selecione uma métrica...'}
                </span>

                <button className="text-slate-300 hover:text-blue-500 transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => handleRemoveMetric(index)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                    title="Remover métrica"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Metric Selector */}
            <div className="relative">
                <select
                    className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border-none rounded-md appearance-none focus:ring-1 focus:ring-blue-500 outline-none text-slate-700 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
                    value={metricItem.metric}
                    onChange={(e) => {
                        const m = EXAMPLE_METRICS.find(m => m.id === e.target.value)
                        if (m) {
                            handleUpdateMetric(index, 'metric', m.id)
                        }
                    }}
                >
                    <option value="" disabled>Selecione uma métrica...</option>
                    {/* Metrics List - GROUPED BY CATEGORY */}
                    {(() => {
                        const filteredMetrics = EXAMPLE_METRICS.filter(m => {
                            // 1. Context Filter
                            if (contextFilter !== 'all' && m.context !== contextFilter && m.context !== 'geral') {
                                return false
                            }

                            // 2. Chart Compatibility Smart Filter
                            // If disabled (e.g. during creation flow), show all metrics
                            if (disableCompatibilityFilter) return true

                            const isKPI = ['value', 'trend', 'progress', 'kpi-unified', 'badge', 'card'].includes(selectedChartType)
                            if (isKPI) {
                                if (!m.chartTypes || m.chartTypes.length === 0) return true
                                return m.chartTypes.some(t => ['kpi', 'value', 'trend', 'card', 'kpi-unified'].includes(t))
                            }

                            // For Charts, check explicit compatibility
                            if (!m.chartTypes || m.chartTypes.length === 0) return true
                            if (selectedChartType === 'recharts-composed') {
                                return m.chartTypes.includes('recharts-bar') || m.chartTypes.includes('recharts-line')
                            }
                            return m.chartTypes.includes(selectedChartType)
                        })

                        // Group by category
                        const categoryLabels: Record<string, string> = {
                            'valores': '📊 Análises por Valores',
                            'tempo': '📈 Análises por Tempo',
                            'fornecedor': '👥 Análises por Fornecedor',
                            'contabil': '💼 Análises Contábeis',
                            'pagamento': '💳 Análises de Pagamento',
                            'parcelamento': '📦 Análises de Parcelamento',
                            'kpis': '🎯 KPIs Consolidados'
                        }

                        const groupedMetrics: Record<string, typeof filteredMetrics> = {}
                        const uncategorized: typeof filteredMetrics = []

                        filteredMetrics.forEach(m => {
                            if (m.category) {
                                if (!groupedMetrics[m.category]) {
                                    groupedMetrics[m.category] = []
                                }
                                groupedMetrics[m.category].push(m)
                            } else {
                                uncategorized.push(m)
                            }
                        })

                        // Sort metrics within each category by subcategory
                        Object.keys(groupedMetrics).forEach(cat => {
                            groupedMetrics[cat].sort((a, b) => {
                                const subA = a.subcategory || ''
                                const subB = b.subcategory || ''
                                return subA.localeCompare(subB)
                            })
                        })


                        return (
                            <>
                                {/* Render each category group */}
                                {Object.entries(groupedMetrics).map(([category, metrics]) => (
                                    <optgroup key={category} label={categoryLabels[category] || category}>
                                        {metrics.map((metric) => (
                                            <option key={metric.id} value={metric.id}>
                                                {metric.subcategory ? `${metric.subcategory} ` : ''}{metric.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}

                                {/* Uncategorized metrics */}
                                {uncategorized.length > 0 && (
                                    <optgroup label="📋 Outras Métricas">
                                        {uncategorized.map((metric) => (
                                            <option key={metric.id} value={metric.id}>
                                                {metric.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                )}
                            </>
                        )
                    })()}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>


            {/* Filters List */}
            {
                filters && filters.length > 0 && (
                    <div className="space-y-1.5 pt-1 animate-fadeIn">
                        {filters.map((filter, i) => (
                            <div key={i} className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded border border-slate-200 group relative">
                                <span className="text-[10px] font-bold text-slate-500 uppercase px-0.5">Onde</span>

                                {/* Field */}
                                <select
                                    value={filter.field}
                                    onChange={(e) => {
                                        const newFilters = [...filters]
                                        newFilters[i] = { ...filter, field: e.target.value }
                                        onUpdateFilters(newFilters)
                                    }}
                                    className="max-w-[100px] px-1 py-0.5 text-[10px] bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none truncate"
                                >
                                    <option value="" disabled>Campo</option>
                                    {(() => {
                                        // Selecionar colunas baseado no tipo de métrica
                                        const isCSVMetric = metricItem.metric?.startsWith('csv-')
                                        const columnsSource = isCSVMetric ? MOCK_COLUMNS.csv : MOCK_COLUMNS.report
                                        const dimensions = columnsSource.filter(col => col.type === 'string')
                                        const measures = columnsSource.filter(col => col.type !== 'string')

                                        return (
                                            <>
                                                <optgroup label="Atributos">
                                                    {dimensions.map(col => (
                                                        <option key={col.key} value={col.key}>{col.label}</option>
                                                    ))}
                                                </optgroup>
                                                <optgroup label="Valores">
                                                    {measures.map(col => (
                                                        <option key={col.key} value={col.key}>{col.label}</option>
                                                    ))}
                                                </optgroup>
                                            </>
                                        )
                                    })()}
                                </select>

                                {/* Operator */}
                                < select
                                    value={filter.operator}
                                    onChange={(e) => {
                                        const newFilters = [...filters]
                                        newFilters[i] = { ...filter, operator: e.target.value as any }
                                        onUpdateFilters(newFilters)
                                    }}
                                    className="w-16 px-1 py-0.5 text-[10px] bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                >
                                    {(() => {
                                        const isCSVMetric = metricItem.metric?.startsWith('csv-')
                                        const columnsSource = isCSVMetric ? MOCK_COLUMNS.csv : MOCK_COLUMNS.report
                                        const colDef = columnsSource.find(c => c.key === filter.field)
                                        const isNumeric = colDef?.type === 'number' || colDef?.type === 'currency' || colDef?.type === 'date'

                                        if (isNumeric) {
                                            return (
                                                <>
                                                    <option value="equals">igual</option>
                                                    <option value="not_equals">≠</option>
                                                    <option value="greater_than">&gt;</option>
                                                    <option value="less_than">&lt;</option>
                                                    <option value="between">entre</option>
                                                </>
                                            )
                                        }
                                        return (
                                            <>
                                                <option value="contains">contém</option>
                                                <option value="equals">igual</option>
                                                <option value="not_equals">≠</option>
                                            </>
                                        )
                                    })()}
                                </select>

                                {/* Value */}
                                < input
                                    type="text"
                                    value={filter.value as string}
                                    onChange={(e) => {
                                        const newFilters = [...filters]
                                        newFilters[i] = { ...filter, value: e.target.value }
                                        onUpdateFilters(newFilters)
                                    }}
                                    className="flex-1 min-w-[60px] px-1 py-0.5 text-[10px] bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Valor"
                                />

                                <button
                                    onClick={() => {
                                        const newFilters = [...filters]
                                        newFilters.splice(i, 1)
                                        onUpdateFilters(newFilters)
                                    }}
                                    className="text-slate-400 hover:text-red-500 transition-colors ml-auto"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button >
                            </div >
                        ))
                        }
                    </div >
                )
            }

            {/* Add Filter Button */}
            <button
                onClick={() => {
                    const newFilters = [...(filters || [])]
                    newFilters.push({ field: 'Agrupador', operator: 'contains', value: '' })
                    onUpdateFilters(newFilters)
                }}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors w-fit px-1 -ml-1 py-1 rounded hover:bg-blue-50 mt-1"
            >
                <Plus className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">Adicionar filtro</span>
            </button >
        </div >
    )
}

function SectionTooltip({ text, side = 'top' }: { text: string, side?: 'top' | 'bottom' }) {
    const positionClasses = side === 'top'
        ? 'bottom-full mb-2 after:top-full after:border-t-slate-800'
        : 'top-full mt-2 after:bottom-full after:border-b-slate-800'

    return (
        <div
            className="relative group/tooltip flex items-center justify-center ml-1.5 z-50"
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <div className="cursor-help text-slate-300 hover:text-blue-500 transition-colors">
                <Info className="h-3.5 w-3.5" />
            </div>
            {/* Tooltip */}
            <div className={`absolute ${positionClasses} hidden group-hover/tooltip:block w-48 p-2 bg-slate-800 text-white text-[10px] leading-tight rounded shadow-lg left-1/2 -translate-x-1/2 after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent pointer-events-none animate-in fade-in zoom-in-95 duration-200 font-normal normal-case tracking-normal`}>
                {text}
            </div>
        </div >
    )
}


export function MetricPropertiesPanel({
    selectedComponent,
    onUpdate,
    showPreview,
    metricsExpanded,
    onToggleMetrics,
    selectedMetric,
    onSelectMetric,
    contextFilter = 'all',
    disableCompatibilityFilter = false
}: MetricPropertiesPanelProps) {
    const [activeTab, setActiveTab] = useState<TabType>('chart')
    // Start expanded if custom to show inputs
    const [periodExpanded, setPeriodExpanded] = useState(() => {
        return selectedComponent?.dataSource?.metricsQuery?.dateRange?.preset === 'custom'
    })


    const DATE_PRESET_LABELS: Record<string, string> = {
        last_7_days: 'Últimos 7 dias',
        last_30_days: 'Últimos 30 dias',
        this_month: 'Este Mês',
        last_month: 'Mês Passado',
        last_3_months: 'Últimos 3 meses',
        this_year: 'Este Ano',
        last_year: 'Últimos 12 meses',
        custom: 'Personalizado'
    }

    // Safely access metricsQuery for the hook (even if selectedComponent is null)
    const metricsQuery = selectedComponent?.dataSource?.metricsQuery

    // HYDRATION FIX: Ensure start/end dates exist if preset is set
    // This fixes the issue where default "Last 30 Days" is visual only but missing actual date values
    useEffect(() => {
        if (!selectedComponent) return
        const currentRange = selectedComponent.dataSource?.metricsQuery?.dateRange
        const hasDates = currentRange?.start && currentRange?.end
        const preset = currentRange?.preset || 'last_30_days' // Default to 30 days if nothing set

        // Only auto-hydrate if missing dates but we have a preset (or default)
        if (!hasDates && preset !== 'custom') {
            const today = new Date()
            const start = new Date()
            const end = new Date()

            switch (preset) {
                case 'last_7_days': start.setDate(today.getDate() - 6); break
                case 'last_30_days': start.setDate(today.getDate() - 29); break
                case 'last_3_months': start.setMonth(today.getMonth() - 3); break
                case 'last_year': start.setFullYear(today.getFullYear() - 1); break
                case 'this_month': start.setDate(1); break
                case 'last_month': start.setMonth(today.getMonth() - 1); start.setDate(1); end.setDate(0); break
                case 'this_year': start.setMonth(0, 1); break
                case 'this_year': start.setMonth(0, 1); break
            }

            start.setHours(0, 0, 0, 0)
            end.setHours(23, 59, 59, 999)

            console.log('[MetricPropertiesPanel] Auto-hydrating missing dates for preset:', preset)
            const currentQuery = selectedComponent.dataSource?.metricsQuery || { metric: '', aggregation: 'sum' }

            // Directly calling update via parent handler to ensure state sync
            onUpdate({
                ...selectedComponent,
                dataSource: {
                    ...(selectedComponent.dataSource || { type: 'metrics', mapping: {} }),
                    metricsQuery: {
                        ...currentQuery,
                        dateRange: {
                            preset,
                            start: start.toISOString(),
                            end: end.toISOString()
                        }
                    }
                }
            })
        }
    }, [selectedComponent?.id]) // Run once per component selection


    // Fetch metric data for preview/helper context
    const { data: metricData, loading: metricLoading } = useMetricsBuilder(metricsQuery)
    const currentMetricValue = metricData && metricData.length > 0
        ? metricData.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0)
        : 0

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    if (!selectedComponent) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <Settings2 className="h-8 w-8 opacity-50" />
                </div>
                <p className="text-sm font-medium text-slate-600">Nenhum gráfico selecionado</p>
                <p className="text-xs mt-1">Selecione um gráfico no canvas para configurar.</p>
            </div>
        )
    }

    const { type, props, dataSource } = selectedComponent
    const isChart = type.startsWith('recharts-') || type.startsWith('chart-')

    // === Helpers de Atualização ===

    const updateDataSource = (updates: Partial<DataSourceConfig>) => {
        onUpdate({
            ...selectedComponent,
            dataSource: {
                ...(selectedComponent.dataSource || { type: 'metrics', mapping: {} }),
                ...updates
            }
        })
    }

    const updateComponentProps = (id: string, newProps: Record<string, unknown>) => {
        onUpdate({
            ...selectedComponent,
            props: {
                ...selectedComponent.props,
                ...newProps
            }
        })
    }

    const updateMetricsQuery = (updates: Partial<MetricsQuery>) => {
        const currentQuery = dataSource?.metricsQuery || { metric: '', aggregation: 'sum' }
        updateDataSource({
            type: 'metrics',
            metricsQuery: { ...currentQuery, ...updates }
        })
    }

    // === Lógica de Múltiplas Métricas ===

    const metricsList = [
        {
            metric: dataSource?.metricsQuery?.metric || '',
            aggregation: dataSource?.metricsQuery?.aggregation || 'sum',
            color: dataSource?.metricsQuery?.color
        },
        ...(dataSource?.metricsQuery?.additionalMetrics || [])
    ]

    const handleAddMetric = () => {
        const currentAdditional = dataSource?.metricsQuery?.additionalMetrics || []
        updateMetricsQuery({
            additionalMetrics: [
                ...currentAdditional,
                { metric: '', aggregation: 'sum' }
            ]
        })
    }

    const handleUpdateMetric = (index: number, field: 'metric' | 'aggregation' | 'color', value: string) => {
        if (index === 0) {
            // Updating Primary Metric
            const currentQuery = dataSource?.metricsQuery || { metric: '', aggregation: 'sum' }
            const newMetricsQuery = { ...currentQuery, [field]: value }

            const newDataSource = {
                ...(selectedComponent.dataSource || { type: 'metrics', mapping: {} }),
                type: 'metrics',
                metricsQuery: newMetricsQuery
            } as DataSourceConfig // Explicit cast to fix type checking

            let newProps = { ...selectedComponent.props }

            // Auto-update visual props when metric changes
            if (field === 'metric') {
                const metricDef = EXAMPLE_METRICS.find(m => m.id === value)
                if (metricDef) {
                    newProps = {
                        ...newProps,
                        title: metricDef.name,
                        iconType: metricDef.defaultIcon,
                        format: metricDef.format
                    }
                }
            }

            // Single Atomic Update
            onUpdate({
                ...selectedComponent,
                dataSource: newDataSource,
                props: newProps
            })
        } else {
            // Updating Additional Metric
            const currentAdditional = [...(dataSource?.metricsQuery?.additionalMetrics || [])]
            const additionalIndex = index - 1
            if (currentAdditional[additionalIndex]) {
                currentAdditional[additionalIndex] = {
                    ...currentAdditional[additionalIndex],
                    [field]: value
                }
            }
            updateMetricsQuery({ additionalMetrics: currentAdditional })
        }
    }

    const handleRemoveMetric = (index: number) => {
        if (index === 0) {
            updateMetricsQuery({ metric: '' })
        } else {
            const currentAdditional = [...(dataSource?.metricsQuery?.additionalMetrics || [])]
            currentAdditional.splice(index - 1, 1)
            updateMetricsQuery({ additionalMetrics: currentAdditional })
        }
    }

    // === Lógica de Drag & Drop ===
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = parseInt(active.id as string)
            const newIndex = parseInt(over?.id as string)

            // Reorder flat array
            const newOrder = arrayMove(metricsList, oldIndex, newIndex)

            // Reconstruct query
            const newPrimary = newOrder[0]
            const newAdditional = newOrder.slice(1)

            updateMetricsQuery({
                metric: newPrimary.metric,
                aggregation: newPrimary.aggregation as AggregationType,
                additionalMetrics: newAdditional as any[]
            })
        }
    }


    // -- RENDERERS --

    // Calculate Period Label
    const currentPreset = dataSource?.metricsQuery?.dateRange?.preset || 'last_30_days'
    const presetName = DATE_PRESET_LABELS[currentPreset] || currentPreset
    let periodLabel = presetName

    if (dataSource?.metricsQuery?.dateRange?.start && dataSource?.metricsQuery?.dateRange?.end) {
        const formatDate = (d: string) => {
            if (!d) return ''

            // Handle ISO strings with time component "YYYY-MM-DDTHH:mm:ss.sssZ"
            // or simple "YYYY-MM-DD"
            const datePart = d.includes('T') ? d.split('T')[0] : d

            if (datePart.includes('-')) {
                const parts = datePart.split('-')
                // Ensure we have 3 parts YYYY-MM-DD
                if (parts.length === 3) {
                    const [year, month, day] = parts.map(Number)
                    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
                    }
                }
            }

            // Fallback to standard Date object if manual parsing fails
            const date = new Date(d)
            if (isNaN(date.getTime())) return d // Return original if invalid
            return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`
        }

        // Dont show preset name if custom, because it is redundant or "Personalizado" which is fine but user asked for format
        if (currentPreset === 'custom') {
            periodLabel = `${formatDate(dataSource.metricsQuery.dateRange.start)} - ${formatDate(dataSource.metricsQuery.dateRange.end)}`
        } else {
            periodLabel = `${presetName} (${formatDate(dataSource.metricsQuery.dateRange.start)} - ${formatDate(dataSource.metricsQuery.dateRange.end)})`
        }
    }

    const renderChartTab = () => (
        <div className="space-y-6 animate-fadeIn pb-8">


            {/* Period Section */}
            <div className="space-y-3 relative z-30">
                <button
                    onClick={() => setPeriodExpanded(!periodExpanded)}
                    className="flex items-center justify-between w-full group"
                >
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-800" />
                        <span className="text-xs font-bold text-slate-800">Período</span>
                        <SectionTooltip text="Defina o intervalo de tempo para análise dos dados." side="bottom" />
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded-full text-slate-500 font-medium ml-1">
                            {periodLabel}
                        </span>
                    </div>
                    {periodExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                </button>

                {periodExpanded && (
                    <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200 animate-fadeIn">
                        {/* Global Filter Warning - Intercom Style */}
                        <div className="bg-blue-50 border border-blue-100 rounded p-2 flex gap-2 items-start">
                            <Info className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-blue-700 leading-tight">
                                <strong>Atenção:</strong> A data selecionada abaixo é usada apenas no editor.
                                Ao visualizar o relatório, o <strong>Filtro Global</strong> (topo da página) terá prioridade sobre todos os cards.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <select
                                className="w-full text-xs p-2 rounded bg-white border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                                value={dataSource?.metricsQuery?.dateRange?.preset || 'last_30_days'}
                                onChange={(e) => {
                                    const preset = e.target.value as any
                                    const today = new Date()
                                    const start = new Date()
                                    const end = new Date()

                                    // Handle 'custom' case first
                                    if (preset === 'custom') {
                                        const currentStart = dataSource?.metricsQuery?.dateRange?.start || new Date().toISOString()
                                        const currentEnd = dataSource?.metricsQuery?.dateRange?.end || new Date().toISOString()
                                        updateMetricsQuery({
                                            dateRange: {
                                                preset: 'custom',
                                                start: currentStart,
                                                end: currentEnd
                                            }
                                        })
                                        return
                                    }

                                    // Calculate dates based on preset
                                    switch (preset) {
                                        case 'last_7_days':
                                            start.setDate(today.getDate() - 6)
                                            break
                                        case 'last_30_days':
                                            start.setDate(today.getDate() - 29)
                                            break
                                        case 'last_3_months':
                                            start.setMonth(today.getMonth() - 3)
                                            break
                                        case 'last_year':
                                            start.setFullYear(today.getFullYear() - 1)
                                            start.setMonth(0, 1) // Jan 1st
                                            end.setFullYear(today.getFullYear() - 1)
                                            end.setMonth(11, 31) // Dec 31st
                                            break
                                        case 'this_month':
                                            start.setDate(1)
                                            break
                                        case 'last_month':
                                            start.setMonth(today.getMonth() - 1)
                                            start.setDate(1)
                                            end.setDate(0) // Last day of previous month
                                            break
                                        case 'this_year':
                                            start.setMonth(0, 1) // Jan 1st
                                            break
                                    }

                                    // Robust Start/End Day Normalization
                                    start.setHours(0, 0, 0, 0)
                                    end.setHours(23, 59, 59, 999)

                                    updateMetricsQuery({
                                        dateRange: {
                                            preset,
                                            start: start.toISOString(),
                                            end: end.toISOString()
                                        }
                                    })
                                }}
                            >
                                <option value="last_7_days">Últimos 7 dias</option>
                                <option value="last_30_days">Últimos 30 dias</option>
                                <option value="this_month">Este mês</option>
                                <option value="last_month">Mês passado</option>
                                <option value="last_3_months">Últimos 3 meses</option>
                                <option value="this_year">Este ano</option>
                                <option value="last_year">Último ano</option>
                                <option value="custom">Personalizado</option>
                            </select>

                            {/* CUSTOM DATE PICKERS */}
                            {(dataSource?.metricsQuery?.dateRange?.preset === 'custom') && (
                                <div className="mt-3 border-t border-slate-200 pt-3 space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-medium ml-1">Início</label>
                                        <input
                                            type="date"
                                            className="w-full text-xs p-1.5 rounded bg-white border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                                            value={dataSource?.metricsQuery?.dateRange?.start ? dataSource.metricsQuery.dateRange.start.split('T')[0] : ''}
                                            onChange={(e) => {
                                                if (!e.target.value) return
                                                const newStart = new Date(e.target.value)
                                                newStart.setHours(0, 0, 0, 0)

                                                updateMetricsQuery({
                                                    dateRange: {
                                                        ...dataSource?.metricsQuery?.dateRange,
                                                        preset: 'custom',
                                                        start: newStart.toISOString()
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-slate-500 font-medium ml-1">Fim</label>
                                        <input
                                            type="date"
                                            className="w-full text-xs p-1.5 rounded bg-white border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                                            value={dataSource?.metricsQuery?.dateRange?.end ? dataSource.metricsQuery.dateRange.end.split('T')[0] : ''}
                                            onChange={(e) => {
                                                if (!e.target.value) return
                                                const newEnd = new Date(e.target.value)
                                                newEnd.setHours(23, 59, 59, 999)

                                                updateMetricsQuery({
                                                    dateRange: {
                                                        ...dataSource?.metricsQuery?.dateRange,
                                                        preset: 'custom',
                                                        end: newEnd.toISOString()
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-2">
                                    <History className="text-slate-400 h-3.5 w-3.5" />
                                    <span className="text-xs font-medium text-slate-600">Comparar com período anterior</span>
                                </div>
                                <button
                                    type="button"
                                    className={`w-8 h-4 shrink-0 rounded-full relative transition-colors duration-200 ${dataSource?.metricsQuery?.compareWithPrevious
                                        ? 'bg-blue-600'
                                        : 'bg-slate-200'
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        updateMetricsQuery({
                                            compareWithPrevious: !dataSource?.metricsQuery?.compareWithPrevious
                                        })
                                    }}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${dataSource?.metricsQuery?.compareWithPrevious ? 'translate-x-4' : 'translate-x-0'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div >

            {/* Metrics Section - HIDDEN for layout components (divider/spacer) */}
            {
                !['divider', 'spacer'].includes(type) && <div className="space-y-3 relative z-10">
                    <button
                        onClick={onToggleMetrics}
                        className="flex items-center justify-between w-full group"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">Métricas</span>
                            <SectionTooltip text="Gerencie os indicadores (KPIs) exibidos no gráfico." side="bottom" />
                            <span className="text-xs px-1.5 py-0.5 bg-slate-100 rounded-full text-slate-600 font-medium">{metricsList.length}</span>
                        </div>
                        {metricsExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                    </button>

                    {metricsExpanded && (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={metricsList.map((_, i) => String(i))}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {metricsList.map((metricItem, index) => (
                                        <SortableMetricCard
                                            key={index} // Note: Using index as key is acceptable here because we re-create the list on dragEnd, but standard Dnd might prefer stable IDs. For visual swap it's ok.
                                            id={String(index)}
                                            index={index}
                                            metricItem={metricItem}
                                            handleRemoveMetric={handleRemoveMetric}
                                            handleUpdateMetric={handleUpdateMetric}
                                            filters={dataSource?.metricsQuery?.simpleFilters}
                                            onUpdateFilters={(filters) => updateMetricsQuery({ simpleFilters: filters })}
                                            contextFilter={contextFilter}
                                            selectedChartType={type}
                                            disableCompatibilityFilter={disableCompatibilityFilter}
                                            dimension={dataSource?.metricsQuery?.dimension}
                                            onUpdateDimension={(dim) => updateMetricsQuery({ dimension: dim })}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* Add Metric Button - Only for non-scalar components (except trend which now supports metrics) */}
                    {metricsExpanded && !['value', 'progress', 'icon', 'kpi-unified'].includes(type) && (
                        <button
                            onClick={handleAddMetric}
                            className="flex items-center gap-2 text-primary font-bold text-xs hover:opacity-80 transition-opacity mt-2"
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar métrica
                        </button>
                    )}

                    {/* Target Value Input for Progress */}
                    {type === 'progress' && (
                        <div className="mt-4 pt-4 border-t border-slate-100 animate-fadeIn">
                            <span className="text-xs font-bold text-slate-800 block mb-3">Como calcular o progresso?</span>

                            <div className="space-y-3">
                                {/* Option 1: Already Percentage */}
                                <label className="flex items-start gap-2 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="mt-0.5 relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="progressMode"
                                            className="peer sr-only"
                                            checked={props.calculationMode === 'percentage'} // Changed to explicit Check
                                            onChange={() => updateComponentProps(selectedComponent.id, { calculationMode: 'percentage', max: undefined })}
                                        />
                                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-colors" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="text-xs">
                                        <span className="block font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                                            Métrica já é Porcentagem (%)
                                        </span>
                                        <span className="block text-slate-400 text-[10px] leading-snug mt-0.5">
                                            O valor da métrica será usado diretamente como porcentagem (0 a 100).
                                            <br />
                                            <span className="text-slate-300 italic">Ex: Margem, Taxa de Conversão.</span>
                                        </span>
                                    </div>
                                </label>

                                {/* Option 2: Calculate Relative to Target */}
                                <label className="flex items-start gap-2 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="mt-0.5 relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="progressMode"
                                            className="peer sr-only"
                                            checked={props.calculationMode !== 'percentage'} // Default to this if not set or explicitly set
                                            onChange={() => updateComponentProps(selectedComponent.id, { calculationMode: 'target', max: props.max || 100 })}
                                        />
                                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-colors" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-white absolute opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="text-xs">
                                        <span className="block font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                                            Calcular Progresso (Métrica ÷ Meta)
                                        </span>
                                        <span className="block text-slate-400 text-[10px] leading-snug mt-0.5">
                                            Transforma uma métrica absoluta em porcentagem baseada em um alvo.
                                            <br />
                                            <span className="text-slate-300 italic">Ex: Vendas / Meta de Vendas.</span>
                                        </span>
                                    </div>
                                </label>
                            </div>

                            {/* Target Input - Only visible if Option 2 is selected (NOT percentage) */}
                            {props.calculationMode !== 'percentage' && (
                                <div className="mt-2 ml-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-[10px] font-bold text-blue-600 uppercase mb-1.5 block flex items-center gap-1">
                                        Defina o topo da barra (100%)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full pl-3 pr-12 py-2 text-xs bg-white border border-blue-200 rounded outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
                                            placeholder="Ex: 50000"
                                            value={props.max || ''}
                                            onChange={(e) => updateComponentProps(selectedComponent.id, { max: Number(e.target.value) })}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-300 font-bold">
                                            MAX
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-1.5 mt-2">
                                        <Info className="h-3 w-3 text-blue-400 mt-0.5 shrink-0" />
                                        <div className="text-[10px] text-blue-500 leading-tight">
                                            <p className="mb-1.5">
                                                O sistema pegará o valor atual de <strong>{EXAMPLE_METRICS.find(m => m.id === dataSource?.metricsQuery?.metric)?.name || 'sua métrica'}</strong> automaticamente.
                                            </p>
                                            <div className="bg-white/50 rounded p-1.5 mb-2 border border-blue-200/50">
                                                <span className="opacity-70 text-[9px] uppercase font-bold tracking-wider block">Valor Atual detectado:</span>
                                                <span className="font-mono font-bold text-sm text-blue-700">
                                                    {(() => {
                                                        if (metricLoading) return '...'

                                                        const metricDef = EXAMPLE_METRICS.find(m => m.id === dataSource?.metricsQuery?.metric)
                                                        const format = metricDef?.format

                                                        if (format === 'percent') {
                                                            // Se o valor for > 1 (ex: 55), trata como 55%. Se < 1 (0.55), trata como 55%
                                                            const val = Number(currentMetricValue)
                                                            // Lógica heurística: se for inadimplência (geralmente salva como decimal ou percentual)
                                                            // Vamos assumir formato padrão
                                                            return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(val / (val > 1 ? 100 : 1))
                                                        }

                                                        if (format === 'currency') {
                                                            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(currentMetricValue))
                                                        }

                                                        return new Intl.NumberFormat('pt-BR').format(Number(currentMetricValue))
                                                    })()}
                                                </span>
                                            </div>
                                            <p className="opacity-90 font-medium border-t border-blue-200 pt-1 mt-1">
                                                Você só precisa definir a linha de chegada! 🏁
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            }

            <hr className="border-slate-100" />

            {/* View By / Segment By - Standard Selector with Smart Filtering */}
            {
                !['value', 'progress', 'icon', 'kpi-unified'].includes(type) && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                                <label className="text-xs font-bold text-slate-800">Visualizar por (Eixo X)</label>
                                <SectionTooltip text="Escolha como agrupar os dados (Ex: por Mês, Cliente, Produto)." side="bottom" />
                            </div>
                            <div className="relative">
                                <select
                                    className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg appearance-none focus:ring-1 focus:ring-blue-500 outline-none text-slate-700 font-medium shadow-sm"
                                    value={dataSource?.metricsQuery?.dimension || ''}
                                    onChange={(e) => updateMetricsQuery({ dimension: e.target.value || undefined })}
                                >
                                    <option value="">Automático</option>

                                    {/* Smart Dimension Rendering */}
                                    {(() => {
                                        const primaryMetricId = dataSource?.metricsQuery?.metric
                                        const primaryMetricDef = EXAMPLE_METRICS.find(m => m.id === primaryMetricId)
                                        const hasRestrictedDimensions = primaryMetricDef?.dimensions && primaryMetricDef.dimensions.length > 0

                                        // 1. RESTRICTED MODE (User wants this!)
                                        if (hasRestrictedDimensions) {
                                            const allowedDims = ALL_DIMENSIONS.filter(d => primaryMetricDef.dimensions?.includes(d.id))

                                            // Group allowed dimensions
                                            const temporal = allowedDims.filter(d => d.type === 'temporal')
                                            const others = allowedDims.filter(d => d.type !== 'temporal')

                                            return (
                                                <>
                                                    {temporal.length > 0 && (
                                                        <optgroup label="Tempo">
                                                            {temporal.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                        </optgroup>
                                                    )}
                                                    {others.length > 0 && (
                                                        <optgroup label="Atributos">
                                                            {others.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                        </optgroup>
                                                    )}
                                                </>
                                            )
                                        }

                                        // 2. STANDARD MODE (Fallback for generic metrics)
                                        return (
                                            <>
                                                <optgroup label="Tempo">
                                                    {TEMPORAL_DIMENSIONS.map(d => (
                                                        <option key={d.id} value={d.id}>{d.name}</option>
                                                    ))}
                                                </optgroup>
                                                {(() => {
                                                    const selectedMetricId = dataSource?.metricsQuery?.metric || ''
                                                    const isCSVMetric = selectedMetricId.startsWith('csv-') || selectedMetricId.startsWith('fin-')

                                                    if (isCSVMetric) {
                                                        return (
                                                            <optgroup label="Atributos CSV">
                                                                {ALL_DIMENSIONS.filter(d => d.context === 'csv').map(d => (
                                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                                ))}
                                                            </optgroup>
                                                        )
                                                    }

                                                    return (
                                                        <>
                                                            <optgroup label="Colunas do Relatório">
                                                                {MOCK_COLUMNS.report
                                                                    .filter(col => col.type === 'string' || col.type === 'date')
                                                                    .map(col => (
                                                                        <option key={col.key} value={col.key}>{col.label}</option>
                                                                    ))
                                                                }
                                                            </optgroup>
                                                            <optgroup label="Outros Atributos">
                                                                {ALL_DIMENSIONS.filter(d => d.type === 'categorical' && d.context !== 'csv').map(d => (
                                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                                ))}
                                                            </optgroup>
                                                        </>
                                                    )
                                                })()}
                                            </>
                                        )
                                    })()}
                                </select>
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Layout className="h-3.5 w-3.5 text-slate-500" />
                                </div>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                            </div>
                            <div className="flex bg-slate-50 p-2 rounded border border-slate-100 items-start gap-2">
                                <Lightbulb className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    Para <strong>Pizza</strong> ou <strong>Rosca</strong>, escolha uma dimensão categórica (ex: Status).
                                    Para <strong>Linha</strong> ou <strong>Barra Vertical</strong>, prefira dimensão de Tempo (ex: Mês).
                                </p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )

    const renderOptionsTab = () => {
        if (!selectedComponent) return null
        const props = selectedComponent.props || {}
        return (
            <div className="space-y-6 animate-fadeIn">
                {/* Layout Components (Linha/Barra) - Appearance Controls */}
                {['divider', 'spacer'].includes(type) && (
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Aparência</h4>

                        {/* Color Selector */}
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Cor</label>
                            <div className="flex flex-wrap gap-2">
                                {['#e2e8f0', '#94a3b8', '#64748b', '#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#000000'].map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => updateComponentProps(selectedComponent.id, { color })}
                                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${props.color === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'}`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Thickness Slider */}
                        <div>
                            <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">
                                Espessura: {(props.thickness as number) || (type === 'divider' ? 2 : 4)}px
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={(props.thickness as number) || (type === 'divider' ? 2 : 4)}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { thickness: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                )}

                {/* Standard Options - Hidden for layout components */}
                {!['divider', 'spacer'].includes(type) && (<>
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Visualização</h4>

                        {/* KPI and Progress Specific Configuration */}
                        {['kpi-unified', 'progress'].includes(type) && (
                            <div className="space-y-3 bg-slate-50 p-3 rounded border border-slate-200 mb-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Título do Card</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Automático (Nome da Métrica)"
                                        value={props.title as string || ''}
                                        onChange={(e) => updateComponentProps(selectedComponent.id, { title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase">Descrição / Rodapé</label>
                                    <input
                                        type="text"
                                        className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Ex: vs. mês anterior"
                                        value={props.description as string || ''}
                                        onChange={(e) => updateComponentProps(selectedComponent.id, { description: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <div className="space-y-1 flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ícone</label>
                                        <select
                                            className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={props.iconType as string || ''}
                                            onChange={(e) => updateComponentProps(selectedComponent.id, { iconType: e.target.value })}
                                        >
                                            <option value="">Auto</option>
                                            <option value="dollar-sign">Dinheiro</option>
                                            <option value="users">Usuários</option>
                                            <option value="trending-up">Tendência Alta</option>
                                            <option value="activity">Atividade</option>
                                            <option value="check-circle">Check</option>
                                            <option value="alert">Alerta</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Formato</label>
                                        <select
                                            className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                            value={props.format as string || ''}
                                            onChange={(e) => updateComponentProps(selectedComponent.id, { format: e.target.value })}
                                        >
                                            <option value="">Auto</option>
                                            <option value="currency">Moeda (R$)</option>
                                            <option value="percent">Percentual (%)</option>
                                            <option value="number">Número</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-slate-600 group-hover:text-slate-800">Mostrar Legenda</span>
                            <input
                                type="checkbox"
                                checked={props.showLegend !== false}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { showLegend: e.target.checked })}
                                className="accent-blue-600"
                            />
                        </label>

                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-xs text-slate-600 group-hover:text-slate-800">Mostrar Valores (Hover)</span>
                            <input
                                type="checkbox"
                                checked={props.showTooltip !== false}
                                onChange={(e) => updateComponentProps(selectedComponent.id, { showTooltip: e.target.checked })}
                                className="accent-blue-600"
                            />
                        </label>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Cores do Gráfico</h4>
                                <SectionTooltip text="Personalize as cores de cada métrica ou use uma paleta." side="bottom" />
                            </div>
                            {/* Reset Button */}
                            <button
                                onClick={() => updateComponentProps(selectedComponent.id, { chartColors: undefined, colorTheme: undefined })}
                                className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                Restaurar Padrão
                            </button>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {(() => {
                                // Use existing chart colors or default palette
                                const currentColors = (props.chartColors as string[]) || DEFAULT_PALETTE
                                // Ensure we have at least 6 slots for editing (or more if exists)
                                const editorColors = [...currentColors]
                                if (editorColors.length < 6) {
                                    // Fill up to 6 with repeated colors if needed, or just defaults
                                    const extraNeeded = 6 - editorColors.length
                                    for (let i = 0; i < extraNeeded; i++) {
                                        editorColors.push(DEFAULT_PALETTE[i % DEFAULT_PALETTE.length])
                                    }
                                }

                                return editorColors.map((color, idx) => (
                                    <div key={idx} className="relative group/color">
                                        <div
                                            className="w-6 h-6 rounded-full border border-slate-200 shadow-sm cursor-pointer hover:scale-110 transition-transform flex items-center justify-center overflow-hidden"
                                            style={{ backgroundColor: color }}
                                        >
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => {
                                                    const newColors = [...editorColors]
                                                    newColors[idx] = e.target.value
                                                    // Clear colorTheme to force usage of chartColors
                                                    updateComponentProps(selectedComponent.id, {
                                                        chartColors: newColors,
                                                        colorTheme: undefined
                                                    })
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer p-0 border-none"
                                            />
                                        </div>
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            Cor {idx + 1}
                                        </span>
                                    </div>
                                ))
                            })()}
                        </div>
                        <p className="text-[10px] text-slate-400">
                            Cada cor corresponde a um elemento ou série do gráfico, em ordem.
                        </p>
                    </div>

                    <hr className="border-slate-100" />

                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2">Técnico</h4>
                        <div className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded break-all">
                            ID: {selectedComponent.id} <br />
                            Tipo: {type} <br />
                            Dados: {dataSource?.type || 'static'}
                        </div>
                    </div>
                </>)}
            </div>
        )
    }



    // === Text Properties Renderer ===
    const renderTextProperties = () => {
        const textProps = {
            text: (props.text as string) || '',
            fontSize: (props.fontSize as number) || (type === 'value' ? 24 : type === 'description' ? 12 : 16),
            fontWeight: (props.fontWeight as string) || 'normal',
            fontStyle: (props.fontStyle as string) || 'normal',
            textDecoration: (props.textDecoration as string) || 'none',
            textAlign: (props.textAlign as 'left' | 'center' | 'right') || 'left',
            fontFamily: (props.fontFamily as string) || 'Inter, sans-serif',
            textColor: (props.textColor as string) || ''
        }

        const handlePropChange = (key: string, value: any) => {
            updateComponentProps(selectedComponent.id, { [key]: value })
        }

        const TEXT_COLORS = [
            '#0f172a', // Slate 900 (Black-ish)
            '#64748b', // Slate 500
            '#ef4444', // Red 500
            '#f97316', // Orange 500
            '#eab308', // Yellow 500
            '#22c55e', // Green 500
            '#06b6d4', // Cyan 500
            '#3b82f6', // Blue 500
            '#8b5cf6', // Violet 500
            '#d946ef'  // Fuchsia 500
        ]

        return (
            <div className="space-y-6 animate-fadeIn p-1">
                {/* Texto Content */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-800">Conteúdo</label>
                    <input
                        type="text"
                        value={textProps.text}
                        onChange={(e) => handlePropChange('text', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Digite o texto..."
                    />
                </div>

                <hr className="border-slate-100" />

                {/* Typography & Color */}
                <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Estilo</h4>

                    {/* Font Family & Size */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-medium text-slate-500">Fonte</label>
                            <select
                                value={textProps.fontFamily}
                                onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            >
                                <option value="Inter, sans-serif">Inter (Padrão)</option>
                                <option value="serif">Serif</option>
                                <option value="monospace">Mono</option>
                                <option value="cursive">Cursive</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-medium text-slate-500">Tamanho (px)</label>
                            <input
                                type="number"
                                value={textProps.fontSize}
                                onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Style Toggles */}
                    <div className="flex items-center justify-between bg-slate-50 p-1 rounded-lg border border-slate-100">
                        {/* Bold */}
                        <button
                            onClick={() => handlePropChange('fontWeight', textProps.fontWeight === 'bold' ? 'normal' : 'bold')}
                            className={`p-1.5 rounded transition-all ${textProps.fontWeight === 'bold' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Negrito"
                        >
                            <Bold className="h-4 w-4" />
                        </button>

                        {/* Italic */}
                        <button
                            onClick={() => handlePropChange('fontStyle', textProps.fontStyle === 'italic' ? 'normal' : 'italic')}
                            className={`p-1.5 rounded transition-all ${textProps.fontStyle === 'italic' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Itálico"
                        >
                            <Italic className="h-4 w-4" />
                        </button>

                        {/* Underline */}
                        <button
                            onClick={() => handlePropChange('textDecoration', textProps.textDecoration === 'underline' ? 'none' : 'underline')}
                            className={`p-1.5 rounded transition-all ${textProps.textDecoration === 'underline' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Sublinhado"
                        >
                            <Underline className="h-4 w-4" />
                        </button>

                        <div className="w-px h-4 bg-slate-200 mx-1" />

                        {/* Alignment */}
                        <button
                            onClick={() => handlePropChange('textAlign', 'left')}
                            className={`p-1.5 rounded transition-all ${textProps.textAlign === 'left' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Esquerda"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handlePropChange('textAlign', 'center')}
                            className={`p-1.5 rounded transition-all ${textProps.textAlign === 'center' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Centro"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handlePropChange('textAlign', 'right')}
                            className={`p-1.5 rounded transition-all ${textProps.textAlign === 'right' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Direita"
                        >
                            <AlignRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="h-px bg-slate-50 w-full my-2" />

                    {/* Color Picker */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-medium text-slate-500">Cor da Fonte</label>
                        <div className="flex flex-wrap gap-2">
                            {TEXT_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => handlePropChange('textColor', color)}
                                    className={`w-6 h-6 rounded-full border transition-all ${textProps.textColor === color
                                        ? 'ring-2 ring-offset-1 ring-blue-500 scale-110'
                                        : 'border-slate-200 hover:scale-110'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                            <button
                                onClick={() => handlePropChange('textColor', '')}
                                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${!textProps.textColor
                                    ? 'ring-2 ring-offset-1 ring-slate-400 scale-110 border-slate-400 bg-slate-100'
                                    : 'border-slate-200 hover:scale-110 bg-white'
                                    }`}
                                title="Padrão (Automático)"
                            >
                                <span className="w-full h-[1px] bg-red-400 rotate-45 transform scale-x-75" />
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    if (type === 'title' || type === 'description' || type === 'value') {
        return (
            <div className="flex flex-col h-full bg-white">
                <div className="flex items-center border-b border-slate-200 px-4 py-3">
                    <span className="text-xs font-bold text-slate-800">Propriedades do Texto</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {renderTextProperties()}
                </div>
            </div>
        )
    }

    // Layout components (divider/spacer) - Only show Options tab
    if (type === 'divider' || type === 'spacer') {
        return (
            <div className="flex flex-col h-full bg-white border-l border-slate-200">
                <div className="flex items-center border-b border-slate-200 px-4 py-3">
                    <span className="text-xs font-bold text-slate-800">
                        {type === 'divider' ? 'Propriedades da Linha' : 'Propriedades da Barra'}
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {renderOptionsTab()}
                </div>
            </div>
        )
    }



    // Default return for Charts / Other components
    // Initialize Default Date Range if missing


    return (
        <div className="w-full h-full flex flex-col bg-white overflow-hidden">
            {/* Abas Superiores (Intercom Style) */}
            <div className="flex border-b border-gray-100 flex-shrink-0 bg-slate-50/50">
                <button
                    onClick={() => setActiveTab('chart')}
                    className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'chart'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Dados
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
                <button
                    onClick={() => setActiveTab('options')}
                    className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'options'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Opções
                </button>
            </div >

            {/* Content */}
            < div className="flex-1 overflow-y-auto custom-scrollbar p-4" >
                {activeTab === 'chart' ? renderChartTab() : renderOptionsTab()}
            </div >
        </div >
    )
}
