# 🚀 Deploy Hub.App no Coolify

Guia completo para deploy do Hub.App no Coolify (Hostinger).

---

## 📋 Informações do Servidor

- **Coolify URL**: http://82.25.77.179:8000/
- **Servidor**: Hostinger VPS
- **GitHub Repo**: https://github.com/e4labs-bcm/hub.app-figma
- **Branch**: `main`

---

## 🎯 O Que Vamos Deployar

1. **Hub.App Frontend** (React + Vite)
2. **WhatsApp Bot** (Node.js 24/7)

---

## 📦 Parte 1: Deploy do Hub.App Frontend

### Passo 1: Acessar Coolify
1. Acesse: http://82.25.77.179:8000/
2. Faça login com suas credenciais

### Passo 2: Criar Novo Projeto
1. Click em **"+ New Resource"** ou **"Applications"**
2. Selecione **"Public Repository"**
3. Configure:
   - **Repository URL**: `https://github.com/e4labs-bcm/hub.app-figma`
   - **Branch**: `main`
   - **Name**: `hub-app-frontend`

### Passo 3: Configurar Build
No Coolify, configure:

```yaml
Build Pack: Nixpacks (ou Docker)
Build Command: npm run build
Start Command: (deixe vazio para static site)
Port: 3000 (se usar preview server)
```

**Ou use Dockerfile** (recomendado):
```dockerfile
# Já existe no projeto: criar se necessário
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Passo 4: Variáveis de Ambiente
No Coolify, adicione as variáveis de ambiente:

```bash
# Supabase
VITE_SUPABASE_URL=https://hnkcgtkrngldrtnsmzps.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key_aqui

# Google OAuth (se usar)
VITE_GOOGLE_CLIENT_ID=seu_google_client_id

# Gemini AI
VITE_GEMINI_API_KEY=seu_gemini_key

# Stripe (se usar pagamentos)
VITE_STRIPE_PUBLIC_KEY=seu_stripe_public_key
```

⚠️ **IMPORTANTE**: Pegue essas variáveis do arquivo `.env.local` local

### Passo 5: Configurar Domínio (Opcional)
1. No Coolify, vá em **"Domains"**
2. Adicione seu domínio customizado:
   - Ex: `app.seudominio.com`
3. Coolify configura SSL automático (Let's Encrypt)

### Passo 6: Deploy
1. Click em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Coolify mostrará a URL: `http://82.25.77.179:PORT` ou seu domínio

### Passo 7: Deploy Automático (Git Push)
1. No Coolify, ative **"Auto Deploy"**
2. Configure webhook no GitHub (Coolify gera automaticamente)
3. Agora qualquer `git push` faz deploy automático! 🎉

---

## 🤖 Parte 2: Deploy do WhatsApp Bot

### Passo 1: Criar Novo Service
1. No Coolify, click **"+ New Resource"**
2. Selecione **"Public Repository"** novamente
3. Configure:
   - **Repository URL**: `https://github.com/e4labs-bcm/hub.app-figma`
   - **Branch**: `main`
   - **Name**: `whatsapp-bot`

### Passo 2: Configurar Start Command
```yaml
Build Command: npm install
Start Command: node modulos/ai-agent/whatsapp/bots/whatsapp-bot-simple.js
Port: 3001
Working Directory: /app
```

### Passo 3: Variáveis de Ambiente
```bash
# Supabase (mesmas do frontend)
SUPABASE_URL=https://hnkcgtkrngldrtnsmzps.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key_aqui

# Gemini AI
GEMINI_API_KEY=seu_gemini_key

# Database
DATABASE_URL=sua_database_connection_string
```

### Passo 4: Volumes Persistentes (Sessão WhatsApp)
No Coolify, configure volume para manter sessão:
```
Volume: /app/.wwebjs_auth
```

Isso mantém a sessão WhatsApp ativa após restarts!

### Passo 5: Deploy
1. Click **"Deploy"**
2. Bot iniciará e mostrará QR Code nos logs
3. Escaneie com WhatsApp para autenticar

### Passo 6: Monitorar Logs
```bash
# No Coolify, vá em "Logs" para ver:
- QR Code para autenticação
- Mensagens recebidas
- Respostas da IA
```

---

## 🔧 Configurações Adicionais

### Dockerfile para Frontend (Criar se necessário)
`/Dockerfile.frontend`
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf (Para SPA routing)
`/nginx.conf`
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Dockerfile para WhatsApp Bot
`/Dockerfile.bot`
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "modulos/ai-agent/whatsapp/bots/whatsapp-bot-simple.js"]
```

---

## ✅ Checklist de Deploy

### Pré-Deploy
- [ ] `.env.local` com todas as variáveis preenchidas
- [ ] Build local testado: `npm run build`
- [ ] WhatsApp bot testado localmente
- [ ] Código commitado no GitHub (`main` branch)

### Durante Deploy
- [ ] Frontend deployado no Coolify
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado (se aplicável)
- [ ] SSL ativado automaticamente
- [ ] WhatsApp Bot deployado
- [ ] Volume persistente configurado para sessão
- [ ] QR Code escaneado e autenticado

### Pós-Deploy
- [ ] Testar URL do frontend
- [ ] Criar conta teste
- [ ] Configurar empresa teste
- [ ] Testar módulos principais
- [ ] Enviar mensagem WhatsApp para bot
- [ ] Verificar resposta do bot com IA
- [ ] Ativar auto-deploy via webhook

---

## 🔄 Workflow de Desenvolvimento

```bash
# Desenvolvimento local
git add .
git commit -m "nova feature"
git push origin main

# Deploy automático acontece!
# Coolify detecta push → Build → Deploy → Live! 🎉
```

---

## 🌐 URLs Finais

**Frontend**:
- Coolify IP: `http://82.25.77.179:PORT`
- Domínio custom: `https://app.seudominio.com` (configurar)

**WhatsApp Bot**:
- Roda em background no Coolify (não precisa de URL pública)
- API interna (se necessário): `http://82.25.77.179:3001`

---

## 🔒 Configurar Supabase para Produção

### 1. URLs Autorizadas
No Supabase Dashboard → Authentication → URL Configuration:

```
Site URL: https://app.seudominio.com (ou IP do Coolify)

Redirect URLs:
- https://app.seudominio.com/**
- http://82.25.77.179:PORT/**
- http://localhost:3000/** (dev)
```

### 2. CORS Policy
Adicione domínio de produção ao CORS do Supabase.

---

## 🆘 Troubleshooting

### Build Falha
```bash
# Teste local primeiro
npm run build
npm run preview
```

### Bot Não Conecta
- Verifique logs no Coolify
- Certifique que volume persistente está configurado
- Re-escanear QR Code

### Variáveis de Ambiente
- Variáveis devem começar com `VITE_` (frontend)
- Service role key para bot (backend)
- Sem espaços ou quebras de linha

### SSL/Domínio
- Coolify usa Let's Encrypt automático
- Aguarde 2-5 minutos após configurar domínio

---

## 📊 Monitoramento

No Coolify Dashboard:
- **Logs em tempo real** de ambos os serviços
- **Métricas de CPU/RAM**
- **Status uptime**
- **Build history**

---

## 🎉 Resultado Final

✅ Hub.App rodando 24/7 no Coolify
✅ WhatsApp Bot online e respondendo
✅ Deploy automático via Git Push
✅ SSL configurado
✅ Domínio customizado (opcional)
✅ Tudo centralizado em um painel

---

## 📱 Próximos Passos Após Deploy

1. **Testes de Produção**
   - Criar conta real
   - Testar todos os módulos
   - Enviar mensagens WhatsApp

2. **Configurar Domínio**
   - Comprar/configurar domínio
   - Apontar DNS para Coolify IP
   - Coolify configura SSL automático

3. **Monitoramento**
   - Configurar alertas (se disponível)
   - Verificar logs diariamente
   - Monitorar performance

4. **Backup**
   - Coolify tem backup automático
   - Confirmar configuração

---

**🚀 Hub.App Production Ready no Coolify!**

*Criado em: 30/09/2025*
*Última atualização: 30/09/2025*