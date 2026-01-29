import React, { useState, useMemo, useEffect } from 'react'
import {
  X,
  Filter,
  Columns3,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  BarChart3,
  Calendar,
  Clock,
  ChevronDown
} from 'lucide-react'
import { useExplorarData, FilterConfig, ColumnConfig } from '../hooks/useExplorarData'
import { ExplorarTable } from './ExplorarTable'
import { ExplorarFilters } from './ExplorarFilters'
import { exportToCSV } from '../utils/csvExport'
import { RecordDetailModal } from './RecordDetailModal'
import { ExplorarRecord } from '../hooks/useExplorarData'

interface ExplorarModalProps {
  isOpen: boolean
  onClose: () => void
  cardTitle: string
  metricContext: 'crm' | 'financeiro' | 'formularios' | 'vendas' | 'geral' | 'filas'
  colorScheme?: string
  cardId?: string
  groupingField?: string
  onOpenOriginal?: (record: ExplorarRecord) => void
  /** ID da métrica para buscar dados específicos (ex: 'report-sales' para Excel) */
  metricId?: string
  /** Callback para aplicar filtros do drill-in ao gráfico */
  /** Callback para aplicar filtros do drill-in ao gráfico */
  onApplyFilters?: (filters: FilterConfig[]) => void
  /** Filtro de data global para aplicar aos dados */
  dateRange?: { start: Date, end: Date }
}

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500]

export function ExplorarModal({
  isOpen,
  onClose,
  cardTitle,
  metricContext,
  colorScheme = 'blue',
  cardId,
  groupingField,
  onOpenOriginal,
  metricId,
  onApplyFilters,
  dateRange
}: ExplorarModalProps) {
  // Estados
  const [filters, setFilters] = useState<FilterConfig[]>([])

  // Local Date Range State (initialized from props, but mutable)
  const [activeDateRange, setActiveDateRange] = useState(dateRange)

  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>('') // New state to track UI selection

  // Sync prop changes if re-opened with different range
  useEffect(() => {
    setActiveDateRange(dateRange)
    if ((dateRange as any)?.preset) {
      setSelectedPreset((dateRange as any).preset)
    } else {
      setSelectedPreset('')
    }
  }, [dateRange])

  // Date Logic Helpers
  const handleDatePresetChange = (preset: string) => {
    const today = new Date()
    const start = new Date()
    const end = new Date()
    let isCustom = false

    switch (preset) {
      case 'last_7_days': start.setDate(today.getDate() - 6); break
      case 'last_30_days': start.setDate(today.getDate() - 29); break
      case 'last_3_months': start.setMonth(today.getMonth() - 3); break
      case 'last_year': start.setFullYear(today.getFullYear() - 1); break
      case 'this_month': start.setDate(1); break
      case 'last_month': start.setMonth(today.getMonth() - 1); start.setDate(1); end.setDate(0); break
      case 'this_year': start.setMonth(0, 1); break
      default: isCustom = true
    }

    if (!isCustom) {
      // Normalize
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)

      setActiveDateRange({
        start: start,
        end: end
      })
      setSelectedPreset(preset)
      setIsDateMenuOpen(false) // Close only if NOT custom
    } else {
      setSelectedPreset('custom')
      // Don't close menu -> let user pick dates
    }
  }

  const DATE_PRESETS = [
    { id: 'last_7_days', label: 'Últimos 7 dias' },
    { id: 'last_30_days', label: 'Últimos 30 dias' },
    { id: 'this_month', label: 'Este Mês' },
    { id: 'last_month', label: 'Mês Passado' },
    { id: 'last_year', label: 'Último Ano' },
    { id: 'custom', label: 'Personalizado' }
  ]

  // Handle Custom Date Change
  const handleCustomDateChange = (type: 'start' | 'end', dateStr: string) => {
    if (!dateStr) return

    const newDate = new Date(dateStr)
    if (type === 'start') newDate.setHours(0, 0, 0, 0)
    else newDate.setHours(23, 59, 59, 999)

    setActiveDateRange(prev => ({
      ...prev,
      [type]: newDate
    } as any))

    // Auto-close menu when End Date is selected, as requested
    if (type === 'end') {
      setIsDateMenuOpen(false)
    }
  }


  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [visibleColumns, setVisibleColumns] = useState<string[]>([])
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false)
  const [columnSearch, setColumnSearch] = useState('')
  const [hideEmptyColumns, setHideEmptyColumns] = useState(false)
  const [colSort, setColSort] = useState<'default' | 'asc' | 'desc'>('default')
  const [selectedRecord, setSelectedRecord] = useState<ExplorarRecord | null>(null)


  // Buscar dados
  const {
    data,
    columns,
    totalRecords,
    isLoading,
    error,
    visibleColumns: persistedColumns,
    saveVisibleColumns,
    defaultVisibleColumns
  } = useExplorarData({
    metricContext,
    filters,
    sortColumn,
    sortDirection,
    page,
    pageSize,
    cardId,
    groupingField,
    groupingField,
    metricId,
    dateRange: activeDateRange // Use local state instead of prop
  })

  // Filtrar e ordenar colunas
  const filteredColumns = useMemo(() => {
    let result = columns.filter(col =>
      col.label.toLowerCase().includes(columnSearch.toLowerCase()) ||
      col.key.toLowerCase().includes(columnSearch.toLowerCase())
    )

    if (hideEmptyColumns) {
      result = result.filter(col => !col.label.includes('(Vazio)'))
    }

    if (colSort !== 'default') {
      result.sort((a, b) => {
        const compare = a.label.localeCompare(b.label)
        return colSort === 'asc' ? compare : -compare
      })
    }

    return result
  }, [columns, columnSearch, hideEmptyColumns, colSort])

  // Inicializar colunas visíveis
  React.useEffect(() => {
    if (persistedColumns) {
      setVisibleColumns(persistedColumns)
    }
    // Se não tiver colunas persistidas e as colunas do hook carregaram
    else if (columns.length > 0 && visibleColumns.length === 0) {
      setVisibleColumns(defaultVisibleColumns)
    }
  }, [columns, persistedColumns, defaultVisibleColumns])

  // Resetar página quando filtros mudam
  React.useEffect(() => {
    setPage(1)
  }, [filters])

  // Cálculos de paginação
  const totalPages = Math.ceil(totalRecords / pageSize)
  const startRecord = (page - 1) * pageSize + 1
  const endRecord = Math.min(page * pageSize, totalRecords)

  // Handlers
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(1)
  }

  const handleToggleColumn = (columnKey: string) => {
    setVisibleColumns(prev => {
      let newCols: string[]
      if (prev.includes(columnKey)) {
        // Não permitir esconder todas as colunas
        if (prev.length <= 1) return prev
        newCols = prev.filter(k => k !== columnKey)
      } else {
        newCols = [...prev, columnKey]
      }

      // Salvar persistência
      saveVisibleColumns(newCols)
      return newCols
    })
  }

  const handleExport = () => {
    // Para exportar todos os dados filtrados, precisamos obter todos
    // Por enquanto exporta a página atual - TODO: implementar exportação completa
    const filename = `explorar_${cardTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}`
    exportToCSV(data, columns, visibleColumns, filename)
  }

  // Cores por scheme
  const colorClasses: Record<string, { bg: string; border: string; text: string; button: string }> = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', button: 'bg-blue-600 hover:bg-blue-700' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', button: 'bg-emerald-600 hover:bg-emerald-700' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', button: 'bg-amber-600 hover:bg-amber-700' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', button: 'bg-rose-600 hover:bg-rose-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', button: 'bg-purple-600 hover:bg-purple-700' },
    slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700', button: 'bg-slate-600 hover:bg-slate-700' },
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', button: 'bg-cyan-600 hover:bg-cyan-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', button: 'bg-orange-600 hover:bg-orange-700' },
  }
  const colors = colorClasses[colorScheme] || colorClasses.blue

  if (!isOpen) return null

  // Formatar data para exibição
  const dateRangeDisplay = dateRange && dateRange.start && dateRange.end
    ? `${new Date(dateRange.start).toLocaleDateString('pt-BR')} - ${new Date(dateRange.end).toLocaleDateString('pt-BR')}`
    : null

  return (
    <div className="fixed inset-0 z-[99999999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-[94vw] h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[10000]">
        {/* Header */}
        <div className={`px-6 py-4 ${colors.bg} border-b ${colors.border} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Search className={`w-5 h-5 ${colors.text}`} />
            <h2 className={`text-lg font-semibold ${colors.text}`}>
              Explorar: {cardTitle}
            </h2>
            {/* Date Range Badge in Header - NOW INTERACTIVE */}
            {activeDateRange && (
              <div className="relative">
                <button
                  onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-black/5 ml-2 hover:bg-gray-50 transition-colors shadow-sm group ${isDateMenuOpen ? 'ring-2 ring-blue-500/20' : ''}`}
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">Período:</span>
                  <span className={`text-sm font-bold ${colors.text}`}>
                    {activeDateRange.start && activeDateRange.end
                      ? `${new Date(activeDateRange.start).toLocaleDateString('pt-BR')} - ${new Date(activeDateRange.end).toLocaleDateString('pt-BR')}`
                      : 'Selecione'
                    }
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDateMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Date Selection Dropdown */}
                {isDateMenuOpen && (
                  <div className="absolute top-full left-2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
                    <div className="p-1.5 grid gap-0.5">
                      <div className="px-2 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Filtrar Período
                      </div>
                      {DATE_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          onClick={() => handleDatePresetChange(preset.id)}
                          className="flex items-center gap-2 w-full px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors text-left"
                        >
                          <Clock className="w-3.5 h-3.5 opacity-50" />
                          {preset.label}
                        </button>
                      ))}

                      {/* Custom Date Inputs inside Dropdown */}
                      {selectedPreset === 'custom' && (
                        <div className="border-t border-gray-100 pt-2 mt-1 px-2 pb-2">
                          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Definir Datas</div>
                          <div className="grid gap-2">
                            <div>
                              <label className="text-[10px] text-slate-500 block mb-0.5">De</label>
                              <input
                                type="date"
                                className="w-full text-xs p-1.5 rounded border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                value={activeDateRange?.start ? new Date(activeDateRange.start).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block mb-0.5">Até</label>
                              <input
                                type="date"
                                className="w-full text-xs p-1.5 rounded border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                value={activeDateRange?.end ? new Date(activeDateRange.end).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        </div>
                      )}


                    </div>
                  </div>
                )}

                {/* Close overlay for date menu */}
                {isDateMenuOpen && (
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsDateMenuOpen(false)} />
                )}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
          {/* Filtros */}
          <div className="relative">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`
                flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                ${filters.length > 0
                  ? `${colors.bg} ${colors.border} ${colors.text}`
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
              {filters.length > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full ${colors.button} text-white`}>
                  {filters.length}
                </span>
              )}
            </button>
            {isFilterMenuOpen && (
              <ExplorarFilters
                filters={filters}
                setFilters={setFilters}
                columns={columns}
                onClose={() => setIsFilterMenuOpen(false)}
              />
            )}
          </div>

          {/* Colunas */}
          <div className="relative">
            <button
              onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Columns3 className="w-4 h-4" />
              <span>Colunas</span>
            </button>
            {isColumnMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-xl shadow-xl border border-gray-100 z-[100] p-2">
                <div className="flex flex-col gap-2 px-2 py-1.5 border-b border-gray-100 mb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Colunas visíveis</span>
                    <button
                      onClick={() => setIsColumnMenuOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search Input inside Dropdown */}
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar coluna..."
                      value={columnSearch}
                      onChange={(e) => setColumnSearch(e.target.value)}
                      className="w-full pl-7 pr-2 py-1 text-xs rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>

                  {/* Filter Toolbar */}
                  <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                        <input
                          type="checkbox"
                          checked={filteredColumns.length > 0 && filteredColumns.every(c => visibleColumns.includes(c.key))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newCols = [...new Set([...visibleColumns, ...filteredColumns.map(c => c.key)])]
                              setVisibleColumns(newCols)
                              saveVisibleColumns(newCols)
                            } else {
                              const newCols = visibleColumns.filter(key => !filteredColumns.find(c => c.key === key))
                              setVisibleColumns(newCols)
                              saveVisibleColumns(newCols)
                            }
                          }}
                          className="rounded border-gray-300 w-3 h-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Marcar todas</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer hover:text-gray-900">
                        <input
                          type="checkbox"
                          checked={hideEmptyColumns}
                          onChange={(e) => {
                            const isChecked = e.target.checked
                            setHideEmptyColumns(isChecked)

                            if (isChecked) {
                              // Se ativar "Ocultar Vazias", removemos elas da seleção
                              const emptyCols = columns.filter(c => c.label.includes('(Vazio)')).map(c => c.key)
                              const newCols = visibleColumns.filter(key => !emptyCols.includes(key))
                              setVisibleColumns(newCols)
                              saveVisibleColumns(newCols)
                            }
                          }}
                          className="rounded border-gray-300 w-3 h-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Ocultar vazias ({columns.filter(c => c.label.includes('(Vazio)')).length})</span>
                      </label>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Ordem:</span>
                      <button
                        onClick={() => setColSort(prev => {
                          if (prev === 'default') return 'asc'
                          if (prev === 'asc') return 'desc'
                          return 'default'
                        })}
                        className={`flex items-center gap-1 hover:bg-gray-100 px-1.5 py-0.5 rounded ${colSort !== 'default' ? 'text-blue-600 font-medium' : ''}`}
                      >
                        {colSort === 'default' && 'Padrão'}
                        {colSort === 'asc' && 'A-Z'}
                        {colSort === 'desc' && 'Z-A'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-h-[500px] overflow-y-auto grid grid-cols-2 gap-2 p-1">
                  {filteredColumns.map(col => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => handleToggleColumn(col.key)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{col.label}</span>
                    </label>
                  ))}
                </div>
                {/* Close overlay */}
                <div className="fixed inset-0 z-[-1]" onClick={() => setIsColumnMenuOpen(false)} />
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Info */}
          <span className="text-sm text-gray-500">
            {totalRecords.toLocaleString('pt-BR')} registros
          </span>

          {/* Aplicar ao Gráfico - só aparece quando há filtros e callback */}
          {filters.length > 0 && onApplyFilters && (
            <button
              onClick={() => {
                onApplyFilters(filters)
                onClose()
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Aplicar ao Gráfico ({filters.length})</span>
            </button>
          )}

          {/* Exportar */}
          <button
            onClick={handleExport}
            disabled={data.length === 0}
            className={`
              flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-white transition-colors
              ${data.length === 0 ? 'bg-gray-300 cursor-not-allowed' : colors.button}
            `}
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>

        {/* Erro */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 text-red-700 text-sm">
            Erro ao carregar dados: {error}
          </div>
        )}

        {/* Tabela */}
        <ExplorarTable
          data={data}
          columns={columns}
          visibleColumns={visibleColumns}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          isLoading={isLoading}
          colorScheme={colorScheme}
          onRecordClick={setSelectedRecord}
        />

        {/* Modal Detalhes do Registro (Drawer) */}
        <RecordDetailModal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          record={selectedRecord}
          title={cardTitle}
          colorScheme={colorScheme}
          onOpenOriginal={onOpenOriginal}
        />

        {/* Footer - Paginação */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          {/* Info */}
          <div className="text-sm text-gray-600">
            {totalRecords > 0 ? (
              <>
                Mostrando <span className="font-medium">{startRecord.toLocaleString('pt-BR')}</span> a{' '}
                <span className="font-medium">{endRecord.toLocaleString('pt-BR')}</span> de{' '}
                <span className="font-medium">{totalRecords.toLocaleString('pt-BR')}</span> registros
              </>
            ) : (
              'Nenhum registro'
            )}
          </div>

          {/* Navegação */}
          <div className="flex items-center gap-4">
            {/* Page size */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Itens por página:</span>
              <div className="flex items-center gap-1">
                {PAGE_SIZE_OPTIONS.map(size => (
                  <button
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={`
                      px-2 py-1 text-sm rounded transition-colors
                      ${pageSize === size
                        ? `${colors.button} text-white`
                        : 'text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className={`
                  p-1.5 rounded-lg border transition-colors
                  ${page <= 1
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-sm text-gray-600 min-w-[100px] text-center">
                Página <span className="font-medium">{page}</span> de{' '}
                <span className="font-medium">{totalPages || 1}</span>
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className={`
                  p-1.5 rounded-lg border transition-colors
                  ${page >= totalPages
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
