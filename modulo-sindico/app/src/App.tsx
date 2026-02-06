import { useState } from 'react';
import { LayoutDashboard, CreditCard, FileBarChart, FileText, Users, FolderPlus, ShoppingBag, Search, Filter, Settings2, LayoutGrid, FileCheck, LifeBuoy, TrendingUp, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileTabBar } from './components/MobileTabBar';
import { NotificationPanel } from './components/NotificationPanel';
import { SearchModal } from './components/SearchModal';
import { FloatingButtons, FloatingAction } from './components/FloatingButtons';
import { Modal, ModalFooter } from './components/Modal';
import { ManagedFeature } from './components/ManagedFeature';

import { UniversalFilterMenu } from './components/Filters/UniversalFilterMenu';
import { FilterCapsules } from './components/Filters/FilterCapsules';
import { FilterCondition } from './components/Filters/types';
import { MiniCardsGrid } from './components/MiniCardsGrid';
import { ChartLibrariesPage } from './components/ChartLibrariesPage';
import { ReportsView } from './components/ReportsV2/ReportsView';
import { NewReportModal } from './components/ReportsV2/builder/NewReportModal';
import { SidebarProvider } from './components/ReportsV2/contexts/SidebarContext';
import { FinancialDataProvider } from './components/MiniCardsGrid/context/FinancialDataContext';
import { SindicoDataProvider } from './components/MiniCardsGrid/context/SindicoDataContext';
import { SalesView } from './components/Sales/SalesView';

import { UnitSupportTab } from './components/UnitSupport/UnitSupportTab';
import { useSindicoDashboard } from './hooks/useSindicoDashboard';
import { MetricaConfig } from './components/MiniCardsGrid/types';

import { ViewModeProvider, useViewMode } from './contexts/ViewModeContext';
import { PermissionsProvider } from './contexts/PermissionsContext';

import { PermissionsPanel } from './components/PermissionsPanel';

export default function App() {
  return (
    <SidebarProvider>
      <ViewModeProvider>
        <PermissionsProvider>
          <AppContent />
          <PermissionsPanel />
        </PermissionsProvider>
      </ViewModeProvider>
    </SidebarProvider>
  );
}

// Configuração dos Cards Específicos do Síndico (Definida fora ou com useMemo para evitar re-renders)
const SINDICO_METRICS_CONFIG: MetricaConfig[] = [
  {
    id: 'sind-faturamento',
    titulo: 'Faturamento Bruto',
    descricao: 'Vendas totais no período',
    icon: ShoppingBag,
    cor: 'text-green-600',
    borderColor: 'border-green-500',
    categoria: 'financeiro',
    context: 'sindico',
    getValue: (_data) => 0, // Fallback (usado apenas em modo legado)
    canvasConfig: { gridCols: 1, gridRows: 1, colorScheme: 'green' },
    canvasComponents: [{
      id: 'kpi-fat', type: 'kpi-unified', x: 0, y: 0, width: 1, height: 1,
      dataSource: {
        type: 'metrics',
        metricsQuery: { metric: 'sind-faturamento', aggregation: 'sum' }
      },
      props: { title: 'Faturamento Bruto', iconName: 'shopping-bag', valueSize: '32', format: 'currency' }
    }]
  },
  {
    id: 'sind-repasse',
    titulo: 'Repasse Líquido',
    descricao: 'Valor a receber (estimado)',
    icon: DollarSign,
    cor: 'text-blue-600',
    borderColor: 'border-blue-500',
    categoria: 'financeiro',
    context: 'sindico',
    getValue: (_data) => 0,
    canvasConfig: { gridCols: 1, gridRows: 1, colorScheme: 'blue' },
    canvasComponents: [{
      id: 'kpi-rep', type: 'kpi-unified', x: 0, y: 0, width: 1, height: 1,
      dataSource: {
        type: 'metrics',
        metricsQuery: { metric: 'sind-repasse', aggregation: 'sum' }
      },
      props: { title: 'Repasse Líquido', iconName: 'dollar-sign', valueSize: '32', format: 'currency' }
    }]
  },
  {
    id: 'sind-vendas-qtd',
    titulo: 'Qtd. Vendas',
    descricao: 'Volume de transações',
    icon: TrendingUp,
    cor: 'text-purple-600',
    borderColor: 'border-purple-500',
    categoria: 'financeiro',
    context: 'sindico',
    getValue: (_data) => 0,
    canvasConfig: { gridCols: 1, gridRows: 1, colorScheme: 'purple' },
    canvasComponents: [{
      id: 'kpi-qtd', type: 'kpi-unified', x: 0, y: 0, width: 1, height: 1,
      dataSource: {
        type: 'metrics',
        metricsQuery: { metric: 'sind-vendas-qtd', aggregation: 'sum' }
      },
      props: { title: 'Qtd. Vendas', iconName: 'trending-up', valueSize: '32', format: 'number' }
    }]
  }
];

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cardsPanelOpen, setCardsPanelOpen] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [newReportModalOpen, setNewReportModalOpen] = useState(false);
  const [reportCreationModule, setReportCreationModule] = useState<string>('all');
  const { isSindicoView } = useViewMode();

  // Dashboard filters
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState('');
  const [dashboardFilters, setDashboardFilters] = useState<FilterCondition[]>([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // --- DADOS DO DASHBOARD SÍNDICO ---
  // Unidade 12 fixa por enquanto
  const sindicoMetrics = useSindicoDashboard(12);

  // Extrair datas dos filtros para passar ao SindicoDataProvider
  const extractFilterDates = () => {
    let dataInicial: Date | undefined;
    let dataFinal: Date | undefined;

    dashboardFilters.forEach(filter => {
      if (filter.field === 'Data' || filter.field === 'data') {
        const filterDate = filter.value ? new Date(filter.value as string) : undefined;

        if (filter.operator === 'after') {
          dataInicial = filterDate;
        } else if (filter.operator === 'before') {
          dataFinal = filterDate;
        } else if (filter.operator === 'between' && filter.valueTo) {
          dataInicial = filterDate;
          dataFinal = new Date(filter.valueTo as string);
        }
      }
    });

    return { dataInicial, dataFinal };
  };

  const filterDates = extractFilterDates();

  const availableTags = [
    { id: 't1', label: 'Financeiro', color: 'bg-emerald-100 text-emerald-700' },
    { id: 't2', label: 'Operacional', color: 'bg-blue-100 text-blue-700' },
    { id: 't3', label: 'Vendas', color: 'bg-purple-100 text-purple-700' },
    { id: 't4', label: 'Suporte', color: 'bg-amber-100 text-amber-700' },
    { id: 't5', label: 'Crítico', color: 'bg-red-100 text-red-700' },
  ];

  const availableMembers = [
    { id: 'm1', name: 'João Silva', avatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=random' },
    { id: 'm2', name: 'Maria Santos', avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=random' },
  ];

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success' as const,
      title: 'Sincronização concluída',
      message: 'Todos os dados foram sincronizados com sucesso.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    }
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const floatingActions: FloatingAction[] = [
    {
      id: 'report',
      icon: <FileBarChart className="h-5 w-5" />,
      label: 'Novo Relatório Financeiro',
      description: 'Criar relatório financeiro',
      color: 'from-green-500 to-green-600',
      onClick: () => {
        setNewReportModalOpen(true);
      }
    },
    {
      id: 'create-card',
      icon: <LayoutGrid className="h-5 w-5" />,
      label: 'Novo Card',
      description: 'Criar componente',
      color: 'from-orange-500 to-orange-600',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('open-card-creator'));
      }
    }
  ];

  const navigationItems = [
    { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'kanban', icon: ShoppingBag, label: 'Vendas' },
    { id: 'results', icon: FileCheck, label: 'Fechamentos' },
    { id: 'support', icon: LifeBuoy, label: 'Suporte' }
  ];

  const mobileTabItems = [
    { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'kanban', icon: ShoppingBag, label: 'Vendas' },
    { id: 'results', icon: FileCheck, label: 'Fechamentos' },
    { id: 'support', icon: LifeBuoy, label: 'Suporte' }
  ];

  return (
    <SindicoDataProvider
      dataInicial={filterDates.dataInicial}
      dataFinal={filterDates.dataFinal}
    >
      <FinancialDataProvider filters={dashboardFilters}>
        <div className="min-h-screen bg-transparent">
          <div className="hidden md:block h-screen">
            <Header
              title="Portal do Síndico"
              notificationCount={notifications.length}
              onSearchClick={() => setSearchModalOpen(true)}
              onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              onSettingsClick={() => alert('Configurações')}
              className={`
            transition-all duration-300 ease-out
            ${cardsPanelOpen
                  ? 'right-[320px]'
                  : sidebarCollapsed ? 'right-32' : 'right-80'
                }
          `}
            />

            <main className={`
          h-screen overflow-auto pt-24 px-8 pb-8
          transition-all duration-300 ease-out
          ${cardsPanelOpen
                ? 'pr-[336px]'
                : sidebarCollapsed ? 'pr-40' : 'pr-84'
              }
        `}>
              <div className="w-full h-full">
                {/* 1. DASHBOARD HOME */}
                <div className={clsx("w-full h-full", currentPage !== 'home' && "hidden")}>
                  <ManagedFeature id="dashboard" label="Dashboard Inicial" className="h-full">
                    <MiniCardsGrid
                      key="dashboard-sindico"
                      variant="flat"
                      dashboardId="sindico-home"
                      contextFilter="all"
                      readOnly={false}
                      filterContent={
                        <FilterCapsules
                          filters={dashboardFilters}
                          setFilters={setDashboardFilters}
                        />
                      }
                      availableMetrics={SINDICO_METRICS_CONFIG}
                      initialMetrics={[
                        { id: 'sind-faturamento', size: '2x1', row: 0, col: 0 },
                        { id: 'sind-repasse', size: '2x1', row: 0, col: 2 },
                        { id: 'sind-vendas-qtd', size: '2x1', row: 0, col: 4 },
                      ]}
                      data={sindicoMetrics}
                      onPanelToggle={setCardsPanelOpen}
                      toolbarContent={
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <ManagedFeature id="dashboard.search" label="Busca">
                              <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Buscar métricas..."
                                  value={dashboardSearchQuery}
                                  onChange={(e) => setDashboardSearchQuery(e.target.value)}
                                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all"
                                />
                              </div>
                            </ManagedFeature>
                          </div>

                          <div className="flex items-center gap-2">
                            <ManagedFeature id="dashboard.filters" label="Filtros">
                              <div className="relative">
                                <button
                                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                  className={clsx(
                                    "flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg transition-colors",
                                    isFilterMenuOpen ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-600 bg-white hover:bg-gray-50"
                                  )}
                                >
                                  <Filter className="w-4 h-4" />
                                  <span>Filtros</span>
                                  {dashboardFilters.length > 0 && (
                                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                                  )}
                                </button>

                                {isFilterMenuOpen && (
                                  <UniversalFilterMenu
                                    filters={dashboardFilters}
                                    setFilters={setDashboardFilters}
                                    availableTags={availableTags}
                                    availableMembers={availableMembers}
                                    onClose={() => setIsFilterMenuOpen(false)}
                                  />
                                )}
                              </div>
                            </ManagedFeature>


                          </div>
                        </div>
                      }
                    />
                  </ManagedFeature>
                </div>

                {/* 2. VENDAS (INBOX) */}
                <div className={clsx("w-full h-full", currentPage !== 'kanban' && "hidden")}>
                  <ManagedFeature id="sales" label="Aba de Vendas" className="h-full">
                    <SalesView />
                  </ManagedFeature>
                </div>

                {/* 3. FECHAMENTOS (REPORTS) */}
                <div className={clsx("w-full h-full", currentPage !== 'results' && "hidden")}>
                  <ManagedFeature id="reports" label="Aba de Fechamentos" className="h-full">
                    <div className="h-[calc(100vh-140px)]">
                      <ReportsView />
                    </div>
                  </ManagedFeature>
                </div>

                {/* 4. SUPORTE */}
                <div className={clsx("w-full h-full", currentPage !== 'support' && "hidden")}>
                  <ManagedFeature id="support" label="Aba de Suporte" className="h-full">
                    <UnitSupportTab />
                  </ManagedFeature>
                </div>

                {/* 5. CHARTS (SHOWCASE) */}
                <div className={clsx("w-full h-full", currentPage !== 'charts' && "hidden")}>
                  <ChartLibrariesPage />
                </div>
              </div>
            </main>

            <Sidebar
              collapsed={sidebarCollapsed}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              navigationItems={navigationItems}
            />
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden min-h-screen pb-28">
            <Header
              title="Portal do Síndico"
              notificationCount={notifications.length}
              onSearchClick={() => setSearchModalOpen(true)}
              onNotificationClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
              onSettingsClick={() => alert('Configurações')}
              className="left-4 right-4 top-4"
            />

            <main className="px-4 pt-24 pb-6">
              <div className="max-w-[calc(100vw-32px)] mx-auto">
                <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 p-4">
                  <p>Dashboard Mobile em construção...</p>
                </div>
              </div>
            </main>

            <MobileTabBar
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              tabItems={mobileTabItems}
            />
          </div>

          <NotificationPanel
            isOpen={notificationPanelOpen}
            onClose={() => setNotificationPanelOpen(false)}
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onClearAll={handleClearAll}
            sidebarCollapsed={sidebarCollapsed}
          />

          <SearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            onSelectItem={(item) => {
              console.log('Item selecionado:', item)
            }}
          />

          <FloatingButtons
            actions={floatingActions}
            mainButtonLabel="Menu de ações"
            onMainClick={() => setQuickAddModalOpen(true)}
            contextModule={currentPage === 'financeiro' ? 'financeiro' : 'all'}
            onCreateReport={(module) => {
              setReportCreationModule(module);
              setNewReportModalOpen(true);
            }}
            onCreateCard={() => {
              window.dispatchEvent(new CustomEvent('open-card-creator'));
            }}
          />

          <Modal
            isOpen={quickAddModalOpen}
            onClose={() => setQuickAddModalOpen(false)}
            title="Criação Rápida"
            description="Escolha o que deseja criar"
            footer={
              <ModalFooter
                onCancel={() => setQuickAddModalOpen(false)}
                cancelText="Fechar"
              />
            }
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: FileText, label: 'Documento', color: 'bg-blue-100 text-blue-600' },
                { icon: Users, label: 'Contato', color: 'bg-purple-100 text-purple-600' },
                { icon: FolderPlus, label: 'Pasta', color: 'bg-amber-100 text-amber-600' },
                { icon: CreditCard, label: 'Transação', color: 'bg-emerald-100 text-emerald-600' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    alert(`Criar: ${item.label}`);
                    setQuickAddModalOpen(false);
                  }}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </button>
              ))}
            </div>
          </Modal>

          <NewReportModal
            isOpen={newReportModalOpen}
            contextFilter={reportCreationModule}
            onClose={() => setNewReportModalOpen(false)}
            onSelectTemplate={(_template: any) => {
              setNewReportModalOpen(false);
              setCurrentPage('results');
            }}
          />
        </div>
      </FinancialDataProvider>
    </SindicoDataProvider>
  );
}
