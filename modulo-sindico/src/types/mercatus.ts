export interface MercatusPagination {
    qtdTotalRegistros: number;
    qtdTotalPaginas: number;
    qtdPorPagina: number;
    primeiraPagina: number;
    paginaAnterior: number | null;
    paginaAtual: number;
    paginaProxima: number | null;
    paginaUltima: number;
}

export interface MercatusProduct {
    id: string;
    categoriaId: string;
    ean: string;
    codigo: string;
    descricaoReduzida: string;
    descricaoComercial: string;
    sequencia: string;
    quantidade: number;
    cancelado: boolean;
    valorVarejo: number;
    valorUnitario: number;
    valorTotal: number;
    valorDesconto: number;
    valorAcrescimo: number;
    valorLiquido: number;
    unidadeMedidaId: string;
    unidadeMedidaCodigo: string;
    unidadeMedidaDescricao: string;
    tipoPrecoId: string;
    tipoPrecoCodigo: string;
    tipoPrecoDescricao: string;
}

export interface MercatusPayment {
    id: string;
    codigo: string;
    descricao: string; // Ex: "DÉBITO", "CRÉDITO"
    formaPagamentoCodigo: string;
    formaPagamentoDescricao: string; // Ex: "Cartão Debito"
    valorPago: number;
    bandeiraDescricao: string; // Ex: "Débito - Mastercard"
    tipoOperadoraCartaoDescricao: string; // Ex: "STONE"
}

export interface MercatusSale {
    id: string;
    cupom: string;
    clienteId: string;
    dataInicio: string;
    dataFim: string;
    dataEfetivacao: string; // Essa é a data principal da venda
    nfceNumero: string;
    nfceSituacaoNome: string; // Ex: "Autorizado"
    valorTotal: number;
    valorLiquido: number;
    valorDesconto: number;
    produtos: MercatusProduct[];
    finalizadoras: MercatusPayment[]; // Formas de pagamento
    unidadeNome: string; // Ex: "FLEX SACOMA"
}

export interface MercatusResponse {
    paginacao: MercatusPagination;
    registros: MercatusSale[];
}

// Interface para os parâmetros da busca
export interface MercatusQueryParams {
    unidadeId: number;
    dataInicial: string; // Formato YYYY-MM-DD HH:mm:ss
    dataFinal: string;   // Formato YYYY-MM-DD HH:mm:ss
    portalSindico: 'S' | 'N';
}
