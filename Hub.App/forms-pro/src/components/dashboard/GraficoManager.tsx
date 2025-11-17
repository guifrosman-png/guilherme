/**
 * ⚙️ GERENCIADOR DE GRÁFICOS
 * Modal para gerenciar visibilidade dos gráficos do dashboard
 */

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { GraficoConfig } from '../../types/graficos';
import { carregarGraficosPorProfissao, toggleVisibilidadeGrafico } from '../../utils/graficoHelpers';
import { TIPO_GRAFICO_ICONS } from '../../types/graficos';
import { getProfissaoAtual } from '../../theme';

interface GraficoManagerProps {
  onClose: () => void;
  onUpdate: () => void; // Callback para atualizar o dashboard quando mudar algo
}

export function GraficoManager({ onClose, onUpdate }: GraficoManagerProps) {
  const [graficos, setGraficos] = useState<GraficoConfig[]>([]);

  // 🎨 OBTER CORES TEMÁTICAS DA PROFISSÃO
  const getCoresTema = () => {
    const config = localStorage.getItem('anamneseConfig');
    const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';

    const cores: any = {
      tatuagem: {
        gradient: 'from-pink-500 to-purple-500',
        bg50: 'bg-pink-50',
        text500: 'text-pink-500',
        text600: 'text-pink-600',
        border300: 'border-pink-300',
      },
      psicologia: {
        gradient: 'from-blue-500 to-cyan-500',
        bg50: 'bg-blue-50',
        text500: 'text-blue-500',
        text600: 'text-blue-600',
        border300: 'border-blue-300',
      },
      nutricao: {
        gradient: 'from-green-500 to-emerald-500',
        bg50: 'bg-green-50',
        text500: 'text-green-500',
        text600: 'text-green-600',
        border300: 'border-green-300',
      },
      fisioterapia: {
        gradient: 'from-orange-500 to-amber-500',
        bg50: 'bg-orange-50',
        text500: 'text-orange-500',
        text600: 'text-orange-600',
        border300: 'border-orange-300',
      },
      estetica: {
        gradient: 'from-purple-500 to-fuchsia-500',
        bg50: 'bg-purple-50',
        text500: 'text-purple-500',
        text600: 'text-purple-600',
        border300: 'border-purple-300',
      },
      consultoria: {
        gradient: 'from-indigo-500 to-purple-500',
        bg50: 'bg-indigo-50',
        text500: 'text-indigo-500',
        text600: 'text-indigo-600',
        border300: 'border-indigo-300',
      },
    };
    return cores[templateProfissao] || cores.tatuagem;
  };

  const coresTema = getCoresTema();

  // Carregar gráficos quando o componente aparecer
  useEffect(() => {
    carregarGraficos();
  }, []);

  // Função para carregar gráficos do localStorage (filtrados por profissão)
  const carregarGraficos = () => {
    const profissaoAtual = getProfissaoAtual();
    const configs = carregarGraficosPorProfissao(profissaoAtual);
    // Ordenar por ordem
    configs.sort((a, b) => a.ordem - b.ordem);
    setGraficos(configs);
  };

  // Função para alternar visibilidade de um gráfico
  const handleToggleVisibilidade = (id: string) => {
    toggleVisibilidadeGrafico(id);
    carregarGraficos(); // Recarregar lista
    onUpdate(); // Notificar o dashboard para atualizar
  };

  // Separar gráficos por categoria
  const graficosPadrao = graficos.filter(g => g.categoria === 'padrao');
  const graficosCustomizados = graficos.filter(g => g.categoria === 'customizado');

  // Contar quantos estão visíveis
  const totalVisiveis = graficos.filter(g => g.visivel).length;
  const totalGraficos = graficos.length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${coresTema.gradient} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8" />
              <h2 className="text-3xl font-bold">Gerenciar Gráficos</h2>
            </div>
            <p className="text-sm opacity-90">
              Controle quais gráficos aparecem no seu dashboard
            </p>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>
                {totalVisiveis} de {totalGraficos} gráficos visíveis
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {/* Mensagem se não houver gráficos */}
          {graficos.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum gráfico encontrado
              </h3>
              <p className="text-sm text-gray-500">
                Os gráficos serão criados automaticamente conforme você adiciona perguntas aos templates
              </p>
            </div>
          )}

          {/* Gráficos Padrão */}
          {graficosPadrao.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-1 h-6 ${coresTema.bg50} rounded`}></div>
                <h3 className={`text-xl font-bold ${coresTema.text600}`}>
                  Gráficos Padrão
                </h3>
                <span className="text-sm text-gray-500">
                  ({graficosPadrao.filter(g => g.visivel).length}/{graficosPadrao.length} visíveis)
                </span>
              </div>

              <div className="space-y-3">
                {graficosPadrao.map(grafico => (
                  <GraficoItem
                    key={grafico.id}
                    grafico={grafico}
                    onToggle={handleToggleVisibilidade}
                    coresTema={coresTema}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gráficos Customizados */}
          {graficosCustomizados.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-1 h-6 ${coresTema.bg50} rounded`}></div>
                <h3 className={`text-xl font-bold ${coresTema.text600}`}>
                  Gráficos Customizados
                </h3>
                <span className="text-sm text-gray-500">
                  ({graficosCustomizados.filter(g => g.visivel).length}/{graficosCustomizados.length} visíveis)
                </span>
              </div>

              <div className="space-y-3">
                {graficosCustomizados.map(grafico => (
                  <GraficoItem
                    key={grafico.id}
                    grafico={grafico}
                    onToggle={handleToggleVisibilidade}
                    coresTema={coresTema}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end bg-gray-50">
          <Button onClick={onClose} className={`bg-gradient-to-r ${coresTema.gradient}`}>
            Concluído
          </Button>
        </div>
      </div>
    </div>
  );
}

// ========== COMPONENTE DE ITEM DE GRÁFICO ==========

interface GraficoItemProps {
  grafico: GraficoConfig;
  onToggle: (id: string) => void;
  coresTema: any;
}

function GraficoItem({ grafico, onToggle, coresTema }: GraficoItemProps) {
  const icone = TIPO_GRAFICO_ICONS[grafico.tipoGrafico];

  return (
    <Card className={`transition-all ${grafico.visivel ? 'border-2 border-gray-200' : 'border-2 border-dashed border-gray-300 opacity-60'}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Informações do gráfico */}
          <div className="flex items-start gap-3 flex-1">
            {/* Ícone do tipo de gráfico */}
            <div className={`w-12 h-12 rounded-xl ${grafico.visivel ? coresTema.bg50 : 'bg-gray-100'} flex items-center justify-center text-2xl flex-shrink-0`}>
              {icone}
            </div>

            {/* Título e descrição */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {grafico.titulo}
                </h4>
                {grafico.categoria === 'padrao' && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium flex-shrink-0">
                    Padrão
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 line-clamp-1">
                {grafico.descricao}
              </p>
            </div>
          </div>

          {/* Botão de toggle */}
          <Button
            size="sm"
            variant={grafico.visivel ? 'outline' : 'default'}
            onClick={() => onToggle(grafico.id)}
            className="flex items-center gap-2 flex-shrink-0"
          >
            {grafico.visivel ? (
              <>
                <EyeOff className="h-4 w-4" />
                Ocultar
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Mostrar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
