import { DashboardKPI } from '../../types';

export const novasConversasCard: DashboardKPI = {
    id: 'novas-conversas',
    label: 'Novas conversas',
    value: 47,
    variation: { value: 12, direction: 'up', isPercentage: true },
    drillDownEnabled: true,
    drillDownDataSource: 'conversas-list',
    tooltip: 'Total de novas conversas iniciadas no periodo'
};

export const conversasRespondidasCard: DashboardKPI = {
    id: 'conversas-respondidas',
    label: 'Conversas respondidas',
    value: 42,
    variation: { value: 8, direction: 'up', isPercentage: true },
    drillDownEnabled: true,
    drillDownDataSource: 'conversas-list'
};

export const conversasFechadasCard: DashboardKPI = {
    id: 'conversas-fechadas',
    label: 'Conversas fechadas',
    value: 38,
    variation: { value: 5, direction: 'up', isPercentage: true }
};

export const conversasAbertasCard: DashboardKPI = {
    id: 'conversas-abertas',
    label: 'Conversas abertas',
    value: 12,
    variation: { value: 4, direction: 'up', isPercentage: false }
};
