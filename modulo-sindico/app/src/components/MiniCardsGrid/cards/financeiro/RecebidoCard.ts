import { DashboardKPI } from '../../types';

export const recebidoCard: DashboardKPI = {
    id: 'receita-total',
    label: 'Recebido',
    value: 1250000,
    format: 'currency',
    variation: { value: 12, direction: 'up', isPercentage: true },
    tooltip: 'Total recebido no período'
};
