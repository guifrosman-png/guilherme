import { ExplorarRecord, ColumnConfig } from '../hooks/useExplorarData'

// Formatar valor para CSV
function formatValueForCSV(value: unknown, type: ColumnConfig['type']): string {
  if (value === null || value === undefined) return ''

  switch (type) {
    case 'currency':
      // Formato numérico para CSV (sem símbolo de moeda)
      return Number(value).toFixed(2).replace('.', ',')

    case 'number':
      return String(value)

    case 'date':
      if (typeof value === 'string') {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('pt-BR')
        }
      }
      return String(value)

    default:
      // Escapar aspas duplas e envolver em aspas se contiver vírgula ou quebra de linha
      const strValue = String(value)
      if (strValue.includes(',') || strValue.includes('\n') || strValue.includes('"')) {
        return `"${strValue.replace(/"/g, '""')}"`
      }
      return strValue
  }
}

// Gerar conteúdo CSV
function generateCSVContent(
  data: ExplorarRecord[],
  columns: ColumnConfig[],
  visibleColumns: string[]
): string {
  // Filtrar apenas colunas visíveis
  const displayColumns = columns.filter(col => visibleColumns.includes(col.key))

  // Header
  const header = displayColumns.map(col => {
    const label = col.label
    if (label.includes(',') || label.includes('\n') || label.includes('"')) {
      return `"${label.replace(/"/g, '""')}"`
    }
    return label
  }).join(';') // Usar ; como separador para melhor compatibilidade com Excel BR

  // Rows
  const rows = data.map(record => {
    return displayColumns.map(col => {
      return formatValueForCSV(record[col.key], col.type)
    }).join(';')
  })

  // BOM para UTF-8 (para Excel reconhecer acentos)
  const BOM = '\uFEFF'

  return BOM + header + '\n' + rows.join('\n')
}

// Exportar para CSV
export function exportToCSV(
  data: ExplorarRecord[],
  columns: ColumnConfig[],
  visibleColumns: string[],
  filename: string
): void {
  // Limitar a 10.000 linhas
  const maxRows = 10000
  const exportData = data.slice(0, maxRows)

  if (data.length > maxRows) {
    console.warn(`Exportação limitada a ${maxRows} linhas. Total de registros: ${data.length}`)
  }

  // Gerar conteúdo
  const csvContent = generateCSVContent(exportData, columns, visibleColumns)

  // Criar blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

  // Criar URL
  const url = URL.createObjectURL(blob)

  // Criar link temporário e clicar
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Limpar URL
  URL.revokeObjectURL(url)
}

// Exportar todos os dados (para uso com API/backend)
export async function exportAllToCSV(
  fetchAllData: () => Promise<ExplorarRecord[]>,
  columns: ColumnConfig[],
  visibleColumns: string[],
  filename: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  onProgress?.(0)

  try {
    const data = await fetchAllData()
    onProgress?.(50)

    exportToCSV(data, columns, visibleColumns, filename)
    onProgress?.(100)
  } catch (error) {
    console.error('Erro ao exportar:', error)
    throw error
  }
}
