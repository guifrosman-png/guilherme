import React, { useState } from 'react'
import {
    X,
    Minus,
    BarChart3,
    LineChart,
    AreaChart,
    PieChart,
    TrendingUp,
    Type,
    Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    CardEditorConfig,
    CardEditorModalProps
} from '../types'

export function CardEditorModal({ cardId, availableMetrics, data, initialConfig, onClose, onSave }: CardEditorModalProps) {
    const metrica = availableMetrics.find(m => m.id === cardId)

    const [config, setConfig] = useState<CardEditorConfig>(initialConfig || {
        titulo: metrica?.titulo || '',
        descricao: metrica?.descricao || '',
        categoria: metrica?.categoria || 'filas',
        chartType: 'none',
        fontSize: 'lg',
        showTrend: true,
        colorScheme: metrica?.cor || 'text-blue-600'
    })

    // Prevent crash if metrica not found
    if (!metrica) return null

    const Icon = metrica.icon
    const value = metrica.getValue(data)

    const fontSizes = {
        sm: { value: 'text-2xl', title: 'text-xs', desc: 'text-xs' },
        md: { value: 'text-3xl', title: 'text-sm', desc: 'text-xs' },
        lg: { value: 'text-4xl', title: 'text-base', desc: 'text-sm' },
        xl: { value: 'text-5xl', title: 'text-lg', desc: 'text-base' }
    }

    const colorOptions = [
        { id: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200', label: 'Azul' },
        { id: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200', label: 'Verde' },
        { id: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200', label: 'Âmbar' },
        { id: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200', label: 'Rosa' },
        { id: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200', label: 'Roxo' },
        { id: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', label: 'Cinza' }
    ]

    const chartOptions = [
        { id: 'none', icon: Minus, label: 'Sem gráfico' },
        { id: 'bar', icon: BarChart3, label: 'Barras' },
        { id: 'line', icon: LineChart, label: 'Linha' },
        { id: 'area', icon: AreaChart, label: 'Área' },
        { id: 'pie', icon: PieChart, label: 'Pizza' }
    ]

    const currentFontSize = fontSizes[config.fontSize]
    const currentColor = colorOptions.find(c => c.id === config.colorScheme) || colorOptions[0]

    // Mini gráfico de exemplo
    const renderMiniChart = () => {
        if (config.chartType === 'none') return null

        const chartHeight = 40
        const data = [30, 45, 28, 55, 42, 60, 48]

        if (config.chartType === 'bar') {
            return (
                <div className="flex items-end gap-1 h-10 mt-2">
                    {data.map((v, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-t ${currentColor.bg}`}
                            style={{ height: `${(v / 60) * chartHeight}px` }}
                        />
                    ))}
                </div>
            )
        }

        if (config.chartType === 'line' || config.chartType === 'area') {
            const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / 60) * 100}`).join(' ')
            return (
                <svg viewBox="0 0 100 100" className="h-10 w-full mt-2" preserveAspectRatio="none">
                    {config.chartType === 'area' && (
                        <polygon
                            points={`0,100 ${points} 100,100`}
                            className={`${currentColor.bg} opacity-50`}
                            fill="currentColor"
                        />
                    )}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className={config.colorScheme}
                    />
                </svg>
            )
        }

        if (config.chartType === 'pie') {
            return (
                <div className="flex justify-center mt-2">
                    <svg viewBox="0 0 32 32" className="h-10 w-10">
                        <circle r="16" cx="16" cy="16" className="fill-slate-100" />
                        <circle
                            r="8"
                            cx="16"
                            cy="16"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="16"
                            strokeDasharray="35 65"
                            transform="rotate(-90 16 16)"
                            className={config.colorScheme}
                        />
                    </svg>
                </div>
            )
        }

        return null
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-4 md:inset-8 lg:inset-12 z-[10001] flex items-center justify-center pointer-events-none">
                <div
                    className="pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-full flex flex-col animate-scaleIn overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${currentColor.bg}`}>
                                <Icon className={`h-5 w-5 ${config.colorScheme}`} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-neutral-800">
                                    Editor de Card
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Personalize a aparência e conteúdo do card
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content - Canvas e Controles */}
                    <div className="flex-1 flex min-h-0 overflow-hidden">
                        {/* Canvas - Preview do Card */}
                        <div className="flex-1 bg-slate-50 p-8 flex items-center justify-center overflow-auto">
                            <div className="relative">
                                {/* Fundo com grid */}
                                <div className="absolute inset-0 -m-8 opacity-30"
                                    style={{
                                        backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}
                                />

                                {/* Card Preview */}
                                <div
                                    className={`card-modern border ${currentColor.border} p-6 relative transition-all duration-300 bg-white shadow-lg rounded-xl`}
                                    style={{ width: '320px', minHeight: '200px' }}
                                >
                                    {/* Header do card */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-neutral-600 font-medium ${currentFontSize.title} truncate pr-2`}>
                                            {config.titulo || 'Título do Card'}
                                        </span>
                                        <Icon className={`h-6 w-6 ${config.colorScheme} shrink-0`} />
                                    </div>

                                    {/* Valor */}
                                    <div className="flex-1 flex flex-col">
                                        <div className={`font-bold ${config.colorScheme} ${currentFontSize.value}`}>
                                            {value}
                                        </div>

                                        {/* Tendência */}
                                        {config.showTrend && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                                <span className="text-emerald-600 text-sm font-medium">+12%</span>
                                                <span className="text-slate-400 text-xs">vs mês anterior</span>
                                            </div>
                                        )}

                                        {/* Gráfico */}
                                        {renderMiniChart()}

                                        {/* Descrição */}
                                        <p className={`text-neutral-500 ${currentFontSize.desc} mt-3`}>
                                            {config.descricao || 'Descrição do card'}
                                        </p>
                                    </div>
                                </div>

                                {/* Indicador de tamanho */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-400">
                                    320 x 200px (1x1)
                                </div>
                            </div>
                        </div>

                        {/* Painel de Controles */}
                        <div className="w-[480px] border-l border-slate-200 bg-white flex flex-col overflow-hidden">
                            <ScrollArea className="flex-1 min-h-0">
                                <div className="p-5 space-y-6">
                                    {/* Seção: Conteúdo */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <Type className="h-4 w-4" />
                                            Conteúdo
                                        </h3>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Título
                                            </label>
                                            <input
                                                type="text"
                                                value={config.titulo}
                                                onChange={(e) => setConfig(prev => ({ ...prev, titulo: e.target.value }))}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Descrição
                                            </label>
                                            <textarea
                                                value={config.descricao}
                                                onChange={(e) => setConfig(prev => ({ ...prev, descricao: e.target.value }))}
                                                rows={2}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Categoria
                                            </label>
                                            <select
                                                value={config.categoria}
                                                onChange={(e) => setConfig(prev => ({ ...prev, categoria: e.target.value }))}
                                                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            >
                                                <option value="filas">Filas & Regras</option>
                                                <option value="investigadores">Investigadores</option>
                                                <option value="performance">Performance</option>
                                                <option value="financeiro">Financeiro</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Seção: Aparência */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <Palette className="h-4 w-4" />
                                            Aparência
                                        </h3>

                                        {/* Cores */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Cor do tema
                                            </label>
                                            <div className="grid grid-cols-6 gap-2">
                                                {colorOptions.map(color => (
                                                    <button
                                                        key={color.id}
                                                        onClick={() => setConfig(prev => ({ ...prev, colorScheme: color.id }))}
                                                        className={`w-full aspect-square rounded-lg border-2 transition-all ${config.colorScheme === color.id
                                                            ? `${color.border} ring-2 ring-offset-1 ring-slate-400`
                                                            : 'border-transparent hover:border-slate-200'
                                                            } ${color.bg}`}
                                                        title={color.label}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tamanho da fonte */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Tamanho do valor
                                            </label>
                                            <div className="flex gap-1">
                                                {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => setConfig(prev => ({ ...prev, fontSize: size }))}
                                                        className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-all ${config.fontSize === size
                                                            ? 'bg-primary text-white border-primary'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        {size.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mostrar tendência */}
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700">
                                                Mostrar tendência
                                            </label>
                                            <button
                                                onClick={() => setConfig(prev => ({ ...prev, showTrend: !prev.showTrend }))}
                                                className={`w-11 h-6 rounded-full transition-all ${config.showTrend ? 'bg-primary' : 'bg-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${config.showTrend ? 'translate-x-5' : 'translate-x-0.5'
                                                    }`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Seção: Gráfico */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <BarChart3 className="h-4 w-4" />
                                            Gráfico
                                        </h3>

                                        <div className="grid grid-cols-5 gap-2">
                                            {chartOptions.map(chart => {
                                                const ChartIcon = chart.icon
                                                return (
                                                    <button
                                                        key={chart.id}
                                                        onClick={() => setConfig(prev => ({ ...prev, chartType: chart.id as any }))}
                                                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${config.chartType === chart.id
                                                            ? 'border-primary bg-primary/5 text-primary'
                                                            : 'border-slate-200 hover:border-slate-300 text-slate-500'
                                                            }`}
                                                    >
                                                        <ChartIcon className="h-5 w-5" />
                                                        <span className="text-[10px] font-medium">{chart.label}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                                <Button variant="ghost" onClick={onClose}>
                                    Cancelar
                                </Button>
                                <Button onClick={() => onSave(config)}>
                                    Salvar Alterações
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
