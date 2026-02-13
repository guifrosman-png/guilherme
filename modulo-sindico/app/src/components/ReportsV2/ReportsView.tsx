
import { useState, useEffect } from 'react';
import { SidebarProvider } from './contexts/SidebarContext';
import { useReportsPermissions } from './contexts/ReportsPermissionsContext'; // Importar hook
import { ReportsSidebar } from './ReportsSidebar';
import { FinancialStatementView } from './FinancialStatementView';
import { ReportsHistoryView } from './ReportsHistoryView';
import { mercatusService } from '../../services/mercatusService';
import { repasseService } from '../../services/repasseService';

// Auxiliar para converter ID de relatório em objeto de data
const parseReportId = (id: string) => {
    if (id === 'current-month') {
        const now = new Date();
        return { month: now.getMonth() + 1, year: now.getFullYear() };
    }

    if (id.startsWith('report-')) {
        const parts = id.split('-'); // ['report', '2', '2026']
        if (parts.length === 3) {
            return { month: parseInt(parts[1], 10), year: parseInt(parts[2], 10) };
        }
    }

    const map: Record<string, { month: number, year: number }> = {
        'report-jan-26': { month: 1, year: 2026 },
        'report-dez-25': { month: 12, year: 2025 },
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

    // Permissões
    const { permissions } = useReportsPermissions();
    const showSidebar = permissions.inbox?.showSidebarMaster ?? true;

    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Carregamento de dados
    useEffect(() => {
        if (activeSidebarItem === 'history') {
            return;
        }

        async function loadData() {
            setLoading(true);
            setError(null);

            const { month, year } = parseReportId(activeSidebarItem);

            try {
                const [apiTotals, repasseInfo] = await Promise.all([
                    mercatusService.getFinancialTotals(month, year),
                    repasseService.getRepasseAtual(12)
                ]);

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

    const handleSidebarClick = (itemId: string) => {
        setActiveSidebarItem(itemId);
    };

    const handleToggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    // Renderização do Conteúdo
    const renderContent = () => {
        if (activeSidebarItem === 'history') {
            return (
                <div className="h-full overflow-y-auto">
                    <ReportsHistoryView
                        onSelectReport={(id) => setActiveSidebarItem(id)}
                    />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-red-400 p-6 text-center">
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-sm underline hover:text-red-500"
                    >
                        Tentar novamente
                    </button>
                </div>
            );
        }

        const displayData = reportData || {
            month: MONTH_NAMES[parseReportId(activeSidebarItem).month],
            year: parseReportId(activeSidebarItem).year,
            status: 'OPEN',
            grossSales: 0,
            contractRate: 0,
            netValue: 0,
            paymentDate: '',
            documents: { reportPdfUrl: null, proofImageUrl: null }
        };

        return (
            <div className="h-full overflow-y-auto">
                <FinancialStatementView
                    data={displayData}
                    isLoading={loading}
                />
            </div>
        );
    };

    return (
        <SidebarProvider>
            <div className="flex h-full gap-3 p-3 bg-transparent overflow-hidden relative">
                {showSidebar && (
                    <ReportsSidebar
                        activeItem={activeSidebarItem}
                        onItemClick={handleSidebarClick}
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={handleToggleSidebar}
                    />
                )}

                <main className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden relative shadow-sm">
                    {renderContent()}
                </main>
            </div>
        </SidebarProvider>
    );
}

export default ReportsView;
