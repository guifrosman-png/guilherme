import type { DimensionDefinition } from '../types'

/**
 * ============================================
 * DIMENSÕES - Como agrupar os dados
 * ============================================
 *
 * Dimensões determinam COMO os dados serão agrupados/organizados.
 *
 * Tipos de dimensões:
 * - Temporal: Agrupa por período de tempo (dia, mês, ano, etc.)
 * - Categórica: Agrupa por categorias fixas (status, região, tipo, etc.)
 * - Numérica: Agrupa por faixas numéricas (menos comum)
 */

// ============================================
// DIMENSÕES TEMPORAIS (PADRÃO)
// ============================================
/**
 * Estas dimensões temporais funcionam para QUALQUER segmento
 * NÃO MODIFIQUE - são padrão do sistema
 */
export const TEMPORAL_DIMENSIONS: DimensionDefinition[] = [
  {
    id: 'time-hour',
    name: 'Por Hora',
    description: 'Agrupa dados por hora do dia (00h-23h)',
    type: 'temporal',
    granularity: 'hour',
    field: 'created_at' // Campo padrão, pode ser sobrescrito
  },
  {
    id: 'time-day',
    name: 'Por Dia',
    description: 'Agrupa dados por dia',
    type: 'temporal',
    granularity: 'day',
    field: 'created_at'
  },
  {
    id: 'time-week',
    name: 'Por Semana',
    description: 'Agrupa dados por semana',
    type: 'temporal',
    granularity: 'week',
    field: 'created_at'
  },
  {
    id: 'time-month',
    name: 'Por Mês',
    description: 'Agrupa dados por mês',
    type: 'temporal',
    granularity: 'month',
    field: 'created_at'
  },
  {
    id: 'time-quarter',
    name: 'Por Trimestre',
    description: 'Agrupa dados por trimestre (Q1, Q2, Q3, Q4)',
    type: 'temporal',
    granularity: 'quarter',
    field: 'created_at'
  },
  {
    id: 'time-year',
    name: 'Por Ano',
    description: 'Agrupa dados por ano',
    type: 'temporal',
    granularity: 'year',
    field: 'created_at'
  }
]

// ============================================
// DIMENSÕES CATEGÓRICAS DE EXEMPLO
// ============================================
/**
 * ATENÇÃO: Estas são apenas EXEMPLOS!
 * Substitua/adicione suas próprias dimensões específicas do seu negócio
 */

// Exemplo 1: Status genérico
const exampleStatusDimension: DimensionDefinition = {
  id: 'example-status',
  name: 'Por Status (Exemplo)',
  description: 'Exemplo de dimensão categórica - status de registro',
  type: 'categorical',
  field: 'status',
  options: [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' },
    { value: 'completed', label: 'Concluído' }
  ]
}

// Exemplo 2: Região geográfica
const exampleRegionDimension: DimensionDefinition = {
  id: 'example-region',
  name: 'Por Região (Exemplo)',
  description: 'Exemplo de dimensão categórica - região geográfica',
  type: 'categorical',
  field: 'region',
  options: [
    { value: 'north', label: 'Norte' },
    { value: 'northeast', label: 'Nordeste' },
    { value: 'midwest', label: 'Centro-Oeste' },
    { value: 'southeast', label: 'Sudeste' },
    { value: 'south', label: 'Sul' }
  ]
}

// Exemplo 3: Tipo/Categoria
const exampleCategoryDimension: DimensionDefinition = {
  id: 'example-category',
  name: 'Por Categoria (Exemplo)',
  description: 'Exemplo de dimensão categórica - tipo ou categoria',
  type: 'categorical',
  field: 'category',
  options: [
    { value: 'type-a', label: 'Tipo A' },
    { value: 'type-b', label: 'Tipo B' },
    { value: 'type-c', label: 'Tipo C' }
  ]
}

// Relatório: Produto
const productDimension: DimensionDefinition = {
  id: 'product-dimension',
  name: 'Produto (Relatório)',
  description: 'Lista os produtos individuais do relatório',
  type: 'categorical',
  field: 'Produto'
}

// Relatório: Agrupador (Categoria)
const categoryDimension: DimensionDefinition = {
  id: 'category-dimension',
  name: 'Categoria/Agrupador (Relatório)',
  description: 'Agrupa pelo campo Agrupador do relatório',
  type: 'categorical',
  field: 'Agrupador'
}

// ============================================
// EXPORTAR TODAS AS DIMENSÕES
// ============================================

// ============================================
// DIMENSÕES CSV (Pago x Recebido)
// ============================================
/**
 * Dimensões específicas para métricas CSV (Pago x Recebido)
 */
export const CSV_DIMENSIONS: DimensionDefinition[] = [
  {
    id: 'csv-movimento',
    name: 'Por Movimento',
    description: 'Agrupa por tipo: entrada ou saída',
    type: 'categorical',
    field: 'movimento',
    context: 'csv',
    options: [
      { value: 'entrada', label: 'Entrada' },
      { value: 'saida', label: 'Saída' }
    ]
  },
  {
    id: 'csv-emitente',
    name: 'Por Emitente',
    description: 'Agrupa por fornecedor/cliente',
    type: 'categorical',
    field: 'emitente',
    context: 'csv'
  },
  {
    id: 'csv-conta-financeira',
    name: 'Por Conta Financeira',
    description: 'Agrupa por conta bancária',
    type: 'categorical',
    field: 'conta_financeira',
    context: 'csv'
  },
  {
    id: 'csv-centro-custo',
    name: 'Por Centro de Custo',
    description: 'Agrupa por centro de custo',
    type: 'categorical',
    field: 'centro_custo',
    context: 'csv'
  },
  {
    id: 'csv-unidade',
    name: 'Por Unidade',
    description: 'Agrupa por unidade de negócio',
    type: 'categorical',
    field: 'unidade',
    context: 'csv'
  },
  {
    id: 'csv-status',
    name: 'Por Status',
    description: 'Agrupa por status do lançamento',
    type: 'categorical',
    field: 'status',
    context: 'csv'
  },
  {
    id: 'csv-forma-pagamento',
    name: 'Por Forma de Pagamento',
    description: 'Agrupa por forma de pagamento',
    type: 'categorical',
    field: 'forma_pagamento',
    context: 'csv'
  },
  {
    id: 'csv-conta-contabil',
    name: 'Por Conta Contábil',
    description: 'Agrupa por conta contábil',
    type: 'categorical',
    field: 'conta_contabil',
    context: 'csv'
  },
  {
    id: 'csv-cfop',
    name: 'Por CFOP',
    description: 'Agrupa por código fiscal',
    type: 'categorical',
    field: 'cfop',
    context: 'csv'
  }
]

/**
 * Array com todas as dimensões disponíveis
 * Temporais + Categóricas de Exemplo + CSV
 */
export const ALL_DIMENSIONS: DimensionDefinition[] = [
  ...TEMPORAL_DIMENSIONS,
  exampleStatusDimension,
  exampleRegionDimension,
  exampleCategoryDimension,
  productDimension,
  categoryDimension,
  ...CSV_DIMENSIONS
]


/**
 * ============================================
 * TEMPLATE PARA ADICIONAR DIMENSÕES CUSTOMIZADAS
 * ============================================
 *
 * EXEMPLO - Dimensão Categórica:
 *
 * export const minhaDimensaoCustomizada: DimensionDefinition = {
 *   id: 'meu-segmento-dimensao',  // Ex: 'crm-lead-source'
 *   name: 'Nome da Dimensão',  // Ex: 'Origem do Lead'
 *   description: 'Descrição clara',
 *   type: 'categorical',
 *   field: 'campo_do_banco',  // Ex: 'lead_source'
 *   options: [
 *     { value: 'website', label: 'Website' },
 *     { value: 'referral', label: 'Indicação' },
 *     { value: 'social', label: 'Redes Sociais' }
 *   ]
 * }
 *
 * // Adicionar ao array ALL_DIMENSIONS:
 * export const ALL_DIMENSIONS = [
 *   ...TEMPORAL_DIMENSIONS,
 *   exampleStatusDimension,
 *   exampleRegionDimension,
 *   minhaDimensaoCustomizada  // <- Adicionar aqui
 * ]
 *
 * ============================================
 * EXEMPLOS REAIS POR SEGMENTO
 * ============================================
 *
 * CRM:
 * - Origem do Lead (Website, Indicação, Redes Sociais, Anúncio)
 * - Estágio do Pipeline (Novo, Qualificado, Proposta, Negociação, Ganho, Perdido)
 * - Responsável/Vendedor
 * - Segmento de Cliente (PME, Médio, Enterprise)
 *
 * Financeiro:
 * - Tipo de Transação (Receita, Despesa, Transferência)
 * - Categoria (Pessoal, Infraestrutura, Marketing, Software)
 * - Método de Pagamento (Cartão, Boleto, PIX, Transferência)
 * - Centro de Custo
 *
 * E-commerce:
 * - Categoria de Produto
 * - Canal de Vendas (Online, Loja Física, Marketplace)
 * - Método de Envio
 * - Faixa de Preço
 *
 * Formulários:
 * - Tipo de Formulário (Contato, Cadastro, Pesquisa)
 * - Status (Completo, Incompleto, Pendente)
 * - Origem do Preenchimento (Desktop, Mobile, Tablet)
 */
