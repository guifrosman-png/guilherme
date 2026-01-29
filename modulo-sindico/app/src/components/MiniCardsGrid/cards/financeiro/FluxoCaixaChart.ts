
export const fluxoCaixaChart = {
    id: 'fluxo-caixa',
    title: 'Fluxo de Caixa',
    type: 'recharts-composed',
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
        title: 'Fluxo de Caixa',
        description: 'Comparativo Recebido x Pago',
        showLegend: true,
        height: 300
    },
    // Propriedades legadas mantidas vazias para compatibilidade
    data: [],
    series: [],
    xAxisKey: 'label',
    height: 300,
    size: 'full'
};
