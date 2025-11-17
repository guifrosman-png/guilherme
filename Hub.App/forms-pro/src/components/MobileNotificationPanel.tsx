/**
 * Mobile Notification Panel - Painel otimizado para mobile
 * Top sheet nativo com gestos swipe e UX mobile-first
 * Versão otimizada para evitar "piscar" e re-renderizações desnecessárias
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useNotifications } from './dynamic-notification-system'
import { useMobile } from './ui/use-mobile'
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock, ChevronDown } from 'lucide-react'

// Função para formatar timestamp mobile-friendly
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

interface MobileNotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  sidebarCollapsed?: boolean
}

export function MobileNotificationPanel({ isOpen, onClose, sidebarCollapsed = false }: MobileNotificationPanelProps) {
  const { notifications, markAsRead, clearAll } = useNotifications()
  const isMobile = useMobile()
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragStartY = useRef(0)

  // Memoizar função de ícones para evitar re-renders desnecessários
  const getNotificationIcon = useCallback((type: string) => {
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
  }, [])

  // Memoizar lista de notificações processadas
  const processedNotifications = useMemo(() => {
    return notifications.map((notification, index) => ({
      ...notification,
      isFirst: index === 0,
      formattedTime: formatTimestamp(notification.timestamp)
    }))
  }, [notifications])

  // Debug removido para evitar re-renderizações desnecessárias

  // Gestos de toque para mobile - otimizados com useCallback
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return
    setIsDragging(true)
    dragStartY.current = e.touches[0].clientY
  }, [isMobile])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !isDragging) return
    
    const currentY = e.touches[0].clientY
    const diff = currentY - dragStartY.current
    
    // Para dropdown do topo: permite arrastar para cima (para fechar)
    if (diff < 0) {
      setDragY(diff)
    }
  }, [isMobile, isDragging])

  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !isDragging) return
    
    setIsDragging(false)
    
    // Se arrastou mais que 50px para cima, fecha o painel
    if (dragY < -50) {
      onClose()
    }
    
    setDragY(0)
  }, [isMobile, isDragging, dragY, onClose])

  // Fechar com ESC - otimizado com useCallback
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  // Prevenir scroll do body quando painel está aberto - otimizado
  useEffect(() => {
    if (!isOpen || !isMobile) return
    
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, isMobile])

  if (!isOpen) return null

  // Mobile: Top Dropdown (como notificações nativas)
  if (isMobile) {
    return (
      <>
        {/* Backdrop com blur */}
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
          onClick={onClose}
        />
        
        {/* Top Notification Dropdown */}
        <div 
          ref={panelRef}
          className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-xl border-b border-slate-200 shadow-xl max-h-[70vh] animate-slideInFromTop"
          style={{
            transform: `translateY(${Math.max(dragY, -50)}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top safe area */}
          <div className="h-14 bg-gradient-to-b from-white to-transparent" />
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 bg-white/95">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-700" />
              <h3 className="font-semibold text-slate-900">Notificações</h3>
              {notifications.length > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                  {notifications.length}
                </span>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center"
            >
              <ChevronDown className="h-4 w-4 text-slate-600" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto bg-white" style={{ maxHeight: 'calc(70vh - 100px)' }}>
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Nenhuma notificação</p>
                <p className="text-slate-400 text-sm mt-1">
                  Suas notificações aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {processedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-all duration-200 active:scale-[0.98] cursor-pointer border border-slate-100 ${
                      notification.isFirst ? 'ring-1 ring-primary/20' : ''
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
                          {notification.formattedTime}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(notification.id)
                        }}
                        className="w-7 h-7 rounded-lg bg-slate-200/50 hover:bg-slate-300 transition-colors flex items-center justify-center opacity-60 hover:opacity-100"
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
                          className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
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

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 p-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {notifications.length} notificação{notifications.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearAll}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Limpar tudo
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }

  // Desktop: Mantém o painel lateral original mas otimizado
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed top-20 z-50 w-96 max-h-[calc(100vh-6rem)] bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden notification-panel-aligned ${
        sidebarCollapsed 
          ? 'notification-panel-collapsed max-w-[calc(100vw-3rem)]' 
          : 'notification-panel-expanded max-w-[calc(100vw-21rem)]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-700" />
            <h3 className="font-semibold text-slate-900">Notificações</h3>
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
              <p className="text-slate-500">Nenhuma notificação</p>
              <p className="text-sm text-slate-400 mt-1">
                Suas notificações aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
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
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-200 transition-all"
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
      </div>
    </>
  )
}