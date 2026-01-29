import { MetricaConfig } from '../../types'

export const cardStockoutRisk: MetricaConfig = {
    id: 'stockout-risk-card',
    name: 'Alerta: Risco de Ruptura',
    description: 'Lista de produtos com alta saída e baixo estoque',
    context: 'estoque',
    size: '4x2',
    canvasComponents: [{
        id: 'table-stockout',
        type: 'table',
        props: {
            title: 'Produtos em Risco de Ruptura',
            columns: [
                { key: 'label', label: 'Produto' },
                { key: 'vendas', label: 'Saída Recente' },
                { key: 'estoque', label: 'Estoque Atual' }
            ]
        },
        dataSource: {
            type: 'metrics',
            metricsQuery: {
                metric: 'stockout-risk',
                aggregation: 'sum'
            }
        }
    }]
}
