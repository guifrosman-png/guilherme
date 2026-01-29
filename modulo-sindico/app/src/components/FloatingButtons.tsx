import { useState, useCallback, useRef, ReactNode, useEffect } from 'react';
import { Plus, X, FileBarChart, FileText, PieChart, LayoutGrid, CreditCard } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';

export interface FloatingAction {
  id: string;
  icon: ReactNode;
  label: string;
  description?: string;
  color: string; // Tailwind gradient classes like "from-blue-500 to-blue-600"
  onClick: () => void;
  badge?: ReactNode;
}

interface FloatingButtonsProps {
  actions?: FloatingAction[];
  onMainClick?: () => void;
  mainButtonLabel?: string;
  position?: 'left' | 'center' | 'right';
  contextModule?: string;
  onCreateReport?: (module: string) => void;
  onCreateCard?: () => void;
}

export function FloatingButtons({
  actions = [],
  onMainClick,
  mainButtonLabel = 'Adicionar',
  position = 'center',
  contextModule = 'all',
  onCreateReport,
  onCreateCard
}: FloatingButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const isMobile = useMobile();

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  const handleMainClick = useCallback(() => {
    if (onMainClick) {
      onMainClick();
    }
  }, [onMainClick]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (actions.length > 0) {
      setIsExpanded(prev => !prev);
    }
  }, [actions.length]);

  const handleTouchStart = useCallback(() => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      if (actions.length > 0) {
        setIsExpanded(prev => !prev);
      }
    }, 400);
  }, [actions.length]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleMobileClick = useCallback(() => {
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }
    if (onMainClick) {
      onMainClick();
    }
  }, [onMainClick]);

  const handleActionClick = useCallback((action: FloatingAction) => {
    action.onClick();
    setIsExpanded(false);
  }, []);

  const getModuleName = () => {
    const names: Record<string, string> = {
      financeiro: 'Financeiro',
      crm: 'CRM',
      vendas: 'Vendas',
      conversas: 'Conversas',
      chamados: 'Chamados',
      slas: 'SLAs',
      all: 'Geral'
    };
    return names[contextModule] || contextModule;
  };

  const handleCreateModuleReport = () => {
    setShowContextMenu(false);
    onCreateReport?.(contextModule);
  };

  const positionClasses = {
    left: 'left-6',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-6'
  };

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 z-[35]"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {showContextMenu && (
        <div
          className="fixed w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 py-1 z-[10001]"
          style={{ left: contextMenuPos.x, top: contextMenuPos.y - 140 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              setShowContextMenu(false);
              onCreateReport?.('financeiro');
            }}
            className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4 text-green-600" />
            Criar relatório Financeiro
          </button>
          {contextModule !== 'financeiro' && (
            <button
              onClick={handleCreateModuleReport}
              className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
            >
              <FileBarChart className="h-4 w-4 text-gray-500" />
              Criar relatório {getModuleName()}
            </button>
          )}
          <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />
          <button
            onClick={() => {
              setShowContextMenu(false);
              onCreateCard?.();
            }}
            className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
          >
            <LayoutGrid className="h-4 w-4 text-orange-500" />
            Criar Novo Card
          </button>
          <button
            onClick={() => {
              setShowContextMenu(false);
              onMainClick?.();
            }}
            className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-blue-500" />
            Criar relatório em branco
          </button>
          <button
            onClick={() => setShowContextMenu(false)}
            className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
          >
            <PieChart className="h-4 w-4 text-purple-500" />
            Criar a partir de template
          </button>
        </div>
      )}

      <div className={`fixed z-40 ${isMobile
        ? `bottom-[4.5rem] ${positionClasses[position]}`
        : 'bottom-8 left-8'
        }`}>

        <div className={`absolute ${isMobile
          ? 'bottom-20 left-1/2 -translate-x-1/2 items-center'
          : 'bottom-[4.5rem] left-1/2 -translate-x-1/2 items-center'
          } flex flex-col gap-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
          {actions.map((action, index) => (
            <div
              key={action.id}
              className={`group relative flex items-center transition-all duration-200 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              style={{
                transitionDelay: isExpanded ? `${index * 40}ms` : '0ms'
              }}
            >
              {!isMobile && (
                <div className="absolute left-full ml-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none -translate-x-2 group-hover:translate-x-0">
                  <div className="bg-gray-900/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                    <span className="font-medium text-sm">{action.label}</span>
                    {action.description && (
                      <p className="text-xs text-gray-300 mt-0.5">{action.description}</p>
                    )}
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 -translate-x-full">
                    <div className="border-8 border-transparent border-r-gray-900/90" />
                  </div>
                </div>
              )}

              <button
                onClick={() => handleActionClick(action)}
                className={`relative h-12 w-12 rounded-full bg-gradient-to-r ${action.color} text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 flex items-center justify-center`}
              >
                {action.icon}
                {action.badge && (
                  <div className="absolute -top-1 -right-1">
                    {action.badge}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={isMobile ? handleMobileClick : handleMainClick}
          onContextMenu={handleContextMenu}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
          onTouchCancel={isMobile ? handleTouchEnd : undefined}
          className={`group relative flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white overflow-hidden ${isMobile ? 'h-16 w-16' : 'h-14 w-14'
            } rounded-full`}
          style={{
            background: isExpanded
              ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            boxShadow: `
              0 8px 25px -5px rgba(16, 185, 129, 0.5),
              0 20px 40px -15px rgba(16, 185, 129, 0.4),
              inset 0 2px 0 rgba(255, 255, 255, 0.2)
            `
          }}
          title={mainButtonLabel}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
          <div className="absolute inset-0 rounded-full border-2 border-emerald-300/40 group-hover:border-emerald-200/60 transition-colors duration-300" />
          <div className={`relative z-10 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}>
            {isExpanded ? (
              <X className={`text-white drop-shadow-lg ${isMobile ? 'h-8 w-8' : 'h-6 w-6'}`} />
            ) : (
              <Plus className={`text-white drop-shadow-lg ${isMobile ? 'h-8 w-8' : 'h-6 w-6'}`} />
            )}
          </div>
        </button>

      </div>
    </>
  );
}
