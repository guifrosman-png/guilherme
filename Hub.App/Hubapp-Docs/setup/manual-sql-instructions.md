# 🚀 EXECUTAR MANUALMENTE NO SUPABASE

## Acesse o SQL Editor:
https://supabase.com/dashboard/project/hnkcgtkrngldrtnsmzps/sql

## Execute este SQL completo:

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

-- 3. FEEDBACK DE CATEGORIZAÇÃO
CREATE TABLE IF NOT EXISTS ai_categorization_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  transaction_description TEXT NOT NULL,
  transaction_amount DECIMAL(10,2),
  original_category TEXT,
  correct_category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTEXTO POR USUÁRIO
CREATE TABLE IF NOT EXISTS ai_user_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  tenant_id UUID,
  preferences JSONB DEFAULT '{}',
  usage_patterns JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MÉTRICAS DIÁRIAS
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

-- 6. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_ai_learning_tenant_created
ON ai_learning_data(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_learning_module_success
ON ai_learning_data(module_id, success);

CREATE INDEX IF NOT EXISTS idx_ai_examples_module_active
ON ai_prompt_examples(module_id, is_active, success_rate DESC);

-- 7. INSERIR EXEMPLOS INICIAIS
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

-- 8. VERIFICAR SE TUDO FOI CRIADO
SELECT
  'ai_learning_data' as tabela,
  COUNT(*) as registros
FROM ai_learning_data
UNION ALL
SELECT
  'ai_prompt_examples' as tabela,
  COUNT(*) as registros
FROM ai_prompt_examples
UNION ALL
SELECT
  'ai_categorization_feedback' as tabela,
  COUNT(*) as registros
FROM ai_categorization_feedback
UNION ALL
SELECT
  'ai_user_context' as tabela,
  COUNT(*) as registros
FROM ai_user_context
UNION ALL
SELECT
  'ai_metrics_daily' as tabela,
  COUNT(*) as registros
FROM ai_metrics_daily;
```

## ✅ Resultado Esperado:
- 5 tabelas criadas
- 6 exemplos inseridos
- Sistema de feedback ativo