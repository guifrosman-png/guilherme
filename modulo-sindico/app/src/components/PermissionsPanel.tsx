
import React, { useState } from 'react';
import { usePermissions } from '../contexts/PermissionsContext';
import { useViewMode } from '../contexts/ViewModeContext';
import {
    Settings,
    LayoutDashboard,
    ShoppingBag,
    FileText,
    LifeBuoy,
    X,
    Search,
    Filter,
    LayoutGrid,
    Plus,
    Maximize2,
    Eye,
    EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PermissionsPanel() {
    const { isOwnerView } = useViewMode();
    const { permissions, setPermission, togglePermission, getPermission } = usePermissions();
    const [isOpen, setIsOpen] = useState(false);

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
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className={`p-2 rounded-lg ${isAllowed ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Icon className="w-4 h-4" />
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className={`text-sm font-semibold ${isAllowed ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
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
                <Tabs defaultValue="dashboard" className="h-full flex flex-col">
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

                        {/* --- SALES (Placeholder) --- */}
                        <TabsContent value="sales" className="space-y-4 mt-4">
                            <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mx-1">
                                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 font-medium">Configurações de Vendas</p>
                                <p className="text-xs text-slate-400 mt-1">Em breve você poderá controlar a visualização desta aba.</p>
                            </div>
                        </TabsContent>

                        {/* --- CLOSING (Placeholder) --- */}
                        <TabsContent value="closing" className="space-y-4 mt-4">
                            <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mx-1">
                                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-sm text-slate-500 font-medium">Configurações de Fechamento</p>
                                <p className="text-xs text-slate-400 mt-1">Em breve você poderá controlar a visualização desta aba.</p>
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </div>
        </div>
    );
}
