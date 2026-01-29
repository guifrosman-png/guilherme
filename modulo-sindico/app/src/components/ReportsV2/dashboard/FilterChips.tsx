import { X } from 'lucide-react';
import type { DashboardFilter } from '../types/dashboard.types';

// ==================== INTERFACES ====================

interface FilterChipsProps {
  filters: DashboardFilter[];
  onRemoveFilter: (filterId: string) => void;
}

// ==================== COMPONENTE ====================

export function FilterChips({ filters, onRemoveFilter }: FilterChipsProps) {
  // Se não houver filtros, não renderiza nada
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        Filtros ativos:
      </span>

      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300"
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={() => onRemoveFilter(filter.id)}
            className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
            title={`Remover filtro ${filter.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default FilterChips;
