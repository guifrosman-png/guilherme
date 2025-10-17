Documento de Requisitos de Produto (PRD) — Módulo Financeiro (Hub.App)
Autor: [O seu nome] e Assistente Gemini
Data: 02 de Setembro de 2025
Versão: 5.1 (Ajuste na Navegação Desktop)
1. Visão Geral do Módulo
O Módulo Financeiro é uma solução de gestão financeira para pequenas empresas, com o Agente FInelson (powered by Google Gemini) integrado como seu principal diferencial. A plataforma automatiza a entrada de dados via WhatsApp, conexão bancária direta e transforma números em insights acionáveis através de um assistente inteligente.
O módulo será disponibilizado em duas versões:
Financeiro Light (Gratuito): Oferece as ferramentas essenciais de gestão e uma amostra do poder do Agente FInelson, com limites de uso.
Financeiro Pro (Premium): A solução completa com automação total via conexão bancária, relatórios comparativos, e o Agente FInelson em sua capacidade máxima.
Proposta de Valor do Módulo: "Transforme a gestão do seu negócio com o Agente FInelson, que organiza as suas finanças e o ajuda a tomar decisões mais inteligentes. Comece de graça com o Financeiro Light."
2. Contexto e Integração com o Hub.App
Este documento descreve um módulo, não um produto autónomo. O seu funcionamento depende inteiramente da sua integração com a plataforma principal, o Hub.App. Os seguintes princípios são fundamentais:
Relação Módulo-Plataforma: O Módulo Financeiro é "instalado" a partir da App Store do Hub.App e opera dentro da interface principal. O utilizador nunca sai do ambiente do Hub.App para usar o módulo.
Autenticação Unificada (Single Sign-On): O utilizador autentica-se uma única vez, no Hub.App. O módulo não possui um ecrã de login próprio; ele valida a sessão do utilizador através de um token JWT seguro emitido pela plataforma principal, que contém todas as informações necessárias (user_id, role, tenant_id).
Gestão Centralizada de Utilizadores e Empresas: A criação e gestão de empresas (tenants), administradores e funcionários é feita exclusivamente no Hub.App. O Módulo Financeiro herda essa estrutura, aplicando as permissões definidas na plataforma principal.
Interface Consistente: A estrutura visual (barra lateral no desktop, ícones na home mobile) é controlada pelo Hub.App. O módulo é carregado na área de conteúdo principal, garantindo uma experiência de utilizador coesa.
3. O Problema Específico a Resolver
Este módulo foca-se na dor da gestão financeira do dia-a-dia do "Empreendedor Ocupado":
Lançamentos Manuais: "As notas e faturas ficam numa caixa para serem lançadas no final do mês, quando arranjar tempo."
Falta de Clareza: "Não sei exatamente quanto tenho a pagar na próxima semana sem consultar vários papéis e emails."
Risco de Atrasos: "Já me esqueci de pagar faturas a tempo porque perdi o controlo das datas de vencimento."
Insegurança nas Decisões: "Vejo os números, mas não sei o que eles significam ou que ações devo tomar para melhorar o meu lucro."
4. Design e Experiência do Utilizador (UI/UX)
4.1. Princípio Fundamental: Mobile First e Design Adaptativo
O design do módulo seguirá rigorosamente a filosofia Mobile First. A experiência do utilizador é concebida primeiramente para o ecrã de um telemóvel, garantindo que a interface seja limpa, focada e totalmente funcional com o toque. A versão para desktop é uma expansão inteligente dessa base, aproveitando o espaço adicional para apresentar mais informação de forma organizada, mas sem perder a simplicidade da versão móvel.
4.2. Navegação Interna do Módulo
Experiência Mobile: A navegação principal será feita através de uma barra de navegação inferior fixa (bottom tab bar). Inspirada nas melhores práticas de usabilidade, a barra conterá ícones para as áreas centrais do módulo:
Início: (Ícone de casa) O dashboard principal com a visão geral das finanças.
Transações: (Ícone de lista) A área para gerir todos os lançamentos, com as vistas de Tabela e Kanban.
Gráficos: (Ícone de gráfico de barras) Uma secção dedicada a relatórios visuais e DRE.
Perfil/Mais: (Ícone de utilizador) Uma área que agrupa Configurações, Contas, Cartões, Categorias, etc.
Experiência Desktop: Quando a aplicação for acedida num ecrã maior, a barra de navegação inferior é substituída por uma barra de navegação lateral fixa no lado direito da tela (sidebar), para uma experiência de utilização mais tradicional e otimizada para o desktop.
4.3. Elementos Flutuantes
Botão de Ação Principal (+): Um botão + proeminente e central na barra de navegação inferior (ou flutuante no canto direito) será o principal ponto de entrada para novos lançamentos. Ao ser tocado, ele apresentará as opções: "Nova Receita" e "Nova Despesa".
Agente FInelson: O ícone do FInelson ficará posicionado discretamente no canto da tela, permitindo que o utilizador aceda ao chat a qualquer momento.
5. Roadmap de Funcionalidades por Versão
Módulo Financeiro Light (Gratuito)
Epic 1: Lançamento de Transações (WhatsApp e Manual)
User Story: "Como utilizador, quero poder registar qualquer transação de forma instantânea, seja enviando uma mensagem/documento pelo WhatsApp ou clicando no botão +."
Funcionalidades: Lançamento via WhatsApp; formulário de lançamento manual acessível pelo botão +, com campos para Valor, Descrição, Data e Conta.
Limitação: Até 20 documentos/mensagens processados por mês via WhatsApp. Lançamentos manuais são ilimitados.
Epic 2: Dashboard Essencial (Aba "Início")
User Story: "Como utilizador, quero um dashboard visual que me dê uma visão rápida e clara das finanças do meu negócio."
Funcionalidades: Filtro de Período Simples; Cards de KPI (Recebido, Pago, Saldo); Gráficos Visuais.
Epic 3: Gestão de Transações (Aba "Transações")
User Story: "Como utilizador, quero poder visualizar e gerir as minhas receitas e despesas numa lista ou num quadro Kanban."
Funcionalidades: Vista de Tabela e Vista Kanban com colunas padrão e funcionalidade de arrastar e largar.
Epic 4: Relatórios Simplificados (Aba "Gráficos")
User Story: "Como utilizador, quero poder gerar relatórios simples para ter uma visão geral do desempenho do meu negócio."
Funcionalidades: Geração de relatórios periódicos com base num DRE Simplificado; Exportação para PDF e partilha via link (com marca de água).
Epic 5: Organização Financeira Básica (Aba "Perfil/Mais")
Funcionalidades:
Contas: Cadastro manual de contas (ex: "Carteira", "Conta Principal").
Cartões: Cadastro manual de cartões de crédito.
Categorias: Utilização de uma lista de categorias padrão (não editável).
FInelson (Limitado): Acesso ao Agente com um limite de 10 perguntas por mês.
Módulo Financeiro Pro (Premium)
Inclui tudo do Light, sem limitações, e adiciona camadas de automação, análise e inteligência.
Processamento de WhatsApp Ilimitado
Dashboard Avançado (Aba "Início"): Projeção de Fluxo de Caixa, KPIs Comparativos, Widget de Insights do FInelson.
Gestão de Transações Avançada (Aba "Transações"): Kanban com colunas personalizáveis, ações em massa e filtros avançados.
Relatórios Detalhados (Aba "Gráficos"): DRE Detalhado, relatórios com "drill-down", análise comparativa e exportação avançada.
Organização Financeira Avançada (Aba "Perfil/Mais"):
Conexão Bancária (Open Finance): Sincronização automática de contas e cartões.
Categorias Personalizáveis: Crie, edite e apague categorias e subcategorias.
Metas: Crie metas financeiras (ex: "Guardar R$ 5.000 para equipamento").
Limites (Orçamentos): Defina limites de gastos por categoria.
FInelson Pro: Limite estendido (200 perguntas/mês) e análises proativas.
6. Segurança e Conformidade
A confiança é a base de um módulo financeiro. A segurança dos dados do cliente é a nossa prioridade máxima e inegociável.
Conformidade com a LGPD:
Papéis Definidos: O Hub.App atua como Operador dos dados, e a empresa cliente como Controladora.
Consentimento Explícito: A conexão de contas bancárias só será iniciada após o consentimento explícito e informado do utilizador.
Segurança da Arquitetura Multi-Tenant:
Isolamento de Dados (RLS): Utilização de Row Level Security (RLS) no Supabase é mandatória.
Validação de Token (JWT): Todas as requisições à API do módulo devem ser validadas por um token JWT.
Segurança nas Integrações:
Open Finance: Integração com um parceiro de API certificado. Jamais armazenaremos credenciais bancárias dos nossos clientes.
Inteligência Artificial (Gemini): As requisições à API do Gemini não devem conter dados pessoais sensíveis desnecessários.
Dados em Trânsito e em Repouso:
Criptografia em Trânsito: Toda a comunicação será protegida com HTTPS/TLS.
Criptografia em Repouso: Dados sensíveis armazenados na base de dados serão encriptados.
7. Requisitos Técnicos e de Integração
Autenticação: O módulo deve validar um token JWT emitido pelo Hub.App principal.
Base de Dados: Utilização do Supabase como backend.
Comunicação: A comunicação entre o Hub.App e o Módulo Financeiro será feita via API.
Tecnologia do Agente de IA: O Agente FInelson será construído utilizando a API do Google Gemini.
Conexão Bancária (Open Finance): Integração com um provedor de API de Open Finance (ex: Pluggy, Belvo, Klavi).
8. Monetização
Modelo: Subscrição mensal, gerida através da App Store do Hub.App.
Proposta de Preço (a ser validada): R$ 29,90