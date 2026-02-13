
import { useState } from 'react';
import { ChevronLeft, ChevronRight, File, Calendar, List, ChevronDown, ChevronUp, History } from 'lucide-react';
import { clsx } from 'clsx';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useReportsPermissions } from './contexts/ReportsPermissionsContext'; // Importe Contexto

interface ReportsSidebarProps {
    activeItem: string;
    onItemClick: (id: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

// Helper para gerar meses dinamicamente
const generateMonths = () => {
    const today = new Date();
    const months = [];
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11

    // Gerar últimos 24 meses
    for (let i = 0; i < 24; i++) {
        const d = new Date(currentYear, currentMonth - i, 1);
        months.push({
            id: `report-${d.getMonth() + 1}-${d.getFullYear()}`, // ex: report-2-2026
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            monthName: d.toLocaleString('pt-BR', { month: 'long' }),
            monthShort: d.toLocaleString('pt-BR', { month: 'short' }).toUpperCase(),
        });
    }

    // Agrupar por ano
    const grouped = months.reduce((acc, curr) => {
        if (!acc[curr.year]) acc[curr.year] = [];
        acc[curr.year].push(curr);
        return acc;
    }, {} as Record<number, typeof months>);

    // Ordenar anos (decrescente)
    const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

    return { grouped, years };
};

export function ReportsSidebar({ activeItem, onItemClick, collapsed, onToggleCollapse }: ReportsSidebarProps) {
    const { grouped, years } = generateMonths();
    // Acesse as permissões
    const { permissions } = useReportsPermissions();

    const [expandedYears, setExpandedYears] = useState<number[]>([]);

    const toggleYear = (year: number) => {
        setExpandedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
        );
    };

    return (
        <div className={clsx("flex flex-col bg-white border border-gray-200 rounded-2xl transition-all duration-300 overflow-hidden h-full z-20 shadow-sm", collapsed ? "w-16" : "w-72")}>

            {/* Header da Sidebar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
                {!collapsed && (
                    <span className="font-bold text-gray-800 flex items-center gap-2">
                        <List className="w-5 h-5 text-gray-500" />
                        INBOX
                    </span>
                )}
                <button onClick={onToggleCollapse} className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">

                    {/* SEÇÃO 1: Atalhos Principais - CONTROLADOS POR PERMISSÃO */}
                    <div className="space-y-1">

                        {/* Extrato Atual */}
                        {permissions.inbox.showCurrentExtract && (
                            <Button
                                variant="ghost"
                                className={clsx(
                                    "w-full justify-start gap-3 h-10 text-sm transition-all",
                                    activeItem === 'current-month'
                                        ? "bg-gray-100 text-gray-900 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                                )}
                                onClick={() => onItemClick('current-month')}
                                title={collapsed ? "Extrato Atual" : undefined}
                            >
                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                {!collapsed && <span>Extrato Atual</span>}
                            </Button>
                        )}

                        {/* Histórico Completo */}
                        {permissions.inbox.showHistoryButton && (
                            <Button
                                variant="ghost"
                                className={clsx(
                                    "w-full justify-start gap-3 h-10 text-sm transition-all",
                                    activeItem === 'history'
                                        ? "bg-gray-100 text-gray-900 font-semibold"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                                )}
                                onClick={() => onItemClick('history')}
                                title={collapsed ? "Histórico Completo" : undefined}
                            >
                                <History className="h-4 w-4 flex-shrink-0" />
                                {!collapsed && <span>Histórico Completo</span>}
                            </Button>
                        )}
                    </div>

                    {!collapsed && <div className="h-px bg-gray-100 w-full my-2" />}

                    {/* SEÇÃO 2: Dropdowns de Anos - CONTROLADOS POR PERMISSÃO */}
                    <div className="space-y-3">
                        {years
                            // Filtra anos se visibilidade for false
                            .filter(year => permissions.inbox.years[year]?.visible !== false)
                            .map(year => (
                                <div key={year} className="border border-gray-100 rounded-lg overflow-hidden">
                                    {/* Header do Ano (Accordion) */}
                                    <button
                                        onClick={() => !collapsed && toggleYear(year)}
                                        className={clsx(
                                            "w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700",
                                            collapsed && "justify-center"
                                        )}
                                        title={collapsed ? `${year}` : undefined}
                                    >
                                        <span className={clsx(collapsed && "text-xs font-bold")}>{year} Fechamentos</span>
                                        {!collapsed && (
                                            expandedYears.includes(year) ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />
                                        )}
                                    </button>

                                    {/* Lista de Meses */}
                                    {(!collapsed && expandedYears.includes(year)) && (
                                        <div className="bg-white divide-y divide-gray-50 border-t border-gray-100">
                                            {grouped[year]
                                                // Filtra meses se visibilidade for false
                                                .filter(m => permissions.inbox.years[year]?.months?.[m.month] !== false)
                                                .map(m => (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => onItemClick(m.id)}
                                                        className={clsx(
                                                            "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors group",
                                                            activeItem === m.id
                                                                ? "bg-blue-50 text-blue-700 font-medium"
                                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-8 text-[10px] font-bold text-gray-400 uppercase group-hover:text-gray-500">{m.monthShort}</span>
                                                            <span className="capitalize">{m.monthName}</span>
                                                        </div>
                                                        {activeItem === m.id && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>

                </div>
            </ScrollArea>
        </div>
    );
}
