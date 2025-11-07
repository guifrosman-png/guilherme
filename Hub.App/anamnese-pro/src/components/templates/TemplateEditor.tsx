/**
 * ✏️ EDITOR DE TEMPLATE
 * Editor completo para criar e modificar perguntas do template
 */

import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  Template,
  PerguntaCustomizada,
  TipoPergunta,
  FrequenciaPergunta,
  FormatoTemplate,
  TIPOS_PERGUNTA_LABELS,
  TIPOS_PERGUNTA_ICONS,
  FREQUENCIA_LABELS,
  FREQUENCIA_DESCRICOES,
  FORMATO_LABELS,
  FORMATO_ICONS
} from '../../types/templates';
import { removerGrafico } from '../../utils/graficoHelpers';
import {
  adicionarPergunta,
  editarPergunta,
  excluirPergunta,
  reordenarPerguntas,
  salvarTemplate
} from '../../utils/templateHelpers';
import { useCoresProfissao } from '../../theme';
import { Plus, Trash2, GripVertical, Save, X, Edit } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TemplateEditorProps {
  template: Template;
  onClose: () => void;
}

// Componente para cada pergunta que pode ser arrastada
function SortablePergunta({
  pergunta,
  onEdit,
  onDelete,
  cores
}: {
  pergunta: PerguntaCustomizada;
  onEdit: () => void;
  onDelete: () => void;
  cores: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pergunta.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`border-2 ${isDragging ? 'shadow-2xl' : 'border-gray-200'}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 mt-1 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {TIPOS_PERGUNTA_LABELS[pergunta.tipo]}
                  </span>
                  {pergunta.obrigatoria && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">
                      Obrigatória
                    </span>
                  )}
                  {/* 🆕 Badge de Frequência */}
                  {pergunta.frequencia === 'primeira-vez' && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      🎯 Apenas 1ª vez
                    </span>
                  )}
                </div>
                <p className="text-gray-900 font-medium">{pergunta.titulo}</p>
                {pergunta.opcoes && pergunta.opcoes.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {pergunta.opcoes.map(opcao => (
                      <li key={opcao.id} className="text-sm text-gray-600">
                        • {opcao.texto}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onEdit}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-red-50 hover:text-red-600"
                  onClick={onDelete}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TemplateEditor({ template, onClose }: TemplateEditorProps) {
  const cores = useCoresProfissao();
  const [perguntas, setPerguntas] = useState<PerguntaCustomizada[]>(template.perguntas);
  const [formato, setFormato] = useState<FormatoTemplate>(template.formato);
  const [editandoPergunta, setEditandoPergunta] = useState<string | null>(null);
  const [novaPergunta, setNovaPergunta] = useState(false);
  const [dropdownTiposAberto, setDropdownTiposAberto] = useState(false); // 🆕 Controle do dropdown de tipos
  const dropdownRef = useRef<HTMLDivElement>(null); // 🆕 Ref para fechar dropdown ao clicar fora
  const buttonRef = useRef<HTMLButtonElement>(null); // 🆕 Ref do botão para posicionar o menu
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 }); // 🆕 Posição do dropdown

  // Estados para nova pergunta / edição
  const [tipoPergunta, setTipoPergunta] = useState<TipoPergunta>('texto');
  const [tituloPergunta, setTituloPergunta] = useState('');
  const [obrigatoria, setObrigatoria] = useState(true);
  const [frequencia, setFrequencia] = useState<FrequenciaPergunta>('sempre');
  const [opcoes, setOpcoes] = useState<string[]>(['']);

  // 🆕 Estados para escala linear
  const [escalaMin, setEscalaMin] = useState(1);
  const [escalaMax, setEscalaMax] = useState(10);
  const [escalaLabelMin, setEscalaLabelMin] = useState('');
  const [escalaLabelMax, setEscalaLabelMax] = useState('');

  // 🆕 Estados para classificação
  const [classificacaoMax, setClassificacaoMax] = useState(5);
  const [classificacaoIcone, setClassificacaoIcone] = useState<'estrela' | 'coracao'>('estrela');

  // Configurar sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setPerguntas(template.perguntas);
  }, [template]);

  // 🆕 Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownTiposAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Função para reordenar quando arrastar
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPerguntas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const novaOrdem = arrayMove(items, oldIndex, newIndex);

        // Salvar nova ordem no localStorage
        reordenarPerguntas(template.id, novaOrdem.map(p => p.id));

        return novaOrdem;
      });
    }
  };

  const resetFormulario = () => {
    setTipoPergunta('texto');
    setTituloPergunta('');
    setObrigatoria(true);
    setFrequencia('sempre');
    setOpcoes(['']);
    setEscalaMin(1);
    setEscalaMax(10);
    setEscalaLabelMin('');
    setEscalaLabelMax('');
    setClassificacaoMax(5);
    setClassificacaoIcone('estrela');
    setEditandoPergunta(null);
    setNovaPergunta(false);
  };

  // 🆕 Abrir dropdown e calcular posição
  const abrirDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
    setDropdownTiposAberto(true);
  };

  // 🆕 Selecionar tipo do dropdown
  const selecionarTipoPergunta = (tipo: TipoPergunta) => {
    setTipoPergunta(tipo);
    setDropdownTiposAberto(false);
  };

  const handleAdicionarPergunta = () => {
    // Validação 1: Título obrigatório
    if (!tituloPergunta.trim()) {
      alert('⚠️ Digite o título da pergunta!');
      return;
    }

    // Validação 2: Título duplicado
    const tituloDuplicado = perguntas.some(
      p => p.titulo.toLowerCase() === tituloPergunta.trim().toLowerCase()
    );
    if (tituloDuplicado) {
      alert('⚠️ Já existe uma pergunta com este título!\n\nEscolha um título diferente para evitar confusão.');
      return;
    }

    // Validação 3: Limite de perguntas
    if (perguntas.length >= 20) {
      const confirmar = confirm(
        '⚠️ Atenção: Você já tem 20 perguntas!\n\n' +
        'Templates com muitas perguntas podem cansar o cliente.\n\n' +
        'Deseja adicionar mesmo assim?'
      );
      if (!confirmar) return;
    }

    // Validação 4: Caracteres inválidos
    const caracteresInvalidos = /[<>{}[\]\\]/;
    if (caracteresInvalidos.test(tituloPergunta)) {
      alert('⚠️ O título contém caracteres inválidos!\n\nEvite usar: < > { } [ ] \\');
      return;
    }

    if (tipoPergunta === 'multiplaEscolha') {
      const opcoesValidas = opcoes.filter(o => o.trim());
      if (opcoesValidas.length < 2) {
        alert('⚠️ Adicione pelo menos 2 opções de resposta!');
        return;
      }
    }

    const pergunta = adicionarPergunta(template.id, {
      tipo: tipoPergunta,
      titulo: tituloPergunta.trim(),
      obrigatoria,
      frequencia, // 🆕 Incluir frequência
      opcoes: tipoPergunta === 'multiplaEscolha'
        ? opcoes.filter(o => o.trim()).map((texto, index) => ({
            id: `opcao_${Date.now()}_${index}`,
            texto: texto.trim(),
            ordem: index
          }))
        : undefined
    });

    setPerguntas([...perguntas, pergunta]);
    resetFormulario();
  };

  const handleEditarPergunta = (perguntaId: string) => {
    // Validação 1: Título obrigatório
    if (!tituloPergunta.trim()) {
      alert('⚠️ Digite o título da pergunta!');
      return;
    }

    // Validação 2: Título duplicado (exceto a própria pergunta)
    const tituloDuplicado = perguntas.some(
      p => p.id !== perguntaId && p.titulo.toLowerCase() === tituloPergunta.trim().toLowerCase()
    );
    if (tituloDuplicado) {
      alert('⚠️ Já existe outra pergunta com este título!\n\nEscolha um título diferente para evitar confusão.');
      return;
    }

    // Validação 3: Caracteres inválidos
    const caracteresInvalidos = /[<>{}[\]\\]/;
    if (caracteresInvalidos.test(tituloPergunta)) {
      alert('⚠️ O título contém caracteres inválidos!\n\nEvite usar: < > { } [ ] \\');
      return;
    }

    if (tipoPergunta === 'multiplaEscolha') {
      const opcoesValidas = opcoes.filter(o => o.trim());
      if (opcoesValidas.length < 2) {
        alert('⚠️ Adicione pelo menos 2 opções de resposta!');
        return;
      }
    }

    editarPergunta(template.id, perguntaId, {
      titulo: tituloPergunta.trim(),
      obrigatoria,
      frequencia, // 🆕 Incluir frequência
      opcoes: tipoPergunta === 'multiplaEscolha'
        ? opcoes.filter(o => o.trim()).map((texto, index) => ({
            id: `opcao_${Date.now()}_${index}`,
            texto: texto.trim(),
            ordem: index
          }))
        : undefined
    });

    const perguntasAtualizadas = perguntas.map(p =>
      p.id === perguntaId
        ? { ...p, titulo: tituloPergunta.trim(), obrigatoria }
        : p
    );
    setPerguntas(perguntasAtualizadas);
    resetFormulario();
  };

  const handleExcluirPergunta = (perguntaId: string) => {
    const confirmar = confirm('⚠️ Tem certeza que deseja excluir esta pergunta?\n\nO gráfico associado também será removido.');
    if (confirmar) {
      // Remover a pergunta do template
      excluirPergunta(template.id, perguntaId);
      setPerguntas(perguntas.filter(p => p.id !== perguntaId));

      // 🗑️ Remover o gráfico associado à pergunta
      const graficoId = `grafico-${perguntaId}`;
      removerGrafico(graficoId);

      console.log(`✅ Pergunta e gráfico removidos: ${perguntaId}`);
    }
  };

  const iniciarEdicaoPergunta = (pergunta: PerguntaCustomizada) => {
    setEditandoPergunta(pergunta.id);
    setTipoPergunta(pergunta.tipo);
    setTituloPergunta(pergunta.titulo);
    setObrigatoria(pergunta.obrigatoria);
    setFrequencia(pergunta.frequencia || 'sempre'); // 🆕 Carregar frequência (fallback para compatibilidade)
    if (pergunta.opcoes) {
      setOpcoes(pergunta.opcoes.map(o => o.texto));
    }
    setNovaPergunta(false);
  };

  const adicionarOpcao = () => {
    setOpcoes([...opcoes, '']);
  };

  const removerOpcao = (index: number) => {
    setOpcoes(opcoes.filter((_, i) => i !== index));
  };

  const atualizarOpcao = (index: number, valor: string) => {
    const novasOpcoes = [...opcoes];
    novasOpcoes[index] = valor;
    setOpcoes(novasOpcoes);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{template.nome}</h2>
              <p className="text-sm text-gray-600 mt-1">{perguntas.length} perguntas</p>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Lista de Perguntas com Drag & Drop */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={perguntas.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 mb-6">
                {perguntas.map((pergunta) => (
                  <SortablePergunta
                    key={pergunta.id}
                    pergunta={pergunta}
                    onEdit={() => iniciarEdicaoPergunta(pergunta)}
                    onDelete={() => handleExcluirPergunta(pergunta.id)}
                    cores={cores}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Botão Adicionar Nova Pergunta */}
          {!novaPergunta && !editandoPergunta && (
            <Button
              onClick={() => setNovaPergunta(true)}
              className="w-full text-white"
              style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Pergunta
            </Button>
          )}

          {/* Formulário de Nova Pergunta / Edição */}
          {(novaPergunta || editandoPergunta) && (
            <Card className="border-2" style={{ borderColor: cores.primary }}>
              <CardContent className="p-4 space-y-4">
                {/* Header com dropdown de tipo */}
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">
                    {editandoPergunta ? 'Editar Pergunta' : 'Nova Pergunta'}
                  </h3>

                  {/* Tipo de Pergunta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Pergunta
                    </label>
                    <div className="flex gap-2">
                      {(['texto', 'simNao', 'multiplaEscolha'] as TipoPergunta[]).map((tipo) => (
                        <button
                          key={tipo}
                          type="button"
                          onClick={() => setTipoPergunta(tipo)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all hover:scale-105 ${
                            tipoPergunta === tipo
                              ? 'border-blue-500 bg-blue-500 text-white shadow-md'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <span className="text-lg">{TIPOS_PERGUNTA_ICONS[tipo]}</span>
                          <span className="text-sm font-medium whitespace-nowrap">
                            {TIPOS_PERGUNTA_LABELS[tipo]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Título da Pergunta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pergunta *
                  </label>
                  <input
                    type="text"
                    value={tituloPergunta}
                    onChange={(e) => setTituloPergunta(e.target.value)}
                    placeholder="Digite a pergunta..."
                    className="w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    style={{ focusBorderColor: cores.primary }}
                  />
                </div>

                {/* 📝 TIPO: RESPOSTA CURTA - sem campos adicionais */}

                {/* 📄 TIPO: PARÁGRAFO - sem campos adicionais */}

                {/* ✓✗ TIPO: SIM OU NÃO - preview dos botões */}
                {tipoPergunta === 'simNao' && (
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preview da resposta:
                    </label>
                    <div className="flex gap-3">
                      <div className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 bg-white text-center font-medium">
                        ✓ Sim
                      </div>
                      <div className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 bg-white text-center font-medium">
                        ✗ Não
                      </div>
                    </div>
                  </div>
                )}

                {/* ⚫ TIPO: MÚLTIPLA ESCOLHA - opções de resposta */}
                {tipoPergunta === 'multiplaEscolha' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opções de Resposta *
                    </label>
                    <div className="space-y-2">
                      {opcoes.map((opcao, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={opcao}
                            onChange={(e) => atualizarOpcao(index, e.target.value)}
                            placeholder={`Opção ${index + 1}`}
                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                          />
                          {opcoes.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removerOpcao(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={adicionarOpcao}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Opção
                      </Button>
                    </div>
                  </div>
                )}

                {/* ☑️ TIPO: CAIXA DE SELEÇÃO - múltiplas opções */}
                {tipoPergunta === 'caixaSelecao' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opções de Resposta * <span className="text-xs text-gray-500">(cliente pode marcar várias)</span>
                    </label>
                    <div className="space-y-2">
                      {opcoes.map((opcao, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={opcao}
                            onChange={(e) => atualizarOpcao(index, e.target.value)}
                            placeholder={`Opção ${index + 1}`}
                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                          />
                          {opcoes.length > 1 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removerOpcao(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={adicionarOpcao}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Opção
                      </Button>
                    </div>
                  </div>
                )}

                {/* 📊 TIPO: ESCALA LINEAR - configurar min, max e labels */}
                {tipoPergunta === 'escalaLinear' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Configuração da Escala
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Valor Mínimo</label>
                        <input
                          type="number"
                          value={escalaMin}
                          onChange={(e) => setEscalaMin(Number(e.target.value))}
                          min={0}
                          max={escalaMax - 1}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Valor Máximo</label>
                        <input
                          type="number"
                          value={escalaMax}
                          onChange={(e) => setEscalaMax(Number(e.target.value))}
                          min={escalaMin + 1}
                          max={100}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Label do Mínimo (opcional)</label>
                        <input
                          type="text"
                          value={escalaLabelMin}
                          onChange={(e) => setEscalaLabelMin(e.target.value)}
                          placeholder="Ex: Péssimo"
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Label do Máximo (opcional)</label>
                        <input
                          type="text"
                          value={escalaLabelMax}
                          onChange={(e) => setEscalaLabelMax(e.target.value)}
                          placeholder="Ex: Excelente"
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                        />
                      </div>
                    </div>
                    {/* Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <label className="block text-xs text-gray-600 mb-2">Preview:</label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{escalaLabelMin || escalaMin}</span>
                        <div className="flex gap-2">
                          {Array.from({ length: escalaMax - escalaMin + 1 }, (_, i) => (
                            <div key={i} className="w-8 h-8 rounded border-2 border-gray-300 flex items-center justify-center text-xs font-medium">
                              {escalaMin + i}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-gray-700">{escalaLabelMax || escalaMax}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 📅 TIPO: DATA - sem campos adicionais, apenas preview */}
                {tipoPergunta === 'data' && (
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preview da resposta:
                    </label>
                    <input
                      type="date"
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white"
                      placeholder="dd/mm/aaaa"
                    />
                  </div>
                )}

                {/* 🕐 TIPO: HORA - sem campos adicionais, apenas preview */}
                {tipoPergunta === 'hora' && (
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preview da resposta:
                    </label>
                    <input
                      type="time"
                      disabled
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                )}

                {/* ⭐ TIPO: CLASSIFICAÇÃO - escolher ícone e quantidade */}
                {tipoPergunta === 'classificacao' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Ícone
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setClassificacaoIcone('estrela')}
                          className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                            classificacaoIcone === 'estrela'
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">⭐</div>
                          <div className="text-sm font-medium">Estrelas</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setClassificacaoIcone('coracao')}
                          className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                            classificacaoIcone === 'coracao'
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">❤️</div>
                          <div className="text-sm font-medium">Corações</div>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantidade Máxima
                      </label>
                      <input
                        type="number"
                        value={classificacaoMax}
                        onChange={(e) => setClassificacaoMax(Number(e.target.value))}
                        min={3}
                        max={10}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    {/* Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <label className="block text-xs text-gray-600 mb-2">Preview:</label>
                      <div className="flex gap-1 justify-center">
                        {Array.from({ length: classificacaoMax }, (_, i) => (
                          <span key={i} className="text-3xl opacity-30">
                            {classificacaoIcone === 'estrela' ? '⭐' : '❤️'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Obrigatória */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="obrigatoria"
                    checked={obrigatoria}
                    onChange={(e) => setObrigatoria(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="obrigatoria" className="text-sm font-medium text-gray-700">
                    Pergunta obrigatória
                  </label>
                </div>

                {/* 🆕 Frequência da Pergunta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quando perguntar?
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFrequencia('sempre')}
                      className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                        frequencia === 'sempre'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {FREQUENCIA_LABELS.sempre}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {FREQUENCIA_DESCRICOES.sempre}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequencia('primeira-vez')}
                      className={`flex-1 p-3 border-2 rounded-lg transition-all ${
                        frequencia === 'primeira-vez'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        🎯 {FREQUENCIA_LABELS['primeira-vez']}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {FREQUENCIA_DESCRICOES['primeira-vez']}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => editandoPergunta ? handleEditarPergunta(editandoPergunta) : handleAdicionarPergunta()}
                    className="flex-1 text-white"
                    style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editandoPergunta ? 'Salvar Alterações' : 'Adicionar Pergunta'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetFormulario}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
      </div>

      {/* Menu dropdown dos tipos - FORA DO MODAL, SOBREPOSTO */}
      {dropdownTiposAberto && (
        <div
          ref={dropdownRef}
          className="fixed w-64 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-[400px] overflow-y-auto"
          style={{
            zIndex: 99999,
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {(['texto', 'simNao', 'multiplaEscolha'] as TipoPergunta[]).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => selecionarTipoPergunta(tipo)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0 ${
                tipoPergunta === tipo ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-xl">{TIPOS_PERGUNTA_ICONS[tipo]}</span>
              <span className="font-medium text-gray-900 text-sm">{TIPOS_PERGUNTA_LABELS[tipo]}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
