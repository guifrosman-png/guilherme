/**
 * 🛠️ HELPERS PARA GERENCIAMENTO DE TEMPLATES
 */

import { Template, PerguntaCustomizada, TipoPergunta } from '../types/templates';
import { Profissao } from '../theme';
import { criarGraficoParaPergunta, adicionarGrafico, removerGrafico } from './graficoHelpers';

const STORAGE_KEY = 'anamneseTemplates';

// ========== CRUD DE TEMPLATES ==========

export const getTemplates = (): Template[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const getTemplatesPorProfissao = (profissao: Profissao): Template[] => {
  return getTemplates().filter(t => t.profissao === profissao);
};

export const getTemplateAtivo = (profissao: Profissao): Template | null => {
  const templates = getTemplatesPorProfissao(profissao);
  return templates.find(t => t.ativo) || null;
};

export const getTemplateById = (id: string): Template | null => {
  const templates = getTemplates();
  return templates.find(t => t.id === id) || null;
};

export const salvarTemplate = (template: Template): void => {
  const templates = getTemplates();
  const index = templates.findIndex(t => t.id === template.id);

  if (index >= 0) {
    // Atualizar existente
    templates[index] = {
      ...template,
      ultimaEdicao: new Date().toISOString(),
      totalPerguntas: template.perguntas.length
    };
  } else {
    // Criar novo
    templates.push({
      ...template,
      dataCriacao: new Date().toISOString(),
      ultimaEdicao: new Date().toISOString(),
      totalPerguntas: template.perguntas.length
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  window.dispatchEvent(new Event('templatesUpdated'));
};

export const excluirTemplate = (id: string): boolean => {
  const templates = getTemplates();
  const template = templates.find(t => t.id === id);

  // Não pode excluir template padrão
  if (template?.padrao) {
    return false;
  }

  const novosTemplates = templates.filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(novosTemplates));
  window.dispatchEvent(new Event('templatesUpdated'));
  return true;
};

export const ativarTemplate = (id: string): void => {
  const templates = getTemplates();
  const template = templates.find(t => t.id === id);

  if (!template) return;

  // Desativar todos da mesma profissão
  templates.forEach(t => {
    if (t.profissao === template.profissao) {
      t.ativo = false;
    }
  });

  // Ativar o selecionado
  template.ativo = true;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  window.dispatchEvent(new Event('templatesUpdated'));
};

export const duplicarTemplate = (id: string, novoNome: string): Template => {
  const template = getTemplateById(id);
  if (!template) throw new Error('Template não encontrado');

  const novoTemplate: Template = {
    ...template,
    id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nome: novoNome,
    ativo: false,
    padrao: false,
    dataCriacao: new Date().toISOString(),
    ultimaEdicao: new Date().toISOString(),
    perguntas: template.perguntas.map(p => ({
      ...p,
      id: `pergunta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }))
  };

  salvarTemplate(novoTemplate);
  return novoTemplate;
};

// ========== CRUD DE PERGUNTAS ==========

export const adicionarPergunta = (
  templateId: string,
  pergunta: Omit<PerguntaCustomizada, 'id' | 'dataCriacao' | 'ultimaEdicao' | 'ordem'>
): PerguntaCustomizada => {
  console.log('🎯 adicionarPergunta chamada!', { templateId, pergunta });

  const template = getTemplateById(templateId);
  if (!template) throw new Error('Template não encontrado');

  const novaPergunta: PerguntaCustomizada = {
    ...pergunta,
    frequencia: pergunta.frequencia || 'sempre', // 🆕 Padrão: sempre
    id: `pergunta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ordem: template.perguntas.length,
    dataCriacao: new Date().toISOString(),
    ultimaEdicao: new Date().toISOString()
  };

  template.perguntas.push(novaPergunta);
  salvarTemplate(template);

  // 🎨 CRIAR GRÁFICO AUTOMATICAMENTE PARA A NOVA PERGUNTA
  try {
    const novoGrafico = criarGraficoParaPergunta(novaPergunta, template.profissao);
    adicionarGrafico(novoGrafico);
    console.log(`✅ Gráfico criado automaticamente para: ${novaPergunta.titulo} (profissão: ${template.profissao})`);
  } catch (error) {
    console.error('❌ Erro ao criar gráfico para pergunta:', error);
  }

  return novaPergunta;
};

export const editarPergunta = (
  templateId: string,
  perguntaId: string,
  dados: Partial<PerguntaCustomizada>
): void => {
  const template = getTemplateById(templateId);
  if (!template) throw new Error('Template não encontrado');

  const index = template.perguntas.findIndex(p => p.id === perguntaId);
  if (index < 0) throw new Error('Pergunta não encontrada');

  template.perguntas[index] = {
    ...template.perguntas[index],
    ...dados,
    ultimaEdicao: new Date().toISOString()
  };

  salvarTemplate(template);
};

export const excluirPergunta = (templateId: string, perguntaId: string): void => {
  const template = getTemplateById(templateId);
  if (!template) throw new Error('Template não encontrado');

  template.perguntas = template.perguntas.filter(p => p.id !== perguntaId);

  // Reordenar
  template.perguntas.forEach((p, index) => {
    p.ordem = index;
  });

  salvarTemplate(template);

  // 🗑️ REMOVER GRÁFICO ASSOCIADO À PERGUNTA
  try {
    const graficoId = `grafico-${perguntaId}`;
    removerGrafico(graficoId);
    console.log(`✅ Gráfico removido para pergunta: ${perguntaId}`);
  } catch (error) {
    console.error('❌ Erro ao remover gráfico:', error);
  }
};

export const reordenarPerguntas = (
  templateId: string,
  perguntaIds: string[]
): void => {
  const template = getTemplateById(templateId);
  if (!template) throw new Error('Template não encontrado');

  const perguntasOrdenadas = perguntaIds
    .map(id => template.perguntas.find(p => p.id === id))
    .filter(Boolean) as PerguntaCustomizada[];

  perguntasOrdenadas.forEach((p, index) => {
    p.ordem = index;
  });

  template.perguntas = perguntasOrdenadas;
  salvarTemplate(template);
};

// ========== GERAÇÃO DE ID ÚNICO ==========

export const gerarIdTemplate = (): string => {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const gerarIdPergunta = (): string => {
  return `pergunta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const gerarIdOpcao = (): string => {
  return `opcao_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
