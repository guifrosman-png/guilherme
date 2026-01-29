
import React from 'react';

export function TemplatePreviewModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Preview de Template</h3>
        <p className="text-gray-500 mb-6">Funcionalidade em construção.</p>
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Fechar</button>
      </div>
    </div>
  );
}
