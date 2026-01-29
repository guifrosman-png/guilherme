import React, { useState } from 'react';
import { X, Plus, Trash2, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { FilterCondition, FilterField, FilterOperator } from './types';

interface UniversalFilterMenuProps {
    filters: FilterCondition[];
    setFilters: React.Dispatch<React.SetStateAction<FilterCondition[]>>;
    availableTags: { label: string; color: string }[];
    availableMembers: { id: string; name: string; avatar: string }[];
    onClose: () => void;
}

export function UniversalFilterMenu({
    filters,
    setFilters,
    availableTags,
    availableMembers,
    onClose
}: UniversalFilterMenuProps) {

    const addFilter = () => {
        const newFilter: FilterCondition = {
            id: crypto.randomUUID(),
            field: 'tag',
            operator: 'is',
            value: []
        };
        setFilters([...filters, newFilter]);
    };

    const removeFilter = (id: string) => {
        setFilters(filters.filter(f => f.id !== id));
    };

    const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
        setFilters(filters.map(f => {
            if (f.id === id) {
                // Determine sensible default values when field changes
                if (updates.field && updates.field !== f.field) {
                    let defaultValue: any = [];
                    let defaultOperator: FilterOperator = 'is';

                    if (updates.field === 'priority' || updates.field === 'tag' || updates.field === 'member') {
                        defaultValue = [];
                        defaultOperator = 'is';
                    }
                    return { ...f, ...updates, value: defaultValue, operator: defaultOperator };
                }
                return { ...f, ...updates };
            }
            return f;
        }));
    };

    const renderValueInput = (filter: FilterCondition) => {
        if (filter.operator === 'set' || filter.operator === 'not_set') return null;

        switch (filter.field) {
            case 'tag':
                return (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {availableTags.map(tag => {
                            const isSelected = (filter.value as string[]).includes(tag.label);
                            return (
                                <button
                                    key={tag.label}
                                    onClick={() => {
                                        const current = filter.value as string[];
                                        const newValue = isSelected
                                            ? current.filter(v => v !== tag.label)
                                            : [...current, tag.label];
                                        updateFilter(filter.id, { value: newValue });
                                    }}
                                    className={clsx(
                                        "px-2 py-0.5 rounded text-xs border transition-colors",
                                        isSelected
                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    {tag.label}
                                </button>
                            );
                        })}
                    </div>
                );
            case 'priority':
                return (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {['low', 'medium', 'high', 'urgent'].map(p => {
                            const isSelected = (filter.value as string[]).includes(p);
                            const labels: Record<string, string> = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' };
                            return (
                                <button
                                    key={p}
                                    onClick={() => {
                                        const current = filter.value as string[];
                                        const newValue = isSelected
                                            ? current.filter(v => v !== p)
                                            : [...current, p];
                                        updateFilter(filter.id, { value: newValue });
                                    }}
                                    className={clsx(
                                        "px-2 py-0.5 rounded text-xs border transition-colors",
                                        isSelected
                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    {labels[p]}
                                </button>
                            );
                        })}
                    </div>
                );
            case 'member':
                return (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {availableMembers.map(member => {
                            const isSelected = (filter.value as string[]).includes(member.id);
                            return (
                                <button
                                    key={member.id}
                                    onClick={() => {
                                        const current = filter.value as string[];
                                        const newValue = isSelected
                                            ? current.filter(v => v !== member.id)
                                            : [...current, member.id];
                                        updateFilter(filter.id, { value: newValue });
                                    }}
                                    className={clsx(
                                        "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border transition-colors",
                                        isSelected
                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <img src={member.avatar} alt="" className="w-4 h-4 rounded-full" />
                                    <span>{member.name.split(' ')[0]}</span>
                                </button>
                            );
                        })}
                    </div>
                );
            case 'dueDate':
                if (filter.operator === 'before' || filter.operator === 'after') {
                    return (
                        <input
                            type="date"
                            value={filter.value || ''}
                            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                            className="flex-1 h-7 text-sm bg-white border border-gray-200 rounded px-2 focus:border-blue-500 focus:outline-none mt-1 w-full"
                        />
                    );
                }
                if (filter.operator === 'between') {
                    return (
                        <div className="flex items-center gap-2 mt-1">
                            <input
                                type="date"
                                value={filter.value?.start || ''}
                                onChange={(e) => updateFilter(filter.id, { value: { ...filter.value, start: e.target.value } })}
                                className="flex-1 h-7 text-sm bg-white border border-gray-200 rounded px-2 focus:border-blue-500 focus:outline-none"
                            />
                            <span className="text-gray-500 text-xs">e</span>
                            <input
                                type="date"
                                value={filter.value?.end || ''}
                                onChange={(e) => updateFilter(filter.id, { value: { ...filter.value, end: e.target.value } })}
                                className="flex-1 h-7 text-sm bg-white border border-gray-200 rounded px-2 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    );
                }

                return (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {['overdue', 'today', 'week', 'nodate'].map(option => {
                            const labels: Record<string, string> = {
                                overdue: 'Atrasado',
                                today: 'Hoje',
                                week: 'Esta Semana',
                                nodate: 'Sem Data'
                            };
                            const isSelected = filter.value === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => updateFilter(filter.id, { value: option })}
                                    className={clsx(
                                        "px-2 py-0.5 rounded text-xs border transition-colors",
                                        isSelected
                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    {labels[option]}
                                </button>
                            );
                        })}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-[100] flex flex-col max-h-[80vh]">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Filtros</span>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="p-2 overflow-y-auto min-h-[100px] flex flex-col gap-2">
                {filters.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm">
                        Nenhum filtro ativo
                    </div>
                )}

                {filters.map((filter) => (
                    <div key={filter.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200 group">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-500 uppercase w-12 shrink-0">Onde</span>

                            {/* Field Select */}
                            <select
                                value={filter.field}
                                onChange={(e) => updateFilter(filter.id, { field: e.target.value as any })}
                                className="flex-1 h-7 text-sm bg-white border border-gray-200 rounded px-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="tag">Etiqueta</option>
                                <option value="priority">Prioridade</option>
                                <option value="member">Membro</option>
                                <option value="dueDate">Data</option>
                            </select>

                            {/* Operator Select */}
                            <select
                                value={filter.operator}
                                onChange={(e) => updateFilter(filter.id, { operator: e.target.value as any })}
                                className="w-24 h-7 text-sm bg-white border border-gray-200 rounded px-2 focus:border-blue-500 focus:outline-none"
                            >
                                <option value="is">é</option>
                                <option value="is_not">não é</option>
                                <option value="set">está definido</option>
                                <option value="not_set">não definido</option>
                                {filter.field === 'dueDate' && (
                                    <>
                                        <option value="before">antes de</option>
                                        <option value="after">depois de</option>
                                        <option value="between">entre</option>
                                    </>
                                )}
                            </select>

                            <button
                                onClick={() => removeFilter(filter.id)}
                                className="ml-auto p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Value Input Area */}
                        {((filter.operator === 'is' || filter.operator === 'is_not' || filter.operator === 'before' || filter.operator === 'after' || filter.operator === 'between')) && (
                            <div className="pl-14">
                                {renderValueInput(filter)}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between">
                <button
                    onClick={addFilter}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Filtro</span>
                </button>

                {filters.length > 0 && (
                    <button
                        onClick={() => setFilters([])}
                        className="text-xs text-gray-500 hover:text-red-600 px-3 py-1.5"
                    >
                        Limpar todos
                    </button>
                )}
            </div>

            {/* Close Overlay */}
            <div className="fixed inset-0 z-[-1]" onClick={onClose} />
        </div>
    );
}
