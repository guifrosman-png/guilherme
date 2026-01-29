# Views Financeiras do ERP

Documentação das views do banco de dados MySQL do ERP (e4_show) para uso no dashboard financeiro.

## Conexão

```javascript
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: 'show.e4sistemas.com.br',
  user: 'bi_00002',
  password: ':Bi107574#',
  database: 'e4_show',
  charset: 'utf8mb4'
});
```

> **Nota:** Usar `BINARY` nas comparações de strings para evitar problemas de collation.

---

## Views Principais

### 1. `vw_painel_financeiro` (Principal)

View principal para contas a pagar e receber.

#### Estrutura

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | varchar(33) | ID único do título |
| `id_lojas` | varchar(11) | ID da loja/unidade |
| `id_contas` | int(11) | ID da conta bancária |
| `movimento` | varchar(7) | **`'entrada'`** = A Receber, **`'saida'`** = A Pagar |
| `tipo` | varchar(13) | `'titulo'`, `'bordero'` |
| `status` | char(1) | **`L`**=Lançado, **`E`**=Efetivado, **`P`**=Pendente, **`C`**=Cancelado |
| `valor` | decimal(18,2) | Valor do título |
| `valor_efetivado` | decimal(18,2) | Valor efetivamente pago/recebido |
| `data_emissao` | datetime | Data de emissão do título |
| `data_vencimento` | date | Data de vencimento |
| `data_efetivacao` | datetime | Data do pagamento/recebimento efetivo |
| `data_conciliacao` | datetime | Data da conciliação bancária |
| `num_documento` | text | Número do documento |
| `num_nota_fiscal` | varchar(50) | Número da NF |
| `serie_nota_fiscal` | varchar(10) | Série da NF |
| `descricao` | text | Descrição do título |
| `emitente` | varchar(100) | Nome do fornecedor/cliente |
| `documento` | varchar(18) | CNPJ/CPF do emitente |
| `conta_financeira` | varchar(50) | Nome da conta bancária |
| `centro_custo` | varchar(100) | Centro de custo |
| `unidade` | varchar(100) | Nome da unidade/loja |
| `vl_multa` | decimal(18,2) | Valor de multa |
| `vl_juros` | decimal(18,2) | Valor de juros |
| `vl_desconto` | decimal(18,2) | Valor de desconto |
| `vl_abatimento` | decimal(18,2) | Valor de abatimento |
| `vl_taxa` | decimal(18,2) | Valor de taxa |
| `num_parcela` | int(11) | Número da parcela |
| `qtd_parcelas` | int(11) | Quantidade total de parcelas |
| `id_plano_contas_contas` | varchar(11) | ID do plano de contas |
| `conta_contabil` | varchar(128) | Conta contábil |
| `id_centro_custo` | int(11) | ID do centro de custo |
| `id_ramo_atividades` | int(11) | ID do ramo de atividade |

#### Valores de Status

| Status | Descrição | Quantidade* |
|--------|-----------|-------------|
| `L` | Lançado (em aberto) | 192.859 |
| `E` | Efetivado (pago/recebido) | 4.717 |
| `C` | Cancelado | 406 |
| `P` | Pendente | 8 |

*Valores aproximados do banco

#### Valores de Movimento

| Movimento | Tipo | Descrição |
|-----------|------|-----------|
| `entrada` | titulo | Contas a Receber |
| `saida` | titulo | Contas a Pagar |
| `saida` | bordero | Borderô de pagamentos |

#### Queries de Exemplo

```sql
-- Contas a Pagar em Aberto (próximos 30 dias)
SELECT
  DATE_FORMAT(data_vencimento, '%Y-%m-%d') as vencimento,
  COUNT(*) as qtd,
  FORMAT(SUM(valor), 2) as total
FROM vw_painel_financeiro
WHERE BINARY movimento = 'saida'
  AND BINARY status IN ('L', 'P')
  AND data_vencimento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
GROUP BY data_vencimento
ORDER BY data_vencimento;

-- Contas a Receber em Aberto
SELECT
  DATE_FORMAT(data_vencimento, '%Y-%m-%d') as vencimento,
  COUNT(*) as qtd,
  FORMAT(SUM(valor), 2) as total
FROM vw_painel_financeiro
WHERE BINARY movimento = 'entrada'
  AND BINARY status = 'L'
  AND data_vencimento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
GROUP BY data_vencimento
ORDER BY data_vencimento;

-- Resumo Mensal por Movimento e Status
SELECT
  movimento,
  status,
  COUNT(*) as qtd_titulos,
  FORMAT(SUM(valor), 2) as valor_total
FROM vw_painel_financeiro
WHERE data_vencimento BETWEEN '2025-12-01' AND '2025-12-31'
GROUP BY movimento, status
ORDER BY movimento DESC, status;

-- Top Fornecedores (Contas a Pagar)
SELECT
  emitente,
  COUNT(*) as qtd_titulos,
  FORMAT(SUM(valor), 2) as total
FROM vw_painel_financeiro
WHERE BINARY movimento = 'saida'
  AND BINARY status IN ('L', 'P')
GROUP BY emitente
ORDER BY SUM(valor) DESC
LIMIT 10;
```

---

### 2. `bi_saldo_contas` (Saldos Bancários)

Saldos atuais das contas bancárias.

#### Estrutura

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | ID do registro |
| `id_lojas` | int | ID da loja |
| `finaliz` | int | ID da finalizadora |
| `data_vencimento` | datetime | Data do saldo |
| `valor` | decimal | Saldo da conta |
| `TipoMov` | varchar | Tipo (sempre 'Saldos') |
| `descricao` | varchar | Nome da conta bancária |
| `descricao1` | varchar | Nome alternativo |

#### Dados de Exemplo (Janeiro 2026)

| Conta | Saldo |
|-------|-------|
| ITAU | -R$ 3.100.992,03 |
| SICOOB | -R$ 249.028,43 |
| BANCO DO BRASIL | -R$ 145.333,98 |
| PAGBANK | R$ 100,00 |

#### Query

```sql
SELECT
  descricao as conta,
  FORMAT(valor, 2) as saldo
FROM bi_saldo_contas
ORDER BY valor;
```

---

### 3. `bi_saldos_fluxo` (Fluxo de Caixa)

Movimentação diária para fluxo de caixa.

#### Estrutura

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `TipoMov` | int | Tipo de movimento |
| `id_lojas` | int | ID da loja |
| `nome` | int | Nome |
| `udata` | int | Data |
| `vl_total` | int | Valor total |

---

### 4. `vw_contas_pagar` (Contas a Pagar Simplificado)

View simplificada de contas a pagar.

#### Estrutura

| Campo | Descrição |
|-------|-----------|
| `id` | ID do título |
| `id_lojas` | ID da loja |
| `num_documento` | Número do documento |
| `data_vencimento` | Data de vencimento |
| `valor` | Valor |
| `emitente` | Nome do fornecedor |
| `documento` | CNPJ/CPF |

---

### 5. Views de DRE (Demonstrativo de Resultado)

| View | Descrição |
|------|-----------|
| `dre_result` | Resultado do DRE consolidado |
| `dre_totais` | Totais por grupo |
| `dre_cpagar` | Contas a pagar no DRE |
| `dre_creceber` | Contas a receber no DRE |
| `dre_vlanc` | Valores lançados |
| `dre_consulta_t` | Consulta de DRE |

#### Estrutura `dre_result`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `grupo` | varchar(34) | Nome do grupo |
| `gp_id` | int | ID do grupo |
| `id_lojas` | int(10) | ID da loja |
| `ano` | int(4) | Ano |
| `mes` | int(2) | Mês |
| `valor` | decimal(65,8) | Valor |

---

### 6. Outras Views Financeiras

| View | Descrição |
|------|-----------|
| `bi_pag_aberto` | Pagamentos em aberto |
| `bi_rec_aberto` | Recebimentos em aberto |
| `bi_rec_previsao_0` | Previsão de recebimentos |
| `bi_rec_tesouraria` | Recebimentos da tesouraria |
| `vw_painel_tesouraria` | Painel de tesouraria |
| `vw_painel_tesouraria_extrato` | Extrato da tesouraria |

---

## Métricas Sugeridas para Dashboard

### Cards de KPI

1. **Total a Pagar (30 dias)**
   - Query: Soma de `valor` onde `movimento='saida'` e `status IN ('L','P')`

2. **Total a Receber (30 dias)**
   - Query: Soma de `valor` onde `movimento='entrada'` e `status='L'`

3. **Saldo Total Bancário**
   - Query: Soma de `valor` de `bi_saldo_contas`

4. **Títulos Vencidos**
   - Query: Count onde `data_vencimento < CURDATE()` e `status='L'`

5. **Fluxo de Caixa Previsto**
   - Query: A Receber - A Pagar nos próximos 30 dias

### Gráficos

1. **Fluxo de Caixa por Dia** (linha)
   - Entradas vs Saídas agrupadas por data

2. **Composição de Contas a Pagar** (pizza)
   - Por fornecedor ou centro de custo

3. **Evolução Mensal** (barras)
   - Comparativo de meses

4. **Aging de Recebíveis** (barras horizontais)
   - Vencidos, A vencer 7 dias, 15 dias, 30 dias, +30 dias

---

## Notas Técnicas

### Collation

O banco usa diferentes collations. Para evitar erros, usar `BINARY` nas comparações:

```sql
-- Correto
WHERE BINARY movimento = 'entrada'

-- Incorreto (pode dar erro de collation)
WHERE movimento = 'entrada'
```

### Performance

- A view `vw_painel_financeiro` tem ~198.000 registros
- Sempre usar filtros de data para limitar resultados
- Considerar criar índices ou views materializadas para dashboards em tempo real

### Pacote Node.js

```bash
npm install mysql2
```

---

*Documentação gerada em Janeiro 2026*
