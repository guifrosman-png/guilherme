import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { generateAnamnesePDF } from '../../utils/generatePDF';

interface AnamneseDetailsProps {
  anamnese: any;
  onClose: () => void;
}

export function AnamneseDetails({ anamnese, onClose }: AnamneseDetailsProps) {
  // 🎨 OBTER CORES TEMÁTICAS DA PROFISSÃO
  const getCoresTema = () => {
    const config = localStorage.getItem('anamneseConfig');
    const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';

    const cores: any = {
      tatuagem: {
        gradient: 'from-pink-500 to-purple-500',
        bg50: 'bg-pink-50',
        bg100: 'bg-pink-100',
        bg500: 'bg-pink-500',
        text500: 'text-pink-500',
        text700: 'text-pink-700',
        border200: 'border-pink-200',
        border300: 'border-pink-300',
        border500: 'border-pink-500',
        hover: 'hover:bg-pink-50 hover:border-pink-500',
        focus: 'focus:border-pink-500',
      },
      psicologia: {
        gradient: 'from-blue-500 to-cyan-500',
        bg50: 'bg-blue-50',
        bg100: 'bg-blue-100',
        bg500: 'bg-blue-500',
        text500: 'text-blue-500',
        text700: 'text-blue-700',
        border200: 'border-blue-200',
        border300: 'border-blue-300',
        border500: 'border-blue-500',
        hover: 'hover:bg-blue-50 hover:border-blue-500',
        focus: 'focus:border-blue-500',
      },
      nutricao: {
        gradient: 'from-green-500 to-emerald-500',
        bg50: 'bg-green-50',
        bg100: 'bg-green-100',
        bg500: 'bg-green-500',
        text500: 'text-green-500',
        text700: 'text-green-700',
        border200: 'border-green-200',
        border300: 'border-green-300',
        border500: 'border-green-500',
        hover: 'hover:bg-green-50 hover:border-green-500',
        focus: 'focus:border-green-500',
      },
      fisioterapia: {
        gradient: 'from-orange-500 to-amber-500',
        bg50: 'bg-orange-50',
        bg100: 'bg-orange-100',
        bg500: 'bg-orange-500',
        text500: 'text-orange-500',
        text700: 'text-orange-700',
        border200: 'border-orange-200',
        border300: 'border-orange-300',
        border500: 'border-orange-500',
        hover: 'hover:bg-orange-50 hover:border-orange-500',
        focus: 'focus:border-orange-500',
      },
      estetica: {
        gradient: 'from-purple-500 to-fuchsia-500',
        bg50: 'bg-purple-50',
        bg100: 'bg-purple-100',
        bg500: 'bg-purple-500',
        text500: 'text-purple-500',
        text700: 'text-purple-700',
        border200: 'border-purple-200',
        border300: 'border-purple-300',
        border500: 'border-purple-500',
        hover: 'hover:bg-purple-50 hover:border-purple-500',
        focus: 'focus:border-purple-500',
      },
    };
    return cores[templateProfissao] || cores.tatuagem;
  };

  const coresTema = getCoresTema();

  // Detectar profissão atual
  const config = localStorage.getItem('anamneseConfig');
  const profissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden my-8">
        {/* Header */}
        <div className={`bg-gradient-to-r ${coresTema.gradient} p-6 relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-2">{anamnese.clienteNome}</h2>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span>📅 {anamnese.data}</span>
              <span>•</span>
              <span>
                {anamnese.preenchidoPor === 'profissional' ? '👩‍⚕️ Preenchida pela Profissional' : '📱 Preenchida pelo Cliente'}
              </span>
              <span>•</span>
              <span>v{anamnese.versao}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Status */}
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            {anamnese.status === 'concluida' ? (
              <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                ✓ Concluída
              </span>
            ) : anamnese.status === 'pendente' ? (
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
                ⏳ Pendente - Aguardando Cliente
              </span>
            ) : (
              <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                ✕ Expirada
              </span>
            )}
          </div>

          {/* Se pendente, mostrar link */}
          {anamnese.status === 'pendente' && anamnese.linkEnviado && (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">Link enviado ao cliente:</h3>
              <code className="text-sm text-yellow-700 bg-white px-3 py-2 rounded block break-all">
                {anamnese.linkEnviado}
              </code>
              <p className="text-xs text-yellow-600 mt-2">
                Aguardando o cliente preencher o formulário
              </p>
            </div>
          )}

          {/* Dados do Quiz (REAIS do localStorage) */}
          {anamnese.status === 'concluida' && anamnese.dadosCompletos && (
            <div className="space-y-6">
              {/* ========== SEÇÃO FIXA 1: DADOS PESSOAIS ========== */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${coresTema.bg100} rounded-full flex items-center justify-center`}>
                    <span className="text-xl">📄</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Dados Pessoais</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.nomeCompleto || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
                    <p className="text-gray-900 font-medium">
                      {anamnese.dadosCompletos.dataNascimento
                        ? new Date(anamnese.dadosCompletos.dataNascimento).toLocaleDateString('pt-BR')
                        : 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CPF</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.cpf || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefone</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.telefone || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">E-mail</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.email || 'Não informado'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Endereço Completo</label>
                    {anamnese.dadosCompletos.cep ? (
                      <div className="space-y-1">
                        <p className="text-gray-900 font-medium">
                          {anamnese.dadosCompletos.rua}, {anamnese.dadosCompletos.numero}
                          {anamnese.dadosCompletos.complemento && ` - ${anamnese.dadosCompletos.complemento}`}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {anamnese.dadosCompletos.bairro} - {anamnese.dadosCompletos.cidade}/{anamnese.dadosCompletos.estado}
                        </p>
                        <p className="text-gray-500 text-xs">CEP: {anamnese.dadosCompletos.cep}</p>
                      </div>
                    ) : (
                      <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.endereco || 'Não informado'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ========== SEÇÃO DINÂMICA: PERGUNTAS CUSTOMIZADAS ========== */}
              {anamnese.dadosCompletos.perguntasSnapshot &&
               anamnese.dadosCompletos.perguntasSnapshot.length > 0 &&
               anamnese.dadosCompletos.respostasCustomizadas && (
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${coresTema.bg100} rounded-full flex items-center justify-center`}>
                      <span className="text-xl">🎯</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Perguntas do Formulário</h3>
                  </div>

                  <div className="space-y-4">
                    {anamnese.dadosCompletos.perguntasSnapshot.map((pergunta: any, index: number) => {
                      const resposta = anamnese.dadosCompletos.respostasCustomizadas[pergunta.id];

                      return (
                        <div key={pergunta.id} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                          {/* Pergunta */}
                          <div className="flex items-start gap-2 mb-2">
                            <span className={`${coresTema.text500} font-bold text-sm`}>#{index + 1}</span>
                            <label className="text-sm font-semibold text-gray-900">
                              {pergunta.titulo}
                              {pergunta.obrigatoria && <span className={`ml-1 ${coresTema.text500}`}>*</span>}
                            </label>
                          </div>

                          {/* Resposta */}
                          <div className={`ml-6 pl-3 border-l-2 ${coresTema.border200}`}>
                            {pergunta.tipo === 'simNao' ? (
                              <p className={`font-medium ${resposta === true || resposta === 'true' ? 'text-green-600' : 'text-gray-600'}`}>
                                {resposta === true || resposta === 'true' ? '✅ Sim' : '❌ Não'}
                              </p>
                            ) : pergunta.tipo === 'multiplaEscolha' || pergunta.tipo === 'caixasSelecao' ? (
                              <p className="text-gray-900">
                                {Array.isArray(resposta)
                                  ? resposta.join(', ')
                                  : resposta || 'Não respondido'}
                              </p>
                            ) : pergunta.tipo === 'arquivo' ? (
                              resposta ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span>📎</span>
                                    <span>Arquivo enviado</span>
                                  </div>
                                  {resposta.startsWith('data:image/') ? (
                                    <img
                                      src={resposta}
                                      alt="Arquivo enviado"
                                      className="max-w-md rounded-lg border-2 border-gray-200"
                                    />
                                  ) : (
                                    <a
                                      href={resposta}
                                      download
                                      className={`inline-flex items-center gap-2 px-4 py-2 ${coresTema.bg50} ${coresTema.text500} rounded-lg hover:opacity-80 transition-opacity`}
                                    >
                                      <span>📥</span>
                                      <span>Baixar arquivo</span>
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">Nenhum arquivo enviado</p>
                              )
                            ) : pergunta.tipo === 'classificacao' ? (
                              <div className="flex items-center gap-1">
                                {Array.from({ length: parseInt(resposta) || 0 }).map((_, i) => (
                                  <span key={i} className="text-2xl">
                                    {pergunta.configClassificacao?.formato === 'coracoes' ? '❤️' : '⭐'}
                                  </span>
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  ({resposta || 0}/{pergunta.configClassificacao?.quantidadeEstrelas || 5})
                                </span>
                              </div>
                            ) : pergunta.tipo === 'escalaLinear' ? (
                              <div className="flex items-center gap-3">
                                <span className={`text-2xl font-bold ${coresTema.text500}`}>{resposta || 'N/A'}</span>
                                {pergunta.configEscala && (
                                  <span className="text-sm text-gray-500">
                                    (de {pergunta.configEscala.minimo} a {pergunta.configEscala.maximo})
                                  </span>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-900 whitespace-pre-wrap">
                                {resposta || 'Não respondido'}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========== AVISO: ANAMNESES ANTIGAS ========== */}
              {(!anamnese.dadosCompletos.perguntasSnapshot || anamnese.dadosCompletos.perguntasSnapshot.length === 0) && (
                <div className="border-2 border-yellow-200 bg-yellow-50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h3 className="text-lg font-bold text-yellow-900">Anamnese Antiga</h3>
                  </div>
                  <p className="text-sm text-yellow-800">
                    Esta anamnese foi criada antes da atualização do sistema de templates customizáveis.
                    As perguntas específicas não estão disponíveis neste formato.
                  </p>
                </div>
              )}

              {/* Seção: Data da Anamnese */}
              {anamnese.dadosCompletos.dataAnamnese && (
                <div className="border-2 border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 ${coresTema.bg100} rounded-full flex items-center justify-center`}>
                      <span className="text-xl">📅</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Data do Formulário</h3>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de realização</label>
                    <p className="text-gray-900 font-medium text-lg">
                      {new Date(anamnese.dadosCompletos.dataAnamnese + 'T00:00:00').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Seção: Termo e Assinatura */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Termo de Compromisso</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Termo aceito?</label>
                    <p className={`font-semibold ${anamnese.dadosCompletos.aceitaTermo ? 'text-emerald-600' : 'text-red-600'}`}>
                      {anamnese.dadosCompletos.aceitaTermo ? '✓ Sim, aceito' : '✗ Não aceito'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Assinatura Digital</label>
                    <p className="text-gray-900 font-signature text-2xl" style={{ fontFamily: 'cursive' }}>
                      {anamnese.dadosCompletos.assinatura || anamnese.clienteNome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Se pendente, não mostra dados */}
          {anamnese.status === 'pendente' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⏳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Aguardando Preenchimento</h3>
              <p className="text-gray-600">
                O cliente ainda não preencheu a anamnese. Os dados aparecerão aqui assim que ele concluir.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end gap-3 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {anamnese.status === 'concluida' && (
            <Button
              className={`bg-gradient-to-r ${coresTema.gradient}`}
              onClick={() => {
                generateAnamnesePDF(anamnese);
                onClose();
              }}
            >
              📄 Gerar PDF
            </Button>
          )}
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
