import { useState } from 'react';
import { BaseModuleLayout } from './template-system/BaseModuleLayout';
import { ModuleProvider } from './template-system/ModuleProvider';
import { createGenericModule, generateGenericDemoData } from './template-system/modules/generic-config';
import { GenericDashboard } from './components/generic/GenericDashboard';
import { GenericDataView } from './components/generic/GenericDataView';
import { GenericAnalytics } from './components/generic/GenericAnalytics';
import { GenericTeam } from './components/generic/GenericTeam';
import { GenericSettings } from './components/generic/GenericSettings';

export default function App() {
  // 🎯 TEMPLATE GENÉRICO - Configure seu módulo personalizado aqui!
  const moduleConfig = createGenericModule({
    // Personalize estas configurações para criar seu módulo
    id: 'meu-modulo-personalizado',
    name: 'Meu Módulo',
    title: 'Template Genérico',
    description: 'Base reutilizável para criar qualquer tipo de módulo',
    
    // Personalizar cores do tema
    colors: {
      primary: '#10b981', // Verde do MultiFins
      secondary: '#0f172a', // Azul escuro
      accent: '#3b82f6',   // Azul
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    
    // Personalizar filtros de período (opcional)
    periodFilter: {
      enabled: true,
      title: 'Filtros de Período',
      description: 'Selecione o período para análise dos dados do seu módulo',
      defaultPeriods: [
        { id: 'semanal', label: 'Últimos 7 dias', days: 7 },
        { id: 'mensal', label: 'Últimos 30 dias', days: 30 },
        { id: 'trimestral', label: 'Últimos 3 meses', days: 90 },
        { id: 'anual', label: 'Último ano', days: 365 }
      ],
      allowCustomPeriod: true
    }
  });
  
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPeriod, setSelectedPeriod] = useState('semanal'); // 7d por padrão
  
  // Dados demo genéricos
  const initialData = generateGenericDemoData();

  // Função para lidar com mudanças de período
  const handlePeriodChange = (period: string, customDates?: { start: string; end: string }) => {
    setSelectedPeriod(period);
    if (customDates) {
      console.log(`Período personalizado selecionado: ${customDates.start} até ${customDates.end}`);
      // Aqui você pode processar as datas customizadas
    } else {
      console.log(`Período pré-definido selecionado: ${period}`);
    }
  };

  // 🚀 Renderizar o conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <GenericDashboard />;
      case 'data':
        return <GenericDataView />;
      case 'analytics':
        return <GenericAnalytics />;
      case 'team':
        return <GenericTeam />;
      case 'settings':
        return <GenericSettings />;
      default:
        return <GenericDashboard />;
    }
  };

  return (
    <ModuleProvider 
      config={moduleConfig} 
      initialData={initialData}
    >
      <BaseModuleLayout
        config={moduleConfig}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
      >
        {renderContent()}
      </BaseModuleLayout>
    </ModuleProvider>
  );
}