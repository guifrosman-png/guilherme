import { DashboardKPI, ChartConfig } from '../../types';

export const chamadosAbertosCard: DashboardKPI = {
    id: 'chamados-abertos',
    label: 'Chamados abertos',
    value: 23,
    variation: { value: 15, direction: 'up', isPercentage: true },
    drillDownEnabled: true,
    drillDownDataSource: 'chamados-list'
};

export const tempoResolucaoCard: DashboardKPI = {
    id: 'tempo-resolucao',
    label: 'Tempo medio de resolucao',
    value: 240,
    format: 'time',
    variation: { value: 10, direction: 'down', isPercentage: true },
    tooltip: 'Tempo medio para resolver um chamado'
};

export const chamadosEnviadosCard: DashboardKPI = {
    id: 'chamados-enviados',
    label: 'Em andamento',
    value: 18,
    drillDownEnabled: true,
    drillDownDataSource: 'chamados-list'
};

export const chamadosAguardandoCard: DashboardKPI = {
    id: 'chamados-aguardando',
    label: 'Aguardando resposta',
    value: 7,
    variation: { value: 2, direction: 'down', isPercentage: false }
};

export const chamadosTempoChart: ChartConfig = {
    id: 'chamados-tempo',
    title: 'Volume de chamados - por periodo',
    type: 'area',
    data: [
        { name: 'Sem 1', abertos: 18, resolvidos: 15 },
        { name: 'Sem 2', abertos: 22, resolvidos: 20 },
        { name: 'Sem 3', abertos: 20, resolvidos: 22 },
        { name: 'Sem 4', abertos: 23, resolvidos: 19 }
    ],
    series: [
        { key: 'abertos', label: 'Abertos', color: '#3b82f6' },
        { key: 'resolvidos', label: 'Resolvidos', color: '#10b981' }
    ],
    xAxisKey: 'name',
    showLegend: true,
    height: 300,
    size: 'full'
};

export const chamadosCategoriaChart: ChartConfig = {
    id: 'chamados-categoria',
    title: 'Chamados por categoria',
    type: 'donut',
    data: [
        { name: 'Bug', value: 8 },
        { name: 'Feature', value: 6 },
        { name: 'Suporte', value: 5 },
        { name: 'Duvida', value: 4 }
    ],
    showLegend: true,
    height: 250,
    size: 'half'
};

export const chamadosPrioridadeChart: ChartConfig = {
    id: 'chamados-prioridade',
    title: 'Chamados por prioridade',
    type: 'bar',
    data: [
        { name: 'Critica', value: 3 },
        { name: 'Alta', value: 7 },
        { name: 'Media', value: 8 },
        { name: 'Baixa', value: 5 }
    ],
    xAxisKey: 'name',
    height: 250,
    size: 'half'
};
