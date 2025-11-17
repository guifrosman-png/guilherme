# 🚀 Funcionalidades Futuras - Tipos de Pergunta Avançados

Este documento descreve tipos de pergunta que foram **removidos temporariamente** da versão atual, mas estão planejados para implementação em versões futuras.

---

## 📋 Tipos Removidos (v1.0)

### 1. 🔘 Desligamento (Toggle/Switch)

**Descrição:**
Campo de alternância (on/off) estilo interruptor, similar aos switches do iOS/Android.

**Casos de Uso:**
- "Aceita receber notificações por email?"
- "Permite uso de imagem para divulgação?"
- "Autoriza contato futuro para pesquisas?"

**Exemplo Visual:**
```
[ Desativado ]  ◯────────  [ Ativado ]
                    ↓
[ Desativado ]  ────────◯  [ Ativado ]
```

**Implementação Técnica:**
- **Tipo:** `desligamento`
- **Valor retornado:** `boolean` (true/false)
- **Componente UI:** Toggle switch com transição suave
- **Cores:** Cinza (desativado) → Verde (ativado)

**Código de Referência (TypeScript):**
```typescript
{pergunta.tipo === 'desligamento' && (
  <div className="flex items-center justify-center gap-4">
    <span>Desativado</span>
    <button
      onClick={() => setValor(!valor)}
      className={`relative w-16 h-8 rounded-full ${valor ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${valor ? 'translate-x-9' : 'translate-x-1'}`} />
    </button>
    <span>Ativado</span>
  </div>
)}
```

**Por que foi removido:**
Problemas de compatibilidade com o sistema de validação e salvamento de dados no QuizContainer. Necessita refatoração do estado de resposta para suportar boolean nativamente.

**Prioridade:** Média

---

### 2. 📊 Grade de Múltipla Escolha

**Descrição:**
Tabela interativa onde o usuário seleciona **uma opção por linha** (radio button). Ideal para avaliações e pesquisas de satisfação.

**Casos de Uso:**
- Avaliação de atendimento (Ruim, Bom, Ótimo)
- Frequência de atividades (Nunca, Raramente, Frequentemente)
- Nível de satisfação com múltiplos aspectos

**Exemplo Visual:**
```
                    | Ruim | Bom | Ótimo |
────────────────────┼──────┼─────┼───────┤
Atendimento         |  ◉   |  ○  |   ○   |
Qualidade           |  ○   |  ◉  |   ○   |
Preço               |  ○   |  ○  |   ◉   |
```

**Implementação Técnica:**
- **Tipo:** `gradeMutipla`
- **Configuração necessária:**
  ```typescript
  configGrade?: {
    linhas: string[];    // Ex: ['Atendimento', 'Qualidade', 'Preço']
    colunas: string[];   // Ex: ['Ruim', 'Bom', 'Ótimo']
  }
  ```
- **Valor retornado:** `Record<string, string>`
  ```json
  {
    "Atendimento": "Ruim",
    "Qualidade": "Bom",
    "Preço": "Ótimo"
  }
  ```

**Funcionalidade no Template Editor:**
- Interface para adicionar/remover linhas dinamicamente
- Interface para adicionar/remover colunas dinamicamente
- Botões "Adicionar linha" e "Adicionar coluna" estilo Google Forms

**Código de Referência (TypeScript):**
```typescript
{pergunta.tipo === 'gradeMutipla' && (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        <th></th>
        {pergunta.configGrade.colunas.map(coluna => (
          <th key={coluna}>{coluna}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {pergunta.configGrade.linhas.map(linha => (
        <tr key={linha}>
          <td>{linha}</td>
          {pergunta.configGrade.colunas.map(coluna => {
            const isSelected = valor[linha] === coluna;
            return (
              <td key={coluna}>
                <button
                  onClick={() => setValor({...valor, [linha]: coluna})}
                  className={`w-5 h-5 rounded-full ${isSelected ? 'bg-blue-500' : 'border-2 border-gray-300'}`}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
)}
```

**Por que foi removido:**
Interface de grade não estava salvando corretamente os dados. A estrutura `Record<string, string>` conflitava com o sistema atual que espera `string | boolean | string[]`. Necessita revisão da tipagem global de respostas.

**Prioridade:** Alta (muito solicitado por usuários de estúdios)

---

### 3. ☑️ Grade de Checkbox

**Descrição:**
Similar à Grade de Múltipla Escolha, mas permite **múltiplas seleções por linha** (checkboxes). Perfeito para coletar informações sobre múltiplos sintomas, alergias, etc.

**Casos de Uso:**
- Sintomas experimentados (Dor, Coceira, Vermelhidão) em diferentes regiões
- Alergias a múltiplos materiais
- Horários disponíveis para agendamento

**Exemplo Visual:**
```
                        | Segunda | Terça | Quarta |
────────────────────────┼─────────┼───────┼────────┤
Manhã (8h-12h)          |    ☑    |   ☐   |   ☑    |
Tarde (13h-17h)         |    ☐    |   ☑   |   ☐    |
Noite (18h-21h)         |    ☑    |   ☑   |   ☑    |
```

**Implementação Técnica:**
- **Tipo:** `gradeCheckbox`
- **Configuração:** Idêntica a `gradeMutipla`
- **Valor retornado:** `Record<string, string[]>`
  ```json
  {
    "Manhã (8h-12h)": ["Segunda", "Quarta"],
    "Tarde (13h-17h)": ["Terça"],
    "Noite (18h-21h)": ["Segunda", "Terça", "Quarta"]
  }
  ```

**Código de Referência (TypeScript):**
```typescript
{pergunta.tipo === 'gradeCheckbox' && (
  <table className="w-full border-collapse">
    {/* Similar ao gradeMutipla, mas com múltiplas seleções por linha */}
    {pergunta.configGrade.linhas.map(linha => {
      const linhaValores = valor[linha] || [];
      return (
        <tr key={linha}>
          <td>{linha}</td>
          {pergunta.configGrade.colunas.map(coluna => {
            const isChecked = linhaValores.includes(coluna);
            return (
              <td key={coluna}>
                <button
                  onClick={() => {
                    const novosValores = isChecked
                      ? linhaValores.filter(v => v !== coluna)
                      : [...linhaValores, coluna];
                    setValor({...valor, [linha]: novosValores});
                  }}
                  className={`w-5 h-5 rounded ${isChecked ? 'bg-blue-500' : 'border-2 border-gray-300'}`}
                />
              </td>
            );
          })}
        </tr>
      );
    })}
  </table>
)}
```

**Por que foi removido:**
Mesma razão da Grade de Múltipla Escolha. Além disso, a estrutura `Record<string, string[]>` é ainda mais complexa e requer validação especial para garantir que cada linha tenha pelo menos uma seleção (se obrigatória).

**Prioridade:** Alta (especialmente útil para anamneses médicas e estéticas)

---

## 🛠️ Roadmap de Implementação

### Fase 1: Refatoração de Tipos (Estimativa: 2 semanas)
- [ ] Atualizar interface `RespostaCliente` para suportar tipos complexos
  ```typescript
  resposta: string | boolean | string[] | Record<string, string> | Record<string, string[]>;
  ```
- [ ] Criar validadores específicos para cada tipo de resposta
- [ ] Testar compatibilidade com localStorage e geração de PDF

### Fase 2: Implementação de Desligamento (Estimativa: 3 dias)
- [ ] Adicionar tipo `desligamento` de volta ao enum
- [ ] Implementar componente Toggle em QuizContainer (modo ficha e quiz)
- [ ] Adicionar item no dropdown do TemplateEditor
- [ ] Testar salvamento e recuperação de dados

### Fase 3: Implementação de Grades (Estimativa: 1 semana)
- [ ] Adicionar tipos `gradeMutipla` e `gradeCheckbox` de volta
- [ ] Criar interface de configuração no TemplateEditor
  - Inputs dinâmicos para linhas/colunas
  - Botões "Adicionar linha/coluna"
  - Preview da grade
- [ ] Implementar renderização no QuizContainer
- [ ] Criar validação para grades obrigatórias
- [ ] Adicionar suporte no gerador de PDF

### Fase 4: Testes e Refinamento (Estimativa: 3 dias)
- [ ] Testar todos os cenários de uso
- [ ] Corrigir bugs de layout em mobile
- [ ] Otimizar performance com muitas linhas/colunas
- [ ] Documentar uso no manual do usuário

---

## 📝 Notas Técnicas

### Problemas Identificados na v1.0

1. **Tipagem Rígida:**
   O sistema atual usa union types muito restritivos. Solução: expandir para aceitar objetos genéricos.

2. **Salvamento no localStorage:**
   Objetos complexos (Record) não eram serializados corretamente. Solução: usar JSON.stringify/parse explicitamente.

3. **Validação:**
   Não havia validação para estruturas de grade. Solução: criar validators específicos.

4. **Geração de PDF:**
   Grades não eram renderizadas no PDF. Solução: criar template de tabela para jsPDF.

5. **Layout Mobile:**
   Tabelas largas causavam overflow horizontal. Solução: tornar grades scrolláveis horizontalmente.

### Lições Aprendidas

- Sempre testar com dados reais antes de fazer commit
- Criar validação específica para tipos complexos
- Pensar em mobile-first para layouts de tabela
- Documentar estrutura de dados esperada claramente

---

## 🎯 Critérios de Aceitação para Reintrodução

Antes de reintroduzir esses tipos, garantir que:

✅ Todos os testes unitários passem
✅ Salvamento no localStorage funcione 100%
✅ Geração de PDF inclua as grades corretamente
✅ Layout seja responsivo (mobile + desktop)
✅ Validação funcione para campos obrigatórios
✅ Dados sejam exportáveis para CSV/Excel
✅ Performance seja aceitável com grades grandes (20+ linhas)

---

## 💡 Alternativas Temporárias

Enquanto esses tipos não estão disponíveis, usuários podem usar:

- **Desligamento:** Usar "Sim ou Não"
- **Grades:** Criar múltiplas perguntas de "Múltipla escolha" separadas
- **Grade Checkbox:** Criar múltiplas perguntas de "Caixas de seleção" separadas

---

**Última atualização:** 2025-01-11
**Versão do documento:** 1.0
**Responsável:** Equipe de Desenvolvimento Anamnese Pro
