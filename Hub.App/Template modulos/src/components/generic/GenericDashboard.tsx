import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { generateGenericStats } from '../../template-system/modules/generic-config';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

export function GenericDashboard() {
  const stats = generateGenericStats();

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Total de Itens</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-primary">{stats.totalItems}</div>
            <p className="widget-change text-success-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +{stats.growth}% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Itens Ativos</CardTitle>
            <Users className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-success-600">{stats.activeItems}</div>
            <p className="widget-change text-neutral-500">
              {((stats.activeItems / stats.totalItems) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning-500" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-warning-600">{stats.pendingItems}</div>
            <p className="widget-change text-neutral-500">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Valor Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-primary">
              R$ {stats.totalValue.toLocaleString('pt-BR')}
            </div>
            <p className="widget-change text-neutral-500">
              Média: R$ {stats.averageValue.toLocaleString('pt-BR')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Distribuição por Prioridade</CardTitle>
            <CardDescription>
              Visão geral dos itens por nível de prioridade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Alta Prioridade</span>
                <span className="text-sm font-medium">{stats.highPriority}</span>
              </div>
              <Progress value={(stats.highPriority / stats.totalItems) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Média Prioridade</span>
                <span className="text-sm font-medium">{stats.mediumPriority}</span>
              </div>
              <Progress value={(stats.mediumPriority / stats.totalItems) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Baixa Prioridade</span>
                <span className="text-sm font-medium">{stats.lowPriority}</span>
              </div>
              <Progress value={(stats.lowPriority / stats.totalItems) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Status dos Itens</CardTitle>
            <CardDescription>
              Acompanhe o progresso e status geral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success-600">{stats.activeItems}</div>
                <div className="text-sm text-neutral-600">Ativos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning-600">{stats.pendingItems}</div>
                <div className="text-sm text-neutral-600">Pendentes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-error-600">{stats.inactiveItems}</div>
                <div className="text-sm text-neutral-600">Inativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Plus className="h-6 w-6" />
              <span>Adicionar Item</span>
            </Button>
            
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Eye className="h-6 w-6" />
              <span>Visualizar Dados</span>
            </Button>
            
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Edit className="h-6 w-6" />
              <span>Editar Configurações</span>
            </Button>
            
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <TrendingUp className="h-6 w-6" />
              <span>Ver Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Itens Recentes */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Itens Recentes</CardTitle>
          <CardDescription>
            Últimos itens adicionados ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <div className="font-medium">Item {item}</div>
                    <div className="text-sm text-neutral-600">Descrição do item {item}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item % 3 === 0 ? "default" : item % 2 === 0 ? "secondary" : "outline"}>
                    {item % 3 === 0 ? "Alta" : item % 2 === 0 ? "Média" : "Baixa"}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}