import { X, Bell, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  if (!isOpen) return null;

  // Mock de notificações
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Anamnese concluída',
      message: 'João Santos completou a anamnese remota',
      time: '5 min atrás',
    },
    {
      id: 2,
      type: 'info',
      title: 'Nova anamnese pendente',
      message: 'Ana Costa ainda não respondeu',
      time: '2 horas atrás',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end p-4 pt-20 animate-fadeIn">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notificações</h2>
                <p className="text-sm text-gray-600">{notifications.length} novas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Notificações */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{notif.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{notif.message}</div>
                      <div className="text-xs text-gray-400 mt-2">{notif.time}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
