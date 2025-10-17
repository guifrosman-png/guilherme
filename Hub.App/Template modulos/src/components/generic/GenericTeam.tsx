import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { 
  Users,
  Plus,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  Activity,
  Clock
} from 'lucide-react';

export function GenericTeam() {
  const teamMembers = [
    {
      id: 1,
      name: 'Ana Silva',
      role: 'Gerente de Projeto',
      email: 'ana.silva@empresa.com',
      phone: '(11) 99999-0001',
      location: 'São Paulo, SP',
      status: 'online',
      rating: 4.8,
      tasksCompleted: 45,
      performance: 92
    },
    {
      id: 2,
      name: 'Carlos Santos',
      role: 'Desenvolvedor Senior',
      email: 'carlos.santos@empresa.com',
      phone: '(11) 99999-0002',
      location: 'Rio de Janeiro, RJ',
      status: 'busy',
      rating: 4.9,
      tasksCompleted: 38,
      performance: 95
    },
    {
      id: 3,
      name: 'Maria Oliveira',
      role: 'Designer UX',
      email: 'maria.oliveira@empresa.com',
      phone: '(11) 99999-0003',
      location: 'Belo Horizonte, MG',
      status: 'offline',
      rating: 4.7,
      tasksCompleted: 29,
      performance: 88
    },
    {
      id: 4,
      name: 'João Costa',
      role: 'Analista de Dados',
      email: 'joao.costa@empresa.com',
      phone: '(11) 99999-0004',
      location: 'Porto Alegre, RS',
      status: 'online',
      rating: 4.6,
      tasksCompleted: 33,
      performance: 90
    },
    {
      id: 5,
      name: 'Paula Lima',
      role: 'Marketing Digital',
      email: 'paula.lima@empresa.com',
      phone: '(11) 99999-0005',
      location: 'Fortaleza, CE',
      status: 'online',
      rating: 4.8,
      tasksCompleted: 41,
      performance: 93
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-success-500';
      case 'busy': return 'bg-warning-500';
      case 'offline': return 'bg-neutral-400';
      default: return 'bg-neutral-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'busy': return 'Ocupado';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  const totalMembers = teamMembers.length;
  const onlineMembers = teamMembers.filter(m => m.status === 'online').length;
  const avgPerformance = teamMembers.reduce((sum, m) => sum + m.performance, 0) / totalMembers;
  const totalTasksCompleted = teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Equipe</h2>
          <p className="text-neutral-600">Gerencie membros e acompanhe performance</p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      {/* Estatísticas da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-primary">{totalMembers}</div>
            <p className="widget-change text-neutral-500">5 ativos</p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Online Agora</CardTitle>
            <Activity className="h-4 w-4 text-success-500" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-success-600">{onlineMembers}</div>
            <p className="widget-change text-neutral-500">
              {((onlineMembers / totalMembers) * 100).toFixed(0)}% da equipe
            </p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Performance Média</CardTitle>
            <Award className="h-4 w-4 text-warning-500" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-warning-600">{avgPerformance.toFixed(1)}%</div>
            <p className="widget-change text-success-600">↗ +3.2% este mês</p>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="widget-title text-neutral-600">Tarefas Concluídas</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="widget-value text-primary">{totalTasksCompleted}</div>
            <p className="widget-change text-neutral-500">Este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Membros */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os membros da sua equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-white">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{member.name}</h3>
                      <Badge variant="outline">{getStatusLabel(member.status)}</Badge>
                    </div>
                    <p className="text-sm text-primary font-medium mb-1">{member.role}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{member.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3 w-3 text-warning-500 fill-current" />
                      <span className="text-sm font-medium">{member.rating}</span>
                    </div>
                    <p className="text-xs text-neutral-500">Avaliação</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-primary mb-1">{member.tasksCompleted}</div>
                    <p className="text-xs text-neutral-500">Tarefas</p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-success-600 mb-1">{member.performance}%</div>
                    <p className="text-xs text-neutral-500">Performance</p>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    Ver Perfil
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance da Equipe */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>
              Membros com melhor performance este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 3)
                .map((member, index) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-warning-500' : index === 1 ? 'bg-neutral-400' : 'bg-warning-600'
                    }`}>
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-neutral-600">{member.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-success-600">{member.performance}%</div>
                      <div className="text-xs text-neutral-500">{member.tasksCompleted} tarefas</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas atividades da equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'activity-1', user: 'Ana Silva', action: 'Completou projeto "Website Redesign"', time: '2h atrás' },
                { id: 'activity-2', user: 'Carlos Santos', action: 'Adicionou 3 novos commits ao repositório', time: '4h atrás' },
                { id: 'activity-3', user: 'Maria Oliveira', action: 'Enviou designs para aprovação', time: '6h atrás' },
                { id: 'activity-4', user: 'João Costa', action: 'Gerou relatório de analytics', time: '8h atrás' },
                { id: 'activity-5', user: 'Paula Lima', action: 'Atualizou campanha de marketing', time: '1d atrás' }
              ].map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-neutral-100 last:border-0">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                    <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}