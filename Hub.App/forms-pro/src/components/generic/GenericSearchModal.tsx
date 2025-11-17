/**
 * Generic Search Modal
 * Modal de busca genérico para qualquer tipo de dados
 */

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, Filter } from 'lucide-react'
import { useMobile } from '../ui/use-mobile'

interface GenericSearchModalProps {
  isOpen: boolean
  onClose: () => void
  data: any[]
  onSelectItem?: (item: any) => void
  searchPlaceholder?: string
  onSearchChange?: (query: string) => void
  searchQuery?: string
  categories?: string[]
  isMobile?: boolean
}

export function GenericSearchModal({ 
  isOpen, 
  onClose, 
  data = [],
  onSelectItem = () => {},
  searchPlaceholder = "Buscar...",
  onSearchChange = () => {},
  searchQuery = "",
  categories = [],
  isMobile: propIsMobile
}: GenericSearchModalProps) {
  const isMobile = propIsMobile ?? useMobile()
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [recentSearches] = useState(['Pesquisa 1', 'Pesquisa 2', 'Pesquisa 3'])
  const inputRef = useRef<HTMLInputElement>(null)

  // Sincronizar com searchQuery externo
  useEffect(() => {
    setLocalSearchTerm(searchQuery)
  }, [searchQuery])

  // Filtrar dados baseado no termo de busca
  useEffect(() => {
    if (localSearchTerm.trim()) {
      const searchTermLower = localSearchTerm.toLowerCase()
      const filtered = data.filter(item => {
        // Busca genérica em todas as propriedades string do objeto
        const searchableValues = Object.values(item)
          .filter(value => typeof value === 'string')
          .map(value => (value as string).toLowerCase())
        
        return searchableValues.some(value => 
          value.includes(searchTermLower)
        )
      }).slice(0, 8) // Limitar resultados para performance
      
      setFilteredData(filtered)
    } else {
      setFilteredData([])
    }
  }, [localSearchTerm, data])

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll do body
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value)
    onSearchChange(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de busca se necessário
  }

  if (!isOpen) return null

  // Renderização móvel
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 opacity-0 animate-fadeInUp"
          onClick={onClose}
          style={{
            animation: 'fadeInUp 0.2s ease-out forwards'
          }}
        />
        
        {/* Modal Container */}
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Header */}
          <div 
            className="bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4"
            style={{
              animation: 'slideInFromTop 0.3s ease-out forwards'
            }}
          >
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <form onSubmit={handleSearchSubmit}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={localSearchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base placeholder-gray-500"
                  />
                </form>
                
                {/* Clear button */}
                {localSearchTerm && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors group"
                    title="Limpar busca"
                  >
                    <X className="h-3 w-3 text-gray-600 group-hover:text-gray-800" />
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

          {/* Content */}
          <div 
            className="flex-1 bg-gray-50 overflow-auto"
            style={{
              animation: 'slideInFromBottom 0.3s ease-out forwards'
            }}
          >
            {/* Recent Searches */}
            {!localSearchTerm && (
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
                        onClick={() => handleSearchChange(term)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search Results */}
            {localSearchTerm && (
              <div className="p-4">
                {filteredData.length > 0 ? (
                  <>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-700">
                        {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''} encontrado{filteredData.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {filteredData.map((item, index) => (
                        <button
                          key={item.id || index}
                          onClick={() => {
                            onSelectItem(item)
                            onClose()
                          }}
                          className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="font-medium text-gray-900 truncate">
                            {item.title || item.name || item.description || JSON.stringify(item)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 truncate">
                            {item.subtitle || item.category || 'Item genérico'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">
                      Nenhum resultado encontrado
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Tente buscar com outros termos
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  // Renderização desktop
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-3xl z-50 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={localSearchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-auto">
          {localSearchTerm ? (
            filteredData.length > 0 ? (
              <div className="p-4 space-y-2">
                {filteredData.map((item, index) => (
                  <button
                    key={item.id || index}
                    onClick={() => {
                      onSelectItem(item)
                      onClose()
                    }}
                    className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                  >
                    <div className="font-medium text-gray-900 truncate">
                      {item.title || item.name || item.description || JSON.stringify(item)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 truncate">
                      {item.subtitle || item.category || 'Item genérico'}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-gray-500 text-sm">
                  Tente buscar com outros termos
                </p>
              </div>
            )
          ) : (
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-3">Sugestões de busca</h4>
              <div className="space-y-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearchChange(term)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}