/**
 * 👁️ PREVIEW DO TEMPLATE
 * Modal para visualizar como o template vai aparecer no quiz
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Template } from '../../types/templates';
import { TemplateQuizWizard } from '../quiz/TemplateQuizWizard';
import { useCoresProfissao } from '../../theme';
import { X, Eye } from 'lucide-react';

interface TemplatePreviewProps {
  template: Template;
  onClose: () => void;
}

export function TemplatePreview({ template, onClose }: TemplatePreviewProps) {
  const cores = useCoresProfissao();
  const [respostasPreview, setRespostasPreview] = useState<Record<string, string | boolean | string[]>>({});
  const [errosPreview, setErrosPreview] = useState<Record<string, string>>({});

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div
          className="p-6 rounded-t-2xl text-white"
          style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Preview do Template</h2>
                <p className="text-white/80 mt-1">Veja como seu cliente verá este template</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Info do Template */}
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Modo de Visualização</h3>
                <p className="text-sm text-blue-700">
                  Esta é apenas uma prévia. As respostas não serão salvas.
                </p>
              </div>
            </div>
          </div>

          {/* Template Name */}
          <Card className="mb-6 border-2" style={{ borderColor: cores.primary }}>
            <CardContent className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{template.nome}</h3>
              {template.descricao && (
                <p className="text-sm text-gray-600">{template.descricao}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {template.perguntas.length} {template.perguntas.length === 1 ? 'pergunta' : 'perguntas'}
              </div>
            </CardContent>
          </Card>

          {/* Renderizar Perguntas - FORMATO WIZARD (uma por vez) */}
          {template.perguntas.length === 0 ? (
            <div className="text-center py-12">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${cores.primary}15` }}
              >
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma pergunta no template
              </h3>
              <p className="text-gray-600">
                Adicione perguntas ao template para visualizar o preview
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl">
              <TemplateQuizWizard
                perguntas={template.perguntas}
                respostas={respostasPreview}
                onChange={(perguntaId, resposta) => {
                  setRespostasPreview(prev => ({
                    ...prev,
                    [perguntaId]: resposta
                  }));
                }}
                errors={errosPreview}
                isPreview={true}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            💡 <strong>Dica:</strong> Teste preenchendo algumas respostas para ver como funciona!
          </div>
          <Button onClick={onClose} className="text-white" style={{ background: cores.primary }}>
            Fechar Preview
          </Button>
        </div>
      </div>
    </div>
  );
}
