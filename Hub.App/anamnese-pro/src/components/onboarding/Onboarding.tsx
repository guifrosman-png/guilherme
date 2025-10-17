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

export function Onboarding({ onComplete }: OnboardingProps) {
  const [etapa, setEtapa] = useState(1);
  const [profissaoSelecionada, setProfissaoSelecionada] = useState<string | null>(null);

  const handleSelecionarProfissao = (profissaoId: string) => {
    setProfissaoSelecionada(profissaoId);
    setEtapa(2);
  };

  const handleConcluir = () => {
    if (profissaoSelecionada) {
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

        {/* Etapa 2: Confirmação */}
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

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setProfissaoSelecionada(null);
                    setEtapa(1);
                  }}
                >
                  ← Voltar
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  onClick={handleConcluir}
                >
                  Começar a Usar! 🚀
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-6 border-t mt-6">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-pink-500"></div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
