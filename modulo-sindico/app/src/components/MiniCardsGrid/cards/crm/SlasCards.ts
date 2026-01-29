import { DashboardKPI, ChartConfig } from '../../types';

export const taxaCumprimentoCard: DashboardKPI = {
    id: 'taxa-cumprimento',
    label: 'Taxa de cumprimento',
    value: 94,
    format: 'percentage',
    variation: { value: 2, direction: 'up', isPercentage: true },
    tooltip: 'Percentual de SLAs cumpridos no periodo'
};

export const slaPerdidosCard: DashboardKPI = {
    id: 'sla-perdidos',
    label: 'SLAs perdidos',
    value: 6,
    variation: { value: 2, direction: 'down', isPercentage: false },
    drillDownEnabled: true,
    drillDownDataSource: 'slas-perdidos'
};

export const comSlaCard: DashboardKPI = {
    id: 'com-sla',
    label: 'Com SLA aplicado',
    value: 89,
    drillDownEnabled: true,
    drillDownDataSource: 'chamados-list'
};

export const tempoMedioRespostaCard: DashboardKPI = {
    id: 'tempo-medio-resposta',
    label: 'Tempo medio primeira resposta',
    value: 15,
    format: 'time',
    tooltip: 'Tempo medio para primeira resposta (em minutos)'
};

export const slaCumprimentoChart: ChartConfig = {
    id: 'sla-cumprimento',
    title: 'Taxa de cumprimento de SLA - por periodo',
    type: 'line',
    data: [
        { name: 'Sem 1', value: 92 },
        { name: 'Sem 2', value: 95 },
        { name: 'Sem 3', value: 91 },
        { name: 'Sem 4', value: 94 }
    ],
    xAxisKey: 'name',
    height: 300,
    size: 'full'
};

export const slaDistribuicaoChart: ChartConfig = {
    id: 'sla-distribuicao',
    title: 'Distribuicao de SLAs',
    type: 'donut',
    data: [
        { name: 'Cumprido', value: 89 },
        { name: 'Perdido', value: 6 },
        { name: 'Em risco', value: 5 }
    ],
    showLegend: true,
    height: 250,
    size: 'half'
};

export const slaEquipeChart: ChartConfig = {
    id: 'sla-equipe',
    title: 'Cumprimento por equipe',
    type: 'bar',
    data: [
        { name: 'Suporte N1', value: 96 },
        { name: 'Suporte N2', value: 92 },
        { name: 'Desenvolvimento', value: 88 },
        { name: 'Financeiro', value: 98 }
    ],
    xAxisKey: 'name',
    height: 250,
    size: 'half'
};
