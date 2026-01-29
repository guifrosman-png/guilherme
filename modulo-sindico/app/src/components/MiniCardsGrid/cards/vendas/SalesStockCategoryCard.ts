import { MetricaConfig } from '../../types'

export const cardSalesStockCategory: MetricaConfig = {
    id: 'sales-stock-category-card',
    name: 'Vendas x Estoque por Categoria',
    description: 'Gráfico comparativo de vendas e estoque médio',
    context: 'vendas',
    size: '4x2',
    canvasComponents: [{
        id: 'chart-sales-stock',
        type: 'recharts-bar',
        props: {
            title: 'Vendas vs Estoque (Top Categorias)',
            xAxisKey: 'label',
            series: [
                { key: 'vendas', name: 'Vendas (R$)', color: '#10B981' }, // Emerald-500
                { key: 'estoque', name: 'Estoque Médio (Score)', color: '#3B82F6' } // Blue-500
            ]
        },
        dataSource: {
            type: 'metrics',
            metricsQuery: {
                metric: 'sales-stock-category',
                aggregation: 'sum'
            }
        }
    }]
}
