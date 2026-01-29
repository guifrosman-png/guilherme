import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import {
  DrillDownColumn,
  DrillDownRow,
  SortConfig
} from '../types/drilldown.types';

// ==================== INTERFACES ====================

interface DrillDownTableProps {
  columns: DrillDownColumn[];
  rows: DrillDownRow[];
  selectedColumns: string[];
  sortConfig?: SortConfig;
  onSort: (columnId: string) => void;
  onRowClick?: (row: DrillDownRow) => void;
}

// ==================== COMPONENTE ====================

export function DrillDownTable({
  columns,
  rows,
  selectedColumns,
  sortConfig,
  onSort,
  onRowClick
}: DrillDownTableProps) {
  // Filtra colunas para mostrar apenas as selecionadas
  const visibleColumns = columns.filter(col => selectedColumns.includes(col.id));

  // Formata valor baseado no tipo da coluna
  const formatValue = (value: unknown, column: DrillDownColumn): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-zinc-400">—</span>;
    }

    switch (column.type) {
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString('pt-BR');
        }
        return String(value);

      case 'datetime':
        if (value instanceof Date) {
          return value.toLocaleString('pt-BR');
        }
        return String(value);

      case 'number':
        if (typeof value === 'number') {
          return value.toLocaleString('pt-BR');
        }
        return String(value);

      case 'currency':
        if (typeof value === 'number') {
          return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          });
        }
        return String(value);

      case 'percentage':
        if (typeof value === 'number') {
          return `${value.toFixed(1)}%`;
        }
        return String(value);

      case 'duration':
        if (typeof value === 'number') {
          // Valor em minutos
          if (value < 60) return `${value}min`;
          const hours = Math.floor(value / 60);
          const mins = value % 60;
          if (hours < 24) {
            return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
          }
          const days = Math.floor(hours / 24);
          return `${days}d`;
        }
        return String(value);

      case 'link':
        return (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            Ver <ExternalLink className="h-3 w-3" />
          </a>
        );

      case 'badge':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            {String(value)}
          </span>
        );

      default:
        return String(value);
    }
  };

  // Renderiza icone de ordenacao
  const renderSortIcon = (columnId: string) => {
    if (sortConfig?.columnId !== columnId) {
      return <ChevronUp className="h-3 w-3 opacity-0 group-hover:opacity-30" />;
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-3 w-3 text-blue-600" />
    ) : (
      <ChevronDown className="h-3 w-3 text-blue-600" />
    );
  };

  if (visibleColumns.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500">
        Selecione pelo menos uma coluna para visualizar
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-500">
        Nenhum dado encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Header */}
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            {visibleColumns.map((column) => (
              <th
                key={column.id}
                className={`
                  px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider
                  ${column.sortable !== false ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group' : ''}
                `}
                style={{ width: column.width }}
                onClick={() => column.sortable !== false && onSort(column.id)}
              >
                <div className="flex items-center gap-1">
                  <span>{column.label}</span>
                  {column.sortable !== false && renderSortIcon(column.id)}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={`
                border-b border-zinc-100 dark:border-zinc-800/50
                ${onRowClick ? 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/30' : ''}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {visibleColumns.map((column) => (
                <td
                  key={column.id}
                  className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300"
                >
                  {formatValue(row[column.id], column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DrillDownTable;
