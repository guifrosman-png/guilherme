/**
 * Modal de Perfil do Cliente
 * Mostra todas as informações do cliente
 */

import { X, User, Phone, Mail, MapPin, Calendar, FileText, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface ClienteProfileProps {
  cliente: any;
  onClose: () => void;
  onVerHistorico?: () => void;
  onNovaAnamnese?: () => void;
  onExcluir?: () => void;
}

export function ClienteProfile({ cliente, onClose, onVerHistorico, onNovaAnamnese, onExcluir }: ClienteProfileProps) {
  if (!cliente) return null;

  // Calcular idade se tiver data de nascimento
  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const idade = calcularIdade(cliente.dataNascimento);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-3xl z-50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Foto Grande */}
              {cliente.fotoUrl ? (
                <img
                  src={cliente.fotoUrl}
                  alt={cliente.nome}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-4xl font-bold">
                  {cliente.nome.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h2 className="text-3xl font-bold mb-1">{cliente.nome}</h2>
                {idade && (
                  <p className="text-white/90 text-lg">{idade} anos</p>
                )}
                <p className="text-white/70 text-sm mt-1">
                  Cliente desde {cliente.primeiraAnamnese || 'Data desconhecida'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-pink-500" />
                Informações Pessoais
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">CPF</p>
                    <p className="font-medium text-gray-900">{cliente.cpf || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">RG</p>
                    <p className="font-medium text-gray-900">{cliente.rg || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Data de Nascimento</p>
                    <p className="font-medium text-gray-900">
                      {cliente.dataNascimento
                        ? new Date(cliente.dataNascimento).toLocaleDateString('pt-BR')
                        : 'Não informado'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Contato */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-pink-500" />
                Contato
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium text-gray-900">{cliente.telefone || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{cliente.email || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="font-medium text-gray-900">{cliente.endereco || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-3xl font-bold text-blue-600">{cliente.totalAnamneses || 0}</p>
              <p className="text-sm text-blue-700">Anamneses</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl text-center">
              <p className="text-3xl font-bold text-purple-600">{cliente.totalTatuagens || 0}</p>
              <p className="text-sm text-purple-700">Tatuagens</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-xl text-center">
              <p className="text-3xl font-bold text-pink-600">R$ {cliente.totalGasto || 0}</p>
              <p className="text-sm text-pink-700">Total Gasto</p>
            </div>
          </div>

          {/* Histórico de Anamneses */}
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Histórico de Anamneses</h3>
            <div className="space-y-2">
              {cliente.totalAnamneses > 0 ? (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                      Primeira anamnese: {cliente.primeiraAnamnese || 'Data desconhecida'}
                    </p>
                    <p className="text-gray-600">
                      Última anamnese: {cliente.ultimaAnamnese || 'Data desconhecida'}
                    </p>
                  </div>
                  {onVerHistorico && (
                    <Button
                      onClick={onVerHistorico}
                      variant="outline"
                      className="w-full"
                    >
                      Ver Histórico Completo
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">Nenhuma anamnese registrada</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between gap-3">
          {/* Botão de excluir à esquerda */}
          {onExcluir && (
            <Button
              variant="outline"
              onClick={onExcluir}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Cliente
            </Button>
          )}

          {/* Botões principais à direita */}
          <div className="flex gap-3 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button
              className="bg-pink-500 hover:bg-pink-600"
              onClick={onNovaAnamnese}
            >
              Nova Anamnese
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
