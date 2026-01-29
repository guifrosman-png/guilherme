
import { MetricaAtiva } from '../../types'

// ============================================
// DASHBOARD PADRÃO (ABA DASHBOARD)
// ============================================
export const FINANCEIRO_DEFAULT_LAYOUT: MetricaAtiva[] = [
    // KPIs no topo
    { id: 'fin-revenue-v2', size: '1x1', row: 0, col: 0 },
    { id: 'fin-expense-v2', size: '1x1', row: 0, col: 1 },
    { id: 'fin-balance-v2', size: '1x1', row: 0, col: 2 },
    { id: 'lucratividade-margem-kpi', size: '1x1', row: 0, col: 3 }
]

// ============================================
// RELATÓRIOS ESPECÍFICOS (PRESETS PARA REPORTS)
// ============================================

// Relatório Financeiro V2 (Shared Data Layer Showcase)
export const FINANCE_V2_LAYOUT: MetricaAtiva[] = [
    // Linha 0: KPIs de Alto Nível
    { id: 'fin-revenue-v2', size: '2x1', row: 0, col: 0 },
    { id: 'fin-expense-v2', size: '2x1', row: 0, col: 2 },
    { id: 'fin-balance-v2', size: '2x1', row: 0, col: 4 },

    // Linha 1: Evolução Temporal (Receita x Despesa)
    {
        id: 'fin-evolution-v2',
        size: '6x3', // Card grande
        row: 1,
        col: 0,
        tempConfig: { chartType: 'recharts-composed' } // Config visual default
    },

    // Linha 4: Breakdowns (Categorias e Fornecedores)
    {
        id: 'fin-category-v2',
        size: '3x3',
        row: 4,
        col: 0,
        tempConfig: { chartType: 'recharts-pie' } // Pizza
    },
    {
        id: 'fin-top-suppliers-v2',
        size: '3x3',
        row: 4,
        col: 3,
        tempConfig: { chartType: 'recharts-bar-h' } // Barras horizontais
    }
]

// Relatório de Lucratividade (Legacy - Mantido)
export const PROFITABILITY_REPORT_LAYOUT: MetricaAtiva[] = [
    { id: 'lucratividade-faturamento-kpi', size: '1x1', row: 0, col: 0 },
    { id: 'lucratividade-lucro-kpi', size: '1x1', row: 0, col: 1 },
    { id: 'lucratividade-itens-kpi', size: '1x1', row: 0, col: 2 },
    { id: 'lucratividade-margem-kpi', size: '1x1', row: 0, col: 3 },
    { id: 'lucra-scatter', size: '4x2', row: 1, col: 0 },
    { id: 'lucra-cat', size: '2x2', row: 3, col: 0 },
    { id: 'lucra-margem', size: '2x2', row: 3, col: 2 },
    { id: 'lucra-top10', size: '2x2', row: 5, col: 0 },
    { id: 'lucra-oferta', size: '2x2', row: 5, col: 2 }
]

// Relatório de Fluxo de Caixa (Legacy Adaptado para V2)
export const CASHFLOW_REPORT_LAYOUT: MetricaAtiva[] = [
    // Linha 0: KPIs (Recebido, Pago, Saldo)
    { id: 'fin-revenue-v2', size: '2x1', row: 0, col: 0 },
    { id: 'fin-expense-v2', size: '2x1', row: 0, col: 2 },
    { id: 'fin-balance-v2', size: '2x1', row: 0, col: 4 },
    // Linha 1-2: Gráfico de Evolução
    { id: 'fin-evolution-v2', size: '6x2', row: 1, col: 0 },
    // Linha 3-4: Breakdowns
    { id: 'fin-category-v2', size: '4x2', row: 3, col: 0 },
    { id: 'fin-top-suppliers-v2', size: '2x2', row: 3, col: 4 }
]

// Relatório de Top Fornecedores (Legacy Adaptado para V2)
export const SUPPLIERS_REPORT_LAYOUT: MetricaAtiva[] = [
    // Linha 0-1: Gráfico de Barras
    {
        id: 'fin-top-suppliers-v2',
        size: '6x2',
        row: 0,
        col: 0,
        tempConfig: { chartType: 'recharts-bar-h' }
    },
    // Linha 2-5: Tabela Detalhada (mesma métrica, visualização diferente)
    {
        id: 'fin-top-suppliers-v2',
        size: '6x4',
        row: 2,
        col: 0,
        tempConfig: { chartType: 'table' }
    }
]
