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
    descricao: string;
    formaPagamentoCodigo: string;
    formaPagamentoDescricao: string;
    valorPago: number;
    bandeiraDescricao: string;
    tipoOperadoraCartaoDescricao: string;
}

export interface MercatusSale {
    id: string;
    cupom: string;
    clienteId: string;
    dataInicio: string;
    dataFim: string;
    dataEfetivacao: string;
    nfceNumero: string;
    nfceSituacaoNome: string;
    valorTotal: number;
    valorLiquido: number;
    valorDesconto: number;
    produtos: MercatusProduct[];
    finalizadoras: MercatusPayment[];
    unidadeNome: string;
}

export interface MercatusResponse {
    paginacao: MercatusPagination;
    registros: MercatusSale[];
}

export interface MercatusQueryParams {
    unidadeId: number;
    dataInicial: string;
    dataFinal: string;
    portalSindico: 'S' | 'N';
    pagina?: number;
    quantidade?: number;
}
