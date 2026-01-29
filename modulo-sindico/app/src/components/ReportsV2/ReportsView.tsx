
import { useState, useEffect } from 'react';
import { SidebarProvider } from './contexts/SidebarContext';
import { ReportsSidebar } from './ReportsSidebar';
import { FinancialStatementView } from './FinancialStatementView';

// ==================== DADOS MOCKADOS (SERVIÇO FUTURO) ====================

const MOCK_STATEMENTS: Record<string, any> = {
    // 2026
    'current-month': {
        month: 'Janeiro', year: 2026, status: 'OPEN', grossSales: 12450.90, contractRate: 5.0, netValue: 622.54,
        paymentDate: null, documents: { reportPdfUrl: 'mock', proofImageUrl: null }
    },
    'report-jan-26': {
        month: 'Janeiro', year: 2026, status: 'OPEN', grossSales: 12450.90, contractRate: 5.0, netValue: 622.54,
        paymentDate: null, documents: { reportPdfUrl: 'mock', proofImageUrl: null }
    },

    // 2025
    'report-dez-25': {
        month: 'Dezembro', year: 2025, status: 'PAID', grossSales: 18950.00, contractRate: 5.0, netValue: 947.50,
        paymentDate: '05/01/2026', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-nov-25': {
        month: 'Novembro', year: 2025, status: 'PAID', grossSales: 14200.50, contractRate: 5.0, netValue: 710.02,
        paymentDate: '05/12/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-out-25': {
        month: 'Outubro', year: 2025, status: 'PAID', grossSales: 13800.20, contractRate: 5.0, netValue: 690.01,
        paymentDate: '05/11/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-set-25': {
        month: 'Setembro', year: 2025, status: 'PAID', grossSales: 12100.00, contractRate: 5.0, netValue: 605.00,
        paymentDate: '05/10/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-ago-25': {
        month: 'Agosto', year: 2025, status: 'PAID', grossSales: 11500.50, contractRate: 5.0, netValue: 575.02,
        paymentDate: '05/09/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-jul-25': {
        month: 'Julho', year: 2025, status: 'PAID', grossSales: 15200.00, contractRate: 5.0, netValue: 760.00,
        paymentDate: '05/08/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-jun-25': {
        month: 'Junho', year: 2025, status: 'PAID', grossSales: 14100.80, contractRate: 5.0, netValue: 705.04,
        paymentDate: '05/07/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-mai-25': {
        month: 'Maio', year: 2025, status: 'PAID', grossSales: 13500.20, contractRate: 5.0, netValue: 675.01,
        paymentDate: '05/06/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-abr-25': {
        month: 'Abril', year: 2025, status: 'PAID', grossSales: 12800.00, contractRate: 5.0, netValue: 640.00,
        paymentDate: '05/05/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-mar-25': {
        month: 'Março', year: 2025, status: 'PAID', grossSales: 11200.50, contractRate: 5.0, netValue: 560.02,
        paymentDate: '05/04/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-fev-25': {
        month: 'Fevereiro', year: 2025, status: 'PAID', grossSales: 10500.00, contractRate: 5.0, netValue: 525.00,
        paymentDate: '05/03/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    },
    'report-jan-25': {
        month: 'Janeiro', year: 2025, status: 'PAID', grossSales: 9800.00, contractRate: 5.0, netValue: 490.00,
        paymentDate: '05/02/2025', documents: { reportPdfUrl: 'mock', proofImageUrl: 'mock' }
    }
};

export function ReportsView() {
    // Estado
    const [activeSidebarItem, setActiveSidebarItem] = useState('current-month');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Handlers
    const handleSidebarClick = (itemId: string) => {
        setActiveSidebarItem(itemId);
    };

    const handleToggleSidebar = () => {
        setSidebarCollapsed(prev => !prev);
    };

    // Selecionar dados baseados no item da sidebar
    const currentData = MOCK_STATEMENTS[activeSidebarItem];

    return (
        <SidebarProvider>
            <div className="flex h-full gap-3 p-3 bg-transparent overflow-hidden">
                {/* Sidebar com navegação de meses */}
                <ReportsSidebar
                    activeItem={activeSidebarItem}
                    onItemClick={handleSidebarClick}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={handleToggleSidebar}
                />

                {/* Area Principal */}
                <main className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden relative">
                    {currentData ? (
                        <div className="h-full overflow-y-auto">
                            <FinancialStatementView data={currentData} />
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
