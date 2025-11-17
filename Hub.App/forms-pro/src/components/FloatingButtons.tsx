import { useState } from 'react';
import { Button } from './ui/button';
import { Plus, Users, FileText, Bell, Settings as SettingsIcon } from 'lucide-react';

interface FloatingButtonsProps {
  onNewAnamnese?: () => void;
  onOpenClientes?: () => void;
  onOpenSettings?: () => void;
  totalClientes?: number;
  anamnesesPendentes?: number;
}

export function FloatingButtons({
  onNewAnamnese,
  onOpenClientes,
  onOpenSettings,
  totalClientes = 0,
  anamnesesPendentes = 0
}: FloatingButtonsProps) {
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleToggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  // Obter cores dinâmicas baseadas na profissão
  const getCoresTema = () => {
    const config = localStorage.getItem('anamneseConfig');
    const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';

    const cores: any = {
      tatuagem: {
        gradient: 'from-pink-500 to-fuchsia-500',
        hover: 'from-pink-600 to-fuchsia-600',
        shadow: 'rgba(236, 72, 153, 0.5)',
      },
      psicologia: {
        gradient: 'from-fuchsia-500 to-pink-600',
        hover: 'from-fuchsia-600 to-pink-700',
        shadow: 'rgba(217, 70, 239, 0.5)',
      },
      nutricao: {
        gradient: 'from-pink-400 to-fuchsia-400',
        hover: 'from-pink-500 to-fuchsia-500',
        shadow: 'rgba(244, 114, 182, 0.5)',
      },
      fisioterapia: {
        gradient: 'from-fuchsia-600 to-pink-700',
        hover: 'from-fuchsia-700 to-pink-800',
        shadow: 'rgba(192, 38, 211, 0.5)',
      },
      estetica: {
        gradient: 'from-pink-500 to-rose-500',
        hover: 'from-pink-600 to-rose-600',
        shadow: 'rgba(236, 72, 153, 0.5)',
      },
      consultoria: {
        gradient: 'from-fuchsia-500 to-purple-600',
        hover: 'from-fuchsia-600 to-purple-700',
        shadow: 'rgba(217, 70, 239, 0.5)',
      },
    };
    return cores[templateProfissao] || cores.tatuagem;
  };

  const coresTema = getCoresTema();

  return (
    <>
      {/* Cluster de botões flutuantes */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 md:bottom-8 md:left-8 md:translate-x-0">

        {/* Botões de ação rápida - aparecem quando o menu está aberto */}
        <div className={`absolute bottom-20 md:bottom-16 left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0 flex flex-col gap-3 transition-all duration-300 ${
          showQuickActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>

          {/* Ver Clientes */}
          {onOpenClientes && (
            <div className="relative group">
              <Button
                size="icon"
                onClick={() => {
                  onOpenClientes();
                  setShowQuickActions(false);
                }}
                className="relative h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <Users className="h-5 w-5" />
                {totalClientes > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{totalClientes > 99 ? '99+' : totalClientes}</span>
                  </div>
                )}
              </Button>
              <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ver Clientes
              </div>
            </div>
          )}

          {/* Anamneses Pendentes */}
          <div className="relative group">
            <Button
              size="icon"
              onClick={() => setShowQuickActions(false)}
              className="relative h-12 w-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <Bell className="h-5 w-5" />
              {anamnesesPendentes > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{anamnesesPendentes > 9 ? '9+' : anamnesesPendentes}</span>
                </div>
              )}
            </Button>
            <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Alertas e Pendências
            </div>
          </div>

          {/* Histórico de Anamneses */}
          <div className="relative group">
            <Button
              size="icon"
              onClick={() => setShowQuickActions(false)}
              className="relative h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
            >
              <FileText className="h-5 w-5" />
            </Button>
            <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Histórico de Anamneses
            </div>
          </div>

          {/* Configurações */}
          {onOpenSettings && (
            <div className="relative group">
              <Button
                size="icon"
                onClick={() => {
                  onOpenSettings();
                  setShowQuickActions(false);
                }}
                className="relative h-12 w-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
              >
                <SettingsIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              </Button>
              <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Configurações
              </div>
            </div>
          )}
        </div>

        {/* FAB Principal */}
        <div className="relative group">
          <Button
            size="icon"
            onClick={onNewAnamnese || (() => {})}
            onContextMenu={(e) => {
              e.preventDefault();
              handleToggleQuickActions();
            }}
            className={`group relative h-16 w-16 md:h-14 md:w-14 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border-4 md:border-2 border-white overflow-hidden ${
              showQuickActions ? 'rotate-45' : ''
            }`}
            style={{
              background: showQuickActions
                ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                : `linear-gradient(135deg, ${coresTema.gradient})`,
              boxShadow: `
                0 0 0 4px hsl(var(--background)),
                0 8px 25px -5px ${coresTema.shadow},
                0 20px 40px -15px ${coresTema.shadow},
                inset 0 2px 0 rgba(255, 255, 255, 0.2)
              `
            }}
          >
            {/* Efeito shimmer premium */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

            {/* Anel pulsante de destaque */}
            <div className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse group-hover:border-white/80 transition-colors duration-300" />

            {/* Overlay interativo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 to-white/0 group-hover:from-white/20 group-hover:to-white/20 group-active:from-white/30 group-active:to-white/30 transition-all duration-200" />

            {/* Indicador de ação premium */}
            <div className="absolute -top-1 -right-1 w-5 h-5 md:w-4 md:h-4 bg-white rounded-full shadow-lg">
              <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
              <div className={`absolute inset-1 bg-gradient-to-r ${coresTema.gradient} rounded-full`}></div>
            </div>

            {/* Ícone principal com depth */}
            <Plus className="h-8 w-8 md:h-6 md:w-6 text-white drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-200" />
          </Button>

          {/* Tooltip desktop */}
          <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="font-medium">
                {showQuickActions ? 'Fechar Menu' : 'Nova Anamnese'}
              </span>
            </div>
            <p className="text-xs text-pink-100 mt-1">
              {showQuickActions ? 'Clique para fechar' : 'Clique para adicionar • Segure para mais opções'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
