
import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { clsx } from 'clsx';
import { SalesInboxPanel } from './SalesInboxPanel';
import { SalesList } from './SalesList';
import { SalesDetailsPanel } from './SalesDetailsPanel';
import { MercatusSale } from '../../types/mercatus';

export function SalesView() {
    const [inboxFilter, setInboxFilter] = useState<string>('todas');
    const [inboxCollapsed, setInboxCollapsed] = useState(false);
    const [selectedSale, setSelectedSale] = useState<MercatusSale | null>(null);
    const [counts, setCounts] = useState({
        todas: 0,
        hoje: 0,
        ontem: 0,
        mes: 0,
        manha: 0,
        tarde: 0,
        noite: 0
    });

    // Layout widths
    const inboxWidth = inboxCollapsed ? 'w-16' : 'w-64';

    // Handlers
    const handleToggleInbox = () => setInboxCollapsed(!inboxCollapsed);
    const handleCountsChange = (newCounts: any) => setCounts(newCounts);

    return (
        <div className="flex h-[calc(100vh-6rem)] gap-3 bg-transparent overflow-hidden">

            {/* 1. SIDEBAR INBOX (Esquerda) */}
            <div className={`${inboxWidth} h-full flex-shrink-0 transition-all duration-300`}>
                <SalesInboxPanel
                    activeFilter={inboxFilter}
                    onFilterChange={setInboxFilter}
                    collapsed={inboxCollapsed}
                    onToggleCollapse={handleToggleInbox}
                    counts={counts}
                />
            </div>

            {/* 2. PAINEL CENTRAL (Apenas Lista) */}
            <div className="flex-1 h-full min-w-0 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Header Simples */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <LayoutGrid className="w-4 h-4 text-[#525a52]" />
                        <span>Lista de Vendas</span>
                    </div>

                    <div className="text-xs text-gray-400">
                        Visualização Simplificada
                    </div>
                </div>

                {/* Conteúdo com Scroll */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30 p-4">
                    <SalesList
                        activeFilter={inboxFilter}
                        onSelectSale={(id, sale) => setSelectedSale(sale)}
                        onCountsChange={handleCountsChange}
                    />
                </div>
            </div>

            {/* 3. PAINEL DETALHES (Direita) */}
            {selectedSale && (
                <div className="w-[400px] h-full flex-shrink-0 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden animate-in slide-in-from-right-10 duration-300">
                    <SalesDetailsPanel
                        saleId={selectedSale.id}
                        sale={selectedSale}
                        onClose={() => setSelectedSale(null)}
                    />
                </div>
            )}

        </div>
    );
}
