import { useState, useEffect, useMemo } from 'react'
import { getEnrichedData } from '../data/lucratividade'
import { reportData } from '../data/profitability_report'
// import { getPagoRecebidoData, loadPagoRecebidoData } from '../data/pagoRecebido' // DEPRECATED
import { fetchFinancialData } from '../services/FinancialDataService'
import { useSindicoData } from '../context/SindicoDataContext'

// Types
export interface ExplorarRecord {
  id: string
  [key: string]: unknown
}

export interface ColumnConfig {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'currency'
  sortable: boolean
}

export interface FilterConfig {
  id: string
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between' | 'not_equals'
  value: unknown
  valueTo?: unknown // Para operador 'between'
}

export interface UseExplorarDataParams {
  cardId?: string // ID do card para persistência
  metricContext: 'crm' | 'financeiro' | 'formularios' | 'vendas' | 'geral' | 'filas'
  filters: FilterConfig[]
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  page: number
  pageSize: number
  groupingField?: string // Campo usado no agrupamento do gráfico
  metricId?: string // ID da métrica para buscar dados específicos (ex: 'report-sales')
  externalData?: any[] // DADOS REAIS injetados pelo componente pai (CardRenderer)
  dateRange?: { start: Date, end: Date } // FILTRO GLOBAL DE DATA
}

export interface UseExplorarDataResult {
  data: ExplorarRecord[]
  columns: ColumnConfig[]
  totalRecords: number
  isLoading: boolean
  error: string | null
  visibleColumns: string[] | null
  defaultVisibleColumns: string[]
  saveVisibleColumns: (cols: string[]) => void
}

// Configuração das colunas por contexto (mock inicial)
export const MOCK_COLUMNS: Record<MetricContext | 'report' | 'csv', ColumnConfig[]> = {
  csv: [
    { key: 'id', label: 'ID', type: 'string', sortable: true },
    { key: 'movimento', label: 'Movimento', type: 'string', sortable: true },
    { key: 'status', label: 'Status', type: 'string', sortable: true },
    { key: 'descricao', label: 'Descrição', type: 'string', sortable: true },
    { key: 'emitente', label: 'Emitente', type: 'string', sortable: true },
    { key: 'data_vencimento', label: 'Vencimento', type: 'date', sortable: true },
    { key: 'data_efetivacao', label: 'Efetivação', type: 'date', sortable: true },
    { key: 'valor', label: 'Valor', type: 'currency', sortable: true },
    { key: 'valor_efetivado', label: 'Valor Efetivado', type: 'currency', sortable: true },
    { key: 'conta_financeira', label: 'Conta', type: 'string', sortable: true },
    { key: 'centro_custo', label: 'Centro de Custo', type: 'string', sortable: true },
    { key: 'unidade', label: 'Unidade', type: 'string', sortable: true },
    { key: 'forma_pagamento', label: 'Forma Pagamento', type: 'string', sortable: true },
    { key: 'conta_contabil', label: 'Conta Contábil', type: 'string', sortable: true },
    { key: 'cfop', label: 'CFOP', type: 'string', sortable: true },
  ],
  vendas: [
    { key: 'id', label: 'ID', type: 'string', sortable: true },
    { key: 'data', label: 'Data', type: 'date', sortable: true },
    { key: 'cliente', label: 'Cliente', type: 'string', sortable: true },
    { key: 'produto', label: 'Produto', type: 'string', sortable: true },
    { key: 'quantidade', label: 'Qtd', type: 'number', sortable: true },
    { key: 'valor_unitario', label: 'Valor Unit.', type: 'currency', sortable: true },
    { key: 'valor_total', label: 'Valor Total', type: 'currency', sortable: true },
    { key: 'vendedor', label: 'Vendedor', type: 'string', sortable: true },
    { key: 'regiao', label: 'Região', type: 'string', sortable: true },
    { key: 'status', label: 'Status', type: 'string', sortable: true },
  ],
  crm: [
    { key: 'id', label: 'ID', type: 'string', sortable: true },
    { key: 'data_criacao', label: 'Data Criação', type: 'date', sortable: true },
    { key: 'nome', label: 'Nome', type: 'string', sortable: true },
    { key: 'email', label: 'E-mail', type: 'string', sortable: true },
    { key: 'telefone', label: 'Telefone', type: 'string', sortable: true },
    { key: 'origem', label: 'Origem', type: 'string', sortable: true },
    { key: 'status', label: 'Status', type: 'string', sortable: true },
    { key: 'responsavel', label: 'Responsável', type: 'string', sortable: true },
    { key: 'valor_potencial', label: 'Valor Potencial', type: 'currency', sortable: true },
  ],
  financeiro: [
    { key: 'id', label: 'ID', type: 'string', sortable: true },
    { key: 'data', label: 'Data', type: 'date', sortable: true },
    { key: 'descricao', label: 'Descrição', type: 'string', sortable: true },
    { key: 'categoria', label: 'Categoria', type: 'string', sortable: true },
    { key: 'tipo', label: 'Tipo', type: 'string', sortable: true },
    { key: 'valor', label: 'Valor', type: 'currency', sortable: true },
    { key: 'conta', label: 'Conta', type: 'string', sortable: true },
    { key: 'status', label: 'Status', type: 'string', sortable: true },
  ],
  formularios: [
    { key: 'id', label: 'ID', type: 'string', sortable: true },
    { key: 'data_envio', label: 'Data Envio', type: 'date', sortable: true },
    { key: 'formulario', label: 'Formulário', type: 'string', sortable: true },
    { key: 'nome', label: 'Nome', type: 'string', sortable: true },
    { key: 'email', label: 'E-mail', type: 'string', sortable: true },
    { key: 'origem', label: 'Origem', type: 'string', sortable: true },
    { key: 'status', label: 'Status', type: 'string', sortable: true },
  ],
  geral: [
    { key: 'id', label: 'ID', type: 'string', sortable: true },
    { key: 'data', label: 'Data', type: 'date', sortable: true },
    { key: 'categoria', label: 'Categoria', type: 'string', sortable: true },
    { key: 'descricao', label: 'Descrição', type: 'string', sortable: true },
    { key: 'valor', label: 'Valor', type: 'number', sortable: true },
    { key: 'status', label: 'Status', type: 'string', sortable: true },
  ],
  // Dados do Relatório Excel de Lucratividade
  report: [
    { key: 'Código', label: 'Código', type: 'string', sortable: true },
    { key: 'Ean', label: 'EAN', type: 'string', sortable: true },
    { key: 'Produto', label: 'Produto', type: 'string', sortable: true },
    { key: 'Agrupador', label: 'Loja/Agrupador', type: 'string', sortable: true },
    { key: 'Qtd Vendida', label: 'Qtd Vendida', type: 'number', sortable: true },
    { key: 'Vl Venda', label: 'Valor Venda', type: 'currency', sortable: true },
    { key: 'CMV', label: 'CMV', type: 'currency', sortable: true },
    { key: 'Lucro Bruto', label: 'Lucro Bruto', type: 'currency', sortable: true },
    { key: 'Vl Custo Unitário', label: 'Custo Unit.', type: 'currency', sortable: true },
    { key: 'Vl Venda Unitário', label: 'Venda Unit.', type: 'currency', sortable: true },
    { key: 'Margem Markup', label: 'Markup %', type: 'number', sortable: true },
    { key: 'Margem Líquida', label: 'Margem Líq. %', type: 'number', sortable: true },
    { key: 'categoria', label: 'Categoria', type: 'string', sortable: true },
    { key: 'faixaMargem', label: 'Faixa Margem', type: 'string', sortable: true },
    { key: 'oferta', label: 'Em Oferta', type: 'boolean', sortable: true },
  ],
}

// Dados mock removidos para garantir uso de dados reais
// Função para gerar data aleatória (mantida apenas se necessário por utilitários legados, mas idealmente remover)
function randomDate(): string {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 90)
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString().split('T')[0]
}

// Cache mantido vazio propositalmente
const mockDataCache: Record<string, ExplorarRecord[]> = {}

function getMockData(context: string, totalRecords: number = 500): ExplorarRecord[] {
  // Retorna vazio para forçar o uso de 'externalData' ou mostrar que não há dados
  return []
}

// Função para aplicar filtros
function applyFilters(data: ExplorarRecord[], filters: FilterConfig[]): ExplorarRecord[] {
  if (filters.length === 0) return data

  return data.filter(record => {
    return filters.every(filter => {
      const value = record[filter.field]
      const filterValue = filter.value

      switch (filter.operator) {
        case 'equals':
          return String(value).toLowerCase() === String(filterValue).toLowerCase()
        case 'not_equals':
          return String(value).toLowerCase() !== String(filterValue).toLowerCase()
        case 'contains':
          return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
        case 'greater_than':
          if (filterValue instanceof Date || (typeof value === 'string' && value.includes('-'))) {
            return new Date(value as string) > new Date(filterValue as string)
          }
          return Number(value) > Number(filterValue)
        case 'less_than':
          if (filterValue instanceof Date || (typeof value === 'string' && value.includes('-'))) {
            return new Date(value as string) < new Date(filterValue as string)
          }
          return Number(value) < Number(filterValue)
        case 'between':
          if ((typeof value === 'string' && value.includes('-')) || filterValue instanceof Date) {
            const d = new Date(value as string)
            const start = new Date(filterValue as string)
            const end = new Date(filter.valueTo as string)
            return d >= start && d <= end
          }
          return Number(value) >= Number(filterValue) && Number(value) <= Number(filter.valueTo)
        default:
          return true
      }
    })
  })
}

// Função para aplicar ordenação
function applySort(data: ExplorarRecord[], column: string | null, direction: 'asc' | 'desc'): ExplorarRecord[] {
  if (!column) return data

  return [...data].sort((a, b) => {
    const aVal = a[column]
    const bVal = b[column]

    // Comparação de strings
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const comparison = aVal.localeCompare(bVal, 'pt-BR')
      return direction === 'asc' ? comparison : -comparison
    }

    // Comparação de números
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return direction === 'asc' ? aVal - bVal : bVal - aVal
    }

    // Fallback
    return 0
  })
}

// Hook principal
export function useExplorarData(params: UseExplorarDataParams): UseExplorarDataResult {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Acesso aos dados do Síndico (se disponível)
  let sindicoHookData: any = null
  try {
    const ctx = useSindicoData()
    sindicoHookData = ctx.data
  } catch (e) {
    // Ignorar erro se fora do provider (fallback)
  }

  const { cardId, metricContext, filters, sortColumn, sortDirection, page, pageSize, groupingField, metricId, dateRange } = params

  // Detectar se é uma métrica do relatório Excel ou CSV
  const isReportMetric = metricId?.startsWith('report-')
  const isCSVMetric = metricId?.startsWith('csv-') || metricContext === 'financeiro'

  // Effect to load CSV data
  const [csvData, setCsvData] = useState<ExplorarRecord[] | null>(null)

  useEffect(() => {
    let isMounted = true

    // Carregar dados apenas se for necessário (contexto financeiro ou csv)
    if (isCSVMetric) {
      setIsLoading(true)

      fetchFinancialData()
        .then(data => {
          if (isMounted) {
            setCsvData(data as unknown as ExplorarRecord[])
            setIsLoading(false)
          }
        })
        .catch(err => {
          console.error('[ERROR] Failed to load CSV via Service', err)
          if (isMounted) {
            setCsvData([])
            setError('Erro ao carregar dados financeiros')
            setIsLoading(false)
          }
        })
    } else {
      // Se não for CSV, não estamos carregando nada async por aqui (mock é sincrono no useMemo)
      setIsLoading(false)
    }

    return () => { isMounted = false }
  }, [isCSVMetric])


  // Obter colunas baseado no contexto ou tipo de métrica
  const columns = useMemo(() => {
    // Se for métrica do relatório Excel, usar colunas do report
    if (isReportMetric) {
      console.log('[useExplorarData] Using REPORT columns')
      return MOCK_COLUMNS.report || MOCK_COLUMNS.geral
    }

    // Se for métrica CSV Pago x Recebido, usar colunas específicas + dinâmicas
    if (isCSVMetric) {
      if (csvData && csvData.length > 0) {
        // Obter todas as chaves do primeiro registro
        const allKeys = Object.keys(csvData[0])

        // Mapear para configurações de coluna
        const dynamicCols: ColumnConfig[] = allKeys.map(key => {
          // Verificar se a coluna tem algum dado (Performance: para no primeiro valor encontrado)
          const hasData = csvData.some(record => {
            const val = record[key]
            return val !== null && val !== undefined && val !== ''
          })

          let label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) // Title Case
          if (!hasData) {
            label += ' (Vazio)'
          }

          return {
            key,
            label,
            type: key.includes('data') ? 'date' : key.includes('valor') ? 'currency' : 'string',
            sortable: true
          }
        })

        return dynamicCols
      }
      return MOCK_COLUMNS.csv
    }

    // Se for Síndico (Definição de Colunas Dinâmica)
    if (metricId?.startsWith('sind-')) {
      if (metricId.includes('vendas') || metricId.includes('faturamento') || metricId.includes('qtd') || metricId.includes('sales')) {
        return [
          { key: 'id', label: 'ID', type: 'string', sortable: true },
          { key: 'data', label: 'Data', type: 'date', sortable: true },
          { key: 'unidade', label: 'Unidade', type: 'string', sortable: true },
          { key: 'descricao', label: 'Produtos / Descrição', type: 'string', sortable: true },
          { key: 'valor', label: 'Valor Total', type: 'currency', sortable: true },
          { key: 'status', label: 'Status', type: 'string', sortable: true },
        ]
      }
      else if (metricId.includes('repasse')) {
        return [
          { key: 'id', label: 'ID', type: 'string', sortable: true },
          { key: 'mes', label: 'Mês Ref.', type: 'string', sortable: true },
          { key: 'valor_bruto', label: 'Valor Bruto', type: 'currency', sortable: true },
          { key: 'taxa', label: 'Taxa %', type: 'number', sortable: true },
          { key: 'valor_liquido', label: 'Valor Líquido', type: 'currency', sortable: true },
          { key: 'status', label: 'Status', type: 'string', sortable: true },
          { key: 'vencimento', label: 'Vencimento', type: 'date', sortable: true },
        ]
      }
    }

    const baseCols = MOCK_COLUMNS[metricContext] || MOCK_COLUMNS.geral

    if (!groupingField) return baseCols

    // Garante que as colunas base são retornadas. 
    // A lógica de prioridade agora fica no defaultVisibleColumns.
    return baseCols
  }, [metricContext, groupingField, isReportMetric, metricId, csvData])

  // Persistência de colunas visíveis
  const [persistedVisibleColumns, setPersistedVisibleColumns] = useState<string[] | null>(null)

  useEffect(() => {
    if (cardId) {
      const saved = localStorage.getItem(`explorar_cols_${cardId}`)
      if (saved) {
        try {
          setPersistedVisibleColumns(JSON.parse(saved))
        } catch (e) {
          console.error('Erro ao ler colunas salvas', e)
        }
      }
    }
  }, [cardId])

  // Salvar persistência
  const saveVisibleColumns = (cols: string[]) => {
    if (cardId) {
      localStorage.setItem(`explorar_cols_${cardId}`, JSON.stringify(cols))
      setPersistedVisibleColumns(cols)
    }
  }

  // Processar dados
  const processedData = useMemo(() => {
    try {
      let allData: ExplorarRecord[] = []

      // 0. Se houver dados externos (REAIS) injetados, usá-los com prioridade máxima
      if (params.externalData && params.externalData.length > 0) {
        console.log('[useExplorarData] Using EXTERNAL REAL DATA', params.externalData.length)
        allData = params.externalData as ExplorarRecord[]
      }
      // 1. Se for métrica do relatório Excel, usar dados enriquecidos
      else if (isReportMetric) {
        const enriched = getEnrichedData()
        allData = enriched.map((item, idx) => ({
          id: `RPT-${String(idx + 1).padStart(4, '0')}`,
          'Código': `PROD-${String(idx + 1)}`,
          'Ean': '789' + String(idx).padStart(10, '0'),
          'Produto': item.produto,
          'Agrupador': 'Loja Matriz',
          'Qtd Vendida': item.qtd,
          'Vl Venda': item.vlVenda,
          'CMV': item.cmv,
          'Lucro Bruto': item.lucro,
          'Vl Custo Unitário': item.cmv / (item.qtd || 1),
          'Vl Venda Unitário': item.vlVenda / (item.qtd || 1),
          'Margem Markup': 0,
          'Margem Líquida': item.margem,
          'categoria': item.categoria,
          'faixaMargem': item.faixaMargem,
          'oferta': item.oferta
        })) as unknown as ExplorarRecord[]
      }
      // 2. Usar dados baseados no metricContext ou fallback para mock
      else {
        // Se for métrica CSV, usar dados CSV independente do contexto
        if (isCSVMetric) {
          allData = csvData || []
        }
        // Lógica para dados do Síndico (INTEGRAÇÃO REAL)
        else if (metricId?.startsWith('sind-')) {
          // Tentar acessar dados do contexto do síndico globalmente
          // Como este hook não pode chamar hooks condicionalmente, precisamos injetar ou acessar de outra forma.
          // Mas espere! useExplorarData é um hook, então podemos chamar useSindicoData no topo do arquivo.
          // Vamos assumir que allData será populado pelo effect abaixo ou lógica síncrona se tivermos acesso.

          // Hack: Como não podemos chamar useSindicoData condicionalmente dentro do useMemo,
          // vamos confiar que 'externalData' foi passado OU vamos adicionar useSindicoData no topo do hook.
          // Para editar este arquivo de forma limpa, vamos adicionar a lógica de obtenção no topo e usar aqui.
          if (sindicoHookData) {
            if (metricId.includes('vendas') || metricId.includes('faturamento') || metricId.includes('qtd') || metricId.includes('sales')) {
              allData = (sindicoHookData.registrosVendas || []).map((r: any) => ({
                id: String(r.id),
                data: r.dataEfetivacao || r.dataInicio || r.dataHoraVenda,
                valor: r.valorTotal,
                unidade: r.unidadeNome || r.unidadeId,
                descricao: r.produtos?.map((p: any) => p.descricaoReduzida).join(', ') || `Venda ${r.id}`,
                status: r.nfceSituacaoNome || (r.cancelado ? 'Cancelado' : 'Concluído'),
                // Manter dados originais
                ...r
              }))
            } else if (metricId.includes('repasse')) {
              if (sindicoHookData.detalhesRepasse) {
                const dr = sindicoHookData.detalhesRepasse
                allData = [{
                  id: String(dr.id || 'REP-ATUAL'),
                  mes: dr.mes_referencia,
                  valor_bruto: dr.valor_bruto_vendas,
                  taxa: dr.taxa_repasse,
                  valor_liquido: dr.valor_liquido_repasse,
                  status: dr.status,
                  vencimento: dr.data_vencimento
                }]
              }
            }
          } else {
            allData = []
          }
        }
        else {
          switch (metricContext) {
            case 'financeiro':
              // Fallback to legacy reports or other financeiro data if not CSV
              allData = getMockData(metricContext)
              break
            default:
              // Usar dados mock para outros contextos (Fallback apenas)
              allData = getMockData(metricContext)
              break
          }
        }
      }

      // 2. Applying filters
      // 2.1 If dateRange exists and is CSV finance, apply date filter
      let dataToFilter = allData

      if (dateRange && dateRange.start && dateRange.end && (isCSVMetric || metricId?.startsWith('sind-'))) {
        const start = new Date(dateRange.start)
        const end = new Date(dateRange.end)

        dataToFilter = dataToFilter.filter((r, idx) => {
          // Normalização de chaves para busca insensível a case
          const keys = Object.keys(r);
          // Prioridade explicita conforme visto no CSV real: data_vencimento
          const dateKey = keys.find(k => k.toLowerCase() === 'data_vencimento') ||
            keys.find(k => k.toLowerCase() === 'vencimento') ||
            keys.find(k => k.toLowerCase() === 'data_efetivacao') ||
            keys.find(k => k.toLowerCase() === 'data_emissao') || // Fallback importante
            keys.find(k => k.toLowerCase().includes('data'));

          const dStr = dateKey ? (r[dateKey] as string) : null

          if (!dStr) return false

          // Parser robusto
          let d: Date
          if (typeof dStr === 'string') {
            // Tratamento para SQL Timestamp (YYYY-MM-DD HH:MM:SS)
            // Substituir espaço por T torna compatível com construtor Date ISO
            const cleanStr = dStr.trim().replace(' ', 'T')

            if (cleanStr.includes('/')) {
              const [day, month, year] = cleanStr.split('/').map(Number)
              d = new Date(year, month - 1, day)
            } else {
              d = new Date(cleanStr)
            }
          } else if (dStr instanceof Date) {
            d = dStr
          } else {
            return false
          }

          if (isNaN(d.getTime())) return false;

          // Normalizar para start of day
          d.setHours(0, 0, 0, 0)

          const rangeStart = new Date(start)
          rangeStart.setHours(0, 0, 0, 0)

          const rangeEnd = new Date(end)
          rangeEnd.setHours(23, 59, 59, 999)

          const inRange = d >= rangeStart && d <= rangeEnd

          // Debug ocasional para garantir que estamos vendo o que acontece
          // if (idx < 2) console.log('[DEBUG] Date Check:', { dateKey, raw: dStr, parsed: d, inRange })

          return inRange


        })
      }

      const filteredData = applyFilters(dataToFilter, filters)

      // 3. Aplicar ordenação
      const sortedData = applySort(filteredData, sortColumn, sortDirection)

      return {
        allData: sortedData,
        totalRecords: sortedData.length,
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar dados')
      return { allData: [], totalRecords: 0 }
    }
  }, [metricContext, filters, sortColumn, sortDirection, isReportMetric, params.externalData, csvData, dateRange])


  // Inicializar colunas secundário (padrão inteligente baseado no agrupamento)
  const defaultVisibleColumns = useMemo(() => {
    const allColKeys = columns.map(c => c.key)
    if (groupingField && allColKeys.includes(groupingField)) {
      // Prioridade: ID, Data, Campo de Agrupamento, e o restante
      const priorityKeys = ['id', 'data', 'data_criacao', 'data_envio', groupingField]
      const sortedKeys = Array.from(new Set([
        ...priorityKeys.filter(k => allColKeys.includes(k)),
        ...allColKeys
      ]))
      return sortedKeys
    }
    return allColKeys
  }, [columns, groupingField])

  // Paginar dados
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return processedData.allData.slice(start, end)
  }, [processedData.allData, page, pageSize])

  // Simular loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [metricContext, filters, sortColumn, sortDirection, page, pageSize])

  return {
    data: paginatedData,
    columns,
    visibleColumns: persistedVisibleColumns,
    defaultVisibleColumns,
    saveVisibleColumns,
    totalRecords: processedData.totalRecords,
    isLoading,
    error,
  }
}

// Função utilitária para limpar cache (útil para testes)
export function clearExplorarDataCache(): void {
  Object.keys(mockDataCache).forEach(key => delete mockDataCache[key])
}
