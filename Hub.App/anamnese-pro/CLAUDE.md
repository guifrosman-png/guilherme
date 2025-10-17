# CLAUDE.md - Sistema de Anamnese Pro

Este arquivo fornece contexto para o Claude Code ao trabalhar neste projeto.

## 📋 Sobre o Projeto

**Anamnese Pro** é um sistema completo de gerenciamento de fichas de anamnese para estúdios de tatuagem. Permite criar, gerenciar e compartilhar anamneses digitais com clientes.

## 🚀 Comandos de Desenvolvimento

```bash
cd Hub.App/anamnese-pro
npm install        # Instalar dependências
npm run dev        # Iniciar servidor de desenvolvimento (porta 5173)
npm run build      # Build para produção
```

## 🏗️ Estrutura do Projeto

```
Hub.App/anamnese-pro/
├── src/
│   ├── components/
│   │   ├── anamnese/          # Componentes de anamnese
│   │   │   ├── AnamneseDetails.tsx    # Modal de detalhes
│   │   │   ├── LinkGenerated.tsx      # Modal de link gerado
│   │   │   └── TemplateEditor.tsx     # Editor de perguntas
│   │   ├── clientes/          # Componentes de clientes
│   │   │   └── ClienteProfile.tsx     # Perfil do cliente
│   │   ├── quiz/              # Sistema de quiz
│   │   │   └── QuizContainer.tsx      # Container principal do quiz
│   │   └── ui/                # Componentes UI (shadcn/ui)
│   ├── pages/
│   │   └── ClientePublico.tsx # Página pública para clientes
│   ├── utils/
│   │   └── generatePDF.ts     # Geração de PDF
│   └── App.tsx                # Componente principal
```

## 🎯 Funcionalidades Implementadas

### 1. Sistema de Quiz de Anamnese
- **8 etapas** de coleta de dados
- **Validação de campos obrigatórios** com feedback visual
- **Validação de idade mínima** (18 anos)
- **Formatação automática** de valores monetários (estilo banco)
- **Smart navigation** para clientes retornando (pula para etapa 7)
- **Pré-preenchimento** de dados de anamneses anteriores

### 2. Gestão de Clientes
- Lista completa de clientes com busca
- Perfil detalhado com todas as informações
- Upload de foto do cliente
- Histórico de anamneses por cliente
- Total de tatuagens = total de anamneses
- Total gasto acumulado
- Botão "Nova Anamnese" (pré-preenche dados)
- Botão "Ver Histórico" (filtra anamneses)
- **Exclusão de cliente** (remove cliente + todas anamneses)

### 3. Histórico de Anamneses
- Cards com informações resumidas
- Status: Concluída / Pendente / Expirada
- Filtros por período e status
- Ver detalhes completos
- Gerar PDF
- **Exclusão de anamnese individual**

### 4. Anamnese Remota
- Geração de link único para cliente
- Template customizável de perguntas
- Página pública para preenchimento
- Link expira em 7 dias
- Notificação quando cliente completa
- Validade de uso único

### 5. Validações Implementadas
- ✅ Nome obrigatório
- ✅ Email válido (formato com @ e .)
- ✅ Telefone válido (10-11 dígitos)
- ✅ CPF válido (11 dígitos)
- ✅ Idade mínima de 18 anos
- ✅ Campos obrigatórios não podem ser vazios
- ✅ Termo de compromisso obrigatório
- ✅ Assinatura obrigatória

### 6. Campo de Valor da Tatuagem
- Input com formatação automática de moeda brasileira
- Funciona como apps bancários
- Exemplo: digita `15000` → mostra `R$ 150,00`
- Calcula automaticamente o total gasto do cliente

### 7. Exclusão de Dados
- **Excluir anamnese**: Modal de confirmação simples
- **Excluir cliente**: Modal de confirmação rigoroso (remove cliente + todas anamneses)
- Notificações de sucesso após exclusão

## 💾 Armazenamento de Dados

Usa **localStorage** para persistência:
- `anamneses`: Array de anamneses
- `clientes`: Array de clientes
- `anamneseLinks`: Links gerados
- `notificacoes`: Notificações do sistema

### Estrutura de Dados

```typescript
// Anamnese
{
  id: number,
  clienteId: number,         // Link para cliente
  clienteNome: string,
  data: string,
  status: 'concluida' | 'pendente' | 'expirada',
  preenchidoPor: 'profissional' | 'cliente',
  dadosCompletos: QuizData,  // Todos os dados do quiz
  dataCriacao: string
}

// Cliente
{
  id: number,
  nome: string,
  cpf: string,
  rg: string,
  telefone: string,
  email: string,
  endereco: string,
  dataNascimento: string,
  fotoUrl: string | null,
  totalAnamneses: number,    // Quantidade de anamneses
  totalTatuagens: number,    // = totalAnamneses
  totalGasto: number,        // Soma dos valores das tatuagens
  primeiraAnamnese: string,
  ultimaAnamnese: string
}
```

## 🎨 Stack Tecnológica

- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **UI**: Radix UI + shadcn/ui + Tailwind CSS
- **Ícones**: Lucide React
- **PDF**: jsPDF + html2canvas
- **Roteamento**: React Router DOM

## 📝 Fluxo de Trabalho

### Criar Anamnese Presencial
1. Clicar em "Nova Anamnese"
2. Selecionar "Presencial"
3. Preencher quiz (8 etapas)
4. Informar valor da tatuagem
5. Aceitar termo e assinar
6. Salvar → Cliente criado/atualizado automaticamente

### Criar Anamnese Remota
1. Clicar em "Nova Anamnese"
2. Selecionar "Remoto"
3. Customizar perguntas (opcional)
4. Gerar link único
5. Enviar link para cliente
6. Cliente preenche online
7. Profissional recebe notificação

### Cliente Retornando
1. Abrir perfil do cliente
2. Clicar "Nova Anamnese"
3. Quiz abre direto na **etapa 7** (tatuagem)
4. Dados anteriores pré-preenchidos
5. Botão "Alterar Dados Anteriores" disponível
6. Informar apenas nova tatuagem + valor
7. Assinar novamente

## 🔧 Pontos de Atenção

- **Idade mínima**: Quiz bloqueia < 18 anos
- **Formatação de moeda**: Usar `handleValorChange()` em QuizContainer
- **Links únicos**: Expiram em 7 dias e são de uso único
- **Exclusão em cascata**: Ao excluir cliente, todas anamneses são removidas
- **Total de tatuagens**: Sempre igual ao total de anamneses concluídas

## 📄 Último Commit

```
feat: Sistema completo de anamnese com múltiplas melhorias

- Validação de idade mínima (18 anos)
- Campo de valor com formatação automática
- Sistema de totalização (tatuagens + gastos)
- Exclusão de anamneses e clientes
- Smart navigation para clientes retornando
- Histórico mostra dados reais do localStorage
```

## 🎯 Próximos Passos Sugeridos

- [ ] Implementar backend real (substituir localStorage)
- [ ] Sistema de autenticação
- [ ] Multi-usuário (vários profissionais)
- [ ] Backup e exportação de dados
- [ ] Relatórios e estatísticas avançadas
- [ ] Integração com WhatsApp para enviar links
- [ ] Assinatura digital mais robusta
- [ ] Modo offline (PWA)

---

**Última atualização**: 2025-01-09
**Status**: ✅ Sistema funcional e pronto para uso
