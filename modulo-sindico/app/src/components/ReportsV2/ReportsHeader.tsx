
import { useState, useRef, useEffect } from 'react';
import { Plus, FileText, BarChart2, PieChart } from 'lucide-react';

// ==================== INTERFACES ====================

interface ReportsHeaderProps {
  title: string;
  onNewReport?: () => void;
  contextFilter?: string;
}

// ==================== COMPONENTE ====================

export function ReportsHeader({
  title,
  onNewReport,
  contextFilter = 'all'
}: ReportsHeaderProps) {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    if (showContextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showContextMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const getModuleName = () => {
    const names: Record<string, string> = {
      financeiro: 'Financeiro',
      crm: 'CRM',
      vendas: 'Vendas',
      conversas: 'Conversas',
      chamados: 'Chamados',
      slas: 'SLAs',
      all: ''
    };
    return names[contextFilter] || contextFilter;
  };

  const handleCreateModuleReport = () => {
    setShowContextMenu(false);
    onNewReport?.();
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {title}
      </h1>

      <div className="relative">
        <button
          ref={buttonRef}
          onClick={onNewReport}
          onContextMenu={handleContextMenu}
          className="
            flex items-center gap-2 px-4 py-2
            bg-[#525a52]
            text-white
            rounded-lg font-medium text-sm
            hover:bg-[#525a52]/90
            transition-colors duration-150
            shadow-sm
          "
        >
          <Plus className="h-4 w-4" />
          <span>Novo</span>
        </button>

        {/* Context Menu */}
        {showContextMenu && (
          <div
            className="fixed w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[10001]"
            style={{ left: contextMenuPos.x, top: contextMenuPos.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCreateModuleReport}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <BarChart2 className="h-4 w-4 text-[#525a52]" />
              Criar relatório {getModuleName()}
            </button>
            <div className="border-t border-gray-200 my-1" />
            <button
              onClick={() => setShowContextMenu(false)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-[#525a52]" />
              Criar relatório em branco
            </button>
            <button
              onClick={() => setShowContextMenu(false)}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <PieChart className="h-4 w-4 text-[#525a52]" />
              Criar a partir de template
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsHeader;
