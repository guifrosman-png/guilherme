# Métricas de Progresso — Portal do Síndico

Este documento apresenta o status atual do desenvolvimento do módulo **Portal do Síndico**, comparando o código implementado (`/src`) com as definições do **PRD** e **Planejamento**.

---

## 📊 Painel de Controle (Status Geral)

| Área do Sistema | Progresso Visual | % Concluído | Status |
| :--- | :--- | :---: | :--- |
| **Aba 1 (Dashboard)** | `████░░░░░░` | **40%** | 🟡 Parcial |
| **Aba 2 (Vendas)** | `█████████░` | **90%** | 🟢 Avançado |
| **Aba 3 (Fechamento)** | `█████████░` | **90%** | 🟢 Avançado |
| **Aba 4 (Suporte)** | `██████████` | **100%** | 🟢 Completo |
| **Integração Mercatus** | `░░░░░░░░░░` | **0%** | 🔴 Pendente |

---

## � O Que Falta? (Detalhamento Técnico)

### 1. Aba 1 — Dashboard (Financeiro)
> **Resumo:** A estrutura do grid existe, mas o conteúdo é genérico.
>
> **🔻 O Que Falta Fazer:**
> *   [ ] **KPIs Reais:** Remover os cards de "Receita Total" genéricos e criar os componentes para:
>     *   *Data do Próximo Repasse* (Destaque visual).
>     *   *Repasse Acumulado* (Cálculo Faturamento * %).
> *   [ ] **Gráficos Exclusivos:** Implementar os componentes visuais definidos no PRD:
>     *   `HeatmapChart`: Mapa de calor de horários de pico.
>     *   `ProductDonut`: Gráfico de rosca para Mix de Categorias.
>     *   `SalesTrendChart`: Area chart com gradiente esmeralda.

### 2. Aba 2 — Vendas (Inbox)
> **Resumo:** Interface excelente, pronta para conectar.
>
> **🔻 O Que Falta Fazer:**
> *   [ ] **Conexão de Dados:** O componente `SalesList` hoje usa um *array* fixo. Precisa receber dados via *prop* ou *context*.
> *   [ ] **Filtro Real:** A lógica de filtragem (Hoje/Ontem) é apenas visual na UI, precisa filtrar os dados de verdade.

### 3. Aba 3 — Fechamento (Relatórios)
> **Resumo:** Fluxo de navegação e visualização de documentos perfeitos.
>
> **🔻 O Que Falta Fazer:**
> *   [ ] **Service Layer:** Substituir a constante `MOCK_STATEMENTS` por uma chamada à API (Supabase) que verifique a tabela `financeiro_fechamentos`.
> *   [ ] **PDF Real:** O botão "Baixar Relatório" atualmente não faz nada. Precisa gerar ou baixar um PDF real.

### 4. Aba 4 — Suporte (HelpDesk)
> **Resumo:** Módulo completo visualmente.
>
> **🔻 O Que Falta Fazer:**
> *   [ ] **Integração HelpDesk:** O formulário de abertura de ticket apenas fecha o modal com um alerta. Precisa fazer o `POST` na tabela `tickets`. (Mas a UI está 100%).

### 5. Integração Mercatus (Data Layer)
> **Resumo:** Ainda não iniciada.
>
> **🔻 O Que Falta Fazer:**
> *   [ ] **Setup Inicial:** Criar arquivo `services/api.ts` ou `services/mercatus.ts`.
> *   [ ] **Hooks:** Criar `useMercatusData` para alimentar as Abas 1, 2 e 3.
> *   [ ] **Autenticação:** Garantir que o `tenant_id` do síndico logado filtre as requisições corretamente.

---

**Gerado em:** 27/01/2026
**Assinado:** Antigravity AI
