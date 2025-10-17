# Hub.App - Documentação Oficial

Sistema modular para gestão de negócios com arquitetura baseada em módulos independentes.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Template de Módulos](#template-de-módulos)
- [Módulos Disponíveis](#módulos-disponíveis)
- [Design System](#design-system)
- [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## 🎯 Visão Geral

O Hub.App é uma plataforma modular que permite adicionar diferentes funcionalidades ao negócio através de módulos especializados. Cada módulo segue um template padrão que garante consistência visual e de experiência do usuário.

### Características Principais

- **Arquitetura Modular**: Cada módulo é independente e pode ser desenvolvido/mantido separadamente
- **Design System Unificado**: Todos os módulos compartilham o mesmo design system (E4CEO)
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Glassmorphism UI**: Interface moderna com efeitos de vidro e blur
- **Sistema de Navegação Inteligente**: Sidebar colapsável no desktop, bottom bar no mobile

---

## 🏗️ Arquitetura

```
Hub.App/
├── Template modulos/          # Template base para novos módulos
├── anamnese-pro/             # Módulo de Anamnese (Tatuadores/Estética)
├── Modulo Financeiro/        # Módulo Financeiro (Gestão financeira)
├── docs/                     # Documentação oficial
└── Hubapp-Docs/             # Documentação adicional
```

### Estrutura de um Módulo

```
modulo/
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes base (shadcn/ui)
│   │   ├── generic/               # Componentes genéricos reutilizáveis
│   │   ├── navigation/            # Sistema de navegação
│   │   └── [modulo-specific]/     # Componentes específicos do módulo
│   ├── design-system.tsx          # Design System E4CEO
│   ├── App.tsx                    # Componente principal
│   └── main.tsx                   # Entry point
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📐 Template de Módulos

O **Template modulos** serve como base para criar novos módulos. Ele inclui:

### Componentes Principais

1. **E4CEODashboardLayout**: Layout principal com sidebar e header
2. **E4CEOSidebar**: Sidebar com navegação e logo
3. **E4CEOHeader**: Header com busca, filtros e notificações
4. **MobileTabBar**: Barra de navegação inferior para mobile

### Componentes Genéricos Incluídos

- `GenericDashboard`: Dashboard padrão com cards e métricas
- `GenericSearchModal`: Modal de busca universal
- `GenericDataView`: Visualização de dados em tabela/cards
- `GenericAnalytics`: Componente de analytics
- `GenericSettings`: Tela de configurações
- `GenericTeam`: Gestão de equipe

### Sistema de Notificações

- `DesktopNotificationPanel`: Painel de notificações para desktop
- `MobileNotificationPanel`: Painel de notificações para mobile
- `dynamic-notification-system`: Sistema dinâmico de notificações

### Filtros e Busca

- `MobilePeriodFilterOptimized`: Filtro de período otimizado para mobile
- `CustomPeriodModal`: Modal para seleção de período customizado
- Sistema de busca integrado no header

---

## 🎨 Design System

### E4CEO Design System

O Design System E4CEO é baseado em:

- **Tailwind CSS**: Framework CSS utility-first
- **Radix UI**: Componentes acessíveis e sem estilo
- **shadcn/ui**: Componentes prontos baseados em Radix
- **Lucide React**: Biblioteca de ícones

### Cores Principais

```css
/* Primary Colors */
--primary: #FF006B (Pink)
--primary-light: #FF4D99
--primary-dark: #CC0056

/* Secondary Colors */
--secondary: #7C3AED (Purple)
--accent: #10B981 (Green)

/* Neutrals */
--gray-50: #F9FAFB
--gray-100: #F3F4F6
--gray-900: #111827
```

### Tipografia

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif

/* Font Sizes */
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 1.875rem
```

### Espaçamento

```css
/* Spacing Scale */
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
--spacing-6: 1.5rem (24px)
--spacing-8: 2rem (32px)
```

### Efeitos Visuais

#### Glassmorphism
```css
background: rgba(255, 255, 255, 0.95)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.2)
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)
```

#### Animations
- **Fade In**: Entrada suave com opacity
- **Slide In**: Entrada deslizante
- **Scale**: Efeito de zoom
- **Pulse**: Pulsação para notificações

---

## 📦 Módulos Disponíveis

### 1. Anamnese Pro

**Descrição**: Sistema de anamnese para tatuadores e profissionais de estética.

**Funcionalidades**:
- ✅ Anamnese presencial (preenchida pelo profissional)
- ✅ Anamnese remota (link enviado ao cliente)
- ✅ Editor de template personalizável
- ✅ Geração de PDF
- ✅ Histórico de anamneses
- ✅ Limite de 100 clientes (plano básico)
- ✅ Quiz dinâmico com múltiplas seções

**Tecnologias**:
- React 18 + TypeScript
- Vite + SWC
- Tailwind CSS
- jsPDF (geração de PDF)
- Radix UI + shadcn/ui

**Status**: ✅ VERSÃO 1.0 - Funcional

---

### 2. Módulo Financeiro

**Descrição**: Sistema completo de gestão financeira.

**Funcionalidades**:
- Dashboard financeiro
- Gestão de transações (receitas/despesas)
- Relatórios e analytics
- Upload de arquivos
- Gráficos com Recharts

**Tecnologias**:
- React 18 + TypeScript
- Vite + SWC
- Tailwind CSS
- Recharts
- React Hook Form

**Status**: 🚧 Em desenvolvimento

---

## 🛠️ Guia de Desenvolvimento

### Criando um Novo Módulo

1. **Copie o Template**:
```bash
cp -r "Template modulos" "novo-modulo"
cd novo-modulo
```

2. **Instale as Dependências**:
```bash
npm install
```

3. **Configure o package.json**:
```json
{
  "name": "novo-modulo",
  "version": "1.0.0",
  "description": "Descrição do módulo"
}
```

4. **Customize o design-system.tsx**:
- Altere o título no E4CEODashboardLayout
- Ajuste os itens de navegação
- Configure as cores principais (se necessário)

5. **Desenvolva os Componentes Específicos**:
```
src/
├── components/
│   └── [seu-modulo]/
│       ├── ComponenteA.tsx
│       ├── ComponenteB.tsx
│       └── index.ts
```

### Boas Práticas

#### 1. Versionamento
- Sempre documente a versão do módulo
- Use o formato: `VERSÃO X.Y` (ex: VERSÃO 1.0, VERSÃO 1.1)
- Mantenha um changelog no README

#### 2. Componentização
- Componentes pequenos e reutilizáveis
- Use TypeScript com interfaces bem definidas
- Separe lógica de apresentação

#### 3. Estado
- Use React hooks para estado local
- Considere Context API para estado global
- Evite prop drilling excessivo

#### 4. Estilização
- Prefira Tailwind CSS
- Use classes utilitárias
- Mantenha consistência com o design system

#### 5. Performance
- Use React.memo() para componentes pesados
- Lazy loading para rotas/modals
- Otimize imagens e assets

### Componentes Reutilizáveis

#### Modal Pattern
```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl">
          {title && <h2>{title}</h2>}
          {children}
        </div>
      </div>
    </>
  )
}
```

#### Card Pattern
```tsx
interface CardProps {
  title?: string
  description?: string
  children: ReactNode
  onClick?: () => void
}

export function Card({ title, description, children, onClick }: CardProps) {
  return (
    <div
      className="p-6 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all"
      onClick={onClick}
    >
      {title && <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  )
}
```

### Sistema de Navegação

#### Desktop (Sidebar)
- Sidebar fixa à direita
- Colapsável (72px collapsed, 288px expanded)
- Navegação por ícones + labels
- Scroll interno se necessário

#### Mobile (Bottom Tab Bar)
- Barra fixa na parte inferior
- Máximo 5 itens principais
- Ícones com labels pequenos
- Item ativo destacado

### Sistema de Filtros

O template inclui um sistema de filtros de período:

```tsx
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

Períodos disponíveis:
- Hoje
- Ontem
- Últimos 7 dias
- Últimos 30 dias
- Este mês
- Mês passado
- Personalizado

### Sistema de Notificações

```tsx
interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: string
  read?: boolean
}

// Uso
<NotificationPanel
  isOpen={showNotifications}
  onClose={() => setShowNotifications(false)}
  notifications={notifications}
/>
```

---

## 🔧 Configuração de Desenvolvimento

### Requisitos
- Node.js 18+
- npm ou yarn
- Editor: VS Code (recomendado)

### Extensões VS Code Recomendadas
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Prettier - Code formatter
- ESLint

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile */
@media (max-width: 767px)

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px)

/* Desktop */
@media (min-width: 1024px)
```

### Layout Adaptativo

**Mobile**:
- Sidebar desaparece
- Bottom tab bar aparece
- Cards empilhados verticalmente
- Modais em tela cheia

**Desktop**:
- Sidebar visível à direita
- Bottom tab bar escondida
- Grid de cards responsivo
- Modais centralizados

---

## 🚀 Deploy

### Build de Produção

```bash
npm run build
```

Gera pasta `dist/` com arquivos otimizados.

### Hospedagem Recomendada
- Vercel (recomendado para React/Vite)
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

### Variáveis de Ambiente

Crie arquivo `.env`:

```env
VITE_APP_NAME=Hub.App
VITE_API_URL=https://api.example.com
VITE_ENV=production
```

---

## 📄 Licença

Propriedade de Hub.App - Todos os direitos reservados.

---

## 👥 Suporte

Para dúvidas ou suporte, consulte a documentação específica de cada módulo ou entre em contato com a equipe de desenvolvimento.
