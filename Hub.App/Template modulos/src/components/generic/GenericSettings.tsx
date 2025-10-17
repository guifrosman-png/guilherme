import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export function GenericSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Configurações Gerais
    moduleName: 'Módulo Genérico',
    companyName: 'Minha Empresa',
    email: 'admin@empresa.com',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    
    // Notificações
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Privacidade
    dataSharing: false,
    analytics: true,
    cookieConsent: true,
    
    // Interface
    darkMode: false,
    compactView: false,
    animationsEnabled: true,
    
    // Segurança
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Salvando configurações:', settings);
    // Aqui você implementaria a lógica de salvamento
  };

  const handleExport = () => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'configuracoes-modulo.json';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações do Módulo</h2>
          <p className="text-neutral-600">Personalize o comportamento e aparência do módulo</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Configurações Gerais */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Informações básicas do módulo e da organização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="moduleName">Nome do Módulo</Label>
              <Input
                id="moduleName"
                value={settings.moduleName}
                onChange={(e) => handleSettingChange('moduleName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Principal</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <select 
                id="language"
                className="w-full p-2 border rounded-md"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como e quando receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium">Notificações por Email</h4>
              <p className="text-sm text-neutral-600">Receba atualizações importantes por email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium">Notificações Push</h4>
              <p className="text-sm text-neutral-600">Notificações em tempo real no navegador</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium">Notificações SMS</h4>
              <p className="text-sm text-neutral-600">Alertas urgentes via mensagem de texto</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Premium</Badge>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface e Aparência */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Interface e Aparência
          </CardTitle>
          <CardDescription>
            Personalize a aparência e comportamento da interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium">Modo Escuro</h4>
              <p className="text-sm text-neutral-600">Interface com cores escuras</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium">Visualização Compacta</h4>
              <p className="text-sm text-neutral-600">Exibe mais informações em menos espaço</p>
            </div>
            <Switch
              checked={settings.compactView}
              onCheckedChange={(checked) => handleSettingChange('compactView', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium">Animações</h4>
              <p className="text-sm text-neutral-600">Transições suaves e micro-interações</p>
            </div>
            <Switch
              checked={settings.animationsEnabled}
              onCheckedChange={(checked) => handleSettingChange('animationsEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Segurança e Privacidade
          </CardTitle>
          <CardDescription>
            Configure opções de segurança e privacidade dos dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium">Autenticação de Dois Fatores</h4>
              <p className="text-sm text-neutral-600">Camada extra de segurança para login</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Recomendado</Badge>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Expiração da Senha (dias)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium">Compartilhamento de Dados</h4>
              <p className="text-sm text-neutral-600">Permitir análises anônimas para melhorias</p>
            </div>
            <Switch
              checked={settings.dataSharing}
              onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Backup e Dados */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Backup e Gerenciamento de Dados</CardTitle>
          <CardDescription>
            Gerencie seus dados, faça backup e restauração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Download className="h-6 w-6" />
              <span>Baixar Backup</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Upload className="h-6 w-6" />
              <span>Restaurar Dados</span>
            </Button>
            
            <Button variant="destructive" className="h-20 flex flex-col gap-2">
              <Trash2 className="h-6 w-6" />
              <span>Limpar Dados</span>
            </Button>
          </div>
          
          <div className="p-4 bg-warning-50 rounded-lg">
            <p className="text-sm text-warning-800">
              <strong>Atenção:</strong> Faça backup regularmente dos seus dados. 
              A exclusão de dados é permanente e não pode ser desfeita.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status do Sistema */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>
            Informações sobre o funcionamento do módulo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600">99.9%</div>
              <div className="text-sm text-success-700">Uptime</div>
            </div>
            
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">1.2GB</div>
              <div className="text-sm text-primary-700">Dados Armazenados</div>
            </div>
            
            <div className="text-center p-4 bg-warning-50 rounded-lg">
              <div className="text-2xl font-bold text-warning-600">24ms</div>
              <div className="text-sm text-warning-700">Latência Média</div>
            </div>
            
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-bold text-neutral-600">v1.0.0</div>
              <div className="text-sm text-neutral-700">Versão Atual</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}