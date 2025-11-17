/**
 * Desktop Notification Panel - MultiFins
 * Painel de notificações otimizado para desktop usando a mesma engine do mobile
 */

import { useState, useEffect } from 'react'
import { X, Bell, CheckCircle, AlertCircle, Info, AlertTriangle, Clock } from 'lucide-react'
import { useNotifications } from './dynamic-notification-system'
import { motion, AnimatePresence } from 'motion/react'

// Função para formatar timestamp (mesma do mobile)
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

interface DesktopNotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  sidebarCollapsed?: boolean
}

export function DesktopNotificationPanel({ 
  isOpen, 
  onClose, 
  sidebarCollapsed = false 
}: DesktopNotificationPanelProps) {
  const { notifications, markAsRead, clearAll } = useNotifications()

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

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

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop invisível para capturar cliques */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`
          fixed top-20 z-50 w-96 max-h-[70vh] 
          bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl
          notification-panel-aligned
          ${sidebarCollapsed 
            ? 'notification-panel-collapsed max-w-[calc(100vw-3rem)]' 
            : 'notification-panel-expanded max-w-[calc(100vw-21rem)]'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Notificações</h3>
            {notifications.length > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                {notifications.length}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Limpar tudo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Nenhuma notificação</p>
              <p className="text-slate-400 text-sm mt-1">
                Suas notificações aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-all duration-200 cursor-pointer border border-slate-100 group ${
                      index === 0 ? 'ring-1 ring-primary/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 leading-tight">
                          {notification.title}
                        </h4>
                        <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg bg-slate-200/50 hover:bg-slate-300 transition-all flex items-center justify-center"
                      >
                        <X className="h-3 w-3 text-slate-600" />
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-slate-100 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">
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
      </motion.div>
    </>
  )
}