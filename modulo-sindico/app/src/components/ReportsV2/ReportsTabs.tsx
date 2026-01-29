
import { ReportsTabId } from './types/report.types';

// ==================== INTERFACES ====================

interface Tab {
  id: ReportsTabId;
  label: string;
  count: number;
}

interface ReportsTabsProps {
  activeTab: ReportsTabId;
  onTabChange: (tabId: ReportsTabId) => void;
  counts: {
    shared: number;
    user: number;
    system: number;
    favorites: number;
  };
}

// ==================== COMPONENTE ====================

export function ReportsTabs({
  activeTab,
  onTabChange,
  counts
}: ReportsTabsProps) {
  const tabs: Tab[] = [
    { id: 'favorites', label: 'Favoritos', count: counts.favorites },
    { id: 'shared', label: 'Compartilhados', count: counts.shared },
    { id: 'user', label: 'Meus', count: counts.user },
    { id: 'system', label: 'Do Sistema', count: counts.system }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2
              rounded-md text-sm font-medium
              transition-all duration-150
              ${isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`
                text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                ${isActive
                  ? 'bg-[#525a52]/10 text-[#525a52]'
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ReportsTabs;
