import { DashboardKPI } from '../../types';

export const faturamentoBrutoCard: DashboardKPI = {
    id: 'faturamento-bruto',
    label: 'Faturamento Bruto',
    value: 1450000,
    format: 'currency',
    variation: { value: 8, direction: 'up', isPercentage: true }
};
