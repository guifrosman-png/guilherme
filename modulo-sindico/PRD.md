# PRD — Portal do Síndico (Especificação Técnica e Funcional)

**Módulo:** Portal do Síndico  
**Base:** Hub.App (Módulo Minimal + HelpDesk)  
**Versão:** 7.1 (Edição Ultra Detalhada pós-alinhamento)  
**Status:** Planejamento Funcional

---

## 1. VISÃO GERAL DO MÓDULO

O **Portal do Síndico** é um sistema de transparência financeira e comunicação operacional para condomínios com lojas autônomas da **Expresso Foods**. O foco é simplificar a visão do síndico, removendo detalhes técnicos e administrativos da operação da loja para focar puramente no que interessa ao condomínio: **Repasses Financeiros** e **Zeladoria da Unidade**.

---

## 2. DETALHAMENTO DAS ABAS (FUNCIONALIDADES)

### 2.1. ABA 1 — Dashboard (Indicadores Financeiros)

O Dashboard é a porta de entrada e deve transmitir confiança através de dados claros e estética premium (glassmorphism/vibrant charts). **IMPORTANTE:** Toda e qualquer menção a consumo de energia foi removida.

#### **2.1.1. KPI Cards (Métricas de Topo)**
Localizados no topo da tela com cards destacados:
*   **Faturamento Bruto (Período)**: 
    *   **O que mostra**: Valor total (R$) de todas as vendas processadas do dia 1 até o momento atual.
    *   **Visual**: Valor em destaque, ícone de "Cifrão" e indicador de variação em relação ao mês anterior.
*   **Percentual de Repasse**: 
    *   **O que mostra**: A fatia que pertence ao condomínio (Ex: 5%).
    *   **Origem**: Puxado via API diretamente do cadastro da unidade no E4RP.
*   **Repasse Acumulado (Líquido)**: 
    *   **O que mostra**: O valor monetário que o condomínio já acumulou para receber.
    *   **Lógica**: `Faturamento Bruto * (% Repasse)`.
*   **Data do Próximo Repasse**: 
    *   **O que mostra**: A data prevista para o próximo depósito em conta.

#### **2.1.2. Painel de Gráficos Detalhados**
O dashboard contará com 4 visualizações gráficas estratégicas:

1.  **Evolução de Vendas Diárias (Area Chart)**:
    *   **Propósito**: Mostrar a saúde comercial da loja no prédio.
    *   **Visual**: Linha fluida com gradiente suave (esmeralda/cobalto). Permite ao síndico ver picos de consumo (ex: finais de semana).
2.  **Top 10 Itens Mais Vendidos (Horizontal Bar Chart)**:
    *   **Propósito**: Identificar a preferência dos moradores.
    *   **Dados**: Lista os itens por volume total (unidades). Ex: "Coca-Cola 350ml - 145 unidades".
3.  **Mix de Categorias (Donut Chart)**:
    *   **Propósito**: Ver a diversidade de produtos que giram na unidade.
    *   **Dados**: Distribuição percentual entre Bebidas, Mercearia, Higiene e Snacks.
4.  **Mapa de Calor de Horários (Heatmap/Bar Chart)**:
    *   **Propósito**: Transparência sobre o fluxo de pessoas na loja.
    *   **Visual**: Gráfico de barras por hora (00h às 23h), destacando os horários de pico (manhã, almoço, volta do trabalho).

---

### 2.2. ABA 2 — Vendas & Itens (Consolidado de Itens)

Aba projetada para conferência de movimentação sem a complexidade de auditoria fiscal cupom a cupom.

#### **2.2.1. Inbox de Vendas Consolidadas**
*   **Estrutura**: Lista similar ao HelpDesk, mas focada em agrupamentos temporais (Hoje, Ontem, Semana Passada).
*   **Linha de Item**: Exibe a data, o total de itens vendidos no dia e o valor total bruto.
*   **Busca**: Filtro por nome de produto ou período específico.

#### **2.2.2. Painel Lateral de Detalhamento (Slide-over)**
Ao selecionar um dia ou período na lista:
*   **Header**: Período selecionado e valor total acumulado.
*   **Tabela de Itens**: 
    *   `Nome do Produto` | `Quantidade Total Vendida` | `Valor Acumulado`.
*   **Rodapé**: Totalizador de itens e valor total líquido do repasse do período.

---

### 2.3. ABA 3 — Fechamento & Auditoria (Integração E4RP)

Esta é a "Central Burocrática" do síndico, alimentada pelo ERP da empresa.

#### **2.3.1. Extrato Financeiro Oficial**
*   **Lógica de Exibição**: 
    1.  **Se a unidade usa Financeiro no RP**: O sistema puxa o JSON do E4RP e monta o extrato completo (Créditos de venda, Débitos operacionais se houver, Bônus e o Valor Líquido Final).
    2.  **Se NÃO usa Financeiro no RP**: Exibe apenas o resumo básico vindo do Supabase (Vendas Brutas e Repasse %).
*   **Status do Mês**: Indicadores claros de "Em Aberto", "Processado" ou "Pago".

#### **2.3.2. Repositório de Comprovantes**
*   **Links de Download**: Acesso aos PDFs gerados (Relatórios de Prestação de Contas).
*   **Comprovante de Pagamento**: Visualização da imagem do comprovante bancário (TED/Pix) assim que anexado no ERP pelo financeiro.

---

### 2.4. ABA 4 — Unidade & Suporte (Gestão e Chamados)

#### **2.4.1. Central de Chamados (HelpDesk Integrado)**
Interface para o síndico atuar como "olhos" da Expresso Foods na unidade:
*   **Novo Ticket**: Botão de ação rápida com categorias pré-selecionadas (Goteira, Sujeira, Reposição Urgente, Porta Travada).
*   **Anexo de Foto**: **Obrigatório para tickets de manutenção**. Integra com a câmera/galeria para prova visual.
*   **Timeline do Ticket**: Visualização em tempo real do status (Aberto, Técnico em Rota, Concluído).

#### **2.4.2. Dados Mestre da Unidade**
*   **Contrato**: Porcentagem de repasse contratual, data de vencimento e termos básicos.
*   **Responsáveis**: Nome e contato direto do gestor da conta (CS/Gestor de Unidade).

---

## 3. ESPECIFICAÇÕES TÉCNICAS E SEGURANÇA

### 3.1. Integração E4RP
*   O módulo deve priorizar os dados do E4RP para a Aba 3. 
*   Em caso de instabilidade no ERP, o frontend deve exibir placeholders elegantes ou dados do cache local (Supabase).

### 3.2. Segurança e Multi-tenancy
*   **Isolamento RLS**: O síndico do Condomínio "A" nunca deve ser capaz de ver os dados do Condomínio "B", mesmo que tente manipular o `tenant_id` na URL ou API.

---
**© 2026 Portal do Síndico — Especificação v7.1**
