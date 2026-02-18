import { useState, useEffect, useRef, useTransition } from 'react';
import { mercatusService } from '../services/mercatusService';
import { repasseService } from '../services/repasseService';

// ===== INTERFACES PARA GRÁFICOS =====
export interface ChartDataPoint {
    name: string;
    label?: string;
    value: number;
    color?: string;
}

export interface DailySalesData {
    date: string; // YYYY-MM-DD
    value: number;
    label: string; // DD/MM
}

export interface DashboardMetrics {
    faturamentoBruto: number;
    repasseLiquido: number;
    vendasQtd: number;
    totalItems: number; // Novo KPI
    statusRepasse: string;

    // Dados para Gráficos
    dailySales: DailySalesData[];
    topProducts: ChartDataPoint[];
    hourlySales: ChartDataPoint[];
    paymentMethods: ChartDataPoint[];

    registrosVendas: any[];
    detalhesRepasse: any;
    loading: boolean;
    fromCache?: boolean;
    lastUpdated?: string;
}

export interface SindicoDashboardParams {
    unidadeId: number;
    dataInicial?: Date | string;
    dataFinal?: Date | string;
}

// ===== FUNÇÕES DE CACHE =====
const CACHE_KEY_PREFIX = 'sindico_dashboard_';
// const CACHE_TTL_MS = 30 * 60 * 1000; // Unused for now

interface CachedData {
    metrics: Omit<DashboardMetrics, 'loading' | 'fromCache'>;
    timestamp: number;
    unidadeId: number;
}

function getCacheKey(unidadeId: number): string {
    return `${CACHE_KEY_PREFIX}${unidadeId}`;
}

// Polyfill para requestIdleCallback
const requestIdleCallback =
    (typeof window !== 'undefined' ? (window as any).requestIdleCallback : null) ||
    ((cb: Function) => setTimeout(cb, 50));

function saveToCache(unidadeId: number, metrics: DashboardMetrics): void {
    requestIdleCallback(() => {
        try {
            const data: CachedData = {
                metrics: {
                    faturamentoBruto: metrics.faturamentoBruto,
                    repasseLiquido: metrics.repasseLiquido,
                    vendasQtd: metrics.vendasQtd,
                    totalItems: metrics.totalItems,
                    statusRepasse: metrics.statusRepasse,
                    dailySales: metrics.dailySales,
                    topProducts: metrics.topProducts,
                    hourlySales: metrics.hourlySales,
                    paymentMethods: metrics.paymentMethods,
                    registrosVendas: metrics.registrosVendas ? metrics.registrosVendas.slice(0, 100) : [], // Limit storage
                    detalhesRepasse: metrics.detalhesRepasse,
                },
                timestamp: Date.now(),
                unidadeId
            };
            localStorage.setItem(getCacheKey(unidadeId), JSON.stringify(data));
        } catch (e) {
            console.warn('Erro ao salvar cache:', e);
        }
    }); // removed timeout arg as polyfill might not support it identically in all envs without full types
}

function loadFromCache(unidadeId: number): DashboardMetrics | null {
    try {
        const raw = localStorage.getItem(getCacheKey(unidadeId));
        if (!raw) return null;

        const data: CachedData = JSON.parse(raw);
        if (data.unidadeId !== unidadeId) return null;

        return {
            ...data.metrics,
            loading: false,
            fromCache: true,
            lastUpdated: new Date(data.timestamp).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    } catch (e) {
        console.warn('Erro ao ler cache:', e);
        return null;
    }
}

// ===== HOOK PRINCIPAL =====
export function useSindicoDashboard(params: SindicoDashboardParams | number) {
    const config: SindicoDashboardParams = typeof params === 'number'
        ? { unidadeId: params }
        : params;

    const { unidadeId, dataInicial, dataFinal } = config;

    // useTransition para atualização não-bloqueante
    const [isPending, startTransition] = useTransition();

    // Cache lido de forma síncrona (rápido)
    const cachedData = useRef<DashboardMetrics | null>(null);

    // Ler cache apenas uma vez
    if (cachedData.current === null) {
        cachedData.current = loadFromCache(unidadeId);
    }

    const [metrics, setMetrics] = useState<DashboardMetrics>(() => {
        if (cachedData.current) {
            return cachedData.current;
        }
        return {
            faturamentoBruto: 0,
            repasseLiquido: 0,
            vendasQtd: 0,
            totalItems: 0,
            statusRepasse: '...',
            dailySales: [],
            topProducts: [],
            hourlySales: [],
            paymentMethods: [],
            registrosVendas: [],
            detalhesRepasse: null,
            loading: true,
            fromCache: false
        };
    });

    const hasLoadedRef = useRef(false);

    useEffect(() => {
        // Se mudarem os parâmetros, resetamos a ref para carregar de novo
        hasLoadedRef.current = false;
    }, [unidadeId, dataInicial, dataFinal]);

    useEffect(() => {
        if (hasLoadedRef.current) return;

        const loadData = async () => {
            let faturamento = 0;
            let vendasCount = 0;
            let itemsCount = 0;
            let repasseVal = 0;
            let statusRep = 'N/A';
            let vRegs: any[] = [];
            let rDet: any = null;

            // Estruturas temporárias para agregação
            const dailyMap = new Map<string, number>();
            const productMap = new Map<string, number>();
            const hourMap = new Array(24).fill(0);
            const paymentMap = new Map<string, number>();

            try {
                const now = new Date();
                // Default: Início do mês atual até agora
                const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const defaultEnd = now;

                const startDate = dataInicial
                    ? (typeof dataInicial === 'string' ? new Date(dataInicial) : dataInicial)
                    : defaultStart;
                const endDate = dataFinal
                    ? (typeof dataFinal === 'string' ? new Date(dataFinal) : dataFinal)
                    : defaultEnd;

                // Ajustar dataFinal para o final do dia se for a mesma data ou padrão
                const endDateTime = new Date(endDate);
                if (endDateTime.getHours() === 0) endDateTime.setHours(23, 59, 59);

                const formatForApi = (d: Date) => d.toISOString().replace('T', ' ').slice(0, 19);

                // Buscar vendas e repasse em paralelo
                const [vendasData, repasseTotals] = await Promise.all([
                    mercatusService.getSales({
                        unidadeId: config.unidadeId,
                        dataInicial: formatForApi(startDate),
                        dataFinal: formatForApi(endDateTime),
                        portalSindico: 'S'
                    }).catch(e => { console.error("Erro Vendas:", e); return null; }),
                    // Usar getFinancialTotals para pegar repasse calculado se disponível, senão fallback
                    mercatusService.getFinancialTotals(startDate.getMonth() + 1, startDate.getFullYear(), config.unidadeId)
                        .catch(e => { console.error("Erro Totais:", e); return null; })
                ]);

                if (vendasData?.registros) {
                    vRegs = vendasData.registros;
                    vendasCount = vendasData.paginacao?.qtdTotalRegistros || vRegs.length;

                    vRegs.forEach(venda => {
                        if (venda.cancelado) return; // Ignorar cancelados

                        const valor = Number(venda.valorTotal || 0);
                        faturamento += valor;

                        // 1. Vendas por Dia & 2. Vendas por Hora
                        // API retorna datas no formato "YYYY-MM-DD HH:mm:ss"
                        const dateStr = venda.dataInicio || venda.dataEfetivacao || venda.dataMovimento || '';
                        const dataVenda = dateStr ? new Date(dateStr.replace(' ', 'T')) : null;

                        if (dataVenda && !isNaN(dataVenda.getTime())) {
                            const dayKey = dataVenda.toISOString().split('T')[0]; // YYYY-MM-DD
                            dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + valor);

                            const hour = dataVenda.getHours();
                            hourMap[hour] += 1;
                        }

                        // 3. Totais de Itens e Top Produtos
                        // API retorna campo "produtos" (não "itens")
                        const produtos = venda.produtos || venda.itens;
                        if (produtos && Array.isArray(produtos)) {
                            produtos.forEach((item: any) => {
                                const qtd = Number(item.quantidade || 0);
                                itemsCount += qtd;

                                const prodName = item.descricaoReduzida || item.descricaoComercial || item.produto || 'Indefinido';
                                productMap.set(prodName, (productMap.get(prodName) || 0) + qtd);
                            });
                        }

                        // 4. Formas de Pagamento
                        if (venda.finalizadoras) {
                            venda.finalizadoras.forEach((fin: any) => {
                                let desc = fin.descricao?.toUpperCase() || 'OUTROS';
                                // Simplificar nomes
                                if (desc.includes('PIX')) desc = 'PIX';
                                else if (desc.includes('CREDITO') || desc.includes('CRÉDITO')) desc = 'CRÉDITO';
                                else if (desc.includes('DEBITO') || desc.includes('DÉBITO')) desc = 'DÉBITO';
                                else if (desc.includes('VOUCHER') || desc.includes('ALIMENTACAO') || desc.includes('REFEICAO')) desc = 'VOUCHER';

                                paymentMap.set(desc, (paymentMap.get(desc) || 0) + Number(fin.valorPago || 0));
                            });
                        }
                    });
                }

                if (repasseTotals) {
                    // Calcular repasse baseado na regra simples de 5% se não tiver dados exatos
                    // (Idealmente viria do repasseService se estivesse fechado, mas para dashboard tempo real usamos estimativa)
                    // Supondo 5% padrão se não vier configurado
                    repasseVal = repasseTotals.grossSales * 0.05;
                    statusRep = 'Estimado';
                }

            } catch (error) {
                console.error("Erro processamento dashboard:", error);
            }

            // Converter Maps para Arrays Ordenados

            // Daily Sales
            const dailySales: DailySalesData[] = Array.from(dailyMap.entries())
                .map(([date, value]) => {
                    const [_y, m, d] = date.split('-');
                    return { date, value, label: `${d}/${m}` };
                })
                .sort((a, b) => a.date.localeCompare(b.date));

            // Top Products (Top 5)
            const topProducts: ChartDataPoint[] = Array.from(productMap.entries())
                .map(([name, value]) => ({ name, label: name, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5);

            // Hourly Sales (Filtrar horas vazias se quiser, ou mandar todas)
            const hourlySales: ChartDataPoint[] = [];
            hourMap.forEach((val, h) => {
                if (val > 0) {
                    const hPad = String(h).padStart(2, '0');
                    const hNext = String((h + 1) % 24).padStart(2, '0');
                    hourlySales.push({
                        name: `${hPad}:00 - ${hNext}:00`,
                        label: `${hPad}:00 - ${hNext}:00`,
                        value: val
                    });
                }
            });

            // Payment Methods
            const paymentMethods: ChartDataPoint[] = Array.from(paymentMap.entries())
                .map(([name, value]) => ({ name, label: name, value }))
                .sort((a, b) => b.value - a.value);

            const newMetrics: DashboardMetrics = {
                faturamentoBruto: faturamento,
                vendasQtd: vendasCount,
                totalItems: itemsCount,
                repasseLiquido: repasseVal,
                statusRepasse: statusRep,

                dailySales,
                topProducts,
                hourlySales,
                paymentMethods,

                registrosVendas: vRegs,
                detalhesRepasse: rDet,
                loading: false,
                fromCache: false,
                lastUpdated: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };

            startTransition(() => {
                setMetrics(newMetrics);
            });

            saveToCache(config.unidadeId, newMetrics);
            hasLoadedRef.current = true;
        };

        if (cachedData.current) {
            requestIdleCallback(() => loadData());
        } else {
            setTimeout(() => loadData(), 100);
        }

    }, [unidadeId, dataInicial, dataFinal, config.unidadeId]); // Add proper dependencies

    return metrics;
}
