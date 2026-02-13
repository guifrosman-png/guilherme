
import React, { useState } from 'react';
import { usePermissions } from '../contexts/PermissionsContext';
import { useReportsPermissions } from '../components/ReportsV2/contexts/ReportsPermissionsContext';
import { useViewMode } from '../contexts/ViewModeContext';
import {
    Settings,
    FileText,
    X,
    Search,
    Filter,
    LayoutGrid,
    Plus,
    Maximize2,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Inbox,
    Calendar,
    Clock,
    Sun,
    Sunset,
    Moon,
    List,
    Columns,
    Receipt,
    Package,
    FileBarChart,
    CreditCard,
    ChevronRight,
    History,
    PanelLeft
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PermissionsPanel({ activeTab = 'dashboard' }: { activeTab?: 'dashboard' | 'sales' | 'closing' }) {
    const { isOwnerView } = useViewMode();
    const { togglePermission, getPermission } = usePermissions();
    const [isOpen, setIsOpen] = useState(false);

    // Estados para controlar os accordions da aba Vendas
    const [salesAccordions, setSalesAccordions] = useState({
        inbox: false,
        list: false,
        details: false
    });

    // Estados para controlar os accordions da aba Fechamento (Relatórios)
    const { permissions: reportPerms, updatePermission, toggleYearVisibility, toggleMonthVisibility } = useReportsPermissions();
    const [reportsAccordions, setReportsAccordions] = useState({
        inbox: false,
        kpis: false,
        calculation: false,
        docs: false,
        history: false
    });
    const [reportsExpandedYears, setReportsExpandedYears] = useState<number[]>([]); // Controla quais anos estão expandidos na config

    const toggleReportsAccordion = (key: keyof typeof reportsAccordions) => {
        setReportsAccordions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleReportsYear = (year: number) => {
        setReportsExpandedYears(prev =>
            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
        );
    };

    // Se não estiver no modo dono, nem renderiza
    if (!isOwnerView) return null;

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-slate-800 transition-all hover:scale-105 border border-slate-700"
            >
                <Settings className="w-5 h-5 animate-spin-slow" />
                <span className="font-semibold text-sm">Configurar</span>
            </button>
        );
    }

    const PermissionItem = ({ id, label, icon: Icon, description }: { id: string, label: string, icon?: any, description?: string }) => {
        const isAllowed = getPermission(id);
        return (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className={`p-1.5 rounded-lg ${isAllowed ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Icon className="w-3.5 h-3.5" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className={`text-sm font-medium ${isAllowed ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
                        {description && <span className="text-[10px] text-slate-400">{description}</span>}
                    </div>
                </div>
                <Switch
                    checked={isAllowed}
                    onCheckedChange={() => togglePermission(id)}
                    className="data-[state=checked]:bg-blue-600"
                />
            </div>
        );
    };

    const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <div className="flex items-center gap-2 px-1 mb-3 mt-6">
            <Icon className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</span>
        </div>
    );

    // Componente Accordion para a aba de Vendas
    const AccordionSection = ({
        id: _id, // unused but kept for interface consistency
        title,
        icon: Icon,
        isOpen: isAccordionOpen,
        onToggle,
        children,
        count
    }: {
        id: string,
        title: string,
        icon: any,
        isOpen: boolean,
        onToggle: () => void,
        children: React.ReactNode,
        count?: number
    }) => (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                        <span className="text-sm font-semibold text-slate-800">{title}</span>
                        {count !== undefined && (
                            <span className="ml-2 text-xs text-slate-400">({count} itens)</span>
                        )}
                    </div>
                </div>
                {isAccordionOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
            </button>
            {isAccordionOpen && (
                <div className="px-4 pb-4 pt-2 space-y-2 border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );

    const toggleAccordion = (key: keyof typeof salesAccordions) => {
        setSalesAccordions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Helper específico para Relatórios (usa contexto diferente)
    const ReportPermissionItem = ({
        label,
        checked,
        onChange,
        helpText,
        icon: Icon
    }: {
        label: string,
        checked: boolean,
        onChange: (c: boolean) => void,
        helpText?: string,
        icon?: any
    }) => (
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm hover:border-slate-300 transition-all">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className={`p-1.5 rounded-lg ${checked ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon className="w-3.5 h-3.5" />
                    </div>
                )}
                <div className="flex flex-col">
                    <span className={`text-sm font-medium ${checked ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
                    {helpText && <span className="text-[10px] text-slate-400">{helpText}</span>}
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} className="data-[state=checked]:bg-blue-600" />
        </div>
    );

    return (
        // Sidebar Full-Height (Drawer) à direita
        <div className="fixed inset-y-0 right-0 w-[340px] z-[100] bg-white shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-300 pointer-events-auto flex flex-col">

            {/* Header */}
            <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        Configurações
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Personalize a visão do Síndico.</p>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden bg-white">
                <Tabs defaultValue={activeTab} className="h-full flex flex-col">
                    <div className="px-6 pt-6 shrink-0">
                        <TabsList className="w-full bg-slate-100/80 p-1 rounded-xl">
                            <TabsTrigger value="dashboard" className="flex-1 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 text-slate-500">Dashboard</TabsTrigger>
                            <TabsTrigger value="sales" className="flex-1 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 text-slate-500">Vendas</TabsTrigger>
                            <TabsTrigger value="closing" className="flex-1 text-xs font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 text-slate-500">Fechamento</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-6 py-2">
                        {/* --- DASHBOARD TAB --- */}
                        <TabsContent value="dashboard" className="space-y-1 pb-10 mt-4">

                            <SectionHeader title="Visibilidade" icon={Eye} />
                            <div className="space-y-3">
                                <PermissionItem
                                    id="dashboard.search"
                                    label="Busca de Métricas"
                                    icon={Search}
                                />
                                <PermissionItem
                                    id="dashboard.filters"
                                    label="Filtros"
                                    icon={Filter}
                                />
                                <PermissionItem
                                    id="dashboard.layout_controls"
                                    label="Opções de Visualização"
                                    icon={LayoutGrid}
                                />
                                <PermissionItem
                                    id="dashboard.add_card"
                                    label="Botão Adicionar Card"
                                    icon={Plus}
                                />
                            </div>

                            <SectionHeader title="Permissões de Ação" icon={Maximize2} />
                            <div className="space-y-3">
                                <PermissionItem
                                    id="dashboard.actions.add_card"
                                    label="Criar Novos Cards"
                                    icon={Plus}
                                />
                                <PermissionItem
                                    id="dashboard.actions.move_card"
                                    label="Mover e Reorganizar"
                                    icon={LayoutGrid}
                                />
                                <PermissionItem
                                    id="dashboard.actions.resize_card"
                                    label="Redimensionar Cards"
                                    icon={Maximize2}
                                />
                                <PermissionItem
                                    id="dashboard.actions.edit_card"
                                    label="Editar e Remover"
                                    icon={Settings}
                                />
                                <PermissionItem
                                    id="dashboard.actions.explore"
                                    label="Explorar Dados"
                                    icon={Search}
                                />
                            </div>
                        </TabsContent>

                        {/* --- SALES TAB --- */}
                        <TabsContent value="sales" className="space-y-4 pb-10 mt-4">

                            {/* Accordion 1: Caixa de Entrada (Inbox) */}
                            <AccordionSection
                                id="inbox"
                                title="Caixa de Entrada"
                                icon={Inbox}
                                isOpen={salesAccordions.inbox}
                                onToggle={() => toggleAccordion('inbox')}
                                count={8}
                            >
                                <p className="text-[10px] text-slate-400 mb-3">Controle quais filtros aparecem na sidebar de vendas.</p>
                                <PermissionItem id="sales.inbox.visible" label="Mostrar Caixa de Entrada" icon={LayoutGrid} description="Oculta todo o painel lateral" />
                                <div className="h-px bg-slate-100 my-2" />
                                <PermissionItem id="sales.filters.todas" label="Todas as Vendas" icon={Inbox} />
                                <PermissionItem id="sales.filters.hoje" label="Vendas de Hoje" icon={Calendar} />
                                <PermissionItem id="sales.filters.ontem" label="Vendas de Ontem" icon={Clock} />
                                <PermissionItem id="sales.filters.este mes" label="Este Mês" icon={Calendar} />
                                <PermissionItem id="sales.filters.shift-manha" label="Caixa da Manhã" icon={Sun} />
                                <PermissionItem id="sales.filters.shift-tarde" label="Caixa da Tarde" icon={Sunset} />
                                <PermissionItem id="sales.filters.shift-noite" label="Caixa da Noite" icon={Moon} />
                            </AccordionSection>

                            {/* Accordion 2: Lista de Vendas */}
                            <AccordionSection
                                id="list"
                                title="Lista de Vendas"
                                icon={List}
                                isOpen={salesAccordions.list}
                                onToggle={() => toggleAccordion('list')}
                                count={4}
                            >
                                <p className="text-[10px] text-slate-400 mb-3">Controle os elementos da tabela de vendas.</p>
                                <PermissionItem id="sales.kpis.revenue" label="KPI: Faturamento" icon={FileBarChart} />
                                <PermissionItem id="sales.kpis.quantity" label="KPI: Quantidade" icon={Package} />
                                <PermissionItem id="sales.search" label="Barra de Busca" icon={Search} />
                                <PermissionItem id="sales.list.manage_columns" label="Gerenciar Colunas" icon={Columns} description="Permite adicionar/remover colunas" />
                            </AccordionSection>

                            {/* Accordion 3: Detalhes da Venda */}
                            <AccordionSection
                                id="details"
                                title="Detalhes da Venda"
                                icon={Receipt}
                                isOpen={salesAccordions.details}
                                onToggle={() => toggleAccordion('details')}
                                count={5}
                            >
                                <p className="text-[10px] text-slate-400 mb-3">Controle o que aparece ao abrir uma venda.</p>
                                <PermissionItem id="sales.details.view" label="Permitir Ver Detalhes" icon={Eye} />
                                <div className="h-px bg-slate-100 my-2" />
                                <PermissionItem id="sales.details.summary" label="Resumo Financeiro" icon={CreditCard} />
                                <PermissionItem id="sales.details.items" label="Lista de Itens" icon={Package} />
                                <div className="h-px bg-slate-100 my-2" />
                                <PermissionItem id="sales.details.view_list" label="Visualização em Lista" icon={List} />
                                <PermissionItem id="sales.details.view_card" label="Visualização em Cards" icon={LayoutGrid} />
                            </AccordionSection>

                        </TabsContent>

                        {/* --- CLOSING TAB --- */}
                        <TabsContent value="closing" className="space-y-4 pb-10 mt-4">

                            {/* 1. INBOX (Sidebar) */}
                            <AccordionSection
                                id="rep_inbox"
                                title="Navegação (Inbox)"
                                icon={Inbox}
                                isOpen={reportsAccordions.inbox}
                                onToggle={() => toggleReportsAccordion('inbox')}
                            >
                                <ReportPermissionItem
                                    label="Exibir Sidebar"
                                    icon={PanelLeft}
                                    checked={reportPerms.inbox.showSidebarMaster ?? true}
                                    onChange={(c) => updatePermission('inbox.showSidebarMaster', c)}
                                    helpText="Mostra ou oculta toda a barra lateral de navegação"
                                />
                                <div className="h-px bg-slate-100 my-2" />

                                <div className={!(reportPerms.inbox.showSidebarMaster ?? true) ? "opacity-50 pointer-events-none" : ""}>
                                    <ReportPermissionItem
                                        label="Extrato Atual"
                                        icon={Calendar}
                                        checked={reportPerms.inbox.showCurrentExtract}
                                        onChange={(c) => updatePermission('inbox.showCurrentExtract', c)}
                                    />
                                    <ReportPermissionItem
                                        label="Histórico Completo"
                                        icon={History}
                                        checked={reportPerms.inbox.showHistoryButton}
                                        onChange={(c) => updatePermission('inbox.showHistoryButton', c)}
                                    />

                                    <div className="h-px bg-slate-100 my-2" />
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Anos e Meses</p>

                                    {Object.keys(reportPerms.inbox.years).map(y => {
                                        const year = Number(y);
                                        const isExpanded = reportsExpandedYears.includes(year);
                                        return (
                                            <div key={year} className={`border rounded-lg overflow-hidden mb-2 transition-all ${isExpanded ? 'border-blue-200 ring-1 ring-blue-100' : 'border-slate-100'}`}>
                                                <div className="flex items-center justify-between p-3 bg-slate-50/80 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => toggleReportsYear(year)}>
                                                    <button
                                                        className="flex items-center gap-2 text-sm font-bold text-slate-700 pointer-events-none"
                                                    >
                                                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                                        {year}
                                                    </button>

                                                    <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                                                        <span className={`text-[10px] uppercase font-bold tracking-wider transition-colors ${reportPerms.inbox.years[year].visible !== false ? 'text-blue-600' : 'text-slate-400'}`}>
                                                            {reportPerms.inbox.years[year].visible !== false ? 'Visível' : 'Oculto'}
                                                        </span>
                                                        <button
                                                            onClick={() => toggleYearVisibility(year)}
                                                            className={`p-1.5 rounded-md transition-all shadow-sm active:scale-95 ${reportPerms.inbox.years[year].visible !== false
                                                                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 ring-1 ring-blue-200'
                                                                    : 'bg-slate-200 text-slate-400 hover:bg-slate-300 ring-1 ring-slate-300'
                                                                }`}
                                                            title={reportPerms.inbox.years[year].visible !== false ? "Ocultar Ano Inteiro" : "Mostrar Ano Inteiro"}
                                                        >
                                                            {reportPerms.inbox.years[year].visible !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="p-2 grid grid-cols-3 gap-2 bg-white border-t border-slate-50">
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                                                            const isVisible = reportPerms.inbox.years[year].months[m] ?? true;
                                                            const monthName = new Date(2000, m - 1, 1).toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
                                                            return (
                                                                <button
                                                                    key={m}
                                                                    onClick={() => toggleMonthVisibility(year, m)}
                                                                    className={`text-[10px] py-1 rounded border flex items-center justify-center gap-1 transition-all ${isVisible
                                                                        ? 'bg-blue-50 border-blue-100 text-blue-700'
                                                                        : 'bg-slate-50 border-slate-100 text-slate-300 decoration-slate-400 line-through grayscale'
                                                                        }`}
                                                                >
                                                                    {monthName}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </AccordionSection>

                            {/* 2. FECHAMENTO (Detalhes) */}
                            <AccordionSection
                                id="rep_kpis"
                                title="KPIs e Topo"
                                icon={LayoutGrid}
                                isOpen={reportsAccordions.kpis}
                                onToggle={() => toggleReportsAccordion('kpis')}
                            >
                                <ReportPermissionItem label="Vendas Brutas" icon={Package} checked={reportPerms.statement.kpis.grossSales} onChange={(c) => updatePermission('statement.kpis.grossSales', c)} />
                                <ReportPermissionItem label="Taxa Contrato" icon={FileText} checked={reportPerms.statement.kpis.contractRate} onChange={(c) => updatePermission('statement.kpis.contractRate', c)} />
                                <ReportPermissionItem label="Valor a Receber" icon={CreditCard} checked={reportPerms.statement.kpis.netValue} onChange={(c) => updatePermission('statement.kpis.netValue', c)} />
                            </AccordionSection>

                            <AccordionSection
                                id="rep_calc"
                                title="Lista de Cálculo"
                                icon={List}
                                isOpen={reportsAccordions.calculation}
                                onToggle={() => toggleReportsAccordion('calculation')}
                            >
                                <ReportPermissionItem label="(+) Vendas Totais" checked={reportPerms.statement.calculation.totalSales} onChange={(c) => updatePermission('statement.calculation.totalSales', c)} />
                                <ReportPermissionItem label="Detalhamento (Créd/Déb)" checked={reportPerms.statement.calculation.details} onChange={(c) => updatePermission('statement.calculation.details', c)} />
                                <ReportPermissionItem label="(-) Estornos" checked={reportPerms.statement.calculation.cancellations} onChange={(c) => updatePermission('statement.calculation.cancellations', c)} />
                                <ReportPermissionItem label="(=) Base de Cálculo" checked={reportPerms.statement.calculation.baseCalculation} onChange={(c) => updatePermission('statement.calculation.baseCalculation', c)} />
                                <ReportPermissionItem label="(x) Alíquota" checked={reportPerms.statement.calculation.contractRateLine} onChange={(c) => updatePermission('statement.calculation.contractRateLine', c)} />
                                <ReportPermissionItem label="(=) Repasse Final" checked={reportPerms.statement.calculation.finalRepasse} onChange={(c) => updatePermission('statement.calculation.finalRepasse', c)} />
                            </AccordionSection>

                            <AccordionSection
                                id="rep_docs"
                                title="Documentos"
                                icon={FileText}
                                isOpen={reportsAccordions.docs}
                                onToggle={() => toggleReportsAccordion('docs')}
                            >
                                <ReportPermissionItem label="Botão 'Baixar PDF'" checked={reportPerms.statement.docs.reportPdf} onChange={(c) => updatePermission('statement.docs.reportPdf', c)} />
                                <ReportPermissionItem label="Botão 'Comprovante'" checked={reportPerms.statement.docs.proof} onChange={(c) => updatePermission('statement.docs.proof', c)} />
                            </AccordionSection>

                            {/* 3. HISTÓRICO (Colunas) */}
                            <AccordionSection
                                id="rep_hist"
                                title="Colunas do Histórico"
                                icon={Columns}
                                isOpen={reportsAccordions.history}
                                onToggle={() => toggleReportsAccordion('history')}
                            >
                                <ReportPermissionItem label="Mês/Ano" checked={reportPerms.history.columns.titleMonth} onChange={(c) => updatePermission('history.columns.titleMonth', c)} />
                                <ReportPermissionItem label="Proprietário" checked={reportPerms.history.columns.owner} onChange={(c) => updatePermission('history.columns.owner', c)} />
                                <ReportPermissionItem label="Status" checked={reportPerms.history.columns.status} onChange={(c) => updatePermission('history.columns.status', c)} />
                                <ReportPermissionItem label="Atualização" checked={reportPerms.history.columns.updatedAt} onChange={(c) => updatePermission('history.columns.updatedAt', c)} />
                                <ReportPermissionItem label="Criado em" checked={reportPerms.history.columns.createdAt} onChange={(c) => updatePermission('history.columns.createdAt', c)} />
                            </AccordionSection>

                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </div>
        </div >
    );
}

