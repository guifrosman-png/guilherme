import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardKPI, formatVariation, getVariationColor } from '../types/dashboard.types';

// ==================== INTERFACES ====================

interface DashboardKPICardProps {
  kpi: DashboardKPI;
  onClick?: (kpi: DashboardKPI) => void;
}

// ==================== COMPONENTE ====================

export function DashboardKPICard({ kpi, onClick }: DashboardKPICardProps) {
  const handleClick = () => {
    if (kpi.drillDownEnabled && onClick) {
      onClick(kpi);
    }
  };

  // Formatação do valor
  const formattedValue = kpi.value !== null && kpi.value !== undefined
    ? kpi.format === 'percentage'
      ? `${kpi.value}%`
      : kpi.format === 'time'
        ? formatTime(kpi.value)
        : kpi.format === 'currency'
          ? formatCurrency(kpi.value)
          : kpi.value.toLocaleString('pt-BR')
    : '—';

  // Variação
  const variationColor = kpi.variation ? getVariationColor(kpi.variation) : '';
  const variationText = kpi.variation ? formatVariation(kpi.variation) : null;

  // Ícone da variação
  const VariationIcon = kpi.variation?.direction === 'up'
    ? TrendingUp
    : kpi.variation?.direction === 'down'
      ? TrendingDown
      : Minus;

  return (
    <div
      className={`
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        rounded-lg p-4
        transition-all duration-200
        ${kpi.drillDownEnabled ? 'cursor-pointer hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700' : ''}
      `}
      onClick={handleClick}
    >
      {/* Header com título e ícone de info */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {kpi.label}
        </span>
        {kpi.tooltip && (
          <button
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title={kpi.tooltip}
          >
            <Info className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Valor principal */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {formattedValue}
        </span>

        {/* Variação */}
        {variationText && kpi.variation && (
          <div className={`flex items-center gap-1 text-sm font-medium ${variationColor}`}>
            <VariationIcon className="h-4 w-4" />
            <span>{variationText}</span>
          </div>
        )}
      </div>

      {/* Indicador de drill-down */}
      {kpi.drillDownEnabled && (
        <div className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
          Clique para ver detalhes
        </div>
      )}
    </div>
  );
}

// ==================== HELPERS ====================

function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export default DashboardKPICard;
