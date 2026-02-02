
import { useState, useEffect } from 'react';
import { SidebarProvider } from './contexts/SidebarContext';
import { ReportsSidebar } from './ReportsSidebar';
import { FinancialStatementView } from './FinancialStatementView';
import { mercatusService } from '../../services/mercatusService';
import { repasseService } from '../../services/repasseService';
import { Loader2 } from 'lucide-react';

// Auxiliar para converter ID de relatório em objeto de data
// Ex: 'report-jan-26' -> { month: 1, year: 2026 }
const parseReportId = (id: string) => {
    if (id === 'current-month') {
        const now = new Date();
        return { month: now.getMonth() + 1, year: now.getFullYear() };
    }

    // Mapeamento manual para IDs de meses conforme ReportsSidebar
    const map: Record<string, { month: number, year: number }> = {
        'report-jan-26': { month: 1, year: 2026 },
        'report-dez-25': { month: 12, year: 2025 },
        'report-nov-25': { month: 11, year: 2025 },
        'report-out-25': { month: 10, year: 2025 },
        'report-set-25': { month: 9, year: 2025 },
        'report-ago-25': { month: 8, year: 2025 },
        'report-jul-25': { month: 7, year: 2025 },
        'report-jun-25': { month: 6, year: 2025 },
        'report-mai-25': { month: 5, year: 2025 },
        'report-abr-25': { month: 4, year: 2025 },
        'report-mar-25': { month: 3, year: 2025 },
        'report-fev-25': { month: 2, year: 2025 },
        'report-jan-25': { month: 1, year: 2025 },
    };

    return map[id] || { month: 1, year: 2026 };
};

const MONTH_NAMES = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function ReportsView() {
    // Estado
    const [activeSidebarItem, setActiveSidebarItem] = useState('current-month');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregamento de dados REAIS
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError(null);

            try {
                const { month, year } = parseReportId(activeSidebarItem);

                // 1. Busca dados de vendas REAIS da API
                const apiTotals = await mercatusService.getFinancialTotals(month, year);

                // 2. Busca dados de repasse (Alíquota/Status) do Banco/CSV
                // Aqui estamos simulando a busca por unidadeId = 12 conforme docs
                const repasseInfo = await repasseService.getRepasseAtual(12);

                // 3. Monta o objeto final
                setReportData({
                    month: MONTH_NAMES[month],
                    year: year,
                    status: repasseInfo?.status || 'OPEN',
                    grossSales: apiTotals.grossSales,
                    contractRate: repasseInfo?.valor_comissao || 5.0,
                    netValue: (apiTotals.grossSales * (repasseInfo?.valor_comissao || 5.0)) / 100,
                    paymentDate: repasseInfo?.data_processamento ? new Date(repasseInfo.data_processamento).toLocaleDateString() : null,
                    documents: {
                        reportPdfUrl: repasseInfo?.arquivo_comprovante ? `/docs/${repasseInfo.arquivo_comprovante}` : null,
                        proofImageUrl: repasseInfo?.arquivo_comprovante ? `/docs/${repasseInfo.arquivo_comprovante}` : null
                    },
                    calculationDetail: {
                        credito: apiTotals.detail.credito,
                        debito: apiTotals.detail.debito,
                        pix: apiTotals.detail.pix,
                        outros: apiTotals.detail.outros,
                        cancellations: apiTotals.cancellations
                    }
                });

            } catch (err) {
                console.error('Erro ao carregar dados reais:', err);
                setError('Não foi possível carregar as informações reais deste período.');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [activeSidebarItem]);

    // Handlers
    const handleSidebarClick = (itemId: string) => {
        setActiveSidebarItem(itemId);
    };

    const handleToggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    return (
        <SidebarProvider>
            <div className="flex h-full gap-3 p-3 bg-transparent overflow-hidden">
                <ReportsSidebar
                    activeItem={activeSidebarItem}
                    onItemClick={handleSidebarClick}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={handleToggleSidebar}
                />

                <main className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden relative">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-[#525a52]" />
                            <p className="animate-pulse">Buscando dados reais na API...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-400 p-6 text-center">
                            <p>{error}</p>
                            <button
                                onClick={() => setActiveSidebarItem(activeSidebarItem)}
                                className="mt-4 text-sm underline hover:text-red-500"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    ) : reportData ? (
                        <div className="h-full overflow-y-auto">
                            <FinancialStatementView data={reportData} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <p>Selecione um período para visualizar.</p>
                        </div>
                    )}
                </main>
            </div>
        </SidebarProvider>
    );
}

export default ReportsView;

