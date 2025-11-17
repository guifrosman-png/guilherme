# 📊 Mapeamento Completo: Tipos de Pergunta → Gráficos

Este documento detalha como cada tipo de pergunta do sistema gera automaticamente seu gráfico correspondente.

---

## 🎯 Visão Geral

O **Anamnese Pro** possui **10 tipos de pergunta** diferentes. Cada tipo, quando respondido pelos clientes, gera automaticamente um gráfico específico no Dashboard.

---

## 📋 OS 10 TIPOS E SEUS GRÁFICOS

### 1️⃣ **TEXTO** (Resposta Curta)
- **Tipo de Gráfico:** 📊 Barras Top 5
- **Como funciona:** Agrupa respostas similares e mostra as 5 mais frequentes
- **Processador:** `processarRespostasTexto()`
- **Exemplo:** "Qual local você quer tatuar?" → Mostra: Braço (15), Perna (8), Costas (5)...

**Visual no Dashboard:**
```
Braço     ████████████████ 15
Perna     ████████ 8
Costas    █████ 5
Ombro     ███ 3
Peito     ██ 2
```

---

### 2️⃣ **PARÁGRAFO** (Texto Longo)
- **Tipo de Gráfico:** 📊 Barras Top 5
- **Como funciona:** Mesma lógica de "Texto", mas para respostas longas
- **Processador:** `processarRespostasTexto()`
- **Exemplo:** "Descreva sua rotina de cuidados com a pele" → Top 5 descrições

---

### 3️⃣ **SIM OU NÃO**
- **Tipo de Gráfico:** 🍰 Pizza
- **Como funciona:** Divide em 2 fatias (Sim vs Não) com percentuais
- **Processador:** `processarRespostasSimNao()`
- **Exemplo:** "Você tem alergias?" → Sim: 65.5% | Não: 34.5%

**Visual no Dashboard:**
```
    ┌────────┐
    │ Sim    │ 65.5%
    │ 65.5%  │
    ├────────┤
    │ Não    │ 34.5%
    └────────┘
```

---

### 4️⃣ **MÚLTIPLA ESCOLHA** (Uma Resposta)
- **Tipo de Gráfico:** 🍩 Donut (Rosquinha)
- **Como funciona:** Mostra distribuição de cada opção escolhida
- **Processador:** `processarRespostasMultipla()`
- **Exemplo:** "Como conheceu nosso estúdio?"
  - Instagram: 45.2%
  - Google: 30.1%
  - Indicação: 20.5%
  - Outro: 4.2%

**Visual no Dashboard:**
```
    ╭───────╮
    │  45%  │ Instagram
    │  30%  │ Google
    │  20%  │ Indicação
    │   4%  │ Outro
    ╰───────╯
```

---

### 5️⃣ **CAIXAS DE SELEÇÃO** (Múltiplas Respostas)
- **Tipo de Gráfico:** 📊 Barras
- **Como funciona:** Conta quantas vezes cada opção foi marcada
- **Processador:** `processarRespostasCaixasSelecao()`
- **Exemplo:** "Quais sintomas você sente?" (pode marcar vários)
  - Dor: 12 pessoas
  - Coceira: 8 pessoas
  - Vermelhidão: 5 pessoas

**Visual no Dashboard:**
```
Dor          ████████████ 12
Coceira      ████████ 8
Vermelhidão  █████ 5
```

---

### 6️⃣ **ESCALA LINEAR** (Números)
- **Tipo de Gráfico:** 📊 Barras
- **Como funciona:** Mostra distribuição de valores escolhidos
- **Processador:** `processarRespostasEscalaLinear()`
- **Exemplo:** "De 1 a 10, qual seu nível de dor?"
  - 7: 15 pessoas
  - 8: 10 pessoas
  - 9: 5 pessoas
  - 10: 3 pessoas

**Visual no Dashboard:**
```
1  ░░░░░░░░░░ 0
2  ░░░░░░░░░░ 0
3  ██ 2
...
7  ███████████████ 15
8  ██████████ 10
9  █████ 5
10 ███ 3
```

---

### 7️⃣ **CLASSIFICAÇÃO** (Estrelas)
- **Tipo de Gráfico:** 📊 Barras
- **Como funciona:** Conta quantas pessoas deram cada número de estrelas
- **Processador:** `processarRespostasClassificacao()`
- **Exemplo:** "Avalie nosso atendimento"
  - 5⭐: 20 pessoas
  - 4⭐: 8 pessoas
  - 3⭐: 2 pessoas

**Visual no Dashboard:**
```
1⭐ ░░░░░░░░░░ 0
2⭐ ░░░░░░░░░░ 0
3⭐ ██ 2
4⭐ ████████ 8
5⭐ ████████████████████ 20
```

---

### 8️⃣ **DATA** (Seletor de Data)
- **Tipo de Gráfico:** 📈 Linha do Tempo
- **Como funciona:** Agrupa datas por mês e mostra evolução temporal
- **Processador:** `processarRespostasData()`
- **Exemplo:** "Quando você fez sua última tatuagem?"
  - Jan/25: 5
  - Fev/25: 8
  - Mar/25: 12

**Visual no Dashboard:**
```
    12 ┤        ╭──●
    10 ┤       ╱
     8 ┤     ●
     6 ┤    ╱
     4 ┤   ╱
     2 ┤  ●
     0 └───────────────
       Jan Fev Mar
```

---

### 9️⃣ **HORA** (Seletor de Hora)
- **Tipo de Gráfico:** 📊 Barras por Período
- **Como funciona:** Agrupa horários em 4 períodos do dia
- **Processador:** `processarRespostasHora()`
- **Períodos:**
  - 🌃 Madrugada (0h-6h)
  - 🌅 Manhã (6h-12h)
  - ☀️ Tarde (12h-18h)
  - 🌙 Noite (18h-0h)

**Visual no Dashboard:**
```
🌃 Madrugada  ██ 2
🌅 Manhã      ████████████ 12
☀️ Tarde       ████████ 8
🌙 Noite      ██████ 6
```

---

### 🔟 **ARQUIVO** (Upload de Arquivo)
- **Tipo de Gráfico:** 🖼️ Galeria
- **Como funciona:** Exibe grid de imagens/arquivos enviados
- **Processador:** `processarRespostasArquivo()`
- **Exemplo:** "Envie foto da região a ser tatuada"

**Visual no Dashboard:**
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 📷  │ │ 📷  │ │ 📷  │ │ 📷  │
│img 1│ │img 2│ │img 3│ │img 4│
└─────┘ └─────┘ └─────┘ └─────┘
```

---

## 🔧 Arquitetura do Sistema

### Fluxo de Criação Automática de Gráfico:

```
1. Profissional CRIA PERGUNTA no Template Editor
   ↓
2. Sistema DETECTA O TIPO da pergunta (ex: "simNao")
   ↓
3. Sistema CONSULTA O MAPA (graficos.ts)
   "simNao" → tipo de gráfico "pizza"
   ↓
4. Sistema CRIA CONFIG DO GRÁFICO automaticamente
   {
     id: "grafico-pergunta-123",
     categoria: "customizado",
     perguntaId: "pergunta-123",
     tipoPergunta: "simNao",
     tipoGrafico: "pizza",
     titulo: "Você tem alergias?",
     visivel: true
   }
   ↓
5. SALVA em localStorage (graficosConfig)
   ↓
6. Quando cliente RESPONDE a pergunta
   Resposta salva em: anamnese.dadosCompletos.respostasCustomizadas["pergunta-123"] = true
   ↓
7. Dashboard EXTRAI AS RESPOSTAS de todas anamneses
   [true, false, true, true, false] → 3 Sim, 2 Não
   ↓
8. Dashboard PROCESSA OS DADOS
   processarRespostasSimNao([true, false, true, true, false])
   → [{ nome: "Sim", valor: 3, percentual: "60.0" }, { nome: "Não", valor: 2, percentual: "40.0" }]
   ↓
9. Dashboard RENDERIZA O GRÁFICO
   GraficoCustomizado.tsx detecta config.tipoGrafico === "pizza"
   → Renderiza PieChart do Recharts
```

---

## 📁 Arquivos Importantes

### 1. **Definição de Tipos**
- `src/types/templates.ts` - Define os 10 tipos de pergunta
- `src/types/graficos.ts` - Define tipos de gráfico e mapeamento

### 2. **Processamento de Dados**
- `src/utils/graficoHelpers.ts` - 10 funções de processamento (uma por tipo)

### 3. **Renderização**
- `src/components/dashboard/GraficoCustomizado.tsx` - Renderiza os 6 tipos de gráfico
- `src/components/dashboard/Dashboard.tsx` - Orquestra todos os gráficos

### 4. **Criação de Perguntas**
- `src/components/templates/TemplateEditor.tsx` - Interface para criar perguntas
- `src/components/templates/TemplatesList.tsx` - Lista de templates

---

## 🎨 Tipos de Gráfico Visual (6 tipos)

Apesar de 10 tipos de pergunta, existem apenas **6 tipos visuais de gráfico**:

| Visual | Nome | Usado por |
|--------|------|-----------|
| 📊 | **barras** | caixasSelecao, escalaLinear, classificacao, hora |
| 📊 | **barrasTop5** | texto, paragrafo |
| 📈 | **linha** | data |
| 🍰 | **pizza** | simNao |
| 🍩 | **donut** | multiplaEscolha |
| 🖼️ | **galeria** | arquivo |

---

## ✅ Checklist de Validação

Para garantir que um gráfico está funcionando corretamente:

- [ ] **Tipo de pergunta está no mapeamento** (graficos.ts)
- [ ] **Função processadora existe** (graficoHelpers.ts)
- [ ] **Renderizador visual existe** (GraficoCustomizado.tsx)
- [ ] **Pergunta salva no template**
- [ ] **Cliente responde a pergunta**
- [ ] **Resposta salva em `respostasCustomizadas`**
- [ ] **Dashboard extrai a resposta corretamente**
- [ ] **Dados processados corretamente**
- [ ] **Gráfico renderizado sem erros**

---

## 🐛 Debugging

Se um gráfico não aparecer:

1. **Abra o Console do navegador** (F12)
2. **Procure por logs:** `🔍 Extraindo respostas para gráfico: "..."`
3. **Verifique:**
   - ✅ Anamneses analisadas > 0
   - ✅ Respostas encontradas > 0
   - ✅ Taxa de sucesso > 0%
4. **Se taxa = 0%:**
   - Verifique se `perguntaId` do gráfico corresponde ao ID da pergunta
   - Verifique se `respostasCustomizadas` contém a chave correta
   - Veja estratégia de fallback usada

---

**Última atualização:** 2025-01-13
**Versão do sistema:** 2.7
**Total de tipos:** 10 tipos de pergunta → 6 tipos de gráfico
