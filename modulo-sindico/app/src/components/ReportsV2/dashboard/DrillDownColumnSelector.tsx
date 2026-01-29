import { useState } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import {
  DrillDownColumn,
  ColumnGroup,
  groupColumns,
  filterColumnsBySearch,
  COLUMN_GROUP_LABELS
} from '../types/drilldown.types';

// ==================== INTERFACES ====================

interface DrillDownColumnSelectorProps {
  columns: DrillDownColumn[];
  selectedColumns: string[];
  onColumnToggle: (columnId: string) => void;
}

// ==================== COMPONENTE ====================

export function DrillDownColumnSelector({
  columns,
  selectedColumns,
  onColumnToggle
}: DrillDownColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra e agrupa colunas
  const filteredColumns = filterColumnsBySearch(columns, searchTerm);
  const groupedColumns = groupColumns(filteredColumns);

  // Conta colunas selecionadas
  const selectedCount = selectedColumns.length;

  return (
    <div className="relative">
      {/* Botao de ativacao */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
      >
        <span>Colunas ({selectedCount})</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Overlay para fechar */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute left-0 top-full mt-1 w-80 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 z-20 max-h-96 overflow-hidden flex flex-col">
            {/* Busca */}
            <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar colunas..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Lista de colunas agrupadas */}
            <div className="overflow-y-auto flex-1">
              {Object.entries(groupedColumns).map(([group, cols]) => {
                if (cols.length === 0) return null;

                return (
                  <div key={group}>
                    {/* Header do grupo */}
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide bg-zinc-50 dark:bg-zinc-800/50 sticky top-0">
                      {COLUMN_GROUP_LABELS[group as ColumnGroup]}
                    </div>

                    {/* Colunas do grupo */}
                    {cols.map((column) => {
                      const isSelected = selectedColumns.includes(column.id);

                      return (
                        <button
                          key={column.id}
                          onClick={() => onColumnToggle(column.id)}
                          className={`
                            w-full px-3 py-2 text-left text-sm flex items-center gap-3
                            hover:bg-zinc-50 dark:hover:bg-zinc-800
                            ${isSelected ? 'bg-blue-50 dark:bg-blue-950' : ''}
                          `}
                        >
                          {/* Checkbox */}
                          <div className={`
                            w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                            ${isSelected
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-zinc-300 dark:border-zinc-600'
                            }
                          `}>
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>

                          {/* Label */}
                          <span className={`
                            ${isSelected
                              ? 'text-blue-700 dark:text-blue-300'
                              : 'text-zinc-700 dark:text-zinc-300'
                            }
                          `}>
                            {column.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}

              {/* Estado vazio */}
              {filteredColumns.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-zinc-500">
                  Nenhuma coluna encontrada
                </div>
              )}
            </div>

            {/* Footer com acoes */}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  // Seleciona todas as colunas visiveis
                  filteredColumns.forEach(col => {
                    if (!selectedColumns.includes(col.id)) {
                      onColumnToggle(col.id);
                    }
                  });
                }}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Selecionar todas
              </button>
              <button
                onClick={() => {
                  // Remove todas as colunas
                  selectedColumns.forEach(colId => onColumnToggle(colId));
                }}
                className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              >
                Limpar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DrillDownColumnSelector;
