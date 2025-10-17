# ⚡ EXECUTE AGORA - Sistema de Aprendizado

## 🎯 **PASSO 1: Copie e Execute este SQL**

Vá para https://supabase.com/dashboard/project/xnkcgtkrngldrtnsmzps/sql e execute:

```sql
-- 1. TABELA PRINCIPAL DE LEARNING
CREATE TABLE IF NOT EXISTS ai_learning_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  session_id UUID NOT NULL,
  module_id TEXT NOT NULL,
  user_input TEXT NOT NULL,
  ai_response JSONB NOT NULL,
  action_executed JSONB,
  user_feedback TEXT CHECK (user_feedback IN ('positive', 'negative', 'neutral')),
  success BOOLEAN NOT NULL DEFAULT false,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost_cents INTEGER NOT NULL DEFAULT 0,
  provider_used TEXT NOT NULL DEFAULT 'gemini',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EXEMPLOS PARA FEW-SHOT LEARNING
CREATE TABLE IF NOT EXISTS ai_prompt_examples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id TEXT NOT NULL,
  user_input_example TEXT NOT NULL,
  expected_action JSONB NOT NULL,
  success_rate DECIMAL(5,2) DEFAULT 100.00,
  confidence_score DECIMAL(3,2) DEFAULT 0.95,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_synthetic BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. OUTRAS TABELAS AUXILIARES
CREATE TABLE IF NOT EXISTS ai_categorization_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  transaction_description TEXT NOT NULL,
  transaction_amount DECIMAL(10,2),
  original_category TEXT,
  correct_category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  tenant_id UUID,
  preferences JSONB DEFAULT '{}',
  usage_patterns JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_metrics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  date DATE NOT NULL,
  module_id TEXT,
  total_interactions INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_latency_ms INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INSERIR EXEMPLOS INICIAIS
INSERT INTO ai_prompt_examples (module_id, user_input_example, expected_action, is_synthetic)
VALUES
  ('multifins', 'Cria uma receita de consultoria de R$ 3.500 para próxima semana',
   '{"actionId": "multifins-criar-receita", "parameters": {"valor": 3500, "descricao": "consultoria", "data_vencimento": "2025-09-24"}}',
   true),

  ('multifins', 'Adiciona despesa de combustível R$ 80 hoje',
   '{"actionId": "multifins-criar-despesa", "parameters": {"valor": 80, "descricao": "combustível", "data_vencimento": "2025-09-17"}}',
   true),

  ('crm', 'Adiciona João Silva como cliente, telefone 11999887766',
   '{"actionId": "crm-criar-contato", "parameters": {"nome": "João Silva", "telefone": "11999887766", "tipo": "cliente"}}',
   true),

  ('crm', 'Busca todos os clientes da empresa XYZ',
   '{"actionId": "crm-buscar-contato", "parameters": {"termo_busca": "XYZ", "limite": 10}}',
   true),

  ('agenda', 'Agenda reunião com João Silva amanhã às 14h',
   '{"actionId": "agenda-criar-evento", "parameters": {"titulo": "Reunião com João Silva", "data_inicio": "2025-09-18T14:00:00"}}',
   true),

  ('agenda', 'Horários livres quinta-feira à tarde',
   '{"actionId": "agenda-buscar-horarios-livres", "parameters": {"data": "2025-09-19", "horario_inicio": "12:00", "horario_fim": "18:00"}}',
   true)

ON CONFLICT DO NOTHING;

-- 5. VERIFICAR SE FUNCIONOU
SELECT 'ai_learning_data' as tabela, COUNT(*) as registros FROM ai_learning_data
UNION ALL
SELECT 'ai_prompt_examples' as tabela, COUNT(*) as registros FROM ai_prompt_examples
UNION ALL
SELECT 'ai_categorization_feedback' as tabela, COUNT(*) as registros FROM ai_categorization_feedback
UNION ALL
SELECT 'ai_user_context' as tabela, COUNT(*) as registros FROM ai_user_context
UNION ALL
SELECT 'ai_metrics_daily' as tabela, COUNT(*) as registros FROM ai_metrics_daily;
```

## 🧪 **PASSO 2: Teste Imediato**

1. **Acesse**: http://localhost:3000
2. **Clique no botão flutuante 💬** (canto inferior direito)
3. **Digite**: "Cria uma receita de R$ 1.500 para consultoria"
4. **Clique 👍 ou 👎** na resposta da IA
5. **Verifique**: Console do browser deve mostrar logs

## 📊 **PASSO 3: Verificar Dados**

Execute no Supabase SQL Editor:

```sql
-- Ver interações logadas
SELECT
  module_id,
  user_input,
  success,
  user_feedback,
  created_at
FROM ai_learning_data
ORDER BY created_at DESC
LIMIT 5;

-- Ver exemplos disponíveis
SELECT
  module_id,
  user_input_example,
  success_rate
FROM ai_prompt_examples
WHERE is_active = true
ORDER BY module_id;
```

## ✅ **Resultado Esperado**

Após executar:
- ✅ 5 tabelas criadas
- ✅ 6 exemplos inseridos
- ✅ Sistema de feedback ativo
- ✅ Logging automático funcionando
- ✅ Dados sendo salvos em tempo real

## 🎉 **Sistema 100% Funcional!**

O agente vai **aprender automaticamente** com cada:
- 👍 Feedback positivo → Vira exemplo para futuras respostas
- 📊 Interação logada → Dados para análise e melhoria
- 🔄 Prompt enriquecido → Respostas cada vez melhores

**Execute o SQL e teste agora! 🚀**