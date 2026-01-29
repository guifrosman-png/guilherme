# Sistema de Métricas e Visualização - MiniCardsGrid

Este documento detalha a arquitetura do sistema de métricas, filtros e exploração de dados implementado no componente `MiniCardsGrid`.

## 1. Visão Geral

O sistema funciona como um construtor de dashboards baseado em widgets (`CanvasComponent`). Cada card pode renderizar dados estáticos (configurados manualmente) ou dinâmicos (conectados a uma fonte de dados).

### Fluxo Principal
1.  **Configuração (UI)**: Usuário define métricas e filtros no `MetricPropertiesPanel`.
2.  **Processamento (Hook)**: `useMetricsBuilder` traduz a configuração em dados.
3.  **Renderização (Card)**: `CardRenderer` adapta os dados para o gráfico ou tabela escolhido.
4.  **Exploração (Modal)**: `ExplorarModal` permite drill-down nos dados brutos.

---

## 2. Estrutura de Dados (`MetricsQuery`)

A configuração de dados de um card reside em `comp.dataSource.metricsQuery`.

```typescript
interface MetricsQuery {
  metric: string;              // ID da métrica primária (ex: 'gross-profit')
  aggregation: string;         // 'sum', 'count', 'avg', etc.
  dimension?: string;          // Campo para agrupamento (Eixo X / Linhas)
  
  // Filtros Avançados (Backend/Complexos)
  filters?: FilterGroup;       
  
  // Filtros Simples (Drill-in)
  simpleFilters?: Array<{ field, operator, value }>;
  
  // Múltiplas Métricas
  additionalMetrics?: Array<{ metric, aggregation }>;
  
  // Comparação Temporal
  compareWithPrevious?: boolean;
}
```

---

## 3. Processamento de Dados (`useMetricsBuilder`)

O hook `useMetricsBuilder` é o motor de dados. Ele suporta 3 estratégias de busca, definidas no arquivo de definições de métricas (`metrics/definitions.ts`):

1.  **Mock Data (Desenvolvimento)**:
    *   Usa geradores de dados (`mockGenerator`) definidos por métrica.
    *   Suporta fusão de **Múltiplas Métricas**: As métricas adicionais são geradas separadamente e combinadas com a primária baseadas no `label` (dimensão).
    *   Simula comparação com período anterior (`previousValue`).

2.  **API Backend**:
    *   Faz chamadas REST para endpoints configurados.
    *   Passa filtros e dimensões via query params ou body.

3.  **SQL Direto**:
    *   Executa templates SQL substituindo placeholders (`{{filters}}`, `{{dimension}}`).
    *   Permite consultas complexas diretamente no banco.

---

## 4. Renderização Dinâmica

O `CardRenderer` recebe os dados processados (`effectiveData`) e decide como mostrar.

### Gráficos (Recharts)
*   **Bar/Line/Area**: Mapeia `label` para Eixo X e `value` para Eixo Y.
*   **Multi-Série**: Se houver chaves adicionais no objeto de dados (ex: `custo`, `lucro`), o renderizador cria linhas/barras adicionais automaticamente.

### Tabela Dinâmica
A visualização de Tabela foi aprimorada para funcionar como uma planilha de análise:

1.  **Auto-Detecção de Colunas**:
    *   Identifica todas as chaves numéricas nos dados retornados.
    *   Gera colunas automaticamente: [ Dimensão | Métrica 1 | Métrica 2 | ... ].
    
2.  **Formatação Inteligente**:
    *   Detecta automaticamente se uma coluna é financeira (baseado no nome ou valor > 1000).
    *   Aplica formatação de moeda (`R$ 1.234,00`) ou decimal conforme necessário.

3.  **Visual Premium**:
    *   Estilo "Blue Theme" consistente com o Explorador.
    *   Cabeçalho fixo (sticky), ordenação interna.

---

## 5. Sistema de Filtros

Existem dois níveis de filtros que trabalham em conjunto:

### A. Filtros de Configuração (`filters`)
*   Definidos no **Painel de Propriedades**.
*   São parte da definição do card (persistentes).
*   Suportam lógica complexa (AND/OR, grupos).
*   Ex: "Mostrar apenas Vendas > 1000 E Região = Sul".

### B. Filtros de Drill-in (`simpleFilters`)
*   Aplicados temporariamente via **Explorar -> Aplicar ao Gráfico**.
*   Permitem que o usuário refine um gráfico visualmente interagindo com os dados detalhados.
*   Ex: Usuário abre o Explorar, filtra por "Vendedor = João", e clica em "Aplicar ao Gráfico". O gráfico atualiza para mostrar apenas dados do João.

---

## 6. Diferença: Tabela vs Explorar (Drill-in)

É fundamental entender a distinção entre a visualização de Tabela no Card e o Drill-in:

### Tabela no Card (Visão Agregada)
*   **O que mostra**: Resumo dos dados agrupados por uma dimensão.
*   **Granularidade**: Uma linha por categoria/período.
*   **Uso**: Comparação de totais.
*   **Exemplo**:
    ```
    [ Vendedor | Vendas ]
    [ João     | R$ 50k ]
    [ Maria    | R$ 80k ]
    ```

### Explorar / Drill-in (Visão Analítica)
*   **O que mostra**: Dados "crus" (Raw Data) que compõem os totais.
*   **Granularidade**: Uma linha por registro individual (transação, conversa, lead).
*   **Uso**: Auditoria, investigação detalhada, exportação CSV.
*   **Exemplo**:
    ```
    [ ID | Data       | Vendedor | Valor   | Status ]
    [ 01 | 01/01/2024 | João     | R$ 500  | Fechado]
    [ 02 | 02/01/2024 | João     | R$ 1200 | Aberto ]
    ...
    ```

---

## 7. Como Estender

### Adicionar Nova Métrica
1.  Edite `metrics/definitions.ts`.
2.  Adicione a métrica em `EXAMPLE_METRICS` e `METRIC_DEFINITIONS`.
3.  Defina o `mockGenerator` (para dev) ou `sqlQuery` (para prod).

### Adicionar Novo Tipo de Gráfico
1.  Edite `constants.tsx` para adicionar em `AVAILABLE_COMPONENTS`.
2.  Edite `CardRenderer.tsx` (switch case) para implementar a renderização usando Recharts.
3.  Edite `CardCreatorModal.tsx` para definir as props iniciais padrão.
