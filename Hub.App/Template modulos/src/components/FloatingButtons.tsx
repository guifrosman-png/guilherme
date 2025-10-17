import { useState } from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Plus, Camera, Wallet, Bell, Calculator, Receipt, AlertCircle, Zap } from 'lucide-react';
import { SimpleTransactionModal } from './SimpleTransactionModal';
import { CalculatorOptimized } from './CalculatorOptimized';
import { MobileCalculatorBottomSheet } from './MobileCalculatorBottomSheet';
import { useMobile } from './ui/use-mobile';

interface FloatingButtonsProps {
  onAddTransaction?: (transaction: any) => void;
  transactions?: any[];
  onOpenFinance?: () => void;
}

export function FloatingButtons({ onAddTransaction, transactions = [], onOpenFinance }: FloatingButtonsProps) {
  const [showModal, setShowModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showSaldoModal, setShowSaldoModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const isMobile = useMobile();

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleToggleQuickActions = () => {
    setShowQuickActions(!showQuickActions);
  };

  // Calcular saldo atual
  const saldoAtual = transactions
    .filter(t => t.status === 'pago')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calcular contas vencendo (próximos 3 dias)
  const hoje = new Date();
  const proximos3Dias = new Date(hoje.getTime() + (3 * 24 * 60 * 60 * 1000));
  
  const contasVencendo = transactions.filter(t => {
    if (t.status === 'pago') return false;
    const vencimento = new Date(t.launchDate || t.date);
    return vencimento <= proximos3Dias;
  }).length;

  const handleCameraAction = () => {
    // Simular captura de foto
    alert('📸 Funcionalidade de câmera em desenvolvimento!\n\nEm breve você poderá:\n• Fotografar recibos e notas fiscais\n• Extrair dados automaticamente\n• Adicionar transações instantaneamente');
    setShowQuickActions(false);
  };

  const handleCalculatorAction = () => {
    setShowCalculator(true);
    setShowQuickActions(false);
  };

  return (
    <TooltipProvider>
      {/* Cluster de botões flutuantes */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 md:bottom-8 md:left-8 md:translate-x-0">
        
        {/* Botões de ação rápida - aparecem quando o menu está aberto */}
        <div className={`absolute bottom-20 md:bottom-16 left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0 flex flex-col gap-3 transition-all duration-300 ${
          showQuickActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          
          {/* Open Finance - Novo! */}
          {onOpenFinance && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => {
                    onOpenFinance();
                    setShowQuickActions(false);
                  }}
                  className="relative h-12 w-12 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                >
                  <Zap className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="hidden md:block">
                <span className="font-medium">⚡ Open Finance</span>
                <p className="text-xs opacity-80 mt-1">
                  Conecte suas contas automaticamente
                </p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Consulta Saldo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={() => setShowSaldoModal(true)}
                className="relative h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <Wallet className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="hidden md:block">
              <span className="font-medium">Consultar Saldo</span>
            </TooltipContent>
          </Tooltip>

          {/* Alertas */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={() => setShowAlertsModal(true)}
                className="relative h-12 w-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <Bell className="h-5 w-5" />
                {contasVencendo > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{contasVencendo > 9 ? '9+' : contasVencendo}</span>
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="hidden md:block">
              <span className="font-medium">Alertas e Vencimentos</span>
            </TooltipContent>
          </Tooltip>

          {/* Foto de Recibo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={handleCameraAction}
                className="relative h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <Camera className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="hidden md:block">
              <span className="font-medium">Foto de Recibo</span>
            </TooltipContent>
          </Tooltip>

          {/* Calculadora Premium */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={handleCalculatorAction}
                className="relative h-12 w-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 group"
              >
                <Calculator className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="hidden md:block">
              <span className="font-medium">✨ Calculadora Premium</span>
              <p className="text-xs opacity-80 mt-1">
                Nova! Com histórico e feedback tátil
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* FAB Principal */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={showQuickActions ? handleToggleQuickActions : handleOpenModal}
              onContextMenu={(e) => {
                e.preventDefault();
                handleToggleQuickActions();
              }}
              className={`group relative h-16 w-16 md:h-14 md:w-14 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border-4 md:border-2 border-white overflow-hidden ${
                showQuickActions ? 'rotate-45' : ''
              }`}
              style={{
                background: showQuickActions 
                  ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: `
                  0 0 0 4px hsl(var(--background)),
                  0 8px 25px -5px rgba(16, 185, 129, 0.5),
                  0 20px 40px -15px rgba(16, 185, 129, 0.4),
                  inset 0 2px 0 rgba(255, 255, 255, 0.2)
                `
              }}
            >
              {/* Efeito shimmer premium */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              
              {/* Anel pulsante de destaque */}
              <div className="absolute inset-0 rounded-full border-2 border-emerald-300/60 animate-pulse group-hover:border-emerald-200/80 transition-colors duration-300" />
              
              {/* Overlay interativo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/0 to-green-400/0 group-hover:from-emerald-400/20 group-hover:to-green-400/20 group-active:from-emerald-400/30 group-active:to-green-400/30 transition-all duration-200" />
              
              {/* Indicador de ação premium */}
              <div className="absolute -top-1 -right-1 w-5 h-5 md:w-4 md:h-4 bg-emerald-300 rounded-full shadow-lg">
                <div className="absolute inset-0 bg-emerald-300 rounded-full animate-ping opacity-75"></div>
                <div className="absolute inset-1 bg-emerald-200 rounded-full"></div>
                <div className="absolute inset-2 bg-white rounded-full"></div>
              </div>
              
              {/* Ícone principal com depth */}
              <Plus className="h-8 w-8 md:h-6 md:w-6 text-white drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform duration-200" />
            </Button>
          </TooltipTrigger>
          
          {/* Tooltip desktop */}
          <TooltipContent 
            side="right" 
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500/30 shadow-xl hidden md:block"
            sideOffset={12}
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span className="font-medium">
                {showQuickActions ? 'Fechar Menu' : 'Nova Transação'}
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-1">
              {showQuickActions ? 'Clique para fechar' : 'Clique para adicionar • Segure para mais opções'}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Modais */}
      <SimpleTransactionModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onAddTransaction={onAddTransaction || (() => {})}
        defaultType="receita"
      />

      {/* Modal de Saldo */}
      {showSaldoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Saldo Atual</h3>
              <div className={`text-3xl font-black mb-4 ${saldoAtual >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                R$ {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {saldoAtual >= 0 ? '💰 Saldo positivo' : '⚠️ Saldo negativo'}
              </p>
              <Button onClick={() => setShowSaldoModal(false)} className="w-full">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alertas */}
      {showAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Alertas Financeiros</h3>
              
              {contasVencendo > 0 ? (
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-800">Contas Vencendo</span>
                    </div>
                    <Badge variant="destructive">{contasVencendo}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Você tem {contasVencendo} conta{contasVencendo > 1 ? 's' : ''} vencendo nos próximos 3 dias
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 mb-3">
                    <span className="text-emerald-800 font-medium">✅ Tudo em dia!</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Nenhuma conta vencendo nos próximos dias
                  </p>
                </div>
              )}
              
              <Button onClick={() => setShowAlertsModal(false)} className="w-full">
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Calculadora - Versão Contextual */}
      {isMobile ? (
        <MobileCalculatorBottomSheet
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
          context="floating"
        />
      ) : (
        <CalculatorOptimized
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />
      )}
    </TooltipProvider>
  );
}