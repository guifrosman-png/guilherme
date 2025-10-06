# 🌐 GitHub - Guia Rápido Visual

Como colocar seu código no GitHub em 5 minutos.

---

## 🎯 Por que GitHub?

```
Seu Computador          GitHub (Nuvem)
     💻         →→→        ☁️

Código local     →    Backup online
Só você vê       →    Acessa de qualquer lugar
Pode perder      →    Seguro na nuvem
```

---

## ⚡ Setup Rápido (5 minutos)

### 1. Criar Conta (1 min)

🔗 https://github.com/signup

```
Username: ________
Email: ________
Password: ________
```

### 2. Criar Repositório (1 min)

🔗 https://github.com/new

```
Nome: anamnese-pro
Descrição: Sistema de anamnese digital

🔘 Private (recomendado)

Criar ✅
```

### 3. Copiar URL

GitHub vai mostrar algo como:

```
https://github.com/SEU-USUARIO/anamnese-pro.git
```

**COPIE ISSO!**

### 4. Criar Token (2 min)

🔗 https://github.com/settings/tokens

```
Generate new token → Classic

Note: Token para projetos
Expiration: No expiration

Marcar: ✅ repo

Generate token ✅
```

**COPIE O TOKEN** (começa com `ghp_`):
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Conectar e Enviar (1 min)

Abra o terminal:

```bash
# Ir para a pasta do projeto
cd "c:\Users\guifr\Documents\Projetos\Hub.App\anamnese-pro"

# Conectar (cole a URL que copiou)
git remote add origin https://github.com/SEU-USUARIO/anamnese-pro.git

# Enviar
git push -u origin master

# Vai pedir:
# Username: seu-usuario
# Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx (cole o token)
```

---

## ✅ Pronto! Ver Online

🔗 `https://github.com/SEU-USUARIO/anamnese-pro`

Você verá:
- 📁 Todos os arquivos
- 📝 Commits
- 🏷️ Tags (v1.0)
- 📊 Gráficos

---

## 🔄 Usar no Dia a Dia

### Quando Fizer Mudanças

```bash
# 1. Fazer commit local
git add .
git commit -m "Mensagem"

# 2. Enviar para GitHub
git push origin master
```

### Ver Online

Atualize a página: `https://github.com/SEU-USUARIO/anamnese-pro`

**DONE!** ✨

---

## 📱 Ver no Celular

### Baixar App:

- 🍎 iOS: https://apps.apple.com/app/github/id1477376905
- 🤖 Android: https://play.google.com/store/apps/details?id=com.github.android

### Usar:

1. Login
2. Ver repositórios
3. Navegar código
4. Ver mudanças

---

## 🆘 Problemas?

### "Authentication failed"

```bash
# Você usou a senha normal
# Use o TOKEN que gerou!
# Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### "Repository not found"

```bash
# Ver se está conectado
git remote -v

# Se nada aparecer, conectar de novo
git remote add origin https://github.com/SEU-USUARIO/anamnese-pro.git
```

### "Permission denied"

```bash
# Token expirado ou sem permissões
# Gerar novo token em:
# https://github.com/settings/tokens
```

---

## 🎯 Comandos Essenciais

```bash
# ENVIAR para GitHub
git push origin master

# PUXAR do GitHub
git pull origin master

# VER conexão
git remote -v

# ENVIAR tags
git push --tags
```

---

## 🔗 Links Importantes

- **Criar conta**: https://github.com/signup
- **Novo repositório**: https://github.com/new
- **Tokens**: https://github.com/settings/tokens
- **Seus repos**: https://github.com/SEU-USUARIO?tab=repositories

---

## 📚 Documentação Completa

Para mais detalhes: `docs/github-setup.md`

---

**Seu código agora está seguro na nuvem!** ☁️✨
