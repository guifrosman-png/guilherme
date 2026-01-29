import { DashboardKPI } from '../../types';

export const pagoCard: DashboardKPI = {
    id: 'despesas-total',
    label: 'Pago',
    value: 930000,
    format: 'currency',
    variation: { value: 5, direction: 'up', isPercentage: true },
    tooltip: 'Total pago no período'
};
