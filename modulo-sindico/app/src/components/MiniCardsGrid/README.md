# MiniCardsGrid Module

Este módulo implementa o sistema de cards e dashboards da aplicação. Ele é responsável por gerenciar métricas, configurações de visualização (cards) e layouts de dashboards.

## 📂 Estrutura do Diretório

O módulo organiza seus recursos por **domínio** para facilitar a escalabilidade.

```
src/components/MiniCardsGrid/
├── MiniCardsGrid.tsx        # Componente principal (Grid System)
├── types.ts                 # Definições de tipos principais
├── constants.tsx            # Cores, tamanhos e configurações globais
│
├── cards/                   # [NOVO] Biblioteca de Cards (Visual + Config)
│   ├── financeiro/          # Cards do domínio Financeiro
│   │   ├── ReceitaTotalCard.ts
│   │   ├── FluxoCaixaChart.ts
│   │   └── index.ts
│   ├── crm/                 # Cards do domínio CRM
│   └── vendas/              # Cards do domínio Vendas
│
├── metrics/                 # [NOVO] Definição de Métricas (Lógica + Dados)
│   ├── financeiro/          # Métricas do domínio Financeiro
│   │   ├── ReportSalesMetric.ts
│   │   ├── FinInadimplenciaMetric.ts
│   │   └── index.ts
│   ├── estoque/
│   └── index.ts             # Registro central de métricas
│
├── layouts/                 # [NOVO] Layouts de Dashboard padrão
│   ├── financeiro/          # Layout padrão do Financeiro
│   ├── home/
│   └── index.ts
│
└── components/              # Sub-componentes do Grid (Canvas, Renderers)
    ├── CardCreatorModal.tsx
    ├── CardRenderer.tsx
    └── ...
```

---

## 🧩 Conceitos Chave

### 1. Métricas (`metrics/`)
Definem a **lógica de dados**. Uma métrica sabe "como buscar o dado" (API mock ou real), qual seu formato (moeda, porcentagem) e ícone padrão.
- **Arquivo**: Um arquivo por métrica (ex: `ReportSalesMetric.ts`).
- **Objetivo**: Fornecer dados puros para serem consumidos.

### 2. Cards (`cards/`)
Definem a **visualização**. Um card utiliza uma ou mais métricas, ou dados estáticos, para montar uma visualização (KPI, Gráfico, Tabela).
- **Arquivo**: Um arquivo por card/gráfico (ex: `ReceitaTotalCard.ts`, `FluxoCaixaChart.ts`).
- **Uso**: São importados pelos Relatórios (`ReportsV2`) para compor telas.

### 3. Layouts (`layouts/`)
Definem a **disposição** dos cards na tela inicial de cada módulo (Dashboard Geral).

---

## 🛠 Como criar um novo Card?

1. **Defina a Métrica** (se necessária lógica complexa) em `metrics/[dominio]/NovaMetrica.ts`.
2. **Crie a Configuração do Card** em `cards/[dominio]/NovoCard.ts`.
   ```typescript
   export const novoCard: DashboardKPI = {
       id: 'novo-card-id',
       label: 'Título do Card',
       value: 100,
       // ... outras configs visual
   };
   ```
3. **Exporte** no `index.ts` do domínio.
4. **Importe** no Relatório desejado em `ReportsV2`.

---
## 🔍 Integração de Filtros

O `MiniCardsGrid` pode receber filtros externos (vindouros do `UniversalFilterMenu`) através das props. Embora o processamento visual dos filtros aconteça no componente "pai" (App.tsx ou ReportsView), o grid está preparado para reagir a dados filtrados.

- **Componente de Filtro:** `src/components/Filters/UniversalFilterMenu`
- **Tipos:** `src/components/Filters/types.ts`

