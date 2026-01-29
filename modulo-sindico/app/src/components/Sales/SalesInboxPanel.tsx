
import React from 'react';
import {
    Inbox,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { clsx as cn } from 'clsx';

interface SalesInboxPanelProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export function SalesInboxPanel({
    activeFilter,
    onFilterChange,
    collapsed,
    onToggleCollapse
}: SalesInboxPanelProps) {

    // Menu simplificado
    const menuItems = [
        { id: 'todas', label: 'Todas as Vendas', icon: Inbox, count: 156 },
        { id: 'hoje', label: 'Vendas de Hoje', icon: Calendar, count: 42, color: 'text-[#525a52]' },
    ];

    const agentItems = [
        { id: 'agent-1', label: 'Caixa Manhã', count: 45 },
        { id: 'agent-2', label: 'Caixa Tarde', count: 32 },
        { id: 'agent-3', label: 'Caixa Noite', count: 79 },
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

                {menuItems.map((item) => (
                    <Button
                        key={item.id}
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
                ))}

                {/* Botão Flutuante Collapsed */}
                <div className="mt-auto pb-2">
                    <Button
                        size="icon"
                        className="h-10 w-10 rounded-full bg-[#525a52] hover:bg-[#525a52]/90 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white rounded-2xl border border-gray-200 flex flex-col transition-all duration-300 w-full overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">VENDAS</h2>
                <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8 hover:bg-[#525a52]/10">
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                </Button>
            </div>

            {/* Lista com Scroll */}
            <ScrollArea className="flex-1 pb-16"> {/* pb-16 para dar espaço ao botão flutuante */}
                <div className="p-3 space-y-6">

                    {/* Menu Principal */}
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onFilterChange(item.id)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                                    activeFilter === item.id
                                        ? "bg-[#525a52]/10 text-[#525a52]"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("h-4 w-4", activeFilter === item.id ? "text-[#525a52]" : (item.color || "text-gray-400"))} />
                                    <span>{item.label}</span>
                                </div>
                                {item.count > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "h-5 min-w-[20px] px-1.5 flex items-center justify-center text-[10px]",
                                            activeFilter === item.id ? "bg-white text-[#525a52] shadow-sm" : "bg-gray-100 text-gray-500"
                                        )}
                                    >
                                        {item.count}
                                    </Badge>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Seção Agentes / Caixas */}
                    <div>
                        <div className="px-3 mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Turnos / Caixas
                            </span>
                        </div>
                        <div className="space-y-1">
                            {agentItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onFilterChange(item.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors",
                                        activeFilter === item.id
                                            ? "bg-[#525a52]/10 text-[#525a52] font-medium"
                                            : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400">#</span>
                                        <span>{item.label}</span>
                                    </div>
                                    {item.count > 0 && (
                                        <span className="text-xs text-gray-400">{item.count}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </ScrollArea>

            {/* Botão Flutuante de Adicionar */}
            <div className="absolute bottom-4 left-4">
                <Button
                    className="h-12 w-12 rounded-full bg-[#525a52] hover:bg-[#525a52]/90 text-white shadow-xl border-2 border-white transition-transform hover:scale-105 active:scale-95 flex items-center justify-center p-0"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </div>
        </div>
    );
}
