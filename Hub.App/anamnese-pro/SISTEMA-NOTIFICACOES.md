# 🔔 Sistema de Notificações Visual e Dinâmico

## Visão Geral

Implementado um sistema completo de notificações **toast** que descem na tela como mini cards informativos e permanecem visíveis até serem marcadas como lidas.

---

## ✨ Características

### 🎯 Visual e Dinâmico
- **Cards animados** que descem suavemente na tela
- **Cores por tipo**: Success (verde), Info (azul), Warning (laranja), Error (vermelho)
- **Ícones representativos** para cada tipo de notificação
- **Animações suaves** de entrada e saída
- **Badge pulsante** para notificações não lidas

### ⏱️ Tempo Real
- **Timestamp relativo**: "Agora", "5m atrás", "2h atrás", "Ontem"
- **Ordenação automática**: Mais recentes no topo
- **Atualização dinâmica**: Novas notificações aparecem instantaneamente

### 🎨 Interativo
- **Click para marcar como lida**
- **Botão X** para remover individualmente
- **Ler todas** de uma vez
- **Limpar tudo** com um clique
- **Hover effects** profissionais

### 📱 Responsivo
- Posicionamento configurável: `top-right`, `top-left`, `bottom-right`, `bottom-left`
- Máximo de notificações visíveis configurável (padrão: 5)
- Indicador de "+ X notificações" quando há mais do que o máximo

---

## 🏗️ Arquitetura

### Componentes Criados

#### 1. `NotificationToast.tsx`
Card individual de notificação com:
- Animação de entrada/saída
- Ícone colorido
- Título e mensagem
- Timestamp relativo
- Badge de "não lida"
- Botões de ação (marcar como lida, remover)

#### 2. `NotificationStack.tsx`
Container que gerencia múltiplas notificações:
- Empilhamento vertical
- Header com contador e ações
- Controles globais (Ler todas, Limpar)
- Indicador de notificações ocultas
- Ordenação por timestamp

#### 3. `dynamic-notification-system.tsx` (Atualizado)
Context API com métodos:
- `addNotification()` - Adiciona nova notificação
- `markAsRead(id)` - Marca como lida (não remove)
- `markAllAsRead()` - Marca todas como lidas
- `removeNotification(id)` - Remove completamente
- `clearAll()` - Remove todas

---

## 🎨 Tipos de Notificação

### ✅ Success (Verde)
Ações concluídas com sucesso:
- "Cliente completou a anamnese"
- "Template ativado com sucesso"
- "Dados salvos"

### ℹ️ Info (Azul)
Informações gerais:
- "Novo template configurado"
- "Sistema atualizado"
- "Backup realizado"

### ⚠️ Warning (Laranja)
Avisos importantes:
- "Template com muitas perguntas"
- "Link expirando em breve"
- "Dados pendentes"

### ❌ Error (Vermelho)
Erros e falhas:
- "Falha ao salvar"
- "Erro de conexão"
- "Operação cancelada"

---

## 💻 Como Usar

### Adicionar Notificação

```typescript
// No componente
const { addNotification } = useNotifications();

// Exemplo: Cliente completou anamnese
addNotification({
  type: 'success',
  title: 'Cliente Completou Anamnese',
  message: 'João Silva completou a anamnese remotamente'
});

// Exemplo: Novo template configurado
addNotification({
  type: 'info',
  title: 'Novo Template Configurado',
  message: 'Template "Anamnese Detalhada" foi ativado'
});

// Exemplo: Aviso
addNotification({
  type: 'warning',
  title: 'Template com Muitas Perguntas',
  message: 'Este template tem 25 perguntas e pode demorar'
});
```

### Gerenciar Notificações

```typescript
const {
  notifications,       // Array de todas as notificações
  markAsRead,         // Marcar uma como lida
  markAllAsRead,      // Marcar todas como lidas
  removeNotification, // Remover uma
  clearAll           // Limpar todas
} = useNotifications();

// Marcar uma notificação como lida
markAsRead(notificationId);

// Marcar todas como lidas
markAllAsRead();

// Remover uma notificação
removeNotification(notificationId);

// Limpar todas
clearAll();
```

---

## 🎯 Exemplos de Uso no Sistema

### 1. Cliente Completa Anamnese Remota
```typescript
addNotification({
  type: 'success',
  title: '✅ Anamnese Concluída',
  message: `${clienteNome} completou a anamnese remotamente`
});
```

### 2. Template Ativado
```typescript
addNotification({
  type: 'success',
  title: '⚙️ Template Ativado',
  message: `"${templateNome}" está agora ativo`
});
```

### 3. Link Gerado
```typescript
addNotification({
  type: 'info',
  title: '🔗 Link Gerado',
  message: `Link de anamnese criado para ${clienteNome}`
});
```

### 4. Validação de Template
```typescript
addNotification({
  type: 'warning',
  title: '⚠️ Template Vazio',
  message: 'Adicione pelo menos 1 pergunta antes de ativar'
});
```

### 5. Erro de Salvamento
```typescript
addNotification({
  type: 'error',
  title: '❌ Erro ao Salvar',
  message: 'Não foi possível salvar as alterações'
});
```

---

## 🎨 Personalização

### Posicionamento
```typescript
<NotificationStack
  position="top-right"  // ou "top-left", "bottom-right", "bottom-left"
  maxVisible={5}        // Número máximo de notificações visíveis
  {...props}
/>
```

### Cores por Profissão
O sistema usa as cores dinâmicas da profissão atual:
- Badge de "não lida" usa a cor primária da profissão
- Mantém consistência visual em todo o sistema

---

## 🔥 Features Avançadas

### 1. Previne Duplicatas
Se duas notificações com o mesmo título forem adicionadas em menos de 1 segundo, apenas a primeira é mantida.

### 2. Limite Automático
Mantém apenas as 20 notificações mais recentes no sistema.

### 3. Animações Sequenciais
Notificações aparecem com delay progressivo (50ms entre cada) para efeito visual suave.

### 4. Auto-Close ao Clicar
Clicar na notificação automaticamente marca como lida.

### 5. Tempo Relativo Inteligente
- Menos de 1 minuto: "Agora"
- Menos de 1 hora: "5m atrás"
- Menos de 24h: "2h atrás"
- 1 dia: "Ontem"
- Mais de 1 dia: "5d atrás"
- Mais de 1 semana: Data formatada

---

## 📊 Estado das Notificações

Cada notificação possui:
```typescript
{
  id: string;           // Único
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;        // Título curto
  message: string;      // Descrição
  timestamp: string;    // ISO 8601
  isRead: boolean;      // Estado de leitura
}
```

---

## 🚀 Melhorias Futuras

1. **Notificações com ações customizadas**
   - "Ver anamnese" - Navega para detalhes
   - "Ativar template" - Ação direta no sistema

2. **Persistência**
   - Salvar notificações no localStorage
   - Restaurar ao recarregar página

3. **Som e vibração**
   - Notificação sonora para eventos importantes
   - Vibração em mobile

4. **Agrupamento**
   - Agrupar notificações similares
   - "5 clientes completaram anamneses"

5. **Prioridades**
   - Notificações urgentes sempre visíveis
   - Ordem por prioridade + tempo

---

## 📝 Integração Atual

O sistema está integrado em `App.tsx`:

```typescript
<NotificationStack
  notifications={notifications}
  onMarkAsRead={markAsRead}
  onRemove={removeNotification}
  onMarkAllAsRead={markAllAsRead}
  onClearAll={clearAll}
  position="top-right"
  maxVisible={5}
/>
```

Todas as notificações do sistema (`addNotification()`) já funcionam automaticamente com os novos toasts visuais! 🎉

---

**Status**: ✅ Sistema completamente funcional e integrado!
