/**
 * Notification Panel - Painel de notificações flutuante E4CEO
 * Sistema de notificações com glassmorphism para MultiFins
 */

import { useNotifications } from './dynamic-notification-system'
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react'
// Função simples para formatar data sem dependências externas
const formatTimestamp = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Agora';
  }
};

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  sidebarCollapsed?: boolean
}

export function NotificationPanel({ isOpen, onClose, sidebarCollapsed = false }: NotificationPanelProps) {
  const { notifications, markAsRead, clearAll } = useNotifications()

  if (!isOpen) return null

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }



  return (
    <>
      {/* Backdrop invisível - apenas para capturar cliques */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed top-20 z-50 w-96 max-h-[calc(100vh-6rem)] bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden transition-all duration-300 ease-out ${
        sidebarCollapsed 
          ? 'right-32 max-w-[calc(100vw-9rem)]' 
          : 'right-80 max-w-[calc(100vw-21rem)]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            {notifications.length > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Limpar tudo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma notificação</p>
              <p className="text-sm text-gray-400 mt-1">
                Suas notificações aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(notification.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {notification.action && (
                    <div className="mt-3 pl-8">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          notification.action?.onClick()
                          markAsRead(notification.id)
                        }}
                        className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        {notification.action.label}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com ações rápidas */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {notifications.length} notificação{notifications.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={clearAll}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Marcar todas como lidas
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}