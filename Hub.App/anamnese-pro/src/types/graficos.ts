/**
 * 📊 TIPOS DO SISTEMA DE GRÁFICOS DINÂMICOS
 * Define as regras de como os gráficos funcionam no sistema
 */

// ========== TIPOS DE GRÁFICO ==========

/**
 * Tipos de gráficos disponíveis no sistema
 * - barras: Gráfico de barras vertical (ex: clientes por mês)
 * - linha: Gráfico de linha (ex: evolução no tempo)
 * - pizza: Gráfico de pizza (ex: sim/não, masculino/feminino)
 * - donut: Gráfico de rosquinha (ex: múltiplas opções)
 * - barrasTop5: Gráfico de barras mostrando top 5 respostas (ex: locais mais tatuados)
 * - galeria: Galeria de imagens (ex: arquivos enviados pelos clientes)
 */
export type TipoGrafico = 'barras' | 'linha' | 'pizza' | 'donut' | 'barrasTop5' | 'galeria';

/**
 * Categoria do gráfico
 * - padrao: Gráfico que vem por padrão no sistema (clientes/mês, anamneses/mês, etc)
 * - customizado: Gráfico criado automaticamente a partir de uma pergunta do template
 */
export type CategoriaGrafico = 'padrao' | 'customizado';

// ========== CONFIGURAÇÃO DO GRÁFICO ==========

/**
 * Configuração completa de um gráfico
 * Esta interface define TUDO que um gráfico precisa ter
 */
export interface GraficoConfig {
  // Identificação
  id: string;                           // ID único do gráfico (ex: "clientes-mes", "grafico-chocolate")
  categoria: CategoriaGrafico;          // Se é padrão ou customizado

  // Vinculação com pergunta (apenas para customizados)
  perguntaId?: string;                  // ID da pergunta que gerou este gráfico (opcional)
  tipoPergunta?: 'texto' | 'paragrafo' | 'simNao' | 'multiplaEscolha' | 'caixasSelecao' | 'escalaLinear' | 'classificacao' | 'data' | 'hora' | 'arquivo'; // Tipo da pergunta original

  // Informações de exibição
  titulo: string;                       // Título do gráfico (ex: "Preferência por Chocolate")
  descricao: string;                    // Descrição que aparece abaixo do título
  tipoGrafico: TipoGrafico;            // Qual tipo de gráfico usar

  // Controle de visibilidade
  visivel: boolean;                     // true = aparece no dashboard, false = está oculto

  // Ordenação
  ordem: number;                        // Ordem de exibição (menor = aparece primeiro)

  // Metadados
  dataCriacao: string;                  // Quando o gráfico foi criado
  dataUltimaEdicao?: string;           // Última vez que foi editado (opcional)
}

// ========== DADOS PROCESSADOS PARA OS GRÁFICOS ==========

/**
 * Estrutura de dados para gráficos de BARRAS e LINHA
 * Exemplo: { mes: "Jan", valor: 10 }
 */
export interface DadosGraficoSimples {
  nome: string;          // Nome da categoria (ex: "Jan", "Fev")
  valor: number;         // Valor numérico (ex: 10 clientes)
}

/**
 * Estrutura de dados para gráficos de PIZZA e DONUT
 * Exemplo: { nome: "Sim", valor: 15, percentual: "75%" }
 */
export interface DadosGraficoPizza {
  nome: string;          // Nome da categoria (ex: "Sim", "Não")
  valor: number;         // Valor numérico (ex: 15 pessoas)
  percentual: string;    // Percentual formatado (ex: "75.0%")
}

// ========== CONFIGURAÇÕES PADRÃO ==========

/**
 * IDs dos gráficos padrão do sistema
 * Estes são os gráficos que sempre existem desde o início
 */
export const GRAFICOS_PADRAO_IDS = {
  CLIENTES_MES: 'clientes-mes',
  ANAMNESES_MES: 'anamneses-mes',
  DISTRIBUICAO_SEXO: 'distribuicao-sexo',
  ORIGEM_CLIENTES: 'origem-clientes',
  FAIXA_ETARIA: 'faixa-etaria', // Apenas para psicologia
} as const;

/**
 * Mapeamento de tipo de pergunta para tipo de gráfico
 * Define qual gráfico será criado automaticamente para cada tipo de pergunta
 * NOTA: 'paragrafo' não gera gráfico (respostas longas são muito variadas para agrupar)
 */
export const MAPA_PERGUNTA_GRAFICO: Record<'texto' | 'simNao' | 'multiplaEscolha' | 'caixasSelecao' | 'escalaLinear' | 'classificacao' | 'data' | 'hora' | 'arquivo', TipoGrafico> = {
  texto: 'barrasTop5',           // Pergunta aberta → Top 5 respostas
  simNao: 'pizza',               // Sim/Não → Gráfico de pizza
  multiplaEscolha: 'donut',      // Múltipla escolha → Gráfico de rosquinha
  caixasSelecao: 'barras',       // Caixas de seleção → Barras horizontais (múltiplas seleções)
  escalaLinear: 'barras',        // Escala linear → Barras verticais (distribuição de valores)
  classificacao: 'barras',       // Classificação → Barras verticais (distribuição de estrelas)
  data: 'linha',                 // Data → Linha do tempo (evolução por mês)
  hora: 'barras',                // Hora → Barras por período do dia (manhã, tarde, noite, madrugada)
  arquivo: 'galeria',            // Arquivo → Galeria de imagens/arquivos enviados
};

// ========== HELPERS ==========

/**
 * Labels amigáveis para os tipos de gráfico
 */
export const TIPO_GRAFICO_LABELS: Record<TipoGrafico, string> = {
  barras: 'Gráfico de Barras',
  linha: 'Gráfico de Linha',
  pizza: 'Gráfico de Pizza',
  donut: 'Gráfico de Rosquinha',
  barrasTop5: 'Top 5 Respostas',
  galeria: 'Galeria de Arquivos',
};

/**
 * Ícones para cada tipo de gráfico
 */
export const TIPO_GRAFICO_ICONS: Record<TipoGrafico, string> = {
  barras: '📊',
  linha: '📈',
  pizza: '🍰',
  donut: '🍩',
  barrasTop5: '🏆',
  galeria: '🖼️',
};
