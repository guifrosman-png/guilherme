import React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { ExplorarRecord, ColumnConfig } from '../hooks/useExplorarData'

interface ExplorarTableProps {
  data: ExplorarRecord[]
  columns: ColumnConfig[]
  visibleColumns: string[]
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  isLoading?: boolean
  colorScheme?: string
  onRecordClick?: (record: ExplorarRecord) => void
}

// Formatar valores baseado no tipo
function formatValue(value: unknown, type: ColumnConfig['type']): string {
  if (value === null || value === undefined) return '-'

  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(Number(value))

    case 'number':
      return new Intl.NumberFormat('pt-BR').format(Number(value))

    case 'date':
      if (typeof value === 'string') {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('pt-BR')
        }
      }
      return String(value)

    default:
      return String(value)
  }
}

// Cores por scheme
const colorSchemes: Record<string, { header: string; hover: string; border: string; textLink?: string }> = {
  blue: { header: 'bg-blue-50', hover: 'hover:bg-blue-50/50', border: 'border-blue-100', textLink: 'text-blue-600' },
  emerald: { header: 'bg-emerald-50', hover: 'hover:bg-emerald-50/50', border: 'border-emerald-100', textLink: 'text-emerald-600' },
  amber: { header: 'bg-amber-50', hover: 'hover:bg-amber-50/50', border: 'border-amber-100', textLink: 'text-amber-600' },
  rose: { header: 'bg-rose-50', hover: 'hover:bg-rose-50/50', border: 'border-rose-100', textLink: 'text-rose-600' },
  purple: { header: 'bg-purple-50', hover: 'hover:bg-purple-50/50', border: 'border-purple-100', textLink: 'text-purple-600' },
  slate: { header: 'bg-slate-50', hover: 'hover:bg-slate-50/50', border: 'border-slate-100', textLink: 'text-slate-600' },
  cyan: { header: 'bg-cyan-50', hover: 'hover:bg-cyan-50/50', border: 'border-cyan-100', textLink: 'text-cyan-600' },
  orange: { header: 'bg-orange-50', hover: 'hover:bg-orange-50/50', border: 'border-orange-100', textLink: 'text-orange-600' },
}

export function ExplorarTable({
  data,
  columns,
  visibleColumns,
  sortColumn,
  sortDirection,
  onSort,
  isLoading = false,
  colorScheme = 'blue',
  onRecordClick
}: ExplorarTableProps) {
  const colors = colorSchemes[colorScheme] || colorSchemes.blue

  // Filtrar apenas colunas visíveis
  const displayColumns = columns.filter(col => visibleColumns.includes(col.key))

  // Render ícone de ordenação
  const renderSortIcon = (column: ColumnConfig) => {
    if (!column.sortable) return null

    if (sortColumn === column.key) {
      return sortDirection === 'asc'
        ? <ChevronUp className="w-4 h-4 text-blue-600" />
        : <ChevronDown className="w-4 h-4 text-blue-600" />
    }

    return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
  }

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className={`${colors.header} sticky top-0`}>
            <tr>
              {displayColumns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b ${colors.border}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {displayColumns.map(col => (
                  <td key={col.key} className={`px-4 py-3 border-b ${colors.border}`}>
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Nenhum registro encontrado</p>
          <p className="text-sm mt-1">Tente ajustar os filtros ou a busca</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full border-collapse min-w-max">
        <thead className={`${colors.header} sticky top-0 z-10`}>
          <tr>
            {displayColumns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort(col.key)}
                className={`
                  px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider
                  border-b ${colors.border}
                  ${col.sortable ? 'cursor-pointer select-none group' : ''}
                  ${sortColumn === col.key ? 'bg-blue-100/50' : ''}
                `}
              >
                <div className="flex items-center gap-1.5">
                  <span>{col.label}</span>
                  {renderSortIcon(col)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, rowIndex) => (
            <tr
              key={record.id || rowIndex}
              className={`${colors.hover} transition-colors`}
            >
              {displayColumns.map(col => (
                <td
                  key={col.key}
                  className={`
                    px-4 py-3 text-sm text-gray-700 border-b ${colors.border}
                    ${col.type === 'number' || col.type === 'currency' ? 'text-right font-mono' : ''}
                  `}
                >
                  {col.key === 'id' && onRecordClick ? (
                    <button
                      onClick={() => onRecordClick(record)}
                      className={`font-medium underline hover:opacity-80 transition-opacity ${colors.textLink || 'text-blue-600'}`}
                    >
                      {formatValue(record[col.key], col.type)}
                    </button>
                  ) : (
                    formatValue(record[col.key], col.type)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
