import { TabelaRepasse } from '../types/database_erp';

/**
 * SERVIÇO DE REPASSES (Versão de Validação)
 * 
 * ATENCÃO: 
 * Este serviço atualmente lê um arquivo CSV estático ('/repasse.csv') localizado na pasta public.
 * Isso simula o acesso à VIEW do banco de dados 'e4_show' -> tabela 'repasses'.
 * 
 * FUTURO (Produção):
 * Este código será substituído por uma chamada real à API do Backend HubApp.
 * O Backend conectará no PostgreSQL e retornará o JSON.
 * 
 * O formato dos dados (Interface TabelaRepasse) DEVE ser mantido igual.
 */

class RepasseService {

    /**
     * Busca o repasse atual lendo do CSV de simulação.
     */
    async getRepasseAtual(unidadeId: number): Promise<TabelaRepasse | null> {
        try {
            const todosRepasses = await this.fetchCsvData();

            // Filtra pelo ID da unidade e pega o mais recente (simulando query SQL)
            // Query equivalente: SELECT * FROM repasses WHERE unidade_id = ? ORDER BY data_competencia DESC LIMIT 1
            const repassesDaUnidade = todosRepasses
                .filter(r => r.unidade_id === unidadeId)
                .sort((a, b) => new Date(b.data_competencia).getTime() - new Date(a.data_competencia).getTime());

            return repassesDaUnidade[0] || null;

        } catch (error) {
            console.error('Erro ao buscar repasse do CSV:', error);
            return null;
        }
    }

    /**
     * Busca todo o histórico de repasses do CSV.
     */
    async getHistoricoRepasses(unidadeId: number): Promise<TabelaRepasse[]> {
        try {
            const todosRepasses = await this.fetchCsvData();
            return todosRepasses
                .filter(r => r.unidade_id === unidadeId)
                .sort((a, b) => new Date(b.data_competencia).getTime() - new Date(a.data_competencia).getTime());
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            return [];
        }
    }

    /**
     * Função auxiliar para ler e parsear o CSV
     */
    private async fetchCsvData(): Promise<TabelaRepasse[]> {
        const response = await fetch('/data/repasse.csv');
        if (!response.ok) {
            throw new Error('Falha ao carregar arquivo de repasse.csv');
        }
        const text = await response.text();
        return this.parseCsv(text);
    }

    /**
     * Parser simples de CSV para JSON
     */
    private parseCsv(csvText: string): TabelaRepasse[] {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        // Assume que a primeira linha é o cabeçalho: id,unidade_id,...
        // Mas vamos ignorar o cabeçalho e mapear por índice para garantir tipagem, 
        // ou mapear dinamicamente se confiarmos na ordem.
        // Ordem no CSV: id,unidade_id,data_competencia,data_processamento,valor_bruto_vendas,valor_comissao,valor_liquido_repasse,status,arquivo_comprovante

        // Removendo cabeçalho
        const dataLines = lines.slice(1);

        return dataLines.map(line => {
            // Lidando com possíveis linhas vazias no final
            if (!line.trim()) return null;

            const cols = line.split(',');

            return {
                id: Number(cols[0]),
                unidade_id: Number(cols[1]),
                data_competencia: cols[2],
                data_processamento: cols[3],
                valor_bruto_vendas: Number(cols[4]),
                valor_comissao: Number(cols[5]),
                valor_liquido_repasse: Number(cols[6]),
                status: cols[7] as any,
                arquivo_comprovante: cols[8]?.trim() || undefined
            };
        }).filter(item => item !== null) as TabelaRepasse[];
    }
}

export const repasseService = new RepasseService();
