# Voice Commands Setup - Hub.App + N8N

## 🚀 Sistema Implementado

### Arquitetura Completa
```
WhatsApp → N8N → Google Whisper → Google Gemini → Hub.App → WhatsApp Response
```

## 📁 Arquivos Criados

### 1. **Hub.App API Server** (`api-server.js`)
- ✅ Endpoint básico: `/api/test`
- ✅ Endpoint Voice Commands: `/api/voice-commands`
- ✅ Processamento inteligente de comandos
- ✅ Logs detalhados

### 2. **N8N Workflow** (`n8n-voice-commands-workflow.json`)
- ✅ Webhook para WhatsApp
- ✅ Download e processamento de áudio
- ✅ Transcrição com Whisper
- ✅ Análise com Google Gemini
- ✅ Integração com Hub.App
- ✅ Resposta automática via WhatsApp

## 🔧 Configuração Necessária

### Variáveis de Ambiente N8N
Adicione no N8N ou arquivo `.env`:

```bash
# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_ID=your_phone_number_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token

# Google APIs
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_key_for_whisper

# Hub.App
HUBAPP_API_URL=http://localhost:3001
```

## 📋 Comandos de Voz Suportados

### CRM Commands
- "Criar um novo cliente chamado [Nome]"
- "Listar meus clientes"
- "Buscar cliente [Nome]"

### Calendar Commands  
- "Agendar reunião com [Nome] para [data/hora]"
- "Mostrar minha agenda de hoje"
- "Cancelar reunião das [hora]"

### Dashboard Commands
- "Mostrar status do dashboard"
- "Resumo de hoje"
- "Quantos clientes ativos tenho?"

## 🧪 Como Testar

### 1. Teste Direto do Endpoint
```bash
curl -X POST http://localhost:3001/api/voice-commands \
  -H "Content-Type: application/json" \
  -d '{
    "transcribed_text": "criar um novo cliente chamado João Silva",
    "user_phone": "+5511999999999",
    "message_id": "msg_123"
  }'
```

### 2. Importar Workflow no N8N
1. Abra N8N: `http://localhost:5680`
2. Clique em "Import from file"
3. Selecione `n8n-voice-commands-workflow.json`
4. Configure as variáveis de ambiente
5. Ative o workflow

### 3. Teste com WhatsApp (após configurar APIs)
1. Envie áudio via WhatsApp
2. N8N processa automaticamente
3. Recebe resposta no WhatsApp

## ⚙️ Serviços Rodando

```bash
# Hub.App Frontend
http://localhost:3000/

# Hub.App API
http://localhost:3001/
- GET  /health
- POST /api/test  
- POST /api/voice-commands

# N8N
http://localhost:5680/
- Webhook: /webhook-test/voice-commands
```

## 🎯 Próximos Passos

1. **Configurar WhatsApp Business API**
   - Criar conta Facebook Developer
   - Configurar webhook WhatsApp → N8N

2. **Adicionar Google Gemini**
   - Criar API key Google AI Studio
   - Integrar processamento de linguagem natural

3. **Expandir Comandos**
   - Adicionar mais ações CRM
   - Integrar com calendário real
   - Adicionar confirmações

4. **Deploy em Produção**
   - Configurar domínio para webhooks
   - SSL/HTTPS para APIs WhatsApp
   - Banco de dados persistente

## 📝 Logs e Monitoramento

Monitore os logs em tempo real:
```bash
# Hub.App API Logs
# Veja no terminal onde rodou: node api-server.js

# N8N Logs  
# Veja no terminal onde rodou: n8n start

# Logs incluem:
# 🎤 Voice Commands chamadas
# 🗣️ Texto transcrito
# ✅ Respostas processadas
# ❌ Erros detalhados
```

## 🔒 Segurança e LGPD

- ✅ Dados de áudio não são armazenados
- ✅ Transcrições podem ser anonimizadas  
- ✅ Logs incluem timestamps para auditoria
- ✅ API keys protegidas em variáveis de ambiente

---

**Status:** ✅ Sistema básico implementado e testado
**Próximo:** Configurar APIs externas (WhatsApp + Gemini)