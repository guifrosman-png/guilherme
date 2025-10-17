/**
 * MobileTabBar Component - Baseado no template E4CEO
 * Tab bar móvel com glassmorphism effect
 */

import { Badge } from '../ui/badge'
import { 
  Home, 
  CreditCard, 
  PiggyBank, 
  BarChart3, 
  Upload, 
  Heart 
} from 'lucide-react'

interface MobileTabBarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

const mobileNavItems = [
  { id: 'home', name: 'Home', icon: Home, badge: null },
  { id: 'transactions', name: 'Transações', icon: CreditCard, badge: null },
  { id: 'accounts', name: 'Contas', icon: PiggyBank, badge: null },
  { id: 'results', name: 'Relatórios', icon: BarChart3, badge: null },
]

export function MobileTabBar({ currentPage, onPageChange }: MobileTabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      {/* Barra principal com integração visual do FAB */}
      <div className="relative h-20 bg-background/95 backdrop-blur-xl border-t border-border">
        
        {/* Container principal dos itens */}
        <div className="flex items-center justify-between h-full px-2 relative">
          {/* Primeira metade dos itens - 2 itens à esquerda */}
          <div className="flex flex-1 justify-around items-end pb-2">
            {mobileNavItems.slice(0, 2).map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`
                    relative flex flex-col items-center justify-center p-2 rounded-xl min-w-0 flex-1 max-w-[60px]
                    transition-all duration-300 ease-out
                    ${isActive 
                      ? 'text-primary bg-primary/10 scale-105' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105'
                    }
                  `}
                >
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-all duration-200`} />
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center bg-primary text-primary-foreground"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={`
                    text-[9px] mt-1.5 truncate w-full text-center leading-tight
                    ${isActive ? 'font-medium' : 'font-normal'}
                  `}>
                    {item.name}
                  </span>
                  
                  {/* Indicador ativo */}
                  {isActive && (
                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full">
                      <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Espaço central com entalhe para o FAB */}
          <div className="relative flex-shrink-0 w-20 h-full flex items-center justify-center">
            {/* Entalhe semicircular superior usando pseudo-element */}
            <div 
              className="absolute top-0 w-20 h-10 bg-transparent"
              style={{
                background: `radial-gradient(ellipse 40px 20px at center top, transparent 50%, hsl(var(--background)) 50%)`,
              }}
            />
            
            {/* Bordas laterais do entalhe */}
            <div className="absolute top-0 left-0 w-1 h-8 bg-border rounded-r-full" />
            <div className="absolute top-0 right-0 w-1 h-8 bg-border rounded-l-full" />
            
            {/* Botão FAB - Posicionado metade para fora, metade para dentro */}
            <button
              className="absolute -top-8 w-16 h-16 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-105 z-50"
              title="Adicionar Transação"
            >
              <span className="text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-200">+</span>
              
              {/* Anel de borda branca para destacar */}
              <div className="absolute inset-0 rounded-full border-4 border-background/95"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-lg group-hover:bg-emerald-400/40 transition-all duration-300"></div>
            </button>
          </div>

          {/* Segunda metade dos itens - 2 itens à direita */}
          <div className="flex flex-1 justify-around items-end pb-2">
            {mobileNavItems.slice(2).map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`
                    relative flex flex-col items-center justify-center p-2 rounded-xl min-w-0 flex-1 max-w-[60px]
                    transition-all duration-300 ease-out
                    ${isActive 
                      ? 'text-primary bg-primary/10 scale-105' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105'
                    }
                  `}
                >
                  <div className="relative">
                    <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-all duration-200`} />
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center bg-primary text-primary-foreground"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={`
                    text-[9px] mt-1.5 truncate w-full text-center leading-tight
                    ${isActive ? 'font-medium' : 'font-normal'}
                  `}>
                    {item.name}
                  </span>
                  
                  {/* Indicador ativo */}
                  {isActive && (
                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full">
                      <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                    </div>
                  )}
                </button>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}