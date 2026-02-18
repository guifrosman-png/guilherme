
/**
 * SERVIÇO DE INTEGRAÇÃO - MERCATUS API
 * Responsável por buscar vendas reais e calcular métricas para o fechamento.
 */

interface MercatusSaleResponse {
    paginacao?: {
        qtdTotalRegistros: number;
    };
    registros: Array<{
        id: number | string;
        dataInicio: string;     // Data início da venda (ex: "2026-02-01 00:57:43")
        dataFim: string;        // Data fim da venda
        dataEfetivacao: string; // Data efetivação
        valorTotal: number;
        valorLiquido: number;
        cancelado: boolean;
        unidadeId: string;
        unidadeNome: string;
        finalizadoras: Array<{
            id: string;
            descricao: string;
            valorPago: number;
            formaPagamentoDescricao?: string;
        }>;
        produtos: Array<{
            id: string;
            descricaoReduzida: string;
            descricaoComercial: string;
            quantidade: number;
            valorUnitario: number;
            valorTotal: number;
            cancelado: boolean;
        }>;
        // Legacy compatibility
        dataMovimento?: string;
        itens?: Array<{
            produto: string;
            quantidade: number;
            valorUnitario: number;
            valorTotal: number;
        }>;
    }>;
}

const API_URL = 'https://expressfoods.mercatus.net.br/api/vendas/listagem';
const HEADERS = {
    'X-Cliente-Id': '19',
    'X-Produto': 'mercado-app',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer Qu,TdD6?}rQyG\\Wja@;;4,BsF4L={[h*'
};

export const mercatusService = {
    /**
     * Método genérico para buscar vendas (compatível com o dashboard antigo)
     */
    async getSales(params: { unidadeId: number; dataInicial: string; dataFinal: string; portalSindico: string }) {
        try {
            const response = await fetch(`${API_URL}?pagina=1&quantidade=1000`, {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({
                    unidade: params.unidadeId,
                    dataInicial: params.dataInicial,
                    dataFinal: params.dataFinal,
                    portalSindico: params.portalSindico
                })
            });

            if (!response.ok) throw new Error('Erro ao buscar dados da API Mercatus');
            return await response.json() as MercatusSaleResponse;
        } catch (error) {
            console.error('Erro no mercatusService.getSales:', error);
            throw error;
        }
    },

    /**
     * Busca vendas de um período e calcula os totais formatados para o fechamento
     */
    async getFinancialTotals(month: number, year: number, unidadeId: number = 12) {
        try {
            const dataInicial = `${year}-${String(month).padStart(2, '0')}-01 00:00:00`;
            const lastDay = new Date(year, month, 0).getDate();
            const dataFinal = `${year}-${String(month).padStart(2, '0')}-${lastDay} 23:59:59`;

            const data = await this.getSales({
                unidadeId,
                dataInicial,
                dataFinal,
                portalSindico: "S"
            });

            // Inicializar acumuladores
            let cancellations = 0;

            let detail = {
                credito: 0,
                debito: 0,
                pix: 0,
                outros: 0
            };

            let totalSales = 0;
            // Safe check for registros array
            if (data.registros && Array.isArray(data.registros)) {
                data.registros.forEach(venda => {
                    const valor = Number(venda.valorTotal || 0);
                    totalSales += valor;
                    if (venda.cancelado) {
                        cancellations += valor;
                    } else {
                        // Detalhamento por finalizadora
                        venda.finalizadoras?.forEach(f => {
                            const desc = f.descricao?.toUpperCase() || '';
                            const valorPago = Number(f.valorPago || 0);
                            if (desc.includes('CRÉDITO') || desc.includes('CREDITO')) detail.credito += valorPago;
                            else if (desc.includes('DÉBITO') || desc.includes('DEBITO')) detail.debito += valorPago;
                            else if (desc.includes('PIX')) detail.pix += valorPago;
                            else detail.outros += valorPago;
                        });
                    }
                });
            }

            return {
                grossSales: totalSales,
                cancellations,
                netBase: totalSales - cancellations,
                detail,
                rawData: data.registros || [] // Exposing raw data for detailed reports
            };

        } catch (error) {
            console.error('Erro no mercatusService.getFinancialTotals:', error);
            throw error;
        }
    }
};
