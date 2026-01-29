import { DashboardKPI } from '../../types';

export const receitaTotalCard: DashboardKPI = {
    id: 'receita-total',
    label: 'Receita Total',
    value: 1250000,
    format: 'currency',
    variation: { value: 12, direction: 'up', isPercentage: true },
    tooltip: 'Faturamento total no período'
};
