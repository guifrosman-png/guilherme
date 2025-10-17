# 🧠 Sistema de Treinamento Híbrido - Hub.App AI

## 🎯 **Visão Geral**

Este documento descreve como implementar e usar o sistema de treinamento híbrido para o AI Agent do Hub.App. O sistema combina infraestrutura local (Supabase) com serviços de IA em nuvem (Gemini, OpenAI) para criar um agente que **aprende continuamente** com as interações dos usuários.

## 🏗️ **Arquitetura Implementada**

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA HÍBRIDO                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🗄️ SUPABASE (Local Data)          🌐 CLOUD LLMs           │
│  ├── ai_learning_data             ├── Gemini (Primary)     │
│  ├── ai_prompt_examples           ├── OpenAI (Fallback)    │
│  ├── ai_categorization_feedback   └── Claude (Future)      │
│  ├── ai_ab_experiments                                     │
│  ├── ai_user_context                                       │
│  └── ai_metrics_daily                                      │
│                                                             │
│  📊 LEARNING PIPELINE              🔄 FEEDBACK LOOP        │
│  ├── Automatic Logging            ├── 👍👎 User Feedback   │
│  ├── Few-Shot Examples            ├── Success Tracking     │
│  ├── Prompt Optimization          ├── Error Analysis      │
│  └── A/B Testing                  └── Auto Improvement    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 **Setup Inicial**

### **1. Deploy do Schema no Supabase**

Execute o arquivo SQL no seu projeto Supabase:

```bash
# 1. Abra o Supabase Dashboard
# 2. Vá para SQL Editor
# 3. Execute o arquivo ai-learning-schema.sql
```

**Ou via CLI:**
```bash
supabase db push
```

### **2. Verificar RLS Policies**

Confirme que as políticas de segurança estão ativas:

```sql
-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename LIKE 'ai_%';

-- Deve retornar rowsecurity = true para todas as tabelas
```

### **3. Configurar Variáveis de Ambiente**

No seu `.env.local`:

```env
# Gemini API (Primary - Gratuito)
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI (Future - Fallback)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase (já configurado)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 **Componentes do Sistema**

### **1. Sistema de Feedback (👍👎)**

**Localização**: `MessageBubble.tsx`

```typescript
// Já implementado! Cada resposta da IA tem botões de feedback
// Dados são salvos automaticamente em ai_learning_data
```

**Como funciona**:
- Usuário clica 👍 → Interação marcada como `user_feedback: 'positive'`
- Se sucesso + feedback positivo → Automaticamente vira exemplo para few-shot learning
- Feedback negativo → Usado para análise de falhas e melhoria de prompts

### **2. Sistema de Logging Automático**

**Localização**: `useLearning.ts` + `useChat.ts`

```typescript
// Já implementado! Todas as interações são logadas automaticamente
const interaction = {
  sessionId: crypto.randomUUID(),
  moduleId: 'multifins', // crm, agenda, home
  userInput: "Cria uma receita de R$ 3.500",
  aiResponse: { message, actions, provider, tokens, cost },
  success: true/false,
  latencyMs: 1200,
  userFeedback: 'positive' // Adicionado posteriormente
};

await logInteraction(interaction);
```

### **3. Sistema de Exemplos Dinâmicos**

**Localização**: `ExampleManager.ts`

```typescript
// Já implementado! Prompts são enriquecidos automaticamente
const enhancedPrompt = await exampleManager.buildEnhancedPrompt(
  basePrompt,
  'multifins',
  'Cria receita de consultoria R$ 2.500'
);

// Resultado: prompt + 3-5 exemplos similares mais bem-sucedidos
```

### **4. Dashboard de Métricas**

**Localização**: `AIMetricsDashboard.tsx`

```typescript
// Já implementado! Métricas em tempo real por módulo
interface ModuleMetrics {
  totalInteractions: number;
  successRate: number; // %
  positiveFebackRate: number; // %
  avgLatencyMs: number;
  totalTokensUsed: number;
  totalCostCents: number;
}
```

## 🔄 **Como Usar o Sistema**

### **Fase 1: Coleta de Dados (Primeira Semana)**

1. **Ativar logging**: ✅ Já ativo automaticamente
2. **Usar o agente**: Interaja normalmente com o AI Agent
3. **Dar feedback**: Clique 👍👎 nas respostas
4. **Monitorar**: Use o dashboard para acompanhar métricas

```typescript
// Para ver métricas de um módulo específico
const metrics = await getModuleMetrics('multifins', 7); // últimos 7 dias
console.log(`Success Rate: ${metrics.successRate}%`);
```

### **Fase 2: Melhorias Automáticas (Semana 2+)**

O sistema aprende automaticamente:

```typescript
// Análise automática de interações bem-sucedidas
await exampleManager.analyzeRecentInteractions('multifins', 7);
// → Adiciona automaticamente novos exemplos

// Limpeza de exemplos com baixa performance
await exampleManager.cleanupPoorExamples('multifins', 50);
// → Remove exemplos com <50% de sucesso
```

### **Fase 3: Otimização Avançada (Mês 2+)**

```typescript
// A/B Testing de prompts (planejado)
const experiment = await abTesting.createExperiment('financial_prompts_v2', {
  variants: [
    { id: 'formal', prompt: 'Você é um assistente financeiro...' },
    { id: 'casual', prompt: 'Oi! Sou seu assistente financeiro...' }
  ],
  allocation: [50, 50]
});
```

## 📈 **Métricas de Sucesso**

### **KPIs Primários**

```typescript
interface TargetMetrics {
  // Semana 1-4
  successRate: 85;     // Meta: >85%
  responseTime: 3000;  // Meta: <3s
  userSatisfaction: 70; // Meta: >70%

  // Mês 2-3
  successRate: 90;     // Meta: >90%
  responseTime: 2000;  // Meta: <2s
  userSatisfaction: 80; // Meta: >80%

  // Mês 4+
  successRate: 95;     // Meta: >95%
  responseTime: 1500;  // Meta: <1.5s
  userSatisfaction: 85; // Meta: >85%
}
```

### **Dashboard em Tempo Real**

Acesse as métricas através do componente:

```tsx
import { AIMetricsDashboard } from './Modulos/ai-agent/components/AIMetricsDashboard';

// No seu admin ou settings
<AIMetricsDashboard />
```

## 🔧 **Comandos de Manutenção**

### **Análise Manual de Dados**

```sql
-- Ver interações por módulo (últimos 7 dias)
SELECT
  module_id,
  COUNT(*) as total_interactions,
  AVG(CASE WHEN success THEN 1 ELSE 0 END) * 100 as success_rate,
  AVG(CASE WHEN user_feedback = 'positive' THEN 1 ELSE 0 END) * 100 as positive_rate,
  AVG(latency_ms) as avg_latency
FROM ai_learning_data
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY module_id;
```

### **Limpeza de Dados Antigos**

```sql
-- Executar mensalmente (automático via function)
SELECT cleanup_old_ai_data();
```

### **Calcular Métricas Diárias**

```sql
-- Executar diariamente (pode ser automatizado)
SELECT calculate_daily_ai_metrics('2025-09-17', 'your-tenant-id');
```

## 🎯 **Estratégias de Treinamento por Módulo**

### **💰 Multifins (Financeiro)**

```typescript
// Exemplos específicos já inseridos:
"Cria uma receita de consultoria de R$ 3.500 para próxima semana"
"Adiciona despesa de combustível R$ 80 hoje"
"Mostra fluxo de caixa de agosto"

// Foco de treinamento:
- Reconhecimento de valores monetários brasileiros
- Expressões temporais ("próxima semana", "mês passado")
- Categorização automática de extratos
- Cálculos financeiros (DRE, fluxo de caixa)
```

### **👥 CRM (Clientes)**

```typescript
// Exemplos específicos já inseridos:
"Adiciona João Silva como cliente, telefone 11999887766"
"Busca todos os clientes da empresa XYZ"
"Clientes aniversariantes esta semana"

// Foco de treinamento:
- Nomes brasileiros e formatação
- Segmentação (lead → cliente → inativo)
- Integração com agenda
- Follow-ups automáticos
```

### **📅 Agenda**

```typescript
// Exemplos específicos já inseridos:
"Agenda reunião com João Silva amanhã às 14h"
"Horários livres quinta-feira à tarde"
"Reagenda a reunião das 10h para 15h"

// Foco de treinamento:
- Expressões temporais brasileiras
- Conflitos de horário
- Reagendamentos inteligentes
- Lembretes contextuais
```

## 🚨 **Troubleshooting**

### **Problema: Logging não funciona**

```typescript
// Verificar autenticação
const { user } = useAuth();
console.log('User authenticated:', !!user?.id);

// Verificar permissões RLS
// User deve ter tenant_id válido
console.log('Tenant ID:', user?.tenant_id);
```

### **Problema: Feedback não salva**

```sql
-- Verificar se dados estão chegando
SELECT * FROM ai_learning_data
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### **Problema: Exemplos não aparecem**

```typescript
// Forçar refresh do cache
const examples = await exampleManager.getExamplesForModule('multifins', 10, true);
console.log('Examples found:', examples.length);
```

### **Problema: Métricas vazias**

```sql
-- Calcular métricas manualmente
SELECT calculate_daily_ai_metrics(CURRENT_DATE, 'your-tenant-id');

-- Verificar se há dados
SELECT COUNT(*) FROM ai_learning_data WHERE tenant_id = 'your-tenant-id';
```

## 🔮 **Roadmap Futuro**

### **Próximos 30 dias**
- [ ] A/B Testing automático de prompts
- [ ] Análise automática de padrões de falha
- [ ] Sugestões de melhoria baseadas em dados

### **Próximos 90 dias**
- [ ] Machine Learning para categorização de extratos
- [ ] Personalização por usuário
- [ ] Integração com OpenAI como fallback
- [ ] Voice input/output

### **Próximos 180 dias**
- [ ] Custom model fine-tuning
- [ ] Reinforcement learning
- [ ] Multi-modal processing (imagens, voz)
- [ ] Analytics avançados e business intelligence

## 🎉 **Benefícios Esperados**

### **Curto Prazo (1-3 meses)**
- ✅ **75% → 90%** accuracy das respostas
- ✅ **50% redução** no tempo de resposta
- ✅ **85% satisfação** dos usuários

### **Médio Prazo (3-6 meses)**
- ✅ **90% → 95%** accuracy das respostas
- ✅ **70% redução** nos custos de IA (cache + optimizations)
- ✅ **Personalização** automática por usuário

### **Longo Prazo (6+ meses)**
- ✅ **Agente especializado** em contexto empresarial brasileiro
- ✅ **Vantagem competitiva** sustentável
- ✅ **ROI comprovado** através de métricas

---

## 📞 **Suporte e Próximos Passos**

1. **Deploy do schema**: Execute `ai-learning-schema.sql` no Supabase
2. **Configurar API keys**: Adicione GEMINI_API_KEY no `.env.local`
3. **Testar feedback**: Use o agente e clique 👍👎 nas respostas
4. **Monitorar métricas**: Acesse o AIMetricsDashboard
5. **Aguardar dados**: Sistema precisa de 7+ dias para gerar insights significativos

**🎯 O sistema já está 100% funcional e pronto para começar a aprender!**