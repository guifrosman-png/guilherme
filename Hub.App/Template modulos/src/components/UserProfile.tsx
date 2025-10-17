import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  HelpCircle,
  CreditCard,
  Shield
} from 'lucide-react';

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);

  // Mock user data - em produção viria de um contexto ou API
  const userData = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    initials: 'JS',
    avatar: '', // URL vazia para mostrar as iniciais
    plan: 'Premium',
    notificationsCount: 3
  };

  const handleProfileAction = (action: string) => {
    console.log(`Ação do perfil: ${action}`);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback 
              className="text-xs font-medium"
              style={{
                backgroundColor: 'var(--color-primary-100)',
                color: 'var(--color-primary-700)'
              }}
            >
              {userData.initials}
            </AvatarFallback>
          </Avatar>
          
          {/* Indicador de notificações */}
          {userData.notificationsCount > 0 && (
            <div 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium text-white"
              style={{ backgroundColor: 'var(--color-error-500)' }}
            >
              {userData.notificationsCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0" 
        align="end" 
        alignOffset={-8}
      >
        {/* Header do perfil */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback 
                className="text-sm font-medium"
                style={{
                  backgroundColor: 'var(--color-primary-100)',
                  color: 'var(--color-primary-700)'
                }}
              >
                {userData.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{userData.name}</p>
              <p className="text-sm text-muted-foreground truncate">{userData.email}</p>
              <Badge 
                variant="secondary" 
                className="mt-1 text-xs"
                style={{
                  backgroundColor: 'var(--color-primary-50)',
                  color: 'var(--color-primary-700)'
                }}
              >
                {userData.plan}
              </Badge>
            </div>
          </div>
        </div>

        {/* Menu de ações */}
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => handleProfileAction('profile')}
          >
            <User className="h-4 w-4" />
            Meu Perfil
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => handleProfileAction('notifications')}
          >
            <div className="relative">
              <Bell className="h-4 w-4" />
              {userData.notificationsCount > 0 && (
                <div 
                  className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: 'var(--color-error-500)' }}
                />
              )}
            </div>
            Notificações
            {userData.notificationsCount > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {userData.notificationsCount}
              </Badge>
            )}
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => handleProfileAction('billing')}
          >
            <CreditCard className="h-4 w-4" />
            Faturação
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => handleProfileAction('security')}
          >
            <Shield className="h-4 w-4" />
            Segurança
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => handleProfileAction('settings')}
          >
            <Settings className="h-4 w-4" />
            Definições
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={() => handleProfileAction('help')}
          >
            <HelpCircle className="h-4 w-4" />
            Ajuda & Suporte
          </Button>
        </div>

        {/* Separator e logout */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={() => handleProfileAction('logout')}
          >
            <LogOut className="h-4 w-4" />
            Terminar Sessão
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}