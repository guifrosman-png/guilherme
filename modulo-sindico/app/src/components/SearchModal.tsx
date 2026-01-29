/**
 * Search Modal - Hub Mod Minimal Template
 * Modal de busca responsivo com suporte a mobile e desktop
 */

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp, Command, FileText, Settings, LayoutDashboard } from 'lucide-react'
import { useMobile } from '../hooks/useMobile'

interface SearchItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectItem?: (item: SearchItem) => void
}

// Itens de exemplo para o template - substitua pelos seus dados reais
const defaultSearchItems: SearchItem[] = [
  { id: '1', title: 'Report', description: 'Página inicial com métricas', icon: <LayoutDashboard className="h-4 w-4" />, category: 'Páginas' },
  { id: '2', title: 'Transações', description: 'Gerenciar transações', icon: <FileText className="h-4 w-4" />, category: 'Páginas' },
  { id: '3', title: 'Configurações', description: 'Ajustes do sistema', icon: <Settings className="h-4 w-4" />, category: 'Configurações' },
  { id: '4', title: 'Relatórios', description: 'Visualizar relatórios', icon: <FileText className="h-4 w-4" />, category: 'Páginas' },
]

export function SearchModal({
  isOpen,
  onClose,
  onSelectItem = () => {}
}: SearchModalProps) {
  const isMobile = useMobile()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches] = useState(['Report', 'Relatórios', 'Configurações'])
  const inputRef = useRef<HTMLInputElement>(null)

  // Filtrar itens baseado no termo de busca
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase()
      const filtered = defaultSearchItems.filter(item =>
        item.title.toLowerCase().includes(searchTermLower) ||
        item.description.toLowerCase().includes(searchTermLower) ||
        item.category.toLowerCase().includes(searchTermLower)
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems([])
    }
  }, [searchTerm])

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, isMobile ? 300 : 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen, isMobile])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            filteredItems.length > 0
              ? Math.min(prev + 1, filteredItems.length - 1)
              : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredItems[selectedIndex]) {
            onSelectItem(filteredItems[selectedIndex])
            onClose()
          }
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose, filteredItems, selectedIndex, onSelectItem])

  // Reset quando filtro muda
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredItems])

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  const handleClearSearch = () => {
    setSearchTerm('')
    setTimeout(() => inputRef.current?.focus(), 10)
  }

  if (!isOpen) return null

  // Mobile: Full screen modal
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
          style={{ animation: 'fadeIn 0.2s ease-out forwards' }}
        />

        {/* Modal Container */}
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Header - slides from top */}
          <div
            className="bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 pt-14"
            style={{ animation: 'slideInFromTop 0.3s ease-out forwards' }}
          >
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base placeholder-gray-500"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content - slides from bottom */}
          <div
            className="flex-1 bg-gray-50 overflow-auto"
            style={{ animation: 'slideInFromBottom 0.3s ease-out forwards' }}
          >
            {/* Recent Searches */}
            {!searchTerm && (
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Buscas recentes</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchTerm(term)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-all touch-feedback active:scale-95"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Suggestions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Acesso rápido</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {defaultSearchItems.slice(0, 4).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectItem(item)
                          onClose()
                        }}
                        className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-left touch-feedback active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-500">{item.icon}</span>
                          <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchTerm && (
              <div className="p-4">
                {filteredItems.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {filteredItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectItem(item)
                            onClose()
                          }}
                          className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-left touch-feedback active:scale-[0.98]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{item.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">Nenhum resultado</h3>
                    <p className="text-gray-500 text-sm">Tente buscar por outro termo</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  // Desktop: Centered modal
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
        <div className="w-full max-w-2xl glass rounded-2xl shadow-3xl overflow-hidden animate-scaleIn">
          {/* Header com Search */}
          <div className="bg-white border-b border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite para buscar..."
                  autoFocus
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base placeholder-gray-500"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Keyboard shortcut hint */}
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 max-h-[50vh] overflow-auto">
            {/* Empty state with suggestions */}
            {!searchTerm && (
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Buscas recentes</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchTerm(term)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-all touch-feedback active:scale-95"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick access */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Acesso rápido</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {defaultSearchItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectItem(item)
                          onClose()
                        }}
                        className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-500 group-hover:text-primary transition-colors">{item.icon}</span>
                          <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">{item.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchTerm && (
              <div className="p-6">
                {filteredItems.length > 0 ? (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
                      </span>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">↑</kbd>
                        <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">↓</kbd>
                        <span>navegar</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {filteredItems.map((item, index) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectItem(item)
                            onClose()
                          }}
                          className={`w-full p-4 border rounded-xl transition-all text-left group ${
                            selectedIndex === index
                              ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/20'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`transition-colors ${selectedIndex === index ? 'text-primary' : 'text-gray-500'}`}>
                              {item.icon}
                            </span>
                            <div className="flex-1">
                              <div className={`font-medium transition-colors ${selectedIndex === index ? 'text-primary' : 'text-gray-900'}`}>
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-500">{item.description}</div>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">Nenhum resultado</h3>
                    <p className="text-gray-500 text-sm">Tente buscar por outro termo</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 p-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Digite para buscar</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded">Enter</kbd>
                  <span>selecionar</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd>
                  <span>fechar</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
