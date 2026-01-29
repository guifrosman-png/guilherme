import { ChartDataPoint, DataSourceConfig } from '../types'

// Função auxiliar para transformar dados da API/SQL para o formato de gráficos
export function transformApiData(
    rawData: unknown,
    mapping?: DataSourceConfig['mapping']
): ChartDataPoint[] {
    // Se rawData já for um array
    if (Array.isArray(rawData)) {
        return rawData.map((item, index) => ({
            label: mapping?.labels ? String(item[mapping.labels]) : `Item ${index + 1}`,
            value: mapping?.values ? Number(item[mapping.values]) || 0 : Number(item.value) || 0,
            ...item
        }))
    }

    // Se rawData tiver uma propriedade data que é array
    if (rawData && typeof rawData === 'object' && 'data' in rawData && Array.isArray((rawData as { data: unknown[] }).data)) {
        return transformApiData((rawData as { data: unknown[] }).data, mapping)
    }

    // Se rawData tiver uma propriedade rows (comum em queries SQL)
    if (rawData && typeof rawData === 'object' && 'rows' in rawData && Array.isArray((rawData as { rows: unknown[] }).rows)) {
        return transformApiData((rawData as { rows: unknown[] }).rows, mapping)
    }

    return []
}
