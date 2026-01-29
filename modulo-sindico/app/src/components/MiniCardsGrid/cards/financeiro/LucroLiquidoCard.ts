import { DashboardKPI } from '../../types';

export const lucroLiquidoCard: DashboardKPI = {
    id: 'lucro-liquido',
    label: 'Lucro Líquido',
    value: 320000,
    format: 'currency',
    variation: { value: 5, direction: 'up', isPercentage: true }
};
