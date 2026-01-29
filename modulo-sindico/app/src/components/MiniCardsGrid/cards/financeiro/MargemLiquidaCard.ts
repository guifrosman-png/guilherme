import { DashboardKPI } from '../../types';

export const margemLiquidaCard: DashboardKPI = {
    id: 'margem-liquida',
    label: 'Margem Líquida',
    value: 22,
    format: 'percentage',
    variation: { value: 1.2, direction: 'up', isPercentage: false }
};
