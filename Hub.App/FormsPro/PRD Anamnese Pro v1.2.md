# 📋 PRD - Módulo Anamnese Pro

## Documento de Requisitos de Produto

**Autor:** Hub.App Product Team
**Data:** 7 de Novembro de 2025
**Versão:** 2.7 - Sistema de Templates Customizáveis + Dashboard com Gráficos Dinâmicos + Filtros Globais
**Módulo:** Anamnese Pro

---

## CHANGELOG v2.7 (Novembro 2025)

### 🎨 UI/UX Melhorias
- **Seletor de tipo de pergunta em Pills:** Botões horizontais arredondados (Pills) para escolher tipo de pergunta no Template Editor
  - Visual: `📝 Texto Livre` `✓✗ Sim ou Não` `🔘 Múltipla Escolha`
  - Cores: Azul quando selecionado, cinza quando não selecionado
  - Efeito hover com scale 105%

- **Campo de título de pergunta aumentado:** Input maior e mais visível para digitar título da pergunta
  - Padding vertical aumentado: `py-3.5` (antes: `py-2`)
  - Fonte maior: `text-base`
  - Border azul no focus para destaque

- **Percentuais em 1 casa decimal:** Gráficos de pizza e donut mostram percentuais com 1 casa decimal
  - Formato: `31.2%`, `65.5%`, `100.0%`
  - Mais legível e menos carregado visualmente

- **Gráfico de Origem para todas profissões:** Removido gráfico de Faixa Etária exclusivo de Psicologia
  - Agora todas as profissões veem "Origem dos Clientes" (Como conheceu)
  - Dados: Instagram, Google, Indicação, Outro
  - Visual consistente entre profissões

---

[... resto do conteúdo do PRD permanece inalterado ...]

## 1. 🎯 Resumo e Visão do Módulo

### Propósito do Módulo

O Anamnese Pro é um módulo especializado do Hub.App voltado para profissionais de saúde, psicologia, nutrição e tatuagem que precisam de controle rigoroso e inteligente de fichas de anamnese.

### Foco Inicial

Tatuadoras - profissionais que realizam atendimentos individualizados e precisam de anamnese detalhada com reutilização automática.

### Proposta de Valor

"O único módulo de anamnese que elimina completamente o retrabalho: fichas inteligentes que se atualizam automaticamente, integradas ao ecossistema Hub.App."

### Posicionamento no Hub.App

O Anamnese Pro é um módulo especializado que complementa os módulos gratuitos (CRM, Agenda) e integra-se naturalmente com módulos pagos (MultiFins, Marketing Pro).

### Responsabilidade Específica

APENAS fichas de anamnese especializadas - Todo o resto (histórico de clientes, galeria, financeiro, marketing) é delegado aos módulos especializados.

---

## 21. 📝 Sistema de Templates Customizáveis (v1.5 - Janeiro 2025)

### 21.1. Visão Geral
**Sistema completo de gerenciamento de templates** que permite ao profissional criar, editar e personalizar as perguntas da anamnese de acordo com suas necessidades específicas.

### 21.2. Aba Templates - Interface de Gerenciamento

#### 21.2.1. Lista de Templates
**Grid de cards visual** mostrando todos os templates disponíveis

**Informações exibidas em cada card:**
- Nome do template
- Número de perguntas
- Data de criação
- Descrição (opcional)
- Badges de status:
  - **✓ ATIVO:** Template em uso atualmente
  - **📌 PADRÃO:** Template que veio pré-configurado
  - **⚠️ VAZIO:** Template sem nenhuma pergunta
  - **⚠️ 20+:** Template com mais de 20 perguntas (aviso)

**Botões de ação por template:**
- **👁️ Preview:** Visualizar como o cliente verá
- **✏️ Editar:** Abrir editor completo
- **✓ Ativar:** Definir como template ativo
- **📋 Duplicar:** Criar cópia com novo nome
- **🗑️ Excluir:** Remover template (com restrições)

### 21.3. Editor de Templates

#### 21.3.1. Interface do Editor
**Modal fullscreen** com todas as funcionalidades de edição

**Seletor de tipo de pergunta:**
- **Visual:** Pills horizontais (botões arredondados)
- **Opções:** 📝 Texto Livre | ✓✗ Sim ou Não | 🔘 Múltipla Escolha
- **Cores:** Azul quando selecionado, cinza quando não
- **Efeito:** Hover com scale 105%

**Campo de título:**
- Input grande e visível: `py-3.5` + `text-base`
- Placeholder: "Digite a pergunta..."
- Border azul no focus para destaque

**Lista de Perguntas:**
- Exibição de todas as perguntas em ordem
- Ícone ☰ para arrastar e reordenar
- Tipo da pergunta (Texto Livre, Sim/Não, Múltipla Escolha)
- Badge "Obrigatória" se for campo obrigatório
- Botões: Editar / Excluir

#### 21.3.2. Tipos de Pergunta

**1. Texto Livre:**
- Cliente responde digitando texto aberto
- Ideal para: descrições detalhadas, históricos, observações
- Exemplo: "Qual medicamento você toma?"

**2. Sim ou Não:**
- Cliente escolhe entre duas opções
- Ideal para: confirmações, validações binárias
- Exemplo: "Você tem alergias?"
- Visual: Dois botões grandes (Sim/Não)

**3. Múltipla Escolha:**
- Cliente seleciona uma opção de uma lista
- Requer mínimo 2 opções
- Ideal para: escolhas padronizadas, categorização
- Exemplo: "Qual seu tipo de pele?" → Oleosa, Seca, Mista, Sensível
- Visual: Lista de opções clicáveis

---

## 23. 📊 Dashboard Funcional com Dados Reais (v1.6 - Janeiro 2025)

### 23.1. Integração com Dados Filtrados

**Dashboard.tsx atualizado** para receber dados já filtrados:

```typescript
interface DashboardProps {
  anamneses: AnamneseData[];  // Já filtradas por profissão e período
  clientes: ClienteData[];    // Já filtrados por profissão e período
}
```

**Vantagens:**
- Performance otimizada (filtros calculados uma vez no App.tsx)
- Gráficos sempre sincronizados com filtro de período
- Isolamento automático por profissão

### 23.2. Gráficos com Dados Corretos

#### 23.2.1. Gráfico de Clientes por Mês
**Fonte de dados:** `cliente.primeiraAnamnese`

**Funcionamento:**
- Agrupa clientes por mês de primeira anamnese
- 12 meses (Jan-Dez) no eixo X
- Cores dinâmicas por profissão
- Empty state quando não há clientes

#### 23.2.2. Gráfico de Anamneses por Mês
**Fonte de dados:** `anamnese.data`

**Funcionamento:**
- Agrupa anamneses por mês de criação
- 12 meses (Jan-Dez) no eixo X
- Linha suave com gradiente
- Empty state quando não há anamneses

#### 23.2.3. Gráfico de Distribuição por Gênero
**Fonte de dados:** `cliente.sexo` ou `anamnese.dadosCompletos.genero`

**Funcionamento:**
- Busca primeiro no campo direto do cliente
- Fallback para última anamnese se não encontrar
- Categorias: Feminino, Masculino, Não Informado
- Cores: Rosa (#ec4899), Azul (#3b82f6), Cinza (#94a3b8)
- **Percentuais:** 1 casa decimal (ex: `65.5%`)
- Empty state quando não há dados demográficos

#### 23.2.4. Gráfico de Origem dos Clientes
**Fonte de dados:** `anamnese.dadosCompletos.comoConheceu` da PRIMEIRA anamnese

**IMPORTANTE:** Este gráfico agora é **universal** para todas as profissões.

**Funcionamento:**
- Busca origem da primeira anamnese de cada cliente
- Categorias: Instagram, Google, Indicação, Outro
- Ordenado por valor (maior → menor)
- Donut chart com cores variadas
- **Percentuais:** 1 casa decimal (ex: `42.3%`)
- Empty state quando não há dados de origem

**Removido:** Gráfico de Faixa Etária exclusivo para Psicologia foi removido.

---

## 26. 🎨 Melhorias de UI/UX (v2.7 - Novembro 2025)

### 26.1. Seletor de Tipo de Pergunta em Pills

**Problema resolvido:** Botões quadrados ocupavam muito espaço e eram visualmente pesados.

**Solução implementada:** Pills horizontais (botões arredondados)

**Visual:**
```
📝 Texto Livre    ✓✗ Sim ou Não    🔘 Múltipla Escolha
```

**Características:**
- Formato: `rounded-full` (totalmente arredondados)
- Layout: `flex gap-2` (lado a lado)
- Tamanho: `px-4 py-2` (compacto)
- Ícone: `text-lg` (tamanho médio)
- Texto: `text-sm font-medium` (legível)
- Cores:
  - **Selecionado:** `border-blue-500 bg-blue-500 text-white shadow-md`
  - **Não selecionado:** `border-gray-300 bg-white text-gray-700 hover:border-gray-400`
- Efeito: `hover:scale-105` (aumenta 5% no hover)

**Localização:** `TemplateEditor.tsx` - linha ~480

### 26.2. Campo de Título de Pergunta Aumentado

**Problema resolvido:** Campo de input muito pequeno e difícil de ler.

**Solução implementada:** Input maior e mais visível

**Características:**
- Padding vertical: `py-3.5` (antes: `py-2`)
- Fonte: `text-base` (tamanho padrão)
- Border: `border-2 border-gray-200`
- Focus: `focus:border-blue-500` (destaque azul)
- Placeholder: "Digite a pergunta..."

**Localização:** `TemplateEditor.tsx` - linha ~507

### 26.3. Percentuais em 1 Casa Decimal

**Problema:** Percentuais com 2 casas decimais eram visualmente carregados.

**Solução:** Uniformizado para 1 casa decimal em todos os gráficos.

**Formato:** `31.2%`, `65.5%`, `100.0%`

**Arquivos modificados:**
- `Dashboard.tsx` - Função `getDadosSexo()` (linha ~283-290)
- `Dashboard.tsx` - Função `getDadosOrigem()` (linha ~342)
- `graficoHelpers.ts` - Função `processarRespostasSimNao()` (linha ~315, 320)
- `graficoHelpers.ts` - Função `processarRespostasMultipla()` (linha ~346)

**Código:**
```typescript
percentual: ((valor / total) * 100).toFixed(1)  // 1 casa decimal
```

### 26.4. Gráfico de Origem Universal

**Mudança:** Removido gráfico de Faixa Etária exclusivo de Psicologia.

**Motivo:** Simplificação e consistência entre profissões.

**Agora:** Todas as profissões veem "Origem dos Clientes" (Como conheceu)

**Dados mostrados:**
- Instagram
- Google (Publicidade)
- Indicação de amigo
- Outro (personalizado)

**Arquivo modificado:** `Dashboard.tsx` - linhas ~629-685

**Antes:**
```typescript
{profissao === 'psicologia' ? (
  // Gráfico de Faixa Etária
) : (
  // Gráfico de Origem
)}
```

**Depois:**
```typescript
{/* Gráfico de Origem para TODAS as profissões */}
<CardTitle>Origem dos Clientes</CardTitle>
<CardDescription>Como seus clientes conheceram você</CardDescription>
```

---

**Última atualização**: 7 de Novembro de 2025
**Versão do sistema**: 2.7 (UI melhorada + percentuais 1 casa + origem universal)

---

© 2025 Hub.App - Módulo Anamnese Pro v2.7
