import { getPagoRecebidoData, loadPagoRecebidoData } from '../data/pagoRecebido';

export interface PainelFinanceiroRow {
    id: string;
    emitente: string;
    documento: string;
    conta_contabil: string;
    centro_custo: string;
    movimento: 'entrada' | 'saida';
    data_vencimento: string;
    data_efetivacao: string;
    valor: number;
    valor_efetivado: number;
    vl_juros: number;
    vl_multa: number;
    vl_desconto: number;
    status: string;
    [key: string]: any; // Allow indexing
}

// Helper para verificar data
const isInRange = (dateStr: string, start?: string, end?: string) => {
    if (!dateStr || !start || !end) return true;
    const d = new Date(dateStr);
    const s = new Date(start);
    const e = new Date(end);
    return d >= s && d <= e;
};

// Mapa de Dimensão ID -> Coluna CSV
const DIMENSION_MAP: Record<string, string> = {
    'csv-emitente': 'emitente',
    'csv-centro-custo': 'centro_custo',
    'csv-unidade': 'unidade',
    'csv-conta-contabil': 'conta_contabil',
    'csv-forma-pagamento': 'forma_pagamento',
    'csv-status': 'status',
    // Temporais
    'time-month': 'mes',
    'time-year': 'ano'
};

export async function loadPainelFinanceiroData(): Promise<PainelFinanceiroRow[]> {
    await loadPagoRecebidoData();
    return getPagoRecebidoData() as unknown as PainelFinanceiroRow[];
}

/**
 * Função Genérica de Agregação Financeira
 * Substitui getTopFornecedores por algo mais flexível
 */
export async function getFinanceiroAggregated(
    limit = 10,
    dateRange?: { start: string, end: string },
    groupByDimension: string = 'csv-emitente'
) {
    const data = await loadPainelFinanceiroData();

    // Identificar coluna de agrupamento
    const groupCol = DIMENSION_MAP[groupByDimension] || 'emitente';

    // Filtrar saídas e status válidos (Pago, Efetivado, Compensado - P, E, C, L)
    const validStatus = ['P', 'E', 'C', 'L'];

    const aggregated = data
        .filter(row => {
            const isSaida = row.movimento === 'saida';
            const isValidStatus = validStatus.includes(row.status);
            const isPeriodo = isInRange(row.data_vencimento, dateRange?.start, dateRange?.end);
            return isSaida && isValidStatus && isPeriodo;
        })
        .reduce((acc, row) => {
            // Resolver chave de agrupamento
            let key = row[groupCol] || 'NÃO IDENTIFICADO';

            // Lógica especial para datas
            if (groupByDimension === 'time-month' && row.data_vencimento) {
                key = row.data_vencimento.substring(0, 7); // YYYY-MM
            } else if (groupByDimension === 'time-year' && row.data_vencimento) {
                key = row.data_vencimento.substring(0, 4); // YYYY
            }

            // Tradução de códigos para nomes amigáveis
            if (groupByDimension === 'csv-forma-pagamento') {
                const formaMap: Record<string, string> = {
                    '1': 'Dinheiro',
                    '2': 'Boleto',
                    '3': 'Cartão',
                    'L': 'Pix',
                    'T': 'Transferência',
                    'H': 'Cheque',
                    'A': 'A Prazo',
                    'R': 'Recurso Próprio',
                    'M': 'Mensalidade',
                    '0': 'Outros'
                };
                key = formaMap[String(key)] || `Outros (${key})`;
            }

            if (!acc[key]) {
                acc[key] = {
                    value: 0,
                    qtd_titulos: 0,
                    total_efetivado: 0,
                    total_previsto: 0,
                    total_juros: 0,
                    total_multa: 0,
                    total_desconto: 0
                };
            }

            const valorEfetivado = row.valor_efetivado || 0;
            const valorPrevisto = row.valor || 0;

            // Use valor_efetivado as default value for generic charts unless specified otherwise
            acc[key].value += valorEfetivado;

            acc[key].total_efetivado += valorEfetivado;
            acc[key].total_previsto += valorPrevisto;
            acc[key].total_juros += (row.vl_juros || 0);
            acc[key].total_multa += (row.vl_multa || 0);
            acc[key].total_desconto += (row.vl_desconto || 0);
            acc[key].qtd_titulos += 1;

            return acc;
        }, {} as Record<string, any>);

    return Object.values(aggregated)
        .sort((a: any, b: any) => b.value - a.value)
        .slice(0, limit);
}

/**
 * Fluxo Mensal (Entradas vs Saídas)
 * Análise 2.1 do documento
 * Retorna múltiplas séries: Entradas, Saídas e Saldo
 */
export async function getFluxoMensal(
    dateRange?: { start: string, end: string },
    groupByDimension: string = 'time-month'
) {
    const data = await loadPainelFinanceiroData();
    const validStatus = ['P', 'E', 'C', 'L'];

    // Agrupar por período (mes, semana, dia, trimestre)
    const fluxo = data
        .filter(row => {
            const isValidStatus = validStatus.includes(row.status);
            const isPeriodo = isInRange(row.data_vencimento, dateRange?.start, dateRange?.end);
            return isValidStatus && isPeriodo;
        })
        .reduce((acc, row) => {
            // Resolver chave de agrupamento temporal
            let key = '';
            if (groupByDimension === 'time-month' && row.data_vencimento) {
                key = row.data_vencimento.substring(0, 7); // YYYY-MM
            } else if (groupByDimension === 'time-year' && row.data_vencimento) {
                key = row.data_vencimento.substring(0, 4); // YYYY
            } else if (groupByDimension === 'time-day' && row.data_vencimento) {
                key = row.data_vencimento.substring(0, 10); // YYYY-MM-DD
            } else {
                // Fallback: month
                key = row.data_vencimento ? row.data_vencimento.substring(0, 7) : 'N/A';
            }

            if (!acc[key]) {
                acc[key] = {
                    label: key,
                    entradas: 0,
                    saidas: 0,
                    saldo: 0
                };
            }

            const valorEfetivado = row.valor_efetivado || 0;

            if (row.movimento === 'entrada') {
                acc[key].entradas += valorEfetivado;
            } else if (row.movimento === 'saida') {
                acc[key].saidas += valorEfetivado;
            }

            return acc;
        }, {} as Record<string, { label: string; entradas: number; saidas: number; saldo: number }>);

    // Calcular saldo e retornar array ordenado
    return Object.values(fluxo)
        .map(item => ({
            ...item,
            saldo: item.entradas - item.saidas
        }))
        .sort((a, b) => a.label.localeCompare(b.label)); // Ordem cronológica
}

// Alias para compatibilidade (mas deve ser migrado)
export const getTopFornecedores = getFinanceiroAggregated;
