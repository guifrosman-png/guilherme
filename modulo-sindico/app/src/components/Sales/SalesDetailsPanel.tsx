
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    ChevronDown,
    ChevronUp,
    LayoutGrid,
    List,
    ShoppingBag,
    CreditCard,
    CheckCircle2
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { clsx } from 'clsx';
import { MercatusSale } from '../../types/mercatus';

interface SalesDetailsPanelProps {
    saleId: string | null;
    sale?: MercatusSale | null; // Adicionado objeto completo
    onClose: () => void;
}

export function SalesDetailsPanel({ saleId, sale, onClose }: SalesDetailsPanelProps) {
    const [viewMode, setViewMode] = useState<'lista' | 'card'>('lista');
    const [expandedSections, setExpandedSections] = useState<string[]>(['resumo', 'itens']); // Inicia ABERTO para visualizar melhor

    if (!saleId || !sale) return null;

    const toggleSection = (id: string) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const sections = [
        { id: 'resumo', title: 'Resumo da Venda', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100' },
        { id: 'itens', title: 'Itens da Venda', icon: ShoppingBag, color: 'text-[#525a52]', bg: 'bg-[#525a52]/10' },
    ];

    // --- RENDERIZADORES ---

    const renderContent = (sectionId: string) => {
        switch (sectionId) {
            case 'resumo':
                return (
                    <div className="space-y-3 p-1">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valorTotal - (sale.valorAcrescimo || 0) + (sale.valorDesconto || 0))}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Descontos</span>
                            <span className="font-medium text-green-600">
                                - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valorDesconto || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-base pt-2 border-t border-gray-100">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-bold text-gray-900">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valorLiquido || sale.valorTotal)}
                            </span>
                        </div>
                    </div>
                );
            case 'itens':
                return (
                    <div className="space-y-3">
                        {sale.produtos && sale.produtos.length > 0 ? (
                            sale.produtos.map((item, idx) => (
                                <div key={item.id || idx} className="flex justify-between items-center py-1">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gray-100/50 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded">
                                            {item.quantidade}x
                                        </span>
                                        <span className="text-sm font-medium text-gray-700 uppercase">
                                            {item.descricaoReduzida || item.descricaoComercial || 'PRODUTO SEM NOME'}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valorTotal)}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">Nenhum item listado.</p>
                        )}
                    </div>
                );
            default:
                return <p className="text-xs text-gray-400 italic p-1">Sem informações adicionais.</p>;
        }
    };

    // --- VISUALIZAÇÃO EM LISTA (ACCORDION) ---
    const ListView = () => (
        <div className="divide-y divide-gray-100">
            {sections.map(section => {
                const isExpanded = expandedSections.includes(section.id);
                // const Icon = section.icon; // Icon usage commented out to match user style or handled below

                return (
                    <div key={section.id} className="border-b border-gray-100 last:border-0">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-gray-700">{section.title}</span>
                            </div>
                            {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </button>

                        {isExpanded && (
                            <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
                                {renderContent(section.id)}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );

    // --- VISUALIZAÇÃO EM CARD (GRID) ---
    const CardView = () => (
        <div className="p-4 grid grid-cols-2 gap-3">
            {sections.map(section => {
                const Icon = section.icon;

                return (
                    <div
                        key={section.id}
                        className={clsx(
                            "bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer",
                            "col-span-2"
                        )}
                        onClick={() => toggleSection(section.id)}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center", section.bg)}>
                                <Icon className={clsx("w-4 h-4", section.color)} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-700">{section.title}</h4>
                                <p className="text-[10px] text-gray-500">Ver detalhes</p>
                            </div>
                        </div>

                        {/* Preview do conteúdo */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            {section.id === 'resumo' && (
                                <p className="text-lg font-bold text-gray-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.valorLiquido)}
                                </p>
                            )}
                            {section.id === 'itens' && (
                                <p className="text-xs text-gray-500">{sale.produtos?.length || 0} itens na lista</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -ml-2">
                        <ChevronDown className="h-4 w-4 text-gray-500 rotate-90" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">DETALHES</h2>
                        <p className="text-xs text-gray-500">Venda {sale.cupom || saleId}</p>
                    </div>
                </div>

                {/* Toggle View Mode */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('card')}
                        className={clsx(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'card' ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('lista')}
                        className={clsx(
                            "p-1.5 rounded-md transition-all",
                            viewMode === 'lista' ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* CONTEÚDO SCROLLÁVEL */}
            <ScrollArea className="flex-1 bg-white">
                {viewMode === 'lista' ? <ListView /> : <CardView />}
            </ScrollArea>

            {/* FOOTER ACTIONS */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <div className="flex gap-2">
                    <Button className="flex-1 bg-[#525a52] hover:bg-[#525a52]/90 text-white font-semibold">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Aprovar
                    </Button>
                    <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100">
                        Contestar
                    </Button>
                </div>
            </div>
        </div>
    );
}
