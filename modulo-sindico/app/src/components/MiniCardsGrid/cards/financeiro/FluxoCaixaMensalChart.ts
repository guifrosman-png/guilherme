
export const fluxoCaixaMensalChart = {
    id: 'fluxo-caixa-mensal',
    title: 'Fluxo de Caixa (Mensal)',
    type: 'recharts-bar',
    dataSource: {
        type: 'metrics',
        metricsQuery: {
            metric: 'fin-total-recebido',
            aggregation: 'sum',
            dimension: 'timestamp',
            additionalMetrics: [
                { metric: 'fin-total-pago', aggregation: 'sum' },
                { metric: 'fin-saldo-periodo', aggregation: 'sum' }
            ]
        }
    },
    props: {
        title: 'Fluxo de Caixa (Mensal)',
        description: 'Comparativo mensal consolidado',
        showLegend: true,
        height: 350
    },
    // Legacy properties
    data: [],
    series: [],
    xAxisKey: 'label',
    height: 350,
    size: 'full'
};
