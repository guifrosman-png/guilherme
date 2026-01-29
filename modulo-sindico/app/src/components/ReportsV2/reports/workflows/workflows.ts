import { DashboardConfig, createPresetPeriod } from '../../types/dashboard.types';

export const workflowsMock: DashboardConfig = {
    id: 'report-workflows',
    reportId: 'report-workflows',
    title: 'Workflows',
    description: 'Analise o desempenho das automações e fluxos de trabalho.',
    module: 'workflows',
    owner: 'Sistema',
    kpis: [],
    charts: [],
    defaultPeriod: createPresetPeriod('last28days')
};
