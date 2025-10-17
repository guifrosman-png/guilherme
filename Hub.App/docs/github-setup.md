# Como Conectar com GitHub

Guia completo para colocar seu projeto no GitHub e ver online.

---

## 🎯 O que é GitHub?

GitHub é como um "Google Drive para código":
- ☁️ Backup automático na nuvem
- 🌐 Acesso de qualquer lugar
- 👥 Compartilhar com outras pessoas
- 📱 Ver código pelo celular/tablet
- 🔒 Privado ou público

---

## 📋 Passo a Passo Completo

### 1️⃣ Criar Conta no GitHub (se não tiver)

1. Acesse: https://github.com/signup
2. Preencha:
   - Username: escolha um nome de usuário
   - Email: seu email
   - Password: senha forte
3. Verifique o email
4. Pronto! ✅

---

### 2️⃣ Criar Repositório no GitHub

#### Pelo Site (Mais fácil):

1. **Login** no GitHub: https://github.com/login

2. **Clicar em "New Repository"** (botão verde) ou acessar:
   https://github.com/new

3. **Preencher**:
   ```
   Repository name: anamnese-pro
   Description: Sistema de anamnese digital para tatuadores e estéticas

   ⚪ Public (qualquer um pode ver)
   🔘 Private (só você vê) ← RECOMENDADO

   ☐ Add a README file (DEIXE DESMARCADO)
   ☐ Add .gitignore (DEIXE DESMARCADO)
   ☐ Choose a license (DEIXE DESMARCADO)
   ```

4. **Clicar "Create repository"**

5. **Copiar o link** que aparecer (algo como):
   ```
   https://github.com/seu-usuario/anamnese-pro.git
   ```

---

### 3️⃣ Conectar seu Projeto Local com GitHub

Abra o terminal e rode esses comandos:

```bash
# 1. Navegar até a pasta do projeto
cd "c:\Users\guifr\Documents\Projetos\Hub.App\anamnese-pro"

# 2. Conectar com GitHub (troque SEU-USUARIO pelo seu username)
git remote add origin https://github.com/SEU-USUARIO/anamnese-pro.git

# 3. Enviar código para GitHub
git push -u origin master
```

**Se pedir usuário e senha**:
- Username: seu username do GitHub
- Password: use um **Personal Access Token** (veja próximo passo)

---

### 4️⃣ Criar Token de Acesso (GitHub não aceita mais senha)

#### Criar Personal Access Token:

1. Acesse: https://github.com/settings/tokens

2. Clicar **"Generate new token"** → **"Classic"**

3. Preencher:
   ```
   Note: Token para Anamnese Pro
   Expiration: No expiration (ou escolha um prazo)

   Marque:
   ✅ repo (todos os sub-itens)
   ```

4. Clicar **"Generate token"**

5. **COPIAR O TOKEN** (guarde em local seguro!)
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

6. **Usar como senha** quando o Git pedir:
   ```
   Username: seu-usuario
   Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

### 5️⃣ Enviar Código para GitHub

```bash
# Enviar VERSÃO 1.0 para GitHub
git push -u origin master

# Enviar tags também
git push --tags
```

✅ **Pronto! Seu código está no GitHub!**

---

## 🌐 Como Ver no GitHub

### Pelo Navegador:

```
https://github.com/SEU-USUARIO/anamnese-pro
```

Você verá:
- 📁 Todos os arquivos
- 📝 Commits (histórico)
- 🏷️ Tags (versões)
- 🌿 Branches
- 📊 Estatísticas

---

## 🔄 Workflow Diário

### Quando Fizer Mudanças:

```bash
# 1. Criar branch local
git checkout -b feature/nova-funcionalidade

# 2. Fazer mudanças, commitar
git add .
git commit -m "Adicionei nova funcionalidade"

# 3. Enviar branch para GitHub
git push origin feature/nova-funcionalidade

# 4. Se funcionou, fazer merge e enviar master
git checkout master
git merge feature/nova-funcionalidade
git push origin master
```

### Ver Mudanças Online:

Acesse: `https://github.com/SEU-USUARIO/anamnese-pro`

Você verá tudo atualizado! ✨

---

## 📱 GitHub Mobile

### Instalar App:

- **iOS**: https://apps.apple.com/app/github/id1477376905
- **Android**: https://play.google.com/store/apps/details?id=com.github.android

### Ver Código no Celular:

1. Abrir app GitHub
2. Login
3. Ver repositórios
4. Navegar pelo código
5. Ver commits e mudanças

---

## 🔒 Privacidade

### Repositório Privado (Recomendado):

```
✅ Só você vê
✅ Pode convidar colaboradores específicos
✅ Código não aparece em buscas
```

### Repositório Público:

```
⚠️ Qualquer um pode ver
⚠️ Aparece em buscas do Google
✅ Bom para portfólio
✅ Open source
```

**Recomendação**: Use **PRIVATE** para projetos comerciais.

---

## 👥 Adicionar Colaboradores (se privado)

1. Ir em: `https://github.com/SEU-USUARIO/anamnese-pro/settings/access`
2. Clicar **"Add people"**
3. Digitar username ou email
4. Escolher permissões:
   - **Read**: Só visualizar
   - **Write**: Pode editar
   - **Admin**: Controle total

---

## 🆘 Resolver Problemas Comuns

### "Authentication failed"

**Problema**: Senha não funciona mais

**Solução**: Use Personal Access Token (passo 4)

---

### "Repository not found"

**Problema**: URL errada ou repositório não existe

**Solução**:
1. Verificar URL: `git remote -v`
2. Corrigir: `git remote set-url origin URL-CORRETA`

---

### "Failed to push"

**Problema**: Alguém mudou algo no GitHub antes de você

**Solução**:
```bash
# Puxar mudanças primeiro
git pull origin master

# Depois enviar
git push origin master
```

---

### "Nothing to commit"

**Problema**: Não há mudanças para enviar

**Solução**: Isso é normal! Só faça push quando houver commits novos.

---

## 📊 Ver Estatísticas

### No GitHub:

1. **Commits**: Quantos e quando
2. **Contributors**: Quem contribuiu
3. **Code frequency**: Linhas adicionadas/removidas
4. **Pulse**: Atividade recente
5. **Network**: Gráfico de branches

Acesse: `https://github.com/SEU-USUARIO/anamnese-pro/graphs`

---

## 🔍 Buscar no Código (pelo GitHub)

### Busca Global:

1. Ir no repositório
2. Apertar `/` (abre busca)
3. Digitar o que procura
4. Ver resultados

### Busca Avançada:

```
# Buscar por tipo de arquivo
filename:App.tsx

# Buscar em um caminho
path:src/components

# Buscar por linguagem
language:TypeScript
```

---

## 📥 Clonar em Outro Computador

### Baixar o Projeto:

```bash
# Clonar repositório
git clone https://github.com/SEU-USUARIO/anamnese-pro.git

# Entrar na pasta
cd anamnese-pro

# Instalar dependências
npm install

# Rodar
npm run dev
```

✅ Pronto! Mesmo projeto em outro PC.

---

## 🌿 Ver Branches no GitHub

### Pelo Site:

1. Ir em: `https://github.com/SEU-USUARIO/anamnese-pro`
2. Clicar em **"master"** (botão dropdown)
3. Ver todas as branches
4. Clicar em uma para visualizar

### Ver Pull Requests:

Quando fizer push de uma branch:
```bash
git push origin feature/nova-funcionalidade
```

GitHub mostra botão **"Compare & pull request"** automaticamente!

---

## 🏷️ Releases (Versões Oficiais)

### Criar Release no GitHub:

1. Ir em: `https://github.com/SEU-USUARIO/anamnese-pro/releases`
2. Clicar **"Create a new release"**
3. Escolher tag: `v1.0`
4. Título: `VERSÃO 1.0 - Anamnese Pro Básico`
5. Descrição:
   ```markdown
   ## 🎉 Primeira Versão Estável

   ### Funcionalidades
   - ✅ Anamnese presencial
   - ✅ Anamnese remota
   - ✅ Geração de PDF
   - ✅ Limite de 100 clientes

   ### Download
   Use `git clone` ou baixe o ZIP
   ```
6. Clicar **"Publish release"**

---

## 📋 README no GitHub

Crie um arquivo `README.md` na raiz do projeto:

```markdown
# Anamnese Pro

Sistema de anamnese digital para tatuadores e profissionais de estética.

## 🚀 Funcionalidades

- ✅ Anamnese presencial e remota
- ✅ Geração de PDF profissional
- ✅ Editor de template customizável
- ✅ Limite de 100 clientes (plano básico)

## 💻 Tecnologias

- React 18 + TypeScript
- Vite + SWC
- Tailwind CSS
- jsPDF

## 🛠️ Instalação

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📄 Licença

Propriedade de Hub.App - Todos os direitos reservados.
```

---

## 🎯 Resumo dos Comandos

```bash
# PRIMEIRA VEZ (Setup)
git remote add origin https://github.com/SEU-USUARIO/anamnese-pro.git
git push -u origin master
git push --tags

# DIA A DIA
git push origin master              # Enviar mudanças
git pull origin master              # Puxar mudanças
git push origin nome-da-branch      # Enviar branch
git push --tags                     # Enviar tags

# VER STATUS
git remote -v                       # Ver conexão GitHub
git log --oneline                   # Ver commits locais
```

---

## 🔗 Links Úteis

- **Criar conta**: https://github.com/signup
- **Seus repositórios**: https://github.com/SEU-USUARIO?tab=repositories
- **Configurações**: https://github.com/settings
- **Tokens**: https://github.com/settings/tokens
- **Documentação**: https://docs.github.com

---

## 📚 Próximos Passos

1. ✅ Criar conta no GitHub
2. ✅ Criar repositório privado `anamnese-pro`
3. ✅ Gerar Personal Access Token
4. ✅ Conectar projeto local
5. ✅ Fazer primeiro push
6. ✅ Ver no navegador!

---

**Agora seu código está seguro na nuvem!** ☁️✨
