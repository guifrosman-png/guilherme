import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface ModalAdicionarValorProps {
  cliente: any;
  anamneses: any[];
  onClose: () => void;
  onSave: (valoresAtualizados: { anamneseId: number; valor: number }[]) => void;
}

export function ModalAdicionarValor({ cliente, anamneses, onClose, onSave }: ModalAdicionarValorProps) {
  // Buscar todas as anamneses sem valor deste cliente
  // ✅ CORRIGIDO: Aceita tanto valorServico quanto valorTatuagem
  const anamnesesSemValor = anamneses.filter((a: any) => {
    const valor = a.dadosCompletos?.valorServico || a.dadosCompletos?.valorTatuagem || 0;
    return (
      a.clienteId === cliente.id &&
      a.status === 'concluida' &&
      a.preenchidoPor === 'cliente' &&
      valor === 0
    );
  });

  // Estado local para os valores
  const [valores, setValores] = useState<{[key: number]: string}>({});

  const handleValorChange = (anamneseId: number, valor: string) => {
    // Permitir apenas números
    const apenasNumeros = valor.replace(/\D/g, '');
    setValores({...valores, [anamneseId]: apenasNumeros});
  };

  const formatarMoeda = (valor: string) => {
    if (!valor) return 'R$ 0,00';
    const numero = parseInt(valor) / 100;
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleSalvar = () => {
    const valoresAtualizados = anamnesesSemValor
      .map((anamnese) => {
        const valorStr = valores[anamnese.id] || '0';
        const valorNum = parseInt(valorStr) / 100;
        return { anamneseId: anamnese.id, valor: valorNum };
      })
      .filter((item) => item.valor > 0);

    onSave(valoresAtualizados);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">💰 Adicionar Valores</CardTitle>
              <CardDescription className="text-gray-600">
                {cliente.nome} - {anamnesesSemValor.length} {anamnesesSemValor.length === 1 ? 'tatuagem pendente' : 'tatuagens pendentes'}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {anamnesesSemValor.map((anamnese) => (
              <div key={anamnese.id} className="p-4 border-2 border-gray-200 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">Tatuagem - {anamnese.data}</h3>
                    <p className="text-sm text-gray-600">
                      {anamnese.dadosCompletos?.localTatuagem || 'Local não informado'}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                    Sem valor
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor cobrado
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o valor (ex: 15000 = R$ 150,00)"
                    value={valores[anamnese.id] || ''}
                    onChange={(e) => handleValorChange(anamnese.id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-orange-500 focus:outline-none transition-colors"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Valor: <span className="font-bold text-orange-600">{formatarMoeda(valores[anamnese.id] || '0')}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>

        <div className="border-t p-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              onClick={handleSalvar}
            >
              💰 Salvar Valores
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
