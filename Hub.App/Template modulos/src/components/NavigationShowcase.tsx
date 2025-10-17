import { useState } from 'react';
import { ResponsiveNavigation } from './ResponsiveNavigation';
import { MobileFrame, DesktopFrame } from './MobileFrame';
import { FinancialDashboard } from './FinancialDashboard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function NavigationShowcase() {
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="p-4 lg:pr-24">
            <FinancialDashboard />
          </div>
        );
      case 'transactions':
        return (
          <div className="p-4 lg:pr-24 h-full flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Transações
                  <Badge variant="outline">Em breve</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Secção dedicada à gestão detalhada de todas as transações financeiras.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'results':
        return (
          <div className="p-4 lg:pr-24 h-full flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Resultados
                  <Badge variant="outline">Em breve</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Análise detalhada dos resultados financeiros e performance.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'upload':
        return (
          <div className="p-4 lg:pr-24 h-full flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Upload
                  <Badge variant="outline">Em breve</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Upload de documentos, faturas e comprovantes financeiros.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      case 'health':
        return (
          <div className="p-4 lg:pr-24 h-full flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Saúde Financeira
                  <Badge variant="outline">Em breve</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Indicadores e métricas da saúde financeira geral.
                </p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="p-4 lg:pr-24">
            <FinancialDashboard />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-8">
      {/* Mobile Frame */}
      <div className="lg:hidden mb-8">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold mb-2">Mobile (375x812px)</h2>
          <p className="text-sm text-muted-foreground">Bottom Tab Bar com navegação fixa</p>
        </div>
        <MobileFrame>
          <div className="h-full pb-20 overflow-y-auto">
            {renderContent()}
          </div>
          <ResponsiveNavigation 
            activeItem={activeSection}
            onItemChange={setActiveSection}
          />
        </MobileFrame>
      </div>

      {/* Desktop Frame */}
      <div className="hidden lg:block">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Desktop (1440x900px)</h2>
          <p className="text-muted-foreground">Sidebar direita com navegação vertical</p>
        </div>
        <DesktopFrame>
          <div className="h-full relative">
            {renderContent()}
            <ResponsiveNavigation 
              activeItem={activeSection}
              onItemChange={setActiveSection}
            />
          </div>
        </DesktopFrame>
      </div>

      {/* Responsive View (quando não estiver nos frames específicos) */}
      <div className="mt-12 p-6 bg-white rounded-lg border border-neutral-200">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Vista Responsiva Real</h3>
          <p className="text-sm text-muted-foreground">
            A navegação adapta-se automaticamente ao tamanho do ecrã
          </p>
        </div>
        
        <div className="min-h-[400px] relative">
          {renderContent()}
          <ResponsiveNavigation 
            activeItem={activeSection}
            onItemChange={setActiveSection}
          />
        </div>
      </div>
    </div>
  );
}