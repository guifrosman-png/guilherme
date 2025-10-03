import { X, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

interface LinkGeneratedProps {
  link: string;
  onClose: () => void;
}

export function LinkGenerated({ link, onClose }: LinkGeneratedProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <div className="text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">✅ Link Gerado com Sucesso!</h2>
            <p className="text-sm opacity-90">
              Envie este link para o cliente preencher a anamnese
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Instruções */}
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">📱 Como funciona:</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>1. Copie o link abaixo</li>
              <li>2. Envie para o cliente via WhatsApp, SMS ou Email</li>
              <li>3. O cliente abrirá o link e responderá o quiz</li>
              <li>4. Quando finalizar, a anamnese aparecerá automaticamente no seu histórico!</li>
            </ul>
          </div>

          {/* Link com botão copiar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Link para o Cliente:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 bg-gray-50 font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleCopy}
                className={`px-6 ${
                  copied
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Atalhos de envio */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Ou envie diretamente:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent('Olá! Por favor, preencha sua anamnese através deste link: ' + link)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center"
              >
                <div className="text-3xl mb-2">📱</div>
                <div className="text-sm font-medium text-gray-900">WhatsApp</div>
              </a>
              <a
                href={`mailto:?subject=Anamnese&body=${encodeURIComponent('Olá! Por favor, preencha sua anamnese através deste link: ' + link)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
              >
                <div className="text-3xl mb-2">📧</div>
                <div className="text-sm font-medium text-gray-900">Email</div>
              </a>
              <a
                href={`sms:?&body=${encodeURIComponent('Olá! Por favor, preencha sua anamnese através deste link: ' + link)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-purple-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
              >
                <div className="text-3xl mb-2">💬</div>
                <div className="text-sm font-medium text-gray-900">SMS</div>
              </a>
            </div>
          </div>

          {/* Aviso importante */}
          <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Importante:</h3>
            <p className="text-sm text-yellow-700">
              A anamnese ficará com status "Pendente" até o cliente finalizar o preenchimento.
              Você será notificado automaticamente quando ele concluir!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex justify-end bg-gray-50">
          <Button onClick={onClose} className="bg-gradient-to-r from-pink-500 to-purple-500">
            Entendi, Fechar
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
