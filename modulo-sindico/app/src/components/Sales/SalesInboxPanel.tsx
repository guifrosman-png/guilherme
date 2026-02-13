
import React from 'react';
import {
    Inbox,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
    History,
    CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { clsx as cn } from 'clsx';
import { ManagedFeature } from '../ManagedFeature';

interface SalesInboxPanelProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
    counts?: {
        todas?: number;
        hoje?: number;
        ontem?: number;
        mes?: number;
        manha?: number;
        tarde?: number;
        noite?: number;
    };
}

export function SalesInboxPanel({
    activeFilter,
    onFilterChange,
    collapsed,
    onToggleCollapse,
    counts = {}
}: SalesInboxPanelProps) {

    // Menu consolidado - períodos e turnos
    const periodItems = [
        { id: 'todas', label: 'Todas as Vendas', icon: Inbox, count: counts.todas || 0 },
        { id: 'hoje', label: 'Vendas de Hoje', icon: Calendar, count: counts.hoje || 0, color: 'text-blue-500' },
        { id: 'ontem', label: 'Vendas de Ontem', icon: History, count: counts.ontem || 0, color: 'text-amber-500' },
        { id: 'este mes', label: 'Este Mês', icon: CalendarDays, count: counts.mes || 0, color: 'text-purple-500' },
    ];

    const shiftItems = [
        { id: 'shift-manha', label: 'Caixa Manhã', count: counts.manha || 0 },
        { id: 'shift-tarde', label: 'Caixa Tarde', count: counts.tarde || 0 },
        { id: 'shift-noite', label: 'Caixa Noite', count: counts.noite || 0 },
    ];

    if (collapsed) {
        return (
            <div className="h-full bg-white rounded-2xl border border-gray-200 flex flex-col items-center py-4 gap-4 transition-all duration-300 w-16 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleCollapse}
                    className="mb-2 hover:bg-[#525a52]/10"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {periodItems.map((item) => (
                    <ManagedFeature key={item.id} id={`sales.filters.${item.id}`} label={item.label}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onFilterChange(item.id)}
                            title={item.label}
                            className={cn(
                                "rounded-xl hover:bg-[#525a52]/5",
                                activeFilter === item.id && "bg-[#525a52]/10 text-[#525a52]"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", activeFilter === item.id ? "text-[#525a52]" : item.color)} />
                        </Button>
                    </ManagedFeature>
                ))}

                {/* Botão Flutuante Collapsed */}
                <div className="mt-auto pb-2">
                    <ManagedFeature id="sales.add_button" label="Botão Adicionar">
                        <Button
                            size="icon"
                            className="h-10 w-10 rounded-full bg-[#525a52] hover:bg-[#525a52]/90 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </ManagedFeature>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white rounded-2xl border border-gray-200 flex flex-col transition-all duration-300 w-full overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/10">
                <h2 className="font-bold text-gray-900 tracking-tight text-lg">INBOX</h2>
                <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8 hover:bg-[#525a52]/10">
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                </Button>
            </div>

            {/* Lista com Scroll */}
            <ScrollArea className="flex-1 pb-16">
                <div className="p-3 space-y-6">

                    {/* Menu Períodos */}
                    <div className="space-y-1">
                        {periodItems.map((item) => (
                            <ManagedFeature key={item.id} id={`sales.filters.${item.id}`} label={item.label}>
                                <button
                                    onClick={() => onFilterChange(item.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
                                        activeFilter === item.id
                                            ? "bg-[#525a52]/10 text-[#525a52] font-semibold"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={cn("h-4 w-4", activeFilter === item.id ? "text-[#525a52]" : (item.color || "text-gray-600"))} />
                                        <span>{item.label}</span>
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium",
                                        activeFilter === item.id ? "text-[#525a52]" : "text-gray-700"
                                    )}>
                                        {item.count}
                                    </span>
                                </button>
                            </ManagedFeature>
                        ))}
                    </div>

                    {/* Seção Agentes / Caixas */}
                    <div>
                        <div className="px-3 mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                                TURNOS / CAIXAS
                            </span>
                        </div>
                        <div className="space-y-1">
                            {shiftItems.map((item) => (
                                <ManagedFeature key={item.id} id={`sales.filters.${item.id}`} label={item.label}>
                                    <button
                                        onClick={() => onFilterChange(item.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
                                            activeFilter === item.id
                                                ? "bg-[#525a52]/10 text-[#525a52] font-semibold shadow-sm"
                                                : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={cn(
                                                "text-xs font-bold",
                                                activeFilter === item.id ? "text-[#525a52]" : "text-gray-300"
                                            )}>#</span>
                                            <span>{item.label}</span>
                                        </div>
                                        <span className={cn(
                                            "text-xs font-medium",
                                            activeFilter === item.id ? "text-[#525a52]" : "text-gray-700"
                                        )}>
                                            {item.count}
                                        </span>
                                    </button>
                                </ManagedFeature>
                            ))}
                        </div>
                    </div>

                </div>
            </ScrollArea>

            {/* Botão Flutuante de Adicionar */}
            <ManagedFeature id="sales.add_button" label="Botão Adicionar">
                <Button
                    className="absolute bottom-4 left-4 z-20 h-12 w-12 rounded-full bg-[#525a52] hover:bg-[#525a52]/90 text-white shadow-lg border-2 border-white transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center p-0"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </ManagedFeature>
        </div>
    );
}

