import { X } from 'lucide-react';
import type { DashboardFilter } from '../types/dashboard.types';

// ==================== INTERFACES ====================

interface PeriodFilterChipsProps {
  filters: DashboardFilter[];
  onRemoveFilter: (filterId: string) => void;
}

// ==================== COMPONENTE ====================

export function PeriodFilterChips({
  filters,
  onRemoveFilter
}: PeriodFilterChipsProps) {
  // Se não houver filtros, não renderiza nada
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 flex-wrap bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
      {/* Filtros Ativos (Chips) */}
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300"
        >
          <span>{filter.label}: {filter.value}</span>
          <button
            onClick={() => onRemoveFilter(filter.id)}
            className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default PeriodFilterChips;
