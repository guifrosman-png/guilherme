/**
 * 📚 NOTIFICATION STACK
 * Container que empilha e gerencia múltiplas notificações toast
 */

import { useState, useEffect } from 'react';
import { NotificationToast } from './NotificationToast';
import { Button } from '../ui/button';
import { CheckCheck, Trash2, Bell } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationStackProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'dropdown';
  maxVisible?: number;
}

export function NotificationStack({
  notifications,
  onMarkAsRead,
  onRemove,
  onMarkAllAsRead,
  onClearAll,
  position = 'top-right',
  maxVisible = 5
}: NotificationStackProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  // Atualizar notificações visíveis (mostrar as mais recentes)
  useEffect(() => {
    const sorted = [...notifications].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setVisibleNotifications(sorted.slice(0, maxVisible));
  }, [notifications, maxVisible]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasNotifications = notifications.length > 0;

  // Modo dropdown: sempre mostra, mesmo sem notificações
  const isDropdownMode = position === 'dropdown';

  // Posicionamento fixo na tela
  const positionClasses = {
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'dropdown': '' // Sem posicionamento fixo
  };

  if (!hasNotifications && !isDropdownMode) {
    return null;
  }

  const containerClass = isDropdownMode
    ? 'w-full space-y-3'
    : `fixed ${positionClasses[position]} z-50 w-full max-w-md px-4 pointer-events-none`;

  return (
    <div className={containerClass}>
      <div className="pointer-events-auto space-y-3">
        {/* Header com ações */}
        {hasNotifications && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 mb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  Notificações
                </h3>
                <p className="text-xs text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} não ${unreadCount === 1 ? 'lida' : 'lidas'}` : 'Todas lidas'}
                </p>
              </div>

              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onMarkAllAsRead}
                    className="text-xs"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Ler todas
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClearAll}
                  className="text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stack de notificações */}
        <div className="space-y-3">
          {visibleNotifications.map((notification, index) => (
            <NotificationToast
              key={notification.id}
              {...notification}
              index={index}
              onMarkAsRead={onMarkAsRead}
              onRemove={onRemove}
            />
          ))}
        </div>

        {/* Indicador de mais notificações */}
        {notifications.length > maxVisible && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-3 text-center">
            <p className="text-sm text-gray-600">
              + {notifications.length - maxVisible} {notifications.length - maxVisible === 1 ? 'notificação' : 'notificações'}
            </p>
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:underline mt-1"
            >
              Ver todas
            </button>
          </div>
        )}

        {/* Mensagem quando não há notificações (apenas em dropdown) */}
        {!hasNotifications && isDropdownMode && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 text-center">
            <div className="text-gray-400 mb-2">
              <Bell className="h-12 w-12 mx-auto opacity-50" />
            </div>
            <p className="text-gray-500 font-medium">Nenhuma notificação</p>
            <p className="text-xs text-gray-400 mt-1">Você está em dia! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
