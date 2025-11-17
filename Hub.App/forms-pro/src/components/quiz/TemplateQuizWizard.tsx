/**
 * 🧙 WIZARD DE PERGUNTAS DO TEMPLATE
 * Renderiza perguntas UMA POR VEZ (formato wizard/stepper)
 * Usado no Preview e no Quiz real
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { PerguntaCustomizada } from '../../types/templates';
import { useCoresProfissao } from '../../theme';

interface TemplateQuizWizardProps {
  perguntas: PerguntaCustomizada[];
  respostas: Record<string, string | boolean | string[]>;
  onChange: (perguntaId: string, resposta: string | boolean | string[]) => void;
  errors: Record<string, string>;
  isPreview?: boolean; // Se true, é preview (não valida)
}

export function TemplateQuizWizard({
  perguntas,
  respostas,
  onChange,
  errors,
  isPreview = false
}: TemplateQuizWizardProps) {
  const cores = useCoresProfissao();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (perguntas.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Nenhuma pergunta no template</p>
      </div>
    );
  }

  const currentPergunta = perguntas[currentIndex];
  const totalPerguntas = perguntas.length;
  const progresso = ((currentIndex + 1) / totalPerguntas) * 100;
  const valor = respostas[currentPergunta.id];
  const erro = errors[currentPergunta.id];

  const handleNext = () => {
    if (currentIndex < totalPerguntas - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Progresso */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">
            Pergunta {currentIndex + 1} de {totalPerguntas}
          </span>
          <span className="text-gray-500">{Math.round(progresso)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progresso}%`,
              backgroundColor: cores.primary
            }}
          />
        </div>
      </div>

      {/* Pergunta Atual */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 min-h-[300px]">
        {/* Título da Pergunta */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {currentPergunta.titulo}
            {currentPergunta.obrigatoria && !isPreview && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </h3>
          {currentPergunta.descricao && (
            <p className="text-sm text-gray-600">{currentPergunta.descricao}</p>
          )}
        </div>

        {/* Renderizar Input baseado no tipo */}
        <div className="space-y-4">
          {/* 📝 RESPOSTA CURTA - input simples */}
          {currentPergunta.tipo === 'texto' && (
            <input
              type="text"
              value={(valor as string) || ''}
              onChange={(e) => onChange(currentPergunta.id, e.target.value)}
              placeholder="Digite sua resposta..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                erro ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{
                borderColor: erro ? undefined : (valor ? cores.primary : undefined)
              }}
            />
          )}

          {/* 📄 PARÁGRAFO - textarea */}
          {currentPergunta.tipo === 'paragrafo' && (
            <textarea
              value={(valor as string) || ''}
              onChange={(e) => onChange(currentPergunta.id, e.target.value)}
              rows={5}
              placeholder="Digite sua resposta..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                erro ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{
                borderColor: erro ? undefined : (valor ? cores.primary : undefined)
              }}
            />
          )}

          {currentPergunta.tipo === 'simNao' && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onChange(currentPergunta.id, true)}
                className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all font-medium text-lg ${
                  valor === true
                    ? 'text-white border-transparent shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={valor === true ? { backgroundColor: cores.primary } : {}}
              >
                ✓ Sim
              </button>
              <button
                type="button"
                onClick={() => onChange(currentPergunta.id, false)}
                className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all font-medium text-lg ${
                  valor === false
                    ? 'bg-gray-600 text-white border-transparent shadow-lg'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                ✗ Não
              </button>
            </div>
          )}

          {/* ⚫ MÚLTIPLA ESCOLHA - radio */}
          {currentPergunta.tipo === 'multiplaEscolha' && (
            <div className="space-y-3">
              {currentPergunta.opcoes?.map((opcao) => (
                <button
                  key={opcao.id}
                  type="button"
                  onClick={() => onChange(currentPergunta.id, opcao.texto)}
                  className={`w-full text-left py-4 px-5 rounded-xl border-2 transition-all ${
                    valor === opcao.texto
                      ? 'border-transparent text-white shadow-lg'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                  style={valor === opcao.texto ? { backgroundColor: cores.primary } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        valor === opcao.texto ? 'border-white' : 'border-gray-300'
                      }`}
                    >
                      {valor === opcao.texto && (
                        <div className="w-3 h-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="font-medium">{opcao.texto}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ☑️ CAIXA DE SELEÇÃO - checkboxes */}
          {currentPergunta.tipo === 'caixaSelecao' && (
            <div className="space-y-3">
              {currentPergunta.opcoes?.map((opcao) => {
                const valoresArray = Array.isArray(valor) ? valor : [];
                const isChecked = valoresArray.includes(opcao.texto);
                return (
                  <button
                    key={opcao.id}
                    type="button"
                    onClick={() => {
                      const novosValores = isChecked
                        ? valoresArray.filter(v => v !== opcao.texto)
                        : [...valoresArray, opcao.texto];
                      onChange(currentPergunta.id, novosValores);
                    }}
                    className={`w-full text-left py-4 px-5 rounded-xl border-2 transition-all ${
                      isChecked
                        ? 'border-transparent text-white shadow-lg'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                    style={isChecked ? { backgroundColor: cores.primary } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isChecked ? 'border-white' : 'border-gray-300'
                        }`}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{opcao.texto}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 📊 ESCALA LINEAR - botões de 1-10 */}
          {currentPergunta.tipo === 'escalaLinear' && (
            <div className="space-y-3">
              <div className="flex gap-2 justify-center flex-wrap">
                {Array.from({ length: 10 }, (_, i) => {
                  const numero = i + 1;
                  const isSelected = valor === String(numero);
                  return (
                    <button
                      key={numero}
                      type="button"
                      onClick={() => onChange(currentPergunta.id, String(numero))}
                      className={`w-14 h-14 rounded-xl border-2 font-bold text-lg transition-all ${
                        isSelected ? 'text-white border-transparent shadow-lg scale-110' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={isSelected ? { backgroundColor: cores.primary } : {}}
                    >
                      {numero}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 📅 DATA - input de data */}
          {currentPergunta.tipo === 'data' && (
            <input
              type="date"
              value={(valor as string) || ''}
              onChange={(e) => onChange(currentPergunta.id, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                erro ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{
                borderColor: erro ? undefined : (valor ? cores.primary : undefined)
              }}
            />
          )}

          {/* 🕐 HORA - input de hora */}
          {currentPergunta.tipo === 'hora' && (
            <input
              type="time"
              value={(valor as string) || ''}
              onChange={(e) => onChange(currentPergunta.id, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                erro ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{
                borderColor: erro ? undefined : (valor ? cores.primary : undefined)
              }}
            />
          )}

          {/* ⭐ CLASSIFICAÇÃO - estrelas */}
          {currentPergunta.tipo === 'classificacao' && (
            <div className="flex gap-2 justify-center py-4">
              {Array.from({ length: 5 }, (_, i) => {
                const numero = i + 1;
                const isSelected = Number(valor) >= numero;
                return (
                  <button
                    key={numero}
                    type="button"
                    onClick={() => onChange(currentPergunta.id, String(numero))}
                    className={`text-5xl transition-all ${
                      isSelected ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-60 hover:scale-105'
                    }`}
                  >
                    ⭐
                  </button>
                );
              })}
            </div>
          )}

          {erro && !isPreview && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex-1 text-center">
          {isPreview && (
            <span className="text-xs text-gray-500 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
              👁️ Modo Preview
            </span>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === totalPerguntas - 1}
          className="flex items-center gap-2 text-white"
          style={{ backgroundColor: cores.primary }}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Indicador de Perguntas */}
      <div className="flex justify-center gap-2 mt-4">
        {perguntas.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8'
                : respostas[perguntas[index].id]
                ? 'opacity-100'
                : 'opacity-30'
            }`}
            style={{
              backgroundColor: cores.primary
            }}
          />
        ))}
      </div>
    </div>
  );
}
