import { useState } from 'react';
import { 
  Home, 
  ArrowUpDown, 
  BarChart3, 
  Upload, 
  Heart,
  Wallet
} from 'lucide-react';
import { cn } from './ui/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: Home,
  },
  {
    id: 'transactions',
    label: 'Transações',
    icon: ArrowUpDown,
  },
  {
    id: 'accounts',
    label: 'Contas',
    icon: Wallet,
  },
  {
    id: 'results',
    label: 'Resultados',
    icon: BarChart3,
  },
  {
    id: 'upload',
    label: 'Upload',
    icon: Upload,
  },
  {
    id: 'health',
    label: 'Saúde',
    icon: Heart,
  },
];

interface ResponsiveNavigationProps {
  activeItem?: string;
  onItemChange?: (itemId: string) => void;
}

export function ResponsiveNavigation({ 
  activeItem = 'home', 
  onItemChange 
}: ResponsiveNavigationProps) {
  const [active, setActive] = useState(activeItem);

  const handleItemClick = (itemId: string) => {
    setActive(itemId);
    onItemChange?.(itemId);
  };

  return (
    <>
      {/* Mobile Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div 
          className="bg-white shadow-lg"
          style={{ 
            borderTop: '1px solid var(--color-neutral-200)',
            backgroundColor: 'white',
            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="flex items-center justify-around px-4 py-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[70px]"
                  style={{
                    color: isActive ? 'var(--color-primary-600)' : 'var(--color-neutral-500)',
                    backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent'
                  }}
                >
                  <Icon className={cn(
                    "transition-all duration-200",
                    isActive ? "h-6 w-6" : "h-5 w-5"
                  )} />
                  <span className={cn(
                    "text-xs transition-all duration-200 text-center leading-tight",
                    isActive ? "font-medium" : "font-normal"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Right Sidebar */}
      <div className="hidden lg:block fixed right-0 top-0 bottom-0 z-50">
        <div 
          className="h-full w-20 bg-white shadow-lg"
          style={{ 
            borderLeft: '1px solid var(--color-neutral-200)',
            backgroundColor: 'white',
            boxShadow: '-4px 0 6px -1px rgba(0, 0, 0, 0.1), -2px 0 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="flex flex-col items-center justify-center h-full py-8 space-y-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 w-16 h-16 hover:shadow-sm"
                  style={{
                    color: isActive ? 'var(--color-primary-600)' : 'var(--color-neutral-500)',
                    backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent'
                  }}
                  title={item.label}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)';
                      e.currentTarget.style.color = 'var(--color-neutral-700)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-neutral-500)';
                    }
                  }}
                >
                  <Icon className={cn(
                    "transition-all duration-200",
                    isActive ? "h-6 w-6" : "h-5 w-5"
                  )} />
                  <span className={cn(
                    "text-xs transition-all duration-200 text-center leading-tight",
                    isActive ? "font-medium" : "font-normal"
                  )}>
                    {item.label.split(' ').map((word, index) => (
                      <span key={index} className="block">
                        {word}
                      </span>
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// Hook para detectar se estamos em mobile ou desktop
export function useNavigationLayout() {
  // Usando Tailwind breakpoint lg (1024px) como threshold
  return {
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
  };
}