# 🚀 Git - Guia Rápido de Referência

Comandos essenciais para trabalhar com segurança.

---

## ✅ VERSÃO 1.0 SALVA!

Sua primeira versão já está salva! 🎉

```
Commit: 0b664ff
Tag: v1.0
Mensagem: "VERSÃO 1.0 - Anamnese Pro Básico funcionando"
```

---

## 🔄 Fluxo para Fazer Mudanças com Segurança

### 1️⃣ ANTES de mudar qualquer coisa

```bash
# Ver em qual branch está
git branch --show-current
# Deve estar: master ou main

# Ver se está tudo salvo
git status
# Deve dizer: "nothing to commit, working tree clean"
```

### 2️⃣ Criar branch para testar mudanças

```bash
# Criar branch de teste (troque "nome-da-feature" pelo que vai fazer)
git checkout -b feature/busca-notificacoes

# Agora você está em uma branch separada!
# Pode fazer QUALQUER mudança sem medo
```

### 3️⃣ Fazer as mudanças

Edite os arquivos normalmente. A cada progresso:

```bash
# Ver o que mudou
git status

# Salvar progresso
git add .
git commit -m "Descrição do que fez"
```

### 4️⃣ Testar

```bash
# Rodar o servidor
npm run dev

# Abrir navegador e testar
# Tudo funcionando? ✅
```

### 5️⃣ Se DEU CERTO ✅

```bash
# 1. Voltar para branch principal
git checkout master

# 2. Juntar mudanças
git merge feature/busca-notificacoes

# 3. Criar nova versão
git tag v1.1

# 4. Deletar branch de teste
git branch -d feature/busca-notificacoes
```

### 6️⃣ Se DEU ERRADO ❌

```bash
# Simplesmente voltar para master
git checkout master

# A versão funcionando está intacta! ✅
# Deletar branch problemática
git branch -D feature/busca-notificacoes
```

---

## 🆘 Comandos de Emergência

### "Fiz mudanças mas não salvei ainda, quero desfazer TUDO"

```bash
git checkout .
```

⚠️ **ATENÇÃO**: Isso apaga TODAS as mudanças não salvas!

### "Salvei (commit) mas quero voltar atrás"

```bash
# Ver histórico
git log --oneline

# Voltar para commit específico
git reset --hard abc1234
```

### "Quero ver como estava antes"

```bash
# Ver todas as versões
git tag

# Voltar para uma versão
git checkout v1.0

# Criar branch a partir dela
git checkout -b recuperar-v1.0 v1.0
```

---

## 📊 Comandos Úteis

### Ver status atual

```bash
# O que mudou?
git status

# Em qual branch estou?
git branch --show-current

# Ver histórico
git log --oneline
```

### Ver diferenças

```bash
# Ver o que mudou (ainda não salvo)
git diff

# Ver mudanças em arquivo específico
git diff src/App.tsx
```

### Gerenciar branches

```bash
# Listar todas
git branch

# Criar nova
git checkout -b nome-da-branch

# Mudar de branch
git checkout nome-da-branch

# Deletar branch
git branch -d nome-da-branch
git branch -D nome-da-branch  # Forçar deletar
```

---

## 💡 Dicas Importantes

1. **Sempre crie branch para testar**: Nunca mude direto na master
2. **Commit frequente**: A cada pequeno progresso
3. **Mensagens claras**: Descreva o que fez
4. **Teste antes de merge**: Sempre teste na branch primeiro
5. **Não tenha medo**: Git guarda tudo!

---

## 🎯 Exemplo Prático

```bash
# 1. Estou na master, quero adicionar filtros
git checkout -b feature/adicionar-filtros

# 2. Editar código, criar FilterPanel.tsx...
git add .
git commit -m "Criado componente FilterPanel"

# 3. Continuar editando, integrar no App.tsx...
git add .
git commit -m "Integrado FilterPanel no App"

# 4. Testar
npm run dev
# ✅ Funcionou!

# 5. Juntar com master
git checkout master
git merge feature/adicionar-filtros
git tag v1.1

# 6. Limpar
git branch -d feature/adicionar-filtros
```

---

## 📝 Resumo de Comandos Mais Usados

```bash
# VER
git status              # Status atual
git branch             # Branches
git log --oneline      # Histórico

# SALVAR
git add .                    # Adicionar mudanças
git commit -m "Mensagem"     # Salvar versão

# BRANCHES
git checkout -b feature/nome    # Criar e mudar
git checkout master             # Voltar master
git merge feature/nome          # Juntar branch

# EMERGÊNCIA
git checkout .                  # Desfazer tudo (não salvo)
git reset --hard abc1234        # Voltar para commit
git checkout v1.0               # Voltar para versão
```

---

## 📚 Documentação Completa

Para mais detalhes, veja: `docs/git-workflow.md`

---

**Agora você pode fazer mudanças sem medo!** 🛡️✨
