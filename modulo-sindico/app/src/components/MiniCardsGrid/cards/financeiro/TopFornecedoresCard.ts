import { DashboardKPI } from '../../types';

export const topFornecedoresCard = {
    id: 'fin-top-fornecedores-card',
    title: 'Top Fornecedores (CSV)',
    type: 'table', // Exibição em tabela
    dataSource: {
        type: 'metrics',
        metricsQuery: {
            metric: 'fin-top-fornecedores',
            aggregation: 'sum',
            // Dimensão opcional, pois a agregação já vem pronta do loader
        }
    },
    props: {
        title: 'Maiores Credores',
        description: 'Análise de concentração de pagamentos baseada no CSV de extrato.',
        columns: [
            { key: 'label', label: 'Fornecedor', width: '50%' },
            { key: 'qtd_titulos', label: 'Qtd.', width: '20%' },
            { key: 'value', label: 'Valor Pago', width: '30%', format: 'currency' }
        ]
    },
    size: 'half'
};
