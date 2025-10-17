# E4CEO Design System - Hub.App

Sistema de design oficial do Hub.App baseado no E4CEO.

---

## 📋 Índice

- [Introdução](#introdução)
- [Princípios de Design](#princípios-de-design)
- [Cores](#cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Componentes](#componentes)
- [Efeitos Visuais](#efeitos-visuais)
- [Animações](#animações)
- [Responsividade](#responsividade)
- [Ícones](#ícones)
- [Boas Práticas](#boas-práticas)

---

## 🎨 Introdução

O **E4CEO Design System** é o sistema de design unificado para todos os módulos do Hub.App. Ele garante consistência visual, acessibilidade e uma experiência de usuário coesa em toda a plataforma.

### Filosofia

- **Modernidade**: Visual contemporâneo com glassmorphism
- **Clareza**: Hierarquia visual clara e intuitiva
- **Consistência**: Mesmos padrões em todos os módulos
- **Acessibilidade**: Seguindo padrões WCAG 2.1
- **Performance**: Componentes otimizados

---

## 🎯 Princípios de Design

### 1. Hierarquia Visual

Informações mais importantes devem ser mais visíveis:

```css
/* Hierarquia de tamanhos */
.title-primary { font-size: 2rem; font-weight: 700; }
.title-secondary { font-size: 1.5rem; font-weight: 600; }
.title-tertiary { font-size: 1.25rem; font-weight: 600; }
.body-large { font-size: 1.125rem; font-weight: 400; }
.body { font-size: 1rem; font-weight: 400; }
.body-small { font-size: 0.875rem; font-weight: 400; }
.caption { font-size: 0.75rem; font-weight: 400; }
```

### 2. Consistência

Todos os módulos seguem o mesmo padrão:

- **Layout**: Sidebar à direita (desktop), tab bar embaixo (mobile)
- **Header**: Fixo no topo com busca, filtros e notificações
- **Cards**: Mesmo estilo de card em todos os módulos
- **Botões**: Mesmas variantes e estados
- **Inputs**: Mesmo estilo de formulários

### 3. Feedback Visual

Usuário sempre sabe o que está acontecendo:

- **Hover states**: Destaque ao passar o mouse
- **Active states**: Visual quando clicado
- **Loading states**: Indicadores de carregamento
- **Success/Error**: Feedback visual de ações

### 4. Responsividade

Mobile-first approach:

```css
/* Mobile first */
.container { padding: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 1.5rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 2rem; }
}
```

---

## 🌈 Cores

### Paleta Principal

```css
/* Primary - Pink/Rosa */
--color-primary-50: #FFF1F7
--color-primary-100: #FFE4F0
--color-primary-200: #FFCCE3
--color-primary-300: #FF99CC
--color-primary-400: #FF66B3
--color-primary-500: #FF006B  /* Principal */
--color-primary-600: #CC0056
--color-primary-700: #990041
--color-primary-800: #66002B
--color-primary-900: #330016

/* Secondary - Purple/Roxo */
--color-secondary-50: #F5F3FF
--color-secondary-100: #EDE9FE
--color-secondary-200: #DDD6FE
--color-secondary-300: #C4B5FD
--color-secondary-400: #A78BFA
--color-secondary-500: #7C3AED  /* Principal */
--color-secondary-600: #6D28D9
--color-secondary-700: #5B21B6
--color-secondary-800: #4C1D95
--color-secondary-900: #3B0764

/* Accent - Green/Verde */
--color-accent-50: #ECFDF5
--color-accent-100: #D1FAE5
--color-accent-200: #A7F3D0
--color-accent-300: #6EE7B7
--color-accent-400: #34D399
--color-accent-500: #10B981  /* Principal */
--color-accent-600: #059669
--color-accent-700: #047857
--color-accent-800: #065F46
--color-accent-900: #064E3B
```

### Cores Funcionais

```css
/* Success - Verde */
--color-success: #10B981
--color-success-light: #D1FAE5
--color-success-dark: #047857

/* Warning - Amarelo */
--color-warning: #F59E0B
--color-warning-light: #FEF3C7
--color-warning-dark: #D97706

/* Error - Vermelho */
--color-error: #EF4444
--color-error-light: #FEE2E2
--color-error-dark: #DC2626

/* Info - Azul */
--color-info: #3B82F6
--color-info-light: #DBEAFE
--color-info-dark: #1D4ED8
```

### Cores Neutras (Grays)

```css
--color-gray-50: #F9FAFB
--color-gray-100: #F3F4F6
--color-gray-200: #E5E7EB
--color-gray-300: #D1D5DB
--color-gray-400: #9CA3AF
--color-gray-500: #6B7280
--color-gray-600: #4B5563
--color-gray-700: #374151
--color-gray-800: #1F2937
--color-gray-900: #111827
```

### Uso das Cores

#### Texto

```css
/* Texto principal */
color: rgb(17, 24, 39)  /* gray-900 */

/* Texto secundário */
color: rgb(107, 114, 128)  /* gray-500 */

/* Texto desabilitado */
color: rgb(156, 163, 175)  /* gray-400 */
```

#### Backgrounds

```css
/* Background principal */
background: rgb(249, 250, 251)  /* gray-50 */

/* Background cards */
background: rgba(255, 255, 255, 0.95)

/* Background hover */
background: rgb(243, 244, 246)  /* gray-100 */
```

#### Bordas

```css
/* Borda padrão */
border: 1px solid rgb(229, 231, 235)  /* gray-200 */

/* Borda hover */
border: 2px solid #FF006B  /* primary-500 */

/* Borda focus */
border: 2px solid #7C3AED  /* secondary-500 */
```

---

## ✍️ Tipografia

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
             'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

**Fallback**: Sistema nativo de cada OS

### Font Sizes

```css
/* Scale */
--text-xs: 0.75rem    /* 12px */
--text-sm: 0.875rem   /* 14px */
--text-base: 1rem     /* 16px */
--text-lg: 1.125rem   /* 18px */
--text-xl: 1.25rem    /* 20px */
--text-2xl: 1.5rem    /* 24px */
--text-3xl: 1.875rem  /* 30px */
--text-4xl: 2.25rem   /* 36px */
--text-5xl: 3rem      /* 48px */
```

### Font Weights

```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Line Heights

```css
--leading-none: 1
--leading-tight: 1.25
--leading-snug: 1.375
--leading-normal: 1.5
--leading-relaxed: 1.625
--leading-loose: 2
```

### Hierarquia Tipográfica

```tsx
// H1 - Títulos principais de página
<h1 className="text-3xl font-bold text-gray-900">
  Título Principal
</h1>

// H2 - Títulos de seção
<h2 className="text-2xl font-bold text-gray-900">
  Título de Seção
</h2>

// H3 - Subtítulos
<h3 className="text-xl font-semibold text-gray-900">
  Subtítulo
</h3>

// Body Large
<p className="text-lg text-gray-700">
  Texto destacado ou introdutório
</p>

// Body Normal
<p className="text-base text-gray-700">
  Texto padrão de corpo
</p>

// Body Small
<p className="text-sm text-gray-600">
  Textos secundários ou de suporte
</p>

// Caption
<p className="text-xs text-gray-500">
  Legendas, timestamps, metadados
</p>
```

---

## 📏 Espaçamento

### Spacing Scale

```css
--spacing-0: 0
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-5: 1.25rem   /* 20px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
--spacing-10: 2.5rem   /* 40px */
--spacing-12: 3rem     /* 48px */
--spacing-16: 4rem     /* 64px */
--spacing-20: 5rem     /* 80px */
--spacing-24: 6rem     /* 96px */
```

### Uso Recomendado

```tsx
// Padding interno de cards
className="p-6"  // 24px

// Gap entre elementos
className="gap-4"  // 16px

// Margin entre seções
className="mb-8"  // 32px

// Espaçamento de formulários
className="space-y-4"  // 16px vertical
```

### Container Widths

```css
/* Max widths */
--container-sm: 640px
--container-md: 768px
--container-lg: 1024px
--container-xl: 1280px
--container-2xl: 1536px
```

---

## 🧩 Componentes

### Button

#### Variantes

```tsx
// Primary (padrão)
<button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
  Button Primary
</button>

// Secondary
<button className="bg-white text-gray-900 border-2 border-gray-200 px-6 py-3 rounded-xl font-semibold hover:border-pink-500 transition-all">
  Button Secondary
</button>

// Ghost
<button className="text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
  Button Ghost
</button>

// Destructive
<button className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all">
  Button Destructive
</button>
```

#### Tamanhos

```tsx
// Small
<button className="px-3 py-1.5 text-sm">Small</button>

// Medium (padrão)
<button className="px-6 py-3 text-base">Medium</button>

// Large
<button className="px-8 py-4 text-lg">Large</button>
```

#### Estados

```tsx
// Disabled
<button disabled className="opacity-50 cursor-not-allowed">
  Disabled
</button>

// Loading
<button className="relative">
  <span className="opacity-0">Button</span>
  <span className="absolute inset-0 flex items-center justify-center">
    <LoadingSpinner />
  </span>
</button>
```

---

### Card

```tsx
<div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6">
  {/* Card Header */}
  <div className="mb-4">
    <h3 className="text-xl font-bold text-gray-900">Card Title</h3>
    <p className="text-sm text-gray-600">Card description</p>
  </div>

  {/* Card Content */}
  <div className="space-y-3">
    <p className="text-gray-700">Card content goes here</p>
  </div>

  {/* Card Footer */}
  <div className="mt-6 flex gap-2">
    <button>Action 1</button>
    <button>Action 2</button>
  </div>
</div>
```

---

### Input

```tsx
// Text Input
<input
  type="text"
  placeholder="Digite algo..."
  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
/>

// Textarea
<textarea
  placeholder="Digite algo..."
  rows={4}
  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:border-pink-500 focus:outline-none transition-colors resize-none"
/>

// Select
<select className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:border-pink-500 focus:outline-none transition-colors">
  <option>Opção 1</option>
  <option>Opção 2</option>
</select>

// Radio
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    name="option"
    className="w-5 h-5 text-pink-500 focus:ring-pink-500"
  />
  <span>Opção</span>
</label>

// Checkbox
<label className="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
  />
  <span>Opção</span>
</label>
```

---

### Badge

```tsx
// Status badges
<span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
  ✓ Concluída
</span>

<span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
  ⏳ Pendente
</span>

<span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
  ✕ Erro
</span>

<span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
  ℹ Info
</span>
```

---

## ✨ Efeitos Visuais

### Glassmorphism

Principal efeito visual do design system.

```css
/* Glassmorphism Base */
.glass {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Glassmorphism Dark */
.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

#### Aplicação

```tsx
// Sidebar
<div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
  {/* Content */}
</div>

// Card
<div className="bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg">
  {/* Content */}
</div>

// Modal
<div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
  {/* Content */}
</div>
```

---

### Shadows

```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25)
```

#### Uso

```tsx
// Cards
className="shadow-lg hover:shadow-xl"

// Modals
className="shadow-2xl"

// Floating elements
className="shadow-xl"
```

---

### Gradients

```css
/* Primary Gradient */
.gradient-primary {
  background: linear-gradient(135deg, #FF006B 0%, #7C3AED 100%);
}

/* Success Gradient */
.gradient-success {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

/* Warning Gradient */
.gradient-warning {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
}
```

#### Aplicação

```tsx
// Botões
<button className="bg-gradient-to-r from-pink-500 to-purple-500">
  Button
</button>

// Headers
<div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
  Header
</div>

// Badge ativo
<div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
  Active
</div>
```

---

## 🎬 Animações

### Transições

```css
/* Transições padrão */
.transition-default {
  transition: all 0.3s ease-out;
}

.transition-fast {
  transition: all 0.15s ease-out;
}

.transition-slow {
  transition: all 0.5s ease-out;
}
```

### Animações Definidas

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Slide In from Top */
@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse (para notificações) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Spin (loading) */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Hover Effects

```tsx
// Scale on hover
className="hover:scale-105 transition-transform"

// Shadow on hover
className="hover:shadow-xl transition-shadow"

// Border on hover
className="hover:border-pink-500 transition-colors"

// Background on hover
className="hover:bg-pink-50 transition-colors"
```

---

## 📱 Responsividade

### Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1280px) { }
```

### Responsive Classes (Tailwind)

```tsx
// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive display
<div className="block md:hidden">Mobile Only</div>
<div className="hidden md:block">Desktop Only</div>
```

---

## 🎯 Ícones

### Lucide React

Biblioteca de ícones oficial.

```tsx
import {
  Home,
  User,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  X,
  Check,
  AlertTriangle,
  Info,
  Heart,
  Calendar,
  Clock
} from 'lucide-react'

// Uso
<Home className="h-5 w-5 text-gray-600" />
<Settings className="h-6 w-6 text-pink-500" />
```

### Tamanhos Padrão

```tsx
// Extra Small
<Icon className="h-3 w-3" />  // 12px

// Small
<Icon className="h-4 w-4" />  // 16px

// Medium (padrão)
<Icon className="h-5 w-5" />  // 20px

// Large
<Icon className="h-6 w-6" />  // 24px

// Extra Large
<Icon className="h-8 w-8" />  // 32px
```

---

## ✅ Boas Práticas

### 1. Consistência Visual

```tsx
// ✅ BOM: Mesmo estilo em todo o app
<button className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl">

// ❌ EVITAR: Estilos diferentes para mesma função
<button className="bg-blue-500 px-4 py-2 rounded">
```

### 2. Acessibilidade

```tsx
// ✅ BOM: Labels e aria-labels
<button aria-label="Fechar modal">
  <X className="h-5 w-5" />
</button>

// ✅ BOM: Contraste adequado
<p className="text-gray-900 bg-white">  // Contraste 21:1

// ❌ EVITAR: Baixo contraste
<p className="text-gray-400 bg-gray-300">  // Contraste insuficiente
```

### 3. Performance

```tsx
// ✅ BOM: Usar CSS para animações
className="transition-all duration-300"

// ❌ EVITAR: JavaScript para animações simples
style={{ transition: 'all 0.3s' }}
```

### 4. Responsividade

```tsx
// ✅ BOM: Mobile-first
<div className="p-4 md:p-6 lg:p-8">

// ❌ EVITAR: Desktop-first
<div className="p-8 md:p-6 sm:p-4">
```

### 5. Reutilização

```tsx
// ✅ BOM: Componentes reutilizáveis
const PrimaryButton = ({ children, ...props }) => (
  <button
    className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl"
    {...props}
  >
    {children}
  </button>
)

// ❌ EVITAR: Repetir estilos
<button className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl">
<button className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-xl">
```

---

## 📚 Recursos

- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Radix UI Docs](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**E4CEO Design System** - Construindo experiências consistentes ✨
