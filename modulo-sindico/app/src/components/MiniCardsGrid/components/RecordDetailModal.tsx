import React from 'react'
import { X, Copy, ExternalLink, Calendar, User, Mail, Phone, Tag, Building } from 'lucide-react'
import { ExplorarRecord } from '../hooks/useExplorarData'

interface RecordDetailModalProps {
    isOpen: boolean
    onClose: () => void
    record: ExplorarRecord | null
    title?: string
    colorScheme?: string
    onOpenOriginal?: (record: ExplorarRecord) => void
}

export function RecordDetailModal({
    isOpen,
    onClose,
    record,
    title = 'Detalhes do Registro',
    colorScheme = 'blue',
    onOpenOriginal
}: RecordDetailModalProps) {
    if (!isOpen || !record) return null

    // Cores por scheme
    const colorClasses: Record<string, { bg: string; text: string; lightBg: string }> = {
        blue: { bg: 'bg-blue-600', text: 'text-blue-600', lightBg: 'bg-blue-50' },
        emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', lightBg: 'bg-emerald-50' },
        amber: { bg: 'bg-amber-600', text: 'text-amber-600', lightBg: 'bg-amber-50' },
        rose: { bg: 'bg-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50' },
        purple: { bg: 'bg-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50' },
        slate: { bg: 'bg-slate-600', text: 'text-slate-600', lightBg: 'bg-slate-50' },
        cyan: { bg: 'bg-cyan-600', text: 'text-cyan-600', lightBg: 'bg-cyan-50' },
        orange: { bg: 'bg-orange-600', text: 'text-orange-600', lightBg: 'bg-orange-50' },
    }
    const colors = colorClasses[colorScheme] || colorClasses.blue

    // Helper para identificar ícone baseado na chave
    const getIconByKey = (key: string) => {
        if (key.includes('data')) return <Calendar className="w-4 h-4" />
        if (key.includes('cliente') || key.includes('nome')) return <User className="w-4 h-4" />
        if (key.includes('email')) return <Mail className="w-4 h-4" />
        if (key.includes('telefone')) return <Phone className="w-4 h-4" />
        if (key.includes('empresa')) return <Building className="w-4 h-4" />
        return <Tag className="w-4 h-4" />
    }

    // Formatar valor para exibição
    const formatValue = (key: string, value: unknown) => {
        if (value === null || value === undefined) return '-'
        if (key.includes('data') && typeof value === 'string') {
            try {
                const date = new Date(value)
                if (!isNaN(date.getTime())) return date.toLocaleDateString('pt-BR')
            } catch (e) { }
        }
        if (typeof value === 'number') {
            if (key.includes('valor') || key.includes('total') || key.includes('preco')) {
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
            }
            return value.toLocaleString('pt-BR')
        }
        return String(value)
    }

    return (
        <div className="fixed inset-0 z-[10001] overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col">
                {/* Header */}
                <div className={`px-6 py-5 border-b border-gray-100 flex items-center justify-between ${colors.lightBg}`}>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-gray-500 bg-white/50 px-1.5 py-0.5 rounded">
                                #{record.id}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-white font-medium ${colors.text}`}>
                                {String(record.status || 'Ativo')}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/50 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {Object.entries(record).map(([key, value]) => {
                        if (key === 'id' || key === 'status') return null // Já mostrados no header

                        return (
                            <div key={key} className="group">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`p-1 rounded bg-gray-50 text-gray-400 group-hover:${colors.text} transition-colors`}>
                                        {getIconByKey(key)}
                                    </span>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        {key.replace(/_/g, ' ')}
                                    </label>
                                </div>
                                <div className="pl-8">
                                    <div className="text-sm font-medium text-gray-900 break-words bg-gray-50 rounded-lg px-3 py-2 border border-transparent group-hover:border-gray-200 transition-colors">
                                        {formatValue(key, value)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={() => {
                            const text = Object.entries(record)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join('\n')
                            navigator.clipboard.writeText(text)
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Copy className="w-4 h-4" />
                        Copiar Infos
                    </button>
                    <button
                        onClick={() => onOpenOriginal?.(record)}
                        disabled={!onOpenOriginal}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${colors.bg} hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed`}
                    >
                        <ExternalLink className="w-4 h-4" />
                        Abrir Original
                    </button>
                </div>
            </div>
        </div>
    )
}
