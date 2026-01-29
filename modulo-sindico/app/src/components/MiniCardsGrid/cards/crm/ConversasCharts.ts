import { ChartConfig } from '../../types';

export const conversasTempoChart: ChartConfig = {
    id: 'conversas-tempo',
    title: 'Novas conversas - por periodo',
    type: 'bar',
    data: [
        { name: '27 Out', value: 8 },
        { name: '3 Nov', value: 12 },
        { name: '10 Nov', value: 15 },
        { name: '17 Nov', value: 18 },
        { name: '24 Nov', value: 22 }
    ],
    xAxisKey: 'name',
    height: 300,
    size: 'full',
    drillDownDataSource: 'conversas-list'
};

export const conversasCanalChart: ChartConfig = {
    id: 'conversas-canal',
    title: 'Novas conversas - por canal',
    type: 'donut',
    data: [
        { name: 'Chat', value: 25 },
        { name: 'Email', value: 15 },
        { name: 'WhatsApp', value: 7 }
    ],
    showLegend: true,
    height: 250,
    size: 'half'
};

export const conversasStatusChart: ChartConfig = {
    id: 'conversas-status',
    title: 'Conversas fechadas vs reabertas',
    type: 'bar',
    data: [
        { name: 'Sem 1', fechadas: 32, reabertas: 3 },
        { name: 'Sem 2', fechadas: 38, reabertas: 2 },
        { name: 'Sem 3', fechadas: 35, reabertas: 4 },
        { name: 'Sem 4', fechadas: 42, reabertas: 1 }
    ],
    series: [
        { key: 'fechadas', label: 'Fechadas', color: '#10b981' },
        { key: 'reabertas', label: 'Reabertas', color: '#f59e0b' }
    ],
    xAxisKey: 'name',
    showLegend: true,
    height: 250,
    size: 'half'
};

export const conversasEquipeChart: ChartConfig = {
    id: 'conversas-equipe',
    title: 'Conversas por equipe - Column Chart',
    type: 'column',
    data: [
        { name: 'Suporte', value: 145 },
        { name: 'Vendas', value: 98 },
        { name: 'Financeiro', value: 67 },
        { name: 'Técnico', value: 123 },
        { name: 'RH', value: 45 }
    ],
    xAxisKey: 'name',
    height: 300,
    size: 'half'
};

export const conversasVolumeTaxaChart: ChartConfig = {
    id: 'conversas-volume-taxa',
    title: 'Volume vs Taxa de Resposta - Combo Chart',
    type: 'combo',
    data: [
        { mes: 'Jan', volume: 320, taxa: 85 },
        { mes: 'Fev', volume: 385, taxa: 88 },
        { mes: 'Mar', volume: 450, taxa: 82 },
        { mes: 'Abr', volume: 420, taxa: 90 },
        { mes: 'Mai', volume: 490, taxa: 87 },
        { mes: 'Jun', volume: 510, taxa: 92 }
    ],
    series: [
        { key: 'volume', label: 'Volume de Conversas', color: '#3b82f6' },
        { key: 'taxa', label: 'Taxa de Resposta (%)', color: '#10b981' }
    ],
    xAxisKey: 'mes',
    showLegend: true,
    height: 350,
    size: 'full'
};

export const conversasHeatmapChart: ChartConfig = {
    id: 'conversas-heatmap',
    title: 'Atividade por Dia e Hora - Heatmap',
    type: 'heatmap',
    data: [
        { x: 'Seg', y: '09h', value: 12 },
        { x: 'Seg', y: '12h', value: 25 },
        { x: 'Seg', y: '15h', value: 18 },
        { x: 'Seg', y: '18h', value: 8 },
        { x: 'Ter', y: '09h', value: 15 },
        { x: 'Ter', y: '12h', value: 30 },
        { x: 'Ter', y: '15h', value: 22 },
        { x: 'Ter', y: '18h', value: 10 },
        { x: 'Qua', y: '09h', value: 20 },
        { x: 'Qua', y: '12h', value: 35 },
        { x: 'Qua', y: '15h', value: 28 },
        { x: 'Qua', y: '18h', value: 12 },
        { x: 'Qui', y: '09h', value: 18 },
        { x: 'Qui', y: '12h', value: 32 },
        { x: 'Qui', y: '15h', value: 24 },
        { x: 'Qui', y: '18h', value: 9 },
        { x: 'Sex', y: '09h', value: 22 },
        { x: 'Sex', y: '12h', value: 28 },
        { x: 'Sex', y: '15h', value: 20 },
        { x: 'Sex', y: '18h', value: 6 }
    ],
    xAxisKey: 'x',
    height: 300,
    size: 'half'
};

export const conversasRankingChart: ChartConfig = {
    id: 'conversas-ranking',
    title: 'Ranking de Atendentes - Table Chart',
    type: 'table',
    data: [
        { atendente: 'Ana Silva', conversas: 145, taxa_resposta: 92, tempo_medio: 12 },
        { atendente: 'Carlos Souza', conversas: 132, taxa_resposta: 88, tempo_medio: 15 },
        { atendente: 'Maria Santos', conversas: 128, taxa_resposta: 95, tempo_medio: 10 },
        { atendente: 'João Oliveira', conversas: 118, taxa_resposta: 85, tempo_medio: 18 },
        { atendente: 'Patricia Lima', conversas: 105, taxa_resposta: 90, tempo_medio: 14 }
    ],
    series: [
        { key: 'atendente', label: 'Atendente' },
        { key: 'conversas', label: 'Conversas' },
        { key: 'taxa_resposta', label: 'Taxa Resposta (%)' },
        { key: 'tempo_medio', label: 'Tempo Médio (min)' }
    ],
    height: 300,
    size: 'full'
};
