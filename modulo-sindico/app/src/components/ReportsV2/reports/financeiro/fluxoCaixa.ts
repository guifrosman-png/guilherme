import {
    DashboardConfig,
    createPresetPeriod
} from '../../types/dashboard.types';

// Import atomic cards from the library
import {
    recebidoCard,
    pagoCard,
    saldoOperacionalCard,
    fluxoCaixaMensalChart
} from '../../../MiniCardsGrid/cards/financeiro';

// ============================================
// REPORT: FLUXO DE CAIXA (Pago x Recebido)
// ============================================

export const fluxoCaixaMock: DashboardConfig = {
    id: 'report-fluxo-caixa',
    reportId: 'report-fluxo-caixa',
    title: 'Fluxo de Caixa',
    description: 'Detalhamento de Pago x Recebido ao longo do tempo.',
    module: 'financeiro',
    owner: 'Financeiro',
    kpis: [
        recebidoCard,
        pagoCard,
        saldoOperacionalCard
    ],
    charts: [
        fluxoCaixaMensalChart
    ],
    defaultPeriod: createPresetPeriod('thisYear')
};
