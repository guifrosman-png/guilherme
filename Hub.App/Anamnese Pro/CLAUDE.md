# CLAUDE.md

Este arquivo fornece orientações ao Claude Code (claude.ai/code) ao trabalhar com código neste repositório.

## Projeto: Anamnese Pro

O **Anamnese Pro** é um módulo especializado do **Hub.App** voltado para profissionais de saúde, psicologia, nutrição e tatuagem que precisam de **controle rigoroso e inteligente de fichas de anamnese**.

## Estrutura do Projeto

```
Anamnese Pro/
├── CLAUDE.md                 # Este arquivo
├── prd_anamnese_pro (1).md   # Documento de Requisitos de Produto
├── docs/                     # Documentação técnica
├── agents/                   # Agentes de IA especializados
└── .plans/                   # Planos de desenvolvimento
```

## Comandos de Desenvolvimento

- **Instalar dependências**: `npm i`
- **Servidor de desenvolvimento**: `npm run dev`
- **Build de produção**: `npm run build`
- **Testes**: `npm test`
- **Lint**: `npm run lint`
- **Typecheck**: `npm run typecheck`

## Stack Tecnológica Principal

- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI com shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Validação**: Zod
- **Database**: PostgreSQL com Prisma
- **Autenticação**: JWT

## Características Específicas do Módulo

### Funcionalidade Principal
- **Fichas de Anamnese Inteligentes** com reutilização automática
- **Templates especializados** por área profissional (tatuagem, psicologia, nutrição)
- **Quiz interativo** em vez de formulários tradicionais
- **Versionamento de fichas** com histórico completo
- **Integração com CRM** para sincronização de dados

### Experiência do Usuário
- **Interface gamificada** com progress bar e feedback visual
- **Fluxo condicional** que adapta perguntas baseadas nas respostas
- **Linguagem acolhedora** e elementos educativos
- **Design responsivo** otimizado para mobile

### Integrações
- **CRM (obrigatória)**: Sincronização de dados pessoais
- **MultiFins (opcional)**: Trigger para receitas automáticas
- **Marketing Pro (futuro)**: Analytics de origem dos clientes
- **Galeria Pro (futuro)**: Conexão com portfólio de trabalhos

## Estrutura de Dados Principal

```typescript
interface AnamneseFicha {
  id: string;
  tenantId: string;
  clienteId: string;  // Referência ao CRM
  templateTipo: 'tatuagem' | 'psicologia' | 'nutricao';
  versao: number;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dadosSaude: Record<string, any>;  // Campos flexíveis por template
  origemCliente: string;
  assinaturaDigital: string;
  pdfGeradoUrl: string;
  status: 'ativa' | 'arquivada';
}
```

## Padrões de Desenvolvimento

### Convenções de Código
- Use TypeScript em todos os arquivos
- Componentes em PascalCase
- Hooks customizados com prefixo `use`
- Funções utilitárias em camelCase
- Constantes em SCREAMING_SNAKE_CASE

### Estrutura de Componentes
- Componentes de UI reutilizáveis em `/components/ui/`
- Componentes específicos do módulo em `/components/anamnese/`
- Hooks personalizados em `/hooks/`
- Utilitários em `/lib/`
- Tipos em `/types/`

### Validação e Formulários
- Use Zod para validação de esquemas
- React Hook Form para gerenciamento de estado de formulários
- Validação no frontend e backend
- Mensagens de erro amigáveis e contextuais

### Responsividade
- Mobile-first approach
- Teste em dispositivos móveis (experiência principal)
- Breakpoints do Tailwind CSS
- Componentes adaptativos para diferentes telas

## Objetivos de Performance

- **Tempo de carregamento**: < 2 segundos na primeira visita
- **Tempo de preenchimento**: 80% de redução para clientes recorrentes
- **Taxa de abandono**: < 5% no quiz interativo
- **Precisão dos dados**: > 95% de fichas completas

## Considerações de Segurança

- **Dados sensíveis**: Criptografia de informações de saúde
- **LGPD**: Conformidade com lei de proteção de dados
- **Auditoria**: Log de todas as alterações nas fichas
- **Backup**: Retenção segura de PDFs gerados

## Métricas de Sucesso

- **Adoção**: 25 profissionais ativos em 3 meses
- **Eficiência**: 80% redução no tempo de preenchimento
- **Satisfação**: NPS > 50 específico do módulo
- **Integração**: 80% dos usuários também usam MultiFins

## Notas Importantes

- **Responsabilidade legal**: Fichas têm valor legal para profissionais de saúde
- **Integração obrigatória**: CRM deve estar ativo para funcionamento
- **Experiência mobile**: Priorizar sempre a versão mobile
- **Acessibilidade**: Seguir WCAG 2.1 AA para inclusão

---

## 🎨 Sistema de Cores Dinâmicas por Profissão

### Implementação (Janeiro 2025)

O sistema agora possui **cores temáticas dinâmicas** que mudam automaticamente baseadas na profissão escolhida no onboarding.

#### Profissões e Paletas de Cores

```typescript
const CORES_TEMAS = {
  tatuagem: {
    gradient: 'from-pink-500 to-purple-500',
    bg50: 'bg-pink-50',
    border200: 'border-pink-200',
    border500: 'border-pink-500',
    text500: 'text-pink-500',
    focus: 'focus:border-pink-500',
    hover: 'hover:border-pink-300',
  },
  psicologia: {
    gradient: 'from-blue-500 to-cyan-500',
    bg50: 'bg-blue-50',
    border200: 'border-blue-200',
    border500: 'border-blue-500',
    text500: 'text-blue-500',
    focus: 'focus:border-blue-500',
    hover: 'hover:border-blue-300',
  },
  nutricao: {
    gradient: 'from-green-500 to-emerald-500',
    bg50: 'bg-green-50',
    border200: 'border-green-200',
    border500: 'border-green-500',
    text500: 'text-green-500',
    focus: 'focus:border-green-500',
    hover: 'hover:border-green-300',
  },
  fisioterapia: {
    gradient: 'from-orange-500 to-amber-500',
    bg50: 'bg-orange-50',
    border200: 'border-orange-200',
    border500: 'border-orange-500',
    text500: 'text-orange-500',
    focus: 'focus:border-orange-500',
    hover: 'hover:border-orange-300',
  },
  estetica: {
    gradient: 'from-purple-500 to-fuchsia-500',
    bg50: 'bg-purple-50',
    border200: 'border-purple-200',
    border500: 'border-purple-500',
    text500: 'text-purple-500',
    focus: 'focus:border-purple-500',
    hover: 'hover:border-purple-300',
  },
};
```

#### Como Implementar em Novos Componentes

1. **Adicionar função getCoresTema() no início do componente:**

```typescript
const getCoresTema = () => {
  const config = localStorage.getItem('anamneseConfig');
  const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';

  const cores = { /* objeto de cores acima */ };
  return cores[templateProfissao] || cores.tatuagem;
};

const coresTema = getCoresTema();
```

2. **Usar template literals para aplicar cores:**

```tsx
// ✅ CORRETO
<div className={`border-2 ${coresTema.border500} ${coresTema.bg50}`}>

// ❌ ERRADO (não funciona)
<div className="border-2 ${coresTema.border500}">
```

3. **Importante: SEMPRE usar backticks (`) para template literals em className**

#### Componentes Atualizados com Cores Dinâmicas

- ✅ `QuizContainer.tsx` - Quiz de anamnese
- ✅ `LinkGenerated.tsx` - Modal de links
- ✅ `ClienteProfile.tsx` - Perfil do cliente
- ✅ `AnamneseDetails.tsx` - Detalhes da anamnese
- ✅ `TemplateEditor.tsx` - Editor de templates
- ✅ `TemplateSettings.tsx` - Configurações de templates
- ✅ `Onboarding.tsx` - Fluxo de onboarding

#### Contraste e Legibilidade

**REGRA DE OURO**: Sempre garantir contraste adequado entre texto e fundo!

- ✅ Texto escuro (`text-gray-900`) em fundos claros (brancos/bg50)
- ✅ Texto branco (`text-white`) em fundos escuros (gradientes coloridos)
- ❌ NUNCA usar `text-white` em fundos brancos/claros
- ❌ NUNCA usar texto claro em fundos claros

#### Armazenamento

As configurações são salvas no **localStorage**:

```typescript
{
  templateProfissao: 'tatuagem' | 'psicologia' | 'nutricao' | 'fisioterapia' | 'estetica',
  personalizacao: { /* respostas do onboarding */ },
  dataConfiguracao: '2025-01-17T...',
  onboardingConcluido: true
}
```

---

## 🚀 Sistema de Onboarding em 3 Etapas

### Implementação (Janeiro 2025)

O onboarding foi expandido de 2 para **3 etapas** para personalização completa.

#### Fluxo do Onboarding

**Etapa 1: Escolha da Profissão**
- Grid com 5 profissões (tatuagem, psicologia, nutrição, fisioterapia, estética)
- Cards visuais com ícones e descrições
- Cores pink/purple para destacar

**Etapa 2: Perguntas Específicas (NOVO!)**
- 2 perguntas personalizadas por profissão
- Seleção múltipla permitida
- Cores mudam para blue/cyan
- Exemplos:
  - Tatuagem: estilo, serviços oferecidos
  - Psicologia: abordagem terapêutica, público-alvo
  - Nutrição: especialidade, serviços

**Etapa 3: Confirmação**
- Resumo da profissão escolhida
- Lista de benefícios
- Resumo das personalizações selecionadas
- Cores green/emerald para "sucesso"
- Botão "Começar a Usar! 🚀"

#### Estrutura de Dados das Perguntas

```typescript
const PERGUNTAS_PROFISSAO: Record<string, Array<{
  id: string;
  pergunta: string;
  opcoes: string[]
}>> = {
  tatuagem: [
    {
      id: 'estilo',
      pergunta: 'Qual seu estilo principal de tatuagem?',
      opcoes: ['Realista', 'Old School', 'Aquarela', 'Minimalista', 'Geométrica', 'Oriental', 'Outro']
    },
    // ...
  ],
  // ... outras profissões
};
```

#### Indicadores de Progresso

- 3 bolinhas indicando a etapa atual
- Cores mudam conforme o progresso:
  - Etapa 1: pink
  - Etapa 2: blue
  - Etapa 3: green

---

## 🐛 Problemas Resolvidos Recentemente

### Texto Branco em Fundo Branco no Quiz (17/01/2025)

**Problema**: Vários elementos do quiz estavam com `text-white` ou template literals mal formatados, resultando em texto invisível em fundos claros.

**Solução Aplicada**:

1. **Corrigidos todos os template literals**:
   - ❌ `className="border ${coresTema.border500}"` (string literal, não funciona)
   - ✅ `className={`border ${coresTema.border500}`}` (template literal correto)

2. **Garantido contraste adequado**:
   - Todos os inputs: `text-gray-900`
   - Todas as labels: `text-gray-900`
   - Botões de seleção: `text-gray-900`
   - Header com gradient: `text-white` (único lugar permitido)

3. **Arquivos corrigidos**:
   - `QuizContainer.tsx` (principal) - 15+ ocorrências
   - Inputs de texto/textarea/select - formatação de className
   - Botões de sim/não - cores de borda dinâmicas
   - Header e navegação - mantidos com text-white apropriado

**Resultado**: Todos os textos agora visíveis com contraste adequado em todos os temas!

---

## 📝 Próximas Implementações Planejadas

### Modal de Confirmação de Mudança de Template

**Objetivo**: Prevenir mudanças acidentais de template que podem causar perda de dados.

**Funcionalidade**:
- ⚠️ Modal de confirmação ao tentar mudar de profissão
- 📋 Aviso sobre perda de perguntas personalizadas
- 🎨 Aviso sobre mudança de cores do sistema
- ✅ Botão "Sim, tenho certeza" (vermelho/laranja)
- ❌ Botão "Cancelar" (cinza)

**Localização**: `TemplateSettings.tsx` ou componente de Configurações

**Mensagem sugerida**:
> "⚠️ Atenção! Mudar o template irá:
> - Alterar todas as cores do sistema
> - Pode afetar suas perguntas personalizadas
> - Modificar a experiência de seus clientes
>
> Tem certeza que deseja continuar?"

---

## 📚 Referências de Código

### Padrão para Cores Dinâmicas

Sempre que adicionar um novo componente que precisa de cores dinâmicas:

```typescript
// 1. Adicionar no início do componente
const getCoresTema = () => {
  const config = localStorage.getItem('anamneseConfig');
  const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';
  const cores = { /* paleta de cores */ };
  return cores[templateProfissao] || cores.tatuagem;
};
const coresTema = getCoresTema();

// 2. Usar nos elementos
<div className={`border-2 ${coresTema.border500}`}>
<input className={`${coresTema.focus} ${coresTema.hover}`} />
<button className={`bg-gradient-to-r ${coresTema.gradient}`}>
```

### Padrão para Contraste de Texto

```typescript
// ✅ Fundos claros (branco, bg-50, bg-100)
className="text-gray-900"

// ✅ Fundos escuros (gradientes, bg-500+)
className="text-white"

// ✅ Fundos coloridos claros
className="text-gray-700" ou "text-gray-800"
```

---

**Última atualização**: 17 de Janeiro de 2025
**Versão do sistema**: 1.1 (com cores dinâmicas e onboarding 3 etapas)