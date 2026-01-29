import { ReactNode } from 'react';
import { Search, Bell, Settings, Building } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';

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
