
import { TrendingUp, TrendingDown, Wallet, BarChart3, PieChart, Table2 } from 'lucide-react'
import type { MetricaConfig } from '../../types'
import { getResumoFinanceiro } from '../../services/erpFinanceiroService' // Legacy helper for initial values (will be overridden by metric data)
// Note: getValue is a required field but for 'metrics' dataSource it's just a placeholder or fallback.
// The actual data comes from the metric ID execution.

// ============================================
// CARD: RECEBIDO (Verde)
// ============================================
export const cardRecebidoCSV: MetricaConfig = {
    id: 'csv-card-recebido',
    titulo: 'Recebido (CSV)',
    descricao: 'Total recebido no período',
    icon: TrendingUp,
    cor: 'text-green-600',
    borderColor: 'border-green-500',
    getValue: () => 'R$ 0,00', // Placeholder
    categoria: 'financeiro',
    context: 'financeiro',
    showTitle: true,
    showDescription: true,
    showBorder: true,
    showCardBg: false,
    canvasConfig: { gridCols: 48, gridRows: 32, colorScheme: 'green' },
    canvasComponents: [
        {
            id: 'kpi-rec',
            type: 'kpi-unified',
            x: 0,
            y: 0,
            width: 48,
            height: 32,
            props: {
                title: 'RECEBIDO',
                valueSize: '28',
                iconName: 'trending-up',
                iconColor: '#16a34a'
            },
            dataSource: {
                type: 'metrics',
                metricsQuery: {
                    metric: 'csv-total-recebido',
                    aggregation: 'sum'
                }
            }
        }
    ]
}

// ============================================
// CARD: PAGO (Vermelho)
// ============================================
export const cardPagoCSV: MetricaConfig = {
    id: 'csv-card-pago',
    titulo: 'Pago (CSV)',
    descricao: 'Total pago no período',
    icon: TrendingDown,
    cor: 'text-red-600',
    borderColor: 'border-red-500',
    getValue: () => 'R$ 0,00',
    categoria: 'financeiro',
    context: 'financeiro',
    showTitle: true,
    showDescription: true,
    showBorder: true,
    showCardBg: false,
    canvasConfig: { gridCols: 48, gridRows: 32, colorScheme: 'red' },
    canvasComponents: [
        {
            id: 'kpi-pago',
            type: 'kpi-unified',
            x: 0,
            y: 0,
            width: 48,
            height: 32,
            props: {
                title: 'PAGO',
                valueSize: '28',
                iconName: 'trending-down',
                iconColor: '#dc2626'
            },
            dataSource: {
                type: 'metrics',
                metricsQuery: {
                    metric: 'csv-total-pago',
                    aggregation: 'sum'
                }
            }
        }
    ]
}

// ============================================
// CARD: SALDO (Azul)
// ============================================
export const cardSaldoCSV: MetricaConfig = {
    id: 'csv-card-saldo',
    titulo: 'Saldo (CSV)',
    descricao: 'Saldo do período',
    icon: Wallet,
    cor: 'text-blue-600',
    borderColor: 'border-blue-500',
    getValue: () => 'R$ 0,00',
    categoria: 'financeiro',
    context: 'financeiro',
    showTitle: true,
    showDescription: true,
    showBorder: true,
    showCardBg: false,
    canvasConfig: { gridCols: 48, gridRows: 32, colorScheme: 'blue' },
    canvasComponents: [
        {
            id: 'kpi-saldo',
            type: 'kpi-unified',
            x: 0,
            y: 0,
            width: 48,
            height: 32,
            props: {
                title: 'SALDO',
                valueSize: '28',
                iconName: 'wallet',
                iconColor: '#2563eb'
            },
            dataSource: {
                type: 'metrics',
                metricsQuery: {
                    metric: 'csv-saldo-periodo',
                    aggregation: 'sum'
                }
            }
        }
    ]
}

// ============================================
// CARD: GRÁFICO PAGO VS RECEBIDO POR PERÍODO
// ============================================
export const cardGraficoPagoRecebidoCSV: MetricaConfig = {
    id: 'csv-grafico-pago-recebido',
    titulo: 'Pago vs Recebido por Mês',
    descricao: 'Comparativo mensal',
    icon: BarChart3,
    cor: 'text-slate-700',
    borderColor: 'border-slate-300',
    getValue: () => '',
    categoria: 'financeiro',
    context: 'financeiro',
    showTitle: true,
    showDescription: false,
    showBorder: true,
    canvasConfig: { gridCols: 48, gridRows: 32, colorScheme: 'slate' },
    canvasComponents: [
        {
            id: 'chart1',
            type: 'recharts-bar',
            x: 0,
            y: 0,
            width: 48,
            height: 32,
            props: {
                showLegend: true,
                showGrid: true,
                chartColors: ['#16a34a', '#dc2626', '#3b82f6'] // Green, Red, Blue
            },
            dataSource: {
                type: 'metrics',
                metricsQuery: {
                    metric: 'csv-pago-recebido-mensal',
                    aggregation: 'sum'
                }
            }
        }
    ]
}

// ============================================
// CARD: TABELA DETALHES POR CONTA
// ============================================
export const cardTabelaRecebimentosCSV: MetricaConfig = {
    id: 'csv-tabela-por-conta',
    titulo: 'Por Conta Financeira',
    descricao: 'Distribuição por conta',
    icon: Table2,
    cor: 'text-slate-700',
    borderColor: 'border-slate-300',
    getValue: () => '',
    categoria: 'financeiro',
    context: 'financeiro',
    showTitle: true,
    showDescription: false,
    showBorder: true,
    canvasConfig: { gridCols: 48, gridRows: 32, colorScheme: 'slate' },
    canvasComponents: [
        {
            id: 'table1',
            type: 'table',
            x: 0,
            y: 0,
            width: 48,
            height: 32,
            props: {
                chartColors: ['#3b82f6']
            },
            dataSource: {
                type: 'metrics',
                metricsQuery: {
                    metric: 'csv-por-conta-financeira',
                    aggregation: 'sum'
                }
            }
        }
    ]
}

// ============================================
// CARD: TABELA EXTRATO COMPLETO
// ============================================
export const cardExtratoTabelaCSV: MetricaConfig = {
    id: 'csv-extrato-tabela',
    titulo: 'Extrato Pago x Recebido',
    descricao: 'Tabela completa de lançamentos',
    icon: Table2,
    cor: 'text-slate-700',
    borderColor: 'border-slate-300',
    getValue: () => '',
    categoria: 'financeiro',
    context: 'financeiro',
    showTitle: true,
    showDescription: false,
    showBorder: true,
    canvasConfig: { gridCols: 48, gridRows: 32, colorScheme: 'slate' },
    canvasComponents: [
        {
            id: 'table-full',
            type: 'table',
            x: 0,
            y: 0,
            width: 48,
            height: 32,
            props: {},
            dataSource: {
                type: 'metrics',
                metricsQuery: {
                    metric: 'csv-tabela-pago-recebido',
                    aggregation: 'sum'
                }
            }
        }
    ]
}

export const METRICAS_FINANCEIRO_CSV: MetricaConfig[] = [
    cardRecebidoCSV,
    cardPagoCSV,
    cardSaldoCSV,
    cardGraficoPagoRecebidoCSV,
    cardTabelaRecebimentosCSV,
    cardExtratoTabelaCSV
]
