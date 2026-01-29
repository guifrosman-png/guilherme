
export const receitaCategoriaChart = {
    id: 'receita-categoria',
    title: 'Receita por Categoria',
    type: 'recharts-donut',
    dataSource: {
        type: 'metrics',
        metricsQuery: {
            metric: 'fin-distribuicao-tipo',
            aggregation: 'sum'
        }
    },
    props: {
        title: 'Receita por Categoria',
        showLegend: true,
        height: 250,
        innerRadius: 60,
        outerRadius: 80
    },
    data: [],
    showLegend: true,
    height: 250,
    size: 'half'
};
