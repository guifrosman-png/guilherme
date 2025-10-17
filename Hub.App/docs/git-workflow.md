# Git Workflow - Como Trabalhar com Segurança

Guia completo para fazer mudanças no código sem medo de perder o trabalho.

---

## 🎯 Objetivo

Você quer fazer mudanças no código mas com a segurança de poder voltar atrás se algo der errado. O Git resolve isso perfeitamente!

---

## 📚 Conceitos Básicos

### O que é Git?

Git é como um "save game" do seu código. Cada vez que você salva (commit), você cria um ponto de restauração.

### Estrutura

```
main/master (branch principal)
├── VERSÃO 1.0 ✅ (commit estável)
├── VERSÃO 1.1 ✅ (commit estável)
│
└── feature/busca-notificacoes (branch de teste)
    ├── tentativa 1 ❌ (deu errado, pode deletar)
    ├── tentativa 2 ❌ (deu errado, pode deletar)
    └── tentativa 3 ✅ (funcionou! agora junta com a main)
```

---

## 🚀 Fluxo de Trabalho Recomendado

### Passo 1: Salvar a Versão Atual (Criar commit)

Sempre que o código estiver funcionando, salve:

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar todos os arquivos
git add .

# 3. Salvar com mensagem descritiva
git commit -m "VERSÃO 1.0 - Anamnese Pro Básico funcionando"
```

**Resultado**: Você criou um ponto de restauração! ✅

---

### Passo 2: Criar uma Branch para Testar Mudanças

Antes de fazer qualquer mudança, crie uma "ramificação" (branch):

```bash
# Criar e mudar para nova branch
git checkout -b feature/adicionar-busca

# Agora você está em uma branch separada!
# Pode fazer qualquer mudança sem afetar a versão principal
```

**Estrutura agora**:
```
main (versão funcionando) ✅
└── feature/adicionar-busca (sua área de testes) 🧪
```

---

### Passo 3: Fazer as Mudanças

Faça suas alterações normalmente no código. A cada progresso, salve:

```bash
# Salvar progresso
git add .
git commit -m "Adicionado componente SearchModal"

# Continuar trabalhando...
git add .
git commit -m "Integrado SearchModal no App.tsx"
```

**Vantagem**: Você pode voltar para qualquer um desses commits!

---

### Passo 4A: Deu Certo! ✅

Se tudo funcionou, junte com a branch principal:

```bash
# 1. Voltar para a branch principal
git checkout main

# 2. Juntar as mudanças (merge)
git merge feature/adicionar-busca

# 3. Deletar a branch de teste (opcional)
git branch -d feature/adicionar-busca

# 4. Criar nova versão
git tag v1.1
```

**Resultado**: Sua versão principal agora tem as novas funcionalidades! 🎉

---

### Passo 4B: Deu Errado! ❌

Se algo deu errado, simplesmente descarte tudo:

```bash
# Voltar para a branch principal
git checkout main

# A branch principal está intacta! Nada mudou!
# Pode deletar a branch com problemas
git branch -D feature/adicionar-busca
```

**Resultado**: Você voltou para a versão funcionando, nada foi perdido! 🛡️

---

## 📋 Comandos Essenciais

### Ver Status

```bash
# Ver em qual branch está e o que mudou
git status
```

### Ver Histórico

```bash
# Ver todos os commits
git log --oneline --graph --all

# Formato bonito
git log --oneline --graph --decorate --all
```

### Ver Branches

```bash
# Listar todas as branches
git branch

# Ver branch atual
git branch --show-current
```

### Criar Branch

```bash
# Criar nova branch
git branch nome-da-branch

# Criar e já mudar para ela
git checkout -b nome-da-branch
```

### Mudar de Branch

```bash
# Mudar para outra branch
git checkout nome-da-branch

# Voltar para main
git checkout main
```

### Salvar Mudanças (Commit)

```bash
# Adicionar todos os arquivos
git add .

# Salvar com mensagem
git commit -m "Descrição do que foi feito"
```

### Desfazer Mudanças

```bash
# Desfazer mudanças NÃO commitadas (CUIDADO: perde tudo!)
git checkout .

# Voltar para um commit específico
git checkout abc1234

# Criar branch a partir de um commit antigo
git checkout -b nova-branch abc1234
```

### Ver Diferenças

```bash
# Ver o que mudou (ainda não commitado)
git diff

# Ver o que mudou em um arquivo específico
git diff src/App.tsx

# Comparar duas branches
git diff main feature/busca
```

---

## 🎯 Fluxo Prático - Exemplo Real

### Cenário: Adicionar Sistema de Busca

#### 1. Situação Inicial

```bash
# Você está na main, versão 1.0 funcionando
git status
# On branch main
```

#### 2. Salvar Versão Atual

```bash
# Criar commit da versão funcionando
git add .
git commit -m "VERSÃO 1.0 - Sistema básico funcionando"
git tag v1.0
```

#### 3. Criar Branch de Teste

```bash
# Criar branch para nova funcionalidade
git checkout -b feature/sistema-busca
```

#### 4. Fazer Mudanças

```bash
# Criar componente SearchModal
# ... editar código ...

git add .
git commit -m "Criado SearchModal.tsx"

# Integrar no App
# ... editar App.tsx ...

git add .
git commit -m "Integrado SearchModal no App.tsx"
```

#### 5. Testar

```bash
# Abrir navegador, testar a busca
# Tudo funcionando? ✅
```

#### 6. Juntar com Main

```bash
# Voltar para main
git checkout main

# Juntar mudanças
git merge feature/sistema-busca

# Criar nova versão
git tag v1.1
git commit -m "VERSÃO 1.1 - Sistema de busca adicionado"
```

#### 7. Limpar

```bash
# Deletar branch de teste
git branch -d feature/sistema-busca
```

---

## ❌ E se der errado?

### Cenário: Deu erro na integração

```bash
# Você está em feature/sistema-busca
# Fez mudanças, mas quebrou tudo

# Opção 1: Descartar TUDO e voltar para main
git checkout main
# Pronto! Voltou para versão funcionando

# Deletar branch problemática
git branch -D feature/sistema-busca

# Opção 2: Voltar para commit anterior NA MESMA BRANCH
git log --oneline
# abc1234 Integrado SearchModal (ERRO aqui)
# def5678 Criado SearchModal.tsx (estava bom)

git reset --hard def5678
# Voltou para quando estava funcionando!
```

---

## 🔄 Fluxo Contínuo de Desenvolvimento

### Rotina Diária

```bash
# 1. MANHÃ: Ver onde está
git status
git branch

# 2. Criar branch para nova feature
git checkout -b feature/notificacoes

# 3. TRABALHAR: Fazer mudanças, commitar frequentemente
git add .
git commit -m "Adicionado NotificationPanel"

# ... mais trabalho ...

git add .
git commit -m "Integrado sistema de notificações"

# 4. TESTAR: Tudo funcionando?

# 5A. SE FUNCIONOU: Juntar com main
git checkout main
git merge feature/notificacoes
git tag v1.2

# 5B. SE DEU ERRO: Descartar
git checkout main
git branch -D feature/notificacoes

# 6. FIM DO DIA: Commitar main
git add .
git commit -m "Fim do dia - Sistema estável"
```

---

## 📊 Visualizar Histórico

### Ver Todas as Versões

```bash
# Log simples
git log --oneline

# Output:
# abc1234 VERSÃO 1.2 - Notificações
# def5678 VERSÃO 1.1 - Busca
# ghi9012 VERSÃO 1.0 - Sistema básico
```

### Ver Branches Visuais

```bash
git log --oneline --graph --all --decorate

# Output:
#   * abc1234 (HEAD -> main, tag: v1.2) VERSÃO 1.2
#   |\
#   | * def5678 (feature/notificacoes) Integrado notificações
#   | * ghi9012 Adicionado NotificationPanel
#   |/
#   * jkl3456 (tag: v1.1) VERSÃO 1.1
```

---

## 🏷️ Tags (Versões)

Tags são como "marcadores" nas versões importantes.

```bash
# Criar tag na versão atual
git tag v1.0

# Criar tag com mensagem
git tag -a v1.0 -m "Primeira versão estável"

# Listar todas as tags
git tag

# Ver detalhes de uma tag
git show v1.0

# Voltar para uma tag específica
git checkout v1.0

# Criar branch a partir de uma tag
git checkout -b hotfix/v1.0 v1.0
```

---

## 🆘 Comandos de Emergência

### "Socorro! Mudei algo e quebrou tudo!"

```bash
# Se NÃO commitou ainda
git checkout .  # Desfaz TUDO (cuidado!)

# Se já commitou
git log --oneline  # Ver commits
git reset --hard abc1234  # Voltar para commit específico
```

### "Quero ver o código como estava ontem"

```bash
# Ver commit de ontem
git log --oneline --since="yesterday"

# Voltar para ele
git checkout abc1234

# Criar branch a partir dele
git checkout -b recuperar-ontem abc1234
```

### "Deletei arquivo sem querer!"

```bash
# Se não commitou
git checkout -- arquivo.tsx

# Se já commitou
git log -- arquivo.tsx  # Ver quando existia
git checkout abc1234 -- arquivo.tsx  # Recuperar de commit
```

---

## ✅ Checklist de Segurança

Antes de fazer mudanças importantes:

- [ ] Estou na branch main?
  ```bash
  git branch --show-current
  ```

- [ ] Main está salva (commitada)?
  ```bash
  git status  # Deve estar "clean"
  ```

- [ ] Criei uma branch de teste?
  ```bash
  git checkout -b feature/minha-mudanca
  ```

- [ ] Testei tudo antes de fazer merge?
  ```bash
  npm run dev  # Verificar se funciona
  ```

- [ ] Tenho certeza que quero juntar com main?
  ```bash
  git checkout main
  git merge feature/minha-mudanca
  ```

---

## 📝 Mensagens de Commit (Boas Práticas)

### Formato Recomendado

```bash
# Tipo: descrição curta

git commit -m "feat: Adicionar sistema de busca"
git commit -m "fix: Corrigir erro no SearchModal"
git commit -m "style: Ajustar cores do header"
git commit -m "refactor: Reorganizar componentes"
git commit -m "docs: Atualizar README"
```

### Tipos Comuns

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `style`: Mudanças visuais (CSS, UI)
- `refactor`: Refatoração de código
- `docs`: Documentação
- `test`: Testes
- `chore`: Tarefas gerais (build, config)

### Mensagens para Versões

```bash
git commit -m "VERSÃO 1.0 - Sistema básico de anamnese funcionando"
git commit -m "VERSÃO 1.1 - Adicionado busca e notificações"
git commit -m "VERSÃO 1.2 - Sistema de filtros implementado"
```

---

## 🎓 Resumo - Comandos mais Usados

```bash
# VER STATUS
git status              # O que mudou?
git branch             # Em qual branch estou?
git log --oneline      # Histórico de commits

# SALVAR VERSÃO
git add .                              # Adicionar mudanças
git commit -m "Descrição"              # Salvar versão
git tag v1.0                           # Marcar versão importante

# CRIAR/MUDAR BRANCH
git checkout -b feature/nome           # Criar nova branch
git checkout main                      # Voltar para main
git branch -d feature/nome             # Deletar branch

# JUNTAR MUDANÇAS
git checkout main                      # Ir para main
git merge feature/nome                 # Juntar branch

# VOLTAR ATRÁS
git checkout .                         # Desfazer mudanças não salvas
git reset --hard abc1234               # Voltar para commit
git checkout main                      # Abandonar branch e voltar

# COMPARAR
git diff                               # Ver mudanças não salvas
git diff main feature/nome             # Comparar branches
```

---

## 🚀 Próximos Passos

1. **Agora**: Criar primeiro commit (versão 1.0)
2. **Sempre**: Trabalhar em branches separadas
3. **Testar**: Antes de fazer merge
4. **Versionar**: Usar tags para versões importantes
5. **Commitar**: Frequentemente (cada pequeno progresso)

---

## 💡 Dicas Finais

1. **Commit frequente**: Melhor ter muitos commits pequenos que poucos grandes
2. **Mensagens claras**: Você vai agradecer no futuro
3. **Testar antes de merge**: Sempre teste na branch antes de juntar
4. **Não tenha medo**: Git guarda tudo, é muito difícil perder código de verdade
5. **Branch para tudo**: Cada nova feature = nova branch

---

**Com Git, você pode experimentar sem medo!** 🛡️✨
