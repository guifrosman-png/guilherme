import Papa from 'papaparse';
import { parse, format, differenceInDays } from 'date-fns';

// --- Interfaces ---

export interface FinancialRecord {
    id: string;
    id_lojas: string;
    id_contas: string;
    ws_operacoes_fiscais: string;
    cfop: string;
    id_centro_custo: string;
    forma_pagamento: string;
    num_documento: string;
    num_nota_fiscal: string;
    serie_nota_fiscal: string;
    descricao: string;
    data_emissao: Date | null;
    data_vencimento: Date | null;
    data_efetivacao: Date | null;
    data_conciliacao: Date | null;
    valor: number;
    valor_efetivado: number;
    frequencia: string;
    num_parcela: string;
    qtd_parcelas: number | null;
    vl_multa: number;
    vl_juros: number;
    vl_desconto: number;
    vl_abatimento: number;
    vl_taxa: number;
    status: string;
    emitente: string;
    documento: string;
    id_ramo_atividades: string;
    conta_contabil: string;
    conta_financeira: string;
    unidade: string;
    centro_custo: string;
    movimento: 'entrada' | 'saida' | string;
    tipo: string;
    agrupador: string;
    abatimento: string;
    observacoes: string;
}

export interface FinancialFilters {
    startDate?: Date;
    endDate?: Date;
    status?: string[];
    movimento?: 'entrada' | 'saida';
    emitente?: string;
    contaContabil?: string;
    centroCusto?: string;
    unidade?: string;
}

// --- Parsing Logic ---

export const parseFinancialCSV = (csvText: string): FinancialRecord[] => {
    const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';', // Based on the CSV file preview
    });

    return result.data.map((row: any) => {
        // Helper to parse currency strings that might be "123.45" or empty
        const parseNumber = (val: any) => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            return parseFloat(val.replace(',', '.')) || 0;
        };

        // Helper to parse dates "YYYY-MM-DD HH:mm:ss"
        const parseDate = (val: any): Date | null => {
            if (!val) return null;
            try {
                // Try standard Date parse first as the format "2023-02-27 03:00:00" handles well in JS
                const date = new Date(val);
                return isNaN(date.getTime()) ? null : date;
            } catch {
                return null;
            }
        };

        return {
            ...row,
            data_emissao: parseDate(row.data_emissao),
            data_vencimento: parseDate(row.data_vencimento),
            data_efetivacao: parseDate(row.data_efetivacao),
            data_conciliacao: parseDate(row.data_conciliacao),
            valor: parseNumber(row.valor),
            valor_efetivado: parseNumber(row.valor_efetivado),
            qtd_parcelas: row.qtd_parcelas ? parseInt(row.qtd_parcelas, 10) : null,
            vl_multa: parseNumber(row.vl_multa),
            vl_juros: parseNumber(row.vl_juros),
            vl_desconto: parseNumber(row.vl_desconto),
            vl_abatimento: parseNumber(row.vl_abatimento),
            vl_taxa: parseNumber(row.vl_taxa),
        } as FinancialRecord;
    });
};

// --- Core Filter ---

export const filterFinancialData = (data: FinancialRecord[], filters: FinancialFilters): FinancialRecord[] => {
    return data.filter(item => {
        if (filters.startDate && (!item.data_vencimento || item.data_vencimento < filters.startDate)) return false;
        if (filters.endDate && (!item.data_vencimento || item.data_vencimento > filters.endDate)) return false;
        if (filters.status && !filters.status.includes(item.status)) return false;
        if (filters.movimento && item.movimento !== filters.movimento) return false;
        if (filters.emitente && item.emitente !== filters.emitente) return false;
        if (filters.contaContabil && item.conta_contabil !== filters.contaContabil) return false;
        if (filters.centroCusto && item.centro_custo !== filters.centroCusto) return false;
        if (filters.unidade && item.unidade !== filters.unidade) return false;
        return true;
    });
};

// --- Analyses ---

// 1. Analises por Valores

export const getTopSuppliers = (data: FinancialRecord[], limit = 20) => {
    const grouped: Record<string, { emitente: string; documento: string; qtd: number; total: number; efetivado: number }> = {};

    data.forEach(item => {
        if (item.movimento !== 'saida') return;
        const key = `${item.emitente}-${item.documento}`;
        if (!grouped[key]) {
            grouped[key] = { emitente: item.emitente, documento: item.documento, qtd: 0, total: 0, efetivado: 0 };
        }
        grouped[key].qtd += 1;
        grouped[key].total += item.valor;
        grouped[key].efetivado += item.valor_efetivado;
    });

    return Object.values(grouped)
        .sort((a, b) => b.total - a.total)
        .slice(0, limit);
};

export const getInterestAndFinesLost = (data: FinancialRecord[]) => {
    // Assuming grouped by month as per requirement 1.2
    // But for flexibility, let's return the aggregate first or a time-series function
    let totalJuros = 0;
    let totalMultas = 0;
    let totalValor = 0;

    data.forEach(item => {
        totalJuros += item.vl_juros;
        totalMultas += item.vl_multa;
        totalValor += item.valor;
    });

    const totalPerda = totalJuros + totalMultas;
    const percentualPerda = totalValor ? (totalPerda / totalValor) * 100 : 0;

    return { totalJuros, totalMultas, totalPerda, percentualPerda };
};

export const getDiscountsSavings = (data: FinancialRecord[]) => {
    let totalDesconto = 0;
    let totalValor = 0;

    data.forEach(item => {
        if (item.vl_desconto > 0) {
            totalDesconto += item.vl_desconto;
            totalValor += item.valor;
        }
    });

    const percentualEconomia = totalValor ? (totalDesconto / totalValor) * 100 : 0;
    return { totalDesconto, percentualEconomia };
};

export const getOriginalVsEffective = (data: FinancialRecord[], movimento?: 'entrada' | 'saida') => {
    let totalPrevisto = 0;
    let totalRealizado = 0;

    data.forEach(item => {
        if (movimento && item.movimento !== movimento) return;
        totalPrevisto += item.valor;
        totalRealizado += item.valor_efetivado;
    });

    const diferenca = totalRealizado - totalPrevisto;
    const variacaoPercentual = totalPrevisto ? (diferenca / totalPrevisto) * 100 : 0;

    return { totalPrevisto, totalRealizado, diferenca, variacaoPercentual };
};

// 2. Analises por Tempo

export const getCashFlowByMonth = (data: FinancialRecord[]) => {
    const grouped: Record<string, { year: number; month: number; recebimentos: number; pagamentos: number }> = {};

    data.forEach(item => {
        if (!item.data_vencimento) return;
        const year = item.data_vencimento.getFullYear();
        const month = item.data_vencimento.getMonth() + 1; // 0-indexed
        const key = `${year}-${month}`;

        if (!grouped[key]) {
            grouped[key] = { year, month, recebimentos: 0, pagamentos: 0 };
        }

        if (item.movimento === 'entrada') {
            grouped[key].recebimentos += item.valor_efetivado;
        } else if (item.movimento === 'saida') {
            grouped[key].pagamentos += item.valor_efetivado;
        }
    });

    return Object.values(grouped)
        .sort((a, b) => (a.year - b.year) || (a.month - b.month))
        .map(g => ({
            ...g,
            saldo: g.recebimentos - g.pagamentos
        }));
};

export const getDailyConcentration = (data: FinancialRecord[]) => {
    const grouped: Record<number, { day: number; qtd: number; total: number }> = {};

    data.forEach(item => {
        if (item.movimento !== 'saida' || !item.data_vencimento) return;
        const day = item.data_vencimento.getDate();

        if (!grouped[day]) {
            grouped[day] = { day, qtd: 0, total: 0 };
        }
        grouped[day].qtd += 1;
        grouped[day].total += item.valor;
    });

    return Object.values(grouped).sort((a, b) => b.total - a.total);
};

export const getPaymentTerms = (data: FinancialRecord[]) => {
    // This calculates aggregations for PMP
    let count = 0;
    let sumDaysEmissionToEffective = 0;
    let sumDaysDueToEffective = 0;

    data.forEach(item => {
        if (item.data_efetivacao && item.data_emissao) {
            sumDaysEmissionToEffective += differenceInDays(item.data_efetivacao, item.data_emissao);
        }
        if (item.data_efetivacao && item.data_vencimento) {
            sumDaysDueToEffective += differenceInDays(item.data_efetivacao, item.data_vencimento);
            count++;
        }
    });

    return {
        prazoMedioDias: count ? sumDaysEmissionToEffective / count : 0,
        diasAposVencimento: count ? sumDaysDueToEffective / count : 0
    };
};

export const getDelayRate = (data: FinancialRecord[]) => {
    let total = 0;
    let atrasados = 0;

    data.forEach(item => {
        if (!item.data_efetivacao || !item.data_vencimento) return;
        total++;
        // Simple verification if effective date is after due date (ignoring time if needed, but Date compare usually works)
        if (item.data_efetivacao > item.data_vencimento) {
            atrasados++;
        }
    });

    return {
        total,
        atrasados,
        taxaAtraso: total ? (atrasados / total) * 100 : 0
    };
};

// 3. Fornecedores & Categorias

export const getABBCurve = (data: FinancialRecord[], totalValue?: number) => {
    if (!totalValue) {
        totalValue = data.reduce((acc, curr) => acc + (curr.movimento === 'saida' ? curr.valor_efetivado : 0), 0);
    }

    const grouped = getTopSuppliers(data, 999999); // Get all

    let accumulated = 0;
    return grouped.map(item => {
        const percent = (item.efetivado / totalValue!) * 100;
        accumulated += percent;
        return {
            ...item,
            percentual: percent,
            acumulado: accumulated
        };
    }).slice(0, 50); // Return top 50 as Pareto
};

// 4. Classificacao

export const getExpensesByAccount = (data: FinancialRecord[]) => {
    const grouped: Record<string, { conta: string; total: number; qtd: number }> = {};

    data.forEach(item => {
        if (item.movimento !== 'saida') return;
        const conta = item.conta_contabil || 'Sem Conta';
        if (!grouped[conta]) {
            grouped[conta] = { conta, total: 0, qtd: 0 };
        }
        grouped[conta].total += item.valor_efetivado;
        grouped[conta].qtd += 1;
    });

    const totalOverall = Object.values(grouped).reduce((acc, k) => acc + k.total, 0);

    return Object.values(grouped)
        .sort((a, b) => b.total - a.total)
        .map(g => ({
            ...g,
            percentual: (g.total / totalOverall) * 100
        }));
};

// 5. Forma de Pagamento

export const getByPaymentMethod = (data: FinancialRecord[]) => {
    const grouped: Record<string, { method: string; total: number; qtd: number }> = {};

    data.forEach(item => {
        const method = item.forma_pagamento || 'Outros';
        if (!grouped[method]) {
            grouped[method] = { method, total: 0, qtd: 0 };
        }
        grouped[method].total += item.valor_efetivado;
        grouped[method].qtd += 1;
    });

    return Object.values(grouped).sort((a, b) => b.total - a.total);
};

// 7. Dashboard Review (KPIs)
export const getConsolidatedKPIs = (data: FinancialRecord[]) => {
    let count = 0;
    let uniqueEmitentes = new Set<string>();
    let valorTotal = 0;
    let valorEfetivado = 0;
    let custoAtraso = 0;
    let economiaDescontos = 0;
    let sumParcelas = 0;
    let countParcelas = 0;

    data.forEach(item => {
        count++;
        if (item.emitente) uniqueEmitentes.add(item.emitente);
        valorTotal += item.valor;
        valorEfetivado += item.valor_efetivado;
        custoAtraso += (item.vl_juros + item.vl_multa);
        economiaDescontos += item.vl_desconto;
        if (item.qtd_parcelas) {
            sumParcelas += item.qtd_parcelas;
            countParcelas++;
        }
    });

    return {
        totalTitulos: count,
        totalEmitentes: uniqueEmitentes.size,
        valorTotal,
        valorEfetivado,
        ticketMedio: count ? valorTotal / count : 0,
        custoAtraso,
        percentualCustoAtraso: valorTotal ? (custoAtraso / valorTotal) * 100 : 0,
        economiaDescontos,
        percentualEconomia: valorTotal ? (economiaDescontos / valorTotal) * 100 : 0,
        mediaParcelas: countParcelas ? sumParcelas / countParcelas : 1
    };
};

// 9. Taxes (Impostos)

const TAX_KEYWORDS = ['ICMS', 'PIS', 'COFINS', 'INSS', 'FGTS', 'SIMPLES', 'IMPOSTOS', 'RECEITA'];

export const getTaxAnalysis = (data: FinancialRecord[]) => {
    // Filter for taxes
    const taxData = data.filter(item => {
        const text = (item.conta_contabil + item.emitente).toUpperCase();
        return TAX_KEYWORDS.some(k => text.includes(k));
    });

    const totalPaid = taxData.reduce((acc, curr) => acc + curr.valor_efetivado, 0);

    let atrasados = 0;
    taxData.forEach(item => {
        if (item.data_efetivacao && item.data_vencimento && item.data_efetivacao > item.data_vencimento) {
            atrasados++;
        }
    });

    return {
        items: taxData,
        totalPaid,
        count: taxData.length,
        atrasados,
        taxaPontualidade: taxData.length ? ((taxData.length - atrasados) / taxData.length) * 100 : 100
    };
};
