/**
 * 🎯 QUIZ CONTAINER DINÂMICO
 * Versão simplificada que usa perguntas do template ativo
 * Estrutura: Dados Pessoais → Perguntas do Template → Data → Termo
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ChevronLeft, ChevronRight, FileText, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { getTemplateAtivo } from '../../utils/templateHelpers';
import { Template, PerguntaCustomizada } from '../../types/templates';
import { useCoresProfissao } from '../../theme';

// Tipos
interface QuizData {
  // Dados Pessoais
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string; // Masculino, Feminino, Outro
  cpf: string;
  telefone: string;
  email: string;
  comoConheceu: string; // Como conheceu o serviço (indicação)
  indicadoPor?: string; // Nome de quem indicou (se aplicável)
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  endereco: string;

  // Data da Anamnese
  dataAnamnese: string;

  // Valor do Serviço
  valorServico?: number;

  // Termo
  aceitaTermo: boolean;
  assinatura: string;

  // Template Customizado
  respostasCustomizadas?: Record<string, string | boolean | string[]>;
  templateUsadoId?: string | null;
  perguntasSnapshot?: any[];
}

interface QuizContainerProps {
  mode: 'presencial' | 'remoto';
  onComplete: (data: QuizData) => void;
  onClose: () => void;
  initialData?: any;
  customQuestions?: any[]; // ✅ NOVO: Perguntas customizadas para modo remoto
}

export function QuizContainer({ mode, onComplete, onClose, initialData = null, customQuestions }: QuizContainerProps) {
  const cores = useCoresProfissao();

  // Template ativo
  const [templateAtivo, setTemplateAtivo] = useState<Template | null>(null);
  const [formatoTemplate, setFormatoTemplate] = useState<'quiz' | 'ficha'>('quiz'); // 🆕 Detectar formato
  const [respostasCustomizadas, setRespostasCustomizadas] = useState<Record<string, string | boolean | string[]>>({});
  const [profissao, setProfissao] = useState<string>('tatuagem');

  // Carregar template ativo
  useEffect(() => {
    const config = localStorage.getItem('anamneseConfig');
    const profissaoAtual = config ? JSON.parse(config).templateProfissao : 'tatuagem';
    setProfissao(profissaoAtual);

    // 🎯 Se recebeu perguntas customizadas (modo remoto), usar elas
    if (customQuestions && customQuestions.length > 0) {
      console.log('📝 Usando perguntas customizadas recebidas:', customQuestions);
      setTemplateAtivo({
        id: 'remote-custom',
        nome: 'Template Remoto',
        profissao: profissaoAtual,
        formato: 'quiz', // 🆕 Modo remoto sempre é quiz
        perguntas: customQuestions,
        ativo: true,
        padrao: false,
        dataCriacao: new Date().toISOString(),
        ultimaEdicao: new Date().toISOString(),
        totalPerguntas: customQuestions.length
      });
      setFormatoTemplate('quiz');
    } else {
      // Caso contrário, buscar template ativo normal
      const template = getTemplateAtivo(profissaoAtual);
      if (template) {
        console.log('📝 Usando template ativo:', template.nome, '| Formato:', template.formato);
        setTemplateAtivo(template);
        setFormatoTemplate(template.formato || 'quiz'); // 🆕 Detectar formato do template
      }
    }
  }, [customQuestions]);

  // Inicializar form data PRIMEIRO
  const dataHoje = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<Partial<QuizData>>(
    initialData
      ? { ...initialData, dataAnamnese: initialData.dataAnamnese || dataHoje }
      : { dataAnamnese: dataHoje, aceitaTermo: false, assinatura: '' }
  );

  // 🆕 FILTRAR PERGUNTAS BASEADO NA FREQUÊNCIA
  // Detectar se cliente já tem anamneses anteriores
  const [ehPrimeiraAnamnese, setEhPrimeiraAnamnese] = useState(true);

  useEffect(() => {
    // 🎯 CASO 1: Se veio com initialData, é SEMPRE cliente retornando (Nova Anamnese do card)
    if (initialData) {
      setEhPrimeiraAnamnese(false);
      console.log('🎯 Cliente retornando (initialData presente) - Perguntas de primeira vez serão PULADAS');
      return;
    }

    // 🎯 CASO 2: Se NÃO tem initialData, verificar pelo CPF
    if (formData?.cpf && formData.cpf.length >= 11) {
      // Buscar anamneses existentes no localStorage
      const anamnesesExistentes = JSON.parse(localStorage.getItem('anamneses') || '[]');
      const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');

      // Verificar se já existe cliente com esse CPF
      const clienteExiste = clientesExistentes.some((c: any) => c.cpf === formData.cpf);

      // OU verificar se já tem anamnese com esse CPF
      const temAnamneseAnterior = anamnesesExistentes.some((a: any) =>
        a.dadosCompletos?.cpf === formData.cpf && a.status === 'concluida'
      );

      const ehPrimeira = !clienteExiste && !temAnamneseAnterior;
      setEhPrimeiraAnamnese(ehPrimeira);
      console.log('🎯 Cliente primeira vez? (verificado por CPF):', ehPrimeira);
    }
  }, [formData?.cpf, initialData]);

  // Calcular total de steps dinamicamente
  const perguntasOriginais = templateAtivo?.perguntas || [];

  // 🆕 FILTRAR perguntas baseado na frequência
  const perguntasTemplate = perguntasOriginais.filter(p => {
    // Se não tem frequência definida, mostrar sempre (compatibilidade)
    if (!p.frequencia) return true;

    // Se é "sempre", mostrar sempre
    if (p.frequencia === 'sempre') return true;

    // Se é "primeira-vez", mostrar apenas se for primeira anamnese
    if (p.frequencia === 'primeira-vez') return ehPrimeiraAnamnese;

    return true;
  });

  const totalPerguntas = perguntasTemplate.length;
  // 🆕 Modo Ficha: menos steps (todas perguntas juntas no step 2)
  // Modo Quiz: cada pergunta é um step
  const totalSteps = formatoTemplate === 'ficha'
    ? 1 + 1 + 1 + 1 + 1 // Dados + TodasPerguntas + Indicação + Data + Termo = 5 steps
    : 1 + totalPerguntas + 1 + 1 + 1; // Dados + PerguntasIndividuais + Indicação + Data + Termo

  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [valorFormatado, setValorFormatado] = useState('0,00');

  // Progresso
  const progresso = (currentStep / totalSteps) * 100;

  // Helper para atualizar form data
  const updateFormData = (data: Partial<QuizData>) => {
    setFormData({ ...formData, ...data });
  };

  // 💰 Formatar valor como moeda (estilo banco)
  const handleValorChange = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');

    // Converte para número (em centavos)
    const numero = parseInt(apenasNumeros) || 0;

    // Converte centavos para reais
    const reais = numero / 100;

    // Formata como moeda brasileira
    const formatado = reais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    setValorFormatado(formatado);
    updateFormData({ valorServico: reais });
  };

  // 🔍 Buscar CEP automaticamente
  const buscarCep = async (cep: string) => {
    // Remover caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    // Validar formato (8 dígitos)
    if (cepLimpo.length !== 8) {
      return;
    }

    setBuscandoCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado');
        return;
      }

      // Preencher automaticamente
      updateFormData({
        cep: cepLimpo,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
        complemento: data.complemento || ''
      });
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao buscar CEP. Verifique sua conexão.');
    } finally {
      setBuscandoCep(false);
    }
  };

  // Validação por step
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    // Step 1: Dados Pessoais
    if (currentStep === 1) {
      console.log('🔍 Validando Step 1 - Dados do formulário:', formData);

      if (!formData.nomeCompleto) errors.nomeCompleto = 'Nome é obrigatório';
      if (!formData.dataNascimento) errors.dataNascimento = 'Data de nascimento é obrigatória';
      if (!formData.sexo) errors.sexo = 'Sexo é obrigatório';
      if (!formData.cpf) errors.cpf = 'CPF é obrigatório';
      if (!formData.telefone) errors.telefone = 'Telefone é obrigatório';
      if (!formData.email) errors.email = 'Email é obrigatório';
      if (!formData.cep) errors.cep = 'CEP é obrigatório';
      if (!formData.rua) errors.rua = 'Rua é obrigatória';
      if (!formData.numero) errors.numero = 'Número é obrigatório';
      if (!formData.bairro) errors.bairro = 'Bairro é obrigatório';
      if (!formData.cidade) errors.cidade = 'Cidade é obrigatória';
      if (!formData.estado) errors.estado = 'UF é obrigatória';

      // 🆕 VALIDAR CPF E EMAIL DUPLICADOS (apenas se NÃO veio do initialData)
      if (!initialData) {
        const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');

        // Verificar CPF duplicado
        if (formData.cpf) {
          const cpfJaExiste = clientesExistentes.some((c: any) => c.cpf === formData.cpf);
          if (cpfJaExiste) {
            errors.cpf = '⚠️ Esse CPF já está cadastrado! Use "Nova Anamnese" no card do cliente.';
          }
        }

        // Verificar Email duplicado
        if (formData.email) {
          const emailJaExiste = clientesExistentes.some((c: any) => c.email === formData.email);
          if (emailJaExiste) {
            errors.email = '⚠️ Esse email já está cadastrado! Use "Nova Anamnese" no card do cliente.';
          }
        }
      }

      console.log('🔍 Erros encontrados:', errors);

      // Validar idade mínima (18 anos) - APENAS PARA TATUAGEM
      if (formData.dataNascimento && profissao === 'tatuagem') {
        const hoje = new Date();
        const nascimento = new Date(formData.dataNascimento);
        const idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
          if (idade - 1 < 18) {
            errors.dataNascimento = 'Você precisa ter pelo menos 18 anos para fazer tatuagem';
          }
        } else if (idade < 18) {
          errors.dataNascimento = 'Você precisa ter pelo menos 18 anos para fazer tatuagem';
        }
      }

      // Gerar endereço completo
      if (formData.rua && formData.numero && formData.bairro && formData.cidade && formData.estado) {
        const enderecoCompleto = formData.complemento
          ? `${formData.rua}, ${formData.numero} - ${formData.complemento}, ${formData.bairro} - ${formData.cidade}/${formData.estado}`
          : `${formData.rua}, ${formData.numero}, ${formData.bairro} - ${formData.cidade}/${formData.estado}`;
        updateFormData({ endereco: enderecoCompleto });
      }
    }

    // 📋 MODO FICHA: Step 2 = Validar TODAS as perguntas obrigatórias
    if (formatoTemplate === 'ficha' && currentStep === 2) {
      perguntasTemplate.forEach(pergunta => {
        if (pergunta.obrigatoria) {
          const resposta = respostasCustomizadas[pergunta.id];

          // Validação específica por tipo de pergunta
          if (pergunta.tipo === 'texto') {
            if (!resposta || (resposta as string).trim() === '') {
              errors[pergunta.id] = 'Esta pergunta é obrigatória';
            }
          } else if (pergunta.tipo === 'simNao') {
            if (resposta === undefined || resposta === null) {
              errors[pergunta.id] = 'Por favor, selecione Sim ou Não';
            }
          } else if (pergunta.tipo === 'multiplaEscolha') {
            if (!resposta || resposta === '') {
              errors[pergunta.id] = 'Por favor, selecione uma opção';
            }
          }
        }
      });
    }

    // 🎯 MODO QUIZ: Steps 2 até N: Validar pergunta individual
    if (formatoTemplate === 'quiz' && currentStep >= 2 && currentStep <= (1 + totalPerguntas)) {
      const indexPergunta = currentStep - 2;
      const pergunta = perguntasTemplate[indexPergunta];

      if (pergunta && pergunta.obrigatoria) {
        const resposta = respostasCustomizadas[pergunta.id];

        // Validação específica por tipo de pergunta
        if (pergunta.tipo === 'simNao') {
          // Para Sim/Não, aceita true OU false (ambos são válidos)
          if (resposta !== true && resposta !== false) {
            errors[pergunta.id] = 'Esta pergunta é obrigatória';
          }
        } else if (pergunta.tipo === 'multiplaEscolha') {
          // Para múltipla escolha, verifica se tem resposta
          if (!resposta || (Array.isArray(resposta) && resposta.length === 0)) {
            errors[pergunta.id] = 'Esta pergunta é obrigatória';
          }
        } else {
          // Para texto livre, verifica se não está vazio
          if (!resposta || resposta === '') {
            errors[pergunta.id] = 'Esta pergunta é obrigatória';
          }
        }
      }
    }

    // Step N+1: Indicação
    const stepIndicacaoValidacao = formatoTemplate === 'ficha' ? 3 : (1 + totalPerguntas + 1);
    if (currentStep === stepIndicacaoValidacao) {
      if (!formData.comoConheceu) errors.comoConheceu = 'Selecione como conheceu';
      if (formData.comoConheceu === 'Indicação' && !formData.indicadoPor) {
        errors.indicadoPor = 'Informe quem indicou';
      }
    }

    // Step N+2: Data (sempre válida)

    // Step N+3: Termo e Assinatura
    if (currentStep === totalSteps) {
      if (!formData.aceitaTermo) errors.aceitaTermo = 'Você precisa aceitar o termo';
      if (!formData.assinatura) errors.assinatura = 'Assinatura é obrigatória';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navegação
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        setFieldErrors({});
      } else {
        handleComplete();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setFieldErrors({});
    }
  };

  const handleComplete = () => {
    const dadosCompletos = {
      ...formData,
      respostasCustomizadas: respostasCustomizadas,
      templateUsadoId: templateAtivo?.id || null,
      perguntasSnapshot: templateAtivo?.perguntas || []
    };

    if (mode === 'remoto') {
      const uniqueLink = `https://anamnese.hub.app/cliente/${Math.random().toString(36).substring(7)}`;
      alert(`Link gerado! Envie para o cliente:\n\n${uniqueLink}\n\nO cliente vai preencher e a anamnese irá automaticamente para o histórico quando ele finalizar.`);
      onComplete(dadosCompletos as QuizData);
    } else {
      onComplete(dadosCompletos as QuizData);
    }
  };

  // 📋 MODO FICHA: Renderizar TODAS as perguntas do template de uma vez
  const renderTodasPerguntasFicha = () => {
    return (
      <div className="space-y-8">
        <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Perguntas da Anamnese</h3>

        {perguntasTemplate.map((pergunta, index) => {
          const valor = respostasCustomizadas[pergunta.id];
          const erro = fieldErrors[pergunta.id];

          return (
            <div key={pergunta.id} className="space-y-3 pb-6 border-b border-gray-100 last:border-0">
              {/* Título da Pergunta */}
              <label className="block text-base font-semibold text-gray-900">
                {index + 1}. {pergunta.titulo}
                {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* 📝 RESPOSTA CURTA - input simples */}
              {pergunta.tipo === 'texto' && (
                <input
                  type="text"
                  value={(valor as string) || ''}
                  onChange={(e) => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: e.target.value})}
                  placeholder="Digite sua resposta..."
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    erro ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              )}

              {/* 📄 PARÁGRAFO - textarea */}
              {pergunta.tipo === 'paragrafo' && (
                <textarea
                  value={(valor as string) || ''}
                  onChange={(e) => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: e.target.value})}
                  rows={5}
                  placeholder="Digite sua resposta..."
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                    erro ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              )}

              {/* Sim ou Não */}
              {pergunta.tipo === 'simNao' && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: true})}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                      valor === true
                        ? 'text-white border-transparent'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                    style={valor === true ? { backgroundColor: cores.primary } : {}}
                  >
                    ✓ Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: false})}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
                      valor === false
                        ? 'bg-gray-600 text-white border-transparent'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    ✗ Não
                  </button>
                </div>
              )}

              {/* ⚫ MÚLTIPLA ESCOLHA - radio */}
              {pergunta.tipo === 'multiplaEscolha' && (
                <div className="space-y-2">
                  {pergunta.opcoes?.map((opcao) => (
                    <button
                      key={opcao.id}
                      type="button"
                      onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: opcao.texto})}
                      className={`w-full text-left py-3 px-4 rounded-lg border-2 transition-all ${
                        valor === opcao.texto
                          ? 'border-transparent text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                      style={valor === opcao.texto ? { backgroundColor: cores.primary } : {}}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            valor === opcao.texto ? 'border-white' : 'border-gray-300'
                          }`}
                        >
                          {valor === opcao.texto && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span className="font-medium text-sm">{opcao.texto}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* ☑️ CAIXA DE SELEÇÃO - checkboxes */}
              {pergunta.tipo === 'caixaSelecao' && (
                <div className="space-y-2">
                  {pergunta.opcoes?.map((opcao) => {
                    const valoresArray = Array.isArray(valor) ? valor : [];
                    const isChecked = valoresArray.includes(opcao.texto);
                    return (
                      <button
                        key={opcao.id}
                        type="button"
                        onClick={() => {
                          const novosValores = isChecked
                            ? valoresArray.filter(v => v !== opcao.texto)
                            : [...valoresArray, opcao.texto];
                          setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: novosValores});
                        }}
                        className={`w-full text-left py-3 px-4 rounded-lg border-2 transition-all ${
                          isChecked
                            ? 'border-transparent text-white'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                        style={isChecked ? { backgroundColor: cores.primary } : {}}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isChecked ? 'border-white' : 'border-gray-300'
                            }`}
                          >
                            {isChecked && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="font-medium text-sm">{opcao.texto}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 📊 ESCALA LINEAR */}
              {pergunta.tipo === 'escalaLinear' && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {Array.from({ length: 10 }, (_, i) => {
                    const numero = i + 1;
                    const isSelected = valor === String(numero);
                    return (
                      <button
                        key={numero}
                        type="button"
                        onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: String(numero)})}
                        className={`w-10 h-10 rounded-lg border-2 font-medium transition-all ${
                          isSelected ? 'text-white border-transparent' : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={isSelected ? { backgroundColor: cores.primary } : {}}
                      >
                        {numero}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 📅 DATA */}
              {pergunta.tipo === 'data' && (
                <input
                  type="date"
                  value={(valor as string) || ''}
                  onChange={(e) => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: e.target.value})}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    erro ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              )}

              {/* 🕐 HORA */}
              {pergunta.tipo === 'hora' && (
                <input
                  type="time"
                  value={(valor as string) || ''}
                  onChange={(e) => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: e.target.value})}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    erro ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              )}

              {/* ⭐ CLASSIFICAÇÃO */}
              {pergunta.tipo === 'classificacao' && (
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 5 }, (_, i) => {
                    const numero = i + 1;
                    const isSelected = Number(valor) >= numero;
                    return (
                      <button
                        key={numero}
                        type="button"
                        onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: String(numero)})}
                        className={`text-3xl transition-all ${
                          isSelected ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-50'
                        }`}
                      >
                        ⭐
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Mensagem de Erro */}
              {erro && (
                <p className="text-sm text-red-600 mt-1">{erro}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizar conteúdo do step atual
  const renderStepContent = () => {
    // Step 1: Dados Pessoais
    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados Pessoais</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <input
                type="text"
                value={formData.nomeCompleto || ''}
                onChange={(e) => updateFormData({ nomeCompleto: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  fieldErrors.nomeCompleto ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Digite seu nome completo"
              />
              {fieldErrors.nomeCompleto && <p className="text-sm text-red-600 mt-1">{fieldErrors.nomeCompleto}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento *</label>
              <input
                type="date"
                value={formData.dataNascimento || ''}
                onChange={(e) => updateFormData({ dataNascimento: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  fieldErrors.dataNascimento ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {fieldErrors.dataNascimento && <p className="text-sm text-red-600 mt-1">{fieldErrors.dataNascimento}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sexo *</label>
              <select
                value={formData.sexo || ''}
                onChange={(e) => updateFormData({ sexo: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  fieldErrors.sexo ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
              {fieldErrors.sexo && <p className="text-sm text-red-600 mt-1">{fieldErrors.sexo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
              <input
                type="text"
                value={formData.cpf || ''}
                onChange={(e) => updateFormData({ cpf: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  fieldErrors.cpf ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="000.000.000-00"
              />
              {fieldErrors.cpf && <p className="text-sm text-red-600 mt-1">{fieldErrors.cpf}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
              <input
                type="tel"
                value={formData.telefone || ''}
                onChange={(e) => updateFormData({ telefone: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  fieldErrors.telefone ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="(00) 00000-0000"
              />
              {fieldErrors.telefone && <p className="text-sm text-red-600 mt-1">{fieldErrors.telefone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateFormData({ email: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="seu@email.com"
              />
              {fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP * {buscandoCep && <span className="text-blue-500 text-xs">(buscando...)</span>}
                </label>
                <input
                  type="text"
                  value={formData.cep || ''}
                  onChange={(e) => {
                    const valor = e.target.value;
                    updateFormData({ cep: valor });
                    // Buscar automaticamente quando tiver 8 dígitos
                    if (valor.replace(/\D/g, '').length === 8) {
                      buscarCep(valor);
                    }
                  }}
                  onBlur={(e) => buscarCep(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    fieldErrors.cep ? 'border-red-500' : buscandoCep ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  placeholder="00000-000"
                  maxLength={9}
                  disabled={buscandoCep}
                />
                {fieldErrors.cep && <p className="text-sm text-red-600 mt-1">{fieldErrors.cep}</p>}
                {!fieldErrors.cep && !buscandoCep && (
                  <p className="text-xs text-gray-500 mt-1">Digite o CEP e os campos serão preenchidos automaticamente</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rua *</label>
                <input
                  type="text"
                  value={formData.rua || ''}
                  onChange={(e) => updateFormData({ rua: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    fieldErrors.rua ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Nome da rua"
                />
                {fieldErrors.rua && <p className="text-sm text-red-600 mt-1">{fieldErrors.rua}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número *</label>
                <input
                  type="text"
                  value={formData.numero || ''}
                  onChange={(e) => updateFormData({ numero: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    fieldErrors.numero ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="123"
                />
                {fieldErrors.numero && <p className="text-sm text-red-600 mt-1">{fieldErrors.numero}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
                <input
                  type="text"
                  value={formData.complemento || ''}
                  onChange={(e) => updateFormData({ complemento: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-colors"
                  placeholder="Apto, Bloco..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
                <input
                  type="text"
                  value={formData.bairro || ''}
                  onChange={(e) => updateFormData({ bairro: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    fieldErrors.bairro ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Nome do bairro"
                />
                {fieldErrors.bairro && <p className="text-sm text-red-600 mt-1">{fieldErrors.bairro}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
                <input
                  type="text"
                  value={formData.cidade || ''}
                  onChange={(e) => updateFormData({ cidade: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    fieldErrors.cidade ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Nome da cidade"
                />
                {fieldErrors.cidade && <p className="text-sm text-red-600 mt-1">{fieldErrors.cidade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">UF *</label>
                <input
                  type="text"
                  value={formData.estado || ''}
                  onChange={(e) => updateFormData({ estado: e.target.value.toUpperCase() })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    fieldErrors.estado ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="SP"
                  maxLength={2}
                />
                {fieldErrors.estado && <p className="text-sm text-red-600 mt-1">{fieldErrors.estado}</p>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 📋 MODO FICHA: Steps 2 = TODAS as perguntas juntas
    if (formatoTemplate === 'ficha' && currentStep === 2) {
      return renderTodasPerguntasFicha();
    }

    // 🎯 MODO QUIZ: Steps 2 até N: Uma pergunta por vez
    if (formatoTemplate === 'quiz' && currentStep >= 2 && currentStep <= (1 + totalPerguntas)) {
      const indexPergunta = currentStep - 2;
      const pergunta = perguntasTemplate[indexPergunta];

      if (!pergunta) return <div>Carregando...</div>;

      const valor = respostasCustomizadas[pergunta.id];
      const erro = fieldErrors[pergunta.id];

      return (
        <div className="space-y-6">
          <div className="flex items-start gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: cores.primary }}
            >
              {indexPergunta + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {pergunta.titulo}
                {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
              </h2>
              {pergunta.descricao && (
                <p className="text-gray-600">{pergunta.descricao}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* 📝 RESPOSTA CURTA */}
            {pergunta.tipo === 'texto' && (
              <input
                type="text"
                value={(valor as string) || ''}
                onChange={(e) => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: e.target.value})}
                placeholder="Digite sua resposta..."
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  erro ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            )}

            {/* 📄 PARÁGRAFO */}
            {pergunta.tipo === 'paragrafo' && (
              <textarea
                value={(valor as string) || ''}
                onChange={(e) => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: e.target.value})}
                rows={5}
                placeholder="Digite sua resposta..."
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                  erro ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            )}

            {pergunta.tipo === 'simNao' && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: true})}
                  className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all font-medium text-lg ${
                    valor === true
                      ? 'text-white border-transparent shadow-lg'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                  style={valor === true ? { backgroundColor: cores.primary } : {}}
                >
                  ✓ Sim
                </button>
                <button
                  type="button"
                  onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: false})}
                  className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all font-medium text-lg ${
                    valor === false
                      ? 'bg-gray-600 text-white border-transparent shadow-lg'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ✗ Não
                </button>
              </div>
            )}

            {/* ⚫ MÚLTIPLA ESCOLHA */}
            {pergunta.tipo === 'multiplaEscolha' && (
              <div className="space-y-3">
                {pergunta.opcoes?.map((opcao) => (
                  <button
                    key={opcao.id}
                    type="button"
                    onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: opcao.texto})}
                    className={`w-full text-left py-4 px-5 rounded-xl border-2 transition-all ${
                      valor === opcao.texto
                        ? 'border-transparent text-white shadow-lg'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                    style={valor === opcao.texto ? { backgroundColor: cores.primary } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          valor === opcao.texto ? 'border-white' : 'border-gray-300'
                        }`}
                      >
                        {valor === opcao.texto && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="font-medium">{opcao.texto}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* ☑️ CAIXA DE SELEÇÃO */}
            {pergunta.tipo === 'caixaSelecao' && (
              <div className="space-y-3">
                {pergunta.opcoes?.map((opcao) => {
                  const valoresArray = Array.isArray(valor) ? valor : [];
                  const isChecked = valoresArray.includes(opcao.texto);
                  return (
                    <button
                      key={opcao.id}
                      type="button"
                      onClick={() => {
                        const novosValores = isChecked
                          ? valoresArray.filter(v => v !== opcao.texto)
                          : [...valoresArray, opcao.texto];
                        setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: novosValores});
                      }}
                      className={`w-full text-left py-4 px-5 rounded-xl border-2 transition-all ${
                        isChecked
                          ? 'border-transparent text-white shadow-lg'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                      style={isChecked ? { backgroundColor: cores.primary } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isChecked ? 'border-white' : 'border-gray-300'
                          }`}
                        >
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium">{opcao.texto}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 📊 ESCALA LINEAR */}
            {pergunta.tipo === 'escalaLinear' && (
              <div className="flex gap-2 justify-center flex-wrap">
                {Array.from({ length: 10 }, (_, i) => {
                  const numero = i + 1;
                  const isSelected = valor === String(numero);
                  return (
                    <button
                      key={numero}
                      type="button"
                      onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: String(numero)})}
                      className={`w-14 h-14 rounded-xl border-2 font-bold text-lg transition-all ${
                        isSelected ? 'text-white border-transparent shadow-lg scale-110' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={isSelected ? { backgroundColor: cores.primary } : {}}
                    >
                      {numero}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 📅 DATA */}
            {pergunta.tipo === 'data' && (
              <input
                type="date"
                value={(valor as string) || ''}
                onChange={(e) => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: e.target.value})}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  erro ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            )}

            {/* 🕐 HORA */}
            {pergunta.tipo === 'hora' && (
              <input
                type="time"
                value={(valor as string) || ''}
                onChange={(e) => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: e.target.value})}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  erro ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            )}

            {/* ⭐ CLASSIFICAÇÃO */}
            {pergunta.tipo === 'classificacao' && (
              <div className="flex gap-2 justify-center py-4">
                {Array.from({ length: 5 }, (_, i) => {
                  const numero = i + 1;
                  const isSelected = Number(valor) >= numero;
                  return (
                    <button
                      key={numero}
                      type="button"
                      onClick={() => setRespostasCustomizadas({...respostasCustomizadas, [pergunta.id]: String(numero)})}
                      className={`text-5xl transition-all ${
                        isSelected ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-60 hover:scale-105'
                      }`}
                    >
                      ⭐
                    </button>
                  );
                })}
              </div>
            )}

            {erro && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Step N+1: Como Conheceu / Indicação
    const stepIndicacao = formatoTemplate === 'ficha' ? 3 : (1 + totalPerguntas + 1);
    if (currentStep === stepIndicacao) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Como nos conheceu?</h2>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => updateFormData({ comoConheceu: 'Instagram', indicadoPor: '' })}
                className={`py-6 px-6 rounded-xl border-2 transition-all font-medium flex flex-col items-center gap-2 ${
                  formData.comoConheceu === 'Instagram'
                    ? 'border-transparent text-white shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={formData.comoConheceu === 'Instagram' ? { backgroundColor: cores.primary } : {}}
              >
                <span className="text-3xl">📱</span>
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => updateFormData({ comoConheceu: 'Facebook', indicadoPor: '' })}
                className={`py-6 px-6 rounded-xl border-2 transition-all font-medium flex flex-col items-center gap-2 ${
                  formData.comoConheceu === 'Facebook'
                    ? 'border-transparent text-white shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={formData.comoConheceu === 'Facebook' ? { backgroundColor: cores.primary } : {}}
              >
                <span className="text-3xl">👥</span>
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => updateFormData({ comoConheceu: 'Google', indicadoPor: '' })}
                className={`py-6 px-6 rounded-xl border-2 transition-all font-medium flex flex-col items-center gap-2 ${
                  formData.comoConheceu === 'Google'
                    ? 'border-transparent text-white shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={formData.comoConheceu === 'Google' ? { backgroundColor: cores.primary } : {}}
              >
                <span className="text-3xl">🔍</span>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => updateFormData({ comoConheceu: 'Indicação' })}
                className={`py-6 px-6 rounded-xl border-2 transition-all font-medium flex flex-col items-center gap-2 ${
                  formData.comoConheceu === 'Indicação'
                    ? 'border-transparent text-white shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={formData.comoConheceu === 'Indicação' ? { backgroundColor: cores.primary } : {}}
              >
                <span className="text-3xl">👋</span>
                <span>Indicação</span>
              </button>
            </div>

            {fieldErrors.comoConheceu && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{fieldErrors.comoConheceu}</p>
              </div>
            )}

            {formData.comoConheceu === 'Indicação' && (
              <div className="pt-4 animate-fadeIn">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quem indicou você? *
                </label>
                <input
                  type="text"
                  value={formData.indicadoPor || ''}
                  onChange={(e) => updateFormData({ indicadoPor: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    fieldErrors.indicadoPor ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Nome de quem indicou"
                  autoFocus
                />
                {fieldErrors.indicadoPor && <p className="text-sm text-red-600 mt-1">{fieldErrors.indicadoPor}</p>}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Step N+2: Data da Anamnese + Valor do Serviço
    const stepData = formatoTemplate === 'ficha' ? 4 : (1 + totalPerguntas + 2);
    if (currentStep === stepData) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Finais</h2>

          <div className="max-w-md mx-auto space-y-6">
            {/* Data da Anamnese */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📅 Data da Anamnese
              </label>
              <input
                type="date"
                value={formData.dataAnamnese || ''}
                onChange={(e) => updateFormData({ dataAnamnese: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-colors"
              />
              <p className="text-sm text-gray-500 mt-2">
                Por padrão, a data de hoje já está selecionada
              </p>
            </div>

            {/* Valor do Serviço (apenas modo presencial) */}
            {mode === 'presencial' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💰 Valor do Serviço (Opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    R$
                  </span>
                  <input
                    type="text"
                    value={valorFormatado}
                    onChange={(e) => handleValorChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none transition-colors text-right font-medium text-lg"
                    placeholder="0,00"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  💡 <strong>Dica:</strong> Digite normalmente. Ex: 15000 vira R$ 150,00
                </p>
              </div>
            )}

            {mode === 'remoto' && (
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  ℹ️ <strong>Modo Remoto:</strong> O valor do serviço será adicionado posteriormente pelo profissional.
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Step N+2: Termo e Assinatura
    if (currentStep === totalSteps) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Termo de Compromisso e Assinatura</h2>

          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 max-h-96 overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4">Termo de Responsabilidade</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Declaro que todas as informações fornecidas nesta anamnese são verdadeiras e
                completas. Estou ciente de que a omissão ou falsidade de informações pode
                comprometer o resultado do procedimento.
              </p>
              <p>
                Autorizo o profissional responsável a realizar os procedimentos necessários,
                ciente dos riscos e benefícios envolvidos.
              </p>
              <p>
                Comprometo-me a seguir todas as orientações passadas pelo profissional antes e
                após o procedimento.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={formData.aceitaTermo || false}
                onChange={(e) => updateFormData({ aceitaTermo: e.target.checked })}
                className="mt-1 w-5 h-5"
              />
              <label className="text-sm text-gray-700">
                Li e aceito os termos acima *
              </label>
            </div>
            {fieldErrors.aceitaTermo && <p className="text-sm text-red-600">{fieldErrors.aceitaTermo}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assinatura Digital *
              </label>
              <input
                type="text"
                value={formData.assinatura || ''}
                onChange={(e) => updateFormData({ assinatura: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors font-signature text-2xl ${
                  fieldErrors.assinatura ? 'border-red-500' : 'border-gray-200'
                }`}
                placeholder="Digite seu nome completo"
                style={{ fontFamily: 'cursive' }}
              />
              {fieldErrors.assinatura && <p className="text-sm text-red-600 mt-1">{fieldErrors.assinatura}</p>}
              <p className="text-sm text-gray-500 mt-2">
                Digite seu nome completo como assinatura
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Ícone do step atual
  const getStepIcon = () => {
    if (currentStep === 1) return FileText;

    // Modo Ficha
    if (formatoTemplate === 'ficha') {
      if (currentStep === 2) return Sparkles; // Todas perguntas
      if (currentStep === 3) return Sparkles; // Indicação
      if (currentStep === 4) return Calendar; // Data
      if (currentStep === 5) return CheckCircle; // Termo
    }

    // Modo Quiz
    if (currentStep === (1 + totalPerguntas + 1)) return Sparkles; // Indicação
    if (currentStep === (1 + totalPerguntas + 2)) return Calendar; // Data
    if (currentStep === totalSteps) return CheckCircle; // Termo
    return Sparkles; // Perguntas do template
  };

  const StepIcon = getStepIcon();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8">
        {/* Header com Progresso */}
        <CardHeader
          className="text-white"
          style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <StepIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">
                  {mode === 'presencial' ? 'Anamnese Presencial' : 'Anamnese Remota'}
                </CardTitle>
                <CardDescription className="text-white/80">
                  Etapa {currentStep} de {totalSteps}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              Cancelar
            </Button>
          </div>

          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/90">
              <span>Progresso</span>
              <span>{Math.round(progresso)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </CardHeader>

        {/* Conteúdo */}
        <CardContent className="p-6 min-h-[400px] max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </CardContent>

        {/* Footer com Navegação */}
        <div className="border-t border-gray-200 p-6 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="text-sm text-gray-500">
            {currentStep} / {totalSteps}
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2 text-white"
            style={{ backgroundColor: cores.primary }}
          >
            {currentStep === totalSteps ? 'Concluir' : 'Próximo'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
