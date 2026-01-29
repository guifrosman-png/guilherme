import { MercatusResponse, MercatusQueryParams } from '../types/mercatus';

// TODO: Variáveis de ambiente
const DEFAULT_API_URL = 'https://expressfoods.mercatus.net.br/api';
// OBS: Token temporário para desenvolvimento
const TEMP_TOKEN = 'Qu,TdD6?}rQyG\\Wja@;;4,BsF4L={[h*';

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
        this.clientId = config.clientId || '19';
    }

    async getSales(params: MercatusQueryParams): Promise<MercatusResponse> {
        const endpoint = `${this.baseUrl}/vendas/listagem`;
        const page = params.pagina || 1;
        const limit = params.quantidade || 50; // Default mais seguro: 50 itens
        const queryUrl = `${endpoint}?pagina=${page}&quantidade=${limit}`;

        try {
            const response = await fetch(queryUrl, {
                method: 'POST',
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

export const mercatusService = new MercatusService();
