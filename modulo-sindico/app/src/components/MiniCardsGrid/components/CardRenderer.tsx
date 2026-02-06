import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import {
    Activity,
    TrendingUp,
    TrendingDown,
    LayoutGrid,
    Clock,
    DollarSign,
    Users,
    ListCollapse,
    Target,
    CheckCircle,
    AlertTriangle
} from 'lucide-react'
// Recharts - Biblioteca de gráficos (todos os tipos disponíveis)
import {
    // Gráficos básicos
    AreaChart as RechartsAreaChart,
    Area as RechartsArea,
    BarChart as RechartsBarChart,
    Bar as RechartsBar,
    LineChart as RechartsLineChart,
    Line as RechartsLine,
    PieChart as RechartsPieChart,
    Pie as RechartsPie,
    Cell as RechartsCell,
    // Gráficos avançados
    RadarChart as RechartsRadarChart,
    Radar as RechartsRadar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    RadialBarChart as RechartsRadialBarChart,
    RadialBar as RechartsRadialBar,
    ScatterChart as RechartsScatterChart,
    Scatter as RechartsScatter,
    ZAxis,
    ComposedChart as RechartsComposedChart,
    Treemap as RechartsTreemap,
    FunnelChart as RechartsFunnelChart,
    Funnel as RechartsFunnel,
    LabelList,
    // Componentes auxiliares
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend as RechartsLegend
} from 'recharts'
import { getMetricById } from '../metrics'

const ICON_MAP: Record<string, any> = {
    activity: Activity,
    'layout-grid': LayoutGrid,
    clock: Clock,
    'dollar-sign': DollarSign,
    users: Users,
    'list-collapse': ListCollapse,
    target: Target,
    'check-circle': CheckCircle,
    alert: AlertTriangle,
    'trending-up': TrendingUp,
    'trending-down': TrendingDown,
    'smile': Activity // Fallback/Placeholder if needed, or import Smile if available. User mentioned Smile earlier.
}

import { CanvasComponent } from '../types'
import { COLOR_OPTIONS } from '../constants'
import { CanvasTable } from './CanvasTable'
import { useMetricsBuilder } from '../hooks/useMetricsBuilder'
import { Loader2, AlertCircle } from 'lucide-react'
import { ExploreButton } from './ExploreButton'

// Portal para Tooltip
const PortalTooltip = ({ position, children }: { position: { x: number, y: number } | null, children: React.ReactNode }) => {
    if (!position) return null
    return createPortal(
        <div
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -100%)',
                zIndex: 99999,
                pointerEvents: 'none',
                marginTop: '-8px'
            }}
            className="animate-in fade-in zoom-in-95 duration-150"
        >
            {children}
        </div>,
        document.body
    )
}

interface CardRendererProps {
    component: CanvasComponent
    currentColor: {
        text: string
        bg: string
        bgSolid: string
    }
    scale?: number
    /** Callback when user clicks "Explorar" button */
    onExplore?: () => void
}

export function CardRenderer({ component: comp, currentColor, scale = 1, onExplore }: CardRendererProps) {
    // Integração com sistema de métricas
    const { data: metricsData, loading, error } = useMetricsBuilder(comp.dataSource?.metricsQuery)

    // Decidir quais dados usar:
    // 2. Dados estáticos definidos no dataSource (novo padrão)
    // 3. Dados manuais das props (legacy fallback)
    // Decidir quais dados usar:
    // 2. Dados estáticos definidos no dataSource (novo padrão)
    // 3. Dados manuais das props (legacy fallback)
    const effectiveData = metricsData || (comp.dataSource?.type === 'static' ? comp.dataSource.data : undefined) || comp.props.data

    // Tooltip State (Must be top-level)
    const [tooltipData, setTooltipData] = useState<{ d: any, x: number, y: number } | null>(null)

    // Loading State
    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin" style={{ width: `${20 * scale}px`, height: `${20 * scale}px` }} />
            </div>
        )
    }

    // Error State
    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-rose-400 p-2 text-center">
                <AlertCircle style={{ width: `${20 * scale}px`, height: `${20 * scale}px` }} />
                <span className="text-[9px] mt-1 line-clamp-2" style={{ fontSize: `${Math.max(8, 10 * scale)}px` }}>
                    {error}
                </span>
            </div>
        )
    }

    // Debug Logging
    console.log(`[CardRenderer] ID: ${comp.id} Type: ${comp.type}`, {
        dataSource: comp.dataSource,
        metricsQuery: comp.dataSource?.metricsQuery,
        hasMetricConfigured: !!comp.dataSource?.metricsQuery?.metric,
        effectiveData,
        loading,
        error
    })

    // Helper para verificar se há dados de comparação
    const hasPreviousValue = effectiveData && effectiveData.length > 0 && 'previousValue' in effectiveData[0]

    // Helper para verificar se é um componente de visualização de dados
    const isDataComponent = comp.type.startsWith('recharts') || comp.type === 'table' || comp.type.startsWith('chart') || comp.type === 'canvas-table' ||
        ['kpi-unified', 'trend', 'value', 'progress'].includes(comp.type)
    const hasMetricConfigured = !!comp.dataSource?.metricsQuery?.metric
    const hasStaticConfig = comp.dataSource?.type === 'static' ||
        (comp.type === 'value' && !!comp.props.text) ||
        (comp.type === 'trend' && comp.props.value !== undefined && comp.props.value !== null) ||
        (comp.type === 'progress' && comp.props.value !== undefined && comp.props.value !== null)


    const renderContent = () => {
        switch (comp.type) {
            case 'title':
                return (
                    <div
                        className="truncate text-slate-800 w-full pr-1"
                        style={{
                            fontSize: comp.props.fontSize ? `${Number(comp.props.fontSize) * scale}px` : `${Math.max(10, 14 * scale)}px`,
                            fontWeight: comp.props.fontWeight as any || 600,
                            fontStyle: comp.props.fontStyle as any || 'normal',
                            textDecoration: comp.props.textDecoration as any || 'none',
                            textAlign: comp.props.textAlign as any || 'left',
                            fontFamily: comp.props.fontFamily as any || 'inherit',
                            color: comp.props.textColor as string || undefined,
                            letterSpacing: (comp.props.letterSpacing as any) || '-0.02em'
                        }}
                    >
                        {String(comp.props.text || 'Título')}
                    </div>
                )
            case 'value':
                // Ignore size prop for now, prioritize scale.
                // Or combine? SortableMetricCard ignored legacy size prop in favor of scale.
                return (
                    <div
                        className={`${currentColor.text} truncate w-full`}
                        style={{
                            lineHeight: 1,
                            fontSize: comp.props.fontSize ? `${Number(comp.props.fontSize) * scale}px` : `${Math.max(16, 28 * scale)}px`,
                            fontWeight: comp.props.fontWeight as any || 700,
                            fontStyle: comp.props.fontStyle as any || 'normal',
                            textDecoration: comp.props.textDecoration as any || 'none',
                            textAlign: comp.props.textAlign as any || 'left',
                            fontFamily: comp.props.fontFamily as any || 'inherit',
                            color: comp.props.textColor as string || undefined,
                            letterSpacing: (comp.props.letterSpacing as any) || '-0.03em' // Slightly tighter for large values
                        }}
                    >
                        {String(comp.props.text || '0')}
                    </div >
                )
            case 'description':
                return (
                    <div
                        className="text-slate-500 truncate w-full"
                        style={{
                            fontSize: comp.props.fontSize ? `${Number(comp.props.fontSize) * scale}px` : `${Math.max(8, 11 * scale)}px`,
                            fontWeight: comp.props.fontWeight as any || 'normal',
                            fontStyle: comp.props.fontStyle as any || 'normal',
                            textDecoration: comp.props.textDecoration as any || 'none',
                            textAlign: comp.props.textAlign as any || 'left',
                            fontFamily: comp.props.fontFamily as any || 'inherit',
                            color: comp.props.textColor as string || undefined
                        }}
                    >
                        {String(comp.props.text || 'Descrição')}
                    </div>
                )
            case 'icon':
                const IconComp = ICON_MAP[comp.props.iconType as string] || Activity
                return (
                    <IconComp
                        className={currentColor.text}
                        style={{
                            width: comp.props.size ? `${comp.props.size * scale}px` : `${20 * scale}px`,
                            height: comp.props.size ? `${comp.props.size * scale}px` : `${20 * scale}px`,
                            color: comp.props.color as string
                        }}
                    />
                )
            case 'trend': {
                const metricId = comp.dataSource?.metricsQuery?.metric
                // If we have a metric, try to use its calculated trend if comp.props.value is not manually overridden
                // (This logic will be expanded in the next step, for now just fixing the empty state)

                const isUp = comp.props.direction === 'up'

                return (
                    <div className="flex items-center gap-1">
                        {isUp ? (
                            <TrendingUp className="text-emerald-500" style={{ width: `${12 * scale}px`, height: `${12 * scale}px` }} />
                        ) : (
                            <TrendingDown className="text-rose-500" style={{ width: `${12 * scale}px`, height: `${12 * scale}px` }} />
                        )}
                        <span
                            className={isUp ? 'text-emerald-600' : 'text-rose-600'}
                            style={{ fontSize: `${Math.max(8, 11 * scale)}px`, fontWeight: 500 }}
                        >
                            {String(comp.props.value || '+0%')}
                        </span>
                    </div>
                )
            }

            case 'kpi-unified': {
                // 1. Get Metric Definition
                const metricId = comp.dataSource?.metricsQuery?.metric

                // Empty state handled by global wrapper

                const metricDef = effectiveData && effectiveData[0] ? (effectiveData[0] as any)._metricDef : null

                // 2. Resolve Value
                let rawValue = 0
                const values = effectiveData || []

                if (values.length > 0) {
                    const aggType = metricDef?.aggregation || 'sum'
                    if (aggType === 'sum') {
                        rawValue = values.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0)
                    } else if (aggType === 'avg') {
                        const total = values.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0)
                        rawValue = total / values.length
                    } else {
                        rawValue = values.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0)
                    }
                }

                // 3. Display Properties
                const displayTitle = comp.props.title || metricDef?.name || (metricId ? 'Métrica' : 'Novo KPI')
                const displayIcon = comp.props.iconType || metricDef?.defaultIcon
                const displayFormat = comp.props.format || metricDef?.format

                // 4. Format Value
                let formattedValue = String(rawValue)

                if (displayFormat === 'currency' || (!displayFormat && metricId?.includes('venda'))) {
                    formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(Number(rawValue))
                } else if (displayFormat === 'percent') {
                    if (Number(rawValue) > 1) {
                        formattedValue = `${Number(rawValue).toFixed(1)}%`
                    } else {
                        formattedValue = new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(Number(rawValue))
                    }
                } else if (displayFormat === 'number') {
                    formattedValue = new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(Number(rawValue))
                }

                // 5. Variation / Trend Logic (Simulated or Real)
                // Se houver dados de variação no payload (ex: previousValue), usar. 
                // Se não, verificar se há propriedade variation estática.
                const variation = (effectiveData && effectiveData[0] && 'variation' in effectiveData[0]) ? effectiveData[0].variation : null
                const trendValue = variation ? variation.value : null
                const trendDirection = variation ? variation.direction : 'neutral' // up, down, neutral

                const IconComp = ICON_MAP[displayIcon as string] || (metricId?.includes('cash') ? DollarSign : TrendingUp)

                return (
                    <div className="w-full h-full flex flex-col justify-between p-1">
                        {/* Header: Title + Icon */}
                        <div className="flex justify-between items-start gap-2">
                            <span className="text-slate-500 font-semibold truncate leading-tight"
                                style={{ fontSize: `${Math.max(11, 14 * scale)}px` }}>
                                {displayTitle}
                            </span>
                            <div className="flex items-center gap-1">
                                <IconComp className={currentColor.text}
                                    style={{
                                        width: `${Math.max(16, 24 * scale)}px`,
                                        height: `${Math.max(16, 24 * scale)}px`,
                                        opacity: 0.8,
                                        flexShrink: 0
                                    }}
                                />
                            </div>
                        </div>

                        {/* Body: Value */}
                        <div className={`font-bold ${currentColor.text} truncate mt-auto mb-auto`}
                            style={{
                                fontSize: `${Math.max(24, 42 * scale)}px`,
                                lineHeight: 1.1,
                                letterSpacing: '-0.03em'
                            }}>
                            {formattedValue}
                        </div>

                        {/* Footer: Description or Trend */}
                        <div className="mt-auto pt-1 flex items-center gap-2 text-slate-400"
                            style={{ fontSize: `${Math.max(10, 12 * scale)}px` }}>

                            {trendValue ? (
                                <div className={`flex items-center gap-1 font-medium ${trendDirection === 'up' ? 'text-emerald-600' : trendDirection === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
                                    {trendDirection === 'up' ? <TrendingUp size="1em" /> : trendDirection === 'down' ? <TrendingDown size="1em" /> : null}
                                    <span>{trendValue > 0 ? '+' : ''}{trendValue}%</span>
                                    <span className="text-slate-400 font-normal">vs mês ant.</span>
                                </div>
                            ) : (
                                <span className="truncate opacity-80 pl-2">
                                    {comp.props.description || (metricId ? 'Atualizado agora' : 'Sem dados')}
                                </span>
                            )}
                        </div>
                    </div>
                )
            }

            case 'progress': {
                let progressValue = Number(comp.props.value) || 0
                let totalValue = progressValue

                // If metric data exists, override static value
                if (effectiveData && effectiveData.length > 0) {
                    const total = effectiveData.reduce((acc: number, curr: any) => acc + (Number(curr.value) || 0), 0)
                    totalValue = total
                    const max = Number(comp.props.max) || 100 // Default to 100 if no max set

                    // If max is provided, calculate percentage relative to it
                    // If no max (default 100), assume metric value IS the percentage (clamped)
                    if (comp.props.max) {
                        progressValue = (total / max) * 100
                    } else {
                        progressValue = total
                    }
                }

                const percent = Math.min(100, Math.max(0, progressValue))
                const progressTitle = comp.props.title || (effectiveData && effectiveData[0] ? (effectiveData[0] as any)._metricDef?.name : 'Progresso')

                // Icon & Format Logic
                const IconComp = comp.props.iconType ? (ICON_MAP[comp.props.iconType as string] || Activity) : null
                const format = comp.props.format || 'percent'

                let displayValue = `${Math.round(percent)}%`
                if (format === 'currency') {
                    displayValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalValue)
                } else if (format === 'number') {
                    displayValue = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(totalValue)
                }

                return (
                    <div className="w-full h-full flex flex-col justify-between p-3 select-none">
                        {/* Header: Title and Big Percent */}
                        <div className="flex items-start justify-between mb-1">
                            <div className="flex flex-col min-w-0 pr-2">
                                <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
                                    {IconComp && <IconComp className="h-3.5 w-3.5 shrink-0 opacity-70" />}
                                    <span className="text-[10px] uppercase font-bold tracking-wider truncate" title={String(progressTitle)}>
                                        {progressTitle}
                                    </span>
                                </div>
                                {comp.props.description && (
                                    <span className="text-[9px] text-slate-400 leading-tight truncate pl-0.5">
                                        {comp.props.description}
                                    </span>
                                )}
                            </div>
                            <span className={`text-xl font-bold ${currentColor.text} tabular-nums leading-none`}>
                                {displayValue}
                            </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="flex-1 flex flex-col justify-end pb-1">
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative">
                                {/* Foreground Bar */}
                                <div
                                    className={`h-full ${currentColor.bgSolid} transition-all duration-500 relative`}
                                    style={{ width: `${percent}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            case 'badge':
                const badgeVariants: Record<string, string> = {
                    success: 'bg-emerald-100 text-emerald-700',
                    warning: 'bg-amber-100 text-amber-700',
                    error: 'bg-rose-100 text-rose-700',
                    info: 'bg-blue-100 text-blue-700'
                }
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeVariants[comp.props.variant as string] || badgeVariants.info}`}>
                        {comp.props.text as string}
                    </span>
                )
            case 'divider':
                return (
                    <div className="w-full h-full flex items-center justify-center p-2">
                        <div
                            className="w-full rounded-full transition-all"
                            style={{
                                height: `${comp.props.thickness || 1}px`,
                                backgroundColor: (comp.props.color as string) || '#e2e8f0'
                            }}
                        />
                    </div>
                )
            case 'spacer':
                return (
                    <div className="w-full h-full flex items-center justify-center p-2">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{
                                width: `${comp.props.thickness || 4}px`,
                                backgroundColor: (comp.props.color as string) || '#e2e8f0'
                            }}
                        />
                    </div>
                )
            case 'chart-bar':
                // FIXME: Normalizar dados se vierem do metricsData (que é {label, value})
                // O chart-bar antigo espera array de números [1, 2, 3]
                // Se vier do builder, transformar em array de valores
                const rawBarData = effectiveData as any
                const barData = Array.isArray(rawBarData) && typeof rawBarData[0] === 'object'
                    ? rawBarData.map((d: any) => d.value)
                    : rawBarData as number[]

                const barMax = Math.max(...(barData || [])) || 100
                const barGradientId = `bar-grad-${comp.id}`
                return (
                    <div className="flex flex-col h-full w-full p-2">
                        {/* Eixo Y com labels */}
                        <div className="flex-1 flex">
                            <div className="flex flex-col justify-between text-[8px] text-slate-400 pr-1 py-1">
                                <span>{barMax}</span>
                                <span>{Math.round(barMax / 2)}</span>
                                <span>0</span>
                            </div>
                            {/* Barras */}
                            <div className="flex-1 flex items-end gap-[3px] relative">
                                <svg className="absolute" width="0" height="0">
                                    <defs>
                                        <linearGradient id={barGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                {barData.map((v, i) => {
                                    const heightPercent = (v / barMax) * 100
                                    return (
                                        <div
                                            key={i}
                                            className="flex-1 flex flex-col items-center justify-end group/bar relative z-10"
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-slate-800 text-white text-[9px] rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                {v}
                                            </div>
                                            <div
                                                className={`w-full rounded-t-sm ${currentColor.bgSolid} transition-all duration-300 hover:opacity-90 shadow-sm`}
                                                style={{
                                                    height: `${heightPercent}%`,
                                                    minHeight: heightPercent > 0 ? '2px' : '0'
                                                }}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        {/* Eixo X */}
                        <div className="flex mt-1 pl-4">
                            {barData.map((_, i) => (
                                <div key={i} className="flex-1 text-center text-[8px] text-slate-400">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            case 'chart-line':
            case 'chart-area':
                const rawLineData = effectiveData as any
                const lineData = Array.isArray(rawLineData) && typeof rawLineData[0] === 'object'
                    ? rawLineData.map((d: any) => d.value)
                    : rawLineData as number[]

                const lineMax = Math.max(...(lineData || [])) || 100
                const lineMin = Math.min(...(lineData || [])) || 0
                const lineRange = lineMax - lineMin || 1
                const padding = 10
                const chartWidth = 100 - padding * 2
                const chartHeight = 100 - padding * 2
                const gradientId = `area-grad-${comp.id}`

                // Criar pontos para curva suave usando Catmull-Rom spline
                const linePoints = lineData.map((v, i) => ({
                    x: padding + (i / (lineData.length - 1)) * chartWidth,
                    y: padding + (1 - (v - lineMin) / lineRange) * chartHeight
                }))

                // Path com curvas bezier suaves
                const createSmoothPath = (pts: { x: number; y: number }[]) => {
                    if (pts.length < 2) return ''
                    let path = `M ${pts[0].x} ${pts[0].y}`
                    for (let i = 0; i < pts.length - 1; i++) {
                        const p0 = pts[Math.max(0, i - 1)]
                        const p1 = pts[i]
                        const p2 = pts[i + 1]
                        const p3 = pts[Math.min(pts.length - 1, i + 2)]
                        const tension = 0.3
                        const cp1x = p1.x + (p2.x - p0.x) * tension
                        const cp1y = p1.y + (p2.y - p0.y) * tension
                        const cp2x = p2.x - (p3.x - p1.x) * tension
                        const cp2y = p2.y - (p3.y - p1.y) * tension
                        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
                    }
                    return path
                }

                const smoothPath = createSmoothPath(linePoints)
                const areaPath = smoothPath + ` L ${linePoints[linePoints.length - 1].x} ${100 - padding} L ${padding} ${100 - padding} Z`

                return (
                    <div className="w-full h-full p-1 relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
                                </linearGradient>
                                <filter id={`shadow-${comp.id}`} x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.15" />
                                </filter>
                            </defs>

                            {/* Área preenchida */}
                            {comp.type === 'chart-area' && (
                                <path
                                    d={areaPath}
                                    className={currentColor.text}
                                    fill={`url(#${gradientId})`}
                                />
                            )}

                            {/* Linha principal */}
                            <path
                                d={smoothPath}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={currentColor.text}
                                filter={`url(#shadow-${comp.id})`}
                            />

                            {/* Pontos nos dados */}
                            {linePoints.map((pt, i) => (
                                <g key={i} className="group/point">
                                    <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="3"
                                        className={`${currentColor.text} fill-white stroke-current`}
                                        strokeWidth="1.5"
                                    />
                                    <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="6"
                                        className="fill-transparent hover:fill-current opacity-0 hover:opacity-20 cursor-pointer transition-opacity"
                                    />
                                </g>
                            ))}
                        </svg>

                        {/* Labels nos eixos */}
                        <div className="absolute left-0 top-1 bottom-1 w-4 flex flex-col justify-between text-[7px] text-slate-400">
                            <span>{lineMax}</span>
                            <span>{lineMin}</span>
                        </div>
                    </div>
                )
            case 'chart-pie':
            case 'chart-donut':
                // Se vier do MetricsBuilder, pegar o primeiro valor (total) ou somar
                // Mas este componente é um "Progress Pie" (valor único 0-100), não um Pie Chart completo
                const rawPieVal = effectiveData
                let pieValue = typeof rawPieVal === 'number' ? rawPieVal : 0

                if (Array.isArray(rawPieVal) && rawPieVal.length > 0) {
                    // Se for array de objetos {label, value}, tenta achar um 'value' ou soma
                    pieValue = rawPieVal[0].value || 0
                } else if (comp.props.value) {
                    pieValue = comp.props.value as number
                }

                const isDonut = comp.type === 'chart-donut'
                const pieGradientId = `pie-grad-${comp.id}`
                const radius = 15.915
                const circumference = 2 * Math.PI * radius
                const strokeDasharray = `${(pieValue / 100) * circumference} ${circumference}`

                return (
                    <div className="flex items-center justify-center h-full w-full p-2">
                        <div className="relative">
                            <svg viewBox="0 0 40 40" className="w-full h-full max-w-[100px] max-h-[100px] transform -rotate-90">
                                <defs>
                                    <linearGradient id={pieGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
                                    </linearGradient>
                                    <filter id={`pie-shadow-${comp.id}`}>
                                        <feDropShadow dx="0" dy="0" stdDeviation="1" floodOpacity="0.2" />
                                    </filter>
                                </defs>

                                <circle
                                    cx="20"
                                    cy="20"
                                    r={radius}
                                    fill="none"
                                    className="stroke-slate-100"
                                    strokeWidth={isDonut ? 4 : 15}
                                />

                                <circle
                                    cx="20"
                                    cy="20"
                                    r={radius}
                                    fill="none"
                                    className={currentColor.text}
                                    stroke={`url(#${pieGradientId})`}
                                    strokeWidth={isDonut ? 4 : 15}
                                    strokeDasharray={strokeDasharray}
                                    strokeLinecap="round"
                                    filter={`url(#pie-shadow-${comp.id})`}
                                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                                />

                                {!isDonut && pieValue < 100 && (
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r={radius}
                                        fill="none"
                                        className="stroke-slate-200"
                                        strokeWidth={15}
                                        strokeDasharray={`${((100 - pieValue) / 100) * circumference} ${circumference}`}
                                        strokeDashoffset={-((pieValue / 100) * circumference)}
                                    />
                                )}
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <span className={`text-lg font-bold ${currentColor.text}`}>{pieValue}</span>
                                    <span className="text-xs text-slate-400 ml-0.5">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'chart-gauge':
                const gaugeValue = comp.props.value as number
                const gaugeMax = (comp.props.max as number) || 100
                const gaugePercent = (gaugeValue / gaugeMax) * 100
                const gaugeGradientId = `gauge-grad-${comp.id}`
                const gaugeRadius = 14
                const gaugeCircumference = Math.PI * gaugeRadius
                const gaugeDasharray = `${(gaugePercent / 100) * gaugeCircumference} ${gaugeCircumference}`

                const getGaugeColor = (pct: number) => {
                    if (pct >= 80) return 'text-emerald-500'
                    if (pct >= 50) return 'text-amber-500'
                    return 'text-rose-500'
                }

                return (
                    <div className="flex flex-col items-center justify-center h-full w-full p-2">
                        <div className="relative w-full max-w-[120px]">
                            <svg viewBox="0 0 36 22" className="w-full">
                                <defs>
                                    <linearGradient id={gaugeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="50%" stopColor="#f59e0b" />
                                        <stop offset="100%" stopColor="#22c55e" />
                                    </linearGradient>
                                    <filter id={`gauge-shadow-${comp.id}`}>
                                        <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.2" />
                                    </filter>
                                </defs>

                                <path
                                    d="M 4 18 A 14 14 0 0 1 32 18"
                                    fill="none"
                                    stroke={`url(#${gaugeGradientId})`}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    opacity="0.2"
                                />

                                <path
                                    d="M 4 18 A 14 14 0 0 1 32 18"
                                    fill="none"
                                    className="stroke-slate-200"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M 4 18 A 14 14 0 0 1 32 18"
                                    fill="none"
                                    className={comp.props.showGradient ? '' : getGaugeColor(gaugePercent)}
                                    stroke={comp.props.showGradient ? `url(#${gaugeGradientId})` : 'currentColor'}
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeDasharray={gaugeDasharray}
                                    filter={`url(#gauge-shadow-${comp.id})`}
                                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                                />

                                <g className="text-slate-300">
                                    <line x1="4" y1="18" x2="4" y2="20" stroke="currentColor" strokeWidth="0.5" />
                                    <line x1="18" y1="4" x2="18" y2="6" stroke="currentColor" strokeWidth="0.5" />
                                    <line x1="32" y1="18" x2="32" y2="20" stroke="currentColor" strokeWidth="0.5" />
                                </g>

                                <g transform={`rotate(${-90 + (gaugePercent / 100) * 180}, 18, 18)`}>
                                    <line
                                        x1="18"
                                        y1="18"
                                        x2="18"
                                        y2="7"
                                        stroke="#334155"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                    <circle cx="18" cy="18" r="2" fill="#334155" />
                                </g>
                            </svg>
                            <div className="flex justify-between text-[8px] text-slate-400 px-1 -mt-1">
                                <span>0</span>
                                <span>{gaugeMax}</span>
                            </div>
                        </div>
                        <div className="text-center mt-1">
                            <span className={`text-xl font-bold ${getGaugeColor(gaugePercent)}`}>{gaugeValue}</span>
                            <span className="text-xs text-slate-400 ml-0.5">/ {gaugeMax}</span>
                        </div>
                    </div>
                )
            case 'chart-bar-h':
                const barHData = comp.props.data as number[]
                const barHLabels = (comp.props.labels as string[]) || barHData.map((_, i) => `Item ${i + 1}`)
                const barHMax = Math.max(...barHData)
                return (
                    <div className="flex flex-col w-full h-full p-2 gap-1">
                        {barHData.map((v, i) => {
                            const widthPct = (v / barHMax) * 100
                            return (
                                <div key={i} className="flex items-center gap-2 flex-1 min-h-0">
                                    <span className="text-[10px] text-slate-500 w-10 text-right truncate">{barHLabels[i]}</span>
                                    <div className="flex-1 h-full flex items-center">
                                        <div
                                            className={`h-[70%] rounded-r ${currentColor.bgSolid} transition-all relative group/bar`}
                                            style={{ width: `${widthPct}%`, minWidth: v > 0 ? '4px' : '0' }}
                                        >
                                            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-medium text-white opacity-0 group-hover/bar:opacity-100 transition-opacity">
                                                {v}
                                            </span>
                                        </div>
                                        <span className="ml-2 text-[10px] font-medium text-slate-600">{v}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            case 'chart-heatmap':
                const heatmapData = comp.props.data as number[][]
                const heatmapRows = (comp.props.rows as string[]) || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
                const heatmapMax = Math.max(...heatmapData.flat())

                const getHeatColor = (val: number) => {
                    if (heatmapMax === 0) return 'bg-slate-100'
                    const intensity = val / heatmapMax
                    if (intensity === 0) return 'bg-blue-50'
                    if (intensity < 0.25) return 'bg-blue-100'
                    if (intensity < 0.5) return 'bg-blue-200'
                    if (intensity < 0.75) return 'bg-blue-400'
                    return 'bg-blue-600'
                }

                return (
                    <div className="flex flex-col w-full h-full p-2">
                        <div className="flex mb-1">
                            <div className="w-8" />
                            <div className="flex-1 flex">
                                {[0, 6, 12, 18, 23].map(h => (
                                    <div key={h} className="text-[7px] text-slate-400" style={{ width: `${100 / 24}%`, marginLeft: h === 0 ? 0 : `${(h - (h === 6 ? 0 : h === 12 ? 6 : h === 18 ? 12 : 18)) * (100 / 24)}%` }}>
                                        {h}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-[2px]">
                            {heatmapData.map((row, rowIdx) => (
                                <div key={rowIdx} className="flex items-center gap-1 flex-1 min-h-0">
                                    <span className="text-[8px] text-slate-500 w-7 text-right">{heatmapRows[rowIdx]}</span>
                                    <div className="flex-1 flex gap-[1px] h-full">
                                        {row.map((val, colIdx) => (
                                            <div
                                                key={colIdx}
                                                className={`flex-1 rounded-[2px] ${getHeatColor(val)} flex items-center justify-center group/cell relative`}
                                                title={`${heatmapRows[rowIdx]} ${colIdx}h: ${val}`}
                                            >
                                                {val > 0 && heatmapData[0].length <= 12 && (
                                                    <span className="text-[7px] font-medium text-slate-700 opacity-0 group-hover/cell:opacity-100">
                                                        {val}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-[7px] text-slate-400">0</span>
                            <div className="flex gap-[1px]">
                                {['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600'].map((c, i) => (
                                    <div key={i} className={`w-3 h-2 rounded-[1px] ${c}`} />
                                ))}
                            </div>
                            <span className="text-[7px] text-slate-400">{heatmapMax}</span>
                        </div>
                    </div>
                )

            case 'recharts-bar': {
                const rechartsBarData = (effectiveData as Array<{ label: string; value: number; previousValue?: number }>) || []

                // Determine colors based on hierarchy:
                // 1. Explicit chartColors (Palette Editor)
                // 2. colorTheme (Legacy/Monochromatic Theme)
                // 3. Default Rainbow
                const themeColorId = comp.props.colorTheme as string
                const themeColorObj = COLOR_OPTIONS.find(c => c.id === themeColorId)

                let barColors: string[] = []

                if (comp.props.chartColors && Array.isArray(comp.props.chartColors) && comp.props.chartColors.length > 0) {
                    barColors = comp.props.chartColors as string[]
                } else if (themeColorObj) {
                    barColors = [themeColorObj.hex || '#3b82f6']
                } else {
                    barColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
                }

                const showLegend = comp.props.showLegend !== false
                const showTooltip = comp.props.showTooltip !== false

                console.log('[CardRenderer recharts-bar] Data:', rechartsBarData)

                if (!rechartsBarData || rechartsBarData.length === 0) {
                    return (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Sem dados
                        </div>
                    )
                }

                return (
                    <div className="w-full h-full p-1 relative" style={{ minWidth: 100, minHeight: 100 }}>
                        {/* Explore Button */}
                        {onExplore && (
                            <div className="absolute top-1 right-1 z-10">
                                <ExploreButton onClick={onExplore} compact />
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%" minWidth={80} minHeight={80}>
                            <RechartsBarChart data={rechartsBarData} margin={{ top: 20, right: 20, left: 0, bottom: showLegend ? 10 : 5 }}>
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#6b7280' }} stroke="#e5e7eb" axisLine={false} tickLine={false} />
                                <YAxis width={40} tick={{ fontSize: 9, fill: '#6b7280' }} stroke="#e5e7eb" axisLine={false} tickLine={false} tickFormatter={(value: any) => value.toLocaleString()} />
                                {showTooltip && (
                                    <RechartsTooltip
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                        contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', padding: '8px 12px' }}
                                        formatter={(value: any, name: string) => {
                                            const displayLabel = name === 'previousValue' ? 'Período Anterior' : 'Valor Atual'
                                            return [`${value.toLocaleString()}`, displayLabel]
                                        }}
                                        labelFormatter={(lbl) => `📊 ${lbl}`}
                                    />
                                )}
                                {showLegend && (
                                    <RechartsLegend
                                        wrapperStyle={{ fontSize: '8px', paddingTop: '0px' }}
                                        iconType="circle"
                                        iconSize={6}
                                        verticalAlign="bottom"
                                        align="center"
                                    />
                                )}

                                {/* Previous Value Bar (Lighter / Background) */}
                                {hasPreviousValue && (
                                    <RechartsBar
                                        dataKey="previousValue"
                                        name="Período Anterior"
                                        fill="#e2e8f0" // Much lighter gray-ish blue
                                        radius={[4, 4, 0, 0]}
                                        animationDuration={0}
                                    />
                                )}

                                {/* Current Value Bar */}
                                <RechartsBar dataKey="value" name="Valor Atual" radius={[4, 4, 0, 0]} animationDuration={0} animationEasing="ease-out">
                                    {rechartsBarData.map((d, index) => {
                                        const isNegative = (d.value || 0) < 0
                                        // Tentar obter definição da métrica do primeiro item ou via props
                                        const metricDef = (effectiveData && effectiveData[0] ? (effectiveData[0] as any)._metricDef : null)

                                        let finalColor = barColors[index % barColors.length]

                                        if (isNegative && metricDef?.visualRules?.negativeColor) {
                                            finalColor = metricDef.visualRules.negativeColor
                                        } else if (!isNegative && metricDef?.visualRules?.positiveColor) {
                                            finalColor = metricDef.visualRules.positiveColor
                                        }

                                        return <RechartsCell key={`cell-${index}`} fill={finalColor} />
                                    })}
                                </RechartsBar>
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-bar-h': {
                const rechartsBarData = (effectiveData as Array<{ label: string; value: number; previousValue?: number }>) || []

                // Determine colors based on hierarchy:
                // 1. Explicit chartColors (Palette Editor)
                // 2. colorTheme (Legacy/Monochromatic Theme)
                // 3. Default Rainbow
                const themeColorId = comp.props.colorTheme as string
                const themeColorObj = COLOR_OPTIONS.find(c => c.id === themeColorId)

                let barColors: string[] = []

                if (comp.props.chartColors && Array.isArray(comp.props.chartColors) && comp.props.chartColors.length > 0) {
                    barColors = comp.props.chartColors as string[]
                } else if (themeColorObj) {
                    barColors = [themeColorObj.hex || '#3b82f6']
                } else {
                    barColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
                }

                if (!rechartsBarData || rechartsBarData.length === 0) {
                    return (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Sem dados
                        </div>
                    )
                }

                const maxValue = Math.max(...rechartsBarData.map(d => d.value || 0)) || 1

                // Responsive Scaling
                // Changed via previous tool calls, using context from memory to match lines

                // Dynamic Label Width Calculation
                const maxLabelLength = Math.max(...rechartsBarData.map(d => d.label?.toString().length || 0), 0)
                // Base: ~7px per char, min 60px, max 150px
                const calculatedWidth = maxLabelLength * 7 * scale
                const labelWidth = Math.min(150 * scale, Math.max(60 * scale, calculatedWidth))

                const fontSize = Math.max(6, 10 * scale);
                const valueFontSize = Math.max(6, 9 * scale);

                // Tooltip State (Removed from here, now at top level)

                return (
                    <div className="w-full h-full p-1 relative flex flex-col overflow-visible">
                        {onExplore && (
                            <div className="absolute top-0 right-1 z-10">
                                <ExploreButton onClick={onExplore} compact />
                            </div>
                        )}

                        {/* Tooltip Portal */}
                        {tooltipData && (
                            <PortalTooltip position={{ x: tooltipData.x, y: tooltipData.y }}>
                                <div className="bg-white text-slate-700 text-[11px] px-3 py-2 rounded-lg shadow-2xl border border-slate-100 flex flex-col gap-0.5">
                                    <span className="font-semibold text-slate-900 border-b border-slate-100 pb-1 mb-1 block">
                                        {tooltipData.d.label}
                                    </span>
                                    <span className="text-slate-500 flex justify-between gap-4">
                                        <span>Valor:</span>
                                        <span className="font-mono font-medium text-slate-700">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tooltipData.d.value)}
                                        </span>
                                    </span>
                                </div>
                                {/* Arrow */}
                                <div className="w-2 h-2 bg-white transform rotate-45 mx-auto -mt-1 shadow-sm border-r border-b border-slate-100"></div>
                            </PortalTooltip>
                        )}

                        {/* Scrollable Container for Bars */}
                        <div className="flex-1 flex flex-col overflow-y-auto w-full pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {rechartsBarData.map((d, i) => {
                                const percent = (d.value / maxValue) * 100
                                const color = barColors[i % barColors.length]

                                return (
                                    <div key={i} className="flex items-center w-full flex-1 min-h-[24px] group/row shrink-0">
                                        {/* Label Column - Now with dynamic width based on scale */}
                                        <div
                                            className="pr-2 flex justify-start shrink-0"
                                            style={{ width: `${labelWidth}px` }}
                                        >
                                            <span
                                                className="font-medium text-slate-600 text-left leading-tight truncate w-full block"
                                                style={{ fontSize: `${fontSize}px` }}
                                                title={d.label}
                                            >
                                                {d.label}
                                            </span>
                                        </div>

                                        {/* Bar Column */}
                                        <div className="flex-1 flex items-center h-full border-l border-slate-100 pl-1 relative">
                                            {/* The Bar */}
                                            <div
                                                className="h-[90%] max-h-40 rounded-r transition-all duration-500 relative group/bar"
                                                style={{
                                                    width: `${Math.max(1, percent)}%`,
                                                    backgroundColor: color
                                                }}
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect()
                                                    setTooltipData({ d, x: rect.left + rect.width / 2, y: rect.top })
                                                }}
                                                onMouseLeave={() => setTooltipData(null)}
                                            >
                                            </div>

                                            {/* Value Label - Scalable Font */}
                                            <span
                                                className="ml-2 font-semibold text-slate-400 whitespace-nowrap"
                                                style={{ fontSize: `${valueFontSize}px` }}
                                            >
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(d.value)}
                                            </span>
                                        </div>
                                    </div>

                                )
                            })}
                        </div>
                    </div >
                )
            }
            case 'recharts-line': {
                const rechartsLineData = (effectiveData as Array<{ label: string; value: number; previousValue?: number }>) || []

                // --- Visual Rules & Gradient Logic ---
                let metricDef = (effectiveData && effectiveData[0] ? (effectiveData[0] as any)._metricDef : null)
                if (!metricDef && comp.data?.query?.metric) {
                    metricDef = getMetricById(comp.data.query.metric)
                }

                // User preference (UI) takes precedence for the main/positive color
                const userColor = comp.props.primaryColor as string
                const positiveColor = userColor || metricDef?.visualRules?.positiveColor || '#8b5cf6'

                // Negative color comes from rules, or falls back to positive (monochrome)
                const negativeColor = metricDef?.visualRules?.negativeColor || positiveColor

                const showLegendLine = comp.props.showLegend !== false
                const showTooltipLine = comp.props.showTooltip !== false

                if (!rechartsLineData || rechartsLineData.length === 0) {
                    return (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Sem dados
                        </div>
                    )
                }

                // Calculate Gradient Offset for zero-baseline
                const values = rechartsLineData.map(d => Number(d.value) || 0)
                const max = Math.max(...values)
                const min = Math.min(...values)

                let gradientOffset = 0
                if (max <= 0) {
                    gradientOffset = 0
                } else if (min >= 0) {
                    gradientOffset = 1
                } else {
                    gradientOffset = max / (max - min)
                }

                const gradientId = `splitColorLine-${comp.id}`

                return (
                    <div className="w-full h-full p-1 relative" style={{ minWidth: 100, minHeight: 100 }}>
                        {onExplore && (
                            <div className="absolute top-1 right-1 z-10">
                                <ExploreButton onClick={onExplore} compact />
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%" minWidth={80} minHeight={80}>
                            <RechartsLineChart data={rechartsLineData} margin={{ top: 20, right: 20, left: 0, bottom: showLegendLine ? 10 : 5 }}>
                                <defs>
                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={gradientOffset} stopColor={positiveColor} stopOpacity={1} />
                                        <stop offset={gradientOffset} stopColor={negativeColor} stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#6b7280' }} stroke="#e5e7eb" axisLine={false} tickLine={false} />
                                <YAxis width={40} tick={{ fontSize: 9, fill: '#6b7280' }} stroke="#e5e7eb" axisLine={false} tickLine={false} tickFormatter={(value: any) => value.toLocaleString()} />
                                {showTooltipLine && (
                                    <RechartsTooltip
                                        cursor={{ stroke: '#cbd5e1', strokeDasharray: '5 5' }}
                                        contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', padding: '8px 12px' }}
                                        formatter={(value: any, name: string) => {
                                            const label = name === 'previousValue' ? 'Período Anterior' : 'Valor Atual'
                                            return [`${value.toLocaleString()}`, label]
                                        }}
                                        labelFormatter={(label) => `📈 ${label}`}
                                    />
                                )}
                                {showLegendLine && (
                                    <RechartsLegend
                                        wrapperStyle={{ fontSize: '8px', paddingTop: '0px' }}
                                        iconType="line"
                                        iconSize={10}
                                        verticalAlign="bottom"
                                        align="center"
                                    />
                                )}

                                {hasPreviousValue && (
                                    <RechartsLine
                                        type="monotone"
                                        dataKey="previousValue"
                                        name="Período Anterior"
                                        stroke="#cbd5e1"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        activeDot={{ r: 4, fill: '#cbd5e1', stroke: '#fff', strokeWidth: 1 }}
                                        animationDuration={0}
                                    />
                                )}

                                <RechartsLine
                                    type="monotone"
                                    dataKey="value"
                                    name="Valor Atual"
                                    stroke={`url(#${gradientId})`}
                                    strokeWidth={3}
                                    dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: positiveColor }}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                    animationDuration={0}
                                    animationEasing="ease-out"
                                />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-area': {
                const rechartsAreaData = (effectiveData as Array<{ label: string; value: number; previousValue?: number }>) || []

                // --- Visual Rules & Gradient Logic ---
                let metricDef = (effectiveData && effectiveData[0] ? (effectiveData[0] as any)._metricDef : null)
                if (!metricDef && comp.data?.query?.metric) {
                    metricDef = getMetricById(comp.data.query.metric)
                }

                // User preference (UI) takes precedence for the main/positive color
                const userColor = comp.props.primaryColor as string
                const positiveColor = userColor || metricDef?.visualRules?.positiveColor || '#10b981'

                // Negative color comes from rules, or falls back to positive (monochrome)
                const negativeColor = metricDef?.visualRules?.negativeColor || positiveColor

                const showLegendArea = comp.props.showLegend !== false
                const showTooltipArea = comp.props.showTooltip !== false

                if (!rechartsAreaData || rechartsAreaData.length === 0) {
                    return (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Sem dados
                        </div>
                    )
                }

                // Calculate Gradient Offset
                const values = rechartsAreaData.map(d => Number(d.value) || 0)
                const max = Math.max(...values)
                const min = Math.min(...values)

                let gradientOffset = 0
                if (max <= 0) {
                    gradientOffset = 0
                } else if (min >= 0) {
                    gradientOffset = 1
                } else {
                    gradientOffset = max / (max - min)
                }

                const gradientIdFill = `splitColorAreaFill-${comp.id}`
                const gradientIdStroke = `splitColorAreaStroke-${comp.id}`

                return (
                    <div className="w-full h-full p-1 relative" style={{ minWidth: 100, minHeight: 100 }}>
                        {onExplore && (
                            <div className="absolute top-1 right-1 z-10">
                                <ExploreButton onClick={onExplore} compact />
                            </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%" minWidth={80} minHeight={80}>
                            <RechartsAreaChart data={rechartsAreaData} margin={{ top: 20, right: 20, left: 0, bottom: showLegendArea ? 10 : 5 }}>
                                <defs>
                                    <linearGradient id={gradientIdFill} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={gradientOffset} stopColor={positiveColor} stopOpacity={0.8} />
                                        <stop offset={gradientOffset} stopColor={negativeColor} stopOpacity={0.8} />
                                    </linearGradient>
                                    <linearGradient id={gradientIdStroke} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset={gradientOffset} stopColor={positiveColor} stopOpacity={1} />
                                        <stop offset={gradientOffset} stopColor={negativeColor} stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#6b7280' }} stroke="#e5e7eb" axisLine={false} tickLine={false} />
                                <YAxis width={40} tick={{ fontSize: 9, fill: '#6b7280' }} stroke="#e5e7eb" axisLine={false} tickLine={false} tickFormatter={(value: any) => value.toLocaleString()} />
                                {showTooltipArea && (
                                    <RechartsTooltip
                                        cursor={{ stroke: '#cbd5e1', strokeDasharray: '5 5' }}
                                        contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', padding: '8px 12px' }}
                                        formatter={(value: any, name: string) => {
                                            const label = name === 'previousValue' ? 'Período Anterior' : 'Valor Atual'
                                            return [`${value.toLocaleString()}`, label]
                                        }}
                                        labelFormatter={(label) => `📉 ${label}`}
                                    />
                                )}
                                {showLegendArea && (
                                    <RechartsLegend
                                        wrapperStyle={{ fontSize: '8px', paddingTop: '0px' }}
                                        iconType="rect"
                                        iconSize={8}
                                        verticalAlign="bottom"
                                        align="center"
                                    />
                                )}

                                {hasPreviousValue && (
                                    <RechartsArea
                                        type="monotone"
                                        dataKey="previousValue"
                                        name="Período Anterior"
                                        stroke="#cbd5e1"
                                        fill="#f1f5f9"
                                        strokeWidth={1}
                                        dot={false}
                                        activeDot={{ r: 4, fill: '#cbd5e1', stroke: '#fff', strokeWidth: 1 }}
                                        animationDuration={0}
                                    />
                                )}

                                <RechartsArea
                                    type="monotone"
                                    dataKey="value"
                                    name="Valor Atual"
                                    stroke={`url(#${gradientIdStroke})`}
                                    fill={`url(#${gradientIdFill})`}
                                    strokeWidth={2}
                                    dot={{ r: 3, strokeWidth: 2, stroke: '#fff', fill: positiveColor }}
                                    activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                                    animationDuration={0}
                                    animationEasing="ease-out"
                                />
                            </RechartsAreaChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-pie': {
                const rechartsPieData = (effectiveData as Array<{ name: string; value: number }>) || []
                const defaultPieColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
                const pieColors = (comp.props.chartColors as string[]) || defaultPieColors
                const showLegendPie = comp.props.showLegend !== false
                const showTooltipPie = comp.props.showTooltip !== false

                if (!rechartsPieData || rechartsPieData.length === 0) {
                    return (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Sem dados
                        </div>
                    )
                }

                return (
                    <div className="w-full h-full p-1" style={{ minWidth: 100, minHeight: 100 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={80} minHeight={80}>
                            <RechartsPieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                                <RechartsPie
                                    data={rechartsPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    animationDuration={0}
                                    animationEasing="ease-out"
                                >
                                    {rechartsPieData.map((_, index) => (
                                        <RechartsCell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                    ))}
                                </RechartsPie>
                                {showTooltipPie && (
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', padding: '8px 12px' }}
                                        formatter={(value: any, name: any) => [`${value.toLocaleString()}`, name]}
                                    />
                                )}
                                {showLegendPie && (
                                    <RechartsLegend
                                        wrapperStyle={{ fontSize: '9px', marginTop: '-8px' }}
                                        iconType="circle"
                                        iconSize={6}
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                    />
                                )}
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-radar': {
                // Adapter: Convert standard { label, value } to Radar format { subject, A, fullMark }
                const rawData = effectiveData as any[] || []

                let finalRadarData = rawData

                // If data is in standard metric format (label/value), adapt it
                if (rawData.length > 0 && 'label' in rawData[0] && 'value' in rawData[0]) {
                    const maxValue = Math.max(...rawData.map(d => Number(d.value) || 0))
                    finalRadarData = rawData.map(d => ({
                        subject: d.label,
                        A: Number(d.value) || 0,
                        fullMark: maxValue * 1.2 // 20% buffer
                    }))
                }

                const radarColor = (comp.props.primaryColor as string) || '#8b5cf6'

                if (finalRadarData.length === 0) {
                    return (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Sem dados
                        </div>
                    )
                }

                return (
                    <div className="w-full h-full p-1" style={{ minWidth: 100, minHeight: 100 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={80} minHeight={80}>
                            <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={finalRadarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#6b7280' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 8, fill: '#94a3b8' }} axisLine={false} />
                                <RechartsRadar
                                    name="Valor"
                                    dataKey="A"
                                    stroke={radarColor}
                                    fill={radarColor}
                                    fillOpacity={0.6}
                                    animationDuration={0}
                                />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', padding: '8px 12px' }}
                                    formatter={(value: any) => [typeof value === 'number' ? value.toLocaleString() : value, 'Valor']}
                                />
                            </RechartsRadarChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-scatter': {
                const rawData = effectiveData as any[] || []

                // Adapter: If standard metric format {label, value}, map to {x, y, z}
                // Issue: Scatter needs Numeric X unless we use 'category' type axis. 
                // For 'Visualizar por Mês' (Temporal), we can use index as X or try to parse date.
                // Simpler approach for generic support: Use index as X, Label as name/tooltip.

                let scatterData = rawData
                let xAxisType: 'number' | 'category' = 'number'
                let dataKeyXUsed = (comp.props.dataKeyX as string) || 'x'

                if (rawData.length > 0 && 'label' in rawData[0] && 'value' in rawData[0]) {
                    xAxisType = 'category' // Use category axis for Labels
                    dataKeyXUsed = 'label' // Use label as X

                    scatterData = rawData.map((d, i) => ({
                        ...d,
                        x: i, // Fallback if number needed
                        y: Number(d.value) || 0,
                        z: 100 // Default size
                    }))
                }

                const scatterColor = (comp.props.fill as string) || '#10b981'
                const dataKeyY = (comp.props.dataKeyY as string) || 'value' // Default to value if adapted
                const dataKeyZ = (comp.props.dataKeyZ as string) || 'z'

                if (!scatterData || scatterData.length === 0) {
                    return (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            Sem dados
                        </div>
                    )
                }

                return (
                    <div className="w-full h-full p-2" style={{ minWidth: 100, minHeight: 100 }}>
                        <ResponsiveContainer width="99%" height="99%" minWidth={80} minHeight={80}>
                            <RechartsScatterChart data={scatterData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis
                                    type={xAxisType}
                                    dataKey={dataKeyXUsed}
                                    name="Dimensão"
                                    allowDuplicatedCategory={false} // Crucial for categorical scatter
                                    stroke="#64748b"
                                    fontSize={9}
                                    interval={0} // Show all ticks if possible
                                />
                                <YAxis
                                    type="number"
                                    dataKey={xAxisType === 'category' ? 'value' : 'y'}
                                    name="Valor"
                                    unit=""
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickFormatter={(val) => val.toLocaleString('pt-BR', { notation: 'compact' })}
                                    domain={['auto', 'auto']}
                                />
                                <ZAxis type="number" dataKey={dataKeyZ} range={[50, 400]} name="Tamanho" />
                                <RechartsTooltip
                                    cursor={{ strokeDasharray: '3 3' }}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderColor: '#e2e8f0',
                                        borderRadius: '8px',
                                        color: '#0f172a',
                                        fontSize: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    formatter={(value: any, name: any, props: any) => {
                                        if (typeof value === 'number') return [value.toLocaleString('pt-BR'), name];
                                        return [value, name];
                                    }}
                                />
                                <RechartsScatter
                                    name="Dados"
                                    data={scatterData}
                                    fill={scatterColor}
                                />
                            </RechartsScatterChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-radial': {
                const radialData = (effectiveData as any[]) || []
                const radialColor = (comp.props.primaryColor as string) || '#8b5cf6'

                if (!radialData || radialData.length === 0) {
                    return <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sem dados</div>
                }

                return (
                    <div className="w-full h-full p-1" style={{ minWidth: 100, minHeight: 100 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsRadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={radialData}>
                                <RechartsRadialBar
                                    label={{ position: 'insideStart', fill: '#fff' }}
                                    background
                                    dataKey="value"
                                    fill={radialColor}
                                    cornerRadius={10}
                                />
                                <RechartsLegend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ fontSize: '10px' }} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', padding: '8px 12px' }}
                                    cursor={false}
                                />
                            </RechartsRadialBarChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-treemap': {
                const treemapData = (effectiveData as any[]) || []

                // Treemap requires nested data or at least name/size
                // Adapter: If flat list {label, value}, works directly if we map to {name, size}
                // or use dataKey="value" nameKey="label"

                if (!treemapData || treemapData.length === 0) {
                    return <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sem dados</div>
                }

                return (
                    <div className="w-full h-full p-1" style={{ minWidth: 100, minHeight: 100 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsTreemap
                                data={treemapData}
                                dataKey="value"
                                nameKey="label"
                                aspectRatio={4 / 3}
                                stroke="#fff"
                                fill="#8884d8"
                                content={(props: any) => {
                                    const { x, y, width, height, name, value, index } = props;
                                    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
                                    return (
                                        <g>
                                            <rect
                                                x={x}
                                                y={y}
                                                width={width}
                                                height={height}
                                                style={{
                                                    fill: colors[index % colors.length],
                                                    stroke: '#fff',
                                                    strokeWidth: 2 / (props.depth || 1),
                                                    strokeOpacity: 1 / (props.depth || 1),
                                                }}
                                            />
                                            {width > 30 && height > 20 && (
                                                <text
                                                    x={x + width / 2}
                                                    y={y + height / 2}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fill="#fff"
                                                    fontSize={Math.min(12, width / 5)}
                                                >
                                                    {name}
                                                </text>
                                            )}
                                        </g>
                                    );
                                }}
                            >
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', padding: '8px 12px' }}
                                    formatter={(value: any) => [typeof value === 'number' ? value.toLocaleString() : value, 'Valor']}
                                />
                            </RechartsTreemap>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-funnel': {
                const funnelData = (effectiveData as any[]) || []
                // Funnel expects "value"
                // Sort data descending for funnel? Recharts funnel doesn't auto-sort?
                // Adapter: Sort by value desc
                const sortedData = [...funnelData].sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0))

                if (!funnelData || funnelData.length === 0) {
                    return <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sem dados</div>
                }

                return (
                    <div className="w-full h-full p-1" style={{ minWidth: 100, minHeight: 100 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsFunnelChart>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', padding: '8px 12px' }}
                                />
                                <RechartsFunnel
                                    dataKey="value"
                                    data={sortedData}
                                    isAnimationActive
                                >
                                    <LabelList position="right" fill="#000" stroke="none" dataKey="label" />
                                </RechartsFunnel>
                            </RechartsFunnelChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'recharts-composed': {
                const composedData = (effectiveData as any[]) || []
                const showLegend = comp.props.showLegend !== false
                const primaryColor = (comp.props.primaryColor as string) || '#3b82f6'
                const secondaryColor = (comp.props.secondaryColor as string) || '#ef4444'

                if (!composedData || composedData.length === 0) {
                    return <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Sem dados</div>
                }

                return (
                    <div className="w-full h-full p-1" style={{ minWidth: 100, minHeight: 100 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsComposedChart data={composedData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <XAxis dataKey="label" scale="band" tick={{ fontSize: 9 }} />
                                <YAxis tick={{ fontSize: 9 }} />
                                <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                                {showLegend && <RechartsLegend wrapperStyle={{ fontSize: '10px' }} />}
                                <RechartsArea type="monotone" dataKey="value" fill={primaryColor} stroke={primaryColor} fillOpacity={0.1} />
                                <RechartsBar dataKey="value" barSize={20} fill={primaryColor} fillOpacity={0.8} />
                                <RechartsLine type="monotone" dataKey="previousValue" stroke={secondaryColor} />
                            </RechartsComposedChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
            case 'table': {
                // Se houver dados calculados (effectiveData), usar para popular a tabela dinamicamente
                let tableProps = comp.props

                if (effectiveData && Array.isArray(effectiveData) && effectiveData.length > 0) {
                    // Tentar detectar se é formato de métrica {label, value}
                    const firstItem = effectiveData[0]
                    if (firstItem && typeof firstItem === 'object' && 'label' in firstItem && 'value' in firstItem) {
                        const metricsQuery = (comp.dataSource as any)?.metricsQuery

                        // 1. Coluna de Agrupamento
                        const labelCol = metricsQuery?.groupBy || 'Dimensão'

                        // Map known dimension IDs to friendly names
                        const dimensionNameMap: Record<string, string> = {
                            'time-hour': 'Hora',
                            'time-day': 'Dia',
                            'time-week': 'Semana',
                            'time-month': 'Mês',
                            'time-quarter': 'Trimestre',
                            'time-year': 'Ano',
                            'product-dimension': 'Produto',
                            'category-dimension': 'Categoria',
                            'example-region': 'Região',
                            'example-status': 'Status'
                        }

                        const labelColFormatted = dimensionNameMap[labelCol] ||
                            labelCol.charAt(0).toUpperCase() + labelCol.slice(1).replace(/[-_]/g, ' ')

                        // 2. Identificar colunas para exibição
                        const ignoredKeys = ['label', 'timestamp', 'previousValue', 'original', 'id', 'date', '_isTotal', 'movimento', 'tipo', 'contaFinanceira', 'contaContabil', 'centroCusto', 'unidade', 'valor', 'valorEfetivado', 'dataVencimento', 'dataEfetivacao', 'status']

                        // Detectar colunas de texto relevantes (para Extratos/Listas)
                        const textKeys = Object.keys(firstItem).filter(k =>
                            !ignoredKeys.includes(k) &&
                            typeof (firstItem as any)[k] === 'string' &&
                            k !== 'label'
                        )

                        // Detectar colunas numéricas
                        let valueKeys = Object.keys(firstItem).filter(k =>
                            !ignoredKeys.includes(k) &&
                            typeof (firstItem as any)[k] === 'number'
                        )

                        // Se tiver colunas de texto (Ex: Extrato), usar modo "Tabela Rica"
                        const isRichTable = textKeys.length > 0

                        let finalKeys: string[] = []

                        if (isRichTable) {
                            // Ordem customizada para Extrato: Vencimento, Status, Valor Formatado
                            finalKeys = [...textKeys, ...valueKeys].sort((a, b) => {
                                const score = (k: string) => {
                                    if (k.includes('emitente')) return 1
                                    if (k.includes('vencimento')) return 2
                                    if (k.includes('status')) return 3
                                    if (k.includes('valor')) return 4
                                    return 99
                                }
                                return score(a) - score(b)
                            })
                        } else {
                            // Modo Pivot Numérico (Padrão Antigo)
                            // Se há colunas específicas além de 'value', remover 'value' para evitar duplicação
                            const specificCols = valueKeys.filter(k => k !== 'value')
                            if (specificCols.length > 0) {
                                valueKeys = specificCols
                            }

                            // Ordenar colunas na ordem lógica para tabelas financeiras
                            const columnOrder = ['pagar', 'receber', 'saldo', 'totalPagar', 'totalReceber', 'totalSaldo']
                            valueKeys.sort((a, b) => {
                                const idxA = columnOrder.indexOf(a)
                                const idxB = columnOrder.indexOf(b)
                                if (idxA !== -1 && idxB !== -1) return idxA - idxB
                                if (idxA !== -1) return -1
                                if (idxB !== -1) return 1
                                return a.localeCompare(b)
                            })
                            finalKeys = valueKeys
                        }

                        // Helper de formatação
                        const formatValue = (val: any, colName: string) => {
                            if (val === null || val === undefined) return '-'
                            if (typeof val !== 'number') return String(val)

                            const checkName = (colName === 'value' || colName === 'valor_formatado') ? (metricsQuery?.metric || 'Valor') : colName

                            // Sempre usar formatação de moeda para colunas financeiras
                            const isCurrency = /valor|preço|custo|lucro|venda|receita|montante|ticket|faturamento|pagar|receber|saldo/i.test(checkName)

                            if (isCurrency) return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            if (val % 1 !== 0) return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            return val.toLocaleString('pt-BR')
                        }

                        // 3. Headers
                        const headerMapGrouped: Record<string, string> = {
                            'pagar': 'Pagar',
                            'receber': 'Receber',
                            'saldo': 'Saldo',
                            'totalPagar': 'Pagar',
                            'totalReceber': 'Receber',
                            'totalSaldo': 'Saldo',
                            'valor_formatado': 'Valor',
                            'status_desc': 'Status',
                            'vencimento': 'Vencimento',
                            'emitente': 'Emitente'
                        }

                        const headerMapSimple: Record<string, string> = { ...headerMapGrouped, 'totalPagar': 'Total Pagar', 'totalReceber': 'Total Receber', 'totalSaldo': 'Total Saldo' }

                        // Detectar se é tabela financeira com grupos
                        const isFinanceiroGrouped = !isRichTable && valueKeys.includes('pagar') && valueKeys.includes('totalPagar')
                        const headerMap = isFinanceiroGrouped ? headerMapGrouped : headerMapSimple

                        const dynamicColumns = [labelColFormatted]
                        finalKeys.forEach(k => {
                            const header = headerMap[k] || k.charAt(0).toUpperCase() + k.slice(1).replace(/[-_]/g, ' ')
                            dynamicColumns.push(header)
                        })

                        // 3.1 Gerar grupos de colunas
                        let columnGroups: { label: string; colSpan: number }[] | undefined
                        if (isFinanceiroGrouped) {
                            columnGroups = [
                                { label: '', colSpan: 1 },
                                { label: '2025', colSpan: 3 },
                                { label: 'Total geral', colSpan: 3 }
                            ]
                        }

                        // 4. Rows
                        const dynamicRows = effectiveData.map((d: any) => {
                            const row = [String(d.label || '-')]
                            finalKeys.forEach(k => {
                                row.push(formatValue(d[k], k))
                            })
                            if (d._isTotal) {
                                (row as any)._isTotal = true
                            }
                            return row
                        })

                        tableProps = {
                            ...comp.props,
                            columns: dynamicColumns,
                            rows: dynamicRows,
                            columnGroups  // Grupos de colunas para cabeçalhos de 2 níveis
                        }
                    }
                }

                return (
                    <div className="w-full h-full overflow-hidden relative">
                        {onExplore && (
                            <div className="absolute top-1 right-1 z-20">
                                <ExploreButton onClick={onExplore} compact />
                            </div>
                        )}
                        <CanvasTable props={tableProps} scale={scale} />
                    </div>
                )
            }
            default:
                return (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50 text-xs">
                        {comp.type}
                    </div>
                )
        }
    }

    // Renderizar com Wrapper se necessário (Overlay para componentes sem métrica)
    if (isDataComponent && !hasMetricConfigured && !hasStaticConfig) {
        return (
            <div className="relative w-full h-full group">
                <div className="w-full h-full opacity-30 blur-[1px] transition-all duration-300 group-hover:opacity-40 group-hover:blur-0">
                    {renderContent()}
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-200 shadow-sm text-center transform transition-transform duration-300 group-hover:scale-105">
                        <Activity className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
                        <span className="text-xs font-medium text-slate-600 block w-40">
                            Defina uma métrica para visualizar os dados
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return renderContent()
}
