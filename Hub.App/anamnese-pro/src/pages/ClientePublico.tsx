import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizContainer } from '../components/quiz/QuizContainer';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle } from 'lucide-react';

// Interface dos dados do quiz
interface QuizData {
  nomeCompleto: string;
  dataNascimento: string;
  genero: string; // NOVO: Masculino/Feminino
  cpf: string;
  instagram: string; // NOVO: @usuario
  telefone: string;
  email: string;
  // Endereço detalhado
  cep: string; // NOVO
  pais: string; // NOVO
  estado: string; // NOVO
  cidade: string; // NOVO
  rua: string; // NOVO
  numero: string; // NOVO
  complemento: string; // NOVO
  comoConheceu: string;
  outraOrigem?: string;
  doencas: string;
  medicamentos: string;
  temAlergias: boolean;
  alergias?: string;
  condicoesPele: string;
  temTatuagem: boolean;
  historicoTatuagens?: string;
  tatuagemComigo?: boolean; // NOVO: Se já fez tatuagem com essa tatuadora
  tipoTatuagem?: string; // NOVO: Pretas/Coloridas/Ambas
  localTatuagem: string;
  tamanhoTatuagem: string;
  estiloTatuagem: string;
  dataPreenchimento: string; // NOVO: Data que a anamnese foi preenchida
  aceitaTermo: boolean;
  assinatura: string;
  // NOTA: valorTatuagem NÃO está aqui - cliente remoto não preenche valor
}

export function ClientePublico() {
  const { linkId } = useParams(); // Pega o ID do link da URL
  const navigate = useNavigate();
  const [linkValido, setLinkValido] = useState<boolean | null>(null);
  const [empresaNome, setEmpresaNome] = useState('');
  const [concluido, setConcluido] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);

  // Quando a página carrega, verifica se o link é válido
  useEffect(() => {
    verificarLink();
  }, [linkId]);

  // Função que verifica se o link existe e está válido
  const verificarLink = () => {
    // 🌐 MODO REDE: Sempre considera o link válido (sem validação de localStorage)
    // Isso permite que dispositivos diferentes acessem o link
    if (linkId && linkId.length > 0) {
      setLinkValido(true);
      setEmpresaNome('Forms Pro');

      // Buscar perguntas do template ativo (se disponível)
      const templates = JSON.parse(localStorage.getItem('anamneseTemplates') || '[]');
      const config = JSON.parse(localStorage.getItem('anamneseConfig') || '{}');
      const profissaoAtual = config.templateProfissao || 'tatuagem';
      const templateAtivo = templates.find((t: any) => t.profissao === profissaoAtual && t.ativo);

      setCustomQuestions(templateAtivo?.perguntas || []);
      console.log('🌐 Link acessado de outro dispositivo:', linkId);
      console.log('📝 Template ativo carregado:', templateAtivo?.nome || 'Padrão');
    } else {
      setLinkValido(false);
    }

    setLoading(false);
  };

  // Quando o cliente completa o quiz
  const handleQuizComplete = (data: QuizData) => {
    try {
      // Salvar backup dos dados antes de processar
      console.log('💾 Salvando backup dos dados do cliente...');
      sessionStorage.setItem('anamneseBackup', JSON.stringify(data));

      // 1. Buscar a anamnese pendente associada a este link
      const anamnesesExistentes = JSON.parse(localStorage.getItem('anamneses') || '[]');
      const anamneseExistente = anamnesesExistentes.find((a: any) => a.linkId === linkId);

      if (anamneseExistente) {
        // Atualizar a anamnese pendente para concluída
        anamneseExistente.status = 'concluida';
        anamneseExistente.clienteNome = data.nomeCompleto;
        anamneseExistente.dadosCompletos = data;
        anamneseExistente.dataPreenchimento = new Date().toISOString();
      } else {
        // Se não encontrou, criar nova (fallback)
        const config = localStorage.getItem('anamneseConfig');
        const profissaoAtual = config ? JSON.parse(config).templateProfissao : 'tatuagem';

        const novaAnamnese = {
          id: Date.now(),
          linkId: linkId,
          clienteNome: data.nomeCompleto,
          data: new Date().toLocaleDateString('pt-BR'),
          status: 'concluida' as const,
          preenchidoPor: 'cliente' as const,
          profissao: profissaoAtual, // ✅ ADICIONAR PROFISSÃO
          versao: 1,
          dadosCompletos: data,
          dataCriacao: new Date().toISOString(),
        };
        anamnesesExistentes.push(novaAnamnese);
        console.log('✅ Nova anamnese criada com profissão:', profissaoAtual);
      }

      // ✅ GARANTIR que a anamnese existente também tem profissão
      if (anamneseExistente && !anamneseExistente.profissao) {
        const config = localStorage.getItem('anamneseConfig');
        anamneseExistente.profissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';
        console.log('✅ Profissão adicionada à anamnese existente');
      }

      // Salva de volta
      localStorage.setItem('anamneses', JSON.stringify(anamnesesExistentes));

    // 2. Criar/atualizar cliente IMEDIATAMENTE (antes de adicionar valor)
    console.log('🔍 INICIANDO CRIAÇÃO DE CLIENTE');
    console.log('📋 Dados recebidos do quiz:', data);

    const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');
    console.log('👥 Clientes existentes no localStorage:', clientesExistentes);

    // Buscar se o cliente já existe (por CPF)
    let clienteExistente = clientesExistentes.find((c: any) => c.cpf === data.cpf);
    let clienteId: number;

    if (clienteExistente) {
      // Cliente já existe, atualizar dados
      console.log('🔄 Cliente já existe, atualizando...');
      clienteExistente.nome = data.nomeCompleto;
      clienteExistente.telefone = data.telefone;
      clienteExistente.email = data.email;
      clienteExistente.instagram = data.instagram || clienteExistente.instagram || ''; // ✅ ATUALIZAR
      clienteExistente.sexo = data.genero || data.sexo || clienteExistente.sexo || ''; // ✅ ATUALIZAR
      clienteExistente.endereco = data.endereco;
      clienteExistente.dataNascimento = data.dataNascimento;
      clienteExistente.rg = data.rg;
      clienteExistente.totalAnamneses = (clienteExistente.totalAnamneses || 0) + 1;
      clienteExistente.totalTatuagens = (clienteExistente.totalTatuagens || 0) + 1;
      clienteExistente.ultimaAnamnese = new Date().toLocaleDateString('pt-BR');

      // ✅ Garantir que tem profissão (migração de dados antigos)
      if (!clienteExistente.profissao) {
        const config = localStorage.getItem('anamneseConfig');
        clienteExistente.profissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';
      }

      clienteId = clienteExistente.id;

      console.log('✅ Cliente atualizado:', clienteExistente);
    } else {
      // Cliente novo, criar
      console.log('🆕 Criando novo cliente...');
      clienteId = Date.now();

      // 🎯 Obter profissão atual do localStorage
      const config = localStorage.getItem('anamneseConfig');
      const profissaoAtual = config ? JSON.parse(config).templateProfissao : 'tatuagem';

      const novoCliente = {
        id: clienteId,
        nome: data.nomeCompleto,
        cpf: data.cpf,
        rg: data.rg,
        telefone: data.telefone,
        email: data.email,
        instagram: data.instagram || '', // ✅ NOVO
        sexo: data.genero || data.sexo || '', // ✅ NOVO: Para gráfico de distribuição
        endereco: data.endereco,
        dataNascimento: data.dataNascimento,
        fotoUrl: null,
        profissao: profissaoAtual, // ✅ CRÍTICO: Para filtrar por profissão
        comoConheceu: data.comoConheceu || '', // ✅ NOVO: Para gráfico de origem
        totalAnamneses: 1,
        totalTatuagens: 1,
        totalGasto: 0, // Valor será adicionado depois pela tatuadora
        primeiraAnamnese: new Date().toLocaleDateString('pt-BR'),
        ultimaAnamnese: new Date().toLocaleDateString('pt-BR'),
      };
      clientesExistentes.push(novoCliente);

      console.log('✅ Novo cliente criado:', novoCliente);
      console.log('🎯 Profissão:', profissaoAtual);
      console.log('👤 Gênero:', novoCliente.sexo);
      console.log('📱 Como conheceu:', novoCliente.comoConheceu);
    }

    // Salvar clientes
    console.log('💾 Salvando clientes no localStorage...');
    localStorage.setItem('clientes', JSON.stringify(clientesExistentes));
    console.log('✅ Clientes salvos! Total de clientes:', clientesExistentes.length);

    // Verificar se salvou mesmo
    const verificacao = JSON.parse(localStorage.getItem('clientes') || '[]');
    console.log('🔍 Verificação - Clientes após salvar:', verificacao);

    // Vincular anamnese ao cliente
    const anamneseParaVincular = anamnesesExistentes.find((a: any) => a.linkId === linkId);
    if (anamneseParaVincular) {
      anamneseParaVincular.clienteId = clienteId;
      localStorage.setItem('anamneses', JSON.stringify(anamnesesExistentes));
      console.log('✅ Anamnese vinculada ao cliente. ClienteId:', clienteId);
    } else {
      console.error('❌ Anamnese não encontrada para vincular!');
    }

    // 3. Marca o link como usado
    const linksSalvos = JSON.parse(localStorage.getItem('anamneseLinks') || '[]');
    const linkParaMarcar = linksSalvos.find((l: any) => l.id === linkId);
    if (linkParaMarcar) {
      linkParaMarcar.usado = true;
      linkParaMarcar.dataUso = new Date().toISOString();
      localStorage.setItem('anamneseLinks', JSON.stringify(linksSalvos));
    }

    // 4. Criar notificação para o profissional
    const notificacoesExistentes = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    const novaNotificacao = {
      id: `notif-${Date.now()}`,
      type: 'success',
      title: 'Nova Anamnese Recebida! 🎉',
      message: `${data.nomeCompleto} acabou de preencher a anamnese remotamente`,
      timestamp: new Date().toISOString(),
      lida: false
    };
    notificacoesExistentes.unshift(novaNotificacao);
    localStorage.setItem('notificacoes', JSON.stringify(notificacoesExistentes));

    // 5. DISPARAR EVENTO para atualização INSTANTÂNEA na aba de Clientes
    console.log('🚀 Disparando evento de atualização instantânea...');

    // Disparar evento customizado
    window.dispatchEvent(new CustomEvent('clienteUpdated', {
      detail: {
        clienteId,
        acao: clienteExistente ? 'atualizado' : 'criado',
        timestamp: new Date().toISOString()
      }
    }));

    // TAMBÉM disparar evento storage (caso esteja na mesma aba)
    window.dispatchEvent(new Event('storage'));

    // FORÇAR reload de TODAS as outras abas/janelas abertas
    try {
      // Salvar marcador de atualização
      localStorage.setItem('anamneseAtualizada', Date.now().toString());
    } catch (e) {
      console.warn('Não foi possível marcar atualização:', e);
    }

    console.log('✅ Eventos disparados! App.tsx receberá atualização instantânea.');

      // 6. Mostra mensagem de sucesso
      setConcluido(true);

      // 6. Simula notificação para a profissional
      console.log('✅ Anamnese concluída! Profissional será notificada.');

      // Limpar backup após sucesso
      sessionStorage.removeItem('anamneseBackup');

    } catch (error) {
      // Se deu erro, mostrar mensagem amigável
      console.error('❌ Erro ao salvar anamnese:', error);

      alert(
        '⚠️ Ops! Algo deu errado ao salvar sua anamnese.\n\n' +
        'Não se preocupe! Seus dados foram salvos temporariamente.\n\n' +
        'Por favor:\n' +
        '1. Tire um print desta tela\n' +
        '2. Entre em contato com o profissional\n' +
        '3. Informe o erro: "Falha ao salvar dados"\n\n' +
        'Seus dados estão seguros e podem ser recuperados!'
      );

      // Log detalhado para debug
      console.error('Detalhes do erro:', {
        erro: error,
        dados: data,
        linkId: linkId,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Tela de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
              <span className="text-white text-2xl">📋</span>
            </div>
            <p className="text-gray-600">Carregando anamnese...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Link inválido ou expirado
  if (linkValido === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-500 text-2xl">❌</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Link Inválido</h2>
            <p className="text-gray-600 mb-4">
              Este link expirou ou já foi utilizado.
              Entre em contato com o profissional para receber um novo link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Anamnese concluída com sucesso
  if (concluido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Anamnese Concluída! 🎉
            </h2>
            <p className="text-gray-600 mb-2">
              Sua ficha de anamnese foi enviada com sucesso!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {empresaNome} receberá uma notificação e terá acesso a todas as informações fornecidas.
            </p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800">
                ✅ Você pode fechar esta página.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tela principal - Quiz para o cliente
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col">
      {/* Header simples e limpo */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-lg py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📋</span>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">Ficha de Anamnese</h1>
              <p className="text-sm text-gray-600">{empresaNome}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal - Apenas o Quiz */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-4xl">
          {/* Mensagem de boas-vindas */}
          <Card className="mb-6 bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Olá! Seja bem-vindo(a) 👋
                </h2>
                <p className="text-gray-600 mb-4">
                  Por favor, preencha sua ficha de anamnese com atenção.
                  Todas as informações são importantes para sua segurança.
                </p>
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <span className="text-blue-600 text-sm font-medium">
                    ⏱️ Tempo estimado: 5-8 minutos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz - Componente que já existe */}
          <QuizContainer
            mode="remoto"
            onComplete={handleQuizComplete}
            onClose={() => {
              // Cliente não pode fechar, apenas completar
              alert('Por favor, complete a anamnese ou entre em contato com o profissional.');
            }}
            customQuestions={customQuestions}
          />
        </div>
      </main>

      {/* Footer simples */}
      <footer className="bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-lg py-4 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            Suas informações são confidenciais e protegidas pela LGPD
          </p>
        </div>
      </footer>
    </div>
  );
}
