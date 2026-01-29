import { useState, useEffect } from 'react';
import { mercatusService } from '../services/mercatusService';
import { repasseService } from '../services/repasseService';

export interface DashboardMetrics {
    faturamentoBruto: number; // API Mercatus
    repasseLiquido: number;   // SQL Repasses
    vendasQtd: number;        // API Mercatus
    statusRepasse: string;    // SQL Repasses
    registrosVendas: any[];   // LISTA DE VENDAS (Para Drill-Down)
    detalhesRepasse: any;     // OBJETO REPASSE COMPLETO (Para Drill-Down)
    loading: boolean;
}

// Parâmetros opcionais de data para filtragem
export interface SindicoDashboardParams {
    unidadeId: number;
    dataInicial?: Date | string;
    dataFinal?: Date | string;
}

export function useSindicoDashboard(params: SindicoDashboardParams | number) {
    // Compatibilidade com chamada antiga (só unidadeId)
    const config: SindicoDashboardParams = typeof params === 'number'
        ? { unidadeId: params }
        : params;

    const { unidadeId, dataInicial, dataFinal } = config;

    const [metrics, setMetrics] = useState<DashboardMetrics>({
        faturamentoBruto: 0,
        repasseLiquido: 0,
        vendasQtd: 0,
        statusRepasse: '...',
        registrosVendas: [],
        detalhesRepasse: null,
        loading: true
    });

    useEffect(() => {
        const loadData = async () => {
            setMetrics(prev => ({ ...prev, loading: true }));

            let faturamento = 0;
            let qtd = 0;
            let repasseVal = 0;
            let statusRep = 'N/A';
            let vRegs: any[] = [];
            let rDet: any = null;

            // 1. Tentar Buscar Vendas (API Mercatus)
            try {
                // Usar datas do parâmetro ou padrão (mês atual)
                const now = new Date();
                const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const defaultEnd = now;

                const startDate = dataInicial
                    ? (typeof dataInicial === 'string' ? new Date(dataInicial) : dataInicial)
                    : defaultStart;
                const endDate = dataFinal
                    ? (typeof dataFinal === 'string' ? new Date(dataFinal) : dataFinal)
                    : defaultEnd;

                // Formatar para API (YYYY-MM-DD HH:MM:SS)
                const formatForApi = (d: Date) => d.toISOString().slice(0, 19).replace('T', ' ');

                const vendasData = await mercatusService.getSales({
                    unidadeId,
                    dataInicial: formatForApi(startDate),
                    dataFinal: formatForApi(endDate),
                    portalSindico: 'S'
                });

                if (vendasData && vendasData.registros) {
                    vRegs = vendasData.registros;
                    faturamento = vRegs.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);
                    qtd = vendasData.paginacao.qtdTotalRegistros || vRegs.length;
                }
            } catch (error) {
                console.error("Erro parcial (Vendas):", error);
            }

            // 2. Tentar Buscar Repasse (CSV/DB)
            try {
                const repasseData = await repasseService.getRepasseAtual(unidadeId);
                if (repasseData) {
                    repasseVal = repasseData.valor_liquido_repasse;
                    statusRep = repasseData.status;
                    rDet = repasseData;
                }
            } catch (error) {
                console.error("Erro parcial (Repasse):", error);
            }

            setMetrics({
                faturamentoBruto: faturamento,
                vendasQtd: qtd,
                repasseLiquido: repasseVal,
                statusRepasse: statusRep,
                registrosVendas: vRegs,
                detalhesRepasse: rDet,
                loading: false
            });
        };

        loadData();
    }, [unidadeId, dataInicial, dataFinal]);

    return metrics;
}
