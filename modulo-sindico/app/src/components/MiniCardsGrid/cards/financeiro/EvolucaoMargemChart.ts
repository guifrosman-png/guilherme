
export const evolucaoMargemChart = {
    id: 'evolucao-margem',
    title: 'Evolução da Margem Líquida',
    type: 'recharts-line',
    dataSource: {
        type: 'metrics',
        metricsQuery: {
            metric: 'report-margin',
            aggregation: 'avg',
            dimension: 'timestamp'
        }
    },
    props: {
        title: 'Evolução da Margem Líquida',
        showLegend: true,
        height: 300
    },
    data: [],
    series: [],
    xAxisKey: 'label',
    height: 300,
    size: 'full'
};
