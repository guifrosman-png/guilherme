import { DashboardKPI } from '../../types';

export const topFornecedoresChart = {
    id: 'fin-top-fornecedores-chart',
    title: 'Top Fornecedores (Gráfico)',
    type: 'recharts-bar-h', // Layout horizontal para melhor leitura de nomes
    dataSource: {
        type: 'metrics',
        metricsQuery: {
            metric: 'fin-top-fornecedores',
            aggregation: 'sum',
        }
    },
    props: {
        title: 'Maiores Credores',
        description: 'Distribuição de pagamentos por fornecedor.',
        xAxisKey: 'label',
        series: [{ dataKey: 'value', name: 'Valor Pago', color: '#8884d8' }],
        height: 300
    },
    size: 'half'
};
