
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '../ui/utils';

// ==================== TYPES ====================

export type ReportSortColumn = 'title' | 'updatedAt' | 'createdAt';
export type ReportSortDirection = 'asc' | 'desc' | null;

interface ReportsListHeaderProps {
  sortColumn: ReportSortColumn | null;
  sortDirection: ReportSortDirection;
  onSort: (column: ReportSortColumn) => void;
}

interface HeaderColumnProps {
  label: string;
  column: ReportSortColumn;
  sortColumn: ReportSortColumn | null;
  sortDirection: ReportSortDirection;
  onSort: (column: ReportSortColumn) => void;
  className?: string;
}

// ==================== HEADER COLUMN ====================

function HeaderColumn({
  label,
  column,
  sortColumn,
  sortDirection,
  onSort,
  className
}: HeaderColumnProps) {
  const isActive = sortColumn === column;

  return (
    <button
      onClick={() => onSort(column)}
      className={cn(
        'flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer',
        isActive && 'text-[#525a52]',
        className
      )}
    >
      <span>{label}</span>
      {isActive && sortDirection === 'asc' && (
        <ChevronUp className="h-3 w-3" />
      )}
      {isActive && sortDirection === 'desc' && (
        <ChevronDown className="h-3 w-3" />
      )}
    </button>
  );
}

// ==================== COMPONENTE ====================

export function ReportsListHeader({
  sortColumn,
  sortDirection,
  onSort
}: ReportsListHeaderProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
      <div className="flex items-center gap-4">
        {/* Espaço para ícone do card */}
        <div className="w-8 shrink-0" />

        {/* Título - flex-1 para ocupar espaço disponível */}
        <HeaderColumn
          label="Título"
          column="title"
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          className="flex-1 min-w-0"
        />

        {/* Proprietário - largura fixa, não ordenável */}
        <div className="w-24 shrink-0 text-xs font-semibold text-gray-700">
          Proprietário
        </div>

        {/* Última atualização */}
        <HeaderColumn
          label="Última atualização"
          column="updatedAt"
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          className="w-36 shrink-0"
        />

        {/* Criado em */}
        <HeaderColumn
          label="Criado em"
          column="createdAt"
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          className="w-28 shrink-0"
        />

        {/* Espaço para ações (favorito + menu) */}
        <div className="w-16 shrink-0" />
      </div>
    </div>
  );
}

export default ReportsListHeader;
