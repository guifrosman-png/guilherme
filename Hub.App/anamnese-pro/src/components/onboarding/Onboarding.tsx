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
    descricao: 'Formulários especializados para estúdios de tatuagem',
  },
  {
    id: 'psicologia',
    nome: 'Psicólogo(a)',
    icone: '🧠',
    descricao: 'Formulários completos para consultas psicológicas e terapias',
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
    descricao: 'Formulários de avaliação física e acompanhamento de tratamentos',
  },
  {
    id: 'estetica',
    nome: 'Esteticista',
    icone: '✨',
    descricao: 'Formulários para procedimentos estéticos e cuidados com a pele',
  },
  {
    id: 'consultoria',
    nome: 'Consultoria para Loja Autônomo',
    icone: '💼',
    descricao: 'Cadastro de clientes e gestão de relacionamento para consultores',
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
  ],
  consultoria: [
    {
      id: 'segmento',
      pergunta: 'Qual segmento você atua?',
      opcoes: ['Moda', 'Cosméticos', 'Suplementos', 'Produtos naturais', 'Tecnologia', 'Outro']
    },
    {
      id: 'tipo_atendimento',
      pergunta: 'Como você atende seus clientes?',
      opcoes: ['Presencial', 'Online', 'Domicílio', 'Eventos', 'Todos']
    }
  ]
};

export function Onboarding({ onComplete }: OnboardingProps) {
  const [etapa, setEtapa] = useState(1);
  const [profissaoSelecionada, setProfissaoSelecionada] = useState<string | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string[]>>({});

  const handleSelecionarProfissao = (profissaoId: string) => {
    setProfissaoSelecionada(profissaoId);
    setEtapa(2); // Pula direto para confirmação (não tem mais personalização)
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
                Bem-vindo ao Forms Pro!
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Vamos configurar seu módulo em apenas 2 passos
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
              </div>
            </CardContent>
          </>
        )}

        {/* Etapa 2: Confirmação (antiga etapa 3) */}
        {etapa === 2 && profissaoSelecionada && (
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
                Vamos configurar seus formulários
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
                        <li>• Formulários especializados</li>
                        <li>• Quiz interativo personalizado</li>
                        <li>• Gestão completa de clientes</li>
                        <li>• Envio remoto para clientes</li>
                        <li>• Geração automática de PDF</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setEtapa(1);
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
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
