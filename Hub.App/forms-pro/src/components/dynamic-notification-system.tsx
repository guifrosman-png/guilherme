/**
 * Dynamic Notification System - Baseado no template E4CEO
 * Sistema de notificações em tempo real para MultiFins
 */

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import { toast } from 'sonner'
import { Bell, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: string
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  // Aliases para compatibilidade
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // ID mais estável
      timestamp: new Date().toISOString()
    }

    setNotifications(prev => {
      // Evitar duplicatas verificando títulos recentes
      const isDuplicate = prev.some(n => 
        n.title === notification.title && 
        new Date().getTime() - new Date(n.timestamp).getTime() < 1000
      );
      
      if (isDuplicate) return prev;
      
      return [newNotification, ...prev.slice(0, 9)]; // Manter apenas 10 notificações
    });
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Memoizar o value do context para evitar re-renderizações desnecessárias
  const contextValue = useMemo(() => ({
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    // Aliases para compatibilidade
    removeNotification: markAsRead,
    clearAllNotifications: clearAll
  }), [notifications, addNotification, markAsRead, clearAll])

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

// Hook para notificações financeiras específicas
export function useFinancialNotifications() {
  const { addNotification } = useNotifications()

  const notifyTransactionAdded = useCallback((amount: number, type: 'income' | 'expense') => {
    addNotification({
      type: type === 'income' ? 'success' : 'info',
      title: type === 'income' ? 'Receita Adicionada' : 'Despesa Adicionada',
      message: `Transação de R$ ${Math.abs(amount).toFixed(2)} registrada`
    })
  }, [addNotification])

  const notifyGoalReached = useCallback((goalName: string) => {
    addNotification({
      type: 'success',
      title: 'Meta Alcançada! 🎉',
      message: `Parabéns! Você atingiu a meta: ${goalName}`
    })
  }, [addNotification])

  const notifyHighExpenses = useCallback((percentage: number) => {
    addNotification({
      type: 'warning',
      title: 'Gastos Elevados',
      message: `Seus gastos estão ${percentage}% acima da média mensal`
    })
  }, [addNotification])

  const notifyImportComplete = useCallback((count: number) => {
    addNotification({
      type: 'success',
      title: 'Importação Concluída',
      message: `${count} transações importadas com sucesso`
    })
  }, [addNotification])

  return useMemo(() => ({
    notifyTransactionAdded,
    notifyGoalReached,
    notifyHighExpenses,
    notifyImportComplete
  }), [notifyTransactionAdded, notifyGoalReached, notifyHighExpenses, notifyImportComplete])
}