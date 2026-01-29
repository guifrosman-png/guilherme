import React from 'react';
import { X } from 'lucide-react';
import { FilterCondition } from './types';

interface FilterCapsulesProps {
    filters: FilterCondition[];
    setFilters: React.Dispatch<React.SetStateAction<FilterCondition[]>>;
}

export function FilterCapsules({ filters, setFilters }: FilterCapsulesProps) {
    if (filters.length === 0) return null;

    const removeFilter = (id: string) => {
        setFilters(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="flex flex-wrap gap-2 mb-6 px-1">
            {filters.map(filter => (
                <div key={filter.id} className="flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-medium shadow-sm transition-all hover:shadow-md hover:scale-[1.02]">
                    <span className="text-blue-800 capitalize">
                        {filter.field === 'tag' ? 'Etiqueta' :
                            filter.field === 'priority' ? 'Prioridade' :
                                filter.field === 'member' ? 'Membro' :
                                    filter.field === 'dueDate' ? 'Data' : filter.field}
                    </span>
                    <span className="text-blue-300 mx-0.5">
                        {filter.operator === 'is' ? 'é' :
                            filter.operator === 'is_not' ? 'não é' :
                                filter.operator === 'set' ? 'definido' :
                                    filter.operator === 'not_set' ? 'não definido' :
                                        filter.operator === 'before' ? 'antes de' :
                                            filter.operator === 'after' ? 'depois de' :
                                                filter.operator === 'between' ? 'entre' : filter.operator}
                    </span>
                    <span className="truncate max-w-[200px] font-bold">
                        {filter.field === 'priority'
                            ? (Array.isArray(filter.value) ? filter.value.map((v: string) => {
                                const labels: Record<string, string> = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' };
                                return labels[v] || v;
                            }).join(', ') : filter.value)
                            : filter.field === 'dueDate'
                                ? (() => {
                                    if (filter.operator === 'before' || filter.operator === 'after') {
                                        return new Date(filter.value).toLocaleDateString('pt-BR');
                                    }
                                    if (filter.operator === 'between') {
                                        return `${new Date(filter.value.start).toLocaleDateString('pt-BR')} e ${new Date(filter.value.end).toLocaleDateString('pt-BR')}`;
                                    }
                                    const labels: Record<string, string> = { overdue: 'Atrasado', today: 'Hoje', week: 'Esta Semana', nodate: 'Sem Data' };
                                    return labels[filter.value as string] || filter.value;
                                })()
                                : (Array.isArray(filter.value) ? filter.value.join(', ') : String(filter.value))
                        }
                    </span>
                    <button
                        onClick={() => removeFilter(filter.id)}
                        className="ml-1 text-blue-400 hover:text-blue-900 rounded-full hover:bg-blue-100 p-0.5 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
            <button onClick={() => setFilters([])} className="text-xs text-gray-400 hover:text-red-500 hover:underline ml-2 transition-colors">
                Limpar filtros
            </button>
        </div>
    );
}
