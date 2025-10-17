# 📋 PRD - Módulo Anamnese Pro

## Documento de Requisitos de Produto

**Autor:** Hub.App Product Team  
**Data:** 19 de Setembro de 2025  
**Versão:** 2.1 - Revisão de Escopo Modular + Estratégia CRM  
**Módulo:** Anamnese Pro

---

## 1. 🎯 Resumo e Visão do Módulo

### Propósito do Módulo

O Anamnese Pro é um módulo especializado do Hub.App voltado para profissionais de saúde, psicologia, nutrição e tatuagem que precisam de controle rigoroso e inteligente de fichas de anamnese.

### Foco Inicial

Tatuadoras - profissionais que realizam atendimentos individualizados e precisam de anamnese detalhada com reutilização automática.

### Proposta de Valor

"O único módulo de anamnese que elimina completamente o retrabalho: fichas inteligentes que se atualizam automaticamente, integradas ao ecossistema Hub.App."

### Posicionamento no Hub.App

O Anamnese Pro é um módulo especializado que complementa os módulos gratuitos (CRM, Agenda) e integra-se naturalmente com módulos pagos (MultiFins, Marketing Pro).

### Responsabilidade Específica

APENAS fichas de anamnese especializadas - Todo o resto (histórico de clientes, galeria, financeiro, marketing) é delegado aos módulos especializados.

---

## 4. 🏗 Funcionalidade Única: Fichas de Anamnese Inteligentes

### 4.1. Sistema de Anamnese Especializada

#### Objetivo Principal

Criar, gerenciar e reutilizar fichas de anamnese de forma completamente automatizada, eliminando 100% do retrabalho para clientes recorrentes.

#### 4.1.1. Formulário de Anamnese Completo

**Dados Pessoais Básicos**

- Nome completo (sincronizado com CRM)
- Data de nascimento (sincronizado com CRM)
- CPF (sincronizado com CRM)
- RG (sincronizado com CRM)
- Telefone (sincronizado com CRM)
- Endereço (sincronizado com CRM)
- E-mail (sincronizado com CRM)

**Informações de Origem do Cliente**

- Como chegou até o serviço: (controle exclusivo do Anamnese Pro)
  - ☐ Instagram
  - ☐ Publicidade no Google
  - ☐ Indicação de amigo
  - ☐ Outra fonte (campo livre)

**Informações de Saúde Especializadas**

- Histórico de doenças ou condições de saúde (campo texto longo)
- Medicamentos em uso atual (lista detalhada)
- Alergias conhecidas (alertas automáticos)
- Condições específicas da pele (para tatuagem)
- Situação de saúde atual (campo dinâmico)
- Experiência anterior na área profissional

**Validação Legal**

- Termo de compromisso (checkbox obrigatório com link para termos)
- Data da anamnese (preenchida automaticamente)
- Assinatura digital do cliente (campo de assinatura touchscreen)
- Geração automática de PDF para arquivo legal

#### 4.1.2. Templates por Área Profissional

**Template para Tatuadores:**

- Alergias a tintas/metais
- Medicamentos que afetam coagulação
- Condições de pele (dermatites, cicatrização)
- Histórico de tatuagens anteriores
- Local pretendido da nova tatuagem

**Template para Psicólogos:**

- Motivo da consulta
- Histórico familiar de saúde mental
- Medicações psiquiátricas em uso
- Terapias anteriores
- Situações de crise ou trauma

**Template para Nutricionistas:**

- Alergias e intolerâncias alimentares
- Restrições dietéticas (vegetarianismo, etc.)
- Objetivos nutricionais
- Histórico de peso e dietas
- Nível de atividade física

### 4.2. Inteligência de Reutilização

#### 4.2.1. Para Clientes Novos:

1. Formulário completo aparece em branco
2. Template específico carregado conforme área profissional
3. Cliente é criado automaticamente no CRM após salvar
4. PDF é gerado automaticamente para arquivo

#### 4.2.2. Para Clientes Recorrentes:

1. Sistema busca automaticamente a última anamnese
2. Pré-preenche todos os campos com dados anteriores
3. Destaca campos críticos que podem ter mudado (medicamentos, saúde atual)
4. Permite edição seletiva apenas dos campos necessários
5. Salva como nova versão mantendo histórico completo
6. Atualiza dados no CRM automaticamente

#### 4.2.3. Versionamento Inteligente:

- Histórico completo de todas as versões da anamnese
- Comparação visual entre versões (o que mudou)
- Alertas automáticos para mudanças críticas de saúde
- Busca por histórico de condições específicas

---

## 5. 🗂 Interface do Módulo (2 Abas)

### 5.1. Aba Inicial - Anamnese

A aba de anamnese é onde toda a gestão de fichas acontece, com três funcionalidades principais:

#### 5.1.1. Busca de Cliente

- Campo de busca por nome (integrado com CRM)
- Lista de sugestões enquanto digita
- Botão "Novo Cliente" para primeira anamnese
- Botão "Nova Anamnese" para clientes existentes

#### 5.1.2. Criar Nova Anamnese - Dois Modos

Ao clicar em "Nova Anamnese", a profissional tem duas opções:

**Modo 1: Anamnese Presencial (Profissional Preenche)**
- A profissional faz as perguntas diretamente ao cliente
- Preenche o formulário enquanto conversa
- Usa o template padrão com todas as perguntas já configuradas
- Pode fazer edições pontuais se necessário
- Salva diretamente no sistema ao finalizar

**Modo 2: Anamnese Remota (Cliente Preenche)**
1. **Edição do Template:**
   - Profissional pode revisar o template padrão
   - Pode adicionar perguntas específicas para aquele cliente
   - Pode remover perguntas que não se aplicam
   - Pode reordenar as perguntas conforme necessidade
   
2. **Envio ao Cliente:**
   - Sistema gera um link único e temporário
   - Profissional envia o link via WhatsApp, email ou SMS
   - Cliente abre o link no celular dele
   - Cliente responde o quiz interativo no próprio dispositivo
   
3. **Preenchimento pelo Cliente:**
   - Interface gamificada e acolhedora
   - Progress bar mostrando andamento
   - Salvamento automático a cada resposta
   - Cliente assina digitalmente ao final
   
4. **Finalização Automática:**
   - Ao confirmar, anamnese vai automaticamente para o histórico
   - Profissional recebe notificação de conclusão
   - PDF é gerado automaticamente
   - Dados sincronizados com perfil do cliente

#### 5.1.3. Configuração de Anamnese Padrão

**Edição Única do Template:**
- Profissional pode editar o template padrão uma vez
- Define quais perguntas sempre aparecem
- Personaliza linguagem e ordem das perguntas
- Este template editado se torna o padrão para todas as novas anamneses

**Uso do Template Padrão:**
- Toda nova anamnese já vem com o template padrão pré-carregado
- Profissional pode fazer edições pontuais antes de enviar ao cliente
- Edições pontuais não alteram o template padrão
- Apenas valem para aquela anamnese específica

**Quando Editar:**
- Edição do template padrão: nas configurações do módulo
- Edição pontual: apenas ao criar nova anamnese remota
- Edição não disponível após envio ao cliente

#### 5.1.4. Formulário de Anamnese

- Status da anamnese (Nova/Atualização/Histórico/Pendente Cliente)
- Formulário especializado conforme template da profissão
- Indicador se foi preenchido pela profissional ou pelo cliente
- Botões de ação (Salvar, Gerar PDF, Ver Histórico, Reenviar Link)

#### 5.1.5. Histórico de Anamneses

- Lista cronológica de todas as versões
- Indicador visual: preenchida pela profissional ou pelo cliente
- Comparação entre versões (diff visual)
- Download de PDFs de versões anteriores
- Busca por informação específica
- Status: Concluída, Pendente (aguardando cliente), Expirada

### 5.2. Aba de Clientes

#### 5.2.1. Lista de Clientes

- Listagem de todos os clientes cadastrados
- Busca e filtros
- Indicador visual: X/100 clientes cadastrados

#### 5.2.2. Perfil Completo do Cliente

**Cabeçalho do Cliente:**
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

## 6. 🔗 Integração com Ecossistema Hub.App

### 6.1. Integração com CRM (Módulo Gratuito)

#### Estratégia de Limitações

**ANAMNESE PRO (R$ 29/mês):**

- Máximo 100 clientes
- Todas as funcionalidades do módulo completas
- Valor real desde o primeiro dia

**LIMITAÇÃO DO ANAMNESE PRO:**

Quando o usuário atingir 100 clientes no Anamnese Pro, será necessário contratar o CRM Completo para continuar cadastrando novos clientes.

**CRM Completo (R$ 79/mês):**

- Clientes ilimitados
- Dados completos + campos personalizados
- Tags + segmentação avançada
- WhatsApp automático
- Dashboard + relatórios completos
- Automações + campanhas
- Integrações completas (API, webhooks)

**Upgrade Natural:** O usuário começa com Anamnese Pro (100 clientes), cresce naturalmente e, ao atingir o limite, faz upgrade para CRM Completo para ter clientes ilimitados + todas as funcionalidades avançadas.

#### Fluxo de Dados:

- Anamnese preenchida → Cliente criado automaticamente no CRM
- Cliente editado no CRM → Dados básicos atualizados na Anamnese
- Sincronização bidirecional de dados pessoais básicos
- Zero duplicação de cadastros
- Foto do cliente compartilhada entre módulos
- Se CRM não disponível: Anamnese usa tabela própria de clientes
- Dados sempre preservados mesmo após upgrade/downgrade do CRM

### 6.2. Integração com MultiFins (Módulo Pago)

**Evento Disparado:**

- Anamnese concluída → Trigger para "Sessão realizada"
- MultiFins → Pode criar receita automaticamente
- Notificação automática quando anamnese é completada
- Dados do cliente disponíveis para faturamento
- Controle de sessões para cálculo de ticket médio

### 6.4. Integração com Galeria Pro (Módulo Futuro)

**Conexão Planejada:**

- Anamnese concluída → Link para galeria de fotos do trabalho
- Galeria → Referência à anamnese correspondente

---

## 8. 🔧 Informações Técnicas do Módulo

### 8.1. Configuração no Hub.App

O módulo Anamnese Pro deve ser registrado no Hub.App com as seguintes características:

**Identificação do Módulo:**
- Nome comercial: "Anamnese Pro"
- Identificador técnico (slug): anamnese-pro
- Categoria: Saúde e Bem-estar

**Modelo de Negócio:**
- Tipo: Módulo pago
- Valor da assinatura: R$ 29,90/mês
- Limitação: 100 clientes máximo
- Público-alvo: Profissionais de saúde, psicologia, nutrição e tatuagem

**Metadados e Descoberta:**
- Tags para busca: anamnese, fichas, saúde, especialização
- Descrição curta: "Fichas de anamnese especializadas com reutilização automática"
- Áreas profissionais atendidas: Saúde e bem-estar

**Dependências e Integrações:**
- Integração obrigatória: Módulo CRM (para dados básicos dos clientes)
- Integrações opcionais: MultiFins (financeiro), Galeria Pro (fotos)

### 8.2. Estrutura de Dados

O módulo utilizará três tabelas principais no banco de dados compartilhado:

**Tabela 1: anamnese_fichas**
- Propósito: Armazenar todas as fichas de anamnese preenchidas
- Campos principais:
  - Identificador único da ficha
  - Identificador da empresa (tenant) para isolamento multi-tenant
  - Referência ao cliente (integração com CRM)
  - Tipo de template utilizado (tatuagem, psicologia, nutrição)
  - Número da versão (para histórico)
  - Datas de criação e última atualização
  - Dados de saúde em formato flexível (JSON) para suportar diferentes templates
  - Origem do cliente (Instagram, Google, indicação, etc.)
  - Assinatura digital capturada
  - URL do PDF gerado para arquivo
  - Status da ficha (ativa, arquivada, cancelada)

**Tabela 2: anamnese_clientes_basicos**
- Propósito: Dados básicos dos clientes quando CRM não está disponível
- Campos principais:
  - Identificador único do cliente
  - Identificador da empresa (tenant)
  - Nome completo
  - CPF e RG
  - Data de nascimento
  - Telefone e email
  - Endereço completo
  - Foto do cliente
  - Datas de criação e atualização

**Tabela 3: anamnese_atendimentos**
- Propósito: Histórico de consultas/sessões realizadas
- Campos principais:
  - Identificador único do atendimento
  - Identificador da empresa (tenant)
  - Referência ao cliente
  - Referência à ficha de anamnese utilizada
  - Data e hora do atendimento
  - Valor cobrado (opcional)
  - Observações do profissional
  - Status do atendimento

**Recursos de Segurança:**
- Row Level Security (RLS) implementado em todas as tabelas
- Cada empresa vê apenas seus próprios dados
- Auditoria automática de todas as alterações
- Conformidade com LGPD para dados sensíveis de saúde

---

## 9. 🌸 Experiência do Usuário - Quiz Interativo

### 9.1. Filosofia da Experiência

O Anamnese Pro não será uma simples ficha digital a ser preenchida, mas sim uma experiência interativa de quiz que transforma uma tarefa tradicionalmente burocrática em uma conversa natural e acolhedora entre profissional e cliente.

### 9.3. Solução: Quiz Interativo e Inteligente

#### 9.3.1. Abordagem Conversacional

O sistema adotará uma linguagem acolhedora e natural, como se a própria profissional estivesse conversando pessoalmente com o cliente. A experiência começará com uma apresentação calorosa e explicação clara do propósito da anamnese, criando um ambiente de confiança.

#### 9.3.2. Interface Gamificada

- **Progress Bar Visual:** Indicador claro do progresso através das seções
- **Ícones Intuitivos:** Cada pergunta acompanhada de ícones coloridos e representativos
- **Feedback Imediato:** Confirmações visuais e textos motivacionais após cada resposta
- **Design Acolhedor:** Cores suaves e elementos visuais que remetem à marca da profissional

#### 9.3.3. Fluxo Condicional Inteligente

O sistema implementará lógica condicional que adapta as perguntas baseadas nas respostas anteriores:

- Perguntas irrelevantes são automaticamente puladas (ex: gravidez para usuários masculinos)
- Fluxos detalhados são acionados apenas quando necessário (ex: perguntas específicas sobre alergias apenas se o cliente indicar que possui)
- Linguagem se adapta ao contexto das respostas anteriores

#### 9.3.4. Elementos Educativos

- Tooltips explicativos para termos médicos complexos
- Exemplos práticos para facilitar compreensão
- Linguagem simples sem jargões médicos desnecessários
- Contextualização do porquê cada informação é importante

### 9.4. Estrutura da Experiência Interativa

#### 9.4.1. Introdução Acolhedora

Apresentação personalizada da profissional explicando a importância da anamnese de forma tranquilizadora, estabelecendo confiança e reduzindo ansiedade do cliente.

#### 9.4.2. Seções Progressivas

O quiz será dividido em seções temáticas claras:

- **Dados Básicos:** Informações pessoais essenciais
- **Como Me Conheceu:** Rastreamento de origem do cliente
- **Saúde Geral:** Condições médicas relevantes
- **Alergias:** Investigação detalhada de reações alérgicas
- **Condições de Pele:** Especificidades dermatológicas
- **Histórico de Procedimentos:** Experiências anteriores na área
- **Sobre o Procedimento Atual:** Detalhes do serviço desejado
- **Termo de Compromisso:** Validação legal com resumo das informações

#### 9.4.3. Tipos de Pergunta Otimizados

- **Sim/Não com Expansão:** Perguntas iniciais simples que se desdobram em detalhes apenas quando necessário
- **Seleção Visual:** Opções apresentadas como botões grandes e coloridos
- **Campos de Texto Contextuais:** Aparecem apenas quando informações adicionais são necessárias
- **Seletores Visuais:** Para informações como localização no corpo ou tamanho do procedimento

#### 9.4.4. Validação e Feedback Contínuo

- Salvamento automático após cada resposta
- Validação em tempo real de campos obrigatórios
- Mensagens motivacionais durante o progresso
- Resumo final das informações coletadas antes da assinatura

### 9.5. Personalização por Template Profissional

#### 9.5.1. Adaptação por Área

Cada template profissional (tatuagem, psicologia, nutrição) terá perguntas específicas e linguagem adaptada:

- **Tatuadores:** Foco em alergias a tintas, histórico de tatuagens, cicatrização
- **Psicólogos:** Ênfase em histórico familiar, medicações psiquiátricas, motivação da consulta
- **Nutricionistas:** Concentração em alergias alimentares, objetivos, histórico de dietas

#### 9.5.2. Linguagem Contextual

O tom e vocabulário se adaptam ao público-alvo de cada profissional, mantendo sempre a clareza e acolhimento.

### 9.6. Tecnologia de Apoio

#### 9.6.1. Inteligência Adaptativa

- Sistema aprende com padrões de resposta para otimizar perguntas futuras
- Sugestões automáticas baseadas em respostas similares de outros clientes
- Detecção de inconsistências para validação cruzada de informações

#### 9.6.2. Acessibilidade

- Design responsivo otimizado para smartphones
- Fonte legível e botões grandes para facilitar interação
- Alto contraste para usuários com dificuldades visuais
- Navegação simples com progresso linear claro

### 9.7. Resultado da Experiência

Ao final do quiz interativo, o cliente terá passado por uma experiência que:

- Eduque sobre a importância de cada informação de saúde
- Tranquilize quanto aos cuidados profissionais
- Colete informações completas e precisas
- Gere confiança na expertise da profissional
- Produza automaticamente uma ficha de anamnese completa e legível

Esta abordagem transforma um processo tradicionalmente tedioso em uma ferramenta de relacionamento que fortalece a confiança entre profissional e cliente, garantindo informações de qualidade superior para a segurança do procedimento.

---

## 10. 🚀 Roadmap do Módulo

### Fase 1 - MVP (3 meses)

- ✅ Formulário básico com template para tatuagem
- ✅ Integração com CRM
- ✅ Reutilização automática
- ✅ Geração de PDF

### Fase 2 - Expansão

- 🔄 Integração com MultiFins
- 🔄 Busca por informações específicas

---

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

### 11.11. Sistema de Cores Dinâmicas por Profissão (v1.4 - Janeiro 2025)
- **5 paletas de cores** específicas por profissão
- **Mudança automática** de toda a interface baseada na profissão escolhida
- **Cores aplicadas em:**
  - Gradientes do header
  - Bordas de inputs e botões
  - Fundos de cards e seções
  - Ícones e destaques visuais
  - Estados de hover e focus

**Paletas de Cores:**
- **Tatuagem:** Rosa e Roxo (pink-500 to purple-500)
- **Psicologia:** Azul e Ciano (blue-500 to cyan-500)
- **Nutrição:** Verde e Esmeralda (green-500 to emerald-500)
- **Fisioterapia:** Laranja e Âmbar (orange-500 to amber-500)
- **Estética:** Roxo e Fúcsia (purple-500 to fuchsia-500)

**Componentes com Cores Dinâmicas:**
- QuizContainer (quiz de anamnese)
- LinkGenerated (modal de links)
- ClienteProfile (perfil do cliente)
- AnamneseDetails (detalhes da anamnese)
- TemplateEditor (editor de templates)
- TemplateSettings (configurações)
- Onboarding (fluxo de onboarding)

**Armazenamento:** Configuração salva no localStorage junto com dados do onboarding

### 11.12. Onboarding em 3 Etapas com Personalização (v1.4 - Janeiro 2025)
**Sistema expandido de onboarding** para personalização completa da experiência

**Etapa 1: Escolha da Profissão**
- Grid visual com 5 profissões
- Cards com ícones, títulos e descrições
- Cores pink/purple para destaque
- Click para selecionar e avançar

**Etapa 2: Perguntas Específicas da Profissão (NOVO!)**
- **2 perguntas personalizadas** por profissão
- **Seleção múltipla** permitida em todas as opções
- **Cores blue/cyan** para indicar personalização
- **Exemplos de perguntas:**
  - Tatuagem: "Qual seu estilo principal?" / "Quais serviços oferece?"
  - Psicologia: "Qual sua abordagem terapêutica?" / "Qual público atende?"
  - Nutrição: "Qual sua especialidade?" / "Quais serviços oferece?"
  - Fisioterapia: "Qual sua área de atuação?" / "Tipo de atendimento?"
  - Estética: "Qual tipo de estética trabalha?" / "Principais procedimentos?"

**Etapa 3: Confirmação e Início**
- Resumo da profissão escolhida
- Lista de benefícios do módulo
- Resumo das personalizações selecionadas
- Cores green/emerald para "sucesso"
- Botão "Começar a Usar! 🚀"

**Indicadores de Progresso:**
- 3 bolinhas mostrando etapa atual
- Cores mudam conforme progresso (pink → blue → green)
- Botão "Voltar" em todas as etapas
- Validação antes de avançar

**Dados Salvos:**
```typescript
{
  templateProfissao: 'tatuagem' | 'psicologia' | 'nutricao' | 'fisioterapia' | 'estetica',
  personalizacao: {
    estilo: ['Realista', 'Old School'],
    servicos: ['Tatuagem', 'Cover-up']
  },
  dataConfiguracao: '2025-01-17T...',
  onboardingConcluido: true
}
```

### 11.13. Melhorias de UX e Contraste (v1.4 - Janeiro 2025)
**Problema resolvido:** Texto branco em fundo branco causando problemas de legibilidade

**Correções Aplicadas:**
- ✅ Todos os inputs com `text-gray-900` (texto escuro)
- ✅ Todas as labels com `text-gray-900` (texto escuro)
- ✅ Botões de seleção com `text-gray-900` (texto escuro)
- ✅ Header com gradient mantém `text-white` (único lugar permitido)
- ✅ Correção de template literals mal formatados (15+ ocorrências)

**Regra de Contraste:**
- Fundos claros (branco, bg-50, bg-100) → texto escuro (`text-gray-900`)
- Fundos escuros (gradientes, bg-500+) → texto branco (`text-white`)
- Nunca usar texto branco em fundos claros

**Componentes Corrigidos:**
- QuizContainer.tsx - 15+ correções
- Todos os inputs, selects e textareas
- Botões de sim/não e opções múltiplas
- Cards e modais diversos

---

## 12. 📝 Funcionalidades Planejadas (Próximas Versões)

### 12.1. Modal de Confirmação de Mudança de Template
**Objetivo:** Prevenir mudanças acidentais que podem causar perda de dados

**Funcionalidade:**
- ⚠️ Modal de confirmação ao tentar mudar de profissão
- 📋 Aviso sobre perda de perguntas personalizadas
- 🎨 Aviso sobre mudança de cores do sistema
- ✅ Botão "Sim, tenho certeza" (vermelho/laranja)
- ❌ Botão "Cancelar" (cinza)

**Mensagem:**
```
⚠️ Atenção! Mudar o template irá:
- Alterar todas as cores do sistema
- Pode afetar suas perguntas personalizadas
- Modificar a experiência de seus clientes

Tem certeza que deseja continuar?
```

---

© 2025 Hub.App - Módulo Anamnese Pro v2.2