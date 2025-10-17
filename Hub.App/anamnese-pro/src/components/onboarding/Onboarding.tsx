import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface OnboardingProps {
  onComplete: (templateProfissao: string) => void;
}

const PROFISSOES = [
  {
    id: 'tatuagem',
    nome: 'Tatuador(a)',
    icone: '🎨',
    descricao: 'Fichas de anamnese especializadas para estúdios de tatuagem',
  },
  {
    id: 'psicologia',
    nome: 'Psicólogo(a)',
    icone: '🧠',
    descricao: 'Anamnese completa para consultas psicológicas e terapias',
  },
  {
    id: 'nutricao',
    nome: 'Nutricionista',
    icone: '🥗',
    descricao: 'Avaliação nutricional detalhada e planejamento alimentar',
  },
  {
    id: 'fisioterapia',
    nome: 'Fisioterapeuta',
    icone: '💪',
    descricao: 'Fichas de avaliação física e acompanhamento de tratamentos',
  },
  {
    id: 'estetica',
    nome: 'Esteticista',
    icone: '✨',
    descricao: 'Anamnese para procedimentos estéticos e cuidados com a pele',
  },
];

// Perguntas específicas por profissão
const PERGUNTAS_PROFISSAO: Record<string, Array<{ id: string; pergunta: string; opcoes: string[] }>> = {
  tatuagem: [
    {
      id: 'estilo',
      pergunta: 'Qual seu estilo principal de tatuagem?',
      opcoes: ['Realista', 'Old School', 'Aquarela', 'Minimalista', 'Geométrica', 'Oriental', 'Outro']
    },
    {
      id: 'servicos',
      pergunta: 'Quais serviços você oferece?',
      opcoes: ['Tatuagem', 'Cover-up', 'Piercing', 'Remoção a laser', 'Micropigmentação']
    }
  ],
  psicologia: [
    {
      id: 'abordagem',
      pergunta: 'Qual sua abordagem terapêutica principal?',
      opcoes: ['TCC', 'Psicanálise', 'Gestalt', 'Humanista', 'Sistêmica', 'Outra']
    },
    {
      id: 'publico',
      pergunta: 'Qual público você atende?',
      opcoes: ['Infantil', 'Adolescente', 'Adulto', 'Idoso', 'Todos']
    }
  ],
  nutricao: [
    {
      id: 'especialidade',
      pergunta: 'Qual sua área de especialidade?',
      opcoes: ['Esportiva', 'Clínica', 'Emagrecimento', 'Vegetariana/Vegana', 'Materno-Infantil', 'Outra']
    },
    {
      id: 'servicos',
      pergunta: 'Quais serviços você oferece?',
      opcoes: ['Consulta nutricional', 'Avaliação física', 'Prescrição de dieta', 'Suplementação', 'Todos']
    }
  ],
  fisioterapia: [
    {
      id: 'area',
      pergunta: 'Qual sua área de atuação principal?',
      opcoes: ['Ortopédica', 'Neurológica', 'Esportiva', 'RPG', 'Pilates', 'Outra']
    },
    {
      id: 'atendimento',
      pergunta: 'Tipo de atendimento que você faz?',
      opcoes: ['Clínica', 'Domiciliar', 'Hospitalar', 'Todos']
    }
  ],
  estetica: [
    {
      id: 'tipo',
      pergunta: 'Qual tipo de estética você trabalha?',
      opcoes: ['Facial', 'Corporal', 'Ambos']
    },
    {
      id: 'procedimentos',
      pergunta: 'Principais procedimentos que oferece?',
      opcoes: ['Limpeza de pele', 'Peeling', 'Massagem', 'Drenagem', 'Tratamentos a laser', 'Outros']
    }
  ]
};

export function Onboarding({ onComplete }: OnboardingProps) {
  const [etapa, setEtapa] = useState(1);
  const [profissaoSelecionada, setProfissaoSelecionada] = useState<string | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string[]>>({});

  const handleSelecionarProfissao = (profissaoId: string) => {
    setProfissaoSelecionada(profissaoId);
    setEtapa(2);
  };

  const handleRespostaChange = (perguntaId: string, opcao: string) => {
    setRespostas(prev => {
      const respostasAtuais = prev[perguntaId] || [];
      const jaExiste = respostasAtuais.includes(opcao);

      return {
        ...prev,
        [perguntaId]: jaExiste
          ? respostasAtuais.filter(r => r !== opcao)
          : [...respostasAtuais, opcao]
      };
    });
  };

  const handleAvancarParaConfirmacao = () => {
    setEtapa(3);
  };

  const handleConcluir = () => {
    if (profissaoSelecionada) {
      // Salvar respostas no localStorage junto com a configuração
      const configuracao = {
        templateProfissao: profissaoSelecionada,
        personalizacao: respostas,
        dataConfiguracao: new Date().toISOString(),
        onboardingConcluido: true,
      };
      localStorage.setItem('anamneseConfig', JSON.stringify(configuracao));

      onComplete(profissaoSelecionada);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        {/* Etapa 1: Boas-vindas */}
        {etapa === 1 && (
          <>
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">👋</span>
              </div>
              <CardTitle className="text-3xl text-gray-900 mb-2">
                Bem-vindo ao Anamnese Pro!
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Vamos configurar seu módulo em apenas 3 passos
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Qual é sua profissão?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PROFISSOES.map((profissao) => (
                    <button
                      key={profissao.id}
                      onClick={() => handleSelecionarProfissao(profissao.id)}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all text-left group"
                    >
                      <div className="text-4xl mb-3">{profissao.icone}</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {profissao.nome}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {profissao.descricao}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-6 border-t">
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            </CardContent>
          </>
        )}

        {/* Etapa 2: Perguntas Específicas */}
        {etapa === 2 && profissaoSelecionada && (
          <>
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">
                  {PROFISSOES.find(p => p.id === profissaoSelecionada)?.icone}
                </span>
              </div>
              <CardTitle className="text-3xl text-gray-900 mb-2">
                Personalize seu Atendimento
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Responda algumas perguntas para personalizar sua experiência
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-8 mb-8">
                {PERGUNTAS_PROFISSAO[profissaoSelecionada]?.map((pergunta, index) => (
                  <div key={pergunta.id}>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {index + 1}. {pergunta.pergunta}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {pergunta.opcoes.map((opcao) => {
                        const isSelected = respostas[pergunta.id]?.includes(opcao);
                        return (
                          <button
                            key={opcao}
                            onClick={() => handleRespostaChange(pergunta.id, opcao)}
                            className={`p-4 border-2 rounded-xl transition-all text-left ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{opcao}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  💡 <strong>Dica:</strong> Você pode selecionar várias opções! Isso ajudará a personalizar seu sistema.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEtapa(1);
                    setRespostas({});
                  }}
                >
                  ← Voltar
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={handleAvancarParaConfirmacao}
                >
                  Continuar →
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-6 border-t mt-6">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            </CardContent>
          </>
        )}

        {/* Etapa 3: Confirmação */}
        {etapa === 3 && profissaoSelecionada && (
          <>
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">
                  {PROFISSOES.find(p => p.id === profissaoSelecionada)?.icone}
                </span>
              </div>
              <CardTitle className="text-3xl text-gray-900 mb-2">
                Perfeito!
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Vamos configurar seu template de anamnese
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {PROFISSOES.find(p => p.id === profissaoSelecionada)?.icone}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {PROFISSOES.find(p => p.id === profissaoSelecionada)?.nome}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {PROFISSOES.find(p => p.id === profissaoSelecionada)?.descricao}
                    </p>
                    <div className="bg-white border border-pink-200 rounded-lg p-4">
                      <h5 className="font-semibold text-gray-900 mb-2">✅ O que você terá:</h5>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Fichas de anamnese especializadas</li>
                        <li>• Quiz interativo personalizado</li>
                        <li>• Gestão completa de clientes</li>
                        <li>• Envio de anamnese remota</li>
                        <li>• Geração automática de PDF</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mostrar resumo das personalizações */}
              {Object.keys(respostas).length > 0 && (
                <div className="bg-white border-2 border-green-200 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3">📋 Suas Personalizações:</h5>
                  <div className="space-y-2">
                    {Object.entries(respostas).map(([perguntaId, opcoes]) => {
                      const pergunta = PERGUNTAS_PROFISSAO[profissaoSelecionada]?.find(p => p.id === perguntaId);
                      return opcoes.length > 0 && (
                        <div key={perguntaId} className="text-sm">
                          <strong className="text-gray-700">{pergunta?.pergunta}</strong>
                          <p className="text-gray-600 ml-2">→ {opcoes.join(', ')}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEtapa(2);
                  }}
                >
                  ← Voltar
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={handleConcluir}
                >
                  Começar a Usar! 🚀
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-6 border-t mt-6">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
