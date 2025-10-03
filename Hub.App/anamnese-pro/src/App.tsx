import { useState } from 'react';
import { E4CEODashboardLayout } from './design-system';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { QuizContainer } from './components/quiz/QuizContainer';
import { AnamneseDetails } from './components/anamnese/AnamneseDetails';
import { TemplateEditor } from './components/anamnese/TemplateEditor';
import { TemplateSettings } from './components/settings/TemplateSettings';
import { LinkGenerated } from './components/anamnese/LinkGenerated';
import { generateAnamnesePDF } from './utils/generatePDF';

function App() {
  const [activeTab, setActiveTab] = useState('anamnese');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [quizMode, setQuizMode] = useState<'presencial' | 'remoto' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnamnese, setSelectedAnamnese] = useState<any>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLinkGenerated, setShowLinkGenerated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');

  // Mock de anamneses salvas
  const [anamneses, setAnamneses] = useState([
    {
      id: 1,
      clienteNome: 'Maria Silva',
      data: '15/03/2025',
      status: 'concluida' as const,
      preenchidoPor: 'profissional' as const,
      versao: 2,
    },
    {
      id: 2,
      clienteNome: 'João Santos',
      data: '18/03/2025',
      status: 'pendente' as const,
      preenchidoPor: 'cliente' as const,
      versao: 1,
      linkEnviado: 'https://anamnese.hub.app/cliente/abc123',
    },
    {
      id: 3,
      clienteNome: 'Ana Costa',
      data: '20/03/2025',
      status: 'concluida' as const,
      preenchidoPor: 'cliente' as const,
      versao: 1,
    },
  ]);

  const handleStartQuiz = (mode: 'presencial' | 'remoto') => {
    // Verificar limite de clientes
    const totalClientes = new Set(anamneses.map(a => a.clienteNome)).size;
    if (totalClientes >= 100) {
      alert('⚠️ Limite de 100 clientes atingido!\n\nVocê atingiu o limite do Anamnese Pro.\nPara cadastrar mais clientes, faça upgrade para o CRM Completo (clientes ilimitados).');
      return;
    }

    setQuizMode(mode);
    setShowModeSelection(false);

    // Se modo remoto, mostrar editor de template primeiro
    if (mode === 'remoto') {
      setShowTemplateEditor(true);
    } else {
      setShowQuiz(true);
    }
  };

  const handleConfirmTemplate = () => {
    // Gerar link único
    const linkId = Math.random().toString(36).substring(7);
    const uniqueLink = `${window.location.origin}/cliente/${linkId}`;

    // Mostrar modal com o link
    setGeneratedLink(uniqueLink);
    setShowTemplateEditor(false);
    setShowLinkGenerated(true);
  };

  const handleQuizComplete = (data: any) => {
    const novaAnamnese = {
      id: anamneses.length + 1,
      clienteNome: data.nomeCompleto || 'Cliente Sem Nome',
      data: new Date().toLocaleDateString('pt-BR'),
      status: quizMode === 'remoto' ? ('pendente' as const) : ('concluida' as const),
      preenchidoPor: quizMode === 'remoto' ? ('cliente' as const) : ('profissional' as const),
      versao: 1,
      linkEnviado: quizMode === 'remoto' ? `https://anamnese.hub.app/cliente/${Math.random().toString(36).substring(7)}` : undefined,
    };

    setAnamneses([novaAnamnese, ...anamneses]);
    console.log('Anamnese salva:', novaAnamnese);
    console.log('Dados completos:', data);
    setShowQuiz(false);
    setQuizMode(null);
  };

  const handleReenviarLink = (anamnese: any) => {
    alert(`Link reenviado!\n\n${anamnese.linkEnviado}\n\nO cliente receberá uma notificação para preencher a anamnese.`);
  };

  const handleGeneratePDF = (anamnese: any) => {
    generateAnamnesePDF(anamnese);
  };

  // Renderizar conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'anamnese':
        return (
          <div className="space-y-6">
            {!showQuiz && !showModeSelection ? (
              <>
                {/* Indicador de Limite */}
                <Card className="mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">👥 Clientes Cadastrados</h3>
                        <p className="text-sm text-gray-600">Limite do Anamnese Pro</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">
                          {new Set(anamneses.map(a => a.clienteNome)).size}/100
                        </div>
                        <p className="text-xs text-gray-500">
                          {100 - new Set(anamneses.map(a => a.clienteNome)).size} disponíveis
                        </p>
                      </div>
                    </div>
                    {/* Barra de progresso */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          (new Set(anamneses.map(a => a.clienteNome)).size / 100) * 100 > 80
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-pink-500 to-purple-500'
                        }`}
                        style={{ width: `${(new Set(anamneses.map(a => a.clienteNome)).size / 100) * 100}%` }}
                      />
                    </div>
                    {new Set(anamneses.map(a => a.clienteNome)).size >= 90 && (
                      <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Você está próximo do limite! Considere fazer upgrade para o CRM Completo.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-900">Nova Anamnese</CardTitle>
                    <CardDescription className="text-gray-600">
                      Preencha os dados do cliente para criar uma nova ficha
                    </CardDescription>
                  </CardHeader>
                <CardContent className="space-y-4">
                  {/* Busca de Cliente */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar Cliente
                    </label>
                    <input
                      type="text"
                      placeholder="Digite o nome do cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                    />
                    {searchTerm && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600">
                          {anamneses.filter(a => a.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())).length} cliente(s) encontrado(s)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <p className="text-gray-700 mb-3">
                      Ou crie uma nova anamnese:
                    </p>
                    <Button onClick={() => setShowModeSelection(true)} className="w-full">
                      + Nova Anamnese
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </>
            ) : null}

            {/* Histórico de Anamneses */}
            {!showQuiz && !showModeSelection && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Histórico de Anamneses</CardTitle>
                  <CardDescription className="text-gray-600">
                    Todas as fichas de anamnese criadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {anamneses.filter(a =>
                      !searchTerm || a.clienteNome.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((anamnese) => (
                      <div
                        key={anamnese.id}
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:scale-[1.02] transition-all bg-white shadow-sm hover:shadow-md"
                      >
                        {/* Cabeçalho do Card */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-gray-900 flex-1">{anamnese.clienteNome}</h3>
                          {anamnese.status === 'concluida' ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                              ✓ Concluída
                            </span>
                          ) : anamnese.status === 'pendente' ? (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full whitespace-nowrap">
                              ⏳ Pendente
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">
                              ✕ Expirada
                            </span>
                          )}
                        </div>

                        {/* Corpo do Card */}
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div>📅 {anamnese.data}</div>
                          <div>
                            {anamnese.preenchidoPor === 'profissional' ? '👩‍⚕️ Profissional' : '📱 Cliente'}
                          </div>
                          <div className="font-medium text-gray-700">v{anamnese.versao}</div>
                        </div>

                        {/* Rodapé do Card - Botões */}
                        <div className="flex flex-col gap-2 pt-3 border-t border-gray-100">
                          {anamnese.status === 'pendente' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReenviarLink(anamnese)}
                              className="w-full"
                            >
                              Reenviar Link
                            </Button>
                          )}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => setSelectedAnamnese(anamnese)}
                            >
                              Detalhes
                            </Button>
                            {anamnese.status === 'concluida' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleGeneratePDF(anamnese)}
                              >
                                📄 PDF
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Escolha de Modo */}
            {showModeSelection && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Escolha o Modo de Preenchimento</CardTitle>
                  <CardDescription className="text-gray-600">
                    Como você deseja criar esta anamnese?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleStartQuiz('presencial')}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl group-hover:bg-blue-200 transition-colors">
                          👩‍⚕️
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Anamnese Presencial</h3>
                          <p className="text-sm text-gray-600">
                            Você faz as perguntas e preenche o formulário durante o atendimento
                          </p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleStartQuiz('remoto')}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl group-hover:bg-purple-200 transition-colors">
                          📱
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">Anamnese Remota</h3>
                          <p className="text-sm text-gray-600">
                            Envie um link para o cliente preencher sozinho no celular dele
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                  <Button variant="outline" onClick={() => setShowModeSelection(false)}>
                    Voltar
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quiz */}
            {showQuiz && (
              <QuizContainer
                mode={quizMode || 'presencial'}
                onComplete={handleQuizComplete}
                onClose={() => {
                  setShowQuiz(false);
                  setQuizMode(null);
                }}
              />
            )}
          </div>
        );

      case 'clientes':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Lista de Clientes</CardTitle>
                <CardDescription className="text-gray-600">
                  0/100 clientes cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Aqui vamos listar todos os clientes cadastrados
                </p>
                <Button>Adicionar Cliente</Button>
              </CardContent>
            </Card>

            {/* Exemplo de card de cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Maria Silva</CardTitle>
                <CardDescription className="text-gray-600">
                  Última anamnese: 15/03/2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm">Ver Histórico</Button>
                  <Button size="sm" variant="outline">Nova Anamnese</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <E4CEODashboardLayout
        currentPage={activeTab}
        onPageChange={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        title="Anamnese Pro"
        onNotificationClick={() => console.log('Notificações')}
        onSettingsClick={() => setShowSettings(true)}
        onSearchClick={() => console.log('Buscar')}
        hasNotifications={false}
        notificationCount={0}
      >
        {renderContent()}
      </E4CEODashboardLayout>

      {/* Modal de Detalhes */}
      {selectedAnamnese && (
        <AnamneseDetails
          anamnese={selectedAnamnese}
          onClose={() => setSelectedAnamnese(null)}
        />
      )}

      {/* Editor de Template (Modo Remoto) */}
      {showTemplateEditor && (
        <TemplateEditor
          onConfirm={handleConfirmTemplate}
          onCancel={() => {
            setShowTemplateEditor(false);
            setShowModeSelection(true);
          }}
        />
      )}

      {/* Configurações - Template Padrão */}
      {showSettings && (
        <TemplateSettings onClose={() => setShowSettings(false)} />
      )}

      {/* Modal de Link Gerado */}
      {showLinkGenerated && (
        <LinkGenerated
          link={generatedLink}
          onClose={() => {
            setShowLinkGenerated(false);
            setShowModeSelection(false);
            setQuizMode(null);
          }}
        />
      )}
    </>
  );
}

export default App;
