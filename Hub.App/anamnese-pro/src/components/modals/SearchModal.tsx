import { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  anamneses: any[];
  onSelectAnamnese: (anamnese: any) => void;
}

export function SearchModal({ isOpen, onClose, anamneses, onSelectAnamnese }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Filtrar anamneses pelo termo de busca
  const filteredAnamneses = anamneses.filter((anamnese) =>
    anamnese.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20 animate-fadeIn">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Buscar Anamnese</h2>
                <p className="text-sm text-gray-600">Procure por nome do cliente</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Campo de busca */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Digite o nome do cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {/* Resultados */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchTerm === '' ? (
              <div className="text-center py-8 text-gray-500">
                Digite para buscar...
              </div>
            ) : filteredAnamneses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma anamnese encontrada
              </div>
            ) : (
              filteredAnamneses.map((anamnese) => (
                <button
                  key={anamnese.id}
                  onClick={() => {
                    onSelectAnamnese(anamnese);
                    onClose();
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all text-left"
                >
                  <div className="font-medium text-gray-900">{anamnese.clienteNome}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Data: {anamnese.data} • {anamnese.preenchidoPor === 'profissional' ? '👩‍⚕️ Profissional' : '📱 Cliente'}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button onClick={onClose} variant="outline" className="w-full">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
