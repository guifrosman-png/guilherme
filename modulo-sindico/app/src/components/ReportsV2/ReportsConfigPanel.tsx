
import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReportsPermissions } from './contexts/ReportsPermissionsContext';

// Helper para Seção Expansível
const ConfigSection = ({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-3">
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
        >
            <span>{title}</span>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {isOpen && <div className="p-4 border-t border-gray-100 space-y-3">{children}</div>}
    </div>
);

// Helper para Item de Configuração (Label + Switch)
const ConfigItem = ({ label, checked, onChange, helpText }: { label: string, checked: boolean, onChange: (checked: boolean) => void, helpText?: string }) => (
    <div className="flex items-center justify-between py-1">
        <div className="flex-1 pr-4">
            <span className="text-sm font-medium text-gray-800 block">{label}</span>
            {helpText && <span className="text-xs text-gray-400 block mt-0.5">{helpText}</span>}
        </div>
        <Switch checked={checked} onCheckedChange={onChange} />
    </div>
);

export function ReportsConfigPanel() {
    const { permissions, updatePermission, toggleYearVisibility, toggleMonthVisibility } = useReportsPermissions();
    const [panelOpen, setPanelOpen] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        inbox: true,
        years: false,
        details: false,
        history: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Gera lista de anos/meses dinamicamente para configuração (baseado na lógica da sidebar, duplicada aqui para config)
    const generateConfigYears = () => {
        const today = new Date();
        const years = [today.getFullYear(), today.getFullYear() - 1]; // Ex: 2026, 2025
        return years;
    };

    const configYears = generateConfigYears();

    if (!panelOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg bg-white hover:bg-gray-50 border-gray-200"
                    onClick={() => setPanelOpen(true)}
                    title="Configurar Relatórios"
                >
                    <Settings className="h-6 w-6 text-gray-600" />
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 flex flex-col font-sans animate-in slide-in-from-bottom duration-300">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 backdrop-blur-sm sticky top-0">
                    <div>
                        <h3 className="font-bold text-gray-900">Configuração da Aba</h3>
                        <p className="text-xs text-gray-500">Controle o que o síndico pode ver.</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setPanelOpen(false)}>Fechar</Button>
                </div>

                {/* Content Scrollable */}
                <ScrollArea className="flex-1 p-5 bg-gray-50/30">

                    {/* 1. SEÇÃO INBOX */}
                    <ConfigSection
                        title="1. INBOX (Sidebar)"
                        isOpen={openSections.inbox}
                        onToggle={() => toggleSection('inbox')}
                    >
                        <ConfigItem
                            label="Ocultar 'Extrato Atual'"
                            checked={!permissions.inbox.showCurrentExtract}
                            onChange={(chk) => updatePermission('inbox.showCurrentExtract', !chk)}
                            helpText="Remove o botão de atalho do mês corrente."
                        />
                        <ConfigItem
                            label="Ocultar 'Histórico Completo'"
                            checked={!permissions.inbox.showHistoryButton}
                            onChange={(chk) => updatePermission('inbox.showHistoryButton', !chk)}
                            helpText="Remove o botão que leva para a lista completa."
                        />

                        {/* Sub-seção Anos */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                                className="flex items-center gap-2 text-sm font-semibold text-gray-600 mb-3 hover:text-gray-900"
                                onClick={() => toggleSection('years')}
                            >
                                {openSections.years ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                Configurar Anos e Meses
                            </button>

                            {openSections.years && (
                                <div className="space-y-4 pl-4 border-l-2 border-gray-100 ml-1">
                                    {configYears.map(year => (
                                        <div key={year} className="space-y-2">
                                            <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-100">
                                                <span className="text-sm font-bold text-gray-700">{year} (Ano Todo)</span>
                                                <Switch
                                                    checked={!(permissions.inbox.years[year]?.visible === false)} // Se false, está oculto
                                                    onCheckedChange={() => toggleYearVisibility(year)}
                                                />
                                            </div>

                                            {/* Lista de Meses do Ano (Exemplo Jan a Dez) */}
                                            {(permissions.inbox.years[year]?.visible !== false) && (
                                                <div className="grid grid-cols-2 gap-2 pl-2">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                                                        const monthName = new Date(2000, m - 1, 1).toLocaleString('pt-BR', { month: 'short' });
                                                        // Se estiver undefined no map, é true (visível)
                                                        const isVisible = permissions.inbox.years[year]?.months?.[m] ?? true;

                                                        return (
                                                            <button
                                                                key={m}
                                                                onClick={() => toggleMonthVisibility(year, m)}
                                                                className={`text-xs px-2 py-1 rounded border transition-colors flex items-center justify-between ${isVisible
                                                                        ? 'bg-blue-50 border-blue-100 text-blue-700'
                                                                        : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                                                                    }`}
                                                            >
                                                                <span className="capitalize">{monthName}</span>
                                                                {isVisible ? <Eye size={10} /> : <EyeOff size={10} />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ConfigSection>

                    {/* 2. SEÇÃO FECHAMENTOS */}
                    <ConfigSection
                        title="2. FECHAMENTOS (Detalhe)"
                        isOpen={openSections.details}
                        onToggle={() => toggleSection('details')}
                    >
                        <div className="space-y-4">
                            {/* KPIs */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">KPIs do Topo</h4>
                                <div className="space-y-2 pl-2 border-l-2 border-gray-100">
                                    <ConfigItem label="Vendas Brutas" checked={!permissions.statement.kpis.grossSales} onChange={(chk) => updatePermission('statement.kpis.grossSales', !chk)} />
                                    <ConfigItem label="Contrato (%)" checked={!permissions.statement.kpis.contractRate} onChange={(chk) => updatePermission('statement.kpis.contractRate', !chk)} />
                                    <ConfigItem label="Valor a Receber" checked={!permissions.statement.kpis.netValue} onChange={(chk) => updatePermission('statement.kpis.netValue', !chk)} />
                                </div>
                            </div>

                            {/* Cálculo */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Lista de Cálculo</h4>
                                <div className="space-y-2 pl-2 border-l-2 border-gray-100">
                                    <ConfigItem label="(+) Vendas Totais" checked={!permissions.statement.calculation.totalSales} onChange={(chk) => updatePermission('statement.calculation.totalSales', !chk)} />
                                    <ConfigItem label="• Detalhes (Créd/Déb)" checked={!permissions.statement.calculation.details} onChange={(chk) => updatePermission('statement.calculation.details', !chk)} />
                                    <ConfigItem label="(-) Estornos" checked={!permissions.statement.calculation.cancellations} onChange={(chk) => updatePermission('statement.calculation.cancellations', !chk)} />
                                    <ConfigItem label="(=) Base de Cálculo" checked={!permissions.statement.calculation.baseCalculation} onChange={(chk) => updatePermission('statement.calculation.baseCalculation', !chk)} />
                                    <ConfigItem label="(x) Alíquota" checked={!permissions.statement.calculation.contractRateLine} onChange={(chk) => updatePermission('statement.calculation.contractRateLine', !chk)} />
                                    <ConfigItem label="(=) Repasse Final" checked={!permissions.statement.calculation.finalRepasse} onChange={(chk) => updatePermission('statement.calculation.finalRepasse', !chk)} />
                                </div>
                            </div>

                            {/* Docs */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Documentos</h4>
                                <div className="space-y-2 pl-2 border-l-2 border-gray-100">
                                    <ConfigItem label="Botão 'Baixar PDF'" checked={!permissions.statement.docs.reportPdf} onChange={(chk) => updatePermission('statement.docs.reportPdf', !chk)} />
                                    <ConfigItem label="Botão 'Comprovante'" checked={!permissions.statement.docs.proof} onChange={(chk) => updatePermission('statement.docs.proof', !chk)} />
                                </div>
                            </div>
                        </div>
                    </ConfigSection>

                    {/* 3. SEÇÃO HISTÓRICO */}
                    <ConfigSection
                        title="3. HISTÓRICO (Colunas)"
                        isOpen={openSections.history}
                        onToggle={() => toggleSection('history')}
                    >
                        <ConfigItem label="Coluna 'Título / Mês'" checked={!permissions.history.columns.titleMonth} onChange={(chk) => updatePermission('history.columns.titleMonth', !chk)} />
                        <ConfigItem label="Coluna 'Proprietário'" checked={!permissions.history.columns.owner} onChange={(chk) => updatePermission('history.columns.owner', !chk)} />
                        <ConfigItem label="Coluna 'Status'" checked={!permissions.history.columns.status} onChange={(chk) => updatePermission('history.columns.status', !chk)} />
                        <ConfigItem label="Coluna 'Atualização'" checked={!permissions.history.columns.updatedAt} onChange={(chk) => updatePermission('history.columns.updatedAt', !chk)} />
                        <ConfigItem label="Coluna 'Criado em'" checked={!permissions.history.columns.createdAt} onChange={(chk) => updatePermission('history.columns.createdAt', !chk)} />
                    </ConfigSection>

                </ScrollArea>
            </div>
        </div>
    );
}
