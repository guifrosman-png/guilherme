
import { Report } from './types/report.types';
import { ReportCard } from './ReportCard';
import { ReportsListHeader, ReportSortColumn, ReportSortDirection } from './ReportsListHeader';
import { FileSearch } from 'lucide-react';

// ==================== INTERFACES ====================

interface ReportsCardListProps {
  reports: Report[];
  onReportClick?: (report: Report) => void;
  onFavoriteToggle?: (reportId: string) => void;
  onDuplicate?: (reportId: string) => void;
  onDelete?: (reportId: string) => void;
  onExport?: (reportId: string, format: 'csv' | 'pdf') => void;
  emptyMessage?: string;
  // Props de ordenação
  sortColumn?: ReportSortColumn | null;
  sortDirection?: ReportSortDirection;
  onSort?: (column: ReportSortColumn) => void;
}

// ==================== COMPONENTE ====================

export function ReportsCardList({
  reports,
  onReportClick,
  onFavoriteToggle,
  onDuplicate,
  onDelete,
  onExport,
  emptyMessage = 'Nenhum relatório encontrado',
  sortColumn = null,
  sortDirection = null,
  onSort
}: ReportsCardListProps) {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <FileSearch className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header de Ordenação */}
      {onSort && (
        <ReportsListHeader
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
        />
      )}

      {/* Lista de Cards */}
      <div className="space-y-2 overflow-visible">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onClick={onReportClick}
            onFavoriteToggle={onFavoriteToggle}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onExport={onExport}
          />
        ))}
      </div>
    </div>
  );
}

export default ReportsCardList;
