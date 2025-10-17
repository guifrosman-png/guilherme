# 📋 Documento de Requisitos de Produto (PRD) — Hub.App

**Autor:** Thiago Fiuza Rosman - e4labs-bcm e Assistente Gemini
**Data:** 22 de Setembro de 2025
**Versão:** 7.1 (Correções de Moeda, Preços e Status Stripe)
**Última Atualização:** 26 de Setembro de 2025 - Ajustes de valores e status

---

## 🚦 STATUS DE IMPLEMENTAÇÃO ATUAL (22/09/2025)

### ✅ **COMPLETAMENTE IMPLEMENTADO:**

#### 🏗️ **Arquitetura Core:**
- ✅ **Multi-tenant RLS**: Isolamento completo por `tenant_id` em todas as tabelas
- ✅ **Autenticação Supabase**: Google + Email/Password funcionando
- ✅ **Self-service**: Cadastro de empresa + usuário em 2 etapas
- ✅ **Responsividade**: Mobile-first com adaptação desktop

#### 👥 **Sistema de Perfis:**
- ✅ **4 níveis implementados**: Super Admin, Admin da Empresa, Funcionário, Cliente Final
- ✅ **Sistema de Permissões Granulares** (NOVO - 22/09/2025):
  - 25 funções específicas em 5 módulos
  - Controle de João sobre acesso do Ademir
  - Toggles visuais para módulos e funções
  - Confirmação obrigatória para funções críticas

#### 🏠 **Interface Principal:**
- ✅ **Mobile**: Grelha 4 colunas com background personalizável
- ✅ **Desktop**: Sidebar + área de conteúdo
- ✅ **App Store**: Interface para instalar módulos
- ✅ **Settings**: 8 páginas de configuração (empresa, logo, background, etc.)

#### 🧩 **Sistema de Módulos:**
- ✅ **9 módulos cadastrados** no banco:
  - **Gratuitos**: CRM Básico, Agenda
  - **Pagos**: Financeiro (R$ 29,90), RH (R$ 39,90), Estoque (R$ 24,90), Marketing (R$ 34,90), Suporte (R$ 19,90), Instagram (R$ 49,90), AI Agent (R$ 19,90)
- ✅ **Instalação dinâmica** de módulos
- ✅ **Sistema de permissões por módulo**

#### 🤖 **AI Agent (BONUS - Implementado Antes do Planejado):**
- ✅ **Chat inteligente** integrado
- ✅ **Function Calling** com banco de dados
- ✅ **Multi-provider LLM** (Gemini + fallbacks)
- ✅ **Learning System** com feedback 👍👎
- ✅ **WhatsApp Integration** completa

### 🚧 **EM DESENVOLVIMENTO / PARCIAL:**

#### 📊 **Dashboard de Widgets (Fase 2):**
- 🟡 **Desktop Home**: Estrutura criada, widgets ainda não implementados
- ❌ **Galeria de Widgets**: Ainda não implementada
- ❌ **Drag & Drop**: Não implementado

#### 🔧 **Módulos Funcionais:**
- 🟡 **CRM**: Interface criada, funcionalidades básicas
- 🟡 **Agenda**: Estrutura criada, calendário não funcional
- ❌ **Financeiro**: Apenas hook/estrutura, sem funcionalidade real
- ❌ **Outros módulos**: Apenas cadastrados, sem implementação

### 🟡 **PARCIALMENTE IMPLEMENTADO:**

#### 💳 **Sistema de Pagamentos:**
- 🟡 **Stripe Integration**: Parcialmente implementado (biblioteca instalada, migrations criadas, SubscriptionManager.tsx criado)
- 🟡 **Assinaturas de Módulos**: Estrutura básica criada, falta integração completa
- ❌ **Customer Portal**: Não implementado

#### 📁 **Recursos Avançados:**
- ❌ **Importação CSV**: Não implementado
- ❌ **Portal do Cliente**: Não implementado
- ❌ **White-label**: Não implementado

### 📈 **PROGRESSO GERAL:**

**Fase 1 (MVP)**: 85% Completo ✅
- Core: 100% ✅
- Jornada de Cadastro: 100% ✅
- Sistema de Permissões: 100% ✅ (NOVO)
- Módulos CRM/Agenda: 60% 🟡

**Fase 2**: 25% Completo 🟡
- Dashboard Widgets: 30% 🟡
- Personalização: 80% ✅
- Financeiro: 20% 🟡

**Fase 3**: 90% Completo ✅ (Implementado Antecipadamente)
- AI Agent: 90% ✅
- WhatsApp: 100% ✅

### 🎯 **PRÓXIMAS PRIORIDADES (Ordem de Implementação):**

#### 🥇 **PRIORIDADE 1 - Finalizar MVP (Fase 1):**
1. **Implementar CRM Funcional**: CRUD completo de contatos
2. **Implementar Agenda Funcional**: Calendário com agendamentos reais
3. **Integração Permissões**: Aplicar sistema de permissões nos módulos CRM/Agenda

#### 🥈 **PRIORIDADE 2 - Sistema de Pagamentos:**
1. **Integração Stripe**: Gateway de pagamento
2. **Assinaturas Módulos**: Permitir compra de módulos pagos
3. **Customer Portal**: Gestão de assinaturas

#### 🥉 **PRIORIDADE 3 - Módulo Financeiro Completo:**
1. **CRUD Transações**: Criar, editar, excluir transações
2. **Categorização**: Sistema de categorias
3. **Relatórios**: Dashboards e gráficos
4. **Integração AI**: Permitir que IA crie transações via chat

#### 📊 **PRIORIDADE 4 - Dashboard de Widgets:**
1. **Sistema de Widgets**: Criar componentes reutilizáveis
2. **Drag & Drop**: Permitir reorganização
3. **Galeria**: Interface para adicionar widgets

### 🚀 **DIFERENCIAL COMPETITIVO ATUAL:**

O Hub.App já possui funcionalidades que competidores não têm:

1. **✅ Sistema de Permissões Granulares**: Controle por função específica
2. **✅ AI Agent Integrado**: Chat inteligente com acesso ao banco
3. **✅ WhatsApp Integration**: Agente IA acessível via WhatsApp
4. **✅ Learning System**: IA que aprende com feedback do usuário
5. **✅ Multi-tenant Security**: RLS completo em todas as tabelas

---

## 1. 🎯 Resumo e Visão do Produto
O Hub.App será uma aplicação web (Software as a Service - SaaS) desenhada para ser uma solução de gestão simples, centralizada e flexível para micro e pequenas empresas.
A visão é criar um produto com um núcleo de funcionalidades essenciais que possa ser expandido através de um sistema de módulos. O modelo de negócio será **Freemium** e **self-service**. Futuramente, a plataforma utilizará um agente de IA para automatizar e simplificar ainda mais as tarefas de gestão.

> **💡 Proposta de Valor:** "Centralize e automatize a gestão da sua pequena empresa numa única plataforma inteligente e modular, libertando o seu tempo para se focar no que realmente importa: o crescimento do seu negócio."
## 2. 🚨 O Problema a Ser Resolvido
Micro e pequenas empresas lutam com a gestão do seu negócio. Identificamos o nosso cliente principal como **"O Empreendedor Ocupado"**, cujas dores são:

### 🔄 **Desorganização**
> *"Eu uso um caderno para agendamentos, uma folha de cálculo para clientes e o WhatsApp para comunicação. Perco informações e tempo a conectar tudo."*

### 🎭 **Falta de Profissionalismo**
> *"Queria ter um sistema online para os meus clientes marcarem horários, mas as soluções são muito caras ou complicadas para o meu negócio."*

### ⏰ **Ineficiência**
> *"Passo demasiado tempo em tarefas administrativas manuais em vez de me focar em atender os meus clientes e fazer o meu negócio crescer."*
## 3. 📊 Objetivos e Métricas de Sucesso
O nosso objetivo é criar uma plataforma que resolva as dores do **"Empreendedor Ocupado"**.

### ✅ **CONQUISTAS ALCANÇADAS (Status Atual):**

#### 🏗️ **Infraestrutura Sólida:**
- ✅ **Arquitetura Multi-tenant**: Isolamento completo de dados
- ✅ **Sistema de Autenticação**: Google + Email funcionando
- ✅ **Interface Responsiva**: Mobile-first + Desktop adaptativo
- ✅ **Sistema de Permissões**: Controle granular implementado

#### 🤖 **Inovação Tecnológica:**
- ✅ **AI Agent**: Implementado antes do cronograma (Fase 3 → Atual)
- ✅ **WhatsApp Integration**: Canal adicional de acesso
- ✅ **Learning System**: IA que aprende com feedback
- ✅ **Function Calling**: IA com acesso direto ao banco

### 🚀 **METAS REVISADAS (Próximos 6 meses):**

#### 👥 **Adoção (Meta Original: 50 empresas)**
- **Nova Meta:** **100 empresas** cadastradas organicamente
- **Status Atual:** Plataforma pronta para cadastros self-service
- **Diferencial:** Sistema de permissões + AI Agent únicos no mercado

#### ✅ **Validação Qualitativa (Meta: 80% satisfação)**
- **Implementar:** Micro-inquérito de 1 clique após tarefas
- **Focar em:** Facilidade de uso do sistema de permissões
- **Medir:** Satisfação com AI Agent e WhatsApp

#### 🔄 **Retenção (Meta Original: 30% após 1 mês)**
- **Nova Meta:** **50%** após primeiro mês (devido aos diferenciais)
- **Definição "Ativo":**
  - 3+ logins por semana
  - 5+ ações (contatos, agendamentos, uso do AI Agent)
  - 2+ interações com sistema de permissões

#### 💰 **Monetização (NOVA META):**
- **Meta:** **10% das empresas** assinando pelo menos 1 módulo pago
- **Foco:** Módulo Financeiro (R$ 29,90/mês) e AI Agent (R$ 19,90/mês)
- **Métrica:** ARPU médio de R$ 25,00/empresa/mês
## 4. 🏗️ Princípios do Produto (Nossos Pilares)
### 🎆 **Simplicidade Radical**
Cada funcionalidade deve ser intuitiva ao ponto de não necessitar de um manual. Se é complicado, está errado.

### 🔒 **Arquitetura Multi-Tenant**
A segurança e o isolamento dos dados de cada cliente são inegociáveis. Construímos sobre uma base de confiança.

### 📱 **Mobile-First e Responsivo**
A plataforma deve funcionar perfeitamente na mão do nosso cliente, no seu telemóvel, mas também ser poderosa no desktop.

### 🚀 **Self-Service por Natureza**
O cliente deve conseguir fazer tudo sozinho, desde o cadastro à compra de novos módulos, sem atritos.

### 🧩 **Modularidade Flexível**
A plataforma é um "hub". O seu valor cresce com cada novo módulo que se conecta a ela, como peças de Lego.

### 🤖 **Inteligência Ativa**
A plataforma deve, proativamente, ajudar o utilizador. O nosso agente de IA é a personificação deste princípio, transformando comandos de linguagem natural em ações concretas.
## 5. 👥 Perfis de Utilizador (Dimensões de Uso)
A plataforma terá **quatro níveis de acesso**, cada um com uma Home e permissões claras.

### 🔧 **5.1. Super Administrador**
- **Tela Inicial:** Dashboard de Métricas Globais (novos cadastros, retenção, módulos mais populares)
- **Permissões:** Controlo total do ecossistema: registar/editar módulos, criar pacotes, gerir subscrições. **Não pode aceder aos dados internos dos clientes**

### 💼 **5.2. Administrador da Empresa**
- **Tela Inicial:** A Home com a grelha de ícones (estilo iOS)
- **Permissões:** Controlo total da sua empresa: personalizar aparência, gerir utilizadores (Funcionários/Clientes), adquirir módulos na App Store e aceder a todos os dados da sua empresa

### 👷 **5.3. Funcionário**
- **Tela Inicial:** A mesma grelha de ícones, mas vendo apenas os módulos permitidos
- **Permissões:** Acesso limitado às funcionalidades que o Administrador lhe concedeu. Não pode alterar configurações da empresa nem aceder à App Store

### 👤 **5.4. Cliente Final**
- **Tela Inicial:** O Portal do Cliente, uma página white-label com a marca da empresa
- **Permissões:** Acesso apenas às funcionalidades que o Administrador disponibilizou publicamente (ex: fazer agendamentos, ver histórico)
## 6. 🗺️ Jornadas do Utilizador
### 🏢 **6.1. Jornada de Cadastro do Administrador da Empresa**

**User Story:** 
> *"Como dona de um salão, quero poder cadastrar o meu negócio e começar a usar a plataforma em menos de 2 minutos, sem precisar de falar com um vendedor."*

#### 🔍 **1. Descoberta**
O utilizador encontra o link `hub.app/cadastro`

#### 📋 **2. Formulário**
Preenche um formulário de duas etapas:
1. Nome da Empresa, Área de Negócio
2. Seu Nome, Email, Senha

#### ✨ **3. Magia Automática**
O sistema cria o tenant, o utilizador admin, associa-os e atribui o pacote de módulos gratuitos para a "Área de Negócio" selecionada

#### 🚀 **4. Primeiro Login**
É imediatamente redirecionado para a sua Home, já funcional, com os ícones dos módulos gratuitos. Um breve tour guiado é iniciado para mostrar as funções básicas
## 7. 🗺️ Roadmap do Produto por Fases
### 🌱 **Fase 1 (MVP): Foco no Administrador da Empresa**
- **🏗️ Core:** Arquitetura Multi-Tenant e Autenticação (Supabase)
- **🗺️ Jornada:** Implementação completa da Jornada de Cadastro Self-Service
- **🔧 Painel Super Admin:** Interface para registar e gerir módulos
- **🏠 Home do Admin:** Grelha de ícones funcional que se adapta para barra lateral no desktop
- **🧩 Módulos Iniciais** (registados pelo Super Admin):
  - **CRM:** Adicionar/Editar/Ver/Pesquisar contatos
  - **Agenda:** Criar/Editar/Ver agendamentos em vistas de dia/semana/mês

### 🚀 **Fase 2: Expansão e Personalização (Pós-MVP)**
- **📊 Dashboard de Widgets Configurável (Desktop):** Implementação da Home do desktop como um painel com widgets
- **💰 Módulo Financeiro (Pago):** Lançamento do primeiro módulo premium
- **🎨 Personalização de Marca:** Permitir que o Admin da Empresa adicione seu logótipo e altere cores primárias
- **📁 Importação de Dados:** Funcionalidade para importar clientes via ficheiro CSV

### 🤖 **Fase 3: Inteligência e Automação**
- **🏠 Lançamento do Agente de IA:** Introdução de uma interface de chat para que o utilizador possa interagir com os seus dados e executar ações usando linguagem natural
## 8. 📝 Requisitos Funcionais Detalhados
### 🌱 **8.1. Fase 1: MVP - Núcleo de Gestão**

#### 🔧 **User Story (Super Admin)**
> *"Como gestor da plataforma, quero uma interface simples para registar um novo módulo, fazendo o upload de um ícone e inserindo o link de destino, para que ele fique disponível na plataforma."*

#### 💼 **User Story (Admin da Empresa)**
> *"Como dono de um negócio, quero poder cadastrar um novo cliente com nome e telefone para associá-lo a um agendamento na minha agenda."*

#### ✅ **Critérios de Aceitação (Módulo Agenda)**
- O utilizador deve poder criar um evento clicando num horário
- O evento deve permitir associar um contato (do CRM)
- O evento deve ter um título, data, hora de início e fim
- Deve ser possível visualizar os eventos numa grelha de calendário
### 📊 **8.2. Fase 2: Dashboard de Widgets (Desktop)**
Esta seção aborda como o Hub e os Módulos devem interagir.
Requisitos para o Hub.App (A Plataforma):
User Story (Admin da Empresa): "Como administrador, na versão desktop, quero poder adicionar, remover e reorganizar widgets na minha tela inicial para ter uma visão rápida das informações mais importantes do meu negócio."
Critérios de Aceitação:
A Home do desktop deve ter um "modo de edição".
Em modo de edição, o utilizador pode abrir uma "galeria de widgets".
A galeria deve exibir todos os widgets disponíveis, agrupados pelo módulo de origem (ex: Agenda, CRM, Financeiro).
O utilizador deve poder arrastar widgets da galeria para o dashboard.
O dashboard deve ser uma grelha onde os widgets podem ser movidos e redimensionados.
O Hub é responsável por guardar a configuração (layout) do dashboard de cada utilizador.
Requisitos para os Módulos (A serem considerados na construção de cada módulo):
User Story (Desenvolvedor de Módulo / Super Admin): "Ao registrar um novo módulo na plataforma, quero poder declarar quais 'widgets' ele oferece, para que os administradores possam adicioná-los aos seus dashboards."
Critérios de Aceitação (O Contrato Módulo-Hub):
Cada módulo deve ter um ficheiro de configuração (ex: manifest.json) ou um registo na base de dados.
Neste registo, o módulo deve declarar uma lista de widgets que ele disponibiliza.
Para cada widget, a declaração deve incluir:
id: um identificador único (ex: financeiro-contas-a-pagar).
nome: um nome amigável (ex: "Contas a Pagar").
descricao: um texto curto que explica o que o widget faz.
componente_url: o link ou rota para o componente que irá renderizar o conteúdo do widget.
O componente do widget deve ser autónomo e apenas solicitar os dados necessários para a sua exibição.
8.3. Fase 3: Agente de IA
Esta seção define a arquitetura para a interação entre o Agente de IA central e os módulos individuais.
Requisitos para o Hub.App (O Agente Central):
User Story (Admin da Empresa): "Como administrador, quero poder pedir em linguagem natural para a plataforma executar tarefas, como 'mostre meus compromissos de amanhã' ou 'qual o total a receber este mês?', para poupar tempo de navegação."
Critérios de Aceitação:
Integrar um serviço de LLM (Large Language Model) para processar os pedidos do utilizador.
O Hub deve manter um registo de todas as "ações" disponíveis em todos os módulos instalados pelo cliente.
O Agente deve ser capaz de interpretar o pedido do utilizador, identificar a ação correta a ser executada e extrair os parâmetros necessários (ex: nome, data, valor).
O Agente deve ser capaz de realizar ações que combinam dados de múltiplos módulos (ex: "Criar um agendamento para o cliente 'João Silva' amanhã às 10h" - requer acesso ao CRM e à Agenda).
Antes de executar uma ação com escrita de dados (criar, apagar, editar), o Agente deve pedir confirmação ao utilizador.
Requisitos para os Módulos (O Contrato de Ações de IA):
User Story (Desenvolvedor de Módulo / Super Admin): "Ao registrar um módulo, quero declarar as 'ações' que ele pode executar, descrevendo o que fazem e quais dados precisam, para que o Agente de IA possa usá-las."
Critérios de Aceitação:
A configuração de cada módulo (ex: manifest.json) deve incluir uma lista de actions que ele expõe ao Agente de IA.
Para cada ação, a declaração deve incluir:
action_id: um identificador único (ex: agenda-criar-evento).
description_for_ai: Uma descrição clara e detalhada para o LLM entender o que a função faz. (ex: "Cria um novo evento na agenda do utilizador. Precisa de um título, data, hora de início e, opcionalmente, o ID de um contato do CRM para associar ao evento.").
parameters_schema: Um schema (ex: JSON Schema) que define os parâmetros que a ação aceita (ex: { "titulo": "string", "data_hora_inicio": "datetime", "contato_id": "string" }).
execution_endpoint: O endpoint da API que o Hub chamará para executar a ação com os parâmetros extraídos.
## 9. 🎨 Design e Experiência do Utilizador (UI/UX)
A aplicação será desenvolvida com a filosofia **"Mobile-First"**, apresentando uma interface minimalista, limpa e colorida que se adapta de forma inteligente entre dispositivos.

### 📱 **9.1. Experiência Mobile (Tela Principal / Home)**

#### 🇼 **Plano de Fundo (Wallpaper)**
Imagem completa (full-screen), fixa inicialmente e personalizável em fases futuras

#### 🗓️ **Grelha de Ícones**
- **Estrutura:** Grelha de 4 colunas, centralizada, com espaçamento uniforme para um "respiro" visual
- **Formato:** Quadrados com cantos arredondados (estilo iOS, border-radius ~22-25%), todos do mesmo tamanho
- **Estilo:** Sombra com efeito degradê subtil para criar profundidade

#### 🎨 **Conteúdo de Cada Ícone**
- **Imagem:** Customizável
- **Legenda:** Texto curto (máx. 2 palavras/linhas), fonte limpa (ex: Open Sans), cor clara (branca/cinza), centralizado
- **Elementos Futuros:** Banner fixo, badges de notificação, reorganização de ícones com drag-and-drop
### 💻 **9.2. Experiência Desktop (Layout Adaptativo)**

#### 🔄 **Transformação**
Acima de um breakpoint (ex: 768px), a grelha de ícones da Home mobile é substituída por um layout de duas colunas

#### 📋 **Barra Lateral (Coluna Esquerda)**
Uma barra de navegação lateral fixa à esquerda surge, contendo os ícones dos módulos. Funciona como o menu principal

#### 📊 **Área de Conteúdo (Coluna Direita)**
- **Ao Clicar num Módulo:** A área de conteúdo carrega a interface completa do módulo selecionado
- **Ao Estar na "Home":** A área de conteúdo exibe o Dashboard de Widgets personalizável (a partir da Fase 2)
9.3. Design do Dashboard de Widgets (Desktop - Fase 2)
Layout: Grelha flexível (similar ao Trello ou Notion) onde os cartões (widgets) podem ser arrastados e ter tamanhos diferentes (ex: 1x1, 2x1, 2x2).
Interação: Um botão "Personalizar Dashboard" no canto da tela ativa o modo de edição.
Modo de Edição:
Os widgets existentes exibem controlos para remover ou redimensionar.
Um botão "Adicionar Widget" abre uma galeria (modal ou painel) com todos os widgets disponíveis.
Aparência do Widget: Cada widget é um "cartão" com cantos arredondados, um título claro e o conteúdo visual (gráficos, listas, números).
### 🤖 **9.4. Design do Agente de IA (Fase 3)**

#### 🎯 **Ponto de Acesso**
Um ícone de chat flutuante, fixo no canto inferior direito da tela em todas as vistas (desktop e mobile)

#### 💬 **Interface**
Ao clicar no ícone, abre-se uma janela de chat. A interface deve ser limpa, mostrando o histórico da conversa e um campo de texto para o utilizador digitar os seus pedidos

#### 🎮 **Respostas Interativas**
As respostas do Agente de IA não devem ser apenas texto. Podem incluir componentes interativos, como:
- **Listas de dados** (ex: próximos 5 agendamentos)
- **Gráficos simples** (ex: resumo financeiro do mês)
- **Botões de confirmação** ("Deseja mesmo criar este evento?")
## 10. 🔒 Segurança e Conformidade com a LGPD
### 📄 **Papéis**
O Hub.App é o **Operador** dos dados; a Empresa Cliente é a **Controladora**. Isto deve estar explícito nos Termos de Serviço

### ✅ **Consentimento**
Checkbox de consentimento obrigatório e **não pré-marcado** em todos os formulários de cadastro, com link para os Termos e Política de Privacidade

### ⚙️ **Direitos do Titular**
Uma secção "Minha Conta" permitirá a qualquer utilizador visualizar, editar e solicitar a exclusão dos seus dados. A exclusão deve ser um processo de **"soft delete" por 30 dias**, seguido de eliminação permanente

### 🔐 **Segurança Técnica**
Uso obrigatório de **Row Level Security (RLS)** no Supabase, encriptação HTTPS e hash de senhas

### 🤖 **Segurança do Agente de IA**
As interações com o Agente de IA devem respeitar estritamente as permissões do utilizador e as regras de RLS. **Nenhuma informação de um tenant pode ser usada no processamento de pedidos de outro tenant**. Dados enviados para APIs de LLM externas devem ser manuseados com protocolos de segurança e privacidade rigorosos, preferencialmente anonimizados
## 11. 💰 Modelo de Monetização e Dúvidas Estratégicas

Esta secção define o modelo de negócio e guia as nossas próximas decisões.

### 💳 **11.1. Modelo de Monetização: Assinatura Modular à la Carte**

#### 🎁 **Proposta**
O Hub.App operará num modelo **Freemium**. A plataforma base e um conjunto de módulos essenciais (CRM, Agenda) serão **gratuitos**. Módulos avançados serão disponibilizados através de uma "App Store" interna, onde os clientes podem assinar cada módulo individualmente por uma taxa mensal fixa (ex: Módulo Financeiro por **R$ 29,90/mês**)

#### ⚙️ **Funcionamento**
1. O cliente acede à **App Store** dentro da plataforma
2. Escolhe um módulo pago e inicia o processo de assinatura
3. Após o pagamento (gerido pelo **Stripe** como gateway principal), o módulo é ativado instantaneamente e o seu ícone aparece na Home
4. O cliente pode gerir todas as suas assinaturas (ver, alterar, cancelar) numa secção dedicada em "Minha Conta", idealmente utilizando o **Stripe Customer Portal**

#### 📈 **Estratégia de Preços Futura**
Após a validação do modelo à la carte, planeamos introduzir **"Pacotes"** (bundles) de módulos com desconto para incentivar a adoção de múltiplas funcionalidades e aumentar o valor médio por cliente (ARPU)

### ❓ **11.2. Dúvidas Estratégicas e Pontos a Decidir**

#### 💵 **Preços Sugeridos (Tabela de Valores)**
- **CRM Básico:** GRATUITO
- **Agenda:** GRATUITO
- **AI Agent:** R$ 19,90/mês (entrada, alto valor agregado)
- **Estoque:** R$ 24,90/mês
- **Financeiro:** R$ 29,90/mês (mais procurado)
- **Marketing:** R$ 34,90/mês
- **RH:** R$ 39,90/mês
- **Instagram:** R$ 49,90/mês (premium, integração externa)
- **Suporte:** R$ 19,90/mês

**Estratégia:** Preços escalonados baseados em complexidade e valor percebido

#### 📁 **Onboarding de Dados (Importação)**
- **Proposta:** Adiar para a Fase 2. No MVP, o foco é em empresas que podem cadastrar os seus clientes manualmente
- **❓ Decisão Necessária:** Concordamos em focar na entrada manual de dados para o MVP?

#### 🎨 **Personalização no MVP**
- **Proposta:** Nenhuma. A personalização (logótipo, cores) é um forte incentivo para a Fase 2
- **❓ Decisão Necessária:** Estamos alinhados em manter o MVP sem personalização de marca?

---

## 📅 CHANGELOG - HISTÓRICO DE VERSÕES

### **v7.1 (26/09/2025) - Correções e Atualizações**

#### 🔧 **Correções Aplicadas:**
- **Autor atualizado:** Thiago Fiuza Rosman - e4labs-bcm
- **Moeda corrigida:** Todos os valores convertidos de EUR para BRL
- **Tabela de preços padronizada:** 9 módulos com valores consistentes
- **Status Stripe atualizado:** De "Não implementado" para "Parcialmente implementado"
- **ARPU ajustado:** De 15€ para R$ 25,00/empresa/mês

#### 📊 **Preços Finais Definidos:**
- AI Agent e Suporte: R$ 19,90 (entrada)
- Estoque: R$ 24,90
- Financeiro: R$ 29,90 (mais procurado)
- Marketing: R$ 34,90
- RH: R$ 39,90
- Instagram: R$ 49,90 (premium)

### **v7.0 (22/09/2025) - Sistema de Permissões Granulares**

#### ✨ **Funcionalidades Adicionadas:**
- **Sistema de Permissões Granulares**: 25 funções em 5 módulos
- **Interface de Gestão de Funcionários**: Componente `EmployeeManagement.tsx`
- **Manager de Permissões**: Componente `UserPermissionsManager.tsx`
- **3 novas tabelas**: `module_functions`, `user_module_access`, `user_function_permissions`
- **4 funções RPC**: Para gerenciar permissões dinamicamente

#### 🔧 **Melhorias:**
- Atualização completa do status de implementação
- Novas métricas e metas revisadas
- Identificação de próximas prioridades
- Documentação de diferenciais competitivos

#### 📊 **Status Atual:**
- **Fase 1 (MVP)**: 85% → Pronta para uso
- **Fase 3 (AI Agent)**: 90% → Implementada antecipadamente
- **Sistema de Pagamentos**: Próxima prioridade crítica

### **v6.0 (27/08/2025) - Modelo de Monetização**
- Definição do modelo Freemium
- Estratégia de módulos à la carte
- Integração Stripe planejada

### **Versões Anteriores (v1.0 - v5.0)**
- Definição da arquitetura base
- Sistema de módulos
- Interface mobile-first
- AI Agent conceitual

---

## 🎯 **RESUMO EXECUTIVO - ONDE ESTAMOS:**

**O Hub.App está 85% completo para MVP e já possui funcionalidades avançadas que competidores não têm:**

1. ✅ **Infraestrutura sólida** com multi-tenancy real
2. ✅ **Sistema de permissões granular** implementado
3. ✅ **AI Agent inteligente** com WhatsApp integration
4. ✅ **9 módulos cadastrados** prontos para monetização

**Próximo foco:** Finalizar CRM/Agenda funcionais e implementar Stripe para monetização.

**Diferencial único:** Controle granular de permissões + AI Agent integrado + WhatsApp = Nenhum competidor tem isso junto.

---

**© 2025 Hub.App - Documento de Requisitos de Produto v7.0**
