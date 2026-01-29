import React, { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

/**
 * Grupo de colunas para cabeçalhos de dois níveis
 * Ex: { label: '2025', colSpan: 3 } agrupa 3 colunas sob "2025"
 */
interface ColumnGroup {
    label: string
    colSpan: number
}

interface CanvasTableProps {
    props: {
        columns?: string[]
        rows?: string[][]
        columnGroups?: ColumnGroup[]  // Cabeçalhos agrupados (opcional)
    }
    scale: number
}

// Cores por scheme (Azul padrão para combinar com Explorar)
const colorSchemes: Record<string, { header: string; headerGroup: string; hover: string; border: string; textLink?: string }> = {
    default: {
        header: 'bg-blue-50',
        headerGroup: 'bg-blue-100',
        hover: 'hover:bg-blue-50/50',
        border: 'border-blue-100',
        textLink: 'text-blue-600'
    }
}

export function CanvasTable({ props, scale }: CanvasTableProps) {
    const tableColumns = (props.columns as string[]) || ['Coluna 1', 'Coluna 2']
    const tableRows = (props.rows as string[][]) || [['Linha 1', 'Valor 1']]
    const columnGroups = props.columnGroups as ColumnGroup[] | undefined
    const colors = colorSchemes.default

    // Estado de ordenação local
    const [tableSort, setTableSort] = useState<{ col: number, dir: 'asc' | 'desc' } | null>(null)

    const displayRows = useMemo(() => {
        if (!tableSort) return tableRows
        return [...tableRows].sort((a, b) => {
            const valA = a[tableSort.col] || ''
            const valB = b[tableSort.col] || ''
            const numA = parseFloat(valA.replace(/[^\d.-]/g, ''))
            const numB = parseFloat(valB.replace(/[^\d.-]/g, ''))

            if (!isNaN(numA) && !isNaN(numB)) {
                return tableSort.dir === 'asc' ? numA - numB : numB - numA
            }
            return tableSort.dir === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA)
        })
    }, [tableRows, tableSort])

    const handleSort = (colIndex: number) => {
        setTableSort(prev => ({
            col: colIndex,
            dir: prev?.col === colIndex && prev.dir === 'asc' ? 'desc' : 'asc'
        }))
    }

    const renderSortIcon = (colIndex: number) => {
        if (tableSort?.col === colIndex) {
            return tableSort.dir === 'asc'
                ? <ChevronUp className="w-3 h-3 text-blue-600" />
                : <ChevronDown className="w-3 h-3 text-blue-600" />
        }
        return <ChevronsUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    }

    // Verificar se tem cabeçalhos agrupados
    const hasColumnGroups = columnGroups && columnGroups.length > 0

    return (
        <div className="flex-1 w-full h-full overflow-hidden bg-white flex flex-col">
            <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full border-collapse min-w-full">
                    <thead className="sticky top-0 z-10">
                        {/* Linha de grupos (se existir) */}
                        {hasColumnGroups && (
                            <tr className={colors.headerGroup}>
                                {columnGroups.map((group, i) => (
                                    <th
                                        key={i}
                                        colSpan={group.colSpan}
                                        className={`
                                            px-3 py-1.5 text-center text-[10px] font-bold text-slate-800 uppercase tracking-wider
                                            border-b ${colors.border}
                                            ${group.label ? 'border-l border-r border-blue-200' : ''}
                                        `}
                                    >
                                        {group.label}
                                    </th>
                                ))}
                            </tr>
                        )}

                        {/* Linha de colunas */}
                        <tr className={colors.header}>
                            {tableColumns.map((col, i) => (
                                <th
                                    key={i}
                                    onClick={() => handleSort(i)}
                                    className={`
                                        px-3 py-2 text-left text-[11px] font-semibold text-slate-700 uppercase tracking-wider
                                        border-b ${colors.border} cursor-pointer select-none group
                                        ${tableSort?.col === i ? 'bg-blue-100' : ''}
                                    `}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span>{col}</span>
                                        {renderSortIcon(i)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayRows.map((row, rowIdx) => {
                            // Verificar se é linha de total
                            const isTotal = (row as any)._isTotal === true

                            return (
                                <tr
                                    key={rowIdx}
                                    className={`
                                        transition-colors border-b border-slate-50 last:border-0
                                        ${isTotal
                                            ? 'bg-slate-100 font-semibold border-t-2 border-t-slate-300'
                                            : 'hover:bg-blue-50/30'
                                        }
                                    `}
                                >
                                    {row.map((cell, cellIdx) => {
                                        const val = String(cell)
                                        // Tentar inferir alinhamento numérico
                                        const isNumeric = /^-?[\d.,%R$ ]+$/.test(val) && val.replace(/[^\d]/g, '').length > 0

                                        return (
                                            <td
                                                key={cellIdx}
                                                className={`
                                                    px-3 py-2 text-xs
                                                    ${isTotal ? 'text-slate-800' : 'text-slate-700'}
                                                    ${isNumeric ? 'text-right font-mono' : 'text-left'}
                                                    ${isTotal && cellIdx === 0 ? 'font-bold' : ''}
                                                `}
                                            >
                                                {val}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
