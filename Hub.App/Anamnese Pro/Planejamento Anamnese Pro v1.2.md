# 🚀 PLANEJAMENTO MÓDULO ANAMNESE PRO

Simples e direto ao ponto

---

## FASE 1: DEFINIR O QUE VAMOS FAZER

### 1.1 Entender o Projeto

- Ler o PRD do Anamnese Pro para saber exatamente o que fazer
- Módulo será para tatuadores, psicólogos e nutricionistas
- Começar apenas com template para tatuagem
- Cliente preenche ficha pelo celular através de quiz interativo

### 1.2 Decisão Importante: Estratégia de Limitações

**ANAMNESE PRO (R$ 29/mês):**

- Máximo 100 clientes
- Todas as funcionalidades do módulo completas
- Valor real desde o primeiro dia

**LIMITAÇÃO DO ANAMNESE PRO:**

Quando o usuário atingir 100 clientes no Anamnese Pro, será necessário contratar o CRM Completo para continuar cadastrando novos clientes.

**CRM Completo (R$ 79/mês):**

- Clientes ilimitados
- Dados completos + campos personalizados
- Tags + segmentação
- WhatsApp automático
- Dashboard + relatórios
- Automações + campanhas
- Integrações completas

**Upgrade natural:** usuário cresce até 100 clientes no Anamnese Pro, atinge o limite, e faz upgrade para CRM Completo por VALOR (clientes ilimitados + funcionalidades avançadas)

### 1.3 O Que Vai Fazer

- Quiz interativo gamificado para preenchimento
- Guardar dados completos dos clientes (nome, telefone, CPF, RG, endereço, email)
- Controlar origem do cliente (Instagram, Google, indicação, outra fonte)
- Gerar PDF automático da anamnese com assinatura digital
- Sistema de versionamento inteligente
- 2 abas principais: Anamnese e Clientes

---

## FASE 2: PREPARAR A ESTRUTURA

### 2.1 Criar o Módulo

- Usar DevKit do Hub.App: `npx create-hub-module anamnese-pro`
- Escolher "banco compartilhado" durante setup
- Configurar como módulo pago (R$ 29/mês)
- Definir limite de 100 clientes por empresa

### 2.2 Criar Tabelas no Banco

**3 tabelas principais:**

- **anamnese_fichas:** fichas de anamnese preenchidas com versionamento
  - ID único, tenant_id, cliente_id, template_tipo, versão, datas, dados_saude (JSON), origem_cliente, assinatura_digital, PDF_url, status
  
- **anamnese_clientes_basicos:** dados dos clientes (máximo 100 por empresa)
  - ID único, tenant_id, nome, CPF, RG, data_nascimento, telefone, email, endereço, foto, datas
  
- **anamnese_atendimentos:** histórico de consultas e valores
  - ID único, tenant_id, cliente_id, ficha_id, data_hora, valor, observações, status

**Nota:** Limite de 100 clientes é do Anamnese Pro. Ao atingir, usuário precisa do CRM Completo.

### 2.3 Configurar Segurança

- Cada empresa só vê seus dados (RLS - Row Level Security)
- Implementar limite automático de 100 clientes por empresa
- Conformidade com LGPD (dados sensíveis de saúde)
- Auditoria automática de alterações

---

## FASE 3: FAZER AS TELAS

### 3.1 Aba Inicial - Anamnese

**O que a Aba de Anamnese terá:**

A aba de anamnese é o coração do módulo, onde acontece toda a gestão das fichas. Ela inclui:

1. **Busca de Cliente**
2. **Criação de Nova Anamnese (2 modos)**
3. **Configuração de Template Padrão**
4. **Histórico de Anamneses**

**Busca de Cliente:**
- Campo de busca por nome (integrado com CRM)
- Lista de sugestões enquanto digita
- Botão "Novo Cliente" para primeira anamnese
- Botão "Nova Anamnese" para clientes existentes

**Criar Nova Anamnese - Dois Modos:**

Quando a profissional clicar em "Nova Anamnese", terá duas opções:

**MODO 1: Anamnese Presencial (Profissional Preenche)**
- A profissional faz as perguntas diretamente ao cliente presencialmente
- Preenche o formulário enquanto conversa com o cliente
- Usa o template padrão com todas as perguntas já configuradas
- Quiz aparece na tela da profissional
- Pode pular perguntas não relevantes
- Salva diretamente no sistema ao finalizar
- Gera PDF automaticamente

**MODO 2: Anamnese Remota (Cliente Preenche Sozinho)**

Este é o fluxo completo:

1. **Profissional Edita a Anamnese (Opcional):**
   - Ao clicar em "Nova Anamnese", escolhe modo remoto
   - Sistema carrega o template padrão
   - Profissional pode editar para adicionar pergunta específica para aquele cliente
   - Pode adicionar campos extras se precisar
   - Pode remover perguntas que não se aplicam
   - Esta edição vale APENAS para esta anamnese específica
   
2. **Profissional Confirma e Envia:**
   - Após revisar/editar, clica em "Confirmar e Enviar"
   - Sistema gera um link único e temporário
   - Profissional envia o link para o cliente via:
     - WhatsApp
     - SMS
     - Email
     - Ou copia o link para enviar por outro meio
   
3. **Cliente Recebe e Responde:**
   - Cliente abre o link no celular dele
   - Vê uma tela de boas-vindas com nome da profissional
   - Responde o quiz interativo passo a passo
   - Interface gamificada com progress bar
   - Salvamento automático a cada resposta
   - Ao final, assina digitalmente
   - Clica em "Confirmar e Enviar"
   
4. **Anamnese Vai Automaticamente para o Sistema:**
   - Assim que cliente confirma, anamnese é salva automaticamente
   - Vai direto para o **Histórico de Anamneses** (na aba Anamnese)
   - Vai direto para o **Histórico do Cliente** (na aba Clientes)
   - Todas as informações do quiz ficam registradas certinhas
   - Profissional recebe notificação de conclusão
   - PDF é gerado automaticamente
   - Status muda de "Pendente" para "Concluída"

**Configuração de Anamnese Padrão:**

A profissional pode configurar um template padrão que será usado sempre:

- **Onde editar:** Nas configurações do módulo ou na primeira criação
- **O que editar:**
  - Quais perguntas sempre aparecem
  - Ordem das perguntas
  - Textos de introdução
  - Perguntas obrigatórias vs opcionais
  
- **Como funciona:**
  - Template padrão é editado uma vez
  - Sempre que criar nova anamnese, já vem com esse template
  - Profissional pode fazer edições pontuais antes de enviar ao cliente
  - Edições pontuais não alteram o template padrão
  - Só valem para aquela anamnese específica

**Quando é Possível Editar:**
- ✅ **Sim:** Ao criar nova anamnese remota (antes de enviar ao cliente)
- ✅ **Sim:** Nas configurações para editar template padrão
- ❌ **Não:** Depois que link foi enviado ao cliente
- ❌ **Não:** Depois que cliente já respondeu
- ❌ **Não:** Em anamneses antigas do histórico

**Quiz Interativo da Anamnese:**

8 etapas gamificadas com progress bar visual:

1. **Dados pessoais** (nome, CPF, RG, telefone, endereço, email)
2. **Como me conheceu?** (Instagram, Google, indicação, outra fonte)
3. **Saúde geral** (histórico de doenças, cirurgias, medicamentos)
4. **Alergias** (sim/não com expansão, quais alergias)
5. **Condições de pele** (dermatites, cicatrização, sensibilidade)
6. **Já tem tatuagem?** (histórico de tatuagens anteriores)
7. **Sobre a tatuagem nova** (local pretendido, tamanho, estilo)
8. **Termo de compromisso** (checkbox + assinatura digital touchscreen)

**Características do Quiz:**
- Interface gamificada com ícones coloridos
- Feedback imediato após cada resposta
- Salvamento automático a cada etapa
- Fluxo condicional inteligente (pula perguntas irrelevantes)
- Tooltips educativos para termos complexos
- Design acolhedor e conversacional
- Funciona perfeitamente no celular

**Histórico de Anamneses:**
- Lista cronológica de todas as versões
- Indicador visual: "Preenchida pela Profissional" ou "Preenchida pelo Cliente"
- Status: Concluída / Pendente (aguardando cliente) / Expirada
- Comparação visual entre versões (diff)
- Download de PDFs de versões anteriores
- Busca por informação específica
- Botão "Reenviar Link" para anamneses pendentes

### 3.2 Aba de Clientes

**Lista de Clientes:**
- Mostrar todos os clientes cadastrados
- Indicador visual: X/100 clientes cadastrados
- Busca por nome ou CPF
- Filtros diversos

**Perfil Completo do Cliente:**

**Cabeçalho:**
- Foto do cliente
- Nome completo
- Idade (calculada pela data de nascimento)
- Dados vindos do CRM

**Informações Detalhadas:**
- Dados pessoais completos (CPF, RG, telefone, endereço, email)
- Origem (como conheceu o serviço)
- Histórico completo de anamneses
- Histórico de atendimentos realizados
- Botões de ação (Editar Dados, Nova Anamnese, Ver PDFs)

---

## FASE 4: PROGRAMAR AS FUNCIONALIDADES

### 4.1 Reutilização Inteligente de Dados

**Para Clientes Novos:**
- Formulário completo aparece em branco
- Template específico carregado (tatuagem)
- Cliente criado automaticamente no CRM após salvar
- PDF gerado automaticamente

**Para Clientes Recorrentes:**
- Sistema busca automaticamente a última anamnese pelo CPF
- Pré-preenche todos os campos com dados anteriores
- Destaca campos críticos que podem ter mudado (medicamentos, saúde atual)
- Cliente só atualiza informações necessárias
- Salva como nova versão mantendo histórico completo

### 4.2 Sistema de Versionamento

- Histórico completo de todas as versões
- Comparação visual entre versões (o que mudou)
- Alertas automáticos para mudanças críticas de saúde
- Busca por histórico de condições específicas

### 4.3 Controle de Origem

- Campo obrigatório: "Como me conheceu?"
- Salvar para fazer relatórios depois
- Mostrar gráficos de origem no dashboard (se houver)

### 4.4 Geração de PDF

- Template bonito com logo da empresa
- Organizar respostas por seção clara
- Destacar informações importantes de saúde
- Incluir assinatura digital capturada
- Gerar automaticamente ao concluir anamnese
- Armazenar URL do PDF na ficha

### 4.5 Templates por Área

**Template Tatuagem (MVP):**
- Alergias a tintas/metais
- Medicamentos que afetam coagulação
- Condições de pele
- Histórico de tatuagens
- Local pretendido

**Futuro - Template Psicologia:**
- Motivo da consulta
- Histórico familiar saúde mental
- Medicações psiquiátricas
- Terapias anteriores
- Situações de crise

**Futuro - Template Nutrição:**
- Alergias alimentares
- Restrições dietéticas
- Objetivos nutricionais
- Histórico de peso
- Nível de atividade física

---

## FASE 5: INTEGRAÇÃO COM ECOSSISTEMA HUB.APP

### 5.1 Integração com CRM

**Sincronização de Dados:**
- Anamnese preenchida → Cliente criado automaticamente no CRM
- Cliente editado no CRM → Dados básicos atualizados na Anamnese
- Sincronização bidirecional de dados pessoais
- Zero duplicação de cadastros
- Foto do cliente compartilhada

**Fallback:**
- Se CRM não disponível: Anamnese usa tabela própria
- Dados sempre preservados mesmo após upgrade/downgrade

**Limite e Upgrade:**
- Ao atingir 100 clientes: notificar usuário
- Bloquear cadastro de novos clientes até upgrade CRM Completo
- Mostrar banner sutil incentivando upgrade (não intrusivo)

### 5.2 Integração com MultiFins (Opcional)

**Eventos Disparados:**
- Anamnese concluída → Trigger "Sessão realizada"
- MultiFins pode criar receita automaticamente
- Notificação automática quando anamnese completada
- Dados do cliente disponíveis para faturamento
- Controle de sessões para cálculo de ticket médio

### 5.3 Integração com Galeria Pro (Futuro)

**Conexão Planejada:**
- Anamnese concluída → Link para galeria de fotos do trabalho
- Galeria → Referência à anamnese correspondente

---

## FASE 6: TESTAR TUDO

### 6.1 Testes Básicos

- Criar ficha do zero funciona?
- Limite de 100 clientes funcionando?
- Reutilização inteligente funcionando?
- PDF está sendo gerado certo?
- Versionamento salvando corretamente?
- Integração com CRM funcionando?
- Quiz interativo fluindo bem?

### 6.2 Testes com Usuários

- Pegar 5-10 tatuadores reais para testar
- Medir tempo: conseguem preencher em menos de 8 minutos?
- Interface está fácil no celular?
- Quiz está gamificado e agradável?
- Cliente se sente acolhido durante preenchimento?
- Coletar sugestões de melhoria

### 6.3 Segurança

- Cada empresa só vê seus dados?
- RLS funcionando perfeitamente?
- Está conforme LGPD?
- Dados sensíveis de saúde protegidos?
- Auditoria registrando tudo?

### 6.4 Testes de Limite

- Ao chegar em 100 clientes, sistema bloqueia?
- Mensagem de upgrade aparece corretamente?
- Após upgrade CRM, limite some?
- Dados preservados após upgrade?

---

## FASE 7: COLOCAR NO AR

### 7.1 Deploy

- Configurar servidor
- Subir banco de dados com as 3 tabelas
- Configurar RLS policies
- Testar se tudo funciona
- Preparar plano de rollback se der problema

### 7.2 Lançamento

- Começar com poucos usuários (beta fechado)
- Acompanhar se está funcionando bem
- Monitorar uso do limite de 100 clientes
- Corrigir problemas rapidamente
- Coletar feedback ativo
- Expandir aos poucos

---

## FASE 8: MELHORAR

### 8.1 Coletar Feedback

- Ver como usuários estão usando
- Quais etapas do quiz têm mais abandono?
- Que dificuldades têm?
- O que querem de novo?
- Taxa de upgrade para CRM Completo?

### 8.2 Próximas Versões

**Fase 2 - Expansão:**
- Adicionar template psicologia
- Adicionar template nutrição
- Melhorar sistema de versionamento
- Adicionar busca avançada por condições de saúde
- Integração completa com MultiFins

**Fase 3 - Otimização:**
- IA para sugestões de perguntas
- Analytics avançados do módulo
- API para integrações externas
- Relatórios personalizados

---

## 🎯 RESULTADO ESPERADO

### Anamnese Pro:

- Produto completo e funcional (R$ 29/mês)
- Limite de 100 clientes
- Todas as funcionalidades de anamnese
- Quiz interativo gamificado
- Versionamento inteligente
- Geração automática de PDF

### Upgrade Natural para CRM Completo:

- Usuário começa com Anamnese Pro (100 clientes, R$ 29/mês)
- Cresce até o limite de 100 clientes
- Ao atingir limite, precisa de CRM Completo (R$ 79/mês)
- Upgrade por VALOR: clientes ilimitados + automações + integrações

### Todo mundo ganha:

- **Usuário:** Começa com preço acessível, cresce organicamente
- **Hub.App:** Upgrade qualificado baseado em uso real
- **Conversão natural:** Não é limitação artificial, é crescimento real

### Tempo total: 3-4 meses

**Fase 1 (MVP):** 3 meses
- Template tatuagem
- Quiz interativo
- Integração CRM
- Limite 100 clientes
- PDF automático

**Fase 2 (Expansão):** +3 meses
- Templates psicologia e nutrição
- Integração MultiFins
- Melhorias baseadas em feedback

### 11.1. Validação de Idade Mínima
- Cálculo automático da idade considerando dia, mês e ano
- Bloqueio total do quiz para menores de 18 anos
- Mensagem clara: "⚠️ Você precisa ter 18 anos ou mais para fazer tatuagem"
- Validação ocorre na Etapa 1 antes de prosseguir

### 11.2. Campo de Valor da Tatuagem
- Localizado na Etapa 8 (final) do quiz
- Formatação automática em tempo real como moeda brasileira
- Input numérico estilo apps bancários
- Exemplo: digita `15000` → exibe `R$ 150,00`

### 11.3. Sistema de Totalização Financeira
- Total de Tatuagens = número total de anamneses concluídas
- Total Gasto = soma acumulativa de todos os valores
- Exibido formatado como R$ no perfil do cliente

### 11.4. Smart Navigation para Clientes Retornando
- Clientes novos: quiz inicia na Etapa 1
- Clientes retornando: quiz inicia na Etapa 7
- Botão "Alterar Dados Anteriores" para voltar à Etapa 1
- Economiza 80% do tempo de preenchimento

### 11.5. Sistema de Exclusão com Confirmação
- Excluir anamnese individual com confirmação simples
- Excluir cliente completo com confirmação rigorosa
- Exclusão em cascata: remove cliente + todas anamneses
- Notificações de sucesso

### 11.6. Histórico com Dados Reais
- Modal de detalhes exibe todos os dados coletados
- Todas as 8 seções do quiz com informações verdadeiras
- Tratamento de campos vazios com "Não informado"

### 11.7. Layout Grid para Histórico (v1.3)
- Cards dispostos em grade responsiva
- 3 colunas desktop / 2 tablet / 1 mobile
- Melhor aproveitamento de espaço (6-9 anamneses visíveis)
- Hover effects e badges de status coloridos

### 11.8. Cards de Clientes com Foto (v1.3)
- Grid de cards com foto do cliente (150x150px circular)
- Avatar padrão com inicial do nome se sem foto
- Estatísticas visíveis: idade, qtd tatuagens, total gasto
- Botões: "Ver Perfil" e "Nova Anamnese"
- Upload de foto opcional via quiz remoto

### 11.9. Pre-fill Inteligente
- Ao criar nova anamnese para cliente existente
- Sistema carrega dados da última anamnese
- Campos preenchidos automaticamente
- Apenas nova tatuagem e assinatura precisam ser preenchidas

### 11.10. Validações de Formato
- Nome, email, telefone, CPF obrigatórios
- Email com formato válido (@ e .)
- Telefone com 10-11 dígitos
- CPF com 11 dígitos
- Idade mínima 18 anos
- Termo e assinatura obrigatórios
- Feedback visual com mensagens de erro

---

## FASE 9: NOVAS FUNCIONALIDADES (v1.4 - Janeiro 2025)

### 9.1. Sistema de Cores Dinâmicas por Profissão ✅ IMPLEMENTADO

**O que foi feito:**
- Criadas 5 paletas de cores específicas para cada profissão
- Sistema de cores se aplica automaticamente a TODA interface
- Cores mudam baseadas na escolha do onboarding

**Implementação Técnica:**
1. Função `getCoresTema()` em cada componente
2. Lê configuração do localStorage
3. Retorna objeto com cores da profissão escolhida
4. Aplica via template literals no className

**Paletas Criadas:**
- Tatuagem: Rosa/Roxo (pink-purple)
- Psicologia: Azul/Ciano (blue-cyan)
- Nutrição: Verde/Esmeralda (green-emerald)
- Fisioterapia: Laranja/Âmbar (orange-amber)
- Estética: Roxo/Fúcsia (purple-fuchsia)

**Componentes Atualizados:**
- ✅ QuizContainer.tsx
- ✅ LinkGenerated.tsx
- ✅ ClienteProfile.tsx
- ✅ AnamneseDetails.tsx
- ✅ TemplateEditor.tsx
- ✅ TemplateSettings.tsx
- ✅ Onboarding.tsx

**Padrão de Código:**
```typescript
const getCoresTema = () => {
  const config = localStorage.getItem('anamneseConfig');
  const templateProfissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';
  const cores = { /* paletas */ };
  return cores[templateProfissao] || cores.tatuagem;
};
const coresTema = getCoresTema();

// Uso
<div className={`border-2 ${coresTema.border500} ${coresTema.bg50}`}>
```

### 9.2. Onboarding em 3 Etapas com Personalização ✅ IMPLEMENTADO

**O que foi feito:**
- Expandido de 2 para 3 etapas
- Adicionada Etapa 2 com perguntas específicas da profissão
- Sistema de seleção múltipla
- Salvamento de personalizações

**Estrutura das Etapas:**

**Etapa 1: Escolha da Profissão**
- Grid com 5 cards visuais
- Ícones, títulos e descrições
- Cores pink/purple
- Click seleciona e avança

**Etapa 2: Perguntas Específicas (NOVA!)**
- 2 perguntas por profissão
- Múltipla seleção permitida
- Cores blue/cyan
- Botão "Continuar"
- Dica: "Você pode selecionar várias opções!"

**Etapa 3: Confirmação**
- Resumo da profissão
- Lista de benefícios
- Resumo das personalizações
- Cores green/emerald
- Botão "Começar a Usar! 🚀"

**Exemplos de Perguntas:**
```typescript
tatuagem: [
  { id: 'estilo', pergunta: 'Qual seu estilo principal de tatuagem?',
    opcoes: ['Realista', 'Old School', 'Aquarela', 'Minimalista', 'Geométrica', 'Oriental', 'Outro'] },
  { id: 'servicos', pergunta: 'Quais serviços você oferece?',
    opcoes: ['Tatuagem', 'Cover-up', 'Piercing', 'Remoção a laser', 'Micropigmentação'] }
]
```

**Dados Salvos no localStorage:**
```typescript
{
  templateProfissao: 'tatuagem',
  personalizacao: {
    estilo: ['Realista', 'Old School'],
    servicos: ['Tatuagem', 'Cover-up']
  },
  dataConfiguracao: '2025-01-17T...',
  onboardingConcluido: true
}
```

**Indicadores de Progresso:**
- 3 bolinhas indicando etapa atual
- Cores mudam: pink → blue → green
- Botão "Voltar" em todas as etapas

### 9.3. Correções de UX e Contraste ✅ IMPLEMENTADO

**Problema Resolvido:**
Texto branco em fundo branco no quiz causando ilegibilidade

**Correções Aplicadas:**

1. **Template Literals Corrigidos:**
   - ❌ Errado: `className="border ${coresTema.border500}"`
   - ✅ Correto: `className={`border ${coresTema.border500}`}`
   - 15+ ocorrências corrigidas

2. **Contraste de Texto:**
   - Inputs: `text-gray-900` (escuro)
   - Labels: `text-gray-900` (escuro)
   - Botões: `text-gray-900` (escuro)
   - Header gradient: `text-white` (único lugar permitido)

3. **Regra de Ouro:**
   - Fundos claros → texto escuro
   - Fundos escuros → texto branco
   - NUNCA branco em branco

**Arquivos Corrigidos:**
- QuizContainer.tsx (principal - 15+ correções)
- Todos inputs, selects, textareas
- Botões sim/não e opções múltiplas
- Cards e modais diversos

---

## FASE 10: PRÓXIMAS IMPLEMENTAÇÕES

### 10.1. Modal de Confirmação de Mudança de Template ⏳ PLANEJADO

**Objetivo:**
Prevenir mudanças acidentais de profissão que podem causar perda de dados

**Como Será:**
1. Usuário tenta mudar de profissão nas configurações
2. Modal aparece com aviso vermelho/laranja
3. Lista o que vai acontecer:
   - Mudança de todas as cores
   - Possível perda de perguntas personalizadas
   - Mudança na experiência dos clientes
4. Dois botões:
   - "Sim, tenho certeza" (vermelho/laranja)
   - "Cancelar" (cinza)

**Onde Implementar:**
- TemplateSettings.tsx
- Ou componente de Configurações

**Mensagem Proposta:**
```
⚠️ Atenção! Mudar o template irá:
• Alterar todas as cores do sistema
• Pode afetar suas perguntas personalizadas
• Modificar a experiência de seus clientes

Tem certeza que deseja continuar?
```

### 10.2. Melhorias Futuras a Considerar

**Interface:**
- Animações de transição entre etapas do onboarding
- Preview das cores antes de confirmar mudança
- Dark mode (cores adaptadas)

**Funcionalidades:**
- Exportar/importar configurações de template
- Compartilhar template entre profissionais
- Histórico de mudanças de configuração

**Analytics:**
- Rastrear quais profissões são mais usadas
- Quais personalizações são mais escolhidas
- Taxa de conclusão do onboarding por etapa

---

## 🎯 STATUS ATUAL DO PROJETO

### ✅ Implementado (v1.4 - Janeiro 2025)
- Sistema de cores dinâmicas (5 profissões)
- Onboarding em 3 etapas com personalização
- Correções de contraste e legibilidade
- Seleção múltipla nas perguntas
- Salvamento de personalizações
- 7+ componentes com cores dinâmicas

### 🔄 Em Desenvolvimento
- (Nenhum item atualmente)

### ⏳ Planejado (Próximas Versões)
- Modal de confirmação de mudança de template
- Exportar/importar configurações
- Dark mode
- Analytics de uso

### 📊 Métricas de Sucesso
- Onboarding concluído: espera-se 95%+ de conclusão
- Cores aplicadas corretamente: 100% dos componentes
- Legibilidade: 100% de contraste adequado
- Tempo de setup: < 2 minutos para configuração inicial

---

**Última atualização**: 17 de Janeiro de 2025
**Versão atual**: 1.4 (Cores Dinâmicas + Onboarding 3 Etapas)
