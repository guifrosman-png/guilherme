import { DashboardKPI } from '../../types';

export const saldoOperacionalCard: DashboardKPI = {
    id: 'saldo-operacional',
    label: 'Saldo',
    value: 320000,
    format: 'currency',
    variation: { value: 15, direction: 'up', isPercentage: true },
    tooltip: 'Recebido - Pago'
};
