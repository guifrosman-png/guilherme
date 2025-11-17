/**
 * Notification Badge - Componente isolado e otimizado
 * Badge de notificação estático para evitar "piscar" e re-renderizações
 */

import { memo } from 'react';

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge = memo(function NotificationBadge({ 
  count, 
  className = "" 
}: NotificationBadgeProps) {
  if (count <= 0) return null;

  return (
    <div className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium shadow-lg ${className}`}>
      <span>
        {count > 99 ? '99+' : count}
      </span>
    </div>
  );
});