import { useState } from 'react';
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
  aceitaTermo: boolean;
  assinatura: string;
}

interface QuizContainerProps {
  mode: 'presencial' | 'remoto';
  onComplete: (data: QuizData) => void;
  onClose: () => void;
}

export function QuizContainer({ mode, onComplete, onClose }: QuizContainerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuizData>>({});

  const totalSteps = 8;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
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
    7: { icon: ImageIcon, color: 'text-pink-500', bg: 'bg-pink-50' },
    8: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  };

  const StepIcon = stepConfig[currentStep as keyof typeof stepConfig].icon;
  const iconColor = stepConfig[currentStep as keyof typeof stepConfig].color;
  const iconBg = stepConfig[currentStep as keyof typeof stepConfig].bg;

  // Renderizar etapa atual
  const renderStep = () => {
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
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                value={formData.nomeCompleto || ''}
                onChange={(e) => updateFormData({ nomeCompleto: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="Data de nascimento"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                  value={formData.dataNascimento || ''}
                  onChange={(e) => updateFormData({ dataNascimento: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="CPF"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                  value={formData.cpf || ''}
                  onChange={(e) => updateFormData({ cpf: e.target.value })}
                />
              </div>
              <input
                type="text"
                placeholder="RG"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                value={formData.rg || ''}
                onChange={(e) => updateFormData({ rg: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Telefone"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                value={formData.telefone || ''}
                onChange={(e) => updateFormData({ telefone: e.target.value })}
              />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                value={formData.email || ''}
                onChange={(e) => updateFormData({ email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Endereço completo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                value={formData.endereco || ''}
                onChange={(e) => updateFormData({ endereco: e.target.value })}
              />
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
                      ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">{option.value}</div>
                </button>
              ))}
            </div>
            {formData.comoConheceu === 'Outro' && (
              <input
                type="text"
                placeholder="Especifique..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors mt-4"
                value={formData.outraOrigem || ''}
                onChange={(e) => updateFormData({ outraOrigem: e.target.value })}
              />
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors min-h-[100px] resize-none"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors min-h-[100px] resize-none"
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
                      ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-sm font-medium text-gray-900">Sim, tenho</div>
                </button>
                <button
                  onClick={() => updateFormData({ temAlergias: false, alergias: '' })}
                  className={`px-6 py-4 rounded-xl border-2 transition-all ${
                    formData.temAlergias === false
                      ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-pink-300'
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors min-h-[100px] resize-none"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors min-h-[120px] resize-none"
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
                      ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-sm font-medium text-gray-900">Sim, já fiz</div>
                </button>
                <button
                  onClick={() => updateFormData({ temTatuagem: false, historicoTatuagens: '' })}
                  className={`px-6 py-4 rounded-xl border-2 transition-all ${
                    formData.temTatuagem === false
                      ? 'border-pink-500 bg-pink-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-pink-300'
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors min-h-[100px] resize-none"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                  value={formData.localTatuagem || ''}
                  onChange={(e) => updateFormData({ localTatuagem: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual o tamanho aproximado?
                </label>
                <select
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                  value={formData.estiloTatuagem || ''}
                  onChange={(e) => updateFormData({ estiloTatuagem: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 8:
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
              <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
                <input
                  type="checkbox"
                  id="termo"
                  checked={formData.aceitaTermo || false}
                  onChange={(e) => updateFormData({ aceitaTermo: e.target.checked })}
                  className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors font-signature text-xl"
                  value={formData.assinatura || ''}
                  onChange={(e) => updateFormData({ assinatura: e.target.value })}
                  style={{ fontFamily: 'cursive' }}
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
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 relative">
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
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
