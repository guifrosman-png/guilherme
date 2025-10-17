# 📚 Hub.App - Documentação Completa

Bem-vindo à documentação do Hub.App! Este é o índice central de toda a documentação do projeto.

---

## 📁 Estrutura da Documentação

### 📘 **[Claude](./claude/)** - Contexto para Claude Code
Documentação específica para auxiliar Claude Code no desenvolvimento:
- [database-access.md](./claude/database-access.md) - Acesso ao banco Supabase via CLI e API
- [architecture.md](./claude/architecture.md) - Visão geral da arquitetura multi-tenant
- [ai-agent.md](./claude/ai-agent.md) - Sistema AI Agent e integração WhatsApp
- [permissions-system.md](./claude/permissions-system.md) - Sistema de permissões granulares
- [debugging-history.md](./claude/debugging-history.md) - Histórico de debugging e soluções

### 🎯 **[Features](./features/)** - Funcionalidades do Sistema
Documentação de features específicas:
- [AI-AGENT-DOCUMENTACAO.md](./features/AI-AGENT-DOCUMENTACAO.md) - Documentação completa do AI Agent
- [PAGAMENTO.md](./features/PAGAMENTO.md) - Sistema de pagamentos Stripe
- [PRIMEIRA-EXPERIENCIA-EXEMPLO.md](./features/PRIMEIRA-EXPERIENCIA-EXEMPLO.md) - Fluxo de primeira experiência
- [PWA_ICONS_GUIDE.md](./features/PWA_ICONS_GUIDE.md) - Guia de ícones PWA

### 📖 **[Guides](./guides/)** - Guias Práticos
Tutoriais e guias passo a passo:
- [EXECUTE-NOW.md](./guides/EXECUTE-NOW.md) - Comandos de execução rápida
- [GEMINI.md](./guides/GEMINI.md) - Integração com Gemini AI
- [modulos-tst.md](./guides/modulos-tst.md) - Testes de módulos
- [voice-commands-gemini-final.md](./guides/voice-commands-gemini-final.md) - Comandos de voz Gemini

### 🚀 **[Project](./project/)** - Gestão do Projeto
Documentação de gerenciamento e planejamento:
- [README.md](./project/README.md) - Visão geral do projeto
- [PRD.md](./project/PRD.md) - Product Requirements Document
- [DEPLOY.md](./project/DEPLOY.md) - Guia de deploy
- [TEST-PLAN-ONBOARDING.md](./project/TEST-PLAN-ONBOARDING.md) - Plano de testes de onboarding

### ⚙️ **[Setup](./setup/)** - Configuração Inicial
Guias de configuração do ambiente:
- [AI-LEARNING-SETUP.md](./setup/AI-LEARNING-SETUP.md) - Setup do sistema AI Learning
- [GOOGLE_OAUTH_SETUP.md](./setup/GOOGLE_OAUTH_SETUP.md) - Configuração Google OAuth
- [manual-sql-instructions.md](./setup/manual-sql-instructions.md) - Instruções SQL manuais
- [voice-commands-setup.md](./setup/voice-commands-setup.md) - Setup de comandos de voz

### 🔧 **[Technical](./technical/)** - Documentação Técnica
Documentação técnica completa do sistema:

#### 📋 Índice Principal
- [README.md](./technical/README.md) - Hub central da documentação técnica

#### 🏗️ Arquitetura e Desenvolvimento
- [getting-started.md](./technical/getting-started.md) - Primeiros passos
- [architecture.md](./technical/architecture.md) - Arquitetura do sistema
- [coding-guidelines.md](./technical/coding-guidelines.md) - Padrões de código
- [components-structure.md](./technical/components-structure.md) - Estrutura de componentes
- [design-system.md](./technical/design-system.md) - Sistema de design
- [environment-setup.md](./technical/environment-setup.md) - Setup do ambiente

#### 🔐 Core Features
- [authentication.md](./technical/authentication.md) - Sistema de autenticação
- [multi-tenancy.md](./technical/multi-tenancy.md) - Arquitetura multi-tenant
- [modules-system.md](./technical/modules-system.md) - Sistema de módulos
- [permissions.md](./technical/permissions.md) - Sistema de permissões

#### 🗄️ Database
- [database-schema.md](./technical/database-schema.md) - Schema completo do banco
- [RLS-POLICIES-ANALYSIS-COMPLETE.md](./technical/RLS-POLICIES-ANALYSIS-COMPLETE.md) - Análise de políticas RLS

#### 🤖 AI & Machine Learning
- [ai-learning-system.md](./technical/ai-learning-system.md) - Sistema de aprendizado AI

#### 📦 Módulos Específicos
- [modulos/modulo-financeiro.md](./technical/modulos/modulo-financeiro.md) - Documentação do módulo financeiro

#### 🤖 **[Agents](./technical/agents/)** - Agentes Especializados
Documentação de agentes de desenvolvimento:
- [README.md](./technical/agents/README.md) - Visão geral dos agentes
- [tech-lead.md](./technical/agents/tech-lead.md) - Agente Tech Lead
- [frontend-developer.md](./technical/agents/frontend-developer.md) - Agente Frontend
- [backend-developer.md](./technical/agents/backend-developer.md) - Agente Backend
- [ui-ux-designer.md](./technical/agents/ui-ux-designer.md) - Agente UI/UX
- [qa-tester.md](./technical/agents/qa-tester.md) - Agente QA
- [product-owner.md](./technical/agents/product-owner.md) - Agente Product Owner
- [devops-engineer.md](./technical/agents/devops-engineer.md) - Agente DevOps
- [AgentfrontEnd-Figma.md](./technical/agents/AgentfrontEnd-Figma.md) - Agente Frontend Figma

---

## 🗂️ Índice por Categoria

### 🚀 Começando
1. [Getting Started](./technical/getting-started.md)
2. [Environment Setup](./technical/environment-setup.md)
3. [PRD - Product Requirements](./project/PRD.md)

### 🏗️ Arquitetura
1. [System Architecture](./technical/architecture.md)
2. [Multi-tenancy](./technical/multi-tenancy.md)
3. [Database Schema](./technical/database-schema.md)
4. [RLS Policies Analysis](./technical/RLS-POLICIES-ANALYSIS-COMPLETE.md)

### 🔐 Autenticação e Permissões
1. [Authentication System](./technical/authentication.md)
2. [Permissions System](./technical/permissions.md)
3. [Google OAuth Setup](./setup/GOOGLE_OAUTH_SETUP.md)

### 🤖 AI Agent
1. [AI Agent System](./claude/ai-agent.md)
2. [AI Learning System](./technical/ai-learning-system.md)
3. [AI Agent Documentation](./features/AI-AGENT-DOCUMENTACAO.md)
4. [AI Learning Setup](./setup/AI-LEARNING-SETUP.md)

### 💬 WhatsApp Integration
1. [WhatsApp Integration](./claude/ai-agent.md#whatsapp-integration)
2. [Voice Commands Setup](./setup/voice-commands-setup.md)
3. [Voice Commands Gemini](./guides/voice-commands-gemini-final.md)

### 💰 Pagamentos
1. [Payment System](./features/PAGAMENTO.md)

### 🎨 Design e UI/UX
1. [Design System](./technical/design-system.md)
2. [Components Structure](./technical/components-structure.md)
3. [PWA Icons Guide](./features/PWA_ICONS_GUIDE.md)
4. [First Experience](./features/PRIMEIRA-EXPERIENCIA-EXEMPLO.md)

### 🔧 Desenvolvimento
1. [Coding Guidelines](./technical/coding-guidelines.md)
2. [Modules System](./technical/modules-system.md)
3. [Financial Module](./technical/modulos/modulo-financeiro.md)

### 🚀 Deploy e Operações
1. [Deploy Guide](./project/DEPLOY.md)
2. [Manual SQL Instructions](./setup/manual-sql-instructions.md)

### 🐛 Debugging
1. [Debugging History](./claude/debugging-history.md)

### 🧪 Testes
1. [Test Plan Onboarding](./project/TEST-PLAN-ONBOARDING.md)
2. [Modules Testing](./guides/modulos-tst.md)

---

## 🎯 Navegação Rápida por Perfil

### 👶 **Novo no Projeto?**
1. [Getting Started](./technical/getting-started.md)
2. [Architecture Overview](./technical/architecture.md)
3. [Environment Setup](./technical/environment-setup.md)

### 👨‍💻 **Desenvolvedor?**
1. [Coding Guidelines](./technical/coding-guidelines.md)
2. [Components Structure](./technical/components-structure.md)
3. [Database Schema](./technical/database-schema.md)

### 🎨 **Designer?**
1. [Design System](./technical/design-system.md)
2. [PWA Icons Guide](./features/PWA_ICONS_GUIDE.md)
3. [First Experience](./features/PRIMEIRA-EXPERIENCIA-EXEMPLO.md)

### 🏢 **Product Owner?**
1. [PRD](./project/PRD.md)
2. [Test Plan](./project/TEST-PLAN-ONBOARDING.md)
3. [Features Overview](./features/)

### 🔧 **DevOps?**
1. [Deploy Guide](./project/DEPLOY.md)
2. [Environment Setup](./technical/environment-setup.md)
3. [Manual SQL Instructions](./setup/manual-sql-instructions.md)

### 🤖 **Trabalhando com IA?**
1. [Claude Context](./claude/)
2. [AI Agent System](./claude/ai-agent.md)
3. [AI Learning Setup](./setup/AI-LEARNING-SETUP.md)

---

## 📊 Estatísticas da Documentação

- **Total de Arquivos**: 45 documentos
- **Pastas Principais**: 6 categorias
- **Agentes Especializados**: 8 agentes
- **Última Atualização**: Sistema production-ready

---

## 🆘 Precisa de Ajuda?

- **🐛 Bug?** Consulte [Debugging History](./claude/debugging-history.md)
- **❓ Dúvida?** Navegue pelo índice acima
- **🚀 Deploy?** Veja [Deploy Guide](./project/DEPLOY.md)
- **🤖 AI Agent?** Comece em [AI Agent Documentation](./features/AI-AGENT-DOCUMENTACAO.md)

---

**🚀 Hub.App - Centralize. Automatize. Cresça.**

*Última atualização: 30/09/2025*