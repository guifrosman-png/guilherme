/**
 * ============================================
 * ERP FINANCEIRO SERVICE
 * ============================================
 *
 * Serviço para buscar dados financeiros do ERP (vw_painel_financeiro)
 * Usado pelos cards e gráficos do dashboard financeiro
 */

// ============================================
// TIPOS
// ============================================

export interface FinanceiroFilters {
  dataInicio?: string
  dataFim?: string
  movimento?: 'entrada' | 'saida' | 'todos'
  status?: string[]
  unidade?: string
  contaContabil?: string
  centroCusto?: string
}

export interface TituloFinanceiro {
  id: string
  movimento: 'entrada' | 'saida'
  tipo: string
  status: string
  valor: number
  valorEfetivado: number | null
  dataVencimento: string
  dataEfetivacao: string | null
  emitente: string
  contaFinanceira: string
  contaContabil: string
  centroCusto: string
  unidade: string
}

export interface ResumoFinanceiro {
  totalRecebido: number
  totalPago: number
  saldo: number
  qtdTitulosRecebido: number
  qtdTitulosPago: number
}

export interface DadosMensais {
  mes: string
  mesNumero: number
  ano: number
  recebido: number
  pago: number
  saldo: number
}

export interface DadosPorConta {
  conta: string
  valor: number
  percentual: number
}

/**
 * Dados de Pago x Recebido por Conta Contábil (formato tabela pivot)
 */
export interface DetalheContaContabil {
  conta: string
  pagar: number
  receber: number
  saldo: number
  // Totais gerais (acumulados)
  totalPagar: number
  totalReceber: number
  totalSaldo: number
}

// ============================================
// DADOS MOCK (Baseados na análise do ERP)
// ============================================

// Dados mock baseados na estrutura real do ERP
const MOCK_TITULOS: TituloFinanceiro[] = [
  // Recebimentos (entrada)
  { id: '1', movimento: 'entrada', tipo: 'titulo', status: 'E', valor: 12500.00, valorEfetivado: 12500.00, dataVencimento: '2024-01-15', dataEfetivacao: '2024-01-15', emitente: 'CLIENTE A LTDA', contaFinanceira: 'CAIXA GERAL', contaContabil: '4116 - VENDA DE MERCADORIAS', centroCusto: 'PADRÃO', unidade: 'LOJA 001' },
  { id: '2', movimento: 'entrada', tipo: 'titulo', status: 'E', valor: 8750.50, valorEfetivado: 8750.50, dataVencimento: '2024-02-10', dataEfetivacao: '2024-02-10', emitente: 'CLIENTE B SA', contaFinanceira: 'BANCO DO BRASIL', contaContabil: '4116 - VENDA DE MERCADORIAS', centroCusto: 'PADRÃO', unidade: 'LOJA 001' },
  { id: '3', movimento: 'entrada', tipo: 'titulo', status: 'E', valor: 15320.00, valorEfetivado: 15320.00, dataVencimento: '2024-03-05', dataEfetivacao: '2024-03-05', emitente: 'CLIENTE C ME', contaFinanceira: 'ITAU', contaContabil: '4111 - VENDA DE MERCADORIAS DINHEIRO', centroCusto: 'PADRÃO', unidade: 'LOJA 002' },
  { id: '4', movimento: 'entrada', tipo: 'titulo', status: 'L', valor: 5200.00, valorEfetivado: null, dataVencimento: '2024-04-20', dataEfetivacao: null, emitente: 'CLIENTE D LTDA', contaFinanceira: 'CAIXA GERAL', contaContabil: '5212 - CREDITO PRE PAGO - CONVENIO', centroCusto: 'PADRÃO', unidade: 'LOJA 001' },

  // Pagamentos (saida)
  { id: '5', movimento: 'saida', tipo: 'titulo', status: 'E', valor: 45000.00, valorEfetivado: 45000.00, dataVencimento: '2024-01-10', dataEfetivacao: '2024-01-10', emitente: 'FORNECEDOR X LTDA', contaFinanceira: 'ITAU', contaContabil: '6.1.01 - CUSTO MERCADORIAS', centroCusto: 'PADRÃO', unidade: 'CD001' },
  { id: '6', movimento: 'saida', tipo: 'titulo', status: 'E', valor: 28500.00, valorEfetivado: 28500.00, dataVencimento: '2024-02-15', dataEfetivacao: '2024-02-15', emitente: 'DISTRIBUIDORA Y SA', contaFinanceira: 'BANCO DO BRASIL', contaContabil: '6.1.01 - CUSTO MERCADORIAS', centroCusto: 'PADRÃO', unidade: 'CD001' },
  { id: '7', movimento: 'saida', tipo: 'titulo', status: 'E', valor: 12800.00, valorEfetivado: 12800.00, dataVencimento: '2024-03-20', dataEfetivacao: '2024-03-20', emitente: 'TRANSPORTADORA Z', contaFinanceira: 'SICOOB', contaContabil: '6.2.01 - FRETES', centroCusto: 'LOGISTICA', unidade: 'CD001' },
  { id: '8', movimento: 'saida', tipo: 'titulo', status: 'L', valor: 8500.00, valorEfetivado: null, dataVencimento: '2024-04-25', dataEfetivacao: null, emitente: 'ENERGIA ELETRICA', contaFinanceira: 'CAIXA GERAL', contaContabil: '6.3.01 - ENERGIA', centroCusto: 'ADMINISTRATIVO', unidade: 'LOJA 001' },
]

// Gerar dados mensais mock mais realistas
function generateMockMonthlyData(): DadosMensais[] {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

  // Valores base com sazonalidade
  const baseRecebido = [85000, 92000, 78000, 95000, 88000, 102000, 115000, 98000, 89000, 105000, 125000, 145000]
  const basePago = [120000, 135000, 98000, 110000, 95000, 88000, 92000, 105000, 115000, 125000, 140000, 160000]

  return meses.map((mes, i) => {
    const recebido = baseRecebido[i] * (0.9 + Math.random() * 0.2)
    const pago = basePago[i] * (0.9 + Math.random() * 0.2)
    return {
      mes,
      mesNumero: i + 1,
      ano: 2024,
      recebido: Math.round(recebido * 100) / 100,
      pago: Math.round(pago * 100) / 100,
      saldo: Math.round((recebido - pago) * 100) / 100
    }
  })
}

// Gerar dados por conta contábil
function generateMockContaData(): DadosPorConta[] {
  const contas = [
    { conta: '4116 - VENDA DE MERCADORIAS CONVENIO', valor: 527.11 },
    { conta: '4111 - VENDA DE MERCADORIAS DINHEIRO', valor: 0 },
    { conta: '5212 - CREDITO PRE PAGO - CONVENIO', valor: 50.00 },
    { conta: '5211 - DEBITO PRE PAGO - CONVENIO', valor: 0 },
    { conta: '4116 - VENDA DE MERCADORIAS - PIX', valor: 0 },
    { conta: '411 - VENDA DE MERCADORIAS', valor: 111.59 },
    { conta: '4226 - OUTRAS RECEITAS', valor: 124.55 },
  ]

  const total = contas.reduce((sum, c) => sum + c.valor, 0)

  return contas.map(c => ({
    ...c,
    percentual: total > 0 ? Math.round((c.valor / total) * 10000) / 100 : 0
  }))
}

// Cache dos dados mensais
let cachedMonthlyData: DadosMensais[] | null = null

// ============================================
// FUNÇÕES DO SERVIÇO
// ============================================

/**
 * Busca resumo financeiro (totais)
 */
export function getResumoFinanceiro(filters?: FinanceiroFilters): ResumoFinanceiro {
  // Em produção, isso seria uma chamada ao backend/API
  // Por enquanto, usamos dados mock baseados na estrutura real

  const monthlyData = cachedMonthlyData || generateMockMonthlyData()
  cachedMonthlyData = monthlyData

  const totalRecebido = monthlyData.reduce((sum, m) => sum + m.recebido, 0)
  const totalPago = monthlyData.reduce((sum, m) => sum + m.pago, 0)

  return {
    totalRecebido: Math.round(totalRecebido * 100) / 100,
    totalPago: Math.round(totalPago * 100) / 100,
    saldo: Math.round((totalRecebido - totalPago) * 100) / 100,
    qtdTitulosRecebido: 4703,
    qtdTitulosPago: 271
  }
}

/**
 * Busca dados mensais para gráfico de barras
 */
export function getDadosMensais(filters?: FinanceiroFilters): DadosMensais[] {
  if (!cachedMonthlyData) {
    cachedMonthlyData = generateMockMonthlyData()
  }
  return cachedMonthlyData
}

/**
 * Busca dados por conta contábil
 */
export function getDadosPorContaContabil(filters?: FinanceiroFilters): DadosPorConta[] {
  return generateMockContaData()
}

/**
 * Busca saldos das contas bancárias
 */
export function getSaldosContas(): { conta: string; saldo: number }[] {
  return [
    { conta: 'ITAU', saldo: -3100992.03 },
    { conta: 'SICOOB', saldo: -249028.43 },
    { conta: 'BANCO DO BRASIL', saldo: -145333.98 },
    { conta: 'PAGBANK', saldo: 100.00 },
  ]
}

/**
 * Formata valor em BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Formata valor abreviado (ex: 875K, 1.2M)
 */
export function formatCurrencyShort(value: number): string {
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (absValue >= 1000000) {
    return `${sign}R$ ${(absValue / 1000000).toFixed(1)}M`
  }
  if (absValue >= 1000) {
    return `${sign}R$ ${(absValue / 1000).toFixed(1)}K`
  }
  return formatCurrency(value)
}

/**
 * Busca detalhes de Pago x Recebido por Conta Contábil
 * Formato para tabela pivot com colunas: Conta | Pagar | Receber | Saldo
 */
export function getDetalhesPorContaContabil(filters?: FinanceiroFilters): DetalheContaContabil[] {
  // Dados mock baseados na imagem do usuário
  const detalhes: DetalheContaContabil[] = [
    {
      conta: '4116 - VENDA DE MERCADORIAS - CONVENIO',
      pagar: 0,
      receber: 3172.46,
      saldo: 3172.46,
      totalPagar: 0,
      totalReceber: 3172.46,
      totalSaldo: 3172.46
    },
    {
      conta: '4318 - COMPRA DE MERCADORIA-MANUAL',
      pagar: -90.66,
      receber: 0,
      saldo: -90.66,
      totalPagar: -90.66,
      totalReceber: 0,
      totalSaldo: -90.66
    },
    {
      conta: '5228 - COMISSAO A CONDOMINIOS (CASHBACK)',
      pagar: -10.00,
      receber: 0,
      saldo: -10.00,
      totalPagar: -10.00,
      totalReceber: 0,
      totalSaldo: -10.00
    },
    {
      conta: '4511 - TRANSFERENCIA ENTRE LOJAS - ENTRADA',
      pagar: -96.00,
      receber: 0,
      saldo: -96.00,
      totalPagar: -96.00,
      totalReceber: 0,
      totalSaldo: -96.00
    },
    {
      conta: '4118 - VENDA DE MERCADORIAS - PIX',
      pagar: 0,
      receber: 10942.84,
      saldo: 10942.84,
      totalPagar: 0,
      totalReceber: 10942.84,
      totalSaldo: 10942.84
    },
    {
      conta: '4111 - VENDA DE MERCADORIAS - DINHEIRO',
      pagar: 0,
      receber: 1546.97,
      saldo: 1546.97,
      totalPagar: 0,
      totalReceber: 1546.97,
      totalSaldo: 1546.97
    },
    {
      conta: '4113 - VENDA DE MERCADORIAS - C. DEBITO',
      pagar: 0,
      receber: 20.00,
      saldo: 20.00,
      totalPagar: 0,
      totalReceber: 20.00,
      totalSaldo: 20.00
    },
    {
      conta: '4311 - COMPRA DE MERCADORIAS',
      pagar: -1164.99,
      receber: 0,
      saldo: -1164.99,
      totalPagar: -1164.99,
      totalReceber: 0,
      totalSaldo: -1164.99
    }
  ]

  return detalhes
}

/**
 * Retorna totais gerais de Pago x Recebido
 */
export function getTotaisGeralContaContabil(filters?: FinanceiroFilters): { pagar: number; receber: number; saldo: number } {
  const detalhes = getDetalhesPorContaContabil(filters)

  const totais = detalhes.reduce((acc, d) => ({
    pagar: acc.pagar + d.pagar,
    receber: acc.receber + d.receber,
    saldo: acc.saldo + d.saldo
  }), { pagar: 0, receber: 0, saldo: 0 })

  return {
    pagar: Math.round(totais.pagar * 100) / 100,
    receber: Math.round(totais.receber * 100) / 100,
    saldo: Math.round(totais.saldo * 100) / 100
  }
}
