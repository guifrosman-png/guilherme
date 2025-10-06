import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizContainer } from '../components/quiz/QuizContainer';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle } from 'lucide-react';

// Interface dos dados do quiz
interface QuizData {
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  telefone: string;
  endereco: string;
  email: string;
  comoConheceu: string;
  outraOrigem?: string;
  doencas: string;
  medicamentos: string;
  temAlergias: boolean;
  alergias?: string;
  condicoesPele: string;
  temTatuagem: boolean;
  historicoTatuagens?: string;
  localTatuagem: string;
  tamanhoTatuagem: string;
  estiloTatuagem: string;
  aceitaTermo: boolean;
  assinatura: string;
}

export function ClientePublico() {
  const { linkId } = useParams(); // Pega o ID do link da URL
  const navigate = useNavigate();
  const [linkValido, setLinkValido] = useState<boolean | null>(null);
  const [empresaNome, setEmpresaNome] = useState('');
  const [concluido, setConcluido] = useState(false);
  const [loading, setLoading] = useState(true);

  // Quando a página carrega, verifica se o link é válido
  useEffect(() => {
    verificarLink();
  }, [linkId]);

  // Função que verifica se o link existe e está válido
  const verificarLink = () => {
    // Busca os links salvos no localStorage
    const linksSalvos = JSON.parse(localStorage.getItem('anamneseLinks') || '[]');

    // Procura o link específico
    const linkEncontrado = linksSalvos.find((l: any) => l.id === linkId);

    if (linkEncontrado) {
      // Verifica se o link não expirou (7 dias)
      const dataExpiracao = new Date(linkEncontrado.dataExpiracao);
      const hoje = new Date();

      if (hoje > dataExpiracao) {
        setLinkValido(false); // Link expirado
      } else if (linkEncontrado.usado) {
        setLinkValido(false); // Link já foi usado
      } else {
        setLinkValido(true); // Link válido!
        setEmpresaNome(linkEncontrado.empresaNome || 'Profissional');
      }
    } else {
      setLinkValido(false); // Link não existe
    }

    setLoading(false);
  };

  // Quando o cliente completa o quiz
  const handleQuizComplete = (data: QuizData) => {
    // 1. Salva a anamnese completa
    const novaAnamnese = {
      id: Date.now(),
      linkId: linkId,
      clienteNome: data.nomeCompleto,
      data: new Date().toLocaleDateString('pt-BR'),
      status: 'concluida' as const,
      preenchidoPor: 'cliente' as const,
      versao: 1,
      dadosCompletos: data, // Todos os dados do quiz
      dataCriacao: new Date().toISOString(),
    };

    // Busca anamneses existentes
    const anamnesesExistentes = JSON.parse(localStorage.getItem('anamneses') || '[]');

    // Adiciona a nova anamnese
    anamnesesExistentes.push(novaAnamnese);

    // Salva de volta
    localStorage.setItem('anamneses', JSON.stringify(anamnesesExistentes));

    // 2. Cria/atualiza o cliente na aba de clientes
    const clientesExistentes = JSON.parse(localStorage.getItem('clientes') || '[]');

    // Verifica se o cliente já existe (por CPF)
    const clienteExistente = clientesExistentes.find((c: any) => c.cpf === data.cpf);

    if (clienteExistente) {
      // Cliente já existe, atualiza os dados
      clienteExistente.nome = data.nomeCompleto;
      clienteExistente.telefone = data.telefone;
      clienteExistente.email = data.email;
      clienteExistente.endereco = data.endereco;
      clienteExistente.dataNascimento = data.dataNascimento;
      clienteExistente.totalAnamneses = (clienteExistente.totalAnamneses || 0) + 1;
      clienteExistente.ultimaAnamnese = new Date().toLocaleDateString('pt-BR');
    } else {
      // Cliente novo, cria um novo registro
      const novoCliente = {
        id: Date.now(),
        nome: data.nomeCompleto,
        cpf: data.cpf,
        rg: data.rg,
        telefone: data.telefone,
        email: data.email,
        endereco: data.endereco,
        dataNascimento: data.dataNascimento,
        fotoUrl: null,
        fotoAutorizada: false,
        totalAnamneses: 1,
        totalTatuagens: data.temTatuagem ? 1 : 0,
        totalGasto: 0,
        primeiraAnamnese: new Date().toLocaleDateString('pt-BR'),
        ultimaAnamnese: new Date().toLocaleDateString('pt-BR'),
      };

      clientesExistentes.push(novoCliente);
    }

    // Salva clientes atualizados
    localStorage.setItem('clientes', JSON.stringify(clientesExistentes));

    // 3. Marca o link como usado
    const linksSalvos = JSON.parse(localStorage.getItem('anamneseLinks') || '[]');
    const linkParaMarcar = linksSalvos.find((l: any) => l.id === linkId);
    if (linkParaMarcar) {
      linkParaMarcar.usado = true;
      linkParaMarcar.dataUso = new Date().toISOString();
      localStorage.setItem('anamneseLinks', JSON.stringify(linksSalvos));
    }

    // 4. Mostra mensagem de sucesso
    setConcluido(true);

    // 5. Simula notificação para a profissional
    console.log('✅ Anamnese concluída! Profissional será notificada.');
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
