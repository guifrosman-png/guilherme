import { useState, useEffect } from 'react';
import { E4CEODashboardLayout } from './design-system';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { QuizContainer } from './components/quiz/QuizContainer';
import { AnamneseDetails } from './components/anamnese/AnamneseDetails';
import { TemplateEditor } from './components/anamnese/TemplateEditor';
import { TemplateSettings } from './components/settings/TemplateSettings';
import { LinkGenerated } from './components/anamnese/LinkGenerated';
import { SmartSearchButton } from './components/SmartSearchButton';
import { NotificationBadge } from './components/NotificationBadge';
import { MobileNotificationPanel } from './components/MobileNotificationPanel';
import { DesktopNotificationPanel } from './components/DesktopNotificationPanel';
import { BaseSearchSystem } from './template-system/BaseSearchSystem';
import { AdvancedPeriodFilter } from './template-system/AdvancedPeriodFilter';
import { NotificationProvider, useNotifications } from './components/dynamic-notification-system';
import { generateAnamnesePDF } from './utils/generatePDF';
import { Filter, Search, Settings, Bell, Clock, Trash2 } from 'lucide-react';
import { useMobile } from './components/ui/use-mobile';
import { ClienteProfile } from './components/clientes/ClienteProfile';

function AppContent() {
  const isMobile = useMobile();
  const { notifications, addNotification } = useNotifications();
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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('semanal'); // 7d por padrão
  const [searchClientes, setSearchClientes] = useState(''); // Busca de clientes
  const [selectedCliente, setSelectedCliente] = useState<any>(null); // Cliente selecionado para ver perfil
  const [filtroClienteId, setFiltroClienteId] = useState<number | null>(null); // Filtrar anamneses por cliente
  const [initialQuizData, setInitialQuizData] = useState<any>(null); // Dados pré-preenchidos para o quiz

  // Anamneses salvas (carrega do localStorage)
  const [anamneses, setAnamneses] = useState<any[]>([]);

  // Carregar anamneses do localStorage ao iniciar
  useEffect(() => {
    const anamnesesSalvas = JSON.parse(localStorage.getItem('anamneses') || '[]');
    setAnamneses(anamnesesSalvas);
  }, []);

  // Atualizar quando houver mudanças no localStorage (polling a cada 2s)
  useEffect(() => {
    const interval = setInterval(() => {
      const anamnesesAtualizadas = JSON.parse(localStorage.getItem('anamneses') || '[]');
      setAnamneses(anamnesesAtualizadas);

      // Carregar e mostrar notificações do localStorage
      const notificacoesLocal = JSON.parse(localStorage.getItem('notificacoes') || '[]');
      notificacoesLocal.forEach((notif: any) => {
        if (!notif.lida) {
          addNotification({
            type: notif.type,
            title: notif.title,
            message: notif.message
          });
          // Marcar como lida
          notif.lida = true;
        }
      });
      localStorage.setItem('notificacoes', JSON.stringify(notificacoesLocal));
    }, 2000);

    return () => clearInterval(interval);
  }, [addNotification]);

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

  const handleConfirmTemplate = (customQuestions: any[]) => {
    // Gerar link único
    const linkId = Math.random().toString(36).substring(7);
    const uniqueLink = `${window.location.origin}/cliente/${linkId}`;

    // Salvar link no localStorage COM AS PERGUNTAS PERSONALIZADAS
    const linksSalvos = JSON.parse(localStorage.getItem('anamneseLinks') || '[]');
    const novoLink = {
      id: linkId,
      url: uniqueLink,
      dataCriacao: new Date().toISOString(),
      dataExpiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
      empresaNome: 'Anamnese Pro',
      usado: false,
      dataUso: null,
      customQuestions: customQuestions // SALVAR PERGUNTAS EDITADAS
    };
    linksSalvos.push(novoLink);
    localStorage.setItem('anamneseLinks', JSON.stringify(linksSalvos));

    // Criar anamnese pendente
    const novaAnamnese = {
      id: Date.now(),
      linkId: linkId,
      clienteNome: 'Aguardando preenchimento...',
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'pendente' as const,
      preenchidoPor: 'cliente' as const,
      versao: 1,
      linkEnviado: uniqueLink,
      dataCriacao: new Date().toISOString()
    };

    // Salvar no localStorage
    const anamnesesExistentes = JSON.parse(localStorage.getItem('anamneses') || '[]');
    anamnesesExistentes.push(novaAnamnese);
    localStorage.setItem('anamneses', JSON.stringify(anamnesesExistentes));

    // Atualizar estado
    setAnamneses([novaAnamnese, ...anamneses]);

    // Mostrar modal com o link
    setGeneratedLink(uniqueLink);
    setShowTemplateEditor(false);
    setShowLinkGenerated(true);
  };

  const handleQuizComplete = (data: any) => {
    // Criar/atualizar cliente PRIMEIRO para pegar o ID
    const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');
    let clienteExistente = clientesExistentes.find((c: any) => c.cpf === data.cpf);
    let clienteId: number;

    if (clienteExistente) {
      // Cliente já existe, atualiza os dados
      clienteExistente.nome = data.nomeCompleto;
      clienteExistente.telefone = data.telefone;
      clienteExistente.email = data.email;
      clienteExistente.endereco = data.endereco;
      clienteExistente.dataNascimento = data.dataNascimento;
      clienteExistente.rg = data.rg;
      clienteExistente.totalAnamneses = (clienteExistente.totalAnamneses || 0) + 1;
      clienteExistente.totalTatuagens = (clienteExistente.totalAnamneses || 0) + 1; // Total de tatuagens = total de anamneses
      clienteExistente.totalGasto = (clienteExistente.totalGasto || 0) + (data.valorTatuagem || 0); // Somar valor da tatuagem
      clienteExistente.ultimaAnamnese = new Date().toLocaleDateString('pt-BR');
      clienteId = clienteExistente.id;
    } else {
      // Cliente novo, cria um novo registro
      clienteId = Date.now();
      const novoCliente = {
        id: clienteId,
        nome: data.nomeCompleto,
        cpf: data.cpf,
        rg: data.rg,
        telefone: data.telefone,
        email: data.email,
        endereco: data.endereco,
        dataNascimento: data.dataNascimento,
        fotoUrl: null,
        totalAnamneses: 1,
        totalTatuagens: 1, // Primeira anamnese = primeira tatuagem
        totalGasto: data.valorTatuagem || 0, // Valor da primeira tatuagem
        primeiraAnamnese: new Date().toLocaleDateString('pt-BR'),
        ultimaAnamnese: new Date().toLocaleDateString('pt-BR'),
      };
      clientesExistentes.push(novoCliente);
    }

    localStorage.setItem('clientes', JSON.stringify(clientesExistentes));

    // Criar anamnese com clienteId
    const novaAnamnese = {
      id: Date.now(),
      clienteId: clienteId, // VINCULAR AO CLIENTE
      clienteNome: data.nomeCompleto || 'Cliente Sem Nome',
      data: new Date().toLocaleDateString('pt-BR'),
      status: quizMode === 'remoto' ? ('pendente' as const) : ('concluida' as const),
      preenchidoPor: quizMode === 'remoto' ? ('cliente' as const) : ('profissional' as const),
      versao: 1,
      linkEnviado: quizMode === 'remoto' ? `https://anamnese.hub.app/cliente/${Math.random().toString(36).substring(7)}` : undefined,
      dadosCompletos: data, // SALVAR TODOS OS DADOS DO QUIZ
      dataCriacao: new Date().toISOString(),
    };

    // Salvar no localStorage
    const anamnesesExistentes = JSON.parse(localStorage.getItem('anamneses') || '[]');
    anamnesesExistentes.unshift(novaAnamnese);
    localStorage.setItem('anamneses', JSON.stringify(anamnesesExistentes));

    setAnamneses([novaAnamnese, ...anamneses]);
    console.log('✅ Anamnese salva com todos os dados:', novaAnamnese);
    setShowQuiz(false);
    setQuizMode(null);
  };

  const handleReenviarLink = (anamnese: any) => {
    alert(`Link reenviado!\n\n${anamnese.linkEnviado}\n\nO cliente receberá uma notificação para preencher a anamnese.`);
  };

  const handleVerHistorico = (cliente: any) => {
    setFiltroClienteId(cliente.id); // Define filtro para este cliente
    setSelectedCliente(null); // Fecha o modal
    setActiveTab('anamnese'); // Vai para aba de anamnese
  };

  const handleNovaAnamnese = (cliente: any) => {
    // Buscar a última anamnese deste cliente
    const anamnesesDoCliente = anamneses.filter((a: any) => a.clienteId === cliente.id);
    const ultimaAnamnese = anamnesesDoCliente.length > 0 ? anamnesesDoCliente[0] : null;

    // Se tem anamnese anterior, pré-preencher com os dados dela
    if (ultimaAnamnese && ultimaAnamnese.dadosCompletos) {
      setInitialQuizData(ultimaAnamnese.dadosCompletos);
      console.log('📋 Pré-preenchendo quiz com dados da última anamnese:', ultimaAnamnese.dadosCompletos);
    } else {
      // Se não tem anamnese anterior, usar dados básicos do cliente
      setInitialQuizData({
        nomeCompleto: cliente.nome,
        cpf: cliente.cpf,
        rg: cliente.rg,
        telefone: cliente.telefone,
        email: cliente.email,
        endereco: cliente.endereco,
        dataNascimento: cliente.dataNascimento,
      });
      console.log('📋 Pré-preenchendo quiz com dados básicos do cliente');
    }

    setSelectedCliente(null); // Fecha o modal de perfil
    setActiveTab('anamnese'); // Vai para aba de anamnese
    setShowModeSelection(true); // Abre modal de seleção de modo
  };

  const handleGeneratePDF = (anamnese: any) => {
    generateAnamnesePDF(anamnese);
  };

  const handleExcluirAnamnese = (anamneseId: number) => {
    // Modal de confirmação
    const confirmar = window.confirm(
      '⚠️ Tem certeza que deseja excluir esta anamnese?\n\nEsta ação não pode ser desfeita.'
    );

    if (!confirmar) return;

    // Remover do localStorage
    const anamnesesAtualizadas = anamneses.filter((a) => a.id !== anamneseId);
    localStorage.setItem('anamneses', JSON.stringify(anamnesesAtualizadas));

    // Atualizar estado
    setAnamneses(anamnesesAtualizadas);

    // Notificação de sucesso
    addNotification({
      type: 'success',
      title: 'Anamnese Excluída',
      message: 'A anamnese foi removida do sistema com sucesso',
    });

    console.log(`🗑️ Anamnese ${anamneseId} excluída com sucesso`);
  };

  const handleExcluirCliente = (clienteId: number) => {
    // Modal de confirmação
    const confirmar = window.confirm(
      '⚠️ TEM CERTEZA que deseja excluir este cliente?\n\n' +
      '• Todas as anamneses deste cliente também serão excluídas\n' +
      '• Esta ação NÃO PODE ser desfeita\n\n' +
      'Digite SIM para confirmar'
    );

    if (!confirmar) return;

    // Buscar clientes
    const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');
    const clientesAtualizados = clientesExistentes.filter((c: any) => c.id !== clienteId);
    localStorage.setItem('clientes', JSON.stringify(clientesAtualizados));

    // Remover TODAS as anamneses deste cliente
    const anamnesesAtualizadas = anamneses.filter((a: any) => a.clienteId !== clienteId);
    localStorage.setItem('anamneses', JSON.stringify(anamnesesAtualizadas));
    setAnamneses(anamnesesAtualizadas);

    // Fechar modal de perfil
    setSelectedCliente(null);

    // Notificação de sucesso
    addNotification({
      type: 'success',
      title: 'Cliente Excluído',
      message: 'Cliente e todas suas anamneses foram removidos do sistema',
    });

    console.log(`🗑️ Cliente ${clienteId} e suas anamneses excluídos com sucesso`);
  };

  const handleUploadFoto = (clienteId: number, file: File) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Por favor, selecione uma imagem válida (JPG, PNG, etc.)');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ A imagem é muito grande. Por favor, selecione uma imagem menor que 5MB.');
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;

      // Atualizar cliente no localStorage
      const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');
      const clienteIndex = clientesExistentes.findIndex((c: any) => c.id === clienteId);

      if (clienteIndex !== -1) {
        clientesExistentes[clienteIndex].fotoUrl = base64;
        localStorage.setItem('clientes', JSON.stringify(clientesExistentes));

        // Recarregar clientes (força atualização da UI)
        window.location.reload();
      }
    };

    reader.readAsDataURL(file);
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
                    {anamneses.filter(a => {
                      // Filtro por busca de texto
                      const matchesSearch = !searchTerm || a.clienteNome.toLowerCase().includes(searchTerm.toLowerCase());
                      // Filtro por cliente específico (quando vem do histórico)
                      const matchesCliente = !filtroClienteId || a.clienteId === filtroClienteId;
                      return matchesSearch && matchesCliente;
                    }).map((anamnese) => (
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
                          {anamnese.preenchidoPor === 'cliente' && anamnese.status === 'concluida' && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs font-medium">
                              📱 Preenchida pelo Cliente
                            </div>
                          )}
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
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                              onClick={() => handleExcluirAnamnese(anamnese.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                  setInitialQuizData(null); // Limpar dados iniciais
                }}
                initialData={initialQuizData}
              />
            )}
          </div>
        );

      case 'clientes':
        // Carregar clientes do localStorage
        const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
        const totalClientes = clientes.length;

        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Lista de Clientes</CardTitle>
                <CardDescription className="text-gray-600">
                  {totalClientes}/100 clientes cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Campo de Busca */}
                {totalClientes > 0 && (
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar cliente por nome..."
                        value={searchClientes}
                        onChange={(e) => setSearchClientes(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {totalClientes === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👥</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
                    <p className="text-gray-600 mb-6">
                      Os clientes são criados automaticamente quando preenchem uma anamnese
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clientes
                      .filter((cliente: any) =>
                        cliente.nome.toLowerCase().includes(searchClientes.toLowerCase())
                      )
                      .map((cliente: any) => (
                      <div
                        key={cliente.id}
                        onClick={() => setSelectedCliente(cliente)}
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:scale-[1.02] transition-all bg-white shadow-sm hover:shadow-md cursor-pointer"
                      >
                        {/* Header com Foto */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative group">
                            {cliente.fotoUrl ? (
                              <img
                                src={cliente.fotoUrl}
                                alt={cliente.nome}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {cliente.nome.charAt(0).toUpperCase()}
                              </div>
                            )}
                            {/* Botão de upload - aparece ao passar o mouse */}
                            <label
                              htmlFor={`upload-foto-${cliente.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <span className="text-white text-xs">📷</span>
                            </label>
                            <input
                              id={`upload-foto-${cliente.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadFoto(cliente.id, file);
                                }
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{cliente.nome}</h3>
                            <p className="text-sm text-gray-500">
                              {cliente.totalAnamneses || 0} {cliente.totalAnamneses === 1 ? 'anamnese' : 'anamneses'}
                            </p>
                          </div>
                        </div>

                        {/* Informações */}
                        <div className="space-y-2 mb-4 text-sm text-gray-600">
                          <div>📱 {cliente.telefone || 'Não informado'}</div>
                          <div>📅 Última: {cliente.ultimaAnamnese || 'Nunca'}</div>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <Button size="sm" variant="outline" className="flex-1">
                            Ver Histórico
                          </Button>
                          <Button size="sm" className="flex-1">
                            Nova Anamnese
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
        onSearchClick={() => setShowSearchModal(true)}
        hasNotifications={false}
        notificationCount={0}
        rightContent={
          <div className="flex items-center gap-3">
            {/* Filtro de Período (7d, 30d, 3m, 1a) + Botão de Filtros */}
            <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg">
              {[
                { value: 'semanal', label: '7d' },
                { value: 'mensal', label: '30d' },
                { value: 'trimestral', label: '3m' },
                { value: 'anual', label: '1a' }
              ].map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    selectedPeriod === period.value
                      ? 'bg-pink-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {period.label}
                </button>
              ))}

              {/* Botão de Filtro Avançado integrado */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showFilters
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title="Filtros Avançados"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>

            {/* Botão de Busca (SmartSearchButton do template) */}
            <SmartSearchButton onClick={() => setShowSearchModal(true)} />

            {/* Botão de Notificações */}
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2.5 rounded-xl bg-white/95 backdrop-blur-xl border border-white/20 text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-200"
              title={`Notificações${notifications.length > 0 ? ` (${notifications.length})` : ''}`}
            >
              <Bell className="h-5 w-5" />
              <NotificationBadge count={notifications.length} />
            </button>

            {/* Botão de Configurações */}
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                showSettings
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white/95 backdrop-blur-xl border border-white/20 text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl'
              }`}
              title="Configurações"
            >
              <Settings className={`h-5 w-5 transition-transform duration-200 ${showSettings ? 'rotate-180' : ''}`} />
            </button>
          </div>
        }
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

      {/* Modal de Perfil do Cliente */}
      {selectedCliente && (
        <ClienteProfile
          cliente={selectedCliente}
          onClose={() => setSelectedCliente(null)}
          onVerHistorico={() => handleVerHistorico(selectedCliente)}
          onNovaAnamnese={() => handleNovaAnamnese(selectedCliente)}
          onExcluir={() => handleExcluirCliente(selectedCliente.id)}
        />
      )}

      {/* Notification Panels (do template) */}
      {isMobile ? (
        <MobileNotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          sidebarCollapsed={sidebarCollapsed}
        />
      ) : (
        <DesktopNotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          sidebarCollapsed={sidebarCollapsed}
        />
      )}

      {/* Advanced Period Filter Modal (do template) */}
      <AdvancedPeriodFilter
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        selectedPeriod={selectedPeriod}
        onPeriodChange={(period) => {
          setSelectedPeriod(period);
          setShowFilters(false);
        }}
        periodOptions={[
          { id: 'semanal', label: 'Últimos 7 dias', days: 7, icon: Clock },
          { id: 'mensal', label: 'Últimos 30 dias', days: 30, icon: Clock },
          { id: 'trimestral', label: 'Últimos 3 meses', days: 90, icon: Clock },
          { id: 'anual', label: 'Último ano', days: 365, icon: Clock }
        ]}
        title="Filtros Avançados"
        description="Escolha um período para análise"
      />

      {/* Search System (do template) */}
      <BaseSearchSystem
        config={{
          placeholder: 'Buscar anamnese...',
          categories: ['Anamneses', 'Clientes'],
          searchFields: ['clienteNome', 'data', 'status']
        }}
        data={anamneses}
        onResults={() => {}}
        onSelect={(result) => setSelectedAnamnese(result.data)}
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}
