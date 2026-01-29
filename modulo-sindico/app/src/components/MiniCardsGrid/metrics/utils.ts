
import { getEnrichedData } from '../data/lucratividade'

/**
 * HELPER: Gerador de Dados do Relatório
 * Filtra dados irrelevantes e adapta ao intervalo de datas selecionado
 */
export const getReportData = (
    field: string,
    dimension: any,
    dateRange: { start: string; end: string } | undefined,
    aggType: 'sum' | 'avg' = 'sum',
    filters?: Array<{ field: string; operator: string; value: unknown }>
) => {
    // 1. Obter dados
    let validData: any[] = getEnrichedData()

    // 1.1 Aplicar Filtros
    if (filters && filters.length > 0) {
        validData = validData.filter(item => {
            return filters.every(f => {
                const itemValue = item[f.field];
                const filterValue = f.value;

                // Handle undefined fields gracefully
                if (itemValue === undefined) return false;

                switch (f.operator) {
                    case 'equals': return String(itemValue).toLowerCase() == String(filterValue).toLowerCase();
                    case 'not_equals': return String(itemValue).toLowerCase() != String(filterValue).toLowerCase();
                    case 'contains': return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase());
                    case 'greater_than': return Number(itemValue) > Number(filterValue);
                    case 'less_than': return Number(itemValue) < Number(filterValue);
                    case 'between':
                        if (Array.isArray(filterValue) && filterValue.length === 2) {
                            return Number(itemValue) >= Number(filterValue[0]) && Number(itemValue) <= Number(filterValue[1]);
                        }
                        return false;
                    default: return true;
                }
            });
        });
    }

    // 2. Se for agrupamento (Dimensão)
    // Se dimension vier como objeto {id, name...} ou string direta
    const dimKey = typeof dimension === 'object' ? dimension?.id : dimension

    if (dimKey && dimKey !== 'timestamp') {
        // Definir chave de agrupamento
        // Mapeia chaves do mock (definitions/MOCK_COLUMNS) para propriedades do objeto
        const getGroupKey = (item: any) => {
            if (dimKey === 'oferta') return item.oferta ? 'Em Oferta' : 'Preço Cheio'

            // 1. Tenta chave exata
            if (item[dimKey] !== undefined) return item[dimKey]

            // 2. Tenta lowercase (ex: Categoria -> categoria)
            const lowerKey = dimKey.toLowerCase()
            if (item[lowerKey] !== undefined) return item[lowerKey]

            // 3. Tenta TitleCase (legacy)
            const titleKey = dimKey.charAt(0).toUpperCase() + dimKey.slice(1)
            if (item[titleKey] !== undefined) return item[titleKey]

            return 'N/A'
        }

        // Agrupar e Agregar
        const grouped = validData.reduce((acc: any, item: any) => {
            const key = String(getGroupKey(item))

            if (!acc[key]) acc[key] = { sum: 0, count: 0 }

            const val = Number(item[field]) || 0
            acc[key].sum += val
            acc[key].count += 1

            return acc
        }, {})

        // Formatar resultado
        return Object.entries(grouped)
            .map(([label, stats]: [string, any]) => {
                const value = aggType === 'avg'
                    ? (stats.sum / stats.count)
                    : stats.sum

                return { label, value: Number(value.toFixed(2)) }
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 20) // Top 20 para não quebrar o gráfico se for Produto
    }

    // 3. Se não tiver dimensão (Total Global ou Temporal Simulado)
    const totalSum = validData.reduce((acc: number, item: any) => acc + (Number(item[field]) || 0), 0)
    const finalValue = aggType === 'avg' ? (totalSum / validData.length) : totalSum

    // Se não tiver data selecionada, usar padrão Jan-Dez
    const start = dateRange?.start ? new Date(dateRange.start) : new Date('2024-01-01')
    const end = dateRange?.end ? new Date(dateRange.end) : new Date('2024-12-31')

    // Detectar granularidade temporal baseada na dimensão selecionada
    let labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    let count = 12
    const dimId = typeof dimension === 'object' ? dimension?.id : dimension

    if (dimId === 'time-quarter') {
        labels = ['Q1', 'Q2', 'Q3', 'Q4']
        count = 4
    } else if (dimId === 'time-year') {
        labels = [String(start.getFullYear())]
        count = 1
    } else if (dimId === 'time-week') {
        // Simulação simplificada de 4 semanas
        labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4']
        count = 4
    }

    let remaining = finalValue
    // Se for média, não distribuímos soma, repetimos a média com variação? 
    // Para simplificar, "distribuição temporal" de média é complexo (sazonalidade). 
    // Vou manter a lógica de distribuir SOMA. Se for média, divido pelo count.

    return Array.from({ length: count }).map((_, i) => {
        const isLast = i === count - 1
        // Distribuição com leve variação aleatória
        let value = isLast ? remaining : remaining * ((1 / count) + (Math.random() * 0.05 - 0.025))
        remaining -= value

        // Se a métrica for média, o valor "distribuído" nao faz sentido. 
        // Hack: Se for média, retornamos a média com ruído.
        if (aggType === 'avg') {
            value = finalValue * (1 + (Math.random() * 0.1 - 0.05))
        }

        // Calculate generic timestamp for sorting/charts
        let monthIndex = i
        // Adjust timestamp based on granularity to avoid everything falling on Jan
        if (dimId === 'time-quarter') monthIndex = i * 3

        const year = start.getFullYear()
        // Provide a valid iso string for temporal sorting
        const timestamp = new Date(year, monthIndex, 1).toISOString()

        return {
            label: labels[i] || `P${i + 1}`,
            value: Number(value.toFixed(2)),
            timestamp: timestamp
        }
    })
}
