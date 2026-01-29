
import { ReactNode } from 'react';
import { Settings, LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface SidebarProps {
  collapsed?: boolean;
  currentPage?: string;
  onPageChange?: (page: string) => void;
  onToggleCollapse?: () => void;
  navigationItems?: NavItem[];
  children?: ReactNode;
}

export function Sidebar({
  collapsed = false,
  currentPage = 'home',
  onPageChange = () => { },
  onToggleCollapse = () => { },
  navigationItems = [],
  children
}: SidebarProps) {
  return (
    <div className={`
      fixed top-4 right-4 bottom-4 z-50
      bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10
      transition-all duration-300 ease-out
      ${collapsed ? 'w-24' : 'w-72'}
    `}>
      {/* Header */}
      <div className={`h-16 flex items-center border-b border-gray-100 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
        {collapsed ? (
          /* Modo Collapsed - S centralizado com hover effect */
          <button
            onClick={onToggleCollapse}
            className="w-10 h-10 rounded-xl hover:bg-[#525a52]/10 transition-all duration-300 flex items-center justify-center group"
          >
            <div className="w-8 h-8 bg-[#525a52] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md relative overflow-hidden">
              {/* S normal */}
              <span className="text-white font-bold text-sm transition-all duration-300 group-hover:opacity-0 group-hover:scale-50">
                S
              </span>

              {/* 3 barrinhas no hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                <div className="w-3 h-0.5 bg-white rounded-full"></div>
                <div className="w-3 h-0.5 bg-white rounded-full"></div>
                <div className="w-3 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
          </button>
        ) : (
          /* Modo Expandido - S + Síndico */
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onToggleCollapse}
              className="w-10 h-10 rounded-xl hover:bg-[#525a52]/10 transition-all duration-300 flex items-center justify-center group flex-shrink-0"
            >
              <div className="w-8 h-8 bg-[#525a52] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md relative overflow-hidden">
                {/* S normal */}
                <span className="text-white font-bold text-sm transition-all duration-300 group-hover:opacity-0 group-hover:scale-50">
                  S
                </span>

                {/* 3 barrinhas no hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                  <div className="w-3 h-0.5 bg-white rounded-full"></div>
                  <div className="w-3 h-0.5 bg-white rounded-full"></div>
                  <div className="w-3 h-0.5 bg-white rounded-full"></div>
                </div>
              </div>
            </button>

            <span className="font-semibold text-gray-900">Síndico</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`
              w-full rounded-xl transition-all duration-300
              relative overflow-hidden group
              ${collapsed
                ? 'flex items-center justify-center p-3'
                : 'flex items-center gap-3 px-3 py-3'
              }
              ${currentPage === item.id
                ? collapsed
                  ? 'bg-transparent'
                  : 'bg-[#525a52]/10 text-[#525a52] shadow-sm'
                : collapsed
                  ? 'text-gray-600 hover:bg-transparent'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {/* Icon Container - Modo Collapsed */}
            {collapsed ? (
              <div className={`
                w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 relative
                ${currentPage === item.id
                  ? 'bg-[#525a52] text-white shadow-lg hover:shadow-xl'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow-md'
                }
                hover:scale-105 group-hover:shadow-2xl
              `}>
                <item.icon className={`
                  h-5 w-5 transition-all duration-300
                  ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'}
                `} />

                {/* Glow effect para o ativo */}
                {currentPage === item.id && (
                  <div className="absolute inset-0 rounded-xl bg-[#525a52]/20 blur-lg opacity-60"></div>
                )}
              </div>
            ) : (
              <>
                {/* Icon Container - Modo Expandido */}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0
                  ${currentPage === item.id
                    ? 'bg-[#525a52] text-white shadow-md'
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <item.icon className="h-5 w-5" />
                </div>

                {/* Label */}
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                </div>
              </>
            )}

            {/* Tooltip para modo collapsed */}
            {collapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/95 backdrop-blur-xl text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10 group-hover:translate-x-1">
                {item.label}
                {/* Arrow */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900/95 rotate-45 border-l border-b border-white/10"></div>
              </div>
            )}

            {/* Active indicator (Apenas expandido ou não? Ajustado para combinar com layout) */}
            {currentPage === item.id && !collapsed && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#525a52] rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4">
        <button className={`
          w-full rounded-xl transition-all duration-300 group relative
          text-gray-600 hover:text-gray-900
          ${collapsed
            ? 'flex items-center justify-center p-3'
            : 'flex items-center gap-3 px-3 py-3 hover:bg-gray-50'
          }
        `}>
          <div className={`
            rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 relative
            ${collapsed
              ? 'w-11 h-11 bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:border-gray-300/60 shadow-md hover:shadow-lg hover:scale-105'
              : 'w-10 h-10 bg-gray-100 hover:bg-gray-200'
            }
          `}>
            <Settings className={`
              transition-all duration-300
              ${collapsed ? 'h-5 w-5 group-hover:scale-110' : 'h-5 w-5'}
            `} />
          </div>

          {!collapsed && <span className="font-medium">Configurações</span>}

          {/* Tooltip para modo collapsed */}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/95 backdrop-blur-xl text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10 group-hover:translate-x-1">
              Configurações
              {/* Arrow */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900/95 rotate-45 border-l border-b border-white/10"></div>
            </div>
          )}
        </button>
      </div>

      {/* Custom content */}
      {children}
    </div>
  );
}
