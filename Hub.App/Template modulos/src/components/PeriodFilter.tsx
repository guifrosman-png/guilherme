import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, ChevronDown } from 'lucide-react';
import { CustomPeriodModal } from './CustomPeriodModal';

export type PeriodType = 'semanal' | 'mensal' | 'trimestral' | 'anual' | 'personalizado';

interface CustomDateRange {
  startDate: string;
  endDate: string;
}

interface PeriodFilterProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  variant?: 'default' | 'compact' | 'modern';
  className?: string;
  customRange?: CustomDateRange;
}

export function PeriodFilter({ 
  value, 
  onChange, 
  isLoading = false, 
  variant = 'modern',
  className = '',
  customRange
}: PeriodFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const periodOptions = [
    { value: 'anual' as const, label: 'Anual', description: 'Últimos 12 meses', icon: '📅' },
    { value: 'trimestral' as const, label: 'Trimestral', description: 'Últimos 3 meses', icon: '📊' },
    { value: 'mensal' as const, label: 'Mensal', description: 'Últimos 30 dias', icon: '📆' },
    { value: 'semanal' as const, label: 'Semanal', description: 'Últimos 7 dias', icon: '📋' },
    { value: 'personalizado' as const, label: 'Personalizado', description: 'Escolher datas', icon: '🗓️' }
  ];

  const currentOption = periodOptions.find(option => option.value === value);

  const handleValueChange = (newValue: string) => {
    if (newValue === 'personalizado') {
      setIsCustomModalOpen(true);
    } else {
      onChange(newValue);
    }
  };

  const handleCustomPeriodApply = (startDate: string, endDate: string) => {
    onChange('personalizado');
  };

  const handleCustomPeriod = (startDate: string, endDate: string) => {
    onChange('personalizado');
    setShowCustomModal(false);
  };

  const getDisplayLabel = () => {
    if (value === 'personalizado' && customRange) {
      return `${new Date(customRange.startDate).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short' 
      })} - ${new Date(customRange.endDate).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'short' 
      })}`;
    }
    return currentOption?.label || 'Anual';
  };

  // Variante moderna - design atualizado conforme especificações
  if (variant === 'modern') {
    return (
      <>
        <div className={`flex items-center gap-1 ${className}`}>
          {/* Botões de período + filtro integrados - padrão E4CEO */}
          <div className="flex items-center bg-white/95 backdrop-blur-xl rounded-xl p-1 shadow-lg border border-white/20">
            {[
              { key: 'semanal', label: '7d', type: 'period' },
              { key: 'mensal', label: '30d', type: 'period' },
              { key: 'trimestral', label: '3m', type: 'period' },  
              { key: 'anual', label: '1a', type: 'period' },
              { 
                key: 'filter', 
                label: (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                  </svg>
                ), 
                type: 'filter' 
              }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  if (item.type === 'filter') {
                    setIsCustomModalOpen(true);
                  } else {
                    handleValueChange(item.key);
                  }
                }}
                disabled={isLoading}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center
                  ${(value === item.key && item.type === 'period')
                    ? 'bg-[var(--color-multifins-blue)] text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/50'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title={item.type === 'filter' ? 'Filtros avançados' : `Período ${item.type === 'period' ? item.label : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {isLoading && (
            <div className="flex items-center justify-center p-2">
              <div className="h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          <CustomPeriodModal
            isOpen={showCustomModal}
            onClose={() => setShowCustomModal(false)}
            onApply={handleCustomPeriod}
          />
        </div>

        <CustomPeriodModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onApply={handleCustomPeriodApply}
        />
      </>
    );
  }

  // Variante compacta - apenas o ícone e valor
  if (variant === 'compact') {
    return (
      <>
        <Select 
          value={value} 
          onValueChange={handleValueChange}
          onOpenChange={setIsOpen}
          disabled={isLoading}
        >
          <SelectTrigger 
            className={`w-auto gap-2 border-2 border-primary/20 hover:border-primary/40 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}
          >
            <Calendar className={`h-4 w-4 text-primary ${isLoading ? 'animate-pulse' : ''}`} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <CustomPeriodModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onApply={handleCustomPeriodApply}
        />
      </>
    );
  }

  // Variante padrão
  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <Calendar className={`h-4 w-4 text-muted-foreground ${isLoading ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium text-muted-foreground">Período:</span>
        <Select 
          value={value} 
          onValueChange={handleValueChange}
          onOpenChange={setIsOpen}
          disabled={isLoading}
        >
          <SelectTrigger 
            className={`w-[140px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-between w-full">
              <SelectValue />
              {isLoading && (
                <div className="h-3 w-3 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              )}
            </div>
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CustomPeriodModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onApply={handleCustomPeriodApply}
      />
    </>
  );
}

// Hook para filtrar transações por período
export function useFilterTransactionsByPeriod(
  transactions: any[], 
  period: PeriodType, 
  customRange?: { startDate: string; endDate: string }
) {
  if (period === 'personalizado' && customRange) {
    const startDate = new Date(customRange.startDate);
    const endDate = new Date(customRange.endDate);
    endDate.setHours(23, 59, 59, 999); // Incluir o dia completo
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.launchDate || transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  const now = new Date();
  const startDate = new Date();

  switch (period) {
    case 'semanal':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'mensal':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'trimestral':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'anual':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setFullYear(now.getFullYear() - 1); // Padrão anual
  }

  return transactions.filter(transaction => {
    // Usar launchDate se disponível, senão usar date
    const transactionDate = new Date(transaction.launchDate || transaction.date);
    return transactionDate >= startDate && transactionDate <= now;
  });
}

// Utilitário para obter label descritivo do período
export function getPeriodLabel(period: PeriodType, customRange?: { startDate: string; endDate: string }): string {
  if (period === 'personalizado' && customRange) {
    return `${new Date(customRange.startDate).toLocaleDateString('pt-BR')} - ${new Date(customRange.endDate).toLocaleDateString('pt-BR')}`;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11
  const currentQuarter = Math.floor(currentMonth / 3) + 1;
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  switch (period) {
    case 'semanal':
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      return `${weekStart.getDate()}/${(weekStart.getMonth() + 1).toString().padStart(2, '0')} - ${now.getDate()}/${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    case 'mensal':
      return `${monthNames[currentMonth]} ${currentYear}`;
    case 'trimestral':
      return `${currentQuarter}º Trimestre ${currentYear}`;
    case 'anual':
      return `Ano ${currentYear}`;
    default:
      return `Ano ${currentYear}`;
  }
}