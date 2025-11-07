/**
 * 🎯 RENDERIZADOR DE PERGUNTAS DO TEMPLATE
 * Componente que renderiza perguntas customizadas do template ativo
 */

import { useState } from 'react';
import { PerguntaCustomizada, RespostaCliente } from '../../types/templates';
import { useCoresProfissao } from '../../theme';

interface TemplateQuizRendererProps {
  perguntas: PerguntaCustomizada[];
  respostas: Record<string, string | boolean | string[]>;
  onChange: (perguntaId: string, resposta: string | boolean | string[]) => void;
  errors: Record<string, string>;
}

export function TemplateQuizRenderer({
  perguntas,
  respostas,
  onChange,
  errors
}: TemplateQuizRendererProps) {
  const cores = useCoresProfissao();

  const renderPergunta = (pergunta: PerguntaCustomizada) => {
    const valor = respostas[pergunta.id] || '';
    const erro = errors[pergunta.id];

    switch (pergunta.tipo) {
      // 📝 RESPOSTA CURTA - input de texto breve
      case 'texto':
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={valor as string}
              onChange={(e) => onChange(pergunta.id, e.target.value)}
              placeholder="Digite sua resposta..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                erro ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ borderColor: erro ? undefined : (valor ? cores.primary : undefined) }}
            />
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // 📄 PARÁGRAFO - textarea para texto longo
      case 'paragrafo':
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={valor as string}
              onChange={(e) => onChange(pergunta.id, e.target.value)}
              rows={5}
              placeholder="Digite sua resposta..."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors resize-none ${
                erro ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ borderColor: erro ? undefined : (valor ? cores.primary : undefined) }}
            />
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      case 'simNao':
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onChange(pergunta.id, true)}
                className={`flex-1 py-3 px-6 rounded-xl border-2 transition-all font-medium ${
                  valor === true
                    ? `${cores.bg500} text-white border-transparent`
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                style={valor === true ? { backgroundColor: cores.primary } : {}}
              >
                ✓ Sim
              </button>
              <button
                type="button"
                onClick={() => onChange(pergunta.id, false)}
                className={`flex-1 py-3 px-6 rounded-xl border-2 transition-all font-medium ${
                  valor === false
                    ? 'bg-gray-600 text-white border-transparent'
                    : 'border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                ✗ Não
              </button>
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      case 'multiplaEscolha':
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {pergunta.opcoes?.map((opcao) => (
                <button
                  key={opcao.id}
                  type="button"
                  onClick={() => onChange(pergunta.id, opcao.texto)}
                  className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-all ${
                    valor === opcao.texto
                      ? `${cores.bg50} border-transparent`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={valor === opcao.texto ? { borderColor: cores.primary, backgroundColor: `${cores.primary}15` } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        valor === opcao.texto ? 'border-transparent' : 'border-gray-300'
                      }`}
                      style={valor === opcao.texto ? { backgroundColor: cores.primary } : {}}
                    >
                      {valor === opcao.texto && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-900">{opcao.texto}</span>
                  </div>
                </button>
              ))}
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // ☑️ CAIXA DE SELEÇÃO - múltiplas opções (checkboxes)
      case 'caixaSelecao':
        const valoresArray = Array.isArray(valor) ? valor : [];
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {pergunta.opcoes?.map((opcao) => {
                const isChecked = valoresArray.includes(opcao.texto);
                return (
                  <button
                    key={opcao.id}
                    type="button"
                    onClick={() => {
                      const novosValores = isChecked
                        ? valoresArray.filter(v => v !== opcao.texto)
                        : [...valoresArray, opcao.texto];
                      onChange(pergunta.id, novosValores);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl border-2 transition-all ${
                      isChecked
                        ? `${cores.bg50} border-transparent`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={isChecked ? { borderColor: cores.primary, backgroundColor: `${cores.primary}15` } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isChecked ? 'border-transparent' : 'border-gray-300'
                        }`}
                        style={isChecked ? { backgroundColor: cores.primary } : {}}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-900">{opcao.texto}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // 📊 ESCALA LINEAR - números de min até max
      case 'escalaLinear':
        // TODO: Pegar configuração da escala do pergunta (min, max, labels)
        const escalaMin = 1;
        const escalaMax = 10;
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2 justify-center flex-wrap">
              {Array.from({ length: escalaMax - escalaMin + 1 }, (_, i) => {
                const numero = escalaMin + i;
                const isSelected = valor === String(numero);
                return (
                  <button
                    key={numero}
                    type="button"
                    onClick={() => onChange(pergunta.id, String(numero))}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-all ${
                      isSelected ? 'text-white border-transparent' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={isSelected ? { backgroundColor: cores.primary } : {}}
                  >
                    {numero}
                  </button>
                );
              })}
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // 📅 DATA - input de data
      case 'data':
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={valor as string}
              onChange={(e) => onChange(pergunta.id, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                erro ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ borderColor: erro ? undefined : (valor ? cores.primary : undefined) }}
            />
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // 🕐 HORA - input de hora
      case 'hora':
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="time"
              value={valor as string}
              onChange={(e) => onChange(pergunta.id, e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                erro ? 'border-red-500' : 'border-gray-200'
              }`}
              style={{ borderColor: erro ? undefined : (valor ? cores.primary : undefined) }}
            />
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // ⭐ CLASSIFICAÇÃO - estrelas/corações
      case 'classificacao':
        // TODO: Pegar configuração do pergunta (max, tipo de ícone)
        const classificacaoMax = 5;
        const icone = '⭐';
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2 justify-center">
              {Array.from({ length: classificacaoMax }, (_, i) => {
                const numero = i + 1;
                const isSelected = Number(valor) >= numero;
                return (
                  <button
                    key={numero}
                    type="button"
                    onClick={() => onChange(pergunta.id, String(numero))}
                    className={`text-4xl transition-all ${
                      isSelected ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-50'
                    }`}
                  >
                    {icone}
                  </button>
                );
              })}
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {perguntas.map((pergunta) => renderPergunta(pergunta))}
    </div>
  );
}
