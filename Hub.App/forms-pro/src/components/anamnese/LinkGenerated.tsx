import { X, Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

interface LinkGeneratedProps {
  link: string;
  onClose: () => void;
}

export function LinkGenerated({ link, onClose }: LinkGeneratedProps) {
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      // Tentar usar Clipboard API moderna (mais seguro)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        // Fallback para navegadores antigos ou HTTP (não HTTPS)
        const textArea = document.createElement('textarea');
        textArea.value = link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          } else {
            alert('❌ Não foi possível copiar. Por favor, selecione e copie manualmente (Ctrl+C)');
          }
        } catch (err) {
          console.error('Erro ao copiar:', err);
          alert('❌ Não foi possível copiar. Por favor, selecione e copie manualmente (Ctrl+C)');
        }

        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      alert('❌ Erro ao copiar o link. Por favor, selecione o texto e copie manualmente (Ctrl+C)');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header com Botão de Fechar DESTACADO */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-12 h-12 bg-white hover:bg-white/90 rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl z-10 hover:scale-110"
            title="Fechar"
          >
            <X className="h-6 w-6 text-emerald-600" />
          </button>
          <div className="text-white text-center pr-12">
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
          {/* 🌐 DESTAQUE DO IP */}
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl">
            <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
              <span className="text-lg">🌐</span>
              Link com seu IP da Rede WiFi
            </h3>
            <div className="bg-white/60 rounded-lg p-3 border border-emerald-200">
              <p className="text-xs font-mono text-emerald-900 break-all">
                {link}
              </p>
            </div>
            <p className="text-xs text-emerald-700 mt-2">
              ✅ Funciona para qualquer celular/computador conectado na <strong>mesma rede WiFi</strong> que você!
            </p>
          </div>

          {/* Instruções */}
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">📱 Como funciona:</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>1. Copie o link abaixo (ou envie direto pelo WhatsApp)</li>
              <li>2. O cliente precisa estar na <strong>mesma rede WiFi</strong> que você</li>
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
                    : `bg-gradient-to-r ${coresTema.gradient}`
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

          {/* Botão Principal de WhatsApp */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              📱 Envie agora via WhatsApp:
            </label>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Olá! 👋\n\nPor favor, preencha sua ficha de anamnese através deste link:\n\n' + link + '\n\n✅ É rápido e seguro!\n⏱️ Leva apenas 5 minutos\n🔒 Suas informações são confidenciais')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transition-all text-center flex items-center justify-center gap-3 text-white font-semibold text-lg"
            >
              <span className="text-2xl">💬</span>
              <span>Enviar via WhatsApp</span>
              <span className="text-xl">→</span>
            </a>
          </div>

          {/* Atalhos de envio alternativos */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-3 text-center">
              Ou envie por:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`mailto:?subject=Anamnese&body=${encodeURIComponent('Olá! Por favor, preencha sua anamnese através deste link: ' + link)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
              >
                <div className="text-2xl mb-1">📧</div>
                <div className="text-sm font-medium text-gray-900">Email</div>
              </a>
              <a
                href={`sms:?&body=${encodeURIComponent('Olá! Por favor, preencha sua anamnese através deste link: ' + link)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 border-2 ${coresTema.border200} rounded-xl ${coresTema.hover} transition-all text-center`}
              >
                <div className="text-2xl mb-1">💬</div>
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
          <Button onClick={onClose} className={`bg-gradient-to-r ${coresTema.gradient}`}>
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
