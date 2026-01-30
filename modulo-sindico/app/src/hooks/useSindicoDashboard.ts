import { useState, useEffect, useRef, useTransition, useCallback } from 'react';
import { mercatusService } from '../services/mercatusService';
import { repasseService } from '../services/repasseService';

export interface DashboardMetrics {
    faturamentoBruto: number;
    repasseLiquido: number;
    vendasQtd: number;
    statusRepasse: string;
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
const CACHE_TTL_MS = 30 * 60 * 1000;

interface CachedData {
    metrics: Omit<DashboardMetrics, 'loading' | 'fromCache'>;
    timestamp: number;
    unidadeId: number;
}

function getCacheKey(unidadeId: number): string {
    return `${CACHE_KEY_PREFIX}${unidadeId}`;
}

function saveToCache(unidadeId: number, metrics: DashboardMetrics): void {
    // Salvar cache de forma assíncrona para não bloquear
    requestIdleCallback(() => {
        try {
            const data: CachedData = {
                metrics: {
                    faturamentoBruto: metrics.faturamentoBruto,
                    repasseLiquido: metrics.repasseLiquido,
                    vendasQtd: metrics.vendasQtd,
                    statusRepasse: metrics.statusRepasse,
                    registrosVendas: metrics.registrosVendas.slice(0, 100), // Limitar para não travar
                    detalhesRepasse: metrics.detalhesRepasse,
                },
                timestamp: Date.now(),
                unidadeId
            };
            localStorage.setItem(getCacheKey(unidadeId), JSON.stringify(data));
        } catch (e) {
            console.warn('Erro ao salvar cache:', e);
        }
    }, { timeout: 2000 });
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

// Polyfill para requestIdleCallback
const requestIdleCallback =
    (window as any).requestIdleCallback ||
    ((cb: Function) => setTimeout(cb, 50));

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
            statusRepasse: '...',
            registrosVendas: [],
            detalhesRepasse: null,
            loading: true,
            fromCache: false
        };
    });

    const hasLoadedRef = useRef(false);

    useEffect(() => {
        // Evitar múltiplos loads
        if (hasLoadedRef.current) return;

        // Função de carregamento
        const loadData = async () => {
            let faturamento = 0;
            let qtd = 0;
            let repasseVal = 0;
            let statusRep = 'N/A';
            let vRegs: any[] = [];
            let rDet: any = null;

            try {
                const now = new Date();
                const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const defaultEnd = now;

                const startDate = dataInicial
                    ? (typeof dataInicial === 'string' ? new Date(dataInicial) : dataInicial)
                    : defaultStart;
                const endDate = dataFinal
                    ? (typeof dataFinal === 'string' ? new Date(dataFinal) : dataFinal)
                    : defaultEnd;

                const formatForApi = (d: Date) => d.toISOString().slice(0, 19).replace('T', ' ');

                // Buscar vendas e repasse em paralelo
                const [vendasData, repasseData] = await Promise.all([
                    mercatusService.getSales({
                        unidadeId,
                        dataInicial: formatForApi(startDate),
                        dataFinal: formatForApi(endDate),
                        portalSindico: 'S'
                    }).catch(e => { console.error("Erro Vendas:", e); return null; }),
                    repasseService.getRepasseAtual(unidadeId)
                        .catch(e => { console.error("Erro Repasse:", e); return null; })
                ]);

                if (vendasData?.registros) {
                    vRegs = vendasData.registros;
                    faturamento = vRegs.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
                    qtd = vendasData.paginacao?.qtdTotalRegistros || vRegs.length;
                }

                if (repasseData) {
                    repasseVal = repasseData.valor_liquido_repasse;
                    statusRep = repasseData.status;
                    rDet = repasseData;
                }
            } catch (error) {
                console.error("Erro geral:", error);
            }

            const newMetrics: DashboardMetrics = {
                faturamentoBruto: faturamento,
                vendasQtd: qtd,
                repasseLiquido: repasseVal,
                statusRepasse: statusRep,
                registrosVendas: vRegs,
                detalhesRepasse: rDet,
                loading: false,
                fromCache: false,
                lastUpdated: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            // Atualiza estado de forma não-bloqueante
            startTransition(() => {
                setMetrics(newMetrics);
            });

            // Salva cache em background
            saveToCache(unidadeId, newMetrics);
            hasLoadedRef.current = true;
        };

        // IMPORTANTE: Adiar a busca para quando o browser estiver ocioso
        // Isso garante que a UI fique interativa primeiro
        if (cachedData.current) {
            // Temos cache = UI já está pronta, buscar em background quando ocioso
            requestIdleCallback(() => {
                loadData();
            }, { timeout: 1000 }); // Máximo 1s de espera
        } else {
            // Sem cache = precisa carregar, mas ainda assim adiar um pouco
            setTimeout(() => {
                loadData();
            }, 100); // Pequeno delay para UI montar
        }
    }, [unidadeId, dataInicial, dataFinal]);

    return metrics;
}


