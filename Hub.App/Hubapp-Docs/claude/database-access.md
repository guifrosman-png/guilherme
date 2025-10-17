# Database Access Guide

## Supabase Database Access

**⚠️ IMPORTANTE: Claude Code TEM acesso total ao banco de dados via CLI e API REST.**

### Project Information
- **Project ID**: `hnkcgtkrngldrtnsmzps`
- **Project URL**: `https://hnkcgtkrngldrtnsmzps.supabase.co`
- **Region**: South America (São Paulo)
- **Status**: Projeto LINKADO e funcionando

### Database Credentials
Credenciais estão armazenadas no `.env.local`:
- **Database User**: `postgres.hnkcgtkrngldrtnsmzps`
- **Database Password**: Referenciada no arquivo de ambiente
- **Connection String**: Disponível via variáveis de ambiente

### Como Claude Code Acessa o Banco

#### 1. CLI do Supabase (Principal)
```bash
# Verificar status
supabase status

# Aplicar migrations no remoto
supabase db push --linked

# Criar nova migration
supabase migration new nome_da_migration

# Reparar histórico se necessário
supabase migration repair --status applied MIGRATION_ID
```

#### 2. API REST do Supabase (Queries/Inserts)
```bash
# Testar tabela (usar variáveis de ambiente para keys)
curl 'https://hnkcgtkrngldrtnsmzps.supabase.co/rest/v1/TABELA?limit=1' \
  -H 'apikey: ${SUPABASE_SERVICE_ROLE_KEY}' \
  -H 'Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}'

# Inserir dados
curl -X POST 'https://hnkcgtkrngldrtnsmzps.supabase.co/rest/v1/TABELA' \
  -H 'apikey: ${SUPABASE_SERVICE_ROLE_KEY}' \
  -H 'Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}' \
  -H 'Content-Type: application/json' \
  -d '{"campo": "valor"}'
```

#### 3. Docker Local (Desenvolvimento)
```bash
# Executar SQL no container local
docker exec supabase_db_hnkcgtkrngldrtnsmzps psql -U postgres -d postgres -c "SELECT * FROM tabela LIMIT 1;"
```

### Fluxo de Trabalho do Claude Code

1. **Recebe solicitação** do usuário para modificar banco
2. **Cria migration** se necessário (`supabase migration new`)
3. **Escreve SQL** no arquivo de migration
4. **Testa localmente** (Docker container)
5. **Aplica no remoto** (`supabase db push --linked`)
6. **Verifica resultado** via API REST
7. **Documenta mudanças**

### Tipos de Modificações que Claude Code Faz
- ✅ **CREATE TABLE**: Criar novas tabelas
- ✅ **ALTER TABLE**: Modificar estrutura existente
- ✅ **CREATE INDEX**: Criar índices de performance
- ✅ **INSERT DATA**: Inserir dados via API REST
- ✅ **CREATE POLICY**: Políticas RLS
- ✅ **CREATE FUNCTION**: Stored procedures
- ✅ **DROP/MODIFY**: Remover ou alterar estruturas

### Regras para Agentes IA
- ✅ SEMPRE usar migrations para mudanças de schema
- ✅ SEMPRE testar no Docker local primeiro
- ✅ SEMPRE documentar mudanças
- ✅ SEMPRE verificar RLS policies para multi-tenancy
- ✅ SEMPRE usar Service Role Key para operações privilegiadas
- ❌ NUNCA fazer ALTER TABLE direto sem migration
- ❌ NUNCA ignorar isolamento de tenant_id

### Confirmação de Acesso
- ✅ CLI instalado e projeto linkado
- ✅ Credenciais configuradas no .env.local
- ✅ Service key válida até 2035
- ✅ API REST respondendo
- ✅ Tabelas AI criadas com sucesso
- ✅ Docker local funcionando