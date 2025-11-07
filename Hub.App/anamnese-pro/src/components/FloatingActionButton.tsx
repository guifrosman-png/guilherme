import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  // Obter cores dinâmicas baseadas na profissão
  const getCoresTema = () => {
    const config = localStorage.getItem('anamneseConfig');
    const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';

    const cores: any = {
      tatuagem: {
        gradient: 'from-pink-500 to-purple-500',
        hover: 'from-pink-600 to-purple-600',
        shadow: 'rgba(236, 72, 153, 0.5)',
      },
      psicologia: {
        gradient: 'from-blue-500 to-cyan-500',
        hover: 'from-blue-600 to-cyan-600',
        shadow: 'rgba(59, 130, 246, 0.5)',
      },
      nutricao: {
        gradient: 'from-green-500 to-emerald-500',
        hover: 'from-green-600 to-emerald-600',
        shadow: 'rgba(34, 197, 94, 0.5)',
      },
      fisioterapia: {
        gradient: 'from-orange-500 to-amber-500',
        hover: 'from-orange-600 to-amber-600',
        shadow: 'rgba(249, 115, 22, 0.5)',
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
    <div className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 md:left-8 md:translate-x-0 z-50">
      <button
        onClick={onClick}
        className={`group relative h-16 w-16 md:h-14 md:w-14 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border-4 md:border-2 border-white overflow-hidden bg-gradient-to-r ${coresTema.gradient} hover:${coresTema.hover}`}
        style={{
          boxShadow: `
            0 0 0 4px hsl(var(--background)),
            0 8px 25px -5px ${coresTema.shadow},
            0 20px 40px -15px ${coresTema.shadow},
            inset 0 2px 0 rgba(255, 255, 255, 0.2)
          `
        }}
        title="Nova Anamnese"
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

        {/* Texto no mobile */}
        <div className="md:hidden absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs font-medium text-gray-600 bg-white/90 px-2 py-1 rounded-full shadow-sm">
            Nova Anamnese
          </span>
        </div>
      </button>
    </div>
  );
}
