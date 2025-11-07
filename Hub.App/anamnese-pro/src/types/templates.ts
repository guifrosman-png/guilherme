/**
 * 📝 TIPOS DO SISTEMA DE TEMPLATES
 * Sistema completo de templates customizáveis para anamneses
 */

import { Profissao } from '../theme';

// ========== TIPOS DE PERGUNTA ==========

export type TipoPergunta = 'texto' | 'simNao' | 'multiplaEscolha';

// 🆕 Frequência da pergunta
export type FrequenciaPergunta = 'sempre' | 'primeira-vez';

// 🆕 Formato de apresentação do template
export type FormatoTemplate = 'ficha' | 'quiz';

export interface OpcaoResposta {
  id: string;
  texto: string;
  ordem: number;
}

export interface PerguntaCustomizada {
  id: string;
  tipo: TipoPergunta;
  titulo: string;
  obrigatoria: boolean;
  frequencia: FrequenciaPergunta; // 🆕 Nova propriedade
  ordem: number;

  // Apenas para tipo 'multiplaEscolha'
  opcoes?: OpcaoResposta[];

  // Metadados
  dataCriacao: string;
  ultimaEdicao: string;
}

// ========== TEMPLATE ==========

export interface Template {
  id: string;
  nome: string;
  descricao?: string;
  profissao: Profissao;
  formato: FormatoTemplate; // 🆕 Como apresentar: ficha ou quiz

  // Perguntas do template
  perguntas: PerguntaCustomizada[];

  // Status
  ativo: boolean;        // Se é o template ativo para esta profissão
  padrao: boolean;       // Se é o template padrão (não pode excluir)

  // Metadados
  dataCriacao: string;
  ultimaEdicao: string;
  totalPerguntas: number;
}

// ========== RESPOSTA DO CLIENTE ==========

export interface RespostaCliente {
  perguntaId: string;
  resposta: string | boolean | string[]; // string para texto/multipla, boolean para sim/nao
  dataResposta: string;
}

export interface AnamneseCustomizada {
  id: string;
  templateId: string;
  clienteId: number;
  respostas: RespostaCliente[];
  dataCriacao: string;
  status: 'concluida' | 'pendente' | 'expirada';
}

// ========== HELPERS ==========

export const TIPOS_PERGUNTA_LABELS: Record<TipoPergunta, string> = {
  texto: 'Texto Livre',
  simNao: 'Sim ou Não',
  multiplaEscolha: 'Múltipla Escolha'
};

export const TIPOS_PERGUNTA_ICONS: Record<TipoPergunta, string> = {
  texto: '📝',
  simNao: '✓✗',
  multiplaEscolha: '🔘'
};

// 🆕 Labels e descrições para frequência
export const FREQUENCIA_LABELS: Record<FrequenciaPergunta, string> = {
  'sempre': 'Sempre',
  'primeira-vez': 'Apenas 1ª vez'
};

export const FREQUENCIA_DESCRICOES: Record<FrequenciaPergunta, string> = {
  'sempre': 'Pergunta será feita em todas as anamneses',
  'primeira-vez': 'Pergunta apenas na primeira anamnese do cliente'
};

// 🆕 Labels e descrições para formato
export const FORMATO_LABELS: Record<FormatoTemplate, string> = {
  'ficha': '📋 Ficha',
  'quiz': '🎯 Quiz'
};

export const FORMATO_DESCRICOES: Record<FormatoTemplate, string> = {
  'ficha': 'Todas as perguntas aparecem juntas (formulário tradicional)',
  'quiz': 'Perguntas aparecem uma por vez (experiência interativa)'
};

export const FORMATO_ICONS: Record<FormatoTemplate, string> = {
  'ficha': '📋',
  'quiz': '🎯'
};
