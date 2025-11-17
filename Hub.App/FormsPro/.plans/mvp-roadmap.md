# 🎯 Plano MVP - Anamnese Pro
## Roadmap de Desenvolvimento para Produto Mínimo Viável

**Gerado por:** Planning Agent
**Data:** 30 de Setembro de 2025
**Objetivo:** Validar conceito com tatuadoras em 3 meses
**Meta:** 25 profissionais ativos usando o módulo

---

## 📊 Resumo Executivo

### 🎯 Problema a Resolver
Tatuadoras perdem **40% do tempo de atendimento** preenchendo fichas de anamnese repetitivas para clientes recorrentes.

### 💡 Solução MVP
Sistema de anamnese inteligente que **reduz 80% do tempo** de preenchimento através de reutilização automática de dados.

### 🏆 Critério de Sucesso
- ✅ 25 tatuadoras ativas em 3 meses
- ✅ 80% redução no tempo para clientes recorrentes
- ✅ > 90% satisfação com experiência mobile
- ✅ 100% fichas têm valor legal (PDF + assinatura)

---

## 🗓️ Timeline de 12 Semanas

### 📅 Semanas 1-2: Fundação Técnica
**Entregável:** Infraestrutura básica funcionando

#### Backend Setup (Backend Agent)
- [ ] **Configurar ambiente de desenvolvimento**
  - Node.js + Express + TypeScript
  - PostgreSQL + Prisma ORM
  - JWT para autenticação
  - Docker para desenvolvimento local

- [ ] **Estrutura base do banco de dados**
```sql
-- Tabelas essenciais para MVP
CREATE TABLE anamnese_fichas (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  cliente_id UUID NOT NULL,
  template_tipo VARCHAR(50) DEFAULT 'tatuagem',
  versao INTEGER DEFAULT 1,
  dados_saude JSONB NOT NULL,
  data_criacao TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'ativa'
);
```

- [ ] **API básica de autenticação**
  - Login/logout
  - Validação de tokens
  - Middleware de autorização

#### Frontend Setup (Frontend Agent)
- [ ] **Configurar projeto React**
  - React 18 + TypeScript + Vite
  - Tailwind CSS + shadcn/ui
  - React Hook Form + Zod
  - React Query para estado

- [ ] **Estrutura de rotas e layout**
  - Layout responsivo base
  - Navegação mobile-first
  - Sistema de temas (claro/escuro)

#### Integração Inicial (Backend Agent)
- [ ] **Conexão básica com CRM Hub.App**
  - API para buscar clientes
  - Sincronização de dados pessoais
  - Criação automática de novos clientes

**🎯 Meta da Sprint:** Ambiente completo para desenvolvimento

---

### 📅 Semanas 3-4: Quiz Interativo MVP
**Entregável:** Primeira versão do quiz funcional

#### Interface do Quiz (Frontend Agent)
- [ ] **Componente de Pergunta Base**
```typescript
interface PerguntaProps {
  tipo: 'sim_nao' | 'texto' | 'selecao';
  titulo: string;
  obrigatoria: boolean;
  condicional?: string; // Quando mostrar
}
```

- [ ] **Template específico para tatuagem**
  - Dados pessoais básicos
  - Histórico de saúde
  - Alergias e medicamentos
  - Condições de pele
  - Local da tatuagem pretendida

- [ ] **Progress Bar motivacional**
  - Indicador visual de progresso
  - Estimativa de tempo restante
  - Feedback positivo a cada seção

- [ ] **Validação em tempo real**
  - Campos obrigatórios destacados
  - Mensagens de erro amigáveis
  - Salvamento automático

#### Lógica do Quiz (Backend Agent)
- [ ] **API para gerenciar quiz**
```typescript
POST /api/anamnese/iniciar    // Novo quiz
PUT  /api/anamnese/:id/salvar // Salvar progresso
GET  /api/anamnese/:id        // Recuperar quiz
```

- [ ] **Sistema de templates**
  - Template tatuagem (MVP)
  - Estrutura para futuros templates
  - Lógica condicional para perguntas

- [ ] **Validação de dados**
  - Esquemas Zod para cada tipo de pergunta
  - Sanitização de dados sensíveis
  - Logs de auditoria

#### Testes da Funcionalidade (Testing Agent)
- [ ] **Testes unitários**
  - Componentes do quiz
  - Validação de dados
  - Lógica condicional

- [ ] **Teste E2E do fluxo**
  - Preenchimento completo
  - Salvamento automático
  - Recuperação de progresso

**🎯 Meta da Sprint:** Quiz completo e funcional para tatuagem

---

### 📅 Semanas 5-6: Reutilização Inteligente
**Entregável:** Clientes recorrentes economizam 80% do tempo

#### Busca e Pré-preenchimento (Frontend Agent)
- [ ] **Componente de busca de cliente**
  - Busca while-typing
  - Lista de sugestões
  - Opção \"cliente novo\"

- [ ] **Interface de cliente existente**
  - Dados básicos pré-preenchidos
  - Destaque em campos que precisam revisão
  - Comparação com versão anterior

- [ ] **Histórico visual**
  - Timeline de anamneses anteriores
  - Diff visual entre versões
  - Acesso rápido a versões antigas

#### Sistema de Versionamento (Backend Agent)
- [ ] **Lógica de reutilização**
```typescript
// Buscar última anamnese do cliente
async function obterUltimaAnamnese(clienteId: string) {
  return await prisma.anamnese.findFirst({
    where: { cliente_id: clienteId, status: 'ativa' },
    orderBy: { versao: 'desc' }
  });
}
```

- [ ] **Criação de novas versões**
  - Manter histórico completo
  - Incrementar versão automaticamente
  - Detectar campos alterados

- [ ] **API de comparação**
```typescript
GET /api/anamnese/compare/:id1/:id2  // Comparar versões
GET /api/anamnese/history/:clienteId // Histórico completo
```

#### Otimização de Performance (Testing Agent)
- [ ] **Métricas de tempo**
  - Benchmark: tempo de preenchimento completo vs atualização
  - Meta: < 2 minutos para cliente recorrente
  - Monitoramento em tempo real

- [ ] **Testes de carga**
  - Simular múltiplos usuários simultâneos
  - Teste de busca com muitos clientes
  - Performance do banco com histórico grande

**🎯 Meta da Sprint:** 80% redução no tempo para clientes recorrentes

---

### 📅 Semanas 7-8: Documentação Legal
**Entregável:** PDFs com valor legal e assinatura digital

#### Assinatura Digital (Frontend Agent)
- [ ] **Componente de assinatura**
  - Canvas touchscreen
  - Suporte a mouse e dedo
  - Preview da assinatura
  - Botão limpar/refazer

- [ ] **Fluxo de finalização**
  - Resumo de todas as respostas
  - Confirmação dos dados
  - Assinatura obrigatória
  - Termo de compromisso

#### Geração de PDF (Backend Agent)
- [ ] **Sistema de PDF automático**
```typescript
// Usar Puppeteer para gerar PDF profissional
async function gerarPDFAnamnese(anamneseId: string) {
  const dados = await obterDadosCompletos(anamneseId);
  const html = await renderTemplate('anamnese-tatuagem', dados);
  const pdf = await puppeteer.generatePDF(html);
  return await uploadS3(pdf);
}
```

- [ ] **Template profissional de PDF**
  - Header com dados da profissional
  - Seções organizadas por categoria
  - Assinatura digital incorporada
  - Footer com data e validade legal

- [ ] **Armazenamento seguro**
  - Upload para S3/MinIO
  - URLs assinadas com expiração
  - Backup automático
  - Compliance com LGPD

#### Compliance Legal (Testing Agent)
- [ ] **Validação jurídica**
  - Verificar se PDF atende requisitos legais
  - Teste de integridade da assinatura
  - Auditoria de dados sensíveis
  - Verificação de retenção de dados

- [ ] **Testes de segurança**
  - Penetration testing básico
  - Verificação de criptografia
  - Teste de autorização
  - Validação de LGPD

**🎯 Meta da Sprint:** Fichas com 100% valor legal

---

### 📅 Semanas 9-10: Integração CRM Completa
**Entregável:** Sincronização perfeita com Hub.App

#### Sincronização Bidirecional (Backend Agent)
- [ ] **Webhooks do CRM**
```typescript
// Cliente atualizado no CRM → Atualizar anamnese
POST /webhook/crm/cliente-atualizado
{
  clienteId: string,
  dadosAtualizados: ClienteData
}
```

- [ ] **Sincronização automática**
  - Dados pessoais sempre atualizados
  - Detecção de conflitos
  - Merge inteligente de dados
  - Log de todas as sincronizações

- [ ] **Criação automática no CRM**
  - Cliente novo na anamnese → Criar no CRM
  - Evitar duplicatas
  - Transferir dados completos
  - Associar automaticamente

#### Interface Unificada (Frontend Agent)
- [ ] **Integração visual**
  - Foto do cliente vinda do CRM
  - Status de sincronização visível
  - Links para perfil completo no CRM
  - Histórico unificado

- [ ] **Resolução de conflitos**
  - Interface para conflitos de dados
  - Escolha manual quando necessário
  - Preview das mudanças
  - Confirmação antes de sincronizar

#### Monitoramento de Integração (Testing Agent)
- [ ] **Testes de integração**
  - Cenários de sincronização
  - Teste de conflitos
  - Performance com volume alto
  - Recuperação de falhas

- [ ] **Métricas de sincronização**
  - Taxa de sucesso: 100%
  - Tempo médio de sincronização
  - Detecção de inconsistências
  - Alertas automáticos

**🎯 Meta da Sprint:** 100% sincronização sem erros

---

### 📅 Semanas 11-12: Polimento e Validação
**Entregável:** Produto pronto para primeiros usuários

#### Otimização UX (Frontend Agent)
- [ ] **Performance final**
  - Lazy loading de componentes
  - Otimização de imagens
  - Minificação de código
  - Service Worker para cache

- [ ] **Refinamentos de interface**
  - Micro-interações polidas
  - Feedback visual melhorado
  - Mensagens mais claras
  - Acessibilidade WCAG 2.1 AA

- [ ] **Responsividade final**
  - Teste em dispositivos reais
  - Orientação landscape
  - Diferentes tamanhos de tela
  - Performance em redes lentas

#### Deploy e Monitoramento (Backend Agent)
- [ ] **Ambiente de produção**
  - Setup completo na nuvem
  - SSL/HTTPS configurado
  - Backup automático
  - Monitoring de saúde

- [ ] **Analytics e métricas**
```typescript
// Métricas essenciais para validação
interface MetricasMVP {
  tempoPreenchimento: {
    clienteNovo: number;      // Target: < 10 min
    clienteRecorrente: number; // Target: < 2 min
  };
  taxaAbandono: number;       // Target: < 5%
  satisfacao: number;         // Target: > 90%
  usoDiario: number;          // Target: > 5 anamneses/dia
}
```

#### Validação Final (Testing Agent)
- [ ] **Testes completos**
  - Bateria completa de testes automatizados
  - Teste de carga com dados reais
  - Validação de performance
  - Teste de segurança final

- [ ] **Beta testing**
  - 5 tatuadoras para teste beta
  - Coleta de feedback detalhado
  - Métricas de uso real
  - Ajustes baseados em feedback

**🎯 Meta da Sprint:** Produto validado e pronto para lançamento

---

## 🎯 Critérios de Sucesso do MVP

### ✅ Funcionalidades Essenciais
- [ ] **Quiz Completo**: Template tatuagem 100% funcional
- [ ] **Reutilização**: 80% redução tempo para recorrentes
- [ ] **PDF Legal**: Documentos com assinatura digital
- [ ] **Sincronização CRM**: 100% dados consistentes
- [ ] **Mobile Optimized**: Experiência perfeita em smartphones

### 📊 Métricas de Validação
- [ ] **Adoção**: 25 tatuadoras ativas em 3 meses
- [ ] **Engajamento**: > 10 anamneses por profissional/mês
- [ ] **Eficiência**: < 2 min para cliente recorrente
- [ ] **Qualidade**: < 0.1% taxa de erro
- [ ] **Satisfação**: NPS > 50

### 🎪 Cenários de Uso Validados
- [ ] **Primeira anamnese**: Tatuadora consegue criar ficha completa em < 10 min
- [ ] **Cliente retorna**: Atualização em < 2 min com dados pré-preenchidos
- [ ] **PDF legal**: Documento gerado automaticamente aceito pelos órgãos
- [ ] **Integração**: Dados sincronizados perfeitamente com CRM
- [ ] **Mobile**: Uso fluido em smartphone durante atendimento

---

## 🚨 Riscos e Mitigações

### ⚠️ Riscos Técnicos
**Risco:** Performance ruim em dispositivos móveis
**Mitigação:** Testes contínuos em dispositivos reais, otimização agressiva

**Risco:** Problemas de integração com CRM
**Mitigação:** Ambiente de teste dedicado, mocks para desenvolvimento

**Risco:** Geração de PDF lenta
**Mitigação:** Cache de templates, geração assíncrona

### ⚠️ Riscos de Produto
**Risco:** Baixa adoção por tatuadoras
**Mitigação:** Beta test com feedback, onboarding simplificado

**Risco:** Fichas não atenderem requisitos legais
**Mitigação:** Validação jurídica prévia, consultoria especializada

**Risco:** UX complexa demais
**Mitigação:** Testes de usabilidade frequentes, design iterativo

### ⚠️ Riscos de Prazo
**Risco:** Atraso na integração com CRM
**Mitigação:** Priorizar funcionalidade standalone, integração como plus

**Risco:** Complexidade subestimada
**Mitigação:** Buffer de 2 semanas, features nice-to-have como opcionais

---

## 📈 Pós-MVP: Próximos Passos

### 🔄 Fase 2 (Meses 4-6)
- Templates para psicólogos e nutricionistas
- Integração com MultiFins (trigger automático)
- Sistema de templates customizáveis
- API pública para integrações

### ⚡ Fase 3 (Meses 7-9)
- IA para sugestões automáticas
- Analytics avançados de uso
- Integração com Marketing Pro
- Chatbot de suporte

### 🚀 Visão Longo Prazo
- Expansão para outras áreas de saúde
- Compliance internacional (HIPAA, GDPR)
- Mobile app nativo
- Marketplace de templates

---

**📝 Documento criado pelo Planning Agent**
**🎯 Objetivo:** Guiar desenvolvimento do MVP em 12 semanas**
**📊 Sucesso:** 25 tatuadoras ativas com 80% redução de tempo**