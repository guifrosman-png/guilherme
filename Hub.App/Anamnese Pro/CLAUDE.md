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

## 📝 Sistema de Templates Customizáveis (v1.5 - Janeiro 2025)

### Implementação Completa

O sistema de templates permite ao profissional criar, editar e personalizar as perguntas da anamnese.

#### Componentes Criados

**1. TemplatesList.tsx**
- Grid de cards com todos os templates
- Badges visuais: ATIVO, PADRÃO, ⚠️ VAZIO, ⚠️ 20+
- Botões: Preview, Editar, Ativar, Duplicar, Excluir
- Filtro automático por profissão

**2. TemplateEditor.tsx**
- Editor fullscreen com drag & drop
- Componente `SortablePergunta` para cada pergunta
- Biblioteca @dnd-kit para arrastar e reordenar
- Formulário de criação/edição de perguntas
- 3 tipos: Texto Livre, Sim/Não, Múltipla Escolha
- Validações completas (títulos duplicados, caracteres inválidos, limite 20+)

**3. TemplatePreview.tsx**
- Modal de visualização simulada
- Renderiza perguntas usando TemplateQuizRenderer
- Não salva respostas (apenas teste)
- Info box: "Modo de Visualização"

**4. TemplateQuizRenderer.tsx**
- Renderizador universal de perguntas customizadas
- Usado em: Preview + Quiz real (Etapa 2)
- Cores dinâmicas por profissão
- Validação de campos obrigatórios

#### Arquivos de Utilidades

**1. utils/defaultTemplates.ts**
- Funções para criar templates padrão das 6 profissões
- `inicializarTemplatesPadrao()` - Cria templates ao primeiro uso
- Templates prontos: Tatuagem, Psicologia, Nutrição, Fisioterapia, Estética, Consultoria
- 9-10 perguntas pré-configuradas por profissão

**2. utils/templateHelpers.ts**
- CRUD completo de templates: get, salvar, excluir, ativar, duplicar
- CRUD de perguntas: adicionar, editar, excluir, reordenar
- Geradores de ID únicos
- Armazenamento no localStorage (chave: `anamneseTemplates`)

**3. types/templates.ts**
- Tipos TypeScript completos
- `Template`: estrutura principal
- `PerguntaCustomizada`: estrutura de pergunta
- `TipoPergunta`: 'texto' | 'simNao' | 'multiplaEscolha'
- Labels e ícones por tipo

#### Integração com Quiz

**QuizContainer.tsx - Etapa 2**
- Carrega template ativo automaticamente
- Renderiza perguntas customizadas via TemplateQuizRenderer
- Validações de campos obrigatórios funcionam
- Respostas salvas em `respostasCustomizadas`
- Fallback para perguntas fixas se não houver template

#### Funcionalidades Implementadas

**Drag & Drop:**
- Biblioteca: @dnd-kit/core + @dnd-kit/sortable
- Sensores: Mouse, Touch, Teclado (acessibilidade)
- Feedback visual: Opacidade, sombra, cursor
- Salvamento automático da nova ordem

**Validações:**
- ⚠️ Títulos duplicados (case-insensitive)
- ⚠️ Caracteres inválidos: `< > { } [ ] \`
- ⚠️ Limite de 20 perguntas (aviso, mas permite)
- ⚠️ Template vazio não pode ser ativado
- ⚠️ Múltipla escolha precisa de 2+ opções

**Badges de Status:**
- ✓ ATIVO (cor da profissão)
- 📌 PADRÃO (cinza)
- ⚠️ VAZIO (vermelho) - quando 0 perguntas
- ⚠️ 20+ (laranja) - quando mais de 20 perguntas

**Sistema de Ativação:**
- Apenas 1 template ativo por profissão
- Desativa anterior automaticamente
- Validação de template vazio
- Confirmação para templates 20+

**Sistema de Duplicação:**
- Cria cópia completa com novo ID
- Prompt para nome personalizado
- Todas as perguntas copiadas
- Template duplicado vem desativado

**Sistema de Exclusão:**
- Não pode excluir template padrão
- Não pode excluir template ativo
- Modal de confirmação para outros
- Remove do localStorage

#### Armazenamento

**localStorage - Chave:** `anamneseTemplates`

**Estrutura de dados:**
```
Template {
  id: string (gerado)
  nome: string
  descricao?: string
  profissao: Profissao
  perguntas: PerguntaCustomizada[]
  ativo: boolean
  padrao: boolean
  dataCriacao: string (ISO)
  ultimaEdicao: string (ISO)
  totalPerguntas: number
}

PerguntaCustomizada {
  id: string (gerado)
  tipo: 'texto' | 'simNao' | 'multiplaEscolha'
  titulo: string
  obrigatoria: boolean
  ordem: number
  opcoes?: OpcaoResposta[] (apenas multiplaEscolha)
  dataCriacao: string (ISO)
  ultimaEdicao: string (ISO)
}
```

#### Isolamento Multi-Profissão

**Filtros aplicados:**
- Cada profissão vê apenas seus templates
- Função: `getTemplatesPorProfissao(profissao)`
- Template ativo isolado por profissão
- Novo template recebe profissão atual automaticamente

#### Casos de Uso Comuns

**1. Criar template personalizado:**
1. Clicar "Novo Template"
2. Digitar nome
3. Template criado (duplica o padrão)
4. Editar perguntas conforme necessário

**2. Adaptar template para serviço específico:**
1. Duplicar template existente
2. Renomear (ex: "Tatuagem Colorida")
3. Adicionar/remover perguntas específicas
4. Ativar quando necessário

**3. Testar template antes de usar:**
1. Clicar "Preview" no template
2. Preencher respostas de teste
3. Ver como cliente verá
4. Fechar (nada é salvo)

**4. Reordenar perguntas:**
1. Editar template
2. Clicar no ícone ☰
3. Arrastar para nova posição
4. Ordem salva automaticamente

#### Próximas Melhorias Sugeridas

**Modal de Confirmação de Mudança de Profissão:**
- Avisar sobre perda de contexto
- Confirmar mudança de cores
- Alertar sobre templates diferentes

**Estatísticas de Uso:**
- Quantas anamneses usaram cada template
- Última vez que foi usado
- Template mais popular

**Exportar/Importar Templates:**
- Salvar template como JSON
- Compartilhar entre profissionais
- Importar template de outra instalação

---

---

## 🎯 Melhorias Recentes - Aba Clientes e Filtros (v1.6 - Novembro 2025)

### Aba Clientes com Status Visual

**Cards de clientes aprimorados** com badges de status:
- **Remota** (Laranja): Anamnese remota pendente ou concluída
- **Concluída** (Verde): Anamnese totalmente preenchida
- **Pendente** (Amarelo): Aguardando preenchimento

**Cards de estatísticas** no topo da aba Clientes:
- Total de Clientes (ícone Users, cores dinâmicas)
- Anamneses Concluídas (ícone CheckCircle, verde)
- Remotas Pendentes (ícone Clock, laranja)

### Sistema de Filtros Global

**Filtro de período unificado** aplicado em TODAS as abas:

**Localização:** Header do app (QuickPeriodSelector)

**Períodos:** Todos, 7d, 30d, 3m, 1a

**Implementação técnica no App.tsx:**
```typescript
const { anamnesesFiltradas, clientesFiltrados } = useMemo(() => {
  const profissaoAtual = templateProfissao || 'tatuagem';

  // 1. Filtrar por profissão
  let anamnesesPorProfissao = anamneses.filter(a => a.profissao === profissaoAtual);
  let clientesPorProfissao = clientes.filter(c => c.profissao === profissaoAtual);

  // 2. Aplicar filtro de período
  const filtrarPorPeriodo = (item: any, campo: string) => {
    if (selectedPeriod === 'todos') return true;
    // ... lógica de cálculo de dias
  };

  const anamnesesFiltradas = anamnesesPorProfissao.filter(a =>
    filtrarPorPeriodo(a, 'data')
  );

  const clientesFiltrados = clientesPorProfissao.filter(c =>
    filtrarPorPeriodo(c, 'ultimaAnamnese')
  );

  return { anamnesesFiltradas, clientesFiltrados };
}, [anamneses, clientes, templateProfissao, selectedPeriod]);
```

**Remoção de filtros redundantes:**
- ❌ Removido: Filtros por status na aba Clientes
- ✅ Mantido: Busca por nome + Filtro de período global

### Integração com Dados Remotos

**ClientePublico.tsx corrigido** para salvar TODOS os campos necessários:

**Campos críticos adicionados:**
```typescript
const novoCliente = {
  // ... campos básicos
  instagram: data.instagram || '', // Para card de cliente
  sexo: data.genero || data.sexo || '', // Para gráfico de gênero
  profissao: profissaoAtual, // CRÍTICO para isolamento
  comoConheceu: data.comoConheceu || '', // Para gráfico de origem
  // ...
};

const novaAnamnese = {
  // ...
  profissao: profissaoAtual, // CRÍTICO para filtros
  // ...
};
```

**Impacto:** Dados remotos agora aparecem corretamente nos gráficos do Dashboard!

### Anamnese Remota com Template Ativo

**Problema resolvido:** Quiz remoto agora usa EXATAMENTE as mesmas perguntas do template ativo.

**App.tsx - handleStartQuiz():**
```typescript
if (mode === 'remoto') {
  const templates = JSON.parse(localStorage.getItem('anamneseTemplates') || '[]');
  const templateAtivo = templates.find((t: any) =>
    t.profissao === profissaoAtual && t.ativo
  );
  const perguntasTemplate = templateAtivo?.perguntas || [];
  handleConfirmTemplate(perguntasTemplate);
}
```

**QuizContainer.tsx:**
- Adicionado prop `customQuestions?: any[]`
- useEffect carrega customQuestions quando fornecido
- Fallback para template padrão se vazio

### Melhorias no Modal de Link Gerado

**LinkGenerated.tsx - Botão fechar destacado:**
- Tamanho: 12x12 (grande e visível)
- Fundo branco com sombra
- Ícone X maior (6x6)
- Hover com escala 110%
- Position absolute no canto superior direito

### Dashboard Funcional com Dados Reais

**Dashboard.tsx atualizado** para receber dados já filtrados por profissão e período.

**Gráficos funcionando corretamente:**
- **Clientes por Mês:** Usa `cliente.primeiraAnamnese`
- **Anamneses por Mês:** Usa `anamnese.data`
- **Distribuição por Gênero:** Usa `cliente.sexo` com fallback para `anamnese.dadosCompletos.genero`
- **Origem dos Clientes:** Usa `comoConheceu` da PRIMEIRA anamnese de cada cliente
- **Faixa Etária (Psicologia):** Calcula idade via `dataNascimento`

**Empty states educativos** em todos os gráficos quando não há dados.

### Sistema de Atualização em Tempo Real

**Problema resolvido:** Atualização instantânea (< 1 segundo) quando cliente completa remotamente.

**Evento customizado `clienteUpdated`:**

**ClientePublico.tsx dispara:**
```typescript
window.dispatchEvent(new CustomEvent('clienteUpdated', {
  detail: { clienteId, acao: 'criado', timestamp: new Date().toISOString() }
}));
```

**App.tsx escuta:**
```typescript
useEffect(() => {
  const handleClienteUpdated = (event: any) => {
    // Recarregar clientes e anamneses do localStorage
    const clientesAtualizados = JSON.parse(localStorage.getItem('clientes') || '[]');
    setClientes(clientesAtualizados);

    const anamnesesAtualizadas = JSON.parse(localStorage.getItem('anamneses') || '[]');
    setAnamneses(anamnesesAtualizadas);

    // Notificação visual
    addNotification({...});
  };

  window.addEventListener('clienteUpdated', handleClienteUpdated);
  return () => window.removeEventListener('clienteUpdated', handleClienteUpdated);
}, []);
```

**Estratégia múltipla:**
1. Evento customizado `clienteUpdated` (primário)
2. Evento storage `window.dispatchEvent(new Event('storage'))`
3. Marcador temporal no localStorage
4. Backup interval verificando a cada 1 segundo

**Resultado:** Profissional vê em tempo real novo cliente, nova anamnese, gráficos atualizados, contadores incrementados.

### Configuração de IP (Temporariamente Revertida)

**Tentativa:** Usar IP local para acessar de outros dispositivos na mesma rede WiFi.

**Problema:** Firewall do Windows bloqueou porta 5173.

**Solução temporária:** Revertido para localhost. Para testar remotamente, abrir link em nova aba do mesmo navegador.

**Futuro:** Implementar com HTTPS e domínio real para produção.

### Casos de Teste Validados

✅ **Anamnese Remota Completa**
- Cliente criado com todos os campos
- Anamnese salva com status "Concluída"
- Profissional recebe notificação
- Dados aparecem em Dashboard, Clientes e Anamneses
- Gráficos atualizados corretamente

✅ **Filtro de Período em Todas as Abas**
- Dashboard, Anamneses e Clientes filtram simultaneamente
- Gráficos refletem período selecionado
- Contadores atualizados corretamente

✅ **Template Ativo em Quiz Remoto**
- Quiz remoto usa perguntas do template ativo
- Ordem respeitada, validações funcionam
- Respostas salvas corretamente

✅ **Isolamento Multi-Profissão**
- Ao mudar profissão, dados são isolados
- Cores mudam automaticamente
- Template padrão da nova profissão carregado

---

**Última atualização**: 3 de Novembro de 2025
**Versão do sistema**: 1.6 (filtros globais + anamnese remota sincronizada + dashboard funcional)