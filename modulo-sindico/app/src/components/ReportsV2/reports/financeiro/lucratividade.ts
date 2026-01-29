import {
    DashboardConfig,
    createPresetPeriod
} from '../../types/dashboard.types';

// Import atomic cards from the library
import {
    faturamentoBrutoCard,
    lucroLiquidoCard,
    margemLiquidaCard,
    ebitdaCard,
    evolucaoMargemChart,
    composicaoCustosChart
} from '../../../MiniCardsGrid/cards/financeiro';

// ============================================
// REPORT: LUCRATIVIDADE
// ============================================

export const lucratividadeMock: DashboardConfig = {
    id: 'report-lucratividade',
    reportId: 'report-lucratividade',
    title: 'Lucratividade',
    description: 'Análise de margens e resultados operacionais.',
    module: 'financeiro',
    owner: 'Financeiro',
    kpis: [
        faturamentoBrutoCard,
        lucroLiquidoCard,
        margemLiquidaCard,
        ebitdaCard
    ],
    charts: [
        evolucaoMargemChart,
        composicaoCustosChart
    ],
    defaultPeriod: createPresetPeriod('thisYear')
};
