/**
 * Sidebar Component - Estilo E4CEO
 * Sidebar desktop com navegação avançada e visual moderno
 */

import { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Separator } from '../ui/separator'
import { 
  Home, 
  CreditCard, 
  PiggyBank, 
  BarChart3, 
  Upload, 
  Heart, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  Info,
  Settings,
  Bell,
  User,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Calculator,
  FileText,
  Download,
  Shield,
  Crown
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  currentPage: string
  onPageChange: (page: string) => void
  onToggleCollapse: () => void
  onLoadDemo?: () => void
  onShowWelcome?: () => void
}

// Grupos de navegação organizados
const navigationGroups = [
  {
    id: 'main',
    title: 'Principal',
    items: [
      { id: 'home', name: 'Dashboard', icon: Home, badge: null, color: 'from-blue-500 to-cyan-500' },
      { id: 'transactions', name: 'Transações', icon: CreditCard, badge: null, color: 'from-green-500 to-emerald-500' },
      { id: 'accounts', name: 'Contas', icon: PiggyBank, badge: 'Novo', color: 'from-purple-500 to-pink-500' }
    ]
  },
  {
    id: 'analytics',
    title: 'Análise',
    items: [
      { id: 'results', name: 'Relatórios', icon: BarChart3, badge: null, color: 'from-orange-500 to-red-500' },
      { id: 'health', name: 'Saúde Financeira', icon: Heart, badge: 'IA', color: 'from-red-500 to-pink-500' }
    ]
  },
  {
    id: 'tools',
    title: 'Ferramentas',
    items: [
      { id: 'upload', name: 'Importar Dados', icon: Upload, badge: null, color: 'from-indigo-500 to-purple-500' }
    ]
  }
]

const quickActions = [
  { id: 'demo', name: 'Dados Demo', icon: RefreshCw, action: 'demo' },
  { id: 'welcome', name: 'Tela Inicial', icon: Info, action: 'welcome' },
  { id: 'settings', name: 'Configurações', icon: Settings, action: 'settings' }
]

export function Sidebar({ 
  collapsed, 
  currentPage, 
  onPageChange, 
  onToggleCollapse,
  onLoadDemo,
  onShowWelcome 
}: SidebarProps) {
  const [notifications] = useState(3)

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'demo':
        onLoadDemo?.()
        break
      case 'welcome':
        onShowWelcome?.()
        break
      case 'settings':
        // Implementar configurações
        break
    }
  }

  return (
    <TooltipProvider>
      <aside className={`
        fixed top-4 right-4 h-[calc(100vh-2rem)] 
        bg-white/95 backdrop-blur-xl border border-white/20
        rounded-2xl shadow-2xl shadow-black/10
        transition-all duration-300 ease-in-out z-40
        ${collapsed ? 'w-16' : 'w-72'}
        overflow-hidden
      `}>
        {/* Header da sidebar - Visual E4CEO Flutuante */}
        <div className="relative rounded-t-2xl overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-emerald-600 opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20" />
          
          <div className="relative flex items-center justify-between h-16 px-4 text-white">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-yellow-800" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">MultiFins</span>
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">PRO</Badge>
                  </div>
                  <p className="text-xs text-white/80">Sistema Financeiro Inteligente</p>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
            >
              {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Profile Section - Aparece apenas quando expandido */}
        {!collapsed && (
          <div className="p-4 border-b border-slate-200/50">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-50/80 to-blue-50/80 border border-slate-200/50 backdrop-blur-sm">
              <Avatar className="h-10 w-10 ring-2 ring-primary-500/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-r from-primary-500 to-emerald-500 text-white font-medium">
                  EU
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900">Empreendedor</p>
                <p className="text-xs text-slate-500 truncate">Dashboard PRO Ativo</p>
              </div>
              <div className="relative">
                <Bell className="h-4 w-4 text-slate-400" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                    {notifications}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navegação principal organizada por grupos */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {navigationGroups.map((group) => (
            <div key={group.id}>
              {!collapsed && (
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                  {group.title}
                </h3>
              )}
              
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  
                  const buttonContent = (
                    <Button
                      variant="ghost"
                      size={collapsed ? "icon" : "default"}
                      onClick={() => onPageChange(item.id)}
                      className={`
                        w-full justify-start gap-3 transition-all duration-200 rounded-xl
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary-500 to-emerald-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40' 
                          : 'text-slate-700 hover:bg-white/60 hover:text-slate-900 hover:shadow-sm'
                        }
                        ${collapsed ? 'px-2' : 'px-3'}
                      `}
                    >
                      <div className={`relative ${isActive ? 'animate-pulse' : ''}`}>
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {isActive && (
                          <div className="absolute inset-0 bg-white/20 rounded blur-sm animate-pulse" />
                        )}
                      </div>
                      
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left font-medium">{item.name}</span>
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "secondary" : "outline"} 
                              className={`text-xs ml-auto ${
                                isActive 
                                  ? 'bg-white/20 text-white border-white/30' 
                                  : 'bg-gradient-to-r from-primary-500 to-emerald-500 text-white border-none'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Button>
                  )

                  if (collapsed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          {buttonContent}
                        </TooltipTrigger>
                        <TooltipContent side="left" className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )
                  }

                  return <div key={item.id}>{buttonContent}</div>
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Quick Actions - Estilo E4CEO */}
        <div className="p-4 border-t border-slate-200/50 bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm">
          {!collapsed && (
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Ações Rápidas
            </h4>
          )}
          
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              
              const buttonContent = (
                <Button
                  variant="ghost"
                  size={collapsed ? "icon" : "sm"}
                  onClick={() => handleQuickAction(action.action)}
                  className="w-full justify-start gap-2 text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-sm transition-all duration-200 rounded-xl"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span className="text-sm">{action.name}</span>}
                </Button>
              )

              if (collapsed) {
                return (
                  <Tooltip key={action.id}>
                    <TooltipTrigger asChild>
                      {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      {action.name}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={action.id}>{buttonContent}</div>
            })}
          </div>
        </div>

        {/* Footer - Logo E4CEO Style quando expandido */}
        {!collapsed && (
          <div className="p-4 border-t border-slate-200/50 rounded-b-2xl">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Zap className="h-3 w-3" />
              <span>Powered by E4CEO Technology</span>
            </div>
          </div>
        )}
      </aside>
    </TooltipProvider>
  )
}