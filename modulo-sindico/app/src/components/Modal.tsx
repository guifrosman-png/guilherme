import { ReactNode, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true
}: ModalProps) {
  const isMobile = useMobile();

  // Fechar com ESC
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]'
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`
            pointer-events-auto
            w-full ${sizeClasses[size]}
            ${isMobile && size !== 'full' ? 'max-h-[85vh]' : ''}
            bg-white rounded-2xl shadow-2xl
            flex flex-col
            animate-modalSlideUp
            overflow-hidden
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex-1 pr-4">
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 -m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Componentes auxiliares para composição
interface ModalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
}

export function ModalButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = ''
}: ModalButtonProps) {
  const baseClasses = 'px-4 py-2.5 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Footer pré-configurado com botões padrão
interface ModalFooterProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmDisabled?: boolean;
  confirmVariant?: 'primary' | 'danger';
}

export function ModalFooter({
  onCancel,
  onConfirm,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  confirmDisabled = false,
  confirmVariant = 'primary'
}: ModalFooterProps) {
  return (
    <div className="flex gap-3 justify-end">
      {onCancel && (
        <ModalButton variant="secondary" onClick={onCancel}>
          {cancelText}
        </ModalButton>
      )}
      {onConfirm && (
        <ModalButton
          variant={confirmVariant}
          onClick={onConfirm}
          disabled={confirmDisabled}
        >
          {confirmText}
        </ModalButton>
      )}
    </div>
  );
}
