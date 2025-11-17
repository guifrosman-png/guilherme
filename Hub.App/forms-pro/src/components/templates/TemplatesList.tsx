/**
 * 📋 LISTA DE TEMPLATES
 * Página principal de gerenciamento de templates
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Template } from '../../types/templates';
import {
  getTemplatesPorProfissao,
  ativarTemplate,
  duplicarTemplate,
  excluirTemplate,
  gerarIdTemplate
} from '../../utils/templateHelpers';
import { getProfissaoAtual, useCoresProfissao } from '../../theme';
import { Plus, Layout, Copy, Trash2, Edit, Eye } from 'lucide-react';
import { TemplateEditor } from './TemplateEditor';
import { TemplatePreview } from './TemplatePreview';
import { ModalNovoTemplate } from './ModalNovoTemplate';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { FormatoTemplate, FORMATO_LABELS, FORMATO_ICONS } from '../../types/templates';

export function TemplatesList() {
  const cores = useCoresProfissao();
  const profissao = getProfissaoAtual();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showNovoTemplateModal, setShowNovoTemplateModal] = useState(false);
  const [templateEditando, setTemplateEditando] = useState<Template | null>(null);
  const [templatePreview, setTemplatePreview] = useState<Template | null>(null);
  const [templateParaExcluir, setTemplateParaExcluir] = useState<Template | null>(null);

  useEffect(() => {
    // Carregar templates da profissão atual
    const templatesCarregados = getTemplatesPorProfissao(profissao);
    setTemplates(templatesCarregados);

    // Listener para atualização de templates
    const handleUpdate = () => {
      const novosTemplates = getTemplatesPorProfissao(profissao);
      setTemplates(novosTemplates);
    };

    window.addEventListener('templatesUpdated', handleUpdate);
    return () => window.removeEventListener('templatesUpdated', handleUpdate);
  }, [profissao]);

  const handleAtivar = (templateId: string) => {
    // Buscar o template
    const template = templates.find(t => t.id === templateId);

    if (!template) {
      alert('❌ Template não encontrado!');
      return;
    }

    // Validação: Template vazio
    if (template.perguntas.length === 0) {
      alert(
        '⚠️ Este template não tem nenhuma pergunta!\n\n' +
        'Adicione pelo menos 1 pergunta antes de ativar.'
      );
      return;
    }

    // Aviso se tiver muitas perguntas
    if (template.perguntas.length > 20) {
      const confirmar = confirm(
        `⚠️ Atenção: Este template tem ${template.perguntas.length} perguntas!\n\n` +
        'Templates muito longos podem desestimular o cliente.\n\n' +
        'Deseja ativar mesmo assim?'
      );
      if (!confirmar) return;
    }

    ativarTemplate(templateId);
  };

  const handleDuplicar = (template: Template) => {
    const novoNome = prompt(`Duplicar "${template.nome}"\n\nNome do novo template:`, `${template.nome} (Cópia)`);
    if (novoNome && novoNome.trim()) {
      duplicarTemplate(template.id, novoNome.trim());
    }
  };

  const handleExcluir = (template: Template) => {
    if (template.padrao) {
      alert('❌ Não é possível excluir o template padrão!');
      return;
    }

    if (template.ativo) {
      alert('❌ Não é possível excluir o template ativo!\n\nAtive outro template antes de excluir este.');
      return;
    }

    // Abrir modal de confirmação
    setTemplateParaExcluir(template);
  };

  const confirmarExclusaoTemplate = () => {
    if (!templateParaExcluir) return;

    const sucesso = excluirTemplate(templateParaExcluir.id);
    if (sucesso) {
      alert('✅ Template excluído com sucesso!');
    }
    setTemplateParaExcluir(null);
  };

  const handleEditar = (template: Template) => {
    setTemplateEditando(template);
  };

  const handleTrocarFormato = (template: Template) => {
    // Trocar entre quiz e ficha
    const novoFormato: FormatoTemplate = template.formato === 'quiz' ? 'ficha' : 'quiz';

    // Buscar todos os templates
    const templatesExistentes = JSON.parse(localStorage.getItem('anamneseTemplates') || '[]');

    // Encontrar e atualizar o template
    const index = templatesExistentes.findIndex((t: Template) => t.id === template.id);
    if (index !== -1) {
      templatesExistentes[index] = {
        ...templatesExistentes[index],
        formato: novoFormato,
        ultimaEdicao: new Date().toISOString()
      };

      // Salvar
      localStorage.setItem('anamneseTemplates', JSON.stringify(templatesExistentes));
      window.dispatchEvent(new Event('templatesUpdated'));

      console.log(`✅ Formato alterado: ${template.formato} → ${novoFormato}`);
    }
  };

  const handleNovoTemplate = () => {
    setShowNovoTemplateModal(true);
  };

  const handleCriarTemplate = (nome: string, formato: FormatoTemplate, tipoBase: 'zero' | 'padrao') => {
    // Buscar perguntas base se escolhido template padrão
    let perguntasIniciais = [];

    if (tipoBase === 'padrao') {
      // Buscar template padrão da profissão atual
      const templatePadrao = templates.find(t => t.padrao && t.profissao === profissao);
      if (templatePadrao) {
        // Copiar as perguntas do template padrão
        perguntasIniciais = JSON.parse(JSON.stringify(templatePadrao.perguntas));
        console.log(`✅ Copiando ${perguntasIniciais.length} perguntas do template padrão`);
      }
    }

    // Criar novo template
    const novoTemplate: Template = {
      id: gerarIdTemplate(),
      nome,
      descricao: tipoBase === 'padrao' ? 'Baseado no template padrão' : '',
      profissao,
      formato, // Formato escolhido pelo usuário
      perguntas: perguntasIniciais, // Vazio ou com perguntas do padrão
      ativo: false,
      padrao: false,
      dataCriacao: new Date().toISOString(),
      ultimaEdicao: new Date().toISOString(),
      totalPerguntas: perguntasIniciais.length
    };

    // Salvar template
    const templatesExistentes = JSON.parse(localStorage.getItem('anamneseTemplates') || '[]');
    templatesExistentes.push(novoTemplate);
    localStorage.setItem('anamneseTemplates', JSON.stringify(templatesExistentes));
    window.dispatchEvent(new Event('templatesUpdated'));

    // Fechar modal
    setShowNovoTemplateModal(false);

    // Abrir editor
    setTemplateEditando(novoTemplate);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Meus Templates</CardTitle>
              <CardDescription className="text-gray-600">
                Gerencie os templates de formulários para sua profissão
              </CardDescription>
            </div>
            <Button
              onClick={handleNovoTemplate}
              className="text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${cores.primary}15` }}
              >
                <Layout className="h-10 w-10" style={{ color: cores.primary }} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum template encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Crie seu primeiro template personalizado para formulários
              </p>
              <Button
                onClick={handleNovoTemplate}
                className="text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${cores.primary}, ${cores.secondary})` }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Template
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border-2 rounded-lg transition-all bg-white shadow-sm hover:shadow-md ${
                    template.ativo
                      ? `${cores.border500} ${cores.bg50}`
                      : `border-gray-200 hover:${cores.border300}`
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-900 flex-1 mr-2">{template.nome}</h3>
                    <div className="flex flex-col gap-1">
                      {/* Badge de Formato - COM TEXTO */}
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full whitespace-nowrap">
                        {FORMATO_ICONS[template.formato]} {FORMATO_LABELS[template.formato]}
                      </span>

                      {/* Badge ATIVO - COM TEXTO */}
                      {template.ativo && (
                        <span
                          className="px-2.5 py-1 text-white text-xs font-semibold rounded-full whitespace-nowrap"
                          style={{ backgroundColor: cores.primary }}
                        >
                          ✓ ATIVO
                        </span>
                      )}

                      {/* Badge PADRÃO - COM TEXTO */}
                      {template.padrao && (
                        <span className="px-2.5 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full whitespace-nowrap">
                          📌 PADRÃO
                        </span>
                      )}
                      {template.totalPerguntas === 0 && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">
                          ⚠️
                        </span>
                      )}
                      {template.totalPerguntas > 20 && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full whitespace-nowrap">
                          {template.totalPerguntas}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 mb-3 text-xs text-gray-600">
                    <div>📝 {template.totalPerguntas} perguntas</div>
                    <div>📅 {new Date(template.dataCriacao).toLocaleDateString('pt-BR')}</div>
                    {template.descricao && (
                      <div className="text-xs text-gray-500 mt-1">{template.descricao}</div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setTemplatePreview(template)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleEditar(template)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editar
                      </Button>
                    </div>

                    {/* Botão de Trocar Modo */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleTrocarFormato(template)}
                      title={`Trocar modo para ${template.formato === 'quiz' ? 'Ficha' : 'Quiz'}`}
                    >
                      <span className="text-sm">
                        {template.formato === 'quiz' ? '📋' : '🎯'} Trocar Modo para {template.formato === 'quiz' ? 'Ficha' : 'Quiz'}
                      </span>
                    </Button>

                    <div className="flex gap-2">
                      {!template.ativo && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          style={{ color: cores.primary, borderColor: cores.primary }}
                          onClick={() => handleAtivar(template.id)}
                        >
                          Ativar
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDuplicar(template)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicar
                      </Button>
                      {!template.padrao && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                          onClick={() => handleExcluir(template)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor de Template */}
      {templateEditando && (
        <TemplateEditor
          template={templateEditando}
          onClose={() => setTemplateEditando(null)}
        />
      )}

      {/* Modal de Novo Template */}
      {showNovoTemplateModal && (
        <ModalNovoTemplate
          onClose={() => setShowNovoTemplateModal(false)}
          onConfirm={handleCriarTemplate}
        />
      )}

      {/* Preview de Template */}
      {templatePreview && (
        <TemplatePreview
          template={templatePreview}
          onClose={() => setTemplatePreview(null)}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        isOpen={!!templateParaExcluir}
        onClose={() => setTemplateParaExcluir(null)}
        onConfirm={confirmarExclusaoTemplate}
        title="Excluir Template"
        message="Tem certeza que deseja excluir este template?"
        itemName={templateParaExcluir?.nome}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}
