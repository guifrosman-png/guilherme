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
    const tipo = pergunta.tipo?.trim() || 'texto'; // Garantir que tipo existe e remover espaços

    switch (tipo) {
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

      // ☑️ CAIXAS DE SELEÇÃO - múltiplas opções (checkboxes)
      case 'caixasSelecao':
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

      // 🎚️ DESLIGAMENTO - Toggle/Switch (Sim/Não visual)
      case 'desligamento':
        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onChange(pergunta.id, !valor)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                  valor ? '' : 'bg-gray-300'
                }`}
                style={valor ? { backgroundColor: cores.primary } : {}}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    valor ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-900">
                {valor ? 'Sim' : 'Não'}
              </span>
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // 🔢 GRADE DE MÚLTIPLA ESCOLHA - Matriz de opções
      case 'gradeMutipla':
        const linhas = pergunta.configGrade?.linhas || [];
        const colunas = pergunta.configGrade?.colunas || [];
        const respostasGrade = (valor as Record<string, string>) || {};

        // Se não tiver configuração, não renderizar
        if (linhas.length === 0 || colunas.length === 0) {
          return (
            <div key={pergunta.id} className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800">⚠️ Esta pergunta não está configurada corretamente (faltam linhas ou colunas)</p>
            </div>
          );
        }

        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-2 border-gray-300 p-3 bg-gray-50"></th>
                    {colunas.map((coluna, idx) => (
                      <th key={idx} className="border-2 border-gray-300 p-3 bg-gray-50 text-sm font-medium text-gray-900">
                        {coluna}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((linha, linhaIdx) => (
                    <tr key={linhaIdx}>
                      <td className="border-2 border-gray-300 p-3 font-medium text-sm text-gray-900 bg-gray-50">
                        {linha}
                      </td>
                      {colunas.map((coluna, colunaIdx) => {
                        const isSelected = respostasGrade[linha] === coluna;
                        return (
                          <td key={colunaIdx} className="border-2 border-gray-300 p-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const novasRespostas = { ...respostasGrade, [linha]: coluna };
                                onChange(pergunta.id, novasRespostas);
                              }}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${
                                isSelected ? 'border-transparent' : 'border-gray-300'
                              }`}
                              style={isSelected ? { backgroundColor: cores.primary } : {}}
                            >
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full mx-auto" />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // ☑️ GRADE CHECKBOX - Matriz de checkboxes
      case 'gradeCheckbox':
        const linhasCheck = pergunta.configGrade?.linhas || [];
        const colunasCheck = pergunta.configGrade?.colunas || [];
        const respostasGradeCheck = (valor as Record<string, string[]>) || {};

        // Se não tiver configuração, não renderizar
        if (linhasCheck.length === 0 || colunasCheck.length === 0) {
          return (
            <div key={pergunta.id} className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800">⚠️ Esta pergunta não está configurada corretamente (faltam linhas ou colunas)</p>
            </div>
          );
        }

        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-2 border-gray-300 p-3 bg-gray-50"></th>
                    {colunasCheck.map((coluna, idx) => (
                      <th key={idx} className="border-2 border-gray-300 p-3 bg-gray-50 text-sm font-medium text-gray-900">
                        {coluna}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {linhasCheck.map((linha, linhaIdx) => (
                    <tr key={linhaIdx}>
                      <td className="border-2 border-gray-300 p-3 font-medium text-sm text-gray-900 bg-gray-50">
                        {linha}
                      </td>
                      {colunasCheck.map((coluna, colunaIdx) => {
                        const selecoesLinha = respostasGradeCheck[linha] || [];
                        const isChecked = selecoesLinha.includes(coluna);
                        return (
                          <td key={colunaIdx} className="border-2 border-gray-300 p-3 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const novaSelecao = isChecked
                                  ? selecoesLinha.filter(c => c !== coluna)
                                  : [...selecoesLinha, coluna];
                                const novasRespostas = { ...respostasGradeCheck, [linha]: novaSelecao };
                                onChange(pergunta.id, novasRespostas);
                              }}
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                isChecked ? 'border-transparent' : 'border-gray-300'
                              }`}
                              style={isChecked ? { backgroundColor: cores.primary } : {}}
                            >
                              {isChecked && (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      // 📎 ARQUIVO CARREGAR - Upload de arquivo
      case 'arquivo':
        const tiposAceitos = pergunta.configArquivo?.tiposAceitos?.join(',') || '*';
        const tamanhoMaxMB = pergunta.configArquivo?.tamanhoMaxMB || 10;
        const isImage = valor && typeof valor === 'string' && valor.startsWith('data:image/');

        return (
          <div key={pergunta.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              {pergunta.titulo}
              {pergunta.obrigatoria && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Preview da imagem se já houver arquivo selecionado e for imagem */}
            {isImage && (
              <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                <img
                  src={valor as string}
                  alt="Preview"
                  className="w-full max-w-md mx-auto rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => onChange(pergunta.id, '')}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                  title="Remover imagem"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Área de upload - mostra apenas se não houver imagem ou se for outro tipo de arquivo */}
            {!isImage && (
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                erro ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="file"
                  accept={tiposAceitos}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > tamanhoMaxMB * 1024 * 1024) {
                        alert(`Arquivo muito grande! Máximo: ${tamanhoMaxMB}MB`);
                        return;
                      }
                      // Converter para base64 para armazenar
                      const reader = new FileReader();
                      reader.onload = () => {
                        onChange(pergunta.id, reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id={`file-${pergunta.id}`}
                />
                <label htmlFor={`file-${pergunta.id}`} className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {valor && !isImage ? '✓ Arquivo selecionado' : 'Clique para selecionar arquivo'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Máximo {tamanhoMaxMB}MB
                  </p>
                  {valor && !isImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onChange(pergunta.id, '');
                      }}
                      className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Remover arquivo
                    </button>
                  )}
                </label>
              </div>
            )}
            {erro && <p className="text-sm text-red-600">{erro}</p>}
          </div>
        );

      default:
        console.warn('⚠️ Tipo de pergunta não reconhecido:', pergunta.tipo, pergunta);
        return (
          <div key={pergunta.id} className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ Tipo de pergunta não suportado: "{pergunta.tipo}"
            </p>
            <p className="text-xs text-red-600 mt-1">
              Esta pergunta não pode ser exibida. Por favor, edite o template e escolha um tipo válido.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {perguntas.map((pergunta) => renderPergunta(pergunta))}
    </div>
  );
}
