import type { MetricDefinition } from '../../types'

// Faturamento Bruto (Total Sales) - ID alinhado com App.tsx
export const sindicoGrossRevenueMetric: MetricDefinition = {
    id: 'sind-faturamento',
    name: 'Faturamento Bruto',
    description: 'Valor total de vendas no período',
    context: 'sindico',
    category: 'kpis',
    subcategory: 'revenues',
    aggregation: 'sum',
    valueField: 'gross_value',
    chartTypes: ['value', 'kpi', 'kpi-unified', 'trend', 'chart-line', 'chart-bar', 'chart-area', 'chart-pie', 'recharts-line', 'recharts-bar', 'recharts-area', 'recharts-pie', 'recharts-donut'],
    defaultIcon: 'shopping-bag',
    format: 'currency'
}

// Percentual de Repasse
export const sindicoRepassPercentageMetric: MetricDefinition = {
    id: 'sind-repass-percentage', // ID simplificado
    name: 'Percentual de Repasse',
    description: 'Fatia contratual do condomínio',
    context: 'sindico',
    category: 'kpis',
    subcategory: 'contracts',
    aggregation: 'avg',
    valueField: 'repass_percentage',
    chartTypes: ['value', 'kpi', 'kpi-unified', 'chart-line', 'recharts-line'],
    defaultIcon: 'percent',
    format: 'percent'
}

// Repasse Acumulado (Líquido) - ID alinhado com App.tsx
export const sindicoAccumulatedRepassMetric: MetricDefinition = {
    id: 'sind-repasse',
    name: 'Repasse Líquido',
    description: 'Valor líquido a receber',
    context: 'sindico',
    category: 'kpis',
    subcategory: 'revenues',
    aggregation: 'sum',
    valueField: 'net_value',
    chartTypes: ['value', 'kpi', 'kpi-unified', 'trend', 'chart-line', 'chart-bar', 'chart-area', 'chart-pie', 'recharts-line', 'recharts-bar', 'recharts-area', 'recharts-pie', 'recharts-donut'],
    defaultIcon: 'dollar-sign',
    format: 'currency'
}

// Quantidade de Vendas - ID alinhado com App.tsx (NOVO)
export const sindicoSalesCountMetric: MetricDefinition = {
    id: 'sind-vendas-qtd',
    name: 'Qtd. Vendas',
    description: 'Volume total de transações',
    context: 'sindico',
    category: 'kpis',
    subcategory: 'volume',
    aggregation: 'sum',
    valueField: 'sales_count',
    chartTypes: ['value', 'kpi', 'kpi-unified', 'trend', 'chart-line', 'chart-bar', 'chart-area', 'chart-pie', 'recharts-line', 'recharts-bar', 'recharts-area', 'recharts-pie', 'recharts-donut'],
    defaultIcon: 'trending-up',
    format: 'number'
}

// Data do Próximo Repasse
export const sindicoNextRepassMetric: MetricDefinition = {
    id: 'sind-next-repass',
    name: 'Próximo Repasse',
    description: 'Previsão de pagamento',
    context: 'sindico',
    category: 'tempo',
    subcategory: 'schedule',
    aggregation: 'max',
    valueField: 'next_repass_date',
    chartTypes: ['value', 'kpi', 'kpi-unified'],
    defaultIcon: 'calendar',
    format: 'text'
}

// Evolução de Vendas (Diárias)
export const sindicoSalesEvolutionMetric: MetricDefinition = {
    id: 'sindico-sales-evolution', // Mantido longo pois pode ser usado em gráficos complexos
    name: 'Evolução de Vendas',
    description: 'Vendas diárias no período',
    context: 'sindico',
    category: 'tempo',
    subcategory: 'trends',
    aggregation: 'sum',
    valueField: 'gross_value',
    chartTypes: ['chart-line', 'chart-bar', 'chart-area', 'recharts-area', 'recharts-line', 'recharts-bar'],
    defaultIcon: 'trending-up',
    format: 'currency',
    dimensions: ['time-day', 'time-week']
}

// Top Itens Mais Vendidos
export const sindicoTopItemsMetric: MetricDefinition = {
    id: 'sindico-top-items',
    name: 'Top Itens',
    description: 'Produtos mais vendidos por volume',
    context: 'sindico',
    category: 'valores',
    subcategory: 'ranking',
    aggregation: 'sum',
    valueField: 'quantity',
    chartTypes: ['recharts-bar-h', 'table', 'chart-bar', 'recharts-bar', 'recharts-pie', 'recharts-donut'],
    defaultIcon: 'shopping-bag',
    format: 'number',
    dimensions: ['product-name']
}

// Mix de Categorias
export const sindicoCategoryMixMetric: MetricDefinition = {
    id: 'sindico-category-mix',
    name: 'Mix de Categorias',
    description: 'Distribuição de vendas por categoria',
    context: 'sindico',
    category: 'valores',
    subcategory: 'distribution',
    aggregation: 'sum',
    valueField: 'quantity',
    chartTypes: ['recharts-pie', 'recharts-donut', 'recharts-bar', 'chart-pie', 'chart-bar'],
    defaultIcon: 'pie-chart',
    format: 'percent',
    dimensions: ['category-name']
}

// Mapa de Calor (Horários)
export const sindicoHourlyHeatmapMetric: MetricDefinition = {
    id: 'sindico-hourly-heatmap',
    name: 'Fluxo por Horário',
    description: 'Vendas distribuídas por hora do dia',
    context: 'sindico',
    category: 'tempo',
    subcategory: 'traffic',
    aggregation: 'sum',
    valueField: 'transaction_count',
    chartTypes: ['recharts-bar', 'recharts-heatmap', 'chart-bar'],
    defaultIcon: 'clock',
    format: 'number',
    dimensions: ['time-hour']
}
