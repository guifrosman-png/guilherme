import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border border-gray-100">
                <div className="p-6 text-center">
                    <div className={clsx(
                        "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4",
                        type === 'danger' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                    )}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                console.log('ConfirmModal: Confirm button clicked');
                                onConfirm();
                                onClose();
                            }}
                            className={clsx(
                                "px-4 py-2 text-sm font-medium text-white rounded-lg shadow-lg hover:shadow-xl transition-all",
                                type === 'danger' ? "bg-red-600 hover:bg-red-700 shadow-red-600/20" : "bg-amber-600 hover:bg-amber-700"
                            )}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
