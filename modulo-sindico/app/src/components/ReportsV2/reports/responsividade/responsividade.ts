import { DashboardConfig, createPresetPeriod } from '../../types/dashboard.types';

export const responsividadeMock: DashboardConfig = {
    id: 'report-responsividade',
    reportId: 'report-responsividade',
    title: 'Responsividade',
    description: 'Analise a velocidade de resposta da sua equipe.',
    module: 'responsividade',
    owner: 'Sistema',
    kpis: [],
    charts: [],
    defaultPeriod: createPresetPeriod('last28days')
};
