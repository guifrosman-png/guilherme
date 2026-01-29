/**
 * Pago x Recebido - Dados do CSV exportado do ERP
 * Similar ao sistema de lucratividade, mas para financeiro
 */

// REMOVE IMPORT
// import pagoRecebidoCSV from './vw_painel_financeiro.csv?raw'

export interface PagoRecebidoRecord {
    id: string
    movimento: 'entrada' | 'saida'
    status: string
    descricao: string
    emitente: string
    documento: string
    data_emissao: string
    data_vencimento: string
    data_efetivacao: string
    valor: number
    valor_efetivado: number
    vl_desconto: number
    vl_juros: number
    vl_multa: number
    forma_pagamento: string
    num_parcela: number
    qtd_parcelas: number
    conta_contabil: string
    conta_financeira: string
    centro_custo: string
    unidade: string
    cfop: string
    num_nota_fiscal: string
}

let cachedData: PagoRecebidoRecord[] | null = null
let loadPromise: Promise<PagoRecebidoRecord[]> | null = null

export async function loadPagoRecebidoData(): Promise<PagoRecebidoRecord[]> {
    if (cachedData) return cachedData
    if (loadPromise) return loadPromise

    loadPromise = fetch('/data/vw_painel_financeiro.csv')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load CSV')
            return response.text()
        })
        .then(text => {
            cachedData = parseCSV(text)
            return cachedData
        })
        .catch(err => {
            console.error('Error loading CSV:', err)
            throw err
        })
        .finally(() => {
            loadPromise = null
        })

    return loadPromise
}

// Keep synchronous getter for backward compatibility if possible,
// but warn it might be empty if called before load.
// Ideally, consumers should switch to loadPagoRecebidoData.
export function getPagoRecebidoData(): PagoRecebidoRecord[] {
    if (!cachedData) {
        console.warn('getPagoRecebidoData called before data was loaded. Returning empty array.')
        // Trigger load in background if not started
        loadPagoRecebidoData()
        return []
    }
    return cachedData
}

function parseCSV(csv: string): PagoRecebidoRecord[] {
    const lines = csv.trim().split('\n')
    const headers = lines[0].split(';') // Changed to semicolon

    return lines.slice(1).map(line => {
        // Handle CSV with semicolons
        const values = line.split(';')
        const record: any = {}

        headers.forEach((header, i) => {
            const value = values[i] || ''

            // Parse numeric fields
            if (['valor', 'valor_efetivado', 'vl_desconto', 'vl_juros', 'vl_multa'].includes(header)) {
                // Remove generic currency symbols if any, though raw CSV usually doesn't have them
                record[header] = parseFloat(value) || 0
            } else if (['num_parcela', 'qtd_parcelas'].includes(header)) {
                record[header] = parseInt(value) || 0
            } else {
                record[header] = value
            }
        })

        return record as PagoRecebidoRecord
    })
}



// Aggregations
// Helpers
const isInRange = (dateStr: string, start?: string, end?: string) => {
    if (!dateStr || !start || !end) return true

    const d = new Date(dateStr)
    // Normalize record to start of day for cleaner comparison if needed, 
    // or keep as is if we want precise time comparison against the range boundaries.
    // Given the 197k issue, robust day inclusion is key.

    const s = new Date(start)
    s.setHours(0, 0, 0, 0)

    const e = new Date(end)
    e.setHours(23, 59, 59, 999)

    return d >= s && d <= e
}

export function getTotalPago(dateRange?: { start: string; end: string }): number {
    return getPagoRecebidoData()
        .filter(r => r.movimento === 'saida')
        .filter(r => isInRange(r.data_vencimento, dateRange?.start, dateRange?.end)) // Filtro de data
        .reduce((acc, r) => acc + r.valor_efetivado, 0)
}

export function getTotalRecebido(dateRange?: { start: string; end: string }): number {
    return getPagoRecebidoData()
        .filter(r => r.movimento === 'entrada')
        .filter(r => isInRange(r.data_vencimento, dateRange?.start, dateRange?.end)) // Filtro de data
        .reduce((acc, r) => acc + r.valor_efetivado, 0)
}

export function getSaldoPeriodo(dateRange?: { start: string; end: string }): number {
    return getTotalRecebido(dateRange) - getTotalPago(dateRange)
}

// Groupings
export function getByContaFinanceira(dateRange?: { start: string; end: string }): { label: string; pago: number; recebido: number }[] {
    const data = getPagoRecebidoData()
        .filter(r => isInRange(r.data_vencimento, dateRange?.start, dateRange?.end)) // Filtro de data antes do agrupamento

    const grouped: Record<string, { pago: number; recebido: number }> = {}

    data.forEach(r => {
        const key = r.conta_financeira || 'Sem Conta'
        if (!grouped[key]) grouped[key] = { pago: 0, recebido: 0 }

        if (r.movimento === 'saida') {
            grouped[key].pago += r.valor_efetivado
        } else {
            grouped[key].recebido += r.valor_efetivado
        }
    })

    return Object.entries(grouped).map(([label, values]) => ({
        label,
        ...values
    }))
}

export function getByMes(dateRange?: { start: string; end: string }): { label: string; pago: number; recebido: number; saldo: number }[] {
    const data = getPagoRecebidoData()
        .filter(r => isInRange(r.data_vencimento, dateRange?.start, dateRange?.end)) // Filtro de data

    const grouped: Record<string, { pago: number; recebido: number }> = {}

    data.forEach(r => {
        if (!r.data_efetivacao) return
        const date = new Date(r.data_efetivacao)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

        if (!grouped[key]) grouped[key] = { pago: 0, recebido: 0 }

        if (r.movimento === 'saida') {
            grouped[key].pago += r.valor_efetivado
        } else {
            grouped[key].recebido += r.valor_efetivado
        }
    })

    return Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, values]) => ({
            label,
            pago: values.pago,
            recebido: values.recebido,
            saldo: values.recebido - values.pago
        }))
}
