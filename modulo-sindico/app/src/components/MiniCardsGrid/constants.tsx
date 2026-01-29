import {
    Type, Hash, FileText, Activity, TrendingUp, Minus, Tag, BarChart3, LineChart,
    AreaChart, PieChart, Target, Grid3X3, ListCollapse, Table2, MoreVertical,
    BarChartHorizontal, ScatterChart, CheckCircle, DollarSign, Smile
} from 'lucide-react'

import { CanvasComponent, CanvasComponentType, CardSizeConfig } from './types'
// ... (rest of imports)

export const AVAILABLE_COMPONENTS: { type: CanvasComponentType; label: string; icon: React.ReactNode; category: string }[] = [
    { type: 'title', label: 'Título', icon: <Type className="h-4 w-4" />, category: 'Texto' },
    { type: 'description', label: 'Descrição', icon: <FileText className="h-4 w-4" />, category: 'Texto' },
    { type: 'icon', label: 'Ícone', icon: <Activity className="h-4 w-4" />, category: 'Visual' },
    { type: 'trend', label: 'Tendência', icon: <TrendingUp className="h-4 w-4" />, category: 'Indicadores' },
    { type: 'progress', label: 'Progresso', icon: <Minus className="h-4 w-4" />, category: 'Indicadores' },
    { type: 'badge', label: 'Badge', icon: <Tag className="h-4 w-4" />, category: 'Indicadores' },

    // KPI Widget Unificado
    { type: 'kpi-unified', label: 'KPI', icon: <TrendingUp className="h-4 w-4" />, category: 'Indicadores' },

    { type: 'recharts-bar', label: 'Barras', icon: <BarChart3 className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-bar-h', label: 'Barras Hor.', icon: <BarChartHorizontal className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-line', label: 'Linha', icon: <LineChart className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-area', label: 'Área', icon: <AreaChart className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-pie', label: 'Pizza', icon: <PieChart className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-radar', label: 'Radar', icon: <Target className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-radial', label: 'Radial', icon: <Activity className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-scatter', label: 'Dispersão', icon: <ScatterChart className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-composed', label: 'Composto', icon: <BarChart3 className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-treemap', label: 'Treemap', icon: <Grid3X3 className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'recharts-funnel', label: 'Funil', icon: <ListCollapse className="h-4 w-4" />, category: 'Gráficos' },
    { type: 'table', label: 'Tabela', icon: <Table2 className="h-4 w-4" />, category: 'Dados' },
    { type: 'divider', label: 'Linha', icon: <Minus className="h-4 w-4" />, category: 'Layout' },
    { type: 'spacer', label: 'Barra', icon: <MoreVertical className="h-4 w-4" />, category: 'Layout' }
]

// ============================================
// CHART COMPONENT TYPES
// ============================================

/** Lista de tipos de componentes que são gráficos/visualizações de dados */
export const CHART_COMPONENT_TYPES: CanvasComponentType[] = [
    'table',
    'recharts-bar',
    'recharts-bar-h',
    'recharts-line',
    'recharts-area',
    'recharts-pie',
    'recharts-radar',
    'recharts-radial',
    'recharts-scatter',
    'recharts-composed',
    'recharts-treemap',
    'recharts-funnel',
    'recharts-donut',
    'kpi-unified'
]

/** Verifica se um tipo de componente é um gráfico/visualização de dados */
export function isChartComponent(type: CanvasComponentType): boolean {
    return CHART_COMPONENT_TYPES.includes(type)
}


// Canvas config - grid 48x32 (largura x altura)
export const GRID_COLS = 48
export const GRID_ROWS = 32

// ============================================
// COMPONENT SIZING (LEGACY / MINIMUMS)
// ============================================

// Tamanhos MÍNIMOS de card (não pode reduzir abaixo disso no resize)
export const MIN_CARD_SIZES: Record<CanvasComponentType, CardSizeConfig> = {
    // Componentes simples - podem ser 2x2 (era 1x1)
    'title': { cols: 2, rows: 2 },
    'value': { cols: 2, rows: 2 },
    'description': { cols: 2, rows: 2 },
    'icon': { cols: 2, rows: 2 },
    'trend': { cols: 2, rows: 2 },
    'divider': { cols: 4, rows: 1 },
    'spacer': { cols: 1, rows: 4 },
    'progress': { cols: 2, rows: 2 },
    'badge': { cols: 2, rows: 2 },
    'kpi-unified': { cols: 2, rows: 2 },

    // Gráficos de barra/linha/área - mínimo 2x4 (era 1x2)
    'chart-bar': { cols: 2, rows: 4 },
    'chart-bar-h': { cols: 2, rows: 4 },
    'chart-line': { cols: 2, rows: 4 },
    'chart-area': { cols: 2, rows: 4 },
    'recharts-bar': { cols: 2, rows: 4 },
    'recharts-line': { cols: 2, rows: 4 },
    'recharts-area': { cols: 2, rows: 4 },
    'recharts-composed': { cols: 2, rows: 4 },
    'recharts-scatter': { cols: 2, rows: 4 },

    // Gráficos circulares/radiais - mínimo 2x4 (era 1x2)
    'chart-pie': { cols: 2, rows: 4 },
    'chart-donut': { cols: 2, rows: 4 },
    'chart-gauge': { cols: 2, rows: 4 },
    'recharts-pie': { cols: 2, rows: 4 },
    'recharts-radar': { cols: 2, rows: 4 },
    'recharts-radial': { cols: 2, rows: 4 },

    // Gráficos especiais
    'chart-heatmap': { cols: 4, rows: 4 }, // era 2x2
    'recharts-treemap': { cols: 4, rows: 4 }, // era 2x2
    'recharts-funnel': { cols: 4, rows: 4 }, // era 2x2

    // Tabelas
    'table': { cols: 4, rows: 4 }, // era 2x2
}

// Tamanhos PADRÃO de card (tamanho inicial ao adicionar)
export const DEFAULT_CARD_SIZES: Record<CanvasComponentType, CardSizeConfig> = {
    // Componentes simples - iniciam 2x2 (era 1x1)
    'title': { cols: 2, rows: 2 },
    'value': { cols: 2, rows: 2 },
    'description': { cols: 2, rows: 2 },
    'icon': { cols: 2, rows: 2 },
    'trend': { cols: 2, rows: 2 },
    'divider': { cols: 4, rows: 1 },
    'spacer': { cols: 1, rows: 4 },
    'progress': { cols: 2, rows: 2 },
    'badge': { cols: 2, rows: 2 },
    'kpi-unified': { cols: 2, rows: 2 },

    // Gráficos de barra/linha/área - iniciam 4x6 (era 2x3)
    'chart-bar': { cols: 4, rows: 6 },
    'chart-bar-h': { cols: 4, rows: 6 },
    'chart-line': { cols: 4, rows: 6 },
    'chart-area': { cols: 4, rows: 6 },
    'recharts-bar': { cols: 4, rows: 6 },
    'recharts-line': { cols: 4, rows: 6 },
    'recharts-area': { cols: 4, rows: 6 },
    'recharts-composed': { cols: 4, rows: 6 },
    'recharts-scatter': { cols: 4, rows: 6 },

    // Gráficos circulares/radiais - iniciam 2x4 (era 1x2)
    'chart-pie': { cols: 2, rows: 4 },
    'chart-donut': { cols: 2, rows: 4 },
    'chart-gauge': { cols: 2, rows: 4 },
    'recharts-pie': { cols: 2, rows: 4 },
    'recharts-radar': { cols: 2, rows: 4 },
    'recharts-radial': { cols: 2, rows: 4 },

    // Gráficos especiais
    'chart-heatmap': { cols: 6, rows: 4 }, // era 3x2
    'recharts-treemap': { cols: 4, rows: 4 }, // era 2x2
    'recharts-funnel': { cols: 4, rows: 4 }, // era 2x2

    // Tabelas
    'table': { cols: 4, rows: 4 }, // era 2x2
}

// ============================================
// HELPER FUNCTIONS (SIZING)
// ============================================

// Calcula o tamanho padrão (em grid units) por tipo de componente
export const getComponentDefaultSize = (type: CanvasComponentType): { width: number; height: number } => {
    switch (type) {
        case 'title': return { width: 24, height: 4 } // era 12x2
        case 'value': return { width: 16, height: 8 } // era 8x4
        case 'description': return { width: 24, height: 4 } // era 12x2
        case 'icon': return { width: 8, height: 8 } // era 4x4
        case 'trend': return { width: 12, height: 4 } // era 6x2
        case 'progress': return { width: 24, height: 4 } // era 12x2
        case 'badge': return { width: 8, height: 4 } // era 4x2
        case 'chart-bar':
        case 'chart-line':
        case 'chart-area': return { width: 24, height: 12 } // era 12x6
        case 'chart-bar-h': return { width: 24, height: 16 } // era 12x8
        case 'chart-pie':
        case 'chart-donut': return { width: 16, height: 16 } // era 8x8
        case 'chart-gauge': return { width: 16, height: 12 } // era 8x6
        case 'chart-heatmap': return { width: 40, height: 20 } // era 20x10
        case 'recharts-bar':
        case 'recharts-line':
        case 'recharts-area':
        case 'recharts-pie':
        case 'recharts-radar':
        case 'recharts-radial':
        case 'recharts-scatter':
        case 'recharts-composed':
        case 'recharts-treemap':
        case 'recharts-funnel': return { width: 48, height: 32 } // Tamanho cheio do canvas (48x32)
        case 'table': return { width: 32, height: 16 } // era 16x8
        case 'divider': return { width: 48, height: 4 } // Linha horizontal (larga, baixa)
        case 'spacer': return { width: 3, height: 32 } // Barra vertical (estreita, alta)
        case 'kpi-unified': return { width: 48, height: 32 }
        default: return { width: 16, height: 8 } // era 8x4
    }
}

// Calcula o tamanho mínimo de card baseado nos componentes do canvas
export function getMinCardSize(canvasComponents?: CanvasComponent[]): CardSizeConfig {
    if (!canvasComponents || canvasComponents.length === 0) {
        return { cols: 1, rows: 1 }
    }

    let minCols = 1
    let minRows = 1

    for (const comp of canvasComponents) {
        const minSize = MIN_CARD_SIZES[comp.type] || { cols: 1, rows: 1 }
        minCols = Math.max(minCols, minSize.cols)
        minRows = Math.max(minRows, minSize.rows)
    }

    return { cols: minCols, rows: minRows }
}

// Calcula o tamanho padrão de card baseado nos componentes do canvas (para novos cards)
export function getDefaultCardSize(canvasComponents?: CanvasComponent[]): CardSizeConfig {
    if (!canvasComponents || canvasComponents.length === 0) {
        return { cols: 1, rows: 1 }
    }

    let defaultCols = 1
    let defaultRows = 1

    for (const comp of canvasComponents) {
        const defaultSize = DEFAULT_CARD_SIZES[comp.type] || { cols: 1, rows: 1 }
        defaultCols = Math.max(defaultCols, defaultSize.cols)
        defaultRows = Math.max(defaultRows, defaultSize.rows)
    }

    return { cols: defaultCols, rows: defaultRows }
}

// ============================================
// COLORS & VISUALS
// ============================================

export const COLOR_OPTIONS = [
    { id: 'blue', text: 'text-blue-600', bg: 'bg-blue-100', bgHex: '#dbeafe', bgSolid: 'bg-blue-500', hex: '#3b82f6', border: 'border-blue-200', label: 'Azul' },
    { id: 'emerald', text: 'text-emerald-600', bg: 'bg-emerald-100', bgHex: '#d1fae5', bgSolid: 'bg-emerald-500', hex: '#10b981', border: 'border-emerald-200', label: 'Verde' },
    { id: 'amber', text: 'text-amber-600', bg: 'bg-amber-100', bgHex: '#fef3c7', bgSolid: 'bg-amber-500', hex: '#f59e0b', border: 'border-amber-200', label: 'Âmbar' },
    { id: 'rose', text: 'text-rose-600', bg: 'bg-rose-100', bgHex: '#ffe4e6', bgSolid: 'bg-rose-500', hex: '#f43f5e', border: 'border-rose-200', label: 'Rosa' },
    { id: 'purple', text: 'text-purple-600', bg: 'bg-purple-100', bgHex: '#f3e8ff', bgSolid: 'bg-purple-500', hex: '#a855f7', border: 'border-purple-200', label: 'Roxo' },
    { id: 'slate', text: 'text-slate-600', bg: 'bg-slate-100', bgHex: '#f1f5f9', bgSolid: 'bg-slate-500', hex: '#64748b', border: 'border-slate-200', label: 'Cinza' },
    { id: 'cyan', text: 'text-cyan-600', bg: 'bg-cyan-100', bgHex: '#cffafe', bgSolid: 'bg-cyan-500', hex: '#06b6d4', border: 'border-cyan-200', label: 'Ciano' },
    { id: 'orange', text: 'text-orange-600', bg: 'bg-orange-100', bgHex: '#ffedd5', bgSolid: 'bg-orange-500', hex: '#f97316', border: 'border-orange-200', label: 'Laranja' }
]

export const DEFAULT_PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
export const DEFAULT_PALETTE = DEFAULT_PIE_COLORS

