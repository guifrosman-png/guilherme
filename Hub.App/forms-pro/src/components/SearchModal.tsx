/**
 * Search Modal - Anamnese Pro
 * Modal de busca para anamneses e clientes
 */

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock } from 'lucide-react'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  data: any[]
  onSelectItem?: (item: any) => void
  searchPlaceholder?: string
}

export function SearchModal({
  isOpen,
  onClose,
  data = [],
  onSelectItem = () => {},
  searchPlaceholder = "Buscar anamneses e clientes..."
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [recentSearches] = useState(['Maria Silva', 'João Santos', 'Anamnese Pendente'])
  const inputRef = useRef<HTMLInputElement>(null)

  // Filtrar dados baseado no termo de busca
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchTermLower = searchTerm.toLowerCase()
      const filtered = data.filter(item => {
        const searchableValues = Object.values(item)
          .filter(value => typeof value === 'string')
          .map(value => (value as string).toLowerCase())

        return searchableValues.some(value =>
          value.includes(searchTermLower)
        )
      }).slice(0, 8)

      setFilteredData(filtered)
    } else {
      setFilteredData([])
    }
  }, [searchTerm, data])

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 max-h-[80vh] overflow-hidden border border-white/20 animate-in slide-in-from-top duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />

              {/* Clear button */}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors"
                  title="Limpar busca"
                >
                  <X className="h-3 w-3 text-gray-600" />
                </button>
              )}
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
          {searchTerm ? (
            filteredData.length > 0 ? (
              <div className="p-4 space-y-2">
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    {filteredData.length} resultado{filteredData.length !== 1 ? 's' : ''} encontrado{filteredData.length !== 1 ? 's' : ''}
                  </span>
                </div>
                {filteredData.map((item, index) => (
                  <button
                    key={item.id || index}
                    onClick={() => {
                      onSelectItem(item)
                      onClose()
                    }}
                    className="w-full p-4 bg-gray-50 hover:bg-pink-50 rounded-xl transition-colors text-left border border-gray-100 hover:border-pink-200"
                  >
                    <div className="font-medium text-gray-900 truncate">
                      {item.clienteNome || item.name || 'Item sem nome'}
                    </div>
                    <div className="text-sm text-gray-500 mt-1 truncate">
                      {item.data || item.status || 'Sem descrição'}
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
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Buscas recentes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-pink-50 hover:border-pink-200 transition-colors"
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
