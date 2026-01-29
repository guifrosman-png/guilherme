import { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface MobileTabBarProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
  tabItems?: TabItem[];
  className?: string;
}

export function MobileTabBar({
  currentPage = 'home',
  onPageChange = () => {},
  tabItems = [],
  className = ''
}: MobileTabBarProps) {
  return (
    <div className={`
      fixed bottom-6 left-4 right-4 z-30
      bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10
      flex items-center justify-around px-4 py-2
      ${className}
    `}>
      {tabItems.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id)}
          className={`
            flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300
            min-w-[64px] relative overflow-hidden
            ${currentPage === item.id
              ? 'bg-primary text-white shadow-lg scale-105'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Icon */}
          <div className={`
            w-6 h-6 flex items-center justify-center transition-all duration-200
            ${currentPage === item.id ? 'scale-110' : ''}
          `}>
            <item.icon className="h-5 w-5" />
          </div>

          {/* Label */}
          <span className="text-xs font-medium leading-tight">
            {item.label}
          </span>

          {/* Active indicator */}
          {currentPage === item.id && (
            <div className="absolute inset-0 bg-primary rounded-2xl opacity-10 animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}
