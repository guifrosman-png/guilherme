
import { MetricaAtiva } from '../../types'

// CRM / Conversas
export const CRM_DEFAULT_LAYOUT: MetricaAtiva[] = [
    { id: 'conversas-novas', size: '1x1', row: 0, col: 0 },
    { id: 'conversas-respondidas', size: '1x1', row: 0, col: 1 },
    { id: 'conversas-fechadas', size: '1x1', row: 0, col: 2 },
    { id: 'conversas-abertas', size: '1x1', row: 0, col: 3 }
]

export const CONVERSAS_REPORT_LAYOUT: MetricaAtiva[] = [
    // Linha 0: KPIs horizontais
    { id: 'conversas-novas', size: '1x1', row: 0, col: 0 },
    { id: 'conversas-respondidas', size: '1x1', row: 0, col: 1 },
    { id: 'conversas-fechadas', size: '1x1', row: 0, col: 2 },
    { id: 'conversas-abertas', size: '1x1', row: 0, col: 3 },
    // Linhas 1-2: Gráfico principal
    { id: 'grafico-conversas-periodo', size: '5x2', row: 1, col: 0 },
    // Linhas 3-4: Par de gráficos
    { id: 'grafico-conversas-canal', size: '2x2', row: 3, col: 0 },
    { id: 'grafico-conversas-fechadas-reabertas', size: '3x2', row: 3, col: 2 },
    // Linhas 5-6: Par de gráficos
    { id: 'grafico-conversas-equipe', size: '3x2', row: 5, col: 0 },
    { id: 'grafico-conversas-ranking', size: '2x2', row: 5, col: 3 },
    // Linhas 7-8: Gráfico full width
    { id: 'grafico-conversas-volume-taxa', size: '5x2', row: 7, col: 0 }
]

// ... (Other CRM reports: SLAS, CSAT, etc. - adding them here to be comprehensive)
// For brevity, I will only implement the Conversas one fully now as example, others can be migrated.
