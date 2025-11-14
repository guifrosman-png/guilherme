/**
 * E4CEO Design System - Forms Pro Edition
 * Sistema de design baseado no E4CEO adaptado para o Forms Pro
 */

import { useState, ReactNode, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Filter,
  Search,
  Bell,
  ChevronDown,
  Plus,
  BarChart3,
  Layout
} from 'lucide-react'
import { useCoresProfissao } from './theme'

// ==================== HOOKS ====================

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}

// ==================== NAVIGATION COMPONENTS ====================

interface SidebarProps {
  collapsed?: boolean
  currentPage?: string
  onPageChange?: (page: string) => void
  onToggleCollapse?: () => void
  children?: ReactNode
}

export function E4CEOSidebar({
  collapsed = false,
  currentPage = 'anamnese',
  onPageChange = () => {},
  onToggleCollapse = () => {},
  children
}: SidebarProps) {
  const cores = useCoresProfissao();

  const navigationItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'anamnese', icon: FileText, label: 'Anamnese' },
    { id: 'clientes', icon: Users, label: 'Clientes' },
    { id: 'templates', icon: Layout, label: 'Templates' }
  ]

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
          <button
            onClick={onToggleCollapse}
            className={`w-10 h-10 rounded-xl ${cores.bg500}/10 transition-all duration-300 flex items-center justify-center group`}
            style={{ backgroundColor: `${cores.primary}10` }}
          >
            <div className={`w-8 h-8 bg-gradient-to-br ${cores.bg500} ${cores.bg600} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md relative overflow-hidden`}
              style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}>
              <span className="text-white font-bold text-sm transition-all duration-300 group-hover:opacity-0 group-hover:scale-50">
                A
              </span>

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                <div className="w-3 h-0.5 bg-white rounded-full"></div>
                <div className="w-3 h-0.5 bg-white rounded-full"></div>
                <div className="w-3 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onToggleCollapse}
              className="w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center group flex-shrink-0"
              style={{ backgroundColor: `${cores.primary}10` }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${cores.primary}10`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md"
                style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}>
                <span className="text-white font-bold text-sm">F</span>
              </div>
            </button>

            <span className="font-semibold text-gray-900">Forms Pro</span>
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
                  : `${cores.bg50} ${cores.text600} shadow-sm`
                : collapsed
                  ? 'text-gray-600 hover:bg-transparent'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {collapsed ? (
              <div className={`
                w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 relative
                ${currentPage === item.id
                  ? `text-white shadow-lg hover:shadow-xl`
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200/60 text-gray-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 hover:border-gray-300/60 hover:text-gray-800 shadow-md hover:shadow-lg'
                }
                hover:scale-105 group-hover:shadow-2xl
              `}
              style={currentPage === item.id ? { background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` } : {}}>
                <item.icon className={`
                  h-5 w-5 transition-all duration-300
                  ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'}
                `} />

                {currentPage === item.id && (
                  <div className="absolute inset-0 rounded-xl blur-lg opacity-60" style={{ backgroundColor: `${cores.primary}33` }}></div>
                )}
              </div>
            ) : (
              <>
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0
                  ${currentPage === item.id
                    ? `${cores.bg500} text-white shadow-md`
                    : 'bg-gray-100 group-hover:bg-gray-200'
                  }
                `}>
                  <item.icon className="h-5 w-5" />
                </div>

                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                </div>
              </>
            )}

            {collapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/95 backdrop-blur-xl text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10 group-hover:translate-x-1">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900/95 rotate-45 border-l border-b border-white/10"></div>
              </div>
            )}

            {currentPage === item.id && (
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 ${cores.bg500} rounded-r-full`} />
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

          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900/95 backdrop-blur-xl text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl border border-white/10 group-hover:translate-x-1">
              Configurações
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900/95 rotate-45 border-l border-b border-white/10"></div>
            </div>
          )}
        </button>
      </div>

      {children}
    </div>
  )
}

interface MobileTabBarProps {
  currentPage?: string
  onPageChange?: (page: string) => void
  className?: string
}

export function E4CEOMobileTabBar({
  currentPage = 'anamnese',
  onPageChange = () => {},
  className = ''
}: MobileTabBarProps) {
  const cores = useCoresProfissao();

  const tabItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'anamnese', icon: FileText, label: 'Anamnese' },
    { id: 'clientes', icon: Users, label: 'Clientes' },
    { id: 'templates', icon: Layout, label: 'Templates' }
  ]

  return (
    <div className={`
      fixed bottom-6 left-4 right-4 z-50
      ${className}
    `}>
      <div className="relative">
        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 flex items-center justify-between px-4 py-2 h-16">

          <div className="flex flex-1 justify-around">
            {tabItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300
                  min-w-[64px] relative overflow-hidden
                  ${currentPage === item.id
                    ? 'text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
                style={currentPage === item.id
                  ? { background: cores.primary, animationDelay: `${index * 0.1}s` }
                  : { animationDelay: `${index * 0.1}s` }
                }
              >
                <div className={`
                  w-6 h-6 flex items-center justify-center transition-all duration-200
                  ${currentPage === item.id ? 'scale-110' : ''}
                `}>
                  <item.icon className="h-5 w-5" />
                </div>

                <span className="text-xs font-medium leading-tight">
                  {item.label}
                </span>

                {currentPage === item.id && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-10 animate-pulse"
                    style={{ backgroundColor: cores.primary }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== HEADER COMPONENTS ====================

interface HeaderProps {
  title?: string
  rightContent?: ReactNode
  showSearch?: boolean
  showNotifications?: boolean
  className?: string
  onNotificationClick?: () => void
  onSettingsClick?: () => void
  hasNotifications?: boolean
  notificationCount?: number
  onSearchClick?: () => void
}

export function E4CEOHeader({
  title = "Forms Pro",
  rightContent,
  showSearch = true,
  showNotifications = true,
  className = '',
  onNotificationClick = () => {},
  onSettingsClick = () => {},
  hasNotifications = false,
  notificationCount = 0,
  onSearchClick = () => {}
}: HeaderProps) {
  const cores = useCoresProfissao();
  const isMobile = useMobile();

  return (
    <div className={`fixed top-4 left-4 z-40 ${className}`}>
      <header className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 h-16 w-full">
        <div className="h-full px-4 flex items-center justify-between w-full">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}
            >
              <span className="text-white font-bold text-sm">🌸</span>
            </div>
            {!isMobile && (
              <span className="text-lg font-semibold text-gray-900">{title}</span>
            )}
            {isMobile && (
              <span className="text-lg font-semibold text-gray-900">Forms Pro</span>
            )}
          </div>

          <div className="flex-1 min-w-0"></div>

          <div className="flex items-center gap-2 flex-shrink-0 header-buttons-fixed">
            {isMobile && (
              <>
                <button
                  onClick={onSearchClick}
                  className="w-10 h-10 bg-white/90 backdrop-blur-lg border border-white/30 rounded-xl shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center group flex-shrink-0"
                  title="Buscar"
                >
                  <Search className="h-4 w-4 text-slate-600 group-hover:text-slate-800" />
                </button>

                <button
                  onClick={onNotificationClick}
                  className="relative w-10 h-10 bg-white/90 backdrop-blur-lg border border-white/30 rounded-xl shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center group flex-shrink-0"
                  title={`Notificações${notificationCount > 0 ? ` (${notificationCount})` : ''}`}
                >
                  <Bell className="h-4 w-4 text-slate-600 group-hover:text-slate-800" />

                  {hasNotifications && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                      <div className="relative w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                  )}

                  {notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </div>
                  )}
                </button>

                <button
                  onClick={onSettingsClick}
                  className="w-10 h-10 bg-white/90 backdrop-blur-lg border border-white/30 rounded-xl shadow-md hover:shadow-lg hover:bg-white transition-all duration-200 flex items-center justify-center group flex-shrink-0"
                  title="Configurações"
                >
                  <Settings className="h-4 w-4 text-slate-600 group-hover:text-slate-800 group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </>
            )}

            {!isMobile && rightContent}
          </div>
        </div>
      </header>

      {isMobile && (
        <div className="mt-6">
          <div className="px-4">
            <h1 className="hidden sm:block text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== LAYOUT COMPONENTS ====================

interface DashboardLayoutProps {
  currentPage?: string
  onPageChange?: (page: string) => void
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  title?: string
  rightContent?: ReactNode
  children?: ReactNode
  onNotificationClick?: () => void
  onSettingsClick?: () => void
  hasNotifications?: boolean
  notificationCount?: number
  onSearchClick?: () => void
}

export function E4CEODashboardLayout({
  currentPage = 'anamnese',
  onPageChange = () => {},
  sidebarCollapsed = false,
  onToggleSidebar = () => {},
  title = "Forms Pro",
  rightContent,
  children,
  onNotificationClick = () => {},
  onSettingsClick = () => {},
  hasNotifications = false,
  notificationCount = 0,
  onSearchClick = () => {}
}: DashboardLayoutProps) {
  const cores = useCoresProfissao();

  return (
    <div className="min-h-screen bg-gradient-to-br" style={{
      background: `linear-gradient(to bottom right, ${cores.primary}08, ${cores.secondary}08)`
    }}>
      {/* Desktop Layout */}
      <div className="hidden md:block h-screen">
        <E4CEOHeader
          title={title}
          rightContent={rightContent}
          onSearchClick={onSearchClick}
          className={`
            transition-all duration-300 ease-out
            ${sidebarCollapsed ? 'right-32' : 'right-80'}
          `}
        />

        <main className={`
          h-screen overflow-auto pt-24 p-6
          transition-all duration-300 ease-out
          ${sidebarCollapsed ? 'pr-36' : 'pr-80'}
        `}>
          <div className="w-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

        <E4CEOSidebar
          collapsed={sidebarCollapsed}
          currentPage={currentPage}
          onPageChange={onPageChange}
          onToggleCollapse={onToggleSidebar}
        />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen pb-28">
        <E4CEOHeader
          title={title}
          showSearch={false}
          className="left-4 right-4 top-4"
          onNotificationClick={onNotificationClick}
          onSettingsClick={onSettingsClick}
          hasNotifications={hasNotifications}
          notificationCount={notificationCount}
          onSearchClick={onSearchClick}
        />

        <main className="p-4 pt-24">
          {children}
        </main>

        <E4CEOMobileTabBar
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>

    </div>
  )
}

