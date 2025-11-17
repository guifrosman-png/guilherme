/**
 * 🚨 MODAL DE CONFIRMAÇÃO GLOBAL
 * Componente reutilizável para confirmação de ações destrutivas
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './card';
import { Button } from './button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  confirmText = 'Excluir',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                type === 'danger' ? 'bg-red-100' : 'bg-orange-100'
              }`}>
                <AlertTriangle className={`h-6 w-6 ${
                  type === 'danger' ? 'text-red-600' : 'text-orange-600'
                }`} />
              </div>
              <div>
                <CardTitle className="text-gray-900">{title}</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Esta ação não pode ser desfeita
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Mensagem Principal */}
          <p className="text-gray-700">
            {message}
          </p>

          {/* Nome do Item (se fornecido) */}
          {itemName && (
            <div className={`p-4 rounded-lg border-2 ${
              type === 'danger' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
            }`}>
              <p className={`font-bold ${
                type === 'danger' ? 'text-red-900' : 'text-orange-900'
              }`}>
                {itemName}
              </p>
            </div>
          )}

          {/* Aviso Adicional para Perda de Dados */}
          <div className={`p-3 rounded-lg ${
            type === 'danger' ? 'bg-red-50' : 'bg-orange-50'
          }`}>
            <p className={`text-sm font-medium ${
              type === 'danger' ? 'text-red-800' : 'text-orange-800'
            }`}>
              ⚠️ Todos os dados serão perdidos permanentemente.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              className={`flex-1 text-white ${
                type === 'danger'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
