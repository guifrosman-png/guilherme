import { X, Filter } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FiltersModal({ isOpen, onClose }: FiltersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Filtros Avançados</h2>
                <p className="text-sm text-gray-600">Refine sua busca</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none">
                <option value="">Todos</option>
                <option value="concluida">Concluída</option>
                <option value="pendente">Pendente</option>
                <option value="expirada">Expirada</option>
              </select>
            </div>

            {/* Preenchido por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preenchido por
              </label>
              <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none">
                <option value="">Todos</option>
                <option value="profissional">Profissional</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>

            {/* Versão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Versão
              </label>
              <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none">
                <option value="">Todas</option>
                <option value="1">v1</option>
                <option value="2">v2</option>
                <option value="3">v3</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Limpar Filtros
            </Button>
            <Button onClick={onClose} className="flex-1 bg-pink-500 hover:bg-pink-600">
              Aplicar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
