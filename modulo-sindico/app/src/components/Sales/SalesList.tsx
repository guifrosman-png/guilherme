import React, { useState, useEffect, useMemo } from 'react';
import { usePermissions } from '../../contexts/PermissionsContext';
import {
    Search,
    Calendar,
    ShoppingBag,
    TrendingUp,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import { mercatusService } from '../../services/mercatusService';
import { MercatusSale } from '../../types/mercatus';
import { ManagedFeature } from '../ManagedFeature'; // Import component
type SalesStatus = 'concluido' | 'cancelado';

// Tipo visual usado pelo Card (simplificação do dado bruto da API)
interface SaleDisplay {
    id: string;
    originalId: string;
    date: string;
    time: string; // Adicionado para facilitar filtro de turnos
    itemsCount: number;
    totalValue: number;
    status: SalesStatus;
    ticketNumber: string; // Ex: Cupom 123
    raw: MercatusSale; // Guardar dado bruto
}

// Configuração visual simples
const STATUS_CONFIG: Record<SalesStatus, { color: string; border: string }> = {
    concluido: { color: 'text-[#525a52]', border: 'border-l-[#525a52]' },
    cancelado: { color: 'text-red-700', border: 'border-l-red-500' },
};

// Função para adaptar dados da API para o formato de exibição
const adaptSaleToDisplay = (apiSale: MercatusSale): SaleDisplay => {
    const totalItems = apiSale.produtos?.reduce((acc: number, curr: any) => acc + curr.quantidade, 0) || 0;

    // Cálculo real somando os itens e subtraindo descontos
    const calculatedTotal = apiSale.produtos?.reduce((acc: number, curr: any) => acc + (curr.valorTotal || 0), 0) || 0;
    const finalTotal = calculatedTotal - (apiSale.valorDesconto || 0);

    // apiSale.dataInicio format: "2024-03-20 14:30:00"
    const [datePart, timePart] = (apiSale.dataInicio || "").split(' ');

    return {
        id: apiSale.id,
        originalId: apiSale.id,
        date: datePart, // YYYY-MM-DD
        time: timePart || "00:00:00",
        ticketNumber: apiSale.cupom || apiSale.id,
        totalValue: finalTotal,
        itemsCount: totalItems,
        status: (apiSale as any).cancelado ? 'cancelado' : 'concluido',
        raw: apiSale
    };
};

// --- COMPONENTES AUXILIARES ---

const KPICard = ({ title, value, subtitle, icon: Icon, variant = 'default' }: any) => {
    const variants = {
        default: 'bg-[#525a52]/10 text-[#525a52]',
        muted: 'bg-gray-100 text-gray-600',
    };
    const colorClass = variants[variant as keyof typeof variants] || variants.default;

    return (
        <Card className="relative p-4 overflow-hidden border-t-4 border-t-[#525a52] hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                </div>
                <div className={clsx("p-2 rounded-full", colorClass)}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </Card>
    );
};

const SalesListCard = ({ sale, onClick }: { sale: SaleDisplay; onClick?: () => void }) => {
    const statusConfig = STATUS_CONFIG[sale.status];

    return (
        <Card
            onClick={onClick}
            className={clsx(
                "group relative p-3 cursor-pointer transition-all hover:bg-[#525a52]/5 hover:shadow-md border-l-[3px]",
                statusConfig.border
            )}
            style={{ borderLeftColor: sale.status === 'concluido' ? '#525a52' : '#ef4444' }}
        >
            <div className="flex items-center gap-4">
                {/* Checkbox */}
                <div className="w-5 flex items-center justify-center pointer-events-none">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[#525a52] focus:ring-[#525a52] cursor-pointer pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>


                {/* Colunas */}
                <div className="flex-1 grid grid-cols-12 gap-4 items-center">

                    {/* Contagem de Itens (Simplificação Máxima) */}
                    <div className="col-span-6">
                        <ManagedFeature id="sales.list.item_count" label="Coluna Itens">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-3.5 h-3.5 text-[#525a52] flex-shrink-0" />
                                <span className="text-sm font-semibold text-gray-900">
                                    {sale.itemsCount} {sale.itemsCount === 1 ? 'item' : 'itens'}
                                </span>
                            </div>
                        </ManagedFeature>
                    </div>

                    {/* Data */}
                    <div className="col-span-3">
                        <ManagedFeature id="sales.list.date" label="Coluna Data">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                    {sale.date ? sale.date.split('-').reverse().join('/') : '-'}
                                </span>
                            </div>
                        </ManagedFeature>
                    </div>

                    {/* Valor */}
                    <div className="col-span-3 text-right">
                        <ManagedFeature id="sales.list.total_value" label="Coluna Valor Total">
                            <span className="text-sm font-bold text-gray-900 font-mono">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalValue)}
                            </span>
                        </ManagedFeature>
                    </div>

                </div>
            </div>
        </Card>
    );
};


// --- COMPONENTE PRINCIPAL ---
interface SalesListProps {
    onSelectSale?: (id: string, sale: any) => void;
    activeFilter?: string; // Filtro vindo da sidebar
    onCountsChange?: (counts: any) => void; // Notificar pai sobre os contadores
}

export function SalesList({ onSelectSale, activeFilter = 'todas', onCountsChange }: SalesListProps) {
    const { getPermission } = usePermissions();
    const [showKPIs, setShowKPIs] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados de Dados e Controle
    const [sales, setSales] = useState<SaleDisplay[]>([]); // Vendas da página atual
    const [allSalesForCounting, setAllSalesForCounting] = useState<SaleDisplay[]>([]); // Todas as vendas para o Inbox
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- ESTADOS DE PAGINAÇÃO ---
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 50;

    // Ref para evitar carregamento duplicado
    const hasLoadedRef = React.useRef(false);

    // --- CÁLCULO DE CONTADORES E FILTRAGEM ---
    const { filteredSales, counts, kpiLabels, filterTotals } = useMemo(() => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // 1. Calcular contadores
        const stats = {
            todas: allSalesForCounting.length,
            hoje: 0,
            ontem: 0,
            mes: allSalesForCounting.length,
            manha: 0,
            tarde: 0,
            noite: 0
        };

        allSalesForCounting.forEach(sale => {
            const hour = parseInt(sale.time.split(':')[0]);
            if (sale.date === todayStr) stats.hoje++;
            else if (sale.date === yesterdayStr) stats.ontem++;

            if (hour >= 0 && hour < 12) stats.manha++;
            else if (hour >= 12 && hour < 18) stats.tarde++;
            else if (hour >= 18 && hour < 24) stats.noite++;
        });

        // 2. Definir a Base de Dados para os Totais (Sempre a base completa do filtro)
        let fullFilteredList = allSalesForCounting;
        let labels = {
            title: "Faturamento Total",
            subtitle: `Todas as vendas de ${todayStr.split('-')[1]}/${todayStr.split('-')[0]}`,
            qtyTitle: "Vendas Totais",
            qtySubtitle: "Volume total de transações"
        };

        if (activeFilter === 'hoje') {
            fullFilteredList = allSalesForCounting.filter(s => s.date === todayStr);
            labels = {
                title: "Total de Hoje",
                subtitle: `Vendas do dia ${todayStr.split('-').reverse().join('/')}`,
                qtyTitle: "Qtd. Hoje",
                qtySubtitle: "Total de transações hoje"
            };
        } else if (activeFilter === 'ontem') {
            fullFilteredList = allSalesForCounting.filter(s => s.date === yesterdayStr);
            labels = {
                title: "Total de Ontem",
                subtitle: `Vendas de ${yesterdayStr.split('-').reverse().join('/')}`,
                qtyTitle: "Qtd. Ontem",
                qtySubtitle: "Total de transações ontem"
            };
        } else if (activeFilter === 'este mes') {
            fullFilteredList = allSalesForCounting;
            labels = {
                title: "Total do Mês",
                subtitle: "Vendas acumuladas mensais",
                qtyTitle: "Qtd. Mês",
                qtySubtitle: "Volume total mensal"
            };
        } else if (activeFilter.startsWith('shift-')) {
            const shift = activeFilter.replace('shift-', '');
            const shiftName = shift === 'manha' ? 'Manhã' : shift === 'tarde' ? 'Tarde' : 'Noite';
            fullFilteredList = allSalesForCounting.filter(s => {
                const hour = parseInt(s.time.split(':')[0]);
                if (shift === 'manha') return hour >= 0 && hour < 12;
                if (shift === 'tarde') return hour >= 12 && hour < 18;
                if (shift === 'noite') return hour >= 18 && hour < 24;
                return false;
            });
            labels = {
                title: `Total Caixa ${shiftName}`,
                subtitle: `Vendas globais no turno da ${shiftName.toLowerCase()}`,
                qtyTitle: `Qtd. ${shiftName}`,
                qtySubtitle: "Transações acumuladas no turno"
            };
        }

        // 3. Aplicar busca se houver
        if (searchTerm) {
            fullFilteredList = fullFilteredList.filter(s =>
                (s.raw.produtos?.[0]?.descricaoReduzida || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.totalValue.toString().includes(searchTerm)
            );
        }

        // 4. Definir o que mostrar na LISTA (Se for 'todas', mantemos a paginação das 50 para performance)
        const listToShow = activeFilter === 'todas' && !searchTerm ? sales : fullFilteredList;

        // 5. Calcular valores dos KPIs (Sempre baseados na lista completa filtrada)
        const totalRevenue = fullFilteredList.reduce((acc, curr) => acc + curr.totalValue, 0);
        const totalCount = fullFilteredList.length;

        return {
            filteredSales: listToShow,
            counts: stats,
            kpiLabels: labels,
            filterTotals: { revenue: totalRevenue, count: totalCount }
        };
    }, [allSalesForCounting, sales, activeFilter, searchTerm, page]);

    // Notificar pai sobre mudanças nos contadores
    useEffect(() => {
        if (onCountsChange && allSalesForCounting.length > 0) {
            onCountsChange(counts);
        }
    }, [counts, onCountsChange, allSalesForCounting.length]);

    // --- INICIALIZAÇÃO ---
    React.useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        const init = async () => {
            await fetchSalesData(1); // Carrega primeira página
            fetchAllSalesForInbox(); // Carrega tudo para o Inbox em background
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(init, { timeout: 500 });
        } else {
            init();
        }
    }, []);

    // --- BUSCA DE DADOS DA PÁGINA ---
    const fetchSalesData = async (pageNum: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await mercatusService.getSales({
                unidadeId: 12,
                dataInicial: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 19).replace('T', ' '),
                dataFinal: new Date().toISOString().slice(0, 19).replace('T', ' '),
                portalSindico: 'S',
                pagina: pageNum,
                quantidade: LIMIT
            });

            const newRawSales = data.registros || [];
            const newAdaptedSales: SaleDisplay[] = newRawSales.map(adaptSaleToDisplay);

            React.startTransition(() => {
                setSales(newAdaptedSales);
                if (data.paginacao) {
                    setTotalPages(data.paginacao.qtdTotalPaginas || 1);
                }
            });

        } catch (err) {
            console.error(err);
            setError('Falha ao carregar vendas.');
        } finally {
            setLoading(false);
        }
    };

    // --- BUSCA GLOBAL (SIDEBAR) ---
    const fetchAllSalesForInbox = async () => {
        try {
            // Buscamos um número maior (ou todas do mês) apenas para os contadores e filtros de turno
            const data = await mercatusService.getSales({
                unidadeId: 12,
                dataInicial: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 19).replace('T', ' '),
                dataFinal: new Date().toISOString().slice(0, 19).replace('T', ' '),
                portalSindico: 'S',
                pagina: 1,
                quantidade: 1000 // Aumentamos para pegar o volume real do mês
            });

            const allRaw = data.registros || [];
            const allAdapted = allRaw.map(adaptSaleToDisplay);

            React.startTransition(() => {
                setAllSalesForCounting(allAdapted);
            });
        } catch (e) {
            console.warn("Erro ao buscar total de vendas para Inbox:", e);
        }
    };

    // 2. Mudança de Página
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchSalesData(newPage);
        }
    };

    // --- CÁLCULOS FINAIS PARA DISPLAY ---
    const totalRevenueDisplay = filterTotals.revenue;
    const totalCountDisplay = filterTotals.count;

    return (
        <div className="space-y-6 pb-20">

            {/* 1. SEÇÃO DE MÉTRICAS */}
            <ManagedFeature id="sales.kpis" label="KPIs de Vendas">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">Visão Geral</h2>
                        <button
                            onClick={() => setShowKPIs(!showKPIs)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {showKPIs ? <><EyeOff className="w-3.5 h-3.5" /> Ocultar</> : <><Eye className="w-3.5 h-3.5" /> Mostrar</>}
                        </button>
                    </div>

                    {showKPIs && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <KPICard
                                title={kpiLabels.title}
                                value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenueDisplay)}
                                subtitle={kpiLabels.subtitle}
                                icon={TrendingUp}
                                variant="default"
                            />
                            <KPICard
                                title={kpiLabels.qtyTitle}
                                value={totalCountDisplay}
                                subtitle={kpiLabels.qtySubtitle}
                                icon={ShoppingBag}
                                variant="muted"
                            />
                        </div>
                    )}
                </div>
            </ManagedFeature>

            {/* 2. BARRA DE BUSCA E FILTROS */}
            <ManagedFeature id="sales.search" label="Busca de Vendas">
                <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por item ou valor..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-[#525a52]/30 focus:border-[#525a52] shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </ManagedFeature>

            {/* 3. CONTROLES DE PAGINAÇÃO (TOPO) */}
            <ManagedFeature id="sales.pagination" label="Paginação">
                {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2">
                        <span className="text-xs text-gray-500">
                            Página <span className="font-medium text-gray-900">{page}</span> de <span className="font-medium text-gray-900">{totalPages}</span>
                            <span className="ml-2 text-gray-400">({LIMIT} por página)</span>
                        </span>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={page === 1 || loading}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Primeira Página"
                            >
                                <ChevronsLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1 || loading}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Página Anterior"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg min-w-[3rem] text-center">
                                {page}
                            </span>

                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages || loading}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Próxima Página"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={page === totalPages || loading}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Última Página"
                            >
                                <ChevronsRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </ManagedFeature>

            {/* 4. HEADER DA TABELA */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <div className="w-5" />
                <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-6">
                        <ManagedFeature id="sales.list.item_count" label="Cabeçalho Itens">ITENS</ManagedFeature>
                    </div>
                    <div className="col-span-3">
                        <ManagedFeature id="sales.list.date" label="Cabeçalho Data">DATA</ManagedFeature>
                    </div>
                    <div className="col-span-3 text-right">
                        <ManagedFeature id="sales.list.total_value" label="Cabeçalho Valor">VALOR TOTAL</ManagedFeature>
                    </div>
                </div>
            </div>

            {/* 4. LISTA REAL */}
            {sales.length === 0 && loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-sm">Carregando transações...</p>
                </div>
            ) : sales.length === 0 && !loading && error ? (
                <div className="flex flex-col items-center justify-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            ) : (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-500">
                    {filteredSales.length === 0 && !loading ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>Nenhuma venda encontrada para o filtro.</p>
                        </div>
                    ) : (
                        filteredSales.map(sale => (
                            <SalesListCard
                                key={sale.id}
                                sale={sale}
                                onClick={() => {
                                    const canViewDetails = getPermission('sales.details.view');
                                    if (canViewDetails && onSelectSale) {
                                        onSelectSale(sale.id, sale.raw);
                                    }
                                }}
                            />
                        ))
                    )}

                    {/* LOADING OVERLAY (Se carregar nova pagina com lista cheia) */}
                    {loading && sales.length > 0 && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    )}
                </div>
            )}

            {/* Botão Flutuante de Adicionar */}
            <ManagedFeature id="sales.add_button" label="Botão Adicionar Venda">
                <Button
                    className="absolute bottom-4 left-4 z-20 h-12 w-12 rounded-full bg-[#525a52] hover:bg-[#525a52]/90 text-white shadow-lg border-2 border-white transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center p-0"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </ManagedFeature>        </div>
    );
}
