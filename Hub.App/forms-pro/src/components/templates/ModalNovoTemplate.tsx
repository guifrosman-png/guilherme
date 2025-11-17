/**
 * 📋 MODAL DE CRIAÇÃO DE NOVO TEMPLATE
 * Modal para criar novo template com nome e formato
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { FormatoTemplate, FORMATO_LABELS, FORMATO_DESCRICOES, FORMATO_ICONS } from '../../types/templates';
import { X } from 'lucide-react';
import { useCoresProfissao } from '../../theme';

type TipoBase = 'zero' | 'padrao';

interface ModalNovoTemplateProps {
  onClose: () => void;
  onConfirm: (nome: string, formato: FormatoTemplate, tipoBase: TipoBase) => void;
}

export function ModalNovoTemplate({ onClose, onConfirm }: ModalNovoTemplateProps) {
  const cores = useCoresProfissao();
  const [tipoBase, setTipoBase] = useState<TipoBase>('padrao'); // Padrão recomendado
  const [nome, setNome] = useState('');
  const [formato, setFormato] = useState<FormatoTemplate>('quiz');

  const handleConfirmar = () => {
    // Validação
    if (!nome.trim()) {
      alert('⚠️ Digite um nome para o template!');
      return;
    }

    if (nome.trim().length < 3) {
      alert('⚠️ O nome deve ter pelo menos 3 caracteres!');
      return;
    }

    onConfirm(nome.trim(), formato, tipoBase);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Criar Novo Template</CardTitle>
              <CardDescription className="text-gray-600">
                Defina o nome e como apresentar as perguntas
              </CardDescription>
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

        <CardContent className="pt-6 space-y-6">
          {/* Escolha da Base */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Como deseja começar? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Opção: Template Padrão */}
              <button
                type="button"
                onClick={() => setTipoBase('padrao')}
                className={`p-4 border-2 rounded-xl transition-all text-left ${
                  tipoBase === 'padrao'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📋</span>
                  <span className="font-bold text-gray-900">Template Padrão</span>
                </div>
                <p className="text-xs text-gray-600">
                  Começar com perguntas prontas da sua profissão (recomendado)
                </p>
                {tipoBase === 'padrao' && (
                  <div className="mt-2 text-xs font-semibold text-green-600">
                    ✓ Selecionado
                  </div>
                )}
              </button>

              {/* Opção: Do Zero */}
              <button
                type="button"
                onClick={() => setTipoBase('zero')}
                className={`p-4 border-2 rounded-xl transition-all text-left ${
                  tipoBase === 'zero'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">✨</span>
                  <span className="font-bold text-gray-900">Do Zero</span>
                </div>
                <p className="text-xs text-gray-600">
                  Criar template vazio e adicionar todas as perguntas manualmente
                </p>
                {tipoBase === 'zero' && (
                  <div className="mt-2 text-xs font-semibold text-green-600">
                    ✓ Selecionado
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Nome do Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Template *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Minha Anamnese Personalizada"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              Escolha um nome descritivo para identificar este template
            </p>
          </div>

          {/* Formato de Apresentação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Como apresentar? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Opção: Quiz */}
              <button
                type="button"
                onClick={() => setFormato('quiz')}
                className={`p-4 border-2 rounded-xl transition-all text-left ${
                  formato === 'quiz'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{FORMATO_ICONS.quiz}</span>
                  <span className="font-bold text-gray-900">Quiz</span>
                </div>
                <p className="text-xs text-gray-600">
                  {FORMATO_DESCRICOES.quiz}
                </p>
                {formato === 'quiz' && (
                  <div className="mt-2 text-xs font-semibold text-blue-600">
                    ✓ Selecionado
                  </div>
                )}
              </button>

              {/* Opção: Ficha */}
              <button
                type="button"
                onClick={() => setFormato('ficha')}
                className={`p-4 border-2 rounded-xl transition-all text-left ${
                  formato === 'ficha'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{FORMATO_ICONS.ficha}</span>
                  <span className="font-bold text-gray-900">Ficha</span>
                </div>
                <p className="text-xs text-gray-600">
                  {FORMATO_DESCRICOES.ficha}
                </p>
                {formato === 'ficha' && (
                  <div className="mt-2 text-xs font-semibold text-blue-600">
                    ✓ Selecionado
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 text-white"
              style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}
              onClick={handleConfirmar}
            >
              Criar e Editar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
