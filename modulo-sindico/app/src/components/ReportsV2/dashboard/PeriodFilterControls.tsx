import { useState } from 'react';
import { Plus, Globe, ChevronDown } from 'lucide-react';
import type { DashboardFilter } from '../types/dashboard.types';

// ==================== INTERFACES ====================

interface PeriodFilterControlsProps {
  timezone?: string;
  onAddFilter: (filter: DashboardFilter) => void;
  onTimezoneChange?: (timezone: string) => void;
}

// ==================== CONSTANTES ====================

const TIMEZONES = [
  { label: 'Brasilia (GMT-3)', value: 'America/Sao_Paulo' },
  { label: 'UTC', value: 'UTC' },
  { label: 'New York (GMT-5)', value: 'America/New_York' },
  { label: 'Los Angeles (GMT-8)', value: 'America/Los_Angeles' },
  { label: 'Londres (GMT)', value: 'Europe/London' },
];

// ==================== COMPONENTE ====================

export function PeriodFilterControls({
  timezone = 'America/Sao_Paulo',
  onAddFilter,
  onTimezoneChange
}: PeriodFilterControlsProps) {
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Encontra o timezone atual
  const currentTimezone = TIMEZONES.find(tz => tz.value === timezone) || TIMEZONES[0];

  return (
    <div className="flex items-center gap-3">
      {/* Adicionar Filtro */}
      <div className="relative">
        <button
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar filtro</span>
        </button>

        {showFilterDropdown && (
          <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 py-1 z-20">
            <button
              onClick={() => {
                onAddFilter({
                  id: `filter-${Date.now()}`,
                  field: 'status',
                  label: 'Status',
                  operator: 'equals',
                  value: 'Aberto'
                });
                setShowFilterDropdown(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Status
            </button>
            <button
              onClick={() => {
                onAddFilter({
                  id: `filter-${Date.now()}`,
                  field: 'priority',
                  label: 'Prioridade',
                  operator: 'equals',
                  value: 'Alta'
                });
                setShowFilterDropdown(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Prioridade
            </button>
            <button
              onClick={() => {
                onAddFilter({
                  id: `filter-${Date.now()}`,
                  field: 'team',
                  label: 'Equipe',
                  operator: 'equals',
                  value: 'Suporte'
                });
                setShowFilterDropdown(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Equipe
            </button>
            <button
              onClick={() => {
                onAddFilter({
                  id: `filter-${Date.now()}`,
                  field: 'assignee',
                  label: 'Atendente',
                  operator: 'equals',
                  value: 'Todos'
                });
                setShowFilterDropdown(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Atendente
            </button>
          </div>
        )}
      </div>

      {/* Timezone */}
      <div className="relative">
        <button
          onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
          className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span>{currentTimezone.label}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {showTimezoneDropdown && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 py-1 z-20">
            {TIMEZONES.map((tz) => (
              <button
                key={tz.value}
                onClick={() => {
                  onTimezoneChange?.(tz.value);
                  setShowTimezoneDropdown(false);
                }}
                className={`
                  w-full px-3 py-2 text-left text-sm
                  hover:bg-zinc-100 dark:hover:bg-zinc-800
                  ${timezone === tz.value
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
                    : 'text-zinc-700 dark:text-zinc-300'
                  }
                `}
              >
                {tz.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PeriodFilterControls;
