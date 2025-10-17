# AI Agent System

## Status
✅ **TOTALMENTE ORGANIZADO E FUNCIONAL** - Todos os arquivos consolidados

## Estrutura Unificada: `/modulos/ai-agent/`

```
modulos/ai-agent/
├── components/              # Interface React
│   ├── FloatingChatButton.tsx    # Botão flutuante
│   ├── ChatModal.tsx             # Modal de chat
│   ├── MessageBubble.tsx         # Bolhas de mensagem
│   └── ActionConfirmation.tsx    # Sistema de confirmação
├── hooks/                   # Hooks React
│   ├── useAI.ts                  # Hook principal IA
│   ├── useChat.ts                # Gerenciamento chat
│   ├── useWhatsAppOnboarding.ts  # Configuração WhatsApp
│   └── useFileProcessor.ts       # Processamento arquivos
├── services/                # Serviços backend
│   ├── llm/                      # Provedores LLM
│   │   ├── LLMRouter.ts          # Roteador multi-provider
│   │   └── providers/            # Gemini, OpenAI, etc.
│   └── database/                 # Function Calling
│       └── DatabaseFunctions.ts  # Funções de banco
├── whatsapp/               # 📱 INTEGRAÇÃO WHATSAPP COMPLETA
│   ├── bots/              # Todos os bots WhatsApp
│   ├── docs/              # Documentação completa
│   ├── tests/             # Testes e validação
│   └── workflows/         # Workflows N8N
└── [outros diretórios...]
```

## Comandos Principais

### WhatsApp Bots
```bash
# Bot principal (recomendado)
cd modulos/ai-agent/whatsapp/bots
node whatsapp-bot-simple.js

# Bot com autenticação avançada
node whatsapp-bot-secure.js

# API server Gemini (porta 3001)
node api-server.js

# Testar integração AI Learning
cd ../tests
node test-whatsapp-learning.js
```

### N8N Workflows
```bash
# Workflows organizados
cd modulos/ai-agent/whatsapp/workflows
ls *.json  # 5 workflows disponíveis
npx n8n import:workflow n8n-workflow-simples.json
```

## Status de Integração

### ✅ Funcionando
- WhatsApp bot processa PDFs/imagens de notas fiscais
- Envio de mensagens de confirmação detalhadas
- AI Learning System com Few-Shot Learning
- Function Calling com acesso ao banco em tempo real
- Sistema de feedback 👍👎

### 🎯 Próximos Passos
- Integração WhatsApp → AI Agent Framework
- Sistema de ações Multifins
- Canal WhatsApp no AI Agent
- Suporte multi-provider LLM

## AI Learning System

### Database Tables
- `ai_learning_data` - Log de todas as interações AI
- `ai_prompt_examples` - Exemplos few-shot learning
- `ai_categorization_feedback` - Feedback de categorização
- `ai_user_context` - Preferências do usuário
- `ai_metrics_daily` - Métricas diárias

### Como Testar
1. Access http://localhost:3001
2. Click floating chat button 💬
3. Type: "Cria uma receita de R$ 1.500 para consultoria"
4. Click 👍 or 👎 on AI response
5. Check console (F12) for learning logs

## Function Calling

### Implementado
- ✅ Gemini AI com acesso direto ao banco
- ✅ Respostas com dados reais, não genéricos
- ✅ Sistema inteligente sem limitações

### Funções de Banco
```typescript
// Localização: modulos/ai-agent/services/database/DatabaseFunctions.ts
export const DATABASE_FUNCTIONS = [
  'check_whatsapp_status',    // Verifica WhatsApp configurado
  'get_user_profile',         // Informações do perfil
  'get_tenant_info',          // Informações da empresa
  'get_user_modules'          // Módulos disponíveis
];
```

### Exemplos Funcionando
1. **"Meu WhatsApp está configurado?"** → Consulta tempo real
2. **"Qual o nome da minha empresa?"** → Dados reais da empresa
3. **"Que módulos tenho disponíveis?"** → Lista real dos módulos

## WhatsApp Integration

### Conceito Fundamental
O WhatsApp não é um bot separado. É o **mesmo agente IA do Hub.App** acessível via WhatsApp.

### Arquitetura Conceitual
```
Hub.App (Web) ←→ Agente IA Central ←→ WhatsApp (Mobile)
     ↓                    ↓                    ↓
Interface Web      Processamento IA     Interface WhatsApp
```

### Experiência Unificada
- **Mesmo usuário**, **mesma empresa**, **mesmas permissões**
- **Mesmos dados**, **mesmo contexto**, **mesma sessão**
- **Canais diferentes**: Browser vs WhatsApp
- **Aprendizado cross-channel**: Feedback de um canal melhora o outro