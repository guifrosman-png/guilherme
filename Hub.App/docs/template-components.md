# Template de Módulos - Componentes

Documentação detalhada de todos os componentes disponíveis no Template de Módulos.

---

## 📑 Índice

- [Layout e Navegação](#layout-e-navegação)
- [Componentes Genéricos](#componentes-genéricos)
- [Sistema de Notificações](#sistema-de-notificações)
- [Filtros e Busca](#filtros-e-busca)
- [Componentes UI Base](#componentes-ui-base)

---

## 🎨 Layout e Navegação

### E4CEODashboardLayout

**Localização**: `src/design-system.tsx`

Componente principal que encapsula todo o layout da aplicação com sidebar e header.

#### Props

```typescript
interface E4CEODashboardLayoutProps {
  children: ReactNode                    // Conteúdo principal
  currentPage?: string                   // Página atual ativa
  onPageChange?: (page: string) => void  // Callback de mudança de página
  sidebarCollapsed?: boolean             // Estado da sidebar (colapsada/expandida)
  onToggleSidebar?: () => void          // Callback para toggle da sidebar
  title?: string                         // Título do módulo (ex: "Anamnese Pro")
  onNotificationClick?: () => void       // Callback do botão de notificações
  onSettingsClick?: () => void          // Callback do botão de configurações
  onSearchClick?: () => void            // Callback do botão de busca
  hasNotifications?: boolean            // Se tem notificações não lidas
  notificationCount?: number            // Quantidade de notificações
}
```

#### Exemplo de Uso

```tsx
function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <E4CEODashboardLayout
      currentPage={activeTab}
      onPageChange={setActiveTab}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      title="Meu Módulo"
      onNotificationClick={() => console.log('Notificações')}
      onSettingsClick={() => console.log('Configurações')}
      onSearchClick={() => console.log('Buscar')}
      hasNotifications={true}
      notificationCount={5}
    >
      {/* Seu conteúdo aqui */}
    </E4CEODashboardLayout>
  )
}
```

#### Estrutura

- **Desktop**: Sidebar à direita + Header no topo
- **Mobile**: Bottom Tab Bar + Header simplificado

---

### E4CEOSidebar

**Localização**: `src/design-system.tsx`

Sidebar de navegação com logo e menu de itens.

#### Props

```typescript
interface SidebarProps {
  collapsed?: boolean                    // Estado colapsado
  currentPage?: string                   // Página ativa
  onPageChange?: (page: string) => void  // Mudança de página
  onToggleCollapse?: () => void         // Toggle colapsar
  onLoadDemo?: () => void               // Carregar dados demo
  onShowWelcome?: () => void            // Mostrar boas-vindas
  children?: ReactNode                   // Conteúdo extra
}
```

#### Itens de Navegação (Customizáveis)

```typescript
const navigationItems = [
  { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: CreditCard, label: 'Transações' },
  { id: 'accounts', icon: PiggyBank, label: 'Contas' },
  { id: 'results', icon: FileBarChart, label: 'Relatórios' },
  { id: 'health', icon: Heart, label: 'Saúde' }
]
```

#### Características

- **Colapsável**: 72px (colapsado) | 288px (expandido)
- **Logo Animado**: "M" vira menu hamburger no hover (quando colapsado)
- **Scroll**: Quando muitos itens
- **Active State**: Item ativo destacado com gradient

---

### E4CEOHeader

**Localização**: `src/design-system.tsx`

Header superior com título, busca, filtros e notificações.

#### Props

```typescript
interface HeaderProps {
  title?: string                         // Título do módulo
  onNotificationClick?: () => void       // Botão notificações
  onSettingsClick?: () => void          // Botão configurações
  onSearchClick?: () => void            // Botão busca
  hasNotifications?: boolean            // Tem notificações
  notificationCount?: number            // Número de notificações
  sidebarCollapsed?: boolean            // Estado da sidebar
}
```

#### Botões Disponíveis

1. **Busca** (Search icon)
   - Abre modal de busca global
   - Atalho: Ctrl/Cmd + K (pode ser implementado)

2. **Notificações** (Bell icon)
   - Badge com contador quando há notificações
   - Animação de pulse no badge
   - Abre painel de notificações

3. **Configurações** (Settings icon)
   - Abre modal/página de configurações

#### Responsividade

- **Desktop**: Todos os botões visíveis
- **Mobile**: Botões compactos, ícones apenas

---

### MobileTabBar

**Localização**: `src/design-system.tsx`

Barra de navegação inferior para mobile.

#### Props

```typescript
interface MobileTabBarProps {
  currentPage?: string                   // Página ativa
  onPageChange?: (page: string) => void  // Mudança de página
}
```

#### Características

- Fixa na parte inferior da tela
- Máximo 5 itens recomendado
- Item ativo com gradient e badge
- Safe area para devices com notch

---

## 🧩 Componentes Genéricos

### GenericDashboard

**Localização**: `src/components/generic/GenericDashboard.tsx`

Dashboard padrão com cards de métricas e estatísticas.

#### Estrutura

```tsx
<GenericDashboard>
  {/* Cards de métricas */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <MetricCard title="Receitas" value="R$ 15.000" change="+12%" />
    <MetricCard title="Despesas" value="R$ 8.000" change="-5%" />
    <MetricCard title="Lucro" value="R$ 7.000" change="+18%" />
    <MetricCard title="Transações" value="234" change="+8%" />
  </div>

  {/* Gráficos */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <ChartCard title="Evolução Mensal" />
    <ChartCard title="Categorias" />
  </div>
</GenericDashboard>
```

---

### GenericSearchModal

**Localização**: `src/components/generic/GenericSearchModal.tsx`

Modal de busca universal com filtros e resultados.

#### Props

```typescript
interface GenericSearchModalProps {
  isOpen: boolean                        // Estado aberto/fechado
  onClose: () => void                    // Callback fechar
  data: any[]                            // Dados para busca
  onSelectItem?: (item: any) => void    // Callback selecionar item
  searchPlaceholder?: string             // Placeholder do input
  recentSearches?: string[]              // Buscas recentes
  filterOptions?: FilterOption[]         // Opções de filtro
}
```

#### Funcionalidades

- ✅ Busca em tempo real
- ✅ Filtros customizáveis
- ✅ Histórico de buscas recentes
- ✅ Resultados paginados
- ✅ Keyboard navigation (setas, enter, esc)
- ✅ Mobile-first design

#### Exemplo de Uso

```tsx
const [searchOpen, setSearchOpen] = useState(false)

<GenericSearchModal
  isOpen={searchOpen}
  onClose={() => setSearchOpen(false)}
  data={anamneses}
  onSelectItem={(item) => {
    console.log('Selecionado:', item)
    setSearchOpen(false)
  }}
  searchPlaceholder="Buscar anamneses..."
  recentSearches={['Maria Silva', 'João Santos']}
/>
```

---

### GenericDataView

**Localização**: `src/components/generic/GenericDataView.tsx`

Componente para exibição de dados em tabela ou cards.

#### Props

```typescript
interface GenericDataViewProps {
  data: any[]                            // Array de dados
  columns: ColumnDefinition[]            // Definição das colunas
  viewMode?: 'table' | 'cards'          // Modo de visualização
  onRowClick?: (row: any) => void       // Callback click linha/card
  loading?: boolean                      // Estado loading
  emptyMessage?: string                  // Mensagem quando vazio
}
```

#### Definição de Colunas

```typescript
interface ColumnDefinition {
  key: string                            // Chave do dado
  label: string                          // Label da coluna
  render?: (value: any, row: any) => ReactNode  // Render customizado
  sortable?: boolean                     // Coluna ordenável
  width?: string                         // Largura (ex: '200px')
}
```

#### Exemplo

```tsx
const columns = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'date', label: 'Data', sortable: true },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`badge ${value === 'active' ? 'badge-success' : 'badge-error'}`}>
        {value}
      </span>
    )
  }
]

<GenericDataView
  data={items}
  columns={columns}
  viewMode="cards"
  onRowClick={(item) => console.log(item)}
/>
```

---

### GenericAnalytics

**Localização**: `src/components/generic/GenericAnalytics.tsx`

Componente de analytics com gráficos e estatísticas.

#### Gráficos Incluídos

- Linha (evolução temporal)
- Barra (comparações)
- Pizza (distribuição)
- Área (tendências)

---

### GenericSettings

**Localização**: `src/components/generic/GenericSettings.tsx`

Página/Modal de configurações genérica.

#### Seções

```typescript
interface SettingsSection {
  id: string
  title: string
  icon: LucideIcon
  items: SettingsItem[]
}

interface SettingsItem {
  id: string
  label: string
  description?: string
  type: 'toggle' | 'select' | 'input' | 'custom'
  value: any
  onChange: (value: any) => void
}
```

---

### GenericTeam

**Localização**: `src/components/generic/GenericTeam.tsx`

Componente para gestão de equipe/usuários.

#### Funcionalidades

- Lista de membros
- Adicionar/remover membros
- Editar permissões
- Filtros e busca

---

## 🔔 Sistema de Notificações

### DesktopNotificationPanel

**Localização**: `src/components/DesktopNotificationPanel.tsx`

Painel flutuante de notificações para desktop.

#### Props

```typescript
interface NotificationPanelProps {
  isOpen: boolean                        // Aberto/fechado
  onClose: () => void                    // Callback fechar
  sidebarCollapsed?: boolean             // Estado sidebar (para posicionamento)
  notifications?: Notification[]         // Array de notificações
}
```

#### Estrutura de Notificação

```typescript
interface Notification {
  id: number | string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: string
  read?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}
```

#### Características

- **Posicionamento**: Abaixo do header, à direita
- **Glassmorphism**: Fundo translúcido com blur
- **Ícones por Tipo**:
  - Success: ✓ CheckCircle (verde)
  - Warning: ⚠ AlertTriangle (amarelo)
  - Error: ✕ AlertTriangle (vermelho)
  - Info: ℹ Info (azul)
- **Timestamp**: Formatado (Agora, 5min, 2h, 1d)
- **Ações**: Limpar tudo, marcar como lidas

---

### MobileNotificationPanel

**Localização**: `src/components/MobileNotificationPanel.tsx`

Painel de notificações otimizado para mobile.

#### Diferenças do Desktop

- Tela cheia (bottom sheet)
- Swipe down para fechar
- Touch-optimized
- Transições mobile-friendly

---

### dynamic-notification-system

**Localização**: `src/components/dynamic-notification-system.tsx`

Sistema dinâmico para adicionar notificações programaticamente.

#### API

```typescript
// Hook
const { addNotification, removeNotification, clearAll } = useNotifications()

// Adicionar notificação
addNotification({
  type: 'success',
  title: 'Sucesso!',
  message: 'Operação concluída com sucesso',
  duration: 3000  // Auto-dismiss em 3s
})

// Remover específica
removeNotification(notificationId)

// Limpar todas
clearAll()
```

---

## 🔍 Filtros e Busca

### MobilePeriodFilterOptimized

**Localização**: `src/components/MobilePeriodFilterOptimized.tsx`

Filtro de período otimizado para mobile e desktop.

#### Props

```typescript
interface PeriodFilterProps {
  selectedPeriod: PeriodOption
  onPeriodChange: (period: PeriodOption) => void
  customStartDate?: string
  customEndDate?: string
  onCustomDateChange?: (start: string, end: string) => void
}

type PeriodOption =
  | 'today'
  | 'yesterday'
  | '7days'
  | '30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'custom'
```

#### Opções de Período

```typescript
const periodOptions = [
  { value: 'today', label: 'Hoje', icon: Calendar },
  { value: 'yesterday', label: 'Ontem', icon: Calendar },
  { value: '7days', label: 'Últimos 7 dias', icon: Calendar },
  { value: '30days', label: 'Últimos 30 dias', icon: Calendar },
  { value: 'thisMonth', label: 'Este mês', icon: Calendar },
  { value: 'lastMonth', label: 'Mês passado', icon: Calendar },
  { value: 'custom', label: 'Personalizado', icon: CalendarRange }
]
```

#### Exemplo de Uso

```tsx
const [period, setPeriod] = useState<PeriodOption>('30days')
const [startDate, setStartDate] = useState('')
const [endDate, setEndDate] = useState('')

<MobilePeriodFilterOptimized
  selectedPeriod={period}
  onPeriodChange={setPeriod}
  customStartDate={startDate}
  customEndDate={endDate}
  onCustomDateChange={(start, end) => {
    setStartDate(start)
    setEndDate(end)
  }}
/>
```

---

### CustomPeriodModal

**Localização**: `src/components/CustomPeriodModal.tsx`

Modal para seleção de datas customizadas.

#### Props

```typescript
interface CustomPeriodModalProps {
  isOpen: boolean
  onClose: () => void
  startDate?: string
  endDate?: string
  onConfirm: (start: string, end: string) => void
}
```

#### Funcionalidades

- Seleção de data inicial e final
- Validação (data final >= data inicial)
- Presets rápidos
- Mobile date pickers nativos

---

## 🎨 Componentes UI Base

### Button

**Localização**: `src/components/ui/button.tsx` (shadcn/ui)

Botão base com variantes.

#### Variantes

```tsx
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>
```

#### Tamanhos

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

---

### Card

**Localização**: `src/components/ui/card.tsx` (shadcn/ui)

Container card com header, content e footer.

#### Estrutura

```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
  <CardFooter>
    {/* Rodapé */}
  </CardFooter>
</Card>
```

---

### Dialog

**Localização**: `src/components/ui/dialog.tsx` (shadcn/ui)

Modal/Dialog acessível baseado em Radix UI.

#### Exemplo

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    {/* Conteúdo */}
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Fechar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Select

**Localização**: `src/components/ui/select.tsx` (shadcn/ui)

Dropdown select acessível.

```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Selecione..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Input

**Localização**: `src/components/ui/input.tsx` (shadcn/ui)

Input de texto base.

```tsx
<Input
  type="text"
  placeholder="Digite algo..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

### Textarea

**Localização**: `src/components/ui/textarea.tsx` (shadcn/ui)

Área de texto multi-linha.

```tsx
<Textarea
  placeholder="Digite algo..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  rows={5}
/>
```

---

### Badge

**Localização**: `src/components/ui/badge.tsx` (shadcn/ui)

Badge/tag para status e labels.

```tsx
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## 📦 Outros Componentes Úteis

### FloatingButtons

**Localização**: `src/components/FloatingButtons.tsx`

Botões flutuantes de ação rápida (FAB).

```tsx
<FloatingButtons
  buttons={[
    {
      icon: Plus,
      label: 'Adicionar',
      onClick: () => console.log('Add'),
      color: 'primary'
    },
    {
      icon: RefreshCw,
      label: 'Atualizar',
      onClick: () => console.log('Refresh'),
      color: 'secondary'
    }
  ]}
/>
```

---

### ImageWithFallback

**Localização**: `src/components/figma/ImageWithFallback.tsx`

Imagem com fallback quando falha ao carregar.

```tsx
<ImageWithFallback
  src="/path/to/image.jpg"
  fallback="/placeholder.jpg"
  alt="Descrição"
/>
```

---

## 🎯 Resumo de Uso

### Criando um Novo Módulo

1. **Layout Base**:
```tsx
<E4CEODashboardLayout title="Seu Módulo">
  {/* Conteúdo */}
</E4CEODashboardLayout>
```

2. **Adicionar Busca**:
```tsx
<GenericSearchModal
  isOpen={searchOpen}
  onClose={() => setSearchOpen(false)}
  data={yourData}
/>
```

3. **Adicionar Notificações**:
```tsx
<DesktopNotificationPanel
  isOpen={notifOpen}
  onClose={() => setNotifOpen(false)}
  notifications={notifications}
/>
```

4. **Adicionar Filtros**:
```tsx
<MobilePeriodFilterOptimized
  selectedPeriod={period}
  onPeriodChange={setPeriod}
/>
```

5. **Visualizar Dados**:
```tsx
<GenericDataView
  data={items}
  columns={columns}
  viewMode="cards"
/>
```

---

## 📚 Recursos Adicionais

- [Radix UI Docs](https://www.radix-ui.com/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
