/**
 * Mobile Period Filter - Filtro de período otimizado para mobile
 * Versão compacta com dropdown - apenas ícone do funil visível
 */

import { useState, useRef, useEffect } from 'react';
import { CustomPeriodModal } from './CustomPeriodModal';
import { Filter, ChevronDown } from 'lucide-react';
import { useMobile } from './ui/use-mobile';

export type PeriodType = 'semanal' | 'mensal' | 'trimestral' | 'anual' | 'personalizado';

interface MobilePeriodFilterProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  showOnDesktop?: boolean;
}

export function MobilePeriodFilter({ 
  value, 
  onChange, 
  isLoading = false,
  className = '',
  showOnDesktop = false
}: MobilePeriodFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  // Só mostrar no mobile ou quando explicitamente habilitado para desktop
  if (!isMobile && !showOnDesktop) {
    return null;
  }

  const periodOptions = [
    { key: 'semanal', label: '7d', fullLabel: 'Últimos 7 dias' },
    { key: 'mensal', label: '30d', fullLabel: 'Últimos 30 dias' },
    { key: 'trimestral', label: '3m', fullLabel: 'Últimos 3 meses' },  
    { key: 'anual', label: '1a', fullLabel: 'Último ano' }
  ];

  // Obter label do período atual
  const getCurrentPeriodLabel = () => {
    const current = periodOptions.find(option => option.key === value);
    return current ? current.label : value === 'personalizado' ? 'Custom' : '7d';
  };

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleValueChange = (newValue: string) => {
    if (newValue === 'personalizado') {
      setIsCustomModalOpen(true);
    } else {
      onChange(newValue);
    }
    setIsDropdownOpen(false);
  };

  const handleCustomPeriodApply = (startDate: string, endDate: string) => {
    onChange('personalizado');
    setIsCustomModalOpen(false);
  };

  return (
    <>
      <div className={`relative ${className}`} ref={dropdownRef}>
        {/* Botão do filtro - apenas ícone e período atual */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoading}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200
            bg-white/90 backdrop-blur-lg shadow-md border border-white/30
            hover:bg-white hover:shadow-lg active:scale-95
            ${isDropdownOpen ? 'bg-white shadow-lg' : ''}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          title="Filtrar período"
        >
          <Filter className="h-3 w-3 text-slate-600" />
          <span className="text-slate-600">{getCurrentPeriodLabel()}</span>
          <ChevronDown className={`h-3 w-3 text-slate-500 transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} />
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="ml-1">
              <div className="h-3 w-3 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}
        </button>

        {/* Dropdown com opções */}
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 right-0 z-50 min-w-[140px] bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl animate-fadeInUp">
            <div className="p-2 space-y-1">
              {/* Botões de período */}
              {periodOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleValueChange(option.key)}
                  className={`
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                    ${value === option.key
                      ? 'bg-[var(--color-multifins-blue)] text-white shadow-sm' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs opacity-75">{option.fullLabel}</span>
                  </div>
                </button>
              ))}
              
              {/* Separador */}
              <div className="my-2 border-t border-slate-200" />
              
              {/* Período personalizado */}
              <button
                onClick={() => handleValueChange('personalizado')}
                className={`
                  w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${value === 'personalizado'
                    ? 'bg-[var(--color-multifins-blue)] text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-3 w-3" />
                  <span className="font-medium">Personalizado</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de período personalizado */}
      <CustomPeriodModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onApply={handleCustomPeriodApply}
      />
    </>
  );
}

