import Papa from 'papaparse'
import { DateRange } from '../../types'
import { FilterCondition } from '../../Filters/types'

export interface FinancialRecord {
  id: string
  id_lojas: number
  valor: number
  valor_efetivado: number
  data_emissao: string
  data_vencimento: string
  data_efetivacao: string | null
  emitente: string
  documento: string
  status: 'P' | 'E' | 'C' // Pendente, Efetivado, Cancelado
  movimento: 'entrada' | 'saida'
  conta_contabil: string
  centro_custo: string
  unidade: string
  vl_juros?: number
  vl_multa?: number
  vl_desconto?: number
}

export interface FinancialAggregates {
  totalRevenue: number
  totalExpense: number
  netBalance: number
  totalRevenuePaid: number
  totalExpensePaid: number
}

// Caminho do arquivo na pasta public
const CSV_PATH = '/data/vw_painel_financeiro.csv'

/**
 * Carrega e parseia o CSV de dados financeiros.
 * Implementa cache simples para evitar requisições duplicadas na mesma sessão se necessário,
 * mas o foco principal é ser chamado uma vez pelo ContextProvider.
 */
export async function fetchFinancialData(): Promise<FinancialRecord[]> {
  try {
    const response = await fetch(CSV_PATH)
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        delimiter: ';', // Explicitly set delimiter for reliability
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Validação básica e transformação se necessário
          const data = results.data as any[]
          const validData = data.map(row => ({
            ...row,
            // Garantir datas em string ISO se vierem diferente
            valor: Number(row.valor || 0),
            valor_efetivado: Number(row.valor_efetivado || 0),
            vl_juros: Number(row.vl_juros || 0),
            vl_multa: Number(row.vl_multa || 0),
            vl_desconto: Number(row.vl_desconto || 0)
          })) as FinancialRecord[]

          resolve(validData)
        },
        error: (error: Error) => {
          reject(error)
        }
      })
    })
  } catch (error) {
    console.error('Erro ao carregar CSV financeiro:', error)
    return []
  }
}

/**
 * Aplica o filtro de período aos dados brutos.
 * Utiliza o campo 'data_vencimento' como referência principal (Regra de Negócio Padrão).
 * Otimizado para filtrar array em memória.
 */
export function filterDataByPeriod(
  data: FinancialRecord[],
  period: DateRange
): FinancialRecord[] {
  if (!period.start || !period.end) return data

  const startTime = new Date(period.start).getTime()
  const endTime = new Date(period.end).getTime()

  // Normalização de fim do dia para garantir inclusão
  // Se o endTime vier sem hora (00:00:00), ajustamos para o final do dia
  const adjustedEndTime = period.end.includes('T') ? endTime : new Date(period.end + 'T23:59:59').getTime()

  return data.filter(record => {
    // Fallback: se não tiver data_vencimento, usa emissão
    const dateStr = record.data_vencimento || record.data_emissao
    if (!dateStr) return false

    const recordTime = new Date(dateStr).getTime()
    return recordTime >= startTime && recordTime <= adjustedEndTime
  })
}

/**
 * Calcula agregados básicos (Receita, Despesa, Saldo) em uma única passada pelo array.
 * Performance: O(N) onde N é o tamanho do filteredData.
 */
export function calculateAggregates(data: FinancialRecord[]): FinancialAggregates {
  let totalRevenue = 0
  let totalExpense = 0
  let totalRevenuePaid = 0
  let totalExpensePaid = 0

  for (const record of data) {
    // Ignora cancelados
    if (record.status === 'C') continue

    if (record.movimento === 'entrada') {
      totalRevenue += record.valor
      if (record.status === 'E') {
        totalRevenuePaid += record.valor_efetivado
      }
    } else if (record.movimento === 'saida') {
      totalExpense += record.valor
      if (record.status === 'E') {
        totalExpensePaid += record.valor_efetivado
      }
    }
  }



  return {
    totalRevenue,
    totalExpense,
    netBalance: totalRevenue - totalExpense,
    totalRevenuePaid,
    totalExpensePaid
  }
}

/**
 * Aplica filtros universais (FilterCondition[]) aos dados financeiros.
 * Suporta 'dueDate' (mapped to data_vencimento) e filtros genéricos de igualdade.
 */
export function filterDataByConditions(
  data: FinancialRecord[],
  filters: FilterCondition[]
): FinancialRecord[] {
  if (!filters || filters.length === 0) return data

  return data.filter(record => {
    return filters.every(filter => {
      // 1. Filtro de Data (dueDate)
      if (filter.field === 'dueDate') {
        const dateStr = record.data_vencimento || record.data_emissao
        if (!dateStr) return false
        const recordTime = new Date(dateStr).getTime()

        if (filter.operator === 'before' && filter.value) {
          return recordTime < new Date(filter.value).getTime()
        }
        if (filter.operator === 'after' && filter.value) {
          // Ajuste para fim do dia
          return recordTime > new Date(filter.value).getTime()
        }
        if (filter.operator === 'between' && filter.value?.start && filter.value?.end) {
          const start = new Date(filter.value.start).getTime()
          const end = new Date(filter.value.end).getTime()
          return recordTime >= start && recordTime <= end // Assumindo inputs YYYY-MM-DD
        }
        // TODO: Implementar 'is' (equals), 'is_not', etc se necessário para datas exatas
        return true
      }

      // 2. Outros Filtros (Ex: status, movimento, etc)
      // Implementação genérica para campos que existem no record
      if (filter.field in record) {
        const recordValue = record[filter.field as keyof FinancialRecord];

        if (filter.operator === 'is') return String(recordValue) === String(filter.value);
        if (filter.operator === 'is_not') return String(recordValue) !== String(filter.value);
        if (filter.operator === 'contains') return String(recordValue).toLowerCase().includes(String(filter.value).toLowerCase());

        // Adicione mais operadores conforme necessário
      }

      return true
    })
  })
}
