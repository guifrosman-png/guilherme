import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { generateGenericStats, generateGenericDemoData } from '../../template-system/modules/generic-config';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Filter,
  Download
} from 'lucide-react';

export function GenericAnalytics() {
  const stats = generateGenericStats();
  const data = generateGenericDemoData();

  // Calcular dados para gráficos
  const categoryData = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthData = data.reduce((acc, item) => {
    const month = item.date.toLocaleDateString('pt-BR', { month: 'short' });
    acc[month] = (acc[month] || 0) + item.value;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Análises e Relatórios</h2>
          <p className="text-neutral-600">Insights detalhados dos seus dados</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Taxa de Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-success-600">+{stats.growth}%</div>
            <p className="widget-change text-neutral-500">vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-primary">
              {((stats.activeItems / stats.totalItems) * 100).toFixed(1)}%
            </div>
            <p className="widget-change text-neutral-500">Meta: 75%</p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Valor Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-warning-500" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-warning-600">
              R$ {stats.averageValue.toLocaleString('pt-BR')}
            </div>
            <p className="widget-change text-success-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8.2% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Eficiência</CardTitle>
            <Target className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-success-600">87%</div>
            <p className="widget-change text-neutral-500">Acima da meta</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Categoria */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>
              Análise da distribuição dos itens por prioridade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(categoryData).map(([category, count]) => {
              const percentage = (count / stats.totalItems) * 100;
              const label = category === 'high' ? 'Alta Prioridade' : 
                           category === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade';
              const color = category === 'high' ? 'text-error-600' : 
                           category === 'medium' ? 'text-warning-600' : 'text-success-600';
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${color}`}>{count}</span>
                      <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Status Overview */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Análise de Status</CardTitle>
            <CardDescription>
              Visão geral do status dos itens no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(statusData).map(([status, count]) => {
                const percentage = (count / stats.totalItems) * 100;
                const label = status === 'active' ? 'Ativos' : 
                             status === 'pending' ? 'Pendentes' : 'Inativos';
                const bgColor = status === 'active' ? 'bg-success-100' : 
                               status === 'pending' ? 'bg-warning-100' : 'bg-error-100';
                const textColor = status === 'active' ? 'text-success-700' : 
                                 status === 'pending' ? 'text-warning-700' : 'text-error-700';
                
                return (
                  <div key={status} className={`p-4 rounded-lg ${bgColor}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${textColor}`}>{label}</span>
                      <span className={`text-2xl font-bold ${textColor}`}>{count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={textColor}>{percentage.toFixed(1)}% do total</span>
                      <span className={textColor}>
                        {status === 'active' && '↗ Crescendo'}
                        {status === 'pending' && '⏳ Requer ação'}
                        {status === 'inactive' && '↘ Em declínio'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendências Temporais */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Análise Temporal</CardTitle>
          <CardDescription>
            Valores acumulados por período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(monthData).map(([month, value]) => (
              <div key={month} className="text-center p-4 bg-neutral-50 rounded-lg">
                <div className="text-sm text-neutral-600 mb-1">{month}</div>
                <div className="text-lg font-bold text-primary">
                  R$ {value.toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-neutral-500">
                  {Math.floor(Math.random() * 20) - 10 > 0 ? '+' : ''}
                  {(Math.floor(Math.random() * 20) - 10).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights e Recomendações */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Insights e Recomendações</CardTitle>
          <CardDescription>
            Análises automáticas baseadas nos seus dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-success-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-success-800">Crescimento Positivo</h4>
                <p className="text-sm text-success-700">
                  Seus dados mostram uma tendência de crescimento de {stats.growth}% comparado ao período anterior.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-warning-50 rounded-lg">
              <Target className="h-5 w-5 text-warning-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-warning-800">Atenção Necessária</h4>
                <p className="text-sm text-warning-700">
                  {stats.pendingItems} itens estão pendentes e podem necessitar de ação imediata.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-primary-800">Oportunidade</h4>
                <p className="text-sm text-primary-700">
                  A categoria de alta prioridade representa {stats.highPriority} itens. 
                  Considere focar recursos nesta área para maximizar resultados.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}