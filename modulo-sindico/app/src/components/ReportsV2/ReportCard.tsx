
import { useState } from 'react';
import React from 'react';
import {
  MessageCircle,
  ClipboardList,
  Timer,
  Users,
  UserCheck,
  TrendingUp,
  BarChart2,
  Share2,
  Star,
  MoreHorizontal,
  Copy,
  Trash2,
  Building2,
  Download,
  ChevronRight
} from 'lucide-react';
import { Report, getModuleColor } from './types/report.types';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ==================== INTERFACES ====================

interface ReportCardProps {
  report: Report;
  onClick?: (report: Report) => void;
  onFavoriteToggle?: (reportId: string) => void;
  onDuplicate?: (reportId: string) => void;
  onDelete?: (reportId: string) => void;
  onExport?: (reportId: string, format: 'csv' | 'pdf') => void;
}

// ==================== ICON MAP ====================

const iconMap: Record<string, React.ReactNode> = {
  MessageCircle: <MessageCircle className="h-4 w-4" />,
  ClipboardList: <ClipboardList className="h-4 w-4" />,
  Timer: <Timer className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  UserCheck: <UserCheck className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  BarChart2: <BarChart2 className="h-4 w-4" />,
  Share2: <Share2 className="h-4 w-4" />
};

// ==================== COMPONENTE ====================

export function ReportCard({
  report,
  onClick,
  onFavoriteToggle,
  onDuplicate,
  onDelete,
  onExport
}: ReportCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showExportSubmenu, setShowExportSubmenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const exportButtonRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onClick?.(report);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteToggle?.(report.id);
    setContextMenuPos(null); // Fechar context menu após ação
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
    setContextMenuPos(null); // Fechar context menu se abrir pelo botão
  };

  // Handler para clique-direito (context menu)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowMenu(false); // Fechar menu normal se abrir context menu
  };

  // Fechar context menu ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = () => {
      setContextMenuPos(null);
    };
    if (contextMenuPos) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenuPos]);

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate?.(report.id);
    setShowMenu(false);
    setContextMenuPos(null);
  };

  const handleExport = (e: React.MouseEvent, format: 'csv' | 'pdf') => {
    e.stopPropagation();
    onExport?.(report.id, format);
    setShowMenu(false);
    setShowExportSubmenu(false);
    setContextMenuPos(null);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(report.id);
    setShowMenu(false);
    setContextMenuPos(null);
  };

  const moduleColor = getModuleColor(report.module);
  const icon = iconMap[report.icon] || <ClipboardList className="h-4 w-4" />;

  return (
    <div
      className={`
        relative bg-white
        rounded-lg border border-gray-200
        pl-5 pr-4 py-3 cursor-pointer
        transition-all duration-200 ease-in-out
        ${isHovered ? 'shadow-md border-gray-300' : 'shadow-sm'}
      `}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      {/* Linha colorida na lateral esquerda */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1 rounded-l-lg"
        style={{ backgroundColor: moduleColor }}
      />

      <div className="flex items-center gap-4">
        {/* Ícone */}
        <div
          className="w-8 shrink-0 flex items-center justify-center p-1.5 rounded-lg"
          style={{
            backgroundColor: `${moduleColor}15`,
            color: moduleColor
          }}
        >
          {icon}
        </div>

        {/* Título, Código e Descrição - flex-1 para alinhar com header */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {report.title}
          </h3>
          <span className="text-xs font-mono text-gray-400 shrink-0">
            {report.code}
          </span>
          <p className="text-xs text-gray-500 truncate hidden md:block ml-2">
            {report.description}
          </p>
        </div>

        {/* Proprietário - w-24 para alinhar com header */}
        <div className="w-24 shrink-0 flex items-center gap-1 text-xs text-gray-500">
          <Building2 className="h-3 w-3 shrink-0" />
          <span className="truncate">{report.owner}</span>
        </div>

        {/* Última atualização - w-36 para alinhar com header */}
        <div className="w-36 shrink-0 text-xs text-gray-500">
          {report.updatedAt && (
            formatDistanceToNow(report.updatedAt, {
              addSuffix: true,
              locale: ptBR
            })
          )}
        </div>

        {/* Criado em - w-28 para alinhar com header */}
        <div className="w-28 shrink-0 text-xs text-gray-500">
          {report.createdAt && format(report.createdAt, 'dd/MM/yyyy')}
        </div>

        {/* Ações - w-16 para alinhar com header */}
        <div className={`
          w-16 shrink-0 flex items-center justify-end gap-1
          relative
        `}>
          {/* Favoritar */}
          <button
            onClick={handleFavoriteClick}
            className={`
              p-1.5 rounded-lg transition-colors
              ${report.isFavorite
                ? 'text-[#525a52] hover:bg-[#525a52]/10'
                : 'text-gray-400 hover:text-[#525a52] hover:bg-gray-100'
              }
            `}
            title={report.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Star className={`h-4 w-4 ${report.isFavorite ? 'fill-[#525a52]' : ''}`} />
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={handleMenuClick}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Mais opções"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999]">
                <button
                  onClick={handleDuplicate}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Duplicar
                </button>

                {/* Exportar com Submenu */}
                <div
                  ref={exportButtonRef}
                  className="relative"
                  onMouseEnter={() => setShowExportSubmenu(true)}
                  onMouseLeave={() => setShowExportSubmenu(false)}
                >
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Exportar
                    </div>
                    <ChevronRight className="h-3 w-3" />
                  </button>

                  {/* Submenu de Exportação */}
                  {showExportSubmenu && exportButtonRef.current && (() => {
                    const rect = exportButtonRef.current.getBoundingClientRect();
                    return (
                      <div
                        className="fixed w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[10000]"
                        style={{
                          left: `${rect.right + 4}px`,
                          top: `${rect.top}px`
                        }}
                      >
                        <button
                          onClick={(e) => handleExport(e, 'csv')}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          CSV
                        </button>
                        <button
                          onClick={(e) => handleExport(e, 'pdf')}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          PDF
                        </button>
                      </div>
                    );
                  })()}
                </div>

                {report.category === 'user' && (
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu (Clique-direito) */}
      {contextMenuPos && (
        <div
          className="fixed w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-[10001]"
          style={{
            left: `${contextMenuPos.x}px`,
            top: `${contextMenuPos.y}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClick}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <BarChart2 className="h-4 w-4" />
            Abrir
          </button>
          <button
            onClick={handleFavoriteClick}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Star className={`h-4 w-4 ${report.isFavorite ? 'fill-[#525a52] text-[#525a52]' : ''}`} />
            {report.isFavorite ? 'Remover favorito' : 'Favoritar'}
          </button>
          <button
            onClick={handleDuplicate}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Duplicar
          </button>
          <div className="border-t border-gray-200 my-1" />
          <button
            onClick={(e) => handleExport(e, 'csv')}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          <button
            onClick={(e) => handleExport(e, 'pdf')}
            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar PDF
          </button>
          {report.category === 'user' && (
            <>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportCard;
