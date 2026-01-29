import { useState } from 'react';
import { Calendar, Plus, Globe, ChevronDown, X } from 'lucide-react';
import { PeriodFilter, DashboardFilter, createPresetPeriod } from '../types/dashboard.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ==================== INTERFACES ====================

interface DashboardPeriodFilterProps {
  period: PeriodFilter;
  filters: DashboardFilter[];
  timezone?: string;
  onPeriodChange: (period: PeriodFilter) => void;
  onAddFilter: (filter: DashboardFilter) => void;
  onRemoveFilter: (filterId: string) => void;
  onTimezoneChange?: (timezone: string) => void;
}

// ==================== PRESETS ====================

const PERIOD_PRESETS = [
  { label: 'Hoje', value: 'today' },
  { label: 'Ontem', value: 'yesterday' },
  { label: 'Ultimos 7 dias', value: 'last7days' },
  { label: 'Ultimos 28 dias', value: 'last28days' },
  { label: 'Este mes', value: 'thisMonth' },
  { label: 'Mes passado', value: 'lastMonth' },
  { label: 'Este trimestre', value: 'thisQuarter' },
  { label: 'Este ano', value: 'thisYear' },
] as const;

const TIMEZONES = [
  { label: 'Brasilia (GMT-3)', value: 'America/Sao_Paulo' },
  { label: 'UTC', value: 'UTC' },
  { label: 'New York (GMT-5)', value: 'America/New_York' },
  { label: 'Los Angeles (GMT-8)', value: 'America/Los_Angeles' },
  { label: 'Londres (GMT)', value: 'Europe/London' },
];

// ==================== COMPONENTE ====================

export function DashboardPeriodFilter({
  period,
  filters,
  timezone = 'America/Sao_Paulo',
  onPeriodChange,
  onAddFilter,
  onRemoveFilter,
  onTimezoneChange
}: DashboardPeriodFilterProps) {
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Formata o periodo para exibicao
  const formatPeriod = () => {
    const start = format(period.startDate, 'dd MMM', { locale: ptBR });
    const end = format(period.endDate, 'dd MMM, yyyy', { locale: ptBR });
    return `${start} - ${end}`;
  };

  // Seleciona um preset
  const handlePresetSelect = (presetValue: string) => {
    const newPeriod = createPresetPeriod(presetValue as PeriodFilter['preset']);
    onPeriodChange(newPeriod);
    setShowPeriodDropdown(false);
  };

  // Encontra o timezone atual
  const currentTimezone = TIMEZONES.find(tz => tz.value === timezone) || TIMEZONES[0];

  return (
    <div className="flex items-center gap-3 flex-wrap bg-zinc-50 dark:bg-zinc-900 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
      {/* ESQUERDA: Filtros Ativos (Chips) */}
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

      {/* Spacer */}
      <div className="flex-1" />

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

export default DashboardPeriodFilter;
