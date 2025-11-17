/**
 * 🛠️ FUNÇÕES AUXILIARES PARA GRÁFICOS DINÂMICOS
 * Contém todas as funções que fazem o sistema de gráficos funcionar
 */

import { GraficoConfig, MAPA_PERGUNTA_GRAFICO, DadosGraficoSimples, DadosGraficoPizza, GRAFICOS_PADRAO_IDS } from '../types/graficos';
import { PerguntaCustomizada, TipoPergunta } from '../types/templates';

// ========== CONSTANTE DE ARMAZENAMENTO ==========

const STORAGE_KEY = 'graficosConfig';

// ========== 1. NORMALIZAÇÃO DE TEXTO ==========

/**
 * Normaliza um texto para comparação
 * Remove acentos, espaços extras e coloca tudo em minúsculo
 *
 * Exemplo:
 * "  BrAçO  " → "braco"
 * "braço"    → "braco"
 * "BRAÇO"    → "braco"
 */
export function normalizarTexto(texto: string): string {
  if (!texto) return '';

  return texto
    .toLowerCase()                          // Transforma tudo em minúsculo
    .normalize('NFD')                       // Separa letras de acentos
    .replace(/[\u0300-\u036f]/g, '')       // Remove os acentos
    .trim()                                 // Remove espaços do início e fim
    .replace(/\s+/g, ' ');                 // Remove espaços extras no meio
}

/**
 * Capitaliza um texto (primeira letra maiúscula)
 *
 * Exemplo:
 * "braço" → "Braço"
 * "BRAÇO" → "Braço"
 */
export function capitalizarTexto(texto: string): string {
  if (!texto) return '';

  return texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
}

/**
 * Agrupa textos similares
 * Pega uma lista de respostas e agrupa as que são parecidas
 *
 * Exemplo:
 * ["Braço", "braço", "BRAÇO", "Perna"]
 * → { "Braço": 3, "Perna": 1 }
 */
export function agruparTextosSimilares(textos: string[]): Record<string, number> {
  const agrupamento: Record<string, { normalizado: string; original: string; count: number }> = {};

  textos.forEach(texto => {
    if (!texto) return;

    const normalizado = normalizarTexto(texto);

    if (!agrupamento[normalizado]) {
      agrupamento[normalizado] = {
        normalizado,
        original: capitalizarTexto(texto), // Usa a primeira ocorrência capitalizada
        count: 0
      };
    }

    agrupamento[normalizado].count++;
  });

  // Converter para formato simples: { "Braço": 3, "Perna": 1 }
  const resultado: Record<string, number> = {};
  Object.values(agrupamento).forEach(item => {
    resultado[item.original] = item.count;
  });

  return resultado;
}

// ========== 2. GERENCIAMENTO DE CONFIGURAÇÃO ==========

/**
 * Carrega todas as configurações de gráficos do localStorage
 * Se não existir, retorna array vazio
 */
export function carregarGraficosConfig(): GraficoConfig[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar configurações de gráficos:', error);
    return [];
  }
}

/**
 * Carrega gráficos filtrados pela profissão atual
 * Retorna apenas gráficos padrão + gráficos customizados da profissão atual
 */
export function carregarGraficosPorProfissao(profissao: string): GraficoConfig[] {
  const todosGraficos = carregarGraficosConfig();

  return todosGraficos.filter(grafico => {
    // Gráficos padrão aparecem em todas as profissões
    if (grafico.categoria === 'padrao') {
      return true;
    }

    // Gráficos customizados só aparecem na profissão correspondente
    if (grafico.categoria === 'customizado') {
      return grafico.profissao === profissao;
    }

    return false;
  });
}

/**
 * Salva configurações de gráficos no localStorage
 */
export function salvarGraficosConfig(configs: GraficoConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (error) {
    console.error('Erro ao salvar configurações de gráficos:', error);
  }
}

/**
 * Busca uma configuração específica por ID
 */
export function buscarGraficoConfig(id: string): GraficoConfig | null {
  const configs = carregarGraficosConfig();
  return configs.find(c => c.id === id) || null;
}

/**
 * Atualiza visibilidade de um gráfico (mostrar/ocultar)
 */
export function toggleVisibilidadeGrafico(id: string): void {
  const configs = carregarGraficosConfig();
  const index = configs.findIndex(c => c.id === id);

  if (index !== -1) {
    configs[index].visivel = !configs[index].visivel;
    configs[index].dataUltimaEdicao = new Date().toISOString();
    salvarGraficosConfig(configs);
  }
}

// ========== 3. INICIALIZAÇÃO DOS GRÁFICOS PADRÃO ==========

/**
 * Cria as configurações dos gráficos padrão do sistema
 * Estes gráficos sempre existem desde o início
 */
export function inicializarGraficosPadrao(): void {
  const configs = carregarGraficosConfig();

  // Se já tem gráficos, não precisa inicializar
  if (configs.length > 0) return;

  const graficosPadrao: GraficoConfig[] = [
    {
      id: GRAFICOS_PADRAO_IDS.CLIENTES_MES,
      categoria: 'padrao',
      titulo: 'Clientes por Mês',
      descricao: 'Novos clientes cadastrados em cada mês',
      tipoGrafico: 'barras',
      visivel: true,
      ordem: 1,
      dataCriacao: new Date().toISOString(),
    },
    {
      id: GRAFICOS_PADRAO_IDS.ANAMNESES_MES,
      categoria: 'padrao',
      titulo: 'Anamneses por Mês',
      descricao: 'Quantidade de anamneses realizadas em cada mês',
      tipoGrafico: 'linha',
      visivel: true,
      ordem: 2,
      dataCriacao: new Date().toISOString(),
    },
    {
      id: GRAFICOS_PADRAO_IDS.DISTRIBUICAO_SEXO,
      categoria: 'padrao',
      titulo: 'Distribuição por Sexo',
      descricao: 'Percentual de clientes por sexo',
      tipoGrafico: 'pizza',
      visivel: true,
      ordem: 3,
      dataCriacao: new Date().toISOString(),
    },
    {
      id: GRAFICOS_PADRAO_IDS.ORIGEM_CLIENTES,
      categoria: 'padrao',
      titulo: 'Origem dos Clientes',
      descricao: 'Como seus clientes conheceram você',
      tipoGrafico: 'donut',
      visivel: true,
      ordem: 4,
      dataCriacao: new Date().toISOString(),
    },
  ];

  salvarGraficosConfig(graficosPadrao);
}

// ========== 4. CRIAÇÃO AUTOMÁTICA DE GRÁFICOS ==========

/**
 * Cria automaticamente uma configuração de gráfico para uma pergunta customizada
 *
 * Exemplo:
 * Pergunta: "Gosta de chocolate?" (simNao)
 * → Cria gráfico de pizza automaticamente
 */
export function criarGraficoParaPergunta(pergunta: PerguntaCustomizada, profissao?: string): GraficoConfig {
  const tipoGrafico = MAPA_PERGUNTA_GRAFICO[pergunta.tipo];
  const configs = carregarGraficosConfig();
  const ultimaOrdem = configs.length > 0 ? Math.max(...configs.map(c => c.ordem)) : 0;

  const novoGrafico: GraficoConfig = {
    id: `grafico-${pergunta.id}`,
    categoria: 'customizado',
    profissao: profissao, // Salvar profissão para filtrar depois
    perguntaId: pergunta.id,
    tipoPergunta: pergunta.tipo,
    titulo: pergunta.titulo,
    descricao: obterDescricaoAutomatica(pergunta.tipo),
    tipoGrafico: tipoGrafico,
    visivel: true,
    ordem: ultimaOrdem + 1,
    dataCriacao: new Date().toISOString(),
  };

  return novoGrafico;
}

/**
 * Gera descrição automática baseada no tipo de pergunta
 */
function obterDescricaoAutomatica(tipo: TipoPergunta): string {
  switch (tipo) {
    case 'simNao':
      return 'Distribuição de respostas Sim/Não';
    case 'multiplaEscolha':
      return 'Distribuição das opções escolhidas';
    case 'caixasSelecao':
      return 'Frequência de seleção de cada opção';
    case 'escalaLinear':
      return 'Distribuição de valores na escala';
    case 'classificacao':
      return 'Distribuição das avaliações';
    case 'data':
      return 'Evolução ao longo do tempo';
    case 'texto':
      return 'Top 5 respostas mais frequentes';
    case 'paragrafo':
      return 'Top 5 respostas mais frequentes';
    default:
      return 'Análise das respostas';
  }
}

/**
 * Adiciona um novo gráfico às configurações
 */
export function adicionarGrafico(grafico: GraficoConfig): void {
  const configs = carregarGraficosConfig();

  // Verifica se já existe
  const existe = configs.some(c => c.id === grafico.id);
  if (existe) {
    console.warn(`Gráfico ${grafico.id} já existe`);
    return;
  }

  configs.push(grafico);
  salvarGraficosConfig(configs);
}

/**
 * Remove um gráfico das configurações
 */
export function removerGrafico(id: string): void {
  const configs = carregarGraficosConfig();
  const novosConfigs = configs.filter(c => c.id !== id);
  salvarGraficosConfig(novosConfigs);
}

// ========== 5. PROCESSAMENTO DE DADOS ==========

/**
 * Processa respostas de texto e retorna os top 5 mais frequentes
 *
 * Exemplo:
 * Respostas: ["Braço", "braço", "Perna", "Braço", "Costas"]
 * → [
 *     { nome: "Braço", valor: 2 },
 *     { nome: "Perna", valor: 1 },
 *     { nome: "Costas", valor: 1 }
 *   ]
 */
export function processarRespostasTexto(respostas: string[]): DadosGraficoSimples[] {
  // Agrupar textos similares
  const agrupado = agruparTextosSimilares(respostas);

  // Converter para array e ordenar por valor (maior primeiro)
  const dados = Object.entries(agrupado)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor);

  // Retornar apenas top 5
  return dados.slice(0, 5);
}

/**
 * Processa respostas sim/não e retorna dados para gráfico de pizza
 *
 * Exemplo:
 * Respostas: [true, false, true, true]
 * → [
 *     { nome: "Sim", valor: 3, percentual: "75.0" },
 *     { nome: "Não", valor: 1, percentual: "25.0" }
 *   ]
 */
export function processarRespostasSimNao(respostas: boolean[]): DadosGraficoPizza[] {
  const sim = respostas.filter(r => r === true).length;
  const nao = respostas.filter(r => r === false).length;
  const total = respostas.length;

  if (total === 0) return [];

  return [
    {
      nome: 'Sim',
      valor: sim,
      percentual: ((sim / total) * 100).toFixed(1),
    },
    {
      nome: 'Não',
      valor: nao,
      percentual: ((nao / total) * 100).toFixed(1),
    },
  ].filter(item => item.valor > 0); // Remove valores zerados
}

/**
 * Processa respostas de múltipla escolha e retorna dados para gráfico donut
 *
 * Exemplo:
 * Respostas: ["Instagram", "Instagram", "Google", "Indicação"]
 * → [
 *     { nome: "Instagram", valor: 2, percentual: "50.0" },
 *     { nome: "Google", valor: 1, percentual: "25.0" },
 *     { nome: "Indicação", valor: 1, percentual: "25.0" }
 *   ]
 */
export function processarRespostasMultipla(respostas: string[]): DadosGraficoPizza[] {
  const agrupado = agruparTextosSimilares(respostas);
  const total = respostas.length;

  if (total === 0) return [];

  return Object.entries(agrupado)
    .map(([nome, valor]) => ({
      nome,
      valor,
      percentual: ((valor / total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.valor - a.valor); // Ordenar por valor
}

/**
 * Processa respostas de caixas de seleção e retorna dados para gráfico de barras
 *
 * Caixas de seleção permite múltiplas escolhas, então cada resposta é um array.
 * Precisamos "achatar" todos os arrays e contar quantas vezes cada opção aparece.
 *
 * Exemplo:
 * Respostas: [
 *   ["Dor", "Coceira"],
 *   ["Dor", "Vermelhidão"],
 *   ["Coceira"]
 * ]
 * → [
 *     { nome: "Dor", valor: 2 },
 *     { nome: "Coceira", valor: 2 },
 *     { nome: "Vermelhidão", valor: 1 }
 *   ]
 */
export function processarRespostasCaixasSelecao(respostas: (string | string[])[]): DadosGraficoSimples[] {
  // Achatar todos os arrays em um único array
  // Algumas respostas podem vir como string, outras como array
  const todasOpcoes: string[] = [];

  respostas.forEach(resposta => {
    if (Array.isArray(resposta)) {
      todasOpcoes.push(...resposta);
    } else if (typeof resposta === 'string') {
      // Pode ser uma string separada por vírgula
      const opcoes = resposta.split(',').map(o => o.trim()).filter(o => o);
      todasOpcoes.push(...opcoes);
    }
  });

  // Agrupar opções similares
  const agrupado = agruparTextosSimilares(todasOpcoes);

  if (todasOpcoes.length === 0) return [];

  // Converter para formato de gráfico e ordenar por valor
  return Object.entries(agrupado)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor);
}

/**
 * Processa respostas de escala linear e retorna dados para gráfico de barras
 *
 * Escala linear são valores numéricos (ex: 1-10).
 * Contamos quantas pessoas escolheram cada valor.
 *
 * Exemplo:
 * Respostas: [7, 8, 7, 9, 7, 10, 8]
 * → [
 *     { nome: "7", valor: 3 },
 *     { nome: "8", valor: 2 },
 *     { nome: "9", valor: 1 },
 *     { nome: "10", valor: 1 }
 *   ]
 */
export function processarRespostasEscalaLinear(respostas: (number | string)[]): DadosGraficoSimples[] {
  // Converter todas para números
  const valores = respostas
    .map(r => typeof r === 'number' ? r : parseInt(String(r)))
    .filter(v => !isNaN(v));

  if (valores.length === 0) return [];

  // Contar frequência de cada valor
  const frequencia: Record<number, number> = {};
  valores.forEach(valor => {
    frequencia[valor] = (frequencia[valor] || 0) + 1;
  });

  // Converter para formato de gráfico e ordenar por valor numérico
  return Object.entries(frequencia)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => parseInt(a.nome) - parseInt(b.nome));
}

/**
 * Processa respostas de classificação (estrelas/corações) e retorna dados para gráfico de barras
 *
 * Classificação funciona igual a escala linear, mas com visual de estrelas.
 * Contamos quantas pessoas deram cada quantidade de estrelas.
 *
 * Exemplo:
 * Respostas: [5, 4, 5, 5, 3, 4]
 * → [
 *     { nome: "3⭐", valor: 1 },
 *     { nome: "4⭐", valor: 2 },
 *     { nome: "5⭐", valor: 3 }
 *   ]
 */
export function processarRespostasClassificacao(respostas: (number | string)[]): DadosGraficoSimples[] {
  // Converter todas para números
  const valores = respostas
    .map(r => typeof r === 'number' ? r : parseInt(String(r)))
    .filter(v => !isNaN(v));

  if (valores.length === 0) return [];

  // Contar frequência de cada valor
  const frequencia: Record<number, number> = {};
  valores.forEach(valor => {
    frequencia[valor] = (frequencia[valor] || 0) + 1;
  });

  // Converter para formato de gráfico com estrelas e ordenar por valor numérico
  return Object.entries(frequencia)
    .map(([nome, valor]) => ({
      nome: `${nome}⭐`, // Adicionar estrelinha visual
      valor
    }))
    .sort((a, b) => parseInt(a.nome) - parseInt(b.nome)); // Ordenar por valor (1⭐, 2⭐, 3⭐...)
}

/**
 * Processa respostas de data e retorna dados para gráfico de linha
 *
 * Agrupa datas por mês/ano e conta quantas respostas em cada período.
 * Ideal para ver evolução ao longo do tempo.
 *
 * Exemplo:
 * Respostas: ["2025-01-15", "2025-01-20", "2025-02-10", "2025-02-15"]
 * → [
 *     { nome: "Jan/25", valor: 2 },
 *     { nome: "Fev/25", valor: 2 }
 *   ]
 */
export function processarRespostasData(respostas: string[]): DadosGraficoSimples[] {
  // Filtrar apenas datas válidas
  const datasValidas = respostas.filter(r => {
    if (!r) return false;
    const data = new Date(r);
    return !isNaN(data.getTime());
  });

  if (datasValidas.length === 0) return [];

  // Agrupar por mês/ano
  const porMes: Record<string, number> = {};
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  datasValidas.forEach(dataStr => {
    const data = new Date(dataStr);
    const mes = meses[data.getMonth()];
    const ano = data.getFullYear().toString().slice(-2); // Últimos 2 dígitos
    const chave = `${mes}/${ano}`;

    porMes[chave] = (porMes[chave] || 0) + 1;
  });

  // Converter para array e ordenar cronologicamente
  return Object.entries(porMes)
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => {
      // Extrair mês e ano para ordenar corretamente
      const [mesA, anoA] = a.nome.split('/');
      const [mesB, anoB] = b.nome.split('/');
      const mesIndexA = meses.indexOf(mesA);
      const mesIndexB = meses.indexOf(mesB);

      // Comparar ano primeiro, depois mês
      if (anoA !== anoB) return parseInt(anoA) - parseInt(anoB);
      return mesIndexA - mesIndexB;
    });
}

// ========================================
// 📊 PROCESSAMENTO: HORA (Períodos do dia)
// ========================================

/**
 * Processa respostas de HORA agrupando por período do dia
 *
 * @example
 * Input: ['09:30', '14:00', '19:45', '02:00', '15:30']
 * Output: [
 *   { nome: '🌅 Manhã (6h-12h)', valor: 1 },
 *   { nome: '☀️ Tarde (12h-18h)', valor: 2 },
 *   { nome: '🌙 Noite (18h-0h)', valor: 1 },
 *   { nome: '🌃 Madrugada (0h-6h)', valor: 1 }
 * ]
 */
export function processarRespostasHora(respostas: string[]): DadosGraficoSimples[] {
  // Filtrar apenas respostas válidas (formato HH:MM)
  const horasValidas = respostas.filter(r => {
    if (typeof r !== 'string') return false;
    return /^\d{2}:\d{2}$/.test(r.trim());
  });

  console.log('📊 Processando horas:', horasValidas);

  if (horasValidas.length === 0) {
    console.warn('⚠️ Nenhuma hora válida encontrada');
    return [];
  }

  // Contador de períodos
  const periodos = {
    'madrugada': 0, // 0h-6h
    'manha': 0,     // 6h-12h
    'tarde': 0,     // 12h-18h
    'noite': 0      // 18h-0h (24h)
  };

  // Agrupar por período
  horasValidas.forEach(horaStr => {
    const [hora] = horaStr.split(':').map(Number);

    if (hora >= 0 && hora < 6) {
      periodos.madrugada++;
    } else if (hora >= 6 && hora < 12) {
      periodos.manha++;
    } else if (hora >= 12 && hora < 18) {
      periodos.tarde++;
    } else {
      periodos.noite++;
    }
  });

  console.log('📊 Períodos agrupados:', periodos);

  // Retornar apenas períodos com valores > 0, na ordem do dia
  const resultado: DadosGraficoSimples[] = [];

  if (periodos.madrugada > 0) {
    resultado.push({ nome: '🌃 Madrugada (0h-6h)', valor: periodos.madrugada });
  }
  if (periodos.manha > 0) {
    resultado.push({ nome: '🌅 Manhã (6h-12h)', valor: periodos.manha });
  }
  if (periodos.tarde > 0) {
    resultado.push({ nome: '☀️ Tarde (12h-18h)', valor: periodos.tarde });
  }
  if (periodos.noite > 0) {
    resultado.push({ nome: '🌙 Noite (18h-0h)', valor: periodos.noite });
  }

  return resultado;
}

// ========================================
// 🖼️ PROCESSAMENTO: ARQUIVO (Galeria)
// ========================================

/**
 * Interface para dados da galeria
 */
export interface DadosGaleria {
  url: string;       // URL do arquivo (base64 ou URL)
  tipo: 'imagem' | 'arquivo';  // Se é imagem ou outro tipo de arquivo
}

/**
 * Processa respostas de ARQUIVO criando uma galeria
 *
 * @example
 * Input: ['data:image/png;base64,...', 'data:image/jpeg;base64,...']
 * Output: [
 *   { url: 'data:image/png;base64,...', tipo: 'imagem' },
 *   { url: 'data:image/jpeg;base64,...', tipo: 'imagem' }
 * ]
 */
export function processarRespostasArquivo(respostas: string[]): DadosGaleria[] {
  // Filtrar apenas respostas válidas (strings não vazias)
  const arquivosValidos = respostas.filter(r => {
    if (typeof r !== 'string') return false;
    return r.trim() !== '';
  });

  console.log('🖼️ Processando arquivos:', arquivosValidos.length);

  if (arquivosValidos.length === 0) {
    console.warn('⚠️ Nenhum arquivo válido encontrado');
    return [];
  }

  // Mapear para interface de galeria
  const galeria: DadosGaleria[] = arquivosValidos.map(url => {
    // Detectar se é imagem pelo prefixo data:image/
    const isImagem = url.startsWith('data:image/');

    return {
      url,
      tipo: isImagem ? 'imagem' : 'arquivo'
    };
  });

  console.log('🖼️ Galeria processada:', galeria.length, 'arquivos');

  return galeria;
}
