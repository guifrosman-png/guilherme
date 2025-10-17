import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';
import { ChevronLeft, ChevronRight, FileText, MapPin, Heart, AlertCircle, Sparkles, Image as ImageIcon, CheckCircle, X } from 'lucide-react';

// Tipos
interface QuizData {
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  telefone: string;
  endereco: string;
  email: string;
  comoConheceu: string;
  outraOrigem?: string;
  doencas: string;
  medicamentos: string;
  temAlergias: boolean;
  alergias?: string;
  condicoesPele: string;
  temTatuagem: boolean;
  historicoTatuagens?: string;
  localTatuagem: string;
  tamanhoTatuagem: string;
  estiloTatuagem: string;
  valorTatuagem: number; // NOVO: Valor cobrado pela tatuagem
  aceitaTermo: boolean;
  assinatura: string;
}

interface QuizContainerProps {
  mode: 'presencial' | 'remoto';
  onComplete: (data: QuizData) => void;
  onClose: () => void;
  customQuestions?: any[]; // Perguntas personalizadas do template
  initialData?: any; // Dados pré-preenchidos (da última anamnese)
}

export function QuizContainer({ mode, onComplete, onClose, customQuestions = [], initialData = null }: QuizContainerProps) {
  const [currentStep, setCurrentStep] = useState(initialData ? 7 : 1); // Se tem dados, começa no Step 7 (tatuagem)
  const [formData, setFormData] = useState<Partial<QuizData>>(initialData || {}); // Iniciar com dados pré-preenchidos
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({}); // Erros de validação
  const [valorFormatado, setValorFormatado] = useState('0,00'); // Valor formatado para exibição

  // 🎨 OBTER CORES TEMÁTICAS DA PROFISSÃO
  const getCoresTema = () => {
    const config = localStorage.getItem('anamneseConfig');
    const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';

    const cores: any = {
      tatuagem: {
        gradient: 'from-pink-500 to-purple-500',
        bg50: 'bg-pink-50',
        border200: 'border-pink-200',
        border300: 'border-pink-300',
        border500: 'border-pink-500',
        text500: 'text-pink-500',
        focus: 'focus:border-pink-500',
        hover: 'hover:border-pink-300',
        hoverBg: 'hover:bg-pink-50/50',
      },
      psicologia: {
        gradient: 'from-blue-500 to-cyan-500',
        bg50: 'bg-blue-50',
        border200: 'border-blue-200',
        border300: 'border-blue-300',
        border500: 'border-blue-500',
        text500: 'text-blue-500',
        focus: 'focus:border-blue-500',
        hover: 'hover:border-blue-300',
        hoverBg: 'hover:bg-blue-50/50',
      },
      nutricao: {
        gradient: 'from-green-500 to-emerald-500',
        bg50: 'bg-green-50',
        border200: 'border-green-200',
        border300: 'border-green-300',
        border500: 'border-green-500',
        text500: 'text-green-500',
        focus: 'focus:border-green-500',
        hover: 'hover:border-green-300',
        hoverBg: 'hover:bg-green-50/50',
      },
      fisioterapia: {
        gradient: 'from-orange-500 to-amber-500',
        bg50: 'bg-orange-50',
        border200: 'border-orange-200',
        border300: 'border-orange-300',
        border500: 'border-orange-500',
        text500: 'text-orange-500',
        focus: 'focus:border-orange-500',
        hover: 'hover:border-orange-300',
        hoverBg: 'hover:bg-orange-50/50',
      },
      estetica: {
        gradient: 'from-purple-500 to-fuchsia-500',
        bg50: 'bg-purple-50',
        border200: 'border-purple-200',
        border300: 'border-purple-300',
        border500: 'border-purple-500',
        text500: 'text-purple-500',
        focus: 'focus:border-purple-500',
        hover: 'hover:border-purple-300',
        hoverBg: 'hover:bg-purple-50/50',
      },
    };
    return cores[templateProfissao] || cores.tatuagem;
  };

  const coresTema = getCoresTema();

  // Log para verificar se as perguntas personalizadas chegaram
  console.log('🎯 Custom Questions recebidas no QuizContainer:', customQuestions);

  // Log e useEffect para dados pré-preenchidos
  useEffect(() => {
    if (initialData) {
      console.log('📋 Dados pré-preenchidos recebidos:', initialData);
      console.log('⏭️ Pulando para Step 7 (informações da nova tatuagem)');
      // Limpar dados específicos da tatuagem anterior + assinatura
      setFormData({
        ...initialData,
        localTatuagem: '', // Limpar local da tatuagem anterior
        tamanhoTatuagem: '', // Limpar tamanho
        estiloTatuagem: '', // Limpar estilo
        assinatura: '', // Limpar assinatura
        aceitaTermo: false, // Limpar termo
      });
      setCurrentStep(7); // Ir direto para Step 7
    }
  }, [initialData]);

  // Funções de validação
  const validateEmail = (email: string): string | null => {
    if (!email) return 'Email é obrigatório';
    if (!email.includes('@')) return 'Email deve conter @';
    if (!email.includes('.')) return 'Email inválido';
    return null; // null = sem erro
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone) return 'Telefone é obrigatório';
    const numbers = phone.replace(/\D/g, ''); // Remove tudo que não é número
    if (numbers.length < 10 || numbers.length > 11) {
      return 'Telefone deve ter 10 ou 11 dígitos';
    }
    return null;
  };

  const validateCPF = (cpf: string): string | null => {
    if (!cpf) return 'CPF é obrigatório';
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return 'CPF deve ter 11 dígitos';
    return null;
  };

  // Função para formatar valor como moeda brasileira (estilo banco)
  const formatarMoeda = (valor: string): { formatado: string; valorNumerico: number } => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');

    // Se vazio, retorna 0,00
    if (!apenasNumeros || apenasNumeros === '0') {
      return { formatado: '0,00', valorNumerico: 0 };
    }

    // Converte para número (centavos)
    const valorEmCentavos = parseInt(apenasNumeros);
    const valorEmReais = valorEmCentavos / 100;

    // Formata com vírgula e ponto
    const formatado = valorEmReais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return { formatado, valorNumerico: valorEmReais };
  };

  // Handler para mudança de valor
  const handleValorChange = (input: string) => {
    const { formatado, valorNumerico } = formatarMoeda(input);
    setValorFormatado(formatado);
    updateFormData({ valorTatuagem: valorNumerico });
  };

  // Se tem perguntas personalizadas, usar elas. Senão, usar quiz padrão
  const useCustomQuiz = customQuestions.length > 0;

  // Agrupar perguntas por seção (para criar os steps)
  const groupedQuestions = useCustomQuiz ? customQuestions.reduce((acc: any, question: any) => {
    if (!acc[question.section]) {
      acc[question.section] = [];
    }
    acc[question.section].push(question);
    return acc;
  }, {}) : {};

  const sections = Object.keys(groupedQuestions);
  // SEMPRE incluir +1 step para o Termo de Compromisso (Step 8)
  const totalSteps = useCustomQuiz ? sections.length + 1 : 8;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    const errors: Record<string, string> = {};

    // Se está usando quiz customizado, valida baseado nas perguntas configuradas
    if (useCustomQuiz) {
      const currentSection = sections[currentStep - 1];
      const currentQuestions = groupedQuestions[currentSection];

      currentQuestions.forEach((question: any) => {
        if (question.required) {
          const fieldKey = question.label.toLowerCase().replace(/\s+/g, '_');
          const value = (formData as any)[fieldKey];

          if (!value || value === '') {
            errors[fieldKey] = `${question.label} é obrigatório`;
          }

          // Validações específicas por tipo de campo
          if (question.label.toLowerCase().includes('email') && value) {
            const emailError = validateEmail(value);
            if (emailError) errors[fieldKey] = emailError;
          }

          if (question.label.toLowerCase().includes('telefone') && value) {
            const phoneError = validatePhone(value);
            if (phoneError) errors[fieldKey] = phoneError;
          }

          if (question.label.toLowerCase().includes('cpf') && value) {
            const cpfError = validateCPF(value);
            if (cpfError) errors[fieldKey] = cpfError;
          }
        }
      });
    } else {
      // Validação do quiz padrão (quando não tem perguntas customizadas)
      if (currentStep === 1) {
        // Nome obrigatório
        if (!formData.nomeCompleto) errors.nomeCompleto = 'Nome é obrigatório';

        // Email obrigatório e válido
        const emailError = validateEmail(formData.email || '');
        if (emailError) errors.email = emailError;

        // Telefone obrigatório e válido
        const phoneError = validatePhone(formData.telefone || '');
        if (phoneError) errors.telefone = phoneError;

        // CPF obrigatório e válido
        const cpfError = validateCPF(formData.cpf || '');
        if (cpfError) errors.cpf = cpfError;

        // Data de nascimento obrigatória
        if (!formData.dataNascimento) {
          errors.dataNascimento = 'Data de nascimento é obrigatória';
        } else {
          // Validar se é maior de 18 anos
          const hoje = new Date();
          const nascimento = new Date(formData.dataNascimento);
          let idade = hoje.getFullYear() - nascimento.getFullYear();
          const mes = hoje.getMonth() - nascimento.getMonth();
          if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
          }

          if (idade < 18) {
            errors.dataNascimento = '⚠️ Você precisa ter 18 anos ou mais para fazer tatuagem';
          }
        }

        // Endereço obrigatório
        if (!formData.endereco) errors.endereco = 'Endereço é obrigatório';
      }

      // Validação do Step 2 - Como conheceu
      if (currentStep === 2) {
        if (!formData.comoConheceu) errors.comoConheceu = 'Selecione uma opção';
        if (formData.comoConheceu === 'Outro' && !formData.outraOrigem) {
          errors.outraOrigem = 'Especifique como conheceu';
        }
      }
    }

    // Se tem erros, NÃO avança e mostra os erros
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return; // Para aqui, não avança
    }

    // Se não tem erros, limpa erros anteriores e avança
    setFieldErrors({});
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (mode === 'remoto') {
      // Modo remoto: gerar link e mostrar para a profissional
      const uniqueLink = `https://anamnese.hub.app/cliente/${Math.random().toString(36).substring(7)}`;
      alert(`Link gerado! Envie para o cliente:\n\n${uniqueLink}\n\nO cliente vai preencher e a anamnese irá automaticamente para o histórico quando ele finalizar.`);
      onComplete(formData as QuizData);
    } else {
      // Modo presencial: salvar direto
      onComplete(formData as QuizData);
    }
  };

  const updateFormData = (data: Partial<QuizData>) => {
    setFormData({ ...formData, ...data });
  };

  // Definir ícone e cor por etapa
  const stepConfig = {
    1: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    2: { icon: MapPin, color: 'text-green-500', bg: 'bg-green-50' },
    3: { icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    4: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
    5: { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-50' },
    6: { icon: ImageIcon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    7: { icon: ImageIcon, color: coresTema.text500, bg: coresTema.bg50 },
    8: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  };

  const StepIcon = stepConfig[currentStep as keyof typeof stepConfig]?.icon || FileText;
  const iconColor = stepConfig[currentStep as keyof typeof stepConfig]?.color || 'text-blue-500';
  const iconBg = stepConfig[currentStep as keyof typeof stepConfig]?.bg || 'bg-blue-50';

  // Função para renderizar uma pergunta personalizada
  const renderCustomQuestion = (question: any) => {
    const fieldKey = question.label.toLowerCase().replace(/\s+/g, '_');
    const hasError = fieldErrors[fieldKey];

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id}>
            <input
              type="text"
              placeholder={question.label}
              className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                hasError ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
              }`}
              value={(formData as any)[fieldKey] || ''}
              onChange={(e) => updateFormData({ [fieldKey]: e.target.value })}
            />
            {hasError && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {hasError}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={question.id}>
            <textarea
              placeholder={question.label}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors resize-none ${
                hasError ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
              }`}
              value={(formData as any)[fieldKey] || ''}
              onChange={(e) => updateFormData({ [fieldKey]: e.target.value })}
            />
            {hasError && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {hasError}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={question.id}>
            <select
              className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                hasError ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
              }`}
              value={(formData as any)[fieldKey] || ''}
              onChange={(e) => updateFormData({ [fieldKey]: e.target.value })}
            >
              <option value="">{question.label}</option>
              {question.options?.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {hasError && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {hasError}
              </p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">{question.label}</label>
            <div className="flex flex-wrap gap-3">
              {question.options?.map((opt: string) => (
                <label key={opt} className={`flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl cursor-pointer ${coresTema.hover} transition-colors`}>
                  <input
                    type="radio"
                    name={fieldKey}
                    value={opt}
                    checked={(formData as any)[fieldKey] === opt}
                    onChange={(e) => updateFormData({ [fieldKey]: e.target.value })}
                    className={coresTema.text500}
                  />
                  <span className="text-gray-900">{opt}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                ⚠️ {hasError}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Renderizar Termo de Compromisso (Step 8) - Diferente para cada modo
  const renderTermoDeCompromisso = () => {
    return (
      <div className="space-y-5 animate-fadeIn">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <StepIcon className={`h-8 w-8 ${iconColor}`} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Termo de Compromisso</h3>
          <p className="text-gray-600 mt-2">Última etapa! Assine digitalmente</p>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 max-h-[200px] overflow-y-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              Eu, <strong>{formData.nomeCompleto || '[Nome]'}</strong>, declaro que as informações fornecidas são verdadeiras.
              Estou ciente dos riscos do procedimento de tatuagem e concordo em seguir todas as orientações
              de cuidados pós-procedimento. Confirmo que não possuo contraindicações médicas para realizar
              este procedimento.
            </p>
          </div>

          {/* VALOR DA TATUAGEM - Apenas para modo PRESENCIAL */}
          {mode === 'presencial' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💰 Valor da Tatuagem
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0,00"
                  className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors text-lg font-semibold`}
                  value={valorFormatado}
                  onChange={(e) => handleValorChange(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Digite apenas números • O valor será formatado automaticamente
              </p>
            </div>
          )}

          <div className={`flex items-center gap-3 p-4 ${coresTema.bg50} rounded-xl border-2 ${coresTema.border200}`}>
            <input
              type="checkbox"
              id="termo"
              checked={formData.aceitaTermo || false}
              onChange={(e) => updateFormData({ aceitaTermo: e.target.checked })}
              className={`w-5 h-5 ${coresTema.text500} rounded`}
            />
            <label htmlFor="termo" className="text-sm font-medium text-gray-900 cursor-pointer">
              Li e concordo com o termo de compromisso
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assinatura Digital
            </label>
            <input
              type="text"
              placeholder="Digite seu nome completo como assinatura"
              className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors font-signature text-xl`}
              value={formData.assinatura || ''}
              onChange={(e) => updateFormData({ assinatura: e.target.value })}
              style={{ fontFamily: 'cursive' }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Renderizar step customizado
  const renderCustomStep = () => {
    const currentSection = sections[currentStep - 1];
    const questions = groupedQuestions[currentSection];

    // PROTEÇÃO: Se não tem perguntas, não renderiza (evita erro)
    if (!questions || questions.length === 0) {
      console.warn('⚠️ Nenhuma pergunta encontrada para a seção:', currentSection);
      return null;
    }

    return (
      <div className="space-y-5 animate-fadeIn">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
            <StepIcon className={`h-8 w-8 ${iconColor}`} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{currentSection}</h3>
          <p className="text-gray-600 mt-2">Preencha as informações abaixo</p>
        </div>
        <div className="space-y-4">
          {questions.map((q: any) => renderCustomQuestion(q))}
        </div>
      </div>
    );
  };

  // Renderizar etapa atual
  const renderStep = () => {
    // ✅ IMPORTANTE: Step 8 (Termo) SEMPRE usa a função renderTermoDeCompromisso()
    // Isso garante que o campo de valor só aparece no modo presencial
    if (currentStep === totalSteps) {
      return renderTermoDeCompromisso();
    }

    // Se usa quiz customizado, renderizar steps customizados (Steps 1-7)
    if (useCustomQuiz) {
      return renderCustomStep();
    }

    // Senão, usar o quiz padrão (Steps 1-7)
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <StepIcon className={`h-8 w-8 ${iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Dados Pessoais</h3>
              <p className="text-gray-600 mt-2">Vamos começar com suas informações básicas</p>
            </div>
            <div className="space-y-4">
              {/* Nome Completo */}
              <div>
                <input
                  type="text"
                  placeholder="Nome completo"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                    fieldErrors.nomeCompleto ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
                  }`}
                  value={formData.nomeCompleto || ''}
                  onChange={(e) => updateFormData({ nomeCompleto: e.target.value })}
                />
                {fieldErrors.nomeCompleto && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    ⚠️ {fieldErrors.nomeCompleto}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Data de Nascimento */}
                <div>
                  <input
                    type="date"
                    placeholder="Data de nascimento"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                      fieldErrors.dataNascimento ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
                    }`}
                    value={formData.dataNascimento || ''}
                    onChange={(e) => updateFormData({ dataNascimento: e.target.value })}
                  />
                  {fieldErrors.dataNascimento && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      ⚠️ {fieldErrors.dataNascimento}
                    </p>
                  )}
                </div>

                {/* CPF */}
                <div>
                  <input
                    type="text"
                    placeholder="CPF"
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                      fieldErrors.cpf ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
                    }`}
                    value={formData.cpf || ''}
                    onChange={(e) => updateFormData({ cpf: e.target.value })}
                  />
                  {fieldErrors.cpf && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      ⚠️ {fieldErrors.cpf}
                    </p>
                  )}
                </div>
              </div>

              {/* RG */}
              <div>
                <input
                  type="text"
                  placeholder="RG"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                    fieldErrors.rg ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
                  }`}
                  value={formData.rg || ''}
                  onChange={(e) => updateFormData({ rg: e.target.value })}
                />
                {fieldErrors.rg && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    ⚠️ {fieldErrors.rg}
                  </p>
                )}
              </div>

              {/* Telefone */}
              <div>
                <input
                  type="tel"
                  placeholder="Telefone"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                    fieldErrors.telefone ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
                  }`}
                  value={formData.telefone || ''}
                  onChange={(e) => updateFormData({ telefone: e.target.value })}
                />
                {fieldErrors.telefone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    ⚠️ {fieldErrors.telefone}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="E-mail"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                    fieldErrors.email ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
                  }`}
                  value={formData.email || ''}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    ⚠️ {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Endereço */}
              <div>
                <input
                  type="text"
                  placeholder="Endereço completo"
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors ${
                    fieldErrors.endereco ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
                  }`}
                  value={formData.endereco || ''}
                  onChange={(e) => updateFormData({ endereco: e.target.value })}
                />
                {fieldErrors.endereco && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    ⚠️ {fieldErrors.endereco}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <StepIcon className={`h-8 w-8 ${iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Como me conheceu?</h3>
              <p className="text-gray-600 mt-2">Selecione como chegou até nós</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'Instagram', emoji: '📱' },
                { value: 'Google', emoji: '🔍' },
                { value: 'Indicação', emoji: '👥' },
                { value: 'Outro', emoji: '💡' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFormData({ comoConheceu: option.value })}
                  className={`px-6 py-4 rounded-xl border-2 transition-all text-center ${
                    formData.comoConheceu === option.value
                      ? `${coresTema.border500} ${coresTema.bg50} shadow-lg scale-105`
                      : `border-gray-200 ${coresTema.hover} ${coresTema.hoverBg}`
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">{option.value}</div>
                </button>
              ))}
            </div>
            {fieldErrors.comoConheceu && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                ⚠️ {fieldErrors.comoConheceu}
              </p>
            )}
            {formData.comoConheceu === 'Outro' && (
              <div>
                <input
                  type="text"
                  placeholder="Especifique..."
                  className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none transition-colors mt-4 ${
                    fieldErrors.outraOrigem ? 'border-red-500 focus:border-red-500' : `border-gray-200 ${coresTema.focus}`
                  }`}
                  value={formData.outraOrigem || ''}
                  onChange={(e) => updateFormData({ outraOrigem: e.target.value })}
                />
                {fieldErrors.outraOrigem && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    ⚠️ {fieldErrors.outraOrigem}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <StepIcon className={`h-8 w-8 ${iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Saúde Geral</h3>
              <p className="text-gray-600 mt-2">Informações importantes sobre sua saúde</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Possui alguma doença ou condição de saúde?
                </label>
                <textarea
                  placeholder="Descreva aqui... (Ex: diabetes, hipertensão, etc)"
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors min-h-[100px] resize-none`}
                  value={formData.doencas || ''}
                  onChange={(e) => updateFormData({ doencas: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usa algum medicamento atualmente?
                </label>
                <textarea
                  placeholder="Liste os medicamentos... (Ex: Losartana 50mg, etc)"
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors min-h-[100px] resize-none`}
                  value={formData.medicamentos || ''}
                  onChange={(e) => updateFormData({ medicamentos: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <StepIcon className={`h-8 w-8 ${iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Alergias</h3>
              <p className="text-gray-600 mt-2">Possui alguma alergia conhecida?</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateFormData({ temAlergias: true })}
                  className={`px-6 py-4 rounded-xl border-2 transition-all ${
                    formData.temAlergias === true
                      ? `${coresTema.border500} ${coresTema.bg50} shadow-lg scale-105`
                      : `border-gray-200 ${coresTema.hover}`
                  }`}
                >
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-sm font-medium text-gray-900">Sim, tenho</div>
                </button>
                <button
                  onClick={() => updateFormData({ temAlergias: false, alergias: '' })}
                  className={`px-6 py-4 rounded-xl border-2 transition-all ${
                    formData.temAlergias === false
                      ? `${coresTema.border500} ${coresTema.bg50} shadow-lg scale-105`
                      : `border-gray-200 ${coresTema.hover}`
                  }`}
                >
                  <div className="text-2xl mb-1">❌</div>
                  <div className="text-sm font-medium text-gray-900">Não tenho</div>
                </button>
              </div>
              {formData.temAlergias && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quais alergias?
                  </label>
                  <textarea
                    placeholder="Descreva suas alergias... (Ex: tinta, metais, látex, etc)"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors min-h-[100px] resize-none`}
                    value={formData.alergias || ''}
                    onChange={(e) => updateFormData({ alergias: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <StepIcon className={`h-8 w-8 ${iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Condições de Pele</h3>
              <p className="text-gray-600 mt-2">Como está sua pele atualmente?</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Possui alguma condição de pele? (dermatites, queloides, cicatrização lenta, etc)
              </label>
              <textarea
                placeholder="Descreva aqui..."
                className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors min-h-[120px] resize-none`}
                value={formData.condicoesPele || ''}
                onChange={(e) => updateFormData({ condicoesPele: e.target.value })}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <StepIcon className={`h-8 w-8 ${iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Histórico de Tatuagens</h3>
              <p className="text-gray-600 mt-2">Já fez tatuagem antes?</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateFormData({ temTatuagem: true })}
                  className={`px-6 py-4 rounded-xl border-2 transition-all ${
                    formData.temTatuagem === true
                      ? `${coresTema.border500} ${coresTema.bg50} shadow-lg scale-105`
                      : `border-gray-200 ${coresTema.hover}`
                  }`}
                >
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-sm font-medium text-gray-900">Sim, já fiz</div>
                </button>
                <button
                  onClick={() => updateFormData({ temTatuagem: false, historicoTatuagens: '' })}
                  className={`px-6 py-4 rounded-xl border-2 transition-all ${
                    formData.temTatuagem === false
                      ? `${coresTema.border500} ${coresTema.bg50} shadow-lg scale-105`
                      : `border-gray-200 ${coresTema.hover}`
                  }`}
                >
                  <div className="text-2xl mb-1">🆕</div>
                  <div className="text-sm font-medium text-gray-900">Primeira vez</div>
                </button>
              </div>
              {formData.temTatuagem && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Conte sobre suas tatuagens anteriores
                  </label>
                  <textarea
                    placeholder="Quantas? Onde? Teve algum problema?"
                    className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors min-h-[100px] resize-none`}
                    value={formData.historicoTatuagens || ''}
                    onChange={(e) => updateFormData({ historicoTatuagens: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-5 animate-fadeIn">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <StepIcon className={`h-8 w-8 ${iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Sobre a Nova Tatuagem</h3>
              <p className="text-gray-600 mt-2">Detalhes do procedimento desejado</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Onde será a tatuagem?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Braço direito, costas, perna esquerda..."
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors`}
                  value={formData.localTatuagem || ''}
                  onChange={(e) => updateFormData({ localTatuagem: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual o tamanho aproximado?
                </label>
                <select
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors`}
                  value={formData.tamanhoTatuagem || ''}
                  onChange={(e) => updateFormData({ tamanhoTatuagem: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="Pequena (até 5cm)">Pequena (até 5cm)</option>
                  <option value="Média (5-15cm)">Média (5-15cm)</option>
                  <option value="Grande (15-30cm)">Grande (15-30cm)</option>
                  <option value="Extra Grande (30cm+)">Extra Grande (30cm+)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo desejado
                </label>
                <input
                  type="text"
                  placeholder="Ex: Realista, tradicional, aquarela, minimalista..."
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 ${coresTema.focus} focus:outline-none transition-colors`}
                  value={formData.estiloTatuagem || ''}
                  onChange={(e) => updateFormData({ estiloTatuagem: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header com botão fechar */}
        <div className={`bg-gradient-to-r ${coresTema.gradient} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="text-white">
            <div className="text-sm font-medium opacity-90">
              Etapa {currentStep} de {totalSteps} • Modo: {mode === 'presencial' ? 'Presencial' : 'Remoto'}
            </div>
            <div className="text-2xl font-bold mt-1">Quiz de Anamnese</div>

            {/* Botão "Alterar Dados Anteriores" - Aparece quando é cliente retornando */}
            {initialData && currentStep >= 7 && (
              <button
                onClick={() => setCurrentStep(1)}
                className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Alterar Dados Anteriores
              </button>
            )}
          </div>
          <Progress value={progress} className="mt-4 h-2 bg-white/30" />
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {renderStep()}
        </div>

        {/* Footer com botões */}
        <div className="border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            Voltar
          </button>
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${coresTema.gradient} text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
            >
              Avançar
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!formData.aceitaTermo || !formData.assinatura}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              <CheckCircle className="h-5 w-5" />
              {mode === 'remoto' ? 'Gerar Link para Cliente' : 'Finalizar e Salvar'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
