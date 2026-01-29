import { DashboardKPI } from '../../types';

export const margemEbitdaCard: DashboardKPI = {
    id: 'margem-ebitda',
    label: 'Margem EBITDA',
    value: 28,
    format: 'percentage',
    variation: { value: 1.5, direction: 'up', isPercentage: false }
};
