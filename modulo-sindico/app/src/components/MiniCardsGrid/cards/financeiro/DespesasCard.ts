import { DashboardKPI } from '../../types';

export const despesasCard: DashboardKPI = {
    id: 'despesas',
    label: 'Despesas Operacionais',
    value: 450000,
    format: 'currency',
    variation: { value: 2, direction: 'down', isPercentage: true } // Down is good for expenses usually
};
