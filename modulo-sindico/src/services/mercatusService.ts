import { MercatusResponse, MercatusQueryParams } from '../types/mercatus';

// TODO: Mover para variáveis de ambiente (.env) em produção
const DEFAULT_API_URL = 'https://expressfoods.mercatus.net.br/api';
// OBS: Em produção, o token deve vir de uma autenticação segura ou banco de dados
const TEMP_TOKEN = 'Qu,TdD6?rQyG\\Wja@;;4,BsF4L={h*';

interface MercatusServiceConfig {
    baseUrl?: string;
    token?: string;
    clientId?: string;
}

export class MercatusService {
    private baseUrl: string;
    private token: string;
    private clientId: string;

    constructor(config: MercatusServiceConfig = {}) {
        this.baseUrl = config.baseUrl || DEFAULT_API_URL;
        this.token = config.token || TEMP_TOKEN;
        this.clientId = config.clientId || '19'; // ID padrão do exemplo
    }

    /**
     * Busca a listagem de vendas do período
     */
    async getSales(params: MercatusQueryParams): Promise<MercatusResponse> {
        const endpoint = `${this.baseUrl}/vendas/listagem`;

        // Parâmetros de paginação padrão (podemos expandir depois)
        const queryUrl = `${endpoint}?pagina=1&quantidade=1000`;

        try {
            const response = await fetch(queryUrl, {
                method: 'POST', // A API pede POST para enviar os filtros no body
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                    'X-Cliente-Id': this.clientId,
                    'X-Produto': 'mercado-app'
                },
                body: JSON.stringify({
                    unidade: params.unidadeId,
                    dataInicial: params.dataInicial,
                    dataFinal: params.dataFinal,
                    portalSindico: params.portalSindico
                })
            });

            if (!response.ok) {
                throw new Error(`Erro na API Mercatus: ${response.status} ${response.statusText}`);
            }

            const data: MercatusResponse = await response.json();
            return data;

        } catch (error) {
            console.error('Falha ao buscar vendas:', error);
            throw error;
        }
    }
}

// Exporta uma instância padrão para uso rápido
export const mercatusService = new MercatusService();
