import {
    DashboardConfig,
    createPresetPeriod
} from '../../types/dashboard.types';

// Import atomic cards from the library
import {
    receitaTotalCard,
    lucroLiquidoCard,
    despesasCard,
    margemEbitdaCard,
    fluxoCaixaChart,
    receitaCategoriaChart
} from '../../../MiniCardsGrid/cards/financeiro';

// ============================================
// DASHBOARD: FINANCEIRO
// ============================================

export const financeiroMock: DashboardConfig = {
    id: 'dashboard-financeiro',
    reportId: 'report-financeiro',
    title: 'Financeiro Geral',
    description: 'Visão geral das finanças da empresa.',
    module: 'financeiro',
    owner: 'Financeiro',
    kpis: [
        receitaTotalCard,
        lucroLiquidoCard,
        despesasCard,
        margemEbitdaCard
    ],
    charts: [
        fluxoCaixaChart,
        receitaCategoriaChart
    ],
    defaultPeriod: createPresetPeriod('thisMonth')
};
