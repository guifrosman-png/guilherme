import React from 'react'
import { Search } from 'lucide-react'

interface ExploreButtonProps {
    onClick: () => void
    disabled?: boolean
    /** Compact mode for smaller cards */
    compact?: boolean
}

/**
 * Simple "Explorar" button for chart cards.
 * Opens the ExplorarModal when clicked.
 * Export functionality is available inside the modal.
 */
export function ExploreButton({ onClick, disabled = false, compact = false }: ExploreButtonProps) {
    if (compact) {
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                }}
                disabled={disabled}
                title="Explorar dados"
                className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Search className="h-3.5 w-3.5" />
            </button>
        )
    }

    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                onClick()
            }}
            disabled={disabled}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Search className="h-3 w-3" />
            Explorar
        </button>
    )
}
