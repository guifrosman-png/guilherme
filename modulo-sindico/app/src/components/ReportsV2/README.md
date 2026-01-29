# ReportsV2 Module

Este módulo gerencia a criação e exibição de **Relatórios Avançados**. Diferente dos Dashboards (que são visões gerais fixas), os Relatórios são composições detalhadas e focadas em temas específicos (ex: Fluxo de Caixa, Lucratividade).

## 📂 Estrutura do Diretório

Os relatórios são organizados estritamente por **domínio**.

```
src/components/ReportsV2/
├── ReportsView.tsx          # Componente principal de visualização
├── index.ts                 # Exporta as configurações para o App
│
├── reports/                 # Definição dos Relatórios
│   ├── financeiro/          # Domínio Financeiro
│   │   ├── financeiro.ts    # Dashboard Geral Financeiro
│   │   ├── fluxoCaixa.ts    # Relatório de Fluxo de Caixa
│   │   ├── lucratividade.ts # Relatório de Lucratividade
│   │   └── index.ts         # Registro do domínio
│   │
│   ├── crm/                 # Domínio CRM
│   │   ├── conversas.ts
│   │   ├── chamados.ts
│   │   └── index.ts
│   │
│   └── index.ts             # Registro central de relatórios
│
└── services/                # Serviços e Mocks
```

---

## 🚀 Como funciona

### Arquitetura de "Lego"
O `ReportsV2` não define *como* os dados são calculados ou como os gráficos parecem. Ele apenas **monta** as peças que vêm do `MiniCardsGrid`.

1. **Importação**: Um arquivo de relatório (ex: `fluxoCaixa.ts`) importa os **KPIs** e **Gráficos** (Cards) da biblioteca `MiniCardsGrid/cards`.
2. **Composição**: Ele define a estrutura da página (título, descrição, lista de KPIs, lista de Gráficos).
3. **Renderização**: O `ReportsView.tsx` lê essa configuração e renderiza a tela.

### Exemplo de Configuração de Relatório (`fluxoCaixa.ts`)

```typescript
import { recebidoCard, pagoCard } from '../../../MiniCardsGrid/cards/financeiro';

export const fluxoCaixaReport: DashboardConfig = {
    id: 'report-fluxo-caixa',
    title: 'Fluxo de Caixa',
    module: 'financeiro',
    kpis: [
        recebidoCard, // Reutiliza configuração visual definida em MiniCardsGrid
        pagoCard
    ],
    charts: [
        // ... gráficos
    ]
};
```

---

## 🛠 Como criar um novo Relatório?

1. **Escolha o Domínio** (ou crie uma nova pasta em `reports/`).
2. **Crie o Arquivo** (ex: `reports/vendas/performanceVendedores.ts`).
3. **Importe os Cards** necessários de `MiniCardsGrid/cards/vendas`.
4. **Defina a Configuração** (Título, ID, Owner).
5. **Registre** no `index.ts` do domínio e no `index.ts` principal de `reports/`.

---

## 🔍 Context Filtering

O sistema possui filtragem automática de contexto.
- Se o usuário está na rota `/financeiro`, o `ReportsView` filtrará automaticamente para exibir apenas relatórios com `module: 'financeiro'`.

---

## 🔍 Integração de Filtros

Os relatórios (`ReportsView`) incorporam o sistema de filtros universais para permitir refinamento de dados.

- **Status:** O componente `ReportsView` gerencia filtros locais ou recebe filtros globais via props.
- **Componente:** Utiliza `src/components/Filters/UniversalFilterMenu` para renderizar a UI de filtros.
- **Dados:** Os filtros aplicados são passados para os serviços de dados (`useReportsData`) para filtrar a lista de relatórios ou o conteúdo dos relatórios.
