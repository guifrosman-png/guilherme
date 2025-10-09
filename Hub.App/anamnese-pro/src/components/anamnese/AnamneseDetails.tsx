import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { generateAnamnesePDF } from '../../utils/generatePDF';

interface AnamneseDetailsProps {
  anamnese: any;
  onClose: () => void;
}

export function AnamneseDetails({ anamnese, onClose }: AnamneseDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 relative">
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
              {/* Seção 1: Dados Pessoais */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
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
                    <label className="text-sm font-medium text-gray-600">RG</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.rg || 'Não informado'}</p>
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
                    <label className="text-sm font-medium text-gray-600">Endereço</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.endereco || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Seção 2: Como me conheceu */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">📍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Origem do Cliente</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Como me conheceu?</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.comoConheceu || 'Não informado'}</p>
                  </div>
                  {anamnese.dadosCompletos.outraOrigem && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Especificação</label>
                      <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.outraOrigem}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 3: Saúde Geral */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">❤️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Saúde Geral</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Doenças ou condições de saúde</label>
                    <p className="text-gray-900">{anamnese.dadosCompletos.doencas || 'Nenhuma informação'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Medicamentos em uso</label>
                    <p className="text-gray-900">{anamnese.dadosCompletos.medicamentos || 'Nenhuma informação'}</p>
                  </div>
                </div>
              </div>

              {/* Seção 4: Alergias */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Alergias</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Possui alergias?</label>
                    <p className="text-gray-900 font-medium">
                      {anamnese.dadosCompletos.temAlergias ? '✅ Sim' : '❌ Não'}
                    </p>
                  </div>
                  {anamnese.dadosCompletos.temAlergias && anamnese.dadosCompletos.alergias && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Quais alergias?</label>
                      <p className="text-gray-900">{anamnese.dadosCompletos.alergias}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 5: Condições de Pele */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Condições de Pele</h3>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Condições específicas</label>
                  <p className="text-gray-900">{anamnese.dadosCompletos.condicoesPele || 'Nenhuma informação'}</p>
                </div>
              </div>

              {/* Seção 6: Histórico de Tatuagens */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Histórico de Tatuagens</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Já fez tatuagem antes?</label>
                    <p className="text-gray-900 font-medium">
                      {anamnese.dadosCompletos.temTatuagem ? '✅ Sim' : '❌ Não'}
                    </p>
                  </div>
                  {anamnese.dadosCompletos.temTatuagem && anamnese.dadosCompletos.historicoTatuagens && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Histórico</label>
                      <p className="text-gray-900">{anamnese.dadosCompletos.historicoTatuagens}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 7: Nova Tatuagem */}
              <div className="border-2 border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🖼️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Nova Tatuagem</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Local</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.localTatuagem || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tamanho</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.tamanhoTatuagem || 'Não informado'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Estilo</label>
                    <p className="text-gray-900 font-medium">{anamnese.dadosCompletos.estiloTatuagem || 'Não informado'}</p>
                  </div>
                </div>
              </div>

              {/* Seção 8: Termo e Assinatura */}
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
              className="bg-gradient-to-r from-pink-500 to-purple-500"
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
