# Documentação: KPI Widget Unificado

## Visão Geral
O novo **Widget de KPI** é um componente inteligente e unificado, similar aos gráficos. Em vez de lidar com textos e ícones soltos, você adiciona um único bloco "KPI" que se adapta automaticamente à métrica escolhida.

## Como Usar

### 1. Adicionar ao Canvas
-   No menu lateral esquerdo, vá em **Indicadores**.
-   Clique ou arraste o item **KPI**.
-   Um card padrão ("Novo KPI") será criado no canvas.

### 2. Configurar a Métrica
-   Selecione o card criado.
-   No **Painel de Propriedades** (direito), aba **Chart**:
    -   Em **Métrica**, escolha o dado que deseja exibir (ex: "Receita Total", "Margem Média").
    -   O card se auto-configura: muda o título, ícone e formatação (R$, %, número) baseado na definição da métrica.

### 3. Personalizar Visual (Opcional)
-   No **Painel de Propriedades**, aba **Options** > **Visualização**:
    -   **Título do Card**: Sobrescreva o nome automático.
    -   **Descrição / Rodapé**: Adicione um texto de apoio (ex: "vs. meta").
    -   **Ícone**: Force um ícone específico se não gostar do padrão.
    -   **Formato**: Force formatação de Moeda, Percentual ou Número.

## Benefícios
-   **Consistência**: Todos os KPIs seguem o mesmo padrão visual.
-   **Agilidade**: Trocar de "Receita" para "Quantidade" atualiza tudo (ícone, formato) instantaneamente.
-   **Simplicidade**: Apenas um componente para gerenciar e redimensionar no grid.
