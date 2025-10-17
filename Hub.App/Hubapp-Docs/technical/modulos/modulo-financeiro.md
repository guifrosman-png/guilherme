# Módulo Financeiro - Hub.App

Este documento especifica a arquitetura, funcionalidades e implementação do módulo financeiro para a plataforma Hub.App, seguindo os padrões arquiteturais da aplicação.

## Visão Geral

O módulo financeiro é uma solução completa de gestão financeira para micro e pequenas empresas, integrada ao ecossistema Hub.App com suporte multi-tenant e controle de permissões.

### Funcionalidades Principais

- **Fluxo de Caixa**: Controle de entradas e saídas
- **Contas a Pagar e Receber**: Gestão de obrigações e direitos
- **Relatórios Financeiros**: DRE, Balanço Patrimonial, Fluxo de Caixa
- **Categorização**: Organização por categorias e subcategorias
- **Reconciliação Bancária**: Importação e conciliação de extratos
- **Dashboard Financeiro**: Indicadores e métricas em tempo real

## Arquitetura do Módulo

### 1. Estrutura de Dados

#### Tabelas Principais

```sql
-- Categorias financeiras
CREATE TABLE categorias_financeiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria_pai_id UUID REFERENCES categorias_financeiras(id),
  cor VARCHAR(7) DEFAULT '#6B7280',
  icone_lucide VARCHAR(50) DEFAULT 'DollarSign',
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contas bancárias
CREATE TABLE contas_bancarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('conta_corrente', 'poupanca', 'cartao', 'dinheiro')),
  banco VARCHAR(100),
  agencia VARCHAR(10),
  conta VARCHAR(20),
  saldo_inicial DECIMAL(15,2) DEFAULT 0.00,
  saldo_atual DECIMAL(15,2) DEFAULT 0.00,
  ativa BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transações financeiras
CREATE TABLE transacoes_financeiras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('receita', 'despesa', 'transferencia')),
  valor DECIMAL(15,2) NOT NULL,
  descricao TEXT NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado')),
  categoria_id UUID REFERENCES categorias_financeiras(id),
  conta_origem_id UUID REFERENCES contas_bancarias(id),
  conta_destino_id UUID REFERENCES contas_bancarias(id),
  observacoes TEXT,
  anexos JSONB DEFAULT '[]',
  recorrente BOOLEAN DEFAULT false,
  frequencia_recorrencia VARCHAR(20) CHECK (frequencia_recorrencia IN ('mensal', 'bimestral', 'trimestral', 'semestral', 'anual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orçamentos
CREATE TABLE orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  periodo_inicio DATE NOT NULL,
  periodo_fim DATE NOT NULL,
  valor_total DECIMAL(15,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'finalizado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Itens do orçamento
CREATE TABLE orcamento_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id UUID NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
  categoria_id UUID NOT NULL REFERENCES categorias_financeiras(id),
  valor_planejado DECIMAL(15,2) NOT NULL,
  valor_realizado DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### RLS (Row Level Security)

```sql
-- Políticas de segurança para isolamento multi-tenant
ALTER TABLE categorias_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orcamento_itens ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para todos os recursos
CREATE POLICY tenant_isolation_categorias ON categorias_financeiras
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY tenant_isolation_contas ON contas_bancarias
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY tenant_isolation_transacoes ON transacoes_financeiras
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY tenant_isolation_orcamentos ON orcamentos
  FOR ALL USING (tenant_id = get_current_tenant_id());

CREATE POLICY tenant_isolation_orcamento_itens ON orcamento_itens
  FOR ALL USING (orcamento_id IN (
    SELECT id FROM orcamentos WHERE tenant_id = get_current_tenant_id()
  ));
```

### 2. Estrutura de Componentes

```
src/modules/financeiro/
├── components/
│   ├── Dashboard/
│   │   ├── FinancialDashboard.tsx
│   │   ├── CashFlowChart.tsx
│   │   ├── ExpenseChart.tsx
│   │   └── FinancialMetrics.tsx
│   ├── Transactions/
│   │   ├── TransactionList.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionFilters.tsx
│   │   └── TransactionDetails.tsx
│   ├── Accounts/
│   │   ├── BankAccountList.tsx
│   │   ├── BankAccountForm.tsx
│   │   └── AccountBalance.tsx
│   ├── Categories/
│   │   ├── CategoryManager.tsx
│   │   ├── CategoryForm.tsx
│   │   └── CategoryTree.tsx
│   ├── Reports/
│   │   ├── IncomeStatement.tsx
│   │   ├── BalanceSheet.tsx
│   │   ├── CashFlowReport.tsx
│   │   └── ReportFilters.tsx
│   └── Budget/
│       ├── BudgetManager.tsx
│       ├── BudgetForm.tsx
│       └── BudgetProgress.tsx
├── hooks/
│   ├── useFinancialData.tsx
│   ├── useTransactions.tsx
│   ├── useBankAccounts.tsx
│   ├── useCategories.tsx
│   └── useReports.tsx
├── types/
│   └── financial.ts
└── utils/
    ├── financialCalculations.ts
    ├── formatters.ts
    └── validators.ts
```

### 3. Hooks Customizados

#### useFinancialData.tsx

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../hooks/useAuth';

export interface FinancialSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldoAtual: number;
  contasAPagar: number;
  contasAReceber: number;
}

export function useFinancialData() {
  const { tenant } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = async () => {
    if (!tenant) return;
    
    try {
      setIsLoading(true);
      
      // Carregar resumo financeiro
      const { data: transacoes, error } = await supabase
        .from('transacoes_financeiras')
        .select('tipo, valor, status')
        .eq('tenant_id', tenant.id);
      
      if (error) throw error;
      
      const summary = transacoes.reduce((acc, t) => {
        if (t.status === 'pago') {
          if (t.tipo === 'receita') acc.totalReceitas += t.valor;
          if (t.tipo === 'despesa') acc.totalDespesas += t.valor;
        } else {
          if (t.tipo === 'receita') acc.contasAReceber += t.valor;
          if (t.tipo === 'despesa') acc.contasAPagar += t.valor;
        }
        return acc;
      }, {
        totalReceitas: 0,
        totalDespesas: 0,
        contasAReceber: 0,
        contasAPagar: 0,
        saldoAtual: 0
      });
      
      summary.saldoAtual = summary.totalReceitas - summary.totalDespesas;
      setSummary(summary);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, [tenant]);

  return { summary, isLoading, error, refresh: loadSummary };
}
```

### 4. Sistema de Permissões

#### Permissões do Módulo

```typescript
export const FINANCIAL_PERMISSIONS = {
  // Visualização
  'financial.view': 'Visualizar módulo financeiro',
  'financial.dashboard': 'Acessar dashboard financeiro',
  
  // Transações
  'financial.transactions.view': 'Visualizar transações',
  'financial.transactions.create': 'Criar transações',
  'financial.transactions.edit': 'Editar transações',
  'financial.transactions.delete': 'Excluir transações',
  
  // Contas bancárias
  'financial.accounts.view': 'Visualizar contas bancárias',
  'financial.accounts.create': 'Criar contas bancárias',
  'financial.accounts.edit': 'Editar contas bancárias',
  'financial.accounts.delete': 'Excluir contas bancárias',
  
  // Categorias
  'financial.categories.view': 'Visualizar categorias',
  'financial.categories.create': 'Criar categorias',
  'financial.categories.edit': 'Editar categorias',
  'financial.categories.delete': 'Excluir categorias',
  
  // Relatórios
  'financial.reports.view': 'Visualizar relatórios',
  'financial.reports.export': 'Exportar relatórios',
  
  // Orçamentos
  'financial.budget.view': 'Visualizar orçamentos',
  'financial.budget.create': 'Criar orçamentos',
  'financial.budget.edit': 'Editar orçamentos',
  'financial.budget.delete': 'Excluir orçamentos'
} as const;
```

### 5. Manifest do Módulo

```json
{
  "id": "financial-module",
  "name": "Módulo Financeiro",
  "version": "1.0.0",
  "description": "Gestão financeira completa para sua empresa",
  "icon": "DollarSign",
  "category": "financeiro",
  "author": "Hub.App Team",
  "license": "proprietary",
  "pricing": {
    "type": "subscription",
    "price": 29.90,
    "currency": "BRL",
    "period": "monthly"
  },
  "dependencies": {
    "react": "^18.0.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "^0.300.0"
  },
  "permissions": [
    "financial.view",
    "financial.dashboard",
    "financial.transactions.view",
    "financial.transactions.create",
    "financial.transactions.edit",
    "financial.transactions.delete",
    "financial.accounts.view",
    "financial.accounts.create",
    "financial.accounts.edit",
    "financial.accounts.delete",
    "financial.categories.view",
    "financial.categories.create",
    "financial.categories.edit",
    "financial.categories.delete",
    "financial.reports.view",
    "financial.reports.export",
    "financial.budget.view",
    "financial.budget.create",
    "financial.budget.edit",
    "financial.budget.delete"
  ],
  "routes": [
    {
      "path": "/financeiro",
      "component": "FinancialDashboard",
      "permission": "financial.view"
    },
    {
      "path": "/financeiro/transacoes",
      "component": "TransactionList",
      "permission": "financial.transactions.view"
    },
    {
      "path": "/financeiro/contas",
      "component": "BankAccountList",
      "permission": "financial.accounts.view"
    },
    {
      "path": "/financeiro/categorias",
      "component": "CategoryManager",
      "permission": "financial.categories.view"
    },
    {
      "path": "/financeiro/relatorios",
      "component": "Reports",
      "permission": "financial.reports.view"
    },
    {
      "path": "/financeiro/orcamentos",
      "component": "BudgetManager",
      "permission": "financial.budget.view"
    }
  ],
  "settings": {
    "moeda_padrao": "BRL",
    "formato_data": "DD/MM/YYYY",
    "casas_decimais": 2,
    "categoria_padrao_receita": null,
    "categoria_padrao_despesa": null,
    "conta_padrao": null,
    "backup_automatico": true
  }
}
```

## Padrões de Design

### 1. Responsividade

O módulo segue o padrão mobile-first do Hub.App:

- **Mobile (< 768px)**: Layout em cards empilhados
- **Desktop (≥ 768px)**: Layout em grid com sidebar

### 2. Animações

Utilizar `framer-motion` para animações suaves:

```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};
```

### 3. Cores e Ícones

- **Receitas**: Verde (`text-green-600`, `bg-green-500`)
- **Despesas**: Vermelho (`text-red-600`, `bg-red-500`)
- **Transferências**: Azul (`text-blue-600`, `bg-blue-500`)
- **Ícones**: Usar biblioteca Lucide React

### 4. Formulários

Seguir o padrão de validação do Hub.App:

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const transactionSchema = z.object({
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  data_vencimento: z.date(),
  categoria_id: z.string().uuid('Categoria é obrigatória'),
  tipo: z.enum(['receita', 'despesa'])
});
```

## Integração com Hub.App

### 1. Registro no App Store

```sql
INSERT INTO modulos (
  nome,
  slug,
  descricao,
  categoria,
  icone_lucide,
  is_free,
  preco_mensal,
  desenvolvedor,
  status,
  manifest
) VALUES (
  'Módulo Financeiro',
  'financial-module',
  'Gestão financeira completa para sua empresa',
  'financeiro',
  'DollarSign',
  false,
  29.90,
  'Hub.App Team',
  'active',
  '{"icon":"DollarSign","version":"1.0.0","permissions":["financial.view"]}'
);
```

### 2. Configuração de Permissões

```sql
-- Inserir permissões do módulo financeiro
INSERT INTO permissions (nome, descricao, modulo) VALUES
  ('financial.view', 'Visualizar módulo financeiro', 'financial'),
  ('financial.dashboard', 'Acessar dashboard financeiro', 'financial'),
  ('financial.transactions.view', 'Visualizar transações', 'financial'),
  ('financial.transactions.create', 'Criar transações', 'financial');
```

## Considerações de Performance

1. **Lazy Loading**: Carregar componentes apenas quando necessário
2. **Virtualization**: Para listas grandes de transações
3. **Caching**: Cache de relatórios com `React Query` ou similar
4. **Pagination**: Implementar paginação para listagens
5. **Indexes**: Criar índices no banco para queries frequentes

## Segurança

1. **RLS**: Todas as tabelas devem ter Row Level Security
2. **Validação**: Dupla validação (frontend e backend)
3. **Sanitização**: Sanitizar inputs antes de salvar
4. **Logs**: Registrar todas as operações financeiras
5. **Backup**: Sistema de backup automático

## Próximos Passos

1. Implementar componentes base
2. Criar hooks customizados
3. Desenvolver telas principais
4. Implementar sistema de relatórios
5. Testes unitários e de integração
6. Documentação de usuário

---

Este documento serve como guia para desenvolvimento do módulo financeiro, seguindo os padrões estabelecidos no Hub.App e garantindo consistência arquitetural com o sistema existente.