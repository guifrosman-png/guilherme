import { useEffect, useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DrillDownData,
  DrillDownRow,
  SortConfig,
  sortDrillDownData,
  paginateDrillDownData,
  DEFAULT_PAGE_SIZE
} from '../types/drilldown.types';
import { DrillDownColumnSelector } from './DrillDownColumnSelector';
import { DrillDownTable } from './DrillDownTable';

// ==================== INTERFACES ====================

interface DrillDownModalProps {
  isOpen: boolean;
  data: DrillDownData | null;
  onClose: () => void;
  onExport?: () => void;
  onRowClick?: (row: DrillDownRow) => void;
}

// ==================== COMPONENTE ====================

export function DrillDownModal({
  isOpen,
  data,
  onClose,
  onExport,
  onRowClick
}: DrillDownModalProps) {
  // Estado local
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  // Inicializa colunas selecionadas quando data muda
  useEffect(() => {
    if (data) {
      // Seleciona as primeiras 5 colunas por padrao
      const defaultColumns = data.columns
        .filter(col => col.visible !== false)
        .slice(0, 5)
        .map(col => col.id);
      setSelectedColumns(defaultColumns);
      setCurrentPage(1);
      setSortConfig(undefined);
    }
  }, [data]);

  // Processa dados
  const processedRows = data ? sortDrillDownData(data.rows, sortConfig) : [];
  const paginatedData = paginateDrillDownData(processedRows, currentPage, pageSize);
  const totalPages = Math.ceil(processedRows.length / pageSize);

  // Handlers
  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSort = (columnId: string) => {
    setSortConfig(prev => {
      if (prev?.columnId === columnId) {
        // Alterna direcao ou remove
        if (prev.direction === 'asc') {
          return { columnId, direction: 'desc' };
        }
        return undefined;
      }
      return { columnId, direction: 'asc' };
    });
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Fecha com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!data) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal Slide-in */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {data.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {processedRows.length} registros
                </p>
              </div>

              <div className="flex items-center gap-2">
                {onExport && (
                  <button
                    onClick={onExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Exportar CSV</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-6 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Mostrando {paginatedData.startIndex + 1}-{paginatedData.endIndex} de {processedRows.length}
              </span>

              <div className="flex-1" />

              <DrillDownColumnSelector
                columns={data.columns}
                selectedColumns={selectedColumns}
                onColumnToggle={handleColumnToggle}
              />
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <DrillDownTable
                columns={data.columns}
                rows={paginatedData.rows}
                selectedColumns={selectedColumns}
                sortConfig={sortConfig}
                onSort={handleSort}
                onRowClick={onRowClick}
              />
            </div>

            {/* Paginacao */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Mostra paginas */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`
                          w-8 h-8 rounded-lg text-sm transition-colors
                          ${currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }
                        `}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Proximo</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default DrillDownModal;
