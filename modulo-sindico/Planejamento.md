# Planejamento de Execução — Portal do Síndico

Este documento detalha as etapas de implementação do módulo **Portal do Síndico**, seguindo a estrutura de abas definida no PRD e utilizando o template base `hub-mod-minimal`.

---

## 📅 Visão Geral das Fases

1.  **Fase 1:** Implementação da Aba 1 (Dashboard & KPIs)
2.  **Fase 2:** Implementação da Aba 2 (Transações & Itens)
3.  **Fase 3:** Implementação da Aba 3 (Fechamento & Auditoria)
4.  **Fase 4:** Implementação da Aba 4 (Unidade & Suporte)
5.  **Fase 5:** Conexão com Mercatus (API & Dados Reais)

---

## 🚀 Detalhamento por Aba

### 1. Aba 1 — Dashboard (Indicadores Financeiros)
*Foco: Visualização premium e transparência imediata.*

*   [ ] **Setup de Layout:** Configurar o container da aba com suporte a scroll suave e transições de entrada.
*   [ ] **KPI Cards:**
    *   Criar componente de card com `glassmorphism`.
    *   Implementar: Faturamento Bruto, % Repasse, Repasse Acumulado e Data do Próximo Repasse.
    *   Adicionar indicadores de variação (subida/descida) com micro-interações.
*   [ ] **Painel de Gráficos (Mocked):**
    *   **Área Chart:** Evolução de vendas diárias (usar gradientes esmeralda/cobalto).
    *   **Horizontal Bar Chart:** Top 10 Itens mais vendidos.
    *   **Donut Chart:** Mix de Categorias (Bebidas, Snacks, etc).
    *   **Heatmap/Bar Chart:** Fluxo de horários de pico.
*   [ ] **Polimento Visual:** Aplicar fontes modernas (Outfit/Inter) e cores vibrantes conforme identidade visual.

### 2. Aba 2 — Transações (Inbox Auditável)
*Foco: Listagem limpa e detalhamento rápido.*

*   [ ] **Componente de Inbox:**
    *   Criar lista agrupada por datas (Hoje, Ontem, Semana Passada).
    *   Implementar visual de "Linha de Item" com ícone, data e valor total.
*   [ ] **Barra de Busca e Filtros:** Implementar busca por texto e filtro por período.
*   [ ] **Slide-over de Detalhes:**
    *   Implementar painel lateral que abre ao clicar em um dia/período.
    *   Tabela interna: `Nome do Produto` | `Qtd` | `Valor Total`.
    *   Rodapé com totalizador de repasse do período.

### 3. Aba 3 — Fechamento & Auditoria (A Central do Mês)
*Foco: Dados oficiais e documentos.*

*   [ ] **Lógica de Extrato Financeiro:**
    *   Criar componente de extrato com cabeçalho de status (Pago, Processado, Em Aberto).
    *   Implementar renderização condicional (Visão RP vs. Visão Simples Supabase).
*   [ ] **Repositório de Documentos:**
    *   Lista de arquivos para download (PDFs de prestação de contas).
    *   Componente de visualização de comprovante (Modal com imagem do comprovante bancário).
*   [ ] **Integração Visual:** Garantir que o design siga o padrão de "documento oficial" mas mantendo a leveza do app.

### 4. Aba 4 — Unidade & Suporte (Canais de Atendimento)
*Foco: Comunicação direta e dados contratuais.*

*   [ ] **Interface de HelpDesk:**
    *   Botão "Novo Ticket" com seleção de categorias (Limpeza, Manutenção, etc).
    *   Implementar fluxo de anexo de foto (upload simulado inicialmente).
    *   Timeline do ticket para acompanhamento de status.
*   [ ] **Dados Mestre da Unidade:**
    *   Card com informações do contrato (Repasse %, Vencimento).
    *   Seção "Seu Gestor" com foto, nome e botão de contato (WhatsApp/E-mail).

---

## 🔗 Conexão com Mercatus (Data Layer)
*Foco: Integração robusta com a API `api/vendas/listagem`.*

### 1. Definições Técnicas da API
> Baseado no endpoint: `https://expressfoods.mercatus.net.br/api/vendas/listagem`

*   [ ] **Service Setup (`src/services/mercatus.ts`):**
    *   Configurar instância Axios com Headers fixos:
        *   `X-Cliente-Id: 19`
        *   `X-Produto: mercado-app`
        *   `Authorization: Bearer [TOKEN]` (Gerenciar via variáveis de ambiente `VITE_MERCATUS_TOKEN`).
    *   Implementar método `getSales(unitId, startDate, endDate)`.
*   [ ] **Tipagem (TypeScript):**
    *   Criar interfaces espelhando a resposta JSON:
        *   `MercatusSale` (id, dataEfetivacao, valorTotal, etc).
        *   `MercatusProduct` (dentro da venda).
        *   `MercatusPayment` (finalizadoras).

### 2. Tratamento e Transformação
*   [ ] **Adapters (Pattern):**
    *   Criar `salesAdapter.ts` para converter o JSON bruto do Mercatus para o formato visual da UI.
    *   *Exemplo:* Converter `finalizadoras[0].descricao` -> Tag de Pagamento.
*   [ ] **Gerenciamento de Estado (React Query):**
    *   Criar hook `useMercatusSales(period)`:
        *   Cache key: `['sales', unitId, period]`.
        *   StaleTime: 5 minutos (para evitar requests excessivos).
        *   Tratamento de Loading/Error states.

### 3. Integração com as Abas
*   [ ] **Aba 1 (Dashboard):**
    *   Calcular KPIs (Receita Total, Ticket Médio) no frontend iterando sobre o array de `registros`.
    *   Gerar dados para os gráficos (agrupamento por hora/categoria) via `reduce` no array de vendas.
*   [ ] **Aba 2 (Vendas):**
    *   Substituir o array mockado do `SalesList` pelos dados reais da API.
    *   Implementar paginação real ou "Load More" se `paginacao.qtdTotalPaginas > 1`.
*   [ ] **Aba 3 (Fechamento):**
    *   Cruzar dados locais (se houver) com o totalizador da API para auditoria.

### 4. Segurança e Multi-tenancy
*   [ ] **Mapeamento de Unidades:**
    *   Tabela `unidades` no Supabase deve ter coluna `mercatus_unit_id` para fazer o de-para (Ex: Unidade 12 do JSON).
    *   Garantir que o usuário só envie o `unidadeId` ao qual tem permissão.

---

## ✅ Critérios de Aceite (Finalização)
- UI 100% responsiva (Mobile-First).
- Transições suaves entre abas.
- Dados financeiros batendo com os relatórios do ERP.
- UX fluida para abertura de chamados com foto.

**Assinado:** Antigravity AI
**Data:** 21/01/2026
