/**
 * 🔔 NOTIFICATION TOAST
 * Card visual que desce na tela para mostrar notificações
 */

import { useEffect, useState } from 'react';
import { X, Check, Settings, FileText, UserCheck, AlertCircle, Info } from 'lucide-react';
import { useCoresProfissao } from '../../theme';

interface NotificationToastProps {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  index: number;
}

// Ícones por tipo
const ICONS = {
  success: { icon: Check, emoji: '✅' },
  info: { icon: Info, emoji: 'ℹ️' },
  warning: { icon: AlertCircle, emoji: '⚠️' },
  error: { icon: AlertCircle, emoji: '❌' }
};

// Cores por tipo
const COLORS = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  }
};

export function NotificationToast({
  id,
  type,
  title,
  message,
  timestamp,
  isRead,
  onMarkAsRead,
  onRemove,
  index
}: NotificationToastProps) {
  const cores = useCoresProfissao();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const colors = COLORS[type];
  const IconComponent = ICONS[type].icon;

  // Animação de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  // Calcular tempo relativo
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d atrás`;
    return past.toLocaleDateString('pt-BR');
  };

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(id), 300);
  };

  const handleMarkAsRead = () => {
    if (!isRead) {
      onMarkAsRead(id);
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
        ${isLeaving ? 'translate-x-full' : ''}
        mb-3
      `}
      style={{
        transitionDelay: isVisible ? '0ms' : `${index * 50}ms`
      }}
    >
      <div
        className={`
          relative p-4 rounded-xl border-2 shadow-lg
          ${colors.bg} ${colors.border}
          ${isRead ? 'opacity-60' : 'opacity-100'}
          transition-all duration-200
          hover:shadow-xl hover:scale-[1.02]
          cursor-pointer
        `}
        onClick={handleMarkAsRead}
      >
        {/* Badge de não lida */}
        {!isRead && (
          <div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: cores.primary }}
          />
        )}

        <div className="flex items-start gap-3">
          {/* Ícone */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            <IconComponent className={`h-5 w-5 ${colors.iconColor}`} />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={`font-bold text-sm ${colors.text}`}>
                {title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className={`flex-shrink-0 p-1 rounded-lg hover:bg-white/50 transition-colors ${colors.text}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className={`text-sm ${colors.text} opacity-90 mb-2`}>
              {message}
            </p>

            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs ${colors.text} opacity-70`}>
                {getRelativeTime(timestamp)}
              </span>

              {!isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead();
                  }}
                  className={`text-xs font-semibold ${colors.text} hover:underline`}
                >
                  Marcar como lida
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Indicador de lida */}
        {isRead && (
          <div className={`absolute bottom-2 right-2 flex items-center gap-1 ${colors.text} opacity-50`}>
            <Check className="h-3 w-3" />
            <span className="text-xs">Lida</span>
          </div>
        )}
      </div>
    </div>
  );
}
