/**
 * Smart Search Button - MultiFins
 * Componente de busca com onboarding UX inteligente para ensinar sobre ⌘K
 */

import { useState, useEffect } from 'react'
import { Search, Command } from 'lucide-react'

interface SmartSearchButtonProps {
  onClick: () => void
  className?: string
}

export function SmartSearchButton({ onClick, className = '' }: SmartSearchButtonProps) {
  const [showTip, setShowTip] = useState(false)
  const [hasBeenIntroduced, setHasBeenIntroduced] = useState(false)
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false)

  // Verificar se o usuário já foi introduzido ao atalho
  useEffect(() => {
    const introduced = localStorage.getItem('multifins-search-tip-shown')
    const visitCount = parseInt(localStorage.getItem('multifins-visit-count') || '0')
    
    if (!introduced && visitCount < 3) {
      // Mostrar apenas nas primeiras 3 visitas
      setShouldShowOnboarding(true)
      // Mostrar dica após um delay inicial para não ser intrusivo
      const timer = setTimeout(() => {
        setShowTip(true)
      }, 4000) // 4 segundos após carregamento

      return () => clearTimeout(timer)
    } else {
      setHasBeenIntroduced(true)
    }
    
    // Incrementar contador de visitas
    localStorage.setItem('multifins-visit-count', (visitCount + 1).toString())
  }, [])

  // Auto-hide da dica após um tempo
  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => {
        setShowTip(false)
        localStorage.setItem('multifins-search-tip-shown', 'true')
        setHasBeenIntroduced(true)
      }, 8000) // 8 segundos de exibição

      return () => clearTimeout(timer)
    }
  }, [showTip])

  const handleClick = () => {
    // Se ainda não foi introduzido, marcar como visto
    if (!hasBeenIntroduced) {
      localStorage.setItem('multifins-search-tip-shown', 'true')
      setHasBeenIntroduced(true)
      setShowTip(false)
    }
    onClick()
  }

  return (
    <div className={`relative ${className}`}>
      {/* Botão de busca */}
      <button
        onClick={handleClick}
        className={`
          p-2.5 bg-white/95 backdrop-blur-xl border border-white/20 text-gray-700 
          hover:bg-gray-50 transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl 
          group relative overflow-hidden
          ${showTip ? 'ring-2 ring-primary/30 bg-primary/5' : ''}
        `}
        title="Buscar transações (⌘K)"
      >
        <Search className={`
          h-5 w-5 transition-all duration-200 
          ${showTip ? 'text-primary scale-110' : 'group-hover:text-primary'}
        `} />
        
        {/* Pulse ring para chamar atenção */}
        {showTip && (
          <div className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-30" />
        )}
      </button>

      {/* Tooltip educativo com estratégia UX inteligente */}
      {showTip && shouldShowOnboarding && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 animate-fadeInUp">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 max-w-72 relative">
            {/* Arrow apontando para o botão */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900/95 rotate-45 border-l border-t border-white/10"></div>
            
            {/* Botão de fechar discreto */}
            <button
              onClick={() => {
                setShowTip(false)
                localStorage.setItem('multifins-search-tip-shown', 'true')
                setHasBeenIntroduced(true)
              }}
              className="absolute top-2 right-2 w-5 h-5 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              title="Dispensar dica"
            >
              <span className="text-xs text-gray-300">×</span>
            </button>
            
            <div className="space-y-2 pr-6">
              {/* Título */}
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">💡 Dica Pro</span>
              </div>
              
              {/* Descrição */}
              <p className="text-xs text-gray-300 leading-relaxed">
                Use o atalho universal para buscar instantaneamente:
              </p>
              
              {/* Atalho destacado com animação */}
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg py-2 px-3 animate-gentlePulse">
                <Command className="h-3 w-3 text-primary" />
                <span className="text-xs text-primary font-medium">+</span>
                <kbd className="px-2 py-1 bg-primary/20 rounded text-xs font-mono text-primary border border-primary/30">
                  K
                </kbd>
              </div>
              
              {/* Call to action mais específico */}
              <p className="text-xs text-gray-400 text-center">
                Funciona em qualquer tela!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Indicador sutil para usuários experientes */}
      {hasBeenIntroduced && (
        <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-slate-700/90 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs border border-white/20">
            <div className="flex items-center gap-1">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}