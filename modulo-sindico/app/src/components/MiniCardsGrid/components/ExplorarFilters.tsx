import React from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { ColumnConfig, FilterConfig } from '../hooks/useExplorarData'

interface ExplorarFiltersProps {
  filters: FilterConfig[]
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig[]>>
  columns: ColumnConfig[]
  onClose: () => void
}

// Operadores disponíveis por tipo de coluna
const OPERATORS_BY_TYPE: Record<ColumnConfig['type'], { value: FilterConfig['operator']; label: string }[]> = {
  string: [
    { value: 'equals', label: 'é igual a' },
    { value: 'not_equals', label: 'não é igual a' },
    { value: 'contains', label: 'contém' },
  ],
  number: [
    { value: 'equals', label: 'é igual a' },
    { value: 'not_equals', label: 'não é igual a' },
    { value: 'greater_than', label: 'maior que' },
    { value: 'less_than', label: 'menor que' },
    { value: 'between', label: 'entre' },
  ],
  currency: [
    { value: 'equals', label: 'é igual a' },
    { value: 'not_equals', label: 'não é igual a' },
    { value: 'greater_than', label: 'maior que' },
    { value: 'less_than', label: 'menor que' },
    { value: 'between', label: 'entre' },
  ],
  date: [
    { value: 'equals', label: 'é igual a' },
    { value: 'not_equals', label: 'não é igual a' },
    { value: 'greater_than', label: 'depois de' },
    { value: 'less_than', label: 'antes de' },
    { value: 'between', label: 'entre' },
  ],
}

export function ExplorarFilters({
  filters,
  setFilters,
  columns,
  onClose
}: ExplorarFiltersProps) {

  const addFilter = () => {
    const firstColumn = columns[0]
    const newFilter: FilterConfig = {
      id: crypto.randomUUID(),
      field: firstColumn?.key || '',
      operator: 'equals',
      value: ''
    }
    setFilters([...filters, newFilter])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id))
  }

  const updateFilter = (id: string, updates: Partial<FilterConfig>) => {
    setFilters(filters.map(f => {
      if (f.id === id) {
        // Se mudou o campo, resetar o operador para o primeiro disponível
        if (updates.field && updates.field !== f.field) {
          const column = columns.find(c => c.key === updates.field)
          const operators = OPERATORS_BY_TYPE[column?.type || 'string']
          return {
            ...f,
            ...updates,
            operator: operators[0]?.value || 'equals',
            value: '',
            valueTo: undefined
          }
        }
        return { ...f, ...updates }
      }
      return f
    }))
  }

  const getColumnType = (fieldKey: string): ColumnConfig['type'] => {
    return columns.find(c => c.key === fieldKey)?.type || 'string'
  }

  const renderValueInput = (filter: FilterConfig) => {
    const columnType = getColumnType(filter.field)
    const inputClass = "flex-1 h-8 text-sm bg-white border border-gray-200 rounded px-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

    switch (columnType) {
      case 'number':
      case 'currency':
        return (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="number"
              value={filter.value as string}
              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
              placeholder="Valor"
              className={inputClass}
            />
            {filter.operator === 'between' && (
              <>
                <span className="text-gray-500 text-sm">e</span>
                <input
                  type="number"
                  value={filter.valueTo as string || ''}
                  onChange={(e) => updateFilter(filter.id, { valueTo: e.target.value })}
                  placeholder="Até"
                  className={inputClass}
                />
              </>
            )}
          </div>
        )

      case 'date':
        return (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="date"
              value={filter.value as string}
              onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
              className={inputClass}
            />
            {filter.operator === 'between' && (
              <>
                <span className="text-gray-500 text-sm">e</span>
                <input
                  type="date"
                  value={filter.valueTo as string || ''}
                  onChange={(e) => updateFilter(filter.id, { valueTo: e.target.value })}
                  className={inputClass}
                />
              </>
            )}
          </div>
        )

      default:
        return (
          <input
            type="text"
            value={filter.value as string}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            placeholder="Digite o valor..."
            className={`${inputClass} flex-1`}
          />
        )
    }
  }

  return (
    <div className="absolute top-full left-0 mt-2 w-[500px] bg-white rounded-xl shadow-xl border border-gray-100 z-[100] flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">Filtros</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filters List */}
      <div className="p-2 overflow-y-auto min-h-[100px] flex flex-col gap-2">
        {filters.length === 0 && (
          <div className="text-center py-6 text-gray-400 text-sm">
            Nenhum filtro ativo
          </div>
        )}

        {filters.map((filter) => {
          const columnType = getColumnType(filter.field)
          const operators = OPERATORS_BY_TYPE[columnType]

          return (
            <div key={filter.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200 group">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 uppercase w-12 shrink-0">Onde</span>

                {/* Field Select */}
                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                  className="w-32 h-8 text-sm bg-white border border-gray-200 rounded px-2 focus:border-blue-500 focus:outline-none"
                >
                  {columns.map(col => (
                    <option key={col.key} value={col.key}>{col.label}</option>
                  ))}
                </select>

                {/* Operator Select */}
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, { operator: e.target.value as FilterConfig['operator'] })}
                  className="w-28 h-8 text-sm bg-white border border-gray-200 rounded px-2 focus:border-blue-500 focus:outline-none"
                >
                  {operators.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>

                {/* Value Input */}
                {renderValueInput(filter)}

                {/* Remove Button */}
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remover filtro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between">
        <button
          onClick={addFilter}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Filtro</span>
        </button>

        {filters.length > 0 && (
          <button
            onClick={() => setFilters([])}
            className="text-xs text-gray-500 hover:text-red-600 px-3 py-1.5 transition-colors"
          >
            Limpar todos
          </button>
        )}
      </div>

      {/* Click outside to close */}
      <div className="fixed inset-0 z-[-1]" onClick={onClose} />
    </div>
  )
}
