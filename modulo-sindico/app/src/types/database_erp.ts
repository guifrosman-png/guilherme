// Mapeamento das tabelas SQL do banco e4_show

export interface TabelaRepasse {
    id: number;
    unidade_id: number;
    data_competencia: string; // DATE
    data_processamento: string; // TIMESTAMP
    valor_bruto_vendas: number; // DECIMAL
    valor_comissao: number; // DECIMAL (%)
    valor_liquido_repasse: number; // DECIMAL
    status: 'ABERTO' | 'PROCESSADO' | 'PAGO';
    arquivo_comprovante?: string; // URL ou PATH
}

export interface TabelaRepasseRegistro {
    id: number;
    repasse_id: number; // FK -> repasses.id
    venda_id: string; // ID da venda original
    valor_venda: number;
    percentual_aplicado: number;
    valor_repasse_item: number;
}
