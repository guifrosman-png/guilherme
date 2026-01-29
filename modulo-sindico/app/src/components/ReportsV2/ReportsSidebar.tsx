
import { useState } from 'react';
import {
  FileText,
  History,
  FileSearch,
  ChevronRight,
  ChevronLeft,
  CalendarCheck,
  File
} from 'lucide-react';
import { cn } from '../ui/utils';

// ==================== INTERFACES ====================

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

interface ReportsSidebarProps {
  activeItem: string;
  onItemClick: (itemId: string) => void;
  onNewReport?: () => void; // Mantido para compatibilidade, mas pode ser removido depois
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  counts?: any; // Mantido para compatibilidade
}

// ==================== ITENS DEFAULT ====================

const getSidebarItems = (): SidebarItem[] => [
  {
    id: 'current-month',
    label: 'Extrato Atual (Jan/26)',
    icon: <CalendarCheck className="h-4 w-4" />,
    count: 1
  },
  {
    id: 'history',
    label: 'Histórico Completo',
    icon: <History className="h-4 w-4" />,
  },
  {
    id: 'documents',
    label: 'Documentos do Condomínio',
    icon: <FileText className="h-4 w-4" />,
  }
];

// ==================== ITENS DE MESES (MOCK) ====================
// Estrutura agrupada por ano
const yearGroups = [
  {
    year: 2026,
    months: [
      { id: 'report-jan-26', label: 'Janeiro', icon: <FileSearch className="h-4 w-4" /> }
    ]
  },
  {
    year: 2025,
    months: [
      { id: 'report-dez-25', label: 'Dezembro', icon: <File className="h-4 w-4" /> },
      { id: 'report-nov-25', label: 'Novembro', icon: <File className="h-4 w-4" /> },
      { id: 'report-out-25', label: 'Outubro', icon: <File className="h-4 w-4" /> },
      { id: 'report-set-25', label: 'Setembro', icon: <File className="h-4 w-4" /> },
      { id: 'report-ago-25', label: 'Agosto', icon: <File className="h-4 w-4" /> },
      { id: 'report-jul-25', label: 'Julho', icon: <File className="h-4 w-4" /> },
      { id: 'report-jun-25', label: 'Junho', icon: <File className="h-4 w-4" /> },
      { id: 'report-mai-25', label: 'Maio', icon: <File className="h-4 w-4" /> },
      { id: 'report-abr-25', label: 'Abril', icon: <File className="h-4 w-4" /> },
      { id: 'report-mar-25', label: 'Março', icon: <File className="h-4 w-4" /> },
      { id: 'report-fev-25', label: 'Fevereiro', icon: <File className="h-4 w-4" /> },
      { id: 'report-jan-25', label: 'Janeiro', icon: <File className="h-4 w-4" /> }
    ]
  }
];

// ==================== COMPONENTE COLAPSADO ====================

function CollapsedSidebarItem({
  item,
  isActive = false,
  onClick
}: {
  item: SidebarItem;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-center p-2 rounded-lg transition-colors relative group",
        isActive
          ? "bg-white text-[#525a52] shadow-sm"
          : "hover:bg-white/50 text-gray-500 hover:text-gray-900"
      )}
      title={item.label}
    >
      <div className="flex-shrink-0">
        {item.icon}
      </div>
      {/* Badge de contagem */}
      {item.count !== undefined && item.count > 0 && (
        <span className={cn(
          "absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full",
          isActive
            ? "bg-[#525a52] text-white"
            : "bg-gray-200 text-gray-600"
        )}>
          {item.count > 99 ? '99+' : item.count}
        </span>
      )}
    </button>
  );
}

// ==================== COMPONENTE PRINCIPAL (ATUALIZADO) ====================

export function ReportsSidebar({
  activeItem,
  onItemClick,
  collapsed = false,
  onToggleCollapse
}: ReportsSidebarProps) {
  const items = getSidebarItems();

  // Modo RECOLHIDO - apenas ícones (simplificado)
  if (collapsed) {
    return (
      <aside className="w-16 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-2xl transition-all duration-300 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="p-2 border-b border-gray-200 flex justify-center">
            <button onClick={onToggleCollapse} className="p-1.5 rounded-lg hover:bg-white/50 text-gray-500 hover:text-gray-700 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <div className="space-y-1 px-2">
              {items.map((item) => (
                <CollapsedSidebarItem key={item.id} item={item} isActive={activeItem === item.id} onClick={() => onItemClick(item.id)} />
              ))}
            </div>
            {/* Ícones dos meses (apenas os primeiros para não poluir) */}
            <div className="my-3 border-t border-gray-200 mx-2" />
            <div className="space-y-1 px-2">
              <CollapsedSidebarItem item={yearGroups[0].months[0]} isActive={activeItem === 'report-jan-26'} onClick={() => onItemClick('report-jan-26')} />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Modo EXPANDIDO
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-2xl transition-all duration-300 overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">FECHAMENTO</h1>
          <button onClick={onToggleCollapse} className="p-1.5 rounded-lg hover:bg-white/50 text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">

          {/* Inbox / Recentes */}
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className={`
                  w-full flex items-center justify-between px-3 py-2.5
                  rounded-lg text-sm font-medium whitespace-nowrap
                  transition-all duration-150
                  ${isActive
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                    }
                `}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className={`flex-shrink-0 ${isActive ? 'text-[#525a52]' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${isActive ? 'bg-[#525a52]/10 text-[#525a52]' : 'bg-gray-200 text-gray-600'}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Separador */}
          <div className="my-4 border-t border-gray-200" />

          {/* Loop por Anos */}
          {yearGroups.map((group) => (
            <div key={group.year} className="mb-4">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {group.year}
              </div>
              <nav className="space-y-1">
                {group.months.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onItemClick(item.id)}
                      className={`
                      w-full flex items-center justify-between px-3 py-2.5
                      rounded-lg text-sm font-medium whitespace-nowrap
                      transition-all duration-150
                      ${isActive
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                        }
                    `}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`flex-shrink-0 ${isActive ? 'text-[#525a52]' : 'text-gray-400'}`}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}

        </div>
      </div>
    </aside>
  );
}

export default ReportsSidebar;
