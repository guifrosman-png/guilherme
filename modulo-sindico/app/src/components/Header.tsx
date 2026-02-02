import { ReactNode } from 'react';
import { Search, Bell, Settings, Building, Eye, Edit3, ChevronDown, Check } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';
import { useViewMode } from '../contexts/ViewModeContext';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  title?: string;
  rightContent?: ReactNode;
  className?: string;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  notificationCount?: number;
}

export function Header({
  title = "Report",
  rightContent,
  className = '',
  onSearchClick = () => { },
  onNotificationClick = () => { },
  onSettingsClick = () => { },
  notificationCount = 0,
}: HeaderProps) {
  const isMobile = useMobile();
  const { viewMode, setViewMode } = useViewMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`fixed top-4 left-4 z-40 ${className}`}>
      <header className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 h-16 w-full">
        <div className="h-full px-4 flex items-center justify-between w-full">
          {/* Left - Logo e título */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => {
                window.parent.postMessage({ type: 'hubapp:go-home' }, '*');
              }}
              className="w-8 h-8 bg-[#525a52] rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform active:scale-95 text-white"
              title="Voltar ao início"
            >
              <Building className="h-4 w-4" />
            </button>
            <span className="text-lg font-semibold text-gray-900">
              {isMobile ? 'Portal' : 'Portal do Síndico'}
            </span>
          </div>

          {!isMobile && (
            <div className="relative ml-6" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all border
                  ${viewMode === 'owner'
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}
                `}
              >
                {viewMode === 'owner' ? (
                  <>
                    <div className="p-1 bg-blue-100 rounded-md">
                      <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-900">Modo Editor</span>
                  </>
                ) : (
                  <>
                    <div className="p-1 bg-emerald-100 rounded-md">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-emerald-900">Visão Síndico</span>
                  </>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alternar Visualização</span>
                  </div>

                  <button
                    onClick={() => { setViewMode('owner'); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${viewMode === 'owner' ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className={`p-2 rounded-lg ${viewMode === 'owner' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      <Edit3 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${viewMode === 'owner' ? 'text-blue-900' : 'text-gray-700'}`}>Dono da Loja</p>
                      <p className="text-xs text-gray-500">Visualização completa com edição</p>
                    </div>
                    {viewMode === 'owner' && <Check className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => { setViewMode('sindico'); setIsDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${viewMode === 'sindico' ? 'bg-emerald-50/30' : ''}`}
                  >
                    <div className={`p-2 rounded-lg ${viewMode === 'sindico' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                      <Eye className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${viewMode === 'sindico' ? 'text-emerald-900' : 'text-gray-700'}`}>Síndico</p>
                      <p className="text-xs text-gray-500">Visualização somente leitura</p>
                    </div>
                    {viewMode === 'sindico' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Center - Spacer */}
          <div className="flex-1 min-w-0" />

          {/* Right - Botões */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop: rightContent customizado + botões padrão */}
            {!isMobile && rightContent}

            {/* Botões sempre visíveis */}
            <button
              onClick={onSearchClick}
              className="w-10 h-10 bg-white/90 backdrop-blur-lg border border-white/30 rounded-xl shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center"
              title="Buscar"
            >
              <Search className="h-4 w-4 text-slate-600" />
            </button>

            <button
              onClick={onNotificationClick}
              className="relative w-10 h-10 bg-white/90 backdrop-blur-lg border border-white/30 rounded-xl shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center"
              title="Notificações"
            >
              <Bell className="h-4 w-4 text-slate-600" />
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#525a52] text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </div>
              )}
            </button>

            <button
              onClick={onSettingsClick}
              className="w-10 h-10 bg-white/90 backdrop-blur-lg border border-white/30 rounded-xl shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center group"
              title="Configurações"
            >
              <Settings className="h-4 w-4 text-slate-600 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
