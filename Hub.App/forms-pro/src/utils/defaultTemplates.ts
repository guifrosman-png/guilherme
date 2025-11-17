/**
 * 📝 TEMPLATES PADRÃO POR PROFISSÃO
 * Templates iniciais com perguntas base para cada área
 */

import { Template, PerguntaCustomizada, Profissao } from '../types/templates';
import { gerarIdTemplate, gerarIdPergunta, gerarIdOpcao } from './templateHelpers';

// ========== FUNÇÕES AUXILIARES ==========

import { FrequenciaPergunta } from '../types/templates';

const criarPerguntaTexto = (
  titulo: string,
  obrigatoria: boolean,
  ordem: number,
  frequencia: FrequenciaPergunta = 'sempre' // 🆕 Padrão: sempre
): PerguntaCustomizada => ({
  id: gerarIdPergunta(),
  tipo: 'texto',
  titulo,
  obrigatoria,
  frequencia, // 🆕
  ordem,
  dataCriacao: new Date().toISOString(),
  ultimaEdicao: new Date().toISOString()
});

const criarPerguntaSimNao = (
  titulo: string,
  obrigatoria: boolean,
  ordem: number,
  frequencia: FrequenciaPergunta = 'sempre' // 🆕 Padrão: sempre
): PerguntaCustomizada => ({
  id: gerarIdPergunta(),
  tipo: 'simNao',
  titulo,
  obrigatoria,
  frequencia, // 🆕
  ordem,
  dataCriacao: new Date().toISOString(),
  ultimaEdicao: new Date().toISOString()
});

const criarPerguntaMultipla = (
  titulo: string,
  opcoes: string[],
  obrigatoria: boolean,
  ordem: number,
  frequencia: FrequenciaPergunta = 'sempre' // 🆕 Padrão: sempre
): PerguntaCustomizada => ({
  id: gerarIdPergunta(),
  tipo: 'multiplaEscolha',
  titulo,
  obrigatoria,
  frequencia, // 🆕
  ordem,
  opcoes: opcoes.map((texto, index) => ({
    id: gerarIdOpcao(),
    texto,
    ordem: index
  })),
  dataCriacao: new Date().toISOString(),
  ultimaEdicao: new Date().toISOString()
});

// ========== TEMPLATES POR PROFISSÃO ==========

export const criarTemplateTatuagem = (): Template => {
  const perguntas: PerguntaCustomizada[] = [
    criarPerguntaTexto('Qual tatuagem você deseja fazer?', true, 0, 'sempre'),
    criarPerguntaTexto('Onde no corpo você quer tatuar?', true, 1, 'sempre'),
    criarPerguntaMultipla('Qual o tamanho aproximado?', ['Pequena (até 10cm)', 'Média (10-20cm)', 'Grande (20-30cm)', 'Extra Grande (acima de 30cm)'], true, 2, 'sempre'),
    criarPerguntaSimNao('É sua primeira tatuagem?', true, 3, 'primeira-vez'), // 🎯 Apenas na 1ª vez
    criarPerguntaSimNao('Você tem alergias a tintas ou metais?', true, 4, 'primeira-vez'), // 🎯 Apenas na 1ª vez
    criarPerguntaSimNao('Você tem diabetes?', true, 5, 'primeira-vez'), // 🎯 Apenas na 1ª vez
    criarPerguntaSimNao('Você está grávida ou amamentando?', true, 6, 'sempre'), // ⚠️ Pode mudar
    criarPerguntaTexto('Toma algum medicamento regularmente? Qual?', false, 7, 'sempre'), // ⚠️ Pode mudar
    criarPerguntaMultipla('Como sua pele costuma cicatrizar?', ['Rápida e sem problemas', 'Normal', 'Lenta', 'Queloides/Cicatrizes elevadas'], true, 8, 'primeira-vez') // 🎯 Apenas na 1ª vez
  ];

  return {
    id: gerarIdTemplate(),
    nome: 'Template Padrão - Tatuagem',
    descricao: 'Perguntas essenciais para anamnese de tatuagem',
    profissao: 'tatuagem',
    formato: 'quiz', // 🆕 Formato padrão: quiz (step by step)
    perguntas,
    ativo: true,
    padrao: true,
    dataCriacao: new Date().toISOString(),
    ultimaEdicao: new Date().toISOString(),
    totalPerguntas: perguntas.length
  };
};

export const criarTemplatePsicologia = (): Template => {
  const perguntas: PerguntaCustomizada[] = [
    criarPerguntaTexto('O que te trouxe aqui hoje?', true, 0),
    criarPerguntaMultipla('Como você descreveria seu estado emocional atual?', ['Ansioso(a)', 'Deprimido(a)', 'Estressado(a)', 'Confuso(a)', 'Bem, mas buscando autoconhecimento'], true, 1),
    criarPerguntaSimNao('Já fez terapia antes?', true, 2),
    criarPerguntaSimNao('Está fazendo uso de medicação psiquiátrica?', true, 3),
    criarPerguntaTexto('Se sim, qual medicação e desde quando?', false, 4),
    criarPerguntaMultipla('Como você avalia seu sono?', ['Ótimo', 'Bom', 'Irregular', 'Ruim'], true, 5),
    criarPerguntaMultipla('Como está seu apetite?', ['Normal', 'Aumentado', 'Diminuído', 'Sem apetite'], true, 6),
    criarPerguntaSimNao('Tem histórico de transtornos mentais na família?', false, 7),
    criarPerguntaTexto('Quais são suas principais expectativas com a terapia?', true, 8)
  ];

  return {
    id: gerarIdTemplate(),
    nome: 'Template Padrão - Psicologia',
    descricao: 'Perguntas para primeira sessão de psicoterapia',
    profissao: 'psicologia',
    formato: 'quiz', // 🆕 Formato padrão: quiz
    perguntas,
    ativo: true,
    padrao: true,
    dataCriacao: new Date().toISOString(),
    ultimaEdicao: new Date().toISOString(),
    totalPerguntas: perguntas.length
  };
};

export const criarTemplateNutricao = (): Template => {
  const perguntas: PerguntaCustomizada[] = [
    criarPerguntaTexto('Qual é seu objetivo principal?', true, 0),
    criarPerguntaMultipla('Quantas refeições você faz por dia?', ['1-2 refeições', '3 refeições', '4-5 refeições', 'Mais de 5 refeições'], true, 1),
    criarPerguntaSimNao('Você tem alergias ou intolerâncias alimentares?', true, 2),
    criarPerguntaTexto('Se sim, quais?', false, 3),
    criarPerguntaMultipla('Você pratica atividade física?', ['Não pratico', '1-2x por semana', '3-4x por semana', '5x ou mais por semana'], true, 4),
    criarPerguntaSimNao('Tem alguma doença crônica? (diabetes, hipertensão, etc)', true, 5),
    criarPerguntaMultipla('Como você avalia seu consumo de água?', ['Menos de 1L/dia', '1-2L/dia', '2-3L/dia', 'Mais de 3L/dia'], true, 6),
    criarPerguntaSimNao('Você consome bebidas alcoólicas?', true, 7),
    criarPerguntaTexto('Tem alguma restrição alimentar por motivos religiosos ou éticos?', false, 8)
  ];

  return {
    id: gerarIdTemplate(),
    nome: 'Template Padrão - Nutrição',
    descricao: 'Avaliação nutricional inicial completa',
    profissao: 'nutricao',
    formato: 'quiz', // 🆕 Formato padrão: quiz
    perguntas,
    ativo: true,
    padrao: true,
    dataCriacao: new Date().toISOString(),
    ultimaEdicao: new Date().toISOString(),
    totalPerguntas: perguntas.length
  };
};

export const criarTemplateFisioterapia = (): Template => {
  const perguntas: PerguntaCustomizada[] = [
    criarPerguntaTexto('Qual a principal queixa ou motivo da consulta?', true, 0),
    criarPerguntaTexto('Onde exatamente está localizada a dor/desconforto?', true, 1),
    criarPerguntaMultipla('Quando começou o problema?', ['Há menos de 1 semana', '1-4 semanas', '1-6 meses', 'Mais de 6 meses'], true, 2),
    criarPerguntaMultipla('Como você classifica a intensidade da dor (0-10)?', ['0-2 (leve)', '3-5 (moderada)', '6-8 (forte)', '9-10 (insuportável)'], true, 3),
    criarPerguntaSimNao('Já fez fisioterapia para este problema antes?', true, 4),
    criarPerguntaSimNao('Já realizou exames de imagem? (Raio-X, Ressonância, etc)', true, 5),
    criarPerguntaTexto('Teve alguma cirurgia recente ou antiga?', false, 6),
    criarPerguntaMultipla('Você pratica atividade física regular?', ['Sedentário(a)', '1-2x por semana', '3-4x por semana', 'Atleta/Profissional'], true, 7),
    criarPerguntaTexto('Possui alguma doença crônica ou usa medicação contínua?', false, 8)
  ];

  return {
    id: gerarIdTemplate(),
    nome: 'Template Padrão - Fisioterapia',
    descricao: 'Avaliação fisioterapêutica inicial',
    profissao: 'fisioterapia',
    formato: 'quiz', // 🆕 Formato padrão: quiz
    perguntas,
    ativo: true,
    padrao: true,
    dataCriacao: new Date().toISOString(),
    ultimaEdicao: new Date().toISOString(),
    totalPerguntas: perguntas.length
  };
};

export const criarTemplateEstetica = (): Template => {
  const perguntas: PerguntaCustomizada[] = [
    criarPerguntaTexto('Qual procedimento estético você deseja realizar?', true, 0),
    criarPerguntaMultipla('Qual seu tipo de pele?', ['Oleosa', 'Seca', 'Mista', 'Sensível', 'Normal'], true, 1),
    criarPerguntaSimNao('Você tem alergias a cosméticos ou produtos de beleza?', true, 2),
    criarPerguntaTexto('Se sim, quais?', false, 3),
    criarPerguntaMultipla('Com que frequência você se expõe ao sol?', ['Raramente', 'Ocasionalmente', 'Frequentemente', 'Diariamente'], true, 4),
    criarPerguntaSimNao('Você usa protetor solar diariamente?', true, 5),
    criarPerguntaSimNao('Já realizou procedimentos estéticos anteriormente?', true, 6),
    criarPerguntaTexto('Se sim, quais e quando?', false, 7),
    criarPerguntaSimNao('Você está grávida ou amamentando?', true, 8),
    criarPerguntaTexto('Qual sua expectativa com o procedimento?', true, 9)
  ];

  return {
    id: gerarIdTemplate(),
    nome: 'Template Padrão - Estética',
    descricao: 'Avaliação para procedimentos estéticos',
    profissao: 'estetica',
    formato: 'quiz', // 🆕 Formato padrão: quiz
    perguntas,
    ativo: true,
    padrao: true,
    dataCriacao: new Date().toISOString(),
    ultimaEdicao: new Date().toISOString(),
    totalPerguntas: perguntas.length
  };
};

export const criarTemplateConsultoria = (): Template => {
  const perguntas: PerguntaCustomizada[] = [
    criarPerguntaMultipla('Qual área de consultoria te interessa?', ['Negócios', 'Marketing', 'Finanças', 'RH', 'Tecnologia', 'Outro'], true, 0),
    criarPerguntaTexto('Qual é o principal desafio que você está enfrentando?', true, 1),
    criarPerguntaTexto('Qual seu objetivo com a consultoria?', true, 2),
    criarPerguntaMultipla('Qual o porte da sua empresa/projeto?', ['Pessoa Física', 'MEI', 'Pequena Empresa', 'Média Empresa', 'Grande Empresa'], true, 3),
    criarPerguntaMultipla('Qual o prazo esperado para ver resultados?', ['Imediato (1-3 meses)', 'Curto prazo (3-6 meses)', 'Médio prazo (6-12 meses)', 'Longo prazo (acima de 1 ano)'], true, 4),
    criarPerguntaMultipla('Qual sua faixa de investimento para consultoria?', ['Até R$ 5.000', 'R$ 5.000 - R$ 15.000', 'R$ 15.000 - R$ 50.000', 'Acima de R$ 50.000'], true, 5),
    criarPerguntaSimNao('Já contratou serviços de consultoria antes?', true, 6),
    criarPerguntaTexto('Se sim, como foi a experiência?', false, 7),
    criarPerguntaTexto('Observações ou informações adicionais', false, 8)
  ];

  return {
    id: gerarIdTemplate(),
    nome: 'Template Padrão - Consultoria',
    descricao: 'Formulário de qualificação para consultoria',
    profissao: 'consultoria',
    formato: 'quiz', // 🆕 Formato padrão: quiz
    perguntas,
    ativo: true,
    padrao: true,
    dataCriacao: new Date().toISOString(),
    ultimaEdicao: new Date().toISOString(),
    totalPerguntas: perguntas.length
  };
};

// ========== INICIALIZAÇÃO ==========

export const inicializarTemplatesPadrao = (): void => {
  const templatesExistentes = localStorage.getItem('anamneseTemplates');

  // Se já existem templates, não sobrescrever
  if (templatesExistentes && JSON.parse(templatesExistentes).length > 0) {
    console.log('✅ Templates já inicializados');
    return;
  }

  console.log('🎨 Criando templates padrão para todas as profissões...');

  const templatesPadrao: Template[] = [
    criarTemplateTatuagem(),
    criarTemplatePsicologia(),
    criarTemplateNutricao(),
    criarTemplateFisioterapia(),
    criarTemplateEstetica(),
    criarTemplateConsultoria()
  ];

  localStorage.setItem('anamneseTemplates', JSON.stringify(templatesPadrao));
  console.log('✅ Templates padrão criados com sucesso!');

  window.dispatchEvent(new Event('templatesUpdated'));
};
