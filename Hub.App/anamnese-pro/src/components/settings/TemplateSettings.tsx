import { X, Plus, Trash2, GripVertical, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

interface Question {
  id: number;
  section: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio';
  required: boolean;
  options?: string[];
}

interface TemplateSettingsProps {
  onClose: () => void;
}

export function TemplateSettings({ onClose }: TemplateSettingsProps) {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, section: 'Dados Pessoais', label: 'Nome Completo', type: 'text', required: true },
    { id: 2, section: 'Dados Pessoais', label: 'Data de Nascimento', type: 'text', required: true },
    { id: 3, section: 'Dados Pessoais', label: 'CPF', type: 'text', required: true },
    { id: 4, section: 'Dados Pessoais', label: 'RG', type: 'text', required: false },
    { id: 5, section: 'Dados Pessoais', label: 'Telefone', type: 'text', required: true },
    { id: 6, section: 'Dados Pessoais', label: 'Email', type: 'text', required: true },
    { id: 7, section: 'Dados Pessoais', label: 'Endereço', type: 'text', required: false },
    { id: 8, section: 'Origem', label: 'Como me conheceu?', type: 'radio', required: true, options: ['Instagram', 'Google', 'Indicação', 'Outro'] },
    { id: 9, section: 'Saúde', label: 'Doenças ou condições de saúde', type: 'textarea', required: false },
    { id: 10, section: 'Saúde', label: 'Medicamentos em uso', type: 'textarea', required: false },
    { id: 11, section: 'Alergias', label: 'Possui alergias?', type: 'radio', required: true, options: ['Sim', 'Não'] },
    { id: 12, section: 'Tatuagem', label: 'Local da tatuagem', type: 'text', required: true },
    { id: 13, section: 'Tatuagem', label: 'Tamanho aproximado', type: 'select', required: true, options: ['Pequena (até 5cm)', 'Média (5-15cm)', 'Grande (15-30cm)', 'Extra Grande (30cm+)'] },
    { id: 14, section: 'Tatuagem', label: 'Estilo desejado', type: 'text', required: true },
  ]);

  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    section: 'Dados Pessoais',
    label: '',
    type: 'text',
    required: false,
  });

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const toggleRequired = (id: number) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, required: !q.required } : q
    ));
  };

  const addQuestion = () => {
    if (!newQuestion.label) {
      alert('Por favor, preencha o título da pergunta');
      return;
    }

    const question: Question = {
      id: Math.max(...questions.map(q => q.id)) + 1,
      section: newQuestion.section || 'Dados Pessoais',
      label: newQuestion.label,
      type: newQuestion.type || 'text',
      required: newQuestion.required || false,
      options: newQuestion.options,
    };

    setQuestions([...questions, question]);
    setNewQuestion({ section: 'Dados Pessoais', label: '', type: 'text', required: false });
    setShowAddQuestion(false);
  };

  const handleSave = () => {
    alert('✅ Template padrão salvo com sucesso!\n\nTodas as novas anamneses usarão este template.');
    onClose();
  };

  const sections = [...new Set(questions.map(q => q.section))];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">⚙️ Configurar Template Padrão</h2>
            <p className="text-sm opacity-90">
              Este template será usado para TODAS as novas anamneses. Personalize as perguntas conforme sua necessidade.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
          <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">💡 Como funciona</h3>
            <p className="text-sm text-purple-700 mb-2">
              • Este é o template PADRÃO que aparecerá em todas as novas anamneses
            </p>
            <p className="text-sm text-purple-700 mb-2">
              • Você pode fazer edições pontuais antes de enviar ao cliente (no modo remoto)
            </p>
            <p className="text-sm text-purple-700">
              • Edições pontuais não alteram este template padrão
            </p>
          </div>

          {sections.map(section => (
            <div key={section} className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-pink-200">
                {section}
              </h3>
              <div className="space-y-3">
                {questions
                  .filter(q => q.section === section)
                  .map(question => (
                    <div
                      key={question.id}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 transition-colors bg-white"
                    >
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">{question.label}</p>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {question.type}
                          </span>
                          {question.required && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded font-semibold">
                              Obrigatória
                            </span>
                          )}
                        </div>
                        {question.options && (
                          <p className="text-xs text-gray-500">
                            Opções: {question.options.join(', ')}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRequired(question.id)}
                      >
                        {question.required ? 'Tornar Opcional' : 'Tornar Obrigatória'}
                      </Button>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* Adicionar Nova Pergunta */}
          {!showAddQuestion ? (
            <button
              onClick={() => setShowAddQuestion(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-pink-600"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Adicionar Nova Pergunta</span>
            </button>
          ) : (
            <div className="p-6 border-2 border-pink-300 rounded-xl bg-pink-50">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Nova Pergunta</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seção</label>
                  <select
                    value={newQuestion.section}
                    onChange={(e) => setNewQuestion({ ...newQuestion, section: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-pink-500 focus:outline-none"
                  >
                    {sections.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="Nova Seção">+ Nova Seção</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pergunta</label>
                  <input
                    type="text"
                    value={newQuestion.label}
                    onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
                    placeholder="Ex: Qual seu tipo sanguíneo?"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Campo</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as any })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 focus:border-pink-500 focus:outline-none"
                  >
                    <option value="text">Texto Curto</option>
                    <option value="textarea">Texto Longo</option>
                    <option value="select">Dropdown</option>
                    <option value="radio">Múltipla Escolha</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="required"
                    checked={newQuestion.required}
                    onChange={(e) => setNewQuestion({ ...newQuestion, required: e.target.checked })}
                    className="w-4 h-4 text-pink-500 rounded"
                  />
                  <label htmlFor="required" className="text-sm font-medium text-gray-700">
                    Pergunta obrigatória
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addQuestion} className="flex-1">
                    Adicionar
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddQuestion(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <p className="text-sm text-gray-700">
              <strong>{questions.length} perguntas</strong> no total •{' '}
              <strong>{questions.filter(q => q.required).length} obrigatórias</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end gap-3 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-green-500 flex items-center gap-2"
            onClick={handleSave}
          >
            <Save className="h-4 w-4" />
            Salvar Template Padrão
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
