# 🔐 Variáveis de Ambiente - Produção

Guia completo de todas as variáveis de ambiente necessárias para deploy em produção.

---

## 📋 Variáveis Obrigatórias

### 🗄️ Supabase (Database & Auth)
```bash
# URL do projeto Supabase
VITE_SUPABASE_URL=https://hnkcgtkrngldrtnsmzps.supabase.co

# Chave pública (anon key) - Frontend
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Chave privada (service role) - Backend/Bot APENAS
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Onde pegar**: Supabase Dashboard → Settings → API

---

### 🤖 Google Gemini AI
```bash
# API Key do Gemini
VITE_GEMINI_API_KEY=AIzaSy...
```

⚠️ **Onde pegar**: https://aistudio.google.com/app/apikey

---

### 💳 Stripe (Pagamentos)
```bash
# Chave pública (frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Chave secreta (backend) - NÃO EXPOR NO FRONTEND
STRIPE_SECRET_KEY=sk_live_...

# Webhook secret (para validar eventos)
STRIPE_WEBHOOK_SECRET=whsec_...
```

⚠️ **Onde pegar**: https://dashboard.stripe.com/apikeys
⚠️ **Produção**: Use chaves `pk_live_` e `sk_live_` (não `pk_test_`)

---

### 🔐 Google OAuth (Login Social)
```bash
# Client ID do Google
VITE_GOOGLE_CLIENT_ID=123456789-abc...apps.googleusercontent.com
```

⚠️ **Onde pegar**: https://console.cloud.google.com/apis/credentials
⚠️ **Configurar**: Adicionar URL de produção nos "Authorized redirect URIs"

---

## 📋 Variáveis Opcionais

### 🎛️ Configurações da Aplicação
```bash
# Nome da aplicação
VITE_APP_NAME=Hub.App

# Versão
VITE_APP_VERSION=1.0.0

# URLs da aplicação
VITE_APP_URL=https://app.seudominio.com
VITE_API_URL=https://api.seudominio.com

# Modo de desenvolvimento (produção = false)
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

### 🤖 AI Agent
```bash
# Habilitar AI Agent
VITE_AI_AGENT_ENABLED=true

# Debug do AI (produção = false)
VITE_AI_AGENT_DEBUG=false
```

### 📊 Analytics (Opcional)
```bash
# Google Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Sentry (Error tracking)
VITE_SENTRY_DSN=https://...@sentry.io/...
```

---

## 🚀 Configuração no Coolify

### Passo a Passo
1. Acesse: http://82.25.77.179:8000/
2. Vá no projeto → **Environment Variables**
3. Adicione cada variável manualmente ou via arquivo

### Formato no Coolify
```bash
# Cole uma por linha no formato:
KEY=value
```

### ⚠️ Importante
- **Frontend**: Use apenas variáveis com prefixo `VITE_`
- **Backend/Bot**: Pode usar qualquer nome de variável
- **Secrets**: Use variáveis secretas para keys sensíveis

---

## 📝 Template Completo para Copiar

### Frontend (Hub.App React)
```bash
# Supabase
VITE_SUPABASE_URL=https://hnkcgtkrngldrtnsmzps.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# Gemini AI
VITE_GEMINI_API_KEY=sua_gemini_key_aqui

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_sua_key_aqui

# Google OAuth
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui

# App Config
VITE_APP_NAME=Hub.App
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://app.seudominio.com
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false

# AI Agent
VITE_AI_AGENT_ENABLED=true
VITE_AI_AGENT_DEBUG=false
```

### Backend/WhatsApp Bot
```bash
# Supabase (Backend)
SUPABASE_URL=https://hnkcgtkrngldrtnsmzps.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Gemini AI
GEMINI_API_KEY=sua_gemini_key_aqui

# Database Direct (se necessário)
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres

# Stripe (Backend)
STRIPE_SECRET_KEY=sk_live_sua_secret_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_webhook_secret_aqui
```

---

## 🔍 Como Obter Cada Variável

### Supabase Keys
1. Acesse: https://supabase.com/dashboard/project/hnkcgtkrngldrtnsmzps
2. Settings → API
3. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ SECRETA)

### Gemini API Key
1. Acesse: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copie a key → `VITE_GEMINI_API_KEY`

### Stripe Keys
1. Acesse: https://dashboard.stripe.com/apikeys
2. **Modo Live** (produção):
   - Publishable key → `VITE_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY` (⚠️ SECRETA)
3. Webhook Secret:
   - Developers → Webhooks → Add endpoint
   - Copie signing secret → `STRIPE_WEBHOOK_SECRET`

### Google OAuth
1. Acesse: https://console.cloud.google.com/apis/credentials
2. Credentials → OAuth 2.0 Client IDs
3. Copie Client ID → `VITE_GOOGLE_CLIENT_ID`
4. ⚠️ **Configurar Authorized redirect URIs**:
   ```
   https://app.seudominio.com
   https://hnkcgtkrngldrtnsmzps.supabase.co/auth/v1/callback
   ```

---

## ✅ Checklist de Segurança

### ✅ Fazer
- [ ] Use chaves de **produção** (não test/dev)
- [ ] Mantenha `SUPABASE_SERVICE_ROLE_KEY` privada (só backend)
- [ ] Mantenha `STRIPE_SECRET_KEY` privada (só backend)
- [ ] Configure CORS no Supabase para seu domínio
- [ ] Configure Stripe webhook para URL de produção
- [ ] Use HTTPS em produção (Coolify faz automático)

### ❌ Não Fazer
- [ ] ❌ NÃO commitar `.env.local` no Git
- [ ] ❌ NÃO expor service_role_key no frontend
- [ ] ❌ NÃO usar chaves de teste em produção
- [ ] ❌ NÃO compartilhar chaves publicamente

---

## 🔄 Atualizar Variáveis

### No Coolify
1. Vá no projeto → Environment Variables
2. Edite a variável
3. **Redeploy** para aplicar mudanças

### Via Git (Não recomendado para secrets)
```bash
# Nunca commite secrets!
# Use apenas para configs públicas
```

---

## 🧪 Testar Variáveis

### Frontend (Browser Console)
```javascript
// Verificar se variáveis estão carregadas
console.log(import.meta.env.VITE_SUPABASE_URL)
console.log(import.meta.env.VITE_GEMINI_API_KEY)

// ⚠️ Se retornar undefined = variável não configurada
```

### Backend (Node.js)
```javascript
// Verificar variáveis do backend
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY)
console.log(process.env.GEMINI_API_KEY)
```

---

## 🆘 Troubleshooting

### Variáveis não carregam
- Certifique que começam com `VITE_` (frontend)
- Redeploy após adicionar variáveis
- Verifique se não há espaços ou quebras de linha

### Build falha
- Todas as variáveis obrigatórias estão configuradas?
- Use `.env.example` como referência

### Supabase não conecta
- URL está correta? (deve terminar com `.supabase.co`)
- Anon key está correta?
- CORS configurado no Supabase?

### Stripe não funciona
- Usando chaves de produção (`pk_live_`, `sk_live_`)?
- Webhook configurado para URL de produção?
- Webhook secret correto?

---

## 📊 Resumo Rápido

| Serviço | Frontend | Backend/Bot | Onde Pegar |
|---------|----------|-------------|------------|
| **Supabase URL** | ✅ `VITE_` | ✅ | Supabase Dashboard |
| **Supabase Anon** | ✅ `VITE_` | ❌ | Supabase Dashboard |
| **Supabase Service** | ❌ | ✅ | Supabase Dashboard |
| **Gemini AI** | ✅ `VITE_` | ✅ | Google AI Studio |
| **Stripe Public** | ✅ `VITE_` | ❌ | Stripe Dashboard |
| **Stripe Secret** | ❌ | ✅ | Stripe Dashboard |
| **Google OAuth** | ✅ `VITE_` | ❌ | Google Console |

---

**🔐 Mantenha suas chaves seguras!**

*Criado em: 30/09/2025*
*Última atualização: 30/09/2025*