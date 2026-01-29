
import React, { useState, useEffect } from 'react';
import {
    Search,
    Calendar,
    ShoppingBag,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    Loader2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { clsx } from 'clsx';
import { mercatusService } from '../../services/mercatusService';
import { MercatusSale } from '../../types/mercatus';
import { useSindicoData } from '../MiniCardsGrid/context/SindicoDataContext';

// --- TIPOS ---
type SalesStatus = 'concluido' | 'cancelado';

// Tipo visual usado pelo Card (simplificação do dado bruto da API)
interface SaleDisplay {
    id: string;
    originalId: string;
    date: string;
    itemsCount: number;
    totalValue: number;
    status: SalesStatus;
    ticketNumber: string; // Ex: Cupom 123
}

// Configuração visual simples
const STATUS_CONFIG: Record<SalesStatus, { color: string; border: string }> = {
    concluido: { color: 'text-[#525a52]', border: 'border-l-[#525a52]' },
    cancelado: { color: 'text-red-700', border: 'border-l-red-500' },
};

// Função para adaptar dados da API para o formato de exibição
const adaptSaleToDisplay = (apiSale: any): SaleDisplay => {
    const totalItems = apiSale.produtos?.reduce((acc: number, curr: any) => acc + curr.quantidade, 0) || 0;
    return {
        id: apiSale.id,
        originalId: apiSale.id,
        date: apiSale.dataEfetivacao || apiSale.dataInicio,
        ticketNumber: apiSale.cupom || apiSale.id,
        totalValue: apiSale.valorTotal || 0,
        itemsCount: totalItems,
        status: apiSale.cancelado ? 'cancelado' : 'concluido'
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

                    {/* Protocolo */}
                    <div className="col-span-3">
                        <span className="text-xs font-mono font-semibold text-gray-900">#{sale.ticketNumber}</span>
                    </div>

                    {/* Data */}
                    <div className="col-span-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                                {sale.date ? new Date(sale.date).toLocaleDateString() : '-'}
                            </span>
                        </div>
                    </div>

                    {/* Itens */}
                    <div className="col-span-3">
                        <div className="flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-600">{sale.itemsCount} itens</span>
                        </div>
                    </div>

                    {/* Valor */}
                    <div className="col-span-3 text-right">
                        <span className="text-sm font-bold text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.totalValue)}
                        </span>
                    </div>

                </div>
            </div>
        </Card>
    );
};


// --- COMPONENTE PRINCIPAL ---
export function SalesList({ onSelectSale }: { onSelectSale?: (id: string, sale: any) => void }) {
    const [showKPIs, setShowKPIs] = useState(true);
    const [activeTab, setActiveTab] = useState('todas');
    const [searchTerm, setSearchTerm] = useState('');

    // Estados de Dados e Controle
    const [sales, setSales] = useState<SaleDisplay[]>([]);
    const [rawSales, setRawSales] = useState<MercatusSale[]>([]); // Guarda os dados originais para detalhes
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- ESTADOS DE PAGINAÇÃO ---
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 50;

    // --- CONTEXTO DO SÍNDICO (Dados já carregados pelo Dashboard) ---
    let contextData: any = null;
    try {
        const ctx = useSindicoData();
        contextData = ctx.data;
    } catch (e) {
        // Fora do provider, fallback para API direta
    }

    // --- INICIALIZAÇÃO COM DADOS DO CONTEXTO ---
    useEffect(() => {
        // Se o contexto já tem dados de vendas, usar eles imediatamente
        if (contextData && contextData.registrosVendas && contextData.registrosVendas.length > 0 && !contextData.loading) {
            const adaptedSales = contextData.registrosVendas.map(adaptSaleToDisplay);
            setSales(adaptedSales);
            setRawSales(contextData.registrosVendas);
            setTotalPages(Math.ceil(contextData.registrosVendas.length / LIMIT));
            setLoading(false);
        } else if (contextData && contextData.loading) {
            // Contexto ainda carregando, aguardar
            setLoading(true);
        } else {
            // Sem dados no contexto, buscar via API
            fetchSalesData(1);
        }
    }, [contextData?.registrosVendas, contextData?.loading]);

    // --- BUSCA DE DADOS (Fallback via API) ---
    const fetchSalesData = async (pageNum: number) => {
        setLoading(true);
        setError(null);
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startDate = startOfMonth.toISOString().slice(0, 19).replace('T', ' ');
            const endDate = now.toISOString().slice(0, 19).replace('T', ' ');

            const data = await mercatusService.getSales({
                unidadeId: 12,
                dataInicial: startDate,
                dataFinal: endDate,
                portalSindico: 'S',
                pagina: pageNum,
                quantidade: LIMIT
            });

            const newRawSales = data.registros || [];
            const newAdaptedSales: SaleDisplay[] = newRawSales.map(adaptSaleToDisplay);

            setRawSales(newRawSales);
            setSales(newAdaptedSales);

            if (data.paginacao) {
                setTotalPages(data.paginacao.qtdTotalPaginas || 1);
            }

        } catch (err) {
            console.error(err);
            setError('Falha ao carregar vendas.');
        } finally {
            setLoading(false);
        }
    };

    // 2. Mudança de Página (usa API direta para paginação)
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            fetchSalesData(newPage);
        }
    };

    // --- CÁLCULOS TOTAIS ---
    const totalRevenue = sales.reduce((acc, curr) => acc + curr.totalValue, 0);
    const totalCount = sales.length; // Quantidade carregada

    // --- FILTRAGEM LOCA ---
    const filteredSales = sales.filter(s => {
        const matchesSearch = s.ticketNumber.includes(searchTerm) || s.totalValue.toString().includes(searchTerm);
        return matchesSearch;
    });

    return (
        <div className="space-y-6 pb-20">

            {/* 1. SEÇÃO DE MÉTRICAS */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700">Visão Geral (Página Atual)</h2>
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
                            title="Total da Página"
                            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
                            subtitle={`Vendas da página ${page}`}
                            icon={TrendingUp}
                            variant="default"
                        />
                        <KPICard
                            title="Qtd. Página"
                            value={totalCount}
                            subtitle="Transações nesta página"
                            icon={ShoppingBag}
                            variant="muted"
                        />
                    </div>
                )}
            </div>

            {/* 2. BARRA DE BUSCA E FILTROS */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por cupom ou valor..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-[#525a52]/30 focus:border-[#525a52] shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Pílulas de Filtro (Tabs) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {['Todas', 'Hoje', 'Ontem', 'Este Mês'].map((tab) => {
                        const isActive = activeTab === tab.toLowerCase();
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={clsx(
                                    "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                                    isActive
                                        ? "bg-[#525a52]/10 text-[#525a52] border-[#525a52]/20"
                                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                                )}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 3. CONTROLES DE PAGINAÇÃO (TOPO) */}
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

            {/* 4. HEADER DA TABELA */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="w-5" />
                <div className="col-span-3 w-24">Protocolo</div>
                <div className="col-span-3 flex-1">Data</div>
                <div className="col-span-3 w-32">Itens</div>
                <div className="col-span-3 w-32 text-right">Valor Total</div>
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
                                    const originalData = rawSales.find(r => r.id === sale.originalId);
                                    if (originalData && onSelectSale) {
                                        onSelectSale(originalData.id, originalData);
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

        </div>
    );
}
